import type { ComparePair } from '@/types';

const checked = { status: 'reviewed' as const, reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)', reviewedOn: '2026-09-09' };

export const comparePairs: ComparePair[] = [
  { id: 'gandhi-bhagat-singh', a: 'mahatma-gandhi', b: 'bhagat-singh', why: 'Two answers to the same question — how should India resist? — argued in the same years. Gandhi built mass movements on refusing to obey without violence; Bhagat Singh’s generation courted arrest through dramatic action and used the trial as a platform. Both accepted prison as the price.', editorial: checked },
  { id: 'nachiyar-lakshmibai', a: 'velu-nachiyar', b: 'rani-lakshmibai', why: 'Two queens who fought the Company some eighty years apart. Velu Nachiyar lost her husband and kingdom in 1772, spent eight years building alliances and won Sivaganga back around 1780. Lakshmibai lost Jhansi to the Doctrine of Lapse, defended it under siege in 1858 and died in battle. One recovered her state; one did not — and both are remembered as much through tradition as through records.', editorial: checked },
  { id: 'birsa-raju', a: 'birsa-munda', b: 'alluri-sitarama-raju', why: 'Two leaders of Adivasi risings a generation apart — the Munda Ulgulan of 1899–1900 in Chotanagpur and the Rampa rebellion of 1922–24 in the Eastern Ghats. Both fought colonial land and forest laws; both died young. Comparing them shows how the same grievances recurred across regions.', editorial: checked },
  { id: 'mehta-barua', a: 'usha-mehta', b: 'kanaklata-barua', why: 'Two young women in the same movement, 1942, choosing different risks: Usha Mehta ran a secret radio station for three months and was sentenced to four years in prison; Kanaklata Barua, seventeen, led a flag procession to a police station and was shot. Same year, same cause, different forms of courage.', editorial: checked },
];
