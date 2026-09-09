import { test, expect } from '@playwright/test';

test('the passport shows completed trails as stamps, trails in progress, and saved stories — privately, with no ranking', async ({ page }) => {
  await page.goto('/passport');
  await expect(page.getByText(/kept on this device/i)).toBeVisible();
  await expect(page.getByText('Nothing stamped yet')).toBeVisible();
  await page.evaluate(() => {
    localStorage.setItem(
      'ift-trails-v1',
      JSON.stringify({
        'women-who-led': { stop: 5, completed: true, updatedAt: '2026-09-08T10:00:00.000Z' },
        'tamil-nadu-close-to-home': { stop: 2, completed: false, updatedAt: '2026-09-08T11:00:00.000Z' },
      }),
    );
    localStorage.setItem('ift-bookmarks-v1', JSON.stringify(['usha-mehta']));
  });
  await page.reload();
  const stamps = page.getByRole('region', { name: 'Completed trails' });
  await expect(stamps.getByText('Women who led resistance')).toBeVisible();
  await expect(page.getByRole('region', { name: 'In progress' }).getByRole('link', { name: /Resume at stop 2/ })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Saved stories' }).getByRole('link', { name: /Usha Mehta/ })).toBeVisible();
  await expect(page.getByText(/streak|rank|points/i)).toHaveCount(0);
  await page.getByRole('button', { name: 'Forget this trail' }).first().click();
  await expect(stamps.getByText('Women who led resistance')).toHaveCount(0);
});
