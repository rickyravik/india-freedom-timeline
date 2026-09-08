import { test, expect } from '@playwright/test';

test('saving a story confirms with a postmark, announces the state, offers undo, and never replays on load', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  const save = page.getByRole('button', { name: 'Save this story' });
  await save.click();
  await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Saved to your stories');
  await expect(page.locator('.postmark-stamp')).toHaveCount(1);
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('button', { name: 'Save this story' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Removed from your stories');

  await page.getByRole('button', { name: 'Save this story' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible();
  await expect(page.locator('.postmark-stamp')).toHaveCount(0); // no replay on load
  await page.goto('/fighters?collection=saved');
  await expect(page.getByRole('link', { name: /Bhagat Singh/ })).toBeVisible();
});

test('under reduced motion the postmark is not animated but the state still changes and is announced', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fighters/velu-nachiyar');
  await page.getByRole('button', { name: 'Save this story' }).click();
  await expect(page.getByRole('status')).toContainText('Saved to your stories');
  // The browser may serialise a very short duration as "0.01ms" or in
  // scientific notation ("1e-05s") depending on version; compare the value.
  const anim = await page.locator('.postmark-stamp').evaluate((el) => getComputedStyle(el).animationDuration);
  const seconds = anim.endsWith('ms') ? parseFloat(anim) / 1000 : parseFloat(anim);
  expect(seconds).toBeCloseTo(0.00001, 5);
});
