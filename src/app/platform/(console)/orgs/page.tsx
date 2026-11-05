"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlatformPanel } from "@/components/platform/panel";

type Org = {
  id: string;
  name: string;
  slug: string;
  status: string;
  planKey: string;
  supportAccessAllowed: boolean;
  createdAt: string;
};

type Detail = {
  organisation: Org & {
    legalName: string;
    trialEndsAt: string | null;
    supportAccessRequiresApproval: boolean;
  };
  members: Array<{ userId: string; name: string; email: string; role: string; removedAt: string | null }>;
  subscription: {
    status: string;
    interval: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
  } | null;
};

function PlatformOrgsInner() {
  const params = useSearchParams();
  const router = useRouter();
  const selectedId = params.get("id");
  const [query, setQuery] = useState("");
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Array<{ id: string; body: string; createdAt: string; staffName: string | null }>>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadList(q = query) {
    const response = await fetch(`/api/platform/orgs?q=${encodeURIComponent(q)}`);
    const body = (await response.json()) as { orgs?: Org[]; error?: string };
    if (!response.ok) {
      setError(body.error ?? "Failed to load organisations.");
      return;
    }
    setOrgs(body.orgs ?? []);
  }

  async function loadDetail(id: string) {
    const [orgRes, notesRes] = await Promise.all([
      fetch(`/api/platform/orgs?id=${id}`),
      fetch(`/api/platform/notes?organisationId=${id}`),
    ]);
    const orgBody = (await orgRes.json()) as Detail & { error?: string };
    const notesBody = (await notesRes.json()) as { notes?: typeof notes; error?: string };
    if (!orgRes.ok) {
      setError(orgBody.error ?? "Failed to load organisation.");
      return;
    }
    setDetail(orgBody);
    setNotes(notesBody.notes ?? []);
  }

  useEffect(() => {
    void loadList();
  }, []);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId]);

  async function patchOrg(patch: Record<string, unknown>) {
    if (!detail) return;
    setMessage("");
    setError("");
    const response = await fetch("/api/platform/orgs", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ organisationId: detail.organisation.id, ...patch }),
    });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(body.error ?? "Update failed.");
      return;
    }
    setMessage("Organisation updated.");
    await loadDetail(detail.organisation.id);
    await loadList();
  }

  async function activate(interval: "monthly" | "annual") {
    if (!detail) return;
    setMessage("");
    setError("");
    const response = await fetch("/api/platform/orgs", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ organisationId: detail.organisation.id, action: "activate", interval }),
    });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(body.error ?? "Could not activate organisation.");
      return;
    }
    setMessage(interval === "annual" ? "Activated for 1 year." : "Activated for 1 month.");
    await loadDetail(detail.organisation.id);
    await loadList();
  }

  async function viewAs() {
    if (!detail) return;
    setError("");
    const response = await fetch("/api/platform/support", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "start", organisationId: detail.organisation.id, reason }),
    });
    const body = (await response.json()) as { error?: string; officeUrl?: string };
    if (!response.ok) {
      setError(body.error ?? "Could not start support access.");
      return;
    }
    window.location.assign(body.officeUrl ?? "/office");
  }

  async function addNote() {
    if (!detail || !note.trim()) return;
    const response = await fetch("/api/platform/notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ organisationId: detail.organisation.id, body: note }),
    });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Could not save note.");
      return;
    }
    setNote("");
    await loadDetail(detail.organisation.id);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Organisations</h1>
        <p className="mt-1 text-sm text-slate-400">
          Search tenants, activate monthly or annual access after private payment, and start audited support access.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <PlatformPanel
          title="Directory"
          actions={
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void loadList(query);
              }}
              placeholder="Search…"
              className="w-36 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs outline-none"
            />
          }
        >
          <ul className="max-h-[70vh] space-y-1 overflow-auto text-sm">
            {orgs.map((org) => (
              <li key={org.id}>
                <button
                  type="button"
                  onClick={() => router.push(`/platform/orgs?id=${org.id}`)}
                  className={`w-full rounded-md px-2 py-2 text-left hover:bg-white/5 ${
                    selectedId === org.id ? "bg-white/10" : ""
                  }`}
                >
                  <p className="font-medium">{org.name}</p>
                  <p className="text-xs text-slate-500">
                    {org.slug} · {org.status}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </PlatformPanel>

        {detail ? (
          <div className="space-y-4">
            <PlatformPanel title={detail.organisation.name}>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Slug</dt>
                  <dd className="font-mono">{detail.organisation.slug}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Plan</dt>
                  <dd>{detail.organisation.planKey}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Status</dt>
                  <dd className="capitalize">{detail.organisation.status}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Legal name</dt>
                  <dd>{detail.organisation.legalName}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Subscription</dt>
                  <dd className="capitalize">
                    {detail.subscription
                      ? `${detail.subscription.status} · ${detail.subscription.interval}`
                      : "None"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Period ends</dt>
                  <dd>
                    {detail.subscription?.currentPeriodEnd
                      ? new Date(detail.subscription.currentPeriodEnd).toLocaleDateString("en-ZA")
                      : detail.organisation.trialEndsAt
                        ? `Trial ${new Date(detail.organisation.trialEndsAt).toLocaleDateString("en-ZA")}`
                        : "—"}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void activate("monthly")}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Activate monthly (1 month)
                </button>
                <button
                  type="button"
                  onClick={() => void activate("annual")}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Activate annual (1 year)
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["active", "trialing", "past_due", "readonly", "suspended"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void patchOrg({ status })}
                    className="rounded border border-white/10 px-2 py-1 text-xs capitalize hover:bg-white/5"
                  >
                    Set {status.replace("_", " ")}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => void patchOrg({ supportAccessAllowed: !detail.organisation.supportAccessAllowed })}
                  className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
                >
                  Support access: {detail.organisation.supportAccessAllowed ? "on" : "off"}
                </button>
              </div>
            </PlatformPanel>

            <PlatformPanel title="View as (support)">
              <p className="text-sm text-slate-400">
                Opens Manager for this organisation. The tenant sees a support-access audit entry. Session lasts 4 hours.
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for access"
                className="mt-3 min-h-20 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => void viewAs()}
                className="mt-3 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
              >
                Start support session
              </button>
            </PlatformPanel>

            <PlatformPanel title="Members">
              <ul className="divide-y divide-white/5 text-sm">
                {detail.members.map((member) => (
                  <li key={member.userId} className="flex justify-between gap-2 py-2">
                    <span>
                      {member.name} · {member.email}
                    </span>
                    <span className="text-slate-500">{member.role}</span>
                  </li>
                ))}
              </ul>
            </PlatformPanel>

            <PlatformPanel title="Support notes">
              <ul className="mb-3 space-y-2 text-sm">
                {notes.map((item) => (
                  <li key={item.id} className="rounded border border-white/5 bg-black/20 px-3 py-2">
                    <p>{item.body}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.staffName ?? "staff"} · {new Date(item.createdAt).toLocaleString("en-ZA")}
                    </p>
                  </li>
                ))}
              </ul>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Internal note"
                className="min-h-16 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
              />
              <button type="button" onClick={() => void addNote()} className="mt-2 rounded-md border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5">
                Add note
              </button>
            </PlatformPanel>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Select an organisation.</p>
        )}
      </div>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
    </div>
  );
}

export default function PlatformOrgsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-400">Loading organisations…</p>}>
      <PlatformOrgsInner />
    </Suspense>
  );
}
