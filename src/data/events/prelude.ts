import type { HistoricalEvent } from '@/types';

/**
 * The prelude: how a trading company came to be in a position to rule.
 * The first four sit in the 'before-the-empire' chapter; the last two
 * (Panipat, the Diwani) fall inside Early Resistance but belong to the
 * same explanation, so they live here with it.
 */
export const preludeEvents: HistoricalEvent[] = [
  {
    id: 'east-india-company-charter',
    slug: 'east-india-company-charter',
    title: 'A charter to trade in the East',
    date: { year: 1600, month: 12, day: 31 },
    dateLabel: '31 December 1600',
    location: 'London',
    region: 'abroad',
    states: ['Abroad'],
    summary:
      'Queen Elizabeth I grants a group of London merchants a monopoly of English trade east of the Cape of Good Hope. The East India Company is born as a business, not an empire.',
    description: [
      'On the last day of 1600 the English Crown chartered "the Governor and Company of Merchants of London trading into the East Indies": a little over two hundred investors, a fifteen-year monopoly of English trade beyond the Cape, and the right to arm ships in its own defence. Its purpose was spices and, soon, Indian cloth; it had no territory and no standing army.',
      'The Company reached the Mughal court as a supplicant. Its first Indian trading post opened at Surat in 1613 by imperial permission, and Sir Thomas Roe’s embassy to the Emperor Jahangir (1615–19) secured the right to trade, not to rule. For most of the next century and a half the Company was one European buyer among several, competing for the finest textiles in the world.',
    ],
    people: [],
    era: 'before-the-empire',
    category: 'founding',
    significance: 'The legal beginning of the body that would later govern India: a joint-stock trading company answerable to its shareholders.',
    sources: [
      { title: 'The Company-State: Corporate Sovereignty and the Early Modern Foundations of the British Empire in India', author: 'Philip J. Stern', publisher: 'Oxford University Press', year: 2011, type: 'book', evidence: 'scholarship' },
      { title: 'The Anarchy: The Relentless Rise of the East India Company', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2019, type: 'book', evidence: 'scholarship' },
      { title: 'India Office Records: East India Company charters and court minutes', publisher: 'British Library', type: 'archive', evidence: 'contemporary' },
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-16' },
  },
  {
    id: 'death-of-aurangzeb',
    slug: 'death-of-aurangzeb',
    title: 'Death of Aurangzeb',
    date: { year: 1707, month: 3, day: 3 },
    dateLabel: '3 March 1707',
    location: 'Ahmednagar, Deccan',
    region: 'west',
    states: ['Maharashtra'],
    summary:
      'The last of the great Mughal emperors dies after half a century on the throne, most of it spent at war in the Deccan. Within a generation the empire he leaves is an empire in name.',
    description: [
      'Aurangzeb ruled for forty-nine years and spent the last twenty-six of them campaigning in the Deccan against Bijapur, Golconda and the Marathas. The wars drained the treasury, stretched the nobility’s loyalties, and never produced a settled peace. His death near Ahmednagar in March 1707 set off a war of succession among his sons.',
      'The emperors who followed reigned briefly and weakly. Provincial governors turned their offices into hereditary kingdoms: Murshid Quli Khan in Bengal, Saadat Khan in Awadh (1722), Nizam-ul-Mulk in Hyderabad (1724). Meanwhile the Marathas pushed north into Malwa and Gujarat and, by mid-century, to the gates of Delhi itself. India in 1750 was not one state but many, and they fought one another far more than they fought outsiders.',
    ],
    people: [],
    era: 'before-the-empire',
    category: 'turning-point',
    significance: 'The point from which the Mughal centre could no longer command its provinces: the political fragmentation that European companies would later exploit.',
    disputed: [
      {
        claim: 'Why the Mughal Empire declined',
        note: 'Historians disagree sharply. One school (Irfan Habib, Satish Chandra) locates the cause in an agrarian and fiscal crisis of the empire’s own making; another (Muzaffar Alam, C. A. Bayly) stresses the vitality of the regional states that emerged, seeing 1707 less as a collapse than as a redistribution of power. Aurangzeb’s religious policy is a further contested factor. No single explanation commands consensus.',
      },
    ],
    consequences: [
      { eventId: 'nadir-shah-sacks-delhi', note: 'A court that could no longer defend its own capital: thirty-two years later a Persian army walked into Delhi.' },
    ],
    sources: [
      { title: 'The Mughal Empire (The New Cambridge History of India I.5)', author: 'John F. Richards', publisher: 'Cambridge University Press', year: 1993, type: 'book', evidence: 'scholarship' },
      { title: 'The Crisis of Empire in Mughal North India: Awadh and the Punjab, 1707–48', author: 'Muzaffar Alam', publisher: 'Oxford University Press', year: 1986, type: 'book', evidence: 'scholarship' },
      { title: 'The Agrarian System of Mughal India, 1556–1707', author: 'Irfan Habib', publisher: 'Oxford University Press', year: 1999, type: 'book', evidence: 'scholarship' },
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-16' },
  },
  {
    id: 'farrukhsiyar-farman',
    slug: 'farrukhsiyar-farman',
    title: 'The Farrukhsiyar farman',
    date: { year: 1717 },
    dateLabel: '1717',
    location: 'Delhi and Bengal',
    region: 'north',
    states: ['Delhi', 'West Bengal'],
    summary:
      'The Mughal emperor grants the Company duty-free trade in Bengal for a token annual payment. The Company later called it its Magna Carta; Bengal’s rulers spent forty years trying to contain it.',
    description: [
      'After a two-year embassy to Delhi, the Company obtained an imperial farman from Farrukhsiyar granting it the right to trade in Bengal free of customs duties in return for 3,000 rupees a year, to buy villages around Calcutta, and to move goods under its own passes, or dastaks. Tradition credits the concession partly to a Company surgeon, William Hamilton, who had treated the emperor.',
      'On paper the privilege covered only the Company’s own trade. In practice its servants used the passes for their private business too, undercutting Indian merchants and depriving the Nawabs of revenue. Murshid Quli Khan and his successors resisted the abuse; the grievance was still live in 1756, when a young Siraj-ud-Daulah inherited the throne and the quarrel that would end at Plassey.',
    ],
    people: [],
    era: 'before-the-empire',
    category: 'pact',
    significance: 'How the Company’s commercial privilege was granted by Mughal authority itself, and how its abuse became the quarrel that preceded conquest.',
    disputed: [
      {
        claim: 'William Hamilton’s role in securing the farman',
        note: 'The story that the surgeon’s cure of the emperor won the concession is repeated in Company tradition and many later histories, but the embassy’s own records show a long negotiation in which the Company’s payments and the court’s factional politics mattered at least as much.',
      },
    ],
    consequences: [
      { eventId: 'battle-of-plassey', note: 'The dispute over dastaks and the fortification of Calcutta were among Siraj-ud-Daulah’s stated grievances against the Company in 1756.' },
    ],
    sources: [
      { title: 'Bengal: The British Bridgehead: Eastern India 1740–1828 (The New Cambridge History of India II.2)', author: 'P. J. Marshall', publisher: 'Cambridge University Press', year: 1987, type: 'book', evidence: 'scholarship' },
      { title: 'From Prosperity to Decline: Eighteenth Century Bengal', author: 'Sushil Chaudhury', publisher: 'Manohar', year: 1995, type: 'book', evidence: 'scholarship' },
      { title: 'The Anarchy: The Relentless Rise of the East India Company', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2019, type: 'book', evidence: 'scholarship' },
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-16' },
  },
  {
    id: 'nadir-shah-sacks-delhi',
    slug: 'nadir-shah-sacks-delhi',
    title: 'Nadir Shah sacks Delhi',
    date: { year: 1739, month: 3 },
    dateLabel: 'March 1739',
    location: 'Delhi',
    region: 'north',
    states: ['Delhi'],
    summary:
      'The Persian ruler Nadir Shah crushes the Mughal army at Karnal, occupies Delhi, orders a massacre after a riot, and leaves with the Peacock Throne. The empire’s weakness is now visible to everyone.',
    description: [
      'In February 1739 Nadir Shah of Persia defeated the Emperor Muhammad Shah’s much larger army at Karnal in a matter of hours and entered Delhi unopposed. When a rumour of his death set off attacks on Persian soldiers, he ordered a general massacre; contemporary accounts describe a day of killing in the city’s main streets before he called a halt.',
      'He left in May with an indemnity reckoned in the tens of millions of rupees, the Peacock Throne and the Koh-i-Noor diamond among it, and with the Mughal provinces west of the Indus. Muhammad Shah kept his throne, but the raid announced to Marathas, Afghans and Europeans alike that the richest court in Asia could not defend its own capital.',
    ],
    people: [],
    era: 'before-the-empire',
    category: 'turning-point',
    significance: 'The clearest public demonstration of Mughal weakness before Plassey; every regional power drew its own conclusions.',
    disputed: [
      {
        claim: 'The number killed in Delhi on 11 March 1739',
        note: 'Estimates in contemporary and later sources range from around 20,000 to 30,000 dead, with some accounts higher. No reliable count exists.',
      },
    ],
    sources: [
      { title: 'The Sword of Persia: Nader Shah, from Tribal Warrior to Conquering Tyrant', author: 'Michael Axworthy', publisher: 'I.B. Tauris', year: 2006, type: 'book', evidence: 'scholarship' },
      { title: 'Koh-i-Noor: The History of the World’s Most Infamous Diamond', author: 'William Dalrymple and Anita Anand', publisher: 'Bloomsbury', year: 2017, type: 'book', evidence: 'scholarship' },
      { title: 'The Mughal Empire (The New Cambridge History of India I.5)', author: 'John F. Richards', publisher: 'Cambridge University Press', year: 1993, type: 'book', evidence: 'scholarship' },
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-16' },
  },
  {
    id: 'third-battle-of-panipat',
    slug: 'third-battle-of-panipat',
    title: 'Third Battle of Panipat',
    date: { year: 1761, month: 1, day: 14 },
    dateLabel: '14 January 1761',
    location: 'Panipat (present-day Haryana)',
    region: 'north',
    summary:
      'Ahmad Shah Durrani’s Afghan army destroys the Maratha force that had come to dominate northern India. Neither side stays to rule the north; the Company, consolidating Bengal, faces no single rival there.',
    description: [
      'By the 1750s the Marathas were the strongest power in India, collecting tribute from Punjab to Bengal and standing guard over the Mughal emperor in Delhi. Their northward reach brought them into collision with Ahmad Shah Durrani (Abdali) of Afghanistan. After months of manoeuvre and a siege of the Maratha camp, the two armies met at Panipat on 14 January 1761.',
      'The Marathas were routed. The Peshwa’s heir Vishwasrao and the commander Sadashivrao Bhau were killed, with tens of thousands of soldiers and camp followers. Durrani did not stay; the Marathas recovered much of their position within a decade under Madhavrao I, but a generation of commanders was gone, and in the years the north lay open the Company turned Bengal into a base no Indian power would dislodge.',
    ],
    people: [],
    era: 'early-resistance',
    category: 'battle',
    significance: 'An Indian–Afghan war, not a British one, yet it removed the one power most able to contest the Company’s expansion in the decades that followed.',
    disputed: [
      {
        claim: 'Casualties at Panipat',
        note: 'Figures for the dead range from around 40,000 to over 100,000 including non-combatants; contemporary Maratha and Afghan accounts differ and none can be verified.',
      },
    ],
    sources: [
      { title: 'From Plassey to Partition and After', author: 'Sekhar Bandyopadhyay', publisher: 'Orient BlackSwan', year: 2015, type: 'book', evidence: 'scholarship' },
      { title: 'The Marathas 1600–1818 (The New Cambridge History of India II.4)', author: 'Stewart Gordon', publisher: 'Cambridge University Press', year: 1993, type: 'book', evidence: 'scholarship' },
      { title: 'Indian Society and the Making of the British Empire (The New Cambridge History of India II.1)', author: 'C. A. Bayly', publisher: 'Cambridge University Press', year: 1988, type: 'book', evidence: 'scholarship' },
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-16' },
  },
  {
    id: 'grant-of-diwani',
    slug: 'grant-of-diwani',
    title: 'The Diwani of Bengal',
    date: { year: 1765, month: 8, day: 12 },
    dateLabel: '12 August 1765',
    location: 'Allahabad',
    region: 'north',
    states: ['Uttar Pradesh', 'West Bengal', 'Bihar'],
    summary:
      'After defeating the Nawab of Bengal, the Nawab of Awadh and the Mughal emperor together at Buxar, the Company is granted the right to collect the revenues of Bengal, Bihar and Orissa. Conquest now pays for itself.',
    description: [
      'Plassey had made the Company kingmaker in Bengal; it had not made the province governable or profitable. When Nawab Mir Qasim tried to reassert control he was driven out, and on 22 October 1764 at Buxar the Company’s army defeated his alliance with Shuja-ud-Daula of Awadh and the emperor Shah Alam II. The following August, at Allahabad, the emperor formally granted the Company the diwani (the civil and revenue administration) of Bengal, Bihar and Orissa, in return for an annual tribute of 26 lakh rupees.',
      'A trading company was now the tax collector of the richest region in India. Its revenues bought its armies and the goods it shipped home; over the following century Indian taxes financed the conquest of India. The immediate result in Bengal was catastrophe: the famine of 1769–70, worsened by continued revenue demands, killed a large share of the province’s population. A century later Dadabhai Naoroji would name the mechanism the "drain of wealth".',
    ],
    people: [],
    era: 'early-resistance',
    category: 'pact',
    significance: 'The moment the Company became a government in fact, and the origin of the financial drain that later nationalists put at the centre of their case.',
    disputed: [
      {
        claim: 'Deaths in the Bengal famine of 1769–70',
        note: 'Warren Hastings’ contemporary estimate of a third of the population, some ten million people, is widely quoted; modern historians treat it as an upper bound and offer figures from about one to three million. The scale is not in doubt; the precise toll is.',
      },
    ],
    sources: [
      { title: 'Bengal: The British Bridgehead: Eastern India 1740–1828 (The New Cambridge History of India II.2)', author: 'P. J. Marshall', publisher: 'Cambridge University Press', year: 1987, type: 'book', evidence: 'scholarship' },
      { title: 'The Anarchy: The Relentless Rise of the East India Company', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2019, type: 'book', evidence: 'scholarship' },
      { title: 'Poverty and Un-British Rule in India', author: 'Dadabhai Naoroji', publisher: 'Swan Sonnenschein, London', year: 1901, type: 'book', evidence: 'contemporary' },
    ],
    featured: true,
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-16' },
  },
];
