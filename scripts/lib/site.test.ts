import { describe, expect, it } from 'vitest';
import { SITE_URL } from './site.mjs';

describe('SITE_URL', () => {
  it('is an absolute https origin with no trailing slash', () => {
    expect(SITE_URL).toMatch(/^https:\/\/[a-z0-9.-]+$/);
  });
});
