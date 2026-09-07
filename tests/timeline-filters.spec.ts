import { test, expect } from '@playwright/test';

test('timeline filter sheet narrows the event list', async ({ page }) => {
  await page.goto('/timeline');
  const status = page.getByRole('status');
  const before = await status.textContent();

  await page.getByRole('button', { name: /^Filters/ }).click();
  const sheet = page.getByRole('dialog', { name: 'Filter the timeline' });
  await expect(sheet).toBeVisible();
  await sheet.getByRole('button', { name: 'South India' }).click();
  await sheet.getByRole('button', { name: /^Show \d+ events$/ }).click();
  await expect(sheet).toBeHidden();

  const after = await status.textContent();
  expect(after).not.toBe(before);
  expect(after).toMatch(/of \d+ events/);
});
