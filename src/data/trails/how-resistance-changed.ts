import type { Trail } from '@/types';

export const howResistanceChanged: Trail = {
  id: 'how-resistance-changed',
  slug: 'how-resistance-changed',
  version: 1,
  title: 'How resistance changed, 1757–1947',
  question: 'How did the ways people resisted change over two centuries?',
  theme: 'Overview',
  minutes: 8,
  learningGoal: 'Describe three different methods of resistance from three different periods, and name one lesser-known person for each.',
  intro:
    'This archive covers 1757 to 1947 — a frame chosen for this collection, not a claim that resistance began on a single date. Six turning points, each with a well-known name and a less familiar one, show the methods changing: from rulers defending their lands, to petitions and assemblies, to boycott, to breaking the law in public, to a nationwide uprising without leaders. The six stops are a selection, not the whole story.',
  accent: 'indigo',
  stops: [
    {
      id: 'plassey',
      title: 'A trading company takes a province',
      question: 'How does a company end up ruling a country?',
      text: [
        'On 23 June 1757, by a mango grove on the Bhagirathi river, Robert Clive’s small Company force faced the far larger army of the young Nawab of Bengal. The battle was decided before it began: the Nawab’s commander had been bought, and most of his army never fought.[^1]',
        'Plassey gave a trading corporation control of India’s richest province. Bengal’s revenues paid for the Company’s armies, and over the next century its rule spread across the subcontinent — as did resistance to it, from rulers, peasants and Adivasi communities.[^2]',
      ],
      focus: { kind: 'event', id: 'battle-of-plassey' },
      also: [{ kind: 'fighter', id: 'puli-thevar' }],
      sources: [
        { title: 'The Anarchy: The Relentless Rise of the East India Company', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2019, type: 'book', evidence: 'scholarship' },
        { title: 'From Plassey to Partition and After', author: 'Sekhar Bandyopadhyay', publisher: 'Orient BlackSwan', year: 2015, type: 'book', evidence: 'scholarship' },
      ],
      bridge: 'A century of local risings followed. In 1857 they became one.',
    },
    {
      id: 'revolt-1857',
      title: 'Sepoys, queens and an eighty-year-old zamindar',
      question: 'Who joined the revolt of 1857, and why?',
      text: [
        'On 10 May 1857 sepoys at Meerut broke open the jail, killed their officers and rode through the night to Delhi, proclaiming the eighty-two-year-old Mughal emperor the sovereign of Hindustan. Within weeks whole populations had joined: Awadh under Begum Hazrat Mahal, Bihar under Kunwar Singh, and from March 1858 Rani Lakshmibai in besieged Jhansi.[^1]',
        'The grievances ran deeper than the greased cartridges that sparked it — annexed states, ruined artisans and landholders, and fear for religion and custom. The rising was suppressed by mid-1858 with great violence. It ended Company rule and brought India under the Crown.[^2]',
      ],
      focus: { kind: 'event', id: 'revolt-1857' },
      also: [
        { kind: 'fighter', id: 'kunwar-singh' },
        { kind: 'fighter', id: 'begum-hazrat-mahal' },
      ],
      sources: [
        { title: 'The Last Mughal: The Fall of a Dynasty, Delhi 1857', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2006, type: 'book', evidence: 'scholarship' },
        { title: 'Mutiny Papers, 1857', publisher: 'National Archives of India', url: 'https://www.abhilekh-patal.in/', type: 'archive', evidence: 'contemporary' },
      ],
      contentNote: 'This stop describes war and its suppression.',
      bridge: 'After 1857, a new generation tried a different instrument: an organisation, and a case argued in public.',
    },
    {
      id: 'congress-1885',
      title: 'Seventy-two people in a room',
      question: 'What can an annual meeting achieve against an empire?',
      text: [
        'On 28 December 1885 seventy-two lawyers, journalists, teachers and merchants from across British India met in Bombay and founded the Indian National Congress. Their resolutions were modest — more Indians in government, lower military spending — but an all-India political body was itself new.[^1]',
        'Dadabhai Naoroji, Surendranath Banerjee and later Gokhale and Tilak made its sessions the parliament of Indian opinion. In 1892 Naoroji won a seat in the British House of Commons by five votes and used it to argue India’s case. Within two generations the Congress would become, under Gandhi, a mass movement of millions.[^1]',
      ],
      focus: { kind: 'event', id: 'founding-of-inc' },
      also: [
        { kind: 'fighter', id: 'dadabhai-naoroji' },
        { kind: 'fighter', id: 'surendranath-banerjee' },
      ],
      sources: [
        { title: "India's Struggle for Independence 1857–1947", author: 'Bipan Chandra et al.', publisher: 'Penguin', year: 1989, type: 'book', evidence: 'scholarship' },
        { title: 'Congress centenary records', publisher: 'Nehru Memorial Museum & Library (PMML), New Delhi', type: 'archive', evidence: 'reference' },
      ],
      bridge: 'Petitions had limits. In 1905 the answer to a partition was to stop buying.',
    },
    {
      id: 'swadeshi-1905',
      title: 'Bonfires of foreign cloth',
      question: 'How did shopping become political?',
      text: [
        'Weeks before the partition of Bengal took effect, delegates met at Calcutta Town Hall on 7 August 1905 and resolved to boycott British goods. Bonfires of Manchester cloth followed; national schools, swadeshi mills and banks were founded, and the movement spread to Maharashtra, Punjab and the Madras coast.[^1]',
        'In Tuticorin, V. O. Chidambaram Pillai took swadeshi to sea with an Indian shipping company. In Stuttgart in 1907, Bhikaji Cama unfurled a flag of free India before a thousand socialist delegates. Swadeshi gave the movement an economic weapon and a cultural self-confidence; 7 August is now National Handloom Day.[^2]',
      ],
      focus: { kind: 'event', id: 'swadeshi-movement-launch' },
      also: [
        { kind: 'fighter', id: 'vo-chidambaram-pillai' },
        { kind: 'fighter', id: 'bhikaji-cama' },
      ],
      sources: [
        { title: 'The Swadeshi Movement in Bengal 1903–1908', author: 'Sumit Sarkar', publisher: "People's Publishing House", year: 1973, type: 'book', evidence: 'scholarship' },
        { title: 'National Handloom Day', publisher: 'Ministry of Textiles, Government of India', type: 'government', evidence: 'reference' },
      ],
      bridge: 'After the First World War, Gandhi turned boycott into Non-Cooperation, and then into something bolder: breaking the law in the open.',
    },
    {
      id: 'salt-1930',
      title: 'A fistful of salt',
      question: 'Why choose a small tax to break a big law?',
      text: [
        'Gandhi chose the salt tax — a small, universal injustice touching the poorest. He left Sabarmati Ashram on 12 March 1930 with seventy-eight volunteers and walked for twenty-four days as the world’s press followed. At Dandi on the morning of 6 April he picked up a lump of natural salt.[^1]',
        'Salt was made and sold illegally along the coasts; Rajagopalachari marched to Vedaranyam in the south, where Rukmini Lakshmipathi became the Madras Presidency’s first woman jailed in the movement. Around 90,000 people — women in unprecedented numbers — filled the jails before the campaign paused in 1931.[^2]',
      ],
      focus: { kind: 'event', id: 'dandi-march' },
      also: [
        { kind: 'fighter', id: 'rukmini-lakshmipathi' },
        { kind: 'event', id: 'vedaranyam-salt-march' },
      ],
      sources: [
        { title: 'Gandhi: The Years That Changed the World', author: 'Ramachandra Guha', publisher: 'Penguin Allen Lane', year: 2018, type: 'book', evidence: 'scholarship' },
        { title: 'Dandi March records and photographs', publisher: 'National Gandhi Museum', type: 'museum', evidence: 'reference' },
      ],
      bridge: 'Twelve years later the leaders were gone within a day, and the movement carried on without them.',
    },
    {
      id: 'quit-india-1942',
      title: 'Do or die',
      question: 'What happens to a movement when every leader is arrested overnight?',
      text: [
        'On 8 August 1942 the Congress passed the Quit India resolution and Gandhi gave the country a mantra: "Do or Die." Before dawn the entire leadership was arrested. The uprising that followed was the fiercest since 1857 — railways cut, police stations burned, parallel governments in Satara, Talcher and Tamluk, and Usha Mehta’s underground Congress Radio.[^1]',
        'Its cost fell on ordinary people: Kanaklata Barua, seventeen, shot carrying the flag at Gohpur; Kushal Konwar, hanged in 1943 for a derailment he opposed. Repression killed over a thousand by official count. Britain now knew India could not be held. Freedom came on 15 August 1947 — divided by Partition, whose casualty figures remain disputed.[^2]',
      ],
      focus: { kind: 'event', id: 'quit-india-launch' },
      also: [
        { kind: 'fighter', id: 'kanaklata-barua' },
        { kind: 'fighter', id: 'kushal-konwar' },
        { kind: 'event', id: 'independence-1947' },
      ],
      sources: [
        { title: 'Quit India Movement papers', publisher: 'National Archives of India', url: 'https://www.abhilekh-patal.in/', type: 'archive', evidence: 'contemporary' },
        { title: "India's Struggle for Independence 1857–1947", author: 'Bipan Chandra et al.', publisher: 'Penguin', year: 1989, type: 'book', evidence: 'scholarship' },
      ],
      uncertainty: 'Estimates of deaths in Partition violence range from around 200,000 to 2 million, with roughly 10–20 million displaced; precise figures cannot be established.',
      contentNote: 'This stop includes killings and executions.',
      bridge: '',
    },
  ],
  reflection: 'Each stop had a famous name and a less familiar one. Pick one of the less familiar people. What would have been different if they had not acted?',
  activity: {
    kind: 'choice',
    prompt: 'Which of these appears for the first time in this trail with the Salt Satyagraha of 1930?',
    options: ['Armed defence of a fort against the Company', 'An all-India political organisation', 'Boycott of foreign goods', 'Deliberately breaking a law in public and accepting arrest'],
    answerIndex: 3,
    explanation: 'Forts were defended in 1799 and 1857, the Congress was founded in 1885, and boycott began in 1905. Openly breaking a specific law and accepting the punishment — satyagraha as a mass method — is what 1930 added, and 1942 inherited.',
  },
  followOn: { label: 'Browse the nine chapters', to: '/timeline?view=chapters' },
  editorial: { status: 'draft', notes: 'Drafted 2026-09-08 from the six event records and linked biographies. A qualified reviewer should check the Partition sentence before the pilot.' },
  teaching: {
    alignment: 'Proposed: upper-primary and secondary history — resistance to colonial rule; evidence and interpretation. To be reviewed by a qualified educator.',
    shortVersion: ['plassey', 'revolt-1857', 'salt-1930'],
    prompts: [
      'This trail spans 1757 to 1942. Pick two stops and describe what changed in HOW people resisted, not just WHEN.',
      'Satyagraha — openly breaking a law and accepting arrest — first appears at the 1930 stop. Why might that method not have worked in 1857?',
      'The final stop carries a content note for killings and executions. Why might a trail about resistance need to include violence honestly rather than skip it?',
    ],
    facilitatorNotes: [
      'Plassey is a good anchor for discussing how a trading company acquired governing power, distinct from a straightforward military conquest narrative.',
      'Encourage students to name at least one "less familiar" person per stop, per the reflection prompt, before naming the famous one.',
      'The content note on the final stop is a deliberate signal, not an afterthought — read it aloud before that section if working with younger students.',
    ],
    editorial: { status: 'draft' },
  },
};
