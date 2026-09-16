/**
 * Marks the first occurrence of each glossary term across a sequence of
 * paragraphs, so a page explains "satyagraha" once, where it first appears,
 * and not on every line. Pure and deterministic - the same input produces
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

/**
 * Splits the plain-text portions of already-glossed segments further,
 * marking the first mention of each event linked to the record being read
 * (a fighter's own `timelineEvents`, resolved bidirectionally) by its title
 * or a search alias. A biography that says "the Jallianwala Bagh massacre"
 * or just "Jallianwala Bagh" gets that phrase turned into the same kind of
 * inline reference a glossary term gets, without a single word of the
 * biography needing to change - the reader who already knows what the
 * phrase means never notices, and the reader who doesn't gets the
 * event's own summary and a link to the full page, right where the
 * question arose. Never re-annotates a `term` segment, so a glossary
 * term and an event reference can't collide over the same words.
 * Scoped deliberately to one record's own linked events, not the whole
 * site's events, so a generic-sounding alias can't misfire on an
 * unrelated page.
 */
export type ReadingSegment = GlossSegment | { kind: 'event'; text: string; eventId: string };

export interface EventLike {
  id: string;
  title: string;
  searchAliases?: string[];
}

export function annotateEventMentions(paragraphs: GlossSegment[][], events: EventLike[]): ReadingSegment[][] {
  if (events.length === 0) return paragraphs;
  const variants = events.flatMap((e) => [e.title, ...(e.searchAliases ?? [])].map((v) => ({ v, id: e.id })));
  variants.sort((a, b) => b.v.length - a.v.length);
  const byLower = new Map(variants.map(({ v, id }) => [v.toLowerCase(), id]));
  const re = new RegExp(`\\b(${variants.map(({ v }) => escapeRe(v)).join('|')})\\b`, 'gi');
  const used = new Set<string>();

  return paragraphs.map((segs) =>
    segs.flatMap((seg): ReadingSegment[] => {
      if (seg.kind !== 'text') return [seg];
      const out: ReadingSegment[] = [];
      let last = 0;
      for (const m of seg.text.matchAll(re)) {
        const id = byLower.get(m[1].toLowerCase());
        if (!id || used.has(id)) continue;
        used.add(id);
        const start = m.index ?? 0;
        if (start > last) out.push({ kind: 'text', text: seg.text.slice(last, start) });
        out.push({ kind: 'event', text: m[1], eventId: id });
        last = start + m[1].length;
      }
      if (last < seg.text.length) out.push({ kind: 'text', text: seg.text.slice(last) });
      if (out.length === 0) out.push({ kind: 'text', text: seg.text });
      return out;
    }),
  );
}
