/**
 * Marks the first occurrence of each glossary term across a sequence of
 * paragraphs, so a page explains "satyagraha" once, where it first appears,
 * and not on every line. Pure and deterministic — the same input produces
 * the same segments at build time and at hydration.
 */
export interface GlossaryLike {
  id: string;
  term: string;
  aliases?: string[];
}

export type GlossSegment = { kind: 'text'; text: string } | { kind: 'term'; text: string; termId: string };

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function annotateFirstOccurrences(texts: string[], terms: GlossaryLike[]): GlossSegment[][] {
  const variants = terms.flatMap((t) => [t.term, ...(t.aliases ?? [])].map((v) => ({ v, id: t.id })));
  if (variants.length === 0) return texts.map((text) => [{ kind: 'text', text }]);
  /* Longest first so "East India Company" wins over "India" at the same spot. */
  variants.sort((a, b) => b.v.length - a.v.length);
  const byLower = new Map(variants.map(({ v, id }) => [v.toLowerCase(), id]));
  const re = new RegExp(`\\b(${variants.map(({ v }) => escapeRe(v)).join('|')})\\b`, 'gi');
  const used = new Set<string>();

  return texts.map((text) => {
    const segs: GlossSegment[] = [];
    let last = 0;
    for (const m of text.matchAll(re)) {
      const id = byLower.get(m[1].toLowerCase());
      if (!id || used.has(id)) continue;
      used.add(id);
      const start = m.index ?? 0;
      if (start > last) segs.push({ kind: 'text', text: text.slice(last, start) });
      segs.push({ kind: 'term', text: m[1], termId: id });
      last = start + m[1].length;
    }
    if (last < text.length) segs.push({ kind: 'text', text: text.slice(last) });
    if (segs.length === 0) segs.push({ kind: 'text', text });
    return segs;
  });
}
