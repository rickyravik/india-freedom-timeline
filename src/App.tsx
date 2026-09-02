import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Layout, RouteFallback } from '@/components/layout';

/* Route-based code splitting: each page loads on demand. */
const HomePage = lazy(() => import('@/pages/HomePage'));
const TimelinePage = lazy(() => import('@/pages/TimelinePage'));
const FightersPage = lazy(() => import('@/pages/FightersPage'));
const FighterProfilePage = lazy(() => import('@/pages/FighterProfilePage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const EventPage = lazy(() => import('@/pages/EventPage'));
const MovementsPage = lazy(() => import('@/pages/MovementsPage'));
const MovementPage = lazy(() => import('@/pages/MovementsPage').then((m) => ({ default: m.MovementPage })));
const MapPage = lazy(() => import('@/pages/MapPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const LearnPage = lazy(() => import('@/pages/LearnPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));

function NotFound() {
  return (
    <div className="container-page pb-20 pt-32 text-center">
      <p className="eyebrow mb-2">Page not found</p>
      <h1 className="mb-4 text-3xl font-bold">This trail goes cold…</h1>
      <p className="mx-auto mb-6 max-w-md text-ink-soft">
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
          <p className="eyebrow mb-2">Something went wrong</p>
          <h1 className="mb-4 text-3xl font-bold">A page failed to load</h1>
          <p className="mx-auto mb-6 max-w-md text-ink-soft">Please reload, or return to the home page.</p>
          <a className="btn-seal" href="/">Back to home</a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<RouteFallback />}>
                <HomePage />
              </Suspense>
            }
          />
          {(
            [
              ['/timeline', <TimelinePage />],
              ['/fighters', <FightersPage />],
              ['/fighters/:slug', <FighterProfilePage />],
              ['/events', <EventsPage />],
              ['/events/:slug', <EventPage />],
              ['/movements', <MovementsPage />],
              ['/movements/:slug', <MovementPage />],
              ['/map', <MapPage />],
              ['/search', <SearchPage />],
              ['/learn', <LearnPage />],
              ['/about', <AboutPage />],
            ] as const
          ).map(([path, el]) => (
            <Route key={path} path={path} element={<Suspense fallback={<RouteFallback />}>{el}</Suspense>} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
