/**
 * Create / update the first platform owner.
 * Usage: npx tsx --env-file=.env scripts/bootstrap-platform.ts
 * Env: PLATFORM_BOOTSTRAP_EMAIL, PLATFORM_BOOTSTRAP_PASSWORD, PLATFORM_BOOTSTRAP_NAME
 */
import { eq } from "drizzle-orm";
import { hashPassword } from "../src/server/auth/password";
import { getDb, getSql, withBypassRls } from "../src/server/db/client";
import { platformStaff } from "../src/server/db/schema";

async function main() {
  const email = (process.env.PLATFORM_BOOTSTRAP_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.PLATFORM_BOOTSTRAP_PASSWORD ?? "";
  const name = (process.env.PLATFORM_BOOTSTRAP_NAME ?? "Platform Owner").trim();
  if (!email || !password || password.length < 10) {
    console.error("Set PLATFORM_BOOTSTRAP_EMAIL and PLATFORM_BOOTSTRAP_PASSWORD (≥10 chars).");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  await withBypassRls(async () => {
    const db = getDb();
    const [existing] = await db.select({ id: platformStaff.id }).from(platformStaff).where(eq(platformStaff.email, email)).limit(1);
    if (existing) {
      await db
        .update(platformStaff)
        .set({ name, passwordHash, role: "owner", disabledAt: null, updatedAt: new Date() })
        .where(eq(platformStaff.id, existing.id));
      console.log(`Updated platform owner ${email}`);
      return;
    }
    await db.insert(platformStaff).values({ email, name, passwordHash, role: "owner" });
    console.log(`Created platform owner ${email}`);
  });

  await getSql().end({ timeout: 1 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
