"use client";

import { useEffect, useState } from "react";
import { PlatformPanel } from "@/components/platform/panel";

export default function PlatformTemplatesPage() {
  const [exports, setExports] = useState<
    Array<{ id: string; key: string; name: string; organisationName: string; isDefault: boolean; sourceBuiltin: string | null }>
  >([]);
  const [forms, setForms] = useState<
    Array<{ id: string; key: string; version: number; status: string; organisationName: string }>
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/platform/templates");
      const body = (await response.json()) as {
        exports?: typeof exports;
        forms?: typeof forms;
        error?: string;
      };
      if (!response.ok) {
        setError(body.error ?? "Failed to load templates.");
        return;
      }
      setExports(body.exports ?? []);
      setForms(body.forms ?? []);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Templates library</h1>
        <p className="mt-1 text-sm text-slate-400">Export templates and form versions across tenants.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <PlatformPanel title="Export templates">
          <ul className="space-y-2 text-sm">
            {exports.map((row) => (
              <li key={row.id} className="rounded border border-white/5 px-3 py-2">
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-slate-500">
                  {row.organisationName} · {row.key}
                  {row.isDefault ? " · default" : ""}
                  {row.sourceBuiltin ? ` · builtin ${row.sourceBuiltin}` : ""}
                </p>
              </li>
            ))}
            {exports.length === 0 ? <li className="text-slate-500">None</li> : null}
          </ul>
        </PlatformPanel>
        <PlatformPanel title="Form versions">
          <ul className="space-y-2 text-sm">
            {forms.map((row) => (
              <li key={row.id} className="rounded border border-white/5 px-3 py-2">
                <p className="font-medium">
                  {row.key} v{row.version}
                </p>
                <p className="text-xs text-slate-500">
                  {row.organisationName} · {row.status}
                </p>
              </li>
            ))}
            {forms.length === 0 ? <li className="text-slate-500">None</li> : null}
          </ul>
        </PlatformPanel>
      </div>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
