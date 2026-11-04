"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  Building2,
  Command,
  Flag,
  LayoutDashboard,
  Library,
  NotebookPen,
  ScrollText,
  ShieldAlert,
  Users,
  CreditCard,
  Eye,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LogoMark, LogoWordmark } from "@/components/brand/logo";

const nav = [
  { href: "/platform", label: "Overview", icon: LayoutDashboard },
  { href: "/platform/orgs", label: "Organisations", icon: Building2 },
  { href: "/platform/users", label: "Users", icon: Users },
  { href: "/platform/plans", label: "Plan", icon: CreditCard },
  { href: "/platform/flags", label: "Flags", icon: Flag },
  { href: "/platform/templates", label: "Templates", icon: Library },
  { href: "/platform/announcements", label: "Announcements", icon: Bell },
  { href: "/platform/audit", label: "Audit", icon: ScrollText },
  { href: "/platform/health", label: "Health", icon: Activity },
  { href: "/platform/danger", label: "Danger zone", icon: ShieldAlert },
  { href: "/platform/staff", label: "Staff", icon: Eye },
];

export function PlatformShell({
  children,
  staff,
}: {
  children: ReactNode;
  staff: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return nav;
    return nav.filter((item) => item.label.toLowerCase().includes(q) || item.href.includes(q));
  }, [query]);

  async function logout() {
    await fetch("/api/platform/auth/logout", { method: "POST" });
    router.replace("/platform/login");
  }

  return (
    <div className="platform-root min-h-screen bg-[#0b1220] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-[#070d18] p-3 md:block">
          <div className="px-2 py-3">
            <span className="inline-flex items-center gap-2">
              <LogoMark className="h-8 w-8 shrink-0" mono="white" />
              <LogoWordmark className="text-white" />
            </span>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">Platform</p>
          </div>
          <nav className="mt-2 space-y-0.5">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/platform" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
                    active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400"
            >
              <Command size={12} />
              Jump to…
              <kbd className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>
                {staff.name} · {staff.role}
              </span>
              <button type="button" onClick={() => void logout()} className="rounded-md border border-white/10 px-2 py-1 hover:bg-white/5">
                Sign out
              </button>
            </div>
          </header>
          <main className="flex-1 px-4 py-5 md:px-6">{children}</main>
        </div>
      </div>

      {paletteOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh]" onClick={() => setPaletteOpen(false)}>
          <div className="w-full max-w-lg overflow-hidden rounded-lg border border-white/10 bg-[#0f172a] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-white/10 px-3">
              <NotebookPen size={14} className="text-slate-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Go to module…"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>
            <ul className="max-h-72 overflow-auto p-1">
              {filtered.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-white/10"
                    onClick={() => {
                      setPaletteOpen(false);
                      setQuery("");
                      router.push(item.href);
                    }}
                  >
                    <item.icon size={14} className="text-slate-500" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
