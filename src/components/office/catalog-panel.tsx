"use client";

import { useState, type FormEvent } from "react";

type ContractOption = { id: string; code: string; name: string };
type CatalogItem = {
  id: string;
  contractId: string;
  kind: "size" | "class" | "type";
  code: string;
  exportString: string;
  isDefault: boolean;
};
type ZoneItem = { id: string; contractId: string; name: string };

export function CatalogPanel({
  contracts,
  initialContractId,
  initialItems,
  initialZones,
}: {
  contracts: ContractOption[];
  initialContractId: string | null;
  initialItems: CatalogItem[];
  initialZones: ZoneItem[];
}) {
  const [contractId, setContractId] = useState(initialContractId ?? contracts[0]?.id ?? "");
  const [items, setItems] = useState(initialItems);
  const [zones, setZones] = useState(initialZones);
  const [kind, setKind] = useState<"size" | "class" | "type">("size");
  const [code, setCode] = useState("");
  const [exportString, setExportString] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function reload(nextContractId: string) {
    const response = await fetch(`/api/office/catalogs?contractId=${encodeURIComponent(nextContractId)}`);
    if (!response.ok) return;
    const body = (await response.json()) as { items?: CatalogItem[]; zones?: ZoneItem[] };
    setItems(body.items ?? []);
    setZones(body.zones ?? []);
  }

  async function addCatalog(event: FormEvent) {
    event.preventDefault();
    if (!contractId) return;
    setPending(true);
    setError("");
    const response = await fetch("/api/office/catalogs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contractId, kind, code, exportString, isDefault: false }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setError(body?.error ?? "Could not save catalog item.");
      return;
    }
    setCode("");
    setExportString("");
    await reload(contractId);
  }

  async function addZone(event: FormEvent) {
    event.preventDefault();
    if (!contractId) return;
    setPending(true);
    setError("");
    const response = await fetch("/api/office/catalogs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contractId, kind: "zone", name: zoneName }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setError(body?.error ?? "Could not save town.");
      return;
    }
    setZoneName("");
    await reload(contractId);
  }

  return (
    <section className="space-y-4">
      <h2 className="section-title text-xl">Catalogs & towns</h2>
      <label className="block max-w-md space-y-1 text-sm font-semibold">
        Contract
        <select
          value={contractId}
          onChange={(event) => {
            const next = event.target.value;
            setContractId(next);
            void reload(next);
          }}
          className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal"
        >
          {contracts.map((contract) => (
            <option key={contract.id} value={contract.id}>
              {contract.code} — {contract.name}
            </option>
          ))}
        </select>
      </label>

      <form onSubmit={addCatalog} className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-end">
        <label className="block space-y-1 text-sm font-semibold sm:w-36">
          Kind
          <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal">
            <option value="size">Size</option>
            <option value="class">Class</option>
            <option value="type">Type</option>
          </select>
        </label>
        <label className="block flex-1 space-y-1 text-sm font-semibold">
          Code
          <input required value={code} onChange={(e) => setCode(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
        </label>
        <label className="block flex-1 space-y-1 text-sm font-semibold">
          Export string
          <input value={exportString} onChange={(e) => setExportString(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
        </label>
        <button type="submit" disabled={pending} className="min-h-12 rounded-md bg-primary px-4 font-semibold text-on-primary disabled:opacity-60">
          Add
        </button>
      </form>

      <ul className="divide-y divide-line rounded-lg border border-line bg-surface text-sm">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3 px-4 py-2">
            <span>
              <span className="font-semibold uppercase text-muted">{item.kind}</span> · {item.code}
            </span>
            <span className="text-muted">{item.exportString}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={addZone} className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-end">
        <label className="block flex-1 space-y-1 text-sm font-semibold">
          Town / zone
          <input required value={zoneName} onChange={(e) => setZoneName(e.target.value)} className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal" />
        </label>
        <button type="submit" disabled={pending} className="min-h-12 rounded-md border border-line px-4 font-semibold disabled:opacity-60">
          Add town
        </button>
      </form>
      <ul className="flex flex-wrap gap-2 text-sm">
        {zones.map((zone) => (
          <li key={zone.id} className="rounded-full border border-line bg-canvas px-3 py-1">
            {zone.name}
          </li>
        ))}
      </ul>
      {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
    </section>
  );
}
