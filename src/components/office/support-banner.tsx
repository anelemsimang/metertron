"use client";

export function SupportBanner({
  staffName,
  organisationName,
}: {
  staffName: string;
  organisationName: string;
}) {
  async function endSession() {
    await fetch("/api/platform/support", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "end" }),
    });
    window.location.assign("/platform/orgs");
  }

  return (
    <div className="border-b border-amber-700/40 bg-amber-500 px-4 py-2 text-sm text-amber-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <p>
          <strong>Metertron support access</strong> — {staffName} is viewing {organisationName}. Actions are audited for the
          tenant.
        </p>
        <button type="button" onClick={() => void endSession()} className="rounded-md bg-amber-950 px-3 py-1.5 text-xs font-semibold text-amber-50">
          End support session
        </button>
      </div>
    </div>
  );
}
