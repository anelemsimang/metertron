"use client";

import { useState } from "react";
import { PlatformPanel } from "@/components/platform/panel";

export default function PlatformDangerPage() {
  const [organisationId, setOrganisationId] = useState("");
  const [confirmSlug, setConfirmSlug] = useState("");
  const [action, setAction] = useState<"suspend" | "mark_deleted">("suspend");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function run(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    const response = await fetch("/api/platform/danger", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ organisationId, confirmSlug, action }),
    });
    const body = (await response.json()) as { error?: string; status?: string };
    if (!response.ok) {
      setError(body.error ?? "Action failed.");
      return;
    }
    setMessage(`Organisation set to ${body.status}. Data is retained.`);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-rose-300">Danger zone</h1>
        <p className="mt-1 text-sm text-slate-400">
          Suspend or mark organisations deleted. We never hard-delete tenant data from this panel.
        </p>
      </div>
      <PlatformPanel title="Destructive actions">
        <form onSubmit={(e) => void run(e)} className="space-y-3 text-sm">
          <label className="block">
            Organisation ID
            <input
              value={organisationId}
              onChange={(e) => setOrganisationId(e.target.value)}
              className="mt-1 w-full rounded border border-rose-500/30 bg-black/30 px-3 py-2 font-mono outline-none"
              required
            />
          </label>
          <label className="block">
            Confirm slug
            <input
              value={confirmSlug}
              onChange={(e) => setConfirmSlug(e.target.value)}
              className="mt-1 w-full rounded border border-rose-500/30 bg-black/30 px-3 py-2 font-mono outline-none"
              required
            />
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as "suspend" | "mark_deleted")}
            className="rounded border border-white/10 bg-black/30 px-3 py-2 outline-none"
          >
            <option value="suspend">Suspend</option>
            <option value="mark_deleted">Mark deleted</option>
          </select>
          <button type="submit" className="rounded-md bg-rose-600 px-3 py-2 font-semibold text-white">
            Execute
          </button>
        </form>
      </PlatformPanel>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
    </div>
  );
}
