# Metertron brand identity

**Name:** Metertron  
**Tagline:** *Every meter, accounted for.*  
**Secondary:** Field-to-municipality meter installation software. · Capture. Verify. Submit.  
**Positioning:** The operating system for water meter installation crews — from the field photo to the municipal submission, with proof at every step.  
**Voice:** Confident, precise, plain-spoken. Short sentences. Technical where it earns trust. Speaks to operations managers and contractors.

---

## Colour tokens

Defined in `src/styles/tokens.css` as `--mt-*` (canonical) and mapped to semantic UI tokens (`--primary`, `--brand-text`, etc.).

| Token | Hex | Use |
|-------|-----|-----|
| `--mt-reservoir` | `#0B1F33` | Primary dark, headers, dark backgrounds |
| `--mt-flow` | `#00B4C8` | Primary brand / CTA |
| `--mt-flow-deep` | `#00849A` | Hover, links on light bg |
| `--mt-verified` | `#A8E63A` | Success, verified states, accents |
| `--mt-signal` | `#FFB020` | Warnings, pending |
| `--mt-fault` | `#E5484D` | Errors, failed validation |
| `--mt-slate-50…900` | neutral scale | Surfaces, borders, body text |

Light and dark themes both meet WCAG AA for body text pairs (see comments in `tokens.css`).

---

## Typography

| Role | Family | Loading |
|------|--------|---------|
| Headings / wordmark | Space Grotesk | `next/font` self-hosted |
| UI / body | Inter | `next/font` self-hosted |
| Meter numbers, serials, IDs | JetBrains Mono | `next/font` self-hosted |

---

## Logo

**Mark:** Circular meter dial; needle forms a water droplet; small check at the base (measured and verified). Readable at 16px.  
**Wordmark:** `metertron` lowercase, Space Grotesk medium, slightly tight tracking.

### Deliverables

| Asset | Path |
|-------|------|
| Mark SVG (component) | `src/components/brand/logo.tsx` |
| Mark / lockup SVGs | `public/brand/*.svg` |
| Favicon / PWA icons | `public/icons/*` |
| Apple touch | `public/icons/apple-touch-icon.png` |
| Splash | `public/splash.png` |
| OG default 1200×630 | `public/brand/og-default.png` |
| Email header | `public/brand/email-header.png` |
| Icon generator | `scripts/render-brand-icons.mjs` |

Variants: full horizontal lockup, stacked lockup, mark only, mono white, mono dark.

---

## UI style

- Clean, data-dense, calm  
- 8px spacing grid; 10–12px radius  
- Subtle 1px borders over heavy shadows  
- Status pills use token colours  
- Icons: Lucide (existing)

Platform UI always shows Metertron branding. Tenant logos appear on that tenant’s exports and reports only.
