import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Layout, RouteFallback } from '@/components/layout';
import { routeTable, getPreloadedRoute } from '@/lib/routes';

/* Route-based code splitting: each page loads on demand. lazy() must be
   called once per route at module scope (not per render), so this map is
   built here rather than inside App(). */
const lazyComponents = new Map(routeTable.map((r) => [r.path, lazy(r.loader)]));

function NotFound() {
  return (
    <div className="container-page pb-20 pt-32 text-center">
      <div className="rule-double mx-auto mb-6 max-w-xs" />
      <h1 className="mb-4 text-h2">This trail goes cold</h1>
      <p className="mx-auto mb-6 max-w-md font-body text-meta text-ink-soft">
        The page you are looking for doesn’t exist. But thousands of stories are waiting to be discovered.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link className="btn-seal" to="/">Back to home</Link>
        <Link className="btn-ghost" to="/timeline">Explore the timeline</Link>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container-page pb-20 pt-32 text-center">
          <div className="rule-double mx-auto mb-6 max-w-xs" />
          <h1 className="mb-4 text-h2">A page failed to load</h1>
          <p className="mx-auto mb-6 max-w-md font-body text-meta text-ink-soft">Please reload, or return to the home page.</p>
          <a className="btn-seal" href="/">Back to home</a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  /* Set once, before the very first render (see src/lib/routes.tsx) — only
     ever matches the route active on initial page load. */
  const preloaded = getPreloadedRoute();
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          {routeTable.map(({ path }) => {
            const Lazy = lazyComponents.get(path)!;
            const element =
              preloaded && preloaded.path === path ? (
                <preloaded.Component />
              ) : (
                <Suspense fallback={<RouteFallback />}>
                  <Lazy />
                </Suspense>
              );
            return path === '/' ? <Route key={path} index element={element} /> : <Route key={path} path={path} element={element} />;
          })}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
