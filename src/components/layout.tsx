import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useKeyboardShortcut } from '@/lib/hooks';
import { SearchPalette } from '@/components/search-palette';
import { Icon, icons } from '@/components/ui';

const NAV = [
  { to: '/', label: 'Home', end: true, icon: 'M4 11 12 4l8 7v9H4z' },
  { to: '/timeline', label: 'Timeline', icon: 'M12 3v18M6 8h12M6 16h12' },
  { to: '/fighters', label: 'People', icon: icons.person },
  { to: '/map', label: 'Map', icon: icons.map },
  { to: '/learn', label: 'Learn', icon: 'M4 5h16v11H4zM8 21h8M12 16v5' },
];

/* The Ashoka Chakra has 24 spokes. */
const SPOKES = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 12;
  const r = 17;
  return { x1: 32 + r * Math.cos(a), y1: 32 + r * Math.sin(a), x2: 32 - r * Math.cos(a), y2: 32 - r * Math.sin(a) };
});

export function Emblem({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="17" fill="none" stroke="currentColor" strokeWidth="3" />
      <g stroke="currentColor" strokeWidth="1.2">
        {SPOKES.map((s, i) => (
          <line key={i} x1={s.x1.toFixed(2)} y1={s.y1.toFixed(2)} x2={s.x2.toFixed(2)} y2={s.y2.toFixed(2)} />
        ))}
      </g>
      <circle cx="32" cy="32" r="4.5" fill="#c07a2c" />
    </svg>
  );
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

/* Header: the album page's own margin — always ink, never over a sheet. */
function Header({ onSearch }: { onSearch: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-brass-bright/25 bg-vault text-paper-100">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="India's Freedom Timeline — home">
          <Emblem className="h-8 w-8 shrink-0 text-brass-bright" />
          <span className="truncate font-display text-lg font-bold text-paper-50">India’s Freedom Timeline</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `border-b-2 py-1.5 font-body text-meta font-medium transition-colors duration-160 ${
                  isActive
                    ? 'border-oxide text-paper-50'
                    : 'border-transparent text-paper-300 hover:border-paper-100/40 hover:text-paper-50'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={onSearch}
          className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-paper-100/40 px-3 font-body text-meta font-medium text-paper-200 transition-colors duration-160 hover:border-paper-100 hover:text-paper-50"
          aria-label="Search the archive (keyboard shortcut: slash)"
        >
          <Icon d={icons.search} className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded-sm border border-paper-100/40 px-1.5 font-body text-xs font-medium lg:block">/</kbd>
        </button>
      </div>
    </header>
  );
}

/* Thumb navigation on phones                                          */
function MobileNav() {
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-brass-bright/25 bg-vault pb-safe md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-1">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `relative flex min-h-14 min-w-14 flex-1 flex-col items-center justify-center gap-1 font-body text-xs font-medium transition-colors duration-160 ${isActive ? 'text-oxide-bright' : 'text-paper-300 active:text-paper-50'}`
            }
          >
            {({ isActive }) => (
              <>
                <span aria-hidden="true" className={`absolute top-0 h-0.5 w-8 bg-oxide-bright transition-transform duration-400 ease-cinematic ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                <Icon d={n.icon} className="h-[22px] w-[22px]" />
                {n.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-vault pb-28 pt-14 text-paper-100 md:pb-14">
      <div className="container-page">
        <div className="rule-double-vault mb-10" />
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2 text-paper-50">
              <Emblem className="h-7 w-7" />
              <span className="font-display text-base font-bold">India’s Freedom Timeline</span>
            </div>
            <p className="max-w-xs font-body text-meta text-paper-400">
              An interactive archive of the people, movements and sacrifices of India’s struggle for independence, 1757–1947.
            </p>
          </div>
          <nav aria-label="Footer" className="font-body text-meta">
            <p className="label-vault mb-3">Explore</p>
            <ul className="grid grid-cols-2 gap-2 text-paper-300">
              {[
                ['/timeline', 'Timeline'],
                ['/fighters', 'Freedom fighters'],
                ['/events', 'Events'],
                ['/movements', 'Movements'],
                ['/map', 'Map of India'],
                ['/learn', 'Learn & quiz'],
                ['/search', 'Search'],
                ['/about', 'About & sources'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link className="transition-colors hover:text-brass-bright" to={to}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="font-body text-meta text-paper-400">
            <p className="label-vault mb-3">A note on history</p>
            <p>
              Biographies cite published sources; claims historians dispute are labelled. Found an error? History deserves correction — see{' '}
              <Link to="/about" className="text-paper-200 underline decoration-brass-bright/60 underline-offset-2 hover:text-brass-bright">
                About
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function RouteFallback() {
  return (
    <div className="container-page py-8" aria-busy="true" aria-label="Loading">
      <div className="rule-double mb-6" />
      <div className="mb-8 h-10 w-2/5 animate-pulse rounded-sm bg-paper-300" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="doc h-44 animate-pulse bg-paper-200" />
        ))}
      </div>
    </div>
  );
}

export function Layout({ children }: { children?: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useKeyboardShortcut(
    useCallback((e: KeyboardEvent) => (e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !e.metaKey && !e.ctrlKey), []),
    openSearch,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-sm focus:bg-oxide focus:px-4 focus:py-2 focus:text-paper-50"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header onSearch={openSearch} />
      {/* Every route is one gummed sheet, mounted on the album page. */}
      <main id="main" className="flex-1">
        <div className="container-page py-5 sm:py-8">
          <div key={pathname} className="sheet perf-x page-enter">
            {children ?? <Outlet />}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
      <SearchPalette open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
