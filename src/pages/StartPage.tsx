import { Link } from 'react-router-dom';
import { trails } from '@/lib/content';
import { usePageMeta, useTrailProgress } from '@/lib/hooks';
import { Icon, PageIntro, icons } from '@/components/ui';
import { TrailCard } from '@/components/trails';

export default function StartPage() {
  usePageMeta('Start exploring', 'New here? Two minutes on what this archive is and how to read it, then a five-minute trail or the full timeline.');
  const progress = useTrailProgress();
  return (
    <div className="pb-20">
      <PageIntro title="Start exploring" lede="This is an archive of the people who resisted British rule in India between 1757 and 1947 — the famous names and, above all, the ones most of us were never taught." />
      <div className="container-page space-y-14">
        <section className="max-w-prose space-y-5" aria-label="How to read this archive">
          <p className="prose-reading">Every person has a quick story and a detailed history. Every claim that matters carries a small numbered marker: touch it to see the source. Words like <em>satyagraha</em> or <em>palaiyakkarar</em> are explained the first time they appear.</p>
          <p className="prose-reading">Where historians disagree, or where a story rests on memory rather than documents, the page says so. Nothing here is invented — including the portraits: where no verified likeness exists, you will see a monogram instead.</p>
        </section>
        <section aria-label="Choose a route" className="grid gap-4 sm:grid-cols-2">
          <Link to="/trails" className="doc-interactive group flex flex-col p-6">
            <span className="stamp w-fit text-oxide-deep">Five minutes</span>
            <span className="mt-3 font-display text-h3 text-ink group-hover:text-oxide">Follow a trail</span>
            <span className="mt-2 font-body text-meta text-ink-soft">A question, five or six stops, the evidence beside each one. Your place is kept on this device.</span>
            <Icon d={icons.arrowRight} className="mt-auto h-4 w-4 text-brass-deep" />
          </Link>
          <Link to="/timeline?view=chapters" className="doc-interactive group flex flex-col p-6">
            <span className="stamp w-fit text-sepia">Longer</span>
            <span className="mt-3 font-display text-h3 text-ink group-hover:text-oxide">Read the chapters</span>
            <span className="mt-2 font-body text-meta text-ink-soft">Nine chapters from Plassey to midnight, each with what was changing, its people and its events.</span>
            <Icon d={icons.arrowRight} className="mt-auto h-4 w-4 text-brass-deep" />
          </Link>
        </section>
        <section aria-label="Trails" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trails.map((t) => (
            <TrailCard key={t.id} trail={t} progress={progress[t.slug]} />
          ))}
        </section>
      </div>
    </div>
  );
}
