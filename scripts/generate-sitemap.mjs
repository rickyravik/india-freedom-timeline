/**
 * Generates dist/sitemap.xml and dist/robots.txt after build.
 * Route list comes from scripts/lib/routes.mjs, shared with the prerender
 * script, so the sitemap always matches what actually got prerendered. The
 * origin comes from scripts/lib/site.mjs, shared with the app's own meta tags.
 */
import { writeFileSync } from 'node:fs';
import { getAllRoutes } from './lib/routes.mjs';
import { SITE_URL } from './lib/site.mjs';

const urls = getAllRoutes();
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync('dist/sitemap.xml', xml);

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
writeFileSync('dist/robots.txt', robots);

console.log(`sitemap.xml written with ${urls.length} URLs; robots.txt points at ${SITE_URL}`);
