import type { Route } from '@/types';

export const dandiMarch: Route = {
  id: 'dandi-march',
  slug: 'dandi-march',
  title: 'The Salt March, Sabarmati to Dandi',
  question: 'What did twenty-four days of walking do that a speech could not?',
  summary: 'Gandhi and seventy-eight volunteers walked about 240 miles from Sabarmati Ashram to the sea at Dandi, 12 March to 6 April 1930, to break the salt law in public.',
  frame: 'present-day',
  frameNote: 'A schematic of the route through present-day Gujarat. Positions are indicative, not surveyed; the coast and towns are drawn for orientation only.',
  eventId: 'dandi-march',
  stops: [
    { id: 'sabarmati', name: 'Sabarmati Ashram, Ahmedabad', dateLabel: '12 March 1930', note: 'Gandhi left the ashram at dawn with seventy-eight chosen volunteers, having announced the plan to the Viceroy in advance.[^1]', x: 22, y: 12, approximate: true },
    { id: 'aslali', name: 'Aslali', dateLabel: '12 March 1930', note: 'The first night’s halt, a few hours south of the ashram; villagers gathered to hear the marchers.', x: 26, y: 20, approximate: true },
    { id: 'nadiad', name: 'Nadiad', dateLabel: '15 March 1930', note: 'Into the Kheda district, where Gandhi had led a peasant satyagraha over land revenue in 1918.', x: 32, y: 30, approximate: true },
    { id: 'anand', name: 'Anand', dateLabel: '16–17 March 1930', note: 'Public meetings each evening; village headmen along the route began resigning their posts. The marchers rested here a day before continuing.', x: 36, y: 37, approximate: true },
    { id: 'borsad', name: 'Borsad', dateLabel: '18 March 1930', note: 'The marchers were welcomed by the villages of the 1923 Borsad satyagraha.', x: 38, y: 43, approximate: true },
    { id: 'bharuch', name: 'Bharuch (Broach)', dateLabel: '26 March 1930', note: 'Crossing the Narmada; the world’s press was now following the march village to village.[^1]', x: 44, y: 56, approximate: true },
    { id: 'surat', name: 'Surat', dateLabel: '1 April 1930', note: 'Some 30,000 people gathered to hear the marchers, who moved on the next morning towards the coast.', x: 52, y: 70, approximate: true },
    { id: 'navsari', name: 'Navsari', dateLabel: '3–4 April 1930', note: 'The last town before the sea; crowds walked the final miles with the volunteers.', x: 58, y: 80, approximate: true },
    { id: 'dandi', name: 'Dandi', dateLabel: '5–6 April 1930', note: 'On the morning of 6 April Gandhi picked up a lump of natural salt on the beach; Sarojini Naidu, beside him, cried "Hail, Deliverer!"[^1]', x: 64, y: 90, approximate: true, placeId: 'dandi' },
  ],
  outcome: [
    'Salt was made and sold illegally across the coasts; C. Rajagopalachari marched to Vedaranyam in the south. In May, volunteers marching on the Dharasana salt works stood rank after rank under police lathis without raising a hand, reported worldwide by Webb Miller.[^1]',
    'Some 60,000 Indians or more — by some counts 90,000 — women among them in unprecedented numbers, filled the jails before the campaign paused with the Gandhi–Irwin Pact in March 1931. The march turned mass law-breaking into moral spectacle and made the movement truly popular.[^2]',
  ],
  sources: [
    { title: 'Gandhi: The Years That Changed the World', author: 'Ramachandra Guha', publisher: 'Penguin Allen Lane', year: 2018, type: 'book', evidence: 'scholarship' },
    { title: 'Dandi March records and photographs', publisher: 'National Gandhi Museum', type: 'museum', evidence: 'reference' },
  ],
  editorial: {
    status: 'reviewed',
    reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
    reviewedOn: '2026-09-09',
    notes:
      'Stop list and dates verified 2026-09-09 against the primary record: the Collected Works of Mahatma Gandhi, Vol. 43 (Publications Division; archive.org item in.ernet.dli.2015.47021), whose contents index dates a speech at each halt — Aslali 12-3, Nadiad 15-3, Anand 17-3 (arrived the 16th, Boriavi speech that day), Borsad 18-3, Broach and Ankleshwar 26-3, Surat 1-4, Navsari and Vijalpur 4-4 (arrived the 3rd), Dandi 5-4 and 6-4. Cross-checked too against Wikipedia\'s day-by-day route. Anand and Navsari are therefore given as two-day ranges. The Surat note was corrected: the marchers did not rest there but moved on the next morning. What remains for a human reviewer: sign off (reviewedBy/reviewedOn), and either add [^n] markers to the intermediate-stop notes (they are context drawn from the same volume, not yet cited claim by claim) or cut them.',
  },
};
