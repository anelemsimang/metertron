import { randomBytes } from "node:crypto";
import type { BillingProvider, CheckoutSession, CheckoutSessionInput } from "./provider";

/** Local/dev provider when PAYSTACK_SECRET_KEY is unset. */
export class StubBillingProvider implements BillingProvider {
  name = "stub" as const;

  async createCheckout(input: CheckoutSessionInput): Promise<CheckoutSession> {
    const reference = `stub_${randomBytes(12).toString("hex")}`;
    const url = new URL(input.callbackUrl);
    url.searchParams.set("reference", reference);
    url.searchParams.set("stub", "1");
    return {
      provider: "stub",
      authorizationUrl: url.toString(),
      reference,
    };
  }

  async verifyPayment(reference: string) {
    return {
      paid: reference.startsWith("stub_"),
      amountZarCents: 0,
      raw: { reference, provider: "stub" },
    };
  }

  verifyWebhookSignature() {
    return true;
  }
}
