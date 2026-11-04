# Metertron Phase 0 — Codebase Audit

**Audited:** 2026-11-04  
**Repo path:** `c:\Users\USER\Desktop\metertron`  
**Current product name in code:** MeterVault (`package.json` name: `metervault`)  
**Original contractor brand (reference only):** Nimba PTY LTD  
**Municipality served today:** eThekwini Municipality (contract WS7761)

This document is the Phase 0 baseline. No product code was changed while producing it.

---

## 1. Stack

| Layer | What exists | Key paths |
|--------|-------------|-----------|
| Framework | **Next.js 15** App Router (`next@^15.5.4`), Turbopack in `dev` | `package.json`, `next.config.ts` |
| Language / UI | **TypeScript**, **React 19**, Tailwind CSS 4, Lucide icons, CVA/clsx | `src/`, `src/styles/tokens.css` |
| Database | **PostgreSQL 16** (Docker Compose locally; Supabase pooler in `.env.example`) | `docker-compose.yml`, `.env.example` |
| ORM | **Drizzle ORM** + drizzle-kit | `src/server/db/schema.ts`, `drizzle.config.ts`, `drizzle/*.sql` |
| Auth | **Custom cookie sessions** (not NextAuth/Clerk). Scrypt password hashes. Schema comments note future Better Auth compatibility | `src/server/auth/session.ts`, `password.ts` |
| Validation | Zod 4 | forms + API bodies |
| Photos / files | **Postgres `bytea`** on `job_photos.content`. `storage_key` / `legacy_url` columns exist but live sync writes blobs to the DB | `schema.ts`, `src/server/sync/persist.ts` |
| Spreadsheets / PDFs | **exceljs**, **pdf-lib** | `src/domain/export/*`, `src/server/office/*-report.ts` |
| Field barcode | `@zxing/browser` | `src/components/field/barcode-scanner.tsx` |
| Offline | **Dexie** IndexedDB + custom **service worker** + Web App Manifest + Background Sync tag | `src/lib/field/db.ts`, `public/sw.js`, `src/app/manifest.ts` |
| Background jobs | **None.** Exports and PDFs run inline in request handlers. `export_runs` table exists but is unused | API routes under `src/app/api/office/` |
| Hosting hints | Supabase connection string documented; no Vercel/Fly/Docker app deploy config | `.env.example`, `src/server/db/client.ts` |
| Tests | Node `tsx --test` unit tests (export, access, sync inbox, job report, periods) | `package.json` `test` script |
| Marketing / monorepo | Single Next app only. No separate marketing site. Client website lives under `reference/` | — |

**Decision implication:** Keep Next.js + Postgres + Drizzle. Do not introduce a new framework. Object storage and a job queue are required before multi-tenant photo volume is safe.

---

## 2. Application surfaces today

| Surface | Route | Audience |
|---------|-------|----------|
| Home | `/` | Redirects session → `/office` or `/field` |
| Login / signup | `/login` | Public |
| Field PWA | `/field`, `/field/capture`, `/field/map`, `/field/account` | Field technicians (`org_role = member`) |
| Office / Manager | `/office`, jobs, review, work-orders, stock, team, exports, form docs, map | Head manager + Manager (`head`, `admin`) |
| APIs | `/api/auth/*`, `/api/sync/*`, `/api/field/*`, `/api/office/*` | Session-scoped |

There is no marketing site, no platform admin, no billing, no public REST API, no webhooks, no email templates.

---

## 3. Data model

**Source of truth for app code:** `src/server/db/schema.ts`  
**SQL migrations:** `drizzle/0000_init.sql`, `0001_stock_movements.sql`, `0002_head_manager.sql`

> **Drift warning:** migrations lag `schema.ts` (e.g. `users.password_hash` absent from `0000`; stock/work_order org columns evolved after init). Live DBs appear to have been aligned via `db:push` / manual changes. Phase 2 must reconcile this before adding RLS.

### 3.1 Enums

