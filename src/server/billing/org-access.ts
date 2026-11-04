import { eq } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { organisations } from "@/server/db/schema";

export class OrgAccessError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.name = "OrgAccessError";
    this.status = status;
  }
}

export async function getOrganisationStatus(organisationId: string) {
  const [org] = await getDb()
    .select({
      id: organisations.id,
      status: organisations.status,
      planKey: organisations.planKey,
      trialEndsAt: organisations.trialEndsAt,
    })
    .from(organisations)
    .where(eq(organisations.id, organisationId))
    .limit(1);
  return org ?? null;
}

/** Blocks mutations when the org is read-only or suspended. Viewing remains allowed. */
export async function assertOrgWritable(organisationId: string) {
  const org = await getOrganisationStatus(organisationId);
  if (!org) throw new OrgAccessError("Organisation not found.", 404);
  if (org.status === "suspended") {
    throw new OrgAccessError("This organisation is suspended. Update billing to restore access.", 403);
  }
  if (org.status === "readonly") {
    throw new OrgAccessError("This organisation is read-only after a failed payment. Billing can still be updated.", 403);
  }
  if (org.status === "deleted") {
    throw new OrgAccessError("This organisation is closed.", 403);
  }
  return org;
}
