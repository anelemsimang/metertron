# Runbook

## Health checks

- Marketing `/` returns 200
- `/api/platform/health` (staff session) — DB latency + counts
- Tenant login `/login` → `/office` or `/field`

## Common incidents

### Database connection errors

1. Confirm `DATABASE_URL` (pooler host, password, SSL).
2. Prefer session mode if RLS transactions hang on transaction pooler.
3. Restart the app to clear stale pools (`max: 1` client).

### Emails not arriving

1. Without `RESEND_API_KEY`, emails are stubbed to logs (`email.stub`).
2. With Resend, check `email.send_failed` logs and domain DNS.

### Billing webhook failures

1. Confirm `/api/billing/webhook` is reachable.
2. Stub mode never hits Paystack — set secret keys for live/test Paystack.
3. Inspect `billing_events` table.

### Support access complaint

1. Tenant Team page lists `support_access_events`.
2. Platform audit lists `support.view_as.start/end`.
3. End sessions from the amber banner or platform org page.

### Suspended org

1. Status `suspended` / `readonly` / `past_due` is intentional dunning.
2. Recover via paid invoice webhook/verify or platform org status tools.
3. Do **not** delete rows to “fix”.

## Backups

See [`docs/BACKUPS.md`](BACKUPS.md).
