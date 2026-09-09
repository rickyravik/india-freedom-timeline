import type { Trail } from '@/types';

export const anArmyInExile: Trail = {
  id: 'an-army-in-exile',
  slug: 'an-army-in-exile',
  version: 1,
  title: 'An army in exile',
  question: 'Could India be freed from outside — and what did the attempt change at home?',
  theme: 'The INA and Azad Hind',
  minutes: 7,
  learningGoal: 'Put the INA’s story in order from Tripuri in 1939 to the Red Fort in 1945, and explain in one sentence why an army that never got past India’s border is remembered as having shaken the Raj.',
  intro:
    'In 1939 Subhas Chandra Bose lost the argument inside the Congress and was forced out of its leadership. Two years later he left India, and by 1943 he commanded an army in Singapore under the flag of a government in exile — raised with the help of Britain’s enemies in a world war. The army marched on India once, in 1944, and was beaten on the eastern border; a year later its remnants were fighting a losing war in Burma. This trail follows it there and back, and asks why its defeat mattered so much at home.',
  accent: 'oxide',
  stops: [
    {
      id: 'tripuri-1939',
      title: 'Tripuri: a president without a committee',
      question: 'What happens when a Congress president wins the vote and loses the party?',
      text: [
        'In January 1939 Subhas Chandra Bose, Congress president since Haripura the year before, stood for re-election against Pattabhi Sitaramayya, Gandhi’s preferred candidate — and won, 1,580 votes to 1,377. Bose argued that war in Europe was imminent and that Britain should be confronted with an ultimatum. Gandhi called the defeat "more mine than his"; in February twelve of the fifteen members of the Working Committee resigned around the new president, and at the Tripuri session in March, with Bose ill on a stretcher, the delegates voted to bind him to Gandhi’s wishes.[^1]',
        'Ill and isolated, Bose stepped down in April. In May 1939 he founded the All India Forward Bloc to rally the left. The Raj detained him in 1940 and placed him under house arrest in Calcutta; in January 1941 he escaped — the beginning of the road that led to Berlin, Singapore and the INA.[^1]',
      ],
      focus: { kind: 'event', id: 'tripuri-session' },
      also: [{ kind: 'fighter', id: 'subhas-chandra-bose' }],
      sources: [
        {
          title: 'His Majesty’s Opponent',
          author: 'Sugata Bose',
          publisher: 'Harvard University Press',
          year: 2011,
          type: 'book',
        },
      ],
      bridge: 'The road out of Calcutta ran through Afghanistan, the Soviet Union and Hitler’s Germany — through Britain’s enemies in a world war.',
    },
    {
      id: 'escape-1941',
      title: 'Kabul, Berlin, a submarine',
      question: 'Whose help would you take to free your country?',
      text: [
        'Bose left his Calcutta house in January 1941 disguised as a Muslim insurance agent, crossed the frontier from Peshawar as a deaf-mute Pathan, and travelled by way of Kabul and Moscow to Berlin, arriving in April. There he raised an Indian Legion and broadcast to India. He had chosen Britain’s enemies in a world war as his allies; the teaching prompts return to that choice.[^1]',
        'In 1943 a German submarine, and then a Japanese one, carried him to Southeast Asia. Waiting there was Rash Behari Bose — the revolutionary of the 1912 Hardinge bomb, in Japanese exile since 1915 — who in 1942 had convened the conferences that created the Indian Independence League and endorsed an Indian National Army raised from prisoners of war under Mohan Singh: a first INA that Singh himself dissolved in December 1942 when he concluded Japan would not treat it as an equal ally. Ageing and ill, Rash Behari handed the movement over when Subhas Bose arrived in July 1943.[^1]',
      ],
      focus: { kind: 'fighter', id: 'subhas-chandra-bose' },
      also: [{ kind: 'fighter', id: 'rash-behari-bose' }],
      sources: [
        {
          title: 'His Majesty’s Opponent: Subhas Chandra Bose and India’s Struggle against Empire',
          author: 'Sugata Bose',
          publisher: 'Harvard University Press',
          year: 2011,
          type: 'book',
        },
        {
          title: 'Netaji papers (declassified files)',
          publisher: 'National Archives of India',
          type: 'archive',
        },
      ],
      bridge: 'Within four months of landing in Singapore he had a government to proclaim.',
    },
    {
      id: 'singapore-1943',
      title: 'A government in Singapore',
      question: 'Can a government exist before it has a country?',
      text: [
        'Bose — "Netaji" to his followers — took over the Indian Independence League and the INA, an army raised from prisoners of war and from the Tamil, Punjabi and other Indian communities of Malaya and Burma. On 21 October 1943, in Singapore, he proclaimed the Provisional Government of Azad Hind. It declared war on Britain and the USA; in December Japan nominally placed the Andaman and Nicobar Islands under it, and they were renamed Shaheed and Swaraj.[^1]',
        '"Give me blood, and I shall give you freedom!" he would tell Indians in Burma the following summer; "Chalo Dilli" pointed the army at India, and "Jai Hind", the greeting devised for him in Germany by his aide Abid Hasan, is now India’s national slogan. In Singapore he also raised the Rani of Jhansi Regiment, led by Dr Lakshmi Swaminathan, later Sahgal.[^2]',
      ],
      focus: { kind: 'event', id: 'azad-hind-government' },
      also: [
        { kind: 'fighter', id: 'subhas-chandra-bose' },
        { kind: 'movement', id: 'azad-hind' },
      ],
      sources: [
        {
          title: 'His Majesty’s Opponent',
          author: 'Sugata Bose',
          publisher: 'Harvard University Press',
          year: 2011,
          type: 'book',
        },
        {
          title: 'A Revolutionary Life: Memoirs of a Political Activist',
          author: 'Lakshmi Sahgal',
          publisher: 'Kali for Women',
          year: 1997,
          type: 'book',
        },
      ],
      uncertainty: 'The "Give me blood" call is dated to a speech to Indians in Burma on 4 July 1944; the exact venue and wording are reconstructed from published texts, which vary ("I shall give you", "I will give you", "I promise you" freedom), and the Hindi form "Tum mujhe khoon do…" is a later rendering.',
      bridge: 'The regiment’s commander was a doctor from Madras.',
    },
    {
      id: 'rani-of-jhansi-regiment',
      title: 'Captain Lakshmi and the Rani of Jhansi Regiment',
      question: 'Why did a doctor in Singapore take command of a regiment?',
      text: [
        'Lakshmi Swaminathan, daughter of the lawyer S. Swaminathan and the reformer Ammu Swaminathan, took her medical degree in Madras and moved to Singapore in 1940, where she practised among poor Indian migrant workers. When Subhas Chandra Bose arrived in July 1943 determined to raise a women’s regiment, she heard him announce it at a mass meeting, sought him out, and left a five-hour interview with six days to raise the first recruits. Her INA rank rose to Colonel, but India has called her "Captain Lakshmi" ever since.[^1]',
        'She built and commanded the Rani of Jhansi Regiment — about a thousand volunteers, many of them plantation workers’ daughters, trained in arms in Singapore’s camps — and served as Minister for Women’s Organisation in the Provisional Government, the only woman in its cabinet. In Burma she ran medical and regimental duties through the retreat. Arrested in Burma in May 1945, she was held there until March 1946 and returned to an India still in uproar over the INA trials — among whose three Red Fort accused was Prem Sahgal, whom she married in 1947.[^2]',
      ],
      focus: { kind: 'fighter', id: 'lakshmi-sahgal' },
      also: [{ kind: 'fighter', id: 'rani-lakshmibai' }],
      sources: [
        {
          title: 'A Revolutionary Life: Memoirs of a Political Activist',
          author: 'Lakshmi Sahgal',
          publisher: 'Kali for Women',
          year: 1997,
          type: 'book',
        },
        {
          title: 'The Rani of Jhansi Regiment records',
          publisher: 'Netaji Research Bureau, Kolkata',
          type: 'archive',
        },
      ],
      bridge: 'In the spring of 1944 the INA crossed onto Indian soil.',
    },
    {
      id: 'imphal-1944',
      title: 'A flag at Moirang, a retreat through the monsoon',
      question: 'What did the INA’s one campaign achieve?',
      text: [
        'In the spring of 1944 INA units advanced with the Japanese Imphal–Kohima offensive into Manipur and the Naga Hills. On 14 April 1944 Colonel Shaukat Ali Malik of the Bahadur Group raised the Azad Hind flag at Moirang, where the INA Memorial Complex stands today. The offensive broke on British-Indian defences at Imphal and Kohima, and the retreat through the monsoon jungles killed more soldiers than battle had. The military defeat was total.[^1]',
        'On 18 August 1945, after Japan’s surrender, Bose is reported to have died of burns following an air crash at Taihoku (Taipei). Two Indian inquiries, the Shah Nawaz Committee (1956) and the Khosla Commission (1970–74), affirmed the crash; the Mukherjee Commission (1999–2005) found he had died but not in the crash, and the government rejected its report in 2006. Public disbelief fed legends for decades. The ashes kept at Tokyo’s Renkoji temple remain contested.[^2]',
      ],
      focus: { kind: 'event', id: 'imphal-campaign' },
      also: [
        { kind: 'fighter', id: 'subhas-chandra-bose' },
        { kind: 'fighter', id: 'lakshmi-sahgal' },
      ],
      sources: [
        {
          title: 'INA Memorial, Moirang',
          publisher: 'Government of Manipur / Ministry of Culture',
          type: 'government',
        },
        {
          title: 'His Majesty’s Opponent',
          author: 'Sugata Bose',
          publisher: 'Harvard University Press',
          year: 2011,
          type: 'book',
        },
      ],
      uncertainty: 'Two official inquiries (1956, 1970–74) concluded Bose died in the Taihoku air crash; the Mukherjee Commission (1999–2005) disagreed and was rejected by the government, and the question retains partisans on all sides. Most historians accept the crash.',
      contentNote: 'This stop describes deaths in war and on the retreat.',
      bridge: 'The soldiers who came back as prisoners did what the campaign could not.',
    },
    {
      id: 'red-fort-1945',
      title: 'Three officers at the Red Fort',
      question: 'How did a trial for treason turn into a national cause?',
      text: [
        'Of the thousands of captured INA soldiers, the Raj chose to try three together first, at the Red Fort from 5 November 1945: Shah Nawaz Khan, Prem Kumar Sahgal and Gurbaksh Singh Dhillon — a Muslim, a Hindu and a Sikh. The choice united the country as few things had. "Lal Qile se aayi awaaz — Sahgal, Dhillon, Shah Nawaz" ran the slogan, and the Congress raised a defence committee of India’s leading lawyers, the ailing Bhulabhai Desai at its head and Jawaharlal Nehru returning to the bar after decades. The three were convicted of waging war against the King-Emperor and sentenced to transportation for life — and Field Marshal Auchinleck, the Commander-in-Chief, reading the country’s mood and his own army’s, remitted the sentences on 3 January 1946, leaving only their dismissal from the army standing.[^1]',
        'Demonstrations, some joined by servicemen, had made the point that the armed forces’ loyalty could no longer be presumed. On 18 February 1946 naval ratings on HMIS Talwar in Bombay struck over foul food and racial insult; within days the strike had spread — by most accounts — to seventy-eight ships, twenty shore establishments and some 20,000 ratings, who flew the Congress tricolour, the League’s crescent and the red flag together. Bombay’s workers struck in sympathy, and more than 200 civilians died in police and army firing (228 by the official count) before Patel and Jinnah persuaded the ratings to stand down on 23 February. Attlee had announced the Cabinet Mission in the Commons on 19 February, the day after the Talwar walked out; the message that greeted it was that the instruments of the Raj were no longer reliable.[^3]',
      ],
      focus: { kind: 'event', id: 'ina-trials' },
      also: [
        { kind: 'event', id: 'rin-mutiny' },
        { kind: 'fighter', id: 'lakshmi-sahgal' },
      ],
      sources: [
        {
          title: 'INA trial records',
          publisher: 'National Archives of India',
          url: 'https://www.abhilekh-patal.in/',
          type: 'archive',
        },
        {
          title: 'The Springing Tiger: A Study of a Revolutionary',
          author: 'Hugh Toye',
          publisher: 'Cassell',
          year: 1959,
          type: 'book',
        },
        {
          title: '1946: Last War of Independence — Royal Indian Navy Mutiny',
          author: 'Pramod Kapoor',
          publisher: 'Roli Books',
          year: 2022,
          type: 'book',
        },
      ],
      contentNote: 'This stop describes deaths in police and army firing.',
      bridge: '',
    },
  ],
  reflection: 'The INA never got past India’s border, and its leader did not come home. Within months of the war’s end three of its officers were on trial and the Raj could no longer count on its own soldiers. Which stops in this trail are evidence that the INA failed, which that it succeeded — and can both be true at once?',
  activity: {
    kind: 'choice',
    prompt: 'According to this trail, what did the INA trials of November 1945 change?',
    options: [
      'The three officers were acquitted and returned to the Indian Army',
      'The INA was allowed to reoccupy Moirang',
      'The sentences were remitted, and the Raj could no longer presume its armed forces’ loyalty',
      'Bose returned from Japan to lead the defence',
    ],
    answerIndex: 2,
    explanation: 'The three were convicted of waging war against the King-Emperor and sentenced to transportation, not acquitted; the Commander-in-Chief then remitted the sentences, reading the country’s mood and his own army’s. Moirang had been lost in 1944, and Bose had been reported dead in August 1945. What the trials changed was the Raj’s confidence in its last pillar — the loyalty of the armed forces — which the naval strike of February 1946 confirmed.',
  },
  followOn: { label: 'Meet the people of Quit India and the INA', to: '/fighters?era=quit-india-and-ina' },
  editorial: {
    status: 'reviewed',
    reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
    reviewedOn: '2026-09-09',
    notes:
      'Drafted 2026-09-09 from the fighter and event records. Fact-checked the same day (~70 claims) against Sugata Bose, Gordon, Fay, the commission reports and reference works. Corrected: the Tripuri stop had merged the January 1939 election, the February Working Committee resignations and the March session into one event; “fought once / only campaign” ignored the 1945 Burma fighting; an unsourced quotation attributed to Lakshmi Sahgal (“happiest title”) removed and the account of how she met Bose set right (she sought him out); the “Radio Singapore” alternative for “Give me blood” had no source; the Cabinet Mission was announced on 19 February 1946, during the naval strike, not weeks after. Tightened: Jai Hind’s origin (Abid Hasan), commission dates, Auchinleck named and dated, King-Emperor, “more than 200” civilian deaths (228 official), RIN figures hedged, the first INA under Mohan Singh added.',
  },
  teaching: {
    alignment: 'Proposed for upper-primary and secondary history — resistance to colonial rule; evidence and interpretation. Not yet mapped to a specific board or state curriculum.',
    shortVersion: ['singapore-1943', 'imphal-1944', 'red-fort-1945'],
    prompts: [
      'Bose went to Berlin, travelled by German and Japanese submarine, and the INA advanced with a Japanese offensive. What does this trail tell you about that alliance, and what does it leave out? What else would you want to know before judging it?',
      'The trail’s question is whether India could be freed from outside. Using the Imphal and Red Fort stops, argue that the answer is no — and then argue that the attempt mattered anyway.',
      'Three officers — a Muslim, a Hindu and a Sikh — were tried together at the Red Fort. Why might that choice have united people across parties in 1945, and what does it suggest about how the Raj misjudged the moment?',
    ],
    facilitatorNotes: [
      'The Axis alliance is stated factually in stops 2, 3 and 5 and left for students to weigh. The records this trail is built from describe it without passing judgement; let students discuss it before offering a view either way. Stop 2 records that the first INA dissolved itself in 1942 over Japanese intentions — the best entry point for weighing the alliance.',
      'Bose’s death carries an uncertainty note. Use it to show how a record marks a contested claim: two inquiries, one dissent, and a scholarly consensus that is still not unanimous.',
      'Stop 6 pairs a trial with a naval strike and includes deaths in police firing. Read the content note aloud with younger students before that section.',
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-09' },
  },
};
