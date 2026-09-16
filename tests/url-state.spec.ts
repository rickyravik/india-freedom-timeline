import { test, expect } from '@playwright/test';

test.describe('filters live in the URL', () => {
  test('timeline: a region in the URL narrows the list, survives reload, and Clear all removes it', async ({ page }) => {
    await page.goto('/timeline?region=south');
    const status = page.getByRole('status');
    // "a of b events" where a < b: narrowed, without pinning the total to a content count.
    const counts = async () => {
      const m = (await status.textContent())!.match(/^(\d+) of (\d+) events$/);
      expect(m, `status text was "${await status.textContent()}"`).not.toBeNull();
      return { shown: Number(m![1]), total: Number(m![2]) };
    };
    await expect(status).toHaveText(/^\d+ of \d+ events$/);
    let c = await counts();
    expect(c.shown).toBeGreaterThan(0);
    expect(c.shown).toBeLessThan(c.total);
    const chips = page.getByRole('list', { name: 'Active filters' });
    await expect(chips.getByRole('button', { name: 'Remove filter: South India' })).toBeVisible();

    await page.reload();
    await expect(status).toHaveText(/^\d+ of \d+ events$/);
    c = await counts();
    expect(c.shown).toBeLessThan(c.total);

    await chips.getByRole('button', { name: 'Clear all' }).click();
    await expect(page).toHaveURL(/\/timeline$/);
    await expect(status).toHaveText(/^(\d+) of \1 events$/);
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
    const status = page.getByRole('status');
    await expect(status).toHaveText(/^Showing [1-9]\d* of \d+$/);
    const m = (await status.textContent())!.match(/^Showing (\d+) of (\d+)$/)!;
    expect(Number(m[1])).toBeLessThan(Number(m[2]));
  });
});
