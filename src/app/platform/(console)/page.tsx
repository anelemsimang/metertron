"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlatformPanel, Stat } from "@/components/platform/panel";

type Overview = {
  orgs: { total: number; trialing: number; active: number; pastDue: number; suspended: number };
  users: number;
  staff: number;
  revenueThisMonthZarCents: number;
  paidInvoicesThisMonth: number;
  recentOrgs: Array<{ id: string; name: string; slug: string; status: string; createdAt: string }>;
  recentAudit: Array<{ id: string; action: string; summary: string; createdAt: string; staffEmail: string | null }>;
};

function zar(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

export default function PlatformOverviewPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/platform/overview");
      const body = (await response.json()) as { overview?: Overview; error?: string };
      if (!response.ok) {
        setError(body.error ?? "Could not load overview.");
        return;
      }
      setOverview(body.overview ?? null);
    })();
  }, []);

  if (error) return <p className="text-sm text-rose-400">{error}</p>;
  if (!overview) return <p className="text-sm text-slate-400">Loading overview…</p>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Overview</h1>
        <p className="mt-1 text-sm text-slate-400">Live tenant and billing snapshot.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Organisations" value={overview.orgs.total} />
        <Stat label="Active" value={overview.orgs.active} />
        <Stat label="Trialing" value={overview.orgs.trialing} />
        <Stat label="Users" value={overview.users} />
        <Stat label="Past due / readonly" value={overview.orgs.pastDue} />
        <Stat label="Suspended" value={overview.orgs.suspended} />
        <Stat label="Paid invoices (month)" value={overview.paidInvoicesThisMonth} />
        <Stat label="Revenue (month)" value={zar(overview.revenueThisMonthZarCents)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PlatformPanel title="Recent organisations">
          <ul className="space-y-2 text-sm">
            {overview.recentOrgs.map((org) => (
              <li key={org.id} className="flex items-center justify-between gap-2">
                <Link href={`/platform/orgs?id=${org.id}`} className="text-emerald-400 hover:underline">
                  {org.name}
                </Link>
                <span className="text-xs text-slate-500">
                  {org.status} · {new Date(org.createdAt).toLocaleDateString("en-ZA")}
                </span>
              </li>
            ))}
          </ul>
        </PlatformPanel>
        <PlatformPanel title="Recent audit">
          <ul className="space-y-2 text-sm">
            {overview.recentAudit.map((event) => (
              <li key={event.id}>
                <p className="font-medium text-slate-200">{event.summary || event.action}</p>
                <p className="text-xs text-slate-500">
                  {event.staffEmail ?? "system"} · {new Date(event.createdAt).toLocaleString("en-ZA")}
                </p>
              </li>
            ))}
            {overview.recentAudit.length === 0 ? <li className="text-slate-500">No audit events yet.</li> : null}
          </ul>
        </PlatformPanel>
      </div>
    </div>
  );
}
