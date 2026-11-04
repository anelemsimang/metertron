# Backups & restore

## Postgres (Supabase)

1. Enable daily backups in the Supabase project (Pro) or take logical dumps:

```bash
pg_dump "$DATABASE_URL" --format=custom --file=metertron-$(date +%F).dump
```

2. Restore (destructive — use a scratch database first):

```bash
pg_restore --clean --if-exists --no-owner --dbname "$RESTORE_DATABASE_URL" metertron-YYYY-MM-DD.dump
```

3. After restore, re-check RLS GUCs and platform staff TOTP still work.

## Object storage

If `STORAGE_DRIVER=fs`, back up the `STORAGE_ROOT` directory (default `.data/storage`) with the database snapshot so photo keys remain valid.

## Application config

Keep a private copy of production `.env` values (not in git). Rotate Paystack/Resend/platform secrets after any credential leak.

## Verification

After restore:

- Count organisations / jobs vs pre-restore notes
- Spot-check one approved job export
- Confirm a platform health check
