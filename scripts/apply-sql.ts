/**
 * Apply a SQL migration file (split on --> statement-breakpoint).
 * Usage: npx tsx --env-file=.env scripts/apply-sql.ts drizzle/0003_tenancy.sql
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSql } from "../src/server/db/client";

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: tsx scripts/apply-sql.ts <path-to.sql>");
    process.exit(1);
  }
  const absolute = path.resolve(file);
  const raw = await readFile(absolute, "utf8");
  const statements = raw
    .split(/-->\s*statement-breakpoint/)
    .map((part) => part.replace(/^--.*$/gm, "").trim())
    .filter(Boolean);

  const sql = getSql();
  console.log(`Applying ${statements.length} statements from ${absolute}`);
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    process.stdout.write(`  [${i + 1}/${statements.length}] `);
    try {
      await sql.unsafe(statement);
      console.log("ok");
    } catch (error) {
      console.log("FAILED");
      console.error(statement.slice(0, 200));
      throw error;
    }
  }
  console.log("Done.");
  await sql.end({ timeout: 1 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
