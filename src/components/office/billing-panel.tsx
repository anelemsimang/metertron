"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = {
  key: string;
  name: string;
  description: string;
  amountMonthlyZarCents: number | null;
};

type Overview = {
  organisation: {
    status: string;
    planKey: string;
    trialEndsAt: string | null;
  };
  subscription: { status: string; interval: string; currentPeriodEnd: string | null; graceEndsAt: string | null } | null;
  plan: Plan | null;
  invoices: Array<{
    id: string;
    number: string;
    status: string;
    totalZarCents: number;
    vatZarCents: number;
    paidAt: string | null;
  }>;
};

type Usage = {
  seatsUsed: number;
  installsCount: number;
  storageBytes: number;
};

function zar(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

function bytesLabel(value: number) {
  if (value >= 1_073_741_824) return `${(value / 1_073_741_824).toFixed(1)} GB`;
  return `${Math.round(value / 1_048_576)} MB`;
}

export function BillingPanel() {
  const router = useRouter();
  const params = useSearchParams();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [provider, setProvider] = useState("stub");
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function load() {
    const response = await fetch("/api/office/billing");
    const body = (await response.json()) as { overview?: Overview; usage?: Usage; provider?: string; error?: string };
    if (!response.ok) {
      setError(body.error ?? "Could not load billing.");
      return;
    }
    setOverview(body.overview ?? null);
    setUsage(body.usage ?? null);
    setProvider(body.provider ?? "stub");
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const paid = params.get("paid");
    const reference = params.get("reference");
    const iv = params.get("interval") === "annual" ? "annual" : "monthly";
    if (paid === "1" && reference) {
      void (async () => {
        setPending(true);
        await fetch("/api/office/billing", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "verify", reference, interval: iv }),
        });
        setPending(false);
        router.replace("/office/billing");
        await load();
      })();
    }
  }, [params, router]);

  async function subscribe() {
    setPending(true);
    setError("");
    const response = await fetch("/api/office/billing", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "checkout", interval }),
    });
    const body = (await response.json()) as { error?: string; checkout?: { authorizationUrl: string } };
    setPending(false);
    if (!response.ok || !body.checkout) {
      setError(body.error ?? "Could not start checkout.");
      return;
    }
    window.location.assign(body.checkout.authorizationUrl);
  }

  if (!overview) {
    return <p className="text-sm text-muted">{error || "Loading billing…"}</p>;
  }

  const monthly = overview.plan?.amountMonthlyZarCents ?? 0;
  const amount = interval === "annual" ? monthly * 12 : monthly;
  const subscribed = overview.organisation.status === "active" && overview.subscription?.status === "active";

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-line bg-surface p-4 shadow-sm">
        <p className="text-sm text-muted">Organisation status</p>
        <p className="mt-1 text-xl font-semibold capitalize">{overview.organisation.status.replace("_", " ")}</p>
        <p className="mt-2 text-sm text-muted">
          Metertron subscription
          {overview.organisation.trialEndsAt && overview.organisation.status === "trialing"
            ? ` · trial ends ${new Date(overview.organisation.trialEndsAt).toLocaleDateString("en-ZA")}`
            : null}
          {overview.subscription?.currentPeriodEnd && subscribed
            ? ` · renews ${new Date(overview.subscription.currentPeriodEnd).toLocaleDateString("en-ZA")}`
            : null}
          {overview.subscription?.graceEndsAt
            ? ` · grace until ${new Date(overview.subscription.graceEndsAt).toLocaleDateString("en-ZA")}`
            : null}
        </p>
        <p className="mt-2 text-xs text-muted">
          Checkout: {provider === "stub" ? "local stub (set PAYSTACK_SECRET_KEY for Paystack)" : "Paystack"}
        </p>
      </section>

      <section className="rounded-lg border border-line bg-surface p-5 shadow-sm">
        <h2 className="text-lg font-semibold">{overview.plan?.name ?? "Metertron"}</h2>
        <p className="mt-1 text-sm text-muted">{overview.plan?.description}</p>
        <p className="mt-3 text-sm font-semibold text-brand">Full product access for this organisation</p>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>Field capture, review, exports, templates, forms, team, and stock</li>
          <li>No seat or install caps on this plan</li>
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex rounded-md bg-canvas p-1 text-sm font-semibold">
            <button type="button" onClick={() => setInterval("monthly")} className={`min-h-10 rounded-md px-3 ${interval === "monthly" ? "bg-surface shadow-sm" : "text-muted"}`}>
              Monthly
            </button>
            <button type="button" onClick={() => setInterval("annual")} className={`min-h-10 rounded-md px-3 ${interval === "annual" ? "bg-surface shadow-sm" : "text-muted"}`}>
              Annual
            </button>
          </div>
          <p className="text-2xl font-bold">
            {zar(amount)}
            <span className="text-sm font-medium text-muted"> {interval === "annual" ? "/ year excl. VAT" : "/ month excl. VAT"}</span>
          </p>
        </div>

        <button
          type="button"
          disabled={pending || subscribed}
          onClick={() => void subscribe()}
          className="mt-5 min-h-12 rounded-md bg-primary px-5 font-semibold text-on-primary disabled:opacity-60"
        >
          {subscribed ? "Subscribed" : pending ? "Please wait…" : "Subscribe"}
        </button>
      </section>

      {usage ? (
        <section className="space-y-2 rounded-lg border border-line bg-surface p-4 shadow-sm">
          <h2 className="font-semibold">Usage this month</h2>
          <ul className="grid gap-2 text-sm sm:grid-cols-3">
            <li>Seats: {usage.seatsUsed}</li>
            <li>Installs: {usage.installsCount}</li>
            <li>Storage: {bytesLabel(usage.storageBytes)}</li>
          </ul>
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="font-semibold">Invoices</h2>
        {overview.invoices.length === 0 ? (
          <p className="text-sm text-muted">No invoices yet.</p>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface text-sm">
            {overview.invoices.map((invoice) => (
              <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <span>
                  {invoice.number} · {invoice.status}
                  {invoice.paidAt ? ` · paid ${new Date(invoice.paidAt).toLocaleDateString("en-ZA")}` : ""}
                </span>
                <span className="font-semibold">
                  {zar(invoice.totalZarCents)} <span className="font-normal text-muted">(incl. {zar(invoice.vatZarCents)} VAT)</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
    </div>
  );
}
