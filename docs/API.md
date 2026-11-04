# Metertron public API

Base path: `/api/v1`  
Auth: `Authorization: Bearer mt_live_…` or `X-Api-Key: mt_live_…`  
Rate limit: 120 requests / minute / key (`X-RateLimit-Remaining` response header).

Create keys in Manager (owner) via `POST /api/office/api-keys` — the raw secret is shown once.

## Endpoints

### `GET /api/v1/org`

Scope: `read:org`

Returns the organisation for the API key.

### `GET /api/v1/jobs`

Scope: `read:jobs`

Query:

| Param | Description |
|-------|-------------|
| `status` | Optional job status filter |
| `limit` | 1–100 (default 25) |

## Webhooks

Register HTTPS endpoints with `POST /api/office/webhooks`.

Events currently emitted:

- `job.approved`
- `job.rejected`

Payload shape:

```json
{
  "id": "…",
  "event": "job.approved",
  "created_at": "2026-11-04T12:00:00.000Z",
  "data": { "jobId": "…", "status": "approved", "decidedBy": "…" }
}
```

Headers:

- `X-Metertron-Event`
- `X-Metertron-Signature` — hex HMAC-SHA256 of the raw body using the endpoint secret
