import type { ReactNode } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/marketing/json-ld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/marketing/seo";

export function MkContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mk-container ${className}`}>{children}</div>;
}

export function MkSection({
  children,
  className = "",
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "mist" | "dark";
}) {
  const toneClass =
    tone === "dark" ? "mk-reservoir text-white" : tone === "mist" ? "bg-[var(--mt-mist)]/50" : "bg-[var(--mt-slate-50)]";
  return <section className={`py-16 md:py-24 ${toneClass} ${className}`}>{children}</section>;
}

export function MkEyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--mt-leaf)]">{children}</p>;
}

export function MkH1({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <h1
      className={`mt-3 max-w-4xl font-[family-name:var(--font-display)] text-[2rem] font-medium leading-tight tracking-[-0.03em] sm:text-4xl md:text-5xl lg:text-6xl ${
        light ? "text-white" : "text-[var(--mt-grove)]"
      }`}
    >
      {children}
    </h1>
  );
}

export function MkH2({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <h2
      className={`font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] md:text-4xl ${
        light ? "text-white" : "text-[var(--mt-grove)]"
      }`}
    >
      {children}
    </h2>
  );
}

export function MkLead({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`mt-4 max-w-2xl text-lg ${light ? "text-white/75" : "text-muted"}`}>{children}</p>;
}

export function CtaPrimary({ href = "/login", children = "Start free trial" }: { href?: string; children?: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--mt-citrus-deep)] px-5 text-sm font-semibold text-white hover:brightness-110"
    >
      {children}
    </Link>
  );
}

export function CtaSecondary({ href = "/demo", children = "Book a demo", light = false }: { href?: string; children?: ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-md border px-5 text-sm font-semibold ${
        light ? "border-white/30 text-white hover:bg-white/10" : "border-line text-[var(--mt-grove)] hover:bg-[var(--mt-mist)]"
      }`}
    >
      {children}
    </Link>
  );
}

export function CtaBand({
  title = "Ready to account for every meter?",
  body = "Start a 7-day trial — full product access for your organisation. No card required to begin.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <MkSection tone="dark" className="mk-flow-lines">
      <MkContainer className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <MkH2 light>{title}</MkH2>
          <p className="mt-3 max-w-xl text-white/75">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CtaPrimary />
          <CtaSecondary light />
        </div>
      </MkContainer>
    </MkSection>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li key={item.path} className="inline-flex items-center gap-2">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {index === items.length - 1 ? (
                <span className="text-[var(--mt-grove)]">{item.name}</span>
              ) : (
                <Link href={item.path} className="hover:text-[var(--mt-leaf-deep)]">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function FaqAccordion({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((faq) => (
          <details key={faq.q} className="group py-4">
            <summary className="cursor-pointer list-none font-[family-name:var(--font-display)] text-lg font-medium text-[var(--mt-grove)] marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {faq.q}
                <span className="text-[var(--mt-leaf)] transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-muted">{faq.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}

export function RelatedLinks({ title = "Related", links }: { title?: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--mt-grove)]">{title}</h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-[var(--mt-leaf-deep)] hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
