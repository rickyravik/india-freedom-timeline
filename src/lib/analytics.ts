/**
 * Privacy-friendly analytics. Cloudflare Web Analytics (the beacon
 * vite.config.ts injects into index.html at build time, only when
 * VITE_CF_BEACON_TOKEN is set) has no custom-event API today, so track()
 * is an honest no-op in production — it exists so call sites don't need to
 * change if that ever becomes possible. In dev it logs to the console
 * instead, so instrumentation can be verified without a deployed beacon.
 *
 * Every call site passes only coarse, non-identifying shape — a length
 * bucket, a filter's name (never its value), a boolean — never free text,
 * a search query, or anything else a visitor typed.
 */
const configured = Boolean(import.meta.env.VITE_CF_BEACON_TOKEN);

export function track(event: string, props?: Record<string, string | number | boolean>): void {
  if (import.meta.env.DEV) {
    console.debug('[analytics]', event, props ?? {});
    return;
  }
  if (!configured) return;
  // No-op: Cloudflare Web Analytics doesn't expose a custom-event API yet.
}

/** "0", "1-3", "4-8", "9-20", "21+" — never the actual length or content. */
export function lengthBucket(n: number): string {
  if (n <= 0) return '0';
  if (n <= 3) return '1-3';
  if (n <= 8) return '4-8';
  if (n <= 20) return '9-20';
  return '21+';
}
