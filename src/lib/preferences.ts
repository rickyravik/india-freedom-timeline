/**
 * Reading preferences, kept on the device. Same pub-sub + useSyncExternalStore
 * idiom as bookmarks (src/lib/hooks.ts). Mirrored onto <html data-*> so CSS
 * can act on them, and applied before first paint by the inline script in
 * index.html (which reads the same key) so text size never flashes.
 */
export type TextSize = 'default' | 'large' | 'larger';
export type ReadingMode = 'story' | 'detail';
export type MotionPref = 'system' | 'reduce';

export interface Preferences {
  textSize: TextSize;
  readingMode: ReadingMode;
  motion: MotionPref;
  lowData: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = { textSize: 'default', readingMode: 'story', motion: 'system', lowData: false };
export const PREFERENCES_KEY = 'ift-prefs-v1';

export function parsePreferences(raw: string | null): Preferences {
  let p: Record<string, unknown> = {};
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (typeof parsed === 'object' && parsed !== null) p = parsed as Record<string, unknown>;
  } catch {
    /* defaults */
  }
  return {
    textSize: p.textSize === 'large' || p.textSize === 'larger' ? p.textSize : 'default',
    readingMode: p.readingMode === 'detail' ? 'detail' : 'story',
    motion: p.motion === 'reduce' ? 'reduce' : 'system',
    lowData: p.lowData === true,
  };
}

const listeners = new Set<() => void>();
let cache: Preferences | null = null;

export function readPreferences(): Preferences {
  if (cache) return cache;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(PREFERENCES_KEY);
  } catch {
    /* in-memory only */
  }
  cache = parsePreferences(raw);
  return cache;
}

export function applyPreferencesToDocument(p: Preferences) {
  const d = document.documentElement.dataset;
  d.textSize = p.textSize;
  d.motion = p.motion;
  d.lowData = p.lowData ? 'true' : 'false';
}

export function writePreferences(patch: Partial<Preferences>) {
  cache = { ...readPreferences(), ...patch };
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(cache));
  } catch {
    /* in-memory only */
  }
  applyPreferencesToDocument(cache);
  listeners.forEach((l) => l());
}

export function subscribePreferences(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
