import type { ComponentType } from 'react';
import { loadEvent, loadFighter } from '@/lib/loadContent';

export interface RouteEntry {
  path: string;
  loader: () => Promise<{ default: ComponentType }>;
  /**
   * For routes whose page loads a full record asynchronously on top of its
   * summary (FighterProfilePage, EventPage — see loadContent.ts): prefetches
   * that record so it's already cache-warm before the first hydration
   * render. Without this, that first render would show the loading state
   * (the record's effect hasn't fired yet) while the prerendered snapshot
   * shows the full page, a hydration mismatch.
   */
  preload?: (params: Record<string, string | undefined>) => Promise<unknown>;
}

/**
 * The single source of truth for which page component serves which path —
 * used by App.tsx to build the route table and by main.tsx to preload the
 * one route active on first paint (see setPreloadedRoute below).
 */
export const routeTable: RouteEntry[] = [
  { path: '/', loader: () => import('@/pages/HomePage') },
  { path: '/timeline', loader: () => import('@/pages/TimelinePage') },
  { path: '/fighters', loader: () => import('@/pages/FightersPage') },
  { path: '/fighters/:slug', loader: () => import('@/pages/FighterProfilePage'), preload: (p) => (p.slug ? loadFighter(p.slug) : Promise.resolve()) },
  { path: '/events', loader: () => import('@/pages/EventsPage') },
  { path: '/events/:slug', loader: () => import('@/pages/EventPage'), preload: (p) => (p.slug ? loadEvent(p.slug) : Promise.resolve()) },
  { path: '/movements', loader: () => import('@/pages/MovementsPage') },
  { path: '/movements/:slug', loader: () => import('@/pages/MovementsPage').then((m) => ({ default: m.MovementPage })) },
  { path: '/map', loader: () => import('@/pages/MapPage') },
  { path: '/search', loader: () => import('@/pages/SearchPage') },
  { path: '/learn', loader: () => import('@/pages/LearnPage') },
  { path: '/glossary', loader: () => import('@/pages/GlossaryPage') },
  { path: '/about', loader: () => import('@/pages/AboutPage') },
  { path: '/offline', loader: () => import('@/pages/OfflinePage') },
];

export interface PreloadedRoute {
  path: string;
  Component: ComponentType;
}

/*
 * This is prerendered (not truly server-rendered) HTML: the captured markup
 * has none of React's streaming boundary markers, so hydrateRoot reconciling
 * a <Suspense> *fallback* against real content is a structural mismatch —
 * every prerendered page would flash its loading skeleton and log a
 * hydration warning. Fixed by resolving the current route's module before
 * the very first render and having App.tsx render it directly, without a
 * Suspense wrapper, for that one route only. Every other route keeps normal
 * lazy + Suspense behaviour for in-app navigation.
 */
let preloadedRoute: PreloadedRoute | null = null;
export function setPreloadedRoute(route: PreloadedRoute | null) {
  preloadedRoute = route;
}
export function getPreloadedRoute(): PreloadedRoute | null {
  return preloadedRoute;
}
