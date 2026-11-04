# Metertron SEO keywords

Primary and secondary keyword ownership for metertron.co.za. Each URL should own **one primary** phrase; secondaries support internal links without cannibalisation.

## Core pages

| URL | Primary | Secondary (support only) |
|-----|---------|---------------------------|
| `/` | meter installation software South Africa | water meter change software, field to municipal export |
| `/product` | water meter change software | prepaid meter installation app, contractor field and office platform |
| `/pricing` | meter contractor software pricing | SaaS subscription water meters, 7-day trial |
| `/security` | meter contractor data security South Africa | POPIA contractor software, photo retention |
| `/about` | Metertron water meter software | South African meter contractor SaaS |
| `/contact` | contact meter installation software | demo trial metertron |
| `/blog` | meter installation operations blog | municipal export guides |
| `/glossary` | water meter installation glossary | CIU, municipal submission definitions |
| `/municipalities` | municipality meter submission guide | eThekwini export template |

## Feature pages (`/features/*`)

| URL | Primary | Secondary |
|-----|---------|-----------|
| `/features/field-capture-app` | water meter field capture app | structured install forms |
| `/features/offline-mode` | offline meter capture app | load shedding field sync |
| `/features/photo-evidence-gps` | meter install photo evidence GPS | audit photos contractors |
| `/features/review-approval-workflow` | meter job review approval software | office queue contractors |
| `/features/municipal-export-templates` | municipal meter Excel export templates | client spreadsheet mapping |
| `/features/dashboards-reporting` | meter install dashboards reporting | programme visibility |
| `/features/team-roles-permissions` | meter contractor team roles | org permissions invites |
| `/features/job-scheduling` | meter job scheduling software | work order dispatch |
| `/features/api-integrations` | meter installation API integrations | webhooks contractor systems |
| `/features/audit-trail` | meter programme audit trail | export traceability |

## Solution pages (`/solutions/*`)

| URL | Primary | Secondary |
|-----|---------|-----------|
| `/solutions/meter-installation-contractors` | meter installation contractor software | capture to export |
| `/solutions/plumbing-contractors` | plumbing contractor meter software | water meter installs |
| `/solutions/municipalities` | municipality meter programme software | implementing agent tooling |
| `/solutions/water-utilities` | water utility meter operations software | asset register updates |
| `/solutions/smart-prepaid-meter-rollouts` | smart prepaid meter rollout software | CIU commissioning |
| `/solutions/meter-replacement-programmes` | meter replacement programme software | bulk change outs |
| `/solutions/meter-audits` | meter audit verification software | sampling evidence |

## Compare pages (`/compare/*`)

| URL | Primary | Secondary |
|-----|---------|-----------|
| `/compare/metertron-vs-paper-job-cards` | paper job cards vs digital meter capture | retyping cost installs |
| `/compare/metertron-vs-spreadsheets` | spreadsheet only meter tracking | export template software |
| `/compare/metertron-vs-generic-field-service-apps` | generic field service vs meter software | municipal export fit |

## Blog (long-form)

| URL | Primary | Secondary |
|-----|---------|-----------|
| `/blog/how-to-run-water-meter-installation-programme` | run water meter installation programme | programme governance exports |
| `/blog/paper-job-cards-vs-digital-capture-cost` | paper job cards cost meter installs | digital capture ROI |
| `/blog/what-municipalities-look-for-in-submissions` | municipality meter submission requirements | rejected batch reasons |
| `/blog/photo-evidence-standards-water-meters` | water meter photo evidence standards | install audit photos |
| `/blog/offline-data-capture-low-signal` | offline meter data capture South Africa | load shedding field sync |
| `/blog/popia-contractors-municipal-customer-data` | POPIA meter contractors | customer data minimisation |
| `/blog/smart-prepaid-meter-rollouts-checklist` | smart prepaid meter rollout checklist | CIU commissioning |
| `/blog/reduce-rejected-meter-installation-submissions` | reduce rejected meter submissions | first time right exports |

## Glossary (sample — one primary term per slug)

Each `/glossary/{slug}` page owns the **term name** (e.g. `/glossary/ciu` → “CIU customer interface unit”). Do not target the same primary on `/product` or `/blog` unless the blog post is clearly informational and links to the glossary as canonical definition.

## Municipalities

| URL | Primary | Secondary |
|-----|---------|-----------|
| `/municipalities/ethekwini` | eThekwini meter submission export | Durban meter contractor Excel |
| `/municipalities/city-of-cape-town` | (noindex — do not target until ready) | — |
| `/municipalities/city-of-johannesburg` | (noindex — do not target until ready) | — |

## Cannibalisation rules

1. **Home vs product:** home = category + SA intent; product = feature depth and workflows.
2. **Blog vs glossary:** glossary owns definitions; blog owns how-to and programme advice.
3. **Features vs solutions:** features = capability; solutions = buyer persona / programme type.
4. **Compare vs blog:** compare owns “vs X”; blog links to compare, does not duplicate comparison tables.

## Technical

- Registry: `src/lib/marketing/routes.ts` · check: `npm run marketing:seo-check`
- `sitemap.xml`, `robots.txt`, `/og`, `/blog/rss.xml`, `/llms.txt`
- Set `NEXT_PUBLIC_SITE_URL=https://metertron.co.za` in production
