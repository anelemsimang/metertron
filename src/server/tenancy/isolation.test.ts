import assert from "node:assert/strict";
import test from "node:test";
import { eq, sql } from "drizzle-orm";
import { getDb, withBypassRls, withOrg } from "@/server/db/client";
import { contracts, formVersions, jobs, organisations, users } from "@/server/db/schema";
import { acceptSyncedPhoto } from "@/server/sync/persist";
import type { SessionUser } from "@/server/auth/session";

const hasDb = Boolean(process.env.DATABASE_URL?.trim());
process.env.STORAGE_DRIVER ??= "none";

function skipWithoutDb() {
  if (!hasDb) {
    test("isolation suite skipped (no DATABASE_URL)", { skip: true }, () => undefined);
    return true;
  }
  return false;
}

async function roleBypassesRls() {
  const db = getDb();
  const rows = await db.execute(sql`select rolbypassrls or rolsuper as bypass from pg_roles where rolname = current_user`);
  const row = (rows as unknown as { bypass?: boolean }[])[0] ?? (rows as unknown as { rows: { bypass?: boolean }[] }).rows?.[0];
  return Boolean(row && (row as { bypass?: boolean }).bypass);
}

async function seedPair() {
  return withBypassRls(async () => {
    const db = getDb();
    const suffix = Date.now().toString(36);
    const [orgA] = await db
      .insert(organisations)
      .values({ name: `Iso A ${suffix}`, legalName: `Iso A ${suffix}`, slug: `iso-a-${suffix}`, status: "active", planKey: "metertron" })
      .returning();
    const [orgB] = await db
      .insert(organisations)
      .values({ name: `Iso B ${suffix}`, legalName: `Iso B ${suffix}`, slug: `iso-b-${suffix}`, status: "active", planKey: "metertron" })
      .returning();
    const [userA] = await db
      .insert(users)
      .values({
        organisationId: orgA.id,
        orgRole: "member",
        name: "Tech A",
        username: `techa-${suffix}`,
        email: `techa-${suffix}@example.com`,
      })
      .returning();
    const [userB] = await db
      .insert(users)
      .values({
        organisationId: orgB.id,
        orgRole: "member",
        name: "Tech B",
        username: `techb-${suffix}`,
        email: `techb-${suffix}@example.com`,
      })
      .returning();
    const contractValues = {
      municipalityName: "Test Municipality",
      code: `C-${suffix}`,
      name: "Isolation contract",
      deploymentName: "Isolation",
      companyName: "Isolation Co",
      exportFilenamePattern: "export.xlsx",
      exportSheetName: "Main",
      statusExportValue: "Final",
      listPhrases: { oldMeterSuffix: " (old)", connectionValue: "Connection" },
    };
    const [contractA] = await db
      .insert(contracts)
      .values({ ...contractValues, organisationId: orgA.id, code: `A-${suffix}` })
      .returning({ id: contracts.id });
    await db.insert(contracts).values({ ...contractValues, organisationId: orgB.id, code: `B-${suffix}` });
    const [formA] = await db
      .insert(formVersions)
      .values({
        organisationId: orgA.id,
        contractId: contractA.id,
        key: "meter-change",
        version: 1,
        status: "published",
        schema: { key: "meter-change", version: 1, sections: [] },
        publishedAt: new Date(),
      })
      .returning({ id: formVersions.id });
    const [jobA] = await db
      .insert(jobs)
      .values({
        organisationId: orgA.id,
        contractId: contractA.id,
        formVersionId: formA.id,
        enumeratorId: userA.id,
        status: "submitted",
        idempotencyKey: `job-a-${suffix}`,
        answers: {},
      })
      .returning({ id: jobs.id, idempotencyKey: jobs.idempotencyKey });
    return { orgA, orgB, userA, userB, jobA, suffix };
  });
}

if (!skipWithoutDb()) {
  test("photo sync refuses another organisation's job key", async () => {
    const { orgB, userB, jobA } = await seedPair();
    const actor: SessionUser = {
      id: userB.id,
      name: userB.name,
      username: userB.username,
      email: userB.email,
      organisationId: orgB.id,
      organisationName: "Org B",
      organisationSlug: "org-b",
      onboardingCompleted: true,
      orgRole: "member",
      membershipRole: "technician",
      emailVerified: true,
      totpEnabled: false,
    };
    const result = await acceptSyncedPhoto(
      {
        idempotencyKey: `photo-x-${Date.now()}`,
        jobKey: jobA.idempotencyKey!,
        fieldId: "photoNewMeter",
        bytes: Buffer.from("fake-jpeg"),
        capturedAt: null,
        latitude: null,
        longitude: null,
        accuracy: null,
        altitude: null,
      },
      actor,
    );
    assert.deepEqual(result, { error: "job-missing" });
  });

  test("RLS: org B cannot read org A jobs via withOrg", async (t) => {
    if (await roleBypassesRls()) {
      t.skip("DB role is superuser / BYPASSRLS — use a NOBYPASSRLS app role to enforce RLS");
      return;
    }
    const { orgA, orgB, jobA } = await seedPair();
    const visibleToA = await withOrg(orgA.id, async () => {
      const [row] = await getDb().select({ id: jobs.id }).from(jobs).where(eq(jobs.id, jobA.id)).limit(1);
      return row?.id ?? null;
    });
    const visibleToB = await withOrg(orgB.id, async () => {
      const [row] = await getDb().select({ id: jobs.id }).from(jobs).where(eq(jobs.id, jobA.id)).limit(1);
      return row?.id ?? null;
    });
    assert.equal(visibleToA, jobA.id);
    assert.equal(visibleToB, null);
  });

  test("withOrg cannot update another tenant's job by id", async (t) => {
    if (await roleBypassesRls()) {
      t.skip("DB role is superuser / BYPASSRLS — use a NOBYPASSRLS app role to enforce RLS");
      return;
    }
    const { orgB, jobA } = await seedPair();
    const updated = await withOrg(orgB.id, async () => {
      return getDb()
        .update(jobs)
        .set({ rejectionMessage: "leak", updatedAt: new Date() })
        .where(eq(jobs.id, jobA.id))
        .returning({ id: jobs.id });
    });
    assert.equal(updated.length, 0);
  });

}

