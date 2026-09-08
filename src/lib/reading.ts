/**
 * Reading-time and claim-level citation helpers. Deliberately import-free:
 * scripts/lib/summaries.ts uses readingMinutes when projecting summaries, and
 * scripts/validate-content.ts uses CITATION_RE to check markers resolve.
 *
 * A citation marker is `[^n]`, n being the 1-based index into the record's
 * own `sources` array. It is written inline in prose, right after the claim
 * it supports.
 */
export const CITATION_RE = /\[\^(\d+)\]/g;

export function wordCount(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** Rounded to whole minutes at a deliberately slow 200 wpm; never under one. */
export function readingMinutes(words: number, wordsPerMinute = 200): number {
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function readingTimeLabel(minutes: number): string {
  return `${minutes} min read`;
}

export type TextSegment = { kind: 'text'; text: string } | { kind: 'cite'; index: number };

export function splitCitations(text: string): TextSegment[] {
  const out: TextSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(CITATION_RE)) {
    const start = m.index ?? 0;
    if (start > last) out.push({ kind: 'text', text: text.slice(last, start) });
    out.push({ kind: 'cite', index: Number(m[1]) });
    last = start + m[0].length;
  }
  if (last < text.length) out.push({ kind: 'text', text: text.slice(last) });
  if (out.length === 0) out.push({ kind: 'text', text });
  return out;
}

export function stripCitations(text: string): string {
  return text.replace(CITATION_RE, '');
}
