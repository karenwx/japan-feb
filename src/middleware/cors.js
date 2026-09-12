// Vendored from karenwang-infra@db26575. See that repo for updates.
// Adapted from snippets/cors-hono.ts to plain JS for a fetch-handler Worker.
//
// karenwang-infra unified CORS policy for karenwang.org API Workers.
//
// Policy:
//   - No wildcard '*'. Explicit origin allowlist only.
//   - Allowed: karenwang.org + this Worker's own *.workers.dev dev domain.
//   - Methods: GET, POST, PUT, DELETE, OPTIONS.
//   - Headers: Content-Type, Authorization.
//   - Max-Age: 24h.
//
// Usage:
//   import { karenwangCorsHeaders, handleCorsPreflight } from './middleware/cors';
//   const CORS_OPTS = { workerDevDomain: 'giftcompass.weixuan1994.workers.dev', credentials: false };
//   const preflight = handleCorsPreflight(request, CORS_OPTS);
//   if (preflight) return preflight;
//   // ... build response ...
//   return new Response(body, { headers: { ...karenwangCorsHeaders(request, CORS_OPTS), ...otherHeaders } });

const ALLOWED_METHODS = 'GET, POST, PUT, DELETE, OPTIONS';
const ALLOWED_HEADERS = 'Content-Type, Authorization';
const MAX_AGE = '86400';

function allowedOrigins(opts) {
  return [
    'https://karenwang.org',
    `https://${opts.workerDevDomain}`,
    ...(opts.extraOrigins || []),
  ];
}

export function karenwangCorsHeaders(request, opts) {
  const origin = request.headers.get('Origin') || '';
  const allowed = allowedOrigins(opts);
  const headers = {
    'Vary': 'Origin',
  };
  if (allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    if (opts.credentials) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }
  }
  return headers;
}

export function handleCorsPreflight(request, opts) {
  if (request.method !== 'OPTIONS') return null;
  const origin = request.headers.get('Origin') || '';
  const allowed = allowedOrigins(opts);
  const headers = {
    'Access-Control-Allow-Methods': ALLOWED_METHODS,
    'Access-Control-Allow-Headers': ALLOWED_HEADERS,
    'Access-Control-Max-Age': MAX_AGE,
    'Vary': 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
  };
  if (allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    if (opts.credentials) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }
  }
  return new Response(null, { status: 204, headers });
}
