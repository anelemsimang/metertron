# Deployment

## Recommended

- **App:** Vercel (Next.js 15)
- **DB:** Supabase Postgres (prefer session pooler for RLS transactions)
- **Objects:** start with `STORAGE_DRIVER=fs` on a persistent volume, or migrate to Supabase Storage / S3
- **Email:** Resend (`RESEND_API_KEY`, `EMAIL_FROM`)
- **Payments:** Paystack live keys when leaving stub mode

## Environment

Copy `.env.example`. Required in production:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://metertron.co.za`)

Strongly recommended:

- `RESEND_API_KEY` / `EMAIL_FROM`
- `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY`
- Platform bootstrap then remove bootstrap secrets from the host env
- `PLATFORM_IP_ALLOWLIST` for staff access

## Migrations

SQL files in `drizzle/` are applied with:

```bash
npx tsx --env-file=.env scripts/apply-sql.ts drizzle/0009_phase8_api.sql
```

Apply in order for new environments (0000 → latest).

## Platform staff

```bash
npm run platform:bootstrap
```

Open `/platform/login` and complete TOTP setup.

## Domains (target)

| Host | App |
|------|-----|
| `metertron.co.za` | Marketing + tenant app |
| `admin.metertron.co.za` | Optional future split of `/platform` |

## Marketing site (metertron.co.za)

- Set **`NEXT_PUBLIC_SITE_URL=https://metertron.co.za`** so canonical URLs, `sitemap.xml`, Open Graph, and RSS use the public origin.
- Static assets: `/public/images/marketing/` (SVG patterns and spot art), `/public/llms.txt`, `/public/site.webmanifest` (icons under `/brand/*` and `/icons/*`).
- Dynamic OG images: `/og?title=…` (1200×630 via `src/app/og/route.tsx`).
- Post-deploy checks:
  - `npm run marketing:seo-check` (duplicate title/description guard)
  - Fetch `/sitemap.xml`, `/robots.txt`, `/blog/rss.xml`

### Analytics (optional)

Add when ready — keep keys in env, not in repo:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible (self-hosted or cloud) |

Wire scripts in the marketing layout only; avoid loading trackers on `/field` unless explicitly desired.

### Email and calendar (marketing contact)

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Transactional email (trial, invites, contact routing) |
| `EMAIL_FROM` | From address on `@metertron.co.za` |
| `NEXT_PUBLIC_CALENDAR_URL` | Optional Cal.com / Calendly embed on `/demo/thanks` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | E.164-ish number for contact click-to-chat |
| `NEXT_PUBLIC_STATUS_URL` | External status page linked from `/status` |
| `MARKETING_LEAD_TO` | Inbox for demo/contact/newsletter form notifications |

### Verification and status

| Variable | Purpose |
|----------|---------|
| `GOOGLE_SITE_VERIFICATION` | Search Console HTML meta (if used in root layout) |
| `NEXT_PUBLIC_STATUS_PAGE_URL` | Link to status/uptime page in footer |

### Search / AI discovery

- `public/llms.txt` — product summary for LLM crawlers
- `robots.txt` disallows app shells (`/office`, `/field`, `/platform`, `/api`)
