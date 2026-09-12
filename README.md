# Kansai in February — Karen's Kyoto & Osaka picks

A single-page guide (where to eat, where to sleep, with a map view) served by a
Cloudflare Worker at **https://karenwang.org/projects/japan-feb**.

Same structure and conventions as the other `karenwang.org/projects/*` Workers
(cloned from `cc-beginner`, minus the chat API).

## Layout

| Path | Purpose |
|------|---------|
| `public/index.html` | The entire guide (inline CSS + JS + embedded photos, ~1.7 MB). |
| `public/manifest.json`, `public/icon-192.svg` | PWA manifest + icon. |
| `worker.js` | Serves the page; trailing-slash, `/healthz`, CORS. |
| `src/middleware/` | Vendored karenwang-infra modules. |
| `wrangler.toml` | Worker config + `karenwang.org/projects/japan-feb*` routes. |
| `.github/workflows/` | Canonical ci-templates: `deploy.yml`, `test.yml`, `audit.yml`. |

Restaurant data comes from the Japan Eats API (`karenwang.org/projects/japan-eats/api/restaurants?city=kyoto|osaka`)
and is baked into `index.html` at build time; each card links back to its Japan Eats page.

## Publish (first time)

1. `npm install` (generates the lockfile CI's `npm ci` needs)
2. Create the GitHub repo and push:
   ```sh
   git init -b main && git add -A && git commit -m "feat: japan-feb guide"
   git remote add origin https://github.com/karenwx/japan-feb.git
   git push -u origin main
   ```
3. Repo **secrets** (Settings → Secrets and variables → Actions): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
4. Repo **variables**: `BASE_PATH` = `/projects/japan-feb`, `WORKER_NAME` = `japan-feb`, `WORKERS_SUBDOMAIN` = `weixuan1994.workers.dev`

The push to `main` runs `deploy.yml` → `npm test` → `wrangler deploy` → `/healthz`
smoke test. Or deploy by hand with `npx wrangler deploy` if you're logged in locally.

## Local

```sh
npm install
npx wrangler dev                                  # http://localhost:8787/
python3 -m http.server 4173 --directory public    # page only
```