| Enum | Values |
|------|--------|
| `org_role` | `admin`, `member`, `head` |
| `contract_role` | `technician`, `supervisor`, `admin`, `client_viewer` |
| `job_status` | `draft`, `submitted`, `in_review`, `approved`, `rejected`, `resubmitted` |
| `installation_type` | `meter_only`, `white_and_blue_box`, `non_straight` |
| `premise_type` | `business`, `domestic` |
| `fault_code` | `rm`, `rp`, `rn`, `rc`, `ro`, `rv` |
| `photo_type` | `meter_number`, `new_meter`, `old_meter`, `water_point`, `ciu_card`, `other` |
| `flag_severity` | `block`, `warn`, `info` |
| `work_order_status` | `unassigned`, `assigned`, `in_progress`, `completed`, `exception` |
| `stock_kind` | `meter`, `smart_device` |
| `stock_status` | `in_stock`, `issued`, `installed`, `returned` |
| `stock_movement` | `received`, `issued`, `installed`, `returned` |
| `form_status` | `draft`, `published`, `retired` |

### 3.2 Tables

#### `organisations`
- Columns: `id`, `name`, `legal_name`, `slug` (unique), timestamps  
- **PII:** business identity  
- **Today:** single row seeded as MeterVault / slug `metervault`

#### `users` — **PII: yes**
- Columns: `id`, `organisation_id` → organisations, `org_role`, `name`, `username`, `email`, `password_hash`, `email_verified`, `image`, `removed_at`, timestamps  
- Indexes: unique `(organisation_id, username)`, unique **`email` globally**  
- Soft-delete via `removed_at`

#### `sessions` — **PII-adjacent**
- `user_id`, unique `token`, `expires_at` (30 days), `ip_address`, `user_agent`

#### `contracts`
- Per-org municipal programme config: `municipality_name`, `code`, `name`, `deployment_name`, `company_name`, `export_filename_pattern`, `export_sheet_name` (default `Main`), `status_export_value`, `approval_levels`, `list_phrases` JSON, `timezone` (default `Africa/Johannesburg`)  
- Unique `(organisation_id, code)`  
- **PII:** no personal data; business config

#### `contract_grants`
- Links `user_id` + `contract_id` + `contract_role`  
- Unique `(user_id, contract_id)`  
- **Runtime:** auto-inserted as `technician` on job sync; capability matrix mostly unused by APIs

#### Catalog / config (per contract, no PII)
- `towns` — unique `(contract_id, normalised_name)`  
- `installers` — optional `user_id`, `display_name` (**PII:** names)  
- `meter_sizes`, `meter_classes`, `meter_types` — `code`, `export_string`, `is_default`  
- `form_versions` — `key`, `version`, `status`, `schema` jsonb

#### `work_orders` — **PII: yes**
- Org-scoped; optional contract/town; assignment; address fields; `old_meter_number`, `connection_number`, `account_number`; lat/lon

#### `jobs` — **PII: yes** (core capture record)
- Org + optional contract/form/work-order; enumerator; installer; town; meter catalog FKs  
- Status workflow; response code; draft/submit metadata; rejection/edit counts; `submit_ip`  
- Address, company, card/job numbers, meter numbers/readings, connection/account, faults via child table, `answers` jsonb  
- Soft-delete `deleted_at`  
- Indexes: unique `response_code`; unique `(enumerator_id, idempotency_key)`; partial unique new meter / smart device per contract; index `(contract_id, status)`

#### `job_faults`
- Composite unique `(job_id, code)`

#### `job_photos` — **PII: yes** (images + GPS)
- `type`, `sequence`, `storage_key`, `legacy_url`, **`content` bytea**, `idempotency_key` (unique), capture time + GPS accuracy/altitude

#### `quality_flags` — **unused in app code**
#### `audit_events` — **unused in app code** (schema ready for field diffs)
#### `stock_items` / `stock_movements` — org-scoped asset ledger (serials quasi-PII when linked to installs)
#### `export_runs` — **unused in app code**

### 3.3 Relationship sketch

