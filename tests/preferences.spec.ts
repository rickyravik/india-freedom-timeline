import { test, expect } from '@playwright/test';

test('reading mode and text size persist across pages and a reload', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  await page.getByRole('button', { name: 'Detailed history' }).click();
  await expect(page.getByRole('heading', { name: 'Detailed history' })).toBeVisible();

  await page.getByRole('button', { name: 'Reading settings' }).click();
  await page.getByRole('dialog', { name: 'Reading settings' }).getByRole('button', { name: 'Larger' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'larger');

  // Persists across an in-app navigation, with no reload.
  await page.goto('/fighters/rani-lakshmibai');
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'larger');
  await expect(page.getByRole('heading', { name: 'Detailed history' })).toBeVisible();

  // And survives a hard reload.
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'larger');
  await expect(page.getByRole('heading', { name: 'Detailed history' })).toBeVisible();
});

test('reduce motion stops reveals from hiding content, everywhere', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  await page.getByRole('button', { name: 'Reading settings' }).click();
  await page.getByRole('dialog', { name: 'Reading settings' }).getByRole('switch', { name: 'Reduce motion' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');

  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
  const reveal = page.locator('.reveal, .reveal-mask').first();
  await expect(reveal).toHaveCSS('opacity', '1');
});
