import type { HistoricalEvent } from '@/types';
import { earlyEvents } from './early';
import { risingEvents } from './rising';
import { finalEvents } from './final';
import { tamilNaduEvents } from './tamil-nadu';

export const events: HistoricalEvent[] = [...earlyEvents, ...risingEvents, ...finalEvents, ...tamilNaduEvents].sort(
  (a, b) => a.date.year - b.date.year || (a.date.month ?? 0) - (b.date.month ?? 0) || (a.date.day ?? 0) - (b.date.day ?? 0),
);

export const eventById = new Map(events.map((e) => [e.id, e]));
export const eventBySlug = new Map(events.map((e) => [e.slug, e]));
