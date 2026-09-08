import { test, expect } from '@playwright/test';

test('the People page search tolerates the same spelling variants as global search', async ({ page }) => {
  await page.goto('/fighters');
  await page.getByLabel('Search by name, place or tag').fill('laxmibai');
  await expect(page.getByRole('link', { name: /Rani Lakshmibai/ })).toBeVisible();
  await expect(page.getByText(/Did you mean/)).toBeVisible();
  await expect(page.getByRole('status')).toHaveText(/Showing 1 of/);
});

test('an empty People result offers the whole-archive search', async ({ page }) => {
  await page.goto('/fighters');
  await page.getByLabel('Search by name, place or tag').fill('zzzzqq');
  await expect(page.getByText('No one matches these filters')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Search the whole archive' })).toHaveAttribute('href', '/search?q=zzzzqq');
});
