// japan-feb — "Kansai in February": Karen's Kyoto & Osaka picks.
// Plain-JS Cloudflare Worker, deployed at karenwang.org/projects/japan-feb.
// Follows the karenwang.org mesh conventions: trailing-slash canonicalization,
// /healthz, unified CORS, BASE_PATH prefix stripping. Static page only — no API.
// The page is bundled as a text module (see wrangler.toml rules).

import HTML from './public/index.html';
import MANIFEST from './public/manifest.json';
import ICON from './public/icon-192.svg';
import { canonicalizeTrailingSlash } from './src/middleware/trailing-slash.js';
import { handleHealthz } from './src/middleware/healthz.js';
import { karenwangCorsHeaders, handleCorsPreflight } from './src/middleware/cors.js';

const CORS_OPTS = {
  workerDevDomain: 'japan-feb.weixuan1994.workers.dev',
  credentials: false,
};

export default {
  async fetch(request, env) {
    // 1. Trailing-slash canonicalization (308) — FIRST.
    const trailingRedirect = canonicalizeTrailingSlash(request);
    if (trailingRedirect) return trailingRedirect;

    // 2. /healthz — mounted at `${BASE_PATH}/healthz`.
    const healthz = handleHealthz(request, env, { service: 'japan-feb' });
    if (healthz) return healthz;

    // 3. Unified CORS preflight.
    const preflight = handleCorsPreflight(request, CORS_OPTS);
    if (preflight) return preflight;

    const url = new URL(request.url);
    const corsHeaders = karenwangCorsHeaders(request, CORS_OPTS);

    // Strip the production base path so prod (/projects/japan-feb/...) and the
    // workers.dev preview (/...) hit the same handlers.
    const path = url.pathname.replace(/^\/projects\/japan-feb/, '') || '/';

    if (path === '/manifest.json') {
      return new Response(MANIFEST, {
        headers: { 'Content-Type': 'application/manifest+json', 'Cache-Control': 'public, max-age=86400', ...corsHeaders },
      });
    }
    if (path === '/icon-192.svg') {
      return new Response(ICON, {
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400', ...corsHeaders },
      });
    }

    // Everything else serves the guide (single-page, hash-free, self-contained).
    return new Response(HTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        ...corsHeaders,
      },
    });
  },
};
