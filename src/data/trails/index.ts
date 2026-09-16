import type { Trail } from '@/types';
import { womenWhoLed } from './women-who-led';
import { tamilNaduCloseToHome } from './tamil-nadu-close-to-home';
import { howResistanceChanged } from './how-resistance-changed';
import { theYearTheCompanyFell } from './the-year-the-company-fell';
import { anArmyInExile } from './an-army-in-exile';
import { theForestFightsBack } from './the-forest-fights-back';
import { beforeTheEmpire } from './before-the-empire';
import { theRevolutionaryRoad } from './the-revolutionary-road';
import { hillsThatWouldNotBeRuled } from './hills-that-would-not-be-ruled';

/** Guided trails: short editorial journeys through existing records. One file per trail; add new ones here. The prelude goes first. */
export const trails: Trail[] = [beforeTheEmpire, womenWhoLed, tamilNaduCloseToHome, howResistanceChanged, theRevolutionaryRoad, theForestFightsBack, hillsThatWouldNotBeRuled, theYearTheCompanyFell, anArmyInExile];

export const trailBySlug = new Map(trails.map((t) => [t.slug, t]));
