/**
 * Core content types for India's Freedom Timeline.
 *
 * All historical content lives in `src/data` as typed records — never
 * hard-coded inside UI components — so the collection can grow to
 * thousands of records without touching the interface.
 */

/** Broad geographic regions used for filtering and the map. */
export type RegionId =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'central'
  | 'northeast'
  | 'abroad';

export type Gender = 'male' | 'female';

/** Roles a person played in the struggle. A person may hold several. */
export type Role =
  | 'revolutionary'
  | 'political-leader'
  | 'satyagrahi'
  | 'social-reformer'
  | 'tribal-leader'
  | 'military-leader'
  | 'ruler'
  | 'writer-poet'
  | 'journalist'
  | 'lawyer'
  | 'educator'
  | 'organizer';

export type EventCategory =
  | 'uprising'
  | 'battle'
  | 'mutiny'
  | 'founding'
  | 'movement-launch'
  | 'march'
  | 'protest'
  | 'massacre'
  | 'trial'
  | 'execution'
  | 'pact'
  | 'political'
  | 'turning-point';

export type SourceType =
  | 'book'
  | 'archive'
  | 'government'
  | 'journal'
  | 'museum'
  | 'website';

/** What kind of evidence a source is — shown beside a citation so a reader
    can tell a contemporary record from later scholarship or oral tradition. */
export type EvidenceKind = 'contemporary' | 'scholarship' | 'oral-tradition' | 'reference';

/** A citation. Every biography and event carries at least one. */
export interface SourceRef {
  title: string;
  author?: string;
  publisher?: string;
  year?: number;
  url?: string;
  type: SourceType;
  evidence?: EvidenceKind;
  /** Precise locator: page range, chapter, folio, file number. */
  pages?: string;
  /** Archive or catalogue identifier (e.g. an Abhilekh Patal PR number). */
  archiveId?: string;
  edition?: string;
  /** ISO date the URL was last checked. */
  accessed?: string;
}

/**
 * A note marking a claim that historians dispute or that rests on
 * uncertain evidence. Rendered visibly so readers can tell confirmed
 * facts from contested ones.
 */
export interface DisputedNote {
  claim: string;
  note: string;
  /** 0-based index into `fullBiography` the note belongs beside. Omit for a record-level note. */
  paragraph?: number;
}

export interface Quote {
  text: string;
  context?: string;
  source?: string;
  /** True when the attribution itself is uncertain. */
  disputed?: boolean;
}

/** One short chapter of a Story Mode narrative. */
export interface StoryChapter {
  title: string;
  text: string;
  /** Short caution carried into the quick story so a cautious detailed account never becomes a definite quick one. */
  uncertainty?: string;
}

/** A partial historical date. Month/day omitted when not reliably known. */
export interface HistoricalDate {
  year: number;
  month?: number;
  day?: number;
  /** For events spanning years (e.g. a movement's active period). */
  endYear?: number;
  /** True when the date itself is approximate. */
  approximate?: boolean;
}

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

export interface FreedomFighter {
  id: string;
  slug: string;
  name: string;
  alternateNames?: string[];
  /** Editorial short form for headings ("Velu Nachiyar", "Bhagat Singh"). Defaults to `name`; never derived automatically from the last word. */
  shortName?: string;
  /** Plain-English pronunciation, e.g. "veh-loo NAH-chi-yar". */
  pronunciation?: string;
  /** "In a minute": three brief facts — the person, their struggle, why it matters. */
  inAMinute?: [string, string, string];
  /** Path to a portrait image when one is added; the UI falls back to a generated archival monogram. */
  portrait?: string;
  /** What the portrait actually is (photograph, painting, stamp...), so a later painting is never mistaken for an eyewitness record. */
  portraitNote?: PortraitNote;
  birthYear?: number;
  deathYear?: number;
  /** Display strings, e.g. "28 September 1907". Omitted when unknown. */
  birthDateLabel?: string;
  deathDateLabel?: string;
  birthPlace?: string;
  region: RegionId;
  /** Modern states/territories associated with the person's life and work. */
  states: string[];
  gender: Gender;
  /** One–two sentence introduction. */
  summary: string;
  /** Story Mode — short chapters for children and casual readers. */
  shortStory: StoryChapter[];
  /** Read More mode — full biography paragraphs for older students and adults. */
  fullBiography: string[];
  /** How they entered the freedom struggle. */
  entryIntoStruggle?: string;
  /** Ideology or philosophy, where historically appropriate. */
  ideology?: string;
  achievements?: string[];
  sacrifices?: string[];
  legacy?: string;
  /** Interesting, verifiable facts. */
  facts?: string[];
  disputed?: DisputedNote[];
  quotes?: Quote[];
  /** Event ids this person is associated with. */
  timelineEvents: string[];
  /** Movement ids. */
  movements: string[];
  /** Organization ids. */
  organizations: string[];
  roles: Role[];
  /** Fighter ids of related people. */
  relatedPeople: string[];
  /** Documented relationships. See Connection. */
  connections?: Connection[];
  /** Optional content note shown before the story when a life includes distressing material. */
  contentNote?: string;
  editorial?: Editorial;
  sources: SourceRef[];
  images?: string[];
  tags?: string[];
  /** Names a search might reasonably be typed as but that don't already
      appear in `name`/`alternateNames` — a name in another script, or a
      widely used historical alternate. Not for spelling variants: search's
      transliteration-normalization tier already tolerates those (doubled
      consonants, th/bh/dh/ph/sh, x/ksh, long/short vowels) without help. */
  searchAliases?: string[];
  /** Primary era id used for timeline placement. */
  era: string;
  /** Surfaced on the home page. */
  featured?: boolean;
  /** Lesser-known heroes surfaced in the "Forgotten Heroes" section. */
  forgotten?: boolean;
  /** Places this life touched, beyond what a place record's own `people` list infers. */
  locations?: { placeId: string; kind: LocationKind; note?: string }[];
}

