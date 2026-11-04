"use client";

import { useEffect, useState, type FormEvent } from "react";

type InviteRow = {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  acceptedAt: string | null;
  acceptPath: string | null;
};

export function InvitePanel() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("technician");
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [lastLink, setLastLink] = useState("");

  async function refresh() {
    const response = await fetch("/api/office/invites");
    if (!response.ok) return;
    const body = (await response.json()) as { invites?: InviteRow[] };
    setInvites(body.invites ?? []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function createInvite(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/office/invites", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    const body = (await response.json()) as { error?: string; invite?: { acceptPath?: string } };
    setPending(false);
    if (!response.ok) {
      setError(body.error ?? "Could not create invite.");
      return;
    }
    setEmail("");
    if (body.invite?.acceptPath) setLastLink(`${window.location.origin}${body.invite.acceptPath}`);
    await refresh();
  }

  async function revoke(inviteId: string) {
    setPending(true);
    await fetch("/api/office/invites", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "revoke", inviteId }),
    });
    setPending(false);
    await refresh();
  }

  return (
    <section className="space-y-3 rounded-lg border border-line bg-surface p-4 shadow-sm">
      <h2 className="text-base font-semibold">Invite people</h2>
      <p className="text-sm text-muted">Invites expire after 7 days. Share the link until email delivery is wired.</p>
      <form onSubmit={createInvite} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="block flex-1 space-y-1 text-sm font-semibold">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal"
          />
        </label>
        <label className="block space-y-1 text-sm font-semibold sm:w-44">
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal">
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="technician">Technician</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
        <button type="submit" disabled={pending} className="min-h-12 rounded-md bg-primary px-4 font-semibold text-on-primary disabled:opacity-60">
          Invite
        </button>
      </form>
      {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
      {lastLink ? <p className="break-all text-xs text-muted">Latest link: {lastLink}</p> : null}
      <ul className="divide-y divide-line">
        {invites.map((invite) => (
          <li key={invite.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">
                {invite.email} · {invite.role}
              </p>
              <p className="text-xs text-muted">
                {invite.acceptedAt ? "Accepted" : `Expires ${new Date(invite.expiresAt).toLocaleDateString("en-ZA")}`}
                {invite.acceptPath ? ` · ${invite.acceptPath}` : ""}
              </p>
            </div>
            {!invite.acceptedAt ? (
              <button type="button" disabled={pending} onClick={() => void revoke(invite.id)} className="min-h-10 rounded-md border border-line px-3 text-xs font-semibold">
                Revoke
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
