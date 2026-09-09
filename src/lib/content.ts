/**
 * Content access layer — the single place UI code goes to for historical
 * records and the connections between them.
 */
import type { EventSummary, FighterSummary, FreedomFighter, LocationKind, Movement, Place, RegionId } from '@/types';
import { places, placeById, placeBySlug } from '@/data/places';
import { routes, routeBySlug } from '@/data/routes';
import { fighterSummaries, fighterSourceFile } from '@/data/generated/fighters.summary';
import { eventSummaries, eventSourceFile } from '@/data/generated/events.summary';
import { connectionsById } from '@/data/generated/connections';
import type { ConnectionType } from '@/lib/connections';
import { movements, movementById } from '@/data/movements';
import { organizations, organizationById } from '@/data/organizations';
import { eras, eraById } from '@/data/eras';
import { states, stateById } from '@/data/regions';
import { glossaryTerms, glossaryById } from '@/data/glossary';
import { trails, trailBySlug } from '@/data/trails';

/* The summary projection — everything except a record's own profile page
   should only ever need these. Full records (biography, quotes, sources,
   Story Mode...) load lazily via src/lib/loadContent.ts. */
export const fighters: FighterSummary[] = fighterSummaries;
export const fighterById = new Map(fighters.map((f) => [f.id, f]));
export const fighterBySlug = new Map(fighters.map((f) => [f.slug, f]));
export const events: EventSummary[] = eventSummaries;
export const eventById = new Map(events.map((e) => [e.id, e]));
export const eventBySlug = new Map(events.map((e) => [e.slug, e]));

export {
  movements,
  movementById,
  organizations,
  organizationById,
  eras,
  eraById,
  states,
  stateById,
  fighterSourceFile,
  eventSourceFile,
  glossaryTerms,
  glossaryById,
  trails,
  trailBySlug,
  places,
  placeById,
  placeBySlug,
  routes,
  routeBySlug,
};

export const movementBySlug = new Map(movements.map((m) => [m.slug, m]));

/** Fighters linked to an event (declared on either side of the relation). */
export function fightersForEvent(event: EventSummary): FighterSummary[] {
  const ids = new Set(event.people);
  for (const f of fighters) {
    if (f.timelineEvents.includes(event.id)) ids.add(f.id);
  }
  return [...ids].map((id) => fighterById.get(id)).filter((f): f is FighterSummary => Boolean(f));
}

/** Events linked to a fighter (declared on either side of the relation).
    Takes the minimal shape it needs, not FighterSummary, so it also accepts
    a full FreedomFighter record — the only caller has one on hand and would
    otherwise need to build a throwaway summary just to satisfy the type. */
export function eventsForFighter(fighter: { id: string; timelineEvents: string[] }): EventSummary[] {
  const ids = new Set(fighter.timelineEvents);
  for (const e of events) {
    if (e.people.includes(fighter.id)) ids.add(e.id);
  }
  return events.filter((e) => ids.has(e.id));
}

export function fightersForMovement(movement: Movement): FighterSummary[] {
  const ids = new Set(movement.keyPeople);
  for (const f of fighters) {
    if (f.movements.includes(movement.id)) ids.add(f.id);
  }
  return [...ids].map((id) => fighterById.get(id)).filter((f): f is FighterSummary => Boolean(f));
}

export function eventsForMovement(movement: Movement): EventSummary[] {
  const ids = new Set(movement.keyEvents);
  for (const e of events) {
    if (e.movement === movement.id) ids.add(e.id);
  }
  return events.filter((e) => ids.has(e.id));
}

export function placesForState(stateName: string): Place[] {
  return places.filter((p) => p.state === stateName);
}

export function placesForEvent(eventId: string): Place[] {
  return places.filter((p) => p.events.includes(eventId));
}

/** Takes the minimal shape it needs (see eventsForFighter above), so it
    accepts either a FighterSummary or a full FreedomFighter record. */
export function placesForFighter(fighter: { id: string; locations?: { placeId: string; kind: LocationKind; note?: string }[] }): { place: Place; kind: LocationKind; note?: string }[] {
  const fromRecord: { place: Place; kind: LocationKind; note?: string }[] = [];
  for (const l of fighter.locations ?? []) {
    const place = placeById.get(l.placeId);
    if (place) fromRecord.push({ place, kind: l.kind, note: l.note });
  }
  const mentioned = places.filter((p) => p.people.includes(fighter.id) && !fromRecord.some((l) => l.place.id === p.id)).map((place) => ({ place, kind: 'activity' as LocationKind }));
  return [...fromRecord, ...mentioned];
}

export function fightersForState(stateName: string): FighterSummary[] {
  return fighters.filter((f) => f.states.includes(stateName));
}