```
organisations
  ├── users ── sessions
  │     └── contract_grants ── contracts
  ├── contracts
  │     ├── towns, installers, meter_*, form_versions
  │     └── export_runs (unused)
  ├── work_orders ── jobs
  ├── jobs ── job_faults, job_photos, quality_flags, audit_events
  └── stock_items ── stock_movements
```

### 3.4 Personal information summary

| Data class | Tables / fields |
|------------|-----------------|
| Staff identity | `users.name/email/username`, `installers.display_name`, sessions IP/UA |
| Customer / property | job & work-order address, account/connection numbers, company name on job |
| Meter identifiers | new/old meter numbers, smart device numbers, stock serials |
| Location | job photo GPS; work-order lat/lon |
| Imagery | `job_photos.content` |
| Credentials | `users.password_hash`, session tokens |

---

## 4. Auth, roles and permissions

### 4.1 Sessions
- Cookie name: `metervault-session` (`src/server/auth/session.ts`)  
- Token: 32 random bytes stored in `sessions`; httpOnly, sameSite=lax, secure in production; maxAge 30 days  
- Lookup joins user; rejects expired / soft-removed users; ~60s in-memory token cache  
- Logout deletes DB row + cookie

### 4.2 Org roles (what the product actually uses)

From `src/lib/roles.ts`:

| Role | Label | Access |
|------|--------|--------|
| `head` | Head manager | Full office UI + APIs; **only** role that can change roles / remove users |
| `admin` | Manager | Office UI + APIs except team role/remove |
| `member` | Field | Field app only; redirected away from `/office` |

Signup: first user in the (single) org → `head`; later → `member`. All signups attach to slug `metervault` via `ensureOrganisation()`.

### 4.3 Contract roles (designed, thinly enforced)

`src/server/auth/access.ts` defines a capability matrix for `technician | supervisor | admin | client_viewer | org_admin`:

| Capability | tech | supervisor | contract admin | client_viewer | org_admin |
|------------|------|------------|----------------|---------------|-----------|
| capture_own_draft | ✓ | | | | |
| see_own_jobs | ✓ | | | | |
| see_contract_jobs | | ✓ | ✓ | | ✓ |
| see_approved_only | | | | ✓ | |
| edit_submitted | | ✓ | ✓ | | ✓ |
| assign_and_stock | | ✓ | ✓ | | ✓ |
| approve_or_reject | | ✓ | ✓ | | ✓ |
| unlock_approved | | | ✓ | | ✓ |
| manage_setup | | | ✓ | | ✓ |
| export | | ✓ | ✓ | ✓ (approved) | ✓ |

**Runtime reality:** office routes use `requireAdmin()` / `isOfficeRole`; field sync only checks session. `assertCan` / grant loading are tested but **not wired into API handlers**.

### 4.4 Spec vs current role mapping (for Phase 3)

| Spec role | Closest current | Gap |
|-----------|-----------------|-----|
| Owner | `head` | No billing/delete-org/transfer |
| Admin | `admin` / contract `admin` | Split org vs contract unclear in UX |
| Supervisor | contract `supervisor` | Not exposed in office UI |
| Field Technician | `member` + grant `technician` | No “own jobs only” API enforcement |
| Viewer / Client Rep | `client_viewer` | No product surface |

---

## 5. API routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/auth/login` | POST | public | Email/password → session |
| `/api/auth/signup` | POST | public | Create user on default org + session |
| `/api/auth/logout` | POST | session | Clear session |
| `/api/auth/me` | GET | session | Current user JSON |
| `/api/sync/jobs` | POST | session | Validate meter-change form → persist job |
| `/api/sync/photos` | POST | session | Multipart photo → bytea |
| `/api/field/work-orders` | POST | session | Claim/start work order |
| `/api/office/review` | POST | office | Approve/reject |
| `/api/office/work-orders` | POST | office | Create / assign / complete / exception / reopen |
| `/api/office/stock` | POST | office | Receive / status update + movements |
| `/api/office/stock/report` | GET | office | PDF stock report |
| `/api/office/export` | GET | office | XLSX capture spreadsheet |
| `/api/office/photos/[id]` | GET | office | JPEG bytes (org-scoped join) |
| `/api/office/jobs/[id]/report` | GET | office | Per-job PDF |
| `/api/office/team` | POST | office; head for role/remove | Change role or soft-remove |

