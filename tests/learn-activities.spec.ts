import { test, expect } from '@playwright/test';

test('guess who takes a typed guess, says when it is wrong, and still lets the reader reveal', async ({ page }) => {
  await page.goto('/learn');
  const guess = page.getByRole('region', { name: 'Guess the freedom fighter' });
  await guess.getByLabel('Your guess').fill('Nobody Atall');
  await guess.getByRole('button', { name: 'Check' }).click();
  await expect(guess.getByRole('status')).toContainText(/Not this time/);
  await guess.getByRole('button', { name: 'Reveal' }).click();
  await expect(guess.getByRole('link').first()).toBeVisible();
  await expect(guess.getByLabel('Your guess')).toHaveCount(0);
});

test('compare offers curated pairs with a reason', async ({ page }) => {
  await page.goto('/learn');
  const compare = page.getByRole('region', { name: 'Compare two historical figures' });
  await compare.getByRole('button', { name: /Velu Nachiyar.*Lakshmibai/ }).click();
  await expect(compare.getByText(/Why compare them/)).toBeVisible();
  await expect(compare.getByRole('link', { name: /Rani Velu Nachiyar/ })).toBeVisible();
  await expect(compare.getByRole('link', { name: /Rani Lakshmibai/ })).toBeVisible();
});
