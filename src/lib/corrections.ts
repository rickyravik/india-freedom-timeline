/**
 * Where a correction goes when POST /api/correction (worker/correction.ts)
 * can't be reached. The inbox comes from .env; without one, the best fallback
 * a static site has is a pre-filled GitHub issue, which is labelled as
 * needing an account rather than presented as the normal route.
 */
export const CORRECTIONS_EMAIL = ((import.meta.env.VITE_CORRECTIONS_EMAIL as string | undefined) ?? '').trim();
export const REPO_ISSUES_URL = 'https://github.com/rickyravik/india-freedom-timeline/issues/new';

export interface CorrectionDraft {
  path: string;
  recordTitle: string;
  claim: string;
  correction: string;
  sourceUrl?: string;
}

export function correctionBody(d: CorrectionDraft): string {
  return `Page: ${d.path}\n\nWhat's wrong:\n${d.claim}\n\nSuggested correction:\n${d.correction}${d.sourceUrl ? `\n\nSource:\n${d.sourceUrl}` : ''}`;
}

export function fallbackLink(d: CorrectionDraft, email: string = CORRECTIONS_EMAIL): { kind: 'email' | 'issue'; href: string; label: string } {
  const subject = encodeURIComponent(`Correction: ${d.recordTitle}`);
  const body = encodeURIComponent(correctionBody(d));
  if (email) return { kind: 'email', href: `mailto:${email}?subject=${subject}&body=${body}`, label: `email ${email}` };
  return { kind: 'issue', href: `${REPO_ISSUES_URL}?title=${subject}&body=${body}`, label: 'open a pre-filled issue on GitHub (needs a GitHub account)' };
}
