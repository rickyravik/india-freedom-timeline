import { existsSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * `vite preview`'s static server resolves a bare `/fighters` to
 * `dist/fighters/index.html` only if the request already ends in a slash
 * (or the extension is spelled out) — the prerender script writes
 * `dist/<route>/index.html` for every route, so a pretty URL with no
 * trailing slash otherwise falls through to the SPA shell instead of the
 * real prerendered file. Only affects `vite preview`; has no effect on
 * `vite dev` or the production build itself, and Cloudflare Workers Assets
 * (the real deploy target) resolves this correctly on its own.
 *
 * The path must be checked with its query string stripped off first: a
 * request like `/timeline?region=south` otherwise never matches
 * `dist/timeline?region=south/index.html` (which can't exist), silently
 * falls through to the raw app shell instead of the prerendered snapshot for
 * that route, and hydrates against the wrong DOM — a real hydration
 * mismatch, not a bug in whatever page is being visited.
 */
function prettyUrlPreviewFallback(): Plugin {
  return {
    name: 'pretty-url-preview-fallback',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) return next();
        const [pathname, search] = req.url.split('?');
        if (!pathname.includes('.') && existsSync(`dist${pathname}/index.html`)) {
          req.url = `${pathname}/index.html${search ? `?${search}` : ''}`;
        }
        next();
      });
    },
  };
}

/**
 * Cloudflare Web Analytics beacon, injected only when VITE_CF_BEACON_TOKEN
 * is set at build time — a transformIndexHtml plugin, not a runtime check
 * in the React tree: a runtime `{token && <script>...}` would still ship
 * the script tag's shape (and the conditional itself) in every build
 * regardless of whether a token is configured. This way, a tokenless build
 * has zero trace of it anywhere in the output.
 *
 * Loaded conditionally on window.__PRERENDERING__ (the same flag
 * src/lib/hooks.ts and src/main.tsx already gate on), not a bare
 * `<script src>`: scripts/prerender.mjs crawls `vite preview` on
 * localhost, a different origin than the beacon's configured zone, and the
 * real script's background reporting call fails there with a CORS error —
 * which prerender.mjs treats as a fatal build failure. A real visitor on
 * the deployed domain never has __PRERENDERING__ set, so the beacon still
 * loads normally for them.
 */
function cloudflareBeacon(token: string): Plugin {
  return {
    name: 'cloudflare-beacon',
    transformIndexHtml: () =>
      token
        ? [
            {
              tag: 'script',
              injectTo: 'head' as const,
              children: `if (!window.__PRERENDERING__) { var s = document.createElement('script'); s.defer = true; s.src = 'https://static.cloudflareinsights.com/beacon.min.js'; s.setAttribute('data-cf-beacon', ${JSON.stringify(JSON.stringify({ token }))}); document.head.appendChild(s); }`,
            },
          ]
        : [],
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (!env.VITE_SITE_URL) {
    throw new Error('VITE_SITE_URL is not set — add it to .env (see README, "Configuration").');
  }
  return {
    // configurePreviewServer only ever runs under `vite preview`, so this is
    // inert for `vite dev`/`vite build` — no need to gate it on `command`.
    plugins: [
      react(),
      prettyUrlPreviewFallback(),
      cloudflareBeacon(env.VITE_CF_BEACON_TOKEN ?? ''),
      VitePWA({
        // injectManifest, not generateSW: a hand-written service worker
        // (src/sw.ts) so navigation caching is registered exactly once, in
        // the order we choose — generateSW's own navigateFallback option
        // registers ahead of any runtimeCaching rule and wins unconditionally,
        // which would silently defeat the cache-first-with-revalidate
        // strategy src/sw.ts implements.
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        injectRegister: false, // registered manually from src/lib/pwa.ts, not auto-injected
        registerType: 'prompt', // the update toast (UpdateToast) controls when to activate a new SW
        injectManifest: {
          // The app shell only — OG images and the 157 per-record prerendered
          // pages are content, not shell, and would bloat the precache by
          // tens of megabytes for no offline benefit over runtime caching.
          // The offline fallback page is cached separately, at install time
          // (see src/sw.ts) — it doesn't exist yet at this point in the build,
          // since scripts/prerender.mjs (which writes it) runs after `vite
          // build` (and this manifest scan) completes.
          globPatterns: ['assets/**/*.{js,css,woff2}', 'index.html'],
        },
        manifest: {
          name: "India's Freedom Timeline",
          short_name: 'Freedom Timeline',
          description: "An immersive, interactive timeline of India's struggle for independence.",
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#10312b', // vault — matches body's own background
          theme_color: '#c4611f', // oxide — the one accent ink
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2020',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
  };
});
