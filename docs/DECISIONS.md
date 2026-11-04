# Metertron decisions log

Living record of product and engineering choices. Newest first within each phase.

---

## Phase 0 → 1 (2026-11-04)

User replied **proceed** without answering plan §11. Defaults applied:

| # | Question | Decision |
|---|----------|----------|
| 1 | Tenant #1 public slug / legal name | Keep operational data. Phase 1 renames seed/default org to slug `tenant-1`, display name `Organisation` when the previous name was `MeterVault`. Live legal name for the first customer to be confirmed before Phase 2 migration report / any marketing mention. **Do not** publish Nimba as a Metertron case study without explicit OK. |
| 2 | Hosting | Stay on **Supabase Postgres** (existing). Object storage target for Phase 2: **Supabase Storage** (S3-compatible API). App hosting assumed **Vercel** unless redirected — document in DEPLOYMENT.md later. |
| 3 | Monorepo timing | Stay single Next app through Phase 2. Split `apps/marketing` + `apps/platform` at Phases 6–7. |
| 4 | `reference/` folder | **Removed from the repo** in Phase 1. Municipal export layout source of truth is `src/domain/export/headers.ts` + unit tests. Operator should keep a private backup of the original Excel/PDF if needed. |
| 5 | Auth upgrade | **Better Auth (or equivalent) in Phase 3.** Phase 1–2 keep custom sessions with cookie rename + dual-read migration. |

### Phase 1 brand technical choices

- Semantic CSS variables (`--primary`, `--brand-text`, …) remapped onto Metertron `--mt-*` tokens so existing Tailwind `@theme` mappings keep working.  
- Session cookie renamed to `metertron-session`; server accepts legacy `metervault-session` until Phase 3 cleanup.  
- Field IndexedDB / SW cache / sync tags renamed; Dexie opens new DB and one-time copies tables from `metervault-field` when present.  
- Package / Docker DB identifiers renamed to `metertron`. Local Docker volume name change means a fresh local DB unless the operator renames the volume — documented here; production Supabase data is unaffected.  
- Org seed no longer called MeterVault; see question 1 above.  
- Export/PDF product stamp is `Metertron`; tenant `company_name` / `deployment_name` still come from the contract row for municipal columns.  
- Residual `metervault*` / `MeterVault` string literals exist only as **legacy migration bridges** (`LEGACY_STORAGE`, cookie dual-read, org rename). Remove in Phase 3 once field devices and sessions have rolled forward. See `docs/PHASE1_BRAND_REPORT.md`.

---

## Phase 2 (2026-11-04)

| Topic | Decision |
|-------|----------|
| RLS | `FORCE ROW LEVEL SECURITY` on all tenant tables; GUC `app.current_org_id` + `app.bypass_rls` via `withOrg` / `withBypassRls` (transaction + AsyncLocalStorage). |
| Auth lookups | Always `withBypassRls` (login, session, signup). Business data always `withOrg`. |
| Memberships | `organisation_memberships` with `owner\|admin\|supervisor\|technician\|viewer`. Legacy `users.org_role` kept; head↔owner mapping in `src/lib/membership.ts`. |
| Child tables | Added non-null `organisation_id` (+ indexes) to photos, faults, catalogs, towns, grants, etc., backfilled from parents. |
| Photo leak | `acceptSyncedPhoto` requires session user and `jobs.organisationId` match. |
| Object storage | Dual-write: bytea kept + `storage_key` / `content_sha256` under `/{org}/installations/{job}/{photo}.jpg` via FS driver (S3 later). |
| Signup | Still joins Tenant #1 until Phase 3 onboarding creates orgs. |
| Migration | `drizzle/0003_tenancy.sql` + `scripts/migrate-tenant1.ts` (--dry-run / --apply). |
| Pooler / RLS | Supabase **transaction pooler (6543)** can hang on `BEGIN`. Prefer **session mode (5432)** for app RLS transactions. The `postgres` role is a superuser and bypasses RLS; production should use a `NOBYPASSRLS` role (documented for Phase 8 deploy). Isolation tests assert app-level photo scoping always; RLS assertions skip when the DB role bypasses RLS. |
