import { test, expect } from '@playwright/test';

test('the profile follows the template: in a minute, contents menu, reading time, cost, legacy, sources', async ({ page }) => {
  await page.goto('/fighters/velu-nachiyar');
  await expect(page.getByText('Say it: VAY-loo NAH-chee-yar')).toBeVisible();
  await expect(page.getByText(/Commemorative postage stamp/)).toBeVisible();
  await expect(page.getByRole('region', { name: 'In a minute' }).getByRole('listitem')).toHaveCount(3);
  const contents = page.getByRole('navigation', { name: 'On this page' });
  for (const label of ['Story', 'Dates', 'Cost of resistance', 'Legacy', 'Sources']) {
    await expect(contents.getByRole('link', { name: label })).toBeVisible();
  }
  await expect(page.getByText(/\d+ min read/)).toBeVisible();
  await contents.getByRole('link', { name: 'Sources' }).click();
  await expect(page.locator('#sources')).toBeInViewport();
  await expect(page.getByRole('heading', { name: 'The cost of resistance' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('People');
});
