"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "metertron-cookie-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function choose(value: "essential" | "all") {
    try {
      localStorage.setItem(KEY, value);
      window.dispatchEvent(new Event("metertron-consent"));
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="mk-container flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-sm text-muted">
          We use essential cookies to run Metertron and optional analytics cookies if you allow them. Read our{" "}
          <Link href="/cookies" className="text-[var(--mt-leaf-deep)] underline">
            cookie notice
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[var(--mt-leaf-deep)] underline">
            privacy notice
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => choose("essential")} className="rounded-md border border-line px-3 py-2 text-sm font-semibold">
            Essential only
          </button>
          <button type="button" onClick={() => choose("all")} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-on-primary">
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
