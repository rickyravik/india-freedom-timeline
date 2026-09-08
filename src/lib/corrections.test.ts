import { describe, expect, it } from 'vitest';
import { correctionBody, fallbackLink } from './corrections';

const draft = { path: '/fighters/bhagat-singh', recordTitle: 'Bhagat Singh', claim: 'Year is wrong', correction: '1907', sourceUrl: 'https://example.org/doc' };

describe('fallbackLink', () => {
  it('is a mailto with a recipient when an inbox is configured', () => {
    const link = fallbackLink(draft, 'corrections@example.org');
    expect(link.kind).toBe('email');
    expect(link.href.startsWith('mailto:corrections@example.org?subject=Correction%3A%20Bhagat%20Singh&body=')).toBe(true);
    expect(decodeURIComponent(link.href)).toContain('Page: /fighters/bhagat-singh');
  });
  it('is a pre-filled GitHub issue when no inbox is configured', () => {
    const link = fallbackLink(draft, '');
    expect(link.kind).toBe('issue');
    expect(link.href.startsWith('https://github.com/rickyravik/india-freedom-timeline/issues/new?title=Correction%3A%20Bhagat%20Singh&body=')).toBe(true);
  });
});

describe('correctionBody', () => {
  it('includes every field the reviewer needs', () => {
    const body = correctionBody(draft);
    expect(body).toContain("What's wrong:\nYear is wrong");
    expect(body).toContain('Suggested correction:\n1907');
    expect(body).toContain('Source:\nhttps://example.org/doc');
  });
});
