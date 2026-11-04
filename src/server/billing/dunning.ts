import { eq } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { billingEvents, organisationSubscriptions, organisations } from "@/server/db/schema";

const GRACE_DAYS = 7;

/** Failed payment → past_due → grace → readonly → suspended. Never deletes the org. */
export async function markPaymentFailed(organisationId: string, detail: Record<string, unknown> = {}) {
  const db = getDb();
  const graceEndsAt = new Date();
  graceEndsAt.setDate(graceEndsAt.getDate() + GRACE_DAYS);

  await db
    .update(organisationSubscriptions)
    .set({ status: "past_due", graceEndsAt, updatedAt: new Date() })
    .where(eq(organisationSubscriptions.organisationId, organisationId));

  await db
    .update(organisations)
    .set({ status: "past_due", updatedAt: new Date() })
    .where(eq(organisations.id, organisationId));

  await db.insert(billingEvents).values({
    organisationId,
    kind: "payment_failed",
    payload: detail,
  });
}

export async function enterGrace(organisationId: string) {
  const db = getDb();
  await db
    .update(organisationSubscriptions)
    .set({ status: "grace", updatedAt: new Date() })
    .where(eq(organisationSubscriptions.organisationId, organisationId));
  await db.insert(billingEvents).values({
    organisationId,
    kind: "grace_started",
    payload: {},
  });
}

/** Read-only: can view/export approved work; mutations blocked. Data retained. */
export async function enterReadonly(organisationId: string) {
  const db = getDb();
  await db
    .update(organisations)
    .set({ status: "readonly", updatedAt: new Date() })
    .where(eq(organisations.id, organisationId));
  await db.insert(billingEvents).values({
    organisationId,
    kind: "entered_readonly",
    payload: {},
  });
}

/** Suspended: signed-in users see billing recovery only. Never deletes rows. */
export async function suspendOrganisation(organisationId: string) {
  const db = getDb();
  await db
    .update(organisations)
    .set({ status: "suspended", updatedAt: new Date() })
    .where(eq(organisations.id, organisationId));
  await db
    .update(organisationSubscriptions)
    .set({ status: "expired", updatedAt: new Date() })
    .where(eq(organisationSubscriptions.organisationId, organisationId));
  await db.insert(billingEvents).values({
    organisationId,
    kind: "suspended",
    payload: { retained: true },
  });
}

export async function recoverOrganisation(organisationId: string, planKey: string) {
  const db = getDb();
  await db
    .update(organisations)
    .set({ status: "active", planKey, updatedAt: new Date() })
    .where(eq(organisations.id, organisationId));
  await db
    .update(organisationSubscriptions)
    .set({
      planKey,
      status: "active",
      graceEndsAt: null,
      cancelledAt: null,
      updatedAt: new Date(),
    })
    .where(eq(organisationSubscriptions.organisationId, organisationId));
  await db.insert(billingEvents).values({
    organisationId,
    kind: "recovered",
    payload: { planKey },
  });
}

/** Advance dunning based on grace window. Safe to call on billing page load. */
export async function advanceDunning(organisationId: string) {
  const db = getDb();
  const [org] = await db.select().from(organisations).where(eq(organisations.id, organisationId)).limit(1);
  if (!org || org.status === "suspended" || org.status === "deleted") return org?.status ?? null;

  const [sub] = await db
    .select()
    .from(organisationSubscriptions)
    .where(eq(organisationSubscriptions.organisationId, organisationId))
    .limit(1);

  if (org.status === "trialing" && org.trialEndsAt && org.trialEndsAt.getTime() <= Date.now()) {
    await markPaymentFailed(organisationId, { reason: "trial_ended" });
    await enterGrace(organisationId);
    return "past_due";
  }

  if ((org.status === "past_due" || sub?.status === "past_due" || sub?.status === "grace") && sub?.graceEndsAt) {
    if (sub.graceEndsAt.getTime() <= Date.now()) {
      if (org.status !== "readonly") {
        await enterReadonly(organisationId);
        return "readonly";
      }
    } else if (sub.status === "past_due") {
      await enterGrace(organisationId);
    }
  }

  // Extended unread-only: after another grace window, suspend (still no delete).
  if (org.status === "readonly" && sub?.graceEndsAt) {
    const suspendAt = new Date(sub.graceEndsAt);
    suspendAt.setDate(suspendAt.getDate() + GRACE_DAYS);
    if (suspendAt.getTime() <= Date.now()) {
      await suspendOrganisation(organisationId);
      return "suspended";
    }
  }

  return org.status;
}
