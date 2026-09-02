import { Link } from 'react-router-dom';
import type { FreedomFighter } from '@/types';
import { eraById } from '@/data/eras';
import { lifespan } from '@/lib/content';
import { useIsDesktop } from '@/lib/hooks';
import { PortraitMedallion, Reveal, eraAccent } from '@/components/ui';
import { FighterCard } from '@/components/cards';

/**
 * Related people drawn as a constellation around the subject.
 * Lines draw in on reveal; each node is a real link. On phones the
 * same relationships are shown as a swipeable row of cards.
 */
export function Constellation({ subject, related }: { subject: FreedomFighter; related: FreedomFighter[] }) {
  const desktop = useIsDesktop();
  const nodes = related.slice(0, 8);
  if (nodes.length === 0) return null;

  if (!desktop) {
    return (
      <div className="-mx-4 flex snap-x-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
        {nodes.map((f, i) => (
          <div key={f.id} className="w-[82vw] max-w-xs shrink-0 snap-start">
            <FighterCard fighter={f} compact delay={i * 60} vault />
          </div>
        ))}
      </div>
    );
  }

  // Layout: subject at centre, related on an ellipse.
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
    <Reveal className="relative mx-auto w-full max-w-4xl" aria-label={`People connected to ${subject.name}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        {positions.map((p, i) => {
          const era = eraById.get(nodes[i].era);
          const len = Math.hypot(p.x - cx, p.y - cy);
          return (
            <line
              key={nodes[i].id}
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
          <PortraitMedallion name={subject.name} era={subjectEra} size="xl" />
          <p className="mt-2 font-display text-base font-bold text-paper-50">{subject.name}</p>
        </div>
        {/* Related */}
        {nodes.map((f, i) => {
          const p = positions[i];
          const era = eraById.get(f.era);
          return (
            <Link
              key={f.id}
              to={`/fighters/${f.slug}`}
              className="group absolute flex w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center animate-fade-up"
              style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, animationDelay: `${200 + i * 90}ms` }}
            >
              <PortraitMedallion name={f.name} era={era} size="md" className="transition-transform duration-400 ease-cinematic group-hover:scale-110" />
              <span className="mt-2 font-display text-[13px] font-semibold leading-tight text-paper-100 transition-colors group-hover:text-brass-bright">{f.name}</span>
              <span className="text-[10px] font-semibold text-paper-400">{lifespan(f)}</span>
            </Link>
          );
        })}
      </div>
    </Reveal>
  );
}
