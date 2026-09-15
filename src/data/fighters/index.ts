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
import { odishaFighters } from './odisha';
import { karnatakaFighters } from './karnataka';
import { keralaFighters } from './kerala';
import { andhraTelanganaFighters } from './andhra-telangana';
import { northeastLeaders } from './northeast-leaders';

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
  ...odishaFighters,
  ...karnatakaFighters,
  ...keralaFighters,
  ...andhraTelanganaFighters,
  ...northeastLeaders,
];

export const fighterById = new Map(fighters.map((f) => [f.id, f]));
export const fighterBySlug = new Map(fighters.map((f) => [f.slug, f]));
