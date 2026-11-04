import { eq } from "drizzle-orm";
import { METERTRON_PLAN_KEY, TRIAL_DAYS } from "@/server/billing/plans";
import { getDb, withBypassRls } from "@/server/db/client";
import { organisations } from "@/server/db/schema";

export function slugifyOrgName(name: string) {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return base || "organisation";
}

async function uniqueSlug(base: string) {
  const db = getDb();
  let candidate = base;
  for (let i = 0; i < 50; i++) {
    const [hit] = await db.select({ id: organisations.id }).from(organisations).where(eq(organisations.slug, candidate)).limit(1);
    if (!hit) return candidate;
    candidate = `${base}-${i + 2}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function createOrganisation(input: { name: string; legalName?: string }) {
  const name = input.name.trim();
  if (name.length < 2) throw new Error("Enter your company name.");
  const legalName = (input.legalName ?? name).trim() || name;
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);

  return withBypassRls(async () => {
    const slug = await uniqueSlug(slugifyOrgName(name));
    const [organisation] = await getDb()
      .insert(organisations)
      .values({
        name,
        legalName,
        slug,
        status: "trialing",
        planKey: METERTRON_PLAN_KEY,
        trialEndsAt,
      })
      .returning({
        id: organisations.id,
        name: organisations.name,
        slug: organisations.slug,
        trialEndsAt: organisations.trialEndsAt,
        onboardingCompletedAt: organisations.onboardingCompletedAt,
      });
    return organisation;
  });
}
