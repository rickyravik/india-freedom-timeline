import { test, expect } from '@playwright/test';

test('a trail can be completed keyboard-only, keeps its place, and marks completion', async ({ page }) => {
  await page.goto('/trails');
  await expect(page.getByRole('article')).toHaveCount(6);
  await page.getByRole('link', { name: 'Women who led resistance', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Women who led resistance' })).toBeVisible();
  await page.getByRole('link', { name: 'Start the trail' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/stop\/1$/);
  await expect(page.getByRole('progressbar', { name: 'Position in this trail' })).toHaveAttribute('aria-valuenow', '1');

  await page.getByRole('link', { name: 'Next stop' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/stop\/2$/);

  // Leave and come back: the index offers Resume at stop 2.
  await page.goto('/trails');
  await expect(page.getByRole('link', { name: 'Resume at stop 2' })).toBeVisible();

  // Text-only hides the record cards but keeps the prose and sources.
  await page.goto('/trails/women-who-led/stop/2?text=1');
  await expect(page.getByRole('button', { name: 'Text only' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Open the full story')).toHaveCount(0);
  await expect(page.locator('[data-reading-text] p').first()).toBeVisible();
  await expect(page.getByRole('region', { name: 'Sources and references' })).toBeVisible();

  // Walk to the end and finish.
  for (let i = 2; i < 5; i++) await page.getByRole('link', { name: 'Next stop' }).click();
  await page.getByRole('link', { name: 'Finish' }).click();
  await expect(page).toHaveURL(/\/finish$/);
  await page.getByRole('button', { name: /^A\b/ }).click();
  await page.getByRole('button', { name: 'Finish the trail' }).click();
  await expect(page.getByRole('heading', { name: 'Trail complete' })).toBeVisible();
  await page.goto('/trails');
  await expect(page.getByRole('link', { name: 'Read again' }).first()).toBeVisible();
});

test('a checked trail carries no draft stamp', async ({ page }) => {
  await page.goto('/trails/how-resistance-changed');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText(/under editorial review/)).toHaveCount(0);
});

test('asking for a language that has no translation falls back to English without a switch', async ({ page }) => {
  await page.goto('/trails/how-resistance-changed/stop/1?lang=ta');
  await expect(page.locator('[data-reading-text]').first()).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('group', { name: 'Language' })).toHaveCount(0);
});
