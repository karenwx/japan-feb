# TODO — publish japan-feb (run with Codex from a terminal that has gh + wrangler auth)

## Completed — 2026-09-12

- Public repo: https://github.com/karenwx/japan-feb
- Live guide: https://karenwang.org/projects/japan-feb
- Successful production CI run: https://github.com/karenwx/japan-feb/actions/runs/34714554461
- Both CI secrets and all three variables are configured. A dedicated Cloudflare
  token has Workers Scripts edit and Account Settings read access on the deployment
  account, plus Workers Routes edit access on `karenwang.org`.
- Added `workflow_dispatch` for manual deployment runs.
- With the user's approval, replaced the two route patterns with
  `karenwang.org/projects/japan-feb*`. The original exact route served the Projects
  landing page when a query string was present. Worker name and BASE_PATH are unchanged.
- All three unit tests and the dry-run build passed. Live results: health service
  `japan-feb`; cache-busted page `200` with the correct guide title; trailing slash
  `308` to the canonical URL; manifest `200`; title phrase matched two lines.
- Browser checks at 390 × 844 passed: cover, Kyoto/Osaka navigation, Eat/Stay,
  List/Map, cuisine chips, and the hotel ¥ filter. Cover, restaurant, and hotel
  photos checked rendered correctly. This was viewport emulation, not a physical phone.
- Added japan-feb to `karenwang-infra/ROUTING.md` (commit `3818486`). No standalone
  AGENT-INSTRUCTIONS inventory was found under `~/Downloads/projects`; the historical
  instruction-audit report was left unchanged.

The original publishing checklist follows for reference.

Goal: ship this repo live at https://karenwang.org/projects/japan-feb using the
karenwang.org mesh workflow (same as `../cc-learning` / `cc-beginner`).

Everything in the repo is ready and committed on `main` (tests pass, `wrangler
deploy --dry-run` builds: 1.7 MB / 1.2 MB gzip). Only the credentialed steps remain.

## Steps

1. **Create the GitHub repo and push** (public, empty, no README):
   ```sh
   cd ~/Downloads/projects/japan-feb
   gh repo create karenwx/japan-feb --public --source . --remote origin --push
   ```
   If `origin` already exists: `git push -u origin main`.

2. **CI secrets + variables** — copy the values from the `cc-beginner` repo
   (`gh secret list -R karenwx/cc-beginner`, `gh variable list -R karenwx/cc-beginner`):
   ```sh
   R=karenwx/japan-feb
   gh secret set CLOUDFLARE_API_TOKEN  -R $R        # paste value
   gh secret set CLOUDFLARE_ACCOUNT_ID -R $R        # paste value
   gh variable set BASE_PATH         -R $R --body "/projects/japan-feb"
   gh variable set WORKER_NAME       -R $R --body "japan-feb"
   gh variable set WORKERS_SUBDOMAIN -R $R --body "weixuan1994.workers.dev"
   ```
   If the first push already ran `deploy.yml` before the secrets existed, re-run it:
   `gh run rerun -R $R --failed` (or `gh workflow run deploy.yml -R $R`).

3. **Wait for the deploy job** (`gh run watch -R $R`) and confirm it is green.
   Fallback if CI is stuck: `npm install && npx wrangler deploy` from this folder
   (uses the local wrangler login; routes come from `wrangler.toml`).

4. **Verify** (engineering-reference style, cache-busted):
   ```sh
   B=https://karenwang.org/projects/japan-feb
   curl -s "$B/healthz" | grep -o '"service":"japan-feb"'
   curl -s -o /dev/null -w "%{http_code}\n" "$B?v=$(date +%s)"          # 200
   curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "$B/"        # 308 -> $B
   curl -s -o /dev/null -w "%{http_code}\n" "$B/manifest.json"          # 200
   curl -s "$B" | grep -c "Kansai in February"                          # >= 1
   ```
   Open the URL on a phone: cover → Kyoto → Eat/Stay, List/Map toggle, cuisine
   chips, ¥ filter all work; photos render.

5. **Optional (mesh hygiene):** add `japan-feb` to the karenwang.org projects
   index / any registry in `karenwang-infra` if one exists, and to the
   `AGENT-INSTRUCTIONS` inventory in `~/Downloads/projects`.

## Do NOT
- Change `name`, `routes`, or `BASE_PATH` in `wrangler.toml` (CI enforces the routing contract).
- Commit `node_modules`, `.wrangler/`, or any token.
- Deploy a different worker onto the `/projects/japan-feb` route.

## Report back
Repo URL, deploy run URL, and the five curl results above.
