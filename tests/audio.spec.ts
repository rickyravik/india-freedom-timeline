import { test, expect } from '@playwright/test';

test('a stop with narration offers a player that does not autoplay and labels the recording', async ({ page }) => {
  await page.goto('/trails/women-who-led/stop/1');
  const player = page.getByRole('region', { name: 'Listen to this stop' });
  test.skip((await player.count()) === 0, 'no narration recorded yet');
  await expect(player.getByText(/Recorded narration/)).toBeVisible();
  const paused = await player.locator('audio').evaluate((a: HTMLAudioElement) => a.paused);
  expect(paused).toBe(true);
  await expect(player.getByRole('button', { name: 'Play' })).toBeVisible();
  await expect(player.getByRole('slider', { name: 'Seek' })).toBeVisible();
  await expect(player.getByRole('group', { name: 'Speed' })).toBeVisible();
});

test('without narration, no Listen control is shown', async ({ page }) => {
  await page.goto('/trails/how-resistance-changed/stop/1');
  await expect(page.getByRole('button', { name: 'Listen' })).toHaveCount(0);
});
