# Phase 1 — Brand purge report

**Date:** 2026-11-04  
**Command:**

```bash
rg -n -i --glob '!node_modules/**' --glob '!.next/**' \
  'Nimba|nimba\.org|MeterVault|metervault|Metervault|#0A6B74|#C4892A|13 Ribbon Road' .
```

## Client brand (Nimba)

| Pattern | Result in shippable tree |
|---------|--------------------------|
| `Nimba` / `nimba.org` / `13 Ribbon Road` | **Zero hits** |
| `reference/` (website, logos, Excel, PDF) | **Deleted from repo** |

Historical mentions remain only in Phase 0 docs (`docs/AUDIT.md`, `docs/SAAS_PLAN.md`, `docs/DECISIONS.md`) as audit trail.

## Old product brand (MeterVault)

UI, PDFs, Excel creator, package name, Docker, PWA, favicons, and tokens are **Metertron**.

**Intentional temporary leftovers** (legacy migration bridges — remove in Phase 3):

| Location | Why |
|----------|-----|
| `src/lib/brand.ts` → `LEGACY_STORAGE` / `LEGACY_SESSION_COOKIE` | Read old localStorage, IndexedDB, cookie once |
| `src/app/layout.tsx` theme boot script | Migrates `metervault-theme` |
| `src/server/db/reference.ts` | Renames existing DB org row from MeterVault / `metervault` → Organisation / `tenant-1` |

## Colour purge

`#0A6B74` and `#C4892A` — **zero hits** in source (replaced by Metertron flow / verified / reservoir).

## Tests

`npm test` — 25/25 passed after rebrand.
