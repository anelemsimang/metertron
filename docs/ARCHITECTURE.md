# Metertron architecture

## Surfaces (single Next.js 15 app)

| Surface | Routes | Notes |
|---------|--------|-------|
| Marketing | `/`, `/product`, `/pricing`, `/blog`, … | SSG-friendly content |
| Field PWA | `/field` | Dexie offline + sync outbox |
| Manager | `/office` | Review, stock, exports, billing |
| Platform | `/platform` | Staff console, mandatory TOTP |
| Public API | `/api/v1/*` | API keys + rate limits |

## Tenancy

- Every tenant row carries `organisation_id`.
- Request helpers `withOrg(orgId)` set Postgres GUCs; `withBypassRls` for auth/platform/cross-tenant tools.
- Memberships: `owner | admin | supervisor | technician | viewer`.

## Billing

- Single commercial plan key `metertron`.
- Trial is organisation/subscription **status** (7 days), not a separate plan.
- Annual = 12 × monthly. Paystack or local stub provider.
- Dunning: grace → read-only → suspended (never hard-delete).

## Email

- React templates under `src/server/email/`.
- `sendEmail` uses Resend when `RESEND_API_KEY` is set; otherwise logs a stub.

## Observability

- Structured JSON logs via `src/server/observability/log.ts` including `org_id`.
- Optional `SENTRY_DSN` flag (install `@sentry/nextjs` when enabling production APM).
