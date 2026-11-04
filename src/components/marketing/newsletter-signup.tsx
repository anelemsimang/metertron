"use client";

import { useState } from "react";
import Link from "next/link";
import { mkFormErrorClass, mkInputClass } from "@/components/marketing/form-field-styles";

type NewsletterSignupProps = {
  variant?: "footer" | "inline";
};

export function NewsletterSignup({ variant = "inline" }: NewsletterSignupProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/marketing/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          popiaConsent: data.get("popiaConsent") === "on",
          website: data.get("website"),
        }),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) {
        setStatus("error");
        setError(body.error ?? "Could not subscribe.");
        return;
      }
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
      setError("Network error.");
    }
  }

  const isFooter = variant === "footer";
  const inputClass = isFooter
    ? "min-h-10 flex-1 rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40"
    : mkInputClass;

  return (
    <div className={isFooter ? "mt-5 max-w-sm" : ""}>
      <form onSubmit={onSubmit} className={isFooter ? "flex flex-col gap-2" : "space-y-3"}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className={isFooter ? "flex gap-2" : ""}>
          <label className="sr-only" htmlFor={`newsletter-email-${variant}`}>
            Email
          </label>
          <input
            id={`newsletter-email-${variant}`}
            name="email"
            type="email"
            required
            placeholder="Work email"
            className={inputClass}
          />
          {isFooter ? (
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-md bg-[var(--mt-citrus-deep)] px-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {status === "loading" ? "…" : "Join"}
            </button>
          ) : null}
        </div>
        {!isFooter ? (
          <label className="flex gap-2 text-sm text-muted">
            <input name="popiaConsent" type="checkbox" required className="mt-1" />
            <span>
              Product updates only.{" "}
              <Link href="/privacy" className="text-[var(--mt-leaf-deep)] hover:underline">
                Privacy
              </Link>
            </span>
          </label>
        ) : (
          <label className="flex items-start gap-2 text-[11px] text-white/75">
            <input name="popiaConsent" type="checkbox" required className="mt-0.5" />
            <span>
              POPIA consent.{" "}
              <Link href="/privacy" className="underline-offset-2 hover:underline">
                Privacy
              </Link>
            </span>
          </label>
        )}
        {!isFooter ? (
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex min-h-10 items-center rounded-md bg-[var(--mt-citrus-deep)] px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            Subscribe
          </button>
        ) : null}
      </form>
      {status === "done" ? <p className={`mt-2 text-xs ${isFooter ? "text-white/60" : "text-[var(--mt-leaf)]"}`}>You are on the list.</p> : null}
      {status === "error" && error ? <p className={`mt-2 text-xs ${isFooter ? "text-red-300" : mkFormErrorClass}`}>{error}</p> : null}
    </div>
  );
}
