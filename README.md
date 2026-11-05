# Metertron

**Every meter, accounted for.**

Field-to-municipality meter installation software for South African contractors.

## Surfaces

| Surface | Path | Who |
|---------|------|-----|
| Marketing | `/` | Public site, blog, glossary |
| Field PWA | `/field` | Technicians — offline capture, photos, GPS, sync |
| Manager | `/office` | Supervisors/admins — review, stock, exports, billing |
| Platform | `/platform` | Metertron staff — orgs, support view-as, plan |
| Public API | `/api/v1` | API keys + webhooks |

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind 4 · Postgres · Drizzle · Dexie (offline)

## Local setup

```bash
cp .env.example .env
# set DATABASE_URL

npm install
npx tsx --env-file=.env scripts/apply-sql.ts drizzle/0000_init.sql
# …apply remaining drizzle/*.sql in order, or use your existing DB
npm run platform:bootstrap  # optional platform owner
npm run dev
```

Organisations are created on signup (trial). Do not seed mock tenants into shared databases.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js (Turbopack) |
| `npm test` | Unit tests |
| `npm run lint` | ESLint |
| `npm run platform:bootstrap` | First platform staff owner |
| `npm run db:purge-tenants` | Wipe all organisations + tenant data (keeps platform staff) |
| `node scripts/render-brand-icons.mjs` | Regenerate brand assets |

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- [`docs/RUNBOOK.md`](docs/RUNBOOK.md)
- [`docs/API.md`](docs/API.md)
- [`docs/BACKUPS.md`](docs/BACKUPS.md)
- [`docs/SAAS_PLAN.md`](docs/SAAS_PLAN.md)
- [`docs/SEO_KEYWORDS.md`](docs/SEO_KEYWORDS.md)