---

## 6. Field / offline capability

1. Dexie DB `metervault-field`: drafts, photos (blobs), outbox queue  
2. Client-side JPEG compression (max edge 1600, quality 0.72) + GPS fill  
3. Submit → outbox → POST `/api/sync/jobs` then photos; exponential backoff (cap 30s)  
4. Service worker precaches field shell; Background Sync tag `metervault-outbox`  
5. `SyncProvider` flushes every 15s + on `online`  
6. PWA manifest: standalone, start `/field`

**Gaps for SaaS:** conflict handling is basic; photo attach looks up job by idempotency key without verifying enumerator/org (isolation hole); IndexedDB name and cache keys are brand-tied.

---

## 7. Original branding inventory

Two brand layers exist:

1. **Product brand in the app:** MeterVault (teal `#0A6B74` / brass `#C4892A`, location “Durban”)  
2. **Original contractor brand:** Nimba PTY LTD — almost entirely under `reference/`, plus one test fixture and the municipal Excel filename

### 7.1 Canonical product brand (must become Metertron)

| File | Lines / notes |
|------|----------------|
| `src/lib/brand.ts` | 2–22 — name, mark, location, app names, colours, all `metervault-*` storage keys |
| `src/styles/tokens.css` | 1–16 — “MeterVault palette”; `--primary: #0a6b74` |
| `src/components/brand/logo.tsx` | SVG fill `#0A6B74` / `#C4892A`; word “MeterVault” |
| `src/components/brand/app-loading.tsx` | Brass accent `#C4892A` |
| `src/app/layout.tsx` | Metadata from `BRAND`; icons under `/icons/` |
| `src/app/manifest.ts` | PWA name/icons from brand |
| `src/app/login/page.tsx` | Hard-coded `Meter`/`Vault` lockup; “Opening MeterVault” |
| `src/app/loading.tsx` | “Opening MeterVault” |
| `src/components/office/office-shell.tsx` | Logo + ``MeterVault · Durban`` |
| `src/components/field/field-shell.tsx` | Logo + brand name |
| `src/app/(field)/field/layout.tsx`, `(office)/office/layout.tsx` | Field/Manager titles |
| `package.json` / `package-lock.json` | `"name": "metervault"` |
| `docker-compose.yml` | user/password/db/volume `metervault` |
| `drizzle.config.ts` | default URL `.../metervault` |
| `src/server/db/client.ts` | globals `metervaultSql` / `metervaultUrl` / `metervaultPool` |
| `src/server/db/reference.ts` | seeds name/legalName/slug MeterVault / `metervault` |
| `src/server/db/seed.ts` | console “MeterVault organisation is ready.” |
| `src/server/auth/session.ts` | `SESSION_COOKIE = "metervault-session"` |
| `public/sw.js` | cache `metervault-field-v1`; sync tag `metervault-outbox` |
| `scripts/render-brand-icons.mjs` | teal/brass SVG icon renderer |
| `public/icons/*`, `public/splash.png`, `public/brand/mark.png` | MeterVault assets |
| `README.md` | GitHub profile stub referencing Metervault/metervault |

### 7.2 PDF / Excel / report strings

| File | Notes |
|------|-------|
| `src/domain/export/workbook.ts` | `workbook.creator = "MeterVault"` |
| `src/server/office/spreadsheet-export.ts` | Fallbacks `"MeterVault"` for deployment/company/filename |
| `src/server/office/job-report.ts` | Header/footer `"MeterVault | Durban | …"`; teal RGB |
| `src/server/office/stock-report.ts` | Same pattern; `"MeterVault stock report"` |
| `src/server/office/load.ts` | `organisation?.name ?? "MeterVault"` |
| `src/lib/report-period.ts` | Fallback `"MeterVault report"` |
| `src/domain/export/headers.ts` | Comment “MeterVault additions…” |

