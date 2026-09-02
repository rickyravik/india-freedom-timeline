import type { FreedomFighter } from '@/types';
import { earlyResistanceFighters } from './early-resistance';
import { revoltFighters } from './revolt-1857';
import { nationalistFighters } from './nationalists';
import { swadeshiRevolutionaries } from './swadeshi-revolutionaries';
import { gandhianEraFighters } from './gandhian-era';
import { hsraRevolutionaries } from './hsra-revolutionaries';
import { tribalLeaders } from './tribal-leaders';
import { quitIndiaInaFighters } from './quit-india-ina';
import { tamilNaduFighters } from './tamil-nadu';

export const fighters: FreedomFighter[] = [
  ...earlyResistanceFighters,
  ...revoltFighters,
  ...nationalistFighters,
  ...swadeshiRevolutionaries,
  ...gandhianEraFighters,
  ...hsraRevolutionaries,
  ...tribalLeaders,
  ...quitIndiaInaFighters,
  ...tamilNaduFighters,
];

export const fighterById = new Map(fighters.map((f) => [f.id, f]));
export const fighterBySlug = new Map(fighters.map((f) => [f.slug, f]));
