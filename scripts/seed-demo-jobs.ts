/**
 * Add sample jobs/work orders for the demo tenant so product screenshots look alive.
 * Usage: npx tsx --env-file=.env scripts/seed-demo-jobs.ts
 */
import { eq } from "drizzle-orm";
import { getDb, getSql, withBypassRls } from "../src/server/db/client";
import { formVersions, jobs, organisations, users, workOrders } from "../src/server/db/schema";
import { ensureDefaultContract } from "../src/server/templates/contracts";
import { METER_CHANGE_V1 } from "../src/domain/forms/meter-change-v1";

async function main() {
  const email = (process.env.DEMO_EMAIL ?? "demo@metertron.local").trim().toLowerCase();

  await withBypassRls(async () => {
    const db = getDb();
    const [user] = await db
      .select({ id: users.id, organisationId: users.organisationId })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user?.organisationId) throw new Error(`Demo user not found: ${email}`);

    const [org] = await db
      .select({ id: organisations.id, name: organisations.name })
      .from(organisations)
      .where(eq(organisations.id, user.organisationId))
      .limit(1);
    if (!org) throw new Error("Demo organisation missing");

    const existing = await db.select({ id: jobs.id }).from(jobs).where(eq(jobs.organisationId, org.id)).limit(1);
    if (existing.length) {
      console.log("Demo jobs already present — skipping.");
      return;
    }

    const contract = await ensureDefaultContract(org.id);
    const contractId = contract.id;

    const [existingForm] = await db
      .select({ id: formVersions.id })
      .from(formVersions)
      .where(eq(formVersions.contractId, contractId))
      .limit(1);
    const formVersionId =
      existingForm?.id ??
      (
        await db
          .insert(formVersions)
          .values({
            organisationId: org.id,
            contractId,
            key: "meter-change",
            version: 1,
            status: "published",
            schema: METER_CHANGE_V1,
            publishedAt: new Date(),
          })
          .returning({ id: formVersions.id })
      )[0].id;

    // Clear partial work orders from a previous failed seed attempt.
    await db.delete(workOrders).where(eq(workOrders.organisationId, org.id));

    const samples = [
      {
        status: "in_review" as const,
        houseNumber: "14",
        street: "Palm Avenue",
        newMeterNumber: "WM-482910",
        oldMeterNumber: "OM-119203",
        jobNumber: "J-1001",
        lat: -29.8587,
        lng: 31.0218,
      },
      {
        status: "approved" as const,
        houseNumber: "7",
        street: "Ridge Road",
        newMeterNumber: "WM-482911",
        oldMeterNumber: "OM-119448",
        jobNumber: "J-1002",
        lat: -29.8512,
        lng: 31.0155,
      },
      {
        status: "submitted" as const,
        houseNumber: "22",
        street: "Marine Drive",
        newMeterNumber: "WM-482912",
        oldMeterNumber: "OM-118877",
        jobNumber: "J-1003",
        lat: -29.8621,
        lng: 31.0294,
      },
      {
        status: "in_review" as const,
        houseNumber: "3",
        street: "Umgeni Road",
        newMeterNumber: "WM-482913",
        oldMeterNumber: "OM-117501",
        jobNumber: "J-1004",
        lat: -29.8124,
        lng: 31.0378,
      },
    ];

    for (const sample of samples) {
      const [wo] = await db
        .insert(workOrders)
        .values({
          organisationId: org.id,
          contractId,
          assignedTo: user.id,
          status: "assigned",
          townName: "Durban",
          houseNumber: sample.houseNumber,
          street: sample.street,
          oldMeterNumber: sample.oldMeterNumber,
          latitude: sample.lat,
          longitude: sample.lng,
        })
        .returning({ id: workOrders.id });

      await db.insert(jobs).values({
        organisationId: org.id,
        contractId,
        formVersionId,
        enumeratorId: user.id,
        workOrderId: wo.id,
        status: sample.status,
        jobDate: new Date().toISOString().slice(0, 10),
        installation: "meter_only",
        premise: "domestic",
        companyName: org.name,
        jobNumber: sample.jobNumber,
        houseNumber: sample.houseNumber,
        street: sample.street,
        newMeterNumber: sample.newMeterNumber,
        oldMeterNumber: sample.oldMeterNumber,
        oldMeterReading: 12450,
        submittedOn: new Date(),
        draftedOn: new Date(),
        answers: {
          townName: "Durban",
          houseNumber: sample.houseNumber,
          street: sample.street,
          newMeterNumber: sample.newMeterNumber,
          oldMeterNumber: sample.oldMeterNumber,
        },
      });
    }

    console.log(`Seeded ${samples.length} demo jobs for ${org.name}.`);
  });

  await getSql().end({ timeout: 1 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
