import { desc, eq } from "drizzle-orm";
import { requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { exportTemplates, formVersions, organisations } from "@/server/db/schema";

export async function GET() {
  const gate = await requirePlatformStaff("view");
  if ("error" in gate) return gate.error;
  try {
    const data = await withBypassRls(async () => {
      const db = getDb();
      const exports = await db
        .select({
          id: exportTemplates.id,
          key: exportTemplates.key,
          name: exportTemplates.name,
          organisationId: exportTemplates.organisationId,
          organisationName: organisations.name,
          isDefault: exportTemplates.isDefault,
          sourceBuiltin: exportTemplates.sourceBuiltin,
          updatedAt: exportTemplates.updatedAt,
        })
        .from(exportTemplates)
        .innerJoin(organisations, eq(exportTemplates.organisationId, organisations.id))
        .orderBy(desc(exportTemplates.updatedAt))
        .limit(100);
      const forms = await db
        .select({
          id: formVersions.id,
          key: formVersions.key,
          version: formVersions.version,
          status: formVersions.status,
          organisationId: formVersions.organisationId,
          organisationName: organisations.name,
          updatedAt: formVersions.updatedAt,
        })
        .from(formVersions)
        .innerJoin(organisations, eq(formVersions.organisationId, organisations.id))
        .orderBy(desc(formVersions.updatedAt))
        .limit(100);
      return { exports, forms };
    });
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
