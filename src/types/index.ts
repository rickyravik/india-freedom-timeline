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

/** A citation. Every biography and event carries at least one. */
export interface SourceRef {
  title: string;
  author?: string;
  publisher?: string;
  year?: number;
  url?: string;
  type: SourceType;
}

/**
 * A note marking a claim that historians dispute or that rests on
 * uncertain evidence. Rendered visibly so readers can tell confirmed
 * facts from contested ones.
 */
export interface DisputedNote {
  claim: string;
  note: string;
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

export interface FreedomFighter {
  id: string;
  slug: string;
  name: string;
  alternateNames?: string[];
  /** Path to a portrait image when one is added; the UI falls back to a generated archival monogram. */
  portrait?: string;
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
  sources: SourceRef[];
  images?: string[];
  tags?: string[];
  /** Primary era id used for timeline placement. */
  era: string;
  /** Surfaced on the home page. */
  featured?: boolean;
  /** Lesser-known heroes surfaced in the "Forgotten Heroes" section. */
  forgotten?: boolean;
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
  sources: SourceRef[];
  /** Surfaced on home page key events. */
  featured?: boolean;
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

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  /** Related fighter/event to explore after answering. */
  relatedLink?: { label: string; to: string };
}

export interface DidYouKnowFact {
  id: string;
  text: string;
  relatedLink?: { label: string; to: string };
}
