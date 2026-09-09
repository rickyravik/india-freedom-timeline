import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizQuestions, guessWhoRounds } from '@/data/quizzes';
import { didYouKnowFacts } from '@/data/facts';
import { comparePairs } from '@/data/compare-pairs';
import { fighters, fighterById, lifespan, roleLabels, movementById, dailyShuffle, dailySeed } from '@/lib/content';
import { eraById } from '@/data/eras';
import { regionNames } from '@/data/regions';
import type { QuizTopic } from '@/types';
import { usePageMeta } from '@/lib/hooks';
import { track } from '@/lib/analytics';
import { diceCoefficient, normalizeTranslit } from '@/lib/search-core';
import { ChipGroup, FactCard, Icon, PageIntro, PortraitMedallion, Reveal, SectionHeading, icons } from '@/components/ui';
import { DraftStamp } from '@/components/reading';

/* ------------------------------------------------------------------ */
interface ShuffledQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  topic: QuizTopic;
  difficulty: 1 | 2 | 3;
  whyItMatters?: string;
  relatedLink?: { label: string; to: string };
}

type Topic = QuizTopic | 'all';
type Difficulty = 1 | 2 | 3 | 'any';

/* `daily` picks a same-day-stable order for the very first, hydration-visible
   render — a prerendered snapshot and the browser hydrating it must compute
   the same set. Starting a new set (a user action, never part of a snapshot)
   uses real randomness instead. */
function pickQuestions(topic: Topic, difficulty: Difficulty, daily: boolean): ShuffledQuestion[] {
  const pool = quizQuestions.filter((q) => (topic === 'all' || q.topic === topic) && (difficulty === 'any' || q.difficulty === difficulty));
  const ordered = daily ? dailyShuffle(pool, 11) : [...pool].sort(() => Math.random() - 0.5);
  /* Short sets: five questions, never a long test. */
  return ordered.slice(0, 5).map((q, i) => {
    const answer = q.options[q.answerIndex];
    const options = daily ? dailyShuffle(q.options, i) : [...q.options].sort(() => Math.random() - 0.5);
    return { ...q, options, answerIndex: options.indexOf(answer) };
  });
}

