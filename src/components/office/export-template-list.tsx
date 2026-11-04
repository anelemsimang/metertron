"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type TemplateSummary = {
  id: string;
  key: string;
  name: string;
  sheetName: string;
  statusExportValue: string;
  headers: string[];
  isDefault: boolean;
  sourceBuiltin: string | null;
};

export function ExportTemplateList({ templates }: { templates: TemplateSummary[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function clone(sourceId: string, name: string) {
    setPending(sourceId);
    setError("");
    const key = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36).slice(-4)}`;
    const response = await fetch("/api/office/templates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sourceId, key, name: `${name} copy` }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string; template?: { id: string } } | null;
    setPending(null);
    if (!response.ok || !body?.template) {
      setError(body?.error ?? "Could not clone that template.");
      return;
    }
    router.push(`/office/templates/${body.template.id}`);
    router.refresh();
  }

  if (templates.length === 0) {
    return <p className="text-sm text-muted">No export templates yet.</p>;
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
      <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
        {templates.map((template) => (
          <li key={template.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-semibold">
                {template.name}
                {template.isDefault ? <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-brand">Default</span> : null}
              </p>
              <p className="mt-1 text-sm text-muted">
                {template.key} · sheet {template.sheetName} · {template.headers.length} columns · status “{template.statusExportValue}”
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/office/templates/${template.id}`}
                className="inline-flex min-h-12 items-center rounded-md bg-primary px-4 text-sm font-semibold text-on-primary"
              >
                Edit
              </Link>
              <button
                type="button"
                disabled={pending === template.id}
                onClick={() => void clone(template.id, template.name)}
                className="inline-flex min-h-12 items-center rounded-md border border-line bg-canvas px-4 text-sm font-semibold disabled:opacity-60"
              >
                {pending === template.id ? "Cloning…" : "Clone"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
