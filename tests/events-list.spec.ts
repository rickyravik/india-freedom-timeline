import { test, expect } from '@playwright/test';

test('events are one continuous chronological list with full-width rows, grouped under decade headings', async ({ page }) => {
  await page.goto('/events');
  const rows = page.locator('ol[aria-label="Events in date order"] > li');
  await expect(rows).toHaveCount(47);
  // Every row spans the list's full width (no multi-column grid).
  const listBox = await page.locator('ol[aria-label="Events in date order"]').boundingBox();
  const firstRow = await rows.first().boundingBox();
  expect(Math.abs(firstRow!.width - listBox!.width)).toBeLessThan(2);
  // Decade headings are present and the sparse 1800s decade still gets a heading, not a one-third-width card.
  await expect(page.getByRole('heading', { name: '1800s' })).toBeVisible();
  // Rows are in date order.
  const years = await rows.locator('time').allTextContents();
  const numeric = years.map((y) => Number(y.trim().slice(0, 4)));
  expect([...numeric].sort((a, b) => a - b)).toEqual(numeric);
});

test('decade chips jump to the decade heading', async ({ page }) => {
  await page.goto('/events');
  await page.getByRole('link', { name: '1930s' }).click();
  const heading = page.getByRole('heading', { name: '1930s' });
  const box = await heading.boundingBox();
  expect(box!.y).toBeGreaterThan(60);
  expect(box!.y).toBeLessThan(300);
});
