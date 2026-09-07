/**
 * Pure matching logic for src/lib/search.ts, deliberately with zero imports
 * from the app's `@/` alias or content layer: scripts/search-check.mjs (a
 * plain tsx script, no Vite) imports this module by relative path to verify
 * named queries without dragging in anything Vite-only.
 *
 * Four tiers, checked in order for each query term against an index entry:
 *   1. Exact substring on the primary field (name/title + aliases), or a
 *      weaker hit on the secondary field (place, summary, role, year...).
 *   2. Transliteration-normalized substring on the primary field — tolerant
 *      of doubled consonants, aspirated clusters (th/bh/dh/ph/sh/kh/gh/ch),
 *      long/short vowels, and the colloquial x/ksh spelling.
 *   3. Bigram Dice similarity (>= 0.6) against any single word of the
 *      primary field — skipped for purely numeric terms, so a year never
 *      fuzzy-matches a nearby year.
 */

export interface IndexEntry {
  kind: 'fighter' | 'event' | 'movement';
  title: string;
  subtitle: string;
  to: string;
  /** Lower-cased: name/title plus alternate names and search aliases. */
  primary: string;
  /** Lower-cased: everything else worth finding a record by. */
  secondary: string;
}

export interface SearchResult {
  kind: IndexEntry['kind'];
  title: string;
  subtitle: string;
  to: string;
  score: number;
  /** False when every matched term only hit via the fuzzy tier (2 or 3) —
      lets the UI show a "did you mean" hint instead of presenting it as a
      confident, exact result. */
  exact: boolean;
}

/** Collapses spelling variance that isn't a genuinely different word:
    doubled letters, aspirated consonant clusters, and the colloquial
    x -> ksh spelling (e.g. "Laxmi" / "Lakshmi"). Not phonetic in general —
    just enough to make the this app's own named cases (Katabomman /
    Kattabomman, laxmibai / Lakshmibai) resolve to the same string. */
export function normalizeTranslit(s: string): string {
  return s
    .toLowerCase()
    .replace(/x/g, 'ksh')
    .replace(/(.)\1+/g, '$1')
    .replace(/(chh|th|bh|dh|ph|sh|kh|gh|ch)/g, (m) => m[0])
    .replace(/[^a-z0-9]/g, '');
}

function bigrams(s: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (let i = 0; i < s.length - 1; i++) {
    const bg = s.slice(i, i + 2);
    counts.set(bg, (counts.get(bg) ?? 0) + 1);
  }
  return counts;
}

/** Sørensen–Dice coefficient over character bigrams, 0..1. */
export function diceCoefficient(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const bgA = bigrams(a);
  const bgB = bigrams(b);
  let intersection = 0;
  for (const [bg, count] of bgA) {
    const other = bgB.get(bg);
    if (other) intersection += Math.min(count, other);
  }
  return (2 * intersection) / (a.length - 1 + (b.length - 1));
}

const NUMERIC = /^\d+$/;

/** Score one query term against one entry, or null if it doesn't match at
    all. `exact` is false when the match only came from tier 2 or 3. */
function scoreTerm(term: string, entry: IndexEntry): { score: number; exact: boolean } | null {
  if (entry.primary.includes(term)) return { score: entry.primary.startsWith(term) ? 12 : 8, exact: true };
  if (entry.secondary.includes(term)) return { score: 3, exact: true };

  if (term.length >= 2) {
    const normTerm = normalizeTranslit(term);
    if (normTerm.length >= 2 && normalizeTranslit(entry.primary).includes(normTerm)) {
      return { score: 6, exact: false };
    }
  }

  if (!NUMERIC.test(term) && term.length >= 3) {
    for (const word of entry.primary.split(/\s+/)) {
      if (word.length >= 3 && diceCoefficient(term, word) >= 0.6) return { score: 4, exact: false };
    }
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* Index construction — structurally typed against the minimal fields
   needed, not against @/types, to keep this module import-free. */

interface FighterLike {
  slug: string;
  name: string;
  alternateNames?: string[];
  searchAliases?: string[];
  birthYear?: number;
  deathYear?: number;
  states: string[];
  birthPlace?: string;
  tags?: string[];
  summary: string;
  roles: string[];
  movements: string[];
}

interface EventLike {
  slug: string;
  title: string;
  searchAliases?: string[];
  dateLabel: string;
  location?: string;
  states?: string[];
  summary: string;
  category: string;
  date: { year: number };
}

interface MovementLike {
  slug: string;
  name: string;
  period: string;
  summary: string;
  startYear: number;
}

export function buildIndex(fighters: FighterLike[], events: EventLike[], movements: MovementLike[]): IndexEntry[] {
  const entries: IndexEntry[] = [];
  for (const f of fighters) {
    entries.push({
      kind: 'fighter',
      title: f.name,
      subtitle: `${f.birthYear ?? '?'}–${f.deathYear ?? '?'} · ${f.states[0] ?? ''}`,
      to: `/fighters/${f.slug}`,
      primary: [f.name, ...(f.alternateNames ?? []), ...(f.searchAliases ?? [])].join(' ').toLowerCase(),
      secondary: [f.birthPlace ?? '', f.states.join(' '), (f.tags ?? []).join(' '), f.summary, f.roles.join(' '), f.movements.join(' '), String(f.birthYear ?? ''), String(f.deathYear ?? '')]
        .join(' ')
        .toLowerCase(),
    });
  }
  for (const e of events) {
    entries.push({
      kind: 'event',
      title: e.title,
      subtitle: e.dateLabel,
      to: `/events/${e.slug}`,
      primary: [e.title, ...(e.searchAliases ?? [])].join(' ').toLowerCase(),
      secondary: [e.location ?? '', (e.states ?? []).join(' '), e.summary, e.category, String(e.date.year)].join(' ').toLowerCase(),
    });
  }
  for (const m of movements) {
    entries.push({
      kind: 'movement',
      title: m.name,
      subtitle: m.period,
      to: `/movements/${m.slug}`,
      primary: m.name.toLowerCase(),
      secondary: [m.summary, String(m.startYear)].join(' ').toLowerCase(),
    });
  }
  return entries;
}

export function searchIndex(index: IndexEntry[], query: string, limit = 20): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const results: SearchResult[] = [];
  for (const entry of index) {
    let score = 0;
    let exact = true;
    let matchedAll = true;
    for (const term of terms) {
      const hit = scoreTerm(term, entry);
      if (!hit) {
        matchedAll = false;
        break;
      }
      score += hit.score;
      exact &&= hit.exact;
    }
    if (matchedAll && score > 0) {
      if (entry.kind === 'fighter') score += 1; // people first on ties
      results.push({ kind: entry.kind, title: entry.title, subtitle: entry.subtitle, to: entry.to, score, exact });
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
