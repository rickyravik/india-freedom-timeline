import { describe, expect, it } from 'vitest';
import { annotateFirstOccurrences } from './glossary';

const terms = [
  { id: 'east-india-company', term: 'East India Company', aliases: ['the Company'] },
  { id: 'satyagraha', term: 'satyagraha', aliases: ['satyagrahi', 'satyagrahis'] },
];

describe('annotateFirstOccurrences', () => {
  it('marks only the first occurrence of each term across all paragraphs, case-insensitively', () => {
    const out = annotateFirstOccurrences(['The East India Company arrived. The Company stayed.', 'A satyagrahi refused; satyagraha spread.'], terms);
    expect(out[0]).toEqual([
      { kind: 'text', text: 'The ' },
      { kind: 'term', text: 'East India Company', termId: 'east-india-company' },
      { kind: 'text', text: ' arrived. The Company stayed.' },
    ]);
    expect(out[1]).toEqual([
      { kind: 'text', text: 'A ' },
      { kind: 'term', text: 'satyagrahi', termId: 'satyagraha' },
      { kind: 'text', text: ' refused; satyagraha spread.' },
    ]);
  });
  it('matches whole words only and leaves citation markers alone', () => {
    const out = annotateFirstOccurrences(['Companyman said nothing.[^1]'], terms);
    expect(out[0]).toEqual([{ kind: 'text', text: 'Companyman said nothing.[^1]' }]);
  });
  it('prefers the longest alias at a position', () => {
    const out = annotateFirstOccurrences(['East India Company'], [{ id: 'a', term: 'India' }, { id: 'b', term: 'East India Company' }]);
    expect(out[0]).toEqual([{ kind: 'term', text: 'East India Company', termId: 'b' }]);
  });
});
