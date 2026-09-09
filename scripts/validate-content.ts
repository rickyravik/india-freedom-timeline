/**
 * Content validation gate. Run as the first step of `npm run build` and via
 * `npm run validate`. Checks every fighter, event, movement, organization,
 * era, state, quiz question, "did you know" fact and guess-who round against
 * a zod schema, then checks cross-collection references (ids that must
 * resolve, dates that must be consistent, etc).
 *
 * Errors fail the build; warnings are printed but do not.
 */
import { z } from 'zod';
import { fighters } from '../src/data/fighters/index.ts';
import { events } from '../src/data/events/index.ts';
import { movements } from '../src/data/movements.ts';
import { organizations } from '../src/data/organizations.ts';
import { eras } from '../src/data/eras.ts';
import { states } from '../src/data/regions.ts';
import { quizQuestions, guessWhoRounds } from '../src/data/quizzes.ts';
import { didYouKnowFacts } from '../src/data/facts.ts';
import { glossaryTerms } from '../src/data/glossary.ts';
import { trails } from '../src/data/trails/index.ts';
import { comparePairs } from '../src/data/compare-pairs.ts';
import { places } from '../src/data/places.ts';
import { routes } from '../src/data/routes/index.ts';
import { fighterSummaries, fighterSourceFile } from '../src/data/generated/fighters.summary.ts';
import { eventSummaries, eventSourceFile } from '../src/data/generated/events.summary.ts';
import { connectionsById } from '../src/data/generated/connections.ts';
import { pickEventSummary, pickFighterSummary } from './lib/summaries.ts';
import { resolveConnections } from '../src/lib/connections.ts';
import { CITATION_RE } from '../src/lib/reading.ts';

type Level = 'error' | 'warn';
interface Issue {
  level: Level;
  collection: string;
  ref: string;
  message: string;
}
const issues: Issue[] = [];
const err = (collection: string, ref: string, message: string) => issues.push({ level: 'error', collection, ref, message });
const warn = (collection: string, ref: string, message: string) => issues.push({ level: 'warn', collection, ref, message });

/* -------------------------------------------------------------------- */
/* Zod schemas — mirror src/types/index.ts                               */
const regionId = z.enum(['north', 'south', 'east', 'west', 'central', 'northeast', 'abroad']);
const sourceType = z.enum(['book', 'archive', 'government', 'journal', 'museum', 'website']);
const role = z.enum([
  'revolutionary', 'political-leader', 'satyagrahi', 'social-reformer', 'tribal-leader',
  'military-leader', 'ruler', 'writer-poet', 'journalist', 'lawyer', 'educator', 'organizer',
]);
const eventCategory = z.enum([
  'uprising', 'battle', 'mutiny', 'founding', 'movement-launch', 'march', 'protest',
  'massacre', 'trial', 'execution', 'pact', 'political', 'turning-point',
]);

const sourceRefSchema = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  publisher: z.string().optional(),
  year: z.number().optional(),
  url: z.string().optional(),
  type: sourceType,
  evidence: z.enum(['contemporary', 'scholarship', 'oral-tradition', 'reference']).optional(),
  pages: z.string().optional(),
  archiveId: z.string().optional(),
  edition: z.string().optional(),
  accessed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
const disputedNoteSchema = z.object({ claim: z.string().min(1), note: z.string().min(1), paragraph: z.number().int().min(0).optional() });
const quoteSchema = z.object({ text: z.string().min(1), context: z.string().optional(), source: z.string().optional(), disputed: z.boolean().optional() });
const storyChapterSchema = z.object({ title: z.string().min(1), text: z.string().min(1), uncertainty: z.string().min(1).optional() });
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
const historicalDateSchema = z.object({
  year: z.number(),
  month: z.number().min(1).max(12).optional(),
  day: z.number().min(1).max(31).optional(),
  endYear: z.number().optional(),
  approximate: z.boolean().optional(),
});

const fighterSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase kebab-case'),
  name: z.string().min(1),
  alternateNames: z.array(z.string()).optional(),
  shortName: z.string().min(1).optional(),
  pronunciation: z.string().optional(),
  inAMinute: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]).optional(),
  portrait: z.string().optional(),
  portraitNote: portraitNoteSchema.optional(),
  birthYear: z.number().optional(),
  deathYear: z.number().optional(),
  birthDateLabel: z.string().optional(),
  deathDateLabel: z.string().optional(),
  birthPlace: z.string().optional(),
  region: regionId,
  states: z.array(z.string()),
  gender: z.enum(['male', 'female']),
  summary: z.string().min(1),
  shortStory: z.array(storyChapterSchema),
  fullBiography: z.array(z.string().min(1)),
  entryIntoStruggle: z.string().optional(),
  ideology: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  sacrifices: z.array(z.string()).optional(),
  legacy: z.string().optional(),
  facts: z.array(z.string()).optional(),
  disputed: z.array(disputedNoteSchema).optional(),
  quotes: z.array(quoteSchema).optional(),
  timelineEvents: z.array(z.string()),
  movements: z.array(z.string()),
  organizations: z.array(z.string()),
  roles: z.array(role),
  relatedPeople: z.array(z.string()),
  connections: z.array(connectionSchema).optional(),
  contentNote: z.string().optional(),
  editorial: editorialSchema.optional(),
  sources: z.array(sourceRefSchema),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  searchAliases: z.array(z.string()).optional(),
  era: z.string().min(1),
  featured: z.boolean().optional(),
  forgotten: z.boolean().optional(),
  locations: z
    .array(z.object({ placeId: z.string().min(1), kind: z.enum(['birth', 'activity', 'imprisonment', 'exile', 'death']), note: z.string().optional() }))
    .optional(),
});

const eventSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase kebab-case'),
  title: z.string().min(1),
  date: historicalDateSchema,
  dateLabel: z.string().min(1),
  location: z.string().optional(),
  region: regionId.optional(),
  states: z.array(z.string()).optional(),
  summary: z.string().min(1),
  description: z.array(z.string().min(1)),
  people: z.array(z.string()),
  movement: z.string().optional(),
  era: z.string().min(1),
  category: eventCategory,
  significance: z.string().optional(),
  disputed: z.array(disputedNoteSchema).optional(),
  consequences: z.array(z.object({ eventId: z.string().min(1), note: z.string().min(20) })).optional(),
  editorial: editorialSchema.optional(),
  sources: z.array(sourceRefSchema),
  featured: z.boolean().optional(),
  searchAliases: z.array(z.string()).optional(),
});

const movementSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase kebab-case'),
  name: z.string().min(1),
  period: z.string().min(1),
  startYear: z.number(),
  endYear: z.number(),
  summary: z.string().min(1),
  description: z.array(z.string().min(1)),
  regions: z.array(regionId),
  keyPeople: z.array(z.string()),
  keyEvents: z.array(z.string()),
  aims: z.array(z.string().min(1)).optional(),
  methods: z.array(z.string().min(1)).optional(),
  reach: z.string().optional(),
  participants: z.string().optional(),
  disagreements: z.array(z.string().min(1)).optional(),
  outcomes: z.array(z.string().min(1)).optional(),
  editorial: editorialSchema.optional(),
  sources: z.array(sourceRefSchema),
});

const organizationSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase kebab-case'),
  name: z.string().min(1),
  foundedYear: z.number().optional(),
  foundedLabel: z.string().optional(),
  summary: z.string().min(1),
  type: z.enum(['political', 'revolutionary', 'social', 'military', 'press']),
});

const eraSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  startYear: z.number(),
  endYear: z.number(),
  tagline: z.string().min(1),
  description: z.string().min(1),
  accent: z.enum(['indigo', 'oxide', 'saffron', 'forest', 'sepia', 'brass']),
});

const relatedLinkSchema = z.object({ label: z.string().min(1), to: z.string().min(1) }).optional();

const quizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)),
  answerIndex: z.number(),
  explanation: z.string().min(1),
  topic: z.enum(['people', 'events', 'movements', 'places']),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  whyItMatters: z.string().optional(),
  relatedLink: relatedLinkSchema,
});

const factSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  relatedLink: relatedLinkSchema,
});

const guessWhoRoundSchema = z.object({
  id: z.string().min(1),
  clues: z.array(z.string().min(1)),
  answerId: z.string().min(1),
  answerName: z.string().min(1),
});

const glossaryTermSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  term: z.string().min(1),
  aliases: z.array(z.string().min(1)).optional(),
  definition: z.string().min(1).max(320),
  moreLink: relatedLinkSchema,
  editorial: editorialSchema,
});

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

const comparePairSchema = z.object({
  id: z.string().min(1),
  a: z.string().min(1),
  b: z.string().min(1),
  why: z.string().min(80),
  editorial: editorialSchema,
});

const placeSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase kebab-case'),
  name: z.string().min(1),
  historicalNames: z.array(z.string().min(1)).optional(),
  state: z.string().min(1),
  kind: z.enum(['fort', 'prison', 'meeting-ground', 'port', 'protest-site', 'town', 'region', 'coast']),
  summary: z.string().min(1),
  description: z.array(z.string().min(1)),
  dates: z.string().optional(),
  people: z.array(z.string()),
  events: z.array(z.string()),
  sources: z.array(sourceRefSchema),
  images: z.array(z.object({ src: z.string().min(1), caption: z.string().min(1), credit: z.string().min(1), created: z.string().optional() })).optional(),
  editorial: editorialSchema,
});

const routeStopSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  dateLabel: z.string().min(1),
  note: z.string().min(1),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  approximate: z.boolean(),
  placeId: z.string().optional(),
});
const routeSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase kebab-case'),
  title: z.string().min(1),
  question: z.string().min(1),
  summary: z.string().min(1),
  frame: z.enum(['present-day', 'historical']),
  frameNote: z.string().min(1),
  eventId: z.string().min(1),
  stops: z.array(routeStopSchema).min(3).max(24),
  outcome: z.array(z.string().min(1)),
  sources: z.array(sourceRefSchema),
  editorial: editorialSchema,
});

/* -------------------------------------------------------------------- */
/* Schema pass                                                           */
function checkSchema<T>(collection: string, items: T[], schema: z.ZodType<T>, refOf: (item: T) => string) {
  for (const item of items) {
    const result = schema.safeParse(item);
    if (!result.success) {
      for (const issue of result.error.issues) {
        err(collection, refOf(item), `${issue.path.join('.')}: ${issue.message}`);
      }
    }
  }
}

checkSchema('fighters', fighters, fighterSchema, (f) => f.id);
checkSchema('events', events, eventSchema, (e) => e.id);
checkSchema('movements', movements, movementSchema, (m) => m.id);
checkSchema('organizations', organizations, organizationSchema, (o) => o.id);
checkSchema('eras', eras, eraSchema, (e) => e.id);
checkSchema('quizQuestions', quizQuestions, quizQuestionSchema, (q) => q.id);
checkSchema('didYouKnowFacts', didYouKnowFacts, factSchema, (f) => f.id);
checkSchema('guessWhoRounds', guessWhoRounds, guessWhoRoundSchema, (r) => r.id);
checkSchema('glossary', glossaryTerms, glossaryTermSchema, (t) => t.id);
checkSchema('trails', trails, trailSchema, (t) => t.id);
checkSchema('comparePairs', comparePairs, comparePairSchema, (p) => p.id);
checkSchema('places', places, placeSchema, (p) => p.id);
checkSchema('routes', routes, routeSchema, (r) => r.id);

/* -------------------------------------------------------------------- */
/* Uniqueness                                                            */
function checkUnique(collection: string, items: { id: string; slug?: string }[]) {
  const ids = new Map<string, number>();
  const slugs = new Map<string, number>();
  for (const item of items) {
    ids.set(item.id, (ids.get(item.id) ?? 0) + 1);
    if (item.slug) slugs.set(item.slug, (slugs.get(item.slug) ?? 0) + 1);
  }
  for (const [id, count] of ids) if (count > 1) err(collection, id, `duplicate id (${count} records share it)`);
  for (const [slug, count] of slugs) if (count > 1) err(collection, slug, `duplicate slug (${count} records share it)`);
}
checkUnique('fighters', fighters);
checkUnique('events', events);
checkUnique('movements', movements);
checkUnique('organizations', organizations);
checkUnique('eras', eras.map((e) => ({ id: e.id })));
checkUnique('glossary', glossaryTerms.map((t) => ({ id: t.id })));
checkUnique('trails', trails);
checkUnique('comparePairs', comparePairs);
checkUnique('places', places);
checkUnique('routes', routes);

/* -------------------------------------------------------------------- */
/* Cross-references                                                      */
const fighterIds = new Set(fighters.map((f) => f.id));
const eventIds = new Set(events.map((e) => e.id));
const movementIds = new Set(movements.map((m) => m.id));
const organizationIds = new Set(organizations.map((o) => o.id));
const eraIds = new Set(eras.map((e) => e.id));
const eraById = new Map(eras.map((e) => [e.id, e]));
const fighterSlugs = new Set(fighters.map((f) => f.slug));
const eventSlugs = new Set(events.map((e) => e.slug));
const movementSlugs = new Set(movements.map((m) => m.slug));
const knownStateNames = new Set(states.map((s) => s.name));

function checkRefs(collection: string, ref: string, ids: string[], target: Set<string>, targetName: string) {
  for (const id of ids) if (!target.has(id)) err(collection, ref, `references unknown ${targetName} id "${id}"`);
}

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

