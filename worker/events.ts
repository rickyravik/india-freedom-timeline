/**
 * POST /api/event — counts coarse, allow-listed pilot events in a Cloudflare
 * Analytics Engine dataset. No free text, no identifiers: a name plus up to
 * three short key=value props. See src/lib/analytics.ts for the client side.
 */
import { isEventName } from '../src/lib/event-names';

export interface EventsEnv {
  EVENTS?: AnalyticsEngineDataset;
}

export async function handleEvent(request: Request, env: EventsEnv): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (typeof body !== 'object' || body === null) return new Response(null, { status: 400 });
  const { name, props } = body as { name?: unknown; props?: unknown };
  if (!isEventName(name)) return new Response(null, { status: 400 });
  const p = typeof props === 'object' && props !== null ? (props as Record<string, unknown>) : {};
  const blobs = [name, ...Object.entries(p).slice(0, 3).map(([k, v]) => `${k}=${String(v).slice(0, 40)}`)];
  env.EVENTS?.writeDataPoint({ blobs, doubles: [1], indexes: [name] });
  return new Response(null, { status: 204 });
}
