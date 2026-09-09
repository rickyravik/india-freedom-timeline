import { Link, Navigate, useParams } from 'react-router-dom';
import { eventById, fighterById, movementById, trailBySlug } from '@/lib/content';
import { usePageMeta } from '@/lib/hooks';
import { PageIntro, SectionHeading, SourceList } from '@/components/ui';
import { DraftStamp, ReadingText } from '@/components/reading';
import type { TrailRef } from '@/types';

function timelineEntry(focus: TrailRef): { year: number; label: string } | undefined {
  if (focus.kind === 'fighter') {
    const f = fighterById.get(focus.id);
    if (!f?.birthYear) return undefined;
    return { year: f.birthYear, label: f.deathYear ? `${f.name} (${f.birthYear}–${f.deathYear})` : `${f.name} (b. ${f.birthYear})` };
  }
  if (focus.kind === 'event') {
    const e = eventById.get(focus.id);
    if (!e) return undefined;
    return { year: e.date.year, label: e.title };
  }
  const m = movementById.get(focus.id);
  if (!m) return undefined;
  return { year: m.startYear, label: `${m.name} (${m.period})` };
}

export default function TrailTeachPage() {
  const { slug } = useParams();
  const trail = slug ? trailBySlug.get(slug) : undefined;
  usePageMeta(trail ? `Teach: ${trail.title}` : 'Teach', trail?.question);

  if (!trail) return <Navigate to="/trails" replace />;

  const teaching = trail.teaching;
  const shortStops = teaching ? teaching.shortVersion.map((id) => trail.stops.find((s) => s.id === id)).filter((s) => s !== undefined) : [];
  const timeline = trail.stops
    .map((s) => timelineEntry(s.focus))
    .filter((e) => e !== undefined)
    .sort((a, b) => a.year - b.year);

  return (
    <div className="pb-20">
      <PageIntro title={`Teach: ${trail.title}`} lede={trail.learningGoal} />
      <div className="container-page space-y-14">
        <section aria-label="Curriculum alignment" className="doc p-5">
          <p className="font-body text-meta text-ink-soft">
            <span className="stamp mr-2 text-sepia">{teaching?.editorial.status === 'reviewed' ? 'Curriculum alignment' : 'Proposed curriculum alignment'}</span>
            {teaching?.alignment ?? 'Alignment notes have not yet been drafted for this trail.'}
          </p>
          {teaching?.editorial.status !== 'reviewed' && (
            <div className="mt-3">
              <DraftStamp />
            </div>
          )}
        </section>

        {shortStops.length > 0 && (
          <section aria-label="15-minute version">
            <SectionHeading title="15-minute version" lede="If time is short, these stops carry the trail's core question." />
            <ol className="space-y-3">
              {shortStops.map((s, i) => (
                <li key={s.id} className="doc p-4">
                  <span className="num mr-2 font-display font-bold text-brass-deep">{i + 1}</span>
                  <span className="font-body text-meta font-semibold text-ink">{s.title}</span>
                  {s.question && <p className="mt-1 font-reading text-reading italic text-ink-soft">{s.question}</p>}
                </li>
              ))}
            </ol>
          </section>
        )}

        <section aria-label="Full lesson">
          <SectionHeading title="Full lesson" />
          <div className="space-y-8">
            {trail.stops.map((s, i) => (
              <div key={s.id} className="doc p-5">
                <p className="label mb-1">
                  Stop {i + 1} of {trail.stops.length}
                </p>
                <h3 className="text-h3 text-ink">{s.title}</h3>
                {s.question && <p className="mt-1 font-reading text-reading italic text-ink-soft">{s.question}</p>}
                <ReadingText paragraphs={s.text} sources={s.sources} className="mt-4" glossary={false} />
                <div className="mt-4">
                  <SourceList sources={s.sources} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Discussion prompts">
          <SectionHeading title="Discussion prompts" />
          <ol className="space-y-2">
            {[...trail.stops.filter((s) => s.question).map((s) => s.question!), trail.reflection, ...(teaching?.prompts ?? [])].map((p, i) => (
              <li key={i} className="doc p-4 font-body text-meta text-ink">
                {p}
              </li>
            ))}
          </ol>
        </section>

        <section aria-label="Printable timeline">
          <SectionHeading title="Printable timeline" />
          <ol className="space-y-1.5">
            {timeline.map((e, i) => (
              <li key={i} className="flex gap-3 font-body text-meta text-ink">
                <span className="num shrink-0 font-display font-bold text-brass-deep">{e.year}</span>
                {e.label}
              </li>
            ))}
          </ol>
        </section>

        {teaching && (
          <section aria-label="Facilitator answers" className="doc p-5">
            <SectionHeading title="Facilitator answers" />
            <p className="font-body text-meta text-ink">
              <span className="font-semibold">Answer: </span>
              {trail.activity.kind === 'choice' ? trail.activity.options[trail.activity.answerIndex] : trail.activity.items.map((i) => i.label).join(' → ')}
            </p>
            <p className="mt-2 font-body text-meta text-ink-soft">{trail.activity.explanation}</p>
            <ul className="mt-4 space-y-2">
              {teaching.facilitatorNotes.map((n, i) => (
                <li key={i} className="font-body text-meta text-ink-soft">
                  {n}
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link to={`/trails/${trail.slug}`} className="inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep">
          Back to the trail
        </Link>
      </div>
    </div>
  );
}
