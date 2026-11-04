/** Single commercial plan — every subscribed org gets full product access. */
export const METERTRON_PLAN_KEY = "metertron" as const;

export const TRIAL_DAYS = 7;

export const METERTRON_PLAN = {
  key: METERTRON_PLAN_KEY,
  name: "Metertron",
  description: "Full Metertron access for your organisation — field capture, review, exports, and team management.",
  /** ZAR cents excl. VAT */
  amountMonthlyZarCents: 149_000,
} as const;
