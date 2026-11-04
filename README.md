# Metertron

**Every meter, accounted for.**

Field-to-municipality meter installation software. Capture. Verify. Submit.

## Apps in this repo

| Surface | Path | Who |
|---------|------|-----|
| Field PWA | `/field` | Technicians — offline capture, photos, GPS, sync |
| Manager | `/office` | Supervisors/admins — review, stock, exports |
| Login | `/login` | Shared auth |

Marketing site and platform control panel land in later phases.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind 4 · Postgres · Drizzle · Dexie (offline)

## Local setup

```bash
cp .env.example .env
# set DATABASE_URL (Supabase pooler or local Docker)

docker compose up -d   # optional local Postgres
npm install
npm run db:push
npm run db:seed
npm run dev
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js (Turbopack) |
| `npm test` | Unit tests |
| `npm run db:push` | Push Drizzle schema |
| `npm run db:seed` | Ensure default organisation |
| `node scripts/render-brand-icons.mjs` | Regenerate logo/favicon/OG assets |

## Brand

See [`docs/BRAND.md`](docs/BRAND.md). Design tokens live in `src/styles/tokens.css`.

## Docs

- [`docs/AUDIT.md`](docs/AUDIT.md) — Phase 0 audit  
- [`docs/SAAS_PLAN.md`](docs/SAAS_PLAN.md) — SaaS roadmap  
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — decision log  
