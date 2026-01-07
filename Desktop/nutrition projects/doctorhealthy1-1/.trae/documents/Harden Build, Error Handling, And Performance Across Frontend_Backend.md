## Backend Hardening
- Add centralized JSON error handler middleware: map validation errors to 400, not-found to 404, unexpected to 500; include request ID and timestamp. Wire it in `new/backend/cmd/server/main.go` before routes.
- Make CORS origin configurable via env (default `http://localhost:3000`), support multiple origins.
- Rate limiting from env: `RATE_LIMIT_REQUESTS`, `RATE_LIMIT_DURATION`, `RATE_LIMIT_BURST`; configure Echo's memory store accordingly.
- Add request timeouts and body size limit using `middleware.BodyLimit(MAX_FILE_SIZE)` and server-level read/write timeouts.
- DTO validation with `go-playground/validator`: define request structs and call `Bind` + `Validate` in POST/PUT handlers (auth/profile/meals/workouts/progress/conditions).
- Pagination scaffolding: parse `limit`, `offset` on list endpoints, clamp sane defaults, return `total` consistently.
- Structured logging: enable JSON format and level from env; log request method/path/status/latency; include user ID when available.
- Metrics: expose `/metrics` (optional) and add per-endpoint counters/latency histograms.

## Frontend Robustness
- Create API client in `new/frontend/src/lib/api.ts` using axios with `baseURL` from `NEXT_PUBLIC_API_URL` and SSR fallback to `API_URL`.
- Add interceptors for auth token attachment and unified error normalization; implement simple retry/backoff for transient 5xx.
- Add loading and error UI states for `src/app/page.tsx`, `src/app/conditions/page.tsx`, `src/app/meals/page.tsx`, `src/app/workouts/page.tsx`.
- Schema-validate responses with `zod` where practical; fail gracefully with helpful messages.
- Ensure Tailwind content paths cover `./src/**`; keep `globals.css` and base styles.
- Standardize env usage: document `.env.local` with `API_URL` and `NEXT_PUBLIC_API_URL`; confirm `next.config.js` rewrites work for local/dev.

## Docker/Compose
- Frontend Dockerfile: use `npm ci --prefer-offline --legacy-peer-deps` when lockfile exists; cache node_modules; build with `next build`; run `next start`.
- Compose: set `NEXT_PUBLIC_API_URL: http://backend:8080` for frontend (avoid localhost inside container); keep `API_URL` consistent; confirm healthchecks.
- Force local builder if cloud auth blocks: set `COMPOSE_BAKE=false` or `DOCKER_BUILDKIT=0` and build locally.

## CI/CD
- Backend job: `go mod tidy`, build, run short server and curl `/health`.
- Frontend job: `npm ci` with cache, `next build`; artifact size check.
- Lint/tests optional for now due to trimmed devDeps; reintroduce once registry stability confirmed.

## Tests
- Backend: add httptest cases for `/health`, `/api/v1/conditions`, error handler (invalid payload), pagination params.
- Frontend: minimal runtime checks (render pages with mocked API), then expand to Playwright for smoke E2E later.

## Validation Plan
- Local dev: run backend (`go build && ./bin/server`) and hit `/health`, `/api/v1/conditions`; run frontend (`npm install` then `npm run dev`) and verify pages load with proper error/loading states.
- Docker: build locally and `docker-compose up`; verify frontend at `:3000` calls backend via service URL.

## Repo Path Unification
- Align with user-edited `frontend/Dockerfile` path: migrate or mirror `new/frontend/Dockerfile` content to the top-level `frontend/Dockerfile` if that directory is intended; otherwise, remove duplicates and standardize on `new/`.

## Deliverables
- Error middleware, validation, pagination, logging, and metrics in backend.
- Axios client, error/loading states, and schema-checked pages in frontend.
- Docker/Compose configured for local builds; CI green for basic jobs.

Confirm and I will implement these changes, run local builds, and verify end-to-end performance and error handling.