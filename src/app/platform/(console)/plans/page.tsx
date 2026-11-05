"use client";

import { useEffect, useState } from "react";
import { PlatformPanel, Stat } from "@/components/platform/panel";

type Plan = {
  key: string;
  name: string;
  description: string;
  amountMonthlyZarCents: number | null;
};

function zar(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

export default function PlatformPlansPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [trialDays, setTrialDays] = useState(7);
  const [annualZarCents, setAnnualZarCents] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amountMonthlyZarCents, setAmountMonthlyZarCents] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function load() {
    const response = await fetch("/api/platform/plans");
    const body = (await response.json()) as {
      plan?: Plan;
      trialDays?: number;
      annualZarCents?: number | null;
      error?: string;
    };
    if (!response.ok) {
      setError(body.error ?? "Failed to load plan.");
      return;
    }
    const next = body.plan ?? null;
    setPlan(next);
    setTrialDays(body.trialDays ?? 7);
    setAnnualZarCents(body.annualZarCents ?? null);
    if (next) {
      setName(next.name);
      setDescription(next.description);
      setAmountMonthlyZarCents(next.amountMonthlyZarCents ?? 0);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");
    const response = await fetch("/api/platform/plans", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, description, amountMonthlyZarCents }),
    });
    const body = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(body.error ?? "Save failed.");
      return;
    }
    setMessage("Metertron plan saved.");
    await load();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Plan</h1>
        <p className="mt-1 text-sm text-slate-400">
          One commercial subscription per organisation. Full product access; trial is {trialDays} days on the same product.
        </p>
      </div>

      {plan ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Monthly excl. VAT" value={plan.amountMonthlyZarCents != null ? zar(plan.amountMonthlyZarCents) : "—"} />
          <Stat label="Annual excl. VAT" value={annualZarCents != null ? zar(annualZarCents) : "—"} />
          <Stat label="Trial" value={`${trialDays} days`} />
        </div>
      ) : null}

      <PlatformPanel title="Metertron subscription">
        <ul className="mb-4 space-y-1 text-sm text-slate-400">
          <li>Key: <span className="font-mono text-slate-200">metertron</span></li>
          <li>No seat, install, or storage caps</li>
          <li>Internal catalog amounts only — not shown on the public site</li>
          <li>VAT applied if online checkout is re-enabled (default 15%)</li>
        </ul>
        <form onSubmit={(e) => void save(e)} className="grid max-w-xl gap-3 text-sm">
          <label>
            Display name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2 outline-none"
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-24 w-full rounded border border-white/10 bg-black/30 px-3 py-2 outline-none"
            />
          </label>
          <label>
            Monthly amount (ZAR cents excl. VAT)
            <input
              type="number"
              min={0}
              step={100}
              value={amountMonthlyZarCents}
              onChange={(e) => setAmountMonthlyZarCents(Number(e.target.value))}
              className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2 outline-none"
              required
            />
            <span className="mt-1 block text-xs text-slate-500">
              {zar(amountMonthlyZarCents)} / month · {zar(Math.round(amountMonthlyZarCents * 12))} / year
            </span>
          </label>
          <button
            type="submit"
            disabled={pending}
            className="w-fit rounded-md bg-emerald-600 px-3 py-2 font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save plan"}
          </button>
        </form>
      </PlatformPanel>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
    </div>
  );
}
