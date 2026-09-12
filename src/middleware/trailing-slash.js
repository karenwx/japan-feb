// Vendored from karenwang-infra@db26575. See that repo for updates.
// Adapted from snippets/trailing-slash-static-worker.ts to plain JS.
//
// karenwang-infra snippet: trailing-slash canonicalization for Cloudflare
// Workers. Call `canonicalizeTrailingSlash(request)` at the top of your fetch
// handler; if it returns a Response, return it immediately.
//
// Behavior:
//   - Any URL whose pathname ends in '/' and is not just '/' -> 308 redirect
//     to the same URL without the trailing slash.
//   - Query strings and fragments are preserved.
//   - The site root '/' is left alone.

export function canonicalizeTrailingSlash(request) {
  const url = new URL(request.url);
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '');
    return Response.redirect(url.toString(), 308);
  }
  return null;
}
