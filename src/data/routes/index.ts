import type { Route } from '@/types';
import { dandiMarch } from './dandi-march';

export const routes: Route[] = [dandiMarch];
export const routeBySlug = new Map(routes.map((r) => [r.slug, r]));
