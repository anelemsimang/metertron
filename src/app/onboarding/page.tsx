"use client";

import { useEffect, useState, type FormEvent } from "react";
import { LogoLockup } from "@/components/brand/logo";
import { BRAND } from "@/lib/brand";

type Step = "company" | "invite" | "done";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("company");
  const [companyName, setCompanyName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("technician");
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/onboarding");
      if (!response.ok) {
        window.location.assign("/login?next=/onboarding");
        return;
      }
      const body = (await response.json()) as {
        organisation?: { name?: string; legalName?: string; vatNumber?: string | null; trialEndsAt?: string | null; onboardingCompletedAt?: string | null };
      };
      if (body.organisation?.onboardingCompletedAt) {
        window.location.assign("/office");
        return;
      }
      setCompanyName(body.organisation?.name ?? "");
      setLegalName(body.organisation?.legalName ?? "");
      setVatNumber(body.organisation?.vatNumber ?? "");
      setTrialEndsAt(body.organisation?.trialEndsAt ?? null);
    })();
  }, []);

  async function saveCompany(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ companyName, legalName: legalName || companyName, vatNumber, timezone: "Africa/Johannesburg" }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Could not save company details.");
      return;
    }
    setStep("invite");
  }

  async function sendInvite(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/office/invites", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    });
    const body = (await response.json()) as { error?: string; invite?: { acceptPath?: string } };
    setPending(false);
    if (!response.ok) {
      setError(body.error ?? "Could not create invite.");
      return;
    }
    setInviteLink(body.invite?.acceptPath ? `${window.location.origin}${body.invite.acceptPath}` : "");
  }

  async function finish() {
    setPending(true);
    setError("");
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ complete: true }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Could not finish onboarding.");
      return;
    }
    window.location.assign("/office");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10 text-ink">
      <LogoLockup />
      <h1 className="mt-6 text-2xl font-bold">Set up {BRAND.name}</h1>
      <p className="mt-2 text-sm text-muted">
        {trialEndsAt
          ? `Your 7-day trial runs until ${new Date(trialEndsAt).toLocaleDateString("en-ZA")}. No card required.`
          : "Start your 7-day trial — no card required."}
      </p>

      <ol className="mt-6 flex gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
        <li className={step === "company" ? "text-brand" : ""}>1. Company</li>
        <li className={step === "invite" ? "text-brand" : ""}>2. Team</li>
        <li className={step === "done" ? "text-brand" : ""}>3. Finish</li>
      </ol>

      {step === "company" ? (
        <form onSubmit={saveCompany} className="mt-6 space-y-3 rounded-lg border border-line bg-surface p-5 shadow-sm">
          <Field label="Company name" value={companyName} onChange={setCompanyName} required />
          <Field label="Legal name" value={legalName} onChange={setLegalName} />
          <Field label="VAT number (optional)" value={vatNumber} onChange={setVatNumber} />
          {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
          <button type="submit" disabled={pending} className="min-h-12 w-full rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60">
            Continue
          </button>
        </form>
      ) : null}

      {step === "invite" ? (
        <div className="mt-6 space-y-4 rounded-lg border border-line bg-surface p-5 shadow-sm">
          <p className="text-sm text-muted">Invite a teammate now, or skip and do it later from Team.</p>
          <form onSubmit={sendInvite} className="space-y-3">
            <Field label="Work email" value={inviteEmail} onChange={setInviteEmail} type="email" required />
            <label className="block space-y-1 text-sm font-semibold">
              Role
              <select
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value)}
                className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 text-base font-normal"
              >
                <option value="admin">Admin</option>
                <option value="supervisor">Supervisor</option>
                <option value="technician">Technician</option>
                <option value="viewer">Viewer</option>
              </select>
            </label>
            {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
            <button type="submit" disabled={pending} className="min-h-12 w-full rounded-md border border-line font-semibold disabled:opacity-60">
              Create invite link
            </button>
          </form>
          {inviteLink ? (
            <p className="break-all rounded-md bg-canvas p-3 text-xs">
              Share this link (email delivery comes later): <strong>{inviteLink}</strong>
            </p>
          ) : null}
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep("done")} className="min-h-12 flex-1 rounded-md bg-primary font-semibold text-on-primary">
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="mt-6 space-y-4 rounded-lg border border-line bg-surface p-5 shadow-sm">
          <p className="text-sm">
            You are ready. Export templates and form builders land in the next phase — for now you can manage your team and start capturing installs.
          </p>
          {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
          <button type="button" disabled={pending} onClick={() => void finish()} className="min-h-12 w-full rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60">
            Open manager dashboard
          </button>
        </div>
      ) : null}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1 text-sm font-semibold">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 text-base font-normal"
      />
    </label>
  );
}
