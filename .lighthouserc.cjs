/**
 * Lighthouse CI, run against a production build served by `vite preview`
 * (see package.json's `lighthouse` script — build first).
 *
 * Accessibility, best practices and SEO are hard errors: this is a public
 * educational archive, regressions here are not optional. Performance is a
 * `warn` for now — CI hardware is noisier than a real visitor's device, and
 * this should flip to `error` once a week or two of real CI runs confirm
 * the baseline holds at 90+ (tracked as a follow-up, not a permanent
 * exemption).
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/timeline',
        'http://localhost:4173/fighters/bhagat-singh',
      ],
      startServerCommand: 'npm run preview -- --port 4173',
      startServerReadyPattern: 'Local:',
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],
        'categories:performance': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
