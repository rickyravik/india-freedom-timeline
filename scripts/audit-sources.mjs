/**
 * Source-link audit. Bundles the typed content with esbuild so every
 * SourceRef is read from the real data rather than scraped with a regex,
 * then reports which citations carry a URL and which do not.
 *
 * Usage: node scripts/audit-sources.mjs [--json]
 */
import { build } from 'esbuild';
import { readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = join(tmpdir(), `ift-sources-${Date.now()}.mjs`);

const entry = `
  export { fighters } from './src/data/fighters/index.ts';
  export { events } from './src/data/events/index.ts';
  export { movements } from './src/data/movements.ts';
`;

await build({
  stdin: { contents: entry, resolveDir: process.cwd(), loader: 'ts' },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: out,
  logLevel: 'silent',
  alias: { '@': join(process.cwd(), 'src') },
});

const { fighters, events, movements } = await import(pathToFileURL(out).href);
rmSync(out, { force: true });

const rows = [];
const collect = (kind, slug, name, sources = []) => {
  for (const s of sources) rows.push({ kind, slug, name, ...s });
};
for (const f of fighters) collect('fighter', f.slug, f.name, f.sources);
for (const e of events) collect('event', e.slug, e.title, e.sources);
for (const m of movements) collect('movement', m.slug, m.name, m.sources);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  const linked = rows.filter((r) => r.url);
  const byType = {};
  for (const r of rows) {
    byType[r.type] ??= { total: 0, linked: 0 };
    byType[r.type].total++;
    if (r.url) byType[r.type].linked++;
  }
  console.log(`citations: ${rows.length}   linked: ${linked.length} (${Math.round((linked.length / rows.length) * 100)}%)`);
  for (const [t, v] of Object.entries(byType).sort((a, b) => b[1].total - a[1].total)) {
    console.log(`  ${t.padEnd(11)} ${String(v.total).padStart(3)} total  ${String(v.linked).padStart(3)} linked`);
  }
}
