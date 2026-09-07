import { test, expect } from '@playwright/test';

test('reveals render fully visible under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const reveal = page.locator('.reveal, .reveal-mask').first();
  await expect(reveal).toHaveClass(/in-view/);
  await expect(reveal).toHaveCSS('opacity', '1');
});

test('the skip link is the first tab stop and jumps to main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});
