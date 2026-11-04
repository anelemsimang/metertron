"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  staffEmail: string;
  staffName: string;
  reason: string;
  startedAt: string;
  endedAt: string | null;
};

export function SupportAccessList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/office/support-access");
      if (!response.ok) return;
      const body = (await response.json()) as { events?: Event[] };
      setEvents(body.events ?? []);
    })();
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="rounded-lg border border-line bg-surface p-4 shadow-sm">
      <h2 className="font-semibold">Metertron support access</h2>
      <p className="mt-1 text-sm text-muted">When Metertron staff open your organisation for support, it is logged here.</p>
      <ul className="mt-3 divide-y divide-line text-sm">
        {events.map((event) => (
          <li key={event.id} className="flex flex-wrap justify-between gap-2 py-2">
            <span>
              {event.staffName} ({event.staffEmail})
              {event.reason ? ` — ${event.reason}` : ""}
            </span>
            <span className="text-muted">
              {new Date(event.startedAt).toLocaleString("en-ZA")}
              {event.endedAt ? ` → ${new Date(event.endedAt).toLocaleString("en-ZA")}` : " · active"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
