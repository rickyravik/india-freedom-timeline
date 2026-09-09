import { test, expect } from '@playwright/test';

test('a place page states its geography frame, its kind, its dates, and links the people and events that happened there', async ({ page }) => {
  await page.goto('/places/panchalankurichi');
  await expect(page.getByRole('heading', { level: 1, name: 'Panchalankurichi' })).toBeVisible();
  await expect(page.getByText('Fort', { exact: true })).toBeVisible();
  await expect(page.getByText(/present-day Tamil Nadu/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Veerapandiya Kattabomman/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Fall of Panchalankurichi/ }).first()).toBeVisible();
});

test('a profile separates birthplace from places of activity, imprisonment, exile and death', async ({ page }) => {
  await page.goto('/fighters/veerapandiya-kattabomman');
  const places = page.getByRole('region', { name: 'Places in this life' });
  await expect(places.getByText('Born')).toBeVisible();
  await expect(places.getByText('Died')).toBeVisible();
  await expect(places.getByRole('link', { name: 'Kayathar' })).toBeVisible();
});

test('the map offers a state’s places', async ({ page }) => {
  await page.goto('/map?state=tamil-nadu');
  await expect(page.getByRole('region', { name: 'Places in Tamil Nadu' }).getByRole('link')).not.toHaveCount(0);
});
