import { usePageMeta } from '@/lib/hooks';
import { EmptyState, Icon, PageIntro, icons } from '@/components/ui';

/**
 * Served by the service worker (src/sw.ts) as the navigation fallback when a
 * page fails to load offline and isn't already cached from an earlier visit
 * (see StaleWhileRevalidate's "pages" cache) — a normal prerendered route
 * like any other, just one the SW keeps a cached copy of specifically so it
 * can hand it back with no network at all.
 */
export default function OfflinePage() {
  usePageMeta("You're offline", 'This page needs a connection the first time you open it — pages you have already visited stay available offline.');

  return (
    <div className="pb-20">
      <PageIntro title="You're offline" lede="This page hasn't been saved for offline reading yet." />
      <div className="container-page">
        <EmptyState
          title="No connection"
          hint="Pages you've already opened stay available without one. Reconnect and try again to reach this one."
          action={
            <button type="button" onClick={() => window.location.reload()} className="btn-seal">
              <Icon d={icons.refresh} className="h-4 w-4" />
              Try again
            </button>
          }
        />
      </div>
    </div>
  );
}
