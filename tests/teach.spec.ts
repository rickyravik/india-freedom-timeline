import { test, expect } from '@playwright/test';

test('the teacher pack has a 15-minute version, prompts, a timeline and facilitator answers, and prints without the site chrome', async ({ page }) => {
  await page.goto('/trails/women-who-led/teach');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Teach');
  const alignment = page.getByRole('region', { name: 'Curriculum alignment' });
  await expect(alignment).toBeVisible();
  await expect(alignment.getByText(/Proposed for upper-primary/)).toBeVisible();
  await expect(page.getByRole('region', { name: '15-minute version' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Discussion prompts' }).getByRole('listitem')).not.toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Printable timeline' }).getByRole('listitem')).not.toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Facilitator answers' })).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('banner')).toBeHidden();
  await expect(page.getByRole('contentinfo')).toBeHidden();
});
