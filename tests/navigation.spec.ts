import { test, expect } from '@playwright/test';

test('going back to a list restores the scroll position', async ({ page }) => {
  await page.goto('/events');
  await page.mouse.wheel(0, 2400);
  await page.waitForFunction(() => window.scrollY > 1500);
  const before = await page.evaluate(() => window.scrollY);
  // Pick a row that is on screen after the scroll.
  const link = page.getByRole('link', { name: /Quit India/ }).first();
  await link.click();
  await expect(page).toHaveURL(/\/events\//);
  await page.goBack();
  await expect(page).toHaveURL(/\/events$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before - 200);
});

test('a chapter link from the home page lands with the chapter heading visible below the sticky header', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /1905.*Swadeshi/ }).click();
  await expect(page).toHaveURL(/\/timeline#era-swadeshi-era/);
  const heading = page.locator('#era-swadeshi-era h2');
  await expect(heading).toBeVisible();
  const box = await heading.boundingBox();
  expect(box!.y).toBeGreaterThan(64); // below the 64px header
  expect(box!.y).toBeLessThan(500); // the pane's own denomination numeral sits above the heading
});
