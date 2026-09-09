import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Trail, TrailActivity } from '@/types';
import type { TrailProgress as Progress } from '@/lib/trails-progress';
import { Icon, Postmark, eraAccent, icons } from '@/components/ui';
import { DraftStamp } from '@/components/reading';

export function TrailCard({ trail, progress }: { trail: Trail; progress?: Progress }) {
  const resume = progress && !progress.completed && progress.stop > 0;
  const to = resume ? `/trails/${trail.slug}/stop/${progress.stop}` : `/trails/${trail.slug}`;
  const label = progress?.completed ? 'Read again' : resume ? `Resume at stop ${progress.stop}` : 'Start the trail';
  return (
    <article className={`perf-all on-sheet relative flex h-full flex-col px-5 py-6 ${eraAccent.bg[trail.accent]} ${eraAccent.onInk[trail.accent]}`}>
      {progress?.completed && <Postmark lines={['Trail', 'complete']} className="absolute right-3 top-3 hidden sm:grid" />}
      <p className={`stamp w-fit ${eraAccent.onInkMuted[trail.accent]}`}>{trail.theme}</p>
      <h3 className="mt-3 text-h3">
        <Link to={to} className="hover:underline">
          {trail.title}
        </Link>
      </h3>
      <p className={`mt-2 font-reading text-reading italic ${eraAccent.onInkMuted[trail.accent]}`}>{trail.question}</p>
      <p className={`num mt-4 font-body text-label ${eraAccent.onInkMuted[trail.accent]}`}>
        {trail.stops.length} stops · about {trail.minutes} minutes
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
        <Link to={to} className="btn-seal !min-h-10 !px-4 text-label" aria-label={`${label}: ${trail.title}`}>
          {label}
          <Icon d={icons.arrowRight} className="h-4 w-4" />
        </Link>
        {trail.editorial.status !== 'reviewed' && <DraftStamp vault />}
      </div>
    </article>
  );
}

/** Position in the selected story — not a claim about history understood. */
export function TrailProgress({ current, total, label = 'Position in this trail' }: { current: number; total: number; label?: string }) {
  return (
    <div>
      <p className="label num">
        Stop {current} of {total}
      </p>
      <div role="progressbar" aria-label={label} aria-valuemin={1} aria-valuemax={total} aria-valuenow={current} className="mt-1.5 flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`h-1 flex-1 ${i < current ? 'bg-oxide' : 'bg-paper-300'}`} />
        ))}
      </div>
    </div>
  );
}

type Choice = Extract<TrailActivity, { kind: 'choice' }>;
type Order = Extract<TrailActivity, { kind: 'order' }>;

export function ChoiceActivity({ activity, onDone }: { activity: Choice; onDone: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="doc-mount p-5 sm:p-7">
      <p className="font-display text-h3 text-ink">{activity.prompt}</p>
      <div className="mt-5 grid grid-cols-1 gap-2">
        {activity.options.map((opt, i) => {
          const isAnswer = i === activity.answerIndex;
          let cls = 'border-paper-300 bg-paper-50 hover:border-ink';
          if (picked !== null) cls = isAnswer ? 'border-forest bg-forest-wash text-forest-deep font-semibold' : picked === i ? 'border-oxide bg-oxide-wash text-oxide-deep' : 'border-paper-300 bg-paper-50 opacity-60';
          return (
            <button key={opt} type="button" disabled={picked !== null} onClick={() => setPicked(i)} className={`flex min-h-12 items-center gap-3 rounded-sm border px-4 py-3 text-left font-body text-meta ${cls}`}>
              <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-current font-display text-meta font-bold">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-5 rounded-sm bg-paper-200/70 p-5">
          <p className="prose-reading">
            {picked === activity.answerIndex ? 'That’s it. ' : 'Not quite — and here is why it matters. '}
            {activity.explanation}
          </p>
          <button type="button" className="btn-seal mt-4" onClick={onDone}>
            Finish the trail
          </button>
        </div>
      )}
    </div>
  );
}

/** Tap-to-move ordering: no dragging, no timer. */
export function OrderActivity({ activity, onDone }: { activity: Order; onDone: () => void }) {
  const [order, setOrder] = useState(() => activity.items.map((_, i) => i));
  const [checked, setChecked] = useState(false);
  const correct = activity.items
    .map((_, i) => i)
    .sort((a, b) => activity.items[a].year - activity.items[b].year);
  const isCorrect = checked && order.every((v, i) => v === correct[i]);
  const move = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    setOrder(next);
    setChecked(false);
  };
  return (
    <div className="doc-mount p-5 sm:p-7">
      <p className="font-display text-h3 text-ink">{activity.prompt}</p>
      <ol className="mt-5 space-y-2" aria-label="Your order">
        {order.map((idx, pos) => (
          <li key={idx} className="doc flex items-center gap-3 p-3">
            <span className="num w-6 font-display text-meta font-bold text-brass-deep">{pos + 1}</span>
            <span className="min-w-0 flex-1 font-body text-meta text-ink">
              {activity.items[idx].label}
              {checked && <span className="num ml-2 text-ink-faint">({activity.items[idx].year})</span>}
            </span>
            <button type="button" className="btn-ghost !min-h-11 !px-3" onClick={() => move(pos, -1)} disabled={pos === 0} aria-label={`Move "${activity.items[idx].label}" up`}>
              ↑
            </button>
            <button type="button" className="btn-ghost !min-h-11 !px-3" onClick={() => move(pos, 1)} disabled={pos === order.length - 1} aria-label={`Move "${activity.items[idx].label}" down`}>
              ↓
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-ghost" onClick={() => setChecked(true)}>
          Check the order
        </button>
        {checked && <p role="status" className="font-body text-meta text-ink-soft">{isCorrect ? 'In order.' : 'Not yet — the years are shown; try again or read the explanation.'}</p>}
      </div>
      {checked && (
        <div className="mt-5 rounded-sm bg-paper-200/70 p-5">
          <p className="prose-reading">{activity.explanation}</p>
          <button type="button" className="btn-seal mt-4" onClick={onDone}>
            Finish the trail
          </button>
        </div>
      )}
    </div>
  );
}
