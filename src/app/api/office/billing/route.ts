import { annualFromMonthly, vatFromExclusive } from "@/server/billing/vat";
import { advanceDunning } from "@/server/billing/dunning";
import { METERTRON_PLAN_KEY } from "@/server/billing/plans";
import { getBillingProvider } from "@/server/billing/provider";
import { createSubscriptionInvoice, getBillingOverview, markInvoicePaid } from "@/server/billing/subscriptions";
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
  const body = (await request.json()) as { action?: unknown; interval?: unknown; reference?: unknown };
  const action = body.action === "verify" ? "verify" : "checkout";
  const interval = body.interval === "annual" ? "annual" : "monthly";

  try {
    return await withOrg(gate.user.organisationId, async () => {
      if (action === "verify") {
        const reference = typeof body.reference === "string" ? body.reference : "";
        if (!reference) return Response.json({ error: "Missing payment reference." }, { status: 400 });
        const provider = getBillingProvider();
        const verified = await provider.verifyPayment(reference);
        if (!verified.paid) return Response.json({ error: "Payment not completed." }, { status: 402 });
        await markInvoicePaid(gate.user.organisationId, reference, interval);
        return Response.json({ ok: true });
      }

      const overview = await getBillingOverview(gate.user.organisationId);
      const monthly = overview?.plan?.amountMonthlyZarCents;
      if (monthly == null) return Response.json({ error: "Subscription price is not configured." }, { status: 500 });

      const subtotal = interval === "annual" ? annualFromMonthly(monthly) : monthly;
      const taxed = vatFromExclusive(subtotal, overview?.organisation.vatRateBps ?? 1500);
      const origin = new URL(request.url).origin;
      const provider = getBillingProvider();
      const session = await provider.createCheckout({
        organisationId: gate.user.organisationId,
        email: gate.user.email,
        planKey: METERTRON_PLAN_KEY,
        interval,
        amountZarCents: taxed.totalZarCents,
        callbackUrl: `${origin}/office/billing?paid=1&interval=${interval}`,
      });
      await createSubscriptionInvoice(gate.user.organisationId, {
        interval,
        paystackReference: session.reference,
      });
      return Response.json({ checkout: session, totalZarCents: taxed.totalZarCents });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
