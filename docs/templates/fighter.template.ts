import type { FreedomFighter } from '@/types';

/**
 * Copy this object into the appropriate file under src/data/fighters/
 * (grouped by era) and add it to that file's exported array. See
 * CONTRIBUTING.md for the full workflow and house rules.
 */
export const fighterTemplate: FreedomFighter = {
  id: 'kebab-case-id', // unique across all fighters, never reused even if removed later
  slug: 'kebab-case-id', // usually the same as id; this is the URL /fighters/<slug>
  name: 'Full name as commonly known',
  alternateNames: ['Other name or title, if any'], // optional — omit the key if none
  shortName: 'Short form for headings', // optional — used in "People connected to …"; omit to use the full name
  portrait: undefined, // optional: '/images/fighters/<slug>.jpg' — only a genuine, correctly-attributed, freely-licensed image
  birthYear: 1900, // optional if genuinely unknown, but include whenever documented
  deathYear: 1950,
  birthDateLabel: '1 January 1900', // optional precise display string
  deathDateLabel: '1 January 1950',
  birthPlace: 'Town, modern state',
  region: 'north', // one of: north | south | east | west | central | northeast | abroad
  states: ['Modern state name'], // must match names in src/data/regions.ts (soft warning if not, not a hard error)
  gender: 'male', // 'male' | 'female'
  summary: 'One to two sentence introduction — what they are known for, in plain language.',
  shortStory: [
    // Story Mode: 3-6 short chapters, each under 600 characters, written for children/casual readers.
    { title: 'Chapter title', text: 'Chapter text.' },
    { title: 'Chapter title', text: 'Chapter text.' },
    { title: 'Chapter title', text: 'Chapter text.' },
  ],
  fullBiography: [
    // Read More mode: full paragraphs for older students and adults. One string per paragraph.
    'First paragraph of the detailed biography.',
    'Second paragraph.',
  ],
  entryIntoStruggle: 'How and why they entered the freedom struggle.', // optional
  ideology: 'Ideology or philosophy, where historically appropriate.', // optional
  achievements: ['A concrete achievement.'], // optional
  sacrifices: ['What they gave up or lost.'], // optional
  legacy: 'How they are remembered today.', // optional
  facts: ['An interesting, independently verifiable fact.'], // optional
  disputed: [
    // optional — use for any claim historians genuinely contest or that rests on uncertain evidence
    { claim: 'What is disputed', note: 'What the dispute actually is, and why.' },
  ],
  quotes: [
    // optional
    { text: 'A quote attributed to them.', context: 'When/where said.', source: 'Where this is documented.', disputed: false },
  ],
  timelineEvents: ['event-id-they-are-linked-to'], // must resolve to real event ids
  movements: ['movement-id'], // must resolve to real movement ids
  organizations: ['organization-id'], // must resolve to real organization ids
  roles: ['revolutionary'], // one or more: revolutionary | political-leader | satyagrahi | social-reformer |
  //                             tribal-leader | military-leader | ruler | writer-poet | journalist | lawyer | educator | organizer
  relatedPeople: ['other-fighter-id'], // must resolve to real fighter ids; link both directions where it makes sense
  sources: [
    // required — at least one, with a title and a type
    { title: 'Source title', publisher: 'Publisher or archive', type: 'archive', url: 'https://…' },
  ],
  images: undefined, // optional string[] — a small gallery, distinct from `portrait`
  tags: ['a search/browse tag'], // optional
  era: 'era-id', // must be a real id from src/data/eras.ts; the event/date checks below depend on this being right
  featured: false, // optional — surfaces on the home page
  forgotten: false, // optional — surfaces in "Forgotten Heroes"
};
