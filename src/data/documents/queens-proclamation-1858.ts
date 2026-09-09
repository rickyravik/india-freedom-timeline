import type { ArchiveDocument } from '@/types';

export const queensProclamation1858: ArchiveDocument = {
  id: 'queens-proclamation-1858',
  slug: 'queens-proclamation-1858',
  title: 'Proclamation by the Queen in Council to the Princes, Chiefs and People of India',
  dateLabel: '1 November 1858',
  kind: 'proclamation',
  eventId: 'queens-proclamation',
  context: [
    'Read out across India on 1 November 1858, the Proclamation announced that the British Crown had taken over the government of India from the East India Company after the revolt of 1857. It promised to respect treaties with Indian rulers, to refrain from interfering in religion, and to admit Indians to office — promises later nationalists would hold the government to.[^1]',
  ],
  passages: [
    {
      id: 'transfer',
      text: 'We have resolved… to take upon Ourselves the Government of the Territories in India heretofore administered in trust for Us by the Honourable East India Company.',
      guide: {
        author: 'Queen Victoria, through her Council — in practice the British government.',
        audience: 'The princes, chiefs and people of India, read aloud in towns and cantonments.',
        claim: 'Rule has passed from a company to the Crown.',
        limitation: 'It does not say why: the revolt of 1857 that ended Company rule is never named.',
      },
    },
    {
      id: 'treaties',
      text: 'We desire no extension of Our present territorial Possessions… We shall respect the Rights, Dignity, and Honour of Native Princes as Our own; and We desire that they, as well as Our own Subjects, should enjoy that Prosperity and that social Advancement which can only be secured by internal Peace and good Government.',
      guide: {
        author: 'The Crown.',
        audience: 'Rulers of the princely states, many of whom had stayed loyal in 1857.',
        claim: 'Annexations of the kind that took Jhansi and Awadh are over.',
        limitation: 'A promise of respect is not a promise of independence; the states remained under British control.',
      },
    },
    {
      id: 'religion',
      text: 'Firmly relying Ourselves on the truth of Christianity… We disclaim alike the Right and the Desire to impose Our Convictions on any of Our Subjects… and We do strictly charge and enjoin all those who may be in authority under Us, that they abstain from all interference with the Religious Belief or Worship of any of Our Subjects…',
      guide: {
        author: 'The Crown.',
        audience: 'Soldiers and civilians whose fear for religion and custom had fuelled the revolt.',
        claim: 'Government will not interfere with religion.',
        limitation: 'Later laws and practice did not always match; readers should compare the promise with what happened.',
      },
    },
    {
      id: 'office',
      text: 'And it is Our further Will that, so far as may be, Our Subjects, of whatever Race or Creed, be freely and impartially admitted to Offices in Our Service, the Duties of which they may be qualified, by their education, ability, and integrity, duly to discharge.',
      guide: {
        author: 'The Crown.',
        audience: 'Educated Indians.',
        claim: 'Public office is open to Indians on merit.',
        limitation: 'Dadabhai Naoroji and the early Congress would spend decades arguing this promise was not kept.',
      },
    },
  ],
  transcriptionNote: 'Transcribed from the 1908 printed reprint of the Proclamation (Internet Archive, "queens-proclamation"); spelling and capitalisation follow that printing, which keeps the 1858 convention of capitalising Our, Us and the principal nouns — Wikisource’s transcription of the same text is modernised to lower case. Ellipses mark omitted passages.',
  sources: [
    { title: 'Proclamation by the Queen in Council, 1 November 1858 (1908 printed reprint)', url: 'https://archive.org/details/queens-proclamation', publisher: 'Internet Archive; original in the Parliamentary Papers / India Office Records', type: 'archive', evidence: 'contemporary' },
    { title: 'From Plassey to Partition and After', author: 'Sekhar Bandyopadhyay', publisher: 'Orient BlackSwan', year: 2015, type: 'book', evidence: 'scholarship' },
  ],
  editorial: {
    status: 'reviewed',
    reviewedBy: 'AI-assisted fact-check against the cited sources (Claude)',
    reviewedOn: '2026-09-09',
    notes:
      'Public-domain Crown text. All four passages checked word for word 2026-09-09 against the 1908 printed reprint (Internet Archive "queens-proclamation") and Wikisource: corrected the religion passage’s missing trailing ellipsis (the sentence continues "…on pain of Our highest Displeasure"), the treaties passage’s comma ("Rights, Dignity, and Honour") and now quoting its "no extension of Our present territorial Possessions" sentence, and the office passage’s opening ("And it is Our further Will") and lower-case "education, ability, and integrity". Not yet done: a check against a facsimile of the 1858 Allahabad printing itself (held by the Royal Armouries; a ProQuest digitisation exists) — none is freely accessible online — and a licensed image to add as `image` with credit and licence.',
  },
};
