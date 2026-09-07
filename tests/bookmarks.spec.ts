import { test, expect } from '@playwright/test';

test('bookmarking a fighter surfaces it in the Saved collection', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  const save = page.getByRole('button', { name: 'Save this story' });
  await save.click();
  await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible();

  await page.goto('/fighters?collection=saved');
  await expect(page.getByRole('link', { name: /Bhagat Singh/ })).toBeVisible();

  // Unsave, and it drops out of the Saved collection again.
  await page.goto('/fighters/bhagat-singh');
  await page.getByRole('button', { name: 'Saved' }).click();
  await expect(page.getByRole('button', { name: 'Save this story' })).toBeVisible();
  await page.goto('/fighters?collection=saved');
  await expect(page.getByText('No saved stories yet')).toBeVisible();
});
