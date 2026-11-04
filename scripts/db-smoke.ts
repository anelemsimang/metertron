import { sql } from "drizzle-orm";
import { getDb, getSql, withBypassRls, withOrg } from "../src/server/db/client";
import { organisations } from "../src/server/db/schema";

async function main() {
  console.log("1. plain select");
  const db = getDb();
  const rows = await db.select({ id: organisations.id, slug: organisations.slug }).from(organisations).limit(3);
  console.log(rows);

  console.log("2. withBypassRls");
  await withBypassRls(async () => {
    const n = await getDb().execute(sql`select current_setting('app.bypass_rls', true) as v`);
    console.log(n);
  });

  console.log("3. withOrg");
  if (rows[0]) {
    await withOrg(rows[0].id, async () => {
      const n = await getDb().execute(sql`select current_setting('app.current_org_id', true) as v`);
      console.log(n);
    });
  }
  console.log("ok");
  await getSql().end({ timeout: 1 });
}

main().catch(async (e) => {
  console.error(e);
  await getSql().end({ timeout: 1 }).catch(() => undefined);
  process.exit(1);
});
