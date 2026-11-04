"use client";

import { useEffect, useState } from "react";
import { PlatformPanel } from "@/components/platform/panel";

type Event = {
  id: string;
  action: string;
  summary: string;
  organisationId: string | null;
  createdAt: string;
  staffEmail: string | null;
};

export default function PlatformAuditPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/platform/audit");
      const body = (await response.json()) as { events?: Event[]; error?: string };
      if (!response.ok) {
        setError(body.error ?? "Failed to load audit.");
        return;
      }
      setEvents(body.events ?? []);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Audit</h1>
        <p className="mt-1 text-sm text-slate-400">Platform staff actions across the control panel.</p>
      </div>
      <PlatformPanel title="Events">
        <ul className="divide-y divide-white/5 text-sm">
          {events.map((event) => (
            <li key={event.id} className="py-3">
              <p className="font-medium">{event.summary || event.action}</p>
              <p className="text-xs text-slate-500">
                {event.action} · {event.staffEmail ?? "system"}
                {event.organisationId ? ` · org ${event.organisationId.slice(0, 8)}` : ""} ·{" "}
                {new Date(event.createdAt).toLocaleString("en-ZA")}
              </p>
            </li>
          ))}
          {events.length === 0 ? <li className="py-2 text-slate-500">No events.</li> : null}
        </ul>
      </PlatformPanel>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