for (const f of fighters) {
  checkRefs('fighters', f.id, f.relatedPeople, fighterIds, 'fighter');
  checkRefs('fighters', f.id, f.timelineEvents, eventIds, 'event');
  checkRefs('fighters', f.id, f.movements, movementIds, 'movement');
  checkRefs('fighters', f.id, f.organizations, organizationIds, 'organization');
  if (!eraIds.has(f.era)) err('fighters', f.id, `references unknown era id "${f.era}"`);
  if (f.sources.length === 0) err('fighters', f.id, 'has no sources');
  if (f.birthYear !== undefined && f.deathYear !== undefined && f.birthYear > f.deathYear) {
    err('fighters', f.id, `birthYear (${f.birthYear}) is after deathYear (${f.deathYear})`);
  }
  if (f.deathYear !== undefined && f.deathYear >= 2030) err('fighters', f.id, `deathYear (${f.deathYear}) is not plausible`);
  for (const s of f.states) if (!knownStateNames.has(s)) warn('fighters', f.id, `state "${s}" is not in src/data/regions.ts`);
  if (f.shortStory.length < 3 || f.shortStory.length > 6) warn('fighters', f.id, `shortStory has ${f.shortStory.length} chapters (expected 3-6)`);
  for (const chapter of f.shortStory) {
    if (chapter.text.length > 600) warn('fighters', f.id, `shortStory chapter "${chapter.title}" is ${chapter.text.length} chars (expected under 600)`);
    if (/\b(brutal|gruesome|graphic)\b/i.test(chapter.text)) warn('fighters', f.id, `shortStory chapter "${chapter.title}" may need a gentler tone (found a flagged word)`);
  }
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
}

for (const e of events) {
  checkRefs('events', e.id, e.people, fighterIds, 'fighter');
  if (e.movement && !movementIds.has(e.movement)) err('events', e.id, `references unknown movement id "${e.movement}"`);
  if (!eraIds.has(e.era)) err('events', e.id, `references unknown era id "${e.era}"`);
  else {
    const era = eraById.get(e.era)!;
    if (e.date.year < era.startYear || e.date.year > era.endYear) {
      err('events', e.id, `date.year (${e.date.year}) falls outside its era "${e.era}" (${era.startYear}-${era.endYear})`);
    }
  }
  if (e.sources.length === 0) err('events', e.id, 'has no sources');
  checkCitations('events', e.id, [...e.description, e.significance], e.sources.length);
  for (const c of e.consequences ?? []) if (!eventIds.has(c.eventId)) err('events', e.id, `consequence "${c.eventId}" is not an event id`);
}

for (const m of movements) {
  checkRefs('movements', m.id, m.keyPeople, fighterIds, 'fighter');
  checkRefs('movements', m.id, m.keyEvents, eventIds, 'event');
  if (m.sources.length === 0) err('movements', m.id, 'has no sources');
  if (m.startYear > m.endYear) err('movements', m.id, `startYear (${m.startYear}) is after endYear (${m.endYear})`);
  checkCitations('movements', m.id, [...m.description, m.reach, m.participants], m.sources.length);
}

function checkRelatedLink(collection: string, ref: string, link?: { label: string; to: string }) {
  if (!link) return;
  const [, kind, slug] = link.to.match(/^\/(fighters|events|movements)\/([a-z0-9-]+)$/) ?? [];
  if (!kind) {
    err(collection, ref, `relatedLink.to "${link.to}" is not a recognised route shape`);
    return;
  }
  const target = kind === 'fighters' ? fighterSlugs : kind === 'events' ? eventSlugs : movementSlugs;
  if (!target.has(slug)) err(collection, ref, `relatedLink.to "${link.to}" does not resolve to an existing ${kind.slice(0, -1)}`);
}

for (const q of quizQuestions) {
  checkRelatedLink('quizQuestions', q.id, q.relatedLink);
  if (q.options.length !== 4) err('quizQuestions', q.id, `has ${q.options.length} options (expected 4)`);
  if (new Set(q.options).size !== q.options.length) err('quizQuestions', q.id, 'options are not all distinct');
  if (q.answerIndex < 0 || q.answerIndex >= q.options.length) err('quizQuestions', q.id, `answerIndex (${q.answerIndex}) is out of range`);
}
for (const f of didYouKnowFacts) checkRelatedLink('didYouKnowFacts', f.id, f.relatedLink);
for (const r of guessWhoRounds) if (!fighterIds.has(r.answerId)) err('guessWhoRounds', r.id, `answerId "${r.answerId}" does not resolve to an existing fighter`);
for (const t of glossaryTerms) {
  checkRelatedLink('glossary', t.id, t.moreLink);
  if (t.editorial.status === 'draft') warn('glossary', t.id, 'editorial status is draft');
}

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