### 7.3 Tests using brand / client names

| File | Notes |
|------|-------|
| `src/domain/export/map.test.ts` | `"MeterVault"` fixtures |
| `src/domain/export/workbook.test.ts` | **`"Nimba"`** deployment/company |
| `src/server/office/job-report.test.ts` | MeterVault / Durban |
| `src/server/auth/access.test.ts` | org `"metervault"`, contract `"ws7761"` |
| `src/server/sync/inbox.test.ts` | temp dirs `metervault-inbox-` |
| `src/lib/report-period.test.ts` | `"MeterVault stock report"` |

### 7.4 Nimba / client contact (reference folder)

| Path | Content |
|------|---------|
| `reference/Nimba Website/*.html` | Full Nimba marketing site: titles, logos, copy |
| `reference/Nimba Website/README.md` | Nimba docs; `info@nimba.org.za`; 13 Ribbon Road, Newlands East, Durban |
| `reference/Nimba Website/styles/main.css` | Nimba greens `#8dbd2d` / `#7da526`; `.why-nimba` |
| `reference/branding/logo.png`, `nimba-logo.png` | Client logos |
| `reference/eThekwini Municiplality-WS7761 - Nimba 2026-04-29.xlsx` | Municipal export sample; Deployment/company = Nimba |
| `reference/Response-KeeganM-E442NZ.pdf` | mWater-style response PDF artifact |

**App `src/` has no Nimba emails or phone numbers.** Contact details exist only under `reference/Nimba Website/`.

**Phase 1 action on `reference/`:** remove from the product tree (or move to a private non-shipped archive outside the repo) so a repo-wide search returns zero Nimba hits in shippable artifacts. Keep a sanitised municipal template sample as a built-in export template fixture with fictional company names.

---

## 8. eThekwini / municipal hardcoding

### 8.1 Export layout (byte-for-byte municipal sheet)

| Location | Assumption |
|----------|------------|
| `src/domain/export/headers.ts` | **66** municipal headers including source typos (`PHOTO FO`, `CODE:CZC`); sheet name `"Main"` |
| Same file, `MAP_EXPORT_HEADERS` | 3 MeterVault-added OSM link columns after municipal block |
| `src/domain/export/map.ts` | One producer per header; connection `(1)` always blank; faults as Excel boolean ticks |
| `src/domain/export/workbook.ts` | Sheet `"Main"`; Excel serials in `Africa/Johannesburg` |
| `src/domain/export/map.test.ts` | Asserts length 66 and typo’d header order |
| Reference XLSX | Sheet Main; headers A1:BN match; ~415 rows; Status always `Final`; Deployment always Nimba |

### 8.2 Phrases, enums, status word

| Location | Assumption |
|----------|------------|
| `src/domain/export/phrases.ts` | Old meter suffix `" was not on the list"`; connection `"Not on the list"` |
| `src/domain/export/job.ts` | Install strings `"meter only"` / `"white and blue box"` / `"Non-straight"`; premise Business/Domestic; faults RM/RP/RN/RC/RO/RV |
| `src/server/office/spreadsheet-export.ts` | Approved status fallback `"Final"` |
| `src/server/db/schema.ts` L90 | Comment: eThekwini sample is `"Final"` |
| `src/app/(office)/office/form/page.tsx` | Operator docs for Final status + catalog defaults |

### 8.3 Form schema & validation (`meter-change` v1)

| Rule | Pattern / value | File |
|------|-----------------|------|
| Form key | `meter-change` v1 | `meter-change-v1.ts` |
| New meter warn | `^[A-Z]{3}\d{3}$` (e.g. CZZ863) | same |
| Smart device warn | `^\d{11}$` | same |
| Reading forbid | 11-digit (swapped barcode) | same |
| Old meter warn | `CXV220` / `C-CHQ390` style | same |
| Connection warn | `W######` / `WO#####` / `W######A` | same |
| Default Other | `"Meter replacement"` | form + `lib/field/contract.ts` |
| Field catalog stub | 15mm / Class D / Ultrasonic | `lib/field/contract.ts` |
| Photo slots | meter number, new, old, water point, CIU, other | form |

