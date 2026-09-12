// Vendored from karenwang-infra@db26575. See that repo for updates.
// Adapted from snippets/healthz-static-worker.ts to plain JS.
//
// karenwang-infra snippet: /healthz endpoint for Cloudflare Workers.
// Call from your fetch handler after trailing-slash canonicalization but
// before other routing. Returns null if the request is not /healthz; otherwise
// returns a 200 JSON response. Must not touch KV, DB, or external fetches.
//
// Matches `${basePath}/healthz` (BASE_PATH from env by default).

export function handleHealthz(request, env, opts) {
  const url = new URL(request.url);
  const basePath = (opts && opts.basePath) ?? (env && env.BASE_PATH) ?? '';
  const expected = `${basePath}/healthz`.replace(/\/+/g, '/');
  if (url.pathname !== expected) return null;
  const body = {
    service: opts.service,
    version: (env && env.DEPLOY_VERSION) ?? 'unknown',
    ok: true,
    timestamp: new Date().toISOString(),
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
