import type { Trail } from '@/types';

export const theForestFightsBack: Trail = {
  id: 'the-forest-fights-back',
  slug: 'the-forest-fights-back',
  version: 1,
  title: 'The forest fights back',
  question: 'Why did Adivasi communities rise against the Company and the Raj again and again, and what were they defending?',
  theme: 'Adivasi risings',
  minutes: 8,
  learningGoal: 'Name the three things these risings were defending – land, forest and freedom from debt – and describe how the state answered at least one of them.',
  intro:
    'Between the 1780s and 1940 India’s Adivasi communities rose against colonial rule again and again. The names changed – Paharia, Khasi, Santhal, Munda, Koya, Gond – and so did the methods, from treasury raids to a four-year hill war to a rising that began as a new faith. The grievances rhymed: land settlements that handed cleared fields to outsiders, moneylenders the courts protected, forest laws that made customary farming a crime. Each rising was put down by force; several forced the state to change the law. Six stops follow that thread from the Rajmahal hills to the Nizam’s Hyderabad. They are a selection, not the whole story.',
  accent: 'sepia',
  stops: [
    {
      id: 'tilka-manjhi-1780s',
      title: 'Grain for the starving, an arrow for the Collector',
      question: 'What does a hill community do when the famine continues and the tax collector still comes?',
      text: [
        'The famine of 1770 devastated Bengal and Bihar, and the Company’s revenue demands did not stop. In the Rajmahal hills, tradition remembers a leader called Tilka Manjhi – identified by later writers with a "Jabra Pahadia" who appears in Company records – who organised the hill peoples in response. In the early 1780s, the story goes, his followers raided Company treasuries and distributed the grain and money among the famine-stricken.[^1]',
        'Tradition credits him with mortally wounding Augustus Cleveland, the Collector of Bhagalpur, in 1784. The reprisals were fierce; Tilka fought on from the Tilapore forest until he was captured. Tradition holds that he was executed at Bhagalpur in January 1785 – dragged behind horses and hanged from a banyan tree. His rising came before the Kol, Santhal and Munda rebellions that followed across the same country over the next century.[^2]',
      ],
      focus: { kind: 'fighter', id: 'tilka-manjhi' },
      sources: [
        {
          title: 'Making Myth a History: A Colonial Reference in Creation of Tribal Hero Tilka Manjhi (1750–1784?)',
          author: 'D. N. Verma',
          publisher: 'in Tribe, Space and Mobilisation, Springer',
          year: 2022,
          type: 'book',
        },
        {
          title: 'Santal Parganas district records',
          publisher: 'Bihar State Archives',
          type: 'archive',
        },
      ],
      uncertainty: 'No contemporary record names Tilka Manjhi; the name first appears in print in 1970, and historians disagree whether he was Paharia or Santal, or whether the "Jabra Pahadia" of the Company papers – described there as a former bandit who later served the Company – is the same man. Company records give Augustus Cleveland’s death on 13 January 1784 as fever, aboard ship off the Hooghly; the arrow is regional memory and later histories.',
      contentNote: 'This stop describes an execution.',
      bridge: 'Four decades later and far to the north-east, the intrusion was not a tax but a road.',
    },
    {
      id: 'khasi-hills-1829',
      title: 'A road through the Khasi Hills',
      question: 'Why would a chief who agreed to a road go to war over it?',
      text: [
        'U Tirot Sing was Syiem of Nongkhlaw, a Khasi chief who governed with his durbar, not by decree. In 1826–27, after the British took Assam, the agent David Scott negotiated passage for a road linking Sylhet to the Brahmaputra valley through Khasi territory. When the road brought a garrison, and the British refused to honour his claim to the foothill duars, the durbar withdrew its permission. On 4 April 1829 Khasi forces attacked the British party at Nongkhlaw.[^1]',
        'The war lasted four years. Armed mostly with swords and bows, the Khasi confederacy fought from the limestone caves and gorges of the hills, through monsoons that immobilised British columns; the British answered with village burnings and blockade. Wounded and hiding in a cave, Tirot Sing fought on until January 1833, when a bribed chief gave up his hiding place and he was forced to surrender. Deported to Dacca (Dhaka), he died in captivity on 17 July 1835, a date Meghalaya now observes as U Tirot Sing Day.[^2]',
      ],
      focus: { kind: 'fighter', id: 'tirot-sing' },
      also: [{ kind: 'event', id: 'khasi-uprising' }],
      sources: [
        {
          title: 'U Tirot Sing commemorative records',
          publisher: 'Government of Meghalaya, Arts & Culture Department',
          type: 'government',
        },
        {
          title: 'David Scott in North-East India',
          author: 'Nirode K. Barooah',
          publisher: 'Munshiram Manoharlal',
          year: 1970,
          type: 'book',
        },
      ],
      bridge: 'Back in the Santhal country, the next grievance was debt – and the courts that would not hear it.',
    },
    {
      id: 'santhal-hul-1855',
      title: 'The land belongs to those who till it',
      question: 'Who were the Santhals fighting: the moneylenders, or the state behind them?',
      text: [
        'Sidhu and Kanhu Murmu belonged to Bhognadih in the Damin-i-Koh, the forest tract where Santhals had been settled as pioneer cultivators. Within a generation, usurious moneylenders (mahajans), zamindars and corrupt police had reduced many Santhals to debt bondage, and the Company’s courts offered no remedy. Claiming a divine command from the Thakur to drive out the mahajans, zamindars and the power behind them, the brothers convened a great assembly at Bhognadih on 30 June 1855 and declared the Hul. Within weeks tens of thousands of Santhals, with Paharias and poor non-Adivasi neighbours among them, were attacking the houses of mahajans and zamindars and fighting Company troops.[^1]',
        'Martial law was proclaimed in November 1855; elephants, artillery and multiple regiments were deployed. A British officer quoted by W. W. Hunter recorded the Santhals’ discipline under fire: as long as their drum beat they stood and let themselves be shot down. Sidhu was captured and executed in 1855, Kanhu in 1856; their brothers Chand and Bhairav also fought, and Santhal tradition remembers their sisters Phulo and Jhano as fighters of the Hul. Estimates of Santhal dead run into the thousands. Within months the Company carved out a separate Santal Parganas district (Act XXXVII of 1855) under its own rules; the tenancy protections that followed – the Settlement Regulation of 1872 and, after independence, the Santal Parganas Tenancy Act of 1949 – descend from that settlement. 30 June is observed across Jharkhand as Hul Diwas.[^2]',
      ],
      focus: { kind: 'fighter', id: 'sidhu-kanhu-murmu' },
      also: [{ kind: 'event', id: 'santhal-hul' }],
      sources: [
        {
          title: 'Elementary Aspects of Peasant Insurgency in Colonial India',
          author: 'Ranajit Guha',
          publisher: 'Duke University Press',
          year: 1999,
          type: 'book',
        },
        {
          title: 'Hul Diwas records',
          publisher: 'Government of Jharkhand',
          type: 'government',
        },
      ],
      uncertainty: 'Estimates of Santhal deaths range widely – figures from 10,000 to more than 20,000 are cited, but no reliable contemporary count exists.',
      contentNote: 'This stop describes executions and the killing of people under fire.',
      bridge: 'Forty-four years later, in neighbouring Chotanagpur, the Mundas had lost the land itself – and their rising began as a faith.',
    },
    {
      id: 'ulgulan-1899',
      title: 'Dharti Aba and the Great Tumult',
      question: 'How does a healer’s following become a rising?',
      text: [
        'Birsa Munda was born at Ulihatu in 1875 into a sharecropping family displaced by the destruction of the khuntkatti system, under which Munda clans had held their cleared lands collectively. Briefly schooled at a German mission and exposed to Vaishnav preachers, he forged a new faith – one God, purity, and the promise that the Mundas would recover their kingdom – and his followers called him Dharti Aba, Father of the Earth. The movement turned political as it grew: against the dikus (outsiders), the beth begari forced labour, and the colonial courts that sanctified dispossession. He was arrested in 1895 and jailed for two years.[^1]',
        'On Christmas Eve 1899 the Ulgulan opened with flaming arrows. Through January 1900 the Mundas attacked police stations and estates until troops broke them on 9 January 1900 at Dombari Hill above Sail Rakab, where many followers were killed. Betrayed for a reward and captured in February 1900, Birsa died in Ranchi jail on 9 June 1900, officially of cholera. The rising forced the Chotanagpur Tenancy Act of 1908, which restricted the transfer of Adivasi land – a protection that endures.[^2]',
      ],
      focus: { kind: 'fighter', id: 'birsa-munda' },
      also: [{ kind: 'event', id: 'munda-ulgulan' }],
      sources: [
        {
          title: 'Birsa Munda and His Movement 1874–1901',
          author: 'K. S. Singh',
          publisher: 'Oxford University Press',
          year: 1983,
          type: 'book',
        },
        {
          title: 'Janjatiya Gaurav Divas records',
          publisher: 'Ministry of Culture, Government of India',
          type: 'government',
        },
      ],
      uncertainty: 'The jail recorded cholera as the cause of Birsa’s death in custody; the speed and circumstances have led many writers to question the official account.',
      contentNote: 'This stop describes killings and a death in custody.',
      bridge: 'Two decades on, in the Godavari hills of the south, the pressure came from a forest law rather than a land settlement.',
    },
    {
      id: 'rampa-1922',
      title: 'Signed receipts for stolen rifles',
      question: 'Why did a follower of petitions decide this fight would be armed?',
      text: [
        'Alluri Sitarama Raju was born on the coastal plains – Pandrangi near Visakhapatnam by the official account, Mogallu in West Godavari by others – and moved through the agency tracts of the Godavari hills as a sanyasi with a reputation for austerity and healing. Under the Madras Forest Act podu cultivation was banned, forest produce seized, and gudem villagers pressed into unpaid road-gang labour by corrupt contractors. The failure of the Gandhian methods he had first adopted – panchayat courts, khadi, temperance – convinced Raju that this fight would be armed.[^1]',
        'The Rampa rebellion opened on 22 August 1922 with a raid on Chintapalli police station, followed within days by Krishnadevipeta and Rajavommangi – arms taken, and the records signed for in Raju’s own hand. His force ambushed police at Damanapalli, killing two officers, and for two years, supplied and shielded by the villages, held off the Malabar Special Police and Assam Rifles with lieutenants such as Gam Mallu Dora and Gantam Dora. The Raj answered by appointing T. G. Rutherford Special Commissioner in April 1924, with collective punishments on the villages. Run down and captured at Mampa on 7 May 1924, Raju was taken to Koyyuru, tied to a tree and shot by firing squad the same day, without trial. He was twenty-six, or twenty-five by the other dating of his birth.[^2]',
      ],
      focus: { kind: 'fighter', id: 'alluri-sitarama-raju' },
      also: [{ kind: 'event', id: 'rampa-rebellion' }],
      sources: [
        {
          title: 'Alluri Sitarama Raju commemorative records',
          publisher: 'Ministry of Culture, Azadi Ka Amrit Mahotsav',
          url: 'https://amritkaal.nic.in/',
          type: 'government',
        },
        {
          title: 'Rebellious Hillmen: The Gudem-Rampa Risings, 1839–1924 (in Subaltern Studies I, ed. Ranajit Guha)',
          author: 'David Arnold',
          publisher: 'Oxford University Press',
          year: 1982,
          type: 'book',
        },
      ],
      contentNote: 'This stop describes an execution without trial.',
      bridge: 'The last stop lies outside British India altogether, in the Nizam’s Hyderabad, where the Gonds of Adilabad faced the same pressures under a different crown.',
    },
    {
      id: 'jodeghat-1940',
      title: 'Jal, Jangal, Zameen',
      question: 'What did the Gonds of Adilabad mean by water, forest and land?',
      text: [
        'Komaram Bheem was born into a Gond family in the forests of Adilabad, in Hyderabad State – outside British India, under the Nizam, whose revenue farmers, forest officials and settler landlords pressed the Gonds from their shifting cultivation. After an altercation in which an oppressor was killed, Bheem fled and spent years in the tea gardens of Assam, where strikes and labour organisation left their mark on him. Back in Adilabad in the 1930s, he settled at Bhabejhari and organised the Gonds of twelve villages – the "twelve mauzas" – around the demand summed up in the slogan attributed to him: Jal, Jangal, Zameen. They petitioned the Nizam’s government for land rights and an end to exactions; when petitions failed, he led a guerrilla defence of Gond country from the hills of Jodeghat through 1938–40.[^1]',
        'In October 1940 – 27 October by the usually cited date, the Aswayuja full moon by Gond reckoning – police guided by an informer surrounded Bheem’s camp at Jodeghat. He died fighting with some fifteen companions; the count varies. In the years that followed, the Nizam’s government turned to the Austrian anthropologist Christoph von Fürer-Haimendorf, working among the Adilabad Gonds from 1941 and its Adviser for Tribes and Backward Classes from 1945; his reports shaped the Hyderabad Tribal Areas Regulation of 1946. The Gonds deified Bheem and commemorate him each Aswayuja Pournami; Telangana has raised a memorial complex at Jodeghat, and the Kumuram Bheem Asifabad district (2016) bears his name.[^2]',
      ],
      focus: { kind: 'fighter', id: 'komaram-bheem' },
      sources: [
        {
          title: 'Komaram Bheem memorial, Jodeghat',
          publisher: 'Government of Telangana',
          type: 'government',
        },
        {
          title: 'The Raj Gonds of Adilabad',
          author: 'Christoph von Fürer-Haimendorf',
          publisher: 'Macmillan',
          year: 1948,
          type: 'book',
        },
      ],
      uncertainty: 'Bheem’s life comes to us largely through Gond oral tradition and later reconstruction; dates including his birth year and episodes of his youth vary across accounts.',
      contentNote: 'This stop describes a killing in a police action.',
      bridge: '',
    },
  ],
  reflection: 'Each of these risings was answered with force, and several were followed by a new law – a separate district, a tenancy act, an inquiry. Which mattered more to the communities concerned: the law that came after, or the rising itself? What would you need to know to decide?',
  activity: {
    kind: 'order',
    prompt: 'Put the six risings in the order they happened.',
    items: [
      { label: 'Tilka Manjhi’s followers are said to raid Company treasuries in the Rajmahal hills', year: 1784, ref: { kind: 'fighter', id: 'tilka-manjhi' } },
      { label: 'Khasi forces attack the British party at Nongkhlaw', year: 1829, ref: { kind: 'event', id: 'khasi-uprising' } },
      { label: 'Sidhu and Kanhu Murmu declare the Hul at Bhognadih', year: 1855, ref: { kind: 'event', id: 'santhal-hul' } },
      { label: 'Birsa Munda’s Ulgulan opens on Christmas Eve', year: 1899, ref: { kind: 'event', id: 'munda-ulgulan' } },
      { label: 'The Rampa rebellion begins with the raid on Chintapalli police station', year: 1922, ref: { kind: 'event', id: 'rampa-rebellion' } },
      { label: 'Komaram Bheem falls at Jodeghat', year: 1940, ref: { kind: 'fighter', id: 'komaram-bheem' } },
    ],
    explanation: 'From the Rajmahal raids of the early 1780s to Komaram Bheem’s death in October 1940 is some 160 years. The first three risings – Rajmahal hills, Khasi Hills, Santhal Parganas – were against the Company; the Ulgulan and the Rampa rebellion faced the Crown; the last was against the Nizam of Hyderabad, outside British India altogether.',
  },
  followOn: { label: 'Meet the tribal leaders', to: '/movements/tribal-resistance' },
  editorial: {
    status: 'reviewed',
    reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
    reviewedOn: '2026-09-09',
    notes:
      'Drafted 2026-09-09 from the six fighter records and four event records. Fact-checked the same day (~75 claims) against Verma (2022), Hunter, K. S. Singh, Arnold and Fürer-Haimendorf, plus reference and government sources. Corrected: the Tilka Manjhi stop had reversed record-versus-tradition (“Jabra Paharia” is the Company-record name, not the community’s own for him) and wrongly claimed Company records were silent on Cleveland’s death, which they in fact attribute to fever at sea; the whole figure is unattested before 1970 print sources, now said plainly. The Hul stop credited the rising with a tenancy act that dates from 1949 — the direct outcome was the 1855 Santal Parganas district, with tenancy protections following in 1872 and 1949. Tightened: Rutherford’s title (Special Commissioner, not “a commission”), the Rampa source’s title (Arnold’s actual chapter), Bheem’s death date and companion count (disputed), Haimendorf’s name, dates and role, Alluri’s birthplace and Gandhian-method background, and Dombari Hill as one battle site, not two.',
  },
  teaching: {
    alignment: 'Proposed for upper-primary and secondary history — resistance to colonial rule; evidence and interpretation. Not yet mapped to a specific board or state curriculum.',
    shortVersion: ['santhal-hul-1855', 'ulgulan-1899', 'rampa-1922'],
    prompts: [
      'Four of these stops involve a moneylender, a landlord or a forest officer before they involve a soldier. Pick one stop and explain who the community was fighting first, and why the state ended up on the other side.',
      'The Santhal Hul was followed by a separate district and, decades later, by tenancy protections; the Ulgulan by the Chotanagpur Tenancy Act of 1908. Does a law passed after a rising count as a success for the rising? Argue both sides.',
      'The final stop happened in the Nizam’s Hyderabad, not in British India. What does that tell you about where the pressure on Adivasi land was coming from?',
    ],
    facilitatorNotes: [
      'Four of the six stops carry an uncertainty note (a disputed attribution, a death toll, a cause of death, dates from oral tradition). Use one of them to show students that a record can be honest about what is not known.',
      'The transliterated words matter: hul, ulgulan, diku, khuntkatti, podu, beth begari. Ask students to keep a running list and define each from context before looking any of them up.',
      'Every stop except the Khasi Hills carries a content note for executions or killings. Read the notes aloud before those sections with younger students, and be ready for the question of why the punishments were so severe.',
    ],
    editorial: { status: 'reviewed', reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-09' },
  },
};
