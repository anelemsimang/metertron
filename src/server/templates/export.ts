import { and, asc, desc, eq } from "drizzle-orm";
import { BUILTIN_ETHEKWINI, BUILTIN_ETHEKWINI_KEY, builtinExportDefinitions } from "@/domain/export/builtin-ethekwini";
import type { ExportWorkbookTemplate } from "@/domain/export/workbook";
import { getDb } from "@/server/db/client";
import { exportTemplates } from "@/server/db/schema";

export type ExportTemplateRow = {
  id: string;
  organisationId: string;
  key: string;
  name: string;
  sheetName: string;
  statusExportValue: string;
  headers: string[];
  mapHeaders: string[];
  listPhrases: { oldMeterSuffix: string; connectionValue: string };
  sourceBuiltin: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function asPhrases(value: unknown): { oldMeterSuffix: string; connectionValue: string } {
  if (
    value &&
    typeof value === "object" &&
    typeof (value as { oldMeterSuffix?: unknown }).oldMeterSuffix === "string" &&
    typeof (value as { connectionValue?: unknown }).connectionValue === "string"
  ) {
    return {
      oldMeterSuffix: (value as { oldMeterSuffix: string }).oldMeterSuffix,
      connectionValue: (value as { connectionValue: string }).connectionValue,
    };
  }
  return { ...BUILTIN_ETHEKWINI.listPhrases };
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback];
  return value.filter((item): item is string => typeof item === "string");
}

function mapRow(row: typeof exportTemplates.$inferSelect): ExportTemplateRow {
  return {
    id: row.id,
    organisationId: row.organisationId,
    key: row.key,
    name: row.name,
    sheetName: row.sheetName,
    statusExportValue: row.statusExportValue,
    headers: asStringArray(row.headers, [...BUILTIN_ETHEKWINI.headers]),
    mapHeaders: asStringArray(row.mapHeaders, [...BUILTIN_ETHEKWINI.mapHeaders]),
    listPhrases: asPhrases(row.listPhrases),
    sourceBuiltin: row.sourceBuiltin,
    isDefault: row.isDefault,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Clone built-in municipal templates into the org when missing (idempotent). */
export async function ensureBuiltinExportTemplates(organisationId: string) {
  const db = getDb();
  const existing = await db
    .select({ key: exportTemplates.key, isDefault: exportTemplates.isDefault })
    .from(exportTemplates)
    .where(eq(exportTemplates.organisationId, organisationId));
  const keys = new Set(existing.map((row) => row.key));
  let hasDefault = existing.some((row) => row.isDefault);
  const created: string[] = [];

  for (const builtin of builtinExportDefinitions()) {
    if (keys.has(builtin.key)) continue;
    const makeDefault = !hasDefault && builtin.key === BUILTIN_ETHEKWINI_KEY;
    await db.insert(exportTemplates).values({
      organisationId,
      key: builtin.key,
      name: builtin.name,
      sheetName: builtin.sheetName,
      statusExportValue: builtin.statusExportValue,
      headers: builtin.headers,
      mapHeaders: builtin.mapHeaders,
      listPhrases: builtin.listPhrases,
      sourceBuiltin: builtin.sourceBuiltin,
      isDefault: makeDefault,
    });
    created.push(builtin.key);
    if (makeDefault) hasDefault = true;
  }

  return created;
}

export async function listExportTemplates(organisationId: string) {
  await ensureBuiltinExportTemplates(organisationId);
  const rows = await getDb()
    .select()
    .from(exportTemplates)
    .where(eq(exportTemplates.organisationId, organisationId))
    .orderBy(desc(exportTemplates.isDefault), asc(exportTemplates.name));
  return rows.map(mapRow);
}

export async function getExportTemplate(organisationId: string, id: string) {
  const [row] = await getDb()
    .select()
    .from(exportTemplates)
    .where(and(eq(exportTemplates.organisationId, organisationId), eq(exportTemplates.id, id)))
    .limit(1);
  return row ? mapRow(row) : null;
}

export async function getDefaultExportTemplate(organisationId: string): Promise<ExportTemplateRow | null> {
  await ensureBuiltinExportTemplates(organisationId);
  const db = getDb();
  const [preferred] = await db
    .select()
    .from(exportTemplates)
    .where(and(eq(exportTemplates.organisationId, organisationId), eq(exportTemplates.isDefault, true)))
    .limit(1);
  if (preferred) return mapRow(preferred);
  const [any] = await db
    .select()
    .from(exportTemplates)
    .where(eq(exportTemplates.organisationId, organisationId))
    .orderBy(asc(exportTemplates.createdAt))
    .limit(1);
  return any ? mapRow(any) : null;
}

export function workbookConfigFromTemplate(template: ExportTemplateRow | null | undefined): ExportWorkbookTemplate | undefined {
  if (!template) return undefined;
  return {
    sheetName: template.sheetName,
    headers: template.headers,
    mapHeaders: template.mapHeaders,
  };
}

export type ExportTemplatePatch = {
  name?: string;
  sheetName?: string;
  statusExportValue?: string;
  headers?: string[];
  mapHeaders?: string[];
  listPhrases?: { oldMeterSuffix: string; connectionValue: string };
  isDefault?: boolean;
};

export async function updateExportTemplate(organisationId: string, id: string, patch: ExportTemplatePatch) {
  const db = getDb();
  const current = await getExportTemplate(organisationId, id);
  if (!current) return null;

  if (patch.isDefault === true) {
    await db
      .update(exportTemplates)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(and(eq(exportTemplates.organisationId, organisationId), eq(exportTemplates.isDefault, true)));
  }

  const [row] = await db
    .update(exportTemplates)
    .set({
      ...(patch.name !== undefined ? { name: patch.name.trim() || current.name } : {}),
      ...(patch.sheetName !== undefined ? { sheetName: patch.sheetName.trim() || "Main" } : {}),
      ...(patch.statusExportValue !== undefined ? { statusExportValue: patch.statusExportValue.trim() || "Final" } : {}),
      ...(patch.headers !== undefined ? { headers: patch.headers } : {}),
      ...(patch.mapHeaders !== undefined ? { mapHeaders: patch.mapHeaders } : {}),
      ...(patch.listPhrases !== undefined ? { listPhrases: patch.listPhrases } : {}),
      ...(patch.isDefault !== undefined ? { isDefault: patch.isDefault } : {}),
      updatedAt: new Date(),
    })
    .where(and(eq(exportTemplates.organisationId, organisationId), eq(exportTemplates.id, id)))
    .returning();

  return row ? mapRow(row) : null;
}

export async function cloneExportTemplate(
  organisationId: string,
  sourceId: string,
  input: { key: string; name: string },
) {
  const source = await getExportTemplate(organisationId, sourceId);
  if (!source) return null;
  const key = input.key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
  if (!key) throw new Error("Enter a template key.");
  const [row] = await getDb()
    .insert(exportTemplates)
    .values({
      organisationId,
      key,
      name: input.name.trim() || `${source.name} copy`,
      sheetName: source.sheetName,
      statusExportValue: source.statusExportValue,
      headers: source.headers,
      mapHeaders: source.mapHeaders,
      listPhrases: source.listPhrases,
      sourceBuiltin: source.sourceBuiltin,
      isDefault: false,
    })
    .returning();
  return row ? mapRow(row) : null;
}