function Quiz() {
  const [stage, setStage] = useState<'start' | 'play' | 'review'>('start');
  const [topic, setTopic] = useState<Topic>('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('any');
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const start = (set: ShuffledQuestion[]) => {
    setQuestions(set);
    setIndex(0);
    setPicked(null);
    setAnswers({});
    setStage('play');
  };
  const missed = questions.filter((q) => answers[q.id] !== q.answerIndex);

  if (stage === 'start') {
    const pool = quizQuestions.filter((q) => (topic === 'all' || q.topic === topic) && (difficulty === 'any' || q.difficulty === difficulty)).length;
    return (
      <div className="doc-mount p-5 sm:p-7">
        <p className="font-body text-meta text-ink-soft">Five questions, an explanation after each one, and no timer. Pick a topic and how deep to go.</p>
        <div className="mt-5 space-y-4">
          <ChipGroup
            label="Topic"
            options={[
              { value: 'people' as Topic, label: 'People' },
              { value: 'events' as Topic, label: 'Events' },
              { value: 'movements' as Topic, label: 'Movements' },
              { value: 'places' as Topic, label: 'Places' },
            ]}
            value={topic === 'all' ? null : topic}
            onChange={(v) => setTopic(v ?? 'all')}
          />
          <ChipGroup
            label="Depth"
            allLabel="Any"
            options={[
              { value: '1', label: 'Recognise' },
              { value: '2', label: 'Explain' },
              { value: '3', label: 'Go deeper' },
            ]}
            value={difficulty === 'any' ? null : String(difficulty)}
            onChange={(v) => setDifficulty(v ? (Number(v) as 1 | 2 | 3) : 'any')}
          />
        </div>
        <button type="button" className="btn-seal mt-6" disabled={pool < 3} onClick={() => start(pickQuestions(topic, difficulty, true))}>
          Start quiz
        </button>
        {pool < 3 && <p className="mt-2 font-body text-label text-ink-faint">Not enough questions for that combination yet. Widen the topic or depth.</p>}
      </div>
    );
  }

  if (stage === 'review') {
    const right = questions.length - missed.length;
    return (
      <div className="doc-mount p-5 sm:p-7 animate-fade-up">
        <h3 className="text-h3 text-ink">Review</h3>
        <p className="num mt-1 font-body text-meta text-ink-soft">
          {right} of {questions.length} answered correctly. Every question you missed is a story waiting to be read.
        </p>
        {missed.length > 0 && (
          <ul className="mt-5 space-y-3" aria-label="Questions to revisit">
            {missed.map((q) => (
              <li key={q.id} className="doc p-4">
                <p className="font-display text-h4 text-ink">{q.question}</p>
                <p className="mt-1 font-body text-meta text-ink-soft">
                  <span className="font-semibold text-forest-deep">{q.options[q.answerIndex]}</span>: {q.explanation}
                </p>
                {q.relatedLink && (
                  <Link to={q.relatedLink.to} className="mt-2 inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep underline decoration-oxide-deep/40 underline-offset-4">
                    {q.relatedLink.label}
                    <Icon d={icons.arrowRight} className="h-4 w-4" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          {missed.length > 0 && (
            <button type="button" className="btn-seal" onClick={() => start(missed.map((q) => ({ ...q })))}>
              Retry the ones I missed
            </button>
          )}
          <button type="button" className="btn-ghost" onClick={() => setStage('start')}>
            New set
          </button>
        </div>
      </div>
    );
  }

  const q = questions[index];
  return (
    <div className="doc-mount p-5 sm:p-7" key={q.id}>
      <p className="label num mb-4">
        Question {index + 1} of {questions.length}
      </p>
      <div className="mb-5 flex gap-1" aria-hidden="true">
        {questions.map((_, i) => (
          <span key={i} className={`h-1 flex-1 transition-colors duration-400 ${i < index ? 'bg-oxide' : i === index ? 'bg-brass' : 'bg-paper-300'}`} />
        ))}
      </div>
      <p className="font-display text-h3 font-bold text-ink animate-fade-up">{q.question}</p>
      <div className="mt-5 grid grid-cols-1 gap-2">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isAnswer = i === q.answerIndex;
          let cls = 'border-paper-300 bg-paper-50 hover:border-ink';
          if (picked !== null) cls = isAnswer ? 'border-forest bg-forest-wash text-forest-deep font-semibold' : isPicked ? 'border-oxide bg-oxide-wash text-oxide-deep' : 'border-paper-300 bg-paper-50 opacity-50';
          return (
            <button
              key={opt}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(i);
                setAnswers((a) => ({ ...a, [q.id]: i }));
              }}
              className={`flex min-h-12 items-center gap-3 rounded-sm border px-4 py-3 text-left font-body text-meta transition-[background-color,border-color,opacity] duration-400 ease-cinematic ${cls}`}
            >
              <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-current font-display text-meta font-bold">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <section aria-label="Explanation" className="mt-5 rounded-sm bg-paper-200/70 p-5 animate-fade-up">
          <p className="prose-reading">{q.explanation}</p>
          {q.whyItMatters && (
            <p className="prose-reading mt-3">
              <span className="stamp mr-2 text-sepia">Why it matters</span>
              {q.whyItMatters}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {q.relatedLink && (
              <Link to={q.relatedLink.to} className="inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep underline decoration-oxide-deep/40 underline-offset-4">
                {q.relatedLink.label}
                <Icon d={icons.arrowRight} className="h-4 w-4" />
              </Link>
            )}
            <button
              type="button"
              className="btn-seal ml-auto"
              onClick={() => {
                if (index + 1 >= questions.length) {
                  track('quiz_reviewed', { of: questions.length });
                  setStage('review');
                } else {
                  setIndex((i) => i + 1);
                  setPicked(null);
                }
              }}
            >
              {index + 1 >= questions.length ? 'See review' : 'Next question'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function GuessWho() {
  const [roundIdx, setRoundIdx] = useState(() => dailySeed(13) % guessWhoRounds.length);
  const [cluesShown, setCluesShown] = useState(1);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState('');
  const [verdict, setVerdict] = useState<'right' | 'wrong' | null>(null);
  const round = guessWhoRounds[roundIdx];
  const fighter = fighterById.get(round.answerId);

  const next = () => {
    setRoundIdx((i) => (i + 1) % guessWhoRounds.length);
    setCluesShown(1);
    setRevealed(false);
    setGuess('');
    setVerdict(null);
  };

  const check = () => {
    const g = normalizeTranslit(guess);
    const names = [round.answerName, fighter?.name ?? '', ...(fighter?.alternateNames ?? [])].map(normalizeTranslit);
    const ok = g.length >= 3 && names.some((n) => n === g || n.includes(g) || diceCoefficient(n, g) >= 0.8);
    setVerdict(ok ? 'right' : 'wrong');
    if (ok) setRevealed(true);
  };

  return (
    <div className="vault px-5 py-6 sm:px-7 sm:py-8">
      <p className="label-vault mb-4">Who am I?</p>
      <ol className="space-y-2">
        {round.clues.slice(0, cluesShown).map((clue, i) => (
          <li key={i} className="rounded-sm border border-paper-100/10 bg-paper-100/[0.05] p-4 font-body text-meta text-paper-200 animate-fade-up">
            <span className="num mr-2 font-display font-bold text-brass-bright">Clue {i + 1}.</span>
            {clue}
          </li>
        ))}
      </ol>
      {!revealed && (
        <form
          className="mt-5 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            check();
          }}
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">Your guess</span>
            <input
              aria-label="Your guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="min-h-11 w-full rounded-sm border border-paper-100/40 bg-transparent px-3 font-body text-meta text-paper-50 placeholder:text-paper-400"
              placeholder="Type a name…"
            />
          </label>
          <button type="submit" className="btn-seal">
            Check
          </button>
        </form>
      )}
      {verdict && <p role="status" className="mt-3 font-body text-meta text-paper-200">{verdict === 'right' ? 'That’s right.' : 'Not this time. Try another clue, or reveal.'}</p>}
      <div className="mt-5 flex flex-wrap gap-2">
        {!revealed && cluesShown < round.clues.length && (
          <button type="button" className="btn-ghost-vault" onClick={() => setCluesShown((c) => c + 1)}>
            Another clue
          </button>
        )}
        {!revealed ? (
          <button type="button" className="btn-seal" onClick={() => setRevealed(true)}>
            Reveal
          </button>
        ) : (
          <button type="button" className="btn-ghost-vault" onClick={next}>
            Next round
          </button>
        )}
      </div>
      {revealed && fighter && (
        <Link to={`/fighters/${fighter.slug}`} className="group mt-5 flex items-center gap-4 rounded-sm border border-brass-bright/40 bg-paper-100/[0.06] p-4 animate-mask-up">
          <PortraitMedallion name={fighter.name} era={eraById.get(fighter.era)} portrait={fighter.portrait} size="lg" />
          <span>
            <span className="inline-flex items-center gap-2 font-display text-h3 font-bold text-paper-50 group-hover:text-brass-bright">{round.answerName}<Icon d={icons.arrowRight} className="h-4 w-4" /></span>
            <span className="num font-body text-label text-paper-400">{lifespan(fighter)} · read the full story</span>
          </span>
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function CompareRow({ label, a, b }: { label: string; a?: string; b?: string }) {
  if (!a && !b) return null;
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="ledger-row min-w-0 flex-col items-start gap-1 text-ink-soft">
        <span className="label">{label}</span>
        <span className="min-w-0 max-w-full break-words">{a ?? '—'}</span>
      </div>
      <div className="ledger-row min-w-0 flex-col items-start gap-1 text-ink-soft">
        <span className="label sm:sr-only">{label}</span>
        <span className="min-w-0 max-w-full break-words">{b ?? '—'}</span>
      </div>
    </div>
  );
}

function Compare() {
  const sorted = useMemo(() => [...fighters].sort((x, y) => x.name.localeCompare(y.name)), []);
  const [aId, setAId] = useState('bhagat-singh');
  const [bId, setBId] = useState('mahatma-gandhi');
  const [pairId, setPairId] = useState<string | null>(null);
  const a = fighterById.get(aId);
  const b = fighterById.get(bId);
  const pair = comparePairs.find((p) => p.id === pairId);
  if (!a || !b) return null;
  const selectCls = 'min-h-12 w-full rounded-sm border border-paper-300 bg-paper-50 px-4 font-body text-meta font-medium text-ink focus:border-ink';

  return (
    <div className="doc-mount p-5 sm:p-7">
      <p className="label mb-2">Suggested pairs</p>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Suggested pairs">
        {comparePairs.map((p) => {
          const pa = fighterById.get(p.a);
          const pb = fighterById.get(p.b);
          return pa && pb ? (
            <button
              key={p.id}
              type="button"
              className={`chip ${pairId === p.id ? 'chip-active' : ''}`}
              aria-pressed={pairId === p.id}
              onClick={() => {
                setAId(p.a);
                setBId(p.b);
                setPairId(p.id);
              }}
            >
              {pa.shortName ?? pa.name} · {pb.shortName ?? pb.name}
            </button>
          ) : null;
        })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className="sr-only">First person</span>
          <select
            className={selectCls}
            value={aId}
            onChange={(e) => {
              setAId(e.target.value);
              setPairId(null);
            }}
          >
            {sorted.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Second person</span>
          <select
            className={selectCls}
            value={bId}
            onChange={(e) => {
              setBId(e.target.value);
              setPairId(null);
            }}
          >
            {sorted.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[a, b].map((f) => (
          <Link key={f.id} to={`/fighters/${f.slug}`} className="doc-interactive group flex flex-col items-center gap-2 p-4 text-center">
            <PortraitMedallion name={f.name} era={eraById.get(f.era)} portrait={f.portrait} size="lg" />
            <span className="font-display text-base font-bold leading-tight text-ink group-hover:text-oxide">{f.name}</span>
            <span className="num font-body text-label font-medium text-sepia">{lifespan(f)}</span>
          </Link>
        ))}
      </div>
      <div className="mt-3">
        <CompareRow label="Birthplace" a={a.birthPlace} b={b.birthPlace} />
        <CompareRow label="Region" a={regionNames[a.region]} b={regionNames[b.region]} />
        <CompareRow label="Roles" a={a.roles.map((r) => roleLabels[r]).join(', ')} b={b.roles.map((r) => roleLabels[r]).join(', ')} />
        <CompareRow label="Movements" a={a.movements.map((m) => movementById.get(m)?.name ?? m).join(', ') || '—'} b={b.movements.map((m) => movementById.get(m)?.name ?? m).join(', ') || '—'} />
        <CompareRow label="Ideology" a={a.ideology} b={b.ideology} />
        <CompareRow label="Legacy" a={a.legacy} b={b.legacy} />
      </div>
      {pair && (
        <div className="mt-5 rounded-sm bg-paper-200/70 p-5">
          <p className="label mb-1">Why compare them</p>
          <p className="prose-reading">{pair.why}</p>
          {pair.editorial.status === 'draft' && (
            <div className="mt-2">
              <DraftStamp />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export default function LearnPage() {
  usePageMeta('Learn & Play', 'Quizzes, guessing games and comparisons: learn the freedom struggle by exploring it.');
  const facts = useMemo(() => dailyShuffle(didYouKnowFacts, 17).slice(0, 3), []);

  return (
    <div className="pb-20">
      <PageIntro
        title="Learn & Play"
        lede="Test what you know, guess who’s who, and compare the many roads people took to freedom. Every answer opens another story, and these games honour the history they draw from."
      />
      <div className="container-page space-y-14 sm:space-y-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section aria-label="History quiz">
            <SectionHeading title="History quiz" lede="Five questions on a topic you choose, with an explanation after each. About three minutes." />
            <Reveal>
              <Quiz />
            </Reveal>
          </section>
          <section aria-label="Guess the freedom fighter">
            <SectionHeading title="Guess the freedom fighter" lede="Four clues, one person. Type a guess or ask for another clue." />
            <Reveal delay={80}>
              <GuessWho />
            </Reveal>
          </section>
        </div>

        <section aria-label="Compare two historical figures">
          <SectionHeading title="Compare two lives" lede="Two lives side by side, with a note on why they are worth comparing." />
          <Reveal>
            <Compare />
          </Reveal>
        </section>

        <section aria-label="Did you know">
          <SectionHeading title="Did you know?" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((f, i) => (
              <FactCard
                key={f.id}
                index={i}
                text={f.text}
                action={
                  f.relatedLink && (
                    <Link to={f.relatedLink.to} className="inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep underline decoration-oxide-deep/40 underline-offset-4">
                      {f.relatedLink.label}
                      <Icon d={icons.arrowRight} className="h-4 w-4" />
                    </Link>
                  )
                }
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
