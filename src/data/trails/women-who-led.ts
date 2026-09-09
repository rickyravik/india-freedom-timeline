import type { Trail } from '@/types';

export const womenWhoLed: Trail = {
  id: 'women-who-led',
  slug: 'women-who-led',
  version: 1,
  title: 'Women who led resistance',
  question: 'How did women lead resistance across two centuries — and what did it cost them?',
  theme: 'Leadership',
  minutes: 6,
  learningGoal: 'Name one woman who led resistance before 1857 and one during 1942, say what each resisted and what it cost her, and tell which of their stories rests on oral tradition.',
  intro:
    'Five women, five different centuries of the struggle and five different ways of leading: a queen who raised an army, a queen who defended a city, a schoolteacher who led an armed raid, a sixteen-year-old who took over a movement, and a student who ran a radio station. None of them worked together. Read them as five answers to the same question.',
  accent: 'sepia',
  stops: [
    {
      id: 'velu-nachiyar',
      title: 'A queen raises an army',
      question: 'What could a widowed queen do against the East India Company in the 1770s?',
      text: [
        'Velu Nachiyar was queen of Sivaganga in the Tamil country. In 1772 Company troops and the Nawab of Arcot’s forces killed her husband, and she escaped with her daughter, spending eight years in hiding while she planned her return.[^1]',
        'With help from Hyder Ali of Mysore and the Marudhu brothers she raised an army — including a women’s unit — and took Sivaganga back around 1780. Tamil Nadu remembers her as Veeramangai, the brave woman.[^2]',
      ],
      focus: { kind: 'fighter', id: 'velu-nachiyar' },
      also: [{ kind: 'fighter', id: 'marudhu-brothers' }],
      sources: [
        { title: 'Rani Velu Nachiyar commemorations', publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav', url: 'https://amritkaal.nic.in/', type: 'government', evidence: 'reference' },
        { title: 'Sivaganga District Gazetteer', publisher: 'Government of Tamil Nadu', type: 'archive', evidence: 'scholarship' },
      ],
      uncertainty: 'The celebrated account of her commander Kuyili setting the Company’s ammunition store ablaze comes from oral tradition and later retellings; no contemporary record confirms it.',
      bridge: 'Seventy years later another queen faced the Company — this time over who had the right to inherit a kingdom.',
    },
    {
      id: 'jhansi',
      title: 'Two women defend Jhansi',
      question: 'Who is remembered — and who was nearly forgotten — when a city falls?',
      text: [
        'When Rani Lakshmibai’s husband died, the British refused to accept her adopted son as heir and took Jhansi under the Doctrine of Lapse. In 1858 a British army besieged the city; she led the defence from the walls for two weeks, escaped through the enemy lines by night, joined Tatya Tope to seize Gwalior, and died in battle on 17 June 1858.[^1]',
        'Jhalkari Bai, from a Dalit family near Jhansi, served in and came to command the Durga Dal, the women’s guard. She is remembered for dressing as the Rani during the fall of the city to cover her escape. For a long time the history books left her out.',
      ],
      focus: { kind: 'fighter', id: 'rani-lakshmibai' },
      also: [
        { kind: 'fighter', id: 'jhalkari-bai' },
        { kind: 'event', id: 'siege-of-jhansi' },
      ],
      sources: [
        { title: 'The Rani of Jhansi: A Study in Female Heroism in India', author: 'Joyce Lebra-Chapman', publisher: 'University of Hawaii Press', year: 1986, type: 'book', evidence: 'scholarship' },
        { title: 'Rani Lakshmi Bai papers and despatches', publisher: 'National Archives of India', type: 'archive', evidence: 'contemporary' },
      ],
      uncertainty: 'Jhalkari Bai’s story rests largely on oral tradition written down much later; accounts of her fate after Jhansi differ. Accounts of exactly how and where Lakshmibai died on 17/18 June 1858 also differ.',
      contentNote: 'This stop includes deaths in battle.',
      bridge: 'By the 1930s resistance had new forms — and new leaders who were still in their teens and twenties.',
    },
    {
      id: 'pritilata',
      title: 'A headmistress leads a raid',
      question: 'Why would a philosophy graduate join an armed revolutionary group?',
      text: [
        'Pritilata Waddedar was one of Chittagong’s finest students; the authorities withheld her Calcutta degree because of her politics, and she became a school headmistress at twenty-one. Secretly she had joined Surya Sen’s revolutionary group and trained with weapons.[^1]',
        'On 24 September 1932 she led the attack on the Pahartali European Club, infamous for a sign barring "dogs and Indians". Wounded in the retreat, she swallowed cyanide rather than be captured. Calcutta University finally conferred her degree in 2012.[^2]',
      ],
      focus: { kind: 'fighter', id: 'pritilata-waddedar' },
      also: [{ kind: 'event', id: 'chittagong-armoury-raid' }],
      sources: [
        { title: 'Do and Die: The Chittagong Uprising 1930–34', author: 'Manini Chatterjee', publisher: 'Penguin', year: 1999, type: 'book', evidence: 'scholarship' },
        { title: 'Pahartali case records', publisher: 'West Bengal State Archives', type: 'archive', evidence: 'contemporary' },
      ],
      contentNote: 'This stop describes a suicide.',
      bridge: 'In the hills of the North-East, at almost the same moment, a sixteen-year-old inherited a movement.',
    },
    {
      id: 'gaidinliu',
      title: 'Sixteen, and leading a rebellion',
      question: 'What does it cost to lead for fourteen years from inside a prison?',
      text: [
        'Gaidinliu was born among the Rongmei Nagas of Manipur and at thirteen joined her cousin Jadonang’s Heraka movement, which sought to revive Naga religion and end British rule in the hills. When the British hanged Jadonang in 1931, she took his place at sixteen: she told her people to pay no taxes, and her followers fought the Assam Rifles from village strongholds.[^1]',
        'Captured in 1932, she was sentenced to life imprisonment. Nehru met her in Shillong jail in 1937 and gave her the title Rani. Only free India could release her, in 1947.[^1]',
      ],
      focus: { kind: 'fighter', id: 'rani-gaidinliu' },
      sources: [
        { title: 'Rani Gaidinliu commemorative records', publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav', url: 'https://amritkaal.nic.in/', type: 'government', evidence: 'reference' },
        { title: 'Studies of the Heraka movement and Zeliangrong Nagas', publisher: 'Academic research on Northeast India', type: 'journal', evidence: 'scholarship' },
      ],
      bridge: 'In 1942 the leaders of the largest movement in the country were all in prison within a day. Someone had to keep it going.',
    },
    {
      id: 'usha-mehta',
      title: 'Calling from somewhere in India',
      question: 'How did people keep a movement going when its leaders were imprisoned?',
      text: [
        'When Quit India began in August 1942 and the Congress leadership was jailed overnight, the British controlled all the news. Usha Mehta, twenty-two, and her friends built a secret radio station. "This is Congress Radio, calling from 42.34 metres from somewhere in India," she announced.[^1]',
        'For three months the station broadcast messages from the underground leaders, moving constantly to dodge detection vans. Betrayed in November 1942, she was arrested at the transmitter and spent four years in prison. She later became a professor of politics in Bombay.[^2]',
      ],
      focus: { kind: 'fighter', id: 'usha-mehta' },
      also: [{ kind: 'event', id: 'quit-india-launch' }],
      sources: [
        { title: 'Congress Radio: Usha Mehta and the Underground Radio Station of 1942', author: 'Usha Thakkar', publisher: 'Penguin', year: 2021, type: 'book', evidence: 'scholarship' },
        { title: 'Congress Radio case records', publisher: 'Maharashtra State Archives', type: 'archive', evidence: 'contemporary' },
      ],
      bridge: '',
    },
  ],
  reflection: 'Four of these five women were under thirty when they acted. Each gave something up — a kingdom, a degree, fourteen years, four years. Who helped each of them, and what did the people around them risk?',
  activity: {
    kind: 'choice',
    prompt: 'Which claim in this trail rests mainly on oral tradition rather than on a contemporary record?',
    options: ['Kuyili’s fire attack on the Sivaganga ammunition store', 'Pritilata Waddedar’s raid on the Pahartali European Club', 'Rani Gaidinliu’s life sentence in 1932', 'Usha Mehta’s arrest at the Congress Radio transmitter'],
    answerIndex: 0,
    explanation: 'The Pahartali raid, the sentence and the arrest are recorded in case files and contemporary papers. Kuyili’s attack is remembered through oral tradition and later retellings — the archive marks it as uncertain, and so should you when you retell it.',
  },
  followOn: { label: 'Meet more women of the movement', to: '/fighters?collection=women' },
  editorial: { status: 'draft', notes: 'Drafted 2026-09-08 from the five records’ own text. Needs historical review before the pilot.' },
  teaching: {
    alignment: 'Proposed: upper-primary and secondary history — resistance to colonial rule; evidence and interpretation. To be reviewed by a qualified educator.',
    shortVersion: ['velu-nachiyar', 'pritilata', 'usha-mehta'],
    prompts: [
      'Each of these five women is remembered differently by history — some in official records, some mainly in memory and oral tradition. Why might that be, and does it change how much we should trust their stories?',
      'These women acted eighteen years, seventy years and a century apart. What stayed the same about what leadership cost them, and what changed?',
      'The trail says none of these five women worked together. What would it have meant for the freedom struggle if they had?',
    ],
    facilitatorNotes: [
      'Kuyili\'s fire attack is the trail\'s clearest example of an unverified claim — useful for a short exercise in "what counts as evidence."',
      'Encourage students to name the specific cost each woman paid (exile, imprisonment, a death sentence, years underground) rather than a general "sacrifice."',
      'If time allows, connect Usha Mehta\'s underground radio to the availability of technology as a factor in how resistance was organised by the 1940s.',
    ],
    editorial: { status: 'draft' },
  },
};
