import { and, count, eq } from "drizzle-orm";
import { membershipFromOrgRole } from "@/lib/membership";
import { getDb, withBypassRls } from "./client";
import { meterClasses, meterSizes, meterTypes, organisationMemberships, users } from "./schema";

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
