"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark, LogoWordmark } from "@/components/brand/logo";

const product = [
  { href: "/product", label: "Overview" },
  { href: "/features/field-capture-app", label: "Field capture" },
  { href: "/features/municipal-export-templates", label: "Municipal exports" },
  { href: "/features/review-approval-workflow", label: "Review workflow" },
  { href: "/pricing", label: "Pricing" },
];

const solutions = [
  { href: "/solutions/meter-installation-contractors", label: "Contractors" },
  { href: "/solutions/municipalities", label: "Municipalities" },
  { href: "/solutions/smart-prepaid-meter-rollouts", label: "Prepaid rollouts" },
  { href: "/municipalities", label: "Metro guides" },
];

const resources = [
  { href: "/blog", label: "Blog" },
  { href: "/glossary", label: "Glossary" },
  { href: "/guides/meter-installation-programme-guide", label: "Programme guide" },
  { href: "/resources/templates", label: "Templates" },
];

function Mega({
  label,
  items,
  open,
  onOpen,
  light,
}: {
  label: string;
  items: Array<{ href: string; label: string }>;
  open: string | null;
  onOpen: (v: string | null) => void;
  light: boolean;
}) {
  const active = open === label;
  return (
    <div className="relative" onMouseEnter={() => onOpen(label)} onMouseLeave={() => onOpen(null)}>
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-medium"
        aria-expanded={active}
        onClick={() => onOpen(active ? null : label)}
      >
        {label}
        <span aria-hidden className="text-xs opacity-70">
          ▾
        </span>
      </button>
      {active ? (
        <div
          className={`absolute left-0 top-full z-50 min-w-[220px] rounded-md border p-2 shadow-lg ${
            light ? "border-white/10 bg-[var(--mt-grove)]" : "border-line bg-white"
          }`}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2.5 text-sm ${
                light ? "text-white/90 hover:bg-white/10" : "text-[var(--mt-grove)] hover:bg-[var(--mt-mist)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const onHero = pathname === "/";
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setDrawer(false);
    setOpen(null);
  }, [pathname]);

  useEffect(() => {
    if (!drawer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawer]);

  const text = onHero ? "text-white" : "text-[var(--mt-grove)]";
  const bar = onHero
    ? "bg-[var(--mt-reservoir)]/95 text-white backdrop-blur"
    : "border-b border-line bg-[var(--mt-slate-50)]/95 text-[var(--mt-grove)] backdrop-blur";

  return (
    <header className={`relative z-30 ${bar}`}>
      <div className="mk-container flex items-center justify-between gap-3 py-3 sm:gap-4 sm:py-4">
        <Link href="/" className={`inline-flex min-w-0 items-center gap-2 ${text}`}>
          <LogoMark className="h-8 w-8 shrink-0" mono={onHero ? "white" : "dark"} />
          <LogoWordmark className={onHero ? "text-white" : "text-[var(--mt-grove)]"} />
        </Link>

        <nav
          className={`hidden items-center gap-5 lg:flex ${onHero ? "text-white/90" : "text-[var(--mt-slate-700)]"}`}
          aria-label="Primary"
        >
          <Mega label="Product" items={product} open={open} onOpen={setOpen} light={onHero} />
          <Mega label="Solutions" items={solutions} open={open} onOpen={setOpen} light={onHero} />
          <Mega label="Resources" items={resources} open={open} onOpen={setOpen} light={onHero} />
          <Link href="/security" className="text-sm font-medium">
            Security
          </Link>
          <Link href="/pricing" className="text-sm font-medium">
            Pricing
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/login"
            className={`hidden min-h-11 items-center rounded-md px-3 py-2 text-sm font-semibold sm:inline-flex ${
              onHero ? "text-white/90 hover:bg-white/10" : "text-[var(--mt-grove)] hover:bg-[var(--mt-mist)]"
            }`}
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center rounded-md bg-[var(--mt-citrus-deep)] px-3 text-sm font-semibold text-white hover:brightness-110 sm:px-3.5"
          >
            <span className="sm:hidden">Trial</span>
            <span className="hidden sm:inline">Start free trial</span>
          </Link>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md border lg:hidden ${
              onHero ? "border-white/25 text-white" : "border-line text-[var(--mt-grove)]"
            }`}
            aria-label={drawer ? "Close menu" : "Open menu"}
            aria-expanded={drawer}
            onClick={() => setDrawer((v) => !v)}
          >
            {drawer ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[var(--mt-grove)] lg:hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <Link href="/" className="inline-flex items-center gap-2 text-white" onClick={() => setDrawer(false)}>
              <LogoMark className="h-8 w-8" mono="white" />
              <LogoWordmark className="text-white" />
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/25 text-white"
              aria-label="Close menu"
              onClick={() => setDrawer(false)}
            >
              ✕
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4 pb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Product</p>
            {product.map((item) => (
              <Link key={item.href} href={item.href} className="block min-h-11 py-2.5 text-base text-white">
                {item.label}
              </Link>
            ))}
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Solutions</p>
            {solutions.map((item) => (
              <Link key={item.href} href={item.href} className="block min-h-11 py-2.5 text-base text-white">
                {item.label}
              </Link>
            ))}
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Resources</p>
            {resources.map((item) => (
              <Link key={item.href} href={item.href} className="block min-h-11 py-2.5 text-base text-white">
                {item.label}
              </Link>
            ))}
            <div className="mt-4 space-y-1 border-t border-white/15 pt-4">
              <Link href="/security" className="block min-h-11 py-2.5 text-base text-white">
                Security
              </Link>
              <Link href="/pricing" className="block min-h-11 py-2.5 text-base text-white">
                Pricing
              </Link>
              <Link href="/demo" className="block min-h-11 py-2.5 text-base text-white">
                Book a demo
              </Link>
              <Link href="/login" className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[var(--mt-citrus-deep)] px-4 text-sm font-semibold text-white">
                Start free trial
              </Link>
              <Link href="/login" className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-md border border-white/25 px-4 text-sm font-semibold text-white">
                Log in
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
