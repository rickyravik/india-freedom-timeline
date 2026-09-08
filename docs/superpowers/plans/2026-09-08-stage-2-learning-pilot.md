# Stage 2 — Learning Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Read `2026-09-08-improvement-roadmap.md` first; Stage 1 must be complete (this plan uses `useUrlState`, `ActiveFilters`, `ScrollManager`, `shortName`, `vitest`).

**Goal:** Give a first-time reader a route in and a reason to stay: a "Start exploring" entry, three curated trails, biographies that show their evidence and explain their terms, reading preferences that persist, typed connections between people, a quiz that teaches rather than tests, and coarse event counting so the pilot can be measured.

**Architecture:** Content model grows by optional, validated fields (`connections`, `inAMinute`, `editorial`, claim markers `[^n]`, source precision, movement structure). New typed collections: `glossary`, `trails`, `compare-pairs`. New pure libraries with unit tests: `reading.ts` (word counts, reading time, citation splitting), `glossary.ts` (first-occurrence annotation), `preferences.ts` and `trails-progress.ts` (localStorage stores in the existing `useSyncExternalStore` idiom). New components live in `src/components/reading.tsx` (reading text, citations, glossary popovers, toolbar) and `src/components/trails.tsx`. New pages: `/start`, `/glossary`, `/trails`, `/trails/:slug`, `/trails/:slug/stop/:n`, `/trails/:slug/finish`. Pilot events go through a small Worker route to Cloudflare Analytics Engine.

**Tech Stack:** Existing stack; no new runtime dependencies.

## Global Constraints

See the roadmap. Specific to this stage:

- Every piece of historical prose written in this stage is **drafted from statements already in the sourced records** (their `summary`, `shortStory`, `fullBiography`, `description`, `disputed`) and carries `editorial.status: 'draft'`. Drafts render with a visible "Draft — under editorial review" stamp. The owner flips them to `reviewed`.
- Citation markers are `[^n]`, 1-based into the record's own `sources`. The validator fails the build on an out-of-range marker.
- Uncertainty must survive summarisation: where a record has a `disputed` note, the quick story's chapter or the trail stop that touches that claim carries `uncertainty`.
- Popovers (citations, glossary) are closed in the prerendered snapshot; opening one never moves the reading position (they are absolutely positioned, dismiss on Escape and outside click, and return focus to their trigger).
- No timers, no drag-only interactions, no points tied to deaths or imprisonment.
- Text inputs in learning activities are never stored or transmitted (reflection prompts have no textarea).

## File structure

| File | Responsibility |
|---|---|
| `src/types/index.ts` | New optional fields and collection types (`Editorial`, `Connection`, `GlossaryTerm`, `Trail`, `TrailStop`, `TrailActivity`, `ComparePair`, quiz `topic`/`difficulty`) |
| `scripts/validate-content.ts` | Schemas + cross-checks for everything above, citation markers, draft warnings |
| `scripts/lib/summaries.ts` | `readingMinutes`, `inAMinute`, `pronunciation`, `connections` count in the summary projection |
| `src/lib/reading.ts` (new) | `wordCount`, `readingMinutes`, `readingTimeLabel`, `splitCitations`, `stripCitations` |
| `src/lib/glossary.ts` (new) | `annotateFirstOccurrences` |
| `src/lib/preferences.ts` (new) | Preferences store (`textSize`, `readingMode`, `motion`, `lowData`) |
| `src/lib/trails-progress.ts` (new) | Per-device trail progress store |
| `src/lib/event-names.ts` (new) | Allow-listed pilot event names (shared with the Worker) |
| `src/lib/analytics.ts` | `track()` sends allow-listed events via `sendBeacon` when enabled |
| `src/lib/content.ts` | `connectionsFor`, `similarFor`, `trails`, `trailBySlug`, `glossaryTerms` |
| `src/components/reading.tsx` (new) | `ReadingText`, `CitationMarker`, `GlossButton`, `Popover`, `ReadingToolbar`, `DraftStamp` |
| `src/components/trails.tsx` (new) | `TrailCard`, `TrailProgress`, `ChoiceActivity`, `OrderActivity` |
| `src/components/ui.tsx` | `Breadcrumbs`, `SourceList` anchors + evidence stamps |
| `src/components/constellation.tsx` | Typed connections with labels and legend |
| `src/components/layout.tsx` | New navigation (desktop + 4-item phone bar with Explore sheet) |
| `src/pages/StartPage.tsx`, `GlossaryPage.tsx`, `TrailPages.tsx` (new) | New routes |
| `src/pages/HomePage.tsx`, `FighterProfilePage.tsx`, `MovementsPage.tsx`, `LearnPage.tsx`, `EventPage.tsx` | Reworked |
| `src/data/glossary.ts`, `src/data/trails/*.ts`, `src/data/compare-pairs.ts` (new) | Content |
| `worker/events.ts` (new), `worker/index.ts`, `wrangler.jsonc` | Pilot event endpoint |
| `index.html`, `src/index.css` | Pre-paint preference script; text-size and motion attributes |

---

### Task 1: Content model additions and validation

**Files:**
- Modify: `src/types/index.ts`
- Modify: `scripts/validate-content.ts`
- Modify: `scripts/lib/summaries.ts`
- Modify: `docs/templates/fighter.template.ts`, `docs/templates/event.template.ts`, `CONTRIBUTING.md`
- Create: `src/lib/reading.ts`, `src/lib/reading.test.ts`

**Interfaces:**
- Produces (types):
  ```ts
  export type EvidenceKind = 'contemporary' | 'scholarship' | 'oral-tradition' | 'reference';
  export interface SourceRef { /* existing */ evidence?: EvidenceKind; pages?: string; archiveId?: string; edition?: string; accessed?: string }
  export type EditorialStatus = 'draft' | 'reviewed';
  export interface Editorial { status: EditorialStatus; reviewedBy?: string; reviewedOn?: string; notes?: string }
  export type ConnectionType = 'ally' | 'opponent' | 'family' | 'mentor' | 'inspired' | 'successor';
  export interface Connection { id: string; type: ConnectionType; note: string }
  export interface PortraitNote { kind: 'photograph' | 'painting' | 'statue' | 'stamp' | 'illustration' | 'other'; caption: string; credit?: string; created?: string }
  // FreedomFighter +: pronunciation?, inAMinute?: [string, string, string], portraitNote?, connections?, contentNote?, editorial?
  // DisputedNote +: paragraph?: number   StoryChapter +: uncertainty?: string
  // FighterSummary +: pronunciation?, inAMinute?, readingMinutes: number, connectionCount: number
  // HistoricalEvent +: consequences?: { eventId: string; note: string }[], editorial?
  // Movement +: aims?: string[], methods?: string[], reach?: string, participants?: string, disagreements?: string[], outcomes?: string[], editorial?
  // QuizQuestion +: topic: QuizTopic ('people' | 'events' | 'movements' | 'places'), difficulty: 1 | 2 | 3, whyItMatters?: string
  ```
- Produces (`src/lib/reading.ts`, import-free so scripts can use it):
  ```ts
  export function wordCount(text: string): number;
  export function readingMinutes(words: number, wordsPerMinute?: number): number; // >= 1
  export function readingTimeLabel(minutes: number): string;                     // "4 min read"
  export type TextSegment = { kind: 'text'; text: string } | { kind: 'cite'; index: number }; // index is 1-based
  export function splitCitations(text: string): TextSegment[];
  export function stripCitations(text: string): string;
  export const CITATION_RE: RegExp; // /\[\^(\d+)\]/g
  ```

- [ ] **Step 1: Failing unit tests for `reading.ts`**

Create `src/lib/reading.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { readingMinutes, readingTimeLabel, splitCitations, stripCitations, wordCount } from './reading';

describe('wordCount / readingMinutes', () => {
  it('counts words and never reports under one minute', () => {
    expect(wordCount('  one two  three ')).toBe(3);
    expect(wordCount('')).toBe(0);
    expect(readingMinutes(0)).toBe(1);
    expect(readingMinutes(450)).toBe(2);
    expect(readingTimeLabel(2)).toBe('2 min read');
  });
});

describe('splitCitations', () => {
  it('turns [^n] markers into cite segments and leaves the prose intact', () => {
    expect(splitCitations('She retook Sivaganga around 1780.[^2] Kuyili’s attack rests on oral tradition.[^1]')).toEqual([
      { kind: 'text', text: 'She retook Sivaganga around 1780.' },
      { kind: 'cite', index: 2 },
      { kind: 'text', text: ' Kuyili’s attack rests on oral tradition.' },
      { kind: 'cite', index: 1 },
    ]);
  });
  it('returns one text segment when there are no markers', () => {
    expect(splitCitations('Plain.')).toEqual([{ kind: 'text', text: 'Plain.' }]);
  });
  it('strips markers for summaries and meta descriptions', () => {
    expect(stripCitations('A claim.[^3] Another.[^12]')).toBe('A claim. Another.');
  });
});
```
Run: `npm run test:unit` — Expected: FAIL (module missing).

- [ ] **Step 2: Create `src/lib/reading.ts`**

```ts
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
```
Run: `npm run test:unit` — Expected: PASS.

- [ ] **Step 3: Extend the types**

In `src/types/index.ts`:

After `SourceType`, add:
```ts
/** What kind of evidence a source is — shown beside a citation so a reader
    can tell a contemporary record from later scholarship or oral tradition. */
export type EvidenceKind = 'contemporary' | 'scholarship' | 'oral-tradition' | 'reference';
```
Extend `SourceRef` with:
```ts
  evidence?: EvidenceKind;
  /** Precise locator: page range, chapter, folio, file number. */
  pages?: string;
  /** Archive or catalogue identifier (e.g. an Abhilekh Patal PR number). */
  archiveId?: string;
  edition?: string;
  /** ISO date the URL was last checked. */
  accessed?: string;
```
After `DisputedNote`'s `note: string;` add:
```ts
  /** 0-based index into `fullBiography` the note belongs beside. Omit for a record-level note. */
  paragraph?: number;
```
After `StoryChapter`'s `text: string;` add:
```ts
  /** Short caution carried into the quick story so a cautious detailed account never becomes a definite quick one. */
  uncertainty?: string;
```
Add before `FreedomFighter`:
```ts
/** Editorial state of a record. Anything not `reviewed` renders a visible draft stamp. */
export type EditorialStatus = 'draft' | 'reviewed';
export interface Editorial {
  status: EditorialStatus;
  reviewedBy?: string;
  /** ISO date. */
  reviewedOn?: string;
  notes?: string;
}

/** A documented relationship. Only these draw a line in the constellation;
    people related merely by theme stay in `relatedPeople` ("Similar stories"). */
export type ConnectionType = 'ally' | 'opponent' | 'family' | 'mentor' | 'inspired' | 'successor';
export interface Connection {
  /** Fighter id. */
  id: string;
  type: ConnectionType;
  /** One or two sentences saying what the documented connection was. */
  note: string;
}

export interface PortraitNote {
  kind: 'photograph' | 'painting' | 'statue' | 'stamp' | 'illustration' | 'other';
  caption: string;
  credit?: string;
  /** When the image was made, e.g. "c. 1920" or "2008 (commemorative stamp)". */
  created?: string;
}
```
In `FreedomFighter`, after `shortName?`:
```ts
  /** Plain-English pronunciation, e.g. "veh-loo NAH-chi-yar". */
  pronunciation?: string;
  /** "In a minute": three brief facts — the person, their struggle, why it matters. */
  inAMinute?: [string, string, string];
  /** What the portrait actually is (photograph, painting, stamp...), so a later painting is never mistaken for an eyewitness record. */
  portraitNote?: PortraitNote;
  /** Documented relationships. See Connection. */
  connections?: Connection[];
  /** Optional content note shown before the story when a life includes distressing material. */
  contentNote?: string;
  editorial?: Editorial;
```
In `FighterSummary`, after `shortName?`:
```ts
  pronunciation?: string;
  inAMinute?: [string, string, string];
  /** Whole minutes for the detailed history at 200 wpm; computed by scripts/generate-summaries.ts. */
  readingMinutes: number;
  /** Number of documented connections; computed by scripts/generate-summaries.ts. */
  connectionCount: number;
```
In `HistoricalEvent`, after `disputed?`:
```ts
  /** Editorially verified causal links, distinct from chronological neighbours. */
  consequences?: { eventId: string; note: string }[];
  editorial?: Editorial;
```
In `Movement`, after `regions`:
```ts
  aims?: string[];
  methods?: string[];
  /** Geographical reach, one paragraph. */
  reach?: string;
  /** Who took part, one paragraph. */
  participants?: string;
  disagreements?: string[];
  outcomes?: string[];
  editorial?: Editorial;
```
Replace `QuizQuestion` with:
```ts
export type QuizTopic = 'people' | 'events' | 'movements' | 'places';
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  topic: QuizTopic;
  /** 1 recognition · 2 context · 3 depth */
  difficulty: 1 | 2 | 3;
  /** Optional follow-up: why the fact matters, beyond the date. */
  whyItMatters?: string;
  relatedLink?: { label: string; to: string };
}
```

- [ ] **Step 4: Summary projection**

In `scripts/lib/summaries.ts`, import `readingMinutes, wordCount` from `'../../src/lib/reading.ts'` and add to `pickFighterSummary` after `shortName`:
```ts
    pronunciation: f.pronunciation,
    inAMinute: f.inAMinute,
    readingMinutes: readingMinutes(wordCount(f.fullBiography.join(' '))),
    connectionCount: f.connections?.length ?? 0,
```

- [ ] **Step 5: Validator**

In `scripts/validate-content.ts`:

Import at top: `import { CITATION_RE } from '../src/lib/reading.ts';`

Schemas — extend `sourceRefSchema`:
```ts
  evidence: z.enum(['contemporary', 'scholarship', 'oral-tradition', 'reference']).optional(),
  pages: z.string().optional(),
  archiveId: z.string().optional(),
  edition: z.string().optional(),
  accessed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
```
`disputedNoteSchema` gains `paragraph: z.number().int().min(0).optional()`; `storyChapterSchema` gains `uncertainty: z.string().min(1).optional()`.
Add:
```ts
const editorialSchema = z.object({
  status: z.enum(['draft', 'reviewed']),
  reviewedBy: z.string().optional(),
  reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  notes: z.string().optional(),
});
const connectionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['ally', 'opponent', 'family', 'mentor', 'inspired', 'successor']),
  note: z.string().min(20, 'a connection note must say what the connection was'),
});
const portraitNoteSchema = z.object({
  kind: z.enum(['photograph', 'painting', 'statue', 'stamp', 'illustration', 'other']),
  caption: z.string().min(1),
  credit: z.string().optional(),
  created: z.string().optional(),
});
```
`fighterSchema` gains: `pronunciation: z.string().optional(), inAMinute: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]).optional(), portraitNote: portraitNoteSchema.optional(), connections: z.array(connectionSchema).optional(), contentNote: z.string().optional(), editorial: editorialSchema.optional()`.
`eventSchema` gains: `consequences: z.array(z.object({ eventId: z.string().min(1), note: z.string().min(20) })).optional(), editorial: editorialSchema.optional()`.
`movementSchema` gains: `aims: z.array(z.string().min(1)).optional(), methods: z.array(z.string().min(1)).optional(), reach: z.string().optional(), participants: z.string().optional(), disagreements: z.array(z.string().min(1)).optional(), outcomes: z.array(z.string().min(1)).optional(), editorial: editorialSchema.optional()`.
`quizQuestionSchema` gains: `topic: z.enum(['people', 'events', 'movements', 'places']), difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]), whyItMatters: z.string().optional()`.

Cross-checks — add a helper and calls in the fighter loop:
```ts
/** Every [^n] in the given texts must point inside `sources`. */
function checkCitations(collection: string, ref: string, texts: (string | undefined)[], sourceCount: number) {
  for (const text of texts) {
    if (!text) continue;
    for (const m of text.matchAll(CITATION_RE)) {
      const n = Number(m[1]);
      if (n < 1 || n > sourceCount) err(collection, ref, `citation marker [^${n}] has no matching source (record has ${sourceCount})`);
    }
  }
}
```
Inside `for (const f of fighters)`:
```ts
  checkCitations('fighters', f.id, [...f.fullBiography, ...f.shortStory.map((c) => c.text), f.legacy, f.entryIntoStruggle, f.ideology, ...(f.sacrifices ?? []), ...(f.achievements ?? [])], f.sources.length);
  for (const c of f.connections ?? []) {
    if (!fighterIds.has(c.id)) err('fighters', f.id, `connection "${c.id}" is not a fighter id`);
    if (c.id === f.id) err('fighters', f.id, 'a record cannot be connected to itself');
  }
  for (const d of f.disputed ?? []) {
    if (d.paragraph !== undefined && d.paragraph >= f.fullBiography.length) err('fighters', f.id, `disputed note "${d.claim}" points at paragraph ${d.paragraph}, but there are ${f.fullBiography.length}`);
  }
  if (f.disputed?.length && !f.shortStory.some((c) => c.uncertainty)) warn('fighters', f.id, 'has disputed notes but no quick-story chapter carries an `uncertainty` line');
  if (f.editorial?.status === 'draft') warn('fighters', f.id, 'editorial status is draft');
```
Inside `for (const e of events)`:
```ts
  checkCitations('events', e.id, [...e.description, e.significance], e.sources.length);
  for (const c of e.consequences ?? []) if (!eventIds.has(c.eventId)) err('events', e.id, `consequence "${c.eventId}" is not an event id`);
```
Inside `for (const m of movements)`: `checkCitations('movements', m.id, [...m.description, m.reach, m.participants], m.sources.length);`

- [ ] **Step 6: Quiz data gets `topic` and `difficulty`**

In `src/data/quizzes.ts`, add these two fields to every question (values chosen by what the question tests):

| id | topic | difficulty |
|---|---|---|
| q-dandi | events | 1 |
| q-1857-start | events | 1 |
| q-first-woman-president | people | 2 |
| q-ulgulan | people | 2 |
| q-assembly-1929 | people | 2 |
| q-jhansi-regiment | people | 2 |
| q-quit-india-mantra | events | 1 |
| q-kakori | movements | 2 |
| q-santhal-hul | events | 2 |
| q-first-indian-mp | people | 2 |
| q-vedaranyam | events | 2 |
| q-chittagong | people | 2 |
| q-frontier-gandhi | movements | 3 |
| q-jallianwala-year | events | 1 |
| q-gaidinliu | people | 3 |
| q-kattabomman | places | 3 |
| q-vedaranyam-leader | people | 3 |
| q-kodi-kaatha | places | 3 |

Example, the first question becomes:
```ts
  {
    id: 'q-dandi',
    topic: 'events',
    difficulty: 1,
    question: 'What law did Gandhi break at the end of the Dandi March in April 1930?',
    ...
```

- [ ] **Step 7: Templates and CONTRIBUTING**

`docs/templates/fighter.template.ts` — add after `shortName`:
```ts
  pronunciation: 'plain-english syllables, CAPITALS on the stressed one', // optional
  inAMinute: ['Who they were.', 'What they resisted and what it cost.', 'Why it matters now.'], // optional, exactly three
  portraitNote: { kind: 'photograph', caption: 'What the image shows and when it was made.', credit: 'Holder / licence' }, // optional; required when `portrait` is set (validator warns)
  connections: [{ id: 'other-fighter-id', type: 'ally', note: 'What the documented connection was, in one or two sentences.' }], // optional; only documented relationships
  contentNote: 'This life includes imprisonment and execution.', // optional
  editorial: { status: 'draft' }, // flip to { status: 'reviewed', reviewedBy: 'Name', reviewedOn: 'YYYY-MM-DD' } after review
```
Same idea in `event.template.ts` for `consequences` and `editorial`.
`CONTRIBUTING.md` — add a section:

```markdown
## Citing a claim, not just a record

Write `[^n]` straight after a sentence to cite the n-th entry of that record's `sources` (1-based): `She retook Sivaganga around 1780.[^2]`. The reader sees a small marker that previews the source; the validator fails the build if `n` points past the end of `sources`. Give each source an `evidence` kind (`contemporary`, `scholarship`, `oral-tradition`, `reference`) and, where you can, `pages` or an `archiveId` — "Search at Abhilekh Patal" is not a citation, a file number is.

## Connections vs similar stories

`connections` is for documented relationships only (`ally`, `opponent`, `family`, `mentor`, `inspired`, `successor`), each with a `note` saying what the connection was. `relatedPeople` remains for people connected by theme; the UI shows those as "Similar stories" and never draws a line between them.

## Editorial status

New or rewritten records carry `editorial: { status: 'draft' }` until a reviewer sets `reviewed`. Drafts are visible on the site with a "Draft — under editorial review" stamp so nothing reads as settled fact before it is.
```

- [ ] **Step 8: Regenerate, validate, typecheck, test**

Run: `npm run generate:summaries && npm run validate && npm run typecheck && npm run test:unit`
Expected: summaries regenerate (every fighter gains `readingMinutes` and `connectionCount`), validator 0 errors, typecheck clean, tests green.

- [ ] **Step 9: Commit**

```bash
git add src/types/index.ts scripts/validate-content.ts scripts/lib/summaries.ts src/lib/reading.ts src/lib/reading.test.ts src/data/quizzes.ts src/data/generated docs/templates CONTRIBUTING.md
git commit -m "Content model: editorial status, typed connections, claim-level citations, source precision

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Reading text with claim-level citations

**Files:**
- Create: `src/components/reading.tsx`
- Modify: `src/components/ui.tsx` (`SourceList` anchors, evidence stamp, `pages`/`archiveId`)
- Modify: `src/pages/FighterProfilePage.tsx`, `src/pages/EventPage.tsx`, `src/pages/MovementsPage.tsx` (render prose through `ReadingText`)
- Create: `tests/citations.spec.ts`
- Modify: one record for the spec — `velu-nachiyar` in `src/data/fighters/tamil-nadu.ts`

**Interfaces:**
- Produces (`src/components/reading.tsx`):
  ```tsx
  export function Popover(props: { id: string; open: boolean; onClose: () => void; label: string; children: ReactNode }): JSX.Element | null;
  export function CitationMarker(props: { index: number; source: SourceRef | undefined; open: boolean; onToggle: () => void; onClose: () => void }): JSX.Element;
  export function ReadingText(props: {
    paragraphs: string[];
    sources: SourceRef[];
    /** `notesByParagraph[i]` render after paragraph i (uncertainty beside the passage). */
    notesByParagraph?: Record<number, DisputedNote[]>;
    dropcap?: boolean;
    vault?: boolean;
    /** Task 3 adds glossary annotation; default true. */
    glossary?: boolean;
    className?: string;
  }): JSX.Element;
  ```
- `SourceList` items gain `id="source-<n>"` and `scroll-mt-28`.

- [ ] **Step 1: Add a cited claim to one record so the spec has a target**

In `src/data/fighters/tamil-nadu.ts`, in Velu Nachiyar's `fullBiography` third paragraph, cite the ministry commemoration for the retaking and the gazetteer for the reign:
```ts
      'Around 1780 she retook Sivaganga.[^1] Tradition holds that her commander Kuyili carried out a suicide attack — dousing herself in ghee and setting the Company’s ammunition store ablaze — one of the earliest such recorded acts; the details rest on oral tradition. Velu Nachiyar ruled for about a decade, granting the Marudhu brothers administrative powers, and died in 1796.[^2]',
```
and mark the Kuyili note's position and the quick story's uncertainty:
```ts
    disputed: [
      {
        claim: 'Kuyili’s fire attack',
        note: 'The celebrated account of Kuyili igniting the Sivaganga armoury comes from oral tradition and later retellings; contemporary documentation is lacking.',
        paragraph: 2,
      },
    ],
```
In `shortStory[2]` ("The queen strikes back") add:
```ts
        uncertainty: 'The story of her commander Kuyili’s fire attack comes from oral tradition; no contemporary record confirms it.',
