import type { Organization } from '@/types';

export const organizations: Organization[] = [
  {
    id: 'inc',
    slug: 'indian-national-congress',
    name: 'Indian National Congress',
    foundedYear: 1885,
    foundedLabel: 'Bombay, December 1885',
    summary:
      'Founded in 1885, the Congress grew from an annual gathering of lawyers and reformers into the mass organization that led Non-Cooperation, Civil Disobedience and Quit India.',
    type: 'political',
  },
  {
    id: 'servants-of-india-society',
    slug: 'servants-of-india-society',
    name: 'Servants of India Society',
    foundedYear: 1905,
    foundedLabel: 'Pune, 1905',
    summary:
      'Gopal Krishna Gokhale’s society trained "national missionaries" who took lifelong vows of poverty and public service, shaping a generation of constructive workers.',
    type: 'social',
  },
  {
    id: 'anushilan-samiti',
    slug: 'anushilan-samiti',
    name: 'Anushilan Samiti',
    foundedYear: 1902,
    foundedLabel: 'Calcutta, 1902',
    summary:
      'A network of Bengali youth societies that combined physical training with underground revolutionary organization against British rule.',
    type: 'revolutionary',
  },
  {
    id: 'jugantar',
    slug: 'jugantar',
    name: 'Jugantar',
    foundedYear: 1906,
    foundedLabel: 'Calcutta, 1906',
    summary:
      'The more militant offshoot of the Anushilan network, associated with Bagha Jatin and armed actions in Bengal through the First World War.',
    type: 'revolutionary',
  },
  {
    id: 'abhinav-bharat',
    slug: 'abhinav-bharat',
    name: 'Abhinav Bharat Society',
    foundedYear: 1904,
    foundedLabel: 'Nashik, 1904',
    summary:
      'A secret society founded by the Savarkar brothers that linked young revolutionaries in western India with the India House circle in London.',
    type: 'revolutionary',
  },
  {
    id: 'india-house',
    slug: 'india-house',
    name: 'India House',
    foundedYear: 1905,
    foundedLabel: 'London, 1905',
    summary:
      'Shyamji Krishna Varma’s hostel for Indian students in Highgate became the hub of expatriate revolutionary nationalism in Edwardian London.',
    type: 'revolutionary',
  },
  {
    id: 'ghadar-party',
    slug: 'ghadar-party',
    name: 'Ghadar Party',
    foundedYear: 1913,
    foundedLabel: 'San Francisco, 1913',
    summary:
      'Punjabi farmers, labourers and students on the Pacific coast of North America organized to overthrow British rule by armed revolt, publishing the fiery weekly "Ghadar".',
    type: 'revolutionary',
  },
  {
    id: 'home-rule-leagues',
    slug: 'home-rule-leagues',
    name: 'Home Rule Leagues',
    foundedYear: 1916,
    foundedLabel: '1916',
    summary:
      'Twin leagues led by Bal Gangadhar Tilak and Annie Besant that demanded self-government within the Empire and revived nationalist politics during the First World War.',
    type: 'political',
  },
  {
    id: 'khilafat-committee',
    slug: 'khilafat-committee',
    name: 'All India Khilafat Committee',
    foundedYear: 1919,
    foundedLabel: '1919',
    summary:
      'Organised to defend the Ottoman Caliphate after the First World War, the Khilafat movement allied with Congress and brought vast numbers of Muslims into the national struggle.',
    type: 'political',
  },
  {
    id: 'khudai-khidmatgar',
    slug: 'khudai-khidmatgar',
    name: 'Khudai Khidmatgar',
    foundedYear: 1929,
    foundedLabel: 'North-West Frontier Province, 1929',
    summary:
      '"Servants of God" — Khan Abdul Ghaffar Khan’s remarkable movement of Pashtun nonviolent resisters, tens of thousands strong, who faced brutal repression without retaliation.',
    type: 'social',
  },
  {
    id: 'hra',
    slug: 'hindustan-republican-association',
    name: 'Hindustan Republican Association',
    foundedYear: 1924,
    foundedLabel: 'Kanpur, 1924',
    summary:
      'Founded by Ram Prasad Bismil, Sachindra Nath Sanyal and others to organize armed revolution; its Kakori train action of 1925 led to executions and long sentences.',
    type: 'revolutionary',
  },
  {
    id: 'hsra',
    slug: 'hindustan-socialist-republican-association',
    name: 'Hindustan Socialist Republican Association',
    foundedYear: 1928,
    foundedLabel: 'Delhi, September 1928',
    summary:
      'The HRA reorganised at Ferozeshah Kotla under Chandrashekhar Azad and Bhagat Singh, adding a socialist goal to the revolutionary programme.',
    type: 'revolutionary',
  },
  {
    id: 'naujawan-bharat-sabha',
    slug: 'naujawan-bharat-sabha',
    name: 'Naujawan Bharat Sabha',
    foundedYear: 1926,
    foundedLabel: 'Lahore, 1926',
    summary:
      'A youth organization founded by Bhagat Singh and comrades to spread anti-colonial, rationalist and socialist ideas among students and workers of Punjab.',
    type: 'political',
  },
  {
    id: 'indian-republican-army',
    slug: 'indian-republican-army-chattogram',
    name: 'Indian Republican Army (Chattogram branch)',
    foundedYear: 1930,
    foundedLabel: 'Chittagong, 1930',
    summary:
      'Surya Sen’s revolutionary group, named after the Irish Republican Army, which carried out the Chittagong armoury raid of April 1930.',
    type: 'revolutionary',
  },
  {
    id: 'congress-socialist-party',
    slug: 'congress-socialist-party',
    name: 'Congress Socialist Party',
    foundedYear: 1934,
    foundedLabel: '1934',
    summary:
      'The socialist caucus within Congress, led by Jayaprakash Narayan and others, which ran much of the underground during the Quit India movement.',
    type: 'political',
  },
  {
    id: 'forward-bloc',
    slug: 'forward-bloc',
    name: 'All India Forward Bloc',
    foundedYear: 1939,
    foundedLabel: '1939',
    summary:
      'Subhas Chandra Bose’s platform after his resignation as Congress president, seeking to consolidate the left for an immediate mass struggle.',
    type: 'political',
  },
  {
    id: 'indian-independence-league',
    slug: 'indian-independence-league',
    name: 'Indian Independence League',
    foundedYear: 1942,
    foundedLabel: 'Southeast Asia, 1942',
    summary:
      'The expatriate organization of Indians in Southeast Asia, under Rash Behari Bose and later Subhas Chandra Bose, which raised and supported the Indian National Army.',
    type: 'political',
  },
  {
    id: 'azad-hind-fauj',
    slug: 'azad-hind-fauj',
    name: 'Indian National Army (Azad Hind Fauj)',
    foundedYear: 1942,
    foundedLabel: 'Singapore, 1942; revived 1943',
    summary:
      'An army of Indian prisoners of war and civilian volunteers that fought the British in Burma and Northeast India under Subhas Chandra Bose’s Provisional Government of Free India.',
    type: 'military',
  },
  {
    id: 'muslim-league',
    slug: 'all-india-muslim-league',
    name: 'All-India Muslim League',
    foundedYear: 1906,
    foundedLabel: 'Dacca, 1906',
    summary:
      'Founded to represent Muslim political interests; it cooperated with Congress in the 1916 Lucknow Pact and later, under Jinnah, demanded a separate state of Pakistan.',
    type: 'political',
  },
  {
    id: 'aiwc',
    slug: 'all-india-womens-conference',
    name: 'All India Women’s Conference',
    foundedYear: 1927,
    foundedLabel: '1927',
    summary:
      'A pioneering women’s organization whose members — including Sarojini Naidu and Kamaladevi Chattopadhyay — linked women’s rights to the national movement.',
    type: 'social',
  },
];

export const organizationById = new Map(organizations.map((o) => [o.id, o]));
