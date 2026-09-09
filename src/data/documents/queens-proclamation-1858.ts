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
      text: 'We shall respect the Rights, Dignity and Honour of Native Princes as Our own; and We desire that they, as well as Our own Subjects, should enjoy that Prosperity and that social Advancement which can only be secured by internal Peace and good Government.',
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
      text: 'It is Our further Will that, so far as may be, Our Subjects, of whatever Race or Creed, be freely and impartially admitted to Offices in Our Service, the Duties of which they may be qualified by their Education, Ability and Integrity duly to discharge.',
      guide: {
        author: 'The Crown.',
        audience: 'Educated Indians.',
        claim: 'Public office is open to Indians on merit.',
        limitation: 'Dadabhai Naoroji and the early Congress would spend decades arguing this promise was not kept.',
      },
    },
  ],
  transcriptionNote: 'Transcribed from the published text of the Proclamation; spelling and capitalisation follow the original. Ellipses mark omitted passages. To be checked word for word against a scan before review.',
  sources: [
    { title: 'Proclamation by the Queen in Council, 1 November 1858', publisher: 'Parliamentary Papers / India Office Records', type: 'archive', evidence: 'contemporary' },
    { title: 'From Plassey to Partition and After', author: 'Sekhar Bandyopadhyay', publisher: 'Orient BlackSwan', year: 2015, type: 'book', evidence: 'scholarship' },
  ],
  editorial: {
    status: 'draft',
    notes:
      'Public-domain Crown text. Cross-checked 2026-09-09 against the transcription at Wikisource and archive.org: the "transfer", "treaties" and "office" passages match the published wording; the "religion" passage was missing its trailing ellipsis (the real sentence continues "…on pain of Our highest Displeasure" after "Worship of any of Our Subjects", now marked with an ellipsis rather than a false full stop). Wikisource/archive.org transcriptions are not themselves primary sources, so wording should still be checked against a scan or the Parliamentary Papers before marking reviewed. A licensed image (e.g. a Wikimedia Commons scan with its licence recorded) is still needed as `image` with credit and licence.',
  },
};
