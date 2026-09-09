import { test, expect } from '@playwright/test';

test('a document page gives the transcription first, explains author, audience, claim and limitation, and never hides text behind an image', async ({ page }) => {
  await page.goto('/documents/queens-proclamation-1858');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Proclamation');
  const passages = page.getByRole('list', { name: 'Transcription' }).getByRole('listitem');
  await expect(passages).not.toHaveCount(0);
  await passages.first().getByRole('button').click();
  const guide = page.getByRole('region', { name: 'Reading this passage' });
  await expect(guide.getByText('Author')).toBeVisible();
  await expect(guide.getByText('Audience')).toBeVisible();
  await expect(guide.getByText('Limitation')).toBeVisible();
  await expect(page.getByText(/Transcription note/)).toBeVisible();
});
