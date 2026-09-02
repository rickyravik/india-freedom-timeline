import type { RegionId, StateInfo } from '@/types';

export const regionNames: Record<RegionId, string> = {
  north: 'North India',
  south: 'South India',
  east: 'East India',
  west: 'West India',
  central: 'Central India',
  northeast: 'Northeast India',
  abroad: 'Abroad',
};

export const regionIds = Object.keys(regionNames) as RegionId[];

/**
 * States shown on the stylised tile map (col/row place each tile on a
 * schematic grid — deliberately NOT a geographic boundary map).
 * Names are modern states, used so visitors can explore by the places
 * they know today.
 */
export const states: StateInfo[] = [
  { id: 'jammu-kashmir', name: 'Jammu & Kashmir', region: 'north', col: 3, row: 1 },
  { id: 'punjab', name: 'Punjab', region: 'north', col: 2, row: 2 },
  { id: 'delhi', name: 'Delhi', region: 'north', col: 3, row: 3 },
  { id: 'rajasthan', name: 'Rajasthan', region: 'west', col: 2, row: 3 },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', region: 'north', col: 4, row: 3 },
  { id: 'bihar', name: 'Bihar', region: 'east', col: 5, row: 3 },
  { id: 'assam', name: 'Assam', region: 'northeast', col: 7, row: 2 },
  { id: 'nagaland', name: 'Nagaland', region: 'northeast', col: 8, row: 2 },
  { id: 'meghalaya', name: 'Meghalaya', region: 'northeast', col: 7, row: 3 },
  { id: 'manipur', name: 'Manipur', region: 'northeast', col: 8, row: 3 },
  { id: 'gujarat', name: 'Gujarat', region: 'west', col: 1, row: 4 },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh', region: 'central', col: 3, row: 4 },
  { id: 'jharkhand', name: 'Jharkhand', region: 'east', col: 5, row: 4 },
  { id: 'west-bengal', name: 'West Bengal', region: 'east', col: 6, row: 4 },
  { id: 'maharashtra', name: 'Maharashtra', region: 'west', col: 2, row: 5 },
  { id: 'chhattisgarh', name: 'Chhattisgarh', region: 'central', col: 4, row: 5 },
  { id: 'odisha', name: 'Odisha', region: 'east', col: 5, row: 5 },
  { id: 'telangana', name: 'Telangana', region: 'south', col: 3, row: 6 },
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', region: 'south', col: 4, row: 6 },
  { id: 'karnataka', name: 'Karnataka', region: 'south', col: 3, row: 7 },
  { id: 'kerala', name: 'Kerala', region: 'south', col: 3, row: 8 },
  { id: 'tamil-nadu', name: 'Tamil Nadu', region: 'south', col: 4, row: 8 },
  { id: 'abroad', name: 'Abroad', region: 'abroad', col: 1, row: 1 },
];

export const stateById = new Map(states.map((s) => [s.id, s]));
export const stateByName = new Map(states.map((s) => [s.name, s]));
