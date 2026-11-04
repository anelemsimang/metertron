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
| `--mt-grove` | `#0E3D24` | Primary dark, headers, logo plate |
| `--mt-leaf` | `#147A45` | Primary brand / CTA |
| `--mt-leaf-deep` | `#0F5C34` | Hover, links on light bg |
| `--mt-citrus` | `#F07A1A` | Accent, warnings, logo needle |
| `--mt-citrus-deep` | `#C45A08` | Accent hover |
| `--mt-mist` | `#E8F5EE` | Soft green tint, dial face |
| `--mt-fault` | `#D92D20` | Errors |
| `--mt-slate-50…900` | green-tinted neutrals | Surfaces, borders, body text |

Surfaces default to **white**; canvas is a light green-tinted off-white (`#F7FAF8`).

---

## Typography

| Role | Family | Loading |
|------|--------|---------|
| Headings / wordmark | Space Grotesk | `next/font` self-hosted |
| UI / body | Inter | `next/font` self-hosted |
| Meter numbers, serials, IDs | JetBrains Mono | `next/font` self-hosted |

---

## Logo

**Mark:** Deep green rounded square; white/mist dial face; **orange needle** as the brand accent; green confidence bar at the base. Readable at 16px.  
**Wordmark:** `metertron` lowercase, Space Grotesk medium, slightly tight tracking.

### Deliverables

| Asset | Path |
|-------|------|
| Mark SVG (component) | `src/components/brand/logo.tsx` |
| Mark / lockup SVGs | `public/brand/*.svg` |
| Favicon / PWA icons | `public/icons/*` |
| Icon generator | `scripts/render-brand-icons.mjs` |

---

## UI style

- Clean, data-dense, calm  
- Green CTAs, orange for attention/pending  
- 8px spacing grid; 10–12px radius  
- Subtle 1px borders over heavy shadows  
- Icons: Lucide

Platform UI always shows Metertron branding. Tenant logos appear on that tenant’s exports and reports only.
