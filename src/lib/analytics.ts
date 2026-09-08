/**
 * Privacy-friendly analytics. In dev, every track() logs to the console. In
 * production, only the allow-listed pilot events (src/lib/event-names.ts) are
 * sent — as a fire-and-forget beacon to POST /api/event (worker/events.ts) —
 * and only when VITE_EVENTS=on at build time. Never during prerendering.
 * Every call site passes coarse shape (a slug, a count, a bucket), never
 * free text or anything a visitor typed.
 */
import { isEventName } from '@/lib/event-names';

const enabled = import.meta.env.VITE_EVENTS === 'on';

export function track(event: string, props?: Record<string, string | number | boolean>): void {
  if (import.meta.env.DEV) {
    console.debug('[analytics]', event, props ?? {});
    return;
  }
  if (!enabled || window.__PRERENDERING__ || !isEventName(event)) return;
  try {
    navigator.sendBeacon('/api/event', new Blob([JSON.stringify({ name: event, props: props ?? {} })], { type: 'application/json' }));
  } catch {
    /* never let counting break reading */
  }
}

/** "0", "1-3", "4-8", "9-20", "21+" — never the actual length or content. */
export function lengthBucket(n: number): string {
  if (n <= 0) return '0';
  if (n <= 3) return '1-3';
  if (n <= 8) return '4-8';
  if (n <= 20) return '9-20';
  return '21+';
}
