import { test, expect } from '@playwright/test';

test('selecting a state on the map shows its detail panel', async ({ page }) => {
  await page.goto('/map');
  const tile = page.getByRole('button', { name: /^Tamil Nadu,/ });
  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Tamil Nadu' })).toBeVisible();

  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
});
