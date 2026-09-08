import { test, expect } from '@playwright/test';

test('a claim-level citation previews its source and links to the full reference', async ({ page }) => {
  await page.goto('/fighters/velu-nachiyar');
  await page.getByRole('button', { name: 'Detailed history' }).click();
  const marker = page.getByRole('button', { name: 'Source 1: Rani Velu Nachiyar commemorations' });
  await expect(marker).toBeVisible();
  await marker.click();
  const popover = page.getByRole('note', { name: /Source 1/ });
  await expect(popover).toBeVisible();
  await expect(popover).toContainText('Ministry of Culture');
  await expect(popover.getByRole('link', { name: 'Full reference' })).toHaveAttribute('href', /#source-1$/);
  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await expect(marker).toBeFocused();
});

test('uncertainty sits beside the passage in detailed history and inside the quick story', async ({ page }) => {
  await page.goto('/fighters/velu-nachiyar');
  await expect(page.getByText(/comes from oral tradition; no contemporary record confirms it/)).toBeVisible();
  await page.getByRole('button', { name: 'Detailed history' }).click();
  const paragraphs = page.locator('[data-reading-text] > p');
  const note = page.getByRole('note', { name: /Historians note: Kuyili/ });
  await expect(note).toBeVisible();
  // The note follows the third paragraph, not the end of the section.
  const third = await paragraphs.nth(2).boundingBox();
  const noteBox = await note.boundingBox();
  const fourth = await paragraphs.nth(3).boundingBox();
  expect(noteBox!.y).toBeGreaterThan(third!.y);
  expect(noteBox!.y).toBeLessThan(fourth!.y);
});
