import { getSql } from "../src/server/db/client";

async function main() {
  const sql = getSql();
  const tables = await sql`
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename in ('organisation_invites', 'auth_tokens')
    order by 1
  `;
  const cols = await sql`
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and (
        (table_name = 'organisations' and column_name = 'onboarding_completed_at')
        or (table_name = 'users' and column_name in ('totp_secret', 'totp_enabled_at'))
      )
    order by 1, 2
  `;
  const enumHit = await sql`
    select 1 as ok from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'auth_token_kind'
  `;
  const jobCount = await sql`select count(*)::int as n from jobs`;
  const userCount = await sql`select count(*)::int as n from users`;
  const orgCount = await sql`select count(*)::int as n from organisations`;

  console.log("phase3_tables", tables.map((t) => t.tablename).join(",") || "(none)");
  console.log("phase3_columns", cols.map((c) => `${c.table_name}.${c.column_name}`).join(",") || "(none)");
  console.log("auth_token_kind", enumHit.length ? "present" : "absent");
  console.log("counts", `orgs=${orgCount[0].n} users=${userCount[0].n} jobs=${jobCount[0].n}`);
  await sql.end({ timeout: 1 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
