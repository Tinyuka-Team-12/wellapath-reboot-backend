````markdown
# WellaPath Backend

Node.js + Express + Prisma (PostgreSQL) backend for WellaPath phase 1:
- Clinics & Pharmacy catalog
- User Symptom reports
- External Analyzer bridge (ApiMedic / Infermedica) — **feature-flagged**

## Tech Stack
- **Runtime:** Node 22, TypeScript
- **Web:** Express
- **ORM:** Prisma
- **DB:** PostgreSQL
- **Auth:** AWS Cognito (JWT) with dev bypass switch
- **Docs:** Swagger at `/docs`
- **Tests:** Jest + Supertest
- **Infra (staging/prod):** DigitalOcean App Platform + Managed PostgreSQL

---

## Quick Start (Local)

### 0) Prereqs
- Node 20+ (22 recommended), npm 10+
- Docker Desktop (for local Postgres) or a local Postgres server

### 1) Clone & install
```bash
git clone <repo>
cd wellapath-reboot-backend
npm ci
````

### 2) Environment

Copy a sample and fill local values:

```bash
cp .env.example .env
# or use .env.staging.sample as reference for staging/prod keys
```

Key vars:

```ini
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wellapath?schema=public
AUTH_ENABLED=true
AUTH_DEV_BYPASS=true    # set false when testing real JWTs
COGNITO_REGION=<region>
COGNITO_USER_POOL_ID=<pool-id>
COGNITO_CLIENT_ID=<client-id>

# Analyzer OFF by default
SYMPTOM_ANALYZER_PROVIDER=none
```

### 3) DB migrate & seed

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 4) Run

```bash
npm run dev
# http://localhost:4000/health
# http://localhost:4000/docs
```

---

## Docker (Local all-in-one)

```bash
npm run compose:up      # builds api image, runs postgres, migrates, seeds
npm run compose:logs
npm run compose:down
```

---

## Scripts

```bash
npm run dev         # ts-node-dev
npm run build       # compile TypeScript -> dist
npm start           # node dist/server.js
npm test            # unit/integration tests
npm run test:int    # integration tests with .env.test
npm run lint        # eslint
npm run compose:*   # docker compose helpers
```

---

## API Overview

* **Swagger:** `GET /docs` (UI), `GET /docs-json` (OpenAPI JSON)
* **Health:** `GET /health`, `GET /health/db`
* **Catalog:** `GET /api/clinics`, `GET /api/pharmacy`
* **Symptoms:**

  * `GET /api/symptoms` → `{ data: SymptomReport[] }`
  * `POST /api/symptoms` → `{ data: SymptomReport }`
* **Analyzer (flagged):**

  * `GET /api/analyzer/symptoms?query=...` → 503 until provider enabled
  * `POST /api/analyzer/diagnose` → 503 until provider enabled

**SymptomReport**

```ts
type SymptomReport = {
  id: string;
  userId: string;
  description: string;
  severity: 'mild'|'moderate'|'severe';
  gender?: 'male'|'female'|'other';
  yearOfBirth?: number;
  meta?: unknown;
  createdAt: string; // ISO
};
```

---

## Auth

* Controlled by env:

  * `AUTH_ENABLED=true|false`
  * `AUTH_DEV_BYPASS=true|false`
* With bypass = `true`, `/api/*` endpoints skip JWT for faster smoke tests.
* With bypass = `false`, FE must pass:

  ```
  Authorization: Bearer <Cognito JWT>
  ```

---

## Deployment (DigitalOcean App Platform)

**Run Command**

```bash
npx prisma migrate deploy && npx prisma db seed && npm run start
```

**Health check:** `/health`

**Staging env template:** see `.env.staging.sample`.

**Key production/staging vars**

```ini
PORT=8080
NODE_ENV=production
DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/wellapath?sslmode=require&schema=public
AUTH_ENABLED=true
AUTH_DEV_BYPASS=false            # enable only for smoke tests
SYMPTOM_ANALYZER_PROVIDER=none   # apimedic|infermedica when creds arrive
CORS_ORIGINS=https://app.wellapath.com,https://staging.wellapath.com
```

---

## Testing

* Local integration:

  ```bash
  npm run test:int
  ```
* Postman: use `WellaPath Phase 1.postman_collection.json` and `WellaPath-dev.postman_environment.json`.

**Smoke script** (replace `$BASE`):

```powershell
$BASE = "http://localhost:4000"
Invoke-RestMethod "$BASE/health"
Invoke-RestMethod "$BASE/health/db"
Invoke-RestMethod "$BASE/api/clinics"
Invoke-RestMethod "$BASE/api/pharmacy"
$body = @{ description = "headache" } | ConvertTo-Json
Invoke-RestMethod -Method POST "$BASE/api/symptoms" -Headers @{ "Content-Type"="application/json" } -Body $body
Invoke-RestMethod "$BASE/api/symptoms"
"$BASE/docs"
```

---

## Conventions

* **Commit style:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
* **Branching:** `feat/*`, `fix/*`, `chore/*`, PRs into `main`
* **Code style:** ESLint + Prettier; keep functions short and pure when possible
* **HTTP shape:** `{ data: ... }` for success, `{ error: string }` for errors

---

## Troubleshooting

* **DB errors**: verify `DATABASE_URL`, migrations deployed, seed ran.
* **401s in staging**: set `AUTH_DEV_BYPASS=true` temporarily or use a valid JWT.
* **Analyzer 503**: expected until provider & creds are set.
* **Swagger missing**: ensure route JSDoc comments exist and `/docs` route is mounted.

---

## License & Contacts

© WellaPath. Internal use.
Contact: [backend@wellapath.com](mailto:backend@wellapath.com), [ops@wellapath.com](mailto:ops@wellapath.com)

```

---

## What’s next (checklist)

- [ ] Share the **Frontend Integration Guide** with FE (above).
- [ ] Add the **README.md** to the repo (replace existing if needed).
- [ ] Confirm FE can hit `/api/clinics`, `/api/pharmacy`, `/api/symptoms` on staging.
- [ ] Once ApiMedic/Infermedica creds land, we’ll flip the analyzer flag and align FE’s UI flows.

Want me to save the FE guide as a PDF too, or commit the README for you in a new branch (so we keep main safe)?
```
