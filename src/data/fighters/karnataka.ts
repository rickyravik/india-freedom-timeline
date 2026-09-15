import type { FreedomFighter } from '@/types';

/**
 * Kannadiga freedom fighters — from Kittur's war of 1824 through the
 * Congress-building years of the early twentieth century.
 */
export const karnatakaFighters: FreedomFighter[] = [
  {
    id: 'sangolli-rayanna',
    slug: 'sangolli-rayanna',
    name: 'Sangolli Rayanna',
    portrait: '/images/fighters/sangolli-rayanna.jpg',
    portraitNote: {
      kind: 'statue',
      caption: 'Statue of Sangolli Rayanna in Bengaluru. No contemporary (pre-photography-era) likeness of Rayanna is known to survive; Karnataka’s memorials and folk-art depictions are all later commemorative works.',
      credit: 'Photograph by Chidhuc26, Wikimedia Commons',
      created: 'photographed 2021',
    },
    birthYear: 1798,
    deathYear: 1831,
    birthDateLabel: '15 August 1798',
    deathDateLabel: '26 January 1831',
    birthPlace: 'Sangolli, Belagavi district, Karnataka',
    region: 'south',
    states: ['Karnataka'],
    gender: 'male',
    era: 'early-resistance',
    roles: ['military-leader'],
    summary:
      'A commander in Rani Chennamma of Kittur’s forces who kept up armed resistance against the East India Company in the Kittur region after her defeat, and was captured and hanged in 1831.',
    shortStory: [
      {
        title: 'A soldier of Kittur',
        text: 'Sangolli Rayanna served as a commander under Rani Chennamma of Kittur, the queen who took up arms in 1824 rather than accept a British-imposed heir on her throne.',
      },
      {
        title: 'The fight goes on',
        text: 'When Kittur fell and Chennamma was imprisoned, Rayanna refused to accept British rule. He kept fighting, gathering fresh followers and striking at Company forces across the Kittur countryside.',
      },
      {
        title: 'Captured and hanged',
        text: 'The British eventually captured him. Rayanna was hanged from a banyan tree at Nandagad in 1831, but Karnataka never forgot him — songs and memorials keep his name alive alongside Chennamma’s.',
      },
    ],
    fullBiography: [
      'Sangolli Rayanna served as a senior military commander under Rani Chennamma of Kittur, the small Karnataka state whose queen took up arms in October 1824 after the East India Company refused to recognise her adopted heir, Shivalingappa, applying the same annexationist logic it later formalised as the Doctrine of Lapse.',
      'After Kittur’s forces were overwhelmed by a much larger Company army in December 1824 and Chennamma was imprisoned at Bailhongal, Rayanna continued the resistance on his own account, rebuilding a following in the countryside around Kittur and Nandagad and waging a guerrilla campaign against Company authority for several years.',
      'He was eventually captured by the British and hanged from a banyan tree at Nandagad in Belgaum district on 26 January 1831. He is remembered across Karnataka in folk ballads alongside Rani Chennamma, and a memorial and annual commemoration mark the site of his execution.',
    ],
    entryIntoStruggle: 'Military service under Rani Chennamma of Kittur, continuing after her defeat in 1824.',
    achievements: ['Sustained armed resistance in the Kittur region for several years after the queen’s defeat'],
    sacrifices: ['Captured and hanged at Nandagad in 1831'],
    legacy: 'Remembered across Karnataka in folk song alongside Rani Chennamma; a memorial at Nandagad marks his execution.',
    facts: ['He was hanged from a banyan tree at Nandagad, a site now marked by his memorial.'],
    timelineEvents: ['kittur-rebellion'],
    movements: ['early-uprisings'],
    organizations: [],
    relatedPeople: ['rani-chennamma'],
    connections: [
      {
        id: 'rani-chennamma',
        type: 'ally',
        note: 'Served as a commander in Rani Chennamma’s Kittur forces and continued the resistance after her defeat and imprisonment in 1824.',
      },
    ],
    sources: [
      {
        title: 'Krantiveer Sangolli Rayanna memorial records, Nandagad',
        publisher: 'Karnataka State Archives',
        type: 'archive',
      },
      {
        title: 'Commemorations of Rani Chennamma and Sangolli Rayanna',
        publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav',
        url: 'https://amritkaal.nic.in/',
        type: 'government',
      },
    ],
    tags: ['Karnataka', 'Kittur', 'early resistance', 'martyr'],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    forgotten: true,
  },
  {
    id: 'karnad-sadashiva-rao',
    slug: 'karnad-sadashiva-rao',
    name: 'Karnad Sadashiva Rao',
    birthYear: 1881,
    deathYear: 1937,
    deathDateLabel: '9 January 1937',
    birthPlace: 'Mangalore, Madras Presidency (now Karnataka)',
    region: 'south',
    states: ['Karnataka'],
    gender: 'male',
    era: 'non-cooperation',
    roles: ['political-leader', 'lawyer', 'social-reformer'],
    summary:
      'A Mangalore-born lawyer who gave up his practice and his wealth to build the Congress in coastal and southern Karnataka from 1919 onward, and founded the Mahila Sabha to help widows and poor women.',
    shortStory: [
      {
        title: 'A lawyer’s choice',
        text: 'Karnad Sadashiva Rao trained as a lawyer in Madras and Bombay. When Gandhi called on Indians to join the freedom struggle, Rao was among the very first from the Karnataka coast to answer.',
      },
      {
        title: 'Building the Congress',
        text: 'From 1919 he threw himself into organising the Congress party across what is now Karnataka, working to bring the movement to towns and villages far from the big cities.',
        uncertainty: 'Fewer detailed, dated records survive of his specific campaigns and any imprisonments than for many better-documented contemporaries.',
      },
      {
        title: 'For widows and the poor',
        text: 'Rao founded the Mahila Sabha to support widows and poor women, and gave away his own wealth in the service of the cause he believed in.',
      },
      {
        title: 'A poor man’s death',
        text: 'In December 1936 he stayed in a leaky hut at the Faizpur Congress session and fell ill. He died soon after, in Bombay, in January 1937, with barely enough left to pay for his own last rites.',
      },
    ],
    fullBiography: [
      'Karnad Sadashiva Rao was born in 1881 in Mangalore, on Karnataka’s coast, to a well-off family. He studied at Presidency College in Madras and went on to study law in Bombay, but rather than build a conventional legal career he turned to public life.',
      'By 1919 he was fully committed to Gandhi’s Satyagraha movement, becoming one of the first from the Karnataka region to join it, and he worked through the following years to build the Indian National Congress’s organisation across coastal and southern Karnataka — a less-documented but locally significant strand of the Congress’s expansion beyond its Bombay and Madras Presidency strongholds. He also founded the Mahila Sabha, an organisation supporting widows and impoverished women, and is remembered as having given away his personal wealth in the course of this public and political work.',
      'In December 1936 Rao attended the Congress session at Faizpur, where he stayed in poor conditions and fell ill with cold and fever; he travelled on to Bombay without disclosing his condition and died there on 9 January 1937, reportedly leaving too little money to cover his own funeral rites. Sadashivanagar, a locality in Bangalore named for him in 1960, and a road in Mangalore, commemorate him today.',
    ],
    entryIntoStruggle: 'Joined Gandhi’s Satyagraha movement in 1919, among the first from the Karnataka coast to do so.',
    achievements: [
      'Among the earliest organisers of the Congress party in coastal and southern Karnataka',
      'Founded the Mahila Sabha for widows and poor women',
    ],
    sacrifices: ['Gave away his personal wealth to the cause; died in poverty shortly after the 1936 Faizpur Congress session'],
    legacy: 'Sadashivanagar in Bangalore and a road in Mangalore are named in his honour.',
    facts: ['Sadashivanagar, a well-known Bangalore locality, was named for him in 1960.'],
    disputed: [
      {
        claim: 'Specifics of his Congress organising work',
        note: 'Published detail on Karnad Sadashiva Rao’s life is thinner than for many contemporaries — exact dates of imprisonment, specific campaigns he led, and the precise scope of his Congress-building work in Karnataka are not well documented in accessible sources. This record relies on the general accounts available and should be read with that limitation in mind.',
      },
    ],
    timelineEvents: [],
    movements: ['non-cooperation', 'civil-disobedience'],
    organizations: ['inc'],
    relatedPeople: [],
    sources: [
      {
        title: 'Karnad Sadashiva Rao, Azadi Ka Amrit Mahotsav commemoration',
        publisher: 'National Institute of Technology Andhra Pradesh',
        url: 'https://nitandhra.ac.in/main/Announcements/2022/akam/Sadashiva%20Rao.pdf',
        type: 'government',
      },
      {
        title: 'Hall of Fame: Karnad Sadashiva Rao',
        publisher: 'Vishwa Konkani Kendra',
        url: 'https://www.vishwakonkani.org/hall-of-fame/karnad-sadashiva-rao/',
        type: 'website',
      },
    ],
    tags: ['Karnataka', 'Congress', 'Mangalore', 'social reform'],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    forgotten: true,
  },
];
