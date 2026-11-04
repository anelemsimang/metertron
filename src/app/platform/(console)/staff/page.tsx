"use client";

import { useEffect, useState } from "react";
import { PlatformPanel } from "@/components/platform/panel";

type Staff = {
  id: string;
  email: string;
  name: string;
  role: string;
  totpEnabledAt: string | null;
  disabledAt: string | null;
  lastLoginAt: string | null;
};

export default function PlatformStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("support");
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/platform/staff");
    const body = (await response.json()) as { staff?: Staff[]; error?: string };
    if (!response.ok) {
      setError(body.error ?? "Failed to load staff (owner role required).");
      return;
    }
    setStaff(body.staff ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/platform/staff", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, name, password, role }),
    });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Create failed.");
      return;
    }
    setEmail("");
    setName("");
    setPassword("");
    await load();
  }

  async function toggleDisabled(row: Staff) {
    await fetch("/api/platform/staff", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: row.id, disabled: !row.disabledAt }),
    });
    await load();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Staff</h1>
        <p className="mt-1 text-sm text-slate-400">Platform operators. New staff must complete 2FA on first login.</p>
      </div>
      <PlatformPanel title="Invite / create">
        <form onSubmit={(e) => void create(e)} className="grid gap-2 text-sm md:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded border border-white/10 bg-black/30 px-3 py-2 outline-none" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="rounded border border-white/10 bg-black/30 px-3 py-2 outline-none" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Temp password (≥10)" type="password" className="rounded border border-white/10 bg-black/30 px-3 py-2 outline-none" required />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded border border-white/10 bg-black/30 px-3 py-2 outline-none">
            <option value="support">support</option>
            <option value="admin">admin</option>
            <option value="readonly">readonly</option>
            <option value="owner">owner</option>
          </select>
          <button type="submit" className="rounded-md bg-emerald-600 px-3 py-2 font-semibold text-white md:col-span-2">
            Create staff
          </button>
        </form>
      </PlatformPanel>
      <PlatformPanel title="Roster">
        <ul className="divide-y divide-white/5 text-sm">
          {staff.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-medium">
                  {row.name} · {row.email}
                </p>
                <p className="text-xs text-slate-500">
                  {row.role}
                  {row.totpEnabledAt ? " · 2FA on" : " · 2FA pending"}
                  {row.lastLoginAt ? ` · last ${new Date(row.lastLoginAt).toLocaleString("en-ZA")}` : ""}
                  {row.disabledAt ? " · disabled" : ""}
                </p>
              </div>
              <button type="button" onClick={() => void toggleDisabled(row)} className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/5">
                {row.disabledAt ? "Enable" : "Disable"}
              </button>
            </li>
          ))}
        </ul>
      </PlatformPanel>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
