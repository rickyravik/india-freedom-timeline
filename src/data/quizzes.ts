import type { QuizQuestion } from '@/types';

/**
 * Quiz questions for the Learn section. Questions are respectful in tone:
 * they test knowledge of history without trivialising sacrifice.
 */
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q-dandi',
    question: 'What law did Gandhi break at the end of the Dandi March in April 1930?',
    options: ['The salt tax law', 'The Rowlatt Act', 'The Arms Act', 'The Press Act'],
    answerIndex: 0,
    explanation:
      'Gandhi lifted natural salt at Dandi beach on 6 April 1930, breaking the government monopoly on salt — a tax that touched even the poorest Indian.',
    relatedLink: { label: 'The Dandi March', to: '/events/dandi-march' },
  },
  {
    id: 'q-1857-start',
    question: 'Where did the Revolt of 1857 begin on 10 May 1857?',
    options: ['Meerut', 'Delhi', 'Kanpur', 'Jhansi'],
    answerIndex: 0,
    explanation:
      'Sepoys at Meerut rose on 10 May 1857 and marched overnight to Delhi, where they proclaimed Bahadur Shah Zafar their sovereign.',
    relatedLink: { label: 'The Revolt of 1857', to: '/events/revolt-of-1857' },
  },
  {
    id: 'q-first-woman-president',
    question: 'Who was the first woman to preside over the Indian National Congress?',
    options: ['Annie Besant (1917)', 'Sarojini Naidu (1925)', 'Kasturba Gandhi', 'Aruna Asaf Ali'],
    answerIndex: 0,
    explanation:
      'Annie Besant presided at Calcutta in 1917; Sarojini Naidu, in 1925, was the first Indian woman to hold the office.',
    relatedLink: { label: 'Annie Besant', to: '/fighters/annie-besant' },
  },
  {
    id: 'q-ulgulan',
    question: '"Ulgulan" — the Great Tumult of 1899–1900 — was led by which leader?',
    options: ['Birsa Munda', 'Sidhu Murmu', 'Tirot Sing', 'Alluri Sitarama Raju'],
    answerIndex: 0,
    explanation:
      'Birsa Munda led the Munda Ulgulan in Chotanagpur. His movement won legal protection for Adivasi lands, and his birthday is now Janjatiya Gaurav Divas.',
    relatedLink: { label: 'Birsa Munda', to: '/fighters/birsa-munda' },
  },
  {
    id: 'q-assembly-1929',
    question: 'Who threw non-lethal bombs into the Central Legislative Assembly in 1929 "to make the deaf hear"?',
    options: ['Bhagat Singh and Batukeshwar Dutt', 'Chandrashekhar Azad and Rajguru', 'Ram Prasad Bismil and Ashfaqulla Khan', 'Surya Sen and Pritilata Waddedar'],
    answerIndex: 0,
    explanation:
      'Bhagat Singh and Batukeshwar Dutt threw deliberately weak bombs, showered leaflets, and courted arrest so the trial could carry their message.',
    relatedLink: { label: 'The Assembly bomb case', to: '/events/assembly-bomb-case' },
  },
  {
    id: 'q-jhansi-regiment',
    question: 'The INA’s all-women combat unit was named after which freedom fighter?',
    options: ['Rani Lakshmibai of Jhansi', 'Rani Chennamma of Kittur', 'Begum Hazrat Mahal', 'Rani Velu Nachiyar'],
    answerIndex: 0,
    explanation:
      'The Rani of Jhansi Regiment, raised in 1943 under Captain Lakshmi Sahgal, honoured the warrior queen of 1857.',
    relatedLink: { label: 'Captain Lakshmi Sahgal', to: '/fighters/lakshmi-sahgal' },
  },
  {
    id: 'q-quit-india-mantra',
    question: 'What mantra did Gandhi give the nation on 8 August 1942?',
    options: ['"Do or Die"', '"Swaraj is my birthright"', '"Inquilab Zindabad"', '"Jai Hind"'],
    answerIndex: 0,
    explanation:
      '"We shall either free India or die in the attempt" — the Quit India speech at Gowalia Tank gave the movement its watchword: Do or Die.',
    relatedLink: { label: 'Quit India', to: '/events/quit-india-launch' },
  },
  {
    id: 'q-kakori',
    question: 'The Kakori train action of 1925 was carried out by which organization?',
    options: ['Hindustan Republican Association', 'Ghadar Party', 'Anushilan Samiti', 'Indian National Army'],
    answerIndex: 0,
    explanation:
      'The HRA, led by Ram Prasad Bismil, seized a government treasury from the 8-Down train at Kakori to fund the revolutionary movement.',
    relatedLink: { label: 'Kakori train action', to: '/events/kakori-train-action' },
  },
  {
    id: 'q-santhal-hul',
    question: 'Who proclaimed the Santhal Hul at Bhognadih on 30 June 1855?',
    options: ['Sidhu and Kanhu Murmu', 'Tilka Manjhi', 'Birsa Munda', 'Komaram Bheem'],
    answerIndex: 0,
    explanation:
      'The brothers Sidhu and Kanhu Murmu led tens of thousands of Santhals against moneylenders, landlords and the Company state. 30 June is observed as Hul Diwas.',
    relatedLink: { label: 'Santhal Hul', to: '/events/santhal-hul' },
  },
  {
    id: 'q-first-indian-mp',
    question: 'Who was the first Indian elected to the British House of Commons?',
    options: ['Dadabhai Naoroji', 'Gopal Krishna Gokhale', 'Surendranath Banerjee', 'Shyamji Krishna Varma'],
    answerIndex: 0,
    explanation:
      'Dadabhai Naoroji won Central Finsbury for the Liberals in 1892 — by five votes — and used the seat to argue India’s case.',
    relatedLink: { label: 'Dadabhai Naoroji', to: '/fighters/dadabhai-naoroji' },
  },
  {
    id: 'q-vedaranyam',
    question: 'Who led the southern salt march to Vedaranyam in 1930?',
    options: ['C. Rajagopalachari', 'Tanguturi Prakasam', 'V. O. Chidambaram Pillai', 'Subramania Bharati'],
    answerIndex: 0,
    explanation:
      'Rajaji marched from Tiruchirappalli to Vedaranyam — the south’s answer to Dandi — and was imprisoned for lifting salt.',
    relatedLink: { label: 'C. Rajagopalachari', to: '/fighters/c-rajagopalachari' },
  },
  {
    id: 'q-chittagong',
    question: 'Who led the Chittagong armoury raid of April 1930?',
    options: ['Surya Sen', 'Bagha Jatin', 'Khudiram Bose', 'Rash Behari Bose'],
    answerIndex: 0,
    explanation:
      '"Masterda" Surya Sen, a schoolteacher, led some sixty young revolutionaries in seizing Chittagong’s armouries and proclaiming a provisional revolutionary government.',
    relatedLink: { label: 'Chittagong armoury raid', to: '/events/chittagong-armoury-raid' },
  },
  {
    id: 'q-frontier-gandhi',
    question: 'The Khudai Khidmatgar — "Servants of God" — were founded by whom?',
    options: ['Khan Abdul Ghaffar Khan', 'Maulana Azad', 'Mohammad Ali Jouhar', 'Hakim Ajmal Khan'],
    answerIndex: 0,
    explanation:
      'Badshah Khan’s Khudai Khidmatgar bound tens of thousands of Pashtuns to nonviolence — and bore some of the Civil Disobedience era’s harshest repression.',
    relatedLink: { label: 'Khan Abdul Ghaffar Khan', to: '/fighters/khan-abdul-ghaffar-khan' },
  },
  {
    id: 'q-jallianwala-year',
    question: 'In which year did the Jallianwala Bagh massacre take place?',
    options: ['1919', '1917', '1921', '1930'],
    answerIndex: 0,
    explanation:
      'On 13 April 1919 — Baisakhi day — General Dyer ordered fire without warning on an unarmed crowd in Amritsar.',
    relatedLink: { label: 'Jallianwala Bagh', to: '/events/jallianwala-bagh-massacre' },
  },
  {
    id: 'q-gaidinliu',
    question: 'Which leader of the Naga hills was imprisoned for fourteen years from the age of sixteen?',
    options: ['Rani Gaidinliu', 'Kanaklata Barua', 'Pritilata Waddedar', 'Accamma Cherian'],
    answerIndex: 0,
    explanation:
      'Rani Gaidinliu led the Heraka movement’s resistance from 1931. Nehru gave her the title "Rani"; only free India could release her, in 1947.',
    relatedLink: { label: 'Rani Gaidinliu', to: '/fighters/rani-gaidinliu' },
  },
  {
    id: 'q-kattabomman',
    question: 'Where was Veerapandiya Kattabomman hanged in October 1799?',
    options: ['Kayathar', 'Panchalankurichi', 'Tiruppathur', 'Sankagiri'],
    answerIndex: 0,
    explanation:
      'After the fall of Panchalankurichi and his betrayal at Pudukkottai, Kattabomman was hanged at Kayathar on 16 October 1799 before the assembled chiefs of the south.',
    relatedLink: { label: 'Veerapandiya Kattabomman', to: '/fighters/veerapandiya-kattabomman' },
  },
  {
    id: 'q-vedaranyam-leader',
    question: 'Who was the first woman in the Madras Presidency jailed in the Salt Satyagraha of 1930?',
    options: ['Rukmini Lakshmipathi', 'Sarojini Naidu', 'Kamaladevi Chattopadhyay', 'Accamma Cherian'],
    answerIndex: 0,
    explanation:
      'Rukmini Lakshmipathi joined Rajaji’s Vedaranyam march, broke the salt law and served a year in prison — the presidency’s first woman jailed in the movement; in 1946 she became its first woman minister.',
    relatedLink: { label: 'Rukmini Lakshmipathi', to: '/fighters/rukmini-lakshmipathi' },
  },
  {
    id: 'q-kodi-kaatha',
    question: '"Kodi Kaatha Kumaran" — the one who protected the flag — died in which town in 1932?',
    options: ['Tiruppur', 'Madurai', 'Tuticorin', 'Erode'],
    answerIndex: 0,
    explanation:
      'Tiruppur Kumaran led a procession carrying the banned national flag on 11 January 1932; beaten by police on the Noyyal riverbank, he died still holding it aloft.',
    relatedLink: { label: 'Tiruppur Kumaran', to: '/fighters/tiruppur-kumaran' },
  },
];

