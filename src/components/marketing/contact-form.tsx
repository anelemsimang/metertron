"use client";

import { useState } from "react";
import Link from "next/link";
import {
  mkFormErrorClass,
  mkFormSuccessClass,
  mkInputClass,
  mkLabelClass,
} from "@/components/marketing/form-field-styles";

export function ContactForm() {
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
      email: data.get("email"),
      company: data.get("company"),
      topic: data.get("topic"),
      message: data.get("message"),
      popiaConsent: data.get("popiaConsent") === "on",
      website: data.get("website"),
    };

    try {
      const response = await fetch("/api/marketing/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) {
        setStatus("error");
        setError(body.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Network error. Try again, or WhatsApp / call us via /contact.");
    }
  }

  if (status === "success") {
    return (
      <div className={mkFormSuccessClass}>
        Message received. We typically reply within one business day (South African time).
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={mkLabelClass} htmlFor="contact-name">
            Name
          </label>
          <input id="contact-name" name="name" required className={mkInputClass} />
        </div>
        <div>
          <label className={mkLabelClass} htmlFor="contact-email">
            Email
          </label>
          <input id="contact-email" name="email" type="email" required className={mkInputClass} />
        </div>
        <div>
          <label className={mkLabelClass} htmlFor="contact-company">
            Organisation (optional)
          </label>
          <input id="contact-company" name="company" className={mkInputClass} />
        </div>
        <div>
          <label className={mkLabelClass} htmlFor="contact-topic">
            Topic
          </label>
          <select id="contact-topic" name="topic" required className={mkInputClass} defaultValue="sales">
            <option value="sales">Sales / trial</option>
            <option value="support">Support (existing customer)</option>
            <option value="partners">Partnerships</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className={mkLabelClass} htmlFor="contact-message">
          Message
        </label>
        <textarea id="contact-message" name="message" required rows={5} className={mkInputClass} />
      </div>
      <label className="flex gap-3 text-sm text-muted">
        <input name="popiaConsent" type="checkbox" required className="mt-1" />
        <span>
          I agree to the processing of this enquiry under POPIA. See our{" "}
          <Link href="/privacy" className="text-[var(--mt-leaf-deep)] hover:underline">
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
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
