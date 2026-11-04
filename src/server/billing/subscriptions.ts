import { asc, eq } from "drizzle-orm";
import { annualFromMonthly, formatZarFromCents, vatFromExclusive } from "@/server/billing/vat";
import { getDb } from "@/server/db/client";
import {
  invoices,
  organisationSubscriptions,
  organisations,
  plans,
} from "@/server/db/schema";
import { recoverOrganisation } from "@/server/billing/dunning";

export async function listPublicPlans() {
  return getDb().select().from(plans).where(eq(plans.isPublic, true)).orderBy(asc(plans.sortOrder));
}

export async function ensureTrialSubscription(organisationId: string) {
  const db = getDb();
  const [existing] = await db
    .select({ id: organisationSubscriptions.id })
    .from(organisationSubscriptions)
    .where(eq(organisationSubscriptions.organisationId, organisationId))
    .limit(1);
  if (existing) return existing;

  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + 14);
  const [row] = await db
    .insert(organisationSubscriptions)
    .values({
      organisationId,
      planKey: "trial",
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
  const [subscription] = await db
    .select()
    .from(organisationSubscriptions)
    .where(eq(organisationSubscriptions.organisationId, organisationId))
    .limit(1);
  const [plan] = await db.select().from(plans).where(eq(plans.key, org.planKey)).limit(1);
  const planRows = await listPublicPlans();
  const invoiceRows = await db
    .select()
    .from(invoices)
    .where(eq(invoices.organisationId, organisationId))
    .orderBy(asc(invoices.createdAt));

  return {
    organisation: {
      id: org.id,
      name: org.name,
      status: org.status,
      planKey: org.planKey,
      trialEndsAt: org.trialEndsAt,
      vatNumber: org.vatNumber,
      vatRateBps: org.vatRateBps,
      currency: org.currency,
    },
    subscription,
    plan,
    plans: planRows,
    invoices: invoiceRows,
  };
}

export async function createPlanInvoice(
  organisationId: string,
  input: { planKey: string; interval: "monthly" | "annual"; paystackReference?: string },
) {
  const db = getDb();
  const [org] = await db.select().from(organisations).where(eq(organisations.id, organisationId)).limit(1);
  if (!org) throw new Error("Organisation not found.");
  const [plan] = await db.select().from(plans).where(eq(plans.key, input.planKey)).limit(1);
  if (!plan) throw new Error("Unknown plan.");
  if (plan.amountMonthlyZarCents == null) throw new Error("Contact us for Enterprise pricing.");

  const subtotal =
    input.interval === "annual" ? annualFromMonthly(plan.amountMonthlyZarCents) : plan.amountMonthlyZarCents;
  const taxed = vatFromExclusive(subtotal, org.vatRateBps);
  const count = (
    await db.select().from(invoices).where(eq(invoices.organisationId, organisationId))
  ).length;
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
          description: `${plan.name} (${input.interval})`,
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

export async function markInvoicePaid(organisationId: string, reference: string, planKey: string, interval: "monthly" | "annual") {
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
      planKey,
      interval,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: periodEnd,
      graceEndsAt: null,
      updatedAt: new Date(),
    })
    .where(eq(organisationSubscriptions.organisationId, organisationId));

  await recoverOrganisation(organisationId, planKey);
  return invoice ?? null;
}
