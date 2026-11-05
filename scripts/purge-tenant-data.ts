/**
 * Delete all organisations and related tenant rows.
 * Keeps platform staff, plans, and global announcements.
 *
 * Usage: npx tsx --env-file=.env scripts/purge-tenant-data.ts
 */
import { sql } from "drizzle-orm";
import { getDb, getSql, withBypassRls } from "../src/server/db/client";

async function main() {
  const result = await withBypassRls(async () => {
    const db = getDb();
    const before = await db.execute(sql`select count(*)::int as count from organisations`);
    const beforeCount =
      (before as unknown as { count?: number }[])[0]?.count ??
      (before as unknown as { rows: { count?: number }[] }).rows?.[0]?.count ??
      0;

    await db.execute(sql`
      truncate table
        webhook_deliveries,
        webhook_endpoints,
        api_keys,
        organisation_support_notes,
        platform_support_sessions,
        support_access_events,
        platform_audit_events,
        billing_events,
        invoices,
        usage_periods,
        organisation_subscriptions,
        trial_claims,
        export_templates,
        export_runs,
        stock_movements,
        stock_items,
        quality_flags,
        job_photos,
        job_faults,
        jobs,
        work_orders,
        form_versions,
        meter_types,
        meter_classes,
        meter_sizes,
        installers,
        towns,
        contract_grants,
        contracts,
        sessions,
        auth_tokens,
        organisation_invites,
        organisation_memberships,
        users,
        feature_flags,
        organisations
      restart identity cascade
    `);

    return { beforeCount };
  });

  console.log(`Purged ${result.beforeCount} organisation(s) and related tenant data.`);
  await getSql().end({ timeout: 1 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
