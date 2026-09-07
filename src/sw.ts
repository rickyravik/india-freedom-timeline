/// <reference lib="webworker" />
/**
 * Hand-written navigation caching, not generateSW's default navigateFallback:
 * that option registers its NavigationRoute ahead of any runtimeCaching rule
 * and wins unconditionally, silently defeating a cache-first-with-revalidate
 * strategy for navigations. Using injectManifest instead gives full control —
 * precache the app shell, then register exactly the one navigation route we
 * want, with the offline page as its final fallback.
 */
import { cleanupOutdatedCaches, precacheAndRoute, type PrecacheEntry } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: (PrecacheEntry | string)[] };

// Injected at build time by vite-plugin-pwa (injectManifest strategy) with
// the JS/CSS/font assets and the app-shell HTML matched by
// injectManifest.globPatterns in vite.config.ts — OG images and per-record
// prerendered pages are deliberately excluded; this is the shell only.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// The offline fallback page (see OfflinePage.tsx and routes.tsx) is fetched
// and cached here at install time, not via precacheAndRoute's build-time
// manifest: it's written by scripts/prerender.mjs, which runs after `vite
// build` (and therefore after injectManifest scans dist/), so it doesn't
// exist yet when the precache manifest is generated. Used only to look the
// cached response up below, never as the URL shown to the visitor, so it
// doesn't need to match the request's own (possibly pretty) URL.
const OFFLINE_URL = '/offline/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('offline-fallback').then((cache) => cache.add(OFFLINE_URL)));
});

const pages = new StaleWhileRevalidate({
  cacheName: 'pages',
  plugins: [new ExpirationPlugin({ maxEntries: 60 })],
});

registerRoute(
  ({ request }) => request.mode === 'navigate',
  async (options) => {
    try {
      return await pages.handle(options);
    } catch {
      return (await caches.match(OFFLINE_URL)) ?? Response.error();
    }
  },
);

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
