"use client";

import { useState } from "react";
import Link from "next/link";
import {
  mkFormErrorClass,
  mkFormSuccessClass,
  mkInputClass,
  mkLabelClass,
} from "@/components/marketing/form-field-styles";

type DemoFormProps = {
  redirectThanks?: boolean;
};

export function DemoForm({ redirectThanks = true }: DemoFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      company: data.get("company"),
      role: data.get("role"),
      teamSize: data.get("teamSize"),
      municipality: data.get("municipality"),
      phone: data.get("phone"),
      email: data.get("email"),
      message: data.get("message"),
      popiaConsent: data.get("popiaConsent") === "on",
      website: data.get("website"),
    };

    try {
      const response = await fetch("/api/marketing/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) {
        setStatus("error");
        setError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      if (redirectThanks) {
        window.location.href = "/demo/thanks";
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Network error. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={mkFormSuccessClass}>
        Thank you — we will be in touch shortly. You can also email hello@metertron.co.za.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={mkLabelClass} htmlFor="demo-name">
            Full name
          </label>
          <input id="demo-name" name="name" required className={mkInputClass} />
        </div>
        <div>
          <label className={mkLabelClass} htmlFor="demo-email">
            Work email
          </label>
          <input id="demo-email" name="email" type="email" required className={mkInputClass} />
        </div>
        <div>
          <label className={mkLabelClass} htmlFor="demo-company">
            Company
          </label>
          <input id="demo-company" name="company" required className={mkInputClass} />
        </div>
        <div>
          <label className={mkLabelClass} htmlFor="demo-role">
            Your role
          </label>
          <input id="demo-role" name="role" required placeholder="e.g. Operations manager" className={mkInputClass} />
        </div>
        <div>
          <label className={mkLabelClass} htmlFor="demo-team">
            Field team size
          </label>
          <select id="demo-team" name="teamSize" required className={mkInputClass} defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            <option value="1-5">1–5 installers</option>
            <option value="6-15">6–15</option>
            <option value="16-40">16–40</option>
            <option value="40+">40+</option>
          </select>
        </div>
        <div>
          <label className={mkLabelClass} htmlFor="demo-municipality">
            Primary municipality / client
          </label>
          <input id="demo-municipality" name="municipality" className={mkInputClass} placeholder="e.g. eThekwini" />
        </div>
        <div className="md:col-span-2">
          <label className={mkLabelClass} htmlFor="demo-phone">
            Phone (optional)
          </label>
          <input id="demo-phone" name="phone" type="tel" className={mkInputClass} placeholder="+27 …" />
        </div>
      </div>
      <div>
        <label className={mkLabelClass} htmlFor="demo-message">
          What should we cover?
        </label>
        <textarea id="demo-message" name="message" rows={4} className={mkInputClass} placeholder="Exports, stock, review workflow…" />
      </div>
      <label className="flex gap-3 text-sm text-muted">
        <input name="popiaConsent" type="checkbox" required className="mt-1" />
        <span>
          I consent to Metertron processing my details to schedule a demo, in line with the{" "}
          <Link href="/privacy" className="text-[var(--mt-leaf-deep)] underline-offset-2 hover:underline">
            privacy policy
          </Link>
          .
        </span>
      </label>
      {status === "error" && error ? <div className={mkFormErrorClass}>{error}</div> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 items-center rounded-md bg-[var(--mt-citrus)] px-5 text-sm font-semibold text-white hover:bg-[var(--mt-citrus-deep)] disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Request demo"}
      </button>
    </form>
  );
}
