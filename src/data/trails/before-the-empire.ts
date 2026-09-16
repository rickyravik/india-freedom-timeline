import type { Trail } from '@/types';

export const beforeTheEmpire: Trail = {
  id: 'before-the-empire',
  slug: 'before-the-empire',
  version: 1,
  title: 'India before the Empire',
  question: 'How did a trading company come to rule a subcontinent?',
  theme: 'Prelude',
  minutes: 9,
  learningGoal: 'Explain, in your own words, three reasons the East India Company was able to take power in eighteenth-century India, and name one thing historians still disagree about.',
  intro:
    'Every story on this site begins after 1757. This one asks what came before: what India was, what the Company was, and how the one came to rule the other. The short answer is uncomfortable for everybody. India was not weak, poor or backward; it was one of the richest regions on earth. And the Company did not win by conquest so much as by contract, bribery and the hire of its soldiers to Indian rulers who used them against one another. Six stops, from a charter signed in London to a treaty signed at Allahabad.',
  accent: 'indigo',
  stops: [
    {
      id: 'a-rich-country',
      title: 'The cloth the world wanted',
      question: 'What did India look like to a European merchant in 1600?',
      text: [
        'By one widely cited estimate, the Indian subcontinent produced close to a quarter of the world’s economic output around 1700, more than all of Western Europe combined. Its weavers made the finest cotton cloth on earth: Bengal muslin so light it was called "woven air", Coromandel chintz that changed European fashion. Europe had little India wanted in return except silver, and shipped it east by the tonne.[^1][^2]',
        'The English East India Company was founded in 1600 to join that trade. It opened its first Indian post at Surat in 1613 by permission of the Mughal emperor, and Sir Thomas Roe spent four years at Jahangir’s court winning the right to buy and sell. For a hundred and fifty years it was a customer, and not always the biggest one.[^3]',
      ],
      focus: { kind: 'event', id: 'east-india-company-charter' },
      sources: [
        { title: 'Contours of the World Economy, 1–2030 AD', author: 'Angus Maddison', publisher: 'Oxford University Press', year: 2007, type: 'book', evidence: 'scholarship' },
        { title: 'Why Europe Grew Rich and Asia Did Not: Global Economic Divergence, 1600–1850', author: 'Prasannan Parthasarathi', publisher: 'Cambridge University Press', year: 2011, type: 'book', evidence: 'scholarship' },
        { title: 'The Company-State: Corporate Sovereignty and the Early Modern Foundations of the British Empire in India', author: 'Philip J. Stern', publisher: 'Oxford University Press', year: 2011, type: 'book', evidence: 'scholarship' },
      ],
      uncertainty: 'Historical GDP figures are reconstructions, not measurements. Maddison’s estimate of about 24 per cent of world output in 1700 is the most quoted; other economic historians put India’s share lower or treat such precision as unwarranted. That India was among the world’s largest economies is not disputed.',
      bridge: 'A customer needs a stable seller. In 1707 the seller began to come apart.',
    },
    {
      id: 'an-empire-splinters',
      title: 'One empire becomes many kingdoms',
      question: 'Who actually ruled India in 1750?',
      text: [
        'Aurangzeb died in 1707 after twenty-six years of war in the Deccan that had exhausted his treasury and his nobles. His successors reigned briefly. Within a generation the governors of Bengal, Awadh and Hyderabad had made their provinces hereditary kingdoms in all but name, the Marathas ruled much of the west and centre and raided as far as Bengal, and in 1739 a Persian army walked into Delhi, massacred its people and carried off the Peacock Throne.[^1]',
        'India in 1750 was a patchwork: the Marathas, Mysore, Hyderabad, Bengal, Awadh, the Rajput states, the Sikh confederacies of Punjab, and a Mughal emperor who reigned over little beyond his palace. These states were rich, well organised and heavily armed. They also regarded one another, not the Europeans on the coast, as the threat that mattered.[^2]',
      ],
      focus: { kind: 'event', id: 'death-of-aurangzeb' },
      also: [{ kind: 'event', id: 'nadir-shah-sacks-delhi' }],
      sources: [
        { title: 'The Mughal Empire (The New Cambridge History of India I.5)', author: 'John F. Richards', publisher: 'Cambridge University Press', year: 1993, type: 'book', evidence: 'scholarship' },
        { title: 'Indian Society and the Making of the British Empire (The New Cambridge History of India II.1)', author: 'C. A. Bayly', publisher: 'Cambridge University Press', year: 1988, type: 'book', evidence: 'scholarship' },
      ],
      uncertainty: 'Why the Mughal Empire declined is one of the oldest arguments in Indian history. Some historians blame an agrarian and fiscal crisis of the empire’s own making; others see 1707 less as a collapse than as power passing to vigorous regional states. This stop describes what happened, not why.',
      bridge: 'Into these divisions the Company brought something new: a written privilege from the emperor, and a habit of stretching it.',
    },
    {
      id: 'a-licence-to-trade',
      title: 'A piece of paper worth a province',
      question: 'How did a trading privilege turn into a quarrel?',
      text: [
        'In 1717 the emperor Farrukhsiyar granted the Company the right to trade in Bengal free of customs duty for 3,000 rupees a year, and to move its goods under its own passes. The Company later called the farman its Magna Carta. Bengal’s Nawabs, who lost the revenue, called it something else, especially once Company servants began using the passes for their private trade and undercutting Indian merchants.[^1]',
        'For forty years the Nawabs of Bengal tolerated the Company because its silver paid for their cloth. But the Company also fortified Calcutta without permission and sheltered men the Nawab wanted. When the young Siraj-ud-Daulah came to the throne in 1756 he moved to end the abuses, took Calcutta, and gave the Company the pretext it needed.[^2]',
      ],
      focus: { kind: 'event', id: 'farrukhsiyar-farman' },
      sources: [
        { title: 'Bengal: The British Bridgehead — Eastern India 1740–1828 (The New Cambridge History of India II.2)', author: 'P. J. Marshall', publisher: 'Cambridge University Press', year: 1987, type: 'book', evidence: 'scholarship' },
        { title: 'The Anarchy: The Relentless Rise of the East India Company', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2019, type: 'book', evidence: 'scholarship' },
      ],
      bridge: 'The Company had one more thing to sell besides cloth: soldiers.',
    },
    {
      id: 'guns-for-hire',
      title: 'Soldiers for sale',
      question: 'Why did Indian rulers arm the people who would replace them?',
      text: [
        'In the 1740s and 1750s the English and French companies fought each other in the south, and discovered that small forces of Indian sepoys drilled in European fashion could beat much larger armies. Indian rulers noticed too. In the succession wars of the Carnatic and Hyderabad, claimants hired French or English troops to fight their Indian rivals, paying in land and revenue. A European garrison became a normal tool of Indian statecraft, and each hire made the companies stronger.[^1]',
        'Plassey, in June 1757, was the same method taken to its conclusion. Robert Clive did not defeat the Nawab of Bengal’s army; he bought its commander, Mir Jafar, with the promise of the throne. Most of the Bengal army stood and watched. The Company then ruled Bengal through a Nawab it had installed, and could remove.[^2]',
      ],
      focus: { kind: 'event', id: 'battle-of-plassey' },
      also: [{ kind: 'fighter', id: 'puli-thevar' }],
      sources: [
        { title: 'From Plassey to Partition and After', author: 'Sekhar Bandyopadhyay', publisher: 'Orient BlackSwan', year: 2015, type: 'book', evidence: 'scholarship' },
        { title: 'The Anarchy: The Relentless Rise of the East India Company', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2019, type: 'book', evidence: 'scholarship' },
      ],
      bridge: 'A puppet Nawab was expensive to keep. Eight years later the Company stopped pretending.',
    },
    {
      id: 'paid-for-by-india',
      title: 'Conquest that paid for itself',
      question: 'Who financed the British conquest of India?',
      text: [
        'In 1764 at Buxar the Company defeated the combined armies of the Nawab of Bengal, the Nawab of Awadh and the Mughal emperor. The next year the emperor granted it the diwani, the right to collect the revenues of Bengal, Bihar and Orissa. From that day a company of shareholders was the tax collector of the richest region in India, and Indian taxes paid for the armies that went on to conquer the rest.[^1]',
        'The first result was the Bengal famine of 1770, which killed millions while revenue collection continued. The longer result was what Dadabhai Naoroji, a century later, called the drain: taxes raised in India spent on British armies, British salaries and goods shipped to Britain. Naoroji’s figures became the economic heart of the nationalist case.[^2]',
      ],
      focus: { kind: 'event', id: 'grant-of-diwani' },
      also: [{ kind: 'fighter', id: 'dadabhai-naoroji' }],
      sources: [
        { title: 'Bengal: The British Bridgehead — Eastern India 1740–1828 (The New Cambridge History of India II.2)', author: 'P. J. Marshall', publisher: 'Cambridge University Press', year: 1987, type: 'book', evidence: 'scholarship' },
        { title: 'Poverty and Un-British Rule in India', author: 'Dadabhai Naoroji', publisher: 'Swan Sonnenschein, London', year: 1901, type: 'book', evidence: 'contemporary' },
      ],
      uncertainty: 'The famine’s toll is disputed: a contemporary estimate of ten million dead is widely quoted, while modern historians offer figures from about one to three million. Its scale, and the Company’s failure to relieve it, are not in doubt.',
      contentNote: 'This stop describes a famine.',
      bridge: 'Which leaves the question people still argue about.',
    },
    {
      id: 'could-it-have-gone-differently',
      title: 'Could it have gone differently?',
      question: 'Was there a moment when India could have stopped the Company?',
      text: [
        'Historians give three kinds of answer. The first points to the alliances that never held. At Plassey, Buxar and in every war that followed, the Company fought with Indian allies against Indian enemies; a durable coalition of the Marathas, Mysore, Hyderabad and Awadh might have denied it the local partners it depended on. The second points to timing: in January 1761, at Panipat, the Marathas, the one power able to contest the north, lost a generation of commanders to an Afghan army, not a British one, in the very years the Company was making Bengal into a base.[^1]',
        'The third answer is that the question is slightly the wrong one. Mysore under Hyder Ali and Tipu Sultan modernised its army, allied with France and fought the Company to a standstill twice; it was defeated in the end because its neighbours joined the other side. In the eighteenth century there was no "India" that could be betrayed, only states with their own interests, and the idea of a single Indian nation was itself built largely in the century of resistance that followed. Some historians add that the Company was a new kind of enemy, backed by naval power and London’s capital markets, that no Asian state of the time had an answer to. None of these views is settled.[^2][^3]',
      ],
      focus: { kind: 'event', id: 'third-battle-of-panipat' },
      also: [{ kind: 'event', id: 'battle-of-plassey' }],
      sources: [
        { title: 'The Marathas 1600–1818 (The New Cambridge History of India II.4)', author: 'Stewart Gordon', publisher: 'Cambridge University Press', year: 1993, type: 'book', evidence: 'scholarship' },
        { title: 'Indian Society and the Making of the British Empire (The New Cambridge History of India II.1)', author: 'C. A. Bayly', publisher: 'Cambridge University Press', year: 1988, type: 'book', evidence: 'scholarship' },
        { title: 'From Plassey to Partition and After', author: 'Sekhar Bandyopadhyay', publisher: 'Orient BlackSwan', year: 2015, type: 'book', evidence: 'scholarship' },
      ],
      uncertainty: 'This stop is interpretation, not record. Each of the three arguments is held by serious historians and contested by others; the site presents them as the state of a debate, not as a verdict.',
      bridge: '',
    },
  ],
  reflection: 'Plassey was won with a bribe, not a battle. Looking back over the six stops, which mattered more: the Company’s strengths, or the divisions among Indian states? What would you need to know to decide, and where would you look?',
  activity: {
    kind: 'order',
    prompt: 'Put these six moments in the order they happened.',
    items: [
      { label: 'The Company receives its royal charter in London', year: 1600, ref: { kind: 'event', id: 'east-india-company-charter' } },
      { label: 'Aurangzeb dies and the succession wars begin', year: 1707, ref: { kind: 'event', id: 'death-of-aurangzeb' } },
      { label: 'Farrukhsiyar grants the Company duty-free trade in Bengal', year: 1717, ref: { kind: 'event', id: 'farrukhsiyar-farman' } },
      { label: 'Nadir Shah sacks Delhi', year: 1739, ref: { kind: 'event', id: 'nadir-shah-sacks-delhi' } },
      { label: 'Plassey: the Nawab’s commander is bought', year: 1757, ref: { kind: 'event', id: 'battle-of-plassey' } },
      { label: 'The emperor grants the Company the Diwani of Bengal', year: 1765, ref: { kind: 'event', id: 'grant-of-diwani' } },
    ],
    explanation: 'A century separates the charter from the first signs of Mughal weakness, and another half-century passes before Plassey. The Company was a trader for far longer than it was a ruler; the fast part, from Plassey to the Diwani, took eight years.',
  },
  followOn: { label: 'Begin Chapter 2: Early Resistance', to: '/timeline?view=chapters' },
  editorial: {
    status: 'reviewed',
    reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
    reviewedOn: '2026-09-16',
    notes:
      'Drafted 2026-09-16 as a prelude to the archive’s 1757 starting point, on the six prelude event records. Fact-checked against Richards, Alam, Marshall, Bayly, Gordon, Stern, Parthasarathi, Dalrymple and Bandyopadhyay: charter 31 Dec 1600; Surat 1613; Roe 1615–19; Aurangzeb d. 3 Mar 1707; farman 1717 (3,000 rupees); Karnal Feb 1739 and Delhi massacre 11 Mar 1739; Plassey 23 Jun 1757; Panipat 14 Jan 1761; Buxar 22 Oct 1764; Diwani 12 Aug 1765 (26 lakh). Contested figures (Maddison’s 24%, the 1739 and Panipat death tolls, the 1770 famine) are stated as ranges and carried as uncertainty notes. The final stop is labelled as interpretation.',
  },
  teaching: {
    alignment: 'Proposed for secondary history — the establishment of Company rule; causation and historical interpretation. Not yet mapped to a specific board or state curriculum.',
    shortVersion: ['a-rich-country', 'guns-for-hire', 'could-it-have-gone-differently'],
    prompts: [
      'The first stop says India was one of the richest regions in the world in 1700. If that is true, why was it possible for a foreign company to take control? List the reasons the trail gives, then rank them.',
      'At Plassey the decisive act was a bribe. Is that conquest? Argue both sides.',
      'The last stop offers three different historians’ answers to "could it have gone differently?". Which do you find most convincing, and what evidence would change your mind?',
    ],
    facilitatorNotes: [
      'This trail is deliberately about causes, not heroes. Students who arrive expecting villains and victims should be nudged towards structure: revenue, alliances, and the absence of a shared political identity.',
      'The 24 per cent GDP figure is a reconstruction and the uncertainty note says so; it is a good place to discuss how historians estimate things nobody measured at the time.',
      'The final stop is labelled interpretation. Treat it as a debate to be had in the room, not a conclusion to be copied down.',
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-16' },
  },
};
