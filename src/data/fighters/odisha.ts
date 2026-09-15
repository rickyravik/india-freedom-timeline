import type { FreedomFighter } from '@/types';

/**
 * Odia freedom fighters — from the Paika Rebellion of 1817, through decades
 * of resistance from the Sambalpur forests, to the Non-Cooperation and Quit
 * India years. Odisha is one of the archive's thinnest-covered states.
 */
export const odishaFighters: FreedomFighter[] = [
  {
    id: 'buxi-jagabandhu',
    slug: 'buxi-jagabandhu',
    name: 'Buxi Jagabandhu Bidyadhar',
    alternateNames: ['Jagabandhu Bidyadhar Mohapatra Bhramarbar Ray', 'Bakshi Jagabandhu'],
    portrait: '/images/fighters/buxi-jagabandhu.png',
    portraitNote: {
      kind: 'illustration',
      caption: 'Digitally vectorized rendering based on an old sketch by artist Dharanidhar Behera of Cuttack. No contemporary (pre-photography-era) likeness of Buxi Jagabandhu is known to survive.',
      credit: 'Vectorized by Prateek Pattanaik, from a sketch by Dharanidhar Behera; Wikimedia Commons',
      created: 'sketch date unknown; vectorized 2016',
    },
    birthYear: 1773,
    deathYear: 1829,
    deathDateLabel: '24 January 1829',
    birthPlace: 'Khurda, Odisha',
    region: 'east',
    states: ['Odisha'],
    gender: 'male',
    era: 'early-resistance',
    roles: ['military-leader'],
    summary:
      'Military commander (Buxi) of the Raja of Khurda who led the Paika Rebellion of 1817 against Company land-revenue and administrative reforms that had dispossessed Odisha’s hereditary Paika militia.',
    shortStory: [
      {
        title: 'The Raja’s commander',
        text: 'Jagabandhu Bidyadhar held the title of Buxi — military commander — to the Raja of Khurda, second only to the king. He came from a family that had long held land in return for military service to the throne.',
      },
      {
        title: 'Land taken away',
        text: 'When the East India Company took over Odisha’s administration, it changed the old rules. Jagabandhu lost the rent-free lands his family had held for generations, and so did thousands of Paikas — the hereditary soldier-farmers who had defended Khurda for centuries.',
      },
      {
        title: 'The rebellion of 1817',
        text: 'In March 1817 Jagabandhu led thousands of Paikas and tribal fighters in an uprising against Company rule, attacking its offices and treasury before British forces crushed the revolt within months.',
        uncertainty: 'Whether the Paika Rebellion deserves the title "India’s first war of independence" is still debated among historians, alongside 1857’s older claim to it.',
      },
      {
        title: 'Eight years in the forest',
        text: 'Jagabandhu escaped into the hills and waged guerrilla resistance for years before finally surrendering in 1825. He lived out his last years at Cuttack on a small British pension, and died there in 1829.',
      },
    ],
    fullBiography: [
      'Jagabandhu Bidyadhar Mohapatra Bhramarbar Ray held the hereditary title of Buxi — commander-in-chief — to the Raja of Khurda, and with it substantial rent-free jagir land granted in return for military service. After the East India Company annexed Khurda in 1803 and progressively dismantled the kingdom’s old revenue and military arrangements, Jagabandhu’s lands were confiscated and he was reduced, by the 1810s, to the status of an ordinary taxpayer — one grievance among many that fell on the Paikas, the region’s hereditary militia-landholders, as the Company’s new land-revenue settlement and salt monopoly bore down on them.',
      'In March 1817 Jagabandhu led the Paikas, along with Kondh tribal fighters and other Khurda subjects, in a sudden uprising: rebels attacked Company offices, the treasury at Banapur and police stations across the region before British troops restored control within months. Jagabandhu himself escaped and continued a guerrilla resistance from the Odisha hill tracts for some eight years, negotiating on and off with Company officials through intermediaries including the Raja of Nayagarh.',
      'He finally surrendered to the British on 25 May 1825 and was permitted to settle at Cuttack with his family on a monthly pension of Rs 150. He died there on 24 January 1829, and his pension lapsed with him. In October 2017 the Government of India marked the rebellion’s bicentenary; the Odisha state government has argued the Paika Rebellion deserves recognition as an early large-scale armed uprising against Company rule, decades before 1857.',
    ],
    entryIntoStruggle: 'Loss of his family’s hereditary military land-grant under Company administration, culminating in the March 1817 uprising.',
    achievements: [
      'Led one of the earliest large-scale armed uprisings against Company rule in eastern India',
      'Sustained guerrilla resistance from the Odisha hill tracts for roughly eight years',
    ],
    sacrifices: ['Lost his hereditary lands and status; years as a fugitive; died in reduced circumstances at Cuttack'],
    legacy: 'Odisha’s foremost symbol of early resistance to Company rule; commemorated at the Paika Rebellion’s 2017 bicentenary.',
    facts: [
      'Paika means "foot-soldier" in Odia — the Paikas were a hereditary militia that had served Khurda’s kings for generations.',
      'He was allowed to live out his final years at Cuttack on a British pension after his 1825 surrender.',
    ],
    disputed: [
      {
        claim: 'The Paika Rebellion as "India’s first war of independence"',
        note: 'The Government of India and Odisha’s state government have promoted this framing, especially around the 2017 bicentenary, but historians debate how far a localised revolt driven substantially by the Paikas’ own lost land rights amounted to a war for national independence in the sense later claimed for the far larger 1857 uprising. This archive presents both the rebellion’s significance and the debate over how to characterise it, without asserting either framing as settled.',
      },
    ],
    timelineEvents: [],
    movements: ['early-uprisings'],
    organizations: [],
    relatedPeople: ['veer-surendra-sai'],
    sources: [
      {
        title: 'Paika Rebellion bicentenary records',
        publisher: 'Ministry of Culture, Government of India',
        type: 'government',
      },
      {
        title: 'Odisha State Archives, Bhubaneswar',
        publisher: 'Government of Odisha',
        type: 'archive',
      },
    ],
    tags: ['Odisha', 'Paika Rebellion', 'early resistance'],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    forgotten: true,
  },
  {
    id: 'veer-surendra-sai',
    slug: 'veer-surendra-sai',
    name: 'Veer Surendra Sai',
    portrait: '/images/fighters/veer-surendra-sai.jpg',
    portraitNote: {
      kind: 'stamp',
      caption: 'Commemorative postage stamp issued by India Post, 1986. Used here (as on Wikipedia) in place of a photograph, since no verified contemporary photograph of Surendra Sai is confirmed.',
      credit: 'India Post',
      created: '1986',
    },
    birthYear: 1809,
    deathYear: 1884,
    birthPlace: 'Khinda, Sambalpur, Odisha',
    region: 'east',
    states: ['Odisha'],
    gender: 'male',
    era: 'revolt-1857',
    roles: ['military-leader', 'ruler'],
    summary:
      'Rightful claimant to the Sambalpur throne who led nearly four decades of resistance against Company rule from the forests of western Odisha, captured and released more than once, and who died in British custody at Asirgarh fort in 1884.',
    shortStory: [
      {
        title: 'A prince denied his throne',
        text: 'When the Raja of Sambalpur died without a son in 1827, he had named Surendra Sai his successor. The British refused to recognise the choice, and instead took direct control of the kingdom for themselves.',
      },
      {
        title: 'Decades in the forest',
        text: 'Surendra Sai would not accept this. From the forests around Sambalpur he led repeated uprisings against Company rule, drawing in Odia and tribal fighters over more than three decades.',
      },
      {
        title: 'Captured, released, rearrested',
        text: 'The British imprisoned him more than once. During the great uprising of 1857 he escaped jail and returned to armed resistance, fighting on for years afterwards until his final capture around 1864.',
      },
      {
        title: 'Death at Asirgarh',
        text: 'He spent his last years a prisoner far from home, and died in British custody at Asirgarh fort in 1884, having spent much of his adult life fighting for a throne he was never allowed to hold.',
      },
    ],
    fullBiography: [
      'Surendra Sai was born in 1809 into the ruling family of Sambalpur in western Odisha. When Raja Maharaj Sai died without a son in 1827, he had designated Surendra Sai his successor, but the East India Company, applying the same annexationist logic it later formalised as the Doctrine of Lapse, refused to recognise the claim and moved to bring Sambalpur under direct Company administration instead.',
      'Surendra Sai refused to accept the annexation and, from the 1830s, led repeated risings against Company authority from the forested hill country around Sambalpur, drawing support from Odia villagers and Kondh and Binjhal tribal fighters alike. He was imprisoned by the British on more than one occasion in these years. During the countrywide uprising of 1857 he escaped confinement at Hazaribagh and returned to armed resistance in Sambalpur, sustaining the fight through the early 1860s until his eventual recapture around 1864.',
      'He was held for the rest of his life as a state prisoner, eventually at Asirgarh fort in the Central Provinces, where he died in 1884. His decades-long resistance — spanning from the 1827 succession dispute through the 1857–62 period — is remembered in Odisha as one of the longest sustained campaigns against Company and Crown rule anywhere in India, and Sambalpur’s airport and a university now bear his name.',
    ],
    entryIntoStruggle: 'The Company’s refusal to recognise his designated succession to the Sambalpur throne, 1827.',
    achievements: [
      'Sustained armed resistance to Company rule from the 1830s through the early 1860s',
      'Escaped custody in 1857 to resume the fight during the wider uprising',
    ],
    sacrifices: ['Repeated imprisonment over four decades; died a prisoner far from Sambalpur'],
    legacy: 'Sambalpur’s airport and Veer Surendra Sai University of Technology are named for him; a central figure of Odisha’s resistance history.',
    facts: ['He escaped British custody at Hazaribagh jail during the 1857 uprising and resumed fighting in Sambalpur.'],
    timelineEvents: [],
    movements: ['early-uprisings', 'great-revolt'],
    organizations: [],
    relatedPeople: ['buxi-jagabandhu'],
    sources: [
      {
        title: 'Veer Surendra Sai commemorations',
        publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav',
        url: 'https://amritkaal.nic.in/',
        type: 'government',
      },
      {
        title: 'Odisha State Archives, Bhubaneswar',
        publisher: 'Government of Odisha',
        type: 'archive',
      },
    ],
    tags: ['Odisha', 'Sambalpur', '1857', 'early resistance'],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    forgotten: true,
  },
  {
    id: 'laxman-naik',
    slug: 'laxman-naik',
    name: 'Laxman Naik',
    alternateNames: ['Laxman Nayak'],
    portrait: '/images/fighters/laxman-naik.jpg',
    portraitNote: {
      kind: 'stamp',
      caption: 'Commemorative postage stamp issued by India Post, 1989.',
      credit: 'India Post',
      created: '1989',
    },
    birthYear: 1899,
    deathYear: 1943,
    birthDateLabel: '22 November 1899',
    deathDateLabel: '29 March 1943',
    birthPlace: 'Tentuligumma, Koraput district, Odisha',
    region: 'east',
    states: ['Odisha'],
    gender: 'male',
    era: 'quit-india-and-ina',
    roles: ['tribal-leader', 'satyagrahi'],
    contentNote: 'This life ends in a wrongful execution.',
    summary:
      'Bhumia tribal Gandhian leader from Koraput who led a peaceful Quit India march in 1942, was convicted of a forest guard’s murder on evidence many historians consider fabricated, and was hanged in 1943 — one of the few executions carried out during the Quit India movement.',
    shortStory: [
      {
        title: 'Gandhi’s message reaches Koraput',
        text: 'Laxman Naik was a Bhumia tribal leader in the remote Koraput district of Odisha. He took up Gandhi’s ideas of khadi and non-violence and worked to bring them to his own community.',
      },
      {
        title: 'A peaceful march',
        text: 'When the Quit India movement began in August 1942, Naik led a peaceful procession to the police station at Mathili. Police fired on the unarmed crowd, killing and wounding many.',
      },
      {
        title: 'A charge many call false',
        text: 'Soon after, the authorities accused Naik of murdering a forest guard. Many historians believe the evidence against him was fabricated to remove a popular local leader. He was sentenced to death.',
        uncertainty: 'Whether Laxman Naik actually committed the killing he was hanged for, or was framed to silence a popular Quit India leader, is still disputed.',
      },
      {
        title: 'Hanged for freedom',
        text: 'Laxman Naik was hanged in March 1943, one of only a handful of people executed during the entire Quit India movement. Odisha remembers him as one of its bravest sons.',
      },
    ],
    fullBiography: [
      'Laxman Naik, born in 1899 to a Bhumia tribal family in the Koraput hill country of southern Odisha, became a Gandhian organiser among his community, promoting khadi, temperance and non-violent resistance in a region far from the Congress’s usual strongholds.',
      'Responding to Gandhi’s Quit India call, Naik led an unarmed procession to the Mathili police station on 21 August 1942; police opened fire on the demonstrators, killing and injuring a large number. In the crackdown that followed, the colonial administration charged Naik with the murder of a forest guard. He was tried, convicted and sentenced to death on 13 November 1942 — a prosecution that many later historians and Odia accounts regard as built on fabricated or coerced evidence intended to remove an effective local leader rather than to answer a genuine crime.',
      'Laxman Naik was hanged at Berhampur jail on 29 March 1943, one of only a small number of people executed anywhere in India during the Quit India movement. He is remembered in Odisha as the "Gandhi of Koraput" or "Gandhi of Malkangiri," and the Government of India issued a commemorative postage stamp in his honour.',
    ],
    entryIntoStruggle: 'Gandhian organising among the Bhumia community of Koraput through the 1930s, culminating in the August 1942 Mathili march.',
    ideology: 'Gandhian non-violence, applied to tribal Koraput.',
    achievements: ['Brought the Quit India movement to the tribal villages of Koraput district'],
    sacrifices: ['Hanged at forty-three on a conviction whose fairness is widely questioned'],
    legacy: 'Remembered in Odisha as the "Gandhi of Koraput"; commemorated with a Government of India postage stamp.',
    facts: ['He was among only a small handful of people actually executed anywhere in India during the Quit India movement.'],
    disputed: [
      {
        claim: 'Guilt in the forest guard’s murder',
        note: 'Naik was convicted and hanged for the murder of a forest guard, but many historians and Odia accounts consider the case fabricated or the trial unfair, arguing the charge was used to remove a leading local Quit India organiser. This archive treats his conviction as disputed rather than settled.',
      },
    ],
    timelineEvents: [],
    movements: ['quit-india'],
    organizations: ['inc'],
    relatedPeople: [],
    sources: [
      {
        title: 'Laxman Naik: The Immortal Martyr of Quit India Movement, Orissa Review',
        publisher: 'Government of Odisha',
        url: 'https://magazines.odisha.gov.in/orissareview/feb-mar-2007/engpdf/page14-15.pdf',
        type: 'government',
      },
      {
        title: 'Odisha State Archives, Bhubaneswar',
        publisher: 'Government of Odisha',
        type: 'archive',
      },
    ],
    tags: ['Odisha', 'Quit India', 'tribal leader', 'martyr'],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    forgotten: true,
  },
  {
    id: 'gopabandhu-das',
    slug: 'gopabandhu-das',
    name: 'Gopabandhu Das',
    alternateNames: ['Utkalmani'],
    portrait: '/images/fighters/gopabandhu-das.jpg',
    portraitNote: {
      kind: 'other',
      caption: 'Commemorative portrait published by the Government of Odisha on his birth anniversary (jayanti); the image has a digitally applied stylised/painterly finish, so it is presented here as a commemorative likeness rather than an unaltered photograph.',
      credit: 'Information & Public Relations Department, Government of Odisha',
      created: 'published 2020',
    },
    birthYear: 1877,
    deathYear: 1928,
    birthPlace: 'Suando, Puri district, Odisha',
    region: 'east',
    states: ['Odisha'],
    gender: 'male',
    era: 'non-cooperation',
    roles: ['political-leader', 'educator', 'journalist'],
    summary:
      'Known as Utkalmani — "the jewel of Odisha" — he founded the nationalist Satyabadi school in 1909 and the newspaper Samaja, led the Non-Cooperation movement in Odisha through the 1920s, and worked to unite Odia-speaking tracts scattered across neighbouring provinces.',
    shortStory: [
      {
        title: 'The jewel of Odisha',
        text: 'Gopabandhu Das was a lawyer who gave up his practice to serve his people. Odisha came to call him Utkalmani — "the jewel of Odisha" — for his tireless work in education, journalism and politics.',
      },
      {
        title: 'A school with a difference',
        text: 'In 1909 he founded the Satyabadi school, teaching students under the open sky in a spirit of simplicity and national pride rather than the rote learning of British-run schools.',
      },
      {
        title: 'A voice for Odisha',
        text: 'He founded the newspaper Samaja to carry nationalist ideas to Odia readers, and worked through the Utkal Sammilani movement to bring together Odia-speaking areas scattered across British India into a single province.',
      },
      {
        title: 'Leading the movement',
        text: 'When Gandhi’s Non-Cooperation Movement began in the 1920s, Gopabandhu Das led it in Odisha, linking the national struggle to the cause of Odia unity. He died in 1928, still working for both causes.',
      },
    ],
    fullBiography: [
      'Gopabandhu Das, born in 1877 in Puri district, trained and briefly practised as a lawyer before turning to public life. In 1909 he founded the Satyabadi Bana Vidyalaya near Sakshigopal, a school that broke from the rote, exam-driven model of colonial education to teach in a spirit of nationalism, simplicity and closeness to nature — an experiment that shaped a generation of Odia public figures.',
      'He was drawn early into the Utkal Sammilani, the movement to unite the Odia-speaking tracts then divided between the Bengal, Bihar-Orissa, Madras and Central Provinces administrations into a single province, and worked to link that regional cause with the wider Indian National Congress. He founded the weekly Samaja in 1919 as a vehicle for nationalist and social reform ideas among Odia readers; it grew into one of the state’s most influential newspapers.',
      'In the early 1920s Gopabandhu Das took a leading role in organising the Non-Cooperation Movement across Odisha, campaigning against British goods and institutions and for Hindu-Muslim unity, while continuing his work for a separate Odia-speaking province — a demand realised only in 1936, after his death. He died in 1928, and Odisha remembers him as Utkalmani, one of the founders of its modern public life.',
    ],
    entryIntoStruggle: 'Founding the Satyabadi school in 1909 and joining the Utkal Sammilani movement.',
    ideology: 'Gandhian nationalism combined with Odia linguistic and regional self-assertion.',
    achievements: [
      'Founded the Satyabadi school, an influential experiment in nationalist education',
      'Founded the newspaper Samaja',
      'Led the Non-Cooperation Movement in Odisha and advanced the case for a separate Odia-speaking province',
    ],
    legacy: 'Honoured as Utkalmani; the Satyabadi school and Samaja newspaper both endure as part of his legacy.',
    facts: ['The Odia-speaking province he campaigned for was finally created as Orissa in 1936, eight years after his death.'],
    timelineEvents: [],
    movements: ['non-cooperation'],
    organizations: ['inc'],
    relatedPeople: [],
    sources: [
      {
        title: 'Utkalmani Gopabandhu: A Nation Builder Par Excellence, Orissa Review',
        publisher: 'Government of Odisha',
        url: 'https://magazines.odisha.gov.in/Orissareview/2016/April/engpdf/42-45.pdf',
        type: 'government',
      },
      {
        title: 'Odisha State Archives, Bhubaneswar',
        publisher: 'Government of Odisha',
        type: 'archive',
      },
    ],
    tags: ['Odisha', 'Non-Cooperation', 'education', 'journalism'],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    forgotten: true,
  },
];
