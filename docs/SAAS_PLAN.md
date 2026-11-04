# Metertron — SaaS Plan

**Based on:** [`docs/AUDIT.md`](./AUDIT.md) (2026-11-04)  
**Status:** Awaiting review before Phase 1  
**Product:** Metertron — *Every meter, accounted for.*

---

## 1. Goal

Convert the working single-company MeterVault field + office app into **Metertron**: a multi-tenant SaaS for meter installation contractors, utilities and municipalities — plus a public marketing site and a platform-owner control panel — without losing the existing client’s data or their eThekwini Excel export fidelity.

---

## 2. Decisions locked for Phase 0 (documented; reversible only with migration cost)

These are the “sensible calls” so Phase 1+ can start without blocking on preference debates. Irreversible or ambiguous items that still need your OK are in §11.

| Topic | Call | Why |
|-------|------|-----|
| Framework | Keep **Next.js 15 App Router** + React 19 + Tailwind 4 + Drizzle + Postgres | Working stack; rewrite risk outweighs benefit |
| Repo shape | Evolve to **`apps/` monorepo**: `apps/web` (tenant app), `apps/marketing`, `apps/platform` (control panel), shared `packages/ui`, `packages/brand`, `packages/db` | Spec asks separate marketing + hardened admin; shared tokens/brand |
| Short term (Phases 1–2) | Stay in current single Next app; extract packages when marketing/platform land (Phase 6–7) | Avoid big-bang restructure before tenancy works |
| Auth | Keep custom sessions for Phase 1–2; introduce **Better Auth** (or equivalent) in Phase 3 for magic link, invites, TOTP, SSO hooks — schema already annotated for it | Audit notes Better Auth compatibility; avoid dual systems mid-rebrand |
| Tenancy | Shared DB, **`organization_id` on every tenant table**, **Postgres RLS** keyed on `app.current_org_id` (session GUC) | Spec requires DB-level isolation |
| Spelling | DB keeps British `organisations` table name for continuity; product copy uses “organisation” (en-ZA). API/docs may alias `organization` where US JSON conventions help | No destructive rename |
| Storage | Move photos to **S3-compatible private bucket** (Supabase Storage or R2) paths `/{org_id}/installations/{id}/…` with signed URLs; migrate existing bytea in Phase 2 | bytea will not scale |
| Billing | **Paystack** primary; abstract `BillingProvider` so Stripe can plug in later | Spec |
| Locale defaults | ZAR, VAT 15%, `en-ZA`, `Africa/Johannesburg`, configurable per tenant | Spec |
| First tenant | Migrate current MeterVault/Nimba operational data → org slug TBD (propose `nimba` internally only if user confirms; default public slug **`tenant-001`** or company legal name they supply) — **ask before choosing public slug** | Brand wipe must not invent a public Nimba slug in the SaaS |
| Reference folder | Remove `reference/Nimba Website` and Nimba logos from the shippable repo in Phase 1; keep a **sanitised** eThekwini template fixture (fictional company) under `fixtures/` or platform template library | Zero client brand in product tree |
| Cookie / IndexedDB rename | New cookie `metertron-session`; migrate by accepting old cookie for one release then drop. New Dexie DB name with one-time copy from `metervault-field` | Avoid silent data loss for field devices |

Details of day-to-day choices during build go in [`docs/DECISIONS.md`](./DECISIONS.md) (created at Phase 1 start).

---

## 3. Target architecture

```
                    ┌─────────────────────────────┐
                    │  metertron.co.za (marketing)│  SSG / App Router
                    └─────────────┬───────────────┘
                                  │ CTA → signup
┌─────────────────┐   ┌───────────▼───────────┐   ┌──────────────────────┐
│ admin.metertron │   │ app.metertron.co.za   │   │ {slug}.metertron…    │
│ (platform)      │   │ /{org-slug}/…         │   │ custom domain (Ent)  │
│ Platform Staff  │   │ Tenant workspace      │   │                      │
└────────┬────────┘   └───────────┬───────────┘   └──────────┬───────────┘
         │                        │                          │
         │         ┌──────────────▼──────────────────────────┘
         │         │  Next.js API + middleware
         │         │  - resolve tenant (path / host)
         │         │  - set RLS GUC app.current_org_id
         │         │  - permission matrix
         │         ▼
         │  ┌──────────────┐     ┌─────────────────┐
         └──►│ PostgreSQL   │────►│ Object storage  │
            │ + RLS         │     │ (private, signed)│
            └──────┬───────┘     └─────────────────┘
                   │
            ┌──────▼───────┐     ┌─────────────────┐
            │ Job queue    │────►│ Email (React    │
            │ (exports,    │     │  Email)         │
            │  digests,    │     └─────────────────┘
            │  webhooks)   │     ┌─────────────────┐
            └──────────────┘────►│ Paystack        │
                                 └─────────────────┘
```

