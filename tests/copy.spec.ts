import { test, expect } from '@playwright/test';

test('an event page calls its neighbours what they are: next in the collection', async ({ page }) => {
  await page.goto('/events/battle-of-plassey');
  await expect(page.getByRole('heading', { name: 'Next in this collection' })).toBeVisible();
  await expect(page.getByText(/chronological neighbours in the archive/i)).toBeVisible();
  await expect(page.getByText('What happened next?')).toHaveCount(0);
});

test('the connections heading uses the editorial short name, not just the last word', async ({ page }) => {
  await page.goto('/fighters/velu-nachiyar');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole('heading', { name: 'People connected to Velu Nachiyar' })).toBeVisible();
});

test('a life that runs past 1947 says so on the lifespan bar', async ({ page }) => {
  await page.goto('/fighters/lakshmi-sahgal');
  await expect(page.getByText('Lived to 2012, beyond the end of this frame.')).toBeVisible();
});

test('the home ledger never calls a missing record a gap in history', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('No dated record for today')).toHaveCount(0);
  const ledger = page.getByRole('region', { name: /Today/ });
  await expect(ledger).toBeVisible();
});
