"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

type OrgRow = { organisationId: string; name: string; slug: string; role: string };

export function OrgSwitcher({
  activeName,
  className = "",
}: {
  activeName: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const response = await fetch("/api/auth/org/switch");
      if (!response.ok || cancelled) return;
      const body = (await response.json()) as { organisations?: OrgRow[]; activeOrganisationId?: string };
      if (cancelled) return;
      setOrgs(body.organisations ?? []);
      setActiveId(body.activeOrganisationId ?? "");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (orgs.length <= 1) {
    return <p className={`truncate text-sm font-semibold ${className}`}>{activeName}</p>;
  }

  async function switchTo(organisationId: string) {
    if (organisationId === activeId || pending) return;
    setPending(true);
    setError("");
    const response = await fetch("/api/auth/org/switch", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ organisationId }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Could not switch organisation.");
      return;
    }
    window.location.assign("/");
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex max-w-full items-center gap-1 truncate text-left text-sm font-semibold"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">{activeName}</span>
        <ChevronDown size={14} className="shrink-0 opacity-80" />
      </button>
      {open ? (
        <div
          role="listbox"
          className="absolute right-0 z-40 mt-2 min-w-[220px] rounded-md border border-line bg-surface py-1 text-ink shadow-lg"
        >
          {orgs.map((org) => (
            <button
              key={org.organisationId}
              type="button"
              role="option"
              aria-selected={org.organisationId === activeId}
              disabled={pending}
              onClick={() => void switchTo(org.organisationId)}
              className={`flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-canvas ${
                org.organisationId === activeId ? "bg-primary/10 font-semibold text-brand" : ""
              }`}
            >
              <span>{org.name}</span>
              <span className="text-xs font-normal text-muted">{org.role}</span>
            </button>
          ))}
          {error ? <p className="px-3 py-2 text-xs font-semibold text-danger">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
