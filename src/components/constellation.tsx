import { Link } from 'react-router-dom';
import type { FighterSummary } from '@/types';
import { eraById } from '@/data/eras';
import { connectionLabel, lifespan, type ResolvedConnection } from '@/lib/content';
import { useIsDesktop } from '@/lib/hooks';
import { PortraitMedallion, Reveal, eraAccent } from '@/components/ui';
import { FighterCard } from '@/components/cards';

/**
 * Documented connections drawn around the subject — a line only where a
 * relationship is on record, each node labelled with its type, and every
 * connection explained in the list beneath (which is also the phone view).
 */
export function Constellation({ subject, connections }: { subject: FighterSummary; connections: ResolvedConnection[] }) {
  const desktop = useIsDesktop();
  const nodes = connections.slice(0, 8);
  if (nodes.length === 0) return null;

  const list = (
    <ul className="space-y-3" aria-label="Documented connections">
      {nodes.map((c) => (
        <li key={c.fighter.id} className="rounded-sm border border-paper-100/20 p-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="stamp text-brass-bright">{connectionLabel[c.type]}</span>
            <Link to={`/fighters/${c.fighter.slug}`} className="font-display text-h4 font-bold text-paper-50 hover:text-brass-bright">
              {c.fighter.name}
            </Link>
            <span className="num font-body text-label text-paper-400">{lifespan(c.fighter)}</span>
          </div>
          <p className="mt-1.5 font-body text-meta text-paper-200">{c.note}</p>
        </li>
      ))}
    </ul>
  );

  if (!desktop) return list;

  // Layout: subject at centre, connections on an ellipse.
  const W = 900;
  const H = 480;
  const cx = W / 2;
  const cy = H / 2;
  const rx = 340;
  const ry = 170;
  const positions = nodes.map((_, i) => {
    const angle = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
    return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
  });
  const subjectEra = eraById.get(subject.era);

  return (
    <div className="space-y-8">
      <Reveal className="relative mx-auto w-full max-w-4xl" aria-label={`People connected to ${subject.name}`}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {positions.map((p, i) => {
            const era = eraById.get(nodes[i].fighter.era);
            /* Rounded: a browser reformats an inline style's numeric value to
               its own precision the instant it's set, which would otherwise
               no longer match the full-precision string React computes when
               checking this at hydration. */
            const len = Math.round(Math.hypot(p.x - cx, p.y - cy) * 100) / 100;
            return (
              <line
                key={nodes[i].fighter.id}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke={era ? eraAccent.hex[era.accent] : '#9c7f3a'}
                strokeOpacity="0.7"
                strokeWidth="1.2"
                className="draw"
                style={{ strokeDasharray: len, strokeDashoffset: len, '--draw-delay': `${i * 90}ms` } as React.CSSProperties}
              />
            );
          })}
          <circle cx={cx} cy={cy} r="86" fill="none" stroke="rgba(209,181,106,0.25)" strokeDasharray="2 6" />
        </svg>
        <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
          {/* Subject */}
          <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center" style={{ left: '50%', top: '50%' }}>
            <PortraitMedallion name={subject.name} era={subjectEra} portrait={subject.portrait} size="xl" />
            <p className="mt-2 font-display text-base font-bold text-paper-50">{subject.name}</p>
          </div>
          {/* Connections */}
          {nodes.map((c, i) => {
            const p = positions[i];
            const era = eraById.get(c.fighter.era);
            return (
              <Link
                key={c.fighter.id}
                to={`/fighters/${c.fighter.slug}`}
                className="group absolute flex w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center animate-fade-up"
                /* Rounded: a browser reformats an inline style's percentage to
                   its own precision the instant it's set, which would
                   otherwise no longer match the full-precision string React
                   computes when checking this at hydration. */
                style={{ left: `${Math.round((p.x / W) * 10000) / 100}%`, top: `${Math.round((p.y / H) * 10000) / 100}%`, animationDelay: `${200 + i * 90}ms` }}
              >
                <span className="stamp mb-1 text-brass-bright">{connectionLabel[c.type]}</span>
                <PortraitMedallion name={c.fighter.name} era={era} portrait={c.fighter.portrait} size="md" className="transition-transform duration-400 ease-cinematic group-hover:scale-110" />
                <span className="mt-2 font-body text-xs font-medium leading-tight text-paper-100 transition-colors group-hover:text-brass-bright">{c.fighter.name}</span>
                <span className="num font-body text-xs text-paper-400">{lifespan(c.fighter)}</span>
              </Link>
            );
          })}
        </div>
      </Reveal>
      {list}
    </div>
  );
}

/** People connected by theme, not by documented contact — never drawn as lines. */
export function SimilarStories({ people, id }: { people: FighterSummary[]; id?: string }) {
  if (people.length === 0) return null;
  return (
    <section id={id} aria-label="Similar stories" className="container-page scroll-mt-28 pt-14">
      <div className="rule-double mb-5" />
      <h2 className="text-h2 text-ink">Similar stories</h2>
      <p className="mt-2 max-w-xl font-body text-meta text-ink-soft">People whose lives rhyme with this one — a theme, a region, a method — without a documented meeting. Read them as comparisons, not as comrades.</p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {people.slice(0, 6).map((f) => (
          <FighterCard key={f.id} fighter={f} compact />
        ))}
      </div>
    </section>
  );
}
