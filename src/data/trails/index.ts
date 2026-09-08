import type { Trail } from '@/types';

/** Guided trails — short editorial journeys through existing records. One file per trail; add new ones here. */
export const trails: Trail[] = [];

export const trailBySlug = new Map(trails.map((t) => [t.slug, t]));
