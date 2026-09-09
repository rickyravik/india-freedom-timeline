import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import type { TrailRef } from '@/types';
import { eventById, fighterById, movementById, trailBySlug, trails } from '@/lib/content';
import { usePageMeta, useTrailProgress, useUrlState } from '@/lib/hooks';
import { flag, oneOfDefault } from '@/lib/url-state';
import { markComplete, setStop } from '@/lib/trails-progress';
import { track } from '@/lib/analytics';
import { fontImportFor, resolveTrailText } from '@/lib/translations';
import { trailUrls, estimateBytes, formatBytes } from '@/lib/offline-trail';
import { cacheTrail, dropTrail, isTrailCached } from '@/lib/pwa';
import { Breadcrumbs, Icon, PageIntro, Postmark, SectionHeading, Segmented, SourceList, eraAccent, icons } from '@/components/ui';
import { DraftStamp, ReadingText } from '@/components/reading';
import { ChoiceActivity, OrderActivity, TrailCard, TrailProgress } from '@/components/trails';
import { EventCard, FighterCard, MovementCard } from '@/components/cards';
import { AudioPlayer } from '@/components/audio-player';
import type { Trail, TrailLang } from '@/types';

const TRAIL_LANGS = ['en', 'ta', 'hi'] as const;
const langLabel: Record<TrailLang, string> = { en: 'English', ta: 'தமிழ்', hi: 'हिन्दी' };

function LanguageSwitch({ trail, lang, onChange }: { trail: { translations?: { lang: Exclude<TrailLang, 'en'> }[] }; lang: TrailLang; onChange: (l: TrailLang) => void }) {
  if (!trail.translations?.length) return null;
  const available: TrailLang[] = ['en', ...trail.translations.map((t) => t.lang)];
  return <Segmented label="Language" value={lang} onChange={onChange} options={available.map((l) => ({ value: l, label: langLabel[l] }))} />;
}

const stopParams = { text: flag(), lang: oneOfDefault(TRAIL_LANGS, 'en') };
const overviewParams = { lang: oneOfDefault(TRAIL_LANGS, 'en') };

function OfflineControl({ trail }: { trail: Trail }) {
  const supported = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
  const [cached, setCached] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supported) return;
    let live = true;
    void isTrailCached(trail.slug).then((v) => {
      if (live) setCached(v);
    });
    return () => {
      live = false;
    };
  }, [trail.slug, supported]);

  if (!supported) {
    return <p className="font-body text-label text-ink-faint">Saving for offline reading needs a browser with service worker support.</p>;
  }
  if (cached === null) return null;

  const urls = trailUrls(trail, {
    fighterSlug: (id) => fighterById.get(id)?.slug,
    eventSlug: (id) => eventById.get(id)?.slug,
    portrait: (id) => fighterById.get(id)?.portrait,
  });

  if (cached) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-body text-label text-ink-faint">Saved for offline</p>
        <button
          type="button"
          className="btn-ghost !min-h-10 !px-4"
          onClick={async () => {
            await dropTrail(trail.slug);
            setCached(false);
          }}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="btn-ghost !min-h-10 !px-4"
      disabled={saving}
      onClick={async () => {
        setSaving(true);
        await cacheTrail(trail.slug, urls);
        setSaving(false);
        setCached(true);
      }}
    >
      {saving ? 'Saving…' : `Save this trail for offline reading (${formatBytes(estimateBytes(urls))})`}
    </button>
  );
}

/* `target`, not `ref`: React reserves the `ref` prop on function components. */
function RefCard({ target: r, compact = false }: { target: TrailRef; compact?: boolean }) {
  if (r.kind === 'fighter') {
    const f = fighterById.get(r.id);
    return f ? <FighterCard fighter={f} compact={compact} /> : null;
  }
  if (r.kind === 'event') {
    const e = eventById.get(r.id);
    return e ? <EventCard event={e} /> : null;
  }
  const m = movementById.get(r.id);
  return m ? <MovementCard movement={m} /> : null;
}

