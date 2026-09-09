import { useState } from 'react';
import type { ArchiveDocument } from '@/types';

export function DocumentViewer({ doc, selected, onSelect }: { doc: ArchiveDocument; selected: string | null; onSelect: (id: string) => void }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const sel = doc.passages.find((p) => p.id === selected);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {doc.image && (
        <figure className="doc p-3">
          <div
            className="relative overflow-hidden bg-paper-200"
            style={{ aspectRatio: `${doc.image.width} / ${doc.image.height}` }}
            tabIndex={0}
            role="group"
            aria-label="Document image. Use the buttons to zoom; arrow keys pan."
            onKeyDown={(e) => {
              const step = 20;
              if (e.key === 'ArrowLeft') setPan((p) => ({ ...p, x: p.x + step }));
              if (e.key === 'ArrowRight') setPan((p) => ({ ...p, x: p.x - step }));
              if (e.key === 'ArrowUp') setPan((p) => ({ ...p, y: p.y + step }));
              if (e.key === 'ArrowDown') setPan((p) => ({ ...p, y: p.y - step }));
            }}
          >
            <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center', transition: 'transform 160ms cubic-bezier(0.22,0.61,0.36,1)' }} className="relative h-full w-full">
              <img src={doc.image.src} width={doc.image.width} height={doc.image.height} alt={`Scan of ${doc.title}`} className="h-full w-full object-contain" decoding="async" />
              {sel?.box && <span aria-hidden="true" className="absolute border-2 border-oxide bg-oxide/10" style={{ left: `${sel.box.x}%`, top: `${sel.box.y}%`, width: `${sel.box.w}%`, height: `${sel.box.h}%` }} />}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className="btn-ghost !min-h-11" onClick={() => setZoom((z) => Math.min(4, z + 0.5))} aria-label="Zoom in">
              +
            </button>
            <button type="button" className="btn-ghost !min-h-11" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} aria-label="Zoom out">
              −
            </button>
            <button
              type="button"
              className="btn-ghost !min-h-11"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
            >
              Reset view
            </button>
          </div>
          <figcaption className="mt-2 font-body text-label text-ink-faint">
            {doc.image.credit} · {doc.image.licence}
            {doc.image.created ? ` · ${doc.image.created}` : ''}
          </figcaption>
        </figure>
      )}
      <ol className="space-y-2" aria-label="Transcription">
        {doc.passages.map((p, i) => (
          <li key={p.id} className={`doc p-4 ${selected === p.id ? 'border-ink' : ''}`}>
            <button type="button" className="w-full text-left" aria-pressed={selected === p.id} onClick={() => onSelect(p.id)}>
              <span className="num mr-2 font-display text-sm font-bold text-brass-deep">{i + 1}</span>
              <span className="prose-reading">{p.text}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
