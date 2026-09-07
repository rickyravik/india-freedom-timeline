import { test, expect } from '@playwright/test';

test('Story Mode is a one-chapter-at-a-time stepper on phones', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/fighters/bhagat-singh');

  await expect(page.getByText('Chapter 1 of', { exact: false })).toBeVisible();
  const next = page.getByRole('button', { name: 'Next chapter' });
  const prev = page.getByRole('button', { name: 'Previous chapter' });
  await expect(prev).toBeDisabled();

  await next.click();
  await expect(page.getByText('Chapter 2 of', { exact: false })).toBeVisible();
  await expect(prev).toBeEnabled();

  await prev.click();
  await expect(page.getByText('Chapter 1 of', { exact: false })).toBeVisible();

  // Dots jump directly to a chapter.
  await page.getByRole('button', { name: /^Chapter 3:/ }).click();
  await expect(page.getByText('Chapter 3 of', { exact: false })).toBeVisible();
});