/** "Who am I?" — guess the freedom fighter from progressive clues. */
export interface GuessWhoRound {
  id: string;
  clues: string[];
  answerId: string;
  answerName: string;
}

export const guessWhoRounds: GuessWhoRound[] = [
  {
    id: 'gw-bhagat-singh',
    clues: [
      'I was born in Punjab in 1907, into a family already deep in the freedom struggle.',
      'I helped found a youth organization and wrote essays — including one on why I did not believe in God.',
      'I threw bombs into the Assembly that were designed to harm no one, and stayed to be arrested.',
      'I was hanged on 23 March 1931, at twenty-three. They call me Shaheed-e-Azam.',
    ],
    answerId: 'bhagat-singh',
    answerName: 'Bhagat Singh',
  },
  {
    id: 'gw-lakshmibai',
    clues: [
      'I grew up in the Peshwa’s court, learning to ride and fence alongside the boys.',
      'The Company refused to recognise my adopted son and took my kingdom.',
      'I defended my city through a two-week siege, then escaped through the enemy lines at night.',
      'I died fighting near Gwalior in June 1858 — even my enemy called me the bravest of the rebels.',
    ],
    answerId: 'rani-lakshmibai',
    answerName: 'Rani Lakshmibai of Jhansi',
  },
  {
    id: 'gw-birsa',
    clues: [
      'I herded sheep as a boy in the forests of Chotanagpur.',
      'My people called me Dharti Aba — Father of the Earth.',
      'I led the Ulgulan against those who had taken our lands.',
      'I died in Ranchi jail at about twenty-five; my birthday is now a national observance.',
    ],
    answerId: 'birsa-munda',
    answerName: 'Birsa Munda',
  },
  {
    id: 'gw-usha-mehta',
    clues: [
      'I marched in my first protest at the age of eight.',
      'In 1942, when the leaders were jailed, I helped run something the Raj could not silence — for a while.',
      '"This is Congress Radio, calling from somewhere in India," I announced.',
      'I was caught at the transmitter and spent four years in prison. Later I became a professor.',
    ],
    answerId: 'usha-mehta',
    answerName: 'Usha Mehta',
  },
  {
    id: 'gw-bose',
    clues: [
      'I passed the ICS examination near the top — and resigned from it.',
      'I escaped house arrest in Calcutta disguised as a Pathan.',
      'I asked my soldiers for blood, and promised them freedom.',
      'They call me Netaji.',
    ],
    answerId: 'subhas-chandra-bose',
    answerName: 'Subhas Chandra Bose',
  },
  {
    id: 'gw-chennamma',
    clues: [
      'I ruled a small state in Karnataka in the 1820s.',
      'The Company refused to recognise my adopted heir.',
      'My forces defeated the first British assault — their Collector fell in the battle.',
      'I died a prisoner in Bailhongal fort, three decades before the Rani of Jhansi took up the same cause.',
    ],
    answerId: 'rani-chennamma',
    answerName: 'Kittur Rani Chennamma',
  },
];
