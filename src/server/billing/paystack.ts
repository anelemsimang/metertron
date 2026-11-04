import { createHmac, timingSafeEqual } from "node:crypto";
import type { BillingProvider, CheckoutSession, CheckoutSessionInput } from "./provider";

type PaystackInitResponse = {
  status: boolean;
  message: string;
  data?: { authorization_url: string; access_code: string; reference: string };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: { status: string; amount: number; reference: string; currency: string; [key: string]: unknown };
};

export class PaystackProvider implements BillingProvider {
  name = "paystack" as const;

  constructor(private readonly secretKey: string) {}

  async createCheckout(input: CheckoutSessionInput): Promise<CheckoutSession> {
    const reference = `mt_${input.organisationId.slice(0, 8)}_${Date.now().toString(36)}`;
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.secretKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: input.amountZarCents,
        currency: "ZAR",
        reference,
        callback_url: input.callbackUrl,
        metadata: {
          organisation_id: input.organisationId,
          plan_key: input.planKey,
          interval: input.interval,
          ...input.metadata,
        },
      }),
    });
    const body = (await response.json()) as PaystackInitResponse;
    if (!response.ok || !body.status || !body.data?.authorization_url) {
      throw new Error(body.message || "Paystack checkout failed.");
    }
    return {
      provider: "paystack",
      authorizationUrl: body.data.authorization_url,
      reference: body.data.reference,
    };
  }

  async verifyPayment(reference: string) {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { authorization: `Bearer ${this.secretKey}` },
    });
    const body = (await response.json()) as PaystackVerifyResponse;
    const paid = Boolean(body.status && body.data?.status === "success");
    return {
      paid,
      amountZarCents: body.data?.amount ?? 0,
      raw: (body.data ?? { reference }) as Record<string, unknown>,
    };
  }

  verifyWebhookSignature(rawBody: string, signature: string | null) {
    if (!signature) return false;
    const hash = createHmac("sha512", this.secretKey).update(rawBody).digest("hex");
    try {
      const a = Buffer.from(hash);
      const b = Buffer.from(signature);
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }
}
