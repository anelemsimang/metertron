import { getSql } from "../src/server/db/client";

async function main() {
  const sql = getSql();
  const tables = await sql`
    select tablename from pg_tables where schemaname = 'public' order by 1
  `;
  const enums = await sql`
    select typname
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typtype = 'e'
    order by 1
  `;
  const orgsCols = await sql`
    select column_name
    from information_schema.columns
    where table_schema = 'public' and table_name = 'organisations'
    order by ordinal_position
  `;
  const usersCols = await sql`
    select column_name
    from information_schema.columns
    where table_schema = 'public' and table_name = 'users'
    order by ordinal_position
  `;
  const rls = await sql`
    select c.relname, c.relrowsecurity, c.relforcerowsecurity
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
    order by 1
  `;
  console.log("TABLES", tables.map((t) => t.tablename).join(", ") || "(none)");
  console.log("ENUMS", enums.map((t) => t.typname).join(", ") || "(none)");
  console.log("ORGS", orgsCols.map((c) => c.column_name).join(", ") || "(none)");
  console.log("USERS", usersCols.map((c) => c.column_name).join(", ") || "(none)");
  console.log(
    "RLS",
    rls.map((r) => `${r.relname}:force=${r.relforcerowsecurity}`).join(", ") || "(none)",
  );
  await sql.end({ timeout: 1 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
