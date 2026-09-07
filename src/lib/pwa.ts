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
