import type { Trail } from '@/types';

export const tamilNaduCloseToHome: Trail = {
  id: 'tamil-nadu-close-to-home',
  slug: 'tamil-nadu-close-to-home',
  version: 1,
  title: 'Resistance close to home: Tamil Nadu',
  question: 'What did resistance look like in one region across 150 years?',
  theme: 'Place',
  minutes: 6,
  learningGoal: 'Put four Tamil events in order across 1799–1932 and explain how the method of resistance changed from armed defence of a fort to breaking a law in public.',
  intro:
    'Tamil Nadu is a present-day state. In 1799 this was the country of the palaiyakkarars — chiefs with their own forts and soldiers — and then, for a century and a half, part of the Madras Presidency. The names of places have changed too: Tuticorin is Thoothukudi, Trichy is Tiruchirappalli. This trail follows one region from the first refusals to pay the Company to the last years before independence.',
  accent: 'forest',
  stops: [
    {
      id: 'panchalankurichi',
      title: 'The chief who would not pay',
      question: 'What happened to a ruler who refused the Company’s demand for tribute?',
      text: [
        'Kattabomman ruled Panchalankurichi, a small palaiyam in the far south. The East India Company demanded tribute; after a violent confrontation with the Collector in 1798, the Company resolved on his destruction. In September 1799 Major Bannerman’s army assaulted his fort at heavy cost; Kattabomman abandoned it by night and fled, only to be handed over by the ruler of Pudukkottai.[^1]',
        'Tried summarily at Kayathar on 16 October 1799 in front of the region’s chiefs, he was hanged from a tamarind tree the same day. The lesson misfired: within two years the whole south was in revolt.[^2]',
      ],
      focus: { kind: 'event', id: 'polygar-war-1799' },
      also: [{ kind: 'fighter', id: 'veerapandiya-kattabomman' }],
      sources: [
        { title: 'Poligar Rebellion records, 1799–1801', publisher: 'Tamil Nadu State Archives', type: 'archive', evidence: 'contemporary' },
        { title: 'Gazetteer of the Tinnevelly District (1916)', url: 'https://archive.org/details/in.ernet.dli.2015.161915', publisher: 'Madras Government Press', type: 'archive', evidence: 'scholarship' },
      ],
      uncertainty: 'The stirring speech attributed to Kattabomman before the Collector comes from Tamil ballads and a 1959 film; Company records confirm his defiance but not the words.',
      contentNote: 'This stop describes an execution.',
      bridge: 'The revolt that followed produced something new: a written call to Indians of every caste and religion to unite.',
    },
    {
      id: 'proclamation-1801',
      title: 'A proclamation on a temple wall',
      question: 'What is unusual about a call to unite issued in 1801?',
      text: [
        'In February 1801 Kattabomman’s brother Oomaithurai escaped from prison and the southern palaiyams rose again. The Marudhu brothers of Sivaganga sheltered him and gave him command, and a loose confederacy took shape from Malabar to Dindigul.[^1]',
        'In June 1801 the Marudhus’ proclamation was fixed to the walls of the Srirangam temple and Tiruchirappalli fort. It denounced the Company and summoned Indians of every caste and religion to expel it — a generation before the word "nation" entered Indian politics. The rising was crushed by November; the brothers were hanged at Tiruppathur on 24 October 1801.[^2]',
      ],
      focus: { kind: 'event', id: 'south-indian-rebellion-1801' },
      also: [
        { kind: 'fighter', id: 'marudhu-brothers' },
        { kind: 'fighter', id: 'velu-nachiyar' },
      ],
      sources: [
        { title: 'The South Indian Rebellion 1800–1801', author: 'K. Rajayyan', publisher: 'Rao and Raghavan, Mysore', year: 1971, type: 'book', evidence: 'scholarship' },
        { title: 'Marudhu Pandiyar memorial records, Kalayar Kovil', publisher: 'Government of Tamil Nadu', type: 'government', evidence: 'reference' },
      ],
      bridge: 'A century later the fight had moved from forts to ports, mills and the printing press.',
    },
    {
      id: 'tuticorin-1908',
      title: 'Swadeshi on the high seas',
      question: 'How did buying and selling become a form of resistance?',
      text: [
        'V. O. Chidambaram Pillai was a lawyer in the port of Tuticorin. In 1906 he founded the Swadeshi Steam Navigation Company to compete with the British shipping line — Swadeshi, the movement to buy Indian, taken to sea. The British company slashed fares to ruin him.[^1]',
        'In February 1908 he took up the cause of strikers at the European-owned Coral Mills and, with Subramania Siva, addressed swelling public meetings. On 12 March both were arrested; Tirunelveli erupted the next day and police firing there killed four people; Tuticorin answered with a general strike. Pillai was sentenced to two life terms and set to a prison oil-press. Tamil Nadu calls him Kappalottiya Tamizhan, the Tamil who sailed the ship.[^2]',
      ],
      focus: { kind: 'fighter', id: 'vo-chidambaram-pillai' },
      also: [{ kind: 'event', id: 'tirunelveli-uprising-1908' }],
      sources: [
        { title: 'V.O.C. commemorative records', publisher: 'Government of Tamil Nadu / V.O. Chidambaranar Port Authority', type: 'government', evidence: 'reference' },
        { title: 'The Swadeshi Movement in the Madras Presidency (studies)', publisher: 'Academic research on South Indian nationalism', type: 'journal', evidence: 'scholarship' },
      ],
      bridge: 'In 1930 the method changed again: break one law, openly, together, and accept the prison that follows.',
    },
    {
      id: 'vedaranyam',
      title: 'Salt at Vedaranyam',
      question: 'Why walk 240 kilometres to pick up a handful of salt?',
      text: [
        'Days after Gandhi reached Dandi, the Tamil Nadu Congress launched its own salt satyagraha. On 13 April 1930 C. Rajagopalachari set out from Tiruchirappalli with about a hundred volunteers, marching through the Kaveri delta to the coast at Vedaranyam, welcomed in every village despite government threats to punish anyone who fed or sheltered them. On 30 April he walked out to the Edanthevar salt swamp to lift salt and was arrested.[^1]',
        'Mass arrests followed. Rukmini Lakshmipathi became the first woman anywhere in India jailed in the movement, serving a year; the young K. Kamaraj served two. Vedaranyam carried the salt satyagraha to the deep south.[^2]',
      ],
      focus: { kind: 'event', id: 'vedaranyam-salt-march' },
      also: [
        { kind: 'fighter', id: 'rukmini-lakshmipathi' },
        { kind: 'fighter', id: 'c-rajagopalachari' },
      ],
      sources: [
        { title: 'Vedaranyam salt satyagraha records, 1930', publisher: 'Tamil Nadu State Archives', type: 'archive', evidence: 'contemporary' },
        { title: 'Rajaji: A Life', author: 'Rajmohan Gandhi', publisher: 'Penguin', year: 1997, type: 'book', evidence: 'scholarship' },
      ],
      bridge: 'Two years later, in a textile town inland, the same movement asked the most of a young weaver.',
    },
    {
      id: 'tiruppur-1932',
      title: 'The one who protected the flag',
      question: 'What made carrying a piece of cloth an act of resistance?',
      text: [
        'Kumaran grew up in a weaving family near Erode and worked in the textile town of Tiruppur, where he founded a youth association to bring young workers into Gandhi’s movement. In January 1932, days after Gandhi’s arrest, Kumaran led a procession through Tiruppur carrying the banned national flag.[^1]',
        'Police attacked the marchers on the banks of the Noyyal river. Kumaran was beaten to the ground and died the next day; he is said to have held the flag aloft even as he fell. He was twenty-seven. Tamil Nadu named him Kodi Kaatha Kumaran, the one who protected the flag.[^2]',
      ],
      focus: { kind: 'fighter', id: 'tiruppur-kumaran' },
      sources: [
        { title: 'Tiruppur Kumaran memorial records', publisher: 'Government of Tamil Nadu', type: 'government', evidence: 'reference' },
        { title: 'Commemorative stamp, 2004', publisher: 'India Post', type: 'government', evidence: 'reference' },
      ],
      contentNote: 'This stop describes a death from police violence.',
      bridge: '',
    },
  ],
  reflection: 'A fort, a proclamation, a shipping company, a handful of salt, a flag. Each is a different way of saying no. Which of them needed the most people to work — and which needed the fewest?',
  activity: {
    kind: 'order',
    prompt: 'Put these four moments from the Tamil country in the order they happened.',
    items: [
      { label: 'Salt is lifted on the shore at Vedaranyam', year: 1930, ref: { kind: 'event', id: 'vedaranyam-salt-march' } },
      { label: 'Kattabomman’s fort at Panchalankurichi falls', year: 1799, ref: { kind: 'event', id: 'polygar-war-1799' } },
      { label: 'The Coral Mills strike and the Tirunelveli rising', year: 1908, ref: { kind: 'event', id: 'tirunelveli-uprising-1908' } },
      { label: 'A proclamation is fixed to the walls of Srirangam temple', year: 1801, ref: { kind: 'event', id: 'south-indian-rebellion-1801' } },
    ],
    explanation: 'Panchalankurichi fell in 1799 and the proclamation followed in 1801 — armed resistance by chiefs and their forces. A century later, in 1908, the fight was over shipping, strikes and public meetings; by 1930 it was mass, open law-breaking. The order is also the story of how resistance changed.',
  },
  followOn: { label: 'Explore Tamil Nadu on the map', to: '/map?state=tamil-nadu' },
  editorial: {
    status: 'reviewed',
    reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
    reviewedOn: '2026-09-09',
    notes:
      'Drafted 2026-09-08 from the records’ own text. Fact-checked 2026-09-09 (~69 claims) against Britannica, cited Wikipedia, Rajayyan-derived journalism and archival papers: one error corrected (the four 1908 police-firing deaths were in Tirunelveli, not Tuticorin), contested details softened (Rajaji arrested at the Edanthevar salt swamp; Panchalankurichi abandoned rather than breached; Kumaran’s flag as tradition), and the 1916 Tinnevelly gazetteer citation corrected. Place-name equivalences (Tuticorin/Thoothukudi etc.) confirmed.',
  },
  teaching: {
    alignment: 'Proposed for upper-primary and secondary history — resistance to colonial rule; evidence and interpretation. Not yet mapped to a specific board or state curriculum.',
    shortVersion: ['panchalankurichi', 'vedaranyam', 'tiruppur-1932'],
    prompts: [
      'This trail moves from an armed fort to a shipping company to a fistful of salt to a flag. What had to change in society for each later method to become possible?',
      'More than a century separates the fall of Panchalankurichi from the Vedaranyam salt march. What stayed the same about what the Company or the government was defending?',
      'Which of these five moments do you think local students in Tamil Nadu are most likely to have heard about already — and which the least? Why might that be?',
    ],
    facilitatorNotes: [
      'The order activity works well as a warm-up before discussion, since students often assume armed resistance came later than mass civil disobedience.',
      'V.O. Chidambaram Pillai\'s shipping venture is a useful bridge between economic and political resistance — draw that connection out explicitly.',
      'If a student asks why the Tirunelveli rising is less well known nationally than the Salt March, that is worth sitting with rather than answering quickly.',
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-09' },
  },
};