/* ------------------------------------------------------------------ */
export default function TrailsPage() {
  usePageMeta('Trails', 'Short guided journeys through the archive: a question, a handful of stops, and the evidence behind each one.');
  const progress = useTrailProgress();
  return (
    <div className="pb-20">
      <PageIntro title="Trails" lede="A trail is a short editorial journey: it starts with a question, moves through a few people, events and places with their sources beside them, and ends with something to think about. Stop and leave whenever you like; your place is kept on this device." />
      <div className="container-page">
        <SectionHeading title="All trails" />
      </div>
      <div className="container-page grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trails.map((t) => (
          <TrailCard key={t.id} trail={t} progress={progress[t.slug]} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function TrailPage() {
  const { slug } = useParams();
  const trail = slug ? trailBySlug.get(slug) : undefined;
  usePageMeta(trail?.title ?? 'Trail', trail?.question);
  const progress = useTrailProgress();
  const [{ lang }, setParams] = useUrlState(overviewParams);
  const text = trail ? resolveTrailText(trail, lang) : undefined;

  useEffect(() => {
    if (text && text.lang !== 'en') void fontImportFor[text.lang]();
  }, [text?.lang]);

  if (!trail || !text) return <Navigate to="/trails" replace />;

  const p = progress[trail.slug];
  const resume = p && !p.completed && p.stop > 0 ? p.stop : 1;
  return (
    <article>
      <header className="container-page pt-2">
        <div className={`perf-all on-sheet relative animate-fade-up px-5 py-7 sm:px-9 sm:py-10 ${eraAccent.bg[trail.accent]} ${eraAccent.onInk[trail.accent]} on-vault`}>
          <Postmark lines={['Trail', String(trail.stops.length), 'stops']} className="absolute right-4 top-5 hidden sm:grid" />
          <Breadcrumbs vault items={[{ label: 'Home', to: '/' }, { label: 'Trails', to: '/trails' }, { label: trail.title }]} />
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className={`stamp w-fit ${eraAccent.onInkMuted[trail.accent]}`}>{trail.theme}</p>
            <LanguageSwitch trail={trail} lang={lang} onChange={(l) => setParams({ lang: l })} />
          </div>
          <div lang={text.lang}>
            <h1 className="mt-3 max-w-3xl break-words text-h1 sm:pr-28 sm:text-hero">{text.title}</h1>
            <p className={`mt-4 max-w-2xl font-reading text-h4 italic ${eraAccent.onInkMuted[trail.accent]}`}>{text.question}</p>
          </div>
          {text.stale && <p className={`num mt-3 font-body text-label ${eraAccent.onInkMuted[trail.accent]}`}>This translation was made from an earlier English version; wording may differ until it is updated.</p>}
          <p className={`num mt-5 font-body text-label ${eraAccent.onInkMuted[trail.accent]}`}>
            {trail.stops.length} stops · about {trail.minutes} minutes · a text-only version is available on every stop
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to={`/trails/${trail.slug}/stop/${resume}`} className="btn-seal" onClick={() => track('trail_started', { trail: trail.slug })}>
              {resume > 1 ? `Resume at stop ${resume}` : 'Start the trail'}
              <Icon d={icons.arrowRight} className="h-4 w-4" />
            </Link>
            <Link to={`/trails/${trail.slug}/teach`} className="btn-ghost-vault">
              For teachers and families
            </Link>
            {trail.editorial.status !== 'reviewed' && <DraftStamp vault />}
          </div>
        </div>
      </header>
      <div className="container-page grid grid-cols-1 gap-10 py-14 lg:grid-cols-[1fr_320px]">
        <div lang={text.lang} className="max-w-prose space-y-6">
          <p className="prose-reading dropcap">{text.intro}</p>
          <div className="doc p-5">
            <p className="label mb-1">What you will be able to do</p>
            <p className="font-body text-meta text-ink">{trail.learningGoal}</p>
          </div>
          <OfflineControl trail={trail} />
        </div>
        <aside>
          <p className="label mb-3">The stops</p>
          <ol className="space-y-2">
            {text.stops.map((s, i) => (
              <li key={trail.stops[i].id}>
                <Link to={`/trails/${trail.slug}/stop/${i + 1}`} className="doc-interactive flex items-baseline gap-3 p-3 font-body text-meta">
                  <span className="num font-display font-bold text-brass-deep">{i + 1}</span>
                  <span lang={text.lang} className="text-ink">
                    {s.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
export function TrailStopPage() {
  const { slug, n } = useParams();
  const trail = slug ? trailBySlug.get(slug) : undefined;
  const index = Number(n) - 1;
  const stop = trail && Number.isInteger(index) && index >= 0 && index < trail.stops.length ? trail.stops[index] : undefined;
  const [{ text: textOnly, lang }, setParams] = useUrlState(stopParams);
  const text = trail ? resolveTrailText(trail, lang) : undefined;
  const translatedStop = text?.stops[index];
  usePageMeta(translatedStop && trail ? `${translatedStop.title} — ${trail.title}` : 'Trail', translatedStop?.question ?? trail?.question);
  const narration = trail?.narration?.find((n) => n.lang === text?.lang);
  const [listening, setListening] = useState(false);
  const [highlightParagraph, setHighlightParagraph] = useState<number | null>(null);

  useEffect(() => {
    if (!trail || !stop) return;
    setStop(trail.slug, index + 1);
    track('trail_stop_viewed', { trail: trail.slug, stop: index + 1 });
  }, [trail, stop, index]);

  useEffect(() => {
    setListening(false);
    setHighlightParagraph(null);
  }, [stop?.id]);

  useEffect(() => {
    if (text && text.lang !== 'en') void fontImportFor[text.lang]();
  }, [text?.lang]);

  const focusEraAccent = useMemo(() => trail?.accent ?? 'brass', [trail]);
  if (!trail) return <Navigate to="/trails" replace />;
  if (!stop || !text || !translatedStop) return <Navigate to={`/trails/${trail.slug}`} replace />;

  const total = trail.stops.length;
  const prev = index > 0 ? `/trails/${trail.slug}/stop/${index}` : `/trails/${trail.slug}`;
  const next = index + 1 < total ? `/trails/${trail.slug}/stop/${index + 2}` : `/trails/${trail.slug}/finish`;

  return (
    <article>
      <header className="container-page pt-2">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Trails', to: '/trails' }, { label: trail.title, to: `/trails/${trail.slug}` }, { label: `Stop ${index + 1}` }]} />
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <TrailProgress current={index + 1} total={total} />
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitch trail={trail} lang={lang} onChange={(l) => setParams({ lang: l })} />
            {narration && (
              <button type="button" className={`chip min-h-10 ${listening ? 'chip-active' : ''}`} aria-pressed={listening} onClick={() => setListening((v) => !v)}>
                Listen
              </button>
            )}
            <button type="button" className={`chip min-h-10 ${textOnly ? 'chip-active' : ''}`} aria-pressed={textOnly} onClick={() => setParams({ text: !textOnly })}>
              Text only
            </button>
          </div>
        </div>
        <div className={`perf-all on-sheet relative mt-5 px-5 py-7 sm:px-9 sm:py-9 ${eraAccent.bg[focusEraAccent]} ${eraAccent.onInk[focusEraAccent]}`}>
          <p className={`stamp w-fit ${eraAccent.onInkMuted[focusEraAccent]}`}>{trail.title}</p>
          <div lang={text.lang}>
            <h1 className="mt-3 break-words text-h1">{translatedStop.title}</h1>
            {translatedStop.question && <p className={`mt-3 max-w-2xl font-reading text-h4 italic ${eraAccent.onInkMuted[focusEraAccent]}`}>{translatedStop.question}</p>}
          </div>
          {text.stale && <p className={`num mt-3 font-body text-label ${eraAccent.onInkMuted[focusEraAccent]}`}>This translation was made from an earlier English version; wording may differ until it is updated.</p>}
        </div>
      </header>

      <div className="container-page grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          {translatedStop.contentNote && (
            <p role="note" lang={text.lang} className="rounded-sm border border-paper-400 bg-paper-200/60 p-4 font-body text-meta text-ink-soft">
              <span className="stamp mr-2 text-sepia">Content note</span>
              {translatedStop.contentNote}
            </p>
          )}
          {narration && listening && (
            <AudioPlayer src={narration.src} cues={narration.cues} stopId={stop.id} narrator={narration.narrator} recordedOn={narration.recordedOn} onCue={setHighlightParagraph} />
          )}
          <ReadingText paragraphs={translatedStop.text} sources={stop.sources} className="max-w-prose" highlight={listening ? highlightParagraph : null} lang={text.lang} glossary={text.lang === 'en'} />
          {translatedStop.uncertainty && (
            <p role="note" lang={text.lang} aria-label="Uncertainty" className="max-w-prose border-l-2 border-oxide pl-4 font-body text-meta text-ink-soft">
              <span className="stamp mr-2 text-oxide-deep">Uncertain</span>
              {translatedStop.uncertainty}
            </p>
          )}
          {translatedStop.bridge && (
            <p lang={text.lang} className="max-w-prose font-reading text-reading italic text-ink-soft">
              {translatedStop.bridge}
            </p>
          )}
          <SourceList sources={stop.sources} />
          <nav aria-label="Trail navigation" className="flex flex-wrap items-center justify-between gap-3 border-t border-paper-300 pt-6">
            <Link to={prev} className="btn-ghost !min-h-12">
              <Icon d={icons.arrowLeft} className="h-4 w-4" />
              {index > 0 ? 'Previous stop' : 'Overview'}
            </Link>
            <Link to={next} className="btn-seal !min-h-12">
              {index + 1 < total ? 'Next stop' : 'Finish'}
              <Icon d={icons.arrowRight} className="h-4 w-4" />
            </Link>
          </nav>
        </div>
        {!textOnly && (
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <p className="label">Open the full story</p>
            <RefCard target={stop.focus} />
            {stop.also?.map((r) => (
              <RefCard key={`${r.kind}-${r.id}`} target={r} compact />
            ))}
          </aside>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
export function TrailFinishPage() {
  const { slug } = useParams();
  const trail = slug ? trailBySlug.get(slug) : undefined;
  usePageMeta(trail ? `Finish — ${trail.title}` : 'Trail');
  const progress = useTrailProgress();
  if (!trail) return <Navigate to="/trails" replace />;
  const done = progress[trail.slug]?.completed ?? false;
  const finish = () => {
    if (!done) {
      markComplete(trail.slug);
      track('trail_completed', { trail: trail.slug });
    }
  };
  return (
    <article className="pb-20">
      <header className="container-page pt-2">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Trails', to: '/trails' }, { label: trail.title, to: `/trails/${trail.slug}` }, { label: 'Finish' }]} />
        <div className={`perf-all on-sheet relative mt-4 px-5 py-7 sm:px-9 sm:py-9 ${eraAccent.bg[trail.accent]} ${eraAccent.onInk[trail.accent]}`}>
          {done && <Postmark lines={['Trail', 'complete']} className="absolute right-4 top-5 hidden sm:grid" />}
          <h1 className="break-words text-h1 sm:pr-28">{done ? 'Trail complete' : 'The end of the trail'}</h1>
          <p className={`mt-3 max-w-2xl font-reading text-h4 italic ${eraAccent.onInkMuted[trail.accent]}`}>{trail.question}</p>
        </div>
      </header>
      <div className="container-page max-w-3xl space-y-10 py-10">
        <section aria-label="Reflection" className="doc p-6">
          <p className="label mb-2">Something to think about</p>
          <p className="prose-reading">{trail.reflection}</p>
          <p className="mt-3 font-body text-label text-ink-faint">Talk it over, or keep it to yourself; nothing you think here is collected.</p>
        </section>
        <section aria-label="Knowledge check">
          <p className="label mb-3">One question, no score</p>
          {trail.activity.kind === 'choice' ? <ChoiceActivity activity={trail.activity} onDone={finish} /> : <OrderActivity activity={trail.activity} onDone={finish} />}
        </section>
        {done && (
          <section aria-label="Next" className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-indigo-mid/25 bg-indigo-wash/60 p-6">
            <p className="font-display text-h3 text-indigo-deep">Completed. Where next?</p>
            <div className="flex flex-wrap gap-2">
              <Link to={trail.followOn.to} className="btn-seal">
                {trail.followOn.label}
              </Link>
              <Link to={`/trails/${trail.slug}/stop/1`} className="btn-ghost">
                Read again
              </Link>
              <Link to="/passport" className="btn-ghost">
                Your passport
              </Link>
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
