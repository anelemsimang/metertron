# Metertron marketing site plan

**Decision:** Stay in the existing single Next.js App Router app under `src/app/(marketing)` (not a separate `apps/marketing` package yet). Shared brand tokens live in `src/styles/tokens.css` + `src/lib/brand.ts`. App/office/platform routes are left alone aside from signup/login links.

**Product facts to honour in copy:** 7-day trial (not 14), one Metertron plan (R1,490/mo excl. VAT default), annual = 12 × monthly, no seat caps.

## 0. Inspection (done)

| Item | Finding |
|------|---------|
| Framework | Next.js 15 App Router, React 19, Tailwind 4, TypeScript |
| Monorepo | No — single app at repo root |
| Brand tokens | `src/styles/tokens.css` (`--mt-grove/leaf/citrus…`), Space Grotesk / Inter / JetBrains Mono |
| Logo | `public/brand/*`, `src/components/brand/logo.tsx` |
| Existing marketing | Expanded: core, features×10, solutions×7, municipalities×9, compare×3, blog×8, glossary×40, legal×8, company pages |

## Checklist

### Design system
- [x] Marketing CSS patterns (dial grid, flow lines, reduced-motion)
- [x] Navbar mega-menu + mobile drawer
- [x] Footer 4-col + legal + POPIA
- [x] Hero, LogoStrip, FeatureGrid, FeatureSplit, StepFlow, StatBand
- [x] PricingTable, FAQAccordion, CTA band, Breadcrumbs
- [x] BlogCard, AuthorBox, TOC, RelatedLinks, NewsletterSignup
- [x] ContactForm, DemoForm, CookieBanner, AnnouncementBar
- [x] SEO helpers + route registry + sitemap
- [x] `next/og` dynamic OG

### Graphics
- [x] Hero coded mockup (phone + laptop)
- [x] 12 feature spot illustrations (SVG)
- [x] How-it-works diagram
- [x] Before/after graphic
- [x] Section patterns in `public/images/marketing/`

### Core pages
- [x] `/`
- [x] `/product`
- [x] `/pricing`
- [x] `/demo`
- [x] `/contact`
- [x] `/about`
- [x] `/security`

### Features (`/features/*`)
- [x] field-capture-app
- [x] offline-mode
- [x] photo-evidence-gps
- [x] review-approval-workflow
- [x] municipal-export-templates
- [x] dashboards-reporting
- [x] team-roles-permissions
- [x] job-scheduling
- [x] api-integrations
- [x] audit-trail

### Solutions (`/solutions/*`)
- [x] meter-installation-contractors
- [x] plumbing-contractors
- [x] municipalities
- [x] water-utilities
- [x] smart-prepaid-meter-rollouts
- [x] meter-replacement-programmes
- [x] meter-audits

### Municipalities
- [x] hub `/municipalities`
- [x] ethekwini, johannesburg, cape-town, tshwane, ekurhuleni, nelson-mandela-bay, buffalo-city, mangaung, msunduzi

### Compare
- [x] metertron-vs-paper-job-cards
- [x] metertron-vs-spreadsheets
- [x] metertron-vs-generic-field-service-apps

### Resources
- [x] Blog index + 8 long articles
- [x] Glossary hub + 30+ terms
- [x] `/resources/templates`
- [x] `/guides/meter-installation-programme-guide`

### Company / legal
- [x] careers, partners, changelog, help, status
- [x] terms, privacy, popia, paia-manual, cookies, dpa, acceptable-use, sla
- [x] custom 404
- [x] RSS, llms.txt, cookie banner, forms API

### Docs / SEO
- [x] `docs/SEO_KEYWORDS.md` remapped
- [x] `docs/CONTENT_TODO.md`
- [x] `docs/DEPLOYMENT.md` marketing notes
- [x] Build-time link/meta checks script (`npm run marketing:seo-check`)

## Remaining polish (not blockers for first ship)

- [x] Removed fictional tenant mockups/testimonials/fake logos — live site uses product UI chrome + feature illustrations only
- [x] Wire GA4 / Plausible into marketing layout from env (consent-gated via cookie banner)
- [x] Multi-part sitemap index: `/sitemap.xml` → pages/features/solutions/municipalities/blog/glossary
- [~] Lighthouse mobile (dev/`next dev`): a11y ~96 after contrast fixes; SEO ~91–92 because streaming metadata is late in Turbopack HTML; performance not representative of production. Re-run on `next start` after a clean production build for the ≥95 gate.
- [x] Programme guide expanded to 3,000+ words (`guide.ts` ~3,110)
- [x] Redirects for hub/legacy paths in `next.config.ts`
- [x] Templates lead form returns downloadable sample files under `/public/downloads/`
- [x] Marketing form API typing aligned (`parseJsonBody` success discriminant)
- [x] Contrast polish: announcement bar leaf-deep, citrus-deep CTAs, brighter footer legal text

### Lighthouse snapshot (2026-11-04, `next start` production, after font trim)

| Page | Perf | A11y | BP | SEO |
|------|------|------|----|-----|
| `/` | 86 | 100 | 100 | 100 |
| feature | 86 | 100 | 100 | 100 |
| pricing | 83 | 100 | 96 | 100 |
| ethekwini | 91 | 100 | 100 | 100 |
| blog post | 87 | 100 | 100 | 100 |

A11y / SEO / Best Practices ≥95. Performance 83–91 on localhost (TBT from header/cookie hydration) — expect a further bump on CDN/edge; not yet ≥95. Script: `node scripts/lighthouse-marketing.mjs`.
