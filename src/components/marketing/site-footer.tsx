import Link from "next/link";
import { LogoMark, LogoWordmark } from "@/components/brand/logo";
import { SITE } from "@/lib/marketing/site";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Overview" },
      { href: "/pricing", label: "Pricing" },
      { href: "/features/field-capture-app", label: "Field capture" },
      { href: "/security", label: "Security" },
      { href: "/demo", label: "Book a demo" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions/meter-installation-contractors", label: "Contractors" },
      { href: "/solutions/municipalities", label: "Municipalities" },
      { href: "/municipalities", label: "Metro guides" },
      { href: "/solutions/plumbing-contractors", label: "Plumbing contractors" },
      { href: "/solutions/water-utilities", label: "Water utilities" },
      { href: "/solutions/smart-prepaid-meter-rollouts", label: "Smart prepaid" },
      { href: "/solutions/meter-replacement-programmes", label: "Replacements" },
      { href: "/solutions/meter-audits", label: "Meter audits" },
      { href: "/compare/metertron-vs-spreadsheets", label: "Vs spreadsheets" },
      { href: "/compare/metertron-vs-paper-job-cards", label: "Vs paper cards" },
      { href: "/compare/metertron-vs-generic-field-service-apps", label: "Vs generic FSM" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/glossary", label: "Glossary" },
      { href: "/guides/meter-installation-programme-guide", label: "Programme guide" },
      { href: "/resources/templates", label: "Templates" },
      { href: "/help", label: "Help" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/careers", label: "Careers" },
      { href: "/partners", label: "Partners" },
      { href: "/changelog", label: "Changelog" },
      { href: "/status", label: "Status" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--mt-grove)]/15 bg-[var(--mt-grove)] text-white">
      <div className="mk-container grid gap-10 py-14 md:grid-cols-[1.2fr_repeat(4,1fr)]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <LogoMark className="h-8 w-8" mono="white" />
            <LogoWordmark className="text-white" />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/70">{SITE.tagline}</p>
          <ul className="mt-4 space-y-1.5 text-sm text-white/70">
            {SITE.phones.map((person) => (
              <li key={person.tel}>
                <a className="hover:text-white" href={`tel:${person.tel}`}>
                  {person.name} · {person.display}
                </a>
              </li>
            ))}
          </ul>
          {SITE.whatsappUrl ? (
            <p className="mt-3 text-sm">
              <a className="text-[#25D366] hover:brightness-110" href={SITE.whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp {SITE.whatsappName}
              </a>
            </p>
          ) : null}
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">{column.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mk-container flex flex-col gap-3 py-4 text-xs text-white/75 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. Built for South African meter installation teams.</p>
          <div className="flex flex-wrap gap-3 text-white/80">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/popia">POPIA</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/paia-manual">PAIA</Link>
            <Link href="/dpa">DPA</Link>
            <Link href="/acceptable-use">Acceptable use</Link>
            <Link href="/sla">SLA</Link>
          </div>
        </div>
        <p className="mk-container pb-5 text-[11px] text-white/70">
          We process personal information in line with POPIA. See our privacy notice and PAIA manual for details.
        </p>
      </div>
    </footer>
  );
}
