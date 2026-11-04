# Marketing content — live readiness

Sample testimonials, fake logos, fictional tenant mockups and fabricated KPI claims have been removed from the marketing site.

## Before paid ads / formal launch

- [ ] Legal counsel sign-off on draft pages (`/terms`, `/privacy`, `/popia`, `/dpa`, `/paia-manual`, `/cookies`, `/acceptable-use`, `/sla`) — remove draft banners after approval
- [ ] Confirm live Paystack/plan amounts match `/pricing` copy (`PRICING` in `src/lib/marketing/pricing.ts`)
- [ ] Set production env: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `MARKETING_LEADS_EMAIL`, analytics, Search Console / Bing verification
- [ ] Optional: `NEXT_PUBLIC_CALENDAR_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_STATUS_URL`
- [ ] Optional: add real customer logos/testimonials only with written permission
- [ ] Optional: design PDF for the field checklist (Markdown download is live today)
