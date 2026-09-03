import type { HistoricalEvent } from '@/types';

/** Events of the freedom struggle in the Tamil country. */
export const tamilNaduEvents: HistoricalEvent[] = [
  {
    id: 'polygar-war-1799',
    slug: 'fall-of-panchalankurichi',
    title: 'Fall of Panchalankurichi & execution of Kattabomman',
    date: { year: 1799, month: 10, day: 16 },
    dateLabel: 'September – 16 October 1799',
    location: 'Panchalankurichi & Kayathar, Tamil Nadu',
    region: 'south',
    states: ['Tamil Nadu'],
    summary:
      'Major Bannerman’s Company army storms Kattabomman’s fort; the chieftain is betrayed, captured and hanged at Kayathar before the assembled palaiyakkarars.',
    description: [
      'The Poligar wars of the Tirunelveli country came to their crisis in 1799. After Kattabomman’s escape from Collector Jackson’s summons the previous year, the Company resolved on his destruction: Major Bannerman marched on Panchalankurichi in September 1799 and, after costly fighting, breached the mud fort on 5 September. Kattabomman fled towards Pudukkottai, where the Tondaiman ruler, a Company ally, had him seized.',
      'Tried summarily at Kayathar on 16 October 1799 in the presence of the region’s chiefs, he was hanged from a tamarind tree the same day. His deaf-mute brother Oomaithurai was jailed at Palayamkottai and the fort levelled. The intended lesson misfired: Oomaithurai’s escape in 1801 helped ignite the far larger South Indian Rebellion.',
    ],
    people: ['veerapandiya-kattabomman', 'ondiveeran'],
    movement: 'early-uprisings',
    era: 'early-resistance',
    category: 'execution',
    sources: [
      {
        title: 'Poligar Rebellion records, 1799–1801',
        publisher: 'Tamil Nadu State Archives',
        type: 'archive',
      },
      {
        title: 'Tirunelveli District Gazetteer',
        url: 'https://archive.org/details/in.ernet.dli.2015.161915',
        publisher: 'Government of Tamil Nadu',
        type: 'archive',
      },
    ],
    featured: true,
  },
  {
    id: 'south-indian-rebellion-1801',
    slug: 'south-indian-rebellion-1801',
    title: 'South Indian Rebellion & the Tiruchirappalli Proclamation',
    date: { year: 1801, month: 6, endYear: 1801 },
    dateLabel: 'February – November 1801',
    location: 'Sivaganga, Tiruchirappalli & the Tamil country',
    region: 'south',
    states: ['Tamil Nadu', 'Kerala', 'Karnataka'],
    summary:
      'The Marudhu brothers, Oomaithurai and allied chiefs from Malabar to Dindigul rise together against the Company — and post a proclamation calling all Indians to unite against foreign rule.',
    description: [
      'Oomaithurai’s escape from Palayamkottai in February 1801 set the southern palaiyams alight. The Marudhu brothers of Sivaganga gave him shelter and command, and a loose confederacy took shape across the peninsula — Kerala Varma Pazhassi Raja in Malabar, Gopala Nayak at Dindigul, Dhoondaji Wagh in the Maratha country. In June 1801 the Marudhus’ proclamation, fixed to the walls of the Srirangam temple and Tiruchirappalli fort, denounced the Company’s treachery and greed and summoned Indians of every caste and religion to expel it — a call to national resistance a generation before the word "nation" entered Indian politics.',
      'The Company concentrated forces under Colonel Agnew. Panchalankurichi fell again in May, Kalayar Kovil — the Marudhus’ forest stronghold — in October. The brothers were hanged at Tiruppathur on 24 October 1801; Oomaithurai and others at Panchalankurichi on 16 November; hundreds were transported to Penang. The Carnatic Treaty that followed made the Company master of the Tamil country.',
    ],
    people: ['marudhu-brothers', 'veerapandiya-kattabomman', 'dheeran-chinnamalai', 'pazhassi-raja'],
    movement: 'early-uprisings',
    era: 'early-resistance',
    category: 'uprising',
    significance: 'The first coordinated multi-regional rising against Company rule, with an explicit call to pan-Indian unity.',
    sources: [
      {
        title: 'The South Indian Rebellion 1800–1801',
        author: 'K. Rajayyan',
        publisher: 'Rao and Raghavan, Mysore',
        year: 1971,
        type: 'book',
      },
      {
        title: 'Marudhu Pandiyar memorial records, Kalayar Kovil',
        publisher: 'Government of Tamil Nadu',
        type: 'government',
      },
    ],
    featured: true,
  },
  {
    id: 'tirunelveli-uprising-1908',
    slug: 'tirunelveli-uprising-1908',
    title: 'Tuticorin strike & Tirunelveli rising',
    date: { year: 1908, month: 3, day: 13 },
    dateLabel: 'February – 13 March 1908',
    location: 'Tuticorin & Tirunelveli, Tamil Nadu',
    region: 'south',
    states: ['Tamil Nadu'],
    summary:
      'V. O. Chidambaram Pillai and Subramania Siva lead the Coral Mills strike and Swadeshi meetings; their arrest sets Tirunelveli ablaze, and police fire on crowds at Tuticorin.',
    description: [
      'The Swadeshi movement reached its southern climax in the port of Tuticorin in early 1908. V. O. Chidambaram Pillai, already fighting a rate war with British shipping through his Swadeshi Steam Navigation Company, took up the cause of the strikers at the European-owned Coral Mills in February; with Subramania Siva he addressed swelling public meetings and planned celebrations of Bipin Chandra Pal’s release from prison for 9 March.',
      'The authorities banned the meetings and, on 12 March, arrested Pillai, Siva and Padmanabha Iyengar. Tirunelveli erupted on 13 March — the municipal office, courts and police station were attacked and burned — and at Tuticorin police firing killed four people. Sub-Collector Robert Ashe’s role in the repression, and in the ruin of the Swadeshi shipping company, would be answered three years later at Maniyachi. Pillai and Siva received sentences of transportation, later reduced; the Tamil Swadeshi movement never recovered its open strength, but its martyrs became legend.',
    ],
    people: ['vo-chidambaram-pillai', 'subramania-siva', 'subramania-bharati'],
    movement: 'swadeshi',
    era: 'swadeshi-era',
    category: 'protest',
    sources: [
      {
        title: 'Tinnevelly sedition case and riot records, 1908',
        publisher: 'Tamil Nadu State Archives',
        type: 'archive',
      },
      {
        title: 'The Swadeshi Movement in the Madras Presidency (studies)',
        publisher: 'Academic research on South Indian nationalism',
        type: 'journal',
      },
    ],
  },
  {
    id: 'maniyachi-1911',
    slug: 'maniyachi-1911',
    title: 'Killing of Collector Ashe at Maniyachi',
    date: { year: 1911, month: 6, day: 17 },
    dateLabel: '17 June 1911',
    location: 'Maniyachi Junction, Tamil Nadu',
    region: 'south',
    states: ['Tamil Nadu'],
    summary:
      'Vanchinathan shoots Robert Ashe — the official who crushed the Tamil Swadeshi movement — in a train at Maniyachi, then takes his own life. The only assassination of a British official in the Madras Presidency.',
    description: [
      'On 17 June 1911, Robert Ashe, Collector of Tinnevelly, waited with his wife in a first-class carriage at Maniyachi junction for the Ceylon boat mail. Vanchinathan, a twenty-five-year-old member of the secret Bharatha Matha Association, boarded, shot him dead, and fled to the station lavatory, where he shot himself. The letter found on his body declared that the British had trampled India’s dharma and that his comrades had sworn to kill George V during his coming visit.',
      'The Ashe murder conspiracy case tried fourteen men — several were convicted, including Nilakanta Brahmachari; V. V. S. Aiyar in French Pondicherry, whom intelligence blamed for training the killer, was beyond reach. Ashe had personally ordered the 1908 arrests and the Tuticorin firing; to the revolutionaries, Maniyachi was the answer. The junction is now Vanchi Maniyachi.',
    ],
    people: ['vanchinathan', 'vvs-aiyar', 'vo-chidambaram-pillai'],
    movement: 'revolutionary-movement',
    era: 'swadeshi-era',
    category: 'turning-point',
    sources: [
      {
        title: 'Ashe murder case records, 1911',
        publisher: 'Tamil Nadu State Archives',
        type: 'archive',
      },
      {
        title: 'Vanchinathan memorial, Shenkottai',
        publisher: 'Government of Tamil Nadu',
        type: 'government',
      },
    ],
  },
  {
    id: 'vedaranyam-salt-march',
    slug: 'vedaranyam-salt-march',
    title: 'Vedaranyam Salt March',
    date: { year: 1930, month: 4, day: 30 },
    dateLabel: '13 – 30 April 1930',
    location: 'Tiruchirappalli to Vedaranyam, Tamil Nadu',
    region: 'south',
    states: ['Tamil Nadu'],
    summary:
      'C. Rajagopalachari leads the south’s salt march — 150 miles from Tiruchirappalli to the Vedaranyam coast — where salt is lifted in defiance of the law and hundreds, including Rukmini Lakshmipathi and young Kamaraj, go to jail.',
    description: [
      'Days after Gandhi reached Dandi, the Tamil Nadu Congress launched its own salt satyagraha. On 13 April 1930 C. Rajagopalachari set out from Tiruchirappalli with about a hundred volunteers, marching some 240 kilometres south-east through the Kaveri delta to the salt coast at Vedaranyam, welcomed in every village despite the government’s threats to punish anyone who fed or sheltered the marchers. Sardar Vedaratnam Pillai organized the coast; on 30 April Rajaji lifted salt on the shore and was arrested.',
      'Mass arrests followed — Rukmini Lakshmipathi became the presidency’s first woman jailed in the movement, and the young K. Kamaraj served two years. Vedaranyam made the salt satyagraha a truly all-India event, and gave the Tamil Congress its formative generation.',
    ],
    people: ['c-rajagopalachari', 'rukmini-lakshmipathi', 'k-kamaraj'],
    movement: 'civil-disobedience',
    era: 'civil-disobedience',
    category: 'march',
    sources: [
      {
        title: 'Vedaranyam salt satyagraha records, 1930',
        publisher: 'Tamil Nadu State Archives',
        type: 'archive',
      },
      {
        title: 'Rajaji: A Life',
        author: 'Rajmohan Gandhi',
        publisher: 'Penguin',
        year: 1997,
        type: 'book',
      },
    ],
    featured: true,
  },
];
