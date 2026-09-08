import { describe, expect, it } from 'vitest';
import { flag, oneOf, oneOfDefault, parseParams, serializeParams, text } from './url-state';

const schema = {
  region: oneOf(['north', 'south'] as const),
  view: oneOfDefault(['chapters', 'full'] as const, 'full'),
  q: text(),
};

describe('parseParams', () => {
  it('returns defaults for an empty query string', () => {
    expect(parseParams(schema, new URLSearchParams())).toEqual({ region: null, view: 'full', q: '' });
  });
  it('accepts allowed values and rejects unknown ones', () => {
    expect(parseParams(schema, new URLSearchParams('region=south&view=nonsense&q=salt'))).toEqual({ region: 'south', view: 'full', q: 'salt' });
  });
});

describe('serializeParams', () => {
  it('omits keys at their default and keeps unrelated keys', () => {
    const out = serializeParams(schema, { region: null, view: 'full', q: '  ' }, new URLSearchParams('other=1'));
    expect(out.toString()).toBe('other=1');
  });
  it('writes non-default values', () => {
    const out = serializeParams(schema, { region: 'north', view: 'chapters', q: 'salt' }, new URLSearchParams());
    expect(Object.fromEntries(out)).toEqual({ region: 'north', view: 'chapters', q: 'salt' });
  });
  it('round-trips', () => {
    const state = { region: 'south' as const, view: 'chapters' as const, q: 'Dandi march' };
    expect(parseParams(schema, serializeParams(schema, state, new URLSearchParams()))).toEqual(state);
  });
});

describe('flag', () => {
  it('reads "1" as on and omits the key when off', () => {
    const s = { text: flag() };
    expect(parseParams(s, new URLSearchParams('text=1'))).toEqual({ text: true });
    expect(parseParams(s, new URLSearchParams())).toEqual({ text: false });
    expect(serializeParams(s, { text: false }, new URLSearchParams()).toString()).toBe('');
    expect(serializeParams(s, { text: true }, new URLSearchParams()).toString()).toBe('text=1');
  });
});
