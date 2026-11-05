import { eq } from "drizzle-orm";
import { METERTRON_PLAN, METERTRON_PLAN_KEY, TRIAL_DAYS } from "@/server/billing/plans";
import { recoverOrganisation } from "@/server/billing/dunning";
import { annualFromMonthly, formatZarFromCents, vatFromExclusive } from "@/server/billing/vat";
import { getDb } from "@/server/db/client";
import { invoices, organisationSubscriptions, organisations, plans } from "@/server/db/schema";

export async function ensureMetertronPlan() {
  await getDb()
    .insert(plans)
    .values({
      key: METERTRON_PLAN.key,
      name: METERTRON_PLAN.name,
      description: METERTRON_PLAN.description,
      amountMonthlyZarCents: METERTRON_PLAN.amountMonthlyZarCents,
      seatLimit: null,
      installsPerMonth: null,
      storageBytes: null,
      isPublic: true,
      sortOrder: 0,
    })
    .onConflictDoUpdate({
      target: plans.key,
      set: {
        name: METERTRON_PLAN.name,
        description: METERTRON_PLAN.description,
        amountMonthlyZarCents: METERTRON_PLAN.amountMonthlyZarCents,
        seatLimit: null,
        installsPerMonth: null,
        storageBytes: null,
        isPublic: true,
        sortOrder: 0,
        updatedAt: new Date(),
      },
    });
}

export async function getMetertronPlan() {
  await ensureMetertronPlan();
  const [plan] = await getDb().select().from(plans).where(eq(plans.key, METERTRON_PLAN_KEY)).limit(1);
  return plan;
}

/** Trial uses the same Metertron plan; status stays trialing until paid. */
export async function ensureTrialSubscription(organisationId: string) {
  await ensureMetertronPlan();
  const db = getDb();
  const [existing] = await db
    .select({ id: organisationSubscriptions.id })
    .from(organisationSubscriptions)
    .where(eq(organisationSubscriptions.organisationId, organisationId))
    .limit(1);
  if (existing) return existing;

  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + TRIAL_DAYS);
  const [row] = await db
    .insert(organisationSubscriptions)
    .values({
      organisationId,
      planKey: METERTRON_PLAN_KEY,
      interval: "monthly",
      status: "trialing",
      currentPeriodStart: new Date(),
      currentPeriodEnd: trialEnds,
    })
    .returning({ id: organisationSubscriptions.id });
  return row;
}

export async function getBillingOverview(organisationId: string) {
  const db = getDb();
  const [org] = await db.select().from(organisations).where(eq(organisations.id, organisationId)).limit(1);
  if (!org) return null;
  await ensureTrialSubscription(organisationId);
  const plan = await getMetertronPlan();
  const [subscription] = await db
    .select()
    .from(organisationSubscriptions)
    .where(eq(organisationSubscriptions.organisationId, organisationId))
    .limit(1);
  const invoiceRows = await db.select().from(invoices).where(eq(invoices.organisationId, organisationId));

  return {
    organisation: {
      id: org.id,
      name: org.name,
      status: org.status,
      planKey: METERTRON_PLAN_KEY,
      trialEndsAt: org.trialEndsAt,
      vatNumber: org.vatNumber,
      vatRateBps: org.vatRateBps,
      currency: org.currency,
    },
    subscription,
    plan,
    invoices: invoiceRows,
  };
}

export async function createSubscriptionInvoice(
  organisationId: string,
  input: { interval: "monthly" | "annual"; paystackReference?: string },
) {
  const db = getDb();
  const [org] = await db.select().from(organisations).where(eq(organisations.id, organisationId)).limit(1);
  if (!org) throw new Error("Organisation not found.");
  const plan = await getMetertronPlan();
  if (!plan?.amountMonthlyZarCents) throw new Error("Metertron plan is not priced.");

  const subtotal =
    input.interval === "annual" ? annualFromMonthly(plan.amountMonthlyZarCents) : plan.amountMonthlyZarCents;
  const taxed = vatFromExclusive(subtotal, org.vatRateBps);
  const count = (await db.select().from(invoices).where(eq(invoices.organisationId, organisationId))).length;
  const number = `INV-${org.slug.toUpperCase().slice(0, 8)}-${String(count + 1).padStart(4, "0")}`;

  const [invoice] = await db
    .insert(invoices)
    .values({
      organisationId,
      number,
      status: "open",
      currency: org.currency || "ZAR",
      subtotalZarCents: taxed.subtotalZarCents,
      vatRateBps: taxed.vatRateBps,
      vatZarCents: taxed.vatZarCents,
      totalZarCents: taxed.totalZarCents,
      vatNumber: org.vatNumber,
      paystackReference: input.paystackReference,
      lineItems: [
        {
          description: `Metertron subscription (${input.interval})`,
          amountZarCents: taxed.subtotalZarCents,
          quantity: 1,
        },
      ],
      periodStart: new Date(),
      periodEnd: (() => {
        const end = new Date();
        end.setMonth(end.getMonth() + (input.interval === "annual" ? 12 : 1));
        return end;
      })(),
    })
    .returning();

  return { invoice, plan, display: formatZarFromCents(taxed.totalZarCents) };
}

/**
 * Manual activation from the platform console (private payment arrangements).
 * Sets org + subscription active for one month or one year from now.
 */
export async function activateOrganisationAccess(
  organisationId: string,
  interval: "monthly" | "annual",
) {
  const db = getDb();
  await ensureMetertronPlan();
  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + (interval === "annual" ? 12 : 1));
  const periodStart = new Date();

  const [existing] = await db
    .select({ id: organisationSubscriptions.id })
    .from(organisationSubscriptions)
    .where(eq(organisationSubscriptions.organisationId, organisationId))
    .limit(1);

  if (existing) {
    await db
      .update(organisationSubscriptions)
      .set({
        planKey: METERTRON_PLAN_KEY,
        interval,
        status: "active",
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        graceEndsAt: null,
        cancelledAt: null,
        updatedAt: new Date(),
      })
      .where(eq(organisationSubscriptions.organisationId, organisationId));
  } else {
    await db.insert(organisationSubscriptions).values({
      organisationId,
      planKey: METERTRON_PLAN_KEY,
      interval,
      status: "active",
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    });
  }

  await recoverOrganisation(organisationId, METERTRON_PLAN_KEY);
  return { interval, currentPeriodStart: periodStart, currentPeriodEnd: periodEnd };
}

export async function markInvoicePaid(organisationId: string, reference: string, interval: "monthly" | "annual") {
  const db = getDb();
  const [invoice] = await db
    .update(invoices)
    .set({ status: "paid", paidAt: new Date(), updatedAt: new Date() })
    .where(eq(invoices.paystackReference, reference))
    .returning();

  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + (interval === "annual" ? 12 : 1));

  await db
    .update(organisationSubscriptions)
    .set({
      planKey: METERTRON_PLAN_KEY,
      interval,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: periodEnd,
      graceEndsAt: null,
      updatedAt: new Date(),
    })
    .where(eq(organisationSubscriptions.organisationId, organisationId));

  await recoverOrganisation(organisationId, METERTRON_PLAN_KEY);
  return invoice ?? null;
}
