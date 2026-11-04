import { and, asc, desc, eq, max } from "drizzle-orm";
import { METER_CHANGE_V1 } from "@/domain/forms/meter-change-v1";
import type { FormDefinition, FormField, FormSection } from "@/domain/forms/types";
import { getDb } from "@/server/db/client";
import { contracts, formVersions } from "@/server/db/schema";

export type FormVersionRow = {
  id: string;
  organisationId: string;
  contractId: string;
  key: string;
  version: number;
  status: "draft" | "published" | "retired";
  schema: FormDefinition;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const FIELD_TYPES = new Set([
  "date",
  "select",
  "text",
  "integer",
  "boolean",
  "town",
  "installer",
  "photo",
  "catalog",
  "locked_text",
]);

function asField(value: unknown): FormField | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.label !== "string" || typeof row.type !== "string") return null;
  if (!FIELD_TYPES.has(row.type)) return null;
  return {
    id: row.id,
    label: row.label,
    type: row.type as FormField["type"],
    required: row.required === true,
    ...(typeof row.exportHeader === "string" ? { exportHeader: row.exportHeader } : {}),
    ...(typeof row.requiredUnless === "string" ? { requiredUnless: row.requiredUnless } : {}),
    ...(row.multiple === true ? { multiple: true } : {}),
    ...(row.locked === true ? { locked: true } : {}),
    ...(typeof row.defaultValue === "string" ? { defaultValue: row.defaultValue } : {}),
    ...(typeof row.defaultFrom === "string" ? { defaultFrom: row.defaultFrom as FormField["defaultFrom"] } : {}),
    ...(Array.isArray(row.options) ? { options: row.options as FormField["options"] } : {}),
    ...(row.catalog === "size" || row.catalog === "class" || row.catalog === "type" ? { catalog: row.catalog } : {}),
    ...(row.pattern && typeof row.pattern === "object" ? { pattern: row.pattern as FormField["pattern"] } : {}),
    ...(row.forbidPattern && typeof row.forbidPattern === "object"
      ? { forbidPattern: row.forbidPattern as FormField["forbidPattern"] }
      : {}),
    ...(typeof row.help === "string" ? { help: row.help } : {}),
    ...(row.gps === true ? { gps: true } : {}),
  };
}

function asSection(value: unknown): FormSection | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.title !== "string" || !Array.isArray(row.fields)) return null;
  const fields = row.fields.map(asField).filter((field): field is FormField => field !== null);
  return { id: row.id, title: row.title, fields };
}

export function parseFormSchema(value: unknown, fallbackKey = "meter-change", fallbackVersion = 1): FormDefinition {
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    const sections = Array.isArray(row.sections)
      ? row.sections.map(asSection).filter((section): section is FormSection => section !== null)
      : [];
    if (sections.length > 0) {
      return {
        key: typeof row.key === "string" && row.key ? row.key : fallbackKey,
        version: typeof row.version === "number" && Number.isInteger(row.version) ? row.version : fallbackVersion,
        sections,
      };
    }
  }
  return {
    key: METER_CHANGE_V1.key,
    version: METER_CHANGE_V1.version,
    sections: structuredClone(METER_CHANGE_V1.sections),
  };
}

