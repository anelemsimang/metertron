import { getSql } from "../src/server/db/client";

async function main() {
  const sql = getSql();
  const [row] = await sql`select current_database() as db, inet_server_addr()::text as addr`;
  const tables = await sql`select count(*)::int as n from pg_tables where schemaname = 'public'`;
  console.log("ok", row.db, "public_tables=", tables[0].n);
  await sql.end({ timeout: 1 });
}

main().catch((error) => {
  console.error("FAIL", error instanceof Error ? error.message : error);
  process.exit(1);
});
