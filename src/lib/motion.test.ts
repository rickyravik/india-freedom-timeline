import { describe, expect, it } from 'vitest';
import { motionAllowed } from './motion';

describe('motionAllowed', () => {
  it('is false if either the OS or the site setting asks for reduced motion', () => {
    expect(motionAllowed({ osReduced: true, setting: 'system' })).toBe(false);
    expect(motionAllowed({ osReduced: false, setting: 'reduce' })).toBe(false);
    expect(motionAllowed({ osReduced: true, setting: 'reduce' })).toBe(false);
  });
  it('is true only when neither does', () => {
    expect(motionAllowed({ osReduced: false, setting: 'system' })).toBe(true);
  });
});