function mapRow(row: typeof formVersions.$inferSelect): FormVersionRow {
  return {
    id: row.id,
    organisationId: row.organisationId,
    contractId: row.contractId,
    key: row.key,
    version: row.version,
    status: row.status,
    schema: parseFormSchema(row.schema, row.key, row.version),
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listOrgContracts(organisationId: string) {
  return getDb()
    .select({
      id: contracts.id,
      code: contracts.code,
      name: contracts.name,
      municipalityName: contracts.municipalityName,
    })
    .from(contracts)
    .where(eq(contracts.organisationId, organisationId))
    .orderBy(asc(contracts.code));
}

export async function listFormVersions(organisationId: string, contractId?: string) {
  const db = getDb();
  const filters = [eq(formVersions.organisationId, organisationId)];
  if (contractId) filters.push(eq(formVersions.contractId, contractId));
  const rows = await db
    .select()
    .from(formVersions)
    .where(and(...filters))
    .orderBy(asc(formVersions.key), desc(formVersions.version));
  return rows.map(mapRow);
}

export async function getFormVersion(organisationId: string, id: string) {
  const [row] = await getDb()
    .select()
    .from(formVersions)
    .where(and(eq(formVersions.organisationId, organisationId), eq(formVersions.id, id)))
    .limit(1);
  return row ? mapRow(row) : null;
}

/** Latest published form for a contract key, or null when none exists. */
export async function getPublishedForm(organisationId: string, contractId: string, key = "meter-change") {
  const [row] = await getDb()
    .select()
    .from(formVersions)
    .where(
      and(
        eq(formVersions.organisationId, organisationId),
        eq(formVersions.contractId, contractId),
        eq(formVersions.key, key),
        eq(formVersions.status, "published"),
      ),
    )
    .orderBy(desc(formVersions.version))
    .limit(1);
  return row ? mapRow(row) : null;
}

/** Field runtime: published tenant form, else built-in METER_CHANGE_V1. */
export async function resolveFieldForm(organisationId: string): Promise<FormDefinition> {
  const db = getDb();
  const [contract] = await db.select({ id: contracts.id }).from(contracts).where(eq(contracts.organisationId, organisationId)).limit(1);
  if (contract) {
    const published = await getPublishedForm(organisationId, contract.id, "meter-change");
    if (published) return published.schema;
  }
  return {
    key: METER_CHANGE_V1.key,
    version: METER_CHANGE_V1.version,
    sections: structuredClone(METER_CHANGE_V1.sections),
  };
}

export async function seedMeterChangeDraft(organisationId: string, contractId: string) {
  const db = getDb();
  const [contract] = await db
    .select({ id: contracts.id })
    .from(contracts)
    .where(and(eq(contracts.id, contractId), eq(contracts.organisationId, organisationId)))
    .limit(1);
  if (!contract) throw new Error("That contract was not found.");

  const [latest] = await db
    .select({ version: max(formVersions.version) })
    .from(formVersions)
    .where(
      and(
        eq(formVersions.organisationId, organisationId),
        eq(formVersions.contractId, contractId),
        eq(formVersions.key, "meter-change"),
      ),
    );
  const nextVersion = Number(latest?.version ?? 0) + 1;
  const schema: FormDefinition = {
    key: "meter-change",
    version: nextVersion,
    sections: structuredClone(METER_CHANGE_V1.sections),
  };
  const [row] = await db
    .insert(formVersions)
    .values({
      organisationId,
      contractId,
      key: "meter-change",
      version: nextVersion,
      status: "draft",
      schema,
    })
    .returning();
  return mapRow(row);
}

export async function saveFormDraft(organisationId: string, id: string, schema: FormDefinition) {
  const current = await getFormVersion(organisationId, id);
  if (!current) return null;
  if (current.status !== "draft") throw new Error("Only a draft form can be edited.");
  const cleaned = parseFormSchema({ ...schema, key: current.key, version: current.version }, current.key, current.version);
  const [row] = await getDb()
    .update(formVersions)
    .set({ schema: cleaned, updatedAt: new Date() })
    .where(and(eq(formVersions.organisationId, organisationId), eq(formVersions.id, id)))
    .returning();
  return row ? mapRow(row) : null;
}

export async function publishFormVersion(organisationId: string, id: string) {
  const current = await getFormVersion(organisationId, id);
  if (!current) return null;
  if (current.status === "published") return current;
  const db = getDb();
  await db
    .update(formVersions)
    .set({ status: "retired", updatedAt: new Date() })
    .where(
      and(
        eq(formVersions.organisationId, organisationId),
        eq(formVersions.contractId, current.contractId),
        eq(formVersions.key, current.key),
        eq(formVersions.status, "published"),
      ),
    );
  const [row] = await db
    .update(formVersions)
    .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(formVersions.organisationId, organisationId), eq(formVersions.id, id)))
    .returning();
  return row ? mapRow(row) : null;
}
