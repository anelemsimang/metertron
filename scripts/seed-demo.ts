/**
 * Create a demo organisation + owner for local demos.
 * Usage: npx tsx --env-file=.env scripts/seed-demo.ts
 * Env overrides: DEMO_EMAIL, DEMO_PASSWORD, DEMO_ORG_NAME
 */
import { eq } from "drizzle-orm";
import { hashPassword } from "../src/server/auth/password";
import { ensureMetertronPlan, ensureTrialSubscription } from "../src/server/billing/subscriptions";
import { getDb, getSql, withBypassRls } from "../src/server/db/client";
import { organisationMemberships, organisations, users } from "../src/server/db/schema";
import { METERTRON_PLAN_KEY, TRIAL_DAYS } from "../src/server/billing/plans";

async function main() {
  const email = (process.env.DEMO_EMAIL ?? "demo@metertron.local").trim().toLowerCase();
  const password = process.env.DEMO_PASSWORD ?? "demo-password-change-me";
  const orgName = process.env.DEMO_ORG_NAME ?? "Demo Contractor";
  const passwordHash = await hashPassword(password);

  await ensureMetertronPlan();

  const result = await withBypassRls(async () => {
    const db = getDb();
    const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) {
      return { created: false, email, orgName };
    }

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);
    const slug = `demo-${Date.now().toString(36)}`;
    const [org] = await db
      .insert(organisations)
      .values({
        name: orgName,
        legalName: orgName,
        slug,
        status: "trialing",
        planKey: METERTRON_PLAN_KEY,
        trialEndsAt,
        onboardingCompletedAt: new Date(),
      })
      .returning({ id: organisations.id, slug: organisations.slug });

    const [user] = await db
      .insert(users)
      .values({
        organisationId: org.id,
        orgRole: "head",
        name: "Demo Owner",
        username: "demo",
        email,
        passwordHash,
        emailVerified: true,
      })
      .returning({ id: users.id });

    await db.insert(organisationMemberships).values({
      organisationId: org.id,
      userId: user.id,
      role: "owner",
    });

    await ensureTrialSubscription(org.id);
    return { created: true, email, orgName, slug: org.slug };
  });

  console.log(result.created ? "Demo tenant created." : "Demo user already exists.");
  console.log(`  email: ${email}`);
  console.log(`  password: ${password}`);
  if ("slug" in result) console.log(`  org slug: ${result.slug}`);
  await getSql().end({ timeout: 1 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
