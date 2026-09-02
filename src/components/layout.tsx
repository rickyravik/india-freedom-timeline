import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useKeyboardShortcut } from '@/lib/hooks';
import { SearchPalette } from '@/components/search-palette';

const NAV = [
  { to: '/', label: 'Home', end: true, icon: 'M4 11 12 4l8 7v9H4z' },
  { to: '/timeline', label: 'Timeline', icon: 'M12 3v18M6 8h12M6 16h12' },
  { to: '/fighters', label: 'People', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0' },
  { to: '/map', label: 'Map', icon: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v14M15 6v14' },
  { to: '/learn', label: 'Learn', icon: 'M4 5h16v11H4zM8 21h8M12 16v5' },
];

export function Emblem({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="17" fill="none" stroke="currentColor" strokeWidth="3" />
      <g stroke="currentColor" strokeWidth="1.4">
        <line x1="32" y1="15" x2="32" y2="49" />
        <line x1="15" y1="32" x2="49" y2="32" />
        <line x1="20" y1="20" x2="44" y2="44" />
        <line x1="44" y1="20" x2="20" y2="44" />
        <line x1="25.5" y1="16.3" x2="38.5" y2="47.7" />
        <line x1="38.5" y1="16.3" x2="25.5" y2="47.7" />
        <line x1="16.3" y1="25.5" x2="47.7" y2="38.5" />
        <line x1="16.3" y1="38.5" x2="47.7" y2="25.5" />
      </g>
      <circle cx="32" cy="32" r="4.5" fill="#c07a2c" />
    </svg>
  );
}

function Icon({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
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

/* Header: transparent over dark heroes, solid paper once scrolled.    */
function Header({ onSearch }: { onSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const heroPages = pathname === '/' || pathname.startsWith('/fighters/') || pathname.startsWith('/events/') || pathname.startsWith('/movements/');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dark = heroPages && !scrolled;

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-400 ease-cinematic ${
        dark ? 'border-b border-transparent bg-transparent text-paper-50' : 'border-b border-paper-300/80 bg-paper-100/90 text-ink shadow-[0_1px_0_rgba(34,28,21,0.04)] backdrop-blur-md'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="India's Freedom Timeline — home">
          <Emblem className={`h-8 w-8 shrink-0 ${dark ? 'text-paper-50' : 'text-indigo-deep'}`} />
          <span className="truncate font-display text-lg font-bold tracking-tight">
            India’s Freedom <span className={dark ? 'text-brass-bright' : 'text-oxide'}>Timeline</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-160 ${
                  isActive
                    ? dark
                      ? 'bg-paper-100/15 text-paper-50'
                      : 'bg-ink text-paper-50'
                    : dark
                      ? 'text-paper-200 hover:bg-paper-100/10 hover:text-paper-50'
                      : 'text-ink-soft hover:bg-paper-200 hover:text-ink'
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
          className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors duration-160 ${
            dark ? 'border-paper-100/25 text-paper-200 hover:border-paper-100/60 hover:text-paper-50' : 'border-paper-300 bg-paper-50 text-ink-faint hover:border-ink-faint hover:text-ink'
          }`}
          aria-label="Search the archive (keyboard shortcut: slash)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="hidden sm:inline">Search</span>
          <kbd className={`hidden rounded border px-1.5 py-0.5 font-body text-[10px] font-semibold lg:block ${dark ? 'border-paper-100/25' : 'border-paper-300'}`}>/</kbd>
        </button>
      </div>
    </header>
  );
}

/* Thumb navigation on phones                                          */
function MobileNav() {
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-300/80 bg-paper-100/95 pb-safe backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-1">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `relative flex min-h-14 min-w-14 flex-1 flex-col items-center justify-center gap-1 text-[10.5px] font-semibold tracking-wide transition-colors duration-160 ${isActive ? 'text-oxide' : 'text-ink-faint active:text-ink'}`
            }
          >
            {({ isActive }) => (
              <>
                <span aria-hidden="true" className={`absolute top-0 h-0.5 w-8 rounded-full bg-oxide transition-transform duration-400 ease-cinematic ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                <Icon d={n.icon} className={`h-[22px] w-[22px] transition-transform duration-160 ${isActive ? '-translate-y-px' : ''}`} />
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
    <footer className="vault pb-28 pt-14 md:pb-14">
      <div className="container-page">
        <div className="hairline-vault mb-10" />
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2 text-paper-50">
              <Emblem className="h-7 w-7" />
              <span className="font-display text-base font-bold">India’s Freedom Timeline</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-paper-400">
              An interactive archive of the people, movements and sacrifices of India’s struggle for independence, 1757–1947.
            </p>
          </div>
          <nav aria-label="Footer" className="text-sm">
            <p className="eyebrow-vault mb-3">Explore</p>
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
          <div className="text-sm text-paper-400">
            <p className="eyebrow-vault mb-3">A note on history</p>
            <p className="leading-relaxed">
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
    <div className="container-page py-12" aria-busy="true" aria-label="Loading">
      <div className="mb-8 h-10 w-2/5 animate-pulse rounded bg-paper-300" />
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
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-oxide focus:px-4 focus:py-2 focus:text-paper-50"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header onSearch={openSearch} />
      {/* -mt-16 lets dark heroes sit beneath the transparent header */}
      <main id="main" className="-mt-16 flex-1">
        <div key={pathname} className="page-enter">
          {children ?? <Outlet />}
        </div>
      </main>
      <Footer />
      <MobileNav />
      <SearchPalette open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