export type PlaceKind = 'fort' | 'prison' | 'meeting-ground' | 'port' | 'protest-site' | 'town' | 'region' | 'coast';
export type LocationKind = 'birth' | 'activity' | 'imprisonment' | 'exile' | 'death';
export interface Place {
  id: string;
  slug: string;
  name: string;
  /** Names used in the period, with dates where known: "Tuticorin (Thoothukudi)". */
  historicalNames?: string[];
  /** Must match a name in src/data/regions.ts. */
  state: string;
  kind: PlaceKind;
  summary: string;
  /** [^n] markers into `sources`. */
  description: string[];
  /** Years the place matters for in this archive, e.g. "1799, 1801". */
  dates?: string;
  /** Fighter ids. */
  people: string[];
  /** Event ids. */
  events: string[];
  sources: SourceRef[];
  images?: { src: string; caption: string; credit: string; created?: string }[];
  editorial: Editorial;
}

export interface HistoricalEvent {
  id: string;
  slug: string;
  title: string;
  date: HistoricalDate;
  /** Human-readable date, e.g. "13 April 1919". */
  dateLabel: string;
  location?: string;
  region?: RegionId;
  states?: string[];
  summary: string;
  description: string[];
  /** Fighter ids of people associated with the event. */
  people: string[];
  /** Movement id the event belongs to, if any. */
  movement?: string;
  era: string;
  category: EventCategory;
  significance?: string;
  disputed?: DisputedNote[];
  /** Editorially verified causal links, distinct from chronological neighbours. */
  consequences?: { eventId: string; note: string }[];
  editorial?: Editorial;
  sources: SourceRef[];
  /** Surfaced on home page key events. */
  featured?: boolean;
  /** See FreedomFighter.searchAliases. */
  searchAliases?: string[];
}

/**
 * The lightweight projection of a FreedomFighter shipped to every page
 * except a fighter's own profile — everything the home page, browse/list
 * pages, search, the map, Learn & Play and the "related people"
 * constellation actually read. The full record (biography, quotes,
 * sources, Story Mode...) loads lazily only when that profile opens — see
 * src/lib/loadContent.ts. Generated from the full records by
 * scripts/generate-summaries.ts; do not hand-edit src/data/generated/*.
 */
export interface FighterSummary {
  id: string;
  slug: string;
  name: string;
  alternateNames?: string[];
  shortName?: string;
  pronunciation?: string;
  inAMinute?: [string, string, string];
  portrait?: string;
  birthYear?: number;
  deathYear?: number;
  birthDateLabel?: string;
  deathDateLabel?: string;
  birthPlace?: string;
  region: RegionId;
  states: string[];
  gender: Gender;
  summary: string;
  /** Whole minutes for the detailed history at 200 wpm; computed by scripts/generate-summaries.ts. */
  readingMinutes: number;
  /** Number of documented connections; computed by scripts/generate-summaries.ts. */
  connectionCount: number;
  /** Needed by LearnPage's "Compare two lives" tool. */
  ideology?: string;
  legacy?: string;
  timelineEvents: string[];
  movements: string[];
  roles: Role[];
  tags?: string[];
  era: string;
  featured?: boolean;
  forgotten?: boolean;
  /** See FreedomFighter.searchAliases — needed by src/lib/search.ts, which
      indexes the summary projection, not the full record. */
  searchAliases?: string[];
}

/** The lightweight projection of a HistoricalEvent — see FighterSummary. */
export interface EventSummary {
  id: string;
  slug: string;
  title: string;
  date: HistoricalDate;
  dateLabel: string;
  location?: string;
  region?: RegionId;
  states?: string[];
  summary: string;
  people: string[];
  movement?: string;
  era: string;
  category: EventCategory;
  featured?: boolean;
  /** See FreedomFighter.searchAliases. */
  searchAliases?: string[];
}