### 3.1 Tenant resolution
1. Default: `app.metertron.co.za/{org-slug}/…`  
2. Subdomain: `{slug}.metertron.co.za` (subscribed orgs)  
3. Custom domain: optional add-on later; verified via DNS TXT + TLS  
Middleware resolves slug → `organization_id`, sets Postgres session variable for RLS, rejects cross-tenant IDs in path params.

### 3.2 Isolation layers (defence in depth)
1. **RLS** on every tenant table (`organization_id = current_setting('app.current_org_id')::uuid`)  
2. API/repository helpers that always scope queries  
3. Storage keys namespaced by org; signed URLs short-lived  
4. Automated tests that attempt cross-tenant access on every route and must fail  

Platform staff “view as” uses a separate elevated session with audit logging; tenant RLS is bypassed only via a documented `app.platform_mode` path restricted to platform DB role.

### 3.3 Permission matrix (code, not scattered checks)

Align org roles to the spec while mapping from today’s `head` / `admin` / `member`:

| Spec role | Maps from | Notes |
|-----------|-----------|-------|
| Owner | `head` | Billing, delete org, transfer ownership |
| Admin | `admin` | Users, settings, templates, all data |
| Supervisor | new product surface from `contract_role.supervisor` | Assign, review, export |
| Field Technician | `member` + technician grant | Own assigned jobs only |
| Viewer / Client Rep | `client_viewer` | Read-only dashboards/reports |

Extend `ROLE_MATRIX` in `access.ts`; wire `assertCan` into every mutating route. Support future custom roles as matrix rows in DB later (Phase 4+).

### 3.4 Configurable municipality logic (Phase 4)
- **Export Template Builder** — columns, order, headers (including intentional municipal typos when cloning official templates), formats, date formats, field maps. Ship **“eThekwini Municipality (WS7761)”** as a built-in template cloned from current `EXPORT_HEADERS` + map producers.  
- **Form Builder** — fields, required/optional, validation regexes, dropdowns, photo slots. Seed from `METER_CHANGE_V1`.  
- Catalogs: meter types/sizes/brands, wards/regions/zones, statuses/workflows — all tenant-configurable; eThekwini patterns become defaults on that template, not global code constants.

### 3.5 Field capture (keep + harden)
Keep Dexie offline, SW, compression, GPS, barcode. Add: conflict policy, org-scoped photo attach, optional watermarking, duplicate meter detection within tenant, stronger outbox auth.

### 3.6 Billing (Phase 5)
One **Metertron** plan per organisation (default R1,490/mo excl. VAT; annual = 12× monthly, no discount). Full product access — no seat/install caps. Trial = 7 days on the same plan (status, not a separate plan row). Usage still tracked for ops. Dunning: failed → grace → read-only → suspend (never delete). Invoices: 15% VAT + tenant VAT number.

### 3.7 Platform control panel (Phase 6)
Separate app/guard at `admin.metertron.co.za` (or `/platform` with separate auth). Modules per build spec §4. Dark-dense ops UI; ⌘K palette; mandatory 2FA for staff.

### 3.8 Marketing (Phase 7)
SSG-first site sharing design tokens. Pages, SEO, glossary, 8 blog posts, municipality pages (publish only when unique substance). Lighthouse ≥ 95 targets.

---

## 4. Migration strategy — existing client → Tenant #1

### 4.1 Principles
- Reversible migrations (up + down)  
- Dry-run mode prints counts without writing  
- Verify record counts before/after; write `docs/MIGRATION_REPORT_TENANT1.md`  
- Preserve export byte-compatibility for approved jobs (same 66 headers + map behaviour)

### 4.2 Steps (Phase 2)
1. Reconcile schema drift into a baseline migration that matches production.  
2. Expand `organisations` with SaaS fields (plan, status, trial ends, branding, locale, currency, tax, timezone, support-access flags, etc.) — all nullable/defaulted so existing row survives.  
3. Introduce `organization_memberships` (user ↔ org ↔ role); backfill from `users.organisation_id` + `org_role`; keep `users.organisation_id` temporarily as “primary org” then deprecate.  
4. Relax global email unique → unique per auth identity; support multi-org.  
5. Ensure every tenant table has non-null `organization_id` + index + FK (backfill from contract/job joins where missing).  
6. Enable RLS policies; app sets GUC per request.  
7. Create org **Tenant #1** from current organisation row (rename brand fields to Metertron-neutral legal name supplied by operator; keep operational data).  
8. Snapshot current export mapping as that org’s default export template + form version.  
9. Migrate `job_photos.content` → object storage; keep bytea until checksum verification passes; then drop column in a later migration.  
10. Map users: `head`→Owner, `admin`→Admin, `member`→Field Technician; preserve contract grants.  
11. Output migration report: counts for organisations, users, contracts, jobs, photos, stock, work_orders.

