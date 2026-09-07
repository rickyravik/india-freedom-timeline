/**
 * Rasterizes public/favicon.svg into the PNG icons the PWA manifest needs
 * (public/icons/*.png, committed like the OG images). Run via
 * `npm run generate:pwa-icons` whenever favicon.svg changes — it isn't part
 * of the regular build since the source vector changes essentially never.
 *
 * Uses Playwright (already a dependency for OG-image generation and
 * prerendering) instead of adding an image-processing library.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const svg = readFileSync('public/favicon.svg', 'utf8');
const SIZES = [192, 512];

mkdirSync('public/icons', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const size of SIZES) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<!doctype html><html><body style="margin:0">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  const buffer = await page.screenshot({ omitBackground: false });
  const path = `public/icons/icon-${size}.png`;
  writeFileSync(path, buffer);
  console.log(`Wrote ${path}`);
}

await browser.close();
