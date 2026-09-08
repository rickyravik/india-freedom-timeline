/**
 * Where a reader is in each trail, on this device only. No account, no
 * server, no streaks: a stop index, a completed flag and a timestamp so the
 * trails index can offer "Resume". Same store idiom as bookmarks.
 */
export interface TrailProgress {
  stop: number;
  completed: boolean;
  updatedAt: string;
}
export type ProgressMap = Record<string, TrailProgress>;

export const TRAILS_PROGRESS_KEY = 'ift-trails-v1';

export function parseProgress(raw: string | null): ProgressMap {
  let parsed: unknown = {};
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
  if (typeof parsed !== 'object' || parsed === null) return {};
  const out: ProgressMap = {};
  for (const [slug, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof value !== 'object' || value === null) continue;
    const v = value as Record<string, unknown>;
    if (typeof v.stop === 'number' && typeof v.completed === 'boolean' && typeof v.updatedAt === 'string') {
      out[slug] = { stop: v.stop, completed: v.completed, updatedAt: v.updatedAt };
    }
  }
  return out;
}

const listeners = new Set<() => void>();
let cache: ProgressMap | null = null;
export const EMPTY_PROGRESS: ProgressMap = {};

export function readProgress(): ProgressMap {
  if (cache) return cache;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(TRAILS_PROGRESS_KEY);
  } catch {
    /* in-memory only */
  }
  cache = parseProgress(raw);
  return cache;
}

function write(next: ProgressMap) {
  cache = next;
  try {
    localStorage.setItem(TRAILS_PROGRESS_KEY, JSON.stringify(next));
  } catch {
    /* in-memory only */
  }
  listeners.forEach((l) => l());
}

export function setStop(slug: string, stop: number) {
  const current = readProgress()[slug];
  write({ ...readProgress(), [slug]: { stop, completed: current?.completed ?? false, updatedAt: new Date().toISOString() } });
}

export function markComplete(slug: string) {
  const current = readProgress()[slug];
  write({ ...readProgress(), [slug]: { stop: current?.stop ?? 0, completed: true, updatedAt: new Date().toISOString() } });
}

export function clearProgress(slug: string) {
  const next = { ...readProgress() };
  delete next[slug];
  write(next);
}

export function subscribeProgress(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