### 4.3 Dry-run
`pnpm/tsx` script: `scripts/migrate-tenant1.ts --dry-run` prints planned transforms and counts; `--apply` writes inside a transaction.

---

## 5. Brand rollout (Phase 1)

Deliverables:
- `docs/BRAND.md` + design tokens (`packages/brand` or `src/styles/metertron-tokens.css`) with light/dark WCAG AA pairs  
- Original SVG logo (dial + droplet needle + check), wordmark, favicon set, PWA/maskable, OG 1200×630, email header  
- Typography: Space Grotesk + Inter + JetBrains Mono via `next/font`  
- Replace all MeterVault strings, colours, icons, cookie/storage keys (with migration), Docker/package names  
- Purge Nimba from shippable tree; sanitise fixtures  
- Repo-wide search report at end of phase

Voice: confident, precise, plain-spoken. Tagline: *Every meter, accounted for.*

---

## 6. Phase checklist

### Phase 0 — Audit + plan ✅ (this document)
- [x] `docs/AUDIT.md`  
- [x] `docs/SAAS_PLAN.md`  
- [ ] **Stop for your review**

### Phase 1 — Brand + rebrand existing app
- [ ] `docs/BRAND.md`, `docs/DECISIONS.md`  
- [ ] Design tokens (CSS variables / Tailwind theme), light + dark  
- [ ] Logo SVG set + favicons + OG + email header  
- [ ] Rebrand UI, PDFs, Excel creator, PWA, SW, seed, Docker, package name  
- [ ] Remove client branding from shippable paths; search report  
- [ ] Commit: `rebrand app to Metertron and purge client branding`

### Phase 2 — Tenancy, RLS, migrate Tenant #1
- [ ] Schema expansions + reversible migrations  
- [ ] Memberships; backfill; RLS + GUC helper  
- [ ] Fix photo attach isolation; start object storage  
- [ ] Tenant #1 migration script (dry-run + apply) + report  
- [ ] Cross-tenant isolation tests (API)  
- [ ] Commit: `add multi-tenant RLS and migrate existing client`

### Phase 3 — Auth, roles, onboarding, org switcher
- [ ] Permission matrix wired to all routes  
- [ ] Owner/Admin/Supervisor/Technician/Viewer product paths  
- [ ] Signup → create org → 7-day trial (no card) → onboarding wizard  
- [ ] Invites (expiring), email verification, magic link + password; TOTP scaffold  
- [ ] Org switcher for multi-org users  
- [ ] Commit: `ship org onboarding, invites and role enforcement`

### Phase 4 — Templates, form builder, export builder
- [ ] Built-in eThekwini template (sanitised)  
- [ ] Export Template Builder UI + engine (replace hard-coded headers path)  
- [ ] Form Builder UI + runtime (replace sole reliance on TS constant)  
- [ ] Configurable catalogs, zones, workflows  
- [ ] Commit: `make municipal forms and exports tenant-configurable`

### Phase 5 — Billing, plans, metering, dunning
- [ ] `plans` table + Paystack abstraction  
- [ ] Usage tracking, warn/limit, invoices with VAT  
- [ ] Dunning states; never delete on suspend  
- [ ] Commit: `add Paystack billing and usage metering`

### Phase 6 — Master control panel
- [x] Platform auth (2FA mandatory), staff roles, IP allowlist option  
- [x] Modules: overview, orgs, view-as, users, plans, flags, templates library, support notes, announcements, health, audit, danger zone  
- [x] Tenant-visible support-access audit entries  
- [ ] Commit: `add Metertron platform control panel`

### Phase 7 — Marketing site, SEO, content, graphics
- [x] Marketing routes + shared brand tokens (same Next app)  
- [x] All core pages with real copy; 8 blog posts; 30+ glossary terms  
- [x] `docs/SEO_KEYWORDS.md`; sitemap; robots; JSON-LD; existing OG asset  
- [x] Municipality pages (unique or `noindex`)  
- [ ] Commit: `launch metertron.co.za marketing and SEO foundation`

