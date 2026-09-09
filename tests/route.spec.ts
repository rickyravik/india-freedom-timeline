import { test, expect } from '@playwright/test';

test('the route draws one segment per stop as the reader advances, labels approximate stops, and always has a text list', async ({ page }) => {
  await page.goto('/routes/dandi-march');
  await expect(page.getByText('Present-day geography')).toBeVisible();
  const list = page.getByRole('list', { name: 'Stops in order' });
  await expect(list.getByRole('listitem')).toHaveCount(9);
  await expect(page.getByText(/Approximate/).first()).toBeVisible();
  const drawn = () => page.locator('[data-route-segment][data-drawn="true"]').count();
  expect(await drawn()).toBe(0);
  await page.getByRole('button', { name: 'Next stop' }).click();
  expect(await drawn()).toBe(1);
  await expect(page.getByText('12 March 1930').first()).toBeVisible();
  await page.getByRole('button', { name: 'Next stop' }).click();
  expect(await drawn()).toBe(2);
  await page.getByRole('button', { name: 'Previous stop' }).click();
  expect(await drawn()).toBe(1);
});
