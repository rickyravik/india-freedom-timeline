import { test, expect } from '@playwright/test';

/**
 * Regression: once .page-enter's keyframes actually ran (Stage 3), the page
 * sheet kept a transform after the animation, which made it the containing
 * block for every `position: fixed` descendant — the reading-settings sheet
 * was positioned inside the page and painted under the sticky header. A
 * short viewport (a laptop with the browser not maximised) shows it best.
 */
test('the reading-settings sheet sits above the sticky header and is fully visible in a short window', async ({ page }) => {
  await page.setViewportSize({ width: 1188, height: 501 });
  await page.goto('/fighters/bhagat-singh');
  // Let the page-enter animation finish so the test exercises the steady state.
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Reading settings' }).click();
  const dialog = page.getByRole('dialog', { name: 'Reading settings' });
  await expect(dialog).toBeVisible();
  const heading = dialog.getByRole('heading', { name: 'Reading settings' });
  // The site header is the first <header>; the fighter page has its own inside the article.
  const headerBottom = await page.locator('header').first().evaluate((h) => h.getBoundingClientRect().bottom);
  const box = (await heading.boundingBox())!;
  expect(box.y, 'dialog title starts below the sticky header').toBeGreaterThanOrEqual(headerBottom);
  // The dialog, not the header, must be the element painted at the title's position.
  const topmost = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('[role="dialog"]') !== null, [box.x + 4, box.y + 4] as const);
  expect(topmost, 'dialog paints above the header').toBe(true);
  // And the whole dialog fits in the viewport.
  const d = (await dialog.boundingBox())!;
  expect(d.y).toBeGreaterThanOrEqual(0);
  expect(d.y + d.height).toBeLessThanOrEqual(501 + 1);
});
