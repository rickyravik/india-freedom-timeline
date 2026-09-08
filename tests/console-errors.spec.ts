import { test, expect } from '@playwright/test';

const routes = [
  '/', '/timeline', '/fighters', '/fighters/bhagat-singh', '/events/dandi-march', '/movements/swadeshi-movement', '/map', '/learn',
  // Prerendered without a query string; hydrating with one must not mismatch.
  '/timeline?region=south&view=chapters', '/fighters?q=laxmibai&collection=women', '/events?type=massacre&decade=1910s',
];
const viewports = [
  { width: 375, height: 812 },
  { width: 1440, height: 900 },
];

for (const viewport of viewports) {
  for (const route of routes) {
    test(`no console errors on ${route} at ${viewport.width}px`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));
      await page.setViewportSize(viewport);
      await page.goto(route, { waitUntil: 'networkidle' });
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
}
