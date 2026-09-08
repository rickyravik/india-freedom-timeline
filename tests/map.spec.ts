import { test, expect } from '@playwright/test';

test('selecting a state on the map shows its detail panel and writes the URL', async ({ page }) => {
  await page.goto('/map');
  const tile = page.getByRole('button', { name: /^Tamil Nadu,/ });
  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Tamil Nadu' })).toBeVisible();
  await expect(page).toHaveURL(/state=tamil-nadu/);
  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  await expect(page).not.toHaveURL(/state=/);
});

test('a state in the URL is selected on load, and the full-name selector changes it', async ({ page }) => {
  await page.goto('/map?state=kerala');
  await expect(page.getByRole('heading', { name: 'Kerala' })).toBeVisible();
  await page.getByLabel('Choose a state').selectOption({ value: 'punjab' });
  await expect(page).toHaveURL(/state=punjab/);
  await expect(page.getByRole('heading', { name: 'Punjab' })).toBeVisible();
});

test('the list view names every state in full with its record counts', async ({ page }) => {
  await page.goto('/map?view=list');
  const list = page.getByRole('list', { name: 'States and territories' });
  await expect(list.getByRole('button')).toHaveCount(23);
  await expect(list.getByRole('button', { name: /^Tamil Nadu · \d+ people · \d+ events$/ })).toBeVisible();
});

test('a state without records says coverage is growing and offers neighbours', async ({ page }) => {
  await page.goto('/map?state=chhattisgarh');
  await expect(page.getByText(/Coverage for Chhattisgarh is still growing/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Madhya Pradesh/ })).toBeVisible();
});
