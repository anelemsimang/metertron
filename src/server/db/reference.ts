import { and, count, eq } from "drizzle-orm";
import { membershipFromOrgRole } from "@/lib/membership";
import { getDb, withBypassRls } from "./client";
import { meterClasses, meterSizes, meterTypes, organisationMemberships, organisations, users } from "./schema";

let ready: Promise<{ id: string }> | null = null;

export function ensureOrganisation() {
  ready ??= upsert().catch((error: unknown) => {
    ready = null;
    throw error;
  });
  return ready;
}

async function upsert() {
  return withBypassRls(async () => {
    const db = getDb();
    const [existing] = await db.select().from(organisations).limit(1);
    if (existing) {
      const renameBrand =
        existing.name === "MeterVault" ||
        existing.legalName === "MeterVault" ||
        existing.slug === "metervault";
      if (!renameBrand) return { id: existing.id };
      const [organisation] = await db
        .update(organisations)
        .set({
          name: existing.name === "MeterVault" ? "Organisation" : existing.name,
          legalName: existing.legalName === "MeterVault" ? "Organisation" : existing.legalName,
          slug: existing.slug === "metervault" ? "tenant-1" : existing.slug,
          updatedAt: new Date(),
        })
        .where(eq(organisations.id, existing.id))
        .returning({ id: organisations.id });
      return organisation;
    }
    const trialEnds = new Date();
    trialEnds.setDate(trialEnds.getDate() + 14);
    const [organisation] = await db
      .insert(organisations)
      .values({
        name: "Organisation",
        legalName: "Organisation",
        slug: "tenant-1",
        status: "trialing",
        planKey: "trial",
        trialEndsAt: trialEnds,
      })
      .returning({ id: organisations.id });
    return organisation;
  });
}

export async function ensureMembership(userId: string, organisationId: string, orgRole: string) {
  await withBypassRls(async () => {
    await getDb()
      .insert(organisationMemberships)
      .values({
        userId,
        organisationId,
        role: membershipFromOrgRole(orgRole),
      })
      .onConflictDoNothing();
  });
}

export async function catalogId(contractId: string, kind: "size" | "class" | "type", code: string) {
  if (!code) return null;
  const db = getDb();
  if (kind === "size") {
    const [row] = await db.select({ id: meterSizes.id }).from(meterSizes).where(and(eq(meterSizes.contractId, contractId), eq(meterSizes.code, code))).limit(1);
    return row?.id ?? null;
  }
  if (kind === "class") {
    const [row] = await db.select({ id: meterClasses.id }).from(meterClasses).where(and(eq(meterClasses.contractId, contractId), eq(meterClasses.code, code))).limit(1);
    return row?.id ?? null;
  }
  const [row] = await db.select({ id: meterTypes.id }).from(meterTypes).where(and(eq(meterTypes.contractId, contractId), eq(meterTypes.code, code))).limit(1);
  return row?.id ?? null;
}

export async function organisationRole(organisationId: string) {
  return withBypassRls(async () => {
    const db = getDb();
    const [row] = await db.select({ value: count() }).from(users).where(eq(users.organisationId, organisationId));
    return Number(row?.value ?? 0) === 0 ? "head" : "member";
  });
}
