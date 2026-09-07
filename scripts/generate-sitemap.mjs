/**
 * Generates dist/sitemap.xml after build.
 * Route list comes from scripts/lib/routes.mjs, shared with the prerender
 * script, so the sitemap always matches what actually got prerendered.
 */
import { writeFileSync } from 'node:fs';
import { getAllRoutes } from './lib/routes.mjs';

const SITE = process.env.SITE_URL ?? 'https://india-freedom-timeline.pages.dev';

const urls = getAllRoutes();

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;

writeFileSync('dist/sitemap.xml', xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
