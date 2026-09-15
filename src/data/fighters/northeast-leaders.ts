import type { FreedomFighter } from '@/types';

/**
 * Freedom fighters of the Northeast beyond the Naga hills — Manipur's
 * royal resistance in the Anglo-Manipur War of 1891, and Assam's earliest
 * martyr of the freedom struggle in 1858. This archive has carried very
 * few Northeast records; these two begin to fill that gap.
 */
export const northeastLeaders: FreedomFighter[] = [
  {
    id: 'bir-tikendrajit',
    slug: 'bir-tikendrajit',
    name: 'Bir Tikendrajit',
    alternateNames: ['Yuvraj Tikendrajit Singh', 'Senapati Tikendrajit'],
    birthYear: 1856,
    deathYear: 1891,
    deathDateLabel: '13 August 1891',
    birthPlace: 'Imphal, Manipur',
    region: 'northeast',
    states: ['Manipur'],
    gender: 'male',
    era: 'rise-of-nationalism',
    roles: ['military-leader', 'ruler'],
    summary:
      'Senapati (commander-in-chief) of Manipur and the central figure of the Anglo-Manipur War of 1891, whose resistance to British interference in the kingdom’s succession led to the deaths of several British officers and, after the kingdom fell, his own public execution — an event Manipur still marks each year.',
    shortStory: [
      {
        title: 'The Senapati of Manipur',
        text: 'Tikendrajit, son of Maharaja Chandrakirti Singh, held real military power in Manipur as its Senapati, or commander-in-chief. In 1890, amid a succession dispute, he helped place his brother Kulachandra on the throne in place of their eldest brother.',
      },
      {
        title: 'The British march in',
        text: 'The British refused to accept the new arrangement unless Tikendrajit himself was handed over. In March 1891 they sent a political and military mission to Manipur to enforce his arrest.',
      },
      {
        title: 'Bloodshed at the palace',
        text: 'When British officers tried to seize Tikendrajit during negotiations on 24 March 1891, fighting broke out and several British officials were killed. A full British expedition followed, and after weeks of resistance the Kangla palace fell in late April.',
      },
      {
        title: 'The polo ground',
        text: 'Captured and tried by a British military commission, Tikendrajit was hanged in public together with General Thangal at Imphal’s polo ground on 13 August 1891.',
      },
      {
        title: 'Patriots’ Day',
        text: 'Manipur observes 13 August every year as Patriots’ Day, honouring Tikendrajit and the others who died resisting the kingdom’s annexation.',
      },
    ],
    fullBiography: [
      'Tikendrajit Singh, son of Maharaja Chandrakirti Singh, rose to be Manipur’s Senapati — commander-in-chief of its armed forces — and the kingdom’s most powerful figure behind the throne. In September 1890, during a dispute over the succession, he engineered the removal of his eldest brother, Surchandra Singh, and the installation of another brother, Kulachandra, as Maharaja, while retaining military command himself.',
      'The British authorities refused to recognise the new arrangement unless Tikendrajit submitted to arrest. When a British mission led by Chief Commissioner James Quinton and political agent Frank Grimwood sought to seize him during negotiations at the Residency on 24 March 1891, fighting broke out and several British officers were killed. The British government answered with a full military expedition — the Anglo-Manipur War — and Manipuri forces resisted for weeks, notably at Khongjom, before the British occupied the Kangla palace on 27 April 1891.',
      'Tikendrajit was captured, tried before a British military commission on charges of waging war against the Crown, and hanged in public with General Thangal at the Imphal polo ground on 13 August 1891. Manipur observes that date each year as Patriots’ Day, and the ground itself — now called Bir Tikendrajit Ground — carries his name.',
    ],
    entryIntoStruggle: 'Resistance to British demands for his arrest during the Manipur succession dispute, 1890–91.',
    achievements: [
      'Commanded Manipur’s forces during the Anglo-Manipur War of 1891, one of the last Northeast kingdoms to resist British annexation by force',
    ],
    sacrifices: ['Publicly hanged at Imphal in 1891'],
    legacy: 'Manipur observes 13 August as Patriots’ Day in his memory and that of General Thangal and others executed after the war.',
    facts: ['Bir Tikendrajit Ground, the Imphal polo ground where he was hanged, is named after him.'],
    timelineEvents: [],
    movements: [],
    organizations: [],
    relatedPeople: [],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    sources: [
      {
        title: 'Anglo-Manipur War records, 1891',
        publisher: 'Manipur State Archives',
        type: 'archive',
      },
      {
        title: 'Patriots’ Day commemorations',
        publisher: 'Government of Manipur',
        type: 'government',
      },
    ],
    tags: ['Manipur', 'Anglo-Manipur War', 'Northeast'],
    forgotten: true,
  },
  {
    id: 'maniram-dewan',
    slug: 'maniram-dewan',
    name: 'Maniram Dewan',
    alternateNames: ['Maniram Dutta Baruah'],
    birthYear: 1806,
    deathYear: 1858,
    birthDateLabel: '17 April 1806',
    deathDateLabel: '26 February 1858',
    birthPlace: 'Charing, near Jorhat, Assam',
    region: 'northeast',
    states: ['Assam'],
    gender: 'male',
    era: 'revolt-1857',
    roles: ['organizer', 'political-leader'],
    summary:
      'Assamese aristocrat and Assam’s first independent tea planter who, disillusioned with Company rule, worked to restore the Ahom monarchy and was hanged at Jorhat in 1858 for his part in a plot to incite the 1857 revolt in Assam.',
    shortStory: [
      {
        title: 'Servant of two powers',
        text: 'Maniram Dutta Baruah rose high in the old Ahom nobility, then in the East India Company’s Assam administration, where he learned the tea trade the Company itself was experimenting with.',
      },
      {
        title: 'Assam’s first tea planter',
        text: 'He left Company service to start his own tea gardens — the first Assamese to do so independently of the European-run tea companies that dominated the industry.',
      },
      {
        title: 'A plot for the old kingdom',
        text: 'Land and licensing policies favouring European planters soured his view of Company rule. When revolt broke out elsewhere in India in 1857, he worked from Calcutta to encourage Kandarpeswar Singha, an Ahom prince, to reclaim the throne with popular support.',
      },
      {
        title: 'Discovered',
        text: 'His letters urging an Assamese rising were intercepted at Jorhat. He was arrested, tried within days, and hanged there on 26 February 1858 alongside his associate Piyoli Baruah.',
      },
      {
        title: 'Remembered in Assam',
        text: 'He is remembered today as one of Assam’s earliest martyrs of the freedom struggle, alongside the tea industry he helped found.',
      },
    ],
    fullBiography: [
      'Maniram Dutta Baruah, known as Maniram Dewan, was born in 1806 near Jorhat into an Ahom aristocratic family. He served the old Ahom court and, after the Company annexed Assam in 1826, its colonial administration as well, rising to a senior revenue post and gaining early knowledge of tea cultivation through the Company’s own plantations.',
      'By the 1840s he had left Company service to start his own tea gardens — the first Assamese-owned tea estates independent of the European companies that came to dominate the industry. Revenue and licensing policies that favoured European planters over Assamese ones deepened his grievances against Company rule, and he began working, through correspondence, to see the Ahom monarchy restored under the exiled prince Kandarpeswar Singha.',
      'When the wider revolt broke out in 1857, Maniram, then in Calcutta, wrote letters encouraging an Assamese rising in the prince’s name. The letters were intercepted at Jorhat; he was brought back, tried alongside his associate Piyoli Baruah in a single-day proceeding, and both were sentenced to death and hanged at Jorhat on 26 February 1858. He is remembered today as one of Assam’s earliest martyrs of the freedom struggle and as the founder of its indigenous tea industry.',
    ],
    entryIntoStruggle: 'Correspondence in 1857 encouraging an Assamese uprising in support of the exiled Ahom prince Kandarpeswar Singha.',
    achievements: [
      'Assam’s first independent Assamese tea planter',
      'Organized support in Assam for the wider 1857 uprising',
    ],
    sacrifices: ['Tried and hanged at Jorhat in 1858'],
    legacy: 'Remembered in Assam as an early martyr of the freedom struggle and the founder of Assamese-owned tea planting.',
    facts: ['He is regarded as the first Assamese entrepreneur to independently own and run tea gardens.'],
    timelineEvents: [],
    movements: ['great-revolt'],
    organizations: [],
    relatedPeople: ['turrebaz-khan', 'bahadur-shah-zafar'],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    sources: [
      {
        title: 'Maniram Dewan trial records, Jorhat, 1858',
        publisher: 'Assam State Archives',
        type: 'archive',
      },
      {
        title: 'Maniram Dewan commemorations',
        publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav',
        url: 'https://amritkaal.nic.in/',
        type: 'government',
      },
    ],
    tags: ['Assam', 'tea', 'Revolt of 1857', 'Ahom'],
    forgotten: true,
  },
];
