import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { contracts, meterClasses, meterSizes, meterTypes, towns } from "@/server/db/schema";

export type CatalogKind = "size" | "class" | "type";

export type CatalogItem = {
  id: string;
  organisationId: string;
  contractId: string;
  kind: CatalogKind;
  code: string;
  exportString: string;
  isDefault: boolean;
};

export type ZoneItem = {
  id: string;
  organisationId: string;
  contractId: string;
  name: string;
  normalisedName: string;
};

const TABLES = {
  size: meterSizes,
  class: meterClasses,
  type: meterTypes,
} as const;

export async function listCatalogItems(organisationId: string, contractId?: string) {
  const db = getDb();
  const result: CatalogItem[] = [];
  for (const kind of ["size", "class", "type"] as const) {
    const table = TABLES[kind];
    const filters = [eq(table.organisationId, organisationId)];
    if (contractId) filters.push(eq(table.contractId, contractId));
    const rows = await db
      .select()
      .from(table)
      .where(and(...filters))
      .orderBy(asc(table.code));
    for (const row of rows) {
      result.push({
        id: row.id,
        organisationId: row.organisationId,
        contractId: row.contractId,
        kind,
        code: row.code,
        exportString: row.exportString,
        isDefault: row.isDefault,
      });
    }
  }
  return result;
}

export async function upsertCatalogItem(
  organisationId: string,
  input: { contractId: string; kind: CatalogKind; code: string; exportString: string; isDefault?: boolean },
) {
  const code = input.code.trim();
  const exportString = input.exportString.trim() || code;
  if (!code) throw new Error("Enter a code.");
  const db = getDb();
  const [contract] = await db
    .select({ id: contracts.id })
    .from(contracts)
    .where(and(eq(contracts.id, input.contractId), eq(contracts.organisationId, organisationId)))
    .limit(1);
  if (!contract) throw new Error("That contract was not found.");

  const table = TABLES[input.kind];
  const [existing] = await db
    .select({ id: table.id })
    .from(table)
    .where(and(eq(table.contractId, input.contractId), eq(table.code, code)))
    .limit(1);

  if (input.isDefault) {
    await db.update(table).set({ isDefault: false }).where(and(eq(table.contractId, input.contractId), eq(table.isDefault, true)));
  }

  if (existing) {
    const [row] = await db
      .update(table)
      .set({ exportString, isDefault: input.isDefault === true })
      .where(eq(table.id, existing.id))
      .returning();
    return {
      id: row.id,
      organisationId: row.organisationId,
      contractId: row.contractId,
      kind: input.kind,
      code: row.code,
      exportString: row.exportString,
      isDefault: row.isDefault,
    } satisfies CatalogItem;
  }

  const [row] = await db
    .insert(table)
    .values({
      organisationId,
      contractId: input.contractId,
      code,
      exportString,
      isDefault: input.isDefault === true,
    })
    .returning();
  return {
    id: row.id,
    organisationId: row.organisationId,
    contractId: row.contractId,
    kind: input.kind,
    code: row.code,
    exportString: row.exportString,
    isDefault: row.isDefault,
  } satisfies CatalogItem;
}

export async function listZones(organisationId: string, contractId?: string) {
  const filters = [eq(towns.organisationId, organisationId)];
  if (contractId) filters.push(eq(towns.contractId, contractId));
  const rows = await getDb()
    .select()
    .from(towns)
    .where(and(...filters))
    .orderBy(asc(towns.name));
  return rows.map(
    (row): ZoneItem => ({
      id: row.id,
      organisationId: row.organisationId,
      contractId: row.contractId,
      name: row.name,
      normalisedName: row.normalisedName,
    }),
  );
}

export async function upsertZone(organisationId: string, input: { contractId: string; name: string }) {
  const name = input.name.trim();
  if (!name) throw new Error("Enter a town or zone name.");
  const normalisedName = name.toLowerCase();
  const db = getDb();
  const [contract] = await db
    .select({ id: contracts.id })
    .from(contracts)
    .where(and(eq(contracts.id, input.contractId), eq(contracts.organisationId, organisationId)))
    .limit(1);
  if (!contract) throw new Error("That contract was not found.");

  const [existing] = await db
    .select()
    .from(towns)
    .where(and(eq(towns.contractId, input.contractId), eq(towns.normalisedName, normalisedName)))
    .limit(1);
  if (existing) {
    return {
      id: existing.id,
      organisationId: existing.organisationId,
      contractId: existing.contractId,
      name: existing.name,
      normalisedName: existing.normalisedName,
    } satisfies ZoneItem;
  }

  const [row] = await db
    .insert(towns)
    .values({ organisationId, contractId: input.contractId, name, normalisedName })
    .returning();
  return {
    id: row.id,
    organisationId: row.organisationId,
    contractId: row.contractId,
    name: row.name,
    normalisedName: row.normalisedName,
  } satisfies ZoneItem;
}

/** Default size/class/type rows used by field capture when a contract has an empty catalog. */
export const DEFAULT_CATALOG_SEED: Array<{ kind: CatalogKind; code: string; exportString: string }> = [
  { kind: "size", code: "15mm", exportString: "15mm" },
  { kind: "class", code: "class_d", exportString: "D" },
  { kind: "type", code: "ultrasonic", exportString: "Ultrasonic" },
];

export async function ensureDefaultCatalogs(organisationId: string, contractId: string) {
  const existing = await listCatalogItems(organisationId, contractId);
  if (existing.length > 0) return existing;
  const created: CatalogItem[] = [];
  for (const item of DEFAULT_CATALOG_SEED) {
    created.push(
      await upsertCatalogItem(organisationId, {
        contractId,
        kind: item.kind,
        code: item.code,
        exportString: item.exportString,
        isDefault: true,
      }),
    );
  }
  return created;
}
