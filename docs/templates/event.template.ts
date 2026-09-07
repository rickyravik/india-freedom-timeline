import type { HistoricalEvent } from '@/types';

/**
 * Copy this object into the appropriate file under src/data/events/
 * (grouped by period) and add it to that file's exported array. See
 * CONTRIBUTING.md for the full workflow and house rules.
 */
export const eventTemplate: HistoricalEvent = {
  id: 'kebab-case-id', // unique across all events, never reused even if removed later
  slug: 'kebab-case-id', // usually the same as id; this is the URL /events/<slug>
  title: 'Event title',
  date: {
    year: 1930, // must fall inside the range of the `era` id below, or the validator fails
    month: 4, // optional, 1-12
    day: 6, // optional, 1-31
    endYear: undefined, // optional — for events spanning multiple years
    approximate: false, // optional — true if the date itself is approximate
  },
  dateLabel: '6 April 1930', // human-readable display string
  location: 'Place name', // optional
  region: 'west', // optional: north | south | east | west | central | northeast | abroad
  states: ['Modern state name'], // optional — must match names in src/data/regions.ts
  summary: 'One to two sentence introduction.',
  description: [
    // Full account, one string per paragraph.
    'First paragraph.',
    'Second paragraph.',
  ],
  people: ['fighter-id-involved'], // must resolve to real fighter ids
  movement: 'movement-id', // optional — must resolve to a real movement id if present
  era: 'era-id', // must be a real id from src/data/eras.ts, and date.year must fall within its range
  category: 'march', // one of: uprising | battle | mutiny | founding | movement-launch | march | protest |
  //                        massacre | trial | execution | pact | political | turning-point
  significance: 'Why this event mattered.', // optional
  disputed: [
    // optional — use for any claim historians genuinely contest or that rests on uncertain evidence
    { claim: 'What is disputed', note: 'What the dispute actually is, and why.' },
  ],
  sources: [
    // required — at least one, with a title and a type
    { title: 'Source title', publisher: 'Publisher or archive', type: 'archive', url: 'https://…' },
  ],
  featured: false, // optional — surfaces in home page key events
};
