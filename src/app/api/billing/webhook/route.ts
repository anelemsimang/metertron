import { eq } from "drizzle-orm";
import { markPaymentFailed, recoverOrganisation } from "@/server/billing/dunning";
import { getBillingProvider } from "@/server/billing/provider";
import { markInvoicePaid } from "@/server/billing/subscriptions";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { billingEvents, invoices } from "@/server/db/schema";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const provider = getBillingProvider();

  if (provider.name === "paystack" && !provider.verifyWebhookSignature(rawBody, signature)) {
    return Response.json({ error: "Invalid signature." }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        reference?: string;
        metadata?: { organisation_id?: string; plan_key?: string; interval?: string };
        status?: string;
      };
    };

    await withBypassRls(async () => {
      const organisationId = event.data?.metadata?.organisation_id;
      await getDb().insert(billingEvents).values({
        organisationId: organisationId ?? null,
        kind: event.event ?? "unknown",
        provider: provider.name,
        externalId: event.data?.reference,
        payload: event as unknown as Record<string, unknown>,
      });

      if (event.event === "charge.success" && event.data?.reference && organisationId) {
        const planKey = event.data.metadata?.plan_key ?? "starter";
        const interval = event.data.metadata?.interval === "annual" ? "annual" : "monthly";
        const [existing] = await getDb()
          .select({ id: invoices.id })
          .from(invoices)
          .where(eq(invoices.paystackReference, event.data.reference))
          .limit(1);
        if (existing) {
          await markInvoicePaid(organisationId, event.data.reference, planKey, interval);
        } else {
          await recoverOrganisation(organisationId, planKey);
        }
      }

      if (event.event === "invoice.payment_failed" || event.event === "subscription.not_renew") {
        if (organisationId) await markPaymentFailed(organisationId, { event: event.event });
      }
    });

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