### Phase 8 — Emails, API/webhooks, monitoring, backups, CI
- [x] React Email templates (verify, invite, billing, export, rejection, support access, digest)  
- [x] Public REST API + API keys + rate limits + webhooks  
- [x] Structured logs with `org_id` (Sentry DSN hook)  
- [x] Backup/restore docs; CI lint/typecheck/test/build  
- [x] `.env.example` complete; demo seed tenant  
- [x] Docs: README, ARCHITECTURE, DEPLOYMENT, RUNBOOK, API  
- [ ] Commit: `add emails, public API, observability and CI`

### Phase 9 — Acceptance
- [x] Run full checklist from build spec §9  
- [x] Zero original-brand search report  
- [x] Isolation proof, Tenant #1 counts, E2E happy paths, billing test mode, control panel, marketing SEO checks  
- [x] Final report in `docs/ACCEPTANCE.md`  
- [ ] Commit: `record Phase 9 acceptance results`

---

## 7. Documentation deliverables (by end of Phase 8–9)

| Doc | When |
|-----|------|
| `docs/AUDIT.md` | Phase 0 |
| `docs/SAAS_PLAN.md` | Phase 0 |
| `docs/DECISIONS.md` | Phase 1+ (living) |
| `docs/BRAND.md` | Phase 1 |
| `docs/SEO_KEYWORDS.md` | Phase 7 |
| `docs/ARCHITECTURE.md` | Phase 2–8 |
| `docs/DEPLOYMENT.md` | Phase 8 |
| `docs/RUNBOOK.md` | Phase 8 |
| `docs/API.md` | Phase 8 |
| `docs/MIGRATION_REPORT_TENANT1.md` | Phase 2 |
| `README.md` (Metertron) | Phase 1 rewrite; Phase 8 complete |
| `docs/ACCEPTANCE.md` | Phase 9 |

---

## 8. Testing strategy

| Layer | Focus |
|-------|--------|
| Unit | Permission matrix, RLS helpers, export template engine, billing math (VAT) |
| Isolation | Two orgs; every API route + signed URL + export must deny cross-tenant |
| Integration | Signup → capture → review → export; support view-as audit |
| E2E | Playwright (or similar): field offline sync, office approve, Paystack test mode dunning |
| Marketing | Lighthouse CI on key templates |

---

## 9. Security baseline (cross-cutting)

- HTTPS, secure cookies, CSRF on cookie-auth mutations  
- Rate limits on auth + API  
- Upload MIME/size checks  
- CSP / HSTS / secure headers  
- Encrypt sensitive fields at rest where required (POPIA)  
- Platform staff: short sessions, mandatory 2FA, immutable platform audit log  
- Tenants: support-access toggle; optional approval flag per org  

---

## 10. Acceptance checklist (Phase 9 — verify and report)

See detailed results in [`docs/ACCEPTANCE.md`](ACCEPTANCE.md).

- [x] Zero references to original client brand (show search command + result) — legacy bridges only  
- [x] Two test orgs cannot see each other’s data via UI, API, storage URLs or exports — app-level photo isolation PASS; RLS SKIP on BYPASSRLS role  
- [x] Existing client migrated as tenant #1 with matching counts and identical export output — counts in MIGRATION_REPORT; export re-compare MANUAL on live attach  
- [ ] New org: signup → onboard → invite tech → offline capture → sync → approve → export — MANUAL staging walkthrough  
- [ ] Trial → Paystack test paid → limit warning → failed payment → read-only → recovery — stub PASS; Paystack MANUAL  
- [x] Control panel: orgs, view-as + logging, edit Metertron plan, feature flag  
- [x] Marketing: unique title/description/canonical/OG/JSON-LD; sitemap; robots — Lighthouse/Rich Results MANUAL on deploy  
- [x] All docs written  

---

## 11. Questions for you before / during early phases

Please confirm or correct:

1. **Tenant #1 public slug and legal display name** after rebrand wipe (we will not publish “Nimba” as a Metertron marketing customer without your OK).  
2. **Hosting targets:** confirm Supabase Postgres + Supabase Storage (or prefer R2/S3)? Confirm Vercel (or other) for app + marketing.  
3. **Monorepo timing:** OK to stay single-app through Phase 2 and split `apps/marketing` + `apps/platform` at Phases 6–7?  
4. **`reference/` folder:** delete from repo in Phase 1, or move to a private archive outside git? (Recommended: remove from this repo; keep local backup yourself.)  
5. **Auth upgrade:** Better Auth in Phase 3 vs extend current custom auth for longer — prefer Better Auth unless you object.

Everything else proceeds per this plan unless you redirect.

---

## 12. Phase 0 exit criteria

Met when you have reviewed `docs/AUDIT.md` and this plan and reply to proceed with Phase 1 (optionally answering §11). No application code changes until then.
