"use client";

import { useEffect, useState } from "react";
import { PlatformPanel } from "@/components/platform/panel";

type UserRow = {
  id: string;
  name: string;
  email: string;
  organisationName: string;
  removedAt: string | null;
  memberships: Array<{ orgName: string; role: string }>;
};

export default function PlatformUsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState("");

  async function load(q = query) {
    const response = await fetch(`/api/platform/users?q=${encodeURIComponent(q)}`);
    const body = (await response.json()) as { users?: UserRow[]; error?: string };
    if (!response.ok) {
      setError(body.error ?? "Failed to load users.");
      return;
    }
    setUsers(body.users ?? []);
  }

  useEffect(() => {
    void load("");
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-slate-400">Search tenant users across organisations.</p>
      </div>
      <PlatformPanel
        title="Directory"
        actions={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void load(query);
            }}
            className="flex gap-2"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Email or name"
              className="rounded border border-white/10 bg-black/30 px-2 py-1 text-xs outline-none"
            />
            <button type="submit" className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/5">
              Search
            </button>
          </form>
        }
      >
        <ul className="divide-y divide-white/5 text-sm">
          {users.map((user) => (
            <li key={user.id} className="flex flex-wrap items-start justify-between gap-2 py-3">
              <div>
                <p className="font-medium">
                  {user.name} <span className="text-slate-500">· {user.email}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Primary: {user.organisationName}
                  {user.removedAt ? " · removed" : ""}
                </p>
              </div>
              <div className="text-xs text-slate-400">
                {user.memberships.map((m) => (
                  <div key={`${user.id}-${m.orgName}`}>
                    {m.orgName} ({m.role})
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </PlatformPanel>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
