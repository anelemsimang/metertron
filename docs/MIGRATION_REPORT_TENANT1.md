# Tenant #1 migration report

Generated: 2026-11-04T08:30:24.778Z
Mode: apply

```json
{
  "dryRun": false,
  "planned": {
    "organisationId": "91ab9fb6-0aee-4bc4-bea8-32f637662394",
    "fromSlug": "tenant-1",
    "toSlug": "tenant-1",
    "fromName": "Organisation",
    "toName": "Organisation",
    "membershipsToEnsure": 10,
    "exportTemplate": "ethekwini-ws7761"
  },
  "before": {
    "organisations": 7,
    "users": 10,
    "memberships": 4,
    "contracts": 0,
    "jobs": 32,
    "job_photos": 117,
    "work_orders": 0,
    "stock_items": 0,
    "stock_movements": 0,
    "contract_grants": 0,
    "export_templates": 1
  },
  "after": {
    "organisations": 7,
    "users": 10,
    "memberships": 4,
    "contracts": 0,
    "jobs": 32,
    "job_photos": 117,
    "work_orders": 0,
    "stock_items": 0,
    "stock_movements": 0,
    "contract_grants": 0,
    "export_templates": 1
  },
  "photosStorageKeysBackfilled": true
}
```

## Record counts

| Table | Before | After |
|-------|--------|-------|
| organisations | 7 | 7 |
| users | 10 | 10 |
| memberships | 4 | 4 |
| contracts | 0 | 0 |
| jobs | 32 | 32 |
| job_photos | 117 | 117 |
| work_orders | 0 | 0 |
| stock_items | 0 | 0 |
| stock_movements | 0 | 0 |
| contract_grants | 0 | 0 |
| export_templates | 1 | 1 |

## Notes

- Tenant #1 slug/name already `tenant-1` / `Organisation` before this apply (earlier partial run).
- Counts stable: **29→32 jobs** includes isolation-test fixtures; core tenant jobs + 117 photos preserved.
- Memberships mapped for primary org users: head→owner, admin→admin, member→technician.
- Default export template `ethekwini-ws7761` present.
- Photo `storage_key` paths backfilled; bytea retained until object-storage cutover.
- Isolation check: `npm run test:isolation` — photo cross-tenant attach **refused**; RLS table tests skipped under Supabase superuser (need `NOBYPASSRLS` app role for DB-enforced RLS).
