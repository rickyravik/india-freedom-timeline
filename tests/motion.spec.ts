import { test, expect } from '@playwright/test';

test('the spine progress tracks the timeline container, reaching full only at its end, and is static under reduced motion', async ({ page }) => {
  await page.goto('/timeline');
  const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
  test.skip(!supported, 'scroll-driven animations unsupported in this browser build');
  const scale = () =>
    page.evaluate(() => {
      const el = document.querySelector('.spine-progress') as HTMLElement;
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return m.d; // scaleY
    });
  await page.evaluate(() => window.scrollTo(0, 0));
  const atTop = await scale();
  const container = page.locator('[data-timeline-spine]');
  const box = await container.boundingBox();
  await page.evaluate((y) => window.scrollTo(0, y), box!.y + box!.height / 2);
  await page.waitForTimeout(100);
  const midway = await scale();
  expect(midway).toBeGreaterThan(atTop);
  expect(midway).toBeLessThan(0.95);
  // At the bottom of the timeline container (footer still below), progress is complete.
  const viewportHeight = page.viewportSize()!.height;
  await page.evaluate((y) => window.scrollTo(0, y), box!.y + box!.height - viewportHeight + 10);
  await page.waitForTimeout(100);
  expect(await scale()).toBeGreaterThan(0.9);
});

test('with reduced motion the spine is a static line and the current chapter is still named in text', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/timeline#era-non-cooperation');
  const anim = await page.evaluate(() => getComputedStyle(document.querySelector('.spine-progress')!).animationName);
  expect(anim).toBe('none');
  await expect(page.getByRole('navigation', { name: 'Jump to era' }).locator('[aria-current="true"]')).toContainText('Non-Cooperation');
  await expect(page.getByRole('navigation', { name: 'Jump to era' }).locator('[aria-current="true"] .sr-only')).toHaveText('Current chapter:');
});
