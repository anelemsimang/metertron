"use client";

import { useState } from "react";
import {
  mkFormErrorClass,
  mkFormSuccessClass,
  mkInputClass,
  mkLabelClass,
} from "@/components/marketing/form-field-styles";

export function TemplatesLeadForm() {
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
      resource: data.get("resource"),
      popiaConsent: data.get("popiaConsent") === "on",
      website: data.get("website"),
    };

    try {
      const response = await fetch("/api/marketing/templates-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as {
        ok?: boolean;
        error?: string;
        downloadUrl?: string;
        downloads?: string[];
      };
      if (!response.ok || !body.ok) {
        setStatus("error");
        setError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      const files = body.downloads?.length ? body.downloads : body.downloadUrl ? [body.downloadUrl] : [];
      for (const file of files) {
        const link = document.createElement("a");
        link.href = file;
        link.download = "";
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      form.reset();
    } catch {
      setStatus("error");
      setError("Network error. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={mkFormSuccessClass}>
        Thanks — check your email for the download link. If nothing arrives, WhatsApp or call us via /contact.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label className={mkLabelClass} htmlFor="tpl-name">
          Full name
        </label>
        <input id="tpl-name" name="name" required className={mkInputClass} />
      </div>
      <div>
        <label className={mkLabelClass} htmlFor="tpl-email">
          Work email
        </label>
        <input id="tpl-email" name="email" type="email" required className={mkInputClass} />
      </div>
      <div>
        <label className={mkLabelClass} htmlFor="tpl-company">
          Company
        </label>
        <input id="tpl-company" name="company" required className={mkInputClass} />
      </div>
      <div>
        <label className={mkLabelClass} htmlFor="tpl-resource">
          Resource
        </label>
        <select id="tpl-resource" name="resource" className={mkInputClass} defaultValue="checklist">
          <option value="checklist">Meter installation checklist</option>
          <option value="export-sample">Blank municipal-style export headers (CSV)</option>
          <option value="both">Both</option>
        </select>
      </div>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="popiaConsent" required className="mt-1" />
        <span>I consent to Metertron contacting me about this download and related product information (POPIA).</span>
      </label>
      {error ? <p className={mkFormErrorClass}>{error}</p> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--mt-citrus-deep)] px-5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Email me the files"}
      </button>
    </form>
  );
}
