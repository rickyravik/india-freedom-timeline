import { existsSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * `vite preview`'s static server resolves a bare `/fighters` to
 * `dist/fighters/index.html` only if the request already ends in a slash
 * (or the extension is spelled out) — the prerender script writes
 * `dist/<route>/index.html` for every route, so a pretty URL with no
 * trailing slash otherwise falls through to the SPA shell instead of the
 * real prerendered file. Only affects `vite preview`; has no effect on
 * `vite dev` or the production build itself, and Cloudflare Workers Assets
 * (the real deploy target) resolves this correctly on its own.
 */
function prettyUrlPreviewFallback(): Plugin {
  return {
    name: 'pretty-url-preview-fallback',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && !req.url.includes('.') && existsSync(`dist${req.url}/index.html`)) {
          req.url = `${req.url}/index.html`;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => ({
  // configurePreviewServer only ever runs under `vite preview`, so this is
  // inert for `vite dev`/`vite build` — no need to gate it on `command`.
  plugins: [react(), prettyUrlPreviewFallback()],
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
}));
