import type { Era } from '@/types';

/**
 * The nine broad phases the timeline is organised around.
 * Boundaries are navigational aids, not hard historical breaks.
 */
export const eras: Era[] = [
  {
    id: 'early-resistance',
    name: 'Early Resistance',
    startYear: 1757,
    endYear: 1856,
    tagline: 'The first sparks',
    description:
      'From the Battle of Plassey onwards, the East India Company expanded across the subcontinent — and met armed resistance from rulers, peasants, and Adivasi communities from Kerala to the Khasi Hills.',
    accent: 'sepia',
  },
  {
    id: 'revolt-1857',
    name: 'The Revolt of 1857',
    startYear: 1857,
    endYear: 1858,
    tagline: 'The great uprising',
    description:
      'Sepoys, dispossessed rulers, peasants and townspeople rose together across northern and central India in the largest anti-colonial rebellion of the nineteenth century. Its suppression ended Company rule and brought India under the British Crown.',
    accent: 'oxide',
  },
  {
    id: 'rise-of-nationalism',
    name: 'Rise of Nationalism',
    startYear: 1859,
    endYear: 1904,
    tagline: 'Petitions, presses and new politics',
    description:
      'A generation of lawyers, journalists and reformers built the first all-India political institutions — above all the Indian National Congress in 1885 — while Adivasi uprisings such as Birsa Munda’s Ulgulan continued armed resistance.',
    accent: 'brass',
  },
  {
    id: 'swadeshi-era',
    name: 'Swadeshi & Revolution',
    startYear: 1905,
    endYear: 1913,
    tagline: 'Boycott, boldness and bombs',
    description:
      'The Partition of Bengal in 1905 ignited the Swadeshi movement — boycotts of British goods, national schools and Indian enterprise — and pushed a young generation towards secret revolutionary societies at home and abroad.',
    accent: 'saffron',
  },
  {
    id: 'war-and-home-rule',
    name: 'War & Home Rule',
    startYear: 1914,
    endYear: 1918,
    tagline: 'Demands grow louder',
    description:
      'While the First World War drew over a million Indian soldiers abroad, the Ghadar Party plotted revolt, and Tilak and Annie Besant’s Home Rule Leagues carried the demand for self-government into towns across India.',
    accent: 'forest',
  },
  {
    id: 'non-cooperation',
    name: 'Non-Cooperation Era',
    startYear: 1919,
    endYear: 1927,
    tagline: 'A nation says no',
    description:
      'After the Rowlatt Act and the Jallianwala Bagh massacre, Gandhi turned Congress into a mass movement. Millions joined Non-Cooperation and Khilafat; revolutionaries regrouped in the Hindustan Republican Association.',
    accent: 'indigo',
  },
  {
    id: 'civil-disobedience',
    name: 'Civil Disobedience',
    startYear: 1928,
    endYear: 1938,
    tagline: 'Salt, satyagraha and sacrifice',
    description:
      'From the Simon Commission boycott to the Dandi March and the Chittagong armoury raid, Indians defied colonial law en masse — in salt pans, forests, courts and prisons — while Bhagat Singh’s generation faced the gallows.',
    accent: 'saffron',
  },
  {
    id: 'quit-india-and-ina',
    name: 'Quit India & the INA',
    startYear: 1939,
    endYear: 1945,
    tagline: 'Do or die',
    description:
      'The Second World War brought the struggle to its climax: the Quit India uprising of 1942 met fierce repression at home, while Subhas Chandra Bose’s Indian National Army fought under the flag of Azad Hind abroad.',
    accent: 'oxide',
  },
  {
    id: 'freedom-at-midnight',
    name: 'Freedom at Midnight',
    startYear: 1946,
    endYear: 1947,
    tagline: 'Independence — and Partition',
    description:
      'Naval ratings mutinied in Bombay, the INA trials electrified the country, and negotiations raced towards transfer of power. On 15 August 1947 India became free — amid the trauma of Partition.',
    accent: 'indigo',
  },
];

export const eraById = new Map(eras.map((e) => [e.id, e]));

export function eraForYear(year: number): Era | undefined {
  return eras.find((e) => year >= e.startYear && year <= e.endYear);
}
