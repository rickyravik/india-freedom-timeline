import { test, expect } from '@playwright/test';

const routes = ['/', '/timeline', '/fighters', '/fighters/veerapandiya-kattabomman', '/events', '/map', '/learn', '/trails/tamil-nadu-close-to-home/stop/2', '/glossary'];
const sizes = [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 812, height: 375 }, // phone landscape
];

for (const size of sizes) {
  for (const route of routes) {
    test(`no horizontal page overflow on ${route} at ${size.width}×${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto(route, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'page scrolls sideways').toBeLessThanOrEqual(1);
      await expect(page.locator('main h1').first()).toBeVisible();
    });
  }
}

test('with browser text at 150% the profile still reads without sideways scrolling and the primary action is reachable', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/fighters/rani-gaidinliu');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '150%';
  });
  await page.waitForTimeout(200);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole('button', { name: 'Save this story' })).toBeVisible();
});

test('the map keeps its intentional sideways scroll inside the sheet, not on the page', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/map');
  const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(pageOverflow).toBeLessThanOrEqual(1);
  const sheetScrolls = await page.locator('.scrollbar-thin-archival').first().evaluate((el) => el.scrollWidth > el.clientWidth);
  expect(sheetScrolls).toBe(true);
});

test('portraits are lazy, sized, and replaced by monograms under the low-data preference', async ({ page }) => {
  await page.goto('/fighters');
  const img = page.locator('img[src*="/images/fighters/"]').first();
  await expect(img).toHaveAttribute('loading', 'lazy');
  await expect(img).toHaveAttribute('decoding', 'async');
  await expect(img).toHaveAttribute('width', /\d+/);
  await expect(img).toHaveAttribute('height', /\d+/);
  await page.evaluate(() => localStorage.setItem('ift-prefs-v1', JSON.stringify({ lowData: true })));
  await page.reload();
  await expect(page.locator('img[src*="/images/fighters/"]')).toHaveCount(0);
  await expect(page.locator('.medallion-plate').first()).toBeVisible();
});
