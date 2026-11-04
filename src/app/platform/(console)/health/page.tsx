"use client";

import { useEffect, useState } from "react";
import { PlatformPanel, Stat } from "@/components/platform/panel";

export default function PlatformHealthPage() {
  const [data, setData] = useState<{
    ok: boolean;
    latencyMs: number;
    stats: { organisations: number; users: number; jobs: number; platformSessions: number };
    env: { paystack: boolean; ipAllowlist: boolean; nodeEnv: string };
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/platform/health");
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? "Health check failed.");
        return;
      }
      setData(body);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Health</h1>
        <p className="mt-1 text-sm text-slate-400">Database connectivity and runtime signals.</p>
      </div>
      {data ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Status" value={data.ok ? "OK" : "FAIL"} />
            <Stat label="DB latency" value={`${data.latencyMs} ms`} />
            <Stat label="Organisations" value={data.stats.organisations} />
            <Stat label="Jobs" value={data.stats.jobs} />
          </div>
          <PlatformPanel title="Environment">
            <ul className="space-y-1 text-sm text-slate-300">
              <li>NODE_ENV: {data.env.nodeEnv}</li>
              <li>Paystack key configured: {data.env.paystack ? "yes" : "no"}</li>
              <li>IP allowlist: {data.env.ipAllowlist ? "enabled" : "off"}</li>
              <li>Users: {data.stats.users}</li>
              <li>Platform sessions: {data.stats.platformSessions}</li>
            </ul>
          </PlatformPanel>
        </>
      ) : (
        <p className="text-sm text-slate-400">Checking…</p>
      )}
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
