"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark, LogoWordmark } from "@/components/brand/logo";

export default function PlatformLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [step, setStep] = useState<"password" | "setup" | "verify">("password");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/platform/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = (await response.json()) as { error?: string; needsTotpSetup?: boolean };
    setPending(false);
    if (!response.ok) {
      setError(body.error ?? "Sign-in failed.");
      return;
    }
    if (body.needsTotpSetup) {
      const setup = await fetch("/api/platform/auth/totp");
      const setupBody = (await setup.json()) as { secret?: string; otpauthUrl?: string; error?: string };
      if (!setup.ok) {
        setError(setupBody.error ?? "Could not start 2FA setup.");
        return;
      }
      setSecret(setupBody.secret ?? null);
      setOtpauthUrl(setupBody.otpauthUrl ?? null);
      setStep("setup");
      return;
    }
    setStep("verify");
  }

  async function confirmTotp(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/platform/auth/totp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, action: step === "setup" ? "setup" : "verify" }),
    });
    const body = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(body.error ?? "Invalid code.");
      return;
    }
    router.replace("/platform");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070d18] px-4 text-slate-100">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
        <span className="inline-flex items-center gap-2">
          <LogoMark className="h-8 w-8 shrink-0" mono="white" />
          <LogoWordmark className="text-white" />
        </span>
        <h1 className="mt-4 text-xl font-semibold">Platform sign-in</h1>
        <p className="mt-1 text-sm text-slate-400">Staff only. Two-factor authentication is required.</p>

        {step === "password" ? (
          <form onSubmit={(e) => void login(e)} className="mt-6 space-y-3">
            <label className="block text-sm">
              Email
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                required
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                required
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => void confirmTotp(e)} className="mt-6 space-y-3">
            {step === "setup" ? (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
                <p className="font-semibold">Set up authenticator app</p>
                <p className="mt-1 text-amber-100/80">Scan this URI or enter the secret in your TOTP app, then enter a code.</p>
                {secret ? <p className="mt-2 break-all font-mono text-xs">{secret}</p> : null}
                {otpauthUrl ? <p className="mt-2 break-all font-mono text-[10px] text-slate-400">{otpauthUrl}</p> : null}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Enter the 6-digit code from your authenticator app.</p>
            )}
            <label className="block text-sm">
              Authenticator code
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm tracking-widest outline-none focus:border-emerald-500"
                required
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Verifying…" : "Verify and enter"}
            </button>
          </form>
        )}
        {error ? <p className="mt-3 text-sm font-semibold text-rose-400">{error}</p> : null}
      </div>
    </main>
  );
}
