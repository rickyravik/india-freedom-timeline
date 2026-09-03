import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizQuestions, guessWhoRounds } from '@/data/quizzes';
import { didYouKnowFacts } from '@/data/facts';
import { fighters, fighterById, lifespan, roleLabels, movementById } from '@/lib/content';
import { eraById } from '@/data/eras';
import { regionNames } from '@/data/regions';
import { usePageMeta } from '@/lib/hooks';
import { FactCard, Icon, PageIntro, PortraitMedallion, Reveal, SectionHeading, icons } from '@/components/ui';

/* ------------------------------------------------------------------ */
interface ShuffledQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  relatedLink?: { label: string; to: string };
}

function shuffleQuiz(): ShuffledQuestion[] {
  return [...quizQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
    .map((q) => {
      const answer = q.options[q.answerIndex];
      const options = [...q.options].sort(() => Math.random() - 0.5);
      return { ...q, options, answerIndex: options.indexOf(answer) };
    });
}

function Quiz() {
  const [questions, setQuestions] = useState<ShuffledQuestion[]>(shuffleQuiz);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];
  const restart = () => {
    setQuestions(shuffleQuiz());
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="doc-mount p-8 text-center animate-fade-up">
        <p className="font-display font-bold num text-h2 text-ink">
          {score}
          <span className="text-h3 text-ink-faint"> / {questions.length}</span>
        </p>
        <p className="label num mt-2">Quiz complete</p>
        <p className="mx-auto mt-3 max-w-sm font-body text-meta text-ink-soft">
          {score === questions.length ? 'Perfect — a historian in the making.' : score >= questions.length / 2 ? 'Well done. Every question you missed is a story waiting to be read.' : 'A fine start — the timeline holds all the answers.'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={restart} className="btn-seal">
            Try again
          </button>
          <Link to="/timeline" className="btn-ghost">
            Explore the timeline
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="doc-mount p-5 sm:p-7" key={q.id}>
      <div className="mb-4 flex items-center justify-between">
        <p className="label num">
          Question {index + 1} of {questions.length}
        </p>
        <p className="num font-display text-meta font-bold text-ink">Score {score}</p>
      </div>
      {/* progress */}
      <div className="mb-5 flex gap-1" aria-hidden="true">
        {questions.map((_, i) => (
          <span key={i} className={`h-1 flex-1 transition-colors duration-400 ${i < index ? 'bg-oxide' : i === index ? 'bg-brass' : 'bg-paper-300'}`} />
        ))}
      </div>
      <p className="font-display text-h3 font-bold text-ink animate-fade-up">{q.question}</p>
      <div className="mt-5 grid gap-2">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isAnswer = i === q.answerIndex;
          let cls = 'border-paper-300 bg-paper-50 hover:border-ink';
          if (picked !== null) {
            if (isAnswer) cls = 'border-forest bg-forest-wash text-forest-deep font-semibold';
            else if (isPicked) cls = 'border-oxide bg-oxide-wash text-oxide-deep';
            else cls = 'border-paper-300 bg-paper-50 opacity-50';
          }
          return (
            <button
              key={opt}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(i);
                if (i === q.answerIndex) setScore((s) => s + 1);
              }}
              className={`flex min-h-12 items-center gap-3 rounded-sm border px-4 py-3 text-left font-body text-meta transition-[background-color,border-color,opacity] duration-400 ease-cinematic animate-fade-up ${cls}`}
              style={{ animationDelay: `${60 + i * 50}ms` }}
            >
              <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-current font-display text-meta font-bold">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-5 rounded-sm bg-paper-200/70 p-5 animate-fade-up">
          <p className="prose-reading">{q.explanation}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {q.relatedLink && (
              <Link to={q.relatedLink.to} className="inline-flex items-center gap-2 font-body text-meta font-medium text-oxide underline decoration-oxide/40 underline-offset-4">
                {q.relatedLink.label}
                <Icon d={icons.arrowRight} className="h-4 w-4" />
              </Link>
            )}
            <button
              type="button"
              className="btn-seal ml-auto"
              onClick={() => {
                if (index + 1 >= questions.length) setDone(true);
                else {
                  setIndex((i) => i + 1);
                  setPicked(null);
                }
              }}
            >
              {index + 1 >= questions.length ? 'See result' : 'Next question'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function GuessWho() {
  const [roundIdx, setRoundIdx] = useState(() => Math.floor(Math.random() * guessWhoRounds.length));
  const [cluesShown, setCluesShown] = useState(1);
  const [revealed, setRevealed] = useState(false);
  const round = guessWhoRounds[roundIdx];
  const fighter = fighterById.get(round.answerId);

  const next = () => {
    setRoundIdx((i) => (i + 1) % guessWhoRounds.length);
    setCluesShown(1);
    setRevealed(false);
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
  const a = fighterById.get(aId);
  const b = fighterById.get(bId);
  if (!a || !b) return null;
  const selectCls = 'min-h-12 w-full rounded-sm border border-paper-300 bg-paper-50 px-4 font-body text-meta font-medium text-ink focus:border-ink';

  return (
    <div className="doc-mount p-5 sm:p-7">
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className="sr-only">First person</span>
          <select className={selectCls} value={aId} onChange={(e) => setAId(e.target.value)}>
            {sorted.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Second person</span>
          <select className={selectCls} value={bId} onChange={(e) => setBId(e.target.value)}>
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
export default function LearnPage() {
  usePageMeta('Learn & Play', 'Quizzes, guessing games and comparisons — learn the freedom struggle by exploring it.');
  const facts = useMemo(() => [...didYouKnowFacts].sort(() => Math.random() - 0.5).slice(0, 3), []);

  return (
    <div className="pb-20">
      <PageIntro
        title="Learn & Play"
        lede="Test what you know, guess who’s who, and compare the many roads people took to freedom. Every answer opens another story — these games honour the history they draw from."
      />
      <div className="container-page space-y-14 sm:space-y-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <section aria-label="History quiz">
            <SectionHeading title="History quiz" />
            <Reveal>
              <Quiz />
            </Reveal>
          </section>
          <section aria-label="Guess the freedom fighter">
            <SectionHeading title="Guess the freedom fighter" />
            <Reveal delay={80}>
              <GuessWho />
            </Reveal>
          </section>
        </div>

        <section aria-label="Compare two historical figures">
          <SectionHeading title="Compare two lives" lede="Choose any two people — a poet and a general, a queen and a satyagrahi — and see how their paths differed." />
          <Reveal>
            <Compare />
          </Reveal>
        </section>

        <section aria-label="Did you know">
          <SectionHeading title="Did you know?" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((f, i) => (
              <FactCard
                key={f.id}
                index={i}
                text={f.text}
                action={
                  f.relatedLink && (
                    <Link to={f.relatedLink.to} className="inline-flex items-center gap-2 font-body text-meta font-medium text-oxide underline decoration-oxide/40 underline-offset-4">
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
