/**
 * Verifies the fuzzy/transliteration-tolerant search tiers (search-core.ts)
 * against real content: a set of named queries that should resolve to a
 * specific record despite a spelling variant, and a rough performance
 * budget. Run via `npm run search:check` (also a CI step) — separate from
 * validate-content.ts since this checks search *behaviour*, not content
 * correctness.
 *
 * Imports search-core.ts and the generated summaries by relative path, not
 * the `@/` alias or src/lib/content.ts: this is a plain tsx script, and
 * content.ts pulls in the full data layer, most of which doesn't matter
 * here and isn't guaranteed alias-resolvable outside Vite.
 */
import { buildIndex, searchIndex } from '../src/lib/search-core.ts';
import { fighterSummaries } from '../src/data/generated/fighters.summary.ts';
import { eventSummaries } from '../src/data/generated/events.summary.ts';
import { movements } from '../src/data/movements.ts';

const index = buildIndex(fighterSummaries, eventSummaries, movements);

interface Case {
  query: string;
  expectSlugIncludes: string;
}

// Each covers a real spelling variant a visitor might type — doubled
// consonants, the colloquial x/ksh spelling, or a curated searchAlias.
const cases: Case[] = [
  { query: 'Katabomman', expectSlugIncludes: 'kattabomman' },
  { query: 'laxmibai', expectSlugIncludes: 'lakshmibai' },
  { query: 'Amritsar Massacre', expectSlugIncludes: 'jallianwala-bagh' },
  { query: 'August Kranti', expectSlugIncludes: 'quit-india-launch' },
  { query: 'Bhagat Singh', expectSlugIncludes: 'bhagat-singh' }, // exact match still wins
  { query: '1930', expectSlugIncludes: '' }, // years must never fuzzy-match each other into nonsense
];

let failed = false;
let totalMs = 0;

for (const { query, expectSlugIncludes } of cases) {
  const start = performance.now();
  const results = searchIndex(index, query, 5);
  totalMs += performance.now() - start;

  if (expectSlugIncludes === '') {
    console.log(`  "${query}" -> ${results.length} result(s), top: ${results[0]?.to ?? '(none)'}`);
    continue;
  }

  const top = results[0];
  const ok = top?.to.includes(expectSlugIncludes);
  console.log(`${ok ? 'ok  ' : 'FAIL'} "${query}" -> ${top?.to ?? '(no results)'} (expected to include "${expectSlugIncludes}")`);
  if (!ok) failed = true;
}

const avgMs = totalMs / cases.length;
console.log(`\nAverage: ${avgMs.toFixed(3)}ms/query over ${index.length} indexed records.`);
if (avgMs > 5) {
  console.error(`FAIL: average query time ${avgMs.toFixed(3)}ms exceeds the 5ms budget.`);
  failed = true;
}

if (failed) process.exit(1);
console.log('\nAll search checks passed.');
