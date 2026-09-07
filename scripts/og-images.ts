/**
 * Renders a 1200x630 Commemorative Sheet-styled social preview image for
 * every fighter, event and movement (plus one site default), after
 * prerendering. Run with tsx so it can import the typed data directly, the
 * same pattern as scripts/validate-content.ts.
 *
 * Straight to JPEG (quality 85), not PNG-with-fallback: the vault
 * background's grain texture rasterises to full-frame per-pixel noise the
 * instant a real screenshot captures it, which PNG cannot compress —
 * every card landed north of 1MB as a PNG in testing, so JPEG is the only
 * realistic path, not a fallback.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { fighters } from '../src/data/fighters/index.ts';
import { events } from '../src/data/events/index.ts';
import { movements } from '../src/data/movements.ts';
import { eras } from '../src/data/eras.ts';
import { regionNames } from '../src/data/regions.ts';

const CONCURRENCY = 6;
const eraById = new Map(eras.map((e) => [e.id, e]));

const eraHex: Record<string, string> = {
  indigo: '#23406b',
  oxide: '#c4611f',
  saffron: '#8e2f2a',
  forest: '#14453d',
  sepia: '#5b2e4a',
  brass: '#8f7a45',
};

/* Fonts embedded once as base64 data URIs so rendering never depends on
   the network — reused verbatim across every page load in this run. */
function fontFace(family: string, weightRange: string, path: string): string {
  const base64 = readFileSync(path).toString('base64');
  return `@font-face { font-family: '${family}'; font-weight: ${weightRange}; font-style: normal; src: url(data:font/woff2;base64,${base64}) format('woff2'); }`;
}
const displayFont = fontFace(
  'Bodoni Moda',
  '400 900',
  'node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-wght-normal.woff2',
);
const bodyFont = fontFace(
  'Archivo Narrow',
  '400 700',
  'node_modules/@fontsource-variable/archivo-narrow/files/archivo-narrow-latin-wght-normal.woff2',
);

