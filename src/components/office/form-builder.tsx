"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormDefinition, FormField, FormSection } from "@/domain/forms/types";

type ContractOption = { id: string; code: string; name: string };
type FormSummary = {
  id: string;
  contractId: string;
  key: string;
  version: number;
  status: "draft" | "published" | "retired";
  schema: FormDefinition;
};

export function FormBuilderPanel({
  contracts,
  forms,
}: {
  contracts: ContractOption[];
  forms: FormSummary[];
}) {
  const router = useRouter();
  const [contractId, setContractId] = useState(contracts[0]?.id ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const visible = forms.filter((form) => !contractId || form.contractId === contractId);

  async function seedDraft() {
    if (!contractId) return;
    setPending(true);
    setError("");
    const response = await fetch("/api/office/forms", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contractId }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string; form?: { id: string } } | null;
    setPending(false);
    if (!response.ok || !body?.form) {
      setError(body?.error ?? "Could not create a draft.");
      return;
    }
    router.push(`/office/forms/${body.form.id}`);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1 space-y-1 text-sm font-semibold">
          Contract
          <select
            value={contractId}
            onChange={(event) => setContractId(event.target.value)}
            className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal"
          >
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.code} — {contract.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={pending || !contractId}
          onClick={() => void seedDraft()}
          className="min-h-12 rounded-md bg-primary px-4 font-semibold text-on-primary disabled:opacity-60"
        >
          {pending ? "Creating…" : "New draft from meter-change"}
        </button>
      </div>
      {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
      {visible.length === 0 ? (
        <p className="text-sm text-muted">No form versions yet. Create a draft seeded from the built-in meter-change form.</p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
          {visible.map((form) => (
            <li key={form.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">
                  {form.key} v{form.version}
                  <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-muted">{form.status}</span>
                </p>
                <p className="text-sm text-muted">{form.schema.sections.length} sections · {countFields(form.schema)} fields</p>
              </div>
              <Link href={`/office/forms/${form.id}`} className="inline-flex min-h-12 items-center rounded-md border border-line px-4 text-sm font-semibold">
                Open
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function countFields(schema: FormDefinition) {
  return schema.sections.reduce((sum, section) => sum + section.fields.length, 0);
}

export function FormDraftEditor({ form }: { form: FormSummary }) {
  const router = useRouter();
  const [schema, setSchema] = useState<FormDefinition>(form.schema);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const readOnly = form.status !== "draft";

  function updateField(sectionIndex: number, fieldIndex: number, patch: Partial<FormField>) {
    setSchema((current) => {
      const sections = current.sections.map((section, sIdx) => {
        if (sIdx !== sectionIndex) return section;
        return {
          ...section,
          fields: section.fields.map((field, fIdx) => (fIdx === fieldIndex ? { ...field, ...patch } : field)),
        };
      });
      return { ...current, sections };
    });
  }

  function updateSection(sectionIndex: number, patch: Partial<FormSection>) {
    setSchema((current) => ({
      ...current,
      sections: current.sections.map((section, index) => (index === sectionIndex ? { ...section, ...patch } : section)),
    }));
  }

  async function save() {
    setPending(true);
    setError("");
    setMessage("");
    const response = await fetch(`/api/office/forms/${form.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ schema }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setError(body?.error ?? "Could not save draft.");
      return;
    }
    setMessage("Draft saved.");
    router.refresh();
  }

  async function publish() {
    setPending(true);
    setError("");
    setMessage("");
    const response = await fetch(`/api/office/forms/${form.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setError(body?.error ?? "Could not publish.");
      return;
    }
    setMessage("Published. Field devices will use this schema.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        {form.key} v{form.version} · {form.status}
        {readOnly ? " (read-only)" : ""}
      </p>
      {schema.sections.map((section, sectionIndex) => (
        <section key={section.id} className="rounded-lg border border-line bg-surface p-4 shadow-sm">
          <label className="block space-y-1 text-sm font-semibold">
            Section title
            <input
              disabled={readOnly}
              value={section.title}
              onChange={(event) => updateSection(sectionIndex, { title: event.target.value })}
              className="min-h-12 w-full rounded-md border border-line bg-canvas px-3 font-normal disabled:opacity-70"
            />
          </label>
          <ul className="mt-4 space-y-3">
            {section.fields.map((field, fieldIndex) => (
              <li key={field.id} className="rounded-md border border-line bg-canvas p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block space-y-1 text-xs font-semibold">
                    Label
                    <input
                      disabled={readOnly}
                      value={field.label}
                      onChange={(event) => updateField(sectionIndex, fieldIndex, { label: event.target.value })}
                      className="min-h-10 w-full rounded-md border border-line bg-surface px-2 font-normal disabled:opacity-70"
                    />
                  </label>
                  <label className="block space-y-1 text-xs font-semibold">
                    Export header
                    <input
                      disabled={readOnly}
                      value={field.exportHeader ?? ""}
                      onChange={(event) => updateField(sectionIndex, fieldIndex, { exportHeader: event.target.value || undefined })}
                      className="min-h-10 w-full rounded-md border border-line bg-surface px-2 font-normal disabled:opacity-70"
                    />
                  </label>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded bg-surface px-2 py-1 font-mono text-muted">{field.type}</span>
                  <label className="inline-flex items-center gap-1 font-semibold">
                    <input
                      type="checkbox"
                      disabled={readOnly}
                      checked={field.required === true}
                      onChange={(event) => updateField(sectionIndex, fieldIndex, { required: event.target.checked })}
                    />
                    Required
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
      {message ? <p className="text-sm font-semibold text-brand">{message}</p> : null}
      {!readOnly ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={pending} onClick={() => void save()} className="min-h-12 rounded-md bg-primary px-4 font-semibold text-on-primary disabled:opacity-60">
            Save draft
          </button>
          <button type="button" disabled={pending} onClick={() => void publish()} className="min-h-12 rounded-md border-2 border-primary px-4 font-semibold text-brand disabled:opacity-60">
            Publish
          </button>
        </div>
      ) : null}
    </div>
  );
}
