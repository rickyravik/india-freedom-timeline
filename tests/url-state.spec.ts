import { test, expect } from '@playwright/test';

test.describe('filters live in the URL', () => {
  test('timeline: a region in the URL narrows the list, survives reload, and Clear all removes it', async ({ page }) => {
    await page.goto('/timeline?region=south');
    const status = page.getByRole('status');
    await expect(status).toHaveText(/^(?!47 of)\d+ of 47 events$/);
    const chips = page.getByRole('list', { name: 'Active filters' });
    await expect(chips.getByRole('button', { name: 'Remove filter: South India' })).toBeVisible();

    await page.reload();
    await expect(status).toHaveText(/^(?!47 of)\d+ of 47 events$/);

    await chips.getByRole('button', { name: 'Clear all' }).click();
    await expect(page).toHaveURL(/\/timeline$/);
    await expect(status).toHaveText('47 of 47 events');
  });

  test('timeline: choosing a filter writes the URL', async ({ page }) => {
    await page.goto('/timeline');
    await page.getByRole('button', { name: /^Filters/ }).click();
    const sheet = page.getByRole('dialog', { name: 'Filter the timeline' });
    await sheet.getByRole('button', { name: 'Massacre' }).click();
    await expect(page).toHaveURL(/category=massacre/);
  });

  test('people: query and collection persist', async ({ page }) => {
    await page.goto('/fighters?collection=women&q=rani');
    await expect(page.getByLabel('Search by name, place or tag')).toHaveValue('rani');
    await expect(page.getByRole('button', { name: 'Women of the movement' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByLabel('Search by name, place or tag').fill('queen');
    await expect(page).toHaveURL(/q=queen/);
  });

  test('events: type in the URL narrows the list', async ({ page }) => {
    await page.goto('/events?type=massacre');
    await expect(page.getByRole('status')).toHaveText(/^Showing [1-9]\d* of 47$/);
    await expect(page.getByRole('status')).not.toHaveText('Showing 47 of 47');
  });
});
