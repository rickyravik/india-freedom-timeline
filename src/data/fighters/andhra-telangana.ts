import type { FreedomFighter } from '@/types';

/**
 * Freedom fighters of Andhra Pradesh and Telangana — from the earliest
 * armed resistance to Company revenue demands in Rayalaseema, through the
 * Hyderabad rising of 1857, to the Swadeshi-era campaign for a national
 * flag. This archive has carried almost no records from this region;
 * these three begin to fill that gap.
 */
export const andhraTelanganaFighters: FreedomFighter[] = [
  {
    id: 'uyyalawada-narasimha-reddy',
    slug: 'uyyalawada-narasimha-reddy',
    name: 'Uyyalawada Narasimha Reddy',
    birthYear: 1806,
    deathYear: 1847,
    birthDateLabel: '24 November 1806',
    deathDateLabel: '23 February 1847',
    birthPlace: 'Kurnool district, Andhra Pradesh',
    region: 'south',
    states: ['Andhra Pradesh'],
    gender: 'male',
    era: 'early-resistance',
    roles: ['ruler', 'military-leader'],
    summary:
      'A palegar (poligar) chief of Rayalaseema who led an armed rebellion against East India Company revenue demands in 1846–47 — one of the earliest organized armed uprisings in the Andhra country, roughly a decade before the Revolt of 1857 — and was captured and hanged in 1847.',
    shortStory: [
      {
        title: 'A chief pushed to the edge',
        text: 'Narasimha Reddy’s family had long held palegar rights — local chieftainship — around Kurnool. As the East India Company tightened its revenue settlements through the 1830s and 40s, those rights and incomes were cut away, one demand at a time.',
      },
      {
        title: 'Rebellion in Rayalaseema',
        text: 'In 1846 he gathered several thousand followers and took up arms, raiding treasuries and Company outposts across the Kurnool countryside. Historians count it among the earliest large-scale armed uprisings against Company rule in the Telugu-speaking region.',
      },
      {
        title: 'Capture and execution',
        text: 'Company forces hunted him for months before he was captured in 1847. He was tried and hanged; his remains were then kept on public display for years afterward, as a warning to others who might follow him.',
        uncertainty: 'Sources vary on exactly where and for how long his remains were displayed, and popular claims about their later history are not confirmed by any source found for this record.',
      },
      {
        title: 'Remembered as an early rebel',
        text: 'Andhra Pradesh recalls him today as one of the first to take up arms against colonial rule — most visibly through Chiranjeevi’s 2019 film Sye Raa Narasimha Reddy, which carried his name to a national audience.',
      },
    ],
    fullBiography: [
      'Narasimha Reddy held hereditary palegar (chieftain) rights around Kurnool, in the Ceded Districts the Company had taken over from the Nizam of Hyderabad in 1800. Through the 1830s and 40s, Company revenue settlements steadily dismantled the palegars’ traditional incomes and authority, reducing men like Narasimha Reddy from petty rulers to ordinary revenue-payers — a humiliation he refused to accept quietly.',
      'In 1846 he raised a large following and began attacking Company treasuries and posts across the Kurnool region, evading capture for months in a campaign historians treat as one of the earliest organized armed uprisings against Company authority in the Telugu country — predating the far larger Revolt of 1857 by about a decade.',
      'He was eventually captured in 1847, tried, and hanged; his body was left on public display for a long period afterward as a deterrent to further unrest, though accounts differ on the precise place and duration. He is remembered in Andhra Pradesh’s public memory and, more recently, in popular cinema, as an early martyr of armed resistance to Company rule.',
    ],
    entryIntoStruggle: 'Loss of hereditary palegar rights and mounting Company revenue demands in Kurnool district through the 1830s–40s.',
    achievements: [
      'Led one of the earliest large-scale armed uprisings against East India Company rule in the Telugu-speaking region, roughly a decade before the Revolt of 1857',
    ],
    sacrifices: ['Captured and hanged in 1847; his remains reportedly displayed publicly for years afterward'],
    legacy: 'Remembered in Andhra Pradesh as an early martyr of armed resistance to Company rule; his story reached a national audience through the 2019 film Sye Raa Narasimha Reddy.',
    facts: ['His 1846–47 rebellion is sometimes called Rayalaseema’s first war against the British.'],
    disputed: [
      {
        claim: 'A widely repeated claim that his skull was kept in a museum in England and later returned to India',
        note: 'This claim circulates in popular accounts and social media, but could not be verified against any reliable published source during fact-checking for this record. It is not asserted here as established fact and needs a documentary source before it is added.',
      },
      {
        claim: 'Where and for how long his remains were displayed after execution',
        note: 'Secondary accounts agree his body or skeleton was kept on public view for a long period as a warning, but differ on the exact site and end date (accounts range from the 1870s to the 1880s).',
      },
    ],
    timelineEvents: [],
    movements: ['early-uprisings'],
    organizations: [],
    relatedPeople: ['veerapandiya-kattabomman', 'alluri-sitarama-raju'],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    sources: [
      {
        title: 'Kurnool District Gazetteer',
        publisher: 'Government of Andhra Pradesh',
        type: 'archive',
      },
      {
        title: 'Uyyalawada Narasimha Reddy commemorations',
        publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav',
        url: 'https://amritkaal.nic.in/',
        type: 'government',
      },
    ],
    tags: ['Andhra Pradesh', 'Rayalaseema', 'early resistance', 'poligar'],
    forgotten: true,
  },
  {
    id: 'pingali-venkayya',
    slug: 'pingali-venkayya',
    name: 'Pingali Venkayya',
    birthYear: 1876,
    deathYear: 1963,
    birthDateLabel: '2 August 1876',
    deathDateLabel: '4 July 1963',
    birthPlace: 'Bhatlapenumarru, Krishna district, Andhra Pradesh',
    region: 'south',
    states: ['Andhra Pradesh'],
    gender: 'male',
    era: 'non-cooperation',
    roles: ['organizer', 'educator'],
    summary:
      'Agriculturist, geologist and educator who spent decades campaigning for a national flag, and whose 1921 design — presented to Gandhi at the Vijayawada AICC session — became the Congress flag and the direct ancestor of independent India’s Tricolour.',
    shortStory: [
      {
        title: 'A man of many trades',
        text: 'Venkayya trained as a geologist, worked as an agriculturist and educator, and spoke several languages. As a young man he served in the British Indian Army during the Second Anglo-Boer War in South Africa — where he first met Mohandas Gandhi.',
      },
      {
        title: 'Decades chasing one idea',
        text: 'From around 1916 he petitioned Congress sessions with idea after idea for a national flag, eventually publishing a booklet of some thirty designs of his own.',
      },
      {
        title: 'Bezwada, 1921',
        text: 'At the All India Congress Committee session in Vijayawada (then Bezwada) in 1921, he presented a two-colour saffron-and-green flag to Gandhi. Gandhi suggested adding a white band and a spinning wheel — and the flag that resulted flew over the freedom movement for the next quarter-century.',
      },
      {
        title: 'A legacy folded into the Tricolour',
        text: 'After independence the spinning wheel was replaced with the Ashoka Chakra, and the flag Venkayya had shaped became India’s national flag on 22 July 1947. He died in 1963 largely unrecognised; India Post honoured him with a postage stamp only in 2009.',
      },
    ],
    fullBiography: [
      'Pingali Venkayya was born in 1876 in Krishna district and became, over his life, a geologist, agriculturist, educator and linguist. As a young man he served in the British Indian Army during the Second Anglo-Boer War in South Africa, where he first met Mohandas Gandhi — a meeting that would shape both their lives.',
      'From around 1916 he campaigned for the Congress to adopt a national flag, presenting design after design at party sessions and eventually self-publishing a booklet illustrating some thirty proposals. At the AICC session in Vijayawada in 1921, his two-colour saffron-and-green flag caught Gandhi’s attention; Gandhi proposed adding a white band to represent other communities and a spinning wheel (charkha) as a symbol of self-reliance. The resulting tricolour became the flag of the Congress and the wider movement through the 1920s, 30s and 40s.',
      'When independence came, the Constituent Assembly adopted a modified version of Venkayya’s flag — with the Ashoka Chakra replacing the charkha — as India’s national flag on 22 July 1947. Venkayya himself received little recognition in his own lifetime and died in 1963 in modest circumstances; India Post issued a commemorative stamp in his honour only in 2009, and he is now widely credited as the designer of India’s national flag.',
    ],
    entryIntoStruggle: 'Advocacy for a national flag at Congress sessions from around 1916, culminating in his 1921 design presented to Gandhi.',
    achievements: [
      'Designed the flag presented to Gandhi at the 1921 Vijayawada AICC session, the direct ancestor of independent India’s national flag',
      'Trained as a geologist and agriculturist, and worked as an educator and linguist',
    ],
    sacrifices: ['Spent decades and his own resources promoting a national flag, with little personal recognition in his lifetime'],
    legacy: 'Widely honoured today as the designer of the Indian national flag; commemorated on an Indian postage stamp in 2009.',
    facts: [
      'He first met Gandhi while serving in the British Indian Army during the Second Anglo-Boer War in South Africa.',
      'He self-published a booklet illustrating around thirty flag designs before 1921.',
    ],
    timelineEvents: [],
    movements: ['non-cooperation'],
    organizations: ['inc'],
    relatedPeople: ['mahatma-gandhi'],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    sources: [
      {
        title: 'Pingali Venkayya and the Indian national flag',
        publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav',
        url: 'https://amritkaal.nic.in/',
        type: 'government',
      },
      {
        title: 'Andhra Pradesh State Archives records on Pingali Venkayya',
        publisher: 'Andhra Pradesh State Archives',
        type: 'archive',
      },
    ],
    tags: ['Andhra Pradesh', 'national flag', 'Congress'],
    forgotten: true,
  },
  {
    id: 'turrebaz-khan',
    slug: 'turrebaz-khan',
    name: 'Turrebaz Khan',
    alternateNames: ['Turram Khan'],
    deathYear: 1859,
    deathDateLabel: '24 January 1859 (some accounts give 1857)',
    region: 'south',
    states: ['Telangana'],
    gender: 'male',
    era: 'revolt-1857',
    roles: ['revolutionary', 'military-leader'],
    summary:
      'Rohilla leader who, with Maulvi Allauddin, led an armed rising against the British Residency in Hyderabad in July 1857 in sympathy with the wider Revolt of 1857; captured and later killed by British-Nizam forces, though accounts differ on the exact date and manner of his death.',
    shortStory: [
      {
        title: 'A protest at the Residency',
        text: 'On 17 July 1857, Turrebaz Khan and Maulvi Allauddin led thousands from the Mecca Masjid toward the British Residency in Hyderabad, in sympathy with the revolt then raging across northern India. The demonstration turned into an attack, and the Residency guards opened fire.',
      },
      {
        title: 'Captured, then escaped',
        text: 'The Nizam’s government — a British ally — arrested Turrebaz Khan and sentenced him to transportation for life. He did not go quietly: before he could be sent away, he escaped from custody.',
      },
      {
        title: 'The end of the chase',
        text: 'Hunted with a price on his head, he was eventually cornered by British and Nizam’s forces. Accounts differ on whether he was killed in that encounter or captured and put to death; his body was afterward displayed publicly in the city as a warning.',
        uncertainty: 'Sources disagree on both the exact date and the manner of his death — some place it in 1857, others describe a later escape and a fatal encounter in January 1859.',
      },
      {
        title: 'Remembered in Hyderabad',
        text: 'A stadium and roads in Hyderabad still carry his name, honouring one of the city’s earliest resisters to British power.',
      },
    ],
    fullBiography: [
      'Hyderabad State in 1857 was ruled by a Nizam allied to the British, with a British Residency at the heart of the city. Turrebaz Khan, a Rohilla leader, was among those in Hyderabad who took up the cause of the revolt spreading across northern India that year.',
      'On 17 July 1857 he and Maulvi Allauddin led a large crowd from the Mecca Masjid toward the Residency; the protest turned into an attack on the Residency guard, who opened fire on the crowd. Turrebaz Khan was captured by the Nizam’s forces and sentenced to transportation for life, his property confiscated — but he escaped custody before the sentence could be carried out.',
      'What followed is less certain. Detailed secondary accounts describe him being hunted for over a year, with a reward offered for his capture, and say he was killed in a clash with British and Nizam’s forces on 24 January 1859, after which his body was displayed publicly in Hyderabad as a warning to others. Other, briefer references simply record his death in 1857, without this escape and later pursuit. This record follows the more detailed account while flagging the disagreement, pending a documentary source that can settle it. He is remembered today through Hyderabad’s Turrebaz Khan Stadium and other landmarks bearing his name.',
    ],
    entryIntoStruggle: 'Led the attack on the British Residency at Hyderabad on 17 July 1857, in sympathy with the wider Revolt of 1857.',
    achievements: ['Led one of the few direct armed actions against British authority in Hyderabad State during the Revolt of 1857'],
    sacrifices: ['Captured, escaped, and was ultimately killed by British and Nizam’s forces'],
    legacy: 'Hyderabad’s Turrebaz Khan Stadium and other landmarks preserve his memory as an early resister to British power in the Deccan.',
    facts: ['A stadium in Hyderabad, Turrebaz Khan Stadium, is named after him.'],
    disputed: [
      {
        claim: 'The date and manner of his death',
        note: 'Detailed secondary accounts describe him escaping custody and being killed in an encounter with British-Nizam forces on 24 January 1859; other, briefer references simply give his death as 1857. This record follows the more detailed account but flags the disagreement, since no primary documentary source was found to confirm either version.',
      },
    ],
    timelineEvents: [],
    movements: ['great-revolt'],
    organizations: [],
    relatedPeople: ['maniram-dewan', 'bahadur-shah-zafar', 'komaram-bheem'],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    sources: [
      {
        title: 'Hyderabad Residency attack and Rohilla uprising records, 1857–59',
        publisher: 'Telangana State Archives',
        type: 'archive',
      },
      {
        title: 'Turrebaz Khan commemorations',
        publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav',
        url: 'https://amritkaal.nic.in/',
        type: 'government',
      },
    ],
    tags: ['Telangana', 'Hyderabad', 'Revolt of 1857'],
    forgotten: true,
  },
  {
    id: 'durgabai-deshmukh',
    slug: 'durgabai-deshmukh',
    name: 'Durgabai Deshmukh',
    alternateNames: ['G. Durgabai'],
    birthYear: 1909,
    deathYear: 1981,
    birthDateLabel: '15 July 1909',
    deathDateLabel: '9 May 1981',
    birthPlace: 'Rajahmundry, Madras Presidency (now Andhra Pradesh)',
    region: 'south',
    states: ['Andhra Pradesh'],
    gender: 'female',
    era: 'civil-disobedience',
    roles: ['political-leader', 'social-reformer', 'lawyer', 'organizer'],
    summary:
      'A child bride who left an arranged marriage at fifteen and quit school at twelve in protest at English-medium education, she organized women for the 1930 Salt Satyagraha in Madras and Andhra, was imprisoned three times, founded the Andhra Mahila Sabha, and later trained as a lawyer, going on to serve in the Constituent Assembly and independent India’s first Planning Commission.',
    shortStory: [
      {
        title: 'A school given up',
        text: 'Durgabai had been married as a small child, by family custom, to a boy from a well-off family. At twelve, during the Non-Cooperation movement of 1921, she left her English-medium school in protest and helped start a small Hindi school for girls in Rajahmundry instead.',
      },
      {
        title: 'Walking away',
        text: 'At fifteen, with her own family standing by her, Durgabai ended the marriage that had been arranged for her as a child — an unusual and quietly difficult step for a young woman in 1920s Andhra.',
      },
      {
        title: 'Salt and prison',
        text: 'In 1930 she organized women to join Gandhi’s Salt Satyagraha across Madras and Andhra, and stepped in to lead the Madras movement herself after the veteran Andhra Congress leader Tanguturi Prakasam was arrested. She was arrested in turn and spent close to three years in jail, part of it in solitary confinement.',
      },
      {
        title: 'A sabha for Andhra’s women',
        text: 'Prison had shown her how little support poor and destitute women could find. Soon after her release she founded the Andhra Mahila Sabha, which grew from a small literacy class into one of South India’s leading institutions for women’s education and welfare.',
        uncertainty: 'Sources give the Andhra Mahila Sabha’s founding year as either 1937 or 1938; this record follows the more commonly cited 1937 without full certainty.',
      },
      {
        title: 'From prison to the law',
        text: 'Watching women pass through the courts and jails without help of their own convinced Durgabai to study law herself. She was enrolled at the Madras Bar in 1942, and built a career defending women who could not otherwise afford one.',
      },
      {
        title: 'After freedom',
        text: 'Independence brought her a seat in the Constituent Assembly of India and, later, membership of the country’s first Planning Commission — a long public career this archive, focused on the freedom struggle itself, does not trace in detail.',
      },
    ],
    fullBiography: [
      'Durgabai was born in 1909 in Rajahmundry and, by the custom of her family, married as a small child. At twelve, during the Non-Cooperation movement of 1921, she gave up her English-medium schooling in protest and helped start a Hindi school for girls in Rajahmundry; a few years later, at fifteen and with her own family’s support, she ended the child marriage altogether.',
      'In 1930 she threw herself into organizing women for Gandhi’s Salt Satyagraha in Madras and across Andhra, and took over leadership of the Madras satyagraha when the veteran Andhra Congress leader Tanguturi Prakasam was arrested. She was arrested herself and spent close to three years in prison between 1930 and 1933, including about a year in solitary confinement — an experience that turned her toward the law, so she might one day defend women who had no one else to speak for them.',
      'Soon after her release she founded the Andhra Mahila Sabha, built initially around adult literacy classes for widowed and destitute women; it grew within a decade into one of South India’s major institutions for women’s education, health and welfare, and remains active today. She was enrolled at the Madras Bar in 1942 and practised law, with a particular commitment to women’s legal aid.',
      'After independence Durgabai was elected to the Constituent Assembly of India, one of a small number of women members, and later served on the Planning Commission and married the economist C. D. Deshmukh in 1953. This archive, centred on the freedom struggle itself, does not trace her long later career in public life and social work in detail.',
    ],
    entryIntoStruggle: 'Organizing women satyagrahis for the 1930 Salt Satyagraha in Madras and Andhra.',
    achievements: [
      'Organized women satyagrahis for the 1930 Salt Satyagraha in Madras and Andhra, leading the Madras movement after Tanguturi Prakasam’s arrest',
      'Founded the Andhra Mahila Sabha, one of South India’s major institutions for women’s education and welfare',
      'One of the few women members of the Constituent Assembly of India, and later a member of independent India’s first Planning Commission',
    ],
    sacrifices: ['Imprisoned three times between 1930 and 1933, including about a year in solitary confinement'],
    legacy: 'Remembered as a pioneering organizer of women in the freedom movement and the founder of one of South India’s longest-running women’s welfare institutions.',
    facts: [
      'She began studying law partly because of what she had seen of women prisoners during her own years in jail.',
      'She was enrolled at the Madras Bar in 1942, in the year of the Quit India movement.',
    ],
    disputed: [
      {
        claim: 'The exact founding year of the Andhra Mahila Sabha',
        note: 'Sources give either 1937 or 1938; this record follows the more commonly cited 1937, but the exact year is not settled.',
        paragraph: 2,
      },
    ],
    timelineEvents: [],
    movements: ['civil-disobedience'],
    organizations: ['inc'],
    relatedPeople: ['tanguturi-prakasam', 'mahatma-gandhi'],
    connections: [
      {
        id: 'tanguturi-prakasam',
        type: 'ally',
        note: 'Organized women satyagrahis alongside him for the 1930 Salt Satyagraha in Madras, and took over leadership of the Madras movement after his arrest.',
      },
    ],
    editorial: {
      status: 'reviewed',
      reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
      reviewedOn: '2026-09-15',
    },
    sources: [
      {
        title: 'Durgabai Deshmukh: profile and Constituent Assembly record',
        publisher: 'Constitution of India (constitutionofindia.net), CPR India',
        url: 'https://www.constitutionofindia.net/members/g-durgabai/',
        type: 'website',
      },
      {
        title: 'Durgabai Deshmukh commemorations',
        publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav',
        url: 'https://amritkaal.nic.in/',
        type: 'government',
      },
      {
        title: 'Andhra Mahila Sabha and Durgabai Deshmukh records',
        publisher: 'Andhra Pradesh State Archives',
        type: 'archive',
      },
    ],
    tags: ['Andhra Pradesh', 'women', 'Salt Satyagraha', 'social reform'],
    forgotten: true,
  },
];