### 8.4 Already partially configurable (good foundation)

`contracts` table already holds municipality name, code, deployment/company names, filename pattern, sheet name, status export value, list phrases JSON, timezone. Towns and meter catalogs are per-contract tables. `form_versions.schema` jsonb exists but the live form is still the hard-coded TypeScript `METER_CHANGE_V1`.

### 8.5 Not hard-coded in source

- No ward / region / zone lists in `src/`  
- Towns come from DB (`towns` table)  
- No meter manufacturer brand list

### 8.6 Geography defaults

- Timezone default and reporting calendar: `Africa/Johannesburg`  
- Brand location string / PDF footers: **Durban**

---

## 9. Risks and technical debt that block multi-tenancy

| # | Risk | Severity |
|---|------|----------|
| 1 | Signup always joins hardcoded org slug `metervault` — not real multi-tenant | Blocker |
| 2 | Global unique `users.email` — blocks same email across orgs / multi-org membership cleanly | Blocker |
| 3 | No Postgres **RLS** — isolation is application `eq(organisationId)` only | Blocker (spec) |
| 4 | Photo sync finds job by idempotency key **without org/enumerator check** | High |
| 5 | Photos as DB `bytea` — will not scale; no per-tenant storage namespace | High |
| 6 | Contract RBAC matrix unused — Supervisor / Client Viewer not productised | High |
| 7 | Users belong to exactly one org (`organisation_id` on user) — no memberships / org switcher | High |
| 8 | Schema vs migration SQL drift | High |
| 9 | Export headers / form v1 hard-wired to one municipal layout | Medium (Phase 4) |
| 10 | Dead tables: `quality_flags`, `audit_events`, `export_runs` | Medium |
| 11 | No background workers, email, billing, monitoring, rate limits | Medium |
| 12 | Session cookie and IndexedDB names brand-tied; changing cookie name logs everyone out | Low (Phase 1 plan) |
| 13 | `reference/` ships Nimba assets inside the repo | Brand compliance |
| 14 | No automated cross-tenant isolation tests | Required by acceptance |

### What already helps

- `organisation_id` already on users, contracts, jobs, work_orders, stock_*  
- Most office queries filter by session org  
- Soft-remove users; head/admin team controls  
- Contracts model is a natural home for municipal templates  
- Capability matrix in `access.ts` is a solid base for the permission layer  
- Offline capture, review queue, Excel export, stock ledger already work for the first tenant

---

## 10. Hosting / ops snapshot

| Concern | Status |
|---------|--------|
| Env template | `.env.example` — only `DATABASE_URL` |
| Secrets in repo | None observed beyond Docker local password `metervault` |
| CI | No GitHub Actions / CI config found |
| Error monitoring | None |
| Backups | Relies on Supabase (undocumented in repo) |
| Seed | Ensures single MeterVault organisation only |

---

## 11. Audit summary

The codebase is a **working single-company field + office app** with early multi-tenant scaffolding (`organisations`, `organisation_id` FKs, contracts, grants, capability matrix) that is **not activated**. Branding is MeterVault throughout the product; Nimba lives in `reference/` and one export test. Municipal behaviour is encoded as a fixed 66-column export + `meter-change` v1 form, with contract columns already prepared to carry tenant-specific export metadata.

**Recommended keep:** Next.js App Router, React, Drizzle, Postgres, Zod, Dexie offline, exceljs/pdf-lib, Lucide, existing field/office domain model.

**Recommended add (not replace):** Postgres RLS, org memberships, object storage, Paystack billing layer, platform admin app, marketing site (separate Next/Astro workspace or `apps/` monorepo), email, queue, CI.

Proceed to [`docs/SAAS_PLAN.md`](./SAAS_PLAN.md) for the target architecture and phased execution plan.
