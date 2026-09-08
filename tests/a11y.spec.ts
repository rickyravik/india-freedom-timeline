import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/start', '/timeline', '/fighters', '/fighters/velu-nachiyar', '/events', '/events/dandi-march', '/movements/civil-disobedience-movement', '/map', '/map?view=list', '/learn', '/trails', '/trails/women-who-led', '/trails/women-who-led/stop/1', '/trails/women-who-led/finish', '/glossary', '/about', '/search?q=salt'];

for (const route of routes) {
  for (const width of [375, 1280]) {
    test(`axe: no WCAG 2.2 AA violations on ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: 'networkidle' });
      // A webfont still swapping in when axe measures color-contrast can
      // transiently report a false failure against the fallback face's
      // rendering; wait for the real faces first.
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']).disableRules(['region']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
}

test('primary touch targets are at least 44px on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/fighters/bhagat-singh');
  for (const name of ['Next chapter', 'Previous chapter', 'Save this story', 'Share']) {
    const box = await page.getByRole('button', { name }).boundingBox();
    expect(box!.height, name).toBeGreaterThanOrEqual(44);
    expect(box!.width, name).toBeGreaterThanOrEqual(44);
  }
  const dot = page.getByRole('button', { name: /^Chapter 2:/ });
  const dotBox = await dot.boundingBox();
  expect(dotBox!.height).toBeGreaterThanOrEqual(44);
  expect(dotBox!.width).toBeGreaterThanOrEqual(44);
});

test('the focused control is never hidden under the sticky header or the phone bar', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/glossary');
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab');
    // Skip the check for the skip-link itself (by design it floats above the
    // header when focused), the sticky header's own children (they belong
    // there), and once focus reaches the fixed bottom bar's own links —
    // being *in* the bar or header is correct, not "hidden behind" it.
    const info = await page.evaluate(() => {
      const el = document.activeElement!;
      const bar = document.querySelector('nav[aria-label="Primary"].fixed');
      const header = document.querySelector('header');
      return {
        rect: el.getBoundingClientRect().toJSON(),
        inBar: Boolean(bar?.contains(el)),
        inHeader: Boolean(header?.contains(el)),
        isSkipLink: el.getAttribute('href') === '#main',
      };
    });
    if (info.inBar || info.inHeader || info.isSkipLink) continue;
    const barTop = await page.evaluate(() => document.querySelector('nav[aria-label="Primary"].fixed')!.getBoundingClientRect().top);
    // A couple of CSS px of tolerance for sub-pixel layout rounding, not a
    // real overlap a reader would ever notice.
    expect(info.rect.top, `tab ${i + 1}`).toBeGreaterThanOrEqual(62);
    expect(info.rect.bottom, `tab ${i + 1}`).toBeLessThanOrEqual(barTop + 2);
  }
});
