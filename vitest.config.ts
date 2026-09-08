import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * Unit tests for pure logic only (url-state codecs, search scoring, reading
 * time, glossary matching...). Components and pages are covered end-to-end by
 * Playwright (`npm test`), which runs against the real production build.
 */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts', 'worker/**/*.test.ts'],
    environment: 'node',
  },
});
