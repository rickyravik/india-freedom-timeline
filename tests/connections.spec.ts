import { test, expect } from '@playwright/test';

test('documented connections carry a type and an explanation; theme-only people are similar stories', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/fighters/velu-nachiyar');
  const connections = page.getByRole('list', { name: 'Documented connections' });
  await expect(connections.getByRole('listitem')).toHaveCount(1);
  await expect(connections).toContainText('Ally');
  await expect(connections).toContainText('Marudhu Pandiyar Brothers');
  await expect(connections).toContainText(/retook Sivaganga/);
  const similar = page.getByRole('region', { name: 'Similar stories' });
  await expect(similar.getByRole('link', { name: /Rani Lakshmibai/ })).toBeVisible();
  await expect(similar).toContainText('without a documented meeting');
});

test('the reverse side of a declared connection shows too', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/fighters/marudhu-brothers');
  const connections = page.getByRole('list', { name: 'Documented connections' });
  await expect(connections).toContainText('Rani Velu Nachiyar');
});
