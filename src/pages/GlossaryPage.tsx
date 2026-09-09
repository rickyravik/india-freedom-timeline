import { Link } from 'react-router-dom';
import { glossaryTerms } from '@/lib/content';
import { usePageMeta } from '@/lib/hooks';
import { PageIntro } from '@/components/ui';
import { DraftStamp } from '@/components/reading';

export default function GlossaryPage() {
  usePageMeta('Glossary', 'Plain-English explanations of the terms that appear across the archive: Company rule, satyagraha, palaiyakkarar and more.');
  const sorted = [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="pb-20">
      <PageIntro title="Glossary" lede="The words this history is told in, explained the first time you meet them on any page, and all together here." />
      <div className="container-page max-w-3xl">
        <dl className="divide-y divide-paper-300">
          {sorted.map((t) => (
            <div key={t.id} id={t.id} className="scroll-mt-28 py-5">
              <dt className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-h3 text-ink">{t.term}</span>
                {t.aliases && <span className="font-body text-label text-ink-faint">also: {t.aliases.join(', ')}</span>}
              </dt>
              <dd className="mt-2 max-w-prose">
                <p className="prose-reading">{t.definition}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  {t.moreLink && (
                    <Link to={t.moreLink.to} className="font-body text-meta font-medium text-oxide-deep underline decoration-oxide-deep/40 underline-offset-4">
                      {t.moreLink.label}
                    </Link>
                  )}
                  {t.editorial.status === 'draft' && <DraftStamp />}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
