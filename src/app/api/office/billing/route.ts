import { annualFromMonthly, vatFromExclusive } from "@/server/billing/vat";
import { advanceDunning } from "@/server/billing/dunning";
import { getBillingProvider } from "@/server/billing/provider";
import { createPlanInvoice, getBillingOverview, markInvoicePaid } from "@/server/billing/subscriptions";
import { refreshUsage } from "@/server/billing/usage";
import { requireCapability } from "@/server/auth/require-admin";
import { safeDbMessage, withOrg } from "@/server/db/client";

export async function GET() {
  const gate = await requireCapability("manage_billing");
  if ("error" in gate) return gate.error;
  try {
    return await withOrg(gate.user.organisationId, async () => {
      await advanceDunning(gate.user.organisationId);
      const [overview, usage] = await Promise.all([
        getBillingOverview(gate.user.organisationId),
        refreshUsage(gate.user.organisationId),
      ]);
      return Response.json({ overview, usage, provider: getBillingProvider().name });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requireCapability("manage_billing");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as {
    action?: unknown;
    planKey?: unknown;
    interval?: unknown;
    reference?: unknown;
  };
  const action = body.action === "verify" ? "verify" : "checkout";
  const planKey = typeof body.planKey === "string" ? body.planKey : "";
  const interval = body.interval === "annual" ? "annual" : "monthly";

  try {
    return await withOrg(gate.user.organisationId, async () => {
      if (action === "verify") {
        const reference = typeof body.reference === "string" ? body.reference : "";
        if (!reference) return Response.json({ error: "Missing payment reference." }, { status: 400 });
        const provider = getBillingProvider();
        const verified = await provider.verifyPayment(reference);
        if (!verified.paid) return Response.json({ error: "Payment not completed." }, { status: 402 });
        const key = planKey || "starter";
        await markInvoicePaid(gate.user.organisationId, reference, key, interval);
        return Response.json({ ok: true });
      }

      if (!planKey || planKey === "trial" || planKey === "enterprise") {
        return Response.json(
          { error: planKey === "enterprise" ? "Contact sales for Enterprise." : "Choose Starter or Growth." },
          { status: 400 },
        );
      }

      const overview = await getBillingOverview(gate.user.organisationId);
      const plan = overview?.plans.find((row) => row.key === planKey);
      if (!plan?.amountMonthlyZarCents) return Response.json({ error: "Unknown plan." }, { status: 400 });

      const subtotal =
        interval === "annual" ? annualFromMonthly(plan.amountMonthlyZarCents) : plan.amountMonthlyZarCents;
      const taxed = vatFromExclusive(subtotal, overview?.organisation.vatRateBps ?? 1500);
      const origin = new URL(request.url).origin;
      const provider = getBillingProvider();
      const session = await provider.createCheckout({
        organisationId: gate.user.organisationId,
        email: gate.user.email,
        planKey,
        interval,
        amountZarCents: taxed.totalZarCents,
        callbackUrl: `${origin}/office/billing?paid=1&plan=${planKey}&interval=${interval}`,
      });
      await createPlanInvoice(gate.user.organisationId, {
        planKey,
        interval,
        paystackReference: session.reference,
      });
      return Response.json({ checkout: session, totalZarCents: taxed.totalZarCents });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
