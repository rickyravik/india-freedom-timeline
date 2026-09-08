import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getNeedRefresh, subscribeNeedRefresh } from '@/lib/pwa';
import { parseParams, serializeParams, type Schema, type StateOf } from '@/lib/url-state';

/** True only during the build-time prerender capture pass (set by scripts/prerender.mjs via Playwright's addInitScript, never in a real visitor's browser). */
declare global {
  interface Window {
    __PRERENDERING__?: boolean;
  }
}

/* Set in .env; vite.config.ts fails the build if it's missing, so this is never undefined at runtime. */
const SITE_URL = (import.meta.env.VITE_SITE_URL as string).replace(/\/$/, '');

/* ------------------------------------------------------------------ */
/* Media & motion                                                      */

function useMatchMedia(query: string, fallback = false): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => fallback);
}

/** Respect the user's reduced-motion preference. */
export function useReducedMotion(): boolean {
  return useMatchMedia('(prefers-reduced-motion: reduce)');
}

/** True at the md breakpoint and above (768px). */
export function useIsDesktop(): boolean {
  return useMatchMedia('(min-width: 768px)', true);
}

/* ------------------------------------------------------------------ */
/* Scroll reveal — a single shared IntersectionObserver.               */

let revealObserver: IntersectionObserver | null = null;
function getRevealObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  revealObserver ??= new IntersectionObserver(
    (entries) => {
      if (window.__PRERENDERING__) return; // don't bake viewport-dependent state into a captured snapshot
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  return revealObserver;
}

/**
 * Attach to an element with the `reveal` (or `reveal-mask`) class.
 * Adds `in-view` when it scrolls into view; falls back to immediately
 * visible when observers are unavailable or motion is reduced.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = reduced ? null : getRevealObserver();
    if (!observer) {
      el.classList.add('in-view');
      return;
    }
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [reduced]);
  return ref;
}

/* ------------------------------------------------------------------ */
/* Active section tracking (era rail)                                  */

export function useActiveSection(ids: string[], rootMargin = '-40% 0px -55% 0px'): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin, threshold: 0 },
    );
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => Boolean(e));
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join('|'), rootMargin]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}

/* ------------------------------------------------------------------ */
/* Bookmarks (localStorage)                                            */

const BOOKMARKS_KEY = 'ift-bookmarks-v1';
const bookmarkListeners = new Set<() => void>();
let bookmarksCache: string[] | null = null;

function readBookmarks(): string[] {
  if (bookmarksCache) return bookmarksCache;
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    bookmarksCache = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    bookmarksCache = [];
  }
  return bookmarksCache;
}

/* A stable, shared reference: useSyncExternalStore compares getServerSnapshot's
   return value with Object.is, so a fresh `[]` literal on every call reads as
   "always different" and breaks hydration (confirmed: it produced React's
   "getServerSnapshot should be cached" warning and real hydration mismatches
   once real hydration — not just createRoot — started happening in Phase 2). */
const EMPTY_STRINGS: string[] = [];

function writeBookmarks(next: string[]) {
  bookmarksCache = next;
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  } catch {
    /* in-memory only */
  }
  bookmarkListeners.forEach((l) => l());
}

