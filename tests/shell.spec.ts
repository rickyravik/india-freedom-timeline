import { test, expect } from '@playwright/test';

test('the home page leads with Start exploring, one featured story and the trails', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Start exploring' })).toHaveAttribute('href', '/start');
  await expect(page.getByRole('link', { name: 'Meet the people' })).toHaveAttribute('href', '/fighters');
  await expect(page.getByRole('link', { name: 'Explore by place' })).toHaveAttribute('href', '/map');
  const featured = page.getByRole('region', { name: 'Featured story' });
  await expect(featured.getByText(/\d+ min read/)).toBeVisible();
  await expect(page.getByRole('region', { name: 'Guided trails' }).getByRole('article')).toHaveCount(3);
  await expect(page.getByRole('region', { name: 'Stories beyond the familiar names' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Sources and corrections' })).toBeVisible();
});

test('/start offers a five-minute route and a longer one', async ({ page }) => {
  await page.goto('/start');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Start');
  await expect(page.getByRole('link', { name: /Five minutes/ })).toHaveAttribute('href', '/trails');
  await expect(page.getByRole('link', { name: /Longer/ })).toHaveAttribute('href', '/timeline?view=chapters');
});

test('the phone bar has four destinations and Explore opens the secondary routes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const bar = page.getByRole('navigation', { name: 'Primary' }).last();
  await expect(bar.getByRole('link')).toHaveCount(3); // Home, Trails, Learn
  await bar.getByRole('button', { name: 'Explore' }).click();
  const sheet = page.getByRole('dialog', { name: 'Explore the archive' });
  await expect(sheet.getByRole('link', { name: /Timeline/ })).toBeVisible();
  await expect(sheet.getByRole('link', { name: /Glossary/ })).toBeVisible();
});

test('back from a record returns to the filtered list', async ({ page }) => {
  await page.goto('/fighters?collection=women');
  await page.getByRole('link', { name: /Rani Lakshmibai/ }).first().click();
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'People' }).click();
  await expect(page).toHaveURL(/\/fighters\?collection=women$/);
});
