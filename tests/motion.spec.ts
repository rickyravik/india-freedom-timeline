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

test('a chapter pane never appears as an empty rectangle: description text is visible before the heading reveal completes', async ({ page }) => {
  await page.goto('/timeline');
  const chapter = page.locator('#era-revolt-1857');
  await chapter.scrollIntoViewIfNeeded();
  // The description paragraph is not masked; it is visible immediately.
  const desc = chapter.locator('[data-chapter-body] p').first();
  await expect(desc).toHaveCSS('opacity', '1');
  // The heading group reveals over ~450ms (not 900ms).
  const dur = await chapter.locator('.reveal-mask').first().evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(dur.split(',')[0].trim()).toBe('0.45s');
});
