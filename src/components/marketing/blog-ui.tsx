"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CtaPrimary } from "@/components/marketing/ui";

export function AuthorBox({ name, role }: { name: string; role: string }) {
  return (
    <div className="mt-10 flex items-center gap-4 rounded-xl border border-line bg-white p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mt-mist)] font-semibold text-[var(--mt-grove)]">
        {name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)}
      </div>
      <div>
        <p className="font-semibold text-[var(--mt-grove)]">{name}</p>
        <p className="text-sm text-muted">{role}</p>
      </div>
    </div>
  );
}

export function TableOfContents({ items }: { items: Array<{ id: string; label: string }> }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Table of contents" className="rounded-xl border border-line bg-[var(--mt-mist)]/40 p-5">
      <p className="text-sm font-semibold text-[var(--mt-grove)]">On this page</p>
      <ol className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-[var(--mt-leaf-deep)] hover:underline">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function BlogTrialPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("mt-blog-trial-dismissed") === "1") return;

    const onScroll = () => {
      const ratio = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
      if (ratio > 0.55) setVisible(true);
    };

    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) setVisible(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md rounded-xl border border-line bg-white p-4 shadow-lg md:left-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[var(--mt-grove)]">Try Metertron free for 7 days</p>
          <p className="mt-1 text-sm text-muted">Full product access for your organisation. No card to start.</p>
          <div className="mt-3">
            <CtaPrimary />
          </div>
        </div>
        <button
          type="button"
          className="text-sm text-muted hover:text-[var(--mt-grove)]"
          aria-label="Dismiss"
          onClick={() => {
            window.localStorage.setItem("mt-blog-trial-dismissed", "1");
            setVisible(false);
          }}
        >
          ✕
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">
        <Link href="/pricing" className="hover:underline">
          See pricing
        </Link>
      </p>
    </div>
  );
}
