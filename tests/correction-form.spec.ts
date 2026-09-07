import { test, expect } from '@playwright/test';

/**
 * The "suggest a correction" form (SuggestCorrection in src/components/ui.tsx,
 * worker/correction.ts). Runs against `vite preview`, same as the rest of
 * this suite — there's no Worker there either, so POST /api/correction
 * can't succeed, exercising exactly the mailto-fallback path a real visitor
 * hits under plain `vite dev` too.
 */
test('the correction form is keyboard operable and falls back to mailto', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');

  const openButton = page.getByRole('button', { name: 'Suggest a correction' });
  await openButton.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: /Suggest a correction/ });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel('What’s wrong?').fill('The birth year looks off.');
  await dialog.getByLabel('Suggested correction').fill('Should be 1907, per the National Archives record.');

  await dialog.getByRole('button', { name: 'Submit correction' }).click();

  // No Worker under vite preview, so the request can't succeed — the UI
  // should offer a mailto: fallback rather than silently failing.
  const mailtoLink = dialog.getByRole('link', { name: 'open a pre-filled email' });
  await expect(mailtoLink).toBeVisible();
  await expect(mailtoLink).toHaveAttribute('href', /^mailto:\?subject=Correction%3A/);

  // Escape closes it like every other BottomSheet in this app.
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});