export interface Movement {
  id: string;
  slug: string;
  name: string;
  /** e.g. "1920–1922" */
  period: string;
  startYear: number;
  endYear: number;
  summary: string;
  description: string[];
  regions: RegionId[];
  /** Fighter ids. */
  keyPeople: string[];
  /** Event ids. */
  keyEvents: string[];
  aims?: string[];
  methods?: string[];
  /** Geographical reach, one paragraph. */
  reach?: string;
  /** Who took part, one paragraph. */
  participants?: string;
  disagreements?: string[];
  outcomes?: string[];
  editorial?: Editorial;
  sources: SourceRef[];
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  foundedYear?: number;
  foundedLabel?: string;
  summary: string;
  type: 'political' | 'revolutionary' | 'social' | 'military' | 'press';
}

export interface Era {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  tagline: string;
  description: string;
  /** Tailwind-safe accent token used for timeline colour coding. */
  accent: 'indigo' | 'oxide' | 'saffron' | 'forest' | 'sepia' | 'brass';
}

export interface StateInfo {
  id: string;
  name: string;
  region: RegionId;
  /** Column/row on the stylised tile map grid. */
  col: number;
  row: number;
}

/** Educational content -------------------------------------------------- */

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
  /** Related fighter/event to explore after answering. */
  relatedLink?: { label: string; to: string };
}

export interface DidYouKnowFact {
  id: string;
  text: string;
  relatedLink?: { label: string; to: string };
}

/** A guided trail — a short editorial journey built on existing records. */
export type TrailRef = { kind: 'fighter' | 'event' | 'movement'; id: string };
export interface TrailStop {
  id: string; // kebab, unique within the trail
  title: string;
  question?: string; // the stop's guiding question
  text: string[]; // 1–3 short paragraphs; [^n] markers refer to `sources`
  focus: TrailRef; // the record this stop is built on (visual + "Open the full story")
  also?: TrailRef[]; // further records worth opening
  sources: SourceRef[]; // at least one; copied from the focus record, so an update there is a prompt to update here
  uncertainty?: string; // carried from the record's disputed notes when the stop touches them
  contentNote?: string;
  bridge: string; // one sentence to the next stop; '' on the last
}
export type TrailActivity =
  | { kind: 'choice'; prompt: string; options: string[]; answerIndex: number; explanation: string }
  | { kind: 'order'; prompt: string; items: { label: string; year: number; ref?: TrailRef }[]; explanation: string };
export interface Trail {
  id: string;
  slug: string;
  version: number; // bump when stop text changes; translations point at a version
  title: string;
  question: string;
  theme: string;
  minutes: number; // approximate, design target until measured
  learningGoal: string;
  intro: string;
  accent: Era['accent'];
  stops: TrailStop[]; // 3–7
  reflection: string; // a prompt, never a form
  activity: TrailActivity;
  followOn: { label: string; to: string };
  editorial: Editorial;
  narration?: TrailNarration[];
}

export interface TrailNarration {
  lang: 'en' | 'ta' | 'hi';
  /** /audio/trails/<slug>/<lang>.mp3 */
  src: string;
  narrator: string;
  /** ISO date. */
  recordedOn: string;
  /** Pronunciation/date/tone check. */
  reviewedBy?: string;
  /** Cue per stop paragraph: seconds into the file. */
  cues: { stopId: string; paragraph: number; start: number; end: number }[];
}

/** Two lives worth reading side by side, and why. Never a ranking. */
export interface ComparePair {
  id: string;
  a: string;
  b: string;
  why: string;
  editorial: Editorial;
}

export interface RouteStop {
  id: string;
  name: string;
  /** Display date, e.g. "12 March 1930". */
  dateLabel: string;
  /** One or two sentences; [^n] into the route's own `sources`. */
  note: string;
  /** Schematic position 0–100 on the route map's own canvas — NOT geographic coordinates. */
  x: number;
  y: number;
  /** True unless the location is documented to the site. */
  approximate: boolean;
  /** Link to a Place record when one exists. */
  placeId?: string;
}
export interface Route {
  id: string;
  slug: string;
  title: string;
  question: string;
  summary: string;
  frame: 'present-day' | 'historical';
  frameNote: string;
  /** The event this route belongs to. */
  eventId: string;
  /** 3–24 stops. */
  stops: RouteStop[];
  /** Closing paragraphs, [^n] into sources. */
  outcome: string[];
  sources: SourceRef[];
  editorial: Editorial;
}

export interface DocumentPassage {
  id: string;
  text: string;
  /** % box on the image, when a scan exists. */
  box?: { x: number; y: number; w: number; h: number };
  guide?: { author?: string; audience?: string; claim?: string; limitation?: string };
}
export interface ArchiveDocument {
  id: string;
  slug: string;
  title: string;
  dateLabel: string;
  kind: 'proclamation' | 'letter' | 'newspaper' | 'leaflet' | 'photograph' | 'other';
  /** The scan. Absent until a licensed image is supplied; the page is then text-first. */
  image?: { src: string; width: number; height: number; credit: string; licence: string; created?: string };
  /** [^n] into sources. */
  context: string[];
  /** The transcription, in reading order. */
  passages: DocumentPassage[];
  /** Where the text comes from and how it was checked. */
  transcriptionNote: string;
  eventId?: string;
  sources: SourceRef[];
  editorial: Editorial;
}
