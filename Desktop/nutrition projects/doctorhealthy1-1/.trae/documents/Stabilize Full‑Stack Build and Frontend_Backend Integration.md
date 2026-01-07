## Current Issues
- Frontend: package install timed out and `next` binary not present at runtime; minimal App Router added but missing Tailwind wiring and base styles; env usage needs standardization (`API_URL`/`NEXT_PUBLIC_API_URL`).
- Backend: builds and runs on `:8080`; endpoints are reachable, but CORS should be configured explicitly for `http://localhost:3000`.
- Docker: Compose attempted cloud builder (401). Builds should use local builder and existing Dockerfiles.

## Backend Fixes
1. Configure Echo CORS to allow `http://localhost:3000`, standard headers and methods.
2. Keep existing simplified endpoints for auth/users/meals/workouts/progress/conditions; add query param parsing and pagination scaffolds.
3. Ensure `go.mod`/`go.sum` are tidy and `backend:build` script builds package path (`./cmd/server`).

## Frontend Fixes
1. Add `src/app/globals.css` and import it in `src/app/layout.tsx`; configure Tailwind properly (`content` paths include `./src/**/*.{ts,tsx}`).
2. Create basic pages that call backend:
   - `/conditions` (list diseases/injuries from `GET /api/v1/conditions`).
   - `/meals` and `/workouts` (list endpoints already exist).
3. Standardize env handling: prefer `NEXT_PUBLIC_API_URL` for client and `API_URL` for server; document in `.env` and use in `next.config.js` rewrite.
4. Pin key dependency versions in `frontend/package.json` to reduce install variability; commit lockfile after successful install.

## Docker & Compose
1. Use local Docker builder: set `DOCKER_BUILDKIT=0` or ensure compose does not delegate to Bake.
2. Frontend Dockerfile: use Node 18-alpine, install deps, build, and run `next start`. Backend Dockerfile already builds static binary.
3. Compose services: ensure envs `API_URL` and `NEXT_PUBLIC_API_URL` are set so frontend points to backend service (`http://backend:8080`).

## CI/CD
1. Validate `simple-ci.yml` runs: Go backend build, basic curl on `/health`.
2. Add lightweight frontend build job (install, build) with caching.

## Validation Plan
1. Local dev:
   - Backend: `go build -o bin/server ./cmd/server` and `./bin/server`; verify `/health`, `/api/v1/conditions` via `curl`.
   - Frontend: `npm install` then `npm run dev`; visit `http://localhost:3000` and confirm SSR fetch displays backend health; navigate to `/conditions` and verify data.
2. Docker:
   - `docker-compose build && docker-compose up -d` with local builder; verify frontend at `:3000` and backend at `:8080` through Nginx.

## Scale Readiness (10,000 users)
- Add pagination to list endpoints; introduce Redis caching for hot reads; enforce rate limits via env; prepare DB models with indexes for meals/workouts/progress and conditions tables.

## Deliverables
- Frontend pages and styles wired to backend with env-based routing.
- Backend CORS and minor endpoint scaffolding improvements.
- Working local dev and Docker builds; CI green.

Confirm to proceed and I will implement these changes, run the builds, and verify end-to-end.