for (const p of comparePairs) {
  if (!fighterIds.has(p.a)) err('comparePairs', p.id, `"a" ("${p.a}") is not a fighter id`);
  if (!fighterIds.has(p.b)) err('comparePairs', p.id, `"b" ("${p.b}") is not a fighter id`);
  if (p.a === p.b) err('comparePairs', p.id, '"a" and "b" are the same fighter');
  if (p.editorial.status === 'draft') warn('comparePairs', p.id, 'editorial status is draft');
}

const placeIds = new Set(places.map((p) => p.id));
for (const p of places) {
  if (!knownStateNames.has(p.state)) err('places', p.id, `state "${p.state}" is not in src/data/regions.ts`);
  checkRefs('places', p.id, p.people, fighterIds, 'fighter');
  checkRefs('places', p.id, p.events, eventIds, 'event');
  if (p.sources.length === 0) err('places', p.id, 'has no sources');
  checkCitations('places', p.id, p.description, p.sources.length);
  if (p.editorial.status === 'draft') warn('places', p.id, 'editorial status is draft');
}
for (const f of fighters) {
  for (const l of f.locations ?? []) {
    if (!placeIds.has(l.placeId)) err('fighters', f.id, `locations references unknown place id "${l.placeId}"`);
  }
}

for (const r of routes) {
  if (!eventIds.has(r.eventId)) err('routes', r.id, `references unknown event id "${r.eventId}"`);
  const stopIds = new Set<string>();
  for (const s of r.stops) {
    if (stopIds.has(s.id)) err('routes', r.id, `duplicate stop id "${s.id}"`);
    stopIds.add(s.id);
    if (s.placeId && !placeIds.has(s.placeId)) err('routes', r.id, `stop "${s.id}" references unknown place id "${s.placeId}"`);
  }
  checkCitations('routes', r.id, [...r.stops.map((s) => s.note), ...r.outcome], r.sources.length);
  if (r.editorial.status === 'draft') warn('routes', r.id, 'editorial status is draft');
}

/* -------------------------------------------------------------------- */
/* Generated summary staleness — src/data/generated/*.summary.ts is        */
/* committed, not built on the fly; catch it drifting from the full        */
/* records it's supposed to be projected from.                             */
if (JSON.stringify(fighters.map(pickFighterSummary)) !== JSON.stringify(fighterSummaries)) {
  err('generated', 'fighters.summary.ts', 'is stale — run `npm run generate:summaries` and commit the result');
}
if (JSON.stringify(events.map(pickEventSummary)) !== JSON.stringify(eventSummaries)) {
  err('generated', 'events.summary.ts', 'is stale — run `npm run generate:summaries` and commit the result');
}
for (const f of fighters) {
  if (!fighterSourceFile[f.slug]) err('generated', 'fighters.summary.ts', `no sourceFile entry for slug "${f.slug}" — run npm run generate:summaries`);
}
for (const e of events) {
  if (!eventSourceFile[e.slug]) err('generated', 'events.summary.ts', `no sourceFile entry for slug "${e.slug}" — run npm run generate:summaries`);
}
if (JSON.stringify(resolveConnections(fighters)) !== JSON.stringify(connectionsById)) {
  err('generated', 'connections.ts', 'is stale — run `npm run generate:summaries` and commit the result');
}

/* -------------------------------------------------------------------- */
/* Report                                                                */
const errors = issues.filter((i) => i.level === 'error');
const warnings = issues.filter((i) => i.level === 'warn');

for (const group of [errors, warnings]) {
  if (group.length === 0) continue;
  const byCollection = new Map<string, Issue[]>();
  for (const issue of group) byCollection.set(issue.collection, [...(byCollection.get(issue.collection) ?? []), issue]);
  for (const [collection, collectionIssues] of byCollection) {
    console.log(`\n${collection} (${collectionIssues[0].level}s):`);
    for (const issue of collectionIssues) console.log(`  [${issue.ref}] ${issue.message}`);
  }
}

console.log(
  `\nValidated ${fighters.length} fighters, ${events.length} events, ${movements.length} movements, ${organizations.length} organizations, ${eras.length} eras, ${quizQuestions.length} quiz questions, ${didYouKnowFacts.length} facts, ${guessWhoRounds.length} guess-who rounds, ${glossaryTerms.length} glossary terms, ${trails.length} trails, ${comparePairs.length} compare pairs, ${places.length} places, ${routes.length} routes.`,
);
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);

if (errors.length > 0) process.exit(1);
