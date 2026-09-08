import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { DisputedNote, SourceRef } from '@/types';
import { splitCitations } from '@/lib/reading';
import { track } from '@/lib/analytics';
import { Icon, icons } from '@/components/ui';

/* ------------------------------------------------------------------ */
/* Popover — a small note anchored under its trigger. Closed in every  */
/* prerendered snapshot; never moves the reading position.             */
export function Popover({ id, open, onClose, label, children }: { id: string; open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.parentElement?.contains(e.target as Node)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <span
      ref={ref}
      id={id}
      role="note"
      aria-label={label}
      className="doc absolute left-0 top-full z-30 mt-1.5 block w-72 max-w-[calc(100vw-2rem)] p-3.5 font-body text-label text-ink-soft shadow-none"
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Citation marker — the [^n] a reader sees                            */
function formatSource(s: SourceRef): string {
  const bits = [s.title, s.author, s.publisher, s.year ? String(s.year) : undefined, s.pages ? `pp. ${s.pages}` : undefined, s.archiveId].filter(Boolean);
  return bits.join(' · ');
}

const evidenceLabel: Record<string, string> = {
  contemporary: 'Contemporary record',
  scholarship: 'Later scholarship',
  'oral-tradition': 'Oral tradition',
  reference: 'Reference',
};

export function CitationMarker({ index, source, open, onToggle, onClose }: { index: number; source: SourceRef | undefined; open: boolean; onToggle: () => void; onClose: () => void }) {
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const close = () => {
    onClose();
    btn.current?.focus();
  };
  return (
    <span className="relative inline-block">
      <button
        ref={btn}
        type="button"
        onClick={() => {
          if (!open) track('source_opened');
          onToggle();
        }}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={`Source ${index}${source ? `: ${source.title}` : ''}`}
        className="num -mt-0.5 ml-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-sm border border-brass/60 px-1 align-super font-body text-xs font-semibold text-brass-deep hover:border-ink hover:text-ink"
      >
        {index}
      </button>
      <Popover id={id} open={open} onClose={close} label={`Source ${index}`}>
        {source ? (
          <>
            {source.evidence && <span className="stamp mb-1.5 block w-fit text-sepia">{evidenceLabel[source.evidence]}</span>}
            <span className="block text-ink">{formatSource(source)}</span>
            <a href={`#source-${index}`} onClick={close} className="mt-2 inline-flex items-center gap-1 font-medium text-oxide-deep underline underline-offset-2">
              Full reference <Icon d={icons.arrowRight} className="h-3 w-3" />
            </a>
          </>
        ) : (
          <span>This marker has no matching source.</span>
        )}
      </Popover>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Historians note beside a passage                                    */
function InlineNote({ note, vault }: { note: DisputedNote; vault: boolean }) {
  return (
    <aside role="note" aria-label={`Historians note: ${note.claim}`} className={`my-4 rounded-sm border-l-2 pl-4 font-body text-meta ${vault ? 'border-oxide-bright text-paper-200' : 'border-oxide text-ink-soft'}`}>
      <span className={`stamp mr-2 ${vault ? 'text-oxide-bright' : 'text-oxide-deep'}`}>Historians note</span>
      <span className={`font-semibold ${vault ? 'text-paper-50' : 'text-ink'}`}>{note.claim}.</span> {note.note}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Reading text — paragraphs with citations                            */
export function ReadingText({
  paragraphs,
  sources,
  notesByParagraph,
  dropcap = false,
  vault = false,
  className = '',
}: {
  paragraphs: string[];
  sources: SourceRef[];
  notesByParagraph?: Record<number, DisputedNote[]>;
  dropcap?: boolean;
  vault?: boolean;
  className?: string;
}) {
  /* One open popover per reading block: "p2-c1" = paragraph 2, cite 1. */
  const [open, setOpen] = useState<string | null>(null);
  const prose = vault ? 'prose-reading-vault' : 'prose-reading';
  return (
    <div data-reading-text className={`space-y-5 ${className}`}>
      {paragraphs.flatMap((para, i) => {
        const nodes: ReactNode[] = [
          <p key={`p${i}`} className={`${prose} ${dropcap && i === 0 ? 'dropcap' : ''}`}>
            {splitCitations(para).map((seg, j) => {
              if (seg.kind === 'text') return seg.text;
              const key = `p${i}-c${j}`;
              return <CitationMarker key={key} index={seg.index} source={sources[seg.index - 1]} open={open === key} onToggle={() => setOpen(open === key ? null : key)} onClose={() => setOpen(null)} />;
            })}
          </p>,
        ];
        for (const note of notesByParagraph?.[i] ?? []) nodes.push(<InlineNote key={`n${i}-${note.claim}`} note={note} vault={vault} />);
        return nodes;
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Draft stamp — anything not yet reviewed says so                     */
export function DraftStamp({ vault = false }: { vault?: boolean }) {
  return (
    <p className={`inline-flex items-center gap-2 font-body text-label ${vault ? 'text-paper-300' : 'text-ink-faint'}`}>
      <span className={`stamp ${vault ? 'text-oxide-bright' : 'text-oxide-deep'}`}>Draft</span>
      under editorial review — wording may change
    </p>
  );
}
