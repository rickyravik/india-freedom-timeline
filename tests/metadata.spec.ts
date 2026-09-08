import { test, expect } from '@playwright/test';
import { loadEnv } from 'vite';

const SITE_URL = loadEnv('production', process.cwd(), 'VITE_').VITE_SITE_URL.replace(/\/$/, '');

test('canonical, Open Graph and robots all point at the configured public origin', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/fighters/bhagat-singh`);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${SITE_URL}/fighters/bhagat-singh`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${SITE_URL}/og/fighters/bhagat-singh.jpg`);

  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/`);
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(ld ?? '{}').url).toBe(`${SITE_URL}/`);

  const robots = await page.request.get('/robots.txt');
  expect(await robots.text()).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  const sitemap = await page.request.get('/sitemap.xml');
  expect(await sitemap.text()).toContain(`<loc>${SITE_URL}/timeline</loc>`);
});
