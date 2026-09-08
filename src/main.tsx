import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, matchRoutes } from 'react-router-dom';
import App from './App';
import { routeTable, setPreloadedRoute } from '@/lib/routes';
import { initServiceWorker } from '@/lib/pwa';
import './index.css';

async function bootstrap() {
  // Real visitors only: never present during the prerender capture pass,
  // which re-adds this class right before snapshotting each page.
  document.documentElement.classList.remove('no-js');

  // Never during the prerender capture pass (window.__PRERENDERING__, set by
  // Playwright's addInitScript in scripts/prerender.mjs): a service worker
  // persists in Chromium's user-data dir across page navigations within the
  // same crawl, which would start serving stale cached routes to later pages
  // in that same prerender run.
  if (!window.__PRERENDERING__) initServiceWorker();

  const matched = matchRoutes(
    routeTable.map((r) => ({ path: r.path })),
    window.location.pathname,
  )?.[0];
  const entry = matched && routeTable.find((r) => r.path === matched.route.path);
  if (entry) {
    const [mod] = await Promise.all([entry.loader(), entry.preload?.(matched.params)]);
    setPreloadedRoute({ path: entry.path, Component: mod.default });
  }

  const rootEl = document.getElementById('root')!;
  const app = (
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
  // Restored by ScrollManager (src/components/layout.tsx), not the browser:
  // lazily loaded routes aren't tall enough yet when the browser would try.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // A route with no prerendered file of its own (a trail stop, reached only
  // by interaction) gets served the SPA fallback's markup instead — which is
  // the home page's prerendered HTML (not-found_handling: single-page-application,
  // wrangler.jsonc), not a matching snapshot of this route. hasChildNodes()
  // alone can't tell the two apart; the canonical link every page's
  // usePageMeta bakes in for its own route can, since it's stamped at the
  // exact pathname the snapshot was captured for.
  const canonicalPath = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const matchesThisRoute = canonicalPath ? new URL(canonicalPath, window.location.origin).pathname === window.location.pathname : false;
  if (rootEl.hasChildNodes() && matchesThisRoute) {
    // Tells useUrlState's initialisers this first render must match the
    // prerendered snapshot (which was captured with no query string). App
    // clears it after the first commit.
    rootEl.dataset.hydrating = 'true';
    hydrateRoot(rootEl, app);
  } else {
    rootEl.innerHTML = '';
    createRoot(rootEl).render(app);
  }
}

bootstrap();
