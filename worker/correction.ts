/**
 * POST /api/correction — opens a GitHub issue for a reader-submitted
 * correction. See worker/index.ts for routing.
 */
export interface CorrectionEnv {
  /** wrangler secret put GITHUB_TOKEN (or .dev.vars locally). Absent in an
      environment that hasn't provisioned one yet — the endpoint reports
      that plainly rather than pretending to succeed. */
  GITHUB_TOKEN?: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  /** Optional: wrangler kv namespace create RATE_LIMIT_KV, then uncomment
      the kv_namespaces block in wrangler.jsonc. Rate limiting is skipped
      gracefully when unbound. */
  RATE_LIMIT_KV?: KVNamespace;
}

interface CorrectionPayload {
  /** The page the correction concerns, e.g. "/fighters/bhagat-singh". */
  path: string;
  recordTitle: string;
  claim: string;
  correction: string;
  sourceUrl?: string;
  email?: string;
  /** Honeypot — a real visitor never sees or fills this field (see
      SuggestCorrection in src/components/ui.tsx). */
  website?: string;
}

function isCorrectionPayload(body: unknown): body is CorrectionPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  const optionalString = (v: unknown) => v === undefined || typeof v === 'string';
  return (
    typeof b.path === 'string' &&
    b.path.startsWith('/') &&
    typeof b.recordTitle === 'string' &&
    b.recordTitle.length > 0 &&
    b.recordTitle.length <= 200 &&
    typeof b.claim === 'string' &&
    b.claim.length > 0 &&
    b.claim.length <= 2000 &&
    typeof b.correction === 'string' &&
    b.correction.length > 0 &&
    b.correction.length <= 2000 &&
    optionalString(b.sourceUrl) &&
    optionalString(b.email) &&
    optionalString(b.website)
  );
}

function countLinks(text: string): number {
  return (text.match(/https?:\/\//g) ?? []).length;
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export async function handleCorrection(request: Request, env: CorrectionEnv): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }
  if (!isCorrectionPayload(body)) return json({ error: 'Invalid payload' }, 400);

  // A real visitor never fills this field — fake success, never call GitHub.
  if (body.website) return json({ ok: true }, 200);

  const linkCount = countLinks(body.claim) + countLinks(body.correction) + (body.sourceUrl ? 1 : 0);
  if (linkCount > 3) return json({ error: 'Too many links' }, 400);

  if (env.RATE_LIMIT_KV) {
    const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
    const key = `correction:${ip}`;
    if (await env.RATE_LIMIT_KV.get(key)) return json({ error: 'Too many requests — try again in a minute' }, 429);
    await env.RATE_LIMIT_KV.put(key, '1', { expirationTtl: 60 });
  }

  if (!env.GITHUB_TOKEN) return json({ error: 'Correction intake is not configured yet' }, 503);

  const title = `Correction: ${body.recordTitle}`;
  const issueBody = [
    `**Page:** ${body.path}`,
    `**Claimed issue:** ${body.claim}`,
    `**Suggested correction:** ${body.correction}`,
    body.sourceUrl && `**Source:** ${body.sourceUrl}`,
    body.email && `**Contact:** ${body.email}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  const ghResponse = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'india-freedom-timeline-correction-worker',
    },
    body: JSON.stringify({ title, body: issueBody, labels: ['correction'] }),
  });

  if (!ghResponse.ok) {
    console.error('GitHub issue creation failed', ghResponse.status, await ghResponse.text());
    return json({ error: 'Failed to open an issue' }, 502);
  }
  return json({ ok: true }, 200);
}
