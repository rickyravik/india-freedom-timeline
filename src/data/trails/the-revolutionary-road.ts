import type { Trail } from '@/types';

export const theRevolutionaryRoad: Trail = {
  id: 'the-revolutionary-road',
  slug: 'the-revolutionary-road',
  version: 1,
  title: 'The revolutionary road',
  question: 'Did the bomb and the pistol help India towards freedom, or set it back?',
  theme: 'Revolution',
  minutes: 10,
  learningGoal: 'Trace the armed revolutionary tradition from 1908 to 1940 through five episodes, and give one argument for and one against the claim that it advanced the freedom struggle.',
  intro:
    'Alongside petitions, boycotts and satyagraha ran another tradition: small secret societies of young men and women who believed the Raj would only leave at gunpoint. They were never many. Their actions were often clumsy and their casualties were sometimes the wrong people. Yet their trials filled the newspapers, their executions filled the streets, and Bhagat Singh at twenty-three was, for a season, as famous as Gandhi. Six stops follow the road from a bomb thrown at the wrong carriage in 1908 to a pistol fired in a London hall in 1940, and end with the question historians still argue about.',
  accent: 'oxide',
  stops: [
    {
      id: 'muzaffarpur-1908',
      title: 'Two teenagers and the wrong carriage',
      question: 'How did Bengal’s revolutionary underground first show itself?',
      text: [
        'On the evening of 30 April 1908, Khudiram Bose, eighteen, and Prafulla Chaki, nineteen, threw a bomb at a carriage leaving the European club at Muzaffarpur. They believed it carried Douglas Kingsford, a magistrate hated for his sentences on nationalist editors. It carried two Englishwomen, Mrs Kennedy and her daughter, who died.[^1]',
        'Chaki shot himself rather than be taken. Khudiram was tried and hanged on 11 August 1908, walking to the gallows with a composure that Bengal turned into folk song. Police raids after the attack uncovered the Maniktala bomb factory and the Alipore case that followed put Aurobindo Ghose and the Jugantar network on public view.[^1][^2]',
      ],
      focus: { kind: 'event', id: 'muzaffarpur-action' },
      also: [
        { kind: 'fighter', id: 'khudiram-bose' },
        { kind: 'fighter', id: 'prafulla-chaki' },
      ],
      sources: [
        { title: 'The Bomb in Bengal', author: 'Peter Heehs', publisher: 'Oxford University Press', year: 1993, type: 'book', evidence: 'scholarship' },
        { title: 'Muzaffarpur case records', publisher: 'Bihar State Archives', type: 'archive', evidence: 'contemporary' },
      ],
      contentNote: 'This stop describes a bombing that killed two civilians, and an execution.',
      bridge: 'Bengal’s societies were local. The next attempt was planned on another continent.',
    },
    {
      id: 'ghadar-1915',
      title: 'A newspaper declares war',
      question: 'What happens when a rebellion is organised by post from California?',
      text: [
        'In 1913 Punjabi farm labourers, mill hands and students on the American Pacific coast founded the Ghadar Party, with Sohan Singh Bhakna as president. Their weekly paper carried the masthead "enemy of British rule" and reached every port where Punjabis had settled. When war came in 1914 they called their members home to raise the army in revolt; some eight thousand sailed. The Komagata Maru, turned away from Canada that summer, arrived at Calcutta the same autumn and ended in gunfire at Budge Budge.[^1]',
        'The rising planned for February 1915 was betrayed by informers before it began. The Lahore conspiracy trials sent forty-six men to the gallows, Kartar Singh Sarabha among them at nineteen, and hundreds more to prison. In Bengal that September, Bagha Jatin died in a gun battle on the Odisha coast waiting for German arms that never came. Bhagat Singh, a boy in Punjab, kept a photograph of Kartar Singh for the rest of his life.[^1][^2]',
      ],
      focus: { kind: 'event', id: 'founding-of-ghadar' },
      also: [
        { kind: 'fighter', id: 'kartar-singh-sarabha' },
        { kind: 'fighter', id: 'sohan-singh-bhakna' },
        { kind: 'event', id: 'komagata-maru' },
        { kind: 'fighter', id: 'bagha-jatin' },
      ],
      sources: [
        { title: 'Ghadar Movement: Ideology, Organisation and Strategy', author: 'Harish K. Puri', publisher: 'Guru Nanak Dev University Press', year: 1983, type: 'book', evidence: 'scholarship' },
        { title: 'Lahore Conspiracy Case judgments, 1915', publisher: 'Punjab State Archives', type: 'archive', evidence: 'contemporary' },
      ],
      uncertainty: 'The number of Ghadar returnees is an estimate; figures in the sources range from a few thousand to eight thousand.',
      contentNote: 'This stop describes executions.',
      bridge: 'After the war a new generation decided that the problem had been money. They went and took some.',
    },
    {
      id: 'kakori-1925',
      title: 'A train, a cash chest and four hangings',
      question: 'Why did the Kakori action move the country more than the treasury it took?',
      text: [
        'On 9 August 1925 ten men of the Hindustan Republican Association, led by the poet Ram Prasad Bismil, stopped the 8-Down train near Kakori and carried off the guard’s chest of government money. The rule was to strike property, not Indians; one passenger died by an accidental shot. The haul was small. The crackdown was not: it swept up almost the whole organisation.[^1]',
        'After an eighteen-month trial, Bismil, Ashfaqulla Khan, Thakur Roshan Singh and Rajendra Nath Lahiri were hanged in December 1927; Sachindra Nath Sanyal went to the Cellular Jail a second time. Bismil and Ashfaqulla, a Hindu and a Muslim who were the closest of friends, died with prayers and verses, and Bismil’s "Sarfaroshi ki Tamanna" became the anthem of everyone who came after. Chandrashekhar Azad, who escaped, rebuilt the group as the HSRA.[^1][^2]',
      ],
      focus: { kind: 'event', id: 'kakori-train-action' },
      also: [
        { kind: 'fighter', id: 'ram-prasad-bismil' },
        { kind: 'fighter', id: 'ashfaqulla-khan' },
        { kind: 'fighter', id: 'rajendra-lahiri' },
        { kind: 'fighter', id: 'sachindra-nath-sanyal' },
      ],
      sources: [
        { title: 'Kakori conspiracy case records', publisher: 'Uttar Pradesh State Archives', type: 'archive', evidence: 'contemporary' },
        { title: 'Waiting for Swaraj: Inner Lives of Indian Revolutionaries', author: 'Aparna Vaidik', publisher: 'Cambridge University Press', year: 2021, type: 'book', evidence: 'scholarship' },
      ],
      contentNote: 'This stop describes executions.',
      bridge: 'The HSRA’s next action was designed not to kill anyone at all.',
    },
    {
      id: 'assembly-1929',
      title: 'Bombs that were meant to miss',
      question: 'Why throw a bomb and then wait to be arrested?',
      text: [
        'On 8 April 1929 Bhagat Singh and Batukeshwar Dutt threw two deliberately weak bombs into an empty part of the Central Legislative Assembly, showered leaflets and shouted "Inquilab Zindabad" until the police came. "It takes a loud voice to make the deaf hear," the leaflet said. The point was the courtroom. In jail Bhagat Singh and his comrades fasted for the rights of political prisoners; Jatindra Nath Das died on the sixty-third day, and the country mourned him.[^1]',
        'When Gandhi condemned "the cult of the bomb", Bhagwati Charan Vohra and Yashpal answered with "The Philosophy of the Bomb". Convicted for the earlier killing of the police officer Saunders, Bhagat Singh, Rajguru and Sukhdev were hanged on 23 March 1931, a day early, and cremated in secret by the Sutlej. Bhagat Singh was twenty-three. He had spent his last months reading, and his essay "Why I Am an Atheist" travelled far beyond his party.[^2]',
      ],
      focus: { kind: 'event', id: 'assembly-bomb-case' },
      also: [
        { kind: 'fighter', id: 'bhagat-singh' },
        { kind: 'fighter', id: 'batukeshwar-dutt' },
        { kind: 'fighter', id: 'bhagwati-charan-vohra' },
        { kind: 'event', id: 'execution-bhagat-singh' },
      ],
      sources: [
        { title: 'The Jail Notebook and Other Writings', author: 'Bhagat Singh (ed. Chaman Lal)', publisher: 'LeftWord', year: 2007, type: 'book', evidence: 'contemporary' },
        { title: 'The Trial of Bhagat Singh: Politics of Justice', author: 'A. G. Noorani', publisher: 'Oxford University Press', year: 1996, type: 'book', evidence: 'scholarship' },
      ],
      contentNote: 'This stop describes a hunger strike to the death and executions.',
      bridge: 'A week after the Assembly, on the far side of the country, sixty schoolboys took a town.',
    },
    {
      id: 'chittagong-1930',
      title: 'A town held for a night, and the women who came after',
      question: 'What did Chittagong prove, and to whom?',
      text: [
        'On the night of 18 April 1930 Surya Sen, a schoolteacher his students called Masterda, led some sixty members of his Indian Republican Army in seizing Chittagong’s two armouries, cutting the telegraph lines and proclaiming a provisional government. The armouries held rifles but no ammunition. Days later on Jalalabad hill the group, most of them teenagers, fought a battle with troops and lost a dozen dead.[^1]',
        'The survivors fought on for three years. Pritilata Waddedar led the attack on the Pahartali European Club in 1932 and took cyanide rather than be captured. In Calcutta, Bina Das fired at the Governor during her own convocation; at Comilla, two schoolgirls, Shanti Ghosh and Suniti Choudhury, shot the district magistrate dead. Surya Sen was betrayed, tortured and hanged in January 1934. Bengal had never seen women in that role before, and the British never quite recovered from the fact.[^1][^2]',
      ],
      focus: { kind: 'event', id: 'chittagong-armoury-raid' },
      also: [
        { kind: 'fighter', id: 'surya-sen' },
        { kind: 'fighter', id: 'pritilata-waddedar' },
        { kind: 'fighter', id: 'bina-das' },
        { kind: 'fighter', id: 'shanti-ghosh' },
      ],
      sources: [
        { title: 'Do and Die: The Chittagong Uprising 1930–34', author: 'Manini Chatterjee', publisher: 'Penguin', year: 1999, type: 'book', evidence: 'scholarship' },
        { title: 'Women in Modern India (The New Cambridge History of India)', author: 'Geraldine Forbes', publisher: 'Cambridge University Press', year: 1996, type: 'book', evidence: 'scholarship' },
      ],
      contentNote: 'This stop describes killings, a suicide and an execution.',
      bridge: 'The last shot in this story was fired in London, twenty-one years after the wound that caused it.',
    },
    {
      id: 'did-it-work',
      title: 'Did it work?',
      question: 'What did the revolutionaries change, and what did they cost?',
      text: [
        'On 13 March 1940 Udham Singh shot dead Sir Michael O’Dwyer, who had governed Punjab at the time of Jallianwala Bagh, at a meeting in London’s Caxton Hall, and was hanged that July. It was the tradition’s last major act. Set beside the mass movements of 1920, 1930 and 1942, the revolutionaries were a handful: a few hundred active members, a few dozen actions, most of them failures on their own terms.[^1]',
        'Historians weigh them differently. One view, associated with Bipan Chandra, is that secret societies could not build the mass base that actually forced Britain out, and that their violence gave the Raj its excuses. Another points to what they did to public feeling: the Kakori and Lahore executions poured people into Civil Disobedience, and in 1931 the Congress’s own historian judged Bhagat Singh’s popularity equal to Gandhi’s. A third notes that the revolutionaries, not the Congress, first made socialism and an all-India republic part of the vocabulary. Their own writings, above all Bhagat Singh’s, insisted the bomb was a means of being heard, not a plan for victory.[^2][^3]',
      ],
      focus: { kind: 'fighter', id: 'udham-singh' },
      also: [{ kind: 'event', id: 'jallianwala-bagh' }],
      sources: [
        { title: 'The Patient Assassin', author: 'Anita Anand', publisher: 'Simon & Schuster', year: 2019, type: 'book', evidence: 'scholarship' },
        { title: "India's Struggle for Independence 1857–1947", author: 'Bipan Chandra et al.', publisher: 'Penguin', year: 1989, type: 'book', evidence: 'scholarship' },
        { title: 'A Revolutionary History of Interwar India: Violence, Image, Voice and Text', author: 'Kama Maclean', publisher: 'Oxford University Press', year: 2015, type: 'book', evidence: 'scholarship' },
      ],
      uncertainty: 'This stop is interpretation. Whether Udham Singh was himself present in Jallianwala Bagh on 13 April 1919 is disputed, and the weight to give the revolutionaries in the larger story is a live argument among historians, not a settled fact.',
      contentNote: 'This stop describes a killing and an execution.',
      bridge: '',
    },
  ],
  reflection: 'Bhagat Singh wrote that the bomb was a way of being heard. Pick one stop and ask: who heard it, and what did they do next? Then ask the harder question: who paid for it, and were they the people the revolutionaries meant?',
  activity: {
    kind: 'choice',
    prompt: 'Which of these is NOT something the revolutionaries in this trail did?',
    options: ['Robbed a government treasury from a moving train', 'Threw bombs into the Central Legislative Assembly', 'Led a nationwide boycott of foreign cloth', 'Seized the armouries of a district town for a night'],
    answerIndex: 2,
    explanation: 'The train was Kakori (1925), the Assembly bombs were 1929, and the armouries were Chittagong (1930). Boycott of foreign cloth was the method of the Swadeshi movement and of Gandhi’s campaigns: the mass politics the revolutionaries stood apart from, and which this trail’s last stop asks you to weigh against them.',
  },
  followOn: { label: 'Meet the revolutionaries of the 1930s', to: '/fighters?era=civil-disobedience&role=revolutionary' },
  editorial: {
    status: 'reviewed',
    reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
    reviewedOn: '2026-09-16',
    notes:
      'Drafted 2026-09-16 on the six existing event records and their linked biographies; every date and name is taken from those records and re-checked against Heehs, Puri, Vaidik, Noorani, Chatterjee, Forbes, Anand and Chandra. Deliberately stated as ranges or hedged: the number of Ghadar returnees, and Udham Singh’s presence in the Bagh (carried as uncertainty). The final stop is labelled interpretation and presents three positions rather than a verdict.',
  },
  teaching: {
    alignment: 'Proposed for secondary history: methods of anti-colonial resistance; evaluating means and ends; using trial records and memoirs as sources. Not yet mapped to a specific board or state curriculum.',
    shortVersion: ['muzaffarpur-1908', 'assembly-1929', 'did-it-work'],
    prompts: [
      'The Muzaffarpur bomb killed two people it was not meant for. The Assembly bombs were designed to kill no one. What changed in the revolutionaries’ thinking between 1908 and 1929, and why?',
      'Bhagat Singh chose the courtroom as his stage. Compare that with Gandhi’s salt march the following year: which was the more effective piece of political theatre, and by what measure?',
      'The last stop gives three historians’ views. Write one paragraph defending each, then say which you find most persuasive and what evidence would change your mind.',
    ],
    facilitatorNotes: [
      'Every stop but the first carries a content note. Read them before deciding which stops to use with younger students; the short version keeps the two least violent episodes and the debate.',
      'Students often arrive with the revolutionaries as unambiguous heroes or as terrorists. The trail’s aim is neither: it is to make them weigh consequences. The Kennedy deaths at Muzaffarpur and the accidental passenger death at Kakori are there on purpose.',
      'The final stop is interpretation and says so. It works best as a structured debate with the three positions assigned.',
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-16' },
  },
};
