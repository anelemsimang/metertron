/**
 * Tenant #1 migration / verification.
 *
 *   npx tsx --env-file=.env scripts/migrate-tenant1.ts --dry-run
 *   npx tsx --env-file=.env scripts/migrate-tenant1.ts --apply
 *
 * Note: uses direct DB access (Supabase postgres role bypasses RLS). App traffic must use withOrg GUCs.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { count, eq, sql } from "drizzle-orm";
import { EXPORT_HEADERS, MAP_EXPORT_HEADERS } from "../src/domain/export/headers";
import { getDb, getSql } from "../src/server/db/client";
import {
  contractGrants,
  contracts,
  exportTemplates,
  jobPhotos,
  jobs,
  organisationMemberships,
  organisations,
  stockItems,
  stockMovements,
  users,
  workOrders,
} from "../src/server/db/schema";
import { membershipFromOrgRole } from "../src/lib/membership";

const dryRun = process.argv.includes("--dry-run") || !process.argv.includes("--apply");

async function counts() {
  const db = getDb();
  const tables = {
    organisations,
    users,
    memberships: organisationMemberships,
    contracts,
    jobs,
    job_photos: jobPhotos,
    work_orders: workOrders,
    stock_items: stockItems,
    stock_movements: stockMovements,
    contract_grants: contractGrants,
    export_templates: exportTemplates,
  } as const;
  const out: Record<string, number> = {};
  for (const [name, table] of Object.entries(tables)) {
    const [row] = await db.select({ value: count() }).from(table);
    out[name] = Number(row?.value ?? 0);
  }
  return out;
}

async function main() {
  console.log(dryRun ? "DRY RUN — no writes" : "APPLY — writing");
  const db = getDb();
  const before = await counts();
  const [org] = await db.select().from(organisations).orderBy(organisations.createdAt).limit(1);
  if (!org) {
    console.error("No organisation found.");
    process.exit(1);
  }

  const planned = {
    organisationId: org.id,
    fromSlug: org.slug,
    toSlug: org.slug === "metervault" || org.slug === "tenant-1" ? "tenant-1" : org.slug,
    fromName: org.name,
    toName: org.name === "MeterVault" ? "Organisation" : org.name,
    membershipsToEnsure: before.users,
    exportTemplate: "ethekwini-ws7761",
  };
  console.log(JSON.stringify({ planned, before }, null, 2));

  let after = before;
  if (!dryRun) {
    const trialEnds = org.trialEndsAt ?? new Date(Date.now() + 14 * 86400000);
    await db
      .update(organisations)
      .set({
        name: planned.toName,
        legalName: org.legalName === "MeterVault" ? "Organisation" : org.legalName,
        slug: planned.toSlug,
        status: org.status ?? "active",
        planKey: org.planKey || "trial",
        trialEndsAt: trialEnds,
        locale: org.locale || "en-ZA",
        timezone: org.timezone || "Africa/Johannesburg",
        currency: org.currency || "ZAR",
        updatedAt: new Date(),
      })
      .where(eq(organisations.id, org.id));

    const allUsers = await db.select().from(users).where(eq(users.organisationId, org.id));
    for (const user of allUsers) {
      await db
        .insert(organisationMemberships)
        .values({
          organisationId: org.id,
          userId: user.id,
          role: membershipFromOrgRole(user.orgRole),
        })
        .onConflictDoNothing();
    }

    await db
      .insert(exportTemplates)
      .values({
        organisationId: org.id,
        key: "ethekwini-ws7761",
        name: "eThekwini Municipality (WS7761)",
        sheetName: "Main",
        statusExportValue: "Final",
        headers: [...EXPORT_HEADERS],
        mapHeaders: [...MAP_EXPORT_HEADERS],
        listPhrases: { oldMeterSuffix: " was not on the list", connectionValue: "Not on the list" },
        sourceBuiltin: "ethekwini-ws7761",
        isDefault: true,
      })
      .onConflictDoNothing();

    await db.execute(sql`
      update job_photos
      set storage_key = organisation_id::text || '/installations/' || job_id::text || '/' || id::text || '.jpg'
      where organisation_id = ${org.id}
        and (storage_key is null or storage_key = '')
    `);

    after = await counts();
  }

  const report = { dryRun, planned, before, after, photosStorageKeysBackfilled: !dryRun };
  const outPath = path.join(process.cwd(), "docs", "MIGRATION_REPORT_TENANT1.md");
  const md = `# Tenant #1 migration report

Generated: ${new Date().toISOString()}
Mode: ${dryRun ? "dry-run" : "apply"}

\`\`\`json
${JSON.stringify(report, null, 2)}
\`\`\`

## Record counts

| Table | Before | After |
|-------|--------|-------|
${Object.keys(before)
  .map((k) => `| ${k} | ${before[k]} | ${after[k]} |`)
  .join("\n")}

## Notes

- Existing operational data kept; brand display renamed only when it was still MeterVault.
- Memberships mapped: head→owner, admin→admin, member→technician.
- Default export template \`ethekwini-ws7761\` mirrors current \`EXPORT_HEADERS\`.
- Photo \`storage_key\` paths backfilled; bytea retained until object-storage cutover.
`;

  await writeFile(outPath, md);
  console.log(`Wrote ${outPath}`);
  if (dryRun) console.log("Re-run with --apply to write.");
  await getSql().end({ timeout: 1 });
}

main().catch(async (error) => {
  console.error(error);
  try {
    await getSql().end({ timeout: 1 });
  } catch {
    /* ignore */
  }
  process.exit(1);
});
