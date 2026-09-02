import { Link } from 'react-router-dom';
import type { FreedomFighter, HistoricalEvent, Movement } from '@/types';
import { categoryLabels, lifespan, roleLabels } from '@/lib/content';
import { eraById } from '@/data/eras';
import { PortraitMedallion, Reveal, eraAccent } from '@/components/ui';

/* ------------------------------------------------------------------ */
/* Document card for a person                                          */
export function FighterCard({
  fighter,
  compact = false,
  delay = 0,
  vault = false,
}: {
  fighter: FreedomFighter;
  compact?: boolean;
  delay?: number;
  vault?: boolean;
}) {
  const era = eraById.get(fighter.era);
  return (
    <Reveal delay={delay}>
      <Link
        to={`/fighters/${fighter.slug}`}
        className={`group flex gap-4 rounded-lg border p-4 transition-[transform,box-shadow,border-color,background-color] duration-400 ease-cinematic hover:-translate-y-0.5 active:translate-y-0 ${
          vault
            ? 'border-paper-100/10 bg-paper-100/[0.04] hover:border-paper-100/25 hover:bg-paper-100/[0.07]'
            : 'doc-interactive'
        }`}
      >
        <PortraitMedallion name={fighter.name} era={era} size={compact ? 'md' : 'lg'} />
        <div className="min-w-0 flex-1">
          <p className={`font-display text-[1.15rem] font-semibold leading-snug transition-colors duration-160 ${vault ? 'text-paper-50 group-hover:text-brass-bright' : 'text-ink group-hover:text-oxide'}`}>
            {fighter.name}
          </p>
          <p className={`mt-0.5 text-xs font-medium ${vault ? 'text-paper-400' : 'text-ink-faint'}`}>
            <span className={`font-display text-xs font-bold ${vault ? 'text-paper-300' : 'text-sepia'}`}>{lifespan(fighter)}</span>
            {' · '}
            {fighter.states[0]}
            {era && (
              <>
                {' · '}
                <span className={vault ? eraAccent.textVault[era.accent] : eraAccent.text[era.accent]}>{era.name}</span>
              </>
            )}
          </p>
          {!compact && <p className={`mt-2 line-clamp-2 text-sm leading-relaxed ${vault ? 'text-paper-300' : 'text-ink-soft'}`}>{fighter.summary}</p>}
          <p className="mt-2.5 flex flex-wrap gap-1.5">
            {fighter.roles.slice(0, 2).map((r) => (
              <span key={r} className={`stamp ${vault ? 'text-paper-400' : 'text-sepia'}`}>
                {roleLabels[r]}
              </span>
            ))}
          </p>
        </div>
        <span aria-hidden="true" className={`self-center text-lg transition-transform duration-400 ease-cinematic group-hover:translate-x-1 ${vault ? 'text-paper-400' : 'text-brass'}`}>
          →
        </span>
      </Link>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Large editorial feature card                                        */
export function FighterFeature({ fighter }: { fighter: FreedomFighter }) {
  const era = eraById.get(fighter.era);
  return (
    <Reveal mask className="h-full">
      <Link to={`/fighters/${fighter.slug}`} className="doc-interactive group flex h-full flex-col justify-between overflow-hidden p-6 sm:p-8">
        <div>
          <p className="eyebrow mb-4">
            {era?.name} · {fighter.states[0]}
          </p>
          <div className="flex items-start gap-5">
            <PortraitMedallion name={fighter.name} era={era} size="xl" />
            <div className="min-w-0">
              <p className="font-display text-[1.9rem] font-bold leading-[1.02] tracking-tight text-ink transition-colors duration-160 group-hover:text-oxide sm:text-[2.3rem]">
                {fighter.name}
              </p>
              <p className="mt-1 font-display text-base font-semibold text-sepia">{lifespan(fighter)}</p>
            </div>
          </div>
          <p className="prose-reading mt-5 line-clamp-4 text-[1.05rem]">{fighter.summary}</p>
        </div>
        <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-oxide">
          Open the story <span aria-hidden="true" className="transition-transform duration-400 ease-cinematic group-hover:translate-x-1">→</span>
        </p>
      </Link>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Person chip                                                         */
export function FighterChip({ fighter, vault = false }: { fighter: FreedomFighter; vault?: boolean }) {
  const era = eraById.get(fighter.era);
  return (
    <Link
      to={`/fighters/${fighter.slug}`}
      className={`inline-flex min-h-9 items-center gap-2 rounded-full border py-1 pl-1 pr-3.5 text-sm font-medium transition-[border-color,color,transform,background-color] duration-160 ease-cinematic active:scale-[0.97] ${
        vault
          ? 'border-paper-100/20 bg-paper-100/5 text-paper-200 hover:border-paper-100/50 hover:text-paper-50'
          : 'border-paper-300 bg-paper-50 text-ink-soft shadow-sm hover:border-oxide/50 hover:text-oxide'
      }`}
    >
      <PortraitMedallion name={fighter.name} era={era} size="xs" />
      {fighter.name}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Event card — ledger date column + story                             */
export function EventCard({ event, delay = 0 }: { event: HistoricalEvent; delay?: number }) {
  const era = eraById.get(event.era);
  return (
    <Reveal delay={delay}>
      <Link to={`/events/${event.slug}`} className="doc-interactive group flex gap-4 p-4 sm:p-5">
        <div className="shrink-0 border-r border-dotted border-paper-400/80 pr-4 text-right">
          <p className={`font-display text-[1.6rem] font-bold leading-none ${era ? eraAccent.text[era.accent] : 'text-oxide'}`}>{event.date.year}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{categoryLabels[event.category]}</p>
        </div>
        <div className="min-w-0">
          <p className="font-display text-[1.1rem] font-semibold leading-snug text-ink transition-colors duration-160 group-hover:text-oxide">{event.title}</p>
          {event.location && <p className="mt-0.5 text-xs text-ink-faint">{event.location}</p>}
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-soft">{event.summary}</p>
        </div>
      </Link>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Movement card                                                       */
export function MovementCard({ movement, delay = 0, vault = false }: { movement: Movement; delay?: number; vault?: boolean }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        to={`/movements/${movement.slug}`}
        className={`group flex h-full flex-col rounded-lg border p-5 transition-[transform,box-shadow,border-color,background-color] duration-400 ease-cinematic hover:-translate-y-0.5 ${
          vault ? 'border-paper-100/10 bg-paper-100/[0.04] hover:border-paper-100/25 hover:bg-paper-100/[0.07]' : 'doc-interactive'
        }`}
      >
        <p className={vault ? 'eyebrow-vault' : 'eyebrow'}>{movement.period}</p>
        <p className={`mt-2 font-display text-[1.3rem] font-semibold leading-tight transition-colors duration-160 ${vault ? 'text-paper-50 group-hover:text-brass-bright' : 'text-ink group-hover:text-oxide'}`}>
          {movement.name}
        </p>
        <p className={`mt-2 line-clamp-3 text-sm leading-relaxed ${vault ? 'text-paper-300' : 'text-ink-soft'}`}>{movement.summary}</p>
        <span aria-hidden="true" className={`mt-auto pt-4 text-lg transition-transform duration-400 ease-cinematic group-hover:translate-x-1 ${vault ? 'text-paper-400' : 'text-brass'}`}>
          →
        </span>
      </Link>
    </Reveal>
  );
}
