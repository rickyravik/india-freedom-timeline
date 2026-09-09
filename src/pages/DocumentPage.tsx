import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { documentBySlug, documentKindLabels, eventById } from '@/lib/content';
import { usePageMeta } from '@/lib/hooks';
import { Breadcrumbs, Icon, SourceList, SuggestCorrection, icons } from '@/components/ui';
import { DraftStamp, ReadingText } from '@/components/reading';
import { DocumentViewer } from '@/components/document-viewer';

export default function DocumentPage() {
  const { slug } = useParams();
  const doc = slug ? documentBySlug.get(slug) : undefined;
  const [selected, setSelected] = useState<string | null>(null);
  usePageMeta(doc?.title ?? 'Document', doc?.context[0], { type: 'article' });

  if (!doc) return <Navigate to="/" replace />;

  const event = doc.eventId ? eventById.get(doc.eventId) : undefined;
  const index = doc.passages.findIndex((p) => p.id === selected);
  const sel = index >= 0 ? doc.passages[index] : undefined;

  return (
    <article>
      <header className="container-page pt-2">
        <div className="vault animate-fade-up px-5 py-7 sm:px-9 sm:py-10">
          <Breadcrumbs vault items={[{ label: 'Home', to: '/' }, { label: doc.title }]} />
          <p className="stamp mt-5 w-fit text-brass-bright">{documentKindLabels[doc.kind]}</p>
          <h1 className="mt-3 max-w-3xl break-words text-h1 text-paper-50">{doc.title}</h1>
          <p className="label-vault num mt-3">{doc.dateLabel}</p>
          {doc.editorial.status !== 'reviewed' && (
            <div className="mt-4">
              <DraftStamp vault />
            </div>
          )}
        </div>
      </header>

      <div className="container-page space-y-10 py-14">
        <section aria-label="About this document">
          <ReadingText paragraphs={doc.context} sources={doc.sources} className="max-w-prose" />
        </section>

        <DocumentViewer doc={doc} selected={selected} onSelect={setSelected} />

        {sel?.guide && (
          <section aria-label="Reading this passage" className="doc max-w-prose p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="label">Reading this passage</p>
              <div className="flex items-center gap-2">
                <button type="button" className="btn-ghost !min-h-11 !px-4" onClick={() => setSelected(doc.passages[Math.max(0, index - 1)].id)} disabled={index <= 0}>
                  <Icon d={icons.arrowLeft} className="h-4 w-4" />
                  Previous
                </button>
                <button
                  type="button"
                  className="btn-ghost !min-h-11 !px-4"
                  onClick={() => setSelected(doc.passages[Math.min(doc.passages.length - 1, index + 1)].id)}
                  disabled={index >= doc.passages.length - 1}
                >
                  Next
                  <Icon d={icons.arrowRight} className="h-4 w-4" />
                </button>
              </div>
            </div>
            <dl className="space-y-3">
              {sel.guide.author && (
                <div>
                  <dt className="label mb-0.5">Author</dt>
                  <dd className="font-body text-meta text-ink-soft">{sel.guide.author}</dd>
                </div>
              )}
              {sel.guide.audience && (
                <div>
                  <dt className="label mb-0.5">Audience</dt>
                  <dd className="font-body text-meta text-ink-soft">{sel.guide.audience}</dd>
                </div>
              )}
              {sel.guide.claim && (
                <div>
                  <dt className="label mb-0.5">Claim</dt>
                  <dd className="font-body text-meta text-ink-soft">{sel.guide.claim}</dd>
                </div>
              )}
              {sel.guide.limitation && (
                <div>
                  <dt className="label mb-0.5">Limitation</dt>
                  <dd className="font-body text-meta text-ink-soft">{sel.guide.limitation}</dd>
                </div>
              )}
            </dl>
          </section>
        )}

        <p className="max-w-prose font-body text-label text-ink-faint">
          <span className="stamp mr-2 text-sepia">Transcription note</span>
          {doc.transcriptionNote}
        </p>

        <div className="space-y-5">
          <SourceList sources={doc.sources} />
          <SuggestCorrection path={`/documents/${doc.slug}`} recordTitle={doc.title} />
          {event && (
            <Link to={`/events/${event.slug}`} className="inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep">
              See the event: {event.title}
              <Icon d={icons.arrowRight} className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
