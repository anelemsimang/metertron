/**
 * Online checkout (Paystack / stub) is off by default.
 * Sales are arranged privately; platform staff activate orgs manually.
 * Set BILLING_CHECKOUT_ENABLED=true to re-enable self-serve checkout later.
 */
export function isBillingCheckoutEnabled() {
  const raw = (process.env.BILLING_CHECKOUT_ENABLED ?? "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}