function initialsOf(name: string): string {
  const stop = new Set(['of', 'the', 'dr', 'u', 'rani', 'babu', 'lala', 'begum', 'maulana', 'khan', 'sardar', 'captain', 'mahatma', 'pandit', 'sri', 'pasumpon', 'kittur', '&']);
  const parts = name
    .replace(/[().']/g, '')
    .split(/[\s-]+/)
    .filter((p) => p && !stop.has(p.toLowerCase()));
  const source = parts.length ? parts : name.split(/\s+/);
  return source
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

interface CardSpec {
  outPath: string;
  numeral: string;
  accent: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  summary: string;
  monogram: string;
}

/* A long name/title wraps to more lines at a fixed size — shrink it first
   rather than let it collide with the summary or the footer below. */
function titleFontSize(title: string): number {
  if (title.length > 34) return 50;
  if (title.length > 24) return 60;
  return 76;
}

function cardHtml(spec: CardSpec): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
${displayFont}
${bodyFont}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body {
  background: radial-gradient(circle at 12% 8%, #16403a, #10312b 55%, #0b241f 100%);
  position: relative;
  font-family: 'Archivo Narrow', sans-serif;
  color: #f2ede2;
}
.numeral {
  position: absolute;
  right: -30px;
  top: -90px;
  font-family: 'Bodoni Moda', serif;
  font-weight: 800;
  font-style: italic;
  font-size: 460px;
  line-height: 1;
  color: ${spec.accent};
  opacity: 0.16;
  user-select: none;
}
.frame {
  position: absolute;
  inset: 40px;
  border: 2px solid rgba(242, 237, 226, 0.28);
}
/* Bounded and clipped, not just positioned: a title long enough to still
   overflow even at the smallest size (or a very long eyebrow/summary)
   crops cleanly against this box instead of colliding with .brand below. */
.content {
  position: absolute;
  left: 88px;
  top: 70px;
  right: 140px;
  bottom: 150px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.eyebrow {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${spec.accent === '#f2ede2' ? '#dcc17f' : spec.accent};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title {
  margin-top: 18px;
  font-family: 'Bodoni Moda', serif;
  font-weight: 700;
  font-size: ${titleFontSize(spec.title)}px;
  line-height: 1.08;
  color: #f7f3ea;
}
.subtitle {
  margin-top: 20px;
  font-size: 30px;
  font-weight: 600;
  color: #dcc17f;
  flex-shrink: 0;
}
.summary {
  margin-top: 26px;
  font-family: 'Faustina', 'Archivo Narrow', serif;
  font-size: 28px;
  line-height: 1.45;
  color: #d3c9b4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.medallion {
  position: absolute;
  right: 90px;
  bottom: 90px;
  width: 140px;
  height: 140px;
  border-radius: 4px;
  background: ${spec.accent};
  color: #f7f3ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bodoni Moda', serif;
  font-weight: 700;
  font-size: 56px;
}
.brand {
  position: absolute;
  left: 88px;
  bottom: 70px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #f2ede2;
}
.brand span { color: #dcc17f; }
</style></head>
<body>
  <div class="numeral">${escapeHtml(spec.numeral)}</div>
  <div class="frame"></div>
  <div class="content">
    <div class="eyebrow">${escapeHtml(spec.eyebrow)}</div>
    <div class="title">${escapeHtml(spec.title)}</div>
    <div class="subtitle">${escapeHtml(spec.subtitle)}</div>
    <div class="summary">${escapeHtml(spec.summary)}</div>
  </div>
  <div class="medallion">${escapeHtml(spec.monogram)}</div>
  <div class="brand">India's <span>Freedom</span> Timeline</div>
</body></html>`;
}

const jobs: CardSpec[] = [];

for (const f of fighters) {
  const era = eraById.get(f.era);
  jobs.push({
    outPath: `dist/og/fighters/${f.slug}.jpg`,
    numeral: String(f.birthYear ?? era?.startYear ?? ''),
    accent: era ? eraHex[era.accent] : '#8f7a45',
    eyebrow: [era?.name, f.states[0]].filter(Boolean).join(' · '),
    title: f.name,
    subtitle: `${f.birthYear ?? '?'} – ${f.deathYear ?? '?'}`,
    summary: f.summary,
    monogram: initialsOf(f.name),
  });
}

for (const e of events) {
  const era = eraById.get(e.era);
  jobs.push({
    outPath: `dist/og/events/${e.slug}.jpg`,
    numeral: String(e.date.year),
    accent: era ? eraHex[era.accent] : '#8f7a45',
    eyebrow: [era?.name, e.location].filter(Boolean).join(' · '),
    title: e.title,
    subtitle: e.dateLabel,
    summary: e.summary,
    monogram: String(e.date.year),
  });
}

for (const m of movements) {
  jobs.push({
    outPath: `dist/og/movements/${m.slug}.jpg`,
    numeral: String(m.startYear),
    accent: '#8f7a45',
    eyebrow: [m.regions.map((r) => regionNames[r]).slice(0, 2).join(', ')].filter(Boolean).join(' · '),
    title: m.name,
    subtitle: m.period,
    summary: m.summary,
    monogram: initialsOf(m.name),
  });
}

jobs.push({
  outPath: 'dist/og/default.jpg',
  numeral: '1947',
  accent: '#c4611f',
  eyebrow: 'An interactive historical archive · 1757 — 1947',
  title: "India's Freedom Timeline",
  subtitle: 'Millions resisted. Thousands sacrificed.',
  summary: "Explore the people who fought for India's freedom — from the first risings against the East India Company to the midnight of 15 August 1947.",
  monogram: 'IFT',
});

const browser = await chromium.launch();
let failed = false;
const started = Date.now();

async function renderJob(spec: CardSpec) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  try {
    await page.setContent(cardHtml(spec), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const dir = spec.outPath.slice(0, spec.outPath.lastIndexOf('/'));
    mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: spec.outPath, type: 'jpeg', quality: 85 });
  } catch (err) {
    console.error(`[og-images] failed on ${spec.outPath}:`, err);
    failed = true;
  } finally {
    await page.close();
  }
}

async function runPool() {
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const spec = jobs[next++];
      await renderJob(spec);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker));
}

await runPool();
await browser.close();

const seconds = ((Date.now() - started) / 1000).toFixed(1);
console.log(`Rendered ${jobs.length} OG images in ${seconds}s.`);
if (failed) process.exit(1);
