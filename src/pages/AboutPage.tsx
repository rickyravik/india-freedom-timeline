import { Link } from 'react-router-dom';
import { events, fighters, movements } from '@/lib/content';
import { usePageMeta } from '@/lib/hooks';
import { PageIntro, Reveal } from '@/components/ui';

export default function AboutPage() {
  usePageMeta('About & Sources', 'How this archive is built: sources, historical method, and how disputed claims are handled.');

  return (
    <div className="pb-20">
      <PageIntro eyebrow="About this project" title="History, held carefully" />

      <div className="container-page max-w-3xl space-y-12">
        <Reveal as="section" className="max-w-prose space-y-5">
          <p className="prose-reading dropcap">
            India’s Freedom Timeline is an interactive archive of the people, movements and events of India’s struggle against British colonial rule, from the earliest organized
            resistance in the eighteenth century to independence in 1947. It currently holds {fighters.length} biographical records, {events.length} events and {movements.length}{' '}
            movements — and its architecture is designed to grow to thousands of records, because the struggle was the work of millions, most of whose names deserve to be better
            known.
          </p>
          <p className="prose-reading">
            The project deliberately reaches beyond the most famous national leaders: Adivasi and tribal leaders, women of every region, princely-state satyagrahis, poets and
            shipowners, teenaged martyrs and eighty-year-old generals. The freedom struggle contained many ideologies, strategies and disagreements — nonviolence and armed revolt,
            petition and boycott, reform and revolution — and this archive presents that plurality without preaching any single line.
          </p>
        </Reveal>

        <Reveal as="section" aria-label="Historical method" className="vault rounded-lg p-6 shadow-vault sm:p-8">
          <p className="eyebrow-vault mb-2">Method</p>
          <h2 className="mb-4 font-display text-2xl font-semibold text-paper-50">Our approach to accuracy</h2>
          <div className="max-w-prose space-y-4">
            <p className="prose-reading-vault">
              Every biography and event entry carries a visible Sources section citing published historical research, government and archival collections. Where historians dispute
              a claim — a death toll, an attribution, the circumstances of a death — the entry says so in a clearly labelled note rather than presenting legend as fact. Famous
              quotations whose wording or attribution is uncertain are marked "attribution uncertain".
            </p>
            <p className="prose-reading-vault">
              Much beloved popular history rests on oral tradition — songs, ballads and family memory. Oral tradition is itself a historical source, especially for communities the
              colonial record ignored; we include such accounts with their nature stated, so readers can tell documented fact from cherished memory.
            </p>
          </div>
        </Reveal>

        <Reveal as="section" aria-label="Principal sources">
          <p className="eyebrow mb-2">Provenance</p>
          <h2 className="mb-4 font-display text-2xl font-semibold text-ink">Principal source collections</h2>
          <ol className="space-y-3">
            {[
              'National Archives of India — Abhilekh Patal digitised records (abhilekh-patal.in)',
              'Prime Ministers’ Museum & Library (formerly Nehru Memorial Museum & Library), New Delhi',
              'Ministry of Culture, Government of India — Azadi Ka Amrit Mahotsav biographical records',
              'State archives of West Bengal, Punjab, Uttar Pradesh, Bihar, Tamil Nadu, Kerala, Maharashtra, Assam and others',
              'National Gandhi Museum and the Collected Works of Mahatma Gandhi (Gandhi Heritage Portal)',
              'Netaji Research Bureau, Kolkata; INA trial records',
              'Published scholarship — Bipan Chandra et al., India’s Struggle for Independence; Sekhar Bandyopadhyay, From Plassey to Partition; Sumit Sarkar, The Swadeshi Movement in Bengal; Ramachandra Guha, Gandhi: The Years That Changed the World; Sugata Bose, His Majesty’s Opponent; K. Rajayyan, The South Indian Rebellion — and the works cited on each page',
            ].map((s, i) => (
              <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                <span className="mt-0.5 shrink-0 font-display text-xs font-bold text-brass-deep">{String(i + 1).padStart(2, '0')}</span>
                {s}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal as="section" aria-label="Corrections" className="doc p-6">
          <p className="eyebrow mb-2">Corrections</p>
          <p className="prose-reading max-w-prose">
            History deserves correction. If you find an error of fact, a missing attribution, or a person whose story should be here, please open an issue on the project
            repository — each record is a structured, citable file that is straightforward to improve.
          </p>
        </Reveal>

        <Reveal className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-indigo-mid/25 bg-indigo-wash/60 p-6">
          <p className="font-display text-xl font-semibold text-indigo-deep">The best way to honour this history is to explore it.</p>
          <div className="flex flex-wrap gap-2">
            <Link to="/timeline" className="btn-seal">
              Explore the timeline
            </Link>
            <Link to="/fighters" className="btn-ghost">
              Meet the freedom fighters
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
