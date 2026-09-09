import type { Trail } from '@/types';

export const theYearTheCompanyFell: Trail = {
  id: 'the-year-the-company-fell',
  slug: 'the-year-the-company-fell',
  version: 1,
  title: 'The year the Company fell',
  question: 'How did a mutiny at Meerut become a war, and why did it end Company rule?',
  theme: 'The Revolt of 1857',
  minutes: 8,
  learningGoal: 'Put Barrackpore, Meerut, Kanpur and Gwalior in order, name two groups beyond the sepoys who joined the revolt and why, and state two things the Queen’s Proclamation of 1858 promised.',
  intro:
    'In March 1857 one sepoy fired on his officers at Barrackpore. Within twenty months the East India Company, which had governed much of India for a century, was gone. This trail follows those twenty months through six places — a parade ground, a road to Delhi, a river ghat, a besieged city, a fortress taken almost without a fight, and a proclamation read aloud at Allahabad. Each stop is built on a person or an event in this archive; where historians disagree, the stop says so.',
  accent: 'oxide',
  stops: [
    {
      id: 'barrackpore',
      title: 'One sepoy on a parade ground',
      question: 'What made a soldier fire on his own officers?',
      text: [
        'Barrackpore, near Calcutta, was a cantonment of the Company’s Bengal Army. Through early 1857 its lines seethed with a rumour: that the new Enfield cartridges, which a sepoy had to bite open, were greased with cow and pig fat — proof, many felt, that the Company meant to break their religion. On the afternoon of 29 March, Mangal Pandey of the 34th Native Infantry took up arms, called on his comrades to rise, and wounded the adjutant, Lieutenant Baugh, and Sergeant-Major Hewson, while the guard refused orders to seize him.[^1]',
        'He tried to take his own life before he was captured. A court martial followed, and he was hanged on 8 April 1857, ten days ahead of schedule; Ishwari Prasad, the jemadar who had refused to arrest him, was hanged on 21 April, and most of the regiment was disbanded on 6 May. To the country he became the revolt’s first martyr — and to British soldiers "Pandey" became the name for every rebel sepoy.[^2]',
      ],
      focus: { kind: 'fighter', id: 'mangal-pandey' },
      also: [{ kind: 'movement', id: 'great-revolt' }],
      sources: [
        { title: 'Mutiny records, Barrackpore court martial papers', publisher: 'National Archives of India', type: 'archive' },
        { title: 'The Indian Mutiny: 1857', author: 'Saul David', publisher: 'Viking', year: 2002, type: 'book' },
      ],
      uncertainty: 'Pandey himself told the court martial he had taken bhang and opium; historians differ on whether his act was planned conspiracy or spontaneous defiance.',
      contentNote: 'This stop describes an armed attack and executions.',
      bridge: 'Barrackpore had been one man. Six weeks later, at Meerut, it was a whole garrison.',
    },
    {
      id: 'meerut-delhi',
      title: 'A night ride to the Red Fort',
      question: 'Why did the mutineers need an emperor?',
      text: [
        'On 9 May 1857, at Meerut, eighty-five troopers who had refused the cartridges were stripped of their uniforms and shackled. The next evening their comrades broke open the jail, killed their officers and rode through the night to Delhi. On 11 May they entered the city and demanded the leadership of Bahadur Shah Zafar — the last Mughal emperor, a poet in his eighties whose rule extended, in effect, to the Red Fort and its ceremonies.[^1]',
        'Old, dependent and doubtful, he consented. His name turned a military mutiny into a war of restoration that Hindu and Muslim alike could join, and proclamations issued in it reached across northern India — though through the summer his authority was more symbolic than real amid feuding commanders. When the British stormed Delhi in September 1857 he surrendered at Humayun’s Tomb; Major Hodson shot his sons and a grandson without trial, and the emperor was tried in his own palace and exiled to Rangoon, where he died in 1862.[^2]',
      ],
      focus: { kind: 'fighter', id: 'bahadur-shah-zafar' },
      also: [{ kind: 'event', id: 'revolt-1857' }],
      sources: [
        { title: 'The Last Mughal: The Fall of a Dynasty, Delhi 1857', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2006, type: 'book' },
        { title: 'Trial of Bahadur Shah II (proceedings)', publisher: 'National Archives of India', type: 'archive' },
      ],
      contentNote: 'This stop describes killings and executions without trial.',
      bridge: 'Delhi gave the revolt a sovereign. Kanpur gave it a second centre — and its darkest episode.',
    },
    {
      id: 'kanpur',
      title: 'The Peshwa’s heir and the river ghat',
      question: 'What happened at Kanpur, and who was responsible?',
      text: [
        'Nana Saheb was the adopted son of the last Peshwa, Baji Rao II, who had lived in exile at Bithur near Kanpur. When Baji Rao died in 1851, Dalhousie refused to continue the pension to an adopted heir; an appeal carried to London by his agent Azimullah Khan came back empty-handed. When Kanpur’s sepoys rose on 5 June 1857 they turned to him, and he was proclaimed Peshwa.[^2]',
        'His forces besieged General Wheeler’s entrenchment for three weeks. The garrison surrendered on a promise of safe passage, and at Satichaura Ghat on 27 June the evacuation collapsed into a massacre. In July, before Havelock retook the city, the captive British women and children at Bibighar were killed — an atrocity that British forces repaid upon Kanpur and its countryside many times over. Nana Saheb denied ordering the Bibighar killings, retreated with the war into Awadh and Nepal’s terai, and was never captured.[^1]',
      ],
      focus: { kind: 'fighter', id: 'nana-saheb' },
      also: [{ kind: 'fighter', id: 'tatya-tope' }],
      sources: [
        { title: 'Kanpur narratives and depositions, 1857', publisher: 'National Archives of India', type: 'archive' },
        { title: 'The Indian Mutiny: 1857', author: 'Saul David', publisher: 'Viking', year: 2002, type: 'book' },
      ],
      uncertainty: 'Whether Nana Saheb ordered the killings at Satichaura Ghat and Bibighar is contested; he denied the Bibighar killings, and historians assign responsibility variously among leaders on the spot. The place and date of his death are also unknown — Nepal around 1859 is the most common account.',
      contentNote: 'This stop describes massacres and reprisals.',
      bridge: 'Kanpur was sepoys and a prince. In Awadh and Bihar the countryside itself rose.',
    },
    {
      id: 'awadh-bihar',
      title: 'A queen in Lucknow, a zamindar of eighty',
      question: 'Who joined the revolt beyond the army — and why?',
      text: [
        'Within weeks of Meerut the Bengal Army was in general mutiny, and whole populations joined it. Awadh had been annexed only in 1856, its king deposed for a "misgovernment" the Company had certified for the purpose. When Lucknow rose, Begum Hazrat Mahal, one of the exiled king’s wives, crowned her young son Birjis Qadr and presided over a court and command that included Raja Jai Lal Singh and, by tradition, among its fighters Uda Devi of the Pasi community, remembered as the sniper of Sikandar Bagh. Awadh’s rising was the revolt at its deepest — taluqdars, peasants and townsfolk together — and Lucknow stayed in rebel hands for nine months, until Campbell retook it in March 1858.[^3]',
        'In Bihar, Kunwar Singh, the zamindar of Jagdishpur, was around eighty, his estate encumbered by debt and litigation, when the Danapur regiments mutinied in July 1857. He took their command, seized Arrah, and carried the war through Mirzapur and Banda to Azamgarh, which he took in March 1858. Wounded crossing the Ganga around 21 April 1858, he defeated a British force at his home, Jagdishpur, on 23 April and died there three days later. The rising was largely put down by mid-1858 with mass executions and the sack of Delhi and Lucknow.[^2]',
      ],
      focus: { kind: 'event', id: 'revolt-1857' },
      also: [
        { kind: 'fighter', id: 'begum-hazrat-mahal' },
        { kind: 'fighter', id: 'kunwar-singh' },
      ],
      sources: [
        { title: 'The Last Mughal: The Fall of a Dynasty, Delhi 1857', author: 'William Dalrymple', publisher: 'Bloomsbury', year: 2006, type: 'book' },
        { title: 'Mutiny Papers, 1857', publisher: 'National Archives of India', url: 'https://www.abhilekh-patal.in/', type: 'archive' },
        { title: 'The Great Uprising in India, 1857–58: Untold Stories', author: 'Rosie Llewellyn-Jones', publisher: 'Boydell Press', year: 2007, type: 'book' },
      ],
      uncertainty: 'The account of Kunwar Singh cutting off his own wounded arm and offering it to the Ganga comes from regional tradition; contemporary British records confirm the wound but not the act.',
      contentNote: 'This stop describes war and its suppression, including mass executions.',
      bridge: 'With Delhi and Lucknow lost, the war moved into central India — and became a chase.',
    },
    {
      id: 'jhansi-gwalior',
      title: 'A fortress taken, a general hunted',
      question: 'How long can a war go on after its cause is lost?',
      text: [
        'Tatya Tope had grown up at Bithur in the exiled Peshwa’s household and served Nana Saheb; at Kanpur he became the rising’s organising military mind. After Havelock retook the city he rebuilt an army around the Gwalior Contingent and defeated General Windham outside Kanpur in November 1857, before Campbell’s counterstroke. In early 1858 he marched to relieve Jhansi, where Hugh Rose was besieging Rani Lakshmibai, and was checked on the Betwa. Jhansi fell; the Rani rode out through the lines by night; and after Kalpi fell too, Tatya, the Rani and Rao Sahib took the fortress of Gwalior on 1 June 1858 almost without a fight, after Scindia’s own troops went over to them — the revolt’s last great victory.[^2]',
        'It did not hold. On 17 June 1858 (some accounts say the 18th) Lakshmibai was killed in the fighting at Kotah-ki-Serai, dressed as a cavalry trooper. Tatya waged ten more months of war as a fugitive commander across Malwa, Bundelkhand and Rajputana, crossing the Narmada with several British columns behind him. Betrayed in April 1859 by Man Singh of Narwar while encamped in the jungles, he was tried at Shivpuri and hanged on 18 April 1859, declaring — by the trial record — that he answered only to his master, the Peshwa.[^1]',
      ],
      focus: { kind: 'fighter', id: 'tatya-tope' },
      also: [
        { kind: 'fighter', id: 'rani-lakshmibai' },
        { kind: 'fighter', id: 'jhalkari-bai' },
        { kind: 'event', id: 'siege-of-jhansi' },
      ],
      sources: [
        { title: 'Tatya Tope trial records', publisher: 'National Archives of India', type: 'archive' },
        { title: 'The Indian Mutiny: 1857', author: 'Saul David', publisher: 'Viking', year: 2002, type: 'book' },
      ],
      uncertainty: 'A persistent tradition, argued by some descendants, holds that another man was hanged at Shivpuri while Tatya escaped; most historians accept the identification made at the trial. The story that Jhalkari Bai of Jhansi’s women’s guard impersonated the Rani to cover her escape rests largely on oral tradition.',
      contentNote: 'This stop describes deaths in battle and an execution.',
      bridge: 'By the time Tatya was hanged, the Company he had fought no longer ruled India.',
    },
    {
      id: 'allahabad-1858',
      title: 'A proclamation that names no grievance',
      question: 'What ended, and what was promised, on 1 November 1858?',
      text: [
        'On 1 November 1858 a proclamation from Queen Victoria was read out at Allahabad, and in towns and cantonments across India. It transferred the government of India from the East India Company to the Crown; promised to respect treaties with Indian rulers and desired "no extension of Our present territorial Possessions"; disclaimed any wish to impose Christianity; offered amnesty to most rebels; and declared that, "so far as may be", Indians of "whatever Race or Creed" would be "freely and impartially admitted to Offices" for which they were qualified. The rising that had made all this necessary appears only as an "open Rebellion" into which "ambitious Men" had led the people by "false reports": no cause, place or leader is named, the word "mutiny" never occurs, and the transfer of power itself is explained only by "divers weighty reasons".[^2]',
        'Begum Hazrat Mahal answered it on 31 December 1858 with a counter-proclamation and fought on from exile. The Raj that followed was more cautious about religion and custom than the Company had been, but more racially exclusive; for half a century moderate nationalists would quote the Proclamation’s promises back at a government that did not keep them. Even the name of 1857 stayed contested: British records filed it as the Mutiny, and Indian memory came to call it the First War of Independence.[^1]',
      ],
      focus: { kind: 'event', id: 'queens-proclamation' },
      also: [{ kind: 'fighter', id: 'begum-hazrat-mahal' }],
      sources: [
        { title: 'Proclamation by the Queen in Council, 1 November 1858', publisher: 'British Library, India Office Records', type: 'archive' },
        { title: 'Proclamation by the Queen in Council, 1 November 1858 (1908 printed reprint)', url: 'https://archive.org/details/queens-proclamation', publisher: 'Internet Archive; original in the Parliamentary Papers / India Office Records', type: 'archive', evidence: 'contemporary' },
      ],
      bridge: '',
    },
  ],
  reflection: 'The sepoys rose over their religion and their service; Bahadur Shah, Nana Saheb and Lakshmibai over thrones and pensions the Company had taken; the taluqdars and peasants of Awadh over their land. Whose war was 1857? And why did these causes, fighting in the same year, never quite become one movement?',
  activity: {
    kind: 'choice',
    prompt: 'Which of these did the Queen’s Proclamation of 1 November 1858 actually do?',
    options: [
      'Granted India independence from Britain',
      'Restored Bahadur Shah Zafar to the throne in Delhi',
      'Transferred the government of India from the Company to the Crown and offered amnesty to most rebels',
      'Explained the change as a response to the revolt of 1857',
    ],
    answerIndex: 2,
    explanation: 'The Proclamation ended Company rule and brought India under the Crown, with promises about treaties, religion, amnesty and office. Bahadur Shah was tried and exiled to Rangoon, independence was still eighty-nine years away, and the text mentions the "Rebellion" only to pardon it, never admitting a grievance or linking it to the change of government — which is one reason nationalists could later quote its promises back at the government.',
  },
  followOn: { label: 'Read the Queen’s Proclamation', to: '/documents/queens-proclamation-1858' },
  editorial: {
    status: 'reviewed',
    reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
    reviewedOn: '2026-09-09',
    notes:
      'Drafted 2026-09-09 from the fighter, event and document records. Fact-checked the same day (~80 claims) against the 1908 reprint of the Proclamation (archive.org), Dalrymple, Llewellyn-Jones and standard reference works. Corrected: the draft claimed the Proclamation “never names” the revolt — it speaks of “open Rebellion” and “the late unhappy Disturbances” but names no cause, place or leader and never uses “mutiny”; “eighteen months” → twenty; Lucknow was not the longest-held centre (Jhansi, Kalpi and Gwalior fell later). Tightened: Hewson’s rank, the 34th’s partial disbandment (6 May), Gwalior “almost without a fight”, Tatya’s trial statement (“his country” unsupported), the office clause’s hedges, Uda Devi as tradition, Lakshmibai 17/18 June, “largely put down by mid-1858”.',
  },
  teaching: {
    alignment: 'Proposed for upper-primary and secondary history — resistance to colonial rule; evidence and interpretation. Not yet mapped to a specific board or state curriculum.',
    shortVersion: ['meerut-delhi', 'awadh-bihar', 'allahabad-1858'],
    prompts: [
      'The first stop is one soldier; the fourth is whole provinces. Pick two stops and describe what had to change for a mutiny to become a war.',
      'British records called 1857 the Mutiny; Indian memory calls it the First War of Independence. What does each name include, and what does each leave out?',
      'The Proclamation of 1858 blames the revolt on "ambitious Men" and "false reports" and never says why the Crown is taking over. Why might a government make big promises without admitting what forced it to make them?',
    ],
    facilitatorNotes: [
      'Five of the six stops carry content notes for killings, massacres or executions, on both sides. Read the notes aloud before those sections with younger students, and treat the Kanpur stop — where responsibility is disputed — as a lesson in weighing evidence rather than assigning blame.',
      'Use the reflection prompt to draw out that sepoys, princes and peasants had different grievances; the records show them fighting at the same time rather than as one coordinated movement.',
      'The uncertainty notes (Mangal Pandey’s motive, Kanpur, Nana Saheb’s death, Tatya Tope’s identity, Jhalkari Bai) are part of the content, not a disclaimer — they show how historians work when sources disagree.',
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-09' },
  },
};
