/**
 * The deployed site's public origin, for node scripts (sitemap, robots).
 * Read from .env via Vite's own loader so scripts and app agree; a process
 * env var of the same name overrides the file (how CI would swap domains).
 */
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), 'VITE_');
export const SITE_URL = (env.VITE_SITE_URL ?? '').replace(/\/$/, '');

if (!SITE_URL) {
  throw new Error('VITE_SITE_URL is not set — add it to .env (see README, "Configuration").');
}
