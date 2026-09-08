import type { Trail } from '@/types';
import { womenWhoLed } from './women-who-led';
import { tamilNaduCloseToHome } from './tamil-nadu-close-to-home';
import { howResistanceChanged } from './how-resistance-changed';

/** Guided trails — short editorial journeys through existing records. One file per trail; add new ones here. */
export const trails: Trail[] = [womenWhoLed, tamilNaduCloseToHome, howResistanceChanged];

export const trailBySlug = new Map(trails.map((t) => [t.slug, t]));
