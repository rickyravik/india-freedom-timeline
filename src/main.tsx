import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, matchRoutes } from 'react-router-dom';
import App from './App';
import { routeTable, setPreloadedRoute } from '@/lib/routes';
import './index.css';

async function bootstrap() {
  // Real visitors only: never present during the prerender capture pass,
  // which re-adds this class right before snapshotting each page.
  document.documentElement.classList.remove('no-js');

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
  if (rootEl.hasChildNodes()) {
    hydrateRoot(rootEl, app);
  } else {
    createRoot(rootEl).render(app);
  }
}

bootstrap();
