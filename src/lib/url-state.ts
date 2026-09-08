/**
 * Pure query-string codecs for filter and view state, so a filtered list,
 * a selected map state or a reading view can be reloaded and shared. The
 * React side is `useUrlState` in src/lib/hooks.ts; this module has no React
 * so it can be unit-tested directly.
 *
 * A codec's `serialize` returns null for the default state, which removes the
 * key from the URL — a clean URL always means "defaults".
 */
export interface ParamCodec<T> {
  parse(raw: string | null): T;
  serialize(value: T): string | null;
}

export type Schema = Record<string, ParamCodec<unknown>>;

export type StateOf<S extends Schema> = {
  [K in keyof S]: S[K] extends ParamCodec<infer T> ? T : never;
};

export function parseParams<S extends Schema>(schema: S, params: URLSearchParams): StateOf<S> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(schema)) out[key] = schema[key].parse(params.get(key));
  return out as StateOf<S>;
}

/** Writes the schema's keys into a copy of `current`, leaving other keys alone. */
export function serializeParams<S extends Schema>(schema: S, state: StateOf<S>, current: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(current);
  for (const key of Object.keys(schema)) {
    const value = (schema[key] as ParamCodec<unknown>).serialize(state[key]);
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
  }
  return next;
}

/** One of a fixed set, or null (the "All" state). */
export function oneOf<T extends string>(allowed: readonly T[]): ParamCodec<T | null> {
  return {
    parse: (raw) => (raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : null),
    serialize: (value) => value,
  };
}

/** One of a fixed set with a non-null default that is never written to the URL. */
export function oneOfDefault<T extends string>(allowed: readonly T[], fallback: T): ParamCodec<T> {
  return {
    parse: (raw) => (raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback),
    serialize: (value) => (value === fallback ? null : value),
  };
}

/** Free text; blank is the default. */
export function text(): ParamCodec<string> {
  return {
    parse: (raw) => raw ?? '',
    serialize: (value) => (value.trim() ? value : null),
  };
}

/** A switch; "1" means on, absent means off. */
export function flag(): ParamCodec<boolean> {
  return {
    parse: (raw) => raw === '1',
    serialize: (value) => (value ? '1' : null),
  };
}