export function useBookmarks() {
  const subscribe = useCallback((cb: () => void) => {
    bookmarkListeners.add(cb);
    return () => bookmarkListeners.delete(cb);
  }, []);
  const bookmarks = useSyncExternalStore(subscribe, readBookmarks, () => EMPTY_STRINGS);
  const toggle = useCallback((slug: string) => {
    const current = readBookmarks();
    writeBookmarks(current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
  }, []);
  return { bookmarks, toggle };
}

/* ------------------------------------------------------------------ */
/* Trail — recently viewed lives (sessionStorage)                      */

const TRAIL_KEY = 'ift-trail-v1';
const trailListeners = new Set<() => void>();
let trailCache: string[] | null = null;

function readTrail(): string[] {
  if (trailCache) return trailCache;
  try {
    const raw = sessionStorage.getItem(TRAIL_KEY);
    trailCache = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    trailCache = [];
  }
  return trailCache;
}

export function pushTrail(slug: string) {
  const next = [slug, ...readTrail().filter((s) => s !== slug)].slice(0, 8);
  trailCache = next;
  try {
    sessionStorage.setItem(TRAIL_KEY, JSON.stringify(next));
  } catch {
    /* in-memory only */
  }
  trailListeners.forEach((l) => l());
}

export function useTrail(): string[] {
  const subscribe = useCallback((cb: () => void) => {
    trailListeners.add(cb);
    return () => trailListeners.delete(cb);
  }, []);
  return useSyncExternalStore(subscribe, readTrail, () => EMPTY_STRINGS);
}

/* ------------------------------------------------------------------ */
/* URL state                                                           */

/** True only during the first render of a prerendered page in a real browser
    (set on #root by main.tsx before hydrateRoot, cleared by App afterwards).
    Prerendered HTML was captured with no query string, so any state that
    normally initialises from the URL must initialise to its defaults during
    this one render or React reports a hydration mismatch. */
export function isHydratingFirstRender(): boolean {
  return typeof document !== 'undefined' && document.getElementById('root')?.dataset.hydrating === 'true';
}

const EMPTY_PARAMS = new URLSearchParams();

/**
 * Filter/view state that lives in the query string. `schema` must be a
 * module-scope constant. Returns [state, update(patch), reset()]. Writes use
 * replace, so typing in a filter never litters history; back/forward still
 * re-read the URL.
 */
export function useUrlState<S extends Schema>(schema: S): [StateOf<S>, (patch: Partial<StateOf<S>>) => void, () => void] {
  const [params, setParams] = useSearchParams();
  const deferred = useRef(isHydratingFirstRender());
  const [state, setState] = useState<StateOf<S>>(() => parseParams(schema, deferred.current ? EMPTY_PARAMS : params));
  const stateRef = useRef(state);
  stateRef.current = state;

  /* After hydration, adopt what the URL actually says. */
  useEffect(() => {
    if (!deferred.current) return;
    deferred.current = false;
    setState(parseParams(schema, new URLSearchParams(window.location.search)));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Back/forward (or a Link to the same page with other params). */
  const paramsKey = params.toString();
  useEffect(() => {
    if (deferred.current) return;
    setState(parseParams(schema, params));
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback(
    (patch: Partial<StateOf<S>>) => {
      const next = { ...stateRef.current, ...patch };
      setState(next);
      setParams(serializeParams(schema, next, new URLSearchParams(window.location.search)), { replace: true });
    },
    [schema, setParams],
  );
  const reset = useCallback(() => update(parseParams(schema, EMPTY_PARAMS)), [schema, update]);

  return [state, update, reset];
}

/* ------------------------------------------------------------------ */
/* Page meta                                                           */

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

/**
 * Sets the document title, description and (new) canonical/Open Graph/
 * Twitter tags for the current route, then marks the page ready for the
 * build-time prerender script to capture (`data-prerender-ready`) — see
 * scripts/prerender.mjs, which waits on that flag before snapshotting.
 *
 * `deferReady` is for pages that load their real content asynchronously
 * (a fighter/event's full record, lazily loaded): they pass it and set the
 * flag themselves once that load resolves, instead of it happening here
 * immediately.
 */
export function usePageMeta(
  title: string,
  description?: string,
  opts?: { type?: 'website' | 'article'; image?: string; deferReady?: boolean },
) {
  const { pathname } = useLocation();
  useEffect(() => {
    const fullTitle = title ? `${title} — India's Freedom Timeline` : "India's Freedom Timeline";
    document.title = fullTitle;
    const url = `${SITE_URL}${pathname}`;
    upsertCanonical(url);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', opts?.type ?? 'website');
    // Always summary_large_image: every page carries an OG image, either its
    // own (below) or the site default already baked into index.html's head.
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
      upsertMeta('name', 'twitter:description', description);
    }
    if (opts?.image) {
      const imageUrl = `${SITE_URL}${opts.image}`;
      upsertMeta('property', 'og:image', imageUrl);
      upsertMeta('property', 'og:image:width', '1200');
      upsertMeta('property', 'og:image:height', '630');
      upsertMeta('name', 'twitter:image', imageUrl);
    }
    if (!opts?.deferReady) document.documentElement.dataset.prerenderReady = 'true';
  }, [title, description, pathname, opts?.type, opts?.image, opts?.deferReady]);
}

/* ------------------------------------------------------------------ */
/* Share                                                               */

export function useShare() {
  const [copied, setCopied] = useState(false);
  const share = useCallback(async (title: string, text: string, path: string) => {
    const url = `${window.location.origin}${path}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, []);
  return { share, copied };
}

/* ------------------------------------------------------------------ */
/* Service worker update — see src/lib/pwa.ts                          */

export function useServiceWorkerUpdate(): boolean {
  return useSyncExternalStore(subscribeNeedRefresh, getNeedRefresh, () => false);
}

/* ------------------------------------------------------------------ */
/* Keyboard shortcut                                                   */

export function useKeyboardShortcut(match: (e: KeyboardEvent) => boolean, handler: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (typing && !(e.metaKey || e.ctrlKey)) return;
      if (match(e)) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [match, handler]);
}
