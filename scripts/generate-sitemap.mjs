/**
 * Generates dist/sitemap.xml after build.
 * Scans the typed data files for slugs so the sitemap always matches content.
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SITE = process.env.SITE_URL ?? 'https://india-freedom-timeline.pages.dev';

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

const fighters = slugsFrom('src/data/fighters', slugRe);
const events = slugsFrom('src/data/events', slugRe);
const movements = slugsFrom('src/data/movements.ts', slugRe);

const staticRoutes = ['', '/timeline', '/fighters', '/events', '/movements', '/map', '/search', '/learn', '/about'];

const urls = [
  ...staticRoutes,
  ...fighters.map((s) => `/fighters/${s}`),
  ...events.map((s) => `/events/${s}`),
  ...movements.map((s) => `/movements/${s}`),
];

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;

writeFileSync('dist/sitemap.xml', xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
