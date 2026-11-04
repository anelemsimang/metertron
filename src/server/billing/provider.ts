/**
 * Billing provider abstraction — Paystack first; Stripe can implement the same shape later.
 */
import { PaystackProvider } from "./paystack";
import { StubBillingProvider } from "./stub";

export type CheckoutSessionInput = {
  organisationId: string;
  email: string;
  planKey: string;
  interval: "monthly" | "annual";
  amountZarCents: number;
  callbackUrl: string;
  metadata?: Record<string, string>;
};

export type CheckoutSession = {
  provider: "paystack" | "stub";
  authorizationUrl: string;
  reference: string;
};

export type BillingProvider = {
  name: "paystack" | "stub";
  createCheckout(input: CheckoutSessionInput): Promise<CheckoutSession>;
  verifyPayment(reference: string): Promise<{ paid: boolean; amountZarCents: number; raw: Record<string, unknown> }>;
  verifyWebhookSignature(rawBody: string, signature: string | null): boolean;
};

export function getBillingProvider(): BillingProvider {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (secret) return new PaystackProvider(secret);
  return new StubBillingProvider();
}
