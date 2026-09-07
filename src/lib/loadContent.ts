/**
 * Loads a fighter's or event's FULL record (biography, quotes, sources,
 * Story Mode...) on demand — only their own summary (src/lib/content.ts)
 * ships with the initial bundle. Used by FighterProfilePage/EventPage.
 */
import type { FreedomFighter, HistoricalEvent } from '@/types';
import { fighterSourceFile } from '@/data/generated/fighters.summary';
import { eventSourceFile } from '@/data/generated/events.summary';

// Excludes index.ts explicitly: without that, the barrel file would also
// match this glob and become its own lazy chunk that re-imports every
// other shard, silently defeating the split.
const fighterModules = import.meta.glob<Record<string, unknown>>(['../data/fighters/*.ts', '!../data/fighters/index.ts']);
const eventModules = import.meta.glob<Record<string, unknown>>(['../data/events/*.ts', '!../data/events/index.ts']);

const fighterCache = new Map<string, FreedomFighter>();
const eventCache = new Map<string, HistoricalEvent>();

function firstArrayExport<T>(mod: Record<string, unknown>): T[] | undefined {
  return Object.values(mod).find((v): v is T[] => Array.isArray(v));
}

/** Synchronous cache read, no fetch triggered — used as a lazy useState
    initializer so a record prefetched before hydration (see routeTable's
    `preload` in src/lib/routes.tsx) is available on the very first render,
    instead of only after that record's own loading effect resolves. */
export function peekFighter(slug: string): FreedomFighter | undefined {
  return fighterCache.get(slug);
}
export function peekEvent(slug: string): HistoricalEvent | undefined {
  return eventCache.get(slug);
}

export async function loadFighter(slug: string): Promise<FreedomFighter | undefined> {
  const cached = fighterCache.get(slug);
  if (cached) return cached;
  const file = fighterSourceFile[slug];
  const loader = file && fighterModules[`../data/fighters/${file}.ts`];
  if (!loader) return undefined;
  const mod = await loader();
  const full = firstArrayExport<FreedomFighter>(mod)?.find((f) => f.slug === slug);
  if (full) fighterCache.set(slug, full);
  return full;
}

export async function loadEvent(slug: string): Promise<HistoricalEvent | undefined> {
  const cached = eventCache.get(slug);
  if (cached) return cached;
  const file = eventSourceFile[slug];
  const loader = file && eventModules[`../data/events/${file}.ts`];
  if (!loader) return undefined;
  const mod = await loader();
  const full = firstArrayExport<HistoricalEvent>(mod)?.find((e) => e.slug === slug);
  if (full) eventCache.set(slug, full);
  return full;
}
