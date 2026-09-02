/**
 * Lightweight client-side global search across fighters, events and
 * movements. No external dependencies; fast enough for thousands of
 * records since the index is built once.
 */
import { fighters, events, movements } from '@/lib/content';

export interface SearchResult {
  kind: 'fighter' | 'event' | 'movement';
  title: string;
  subtitle: string;
  to: string;
  score: number;
}

interface IndexEntry extends Omit<SearchResult, 'score'> {
  /** Lower-cased searchable text fields, in priority order. */
  primary: string;
  secondary: string;
}

let index: IndexEntry[] | null = null;

function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = [];
  for (const f of fighters) {
    entries.push({
      kind: 'fighter',
      title: f.name,
      subtitle: `${f.birthYear ?? '?'}–${f.deathYear ?? '?'} · ${f.states[0] ?? ''}`,
      to: `/fighters/${f.slug}`,
      primary: [f.name, ...(f.alternateNames ?? [])].join(' ').toLowerCase(),
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
      primary: e.title.toLowerCase(),
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

export function search(query: string, limit = 20): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  index ??= buildIndex();
  const terms = q.split(/\s+/).filter(Boolean);

  const results: SearchResult[] = [];
  for (const entry of index) {
    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      if (entry.primary.includes(term)) {
        score += entry.primary.startsWith(term) ? 12 : 8;
      } else if (entry.secondary.includes(term)) {
        score += 3;
      } else {
        matchedAll = false;
        break;
      }
    }
    if (matchedAll && score > 0) {
      if (entry.kind === 'fighter') score += 1; // people first on ties
      results.push({ kind: entry.kind, title: entry.title, subtitle: entry.subtitle, to: entry.to, score });
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
