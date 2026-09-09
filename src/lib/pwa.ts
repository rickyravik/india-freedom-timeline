/**
 * Registers the service worker (src/sw.ts) and exposes "a new version is
 * ready" as a tiny pub-sub store — the same useSyncExternalStore idiom as
 * useBookmarks/useTrail in hooks.ts — so UpdateToast can subscribe without
 * owning the registration itself.
 */
import { registerSW } from 'virtual:pwa-register';
import { track } from '@/lib/analytics';

const listeners = new Set<() => void>();
let needRefresh = false;
let applyUpdate: ((reloadPage?: boolean) => Promise<void>) | undefined;

function notify() {
  listeners.forEach((l) => l());
}

/** Call once, from main.tsx — never during the prerender capture pass. */
export function initServiceWorker() {
  window.addEventListener('appinstalled', () => track('pwa_install_accepted'));
  if (!('serviceWorker' in navigator)) return;
  applyUpdate = registerSW({
    onNeedRefresh() {
      needRefresh = true;
      notify();
    },
  });
}

export function subscribeNeedRefresh(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getNeedRefresh(): boolean {
  return needRefresh;
}

/** Activates the waiting service worker and reloads once it takes control. */
export function acceptUpdate() {
  void applyUpdate?.(true);
}

export function dismissUpdate() {
  needRefresh = false;
  notify();
}

/** Saves a trail's pages (and portraits) for offline reading. Resolves once
    the service worker confirms every URL is cached. */
export function cacheTrail(slug: string, urls: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator)) {
      reject(new Error('Service workers are not supported here.'));
      return;
    }
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'TRAIL_CACHED' && event.data.slug === slug) {
        navigator.serviceWorker.removeEventListener('message', onMessage);
        resolve();
      }
    };
    navigator.serviceWorker.addEventListener('message', onMessage);
    void navigator.serviceWorker.ready.then((reg) => reg.active?.postMessage({ type: 'CACHE_TRAIL', slug, urls }));
  });
}

export async function dropTrail(slug: string): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  reg.active?.postMessage({ type: 'DROP_TRAIL', slug });
}

export async function isTrailCached(slug: string): Promise<boolean> {
  if (!('caches' in window)) return false;
  return caches.has(`trail-${slug}`);
}