export function eventsForState(stateName: string): EventSummary[] {
  return events.filter((e) => e.states?.includes(stateName));
}

export function fightersForRegion(region: RegionId): FighterSummary[] {
  return fighters.filter((f) => f.region === region);
}

/** Only ever called with a fighter's own full record (its own profile
    page), since `relatedPeople` isn't part of the lightweight summary. */
export function relatedFighters(fighter: FreedomFighter): FighterSummary[] {
  return fighter.relatedPeople
    .map((id) => fighterById.get(id))
    .filter((f): f is FighterSummary => Boolean(f));
}

export interface ResolvedConnection {
  fighter: FighterSummary;
  type: ConnectionType;
  note: string;
  inferred: boolean;
}

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

/** Lifespan label, e.g. "1907 – 1931". */
export function lifespan(f: FighterSummary): string {
  const b = f.birthYear ? `${f.birthYear}` : '?';
  const d = f.deathYear ? `${f.deathYear}` : '?';
  return `${b} – ${d}`;
}

export const roleLabels: Record<string, string> = {
  revolutionary: 'Revolutionary',
  'political-leader': 'Political leader',
  satyagrahi: 'Satyagrahi',
  'social-reformer': 'Social reformer',
  'tribal-leader': 'Tribal leader',
  'military-leader': 'Military leader',
  ruler: 'Ruler',
  'writer-poet': 'Writer / poet',
  journalist: 'Journalist',
  lawyer: 'Lawyer',
  educator: 'Educator',
  organizer: 'Organizer',
};

export const placeKindLabels: Record<string, string> = {
  fort: 'Fort',
  prison: 'Prison',
  'meeting-ground': 'Meeting ground',
  port: 'Port',
  'protest-site': 'Protest site',
  town: 'Town',
  region: 'Region',
  coast: 'Coast',
};

export const locationKindLabels: Record<string, string> = {
  birth: 'Born',
  activity: 'Active',
  imprisonment: 'Imprisoned',
  exile: 'Exiled',
  death: 'Died',
};

export const categoryLabels: Record<string, string> = {
  uprising: 'Uprising',
  battle: 'Battle',
  mutiny: 'Mutiny',
  founding: 'Founding',
  'movement-launch': 'Movement launch',
  march: 'March',
  protest: 'Protest',
  massacre: 'Massacre',
  trial: 'Trial',
  execution: 'Execution',
  pact: 'Pact',
  political: 'Political',
  'turning-point': 'Turning point',
};

/** Events that happened on this day of the year ("Today in Freedom History"). */
export function eventsOnDay(month: number, day: number): EventSummary[] {
  return events.filter((e) => e.date.month === month && e.date.day === day);
}

/** Fighters born or died on this day of the year, from date labels. */
export function anniversariesOnDay(month: number, day: number): { fighter: FighterSummary; kind: 'born' | 'died' }[] {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const needle = `${day} ${monthNames[month - 1]}`;
  const out: { fighter: FighterSummary; kind: 'born' | 'died' }[] = [];
  for (const f of fighters) {
    if (f.birthDateLabel?.startsWith(`${needle} `)) out.push({ fighter: f, kind: 'born' });
    if (f.deathDateLabel?.startsWith(`${needle} `)) out.push({ fighter: f, kind: 'died' });
  }
  return out;
}

/** The integer seed `dailyPick`/`dailyShuffle` derive from today's date. Exposed for callers that need a stable daily index rather than a picked item (e.g. an initial index into a fixed-order list). */
export function dailySeed(salt = 0): number {
  const now = new Date();
  return now.getFullYear() * 372 + (now.getMonth() + 1) * 31 + now.getDate() + salt;
}

/** Deterministic pseudo-random pick that changes daily (for "Discover someone new"). */
export function dailyPick<T>(items: T[], salt = 0): T {
  return items[dailySeed(salt) % items.length];
}

export function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** A small deterministic PRNG (mulberry32), seeded by an integer. */
function seededRandom(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Same-day-stable shuffle: identical order for every render on a given
 * calendar day (needed so build-time prerendered HTML matches what a
 * visitor's browser computes on hydration), but changes daily like
 * `dailyPick`. Use a real `Math.random()`-based shuffle instead for
 * anything triggered by a user action (a "reshuffle" button, for example),
 * which never has to match a prerendered snapshot.
 */
export function dailyShuffle<T>(items: T[], salt = 0): T[] {
  const random = seededRandom(dailySeed(salt));
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Deterministic pick keyed by an arbitrary string (e.g. a record's own id),
    for "the next thing to look at" choices that must stay stable across a
    server-rendered snapshot and the client hydrating it. */
export function hashPick<T>(items: T[], key: string): T | undefined {
  if (items.length === 0) return undefined;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return items[Math.abs(hash) % items.length];
}
