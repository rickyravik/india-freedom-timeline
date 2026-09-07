/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  /** Cloudflare Web Analytics site token. Set at build time to enable the
      beacon (vite.config.ts) and src/lib/analytics.ts's track(). */
  readonly VITE_CF_BEACON_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
