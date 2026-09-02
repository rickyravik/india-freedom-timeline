/**
 * Content access layer — the single place UI code goes to for historical
 * records and the connections between them.
 */
import type { FreedomFighter, HistoricalEvent, Movement, RegionId } from '@/types';
import { fighters, fighterById, fighterBySlug } from '@/data/fighters';
import { events, eventById, eventBySlug } from '@/data/events';
import { movements, movementById } from '@/data/movements';
import { organizations, organizationById } from '@/data/organizations';
import { eras, eraById } from '@/data/eras';
import { states, stateById } from '@/data/regions';

export {
  fighters,
  fighterById,
  fighterBySlug,
  events,
  eventById,
  eventBySlug,
  movements,
  movementById,
  organizations,
  organizationById,
  eras,
  eraById,
  states,
  stateById,
};

export const movementBySlug = new Map(movements.map((m) => [m.slug, m]));

/** Fighters linked to an event (declared on either side of the relation). */
export function fightersForEvent(event: HistoricalEvent): FreedomFighter[] {
  const ids = new Set(event.people);
  for (const f of fighters) {
    if (f.timelineEvents.includes(event.id)) ids.add(f.id);
  }
  return [...ids].map((id) => fighterById.get(id)).filter((f): f is FreedomFighter => Boolean(f));
}

/** Events linked to a fighter (declared on either side of the relation). */
export function eventsForFighter(fighter: FreedomFighter): HistoricalEvent[] {
  const ids = new Set(fighter.timelineEvents);
  for (const e of events) {
    if (e.people.includes(fighter.id)) ids.add(e.id);
  }
  return events.filter((e) => ids.has(e.id));
}

export function fightersForMovement(movement: Movement): FreedomFighter[] {
  const ids = new Set(movement.keyPeople);
  for (const f of fighters) {
    if (f.movements.includes(movement.id)) ids.add(f.id);
  }
  return [...ids].map((id) => fighterById.get(id)).filter((f): f is FreedomFighter => Boolean(f));
}

export function eventsForMovement(movement: Movement): HistoricalEvent[] {
  const ids = new Set(movement.keyEvents);
  for (const e of events) {
    if (e.movement === movement.id) ids.add(e.id);
  }
  return events.filter((e) => ids.has(e.id));
}

export function fightersForState(stateName: string): FreedomFighter[] {
  return fighters.filter((f) => f.states.includes(stateName));
}

export function eventsForState(stateName: string): HistoricalEvent[] {
  return events.filter((e) => e.states?.includes(stateName));
}

export function fightersForRegion(region: RegionId): FreedomFighter[] {
  return fighters.filter((f) => f.region === region);
}

export function relatedFighters(fighter: FreedomFighter): FreedomFighter[] {
  return fighter.relatedPeople
    .map((id) => fighterById.get(id))
    .filter((f): f is FreedomFighter => Boolean(f));
}

/** Lifespan label, e.g. "1907 – 1931". */
export function lifespan(f: FreedomFighter): string {
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
export function eventsOnDay(month: number, day: number): HistoricalEvent[] {
  return events.filter((e) => e.date.month === month && e.date.day === day);
}

/** Fighters born or died on this day of the year, from date labels. */
export function anniversariesOnDay(month: number, day: number): { fighter: FreedomFighter; kind: 'born' | 'died' }[] {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const needle = `${day} ${monthNames[month - 1]}`;
  const out: { fighter: FreedomFighter; kind: 'born' | 'died' }[] = [];
  for (const f of fighters) {
    if (f.birthDateLabel?.startsWith(`${needle} `)) out.push({ fighter: f, kind: 'born' });
    if (f.deathDateLabel?.startsWith(`${needle} `)) out.push({ fighter: f, kind: 'died' });
  }
  return out;
}

/** Deterministic pseudo-random pick that changes daily (for "Discover someone new"). */
export function dailyPick<T>(items: T[], salt = 0): T {
  const now = new Date();
  const seed = now.getFullYear() * 372 + (now.getMonth() + 1) * 31 + now.getDate() + salt;
  return items[seed % items.length];
}

export function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
