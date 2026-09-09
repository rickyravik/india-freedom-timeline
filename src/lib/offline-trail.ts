import type { Trail, TrailRef } from '@/types';

export interface TrailUrlResolver {
  fighterSlug(id: string): string | undefined;
  eventSlug(id: string): string | undefined;
  portrait(id: string): string | undefined;
}

/** Every page and portrait a trail needs to read offline: the overview,
    every stop, finish, then each stop's focus/also fighter and event
    pages (and portraits, where one exists) — each URL once. */
export function trailUrls(trail: Trail, resolve: TrailUrlResolver): string[] {
  const urls: string[] = [`/trails/${trail.slug}`];
  for (let i = 0; i < trail.stops.length; i++) urls.push(`/trails/${trail.slug}/stop/${i + 1}`);
  urls.push(`/trails/${trail.slug}/finish`);

  const seen = new Set(urls);
  const add = (url: string | undefined) => {
    if (url && !seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  };
  const addRef = (ref: TrailRef) => {
    if (ref.kind === 'fighter') {
      const slug = resolve.fighterSlug(ref.id);
      if (slug) {
        add(`/fighters/${slug}`);
        add(resolve.portrait(ref.id));
      }
    } else if (ref.kind === 'event') {
      const slug = resolve.eventSlug(ref.id);
      if (slug) add(`/events/${slug}`);
    }
  };

  for (const stop of trail.stops) {
    addRef(stop.focus);
    for (const r of stop.also ?? []) addRef(r);
  }

  return urls;
}

const PAGE_BYTES = 60 * 1024;
const PORTRAIT_BYTES = 45 * 1024;

/** A rough, deliberately labelled estimate — never a promise of exact size. */
export function estimateBytes(urls: string[]): number {
  return urls.reduce((sum, url) => sum + (url.startsWith('/images/') ? PORTRAIT_BYTES : PAGE_BYTES), 0);
}

export function formatBytes(n: number): string {
  if (n >= 1024 * 1024) return `about ${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `about ${Math.round(n / 1024)} KB`;
}
