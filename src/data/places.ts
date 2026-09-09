import type { Place } from '@/types';

const checked = { status: 'reviewed' as const, reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-09' };

export const places: Place[] = [
  {
    id: 'panchalankurichi',
    slug: 'panchalankurichi',
    name: 'Panchalankurichi',
    state: 'Tamil Nadu',
    kind: 'fort',
    dates: '1799, 1801',
    summary:
      'The mud fort of Veerapandiya Kattabomman in the Tirunelveli country, besieged and taken by Major Bannerman’s Company army in September 1799 and levelled after his execution; taken again in 1801 during the South Indian Rebellion.',
    description: [
      'Panchalankurichi was the seat of a small palaiyam whose chief refused the East India Company’s demand for tribute. After Kattabomman’s violent confrontation with the Collector in 1798, the Company resolved on his destruction; Major Bannerman attacked the fort on 5 September 1799; the first assault was repulsed with heavy loss, and Kattabomman abandoned the fort by night when Company guns arrived later that month.[^1]',
      'The fort was levelled after Kattabomman was hanged at Kayathar, and fell again in May 1801 when Oomaithurai’s escape reignited the southern rising. The reconstructed fort and memorial at the site, built by the state in 1974, remain a place of pilgrimage.[^2]',
    ],
    people: ['veerapandiya-kattabomman'],
    events: ['polygar-war-1799', 'south-indian-rebellion-1801'],
    sources: [
      { title: 'Poligar Rebellion records, 1799–1801', publisher: 'Tamil Nadu State Archives', type: 'archive', evidence: 'contemporary' },
      { title: 'Kattabomman memorial records, Panchalankurichi', publisher: 'Government of Tamil Nadu, Department of Archaeology', type: 'government', evidence: 'reference' },
    ],
    editorial: checked,
  },
  {
    id: 'kayathar',
    slug: 'kayathar',
    name: 'Kayathar',
    state: 'Tamil Nadu',
    kind: 'town',
    dates: '16 October 1799',
    summary: 'Where Kattabomman was tried summarily and hanged from a tamarind tree before the assembled chiefs of the south on 16 October 1799.',
    description: [
      'Kattabomman was tried at Kayathar on 16 October 1799 in the presence of the region’s palaiyakkarars, as a warning to them, and hanged the same day. The intended lesson misfired: within two years the whole south was in revolt.[^1]',
    ],
    people: ['veerapandiya-kattabomman'],
    events: ['polygar-war-1799'],
    sources: [{ title: 'Gazetteer of the Tinnevelly District (1916)', url: 'https://archive.org/details/in.ernet.dli.2015.161915', publisher: 'Madras Government Press', type: 'archive', evidence: 'scholarship' }],
    editorial: checked,
  },
  {
    id: 'kalayar-kovil',
    slug: 'kalayar-kovil',
    name: 'Kalayar Kovil',
    state: 'Tamil Nadu',
    kind: 'fort',
    dates: '1772, October 1801',
    summary: 'The forest stronghold of Sivaganga: where Velu Nachiyar’s husband fell to Company troops acting for the Nawab of Arcot in 1772, and where the Marudhu brothers’ rising ended in October 1801.',
    description: [
      'In 1772 Company troops acting for the Nawab of Arcot killed the ruler of Sivaganga at the Kalaiyar Koil battle; his widow Velu Nachiyar escaped to spend eight years building the alliance that retook the kingdom around 1780.[^1]',
      'Three decades later Kalayar Kovil was the Marudhu brothers’ stronghold in the South Indian Rebellion. It fell in October 1801; the brothers were captured and hanged at Tiruppathur on 24 October.[^2]',
    ],
    people: ['velu-nachiyar', 'marudhu-brothers'],
    events: ['south-indian-rebellion-1801'],
    sources: [
      { title: 'Sivaganga District Gazetteer', publisher: 'Government of Tamil Nadu', type: 'archive', evidence: 'scholarship' },
      { title: 'Marudhu Pandiyar memorial records, Kalayar Kovil', publisher: 'Government of Tamil Nadu', type: 'government', evidence: 'reference' },
    ],
    editorial: checked,
  },
  {
    id: 'jhansi',
    slug: 'jhansi',
    name: 'Jhansi',
    historicalNames: ['Jhansi State (annexed 1854)'],
    state: 'Uttar Pradesh',
    kind: 'fort',
    dates: 'March–April 1858',
    summary: 'The walled city and fort Rani Lakshmibai defended for two weeks against Sir Hugh Rose’s Central India Field Force in 1858, and escaped from by night when it fell.',
    description: [
      'In March 1858 the Central India Field Force besieged Jhansi. The Rani directed the defence from the walls; when the city fell after bombardment and street fighting she escaped through the lines by night and rode to join Tatya Tope. Later tradition, unsupported by contemporary records, credits Jhalkari Bai of the women’s guard with impersonating her to cover the escape.[^1]',
    ],
    people: ['rani-lakshmibai', 'jhalkari-bai', 'tatya-tope'],
    events: ['siege-of-jhansi'],
    sources: [{ title: 'The Rani of Jhansi: A Study in Female Heroism in India', author: 'Joyce Lebra-Chapman', publisher: 'University of Hawaii Press', year: 1986, type: 'book', evidence: 'scholarship' }],
    editorial: checked,
  },
  {
    id: 'vedaranyam',
    slug: 'vedaranyam',
    name: 'Vedaranyam',
    state: 'Tamil Nadu',
    kind: 'coast',
    dates: '30 April 1930',
    summary: 'The salt coast at the end of C. Rajagopalachari’s 240-kilometre march from Tiruchirappalli, where salt was lifted in defiance of the law on 30 April 1930.',
    description: [
      'Sardar Vedaratnam Pillai organised the coast for the marchers’ arrival. On 30 April 1930 Rajaji walked out to the Edanthevar salt swamp to lift salt and was arrested; mass arrests followed, including — in May — Rukmini Lakshmipathi, the first woman in India jailed in the Salt Satyagraha, and the young K. Kamaraj.[^1]',
    ],
    people: ['c-rajagopalachari', 'rukmini-lakshmipathi', 'k-kamaraj'],
    events: ['vedaranyam-salt-march'],
    sources: [{ title: 'Vedaranyam salt satyagraha records, 1930', publisher: 'Tamil Nadu State Archives', type: 'archive', evidence: 'contemporary' }],
    editorial: checked,
  },
  {
    id: 'dandi',
    slug: 'dandi',
    name: 'Dandi',
    state: 'Gujarat',
    kind: 'coast',
    dates: '6 April 1930',
    summary: 'The beach where, on the morning of 6 April 1930 after twenty-four days’ walking from Sabarmati, Gandhi picked up a lump of natural salt and the Salt Satyagraha began.',
    description: [
      'Gandhi left Sabarmati Ashram on 12 March 1930 with seventy-eight volunteers and walked village to village for twenty-four days as the world’s press followed. At Dandi beach on 6 April he lifted a lump of natural salt; Sarojini Naidu, beside him, cried "Hail, Deliverer!"[^1]',
    ],
    people: ['mahatma-gandhi', 'sarojini-naidu'],
    events: ['dandi-march'],
    sources: [{ title: 'Gandhi: The Years That Changed the World', author: 'Ramachandra Guha', publisher: 'Penguin Allen Lane', year: 2018, type: 'book', evidence: 'scholarship' }],
    editorial: checked,
  },
];

export const placeById = new Map(places.map((p) => [p.id, p]));
export const placeBySlug = new Map(places.map((p) => [p.slug, p]));
