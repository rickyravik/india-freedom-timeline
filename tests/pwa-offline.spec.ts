import { test, expect } from '@playwright/test';

/**
 * Exercises the service worker's offline machinery (src/sw.ts) directly
 * against Cache Storage rather than by simulating a dropped connection:
 * a real active service worker's own outbound fetch (the one StaleWhileRevalidate
 * issues on a cache miss, from inside respondWith) runs in the worker's own
 * execution context, not the page's — confirmed by testing, neither
 * context.route(...).abort() nor context.setOffline sees or blocks it in
 * this Chromium/Playwright combination, so a live navigation to an
 * intentionally-uncached route can't be used to prove the fallback fires.
 * Checking what actually landed in each named cache is deterministic and
 * environment-independent, and covers the same code paths.
 */
test('service worker precaches the shell and offline page, and caches visited navigations', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => navigator.serviceWorker.ready.then(() => true));

  // install-time: caches.open('offline-fallback').then(c => c.add(OFFLINE_URL))
  await expect
    .poll(async () =>
      page.evaluate(async () => {
        const cache = await caches.open('offline-fallback');
        return (await cache.match('/offline/index.html')) !== undefined;
      }),
    )
    .toBe(true);

  // precacheAndRoute(self.__WB_MANIFEST): the app shell's own document.
  const shellPrecached = await page.evaluate(async () => {
    const keys = await caches.keys();
    const precacheName = keys.find((k) => k.includes('precache'));
    if (!precacheName) return false;
    const entries = await (await caches.open(precacheName)).keys();
    return entries.some((r) => new URL(r.url).pathname === '/index.html');
  });
  expect(shellPrecached).toBe(true);

  // A real navigation should land in the runtime "pages" cache (the
  // StaleWhileRevalidate route registered for request.mode === 'navigate').
  await page.goto('/timeline', { waitUntil: 'networkidle' });
  await expect
    .poll(async () =>
      page.evaluate(async () => {
        const cache = await caches.open('pages');
        return (await cache.match(window.location.href)) !== undefined;
      }),
    )
    .toBe(true);

  // A page already in that cache renders with no network at all — a cache
  // hit is served synchronously from Cache Storage, so this holds regardless
  // of whether the emulated "offline" state also reaches the service
  // worker's own fetches.
  await page.context().setOffline(true);
  await page.reload();
  await expect(page.locator('h1')).toBeVisible();
  await page.context().setOffline(false);
});
