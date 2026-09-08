/**
 * Motion policy. One function decides whether anything may move; every
 * animated feature asks it. GSAP is used for exactly one thing — FLIP
 * rearrangement of a filtered list — and is loaded on demand so a reader who
 * never filters never downloads it.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore, type RefObject } from 'react';
import { readPreferences, subscribePreferences, DEFAULT_PREFERENCES } from '@/lib/preferences';

export function motionAllowed({ osReduced, setting }: { osReduced: boolean; setting: 'system' | 'reduce' }): boolean {
  return !osReduced && setting !== 'reduce';
}

const REDUCE = '(prefers-reduced-motion: reduce)';

function subscribeMedia(cb: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

export function useMotionAllowed(): boolean {
  const osReduced = useSyncExternalStore(subscribeMedia, () => window.matchMedia(REDUCE).matches, () => false);
  const prefs = useSyncExternalStore(subscribePreferences, readPreferences, () => DEFAULT_PREFERENCES);
  return motionAllowed({ osReduced, setting: prefs.motion });
}

export interface FlipHandle {
  capture(): void;
}

type Gsap = (typeof import('gsap'))['gsap'];
type FlipPlugin = (typeof import('gsap/Flip'))['Flip'];
interface FlipLib {
  gsap: Gsap;
  Flip: FlipPlugin;
}
let flipLib: Promise<FlipLib> | null = null;
function loadFlip(): Promise<FlipLib> {
  flipLib ??= Promise.all([import('gsap'), import('gsap/Flip')]).then(([{ gsap }, { Flip }]) => {
    gsap.registerPlugin(Flip);
    return { gsap, Flip };
  });
  return flipLib;
}

/**
 * Filter rearrangement: existing items slide to their new place over 220ms,
 * entering items fade in, leaving items are simply gone (they're already out
 * of the DOM by the time we animate — no ghost cards). Call `capture()` in the
 * same event handler that changes the filter; the hook animates from that
 * snapshot after React commits the new list. With motion not allowed, capture
 * is a no-op and the list just updates.
 */
export function useFlipList(container: RefObject<HTMLElement>, itemSelector: string, key: string): FlipHandle {
  const allowed = useMotionAllowed();
  const snapshot = useRef<ReturnType<FlipPlugin['getState']> | null>(null);
  const flip = useRef<FlipLib | null>(null);

  useEffect(() => {
    if (!allowed || flip.current) return;
    let live = true;
    loadFlip().then((m) => {
      if (live) flip.current = m;
    });
    return () => {
      live = false;
    };
  }, [allowed]);

  const capture = useCallback(() => {
    const m = flip.current;
    const el = container.current;
    if (!allowed || !m || !el) return;
    snapshot.current = m.Flip.getState(el.querySelectorAll(itemSelector));
  }, [allowed, container, itemSelector]);

  useLayoutEffect(() => {
    const m = flip.current;
    const state = snapshot.current;
    const el = container.current;
    snapshot.current = null;
    if (!m || !state || !el) return;
    const tween = m.Flip.from(state, {
      targets: el.querySelectorAll(itemSelector),
      duration: 0.22,
      ease: 'power2.out',
      onEnter: (els) => m.gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.22 }),
    });
    return () => {
      tween.kill();
    };
  }, [key, container, itemSelector]);

  return { capture };
}
