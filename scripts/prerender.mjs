/**
 * Prerenders every route to static HTML after `vite build`. This is
 * browser-snapshot prerendering, not true SSR: a headless Chromium visits
 * `vite preview`'s server for every route, waits for the app to mount and
 * call usePageMeta (which sets data-prerender-ready once title/meta/OG tags
 * are in place — see src/lib/hooks.ts), then writes the live DOM to
 * dist/<route>/index.html. The root route overwrites dist/index.html.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { preview } from 'vite';
import { chromium } from 'playwright';
import { getAllRoutes } from './lib/routes.mjs';

const CONCURRENCY = 6;

const server = await preview({ preview: { port: 0 }, logLevel: 'silent' });
const base = server.resolvedUrls?.local?.[0]?.replace(/\/$/, '');
if (!base) {
  throw new Error('prerender: vite preview server did not report a URL to crawl');
}

const browser = await chromium.launch();
let failed = false;

async function crawlRoute(route) {
  const page = await browser.newPage();
  await page.addInitScript(() => {
    window.__PRERENDERING__ = true;
  });
  page.on('pageerror', (e) => {
    console.error(`[${route}] page error: ${e.message}`);
    failed = true;
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`[${route}] console error: ${msg.text()}`);
      failed = true;
    }
  });

  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  try {
    await page.waitForFunction(() => document.documentElement.dataset.prerenderReady === 'true', { timeout: 15000 });
  } catch {
    console.error(`[${route}] data-prerender-ready was never set`);
    failed = true;
  }
  // Reveals must show up fully visible in the captured HTML (no-js is
  // removed by main.tsx on real boot, and the observer that would normally
  // add in-view is disabled while __PRERENDERING__ is set — see
  // src/lib/hooks.ts's useReveal).
  await page.evaluate(() => document.documentElement.classList.add('no-js'));

  // The instant any inline style property is set via the CSSOM (which is
  // how React applies a `style` prop), the browser re-serialises the whole
  // attribute in its own canonical form — "prop: value; prop2: value2;",
  // with a space after each colon and a trailing semicolon. React's own
  // hydration check builds its expected string differently — no spaces, no
  // trailing semicolon — so every element with an inline style prop would
  // otherwise mismatch the instant this captured markup is loaded fresh and
  // hydrated. Rewrite every style attribute into that exact compact form
  // before capture so the two agree.
  await page.evaluate(() => {
    // Shorthand grid-column/grid-row also get expanded into their longhand
    // start/end pair by the CSSOM the moment they're set — collapse a
    // longhand pair back into the shorthand React originally wrote,
    // whenever the -end half is just "auto" (a bare column/row index, no
    // span), the only form this app's inline styles ever use.
    const shorthands = [
      ['grid-column-start', 'grid-column-end', 'grid-column'],
      ['grid-row-start', 'grid-row-end', 'grid-row'],
    ];
    document.querySelectorAll('[style]').forEach((el) => {
      const props = [];
      for (let i = 0; i < el.style.length; i++) props.push(el.style[i]);
      const skip = new Set();
      const decls = [];
      for (const prop of props) {
        if (skip.has(prop)) continue;
        let name = prop;
        const shorthand = shorthands.find(([start]) => start === prop);
        if (shorthand) {
          const [start, end, combined] = shorthand;
          if (props.includes(end) && el.style.getPropertyValue(end) === 'auto') {
            name = combined;
            skip.add(end);
          }
        }
        decls.push(`${name}:${el.style.getPropertyValue(prop)}`);
      }
      el.setAttribute('style', decls.join(';'));
    });
  });

  // Two adjacent JSX text expressions with nothing between them (no element,
  // no static text) become two separate DOM text nodes when React renders —
  // but collapse into a single text node the instant the HTML is serialised
  // and re-parsed, since plain text carries no node boundary in HTML. React
  // still expects two nodes when hydrating and calls that a mismatch. Real
  // server rendering avoids this by writing an empty comment between such
  // nodes; do the same here, walking the still-live DOM (its node boundaries
  // are still real objects at this point, before any serialisation).
  await page.evaluate(() => {
    function markTextBoundaries(el) {
      let child = el.firstChild;
      while (child) {
        const next = child.nextSibling;
        if (child.nodeType === Node.TEXT_NODE && next?.nodeType === Node.TEXT_NODE) {
          el.insertBefore(document.createComment(''), next);
        }
        if (child.nodeType === Node.ELEMENT_NODE) markTextBoundaries(child);
        child = next;
      }
    }
    markTextBoundaries(document.getElementById('root'));
  });

  const html = await page.content();
  const outDir = route === '' ? 'dist' : `dist${route}`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/index.html`, html);
  await page.close();
}

async function crawlPool(routeList) {
  let next = 0;
  async function worker() {
    while (next < routeList.length) {
      const route = routeList[next++];
      await crawlRoute(route);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, routeList.length) }, worker));
}

const started = Date.now();

// The root route overwrites dist/index.html, which vite preview's SPA
// fallback serves for every route that has no prerendered file of its own
// yet — crawl it last (alone, after the pool finishes), or a concurrent
// crawl of some other route could get the home page's already-populated
// DOM as its "empty shell" fallback and hydrate against the wrong content.
const allRoutes = getAllRoutes();
const otherRoutes = allRoutes.filter((r) => r !== '');
await crawlPool(otherRoutes);
if (allRoutes.includes('')) await crawlRoute('');

await browser.close();
await server.close();

const seconds = ((Date.now() - started) / 1000).toFixed(1);
console.log(`Prerendered ${allRoutes.length} routes in ${seconds}s.`);
if (failed) process.exit(1);
