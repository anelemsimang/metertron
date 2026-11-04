"use client";

import { useEffect, useState } from "react";
import { PlatformPanel } from "@/components/platform/panel";

type Flag = {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  organisationId: string | null;
};

export default function PlatformFlagsPage() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/platform/flags");
    const body = (await response.json()) as { flags?: Flag[]; error?: string };
    if (!response.ok) {
      setError(body.error ?? "Failed to load flags.");
      return;
    }
    setFlags(body.flags ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createFlag(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/platform/flags", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key, description, enabled: false }),
    });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Could not create flag.");
      return;
    }
    setKey("");
    setDescription("");
    await load();
  }

  async function toggle(flag: Flag) {
    await fetch("/api/platform/flags", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: flag.id, enabled: !flag.enabled }),
    });
    await load();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Feature flags</h1>
        <p className="mt-1 text-sm text-slate-400">Global toggles (org overrides supported via API organisationId).</p>
      </div>
      <PlatformPanel title="Create">
        <form onSubmit={(e) => void createFlag(e)} className="grid gap-2 text-sm sm:grid-cols-[1fr_2fr_auto]">
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="flag_key"
            className="rounded border border-white/10 bg-black/30 px-3 py-2 outline-none"
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="rounded border border-white/10 bg-black/30 px-3 py-2 outline-none"
          />
          <button type="submit" className="rounded-md bg-emerald-600 px-3 py-2 font-semibold text-white">
            Add
          </button>
        </form>
      </PlatformPanel>
      <PlatformPanel title="Flags">
        <ul className="divide-y divide-white/5 text-sm">
          {flags.map((flag) => (
            <li key={flag.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-mono font-medium">{flag.key}</p>
                <p className="text-xs text-slate-500">
                  {flag.description || "—"}
                  {flag.organisationId ? ` · org ${flag.organisationId.slice(0, 8)}` : " · global"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void toggle(flag)}
                className={`rounded px-2 py-1 text-xs font-semibold ${flag.enabled ? "bg-emerald-600 text-white" : "border border-white/10"}`}
              >
                {flag.enabled ? "On" : "Off"}
              </button>
            </li>
          ))}
          {flags.length === 0 ? <li className="py-2 text-slate-500">No flags yet.</li> : null}
        </ul>
      </PlatformPanel>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
