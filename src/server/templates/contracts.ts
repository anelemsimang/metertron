import { eq } from "drizzle-orm";
import { BUILTIN_ETHEKWINI } from "@/domain/export/builtin-ethekwini";
import { getDb } from "@/server/db/client";
import { contracts, organisations } from "@/server/db/schema";
import { ensureDefaultCatalogs } from "@/server/templates/catalogs";

/** First deployment for a new org — enough to publish forms and catalogs. */
export async function ensureDefaultContract(organisationId: string) {
  const db = getDb();
  const [existing] = await db
    .select({ id: contracts.id })
    .from(contracts)
    .where(eq(contracts.organisationId, organisationId))
    .limit(1);
  if (existing) {
    await ensureDefaultCatalogs(organisationId, existing.id);
    return existing;
  }

  const [org] = await db
    .select({ name: organisations.name })
    .from(organisations)
    .where(eq(organisations.id, organisationId))
    .limit(1);

  const companyName = org?.name?.trim() || "Organisation";
  const [created] = await db
    .insert(contracts)
    .values({
      organisationId,
      municipalityName: "eThekwini Municipality",
      code: "WS7761",
      name: "Meter change",
      deploymentName: `${companyName} · WS7761`,
      companyName,
      exportFilenamePattern: "{company}_{yyyy-mm-dd}",
      exportSheetName: BUILTIN_ETHEKWINI.sheetName,
      statusExportValue: BUILTIN_ETHEKWINI.statusExportValue,
      approvalLevels: 1,
      listPhrases: { ...BUILTIN_ETHEKWINI.listPhrases },
      timezone: "Africa/Johannesburg",
    })
    .returning({ id: contracts.id });

  await ensureDefaultCatalogs(organisationId, created.id);
  return created;
}
