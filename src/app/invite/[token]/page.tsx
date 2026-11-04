"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { LogoLockup } from "@/components/brand/logo";
import { STORAGE } from "@/lib/brand";

export default function InviteAcceptPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const response = await fetch(`/api/auth/invite/accept?token=${encodeURIComponent(token)}`);
      const body = (await response.json()) as { error?: string; email?: string; role?: string };
      if (!response.ok) {
        setError(body.error ?? "Invite not found.");
        return;
      }
      setEmail(body.email ?? "");
      setRole(body.role ?? "");
      setReady(true);
    })();
  }, [token]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/auth/invite/accept", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, name, username, password }),
    });
    const body = (await response.json()) as { error?: string; role?: string; ok?: boolean };
    setPending(false);
    if (!response.ok) {
      setError(body.error ?? "Could not accept invite.");
      return;
    }
    localStorage.setItem(STORAGE.tech, JSON.stringify({ name, username }));
    window.location.assign("/");
  }

  async function acceptWhileSignedIn() {
    setPending(true);
    setError("");
    const response = await fetch("/api/auth/invite/accept", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const body = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(body.error ?? "Could not accept invite.");
      return;
    }
    window.location.assign("/");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10 text-ink">
      <LogoLockup />
      <h1 className="mt-6 text-2xl font-bold">Join organisation</h1>
      {!ready && !error ? <p className="mt-3 text-sm text-muted">Checking invite…</p> : null}
      {error && !ready ? <p className="mt-3 text-sm font-semibold text-danger">{error}</p> : null}
      {ready ? (
        <>
          <p className="mt-2 text-sm text-muted">
            Invited as <strong>{role}</strong> · {email}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-3 rounded-lg border border-line bg-surface p-5 shadow-sm">
            <label className="block space-y-1 text-sm font-semibold">
              Your name
              <input required value={name} onChange={(e) => setName(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
            </label>
            <label className="block space-y-1 text-sm font-semibold">
              Username
              <input required value={username} onChange={(e) => setUsername(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
            </label>
            <label className="block space-y-1 text-sm font-semibold">
              Password
              <input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
            </label>
            {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
            <button type="submit" disabled={pending} className="min-h-12 w-full rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60">
              Create account & join
            </button>
          </form>
          <button
            type="button"
            disabled={pending}
            onClick={() => void acceptWhileSignedIn()}
            className="mt-3 min-h-12 w-full rounded-md border border-line text-sm font-semibold disabled:opacity-60"
          >
            Already signed in? Accept with this email
          </button>
        </>
      ) : null}
    </main>
  );
}
