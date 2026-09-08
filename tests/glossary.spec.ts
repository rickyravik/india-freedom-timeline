import { test, expect } from '@playwright/test';

test('a term is explained once, at its first appearance, without moving the reader', async ({ page }) => {
  await page.goto('/events/battle-of-plassey');
  const terms = page.locator('[data-reading-text] button.gloss');
  const count = await terms.count();
  expect(count).toBeGreaterThan(0);
  const texts = (await terms.allTextContents()).map((t) => t.toLowerCase());
  expect(new Set(texts).size).toBe(texts.length); // no term explained twice
  // Bring the trigger into view first (as a real click would need to), then
  // check that *opening the popover itself* is what must not move the page.
  await terms.first().scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await terms.first().click();
  const note = page.getByRole('note', { name: /Meaning of/ });
  await expect(note).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
  await expect(note.getByRole('link', { name: 'Glossary' })).toHaveAttribute('href', /^\/glossary#/);
  await page.keyboard.press('Escape');
  await expect(note).toBeHidden();
});

test('/glossary lists every term with its definition', async ({ page }) => {
  await page.goto('/glossary');
  await expect(page.getByRole('heading', { name: 'Glossary' })).toBeVisible();
  await expect(page.locator('dl > div')).toHaveCount(28);
  await page.goto('/glossary#satyagraha');
  await expect(page.locator('#satyagraha')).toBeInViewport();
});
