import { test, expect } from '@playwright/test';

test.describe('Search palette', () => {
  test('opens with Ctrl/Cmd+K and with /', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('dialog', { name: 'Search the archive' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Search the archive' })).toBeHidden();

    await page.keyboard.press('/');
    await expect(page.getByRole('dialog', { name: 'Search the archive' })).toBeVisible();
  });

  test('Escape closes it, even pressed immediately after opening', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    // No wait: this is exactly the race the palette's Escape handler must
    // survive — focus may not have moved into the dialog yet.
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Search the archive' })).toBeHidden();
  });

  test('keyboard navigation and Enter open a result', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog', { name: 'Search the archive' });
    await expect(dialog).toBeVisible();
    await page.keyboard.type('Bhagat Singh');
    await expect(dialog.getByRole('option').first()).toBeVisible();
    // Net-zero movement: proves ArrowDown/ArrowUp actually move the
    // selection, while still landing back on the predictable first result.
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/fighters\/bhagat-singh/);
    await expect(dialog).toBeHidden();
  });
});
