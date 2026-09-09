import { describe, expect, it } from 'vitest';
import { resolveTrailText } from './translations';
import type { Trail } from '@/types';

const base = {
  id: 't',
  slug: 't',
  version: 2,
  title: 'T',
  question: 'Q',
  theme: 'x',
  minutes: 5,
  learningGoal: 'g',
  intro: 'I',
  accent: 'indigo',
  stops: [{ id: 's1', title: 'S1', text: ['a'], focus: { kind: 'fighter', id: 'x' }, sources: [{ title: 's', type: 'book' }], bridge: '' }],
  reflection: 'R',
  activity: { kind: 'choice', prompt: 'P', options: ['1', '2', '3'], answerIndex: 0, explanation: 'E' },
  followOn: { label: 'l', to: '/' },
  editorial: { status: 'draft' },
} as unknown as Trail;

describe('resolveTrailText', () => {
  it('returns English when no translation exists', () => {
    const out = resolveTrailText(base, 'ta');
    expect(out.lang).toBe('en');
    expect(out.title).toBe('T');
  });
  it('returns the translation and flags staleness against the English version', () => {
    const trail = {
      ...base,
      translations: [
        {
          lang: 'ta',
          sourceVersion: 1,
          translator: 'x',
          title: 'த',
          question: 'கே',
          intro: 'அ',
          stops: [{ title: 'ச', text: ['அ'], bridge: '' }],
          reflection: 'ர',
          activity: { prompt: 'ப', options: ['௧', '௨', '௩'], explanation: 'வ' },
          editorial: { status: 'reviewed' },
        },
      ],
    } as unknown as Trail;
    const out = resolveTrailText(trail, 'ta');
    expect(out.lang).toBe('ta');
    expect(out.title).toBe('த');
    expect(out.stale).toBe(true);
  });
});
