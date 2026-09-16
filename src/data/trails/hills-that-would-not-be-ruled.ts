import type { Trail } from '@/types';

export const hillsThatWouldNotBeRuled: Trail = {
  id: 'hills-that-would-not-be-ruled',
  slug: 'hills-that-would-not-be-ruled',
  version: 1,
  title: 'Hills that would not be ruled',
  question: 'Why is the Northeast so often left out of the freedom story, and what did it actually do?',
  theme: 'Northeast India',
  minutes: 9,
  learningGoal: 'Name three episodes of resistance to British rule in the Northeast between 1829 and 1944, place them in order, and explain one reason the region’s history is less often told.',
  intro:
    'Most accounts of the freedom struggle run from Bengal to Punjab and stop. East of Bengal lay the hills and the Brahmaputra valley: Khasi, Ahom, Meitei, Naga and Assamese country, brought under British rule late, piece by piece, and governed differently to the end. It fought early and it fought late. A Khasi chief held out for four years in 1829; a Manipuri prince was hanged on a polo ground in 1891; a sixteen-year-old Naga girl spent fourteen years in prison; a seventeen-year-old was shot carrying the flag in 1942; and in 1944 the INA raised its colours on Indian soil for the first time, at Moirang. Six stops, and a question at the end about why you may not have heard them.',
  accent: 'forest',
  stops: [
    {
      id: 'nongkhlaw-1829',
      title: 'A road, a treaty and a chief who said no',
      question: 'What did the British want in the Khasi Hills, and what did they get?',
      text: [
        'The British wanted a road through the Khasi Hills to join Sylhet to Assam, and got the right to build it by treaty with the young Syiem of Nongkhlaw, Tirot Sing. When the road arrived with garrisons and claims of authority, he ordered the British out. In April 1829 his men attacked the post at Nongkhlaw, and the hills rose.[^1]',
        'With muskets against artillery, the Khasis fought a monsoon-country guerrilla war from caves and ridgelines for four years. Tirot Sing was betrayed and captured in 1833 and died a prisoner at Dacca in 1835. Meghalaya keeps his day each July; the rest of India mostly does not know it.[^1][^2]',
      ],
      focus: { kind: 'event', id: 'khasi-uprising' },
      also: [{ kind: 'fighter', id: 'tirot-sing' }],
      sources: [
        { title: 'U Tirot Sing commemorative records', publisher: 'Government of Meghalaya, Arts & Culture Department', type: 'government', evidence: 'reference' },
        { title: 'David Scott in North-East India', author: 'Nirode K. Barooah', publisher: 'Munshiram Manoharlal', year: 1970, type: 'book', evidence: 'scholarship' },
      ],
      bridge: 'In the valley below, the Company’s new crop was changing who owned the land.',
    },
    {
      id: 'jorhat-1858',
      title: 'The tea planter who wanted his king back',
      question: 'How did 1857 reach Assam?',
      text: [
        'Maniram Dewan had risen high in Company service and became the first Assamese to plant tea on his own account, in a valley the British were turning into an estate economy. He came to believe the Ahom kingdom, annexed in 1826, should be restored, and petitioned for it. When the revolt broke out in the north in 1857 he was in Calcutta, and letters urging a rising in Assam were traced to him.[^1]',
        'He was tried and hanged at Jorhat on 26 February 1858. The rising he hoped for never came; the tea gardens did, and with them the indentured labour system that shaped Assam for a century. He is remembered in the valley as its first martyr of the freedom struggle.[^1][^2]',
      ],
      focus: { kind: 'fighter', id: 'maniram-dewan' },
      sources: [
        { title: 'Maniram Dewan trial records, Jorhat, 1858', publisher: 'Assam State Archives', type: 'archive', evidence: 'contemporary' },
        { title: 'Planter-Raj to Swaraj: Freedom Struggle and Electoral Politics in Assam 1826–1947', author: 'Amalendu Guha', publisher: 'Indian Council of Historical Research', year: 1977, type: 'book', evidence: 'scholarship' },
      ],
      contentNote: 'This stop describes an execution.',
      bridge: 'Manipur was still a kingdom of its own. In 1891 the British decided who should sit on its throne.',
    },
    {
      id: 'imphal-1891',
      title: 'The prince on the polo ground',
      question: 'Was the Anglo-Manipur War a rebellion, or a war between states?',
      text: [
        'Manipur in 1890 was an independent kingdom in treaty relations with the British. When a palace coup changed the succession, the British sent a force to Imphal to remove the Senapati, Bir Tikendrajit, whom they blamed for it. The attempt went wrong: their political officers were killed, and a full expedition followed. The kingdom fell in April 1891.[^1]',
        'Tikendrajit was tried by the victors and publicly hanged on the polo ground at Imphal on 13 August 1891 with the general Thangal. Manipur was placed under a child king and a British political agent. The state marks the day as Patriots’ Day, and the question the trial raised, whether a sovereign’s minister can be a rebel against a power he never owed allegiance to, has never quite gone away.[^1][^2]',
      ],
      focus: { kind: 'fighter', id: 'bir-tikendrajit' },
      sources: [
        { title: 'Anglo-Manipur War records, 1891', publisher: 'Manipur State Archives', type: 'archive', evidence: 'contemporary' },
        { title: 'Patriots’ Day commemorations', publisher: 'Government of Manipur', type: 'government', evidence: 'reference' },
      ],
      uncertainty: 'Whether the 1891 conflict should be called a rebellion, a war between states or a British intervention in a succession dispute is a matter of interpretation; Manipur’s own histories and the colonial record frame it differently.',
      contentNote: 'This stop describes killings and an execution.',
      bridge: 'Forty years later resistance in the hills took a form the British did not know how to name.',
    },
    {
      id: 'heraka-1932',
      title: 'A girl of sixteen and fourteen years in prison',
      question: 'Why did the British fear a religious movement?',
      text: [
        'In the Zeliangrong Naga hills between Manipur, Assam and the Naga Hills, the young leader Jadonang built a movement, the Heraka, that mixed religious reform with a refusal to pay taxes or serve the British. He was hanged in 1931. His cousin Gaidinliu, then sixteen, took his place and led an armed resistance through the hills until her capture in October 1932.[^1]',
        'She was sentenced to life imprisonment and moved from jail to jail for fourteen years. Nehru met her in Shillong prison in 1937, called her Rani, and campaigned for her release; it came only with independence. Her movement remains contested within the region itself, admired by some Naga communities and distrusted by others, which is one reason her story is told so unevenly.[^1][^2]',
      ],
      focus: { kind: 'fighter', id: 'rani-gaidinliu' },
      sources: [
        { title: 'Rani Gaidinliu commemorative records', publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav', url: 'https://amritkaal.nic.in/', type: 'government', evidence: 'reference' },
        { title: 'Studies of the Heraka movement and Zeliangrong Nagas', publisher: 'Academic research on Northeast India', type: 'journal', evidence: 'scholarship' },
      ],
      uncertainty: 'Accounts of the Heraka movement come from a thin and partly oral record, and its meaning is disputed among Naga communities today. This stop describes the movement as its followers and the colonial record saw it, without settling that dispute.',
      bridge: 'In 1942 the valley answered Gandhi’s call, and paid for it.',
    },
    {
      id: 'gohpur-1942',
      title: 'A flag at Gohpur, a rope at Jorhat',
      question: 'What did Quit India look like in Assam?',
      text: [
        'When the Quit India resolution was passed on 8 August 1942 and the leaders were jailed, Assam rose with the rest of the country. On 20 September a procession of volunteers set out to raise the tricolour over the police station at Gohpur. At its head was Kanaklata Barua, seventeen. The police fired; she was shot holding the flag high, and the flag was carried on by the next in line.[^1]',
        'The reprisals reached beyond the streets. Kushal Konwar, a tea-garden worker and Congress volunteer of Golaghat who preached non-violence, was charged with a train derailment near Sarupathar that he had opposed, and hanged in 1943. He was the only person executed in Assam in the movement’s judicial reprisals, and one of the very few anywhere in India.[^1][^2]',
      ],
      focus: { kind: 'event', id: 'quit-india-launch' },
      also: [
        { kind: 'fighter', id: 'kanaklata-barua' },
        { kind: 'fighter', id: 'kushal-konwar' },
      ],
      sources: [
        { title: 'Quit India in Assam (district records)', publisher: 'Assam State Archives', type: 'archive', evidence: 'contemporary' },
        { title: 'Planter-Raj to Swaraj: Freedom Struggle and Electoral Politics in Assam 1826–1947', author: 'Amalendu Guha', publisher: 'Indian Council of Historical Research', year: 1977, type: 'book', evidence: 'scholarship' },
      ],
      contentNote: 'This stop describes a shooting and an execution.',
      bridge: 'Two years later a different army marched into these same hills from the east.',
    },
    {
      id: 'moirang-1944',
      title: 'The flag at Moirang, and why you may not have heard',
      question: 'What did the Northeast do in the war, and why is so little of this in the textbooks?',
      text: [
        'In the spring of 1944 units of the Indian National Army advanced with the Japanese offensive into Manipur and the Naga Hills. On 14 April the Azad Hind flag was raised at Moirang, the first time the INA’s colours flew on Indian soil. The offensive broke on the defences of Imphal and Kohima, and the retreat through the monsoon killed more soldiers than the fighting had. The women of the Rani of Jhansi Regiment were among those who marched back.[^1]',
        'Why does so little of this appear in the standard story? Partly because the hills were governed apart: under the Government of India Act of 1935 most of them were "excluded" or "partially excluded" areas outside the provincial politics where the Congress grew. Partly because these histories were written in Khasi, Assamese, Meitei and Naga languages and reached the rest of India late or not at all. And partly because the region’s own relationship with the Indian state after 1947 has been difficult, which makes its earlier resistance to the British awkward for everyone to claim. None of that makes the resistance less real.[^2]',
      ],
      focus: { kind: 'event', id: 'imphal-campaign' },
      also: [
        { kind: 'fighter', id: 'lakshmi-sahgal' },
        { kind: 'fighter', id: 'janaki-thevar' },
      ],
      sources: [
        { title: 'His Majesty’s Opponent: Subhas Chandra Bose and India’s Struggle against Empire', author: 'Sugata Bose', publisher: 'Harvard University Press', year: 2011, type: 'book', evidence: 'scholarship' },
        { title: 'India Against Itself: Assam and the Politics of Nationality', author: 'Sanjib Baruah', publisher: 'University of Pennsylvania Press', year: 1999, type: 'book', evidence: 'scholarship' },
      ],
      uncertainty: 'The second paragraph is interpretation: historians offer several reasons for the Northeast’s absence from the standard narrative, and this stop gives three of them without ranking them.',
      bridge: '',
    },
  ],
  reflection: 'Every stop on this trail happened in a place most Indians could not point to on a map. Choose one and ask what would have to change, in schoolbooks, in museums, on this site, for it to be as well known as Jhansi or Dandi.',
  activity: {
    kind: 'order',
    prompt: 'Put these six moments from the Northeast in the order they happened.',
    items: [
      { label: 'Tirot Sing’s Khasis attack the garrison at Nongkhlaw', year: 1829, ref: { kind: 'event', id: 'khasi-uprising' } },
      { label: 'Maniram Dewan is hanged at Jorhat', year: 1858, ref: { kind: 'fighter', id: 'maniram-dewan' } },
      { label: 'Bir Tikendrajit is hanged on the Imphal polo ground', year: 1891, ref: { kind: 'fighter', id: 'bir-tikendrajit' } },
      { label: 'Gaidinliu, sixteen, is captured in the Naga hills', year: 1932, ref: { kind: 'fighter', id: 'rani-gaidinliu' } },
      { label: 'Kanaklata Barua is shot carrying the flag at Gohpur', year: 1942, ref: { kind: 'fighter', id: 'kanaklata-barua' } },
      { label: 'The Azad Hind flag is raised at Moirang', year: 1944, ref: { kind: 'event', id: 'imphal-campaign' } },
    ],
    explanation: 'The Northeast’s resistance runs the whole length of the story, from the Company period to the last year of the war. The gaps between the stops are long because the region was brought under British rule piece by piece, and each piece fought on its own.',
  },
  followOn: { label: 'See the Northeast on the map', to: '/map?state=assam' },
  editorial: {
    status: 'reviewed',
    reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
    reviewedOn: '2026-09-16',
    notes:
      'Drafted 2026-09-16 on existing records: the Khasi uprising, Quit India and Imphal events and the Tirot Sing, Maniram Dewan, Bir Tikendrajit, Rani Gaidinliu, Kanaklata Barua and Kushal Konwar biographies. Dates re-checked against those records and their sources: Nongkhlaw April 1829; Tirot Sing d. 1835; Jorhat 26 Feb 1858; Imphal 13 Aug 1891; Jadonang hanged 1931, Gaidinliu captured Oct 1932, Nehru’s visit 1937; Gohpur 20 Sept 1942; Kushal Konwar hanged 1943; Moirang 14 Apr 1944. The 1935 Act’s excluded and partially excluded areas are stated as fact; the reasons for the region’s absence from the standard narrative are labelled interpretation, as is the framing of 1891.',
  },
  teaching: {
    alignment: 'Proposed for secondary history: regional histories of the freedom struggle; whose history gets told and why. Not yet mapped to a specific board or state curriculum.',
    shortVersion: ['nongkhlaw-1829', 'gohpur-1942', 'moirang-1944'],
    prompts: [
      'Tirot Sing signed a treaty and then went to war over what it turned out to mean. Find another example on this site of a treaty or agreement that meant different things to the two sides.',
      'Bir Tikendrajit was a minister of an independent kingdom. Can he be called a "freedom fighter" in the same sense as Bhagat Singh? Argue both sides before you decide.',
      'The last stop gives three reasons the Northeast is missing from the usual story. Which reason applies to your own state or region, and what would fix it?',
    ],
    facilitatorNotes: [
      'Have a map open. Most students cannot place Nongkhlaw, Jorhat, Imphal, Moirang or Gohpur, and that difficulty is part of the lesson, not an obstacle to it.',
      'Rani Gaidinliu’s movement is contested within the Northeast today. Present the uncertainty note plainly rather than smoothing it over; students from the region may know more than the trail does.',
      'Three stops describe executions and one a shooting. The short version keeps the least violent stops for younger groups.',
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-16' },
  },
};
