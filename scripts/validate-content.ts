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
import { fighterSummaries, fighterSourceFile } from '../src/data/generated/fighters.summary.ts';
import { eventSummaries, eventSourceFile } from '../src/data/generated/events.summary.ts';
import { pickEventSummary, pickFighterSummary } from './lib/summaries.ts';

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
});
const disputedNoteSchema = z.object({ claim: z.string().min(1), note: z.string().min(1) });
const quoteSchema = z.object({ text: z.string().min(1), context: z.string().optional(), source: z.string().optional(), disputed: z.boolean().optional() });
const storyChapterSchema = z.object({ title: z.string().min(1), text: z.string().min(1) });
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
  portrait: z.string().optional(),
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
  sources: z.array(sourceRefSchema),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  searchAliases: z.array(z.string()).optional(),
  era: z.string().min(1),
  featured: z.boolean().optional(),
  forgotten: z.boolean().optional(),
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
}

for (const m of movements) {
  checkRefs('movements', m.id, m.keyPeople, fighterIds, 'fighter');
  checkRefs('movements', m.id, m.keyEvents, eventIds, 'event');
  if (m.sources.length === 0) err('movements', m.id, 'has no sources');
  if (m.startYear > m.endYear) err('movements', m.id, `startYear (${m.startYear}) is after endYear (${m.endYear})`);
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
  `\nValidated ${fighters.length} fighters, ${events.length} events, ${movements.length} movements, ${organizations.length} organizations, ${eras.length} eras, ${quizQuestions.length} quiz questions, ${didYouKnowFacts.length} facts, ${guessWhoRounds.length} guess-who rounds.`,
);
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);

if (errors.length > 0) process.exit(1);
