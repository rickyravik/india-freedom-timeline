/**
 * Enumerates every route the site serves, by scanning the typed data files
 * for slugs. Shared by scripts/generate-sitemap.mjs and scripts/prerender.mjs
 * so the two route lists can never drift apart.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function collectFiles(path, out = []) {
  if (statSync(path).isFile()) {
    if (path.endsWith('.ts')) out.push(path);
    return out;
  }
  for (const entry of readdirSync(path)) {
    const p = join(path, entry);
    if (statSync(p).isDirectory()) collectFiles(p, out);
    else if (p.endsWith('.ts')) out.push(p);
  }
  return out;
}

function slugsFrom(path, pattern) {
  const slugs = new Set();
  for (const file of collectFiles(path)) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(pattern)) slugs.add(match[1]);
  }
  return [...slugs];
}

const slugRe = /slug:\s*'([a-z0-9-]+)'/g;

export const staticRoutes = ['', '/timeline', '/fighters', '/events', '/movements', '/map', '/search', '/trails', '/learn', '/glossary', '/about'];

/** Prerendered like any other route, but excluded from the sitemap — it's the
    service worker's offline fallback (src/sw.ts), not indexable content. */
export const prerenderOnlyRoutes = ['/offline'];

/** Every route in the app: static pages plus every fighter/event/movement slug. */
export function getAllRoutes() {
  const fighters = slugsFrom('src/data/fighters', slugRe);
  const events = slugsFrom('src/data/events', slugRe);
  const movements = slugsFrom('src/data/movements.ts', slugRe);
  const trails = slugsFrom('src/data/trails', slugRe);
  return [
    ...staticRoutes,
    ...fighters.map((s) => `/fighters/${s}`),
    ...events.map((s) => `/events/${s}`),
    ...movements.map((s) => `/movements/${s}`),
    ...trails.map((s) => `/trails/${s}`),
  ];
}
