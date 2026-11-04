"use client";

import { useEffect, useState } from "react";
import { PlatformPanel } from "@/components/platform/panel";

type Announcement = {
  id: string;
  title: string;
  body: string;
  severity: string;
  startsAt: string;
  endsAt: string | null;
};

export default function PlatformAnnouncementsPage() {
  const [rows, setRows] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("info");
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/platform/announcements");
    const payload = (await response.json()) as { announcements?: Announcement[]; error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Failed to load.");
      return;
    }
    setRows(payload.announcements ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/platform/announcements", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, body, severity }),
    });
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Create failed.");
      return;
    }
    setTitle("");
    setBody("");
    await load();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Announcements</h1>
        <p className="mt-1 text-sm text-slate-400">Broadcast messages for tenant surfaces (rendering hooks in later phases).</p>
      </div>
      <PlatformPanel title="Create">
        <form onSubmit={(e) => void create(e)} className="space-y-3 text-sm">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded border border-white/10 bg-black/30 px-3 py-2 outline-none"
            required
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body"
            className="min-h-24 w-full rounded border border-white/10 bg-black/30 px-3 py-2 outline-none"
            required
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="rounded border border-white/10 bg-black/30 px-3 py-2 outline-none"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
          <button type="submit" className="rounded-md bg-emerald-600 px-3 py-2 font-semibold text-white">
            Publish
          </button>
        </form>
      </PlatformPanel>
      <PlatformPanel title="Recent">
        <ul className="space-y-3 text-sm">
          {rows.map((row) => (
            <li key={row.id} className="rounded border border-white/5 px-3 py-2">
              <p className="font-semibold">
                {row.title} <span className="text-xs font-normal text-slate-500">· {row.severity}</span>
              </p>
              <p className="mt-1 text-slate-300">{row.body}</p>
              <p className="mt-1 text-xs text-slate-500">{new Date(row.startsAt).toLocaleString("en-ZA")}</p>
            </li>
          ))}
          {rows.length === 0 ? <li className="text-slate-500">None yet.</li> : null}
        </ul>
      </PlatformPanel>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
