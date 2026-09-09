import { useBookmarks, usePageMeta, useTrailProgress } from '@/lib/hooks';
import { clearProgress } from '@/lib/trails-progress';
import { fighterBySlug, trailBySlug } from '@/lib/content';
import { PageIntro, SectionHeading } from '@/components/ui';
import { TrailCard } from '@/components/trails';
import { FighterCard } from '@/components/cards';

export default function PassportPage() {
  usePageMeta('Your passport', 'Everything here is kept on this device only. There is nothing to compete for: a stamp means you reached the end of a trail.');
  const progress = useTrailProgress();
  const { bookmarks, toggle } = useBookmarks();

  const completed = Object.entries(progress)
    .filter(([, p]) => p.completed)
    .map(([slug]) => ({ slug, trail: trailBySlug.get(slug) }))
    .filter((x): x is { slug: string; trail: NonNullable<(typeof x)['trail']> } => Boolean(x.trail));
  const inProgress = Object.entries(progress)
    .filter(([, p]) => !p.completed && p.stop > 0)
    .map(([slug]) => ({ slug, trail: trailBySlug.get(slug) }))
    .filter((x): x is { slug: string; trail: NonNullable<(typeof x)['trail']> } => Boolean(x.trail));
  const saved = bookmarks.map((slug) => fighterBySlug.get(slug)).filter((f) => f !== undefined);

  return (
    <div className="pb-20">
      <PageIntro title="Your passport" lede="Everything here is kept on this device only. There is nothing to compete for: a stamp means you reached the end of a trail." />
      <div className="container-page space-y-14">
        <section aria-label="Completed trails">
          <SectionHeading title="Completed trails" />
          {completed.length === 0 ? (
            <p className="font-body text-meta text-ink-soft">Nothing stamped yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {completed.map(({ slug, trail }) => (
                <div key={slug} className="flex h-full flex-col gap-2">
                  <TrailCard trail={trail} progress={progress[slug]} />
                  <button type="button" className="btn-ghost self-start !min-h-10 !px-4" onClick={() => clearProgress(slug)}>
                    Forget this trail
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section aria-label="In progress">
          <SectionHeading title="In progress" />
          {inProgress.length === 0 ? (
            <p className="font-body text-meta text-ink-soft">Nothing in progress.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {inProgress.map(({ slug, trail }) => (
                <div key={slug} className="flex h-full flex-col gap-2">
                  <TrailCard trail={trail} progress={progress[slug]} />
                  <button type="button" className="btn-ghost self-start !min-h-10 !px-4" onClick={() => clearProgress(slug)}>
                    Forget this trail
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section aria-label="Saved stories">
          <SectionHeading title="Saved stories" />
          {saved.length === 0 ? (
            <p className="font-body text-meta text-ink-soft">No saved stories yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((f) => (
                <div key={f.id} className="flex h-full flex-col gap-2">
                  <FighterCard fighter={f} compact />
                  <button type="button" className="btn-ghost self-start !min-h-10 !px-4" onClick={() => toggle(f.slug)}>
                    Unsave
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
