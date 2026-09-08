/**
 * The Worker entry for a Cloudflare Workers Assets deploy (not a Pages
 * Functions project — there is no `functions/` directory). With `main` set
 * in wrangler.jsonc, a request that matches a static asset is served
 * directly without ever reaching this handler; only unmatched paths (like
 * POST /api/correction, which has no file in dist/) fall through here.
 */
import { handleCorrection, type CorrectionEnv } from './correction';
import { handleEvent, type EventsEnv } from './events';

export interface Env extends CorrectionEnv, EventsEnv {
  ASSETS: Fetcher;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/api/correction') {
      return handleCorrection(request, env);
    }
    if (request.method === 'POST' && url.pathname === '/api/event') {
      return handleEvent(request, env);
    }
    // env.ASSETS.fetch honors wrangler.jsonc's assets.not_found_handling,
    // so this still resolves an unmatched SPA route to index.html exactly
    // as it did before this Worker existed.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
