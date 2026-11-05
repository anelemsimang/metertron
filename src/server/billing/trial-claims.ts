import { eq } from "drizzle-orm";
import { getDb, withBypassRls } from "@/server/db/client";
import { trialClaims } from "@/server/db/schema";

export async function hasUsedFreeTrial(email: string) {
  const normalised = email.trim().toLowerCase();
  if (!normalised) return false;
  return withBypassRls(async () => {
    const [row] = await getDb()
      .select({ email: trialClaims.email })
      .from(trialClaims)
      .where(eq(trialClaims.email, normalised))
      .limit(1);
    return Boolean(row);
  });
}

export async function recordFreeTrialClaim(email: string, organisationId: string) {
  const normalised = email.trim().toLowerCase();
  if (!normalised) return;
  await withBypassRls(async () => {
    await getDb()
      .insert(trialClaims)
      .values({ email: normalised, organisationId, claimedAt: new Date() })
      .onConflictDoNothing({ target: trialClaims.email });
  });
}
