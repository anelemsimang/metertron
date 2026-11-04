"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export type EditableTemplate = {
  id: string;
  key: string;
  name: string;
  sheetName: string;
  statusExportValue: string;
  headers: string[];
  mapHeaders: string[];
  listPhrases: { oldMeterSuffix: string; connectionValue: string };
  isDefault: boolean;
};

export function ExportTemplateEditor({ template }: { template: EditableTemplate }) {
  const router = useRouter();
  const [name, setName] = useState(template.name);
  const [sheetName, setSheetName] = useState(template.sheetName);
  const [statusExportValue, setStatusExportValue] = useState(template.statusExportValue);
  const [headersText, setHeadersText] = useState(template.headers.join("\n"));
  const [mapHeadersText, setMapHeadersText] = useState(template.mapHeaders.join("\n"));
  const [oldMeterSuffix, setOldMeterSuffix] = useState(template.listPhrases.oldMeterSuffix);
  const [connectionValue, setConnectionValue] = useState(template.listPhrases.connectionValue);
  const [isDefault, setIsDefault] = useState(template.isDefault);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSaved(false);
    const headers = headersText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const mapHeaders = mapHeadersText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const response = await fetch(`/api/office/templates/${template.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        sheetName,
        statusExportValue,
        headers,
        mapHeaders,
        listPhrases: { oldMeterSuffix, connectionValue },
        isDefault,
      }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setError(body?.error ?? "Could not save template.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  const headerLines = headersText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  function moveHeader(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= headerLines.length) return;
    const next = [...headerLines];
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    setHeadersText(next.join("\n"));
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm font-semibold">
          Name
          <input required value={name} onChange={(e) => setName(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
        </label>
        <label className="block space-y-1 text-sm font-semibold">
          Key
          <input disabled value={template.key} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal text-muted" />
        </label>
        <label className="block space-y-1 text-sm font-semibold">
          Sheet name
          <input required value={sheetName} onChange={(e) => setSheetName(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
        </label>
        <label className="block space-y-1 text-sm font-semibold">
          Status export value
          <input required value={statusExportValue} onChange={(e) => setStatusExportValue(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
        </label>
        <label className="block space-y-1 text-sm font-semibold">
          Old meter “not on list” suffix
          <input value={oldMeterSuffix} onChange={(e) => setOldMeterSuffix(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
        </label>
        <label className="block space-y-1 text-sm font-semibold">
          Connection “not on list” value
          <input value={connectionValue} onChange={(e) => setConnectionValue(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="h-4 w-4" />
        Use as default export template
      </label>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-1 text-sm font-semibold">
          Column headers (one per line, order matters)
          <textarea
            required
            value={headersText}
            onChange={(e) => setHeadersText(e.target.value)}
            rows={18}
            className="w-full rounded-md border border-line bg-canvas px-3 py-2 font-mono text-xs font-normal"
          />
        </label>
        <div className="space-y-3">
          <p className="text-sm font-semibold">Reorder preview ({headerLines.length})</p>
          <ul className="max-h-[420px] space-y-1 overflow-y-auto rounded-md border border-line bg-surface p-2">
            {headerLines.map((header, index) => (
              <li key={`${header}-${index}`} className="flex items-center gap-2 rounded-md bg-canvas px-2 py-1.5 text-xs">
                <span className="min-w-0 flex-1 truncate font-mono">{header}</span>
                <button type="button" className="rounded border border-line px-2 py-1" onClick={() => moveHeader(index, -1)}>
                  ↑
                </button>
                <button type="button" className="rounded border border-line px-2 py-1" onClick={() => moveHeader(index, 1)}>
                  ↓
                </button>
              </li>
            ))}
          </ul>
          <label className="block space-y-1 text-sm font-semibold">
            Map sheet headers (one per line)
            <textarea
              value={mapHeadersText}
              onChange={(e) => setMapHeadersText(e.target.value)}
              rows={8}
              className="w-full rounded-md border border-line bg-canvas px-3 py-2 font-mono text-xs font-normal"
            />
          </label>
        </div>
      </div>

      {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
      {saved ? <p className="text-sm font-semibold text-brand">Saved.</p> : null}
      <button type="submit" disabled={pending} className="min-h-12 rounded-md bg-primary px-5 font-semibold text-on-primary disabled:opacity-60">
        {pending ? "Saving…" : "Save template"}
      </button>
    </form>
  );
}
