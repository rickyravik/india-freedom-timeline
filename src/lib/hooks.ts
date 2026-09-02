import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

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
  const bookmarks = useSyncExternalStore(subscribe, readBookmarks, () => [] as string[]);
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
  return useSyncExternalStore(subscribe, readTrail, () => [] as string[]);
}

/* ------------------------------------------------------------------ */
/* Page meta                                                           */

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — India's Freedom Timeline` : "India's Freedom Timeline";
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);
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