```
Give the two sources an evidence kind: the ministry commemoration `evidence: 'reference'`, the gazetteer `evidence: 'scholarship'`.

- [ ] **Step 2: Failing e2e spec**

Create `tests/citations.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('a claim-level citation previews its source and links to the full reference', async ({ page }) => {
  await page.goto('/fighters/velu-nachiyar');
  await page.getByRole('button', { name: 'Detailed history' }).click();
  const marker = page.getByRole('button', { name: 'Source 1: Rani Velu Nachiyar commemorations' });
  await expect(marker).toBeVisible();
  await marker.click();
  const popover = page.getByRole('note', { name: /Source 1/ });
  await expect(popover).toBeVisible();
  await expect(popover).toContainText('Ministry of Culture');
  await expect(popover.getByRole('link', { name: 'Full reference' })).toHaveAttribute('href', /#source-1$/);
  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await expect(marker).toBeFocused();
});

test('uncertainty sits beside the passage in detailed history and inside the quick story', async ({ page }) => {
  await page.goto('/fighters/velu-nachiyar');
  await expect(page.getByText(/comes from oral tradition; no contemporary record confirms it/)).toBeVisible();
  await page.getByRole('button', { name: 'Detailed history' }).click();
  const paragraphs = page.locator('[data-reading-text] > p');
  const note = page.getByRole('note', { name: /Historians note: Kuyili/ });
  await expect(note).toBeVisible();
  // The note follows the third paragraph, not the end of the section.
  const third = await paragraphs.nth(2).boundingBox();
  const noteBox = await note.boundingBox();
  const fourth = await paragraphs.nth(3).boundingBox();
  expect(noteBox!.y).toBeGreaterThan(third!.y);
  expect(noteBox!.y).toBeLessThan(fourth!.y);
});
```
Run: `npx playwright test tests/citations.spec.ts` — Expected: FAIL.

- [ ] **Step 3: Create `src/components/reading.tsx`**

```tsx
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { DisputedNote, SourceRef } from '@/types';
import { splitCitations } from '@/lib/reading';
import { track } from '@/lib/analytics';
import { Icon, icons } from '@/components/ui';

/* ------------------------------------------------------------------ */
/* Popover — a small note anchored under its trigger. Closed in every  */
/* prerendered snapshot; never moves the reading position.             */
export function Popover({ id, open, onClose, label, children }: { id: string; open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.parentElement?.contains(e.target as Node)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <span
      ref={ref}
      id={id}
      role="note"
      aria-label={label}
      className="doc absolute left-0 top-full z-30 mt-1.5 block w-72 max-w-[calc(100vw-2rem)] p-3.5 font-body text-label text-ink-soft shadow-none"
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Citation marker — the [^n] a reader sees                            */
function formatSource(s: SourceRef): string {
  const bits = [s.title, s.author, s.publisher, s.year ? String(s.year) : undefined, s.pages ? `pp. ${s.pages}` : undefined, s.archiveId].filter(Boolean);
  return bits.join(' · ');
}

const evidenceLabel: Record<string, string> = {
  contemporary: 'Contemporary record',
  scholarship: 'Later scholarship',
  'oral-tradition': 'Oral tradition',
  reference: 'Reference',
};

export function CitationMarker({ index, source, open, onToggle, onClose }: { index: number; source: SourceRef | undefined; open: boolean; onToggle: () => void; onClose: () => void }) {
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const close = () => {
    onClose();
    btn.current?.focus();
  };
  return (
    <span className="relative inline-block">
      <button
        ref={btn}
        type="button"
        onClick={() => {
          if (!open) track('source_opened');
          onToggle();
        }}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={`Source ${index}${source ? `: ${source.title}` : ''}`}
        className="num -mt-0.5 ml-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-sm border border-brass/60 px-1 align-super font-body text-xs font-semibold text-brass-deep hover:border-ink hover:text-ink"
      >
        {index}
      </button>
      <Popover id={id} open={open} onClose={close} label={`Source ${index}`}>
        {source ? (
          <>
            {source.evidence && <span className="stamp mb-1.5 block w-fit text-sepia">{evidenceLabel[source.evidence]}</span>}
            <span className="block text-ink">{formatSource(source)}</span>
            <a href={`#source-${index}`} onClick={close} className="mt-2 inline-flex items-center gap-1 font-medium text-oxide-deep underline underline-offset-2">
              Full reference <Icon d={icons.arrowRight} className="h-3 w-3" />
            </a>
          </>
        ) : (
          <span>This marker has no matching source.</span>
        )}
      </Popover>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Historians note beside a passage                                    */
function InlineNote({ note, vault }: { note: DisputedNote; vault: boolean }) {
  return (
    <aside role="note" aria-label={`Historians note: ${note.claim}`} className={`my-4 rounded-sm border-l-2 pl-4 font-body text-meta ${vault ? 'border-oxide-bright text-paper-200' : 'border-oxide text-ink-soft'}`}>
      <span className={`stamp mr-2 ${vault ? 'text-oxide-bright' : 'text-oxide-deep'}`}>Historians note</span>
      <span className={`font-semibold ${vault ? 'text-paper-50' : 'text-ink'}`}>{note.claim}.</span> {note.note}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Reading text — paragraphs with citations (Task 3 adds glossary)     */
export function ReadingText({
  paragraphs,
  sources,
  notesByParagraph,
  dropcap = false,
  vault = false,
  className = '',
}: {
  paragraphs: string[];
  sources: SourceRef[];
  notesByParagraph?: Record<number, DisputedNote[]>;
  dropcap?: boolean;
  vault?: boolean;
  glossary?: boolean;
  className?: string;
}) {
  /* One open popover per reading block: "p2-c1" = paragraph 2, cite 1. */
  const [open, setOpen] = useState<string | null>(null);
  const prose = vault ? 'prose-reading-vault' : 'prose-reading';
  return (
    <div data-reading-text className={`space-y-5 ${className}`}>
      {paragraphs.flatMap((para, i) => {
        const nodes: ReactNode[] = [
          <p key={`p${i}`} className={`${prose} ${dropcap && i === 0 ? 'dropcap' : ''}`}>
            {splitCitations(para).map((seg, j) => {
              if (seg.kind === 'text') return seg.text;
              const key = `p${i}-c${j}`;
              return <CitationMarker key={key} index={seg.index} source={sources[seg.index - 1]} open={open === key} onToggle={() => setOpen(open === key ? null : key)} onClose={() => setOpen(null)} />;
            })}
          </p>,
        ];
        for (const note of notesByParagraph?.[i] ?? []) nodes.push(<InlineNote key={`n${i}-${note.claim}`} note={note} vault={vault} />);
        return nodes;
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Draft stamp — anything not yet reviewed says so                     */
export function DraftStamp({ vault = false }: { vault?: boolean }) {
  return (
    <p className={`inline-flex items-center gap-2 font-body text-label ${vault ? 'text-paper-300' : 'text-ink-faint'}`}>
      <span className={`stamp ${vault ? 'text-oxide-bright' : 'text-oxide-deep'}`}>Draft</span>
      under editorial review — wording may change
    </p>
  );
}

```

- [ ] **Step 4: `SourceList` anchors and evidence**

In `src/components/ui.tsx` `SourceList`, give the section `id="sources"` and each `<li>`:
```tsx
          <li key={`${s.title}-${i}`} id={`source-${i + 1}`} className="flex scroll-mt-28 gap-3 font-body text-meta text-ink-soft">
```
After `{s.year && <>, {s.year}</>}` add:
```tsx
              {s.edition && <>, {s.edition}</>}
              {s.pages && <>, pp. {s.pages}</>}
              {s.archiveId && <> · {s.archiveId}</>}
```
And after the type stamp:
```tsx
              {s.evidence && <span className="stamp ml-1 align-middle text-oxide-deep">{{ contemporary: 'Contemporary', scholarship: 'Scholarship', 'oral-tradition': 'Oral tradition', reference: 'Reference' }[s.evidence]}</span>}
```

- [ ] **Step 5: Route prose through `ReadingText`**

`src/pages/FighterProfilePage.tsx`:
- Import `ReadingText` from `@/components/reading`.
- Add a helper above the component (and import the `DisputedNote` type):
```ts
function notesByParagraph(notes: DisputedNote[] | undefined): Record<number, DisputedNote[]> {
  const out: Record<number, DisputedNote[]> = {};
  for (const n of notes ?? []) if (n.paragraph !== undefined) (out[n.paragraph] ??= []).push(n);
  return out;
}
```
  Replace the detail-mode paragraphs block with:
```tsx
                  <ReadingText paragraphs={fighter.fullBiography} sources={fighter.sources} dropcap className="max-w-prose animate-fade-in" notesByParagraph={notesByParagraph(fighter.disputed)} />
```
- The record-level `DisputedNotes` block renders only notes **without** a paragraph: `{fighter.disputed && <DisputedNotes notes={fighter.disputed.filter((d) => d.paragraph === undefined)} />}`.
- In `StoryMode`, under each chapter's text (both the stepper and the list) add:
```tsx
            {chapter.uncertainty && (
              <p className="mt-3 font-body text-label text-ink-soft">
                <span className="stamp mr-2 text-oxide-deep">Uncertain</span>
                {chapter.uncertainty}
              </p>
            )}
```
  and render `chapter.text` through `<ReadingText paragraphs={[chapter.text]} sources={sources} />` — `StoryMode` gains a `sources: SourceRef[]` prop, passed from the page.
- Legacy: `<ReadingText paragraphs={[fighter.legacy]} sources={fighter.sources} className="mt-3" />`.

`src/pages/EventPage.tsx`: replace the description `Reveal as="p"` list with `<ReadingText paragraphs={event.description} sources={event.sources} dropcap className="max-w-prose" />`; significance → `<ReadingText paragraphs={[event.significance]} sources={event.sources} className="mt-3" />`.

`src/pages/MovementsPage.tsx` (`MovementPage`): description → `<ReadingText paragraphs={movement.description} sources={movement.sources} dropcap />`.

- [ ] **Step 6: Run**

Run: `npm run validate && npm run typecheck && npm run generate:summaries && npm run build && npx playwright test tests/citations.spec.ts tests/story-mode.spec.ts tests/console-errors.spec.ts`
Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/reading.tsx src/components/ui.tsx src/pages/FighterProfilePage.tsx src/pages/EventPage.tsx src/pages/MovementsPage.tsx src/data/fighters/tamil-nadu.ts src/data/generated tests/citations.spec.ts
git commit -m "Render prose with claim-level citation markers and uncertainty beside the passage

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Glossary — terms explained at first appearance

**Files:**
- Create: `src/lib/glossary.ts`, `src/lib/glossary.test.ts`
- Create: `src/data/glossary.ts`
- Create: `src/pages/GlossaryPage.tsx`
- Modify: `src/types/index.ts` (`GlossaryTerm`), `scripts/validate-content.ts`, `src/lib/content.ts`, `src/lib/routes.tsx`, `scripts/lib/routes.mjs`, `src/components/reading.tsx`, `src/components/layout.tsx` (footer link)
- Create: `tests/glossary.spec.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/types/index.ts
  export interface GlossaryTerm { id: string; term: string; aliases?: string[]; definition: string; moreLink?: { label: string; to: string }; editorial: Editorial }
  // src/lib/glossary.ts (import-free)
  export interface GlossaryLike { id: string; term: string; aliases?: string[] }
  export type GlossSegment = { kind: 'text'; text: string } | { kind: 'term'; text: string; termId: string };
  export function annotateFirstOccurrences(texts: string[], terms: GlossaryLike[]): GlossSegment[][];
  // src/lib/content.ts
  export { glossaryTerms, glossaryById } from '@/data/glossary';
  ```
- `ReadingText` gains glossary annotation (on by default) and `GlossButton` popovers; the page `/glossary` lists every term.

- [ ] **Step 1: Failing unit tests**

Create `src/lib/glossary.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { annotateFirstOccurrences } from './glossary';

const terms = [
  { id: 'east-india-company', term: 'East India Company', aliases: ['the Company'] },
  { id: 'satyagraha', term: 'satyagraha', aliases: ['satyagrahi', 'satyagrahis'] },
];

describe('annotateFirstOccurrences', () => {
  it('marks only the first occurrence of each term across all paragraphs, case-insensitively', () => {
    const out = annotateFirstOccurrences(['The East India Company arrived. The Company stayed.', 'A satyagrahi refused; satyagraha spread.'], terms);
    expect(out[0]).toEqual([
      { kind: 'text', text: 'The ' },
      { kind: 'term', text: 'East India Company', termId: 'east-india-company' },
      { kind: 'text', text: ' arrived. The Company stayed.' },
    ]);
    expect(out[1]).toEqual([
      { kind: 'text', text: 'A ' },
      { kind: 'term', text: 'satyagrahi', termId: 'satyagraha' },
      { kind: 'text', text: ' refused; satyagraha spread.' },
    ]);
  });
  it('matches whole words only and leaves citation markers alone', () => {
    const out = annotateFirstOccurrences(['Companyman said nothing.[^1]'], terms);
    expect(out[0]).toEqual([{ kind: 'text', text: 'Companyman said nothing.[^1]' }]);
  });
  it('prefers the longest alias at a position', () => {
    const out = annotateFirstOccurrences(['East India Company'], [{ id: 'a', term: 'India' }, { id: 'b', term: 'East India Company' }]);
    expect(out[0]).toEqual([{ kind: 'term', text: 'East India Company', termId: 'b' }]);
  });
});
```
Run: `npm run test:unit` — Expected: FAIL.

- [ ] **Step 2: Create `src/lib/glossary.ts`**

```ts
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
```
Run: `npm run test:unit` — Expected: PASS.

- [ ] **Step 3: Type, data, validator, content export**

`src/types/index.ts`, under "Educational content":
```ts
/** A term explained at its first appearance on a page, and listed at /glossary. */
export interface GlossaryTerm {
  id: string;
  term: string;
  /** Other surface forms that should trigger the same explanation. */
  aliases?: string[];
  /** Plain English, one or two sentences, no more than ~45 words. */
  definition: string;
  moreLink?: { label: string; to: string };
  editorial: Editorial;
}
```
Create `src/data/glossary.ts` — every definition is `draft` until reviewed:
```ts
import type { GlossaryTerm } from '@/types';

const draft = { status: 'draft' as const };

/** Terms a first-time reader meets on their way in. Keep definitions plain;
    keep the historical word. Drafted 8 September 2026, pending review. */
export const glossaryTerms: GlossaryTerm[] = [
  { id: 'east-india-company', term: 'East India Company', aliases: ['the Company', 'Company rule'], definition: 'An English trading company that, from 1757, used its own armies and treaties to rule ever more of India until the British Crown took over in 1858.', moreLink: { label: 'Battle of Plassey', to: '/events/battle-of-plassey' }, editorial: draft },
  { id: 'colonial-rule', term: 'colonial rule', aliases: ['the Raj', 'British rule', 'Crown rule'], definition: 'Government of India by Britain for Britain’s benefit — first through the East India Company, then from 1858 directly by the British Crown, until 1947.', editorial: draft },
  { id: 'presidency', term: 'Presidency', aliases: ['Madras Presidency', 'Bengal Presidency', 'Bombay Presidency'], definition: 'One of the three large provinces — Bengal, Bombay and Madras — into which the British divided the territory they governed directly.', editorial: draft },
  { id: 'princely-state', term: 'princely state', aliases: ['princely states'], definition: 'A territory ruled by an Indian prince under British control. Around 560 of them existed alongside the directly ruled provinces.', editorial: draft },
  { id: 'palaiyakkarar', term: 'palaiyakkarar', aliases: ['palaiyakkarars', 'poligar', 'poligars', 'palaiyam', 'palaiyams'], definition: 'A hereditary chief in the Tamil country holding a palaiyam — a small territory with its own fort and soldiers. The British called them poligars.', moreLink: { label: 'Veerapandiya Kattabomman', to: '/fighters/veerapandiya-kattabomman' }, editorial: draft },
  { id: 'sepoy', term: 'sepoy', aliases: ['sepoys'], definition: 'An Indian soldier serving in the East India Company’s, and later the British Crown’s, army.', editorial: draft },
  { id: 'land-revenue', term: 'land revenue', aliases: ['revenue', 'tribute', 'land tax'], definition: 'The share of a harvest or its value that rulers collected from farmers. Under the Company the demands rose sharply and were enforced by law and force.', editorial: draft },
  { id: 'zamindar', term: 'zamindar', aliases: ['zamindars', 'taluqdar', 'taluqdars'], definition: 'A landholder who collected revenue from the farmers on an estate and paid a fixed sum to the government.', editorial: draft },
  { id: 'doctrine-of-lapse', term: 'Doctrine of Lapse', definition: 'A British policy of the 1840s and 1850s: if a ruler died without a son born to him, the British refused to recognise an adopted heir and took the state.', moreLink: { label: 'Rani Lakshmibai', to: '/fighters/rani-lakshmibai' }, editorial: draft },
  { id: 'adivasi', term: 'Adivasi', aliases: ['Adivasis', 'tribal'], definition: 'India’s indigenous communities. Colonial land and forest laws took their land and criminalised their way of life, and they rose against it for more than a century.', moreLink: { label: 'Adivasi & Tribal Uprisings', to: '/movements/tribal-resistance' }, editorial: draft },
  { id: 'congress', term: 'Indian National Congress', aliases: ['the Congress', 'Congress'], definition: 'Founded in 1885 as an annual assembly asking for a greater Indian say in government; under Gandhi it became a mass movement of millions.', moreLink: { label: 'Founding of the Congress', to: '/events/founding-of-the-indian-national-congress' }, editorial: draft },
  { id: 'boycott', term: 'boycott', aliases: ['boycotted', 'boycotts'], definition: 'Refusing to buy, use or take part in something as a protest — foreign cloth, government schools, courts, elections.', editorial: draft },
  { id: 'swadeshi', term: 'Swadeshi', aliases: ['swadeshi'], definition: '“Of one’s own country.” A movement from 1905 to buy Indian-made goods and build Indian schools, banks and businesses instead of depending on British ones.', moreLink: { label: 'Swadeshi Movement', to: '/movements/swadeshi-movement' }, editorial: draft },
  { id: 'partition-of-bengal', term: 'Partition of Bengal', definition: 'The British division of the province of Bengal in 1905, widely seen as an attempt to weaken its politics; the protests against it launched the Swadeshi movement. It was reversed in 1911.', editorial: draft },
  { id: 'sedition', term: 'sedition', definition: 'The crime of speaking or writing against the government. Colonial courts used it to imprison editors, speakers and organisers.', editorial: draft },
  { id: 'transportation', term: 'transportation', aliases: ['transported'], definition: 'A sentence of exile to a distant prison colony, most often the Cellular Jail in the Andaman Islands.', editorial: draft },
  { id: 'hartal', term: 'hartal', definition: 'A day when shops, offices and work stop as a collective protest.', editorial: draft },
  { id: 'satyagraha', term: 'satyagraha', aliases: ['satyagrahi', 'satyagrahis'], definition: 'Gandhi’s method: openly refusing to obey an unjust law, without violence, and accepting the punishment. A person who does this is a satyagrahi.', moreLink: { label: 'Civil Disobedience Movement', to: '/movements/civil-disobedience-movement' }, editorial: draft },
  { id: 'rowlatt-act', term: 'Rowlatt Act', definition: 'A 1919 law allowing imprisonment without trial. Protests against it led to the massacre at Jallianwala Bagh.', moreLink: { label: 'Jallianwala Bagh', to: '/events/jallianwala-bagh-massacre' }, editorial: draft },
  { id: 'non-cooperation', term: 'Non-Cooperation', aliases: ['non-cooperation'], definition: 'Gandhi’s 1920–22 campaign to withdraw from everything British — schools, courts, councils, titles, cloth — so that the government could not function.', moreLink: { label: 'Non-Cooperation Movement', to: '/movements/non-cooperation-movement' }, editorial: draft },
  { id: 'khilafat', term: 'Khilafat', definition: 'A movement of Indian Muslims after the First World War in defence of the Ottoman Caliphate, allied with Non-Cooperation.', editorial: draft },
  { id: 'civil-disobedience', term: 'civil disobedience', aliases: ['Civil Disobedience'], definition: 'Breaking specific laws openly and peacefully to show they are unjust — the salt law in 1930 being the famous example.', editorial: draft },
  { id: 'salt-tax', term: 'salt tax', aliases: ['salt law', 'salt laws'], definition: 'A government monopoly and tax on salt that made a daily necessity cost more for everyone, especially the poor. Making or selling salt without permission was illegal.', moreLink: { label: 'Dandi March', to: '/events/dandi-march' }, editorial: draft },
  { id: 'purna-swaraj', term: 'Purna Swaraj', definition: '“Complete self-rule.” The Congress’s declaration of December 1929 that independence, not a share in government, was the goal.', editorial: draft },
  { id: 'home-rule', term: 'Home Rule', definition: 'Self-government for India within the British Empire — the demand of the leagues founded by Tilak and Annie Besant in 1916.', editorial: draft },
  { id: 'quit-india', term: 'Quit India', definition: 'The Congress resolution of 8 August 1942 demanding immediate British withdrawal, and the uprising that followed the arrest of its leaders.', moreLink: { label: 'Quit India', to: '/events/quit-india-launch' }, editorial: draft },
  { id: 'ina', term: 'Indian National Army', aliases: ['INA', 'Azad Hind Fauj'], definition: 'An army formed in South-East Asia from Indian prisoners of war and civilians, led from 1943 by Subhas Chandra Bose, to fight for independence alongside Japan.', moreLink: { label: 'Azad Hind & the INA', to: '/movements/azad-hind-movement' }, editorial: draft },
  { id: 'partition', term: 'Partition', aliases: ['Partition of India'], definition: 'The division of British India into India and Pakistan at independence in 1947, which uprooted many millions and cost hundreds of thousands of lives.', editorial: draft },
];

export const glossaryById = new Map(glossaryTerms.map((t) => [t.id, t]));
```
`src/lib/content.ts`: add `import { glossaryTerms, glossaryById } from '@/data/glossary';` and export both.
`scripts/validate-content.ts`: import `glossaryTerms`, add
```ts
const glossaryTermSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  term: z.string().min(1),
  aliases: z.array(z.string().min(1)).optional(),
  definition: z.string().min(1).max(320),
  moreLink: relatedLinkSchema,
  editorial: editorialSchema,
});
checkSchema('glossary', glossaryTerms, glossaryTermSchema, (t) => t.id);
checkUnique('glossary', glossaryTerms.map((t) => ({ id: t.id })));
for (const t of glossaryTerms) {
  checkRelatedLink('glossary', t.id, t.moreLink);
  if (t.editorial.status === 'draft') warn('glossary', t.id, 'editorial status is draft');
}
```
Place the `moreLink` route check after `checkRelatedLink` is defined.

- [ ] **Step 4: `ReadingText` annotates; `GlossButton` explains**

In `src/components/reading.tsx` add imports `import { glossaryById, glossaryTerms } from '@/lib/content';` and `import { annotateFirstOccurrences } from '@/lib/glossary';`, then add:
```tsx
/* ------------------------------------------------------------------ */
/* Glossary term — dotted underline, explains itself on demand         */
export function GlossButton({ text, termId, open, onToggle, onClose }: { text: string; termId: string; open: boolean; onToggle: () => void; onClose: () => void }) {
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const term = glossaryById.get(termId);
  const close = () => {
    onClose();
    btn.current?.focus();
  };
  return (
    <span className="relative inline">
      <button
        ref={btn}
        type="button"
        onClick={() => {
          if (!open) track('glossary_opened');
          onToggle();
        }}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        className="gloss"
      >
        {text}
      </button>
      <Popover id={id} open={open} onClose={close} label={`Meaning of ${term?.term ?? text}`}>
        <span className="block font-display text-base font-bold text-ink">{term?.term}</span>
        <span className="mt-1 block">{term?.definition}</span>
        <span className="mt-2 flex flex-wrap gap-3">
          {term?.moreLink && (
            <Link to={term.moreLink.to} className="font-medium text-oxide-deep underline underline-offset-2">
              {term.moreLink.label}
            </Link>
          )}
          <Link to={`/glossary#${termId}`} className="font-medium text-ink underline underline-offset-2">
            Glossary
          </Link>
        </span>
      </Popover>
    </span>
  );
}
```
Add `import { Link } from 'react-router-dom';` at the top. In `ReadingText`, honour `glossary = true` and annotate before splitting citations — replace the `paragraphs.flatMap` body's inner map with:
```tsx
      {(() => {
        const glossed = glossary ? annotateFirstOccurrences(paragraphs, glossaryTerms) : paragraphs.map((text) => [{ kind: 'text' as const, text }]);
        return paragraphs.flatMap((_, i) => {
          const nodes: ReactNode[] = [
            <p key={`p${i}`} className={`${prose} ${dropcap && i === 0 ? 'dropcap' : ''}`}>
              {glossed[i].flatMap((g, gi) => {
                if (g.kind === 'term') {
                  const key = `p${i}-g${gi}`;
                  return [<GlossButton key={key} text={g.text} termId={g.termId} open={open === key} onToggle={() => setOpen(open === key ? null : key)} onClose={() => setOpen(null)} />];
                }
                return splitCitations(g.text).map((seg, j) => {
                  if (seg.kind === 'text') return seg.text;
                  const key = `p${i}-g${gi}-c${j}`;
                  return <CitationMarker key={key} index={seg.index} source={sources[seg.index - 1]} open={open === key} onToggle={() => setOpen(open === key ? null : key)} onClose={() => setOpen(null)} />;
                });
              })}
            </p>,
          ];
          for (const note of notesByParagraph?.[i] ?? []) nodes.push(<InlineNote key={`n${i}-${note.claim}`} note={note} vault={vault} />);
          return nodes;
        });
      })()}
```
and add `glossary = true` to the destructured props. Style in `src/index.css` components layer:
```css
  /* A glossary term: inherits the reading face, dotted gauge-gold underline, no button chrome */
  .gloss {
    @apply rounded-sm bg-transparent p-0 underline decoration-brass decoration-dotted decoration-1 underline-offset-4 hover:decoration-solid hover:decoration-ink;
    font: inherit;
    color: inherit;
  }
```

- [ ] **Step 5: The `/glossary` page**

Create `src/pages/GlossaryPage.tsx`:
```tsx
import { Link } from 'react-router-dom';
import { glossaryTerms } from '@/lib/content';
import { usePageMeta } from '@/lib/hooks';
import { PageIntro } from '@/components/ui';
import { DraftStamp } from '@/components/reading';

export default function GlossaryPage() {
  usePageMeta('Glossary', 'Plain-English explanations of the terms that appear across the archive — Company rule, satyagraha, palaiyakkarar and more.');
  const sorted = [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="pb-20">
      <PageIntro title="Glossary" lede="The words this history is told in, explained the first time you meet them on any page — and all together here." />
      <div className="container-page max-w-3xl">
        <dl className="divide-y divide-paper-300">
          {sorted.map((t) => (
            <div key={t.id} id={t.id} className="scroll-mt-28 py-5">
              <dt className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-h3 text-ink">{t.term}</span>
                {t.aliases && <span className="font-body text-label text-ink-faint">also: {t.aliases.join(', ')}</span>}
              </dt>
              <dd className="mt-2 max-w-prose">
                <p className="prose-reading">{t.definition}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  {t.moreLink && (
                    <Link to={t.moreLink.to} className="font-body text-meta font-medium text-oxide-deep underline decoration-oxide-deep/40 underline-offset-4">
                      {t.moreLink.label}
                    </Link>
                  )}
                  {t.editorial.status === 'draft' && <DraftStamp />}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
```
Register: `src/lib/routes.tsx` add `{ path: '/glossary', loader: () => import('@/pages/GlossaryPage') },` before `/about`; `scripts/lib/routes.mjs` add `'/glossary'` to `staticRoutes`; `src/components/layout.tsx` footer list add `['/glossary', 'Glossary']`.

- [ ] **Step 6: E2E spec**

Create `tests/glossary.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('a term is explained once, at its first appearance, without moving the reader', async ({ page }) => {
  await page.goto('/events/battle-of-plassey');
  const terms = page.locator('[data-reading-text] button.gloss');
  const count = await terms.count();
  expect(count).toBeGreaterThan(0);
  const texts = (await terms.allTextContents()).map((t) => t.toLowerCase());
  expect(new Set(texts).size).toBe(texts.length); // no term explained twice
  const before = await page.evaluate(() => window.scrollY);
  await terms.first().click();
  const note = page.getByRole('note', { name: /Meaning of/ });
  await expect(note).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
  await expect(note.getByRole('link', { name: 'Glossary' })).toHaveAttribute('href', /^\/glossary#/);
  await page.keyboard.press('Escape');
  await expect(note).toBeHidden();
});

test('/glossary lists every term with its definition', async ({ page }) => {
  await page.goto('/glossary');
  await expect(page.getByRole('heading', { name: 'Glossary' })).toBeVisible();
  await expect(page.locator('dl > div')).toHaveCount(28);
  await page.goto('/glossary#satyagraha');
  await expect(page.locator('#satyagraha')).toBeInViewport();
});
```
Run: `npm run validate && npm run typecheck && npm run test:unit && npm run build && npx playwright test tests/glossary.spec.ts tests/citations.spec.ts`
Expected: pass. (Plassey's description contains "Company" → `the Company` alias and "East India Company".)

- [ ] **Step 7: Commit**

```bash
git add src/lib/glossary.ts src/lib/glossary.test.ts src/data/glossary.ts src/pages/GlossaryPage.tsx src/types/index.ts scripts/validate-content.ts src/lib/content.ts src/lib/routes.tsx scripts/lib/routes.mjs src/components/reading.tsx src/components/layout.tsx src/index.css tests/glossary.spec.ts
git commit -m "Glossary: explain terms at first appearance, and list them at /glossary

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Reading preferences and the reading toolbar

**Files:**
- Create: `src/lib/preferences.ts`, `src/lib/preferences.test.ts`
- Modify: `src/lib/hooks.ts` (`usePreferences`; `useReducedMotion` honours the setting)
- Modify: `index.html` (pre-paint script), `src/index.css` (text-size scale, `[data-motion="reduce"]`)
- Modify: `src/components/reading.tsx` (`ReadingToolbar`)
- Modify: `src/pages/FighterProfilePage.tsx` (toolbar; reading mode from preferences)
- Create: `tests/preferences.spec.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/lib/preferences.ts
  export type TextSize = 'default' | 'large' | 'larger';
  export type ReadingMode = 'story' | 'detail';
  export type MotionPref = 'system' | 'reduce';
  export interface Preferences { textSize: TextSize; readingMode: ReadingMode; motion: MotionPref; lowData: boolean }
  export const DEFAULT_PREFERENCES: Preferences;
  export function parsePreferences(raw: string | null): Preferences;   // pure, tolerant
  export function readPreferences(): Preferences;
  export function writePreferences(patch: Partial<Preferences>): void;
  export function subscribePreferences(cb: () => void): () => void;
  export function applyPreferencesToDocument(p: Preferences): void;    // sets data-text-size, data-motion, data-low-data on <html>
  // src/lib/hooks.ts
  export function usePreferences(): [Preferences, (patch: Partial<Preferences>) => void];
  // src/components/reading.tsx
  export function ReadingToolbar(props: { readingMode?: boolean; sourcesHref?: string; className?: string }): JSX.Element;
  ```
- localStorage key `ift-prefs-v1`. `<html data-text-size data-motion data-low-data>` are the CSS hooks (Stage 3 reads `data-motion`).

- [ ] **Step 1: Failing unit test**

Create `src/lib/preferences.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { DEFAULT_PREFERENCES, parsePreferences } from './preferences';

describe('parsePreferences', () => {
  it('returns defaults for nothing, garbage, or unknown values', () => {
    expect(parsePreferences(null)).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences('{not json')).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences('{"textSize":"huge","motion":"off","readingMode":3,"lowData":"yes"}')).toEqual(DEFAULT_PREFERENCES);
  });
  it('keeps valid values', () => {
    expect(parsePreferences('{"textSize":"larger","motion":"reduce","readingMode":"detail","lowData":true}')).toEqual({ textSize: 'larger', motion: 'reduce', readingMode: 'detail', lowData: true });
  });
});
```
Run: `npm run test:unit` — Expected: FAIL.

- [ ] **Step 2: Create `src/lib/preferences.ts`**

```ts
/**
 * Reading preferences, kept on the device. Same pub-sub + useSyncExternalStore
 * idiom as bookmarks (src/lib/hooks.ts). Mirrored onto <html data-*> so CSS
 * can act on them, and applied before first paint by the inline script in
 * index.html (which reads the same key) so text size never flashes.
 */
export type TextSize = 'default' | 'large' | 'larger';
export type ReadingMode = 'story' | 'detail';
export type MotionPref = 'system' | 'reduce';

export interface Preferences {
  textSize: TextSize;
  readingMode: ReadingMode;
  motion: MotionPref;
  lowData: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = { textSize: 'default', readingMode: 'story', motion: 'system', lowData: false };
export const PREFERENCES_KEY = 'ift-prefs-v1';

export function parsePreferences(raw: string | null): Preferences {
  let p: Record<string, unknown> = {};
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (typeof parsed === 'object' && parsed !== null) p = parsed as Record<string, unknown>;
  } catch {
    /* defaults */
  }
  return {
    textSize: p.textSize === 'large' || p.textSize === 'larger' ? p.textSize : 'default',
    readingMode: p.readingMode === 'detail' ? 'detail' : 'story',
    motion: p.motion === 'reduce' ? 'reduce' : 'system',
    lowData: p.lowData === true,
  };
}

const listeners = new Set<() => void>();
let cache: Preferences | null = null;

export function readPreferences(): Preferences {
  if (cache) return cache;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(PREFERENCES_KEY);
  } catch {
    /* in-memory only */
  }
  cache = parsePreferences(raw);
  return cache;
}

export function applyPreferencesToDocument(p: Preferences) {
  const d = document.documentElement.dataset;
  d.textSize = p.textSize;
  d.motion = p.motion;
  d.lowData = p.lowData ? 'true' : 'false';
}

export function writePreferences(patch: Partial<Preferences>) {
  cache = { ...readPreferences(), ...patch };
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(cache));
  } catch {
    /* in-memory only */
  }
  applyPreferencesToDocument(cache);
  listeners.forEach((l) => l());
}

export function subscribePreferences(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
```
Run: `npm run test:unit` — Expected: PASS.

- [ ] **Step 3: Hook, and reduced motion honours the setting**

In `src/lib/hooks.ts` add `import { DEFAULT_PREFERENCES, readPreferences, subscribePreferences, writePreferences, type Preferences } from '@/lib/preferences';` and:
```ts
/* ------------------------------------------------------------------ */
/* Reading preferences (localStorage, mirrored to <html data-*>)       */

export function usePreferences(): [Preferences, (patch: Partial<Preferences>) => void] {
  const prefs = useSyncExternalStore(subscribePreferences, readPreferences, () => DEFAULT_PREFERENCES);
  return [prefs, writePreferences];
}
```
Change `useReducedMotion` to:
```ts
/** Respect the OS preference, or the site's own persistent "Reduce motion" setting. */
export function useReducedMotion(): boolean {
  const media = useMatchMedia('(prefers-reduced-motion: reduce)');
  const [prefs] = usePreferences();
  return media || prefs.motion === 'reduce';
}
```
(`usePreferences` must be declared above `useReducedMotion` or hoisted — function declarations hoist, fine.)

- [ ] **Step 4: Pre-paint script and CSS**

In `index.html`, immediately after `<meta name="theme-color" ...>`:
```html
    <script>
      /* Reading preferences (src/lib/preferences.ts) applied before first paint so text size and motion never flash. */
      try {
        var p = JSON.parse(localStorage.getItem('ift-prefs-v1') || '{}') || {};
        var d = document.documentElement.dataset;
        if (p.textSize === 'large' || p.textSize === 'larger') d.textSize = p.textSize;
        if (p.motion === 'reduce') d.motion = 'reduce';
        if (p.lowData === true) d.lowData = 'true';
      } catch (e) {}
    </script>
```
In `src/index.css` `@layer components`, after `.prose-reading-vault`:
```css
  /* User text size: reading prose scales; UI does not. Set before paint by index.html. */
  :root { --reading-scale: 1; }
  :root[data-text-size='large'] { --reading-scale: 1.125; }
  :root[data-text-size='larger'] { --reading-scale: 1.25; }
  .prose-reading,
  .prose-reading-vault {
    font-size: calc(1.0625rem * var(--reading-scale));
    line-height: 1.62;
  }
```
In `@layer base`, duplicate the reduced-motion block for the site setting (the media block stays):
```css
  :root[data-motion='reduce'] *,
  :root[data-motion='reduce'] *::before,
  :root[data-motion='reduce'] *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  :root[data-motion='reduce'] .reveal,
  :root[data-motion='reduce'] .reveal-mask,
  :root[data-motion='reduce'] .reveal-mask > * {
    opacity: 1 !important;
    transform: none !important;
    clip-path: none !important;
  }
```
and in `@layer utilities` beside the `.spine-progress` reduced-motion rule: `:root[data-motion='reduce'] .spine-progress { animation: none !important; transform: none !important; }`.

- [ ] **Step 5: `ReadingToolbar`**

Append to `src/components/reading.tsx` (imports: `usePreferences` from `@/lib/hooks`, `BottomSheet, Segmented` from `@/components/ui`, `useState`):
```tsx
/* ------------------------------------------------------------------ */
/* Reading toolbar — mode and sources up front; the rest behind        */
/* "Reading settings" so the story isn't crowded by every preference.  */
export function ReadingToolbar({ readingMode = true, sourcesHref = '#sources', className = '' }: { readingMode?: boolean; sourcesHref?: string; className?: string }) {
  const [prefs, setPrefs] = usePreferences();
  const [open, setOpen] = useState(false);
  return (
    <div role="toolbar" aria-label="Reading options" className={`flex flex-wrap items-center gap-2 ${className}`}>
      {readingMode && (
        <Segmented
          label="Reading mode"
          value={prefs.readingMode}
          onChange={(v) => setPrefs({ readingMode: v })}
          options={[
            { value: 'story', label: 'Quick story' },
            { value: 'detail', label: 'Detailed history' },
          ]}
        />
      )}
      <a href={sourcesHref} className="chip min-h-10">
        <Icon d={icons.file} className="h-3.5 w-3.5" />
        Sources
      </a>
      <button type="button" className="chip min-h-10" onClick={() => setOpen(true)} aria-haspopup="dialog">
        Reading settings
      </button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Reading settings">
        <div className="space-y-6 py-2">
          <div>
            <p className="label mb-2">Text size</p>
            <Segmented
              label="Text size"
              value={prefs.textSize}
              onChange={(v) => setPrefs({ textSize: v })}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'large', label: 'Large' },
                { value: 'larger', label: 'Larger' },
              ]}
            />
          </div>
          <div>
            <p className="label mb-2">Motion</p>
            <button type="button" role="switch" aria-checked={prefs.motion === 'reduce'} onClick={() => setPrefs({ motion: prefs.motion === 'reduce' ? 'system' : 'reduce' })} className={`chip min-h-11 ${prefs.motion === 'reduce' ? 'chip-active' : ''}`}>
              Reduce motion
            </button>
            <p className="mt-2 font-body text-label text-ink-faint">Your device’s own reduce-motion setting is always respected; this switch turns effects off here as well.</p>
          </div>
          <div>
            <p className="label mb-2">Data</p>
            <button type="button" role="switch" aria-checked={prefs.lowData} onClick={() => setPrefs({ lowData: !prefs.lowData })} className={`chip min-h-11 ${prefs.lowData ? 'chip-active' : ''}`}>
              Prefer text and small images
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
```

- [ ] **Step 6: Profile uses the toolbar and the stored mode**

In `src/pages/FighterProfilePage.tsx`: remove `const [mode, setMode] = useState<'story' | 'detail'>('story');` and the inline `Segmented`; add `const [prefs] = usePreferences(); const mode = prefs.readingMode;` (import `usePreferences`). Replace the heading row with:
```tsx
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <h2 id="story" className="scroll-mt-28 text-h2 text-ink">{mode === 'story' ? 'Quick story' : 'Detailed history'}</h2>
                  <ReadingToolbar />
                </div>
```
Import `ReadingToolbar` from `@/components/reading`.

- [ ] **Step 7: E2E spec**

Create `tests/preferences.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('text size and reading mode persist across pages and reloads', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  const para = page.locator('[data-reading-text] p').first();
  const before = await para.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

  await page.getByRole('button', { name: 'Reading settings' }).click();
  await page.getByRole('group', { name: 'Text size' }).getByRole('button', { name: 'Larger' }).click();
  await page.keyboard.press('Escape');
  await expect.poll(() => para.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(before * 1.2);

  await page.getByRole('button', { name: 'Detailed history' }).click();
  await page.goto('/fighters/velu-nachiyar');
  await expect(page.getByRole('heading', { name: 'Detailed history' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'larger');
});

test('the Reduce motion setting stops reveals from hiding content', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  await page.getByRole('button', { name: 'Reading settings' }).click();
  await page.getByRole('switch', { name: 'Reduce motion' }).click();
  await page.keyboard.press('Escape');
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
  await expect(page.locator('.reveal, .reveal-mask').last()).toHaveCSS('opacity', '1');
});
```
Run: `npm run typecheck && npm run test:unit && npm run build && npx playwright test tests/preferences.spec.ts tests/story-mode.spec.ts tests/accessibility.spec.ts`
Expected: pass. (`story-mode.spec.ts` still finds the stepper because the default mode is `story`.)

- [ ] **Step 8: Commit**

```bash
git add src/lib/preferences.ts src/lib/preferences.test.ts src/lib/hooks.ts index.html src/index.css src/components/reading.tsx src/pages/FighterProfilePage.tsx tests/preferences.spec.ts
git commit -m "Reading preferences: text size, reading mode, reduce motion, low data — persistent, applied before paint

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: The biography template — memorable, evidenced, navigable

**Files:**
- Modify: `src/pages/FighterProfilePage.tsx`
- Modify: `src/components/ui.tsx` (`Breadcrumbs`, `PortraitMedallion` caption support via a wrapper)
- Modify: `src/data/fighters/tamil-nadu.ts` (Velu Nachiyar: `pronunciation`, `inAMinute`, `portraitNote`, `contentNote` example)
- Create: `tests/profile.spec.ts`

**Interfaces:**
- Produces: `Breadcrumbs({ items: { label: string; to?: string }[] })` in `ui.tsx`.
- Section ids on a profile, used by the contents menu and by trails linking into a life: `#in-a-minute`, `#story`, `#dates`, `#cost`, `#legacy`, `#connections`, `#sources`.
- Order of the page (from the proposal §6): hero (portrait + kind label, name, pronunciation, dates, place, one-sentence significance = `summary`) → In a minute → reading toolbar + Quick story / Detailed history with reading time and contents menu → A life in dates → The cost of resistance → Legacy → Connections + Similar stories (Task 6) → Sources + correction.

- [ ] **Step 1: Example content on one record**

In Velu Nachiyar's record (`src/data/fighters/tamil-nadu.ts`) add, after `alternateNames`:
```ts
    shortName: 'Velu Nachiyar',
    pronunciation: 'VAY-loo NAH-chee-yar',
    inAMinute: [
      'Queen of Sivaganga in the Tamil country, trained from childhood in riding, archery and languages.',
      'Widowed in 1772 when Company and Arcot forces killed her husband; spent eight years in hiding building alliances, then retook her kingdom around 1780.',
      'One of the first Indian rulers to defeat the East India Company in battle and win a kingdom back — decades before 1857.',
    ],
    portraitNote: { kind: 'stamp', caption: 'Commemorative postage stamp issued by India Post, 2008. No contemporary likeness of the queen survives.', credit: 'India Post', created: '2008' },
    editorial: { status: 'draft' },
```
(The record's `facts` already state the 2008 stamp; the portrait file's provenance must be checked by the owner — if the image is not the stamp, change `kind`/`caption` to what it actually is.)

- [ ] **Step 2: Failing spec**

Create `tests/profile.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('the profile follows the template: in a minute, contents menu, reading time, cost, legacy, sources', async ({ page }) => {
  await page.goto('/fighters/velu-nachiyar');
  await expect(page.getByText('Say it: VAY-loo NAH-chee-yar')).toBeVisible();
  await expect(page.getByText(/Commemorative postage stamp/)).toBeVisible();
  await expect(page.getByRole('region', { name: 'In a minute' }).getByRole('listitem')).toHaveCount(3);
  const contents = page.getByRole('navigation', { name: 'On this page' });
  for (const label of ['Story', 'Dates', 'Cost of resistance', 'Legacy', 'Sources']) {
    await expect(contents.getByRole('link', { name: label })).toBeVisible();
  }
  await expect(page.getByText(/\d+ min read/)).toBeVisible();
  await contents.getByRole('link', { name: 'Sources' }).click();
  await expect(page.locator('#sources')).toBeInViewport();
  await expect(page.getByRole('heading', { name: 'The cost of resistance' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('People');
});
```
Run: `npx playwright test tests/profile.spec.ts` — Expected: FAIL.

- [ ] **Step 3: `Breadcrumbs` in `ui.tsx`**

```tsx
/* ------------------------------------------------------------------ */
/* Breadcrumbs — where this record sits in the archive                 */
export function Breadcrumbs({ items, vault = false }: { items: { label: string; to?: string }[]; vault?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`font-body text-label ${vault ? 'text-paper-300' : 'text-ink-faint'}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {item.to ? (
              <Link to={item.to} className={`underline decoration-1 underline-offset-2 ${vault ? 'hover:text-paper-50' : 'hover:text-ink'}`}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={vault ? 'text-paper-100' : 'text-ink-soft'}>{item.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden="true">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```
Add `import { Link } from 'react-router-dom';` at the top of `ui.tsx`.

- [ ] **Step 4: Rebuild the page body**

In `src/pages/FighterProfilePage.tsx`:

Imports to add: `Breadcrumbs` from `@/components/ui`; `ReadingText, ReadingToolbar, DraftStamp` from `@/components/reading`; `readingMinutes, readingTimeLabel, wordCount` from `@/lib/reading`; `useLocation` from `react-router-dom`.

Hero — inside the `perf-all on-sheet` pane, first child:
```tsx
          <Breadcrumbs vault items={[{ label: 'Home', to: '/' }, { label: 'People', to: backTo }, { label: summary.name }]} />
```
where `backTo` is computed above `return`:
```ts
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const backTo = from && from.startsWith('/fighters?') ? from : '/fighters';
```
Under the `<h1>` add pronunciation and, under the medallion, the portrait kind:
```tsx
              {fighter?.pronunciation && (
                <p className={`mt-1 font-body text-label ${eraAccent.onInkMuted[accent]}`}>Say it: {fighter.pronunciation}</p>
              )}
```
```tsx
            <figure className="flex flex-col items-center gap-2">
              <PortraitMedallion name={summary.name} era={era} portrait={summary.portrait} size="hero" onPane />
              {fighter?.portraitNote && (
                <figcaption className={`max-w-[10rem] text-center font-body text-xs ${eraAccent.onInkMuted[accent]}`}>
                  <span className="stamp mr-1">{fighter.portraitNote.kind}</span>
                  {fighter.portraitNote.caption}
                </figcaption>
              )}
            </figure>
```
Body — replace the `<div className="min-w-0 space-y-12">` contents, in order:

```tsx
              {fighter.editorial?.status === 'draft' && <DraftStamp />}

              {fighter.contentNote && (
                <p role="note" className="rounded-sm border border-paper-400 bg-paper-200/60 p-4 font-body text-meta text-ink-soft">
                  <span className="stamp mr-2 text-sepia">Content note</span>
                  {fighter.contentNote}
                </p>
              )}

              {fighter.inAMinute && (
                <section id="in-a-minute" aria-label="In a minute" className="doc scroll-mt-28 p-5 sm:p-6">
                  <p className="label mb-3">In a minute</p>
                  <ol className="space-y-2.5">
                    {fighter.inAMinute.map((line, i) => (
                      <li key={i} className="flex gap-3 font-body text-meta text-ink">
                        <span className="num shrink-0 font-display text-sm font-bold text-brass-deep">{i + 1}</span>
                        {line}
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              <nav aria-label="On this page" className="flex flex-wrap gap-2">
                {[
                  ['#story', 'Story'],
                  ['#dates', 'Dates'],
                  fighter.sacrifices?.length ? ['#cost', 'Cost of resistance'] : null,
                  fighter.legacy ? ['#legacy', 'Legacy'] : null,
                  related.length || connections.length ? ['#connections', 'Connections'] : null,
                  ['#sources', 'Sources'],
                ]
                  .filter((x): x is [string, string] => Boolean(x))
                  .map(([href, label]) => (
                    <a key={href} href={href} className="chip min-h-9">
                      {label}
                    </a>
                  ))}
              </nav>

              <section id="story" aria-label="Life story" className="scroll-mt-28">
                <div className="rule-double mb-5" />
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-h2 text-ink">{mode === 'story' ? 'Quick story' : 'Detailed history'}</h2>
                  <ReadingToolbar />
                </div>
                <p className="label num mb-6">{readingTimeLabel(mode === 'story' ? readingMinutes(wordCount(fighter.shortStory.map((c) => c.text).join(' '))) : summary.readingMinutes)}</p>
                {mode === 'story' ? <StoryMode chapters={fighter.shortStory} accent={accent} sources={fighter.sources} /> : <ReadingText paragraphs={fighter.fullBiography} sources={fighter.sources} dropcap className="max-w-prose animate-fade-in" notesByParagraph={notesByParagraph(fighter.disputed)} />}
              </section>
```
(`connections` is `[]` until Task 6 defines it; declare `const connections: unknown[] = [];` for now and remove in Task 6.)

Keep the detail-only grid (entry, ideology, achievements) after the story. Then:
```tsx
              {timeline.length > 0 && (
                <section id="dates" aria-label="A life in dates" className="scroll-mt-28">
                  <h2 className="mb-5 text-h2 text-ink">A life in dates</h2>
                  {/* existing spine + EventCard list, unchanged */}
                </section>
              )}

              {fighter.sacrifices && fighter.sacrifices.length > 0 && (
                <section id="cost" aria-label="The cost of resistance" className="doc scroll-mt-28 p-6">
                  <div className="rule mb-4" />
                  <h2 className="text-h3 text-ink">The cost of resistance</h2>
                  <ul className="mt-3 space-y-2">
                    {fighter.sacrifices.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2.5 h-1 w-4 shrink-0 bg-brass" />
                        <ReadingText paragraphs={[item]} sources={fighter.sources} glossary={false} className="font-body text-meta text-ink-soft [&_p]:font-body [&_p]:text-meta" />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
```
Remove the `ListBlock title="Personal sacrifices"` from the detail grid (it is now this section). Quotes stay. Legacy gets `id="legacy"` and `scroll-mt-28`; the record-level `DisputedNotes` (notes without a paragraph) and facts follow. Move the existing `On the timeline` block into the `#dates` section above and delete its old position. The constellation section receives `id="connections"` (Task 6). `SourceList` already carries `id="sources"` (Task 2).

- [ ] **Step 5: Run**

Run: `npm run validate && npm run generate:summaries && npm run typecheck && npm run build && npx playwright test tests/profile.spec.ts tests/story-mode.spec.ts tests/bookmarks.spec.ts tests/copy.spec.ts tests/citations.spec.ts`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add src/pages/FighterProfilePage.tsx src/components/ui.tsx src/data/fighters/tamil-nadu.ts src/data/generated tests/profile.spec.ts
git commit -m "Profile template: in a minute, contents menu, reading time, cost of resistance, breadcrumbs

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Connections that say what the connection is

**Files:**
- Modify: `src/lib/content.ts` (`connectionsFor`, `similarFor`, `connectionLabel`)
- Create: `src/lib/connections.test.ts`
- Modify: `src/components/constellation.tsx`
- Modify: `src/pages/FighterProfilePage.tsx`
- Modify: `src/data/fighters/tamil-nadu.ts` (Velu Nachiyar ↔ Marudhu brothers), `src/data/fighters/revolt-1857.ts` (Lakshmibai ↔ Jhalkari Bai), `src/data/fighters/hsra-revolutionaries.ts` (Pritilata ↔ Surya Sen)
- Create: `tests/connections.spec.ts`

**Interfaces:**
- Produces (`src/lib/content.ts`):
  ```ts
  export interface ResolvedConnection { fighter: FighterSummary; type: ConnectionType; note: string; /** true when the other record declared it */ inferred: boolean }
  export function connectionsFor(fighter: FreedomFighter, all?: FreedomFighter[] /* full records, for reverse lookup */): ResolvedConnection[];
  export function similarFor(fighter: FreedomFighter, connections: ResolvedConnection[]): FighterSummary[];
  export const connectionLabel: Record<ConnectionType, string>;   // ally → "Ally", opponent → "Opponent", family → "Family", mentor → "Mentor", inspired → "Inspired", successor → "Successor"
  export const inverseType: Record<ConnectionType, ConnectionType>; // mentor ↔ successor-like inversion, see below
  ```
- `Constellation({ subject, connections, similar })` draws lines only for `connections`, labels each node with its type, lists each connection with its note beneath the diagram; `similar` renders as a separate "Similar stories" row.

Reverse lookup needs the other record's full data (connections live on the full record). Every fighter's full record is in a lazily loaded shard, so `connectionsFor` takes only the subject's own declarations at runtime; the build step makes them symmetric instead: `scripts/generate-summaries.ts` writes `src/data/generated/connections.ts` — a map from fighter id to its resolved (own + reverse) connections. Simpler for the app, and validated for staleness like the summaries.

- [ ] **Step 1: Failing unit test for the pure resolver**

Create `src/lib/connections.ts` (import-free logic) and its test. Test first, `src/lib/connections.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { resolveConnections } from './connections';

const records = [
  { id: 'a', connections: [{ id: 'b', type: 'mentor' as const, note: 'A taught B at the national school from 1906.' }] },
  { id: 'b', connections: [{ id: 'c', type: 'ally' as const, note: 'B and C planned the 1908 strike together.' }] },
  { id: 'c' },
];

describe('resolveConnections', () => {
  it('keeps declared connections and adds the reverse of the other side’s declarations', () => {
    const out = resolveConnections(records);
    expect(out.a).toEqual([{ id: 'b', type: 'mentor', note: 'A taught B at the national school from 1906.', inferred: false }]);
    expect(out.b).toEqual([
      { id: 'c', type: 'ally', note: 'B and C planned the 1908 strike together.', inferred: false },
      { id: 'a', type: 'successor', note: 'A taught B at the national school from 1906.', inferred: true },
    ]);
    expect(out.c).toEqual([{ id: 'b', type: 'ally', note: 'B and C planned the 1908 strike together.', inferred: true }]);
  });
  it('does not duplicate a connection both sides declared', () => {
    const out = resolveConnections([
      { id: 'a', connections: [{ id: 'b', type: 'ally' as const, note: 'Fought together at Kalayar Kovil in 1801.' }] },
      { id: 'b', connections: [{ id: 'a', type: 'ally' as const, note: 'Fought together at Kalayar Kovil in 1801.' }] },
    ]);
    expect(out.a).toHaveLength(1);
    expect(out.b).toHaveLength(1);
  });
});
```
Run: `npm run test:unit` — Expected: FAIL.

- [ ] **Step 2: Create `src/lib/connections.ts`**

```ts
/**
 * Resolves documented connections into a symmetric map, so a relationship
 * declared on one record shows on both. Import-free: scripts/generate-summaries.ts
 * runs it at build time and writes src/data/generated/connections.ts.
 */
export type ConnectionType = 'ally' | 'opponent' | 'family' | 'mentor' | 'inspired' | 'successor';

export interface ConnectionLike { id: string; type: ConnectionType; note: string }
export interface ResolvedConnectionLike extends ConnectionLike { inferred: boolean }

/** How the relationship reads from the other side. */
export const inverseType: Record<ConnectionType, ConnectionType> = {
  ally: 'ally',
  opponent: 'opponent',
  family: 'family',
  mentor: 'successor', // B was A's student / heir
  inspired: 'inspired', // A inspired B; from B's side: "inspired by" — same label, note carries direction
  successor: 'mentor',
};

export function resolveConnections(records: { id: string; connections?: ConnectionLike[] }[]): Record<string, ResolvedConnectionLike[]> {
  const out: Record<string, ResolvedConnectionLike[]> = {};
  for (const r of records) out[r.id] = (r.connections ?? []).map((c) => ({ ...c, inferred: false }));
  for (const r of records) {
    for (const c of r.connections ?? []) {
      const target = out[c.id];
      if (!target) continue; // validator already errors on unknown ids
      if (target.some((t) => t.id === r.id)) continue;
      target.push({ id: r.id, type: inverseType[c.type], note: c.note, inferred: true });
    }
  }
  return out;
}
```
Run: `npm run test:unit` — Expected: PASS.

- [ ] **Step 3: Generate `connections.ts` at build time and export from content**

In `scripts/generate-summaries.ts` add `import { resolveConnections } from '../src/lib/connections.ts';` and after the events file write:
```ts
writeGeneratedFile('src/data/generated/connections.ts', GENERATED_HEADER, "import type { ResolvedConnectionLike } from '@/lib/connections';", [
  { name: 'connectionsById', type: 'Record<string, ResolvedConnectionLike[]>', value: resolveConnections(fighters) },
]);
```
In `scripts/validate-content.ts` add the staleness check beside the summary ones:
```ts
import { connectionsById } from '../src/data/generated/connections.ts';
import { resolveConnections } from '../src/lib/connections.ts';
if (JSON.stringify(resolveConnections(fighters)) !== JSON.stringify(connectionsById)) {
  err('generated', 'connections.ts', 'is stale — run `npm run generate:summaries` and commit the result');
}
```
In `src/lib/content.ts`:
```ts
import { connectionsById } from '@/data/generated/connections';
import type { ConnectionType } from '@/lib/connections';

export interface ResolvedConnection { fighter: FighterSummary; type: ConnectionType; note: string; inferred: boolean }

export const connectionLabel: Record<ConnectionType, string> = { ally: 'Ally', opponent: 'Opponent', family: 'Family', mentor: 'Mentor', inspired: 'Inspired', successor: 'Successor' };

/** Documented connections, both declared and reverse-declared (see src/lib/connections.ts). */
export function connectionsFor(fighterId: string): ResolvedConnection[] {
  return (connectionsById[fighterId] ?? [])
    .map((c) => {
      const fighter = fighterById.get(c.id);
      return fighter ? { fighter, type: c.type, note: c.note, inferred: c.inferred } : null;
    })
    .filter((c): c is ResolvedConnection => c !== null);
}

/** People connected by theme only — `relatedPeople` minus anyone with a documented connection. */
export function similarFor(fighter: FreedomFighter, connections: ResolvedConnection[]): FighterSummary[] {
  const documented = new Set(connections.map((c) => c.fighter.id));
  return relatedFighters(fighter).filter((f) => !documented.has(f.id));
}
```

- [ ] **Step 4: Content — three documented connections, drafted from the records' own text**

`velu-nachiyar` (`tamil-nadu.ts`):
```ts
    connections: [
      { id: 'marudhu-brothers', type: 'ally', note: 'The Marudhu brothers helped her raise the army that retook Sivaganga around 1780; she then granted them administrative powers, and they later ruled the kingdom themselves.' },
    ],
```
`rani-lakshmibai` (`revolt-1857.ts`):
```ts
    connections: [
      { id: 'jhalkari-bai', type: 'ally', note: 'Jhalkari Bai served in and rose to command the Durga Dal, the women’s guard of Jhansi, and is remembered for impersonating the Rani during the fall of the city in April 1858 to cover her escape. That account rests largely on oral tradition.' },
      { id: 'tatya-tope', type: 'ally', note: 'After escaping Jhansi she joined Tatya Tope; together they seized the fortress of Gwalior in June 1858.' },
    ],
```
`pritilata-waddedar` (`hsra-revolutionaries.ts`):
```ts
    connections: [
      { id: 'surya-sen', type: 'mentor', note: 'She secretly joined Surya Sen’s revolutionary group in Chittagong, trained with weapons under it, and led its attack on the Pahartali European Club on 24 September 1932.' },
    ],
```
Each of these three records also gets `editorial: { status: 'draft' }` if it has none yet.

- [ ] **Step 5: Constellation with types, legend and list**

Replace the props and rendering in `src/components/constellation.tsx`:
```tsx
import { Link } from 'react-router-dom';
import type { FighterSummary } from '@/types';
import { eraById } from '@/data/eras';
import { connectionLabel, lifespan, type ResolvedConnection } from '@/lib/content';
import { useIsDesktop } from '@/lib/hooks';
import { PortraitMedallion, Reveal, eraAccent } from '@/components/ui';
import { FighterCard } from '@/components/cards';

/**
 * Documented connections drawn around the subject — a line only where a
 * relationship is on record, each node labelled with its type, and every
 * connection explained in the list beneath (which is also the phone view).
 */
export function Constellation({ subject, connections }: { subject: FighterSummary; connections: ResolvedConnection[] }) {
  const desktop = useIsDesktop();
  const nodes = connections.slice(0, 8);
  if (nodes.length === 0) return null;

  const list = (
    <ul className="space-y-3" aria-label="Documented connections">
      {nodes.map((c) => (
        <li key={c.fighter.id} className="rounded-sm border border-paper-100/20 p-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="stamp text-brass-bright">{connectionLabel[c.type]}</span>
            <Link to={`/fighters/${c.fighter.slug}`} className="font-display text-h4 font-bold text-paper-50 hover:text-brass-bright">
              {c.fighter.name}
            </Link>
            <span className="num font-body text-label text-paper-400">{lifespan(c.fighter)}</span>
          </div>
          <p className="mt-1.5 font-body text-meta text-paper-200">{c.note}</p>
        </li>
      ))}
    </ul>
  );

  if (!desktop) return list;

  const W = 900;
  const H = 480;
  const cx = W / 2;
  const cy = H / 2;
  const rx = 340;
  const ry = 170;
  const positions = nodes.map((_, i) => {
    const angle = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
    return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
  });
  const subjectEra = eraById.get(subject.era);

  return (
    <div className="space-y-8">
      <Reveal className="relative mx-auto w-full max-w-4xl" aria-label={`People connected to ${subject.name}`}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {positions.map((p, i) => {
            const era = eraById.get(nodes[i].fighter.era);
            const len = Math.round(Math.hypot(p.x - cx, p.y - cy) * 100) / 100;
            return (
              <line key={nodes[i].fighter.id} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={era ? eraAccent.hex[era.accent] : '#9c7f3a'} strokeOpacity="0.7" strokeWidth="1.2" className="draw" style={{ strokeDasharray: len, strokeDashoffset: len, '--draw-delay': `${i * 90}ms` } as React.CSSProperties} />
            );
          })}
          <circle cx={cx} cy={cy} r="86" fill="none" stroke="rgba(209,181,106,0.25)" strokeDasharray="2 6" />
        </svg>
        <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
          <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center" style={{ left: '50%', top: '50%' }}>
            <PortraitMedallion name={subject.name} era={subjectEra} portrait={subject.portrait} size="xl" />
            <p className="mt-2 font-display text-base font-bold text-paper-50">{subject.name}</p>
          </div>
          {nodes.map((c, i) => {
            const p = positions[i];
            const era = eraById.get(c.fighter.era);
            return (
              <Link key={c.fighter.id} to={`/fighters/${c.fighter.slug}`} className="group absolute flex w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center animate-fade-up" style={{ left: `${Math.round((p.x / W) * 10000) / 100}%`, top: `${Math.round((p.y / H) * 10000) / 100}%`, animationDelay: `${200 + i * 90}ms` }}>
                <span className="stamp mb-1 text-brass-bright">{connectionLabel[c.type]}</span>
                <PortraitMedallion name={c.fighter.name} era={era} portrait={c.fighter.portrait} size="md" className="transition-transform duration-400 ease-cinematic group-hover:scale-110" />
                <span className="mt-2 font-body text-xs font-medium leading-tight text-paper-100 transition-colors group-hover:text-brass-bright">{c.fighter.name}</span>
                <span className="num font-body text-xs text-paper-400">{lifespan(c.fighter)}</span>
              </Link>
            );
          })}
        </div>
      </Reveal>
      {list}
    </div>
  );
}

/** People connected by theme, not by documented contact — never drawn as lines. */
export function SimilarStories({ people, id }: { people: FighterSummary[]; id?: string }) {
  if (people.length === 0) return null;
  return (
    <section id={id} aria-label="Similar stories" className="container-page scroll-mt-28 pt-14">
      <div className="rule-double mb-5" />
      <h2 className="text-h2 text-ink">Similar stories</h2>
      <p className="mt-2 max-w-xl font-body text-meta text-ink-soft">People whose lives rhyme with this one — a theme, a region, a method — without a documented meeting. Read them as comparisons, not as comrades.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {people.slice(0, 6).map((f) => (
          <FighterCard key={f.id} fighter={f} compact />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Wire the profile**

In `FighterProfilePage.tsx`: import `connectionsFor, similarFor` from `@/lib/content` and `Constellation, SimilarStories` from `@/components/constellation`; replace the temporary `connections` declaration and `related` memo with:
```ts
  const connections = useMemo(() => (fighter ? connectionsFor(fighter.id) : []), [fighter]);
  const related = useMemo(() => (fighter ? similarFor(fighter, connections) : []), [fighter, connections]);
```
Replace the constellation section:
```tsx
          {connections.length > 0 && (
            <section id="connections" className="vault mt-14 scroll-mt-28 px-5 py-12 sm:mt-20 sm:px-8 sm:py-16" aria-label="Documented connections">
              <div className="container-page">
                <Reveal className="mb-8 max-w-2xl">
                  <div className="rule-double-vault mb-5" />
                  <h2 className="text-h2 text-paper-50">People connected to {summary.shortName ?? summary.name}</h2>
                  <p className="mt-2 font-body text-meta text-paper-300">Only relationships the record documents are drawn here — an ally, an opponent, a teacher, a family member — each with what the connection was.</p>
                </Reveal>
                <Constellation subject={summary} connections={connections} />
              </div>
            </section>
          )}
          <SimilarStories people={related} id={connections.length ? undefined : 'connections'} />
```
When there are no documented connections, `SimilarStories` carries the `#connections` anchor so the contents menu still lands somewhere.

- [ ] **Step 7: Spec**

Create `tests/connections.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('documented connections carry a type and an explanation; theme-only people are similar stories', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/fighters/velu-nachiyar');
  const connections = page.getByRole('list', { name: 'Documented connections' });
  await expect(connections.getByRole('listitem')).toHaveCount(1);
  await expect(connections).toContainText('Ally');
  await expect(connections).toContainText('Marudhu Pandiyar Brothers');
  await expect(connections).toContainText(/retook Sivaganga/);
  const similar = page.getByRole('region', { name: 'Similar stories' });
  await expect(similar.getByRole('link', { name: /Rani Lakshmibai/ })).toBeVisible();
  await expect(similar).toContainText('without a documented meeting');
});

test('the reverse side of a declared connection shows too', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/fighters/marudhu-brothers');
  const connections = page.getByRole('list', { name: 'Documented connections' });
  await expect(connections).toContainText('Rani Velu Nachiyar');
});
```
Run: `npm run generate:summaries && npm run validate && npm run typecheck && npm run test:unit && npm run build && npx playwright test tests/connections.spec.ts tests/profile.spec.ts tests/copy.spec.ts`
Expected: pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/connections.ts src/lib/connections.test.ts scripts/generate-summaries.ts scripts/validate-content.ts src/data/generated src/lib/content.ts src/components/constellation.tsx src/pages/FighterProfilePage.tsx src/data/fighters tests/connections.spec.ts
git commit -m "Typed, explained connections; theme-only relations become Similar stories

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Trails — data model, validation, progress store

**Files:**
- Modify: `src/types/index.ts` (`Trail`, `TrailStop`, `TrailActivity`, `TrailRef`)
- Create: `src/data/trails/index.ts` (empty array for now; Task 9 fills it)
- Modify: `scripts/validate-content.ts`, `src/lib/content.ts`
- Create: `src/lib/trails-progress.ts`, `src/lib/trails-progress.test.ts`
- Modify: `src/lib/hooks.ts` (`useTrailProgress`)

**Interfaces:**
```ts
// src/types/index.ts
export type TrailRef = { kind: 'fighter' | 'event' | 'movement'; id: string };
export interface TrailStop {
  id: string;                 // kebab, unique within the trail
  title: string;
  question?: string;          // the stop's guiding question
  text: string[];             // 1–3 short paragraphs; [^n] markers refer to `sources`
  focus: TrailRef;            // the record this stop is built on (visual + "Open the full story")
  also?: TrailRef[];          // further records worth opening
  sources: SourceRef[];       // at least one; copied from the focus record, so an update there is a prompt to update here
  uncertainty?: string;       // carried from the record's disputed notes when the stop touches them
  contentNote?: string;
  bridge: string;             // one sentence to the next stop; '' on the last
}
export type TrailActivity =
  | { kind: 'choice'; prompt: string; options: string[]; answerIndex: number; explanation: string }
  | { kind: 'order'; prompt: string; items: { label: string; year: number; ref?: TrailRef }[]; explanation: string };
export interface Trail {
  id: string; slug: string;
  version: number;            // bump when stop text changes; translations point at a version
  title: string; question: string; theme: string;
  minutes: number;            // approximate, design target until measured
  learningGoal: string;
  intro: string;
  accent: Era['accent'];
  stops: TrailStop[];         // 3–7
  reflection: string;         // a prompt, never a form
  activity: TrailActivity;
  followOn: { label: string; to: string };
  editorial: Editorial;
}
// src/lib/trails-progress.ts
export interface TrailProgress { stop: number; completed: boolean; updatedAt: string }
export type ProgressMap = Record<string, TrailProgress>;
export function parseProgress(raw: string | null): ProgressMap;
export function readProgress(): ProgressMap;
export function setStop(slug: string, stop: number): void;
export function markComplete(slug: string): void;
export function clearProgress(slug: string): void;
export function subscribeProgress(cb: () => void): () => void;
// src/lib/hooks.ts
export function useTrailProgress(): ProgressMap;
```

- [ ] **Step 1: Failing unit test**

Create `src/lib/trails-progress.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { parseProgress } from './trails-progress';

describe('parseProgress', () => {
  it('drops malformed entries and keeps well-formed ones', () => {
    const raw = JSON.stringify({ good: { stop: 2, completed: false, updatedAt: '2026-09-08T10:00:00.000Z' }, bad: { stop: 'two' }, worse: 7 });
    expect(parseProgress(raw)).toEqual({ good: { stop: 2, completed: false, updatedAt: '2026-09-08T10:00:00.000Z' } });
  });
  it('returns an empty map for nothing or garbage', () => {
    expect(parseProgress(null)).toEqual({});
    expect(parseProgress('nope')).toEqual({});
  });
});
```
Run: `npm run test:unit` — Expected: FAIL.

- [ ] **Step 2: Create `src/lib/trails-progress.ts`**

```ts
/**
 * Where a reader is in each trail, on this device only. No account, no
 * server, no streaks: a stop index, a completed flag and a timestamp so the
 * trails index can offer "Resume". Same store idiom as bookmarks.
 */
export interface TrailProgress {
  stop: number;
  completed: boolean;
  updatedAt: string;
}
export type ProgressMap = Record<string, TrailProgress>;

export const TRAILS_PROGRESS_KEY = 'ift-trails-v1';

export function parseProgress(raw: string | null): ProgressMap {
  let parsed: unknown = {};
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
  if (typeof parsed !== 'object' || parsed === null) return {};
  const out: ProgressMap = {};
  for (const [slug, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof value !== 'object' || value === null) continue;
    const v = value as Record<string, unknown>;
    if (typeof v.stop === 'number' && typeof v.completed === 'boolean' && typeof v.updatedAt === 'string') {
      out[slug] = { stop: v.stop, completed: v.completed, updatedAt: v.updatedAt };
    }
  }
  return out;
}

const listeners = new Set<() => void>();
let cache: ProgressMap | null = null;
export const EMPTY_PROGRESS: ProgressMap = {};

export function readProgress(): ProgressMap {
  if (cache) return cache;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(TRAILS_PROGRESS_KEY);
  } catch {
    /* in-memory only */
  }
  cache = parseProgress(raw);
  return cache;
}

function write(next: ProgressMap) {
  cache = next;
  try {
    localStorage.setItem(TRAILS_PROGRESS_KEY, JSON.stringify(next));
  } catch {
    /* in-memory only */
  }
  listeners.forEach((l) => l());
}

export function setStop(slug: string, stop: number) {
  const current = readProgress()[slug];
  write({ ...readProgress(), [slug]: { stop, completed: current?.completed ?? false, updatedAt: new Date().toISOString() } });
}

export function markComplete(slug: string) {
  const current = readProgress()[slug];
  write({ ...readProgress(), [slug]: { stop: current?.stop ?? 0, completed: true, updatedAt: new Date().toISOString() } });
}

export function clearProgress(slug: string) {
  const next = { ...readProgress() };
  delete next[slug];
  write(next);
}

export function subscribeProgress(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
```
Run: `npm run test:unit` — Expected: PASS.

In `src/lib/hooks.ts`:
```ts
import { EMPTY_PROGRESS, readProgress, subscribeProgress, type ProgressMap } from '@/lib/trails-progress';
export function useTrailProgress(): ProgressMap {
  return useSyncExternalStore(subscribeProgress, readProgress, () => EMPTY_PROGRESS);
}
```

- [ ] **Step 3: Types, empty collection, validator, content export**

Add the `Trail*` types from the Interfaces block to `src/types/index.ts` (import nothing new; `Era` and `Editorial` and `SourceRef` are in the same file).

Create `src/data/trails/index.ts`:
```ts
import type { Trail } from '@/types';

/** Guided trails — short editorial journeys through existing records. One file per trail; add new ones here. */
export const trails: Trail[] = [];

export const trailBySlug = new Map(trails.map((t) => [t.slug, t]));
```
`src/lib/content.ts`: `import { trails, trailBySlug } from '@/data/trails';` and export both.

`scripts/validate-content.ts`:
```ts
import { trails } from '../src/data/trails/index.ts';

const trailRefSchema = z.object({ kind: z.enum(['fighter', 'event', 'movement']), id: z.string().min(1) });
const trailStopSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  question: z.string().optional(),
  text: z.array(z.string().min(1).max(900)).min(1).max(3),
  focus: trailRefSchema,
  also: z.array(trailRefSchema).optional(),
  sources: z.array(sourceRefSchema).min(1),
  uncertainty: z.string().optional(),
  contentNote: z.string().optional(),
  bridge: z.string(),
});
const trailActivitySchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('choice'), prompt: z.string().min(1), options: z.array(z.string().min(1)).min(3).max(5), answerIndex: z.number().int(), explanation: z.string().min(1) }),
  z.object({ kind: z.literal('order'), prompt: z.string().min(1), items: z.array(z.object({ label: z.string().min(1), year: z.number().int(), ref: trailRefSchema.optional() })).min(3).max(6), explanation: z.string().min(1) }),
]);
const trailSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  version: z.number().int().min(1),
  title: z.string().min(1),
  question: z.string().min(1),
  theme: z.string().min(1),
  minutes: z.number().int().min(3).max(30),
  learningGoal: z.string().min(1),
  intro: z.string().min(1),
  accent: z.enum(['indigo', 'oxide', 'saffron', 'forest', 'sepia', 'brass']),
  stops: z.array(trailStopSchema).min(3).max(7),
  reflection: z.string().min(1),
  activity: trailActivitySchema,
  followOn: z.object({ label: z.string().min(1), to: z.string().regex(/^\//) }),
  editorial: editorialSchema,
});
checkSchema('trails', trails, trailSchema, (t) => t.id);
checkUnique('trails', trails);

function refExists(ref: { kind: string; id: string }): boolean {
  return ref.kind === 'fighter' ? fighterIds.has(ref.id) : ref.kind === 'event' ? eventIds.has(ref.id) : movementIds.has(ref.id);
}
for (const t of trails) {
  const stopIds = new Set<string>();
  for (const s of t.stops) {
    if (stopIds.has(s.id)) err('trails', t.id, `duplicate stop id "${s.id}"`);
    stopIds.add(s.id);
    if (!refExists(s.focus)) err('trails', t.id, `stop "${s.id}" focus ${s.focus.kind} "${s.focus.id}" does not exist`);
    for (const r of s.also ?? []) if (!refExists(r)) err('trails', t.id, `stop "${s.id}" also-ref ${r.kind} "${r.id}" does not exist`);
    checkCitations('trails', `${t.id}/${s.id}`, s.text, s.sources.length);
  }
  if (t.stops[t.stops.length - 1].bridge !== '') warn('trails', t.id, 'the last stop has a bridge sentence; nothing follows it');
  if (t.activity.kind === 'choice') {
    if (new Set(t.activity.options).size !== t.activity.options.length) err('trails', t.id, 'activity options are not distinct');
    if (t.activity.answerIndex < 0 || t.activity.answerIndex >= t.activity.options.length) err('trails', t.id, 'activity answerIndex out of range');
  } else {
    const years = t.activity.items.map((i) => i.year);
    if (new Set(years).size !== years.length) err('trails', t.id, 'order activity has two items with the same year');
    for (const i of t.activity.items) if (i.ref && !refExists(i.ref)) err('trails', t.id, `order item "${i.label}" ref does not exist`);
  }
  if (t.editorial.status === 'draft') warn('trails', t.id, 'editorial status is draft');
}
```
Add `trails.length` to the summary log line.

- [ ] **Step 4: Run and commit**

Run: `npm run validate && npm run typecheck && npm run test:unit`
Expected: pass; the summary reports `0 trails`.
```bash
git add src/types/index.ts src/data/trails/index.ts scripts/validate-content.ts src/lib/content.ts src/lib/trails-progress.ts src/lib/trails-progress.test.ts src/lib/hooks.ts
git commit -m "Trails: typed model, validation, per-device progress store

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Trail pages

**Files:**
- Create: `src/components/trails.tsx`, `src/pages/TrailPages.tsx`
- Modify: `src/lib/routes.tsx`, `scripts/lib/routes.mjs`
- Create: `tests/trails.spec.ts` (runs against Task 9's content; write it now, run it after Task 9)

**Interfaces:**
- Routes: `/trails` (index), `/trails/:slug` (overview), `/trails/:slug/stop/:n` (1-based), `/trails/:slug/finish`. Index and overview are prerendered (routes.mjs scans `src/data/trails` for slugs); stop and finish pages are client-rendered — they are reached by interaction and the SPA fallback serves direct links.
- Query: `?text=1` on a stop hides visuals (text-only route).
- `src/components/trails.tsx` exports `TrailCard({ trail, progress })`, `TrailProgress({ current, total, label })`, `ChoiceActivity({ activity, onDone })`, `OrderActivity({ activity, onDone })`.
- Events tracked: `trail_started` (overview → first stop), `trail_stop_viewed { trail, stop }`, `trail_completed { trail }`.

- [ ] **Step 1: Components — `src/components/trails.tsx`**

```tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Trail, TrailActivity } from '@/types';
import type { TrailProgress as Progress } from '@/lib/trails-progress';
import { Icon, Postmark, eraAccent, icons } from '@/components/ui';
import { DraftStamp } from '@/components/reading';

export function TrailCard({ trail, progress }: { trail: Trail; progress?: Progress }) {
  const resume = progress && !progress.completed && progress.stop > 0;
  const to = resume ? `/trails/${trail.slug}/stop/${progress.stop}` : `/trails/${trail.slug}`;
  return (
    <article className={`perf-all on-sheet relative flex h-full flex-col px-5 py-6 ${eraAccent.bg[trail.accent]} ${eraAccent.onInk[trail.accent]}`}>
      {progress?.completed && <Postmark lines={['Trail', 'complete']} className="absolute right-3 top-3 hidden sm:grid" />}
      <p className={`stamp w-fit ${eraAccent.onInkMuted[trail.accent]}`}>{trail.theme}</p>
      <h3 className="mt-3 text-h3">
        <Link to={to} className="hover:underline">
          {trail.title}
        </Link>
      </h3>
      <p className={`mt-2 font-reading text-reading italic ${eraAccent.onInkMuted[trail.accent]}`}>{trail.question}</p>
      <p className={`num mt-4 font-body text-label ${eraAccent.onInkMuted[trail.accent]}`}>
        {trail.stops.length} stops · about {trail.minutes} minutes
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
        <Link to={to} className="btn-seal !min-h-10 !px-4 text-label">
          {progress?.completed ? 'Read again' : resume ? `Resume at stop ${progress.stop}` : 'Start'}
          <Icon d={icons.arrowRight} className="h-4 w-4" />
        </Link>
        {trail.editorial.status !== 'reviewed' && <DraftStamp vault />}
      </div>
    </article>
  );
}

/** Position in the selected story — not a claim about history understood. */
export function TrailProgress({ current, total, label = 'Position in this trail' }: { current: number; total: number; label?: string }) {
  return (
    <div>
      <p className="label num">Stop {current} of {total}</p>
      <div role="progressbar" aria-label={label} aria-valuemin={1} aria-valuemax={total} aria-valuenow={current} className="mt-1.5 flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`h-1 flex-1 ${i < current ? 'bg-oxide' : 'bg-paper-300'}`} />
        ))}
      </div>
    </div>
  );
}

type Choice = Extract<TrailActivity, { kind: 'choice' }>;
type Order = Extract<TrailActivity, { kind: 'order' }>;

export function ChoiceActivity({ activity, onDone }: { activity: Choice; onDone: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="doc-mount p-5 sm:p-7">
      <p className="font-display text-h3 text-ink">{activity.prompt}</p>
      <div className="mt-5 grid gap-2">
        {activity.options.map((opt, i) => {
          const isAnswer = i === activity.answerIndex;
          let cls = 'border-paper-300 bg-paper-50 hover:border-ink';
          if (picked !== null) cls = isAnswer ? 'border-forest bg-forest-wash text-forest-deep font-semibold' : picked === i ? 'border-oxide bg-oxide-wash text-oxide-deep' : 'border-paper-300 bg-paper-50 opacity-60';
          return (
            <button key={opt} type="button" disabled={picked !== null} onClick={() => setPicked(i)} className={`flex min-h-12 items-center gap-3 rounded-sm border px-4 py-3 text-left font-body text-meta ${cls}`}>
              <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-current font-display text-meta font-bold">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-5 rounded-sm bg-paper-200/70 p-5">
          <p className="prose-reading">{picked === activity.answerIndex ? 'That’s it. ' : 'Not quite — and here is why it matters. '}{activity.explanation}</p>
          <button type="button" className="btn-seal mt-4" onClick={onDone}>
            Finish the trail
          </button>
        </div>
      )}
    </div>
  );
}

/** Tap-to-move ordering: no dragging, no timer. */
export function OrderActivity({ activity, onDone }: { activity: Order; onDone: () => void }) {
  const [order, setOrder] = useState(() => activity.items.map((_, i) => i));
  const [checked, setChecked] = useState(false);
  const correct = activity.items.map((_, i) => i).sort((a, b) => activity.items[a].year - activity.items[b].year);
  const isCorrect = checked && order.every((v, i) => v === correct[i]);
  const move = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    setOrder(next);
    setChecked(false);
  };
  return (
    <div className="doc-mount p-5 sm:p-7">
      <p className="font-display text-h3 text-ink">{activity.prompt}</p>
      <ol className="mt-5 space-y-2" aria-label="Your order">
        {order.map((idx, pos) => (
          <li key={idx} className="doc flex items-center gap-3 p-3">
            <span className="num w-6 font-display text-meta font-bold text-brass-deep">{pos + 1}</span>
            <span className="min-w-0 flex-1 font-body text-meta text-ink">{activity.items[idx].label}{checked && <span className="num ml-2 text-ink-faint">({activity.items[idx].year})</span>}</span>
            <button type="button" className="btn-ghost !min-h-11 !px-3" onClick={() => move(pos, -1)} disabled={pos === 0} aria-label={`Move "${activity.items[idx].label}" up`}>↑</button>
            <button type="button" className="btn-ghost !min-h-11 !px-3" onClick={() => move(pos, 1)} disabled={pos === order.length - 1} aria-label={`Move "${activity.items[idx].label}" down`}>↓</button>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-ghost" onClick={() => setChecked(true)}>Check the order</button>
        {checked && <p role="status" className="font-body text-meta text-ink-soft">{isCorrect ? 'In order.' : 'Not yet — the years are shown; try again or read the explanation.'}</p>}
      </div>
      {checked && (
        <div className="mt-5 rounded-sm bg-paper-200/70 p-5">
          <p className="prose-reading">{activity.explanation}</p>
          <button type="button" className="btn-seal mt-4" onClick={onDone}>Finish the trail</button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Pages — `src/pages/TrailPages.tsx`**

```tsx
import { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import type { TrailRef } from '@/types';
import { eventById, fighterById, movementById, trailBySlug, trails } from '@/lib/content';
import { usePageMeta, useTrailProgress, useUrlState } from '@/lib/hooks';
import { flag } from '@/lib/url-state';
import { markComplete, setStop } from '@/lib/trails-progress';
import { track } from '@/lib/analytics';
import { Breadcrumbs, Icon, PageIntro, Postmark, SourceList, eraAccent, icons } from '@/components/ui';
import { DraftStamp, ReadingText } from '@/components/reading';
import { ChoiceActivity, OrderActivity, TrailCard, TrailProgress } from '@/components/trails';
import { EventCard, FighterCard, MovementCard } from '@/components/cards';

const stopParams = { text: flag() };

/* `target`, not `ref`: React reserves the `ref` prop on function components. */
function RefCard({ target: r, compact = false }: { target: TrailRef; compact?: boolean }) {
  if (r.kind === 'fighter') {
    const f = fighterById.get(r.id);
    return f ? <FighterCard fighter={f} compact={compact} /> : null;
  }
  if (r.kind === 'event') {
    const e = eventById.get(r.id);
    return e ? <EventCard event={e} /> : null;
  }
  const m = movementById.get(r.id);
  return m ? <MovementCard movement={m} /> : null;
}

/* ------------------------------------------------------------------ */
export default function TrailsPage() {
  usePageMeta('Trails', 'Short guided journeys through the archive — a question, a handful of stops, and the evidence behind each one.');
  const progress = useTrailProgress();
  return (
    <div className="pb-20">
      <PageIntro title="Trails" lede="A trail is a short editorial journey: it starts with a question, moves through a few people, events and places with their sources beside them, and ends with something to think about. Stop and leave whenever you like — your place is kept on this device." />
      <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trails.map((t) => (
          <TrailCard key={t.id} trail={t} progress={progress[t.slug]} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function TrailPage() {
  const { slug } = useParams();
  const trail = slug ? trailBySlug.get(slug) : undefined;
  usePageMeta(trail?.title ?? 'Trail', trail?.question);
  const progress = useTrailProgress();
  if (!trail) return <Navigate to="/trails" replace />;
  const p = progress[trail.slug];
  const resume = p && !p.completed && p.stop > 0 ? p.stop : 1;
  return (
    <article>
      <header className="container-page pt-2">
        <div className={`perf-all on-sheet relative animate-fade-up px-5 py-7 sm:px-9 sm:py-10 ${eraAccent.bg[trail.accent]} ${eraAccent.onInk[trail.accent]} on-vault`}>
          <Postmark lines={['Trail', String(trail.stops.length), 'stops']} className="absolute right-4 top-5 hidden sm:grid" />
          <Breadcrumbs vault items={[{ label: 'Home', to: '/' }, { label: 'Trails', to: '/trails' }, { label: trail.title }]} />
          <p className={`stamp mt-5 w-fit ${eraAccent.onInkMuted[trail.accent]}`}>{trail.theme}</p>
          <h1 className="mt-3 max-w-3xl text-h1 sm:pr-28 sm:text-hero">{trail.title}</h1>
          <p className={`mt-4 max-w-2xl font-reading text-h4 italic ${eraAccent.onInkMuted[trail.accent]}`}>{trail.question}</p>
          <p className={`num mt-5 font-body text-label ${eraAccent.onInkMuted[trail.accent]}`}>
            {trail.stops.length} stops · about {trail.minutes} minutes · a text-only version is available on every stop
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to={`/trails/${trail.slug}/stop/${resume}`} className="btn-seal" onClick={() => track('trail_started', { trail: trail.slug })}>
              {resume > 1 ? `Resume at stop ${resume}` : 'Start the trail'}
              <Icon d={icons.arrowRight} className="h-4 w-4" />
            </Link>
            {trail.editorial.status !== 'reviewed' && <DraftStamp vault />}
          </div>
        </div>
      </header>
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_320px]">
        <div className="max-w-prose space-y-6">
          <p className="prose-reading dropcap">{trail.intro}</p>
          <div className="doc p-5">
            <p className="label mb-1">What you will be able to do</p>
            <p className="font-body text-meta text-ink">{trail.learningGoal}</p>
          </div>
        </div>
        <aside>
          <p className="label mb-3">The stops</p>
          <ol className="space-y-2">
            {trail.stops.map((s, i) => (
              <li key={s.id}>
                <Link to={`/trails/${trail.slug}/stop/${i + 1}`} className="doc-interactive flex items-baseline gap-3 p-3 font-body text-meta">
                  <span className="num font-display font-bold text-brass-deep">{i + 1}</span>
                  <span className="text-ink">{s.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
export function TrailStopPage() {
  const { slug, n } = useParams();
  const trail = slug ? trailBySlug.get(slug) : undefined;
  const index = Number(n) - 1;
  const stop = trail && Number.isInteger(index) && index >= 0 && index < trail.stops.length ? trail.stops[index] : undefined;
  const [{ text: textOnly }, setParams] = useUrlState(stopParams);
  usePageMeta(stop && trail ? `${stop.title} — ${trail.title}` : 'Trail', stop?.question ?? trail?.question);

  useEffect(() => {
    if (!trail || !stop) return;
    setStop(trail.slug, index + 1);
    track('trail_stop_viewed', { trail: trail.slug, stop: index + 1 });
  }, [trail, stop, index]);

  const focusEraAccent = useMemo(() => trail?.accent ?? 'brass', [trail]);
  if (!trail) return <Navigate to="/trails" replace />;
  if (!stop) return <Navigate to={`/trails/${trail.slug}`} replace />;

  const total = trail.stops.length;
  const prev = index > 0 ? `/trails/${trail.slug}/stop/${index}` : `/trails/${trail.slug}`;
  const next = index + 1 < total ? `/trails/${trail.slug}/stop/${index + 2}` : `/trails/${trail.slug}/finish`;

  return (
    <article>
      <header className="container-page pt-2">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Trails', to: '/trails' }, { label: trail.title, to: `/trails/${trail.slug}` }, { label: `Stop ${index + 1}` }]} />
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <TrailProgress current={index + 1} total={total} />
          <button type="button" className={`chip min-h-10 ${textOnly ? 'chip-active' : ''}`} aria-pressed={textOnly} onClick={() => setParams({ text: !textOnly })}>
            Text only
          </button>
        </div>
        <div className={`perf-all on-sheet relative mt-5 px-5 py-7 sm:px-9 sm:py-9 ${eraAccent.bg[focusEraAccent]} ${eraAccent.onInk[focusEraAccent]}`}>
          <p className={`stamp w-fit ${eraAccent.onInkMuted[focusEraAccent]}`}>{trail.title}</p>
          <h1 className="mt-3 text-h1">{stop.title}</h1>
          {stop.question && <p className={`mt-3 max-w-2xl font-reading text-h4 italic ${eraAccent.onInkMuted[focusEraAccent]}`}>{stop.question}</p>}
        </div>
      </header>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          {stop.contentNote && (
            <p role="note" className="rounded-sm border border-paper-400 bg-paper-200/60 p-4 font-body text-meta text-ink-soft">
              <span className="stamp mr-2 text-sepia">Content note</span>
              {stop.contentNote}
            </p>
          )}
          <ReadingText paragraphs={stop.text} sources={stop.sources} className="max-w-prose" />
          {stop.uncertainty && (
            <p role="note" aria-label="Uncertainty" className="max-w-prose border-l-2 border-oxide pl-4 font-body text-meta text-ink-soft">
              <span className="stamp mr-2 text-oxide-deep">Uncertain</span>
              {stop.uncertainty}
            </p>
          )}
          {stop.bridge && <p className="max-w-prose font-reading text-reading italic text-ink-soft">{stop.bridge}</p>}
          <SourceList sources={stop.sources} />
          <nav aria-label="Trail navigation" className="flex items-center justify-between gap-3 border-t border-paper-300 pt-6">
            <Link to={prev} className="btn-ghost !min-h-12">
              <Icon d={icons.arrowLeft} className="h-4 w-4" />
              {index > 0 ? 'Previous stop' : 'Overview'}
            </Link>
            <Link to={next} className="btn-seal !min-h-12">
              {index + 1 < total ? 'Next stop' : 'Finish'}
              <Icon d={icons.arrowRight} className="h-4 w-4" />
            </Link>
          </nav>
        </div>
        {!textOnly && (
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <p className="label">Open the full story</p>
            <RefCard target={stop.focus} />
            {stop.also?.map((r) => (
              <RefCard key={`${r.kind}-${r.id}`} target={r} compact />
            ))}
          </aside>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
export function TrailFinishPage() {
  const { slug } = useParams();
  const trail = slug ? trailBySlug.get(slug) : undefined;
  usePageMeta(trail ? `Finish — ${trail.title}` : 'Trail');
  const progress = useTrailProgress();
  if (!trail) return <Navigate to="/trails" replace />;
  const done = progress[trail.slug]?.completed ?? false;
  const finish = () => {
    if (!done) {
      markComplete(trail.slug);
      track('trail_completed', { trail: trail.slug });
    }
  };
  return (
    <article className="pb-20">
      <header className="container-page pt-2">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Trails', to: '/trails' }, { label: trail.title, to: `/trails/${trail.slug}` }, { label: 'Finish' }]} />
        <div className={`perf-all on-sheet relative mt-4 px-5 py-7 sm:px-9 sm:py-9 ${eraAccent.bg[trail.accent]} ${eraAccent.onInk[trail.accent]}`}>
          {done && <Postmark lines={['Trail', 'complete']} className="absolute right-4 top-5 hidden sm:grid" />}
          <h1 className="text-h1 sm:pr-28">{done ? 'Trail complete' : 'The end of the trail'}</h1>
          <p className={`mt-3 max-w-2xl font-reading text-h4 italic ${eraAccent.onInkMuted[trail.accent]}`}>{trail.question}</p>
        </div>
      </header>
      <div className="container-page max-w-3xl space-y-10 py-10">
        <section aria-label="Reflection" className="doc p-6">
          <p className="label mb-2">Something to think about</p>
          <p className="prose-reading">{trail.reflection}</p>
          <p className="mt-3 font-body text-label text-ink-faint">Talk it over, or keep it to yourself — nothing you think here is collected.</p>
        </section>
        <section aria-label="Knowledge check">
          <p className="label mb-3">One question, no score</p>
          {trail.activity.kind === 'choice' ? <ChoiceActivity activity={trail.activity} onDone={finish} /> : <OrderActivity activity={trail.activity} onDone={finish} />}
        </section>
        {done && (
          <section aria-label="Next" className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-indigo-mid/25 bg-indigo-wash/60 p-6">
            <p className="font-display text-h3 text-indigo-deep">Completed. Where next?</p>
            <div className="flex flex-wrap gap-2">
              <Link to={trail.followOn.to} className="btn-seal">{trail.followOn.label}</Link>
              <Link to={`/trails/${trail.slug}/stop/1`} className="btn-ghost">Read again</Link>
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Routes**

`src/lib/routes.tsx` — add before `/learn`:
```ts
  { path: '/trails', loader: () => import('@/pages/TrailPages') },
  { path: '/trails/:slug', loader: () => import('@/pages/TrailPages').then((m) => ({ default: m.TrailPage })) },
  { path: '/trails/:slug/stop/:n', loader: () => import('@/pages/TrailPages').then((m) => ({ default: m.TrailStopPage })) },
  { path: '/trails/:slug/finish', loader: () => import('@/pages/TrailPages').then((m) => ({ default: m.TrailFinishPage })) },
```
`scripts/lib/routes.mjs` — add `'/trails'` to `staticRoutes` and in `getAllRoutes` add `const trails = slugsFrom('src/data/trails', slugRe);` and `...trails.map((s) => `/trails/${s}`)`.

- [ ] **Step 4: Spec (runs after Task 9)**

Create `tests/trails.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('a trail can be completed keyboard-only, keeps its place, and marks completion', async ({ page }) => {
  await page.goto('/trails');
  await expect(page.getByRole('article')).toHaveCount(3);
  await page.getByRole('link', { name: 'Women who led resistance' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Women who led resistance' })).toBeVisible();
  await page.getByRole('link', { name: 'Start the trail' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/stop\/1$/);
  await expect(page.getByRole('progressbar', { name: 'Position in this trail' })).toHaveAttribute('aria-valuenow', '1');

  await page.getByRole('link', { name: 'Next stop' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/stop\/2$/);

  // Leave and come back: the index offers Resume at stop 2.
  await page.goto('/trails');
  await expect(page.getByRole('link', { name: 'Resume at stop 2' })).toBeVisible();

  // Text-only hides the record cards but keeps the prose and sources.
  await page.goto('/trails/women-who-led/stop/2?text=1');
  await expect(page.getByRole('button', { name: 'Text only' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Open the full story')).toHaveCount(0);
  await expect(page.locator('[data-reading-text] p').first()).toBeVisible();
  await expect(page.getByRole('region', { name: 'Sources and references' })).toBeVisible();

  // Walk to the end and finish.
  for (let i = 2; i < 5; i++) await page.getByRole('link', { name: 'Next stop' }).click();
  await page.getByRole('link', { name: 'Finish' }).click();
  await expect(page).toHaveURL(/\/finish$/);
  await page.getByRole('button', { name: /^A\b/ }).click();
  await page.getByRole('button', { name: 'Finish the trail' }).click();
  await expect(page.getByRole('heading', { name: 'Trail complete' })).toBeVisible();
  await page.goto('/trails');
  await expect(page.getByRole('link', { name: 'Read again' }).first()).toBeVisible();
});

test('a draft trail says so', async ({ page }) => {
  await page.goto('/trails/how-resistance-changed');
  await expect(page.getByText(/under editorial review/)).toBeVisible();
});
```

- [ ] **Step 5: Typecheck and commit (spec runs after Task 9)**

Run: `npm run typecheck`
```bash
git add src/components/trails.tsx src/pages/TrailPages.tsx src/lib/routes.tsx scripts/lib/routes.mjs tests/trails.spec.ts
git commit -m "Trail pages: index, overview, stops with text-only route, finish with activity

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: The first three trails (drafts, from the records' own text)

**Files:**
- Create: `src/data/trails/women-who-led.ts`, `src/data/trails/tamil-nadu-close-to-home.ts`, `src/data/trails/how-resistance-changed.ts`
- Modify: `src/data/trails/index.ts`

Every stop's `sources` below are the focus record's own `sources`, copied verbatim; citation markers point into that copy. All three trails are `editorial: { status: 'draft' }`. Text is drafted only from the records' `summary`/`shortStory`/`description`; the owner reviews and may rewrite before flipping to `reviewed`.

- [ ] **Step 1: `women-who-led.ts`**

```ts
import type { Trail } from '@/types';

export const womenWhoLed: Trail = {
  id: 'women-who-led',
  slug: 'women-who-led',
  version: 1,
  title: 'Women who led resistance',
  question: 'How did women lead resistance across two centuries — and what did it cost them?',
  theme: 'Leadership',
  minutes: 6,
  learningGoal: 'Name one woman who led resistance before 1857 and one during 1942, say what each resisted and what it cost her, and tell which of their stories rests on oral tradition.',
  intro:
    'Five women, five different centuries of the struggle and five different ways of leading: a queen who raised an army, a queen who defended a city, a schoolteacher who led an armed raid, a sixteen-year-old who took over a movement, and a student who ran a radio station. None of them worked together. Read them as five answers to the same question.',
  accent: 'sepia',
  stops: [
    {
      id: 'velu-nachiyar',
      title: 'A queen raises an army',
      question: 'What could a widowed queen do against the East India Company in the 1770s?',
      text: [
        'Velu Nachiyar was queen of Sivaganga in the Tamil country. In 1772 Company troops and the Nawab of Arcot’s forces killed her husband, and she escaped with her daughter, spending eight years in hiding while she planned her return.[^1]',
        'With help from Hyder Ali of Mysore and the Marudhu brothers she raised an army — including a women’s unit — and took Sivaganga back around 1780. Tamil Nadu remembers her as Veeramangai, the brave woman.[^2]',
      ],
      focus: { kind: 'fighter', id: 'velu-nachiyar' },
      also: [{ kind: 'fighter', id: 'marudhu-brothers' }],
      sources: [
        { title: 'Rani Velu Nachiyar commemorations', publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav', url: 'https://amritkaal.nic.in/', type: 'government', evidence: 'reference' },
        { title: 'Sivaganga District Gazetteer', publisher: 'Government of Tamil Nadu', type: 'archive', evidence: 'scholarship' },
      ],
      uncertainty: 'The celebrated account of her commander Kuyili setting the Company’s ammunition store ablaze comes from oral tradition and later retellings; no contemporary record confirms it.',
      bridge: 'Seventy years later another queen faced the Company — this time over who had the right to inherit a kingdom.',
    },
    {
      id: 'jhansi',
      title: 'Two women defend Jhansi',
      question: 'Who is remembered — and who was nearly forgotten — when a city falls?',
      text: [
        'When Rani Lakshmibai’s husband died, the British refused to accept her adopted son as heir and took Jhansi under the Doctrine of Lapse. In 1858 a British army besieged the city; she led the defence from the walls for two weeks, escaped through the enemy lines by night, joined Tatya Tope to seize Gwalior, and died in battle on 17 June 1858.[^1]',
        'Jhalkari Bai, from a Dalit family near Jhansi, served in and came to command the Durga Dal, the women’s guard. She is remembered for dressing as the Rani during the fall of the city to cover her escape. For a long time the history books left her out.',
      ],
      focus: { kind: 'fighter', id: 'rani-lakshmibai' },
      also: [
        { kind: 'fighter', id: 'jhalkari-bai' },
        { kind: 'event', id: 'siege-of-jhansi' },
      ],
      sources: [
        { title: 'The Rani of Jhansi: A Study in Female Heroism in India', author: 'Joyce Lebra-Chapman', publisher: 'University of Hawaii Press', year: 1986, type: 'book', evidence: 'scholarship' },
        { title: 'Rani Lakshmi Bai papers and despatches', publisher: 'National Archives of India', type: 'archive', evidence: 'contemporary' },
      ],
      uncertainty: 'Jhalkari Bai’s story rests largely on oral tradition written down much later; accounts of her fate after Jhansi differ. Accounts of exactly how and where Lakshmibai died on 17/18 June 1858 also differ.',
      contentNote: 'This stop includes deaths in battle.',
      bridge: 'By the 1930s resistance had new forms — and new leaders who were still in their teens and twenties.',
    },
    {
      id: 'pritilata',
      title: 'A headmistress leads a raid',
      question: 'Why would a philosophy graduate join an armed revolutionary group?',
      text: [
        'Pritilata Waddedar was one of Chittagong’s finest students; the authorities withheld her Calcutta degree because of her politics, and she became a school headmistress at twenty-one. Secretly she had joined Surya Sen’s revolutionary group and trained with weapons.[^1]',
        'On 24 September 1932 she led the attack on the Pahartali European Club, infamous for a sign barring “dogs and Indians”. Wounded in the retreat, she swallowed cyanide rather than be captured. Calcutta University finally conferred her degree in 2012.[^2]',
      ],
      focus: { kind: 'fighter', id: 'pritilata-waddedar' },
      also: [{ kind: 'event', id: 'chittagong-armoury-raid' }],
      sources: [
        { title: 'Do and Die: The Chittagong Uprising 1930–34', author: 'Manini Chatterjee', publisher: 'Penguin', year: 1999, type: 'book', evidence: 'scholarship' },
        { title: 'Pahartali case records', publisher: 'West Bengal State Archives', type: 'archive', evidence: 'contemporary' },
      ],
      contentNote: 'This stop describes a suicide.',
      bridge: 'In the hills of the North-East, at almost the same moment, a sixteen-year-old inherited a movement.',
    },
    {
      id: 'gaidinliu',
      title: 'Sixteen, and leading a rebellion',
      question: 'What does it cost to lead for fourteen years from inside a prison?',
      text: [
        'Gaidinliu was born among the Rongmei Nagas of Manipur and at thirteen joined her cousin Jadonang’s Heraka movement, which sought to revive Naga religion and end British rule in the hills. When the British hanged Jadonang in 1931, she took his place at sixteen: she told her people to pay no taxes, and her followers fought the Assam Rifles from village strongholds.[^1]',
        'Captured in 1932, she was sentenced to life imprisonment. Nehru met her in Shillong jail in 1937 and gave her the title Rani. Only free India could release her, in 1947.[^1]',
      ],
      focus: { kind: 'fighter', id: 'rani-gaidinliu' },
      sources: [
        { title: 'Rani Gaidinliu commemorative records', publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav', url: 'https://amritkaal.nic.in/', type: 'government', evidence: 'reference' },
        { title: 'Studies of the Heraka movement and Zeliangrong Nagas', publisher: 'Academic research on Northeast India', type: 'journal', evidence: 'scholarship' },
      ],
      bridge: 'In 1942 the leaders of the largest movement in the country were all in prison within a day. Someone had to keep it going.',
    },
    {
      id: 'usha-mehta',
      title: 'Calling from somewhere in India',
      question: 'How did people keep a movement going when its leaders were imprisoned?',
      text: [
        'When Quit India began in August 1942 and the Congress leadership was jailed overnight, the British controlled all the news. Usha Mehta, twenty-two, and her friends built a secret radio station. “This is Congress Radio, calling from 42.34 metres from somewhere in India,” she announced.[^1]',
        'For three months the station broadcast messages from the underground leaders, moving constantly to dodge detection vans. Betrayed in November 1942, she was arrested at the transmitter and spent four years in prison. She later became a professor of politics in Bombay.[^2]',
      ],
      focus: { kind: 'fighter', id: 'usha-mehta' },
      also: [{ kind: 'event', id: 'quit-india-launch' }],
      sources: [
        { title: 'Congress Radio: Usha Mehta and the Underground Radio Station of 1942', author: 'Usha Thakkar', publisher: 'Penguin', year: 2021, type: 'book', evidence: 'scholarship' },
        { title: 'Congress Radio case records', publisher: 'Maharashtra State Archives', type: 'archive', evidence: 'contemporary' },
      ],
      bridge: '',
    },
  ],
  reflection: 'Four of these five women were under thirty when they acted. Each gave something up — a kingdom, a degree, fourteen years, four years. Who helped each of them, and what did the people around them risk?',
  activity: {
    kind: 'choice',
    prompt: 'Which claim in this trail rests mainly on oral tradition rather than on a contemporary record?',
    options: ['Kuyili’s fire attack on the Sivaganga ammunition store', 'Pritilata Waddedar’s raid on the Pahartali European Club', 'Rani Gaidinliu’s life sentence in 1932', 'Usha Mehta’s arrest at the Congress Radio transmitter'],
    answerIndex: 0,
    explanation: 'The Pahartali raid, the sentence and the arrest are recorded in case files and contemporary papers. Kuyili’s attack is remembered through oral tradition and later retellings — the archive marks it as uncertain, and so should you when you retell it.',
  },
  followOn: { label: 'Meet more women of the movement', to: '/fighters?collection=women' },
  editorial: { status: 'draft', notes: 'Drafted 2026-09-08 from the five records’ own text. Needs historical review before the pilot.' },
};
```

- [ ] **Step 2: `tamil-nadu-close-to-home.ts`**

```ts
import type { Trail } from '@/types';

export const tamilNaduCloseToHome: Trail = {
  id: 'tamil-nadu-close-to-home',
  slug: 'tamil-nadu-close-to-home',
  version: 1,
  title: 'Resistance close to home: Tamil Nadu',
  question: 'What did resistance look like in one region across 150 years?',
  theme: 'Place',
  minutes: 6,
  learningGoal: 'Put four Tamil events in order across 1799–1932 and explain how the method of resistance changed from armed defence of a fort to breaking a law in public.',
  intro:
    'Tamil Nadu is a present-day state. In 1799 this was the country of the palaiyakkarars — chiefs with their own forts and soldiers — and then, for a century and a half, part of the Madras Presidency. The names of places have changed too: Tuticorin is Thoothukudi, Trichy is Tiruchirappalli. This trail follows one region from the first refusals to pay the Company to the last years before independence.',
  accent: 'forest',
  stops: [
    {
      id: 'panchalankurichi',
      title: 'The chief who would not pay',
      question: 'What happened to a ruler who refused the Company’s demand for tribute?',
      text: [
        'Kattabomman ruled Panchalankurichi, a small palaiyam in the far south. The East India Company demanded tribute; after a violent confrontation with the Collector in 1798, the Company resolved on his destruction. In September 1799 Major Bannerman’s army breached his fort after costly fighting, and he fled, only to be handed over by the ruler of Pudukkottai.[^1]',
        'Tried summarily at Kayathar on 16 October 1799 in front of the region’s chiefs, he was hanged from a tamarind tree the same day. The lesson misfired: within two years the whole south was in revolt.[^2]',
      ],
      focus: { kind: 'event', id: 'fall-of-panchalankurichi' },
      also: [{ kind: 'fighter', id: 'veerapandiya-kattabomman' }],
      sources: [
        { title: 'Poligar Rebellion records, 1799–1801', publisher: 'Tamil Nadu State Archives', type: 'archive', evidence: 'contemporary' },
        { title: 'Tirunelveli District Gazetteer', url: 'https://archive.org/details/in.ernet.dli.2015.161915', publisher: 'Government of Tamil Nadu', type: 'archive', evidence: 'scholarship' },
      ],
      uncertainty: 'The stirring speech attributed to Kattabomman before the Collector comes from Tamil ballads and a 1959 film; Company records confirm his defiance but not the words.',
      contentNote: 'This stop describes an execution.',
      bridge: 'The revolt that followed produced something new: a written call to Indians of every caste and religion to unite.',
    },
    {
      id: 'proclamation-1801',
      title: 'A proclamation on a temple wall',
      question: 'What is unusual about a call to unite issued in 1801?',
      text: [
        'In February 1801 Kattabomman’s brother Oomaithurai escaped from prison and the southern palaiyams rose again. The Marudhu brothers of Sivaganga sheltered him and gave him command, and a loose confederacy took shape from Malabar to Dindigul.[^1]',
        'In June 1801 the Marudhus’ proclamation was fixed to the walls of the Srirangam temple and Tiruchirappalli fort. It denounced the Company and summoned Indians of every caste and religion to expel it — a generation before the word “nation” entered Indian politics. The rising was crushed by November; the brothers were hanged at Tiruppathur on 24 October 1801.[^2]',
      ],
      focus: { kind: 'event', id: 'south-indian-rebellion-1801' },
      also: [
        { kind: 'fighter', id: 'marudhu-brothers' },
        { kind: 'fighter', id: 'velu-nachiyar' },
      ],
      sources: [
        { title: 'The South Indian Rebellion 1800–1801', author: 'K. Rajayyan', publisher: 'Rao and Raghavan, Mysore', year: 1971, type: 'book', evidence: 'scholarship' },
        { title: 'Marudhu Pandiyar memorial records, Kalayar Kovil', publisher: 'Government of Tamil Nadu', type: 'government', evidence: 'reference' },
      ],
      bridge: 'A century later the fight had moved from forts to ports, mills and the printing press.',
    },
    {
      id: 'tuticorin-1908',
      title: 'Swadeshi on the high seas',
      question: 'How did buying and selling become a form of resistance?',
      text: [
        'V. O. Chidambaram Pillai was a lawyer in the port of Tuticorin. In 1906 he founded the Swadeshi Steam Navigation Company to compete with the British shipping line — Swadeshi, the movement to buy Indian, taken to sea. The British company slashed fares to ruin him.[^1]',
        'In February 1908 he took up the cause of strikers at the European-owned Coral Mills and, with Subramania Siva, addressed swelling public meetings. On 12 March both were arrested; Tirunelveli erupted the next day, and police firing at Tuticorin killed four people. Pillai was sentenced to two life terms and set to a prison oil-press. Tamil Nadu calls him Kappalottiya Tamizhan, the Tamil who sailed the ship.[^2]',
      ],
      focus: { kind: 'fighter', id: 'vo-chidambaram-pillai' },
      also: [{ kind: 'event', id: 'tirunelveli-uprising-1908' }],
      sources: [
        { title: 'V.O.C. commemorative records', publisher: 'Government of Tamil Nadu / V.O. Chidambaranar Port Authority', type: 'government', evidence: 'reference' },
        { title: 'The Swadeshi Movement in the Madras Presidency (studies)', publisher: 'Academic research on South Indian nationalism', type: 'journal', evidence: 'scholarship' },
      ],
      bridge: 'In 1930 the method changed again: break one law, openly, together, and accept the prison that follows.',
    },
    {
      id: 'vedaranyam',
      title: 'Salt at Vedaranyam',
      question: 'Why walk 240 kilometres to pick up a handful of salt?',
      text: [
        'Days after Gandhi reached Dandi, the Tamil Nadu Congress launched its own salt satyagraha. On 13 April 1930 C. Rajagopalachari set out from Tiruchirappalli with about a hundred volunteers, marching through the Kaveri delta to the coast at Vedaranyam, welcomed in every village despite government threats to punish anyone who fed or sheltered them. On 30 April he lifted salt on the shore and was arrested.[^1]',
        'Mass arrests followed. Rukmini Lakshmipathi became the first woman in the Madras Presidency jailed in the movement, serving a year; the young K. Kamaraj served two. Vedaranyam made the salt satyagraha an all-India event.[^2]',
      ],
      focus: { kind: 'event', id: 'vedaranyam-salt-march' },
      also: [
        { kind: 'fighter', id: 'rukmini-lakshmipathi' },
        { kind: 'fighter', id: 'c-rajagopalachari' },
      ],
      sources: [
        { title: 'Vedaranyam salt satyagraha records, 1930', publisher: 'Tamil Nadu State Archives', type: 'archive', evidence: 'contemporary' },
        { title: 'Rajaji: A Life', author: 'Rajmohan Gandhi', publisher: 'Penguin', year: 1997, type: 'book', evidence: 'scholarship' },
      ],
      bridge: 'Two years later, in a textile town inland, the same movement asked the most of a young weaver.',
    },
    {
      id: 'tiruppur-1932',
      title: 'The one who protected the flag',
      question: 'What made carrying a piece of cloth an act of resistance?',
      text: [
        'Kumaran grew up in a weaving family near Erode and worked in the textile town of Tiruppur, where he founded a youth association to bring young workers into Gandhi’s movement. In January 1932, after Gandhi’s arrest, the British banned the national flag. Kumaran led a procession through Tiruppur carrying it anyway.[^1]',
        'Police attacked the marchers on the banks of the Noyyal river. Kumaran was beaten to the ground; witnesses saw the flag still raised in his hands when he died. He was twenty-seven. Tamil Nadu named him Kodi Kaatha Kumaran, the one who protected the flag.[^2]',
      ],
      focus: { kind: 'fighter', id: 'tiruppur-kumaran' },
      sources: [
        { title: 'Tiruppur Kumaran memorial records', publisher: 'Government of Tamil Nadu', type: 'government', evidence: 'reference' },
        { title: 'Commemorative stamp, 2004', publisher: 'India Post', type: 'government', evidence: 'reference' },
      ],
      contentNote: 'This stop describes a death from police violence.',
      bridge: '',
    },
  ],
  reflection: 'A fort, a proclamation, a shipping company, a handful of salt, a flag. Each is a different way of saying no. Which of them needed the most people to work — and which needed the fewest?',
  activity: {
    kind: 'order',
    prompt: 'Put these four moments from the Tamil country in the order they happened.',
    items: [
      { label: 'Salt is lifted on the shore at Vedaranyam', year: 1930, ref: { kind: 'event', id: 'vedaranyam-salt-march' } },
      { label: 'Kattabomman’s fort at Panchalankurichi falls', year: 1799, ref: { kind: 'event', id: 'fall-of-panchalankurichi' } },
      { label: 'The Coral Mills strike and the Tirunelveli rising', year: 1908, ref: { kind: 'event', id: 'tirunelveli-uprising-1908' } },
      { label: 'A proclamation is fixed to the walls of Srirangam temple', year: 1801, ref: { kind: 'event', id: 'south-indian-rebellion-1801' } },
    ],
    explanation: 'Panchalankurichi fell in 1799 and the proclamation followed in 1801 — armed resistance by chiefs and their forces. A century later, in 1908, the fight was over shipping, strikes and public meetings; by 1930 it was mass, open law-breaking. The order is also the story of how resistance changed.',
  },
  followOn: { label: 'Explore Tamil Nadu on the map', to: '/map?state=tamil-nadu' },
  editorial: { status: 'draft', notes: 'Drafted 2026-09-08 from the records’ own text. Present-day/historical place names to be checked by a reviewer.' },
};
```

- [ ] **Step 3: `how-resistance-changed.ts`**

```ts
import type { Trail } from '@/types';

export const howResistanceChanged: Trail = {
  id: 'how-resistance-changed',
  slug: 'how-resistance-changed',
  version: 1,
  title: 'How resistance changed, 1757–1947',
  question: 'How did the ways people resisted change over two centuries?',
  theme: 'Overview',
  minutes: 8,
  learningGoal: 'Describe three different methods of resistance from three different periods, and name one lesser-known person for each.',
  intro:
    'This archive covers 1757 to 1947 — a frame chosen for this collection, not a claim that resistance began on a single date. Six turning points, each with a well-known name and a less familiar one, show the methods changing: from rulers defending their lands, to petitions and assemblies, to boycott, to breaking the law in public, to a nationwide uprising without leaders. The six stops are a selection, not the whole story.',
  accent: 'indigo',
  stops: [
    {
      id: 'plassey',
      title: 'A trading company takes a province',
      question: 'How does a company end up ruling a country?',
      text: [
        'On 23 June 1757, by a mango grove on the Bhagirathi river, Robert Clive’s small Company force faced the far larger army of the young Nawab of Bengal. The battle was decided before it began: the Nawab’s commander had been bought, and most of his army never fought.[^1]',
        'Plassey gave a trading corporation control of India’s richest province. Bengal’s revenues paid for the Company’s armies, and over the next century its rule spread across the subcontinent — as did resistance to it, from rulers, peasants and Adivasi communities.[^2]',
      ],
      focus: { kind: 'event', id: 'battle-of-plassey' },
      also: [{ kind: 'fighter', id: 'puli-thevar' }],
      sources: [
        { title: 'The Anarchy: The Relentless Rise of the East India Company', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2019, type: 'book', evidence: 'scholarship' },
        { title: 'From Plassey to Partition and After', author: 'Sekhar Bandyopadhyay', publisher: 'Orient BlackSwan', year: 2015, type: 'book', evidence: 'scholarship' },
      ],
      bridge: 'A century of local risings followed. In 1857 they became one.',
    },
    {
      id: 'revolt-1857',
      title: 'Sepoys, queens and an eighty-year-old zamindar',
      question: 'Who joined the revolt of 1857, and why?',
      text: [
        'On 10 May 1857 sepoys at Meerut broke open the jail, killed their officers and rode through the night to Delhi, proclaiming the eighty-two-year-old Mughal emperor the sovereign of Hindustan. Within weeks whole populations had joined: Awadh under Begum Hazrat Mahal, Bihar under Kunwar Singh, and from March 1858 Rani Lakshmibai in besieged Jhansi.[^1]',
        'The grievances ran deeper than the greased cartridges that sparked it — annexed states, ruined artisans and landholders, and fear for religion and custom. The rising was suppressed by mid-1858 with great violence. It ended Company rule and brought India under the Crown.[^2]',
      ],
      focus: { kind: 'event', id: 'revolt-of-1857' },
      also: [
        { kind: 'fighter', id: 'kunwar-singh' },
        { kind: 'fighter', id: 'begum-hazrat-mahal' },
      ],
      sources: [
        { title: 'The Last Mughal: The Fall of a Dynasty, Delhi 1857', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2006, type: 'book', evidence: 'scholarship' },
        { title: 'Mutiny Papers, 1857', publisher: 'National Archives of India', url: 'https://www.abhilekh-patal.in/', type: 'archive', evidence: 'contemporary' },
      ],
      contentNote: 'This stop describes war and its suppression.',
      bridge: 'After 1857, a new generation tried a different instrument: an organisation, and a case argued in public.',
    },
    {
      id: 'congress-1885',
      title: 'Seventy-two people in a room',
      question: 'What can an annual meeting achieve against an empire?',
      text: [
        'On 28 December 1885 seventy-two lawyers, journalists, teachers and merchants from across British India met in Bombay and founded the Indian National Congress. Their resolutions were modest — more Indians in government, lower military spending — but an all-India political body was itself new.[^1]',
        'Dadabhai Naoroji, Surendranath Banerjee and later Gokhale and Tilak made its sessions the parliament of Indian opinion. In 1892 Naoroji won a seat in the British House of Commons by five votes and used it to argue India’s case. Within two generations the Congress would become, under Gandhi, a mass movement of millions.[^1]',
      ],
      focus: { kind: 'event', id: 'founding-of-the-indian-national-congress' },
      also: [
        { kind: 'fighter', id: 'dadabhai-naoroji' },
        { kind: 'fighter', id: 'surendranath-banerjee' },
      ],
      sources: [
        { title: 'India\'s Struggle for Independence 1857–1947', author: 'Bipan Chandra et al.', publisher: 'Penguin', year: 1989, type: 'book', evidence: 'scholarship' },
        { title: 'Congress centenary records', publisher: 'Nehru Memorial Museum & Library (PMML), New Delhi', type: 'archive', evidence: 'reference' },
      ],
      bridge: 'Petitions had limits. In 1905 the answer to a partition was to stop buying.',
    },
    {
      id: 'swadeshi-1905',
      title: 'Bonfires of foreign cloth',
      question: 'How did shopping become political?',
      text: [
        'Weeks before the partition of Bengal took effect, delegates met at Calcutta Town Hall on 7 August 1905 and resolved to boycott British goods. Bonfires of Manchester cloth followed; national schools, swadeshi mills and banks were founded, and the movement spread to Maharashtra, Punjab and the Madras coast.[^1]',
        'In Tuticorin, V. O. Chidambaram Pillai took swadeshi to sea with an Indian shipping company. In Stuttgart in 1907, Bhikaji Cama unfurled a flag of free India before a thousand socialist delegates. Swadeshi gave the movement an economic weapon and a cultural self-confidence; 7 August is now National Handloom Day.[^2]',
      ],
      focus: { kind: 'event', id: 'swadeshi-movement-launch' },
      also: [
        { kind: 'fighter', id: 'vo-chidambaram-pillai' },
        { kind: 'fighter', id: 'bhikaji-cama' },
      ],
      sources: [
        { title: 'The Swadeshi Movement in Bengal 1903–1908', author: 'Sumit Sarkar', publisher: 'People\'s Publishing House', year: 1973, type: 'book', evidence: 'scholarship' },
        { title: 'National Handloom Day', publisher: 'Ministry of Textiles, Government of India', type: 'government', evidence: 'reference' },
      ],
      bridge: 'After the First World War, Gandhi turned boycott into Non-Cooperation, and then into something bolder: breaking the law in the open.',
    },
    {
      id: 'salt-1930',
      title: 'A fistful of salt',
      question: 'Why choose a small tax to break a big law?',
      text: [
        'Gandhi chose the salt tax — a small, universal injustice touching the poorest. He left Sabarmati Ashram on 12 March 1930 with seventy-eight volunteers and walked for twenty-four days as the world’s press followed. At Dandi on the morning of 6 April he picked up a lump of natural salt.[^1]',
        'Salt was made and sold illegally along the coasts; Rajagopalachari marched to Vedaranyam in the south, where Rukmini Lakshmipathi became the Madras Presidency’s first woman jailed in the movement. Around 90,000 people — women in unprecedented numbers — filled the jails before the campaign paused in 1931.[^2]',
      ],
      focus: { kind: 'event', id: 'dandi-march' },
      also: [
        { kind: 'fighter', id: 'rukmini-lakshmipathi' },
        { kind: 'event', id: 'vedaranyam-salt-march' },
      ],
      sources: [
        { title: 'Gandhi: The Years That Changed the World', author: 'Ramachandra Guha', publisher: 'Penguin Allen Lane', year: 2018, type: 'book', evidence: 'scholarship' },
        { title: 'Dandi March records and photographs', publisher: 'National Gandhi Museum', type: 'museum', evidence: 'reference' },
      ],
      bridge: 'Twelve years later the leaders were gone within a day, and the movement carried on without them.',
    },
    {
      id: 'quit-india-1942',
      title: 'Do or die',
      question: 'What happens to a movement when every leader is arrested overnight?',
      text: [
        'On 8 August 1942 the Congress passed the Quit India resolution and Gandhi gave the country a mantra: “Do or Die.” Before dawn the entire leadership was arrested. The uprising that followed was the fiercest since 1857 — railways cut, police stations burned, parallel governments in Satara, Talcher and Tamluk, and Usha Mehta’s underground Congress Radio.[^1]',
        'Its cost fell on ordinary people: Kanaklata Barua, seventeen, shot carrying the flag at Gohpur; Kushal Konwar, hanged in 1943 for a derailment he opposed. Repression killed over a thousand by official count. Britain now knew India could not be held. Freedom came on 15 August 1947 — divided by Partition, whose casualty figures remain disputed.[^2]',
      ],
      focus: { kind: 'event', id: 'quit-india-launch' },
      also: [
        { kind: 'fighter', id: 'kanaklata-barua' },
        { kind: 'fighter', id: 'kushal-konwar' },
        { kind: 'event', id: 'independence-1947' },
      ],
      sources: [
        { title: 'Quit India Movement papers', publisher: 'National Archives of India', url: 'https://www.abhilekh-patal.in/', type: 'archive', evidence: 'contemporary' },
        { title: 'India\'s Struggle for Independence 1857–1947', author: 'Bipan Chandra et al.', publisher: 'Penguin', year: 1989, type: 'book', evidence: 'scholarship' },
      ],
      uncertainty: 'Estimates of deaths in Partition violence range from around 200,000 to 2 million, with roughly 10–20 million displaced; precise figures cannot be established.',
      contentNote: 'This stop includes killings and executions.',
      bridge: '',
    },
  ],
  reflection: 'Each stop had a famous name and a less familiar one. Pick one of the less familiar people. What would have been different if they had not acted?',
  activity: {
    kind: 'choice',
    prompt: 'Which of these appears for the first time in this trail with the Salt Satyagraha of 1930?',
    options: ['Armed defence of a fort against the Company', 'An all-India political organisation', 'Boycott of foreign goods', 'Deliberately breaking a law in public and accepting arrest'],
    answerIndex: 3,
    explanation: 'Forts were defended in 1799 and 1857, the Congress was founded in 1885, and boycott began in 1905. Openly breaking a specific law and accepting the punishment — satyagraha as a mass method — is what 1930 added, and 1942 inherited.',
  },
  followOn: { label: 'Browse the nine chapters', to: '/timeline?view=chapters' },
  editorial: { status: 'draft', notes: 'Drafted 2026-09-08 from the six event records and linked biographies. A qualified reviewer should check the Partition sentence before the pilot.' },
};
```

- [ ] **Step 4: Register**

`src/data/trails/index.ts`:
```ts
import type { Trail } from '@/types';
import { womenWhoLed } from './women-who-led';
import { tamilNaduCloseToHome } from './tamil-nadu-close-to-home';
import { howResistanceChanged } from './how-resistance-changed';

export const trails: Trail[] = [womenWhoLed, tamilNaduCloseToHome, howResistanceChanged];
export const trailBySlug = new Map(trails.map((t) => [t.slug, t]));
```

- [ ] **Step 5: Validate, build, run the trails spec**

Run: `npm run validate && npm run typecheck && npm run build && npx playwright test tests/trails.spec.ts tests/console-errors.spec.ts`
Expected: validator prints three `editorial status is draft` warnings and 0 errors; prerender writes `/trails` and the three overview pages; spec passes. Add `'/trails/women-who-led/stop/3'` to the console-errors routes.

- [ ] **Step 6: Commit**

```bash
git add src/data/trails tests/console-errors.spec.ts
git commit -m "Three draft trails: women who led, Tamil Nadu close to home, how resistance changed

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

**Owner input:** review the three trail texts, the glossary and the connections notes; set `editorial.status: 'reviewed'` with `reviewedBy` and `reviewedOn`.

---

### Task 10: Homepage, navigation, Start page, back links

**Files:**
- Create: `src/pages/StartPage.tsx`
- Modify: `src/pages/HomePage.tsx`, `src/components/layout.tsx`, `src/components/cards.tsx`, `src/pages/EventPage.tsx`, `src/lib/routes.tsx`, `scripts/lib/routes.mjs`
- Modify: `tests/navigation.spec.ts` (era-tile test now targets the "Browse by chapter" strip), create `tests/shell.spec.ts`

**Interfaces:**
- Cards (`FighterCard`, `FighterFeature`, `FighterChip`, `EventCard`, `EventRow`) pass `state={{ from: pathname + search }}` on their links; detail pages read `location.state.from` for the back target (profile: Stage 2 Task 5 already does; events here).
- Navigation: desktop `NAV` = Home, Timeline, People, Map, Trails, Learn. Phone bar = Home, Explore, Trails, Learn; `EXPLORE` sheet = Timeline, People, Map, Events, Movements, Glossary, About & sources.
- Homepage sequence: hero (headline retained; statement; primary "Start exploring" → `/start`; alternatives "Meet the people" → `/fighters`, "Explore by place" → `/map`) → Featured story (one person, hook = `inAMinute[0]` or summary, reading time) → Guided trails (3) → Stories beyond the familiar names (compact group) → Browse by chapter (the nine panes, secondary) → Explore by region (full names + state select + map link) → Today (ledger) + Continue your journey → Trust block.

- [ ] **Step 1: Failing spec**

Create `tests/shell.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('the home page leads with Start exploring, one featured story and the trails', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Start exploring' })).toHaveAttribute('href', '/start');
  await expect(page.getByRole('link', { name: 'Meet the people' })).toHaveAttribute('href', '/fighters');
  await expect(page.getByRole('link', { name: 'Explore by place' })).toHaveAttribute('href', '/map');
  const featured = page.getByRole('region', { name: 'Featured story' });
  await expect(featured.getByText(/\d+ min read/)).toBeVisible();
  await expect(page.getByRole('region', { name: 'Guided trails' }).getByRole('article')).toHaveCount(3);
  await expect(page.getByRole('region', { name: 'Stories beyond the familiar names' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Sources and corrections' })).toBeVisible();
});

test('/start offers a five-minute route and a longer one', async ({ page }) => {
  await page.goto('/start');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Start');
  await expect(page.getByRole('link', { name: /Five minutes/ })).toHaveAttribute('href', '/trails');
  await expect(page.getByRole('link', { name: /Longer/ })).toHaveAttribute('href', '/timeline?view=chapters');
});

test('the phone bar has four destinations and Explore opens the secondary routes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const bar = page.getByRole('navigation', { name: 'Primary' }).last();
  await expect(bar.getByRole('link')).toHaveCount(3); // Home, Trails, Learn
  await bar.getByRole('button', { name: 'Explore' }).click();
  const sheet = page.getByRole('dialog', { name: 'Explore the archive' });
  await expect(sheet.getByRole('link', { name: /Timeline/ })).toBeVisible();
  await expect(sheet.getByRole('link', { name: /Glossary/ })).toBeVisible();
});

test('back from a record returns to the filtered list', async ({ page }) => {
  await page.goto('/fighters?collection=women');
  await page.getByRole('link', { name: /Rani Lakshmibai/ }).first().click();
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'People' }).click();
  await expect(page).toHaveURL(/\/fighters\?collection=women$/);
});
```
Run: `npx playwright test tests/shell.spec.ts` — Expected: FAIL.

- [ ] **Step 2: Cards carry the list they came from**

In `src/components/cards.tsx`, import `useLocation` and inside `FighterCard`, `FighterFeature`, `FighterChip`, `EventCard`, `EventRow` add `const { pathname, search } = useLocation();` and `state={{ from: `${pathname}${search}` }}` on each `<Link>`. (Hydration-safe: `state` is not rendered.)

In `src/pages/EventPage.tsx` add breadcrumbs in the hero pane, same pattern as the profile:
```tsx
          <Breadcrumbs vault items={[{ label: 'Home', to: '/' }, { label: 'Events', to: backTo }, { label: summary.title }]} />
```
with `const backTo = from && from.startsWith('/events?') ? from : '/events';`.

- [ ] **Step 3: Navigation**

In `src/components/layout.tsx`:
```ts
const NAV = [
  { to: '/', label: 'Home', end: true, icon: 'M4 11 12 4l8 7v9H4z' },
  { to: '/timeline', label: 'Timeline', icon: 'M12 3v18M6 8h12M6 16h12' },
  { to: '/fighters', label: 'People', icon: icons.person },
  { to: '/map', label: 'Map', icon: icons.map },
  { to: '/trails', label: 'Trails', icon: 'M4 19c4-8 8 0 12-8s4 0 4 0' },
  { to: '/learn', label: 'Learn', icon: 'M4 5h16v11H4zM8 21h8M12 16v5' },
];
/* Phone bar: four destinations. Explore opens everything else. */
const PHONE_NAV = NAV.filter((n) => ['/', '/trails', '/learn'].includes(n.to));
const EXPLORE = [
  { to: '/timeline', label: 'Timeline', icon: icons.clock, hint: 'Nine chapters, 1757–1947' },
  { to: '/fighters', label: 'People', icon: icons.person, hint: 'Every life in the archive' },
  { to: '/map', label: 'Map', icon: icons.map, hint: 'Explore by state and region' },
  { to: '/events', label: 'Events', icon: icons.clock, hint: 'Every dated moment' },
  { to: '/movements', label: 'Movements', icon: icons.flag, hint: 'The many roads to freedom' },
  { to: '/glossary', label: 'Glossary', icon: icons.file, hint: 'The words this history is told in' },
  { to: '/about', label: 'About & sources', icon: icons.file, hint: 'Historical method and corrections' },
];
```
In `MobileNav`: map `PHONE_NAV` instead of `NAV`; the extra button is labelled `Explore` with `aria-label="Explore"`, opens `BottomSheet title="Explore the archive"` listing `EXPLORE`; `moreActive` becomes `EXPLORE.some(...)`. Insert the Explore button second (after Home) so the order reads Home · Explore · Trails · Learn:
```tsx
          {PHONE_NAV.slice(0, 1).map(renderItem)}
          <button ...>Explore</button>
          {PHONE_NAV.slice(1).map(renderItem)}
```
Footer "Explore" list: add `['/trails', 'Trails']`, `['/start', 'Start here']`.

- [ ] **Step 4: `/start`**

Create `src/pages/StartPage.tsx`:
```tsx
import { Link } from 'react-router-dom';
import { trails } from '@/lib/content';
import { usePageMeta, useTrailProgress } from '@/lib/hooks';
import { Icon, PageIntro, icons } from '@/components/ui';
import { TrailCard } from '@/components/trails';

export default function StartPage() {
  usePageMeta('Start exploring', 'New here? Two minutes on what this archive is and how to read it, then a five-minute trail or the full timeline.');
  const progress = useTrailProgress();
  return (
    <div className="pb-20">
      <PageIntro title="Start exploring" lede="This is an archive of the people who resisted British rule in India between 1757 and 1947 — the famous names and, above all, the ones most of us were never taught." />
      <div className="container-page space-y-14">
        <section className="max-w-prose space-y-5" aria-label="How to read this archive">
          <p className="prose-reading">Every person has a quick story and a detailed history. Every claim that matters carries a small numbered marker: touch it to see the source. Words like <em>satyagraha</em> or <em>palaiyakkarar</em> are explained the first time they appear.</p>
          <p className="prose-reading">Where historians disagree, or where a story rests on memory rather than documents, the page says so. Nothing here is invented — including the portraits: where no verified likeness exists, you will see a monogram instead.</p>
        </section>
        <section aria-label="Choose a route" className="grid gap-4 sm:grid-cols-2">
          <Link to="/trails" className="doc-interactive group flex flex-col p-6">
            <span className="stamp w-fit text-oxide-deep">Five minutes</span>
            <span className="mt-3 font-display text-h3 text-ink group-hover:text-oxide">Follow a trail</span>
            <span className="mt-2 font-body text-meta text-ink-soft">A question, five or six stops, the evidence beside each one. Your place is kept on this device.</span>
            <Icon d={icons.arrowRight} className="mt-auto h-4 w-4 text-brass-deep" />
          </Link>
          <Link to="/timeline?view=chapters" className="doc-interactive group flex flex-col p-6">
            <span className="stamp w-fit text-sepia">Longer</span>
            <span className="mt-3 font-display text-h3 text-ink group-hover:text-oxide">Read the chapters</span>
            <span className="mt-2 font-body text-meta text-ink-soft">Nine chapters from Plassey to midnight, each with what was changing, its people and its events.</span>
            <Icon d={icons.arrowRight} className="mt-auto h-4 w-4 text-brass-deep" />
          </Link>
        </section>
        <section aria-label="Trails" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trails.map((t) => (
            <TrailCard key={t.id} trail={t} progress={progress[t.slug]} />
          ))}
        </section>
      </div>
    </div>
  );
}
```
Register `{ path: '/start', loader: () => import('@/pages/StartPage') }` in `routes.tsx` and `'/start'` in `routes.mjs` `staticRoutes`.

- [ ] **Step 5: Homepage**

Rewrite the body of `src/pages/HomePage.tsx`. Keep `Hero`'s pane but change its buttons and text; move the era strip into its own section; drop the forgotten-heroes grid, women grid, key-events filmstrip, facts pair and movements grid (all still live on their own pages):

Hero pane changes:
```tsx
        <p className="mt-4 max-w-xl font-reading text-reading text-paper-200 sm:mt-6 sm:text-h4">
          Discover the people who resisted British rule — from the first risings against the East India Company to the midnight of 15 August 1947 — especially the lives most of us were never taught.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
          <Link to="/start" className="btn-seal">
            Start exploring <Icon d={icons.arrowRight} className="h-4 w-4" />
          </Link>
          <Link to="/fighters" className="btn-ghost-vault">Meet the people</Link>
          <Link to="/map" className="btn-ghost-vault">Explore by place</Link>
        </div>
```
(Remove `discoverRandom`, `busy`, `useNavigate`, `randomPick` from the file.)

Page body:
```tsx
export default function HomePage() {
  usePageMeta('', "Millions resisted. Thousands sacrificed. Discover the people who fought for India's freedom, 1757 to 1947 — with the evidence beside every story.");
  const trail = useTrail();
  const progress = useTrailProgress();
  const featured = useMemo(() => dailyPick(fighters.filter((f) => f.featured), 1), []);
  const beyond = useMemo(() => dailyShuffle(fighters.filter((f) => f.forgotten), 2).slice(0, 6), []);
  const trailFighters = trail.map((s) => fighterBySlug.get(s)).filter(Boolean).slice(0, 4);

  return (
    <div>
      <Hero />
      <div className="container-page space-y-14 pt-14 sm:space-y-20 sm:pt-16">
        <section aria-label="Featured story">
          <SectionHeading title="Featured story" />
          <Link to={`/fighters/${featured.slug}`} className="doc-interactive group grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
            <PortraitMedallion name={featured.name} era={eraById.get(featured.era)} portrait={featured.portrait} size="xl" />
            <div className="min-w-0">
              <p className="font-display text-h2 text-ink group-hover:text-oxide">{featured.name}</p>
              <p className="num mt-1 label">{lifespan(featured)} · {featured.states[0]} · {readingTimeLabel(featured.readingMinutes)}</p>
              <p className="prose-reading mt-4 max-w-prose">{featured.inAMinute?.[0] ?? featured.summary}</p>
              <p className="mt-4 inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep">
                Open the story <Icon d={icons.arrowRight} className="h-4 w-4" />
              </p>
            </div>
          </Link>
        </section>

        <section aria-label="Guided trails">
          <SectionHeading title="Guided trails" lede="Short journeys with a question at the start and the evidence at every stop." action={<Link to="/trails" className="btn-ghost">All trails</Link>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trails.map((t) => (
              <TrailCard key={t.id} trail={t} progress={progress[t.slug]} />
            ))}
          </div>
        </section>

        <section aria-label="Stories beyond the familiar names">
          <SectionHeading title="Stories beyond the familiar names" lede="Weavers, schoolteachers, hill chiefs and queens whose records deserve to be read." action={<Link to="/fighters?collection=forgotten" className="btn-ghost">More</Link>} />
          <div className="flex flex-wrap gap-2">
            {beyond.map((f) => (
              <FighterChip key={f.id} fighter={f} />
            ))}
          </div>
        </section>

        <section aria-label="Browse by chapter">
          <SectionHeading title="Browse by chapter" lede="Nine chapters, 1757–1947. Boundaries are aids to navigation, not hard breaks in history." />
          <ol className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-9" aria-label="Eras of the freedom struggle">
            {/* the existing era panes, unchanged */}
          </ol>
        </section>
      </div>

      <section className="vault mt-14 px-5 py-12 sm:mt-20 sm:px-8 sm:py-16" aria-label="Explore by region">
        <div className="container-page">
          <SectionHeading vault title="Explore by state and region" lede="Choose a place you know. Tiles on the map show present-day states, not historical boundaries." action={<Link to="/map" className="btn-seal !min-h-10 !px-4 text-label">Open the map <Icon d={icons.arrowRight} className="h-4 w-4" /></Link>} />
          <div className="flex flex-wrap gap-2">
            {(Object.keys(regionNames) as RegionId[]).map((r) => (
              <Link key={r} to={`/fighters?region=${r}`} className="chip-vault min-h-10">
                {regionNames[r]}
              </Link>
            ))}
          </div>
          <label className="mt-6 block max-w-sm">
            <span className="label-vault mb-1.5 block">Or pick a state</span>
            <StateSelect />
          </label>
        </div>
      </section>

      <div className="container-page space-y-14 pt-14 sm:space-y-20 sm:pt-16">
        <TodayLedger />
        {trailFighters.length > 0 && (
          <Reveal as="section" aria-label="Continue your journey" className="rounded-sm border border-indigo-mid/30 bg-indigo-wash/60 p-5">
            <p className="label mb-3">Continue your journey</p>
            <div className="flex flex-wrap gap-2">
              {trailFighters.map((f) => (
                <FighterChip key={f!.id} fighter={f!} />
              ))}
            </div>
          </Reveal>
        )}
        <section aria-label="Sources and corrections" className="doc p-6">
          <div className="rule mb-4" />
          <h2 className="text-h3 text-ink">Held carefully</h2>
          <p className="prose-reading mt-3 max-w-prose">Every biography and event cites its sources, claim by claim. Where historians dispute something, the page says so. If you find an error, you can suggest a correction from any record, and an editor will check it against the sources.</p>
          <Link to="/about" className="mt-4 inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep underline decoration-oxide-deep/40 underline-offset-4">
            How this archive is built <Icon d={icons.arrowRight} className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
```
`StateSelect` is a small component in the same file: a `<select>` of `states` that `navigate('/map?state=' + id)` on change (import `useNavigate`, `states` from `@/data/regions`). Imports to add: `readingTimeLabel` from `@/lib/reading`; `lifespan`, `trails` from `@/lib/content`; `useTrailProgress`; `TrailCard`; `PortraitMedallion`; `eraById`; `FighterChip`. Remove unused imports (`FighterCard`, `FighterFeature`, `EventCard`, `MovementCard`, `FactCard`, `didYouKnowFacts`, `events`, `movements`, `eras` if unused by the strip — the strip still uses `eras`).

- [ ] **Step 6: Update the navigation spec's era-tile step**

In `tests/navigation.spec.ts`, the home-page chapter test clicks `page.getByRole('link', { name: /1905.*Swadeshi/ })` — unchanged, since the panes still exist under "Browse by chapter".

- [ ] **Step 7: Run**

Run: `npm run typecheck && npm run build && npx playwright test tests/shell.spec.ts tests/navigation.spec.ts tests/copy.spec.ts tests/accessibility.spec.ts tests/console-errors.spec.ts`
Expected: pass. Add `'/start'` and `'/trails'` to the console-errors routes.

- [ ] **Step 8: Commit**

```bash
git add src/pages/StartPage.tsx src/pages/HomePage.tsx src/components/layout.tsx src/components/cards.tsx src/pages/EventPage.tsx src/lib/routes.tsx scripts/lib/routes.mjs tests/shell.spec.ts tests/console-errors.spec.ts
git commit -m "Home leads with Start exploring, a featured story and trails; four-item phone bar with Explore

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: A quiz that teaches

**Files:**
- Modify: `src/pages/LearnPage.tsx` (`Quiz`)
- Modify: `tests/quiz.spec.ts`

**Interfaces:**
- Quiz flow: start screen (topic: All / People / Events / Movements / Places; difficulty: Any / 1 / 2 / 3; five questions) → questions (explanation after each answer, plus `whyItMatters` when present) → review (missed questions with correct answer and link; "Retry the ones I missed"; "New set"). No timer, no score in the heading; a plain "x of n answered correctly" line on the review.

- [ ] **Step 1: Replace the spec**

`tests/quiz.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('the quiz starts from a topic screen, explains every answer, and reviews what was missed', async ({ page }) => {
  await page.goto('/learn');
  const quiz = page.getByRole('region', { name: 'History quiz' });
  await expect(quiz.getByText(/no timer/i)).toBeVisible();
  await quiz.getByRole('button', { name: 'Events' }).click();
  await quiz.getByRole('button', { name: 'Start quiz' }).click();

  const question = quiz.locator('p.text-h3');
  await expect(question).toBeVisible();
  await expect(quiz.getByText('Question 1 of 5')).toBeVisible();
  const options = quiz.locator('button:has(span.num)');
  for (let i = 0; i < 5; i++) {
    await options.last().click(); // deliberately often wrong
    await expect(quiz.getByRole('region', { name: 'Explanation' })).toBeVisible();
    await quiz.getByRole('button', { name: /Next question|See review/ }).click();
  }
  await expect(quiz.getByRole('heading', { name: 'Review' })).toBeVisible();
  await expect(quiz.getByText(/of 5 answered correctly/)).toBeVisible();
  const missed = quiz.getByRole('list', { name: 'Questions to revisit' });
  if ((await missed.count()) > 0) {
    await expect(missed.getByRole('link').first()).toBeVisible();
    await quiz.getByRole('button', { name: 'Retry the ones I missed' }).click();
    await expect(quiz.getByText(/Question 1 of/)).toBeVisible();
  } else {
    await quiz.getByRole('button', { name: 'New set' }).click();
    await expect(quiz.getByText(/no timer/i)).toBeVisible();
  }
});
```

- [ ] **Step 2: Rewrite `Quiz` in `LearnPage.tsx`**

```tsx
type Topic = QuizTopic | 'all';
type Difficulty = 1 | 2 | 3 | 'any';

function pickQuestions(topic: Topic, difficulty: Difficulty, daily: boolean): ShuffledQuestion[] {
  const pool = quizQuestions.filter((q) => (topic === 'all' || q.topic === topic) && (difficulty === 'any' || q.difficulty === difficulty));
  const ordered = daily ? dailyShuffle(pool, 11) : [...pool].sort(() => Math.random() - 0.5);
  /* Short sets: five questions, never a long test. */
  return ordered.slice(0, 5).map((q, i) => {
    const answer = q.options[q.answerIndex];
    const options = daily ? dailyShuffle(q.options, i) : [...q.options].sort(() => Math.random() - 0.5);
    return { ...q, options, answerIndex: options.indexOf(answer) };
  });
}

function Quiz() {
  const [stage, setStage] = useState<'start' | 'play' | 'review'>('start');
  const [topic, setTopic] = useState<Topic>('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('any');
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const start = (set: ShuffledQuestion[]) => {
    setQuestions(set);
    setIndex(0);
    setPicked(null);
    setAnswers({});
    setStage('play');
  };
  const missed = questions.filter((q) => answers[q.id] !== q.answerIndex);

  if (stage === 'start') {
    const pool = quizQuestions.filter((q) => (topic === 'all' || q.topic === topic) && (difficulty === 'any' || q.difficulty === difficulty)).length;
    return (
      <div className="doc-mount p-5 sm:p-7">
        <p className="font-body text-meta text-ink-soft">Five questions, an explanation after each one, and no timer. Pick a topic and how deep to go.</p>
        <div className="mt-5 space-y-4">
          <ChipGroup label="Topic" options={[{ value: 'people' as Topic, label: 'People' }, { value: 'events' as Topic, label: 'Events' }, { value: 'movements' as Topic, label: 'Movements' }, { value: 'places' as Topic, label: 'Places' }]} value={topic === 'all' ? null : topic} onChange={(v) => setTopic(v ?? 'all')} />
          <ChipGroup label="Depth" allLabel="Any" options={[{ value: 1 as Difficulty, label: 'Recognise' }, { value: 2 as Difficulty, label: 'Explain' }, { value: 3 as Difficulty, label: 'Go deeper' }]} value={difficulty === 'any' ? null : difficulty} onChange={(v) => setDifficulty(v ?? 'any')} />
        </div>
        <button type="button" className="btn-seal mt-6" disabled={pool < 3} onClick={() => start(pickQuestions(topic, difficulty, true))}>
          Start quiz
        </button>
        {pool < 3 && <p className="mt-2 font-body text-label text-ink-faint">Not enough questions for that combination yet — widen the topic or depth.</p>}
      </div>
    );
  }

  if (stage === 'review') {
    const right = questions.length - missed.length;
    return (
      <div className="doc-mount p-5 sm:p-7 animate-fade-up">
        <h3 className="text-h3 text-ink">Review</h3>
        <p className="num mt-1 font-body text-meta text-ink-soft">{right} of {questions.length} answered correctly. Every question you missed is a story waiting to be read.</p>
        {missed.length > 0 && (
          <ul className="mt-5 space-y-3" aria-label="Questions to revisit">
            {missed.map((q) => (
              <li key={q.id} className="doc p-4">
                <p className="font-display text-h4 text-ink">{q.question}</p>
                <p className="mt-1 font-body text-meta text-ink-soft"><span className="font-semibold text-forest-deep">{q.options[q.answerIndex]}</span> — {q.explanation}</p>
                {q.relatedLink && <Link to={q.relatedLink.to} className="mt-2 inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep underline decoration-oxide-deep/40 underline-offset-4">{q.relatedLink.label}<Icon d={icons.arrowRight} className="h-4 w-4" /></Link>}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          {missed.length > 0 && <button type="button" className="btn-seal" onClick={() => start(missed.map((q) => ({ ...q })))}>Retry the ones I missed</button>}
          <button type="button" className="btn-ghost" onClick={() => setStage('start')}>New set</button>
        </div>
      </div>
    );
  }

  const q = questions[index];
  return (
    <div className="doc-mount p-5 sm:p-7" key={q.id}>
      <p className="label num mb-4">Question {index + 1} of {questions.length}</p>
      <div className="mb-5 flex gap-1" aria-hidden="true">
        {questions.map((_, i) => <span key={i} className={`h-1 flex-1 transition-colors duration-400 ${i < index ? 'bg-oxide' : i === index ? 'bg-brass' : 'bg-paper-300'}`} />)}
      </div>
      <p className="font-display text-h3 font-bold text-ink animate-fade-up">{q.question}</p>
      <div className="mt-5 grid gap-2">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isAnswer = i === q.answerIndex;
          let cls = 'border-paper-300 bg-paper-50 hover:border-ink';
          if (picked !== null) cls = isAnswer ? 'border-forest bg-forest-wash text-forest-deep font-semibold' : isPicked ? 'border-oxide bg-oxide-wash text-oxide-deep' : 'border-paper-300 bg-paper-50 opacity-50';
          return (
            <button key={opt} type="button" disabled={picked !== null} onClick={() => { setPicked(i); setAnswers((a) => ({ ...a, [q.id]: i })); }} className={`flex min-h-12 items-center gap-3 rounded-sm border px-4 py-3 text-left font-body text-meta transition-[background-color,border-color,opacity] duration-400 ease-cinematic ${cls}`}>
              <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-current font-display text-meta font-bold">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <section aria-label="Explanation" className="mt-5 rounded-sm bg-paper-200/70 p-5 animate-fade-up">
          <p className="prose-reading">{q.explanation}</p>
          {q.whyItMatters && <p className="prose-reading mt-3"><span className="stamp mr-2 text-sepia">Why it matters</span>{q.whyItMatters}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {q.relatedLink && <Link to={q.relatedLink.to} className="inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep underline decoration-oxide-deep/40 underline-offset-4">{q.relatedLink.label}<Icon d={icons.arrowRight} className="h-4 w-4" /></Link>}
            <button type="button" className="btn-seal ml-auto" onClick={() => {
              if (index + 1 >= questions.length) { track('quiz_reviewed', { of: questions.length }); setStage('review'); } else { setIndex((i) => i + 1); setPicked(null); }
            }}>
              {index + 1 >= questions.length ? 'See review' : 'Next question'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
```
Add `import type { QuizTopic } from '@/types';` and `ChipGroup` to the ui import; delete the old `shuffleQuiz`/`shuffleQuizDaily`. Keep `ShuffledQuestion` but extend it with `topic`, `difficulty`, `whyItMatters?` (or type it as `QuizQuestion`). `pickQuestions` uses the daily shuffle only for the first, hydration-visible render — the start screen renders no questions, so this is belt and braces; keep `daily = true` on Start for stable snapshots.

Give each of the three learning activities a one-line header describing subject, length and how to take part (the doc's "clear starting screen"): in `LearnPage`, under each `SectionHeading`, a `lede` — quiz: "Five questions on a topic you choose, with an explanation after each. About three minutes."; guess: "Four clues, one person. Type a guess or ask for another clue."; compare: "Two lives side by side, with a note on why they are worth comparing."

- [ ] **Step 3: Run and commit**

Run: `npm run typecheck && npm run build && npx playwright test tests/quiz.spec.ts`
```bash
git add src/pages/LearnPage.tsx tests/quiz.spec.ts
git commit -m "Quiz: topic and depth start screen, short sets, explanations, a review of what was missed

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: Typed guesses and curated comparisons

**Files:**
- Create: `src/data/compare-pairs.ts`
- Modify: `src/types/index.ts` (`ComparePair`), `scripts/validate-content.ts`, `src/pages/LearnPage.tsx` (`GuessWho`, `Compare`)
- Create: `tests/learn-activities.spec.ts`

**Interfaces:**
- `export interface ComparePair { id: string; a: string; b: string; why: string; editorial: Editorial }` (fighter ids).
- `GuessWho` accepts a typed guess: correct when `normalizeTranslit(guess)` equals the normalised `answerName`, the fighter's `name`, any `alternateNames` entry, or `diceCoefficient(...) >= 0.8` against any of those.

- [ ] **Step 1: Spec**

Create `tests/learn-activities.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('guess who takes a typed guess, says when it is wrong, and still lets the reader reveal', async ({ page }) => {
  await page.goto('/learn');
  const guess = page.getByRole('region', { name: 'Guess the freedom fighter' });
  await guess.getByLabel('Your guess').fill('Nobody Atall');
  await guess.getByRole('button', { name: 'Check' }).click();
  await expect(guess.getByRole('status')).toContainText(/Not this time/);
  await guess.getByRole('button', { name: 'Reveal' }).click();
  await expect(guess.getByRole('link').first()).toBeVisible();
  await expect(guess.getByLabel('Your guess')).toHaveCount(0);
});

test('compare offers curated pairs with a reason', async ({ page }) => {
  await page.goto('/learn');
  const compare = page.getByRole('region', { name: 'Compare two historical figures' });
  await compare.getByRole('button', { name: /Velu Nachiyar.*Lakshmibai/ }).click();
  await expect(compare.getByText(/Why compare them/)).toBeVisible();
  await expect(compare.getByRole('link', { name: /Rani Velu Nachiyar/ })).toBeVisible();
  await expect(compare.getByRole('link', { name: /Rani Lakshmibai/ })).toBeVisible();
});
```

- [ ] **Step 2: Data and validation**

`src/types/index.ts`:
```ts
/** Two lives worth reading side by side, and why. Never a ranking. */
export interface ComparePair { id: string; a: string; b: string; why: string; editorial: Editorial }
```
Create `src/data/compare-pairs.ts`:
```ts
import type { ComparePair } from '@/types';

const draft = { status: 'draft' as const };

export const comparePairs: ComparePair[] = [
  { id: 'gandhi-bhagat-singh', a: 'mahatma-gandhi', b: 'bhagat-singh', why: 'Two answers to the same question — how should India resist? — argued in the same years. Gandhi built mass movements on refusing to obey without violence; Bhagat Singh’s generation courted arrest through dramatic action and used the trial as a platform. Both accepted prison as the price.', editorial: draft },
  { id: 'nachiyar-lakshmibai', a: 'velu-nachiyar', b: 'rani-lakshmibai', why: 'Two queens who fought the Company seventy years apart. Velu Nachiyar lost her husband and kingdom in 1772, spent eight years building alliances and won Sivaganga back around 1780. Lakshmibai lost Jhansi to the Doctrine of Lapse, defended it under siege in 1858 and died in battle. One recovered her state; one did not — and both are remembered as much through tradition as through records.', editorial: draft },
  { id: 'birsa-raju', a: 'birsa-munda', b: 'alluri-sitarama-raju', why: 'Two leaders of Adivasi risings a generation apart — the Munda Ulgulan of 1899–1900 in Chotanagpur and the Rampa rebellion of 1922–24 in the Eastern Ghats. Both fought colonial land and forest laws; both died young. Comparing them shows how the same grievances recurred across regions.', editorial: draft },
  { id: 'mehta-barua', a: 'usha-mehta', b: 'kanaklata-barua', why: 'Two young women in the same movement, 1942, choosing different risks: Usha Mehta ran a secret radio station for three months and served four years in prison; Kanaklata Barua, seventeen, led a flag procession to a police station and was shot. Same year, same cause, different forms of courage.', editorial: draft },
];
```
`scripts/validate-content.ts`: schema (`id`, `a`, `b` non-empty, `why` min 80, `editorial`), unique ids, `a`/`b` resolve to fighter ids and differ, draft warns.

- [ ] **Step 3: `GuessWho` typed guess and `Compare` curated pairs**

In `LearnPage.tsx` import `diceCoefficient, normalizeTranslit` from `@/lib/search-core` and `comparePairs` from `@/data/compare-pairs`.

`GuessWho` additions — state `const [guess, setGuess] = useState(''); const [verdict, setVerdict] = useState<'right' | 'wrong' | null>(null);` and:
```tsx
  const check = () => {
    const g = normalizeTranslit(guess);
    const names = [round.answerName, fighter?.name ?? '', ...(fighter?.alternateNames ?? [])].map(normalizeTranslit);
    const ok = g.length >= 3 && names.some((n) => n === g || n.includes(g) || diceCoefficient(n, g) >= 0.8);
    setVerdict(ok ? 'right' : 'wrong');
    if (ok) setRevealed(true);
  };
```
Form (above the clue buttons):
```tsx
      {!revealed && (
        <form className="mt-5 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); check(); }}>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Your guess</span>
            <input aria-label="Your guess" value={guess} onChange={(e) => setGuess(e.target.value)} className="min-h-11 w-full rounded-sm border border-paper-100/40 bg-transparent px-3 font-body text-meta text-paper-50 placeholder:text-paper-400" placeholder="Type a name…" />
          </label>
          <button type="submit" className="btn-seal">Check</button>
        </form>
      )}
      {verdict && <p role="status" className="mt-3 font-body text-meta text-paper-200">{verdict === 'right' ? 'That’s right.' : 'Not this time — try another clue, or reveal.'}</p>}
```
Reset `guess`/`verdict` in `next()`.

`Compare` additions — above the selects:
```tsx
      <p className="label mb-2">Suggested pairs</p>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Suggested pairs">
        {comparePairs.map((p) => {
          const pa = fighterById.get(p.a); const pb = fighterById.get(p.b);
          return pa && pb ? (
            <button key={p.id} type="button" className={`chip ${pairId === p.id ? 'chip-active' : ''}`} aria-pressed={pairId === p.id} onClick={() => { setAId(p.a); setBId(p.b); setPairId(p.id); }}>
              {pa.shortName ?? pa.name} · {pb.shortName ?? pb.name}
            </button>
          ) : null;
        })}
      </div>
```
with `const [pairId, setPairId] = useState<string | null>(null);` (cleared when either select changes) and, after the compare rows:
```tsx
      {pair && (
        <div className="mt-5 rounded-sm bg-paper-200/70 p-5">
          <p className="label mb-1">Why compare them</p>
          <p className="prose-reading">{pair.why}</p>
          {pair.editorial.status === 'draft' && <div className="mt-2"><DraftStamp /></div>}
        </div>
      )}
```
where `const pair = comparePairs.find((p) => p.id === pairId);`.

- [ ] **Step 4: Run and commit**

Run: `npm run validate && npm run typecheck && npm run build && npx playwright test tests/learn-activities.spec.ts tests/quiz.spec.ts`
```bash
git add src/data/compare-pairs.ts src/types/index.ts scripts/validate-content.ts src/pages/LearnPage.tsx tests/learn-activities.spec.ts
git commit -m "Guess who takes a typed guess; Compare offers curated pairs with a reason

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: Movement pages that explain aims, methods, reach, participants, disagreements and outcomes

**Files:**
- Modify: `src/pages/MovementsPage.tsx` (`MovementPage`)
- Modify: `src/data/movements.ts` (one movement filled in as the worked example: `civil-disobedience`)
- Modify: `tests/copy.spec.ts` (add a case)

- [ ] **Step 1: Example content**

In `src/data/movements.ts`, on the `civil-disobedience` movement, add (drafted from the movement's and Dandi record's existing text):
```ts
    aims: ['Purna Swaraj — complete independence, declared by the Congress in December 1929', 'Repeal of the salt tax as the first, universal grievance to break'],
    methods: ['Openly breaking the salt law and accepting arrest', 'Boycott of foreign cloth and liquor', 'Non-payment of taxes in selected districts', 'Marches and mass meetings'],
    reach: 'From Gujarat’s coast at Dandi to Vedaranyam in the Tamil country, the North-West Frontier and Bengal; around 90,000 people were imprisoned in 1930–31.',
    participants: 'Congress volunteers, peasants and traders, and women in unprecedented numbers — Sarojini Naidu at Dharasana, Rukmini Lakshmipathi at Vedaranyam, Kamaladevi Chattopadhyay in Bombay.',
    disagreements: ['Revolutionaries such as Bhagat Singh’s generation rejected non-violence as insufficient', 'The Gandhi–Irwin Pact of 1931 that paused the campaign was criticised within the Congress'],
    outcomes: ['The Gandhi–Irwin Pact (March 1931) and the Round Table Conference', 'A movement that was, for the first time, truly popular across regions and classes'],
    editorial: { status: 'draft' },
```

- [ ] **Step 2: Render**

In `MovementPage`, after the description section:
```tsx
        {(movement.aims || movement.methods || movement.reach || movement.participants || movement.disagreements || movement.outcomes) && (
          <section aria-label="How this movement worked" className="grid gap-6 sm:grid-cols-2">
            {movement.editorial?.status === 'draft' && <div className="sm:col-span-2"><DraftStamp /></div>}
            <ListBlock title="Aims" items={movement.aims} />
            <ListBlock title="Methods" items={movement.methods} />
            {movement.reach && <TextBlock title="Where" text={movement.reach} sources={movement.sources} />}
            {movement.participants && <TextBlock title="Who took part" text={movement.participants} sources={movement.sources} />}
            <ListBlock title="Disagreements" items={movement.disagreements} />
            <ListBlock title="Outcomes" items={movement.outcomes} />
            <p className="font-body text-label text-ink-faint sm:col-span-2">Movements that overlapped in time did not share identical aims or methods; each page describes its own.</p>
          </section>
        )}
```
with two small local components in the file:
```tsx
function ListBlock({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <Reveal as="section">
      <h3 className="mb-3 text-h3 text-ink">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 font-body text-meta text-ink-soft"><span aria-hidden="true" className="mt-2.5 h-1 w-4 shrink-0 bg-brass" />{item}</li>
        ))}
      </ul>
    </Reveal>
  );
}
function TextBlock({ title, text, sources }: { title: string; text: string; sources: SourceRef[] }) {
  return (
    <Reveal as="section">
      <h3 className="mb-3 text-h3 text-ink">{title}</h3>
      <ReadingText paragraphs={[text]} sources={sources} className="[&_p]:font-body [&_p]:text-meta [&_p]:text-ink-soft" />
    </Reveal>
  );
}
```
Add a chip in the hero: `<Link to={`/timeline?movement=${movement.id}`} className="chip-vault min-h-10">See these events in order</Link>` (the existing "Filter the timeline by this movement" chip can be renamed to this).

- [ ] **Step 3: Spec and commit**

Append to `tests/copy.spec.ts`:
```ts
test('a movement page explains aims, methods, reach, participants, disagreements and outcomes when recorded', async ({ page }) => {
  await page.goto('/movements/civil-disobedience-movement');
  for (const h of ['Aims', 'Methods', 'Where', 'Who took part', 'Disagreements', 'Outcomes']) await expect(page.getByRole('heading', { name: h })).toBeVisible();
  await expect(page.getByText(/did not share identical aims or methods/)).toBeVisible();
});
```
Run: `npm run validate && npm run typecheck && npm run build && npx playwright test tests/copy.spec.ts`
```bash
git add src/pages/MovementsPage.tsx src/data/movements.ts tests/copy.spec.ts
git commit -m "Movement pages: aims, methods, reach, participants, disagreements, outcomes

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 14: Coarse event counting for the pilot

**Files:**
- Create: `src/lib/event-names.ts`, `worker/events.ts`, `worker/events.test.ts`
- Modify: `src/lib/analytics.ts`, `worker/index.ts`, `wrangler.jsonc`, `vitest.config.ts` (include `worker/**/*.test.ts`), `README.md` (Analytics section)

**Interfaces:**
```ts
// src/lib/event-names.ts
export const EVENT_NAMES = ['trail_started', 'trail_stop_viewed', 'trail_completed', 'source_opened', 'glossary_opened', 'quiz_reviewed', 'correction_submitted'] as const;
export type EventName = (typeof EVENT_NAMES)[number];
export function isEventName(v: unknown): v is EventName;
// worker/events.ts
export interface EventsEnv { EVENTS?: AnalyticsEngineDataset }
export async function handleEvent(request: Request, env: EventsEnv): Promise<Response>; // 204 on accept, 400 otherwise
```
- `POST /api/event` with JSON `{ name, props }`; only allow-listed names; at most three props, each stringified and cut to 40 characters; written as one Analytics Engine data point with `indexes: [name]`.
- Client: `track()` sends via `navigator.sendBeacon` only when `import.meta.env.VITE_EVENTS === 'on'`, never during prerendering, only for allow-listed names. Dev still logs everything.

- [ ] **Step 1: Failing unit test**

Create `worker/events.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { handleEvent } from './events';

function req(body: unknown) {
  return new Request('https://example.test/api/event', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
}

describe('handleEvent', () => {
  it('writes an allow-listed event as one data point and returns 204', async () => {
    const points: unknown[] = [];
    const env = { EVENTS: { writeDataPoint: (p: unknown) => points.push(p) } } as never;
    const res = await handleEvent(req({ name: 'trail_started', props: { trail: 'women-who-led' } }), env);
    expect(res.status).toBe(204);
    expect(points).toEqual([{ blobs: ['trail_started', 'trail=women-who-led'], doubles: [1], indexes: ['trail_started'] }]);
  });
  it('rejects unknown names and bad bodies', async () => {
    expect((await handleEvent(req({ name: 'search_query', props: { q: 'secret' } }), {})).status).toBe(400);
    expect((await handleEvent(new Request('https://example.test/api/event', { method: 'POST', body: 'nope' }), {})).status).toBe(400);
  });
  it('returns 204 without a binding so a missing dataset never breaks the page', async () => {
    expect((await handleEvent(req({ name: 'glossary_opened' }), {})).status).toBe(204);
  });
});
```
Add `'worker/**/*.test.ts'` to `vitest.config.ts` `test.include`. Run: `npm run test:unit` — Expected: FAIL.

- [ ] **Step 2: Implement**

`src/lib/event-names.ts`:
```ts
/** The only events the pilot counts. Shared by src/lib/analytics.ts and worker/events.ts. */
export const EVENT_NAMES = ['trail_started', 'trail_stop_viewed', 'trail_completed', 'source_opened', 'glossary_opened', 'quiz_reviewed', 'correction_submitted'] as const;
export type EventName = (typeof EVENT_NAMES)[number];
export function isEventName(v: unknown): v is EventName {
  return typeof v === 'string' && (EVENT_NAMES as readonly string[]).includes(v);
}
```
`worker/events.ts`:
```ts
/**
 * POST /api/event — counts coarse, allow-listed pilot events in a Cloudflare
 * Analytics Engine dataset. No free text, no identifiers: a name plus up to
 * three short key=value props. See src/lib/analytics.ts for the client side.
 */
import { isEventName } from '../src/lib/event-names';

export interface EventsEnv {
  EVENTS?: AnalyticsEngineDataset;
}

export async function handleEvent(request: Request, env: EventsEnv): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (typeof body !== 'object' || body === null) return new Response(null, { status: 400 });
  const { name, props } = body as { name?: unknown; props?: unknown };
  if (!isEventName(name)) return new Response(null, { status: 400 });
  const p = typeof props === 'object' && props !== null ? (props as Record<string, unknown>) : {};
  const blobs = [name, ...Object.entries(p).slice(0, 3).map(([k, v]) => `${k}=${String(v).slice(0, 40)}`)];
  env.EVENTS?.writeDataPoint({ blobs, doubles: [1], indexes: [name] });
  return new Response(null, { status: 204 });
}
```
`worker/index.ts` — extend `Env` with `EventsEnv` and route:
```ts
import { handleEvent, type EventsEnv } from './events';
export interface Env extends CorrectionEnv, EventsEnv { ASSETS: Fetcher }
...
    if (request.method === 'POST' && url.pathname === '/api/event') return handleEvent(request, env);
```
`wrangler.jsonc` — after `vars`:
```jsonc
  // Pilot event counts (worker/events.ts). The dataset is created on first write.
  "analytics_engine_datasets": [{ "binding": "EVENTS", "dataset": "ift_events" }]
```
`src/lib/analytics.ts`:
```ts
/**
 * Privacy-friendly analytics. In dev, every track() logs to the console. In
 * production, only the allow-listed pilot events (src/lib/event-names.ts) are
 * sent — as a fire-and-forget beacon to POST /api/event (worker/events.ts) —
 * and only when VITE_EVENTS=on at build time. Never during prerendering.
 * Every call site passes coarse shape (a slug, a count, a bucket), never
 * free text or anything a visitor typed.
 */
import { isEventName } from '@/lib/event-names';

const enabled = import.meta.env.VITE_EVENTS === 'on';

export function track(event: string, props?: Record<string, string | number | boolean>): void {
  if (import.meta.env.DEV) {
    console.debug('[analytics]', event, props ?? {});
    return;
  }
  if (!enabled || window.__PRERENDERING__ || !isEventName(event)) return;
  try {
    navigator.sendBeacon('/api/event', new Blob([JSON.stringify({ name: event, props: props ?? {} })], { type: 'application/json' }));
  } catch {
    /* never let counting break reading */
  }
}

/** "0", "1-3", "4-8", "9-20", "21+" — never the actual length or content. */
export function lengthBucket(n: number): string {
  if (n <= 0) return '0';
  if (n <= 3) return '1-3';
  if (n <= 8) return '4-8';
  if (n <= 20) return '9-20';
  return '21+';
}
```
Run: `npm run test:unit && npm run typecheck` — Expected: PASS (the Worker tsconfig picks up `src/lib/event-names.ts` through the import).

- [ ] **Step 3: README**

Replace the "Privacy and analytics" section:
```markdown
## Privacy and analytics

Two opt-in, off-by-default mechanisms:

- **Page views** — set `VITE_CF_BEACON_TOKEN` at build time to enable Cloudflare Web Analytics (cookieless, no fingerprinting). Unset, a build carries no trace of it.
- **Pilot events** — set `VITE_EVENTS=on` in `.env` to have `track()` send the seven allow-listed events in `src/lib/event-names.ts` (trail start/stop/complete, source opened, glossary opened, quiz reviewed, correction submitted) to `POST /api/event`, which counts them in a Cloudflare Analytics Engine dataset (`ift_events`). Props are at most three short `key=value` blobs, cut to 40 characters; no free text, names or search queries are ever sent. Query it with the Analytics Engine SQL API, e.g. `SELECT blob1 AS event, SUM(_sample_interval) AS n FROM ift_events WHERE timestamp > NOW() - INTERVAL '7' DAY GROUP BY event`.
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/event-names.ts worker/events.ts worker/events.test.ts worker/index.ts wrangler.jsonc src/lib/analytics.ts vitest.config.ts README.md
git commit -m "Count coarse, allow-listed pilot events through the Worker into Analytics Engine

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

**Owner input:** set `VITE_EVENTS=on` in `.env` when the pilot begins; confirm the Analytics Engine binding deploys (`wrangler deploy` output lists `EVENTS`).

---

## Stage 2 exit checklist

- [ ] Every new content field validates; `[^n]` markers cannot point past `sources`; drafts warn and render a stamp.
- [ ] Reading text shows citation markers with previews and inline uncertainty; glossary terms are explained at first appearance; `/glossary` exists.
- [ ] Text size, reading mode, reduce motion and low data persist and apply before paint.
- [ ] Profiles follow the template with a contents menu, reading time, In a minute, cost of resistance, breadcrumbs and a back link that keeps filters.
- [ ] Connections are typed and explained; lines only for documented relationships; Similar stories separate.
- [ ] Three trails render (draft-stamped), can be completed keyboard-only and text-only, keep their place on the device.
- [ ] Home leads with Start exploring, a featured story and trails; `/start` exists; phone bar has four items with an Explore sheet.
- [ ] Quiz has a start screen, short sets, explanations, review and retry; Guess who takes typed guesses; Compare has curated pairs.
- [ ] Movement pages render structured fields when present.
- [ ] `POST /api/event` counts allow-listed events; `track()` is a beacon only when enabled.
- [ ] Full gate green: `npm run typecheck && npm run validate && npm run search:check && npm run test:unit && npm run build && npm test`.
