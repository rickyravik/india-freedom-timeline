import { Link } from 'react-router-dom';
import type { FreedomFighter, HistoricalEvent, Movement } from '@/types';
import { categoryLabels, lifespan, roleLabels } from '@/lib/content';
import { eraById } from '@/data/eras';
import { Icon, PortraitMedallion, Reveal, eraAccent, icons } from '@/components/ui';

/* Trim to a word boundary so a clamped summary never breaks mid-word. */
function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[,;:.\s]+$/, '')}…`;
}

/* ------------------------------------------------------------------ */
/* Document card for a person                                          */
export function FighterCard({
  fighter,
  compact = false,
  vault = false,
}: {
  fighter: FreedomFighter;
  compact?: boolean;
  /* accepted for call-site compatibility; repeated cards no longer animate in */
  delay?: number;
  vault?: boolean;
}) {
  const era = eraById.get(fighter.era);
  return (
      <Link
        to={`/fighters/${fighter.slug}`}
        /* A mounted issue: the head is a perforated stamp and the birth year
           is its denomination, hinged onto the album's own card. */
        className={`group flex gap-4 rounded-sm border p-4 transition-colors duration-160 ease-cinematic ${
          vault ? 'border-paper-100/25 hover:border-paper-100/70' : 'doc-interactive'
        }`}
      >
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <PortraitMedallion name={fighter.name} era={era} size={compact ? 'md' : 'lg'} onPane={vault} />
          {/* The denomination slot is always struck: an undated life reads as
             an unknown value, not as a card that failed to render. */}
          <span className={`num font-display text-sm font-bold leading-none ${vault ? 'text-paper-200' : era ? eraAccent.text[era.accent] : 'text-sepia'}`}>
            {fighter.birthYear ?? '—'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-display text-h4 font-bold transition-colors duration-160 ${vault ? 'text-paper-50 group-hover:text-brass-bright' : 'text-ink group-hover:text-oxide-deep'}`}>
            {fighter.name}
          </p>
          <p className={`mt-1 font-body text-label ${vault ? 'text-paper-300' : 'text-ink-faint'}`}>
            <span className={`num font-medium ${vault ? 'text-paper-200' : 'text-sepia'}`}>{lifespan(fighter)}</span>
            {' · '}
            {fighter.states[0]}
            {era && (
              <>
                {' · '}
                <span className={vault ? eraAccent.textVault[era.accent] : eraAccent.text[era.accent]}>{era.name}</span>
              </>
            )}
          </p>
          {!compact && <p className={`mt-2 line-clamp-3 font-body text-meta ${vault ? 'text-paper-200' : 'text-ink-soft'}`}>{clip(fighter.summary, 150)}</p>}
          <p className="mt-2.5 flex flex-wrap gap-1.5">
            {fighter.roles.slice(0, 2).map((r) => (
              <span key={r} className={`stamp ${vault ? 'text-paper-400' : 'text-sepia'}`}>
                {roleLabels[r]}
              </span>
            ))}
          </p>
        </div>
        <Icon d={icons.arrowRight} className={`h-4 w-4 self-center shrink-0 ${vault ? 'text-paper-400' : 'text-brass-deep'}`} />
      </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Large editorial feature card                                        */
export function FighterFeature({ fighter }: { fighter: FreedomFighter }) {
  const era = eraById.get(fighter.era);
  return (
    <Reveal mask className="h-full">
      <Link to={`/fighters/${fighter.slug}`} className="doc-interactive group flex h-full flex-col justify-between p-6 sm:p-8">
        <div>
          <div className="flex items-start gap-5">
            <PortraitMedallion name={fighter.name} era={era} size="xl" />
            <div className="min-w-0">
              <p className="font-display text-h2 font-bold text-ink transition-colors duration-160 group-hover:text-oxide">{fighter.name}</p>
              <p className="num mt-1 font-display text-base font-bold text-sepia">{lifespan(fighter)}</p>
              <p className="label mt-1">
                {era?.name} · {fighter.states[0]}
              </p>
            </div>
          </div>
          <div className="rule my-5" />
          <p className="prose-reading line-clamp-5">{clip(fighter.summary, 260)}</p>
        </div>
        <p className="mt-6 inline-flex items-center gap-2 font-body text-meta font-medium text-oxide">
          Open the story <Icon d={icons.arrowRight} className="h-4 w-4" />
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
      className={`inline-flex min-h-9 items-center gap-2 rounded-sm border py-1 pl-1 pr-3 font-body text-label font-medium transition-colors duration-160 ease-cinematic ${
        vault ? 'border-paper-100/30 text-paper-200 hover:border-paper-100 hover:text-paper-50' : 'border-paper-400 bg-paper-50 text-ink-soft hover:border-ink hover:text-ink'
      }`}
    >
      <PortraitMedallion name={fighter.name} era={era} size="xs" onPane={vault} />
      {fighter.name}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Event card — ledger date column + story                             */
export function EventCard({ event }: { event: HistoricalEvent; delay?: number }) {
  const era = eraById.get(event.era);
  return (
      <Link to={`/events/${event.slug}`} className="doc-interactive group flex gap-4 p-4 sm:p-5">
        <div className="w-[4.5rem] shrink-0 border-r border-paper-400/80 pr-4 text-right">
          <p className={`denom ${era ? eraAccent.text[era.accent] : 'text-oxide-deep'}`}>{event.date.year}</p>
          <p className="mt-1.5 font-body text-xs font-medium text-ink-faint">{categoryLabels[event.category]}</p>
        </div>
        <div className="min-w-0">
          <p className="font-display text-h4 font-bold text-ink transition-colors duration-160 group-hover:text-oxide-deep">{event.title}</p>
          {event.location && <p className="mt-0.5 font-body text-label text-ink-faint">{event.location}</p>}
          <p className="mt-1.5 line-clamp-3 font-body text-meta text-ink-soft">{clip(event.summary, 165)}</p>
        </div>
      </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Movement card                                                       */
export function MovementCard({ movement, vault = false }: { movement: Movement; delay?: number; vault?: boolean }) {
  return (
      <Link
        to={`/movements/${movement.slug}`}
        className={`group flex h-full flex-col rounded-sm border p-5 transition-colors duration-160 ease-cinematic ${
          vault ? 'border-paper-100/25 hover:border-paper-100/70' : 'doc-interactive'
        }`}
      >
        <p className={`font-display text-h3 font-bold leading-tight transition-colors duration-160 ${vault ? 'text-paper-50 group-hover:text-brass-bright' : 'text-ink group-hover:text-oxide-deep'}`}>
          {movement.name}
        </p>
        {/* The period is the movement's own dating, so it carries the value
           on its own — a separate startYear denomination duplicated it, and
           read as a false precision against ranges like "1780s–1940s". */}
        <p className={`num mt-1.5 ${vault ? 'label-vault' : 'label'}`}>{movement.period}</p>
        <p className={`mt-3 line-clamp-3 font-body text-meta ${vault ? 'text-paper-200' : 'text-ink-soft'}`}>{clip(movement.summary, 150)}</p>
        <Icon d={icons.arrowRight} className={`mt-auto h-4 w-4 shrink-0 ${vault ? 'text-paper-300' : 'text-brass-deep'}`} />
      </Link>
  );
}
