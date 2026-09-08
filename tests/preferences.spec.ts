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

test('switching reading mode keeps focus on the control and the heading in place', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  const heading = page.getByRole('heading', { name: 'Quick story' });
  const detail = page.getByRole('button', { name: 'Detailed history' });
  // Bring the control into view first, so the upcoming focus() call — which
  // would otherwise auto-scroll on its own — can't shift the viewport
  // between the "before" and "after" measurements.
  await detail.scrollIntoViewIfNeeded();
  const before = await heading.boundingBox();
  await detail.focus();
  await page.keyboard.press('Enter');
  await expect(detail).toBeFocused();
  const detailHeading = page.getByRole('heading', { name: 'Detailed history' });
  await expect(detailHeading).toBeVisible();
  const after = await detailHeading.boundingBox();
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
  const dur = await page.locator('[data-mode-swap]').evaluate((el) => getComputedStyle(el).animationDuration);
  expect(dur).toBe('0.16s');
});
