import { test, expect } from '@playwright/test';
import { loadEnv } from 'vite';

const INBOX = (loadEnv('production', process.cwd(), 'VITE_').VITE_CORRECTIONS_EMAIL ?? '').trim();

/**
 * Runs against `vite preview`, where there is no Worker, so POST /api/correction
 * fails — exactly the fallback path a visitor hits when the endpoint is down.
 */
test('the correction form is keyboard operable, keeps the draft, and offers a real fallback', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');

  const openButton = page.getByRole('button', { name: 'Suggest a correction' });
  await openButton.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: /Suggest a correction/ });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel('What’s wrong?').fill('The birth year looks off.');
  await dialog.getByLabel('Suggested correction').fill('Should be 1907, per the National Archives record.');
  await dialog.getByRole('button', { name: 'Submit correction' }).click();

  const alert = dialog.getByRole('alert');
  await expect(alert).toBeVisible();
  if (INBOX) {
    await expect(alert.getByRole('link', { name: `email ${INBOX}` })).toHaveAttribute('href', new RegExp(`^mailto:${INBOX.replace('.', '\\.')}\\?subject=Correction%3A`));
  } else {
    await expect(alert.getByRole('link', { name: /open a pre-filled issue on GitHub/ })).toHaveAttribute('href', /^https:\/\/github\.com\/rickyravik\/india-freedom-timeline\/issues\/new\?title=Correction%3A/);
  }

  // Try again returns to the form with the draft intact.
  await alert.getByRole('button', { name: 'Try again' }).click();
  await expect(dialog.getByLabel('What’s wrong?')).toHaveValue('The birth year looks off.');

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('the About page offers the correction form directly', async ({ page }) => {
  await page.goto('/about');
  await page.getByRole('button', { name: 'Suggest a correction' }).click();
  await expect(page.getByRole('dialog', { name: /General suggestion/ })).toBeVisible();
});
