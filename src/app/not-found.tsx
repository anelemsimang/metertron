import Link from "next/link";
import { MkContainer } from "@/components/marketing/ui";

const POPULAR = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/glossary", label: "Glossary" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Sign in / trial" },
] as const;

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-canvas pt-24">
      <MkContainer className="py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--mt-leaf)]">404</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-[-0.03em] text-[var(--mt-grove)] md:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          That link may be outdated or mistyped. Try one of these popular Metertron pages, or head back to the marketing site home.
        </p>
        <ul className="mt-10 flex flex-wrap gap-3">
          {POPULAR.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold text-[var(--mt-grove)] hover:border-[var(--mt-leaf)] hover:text-[var(--mt-leaf-deep)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </MkContainer>
    </main>
  );
}
