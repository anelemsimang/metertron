import { METERTRON_PLAN, TRIAL_DAYS } from "@/server/billing/plans";
import { annualFromMonthly } from "@/server/billing/vat";

export const PRICING = {
  planName: METERTRON_PLAN.name,
  description: METERTRON_PLAN.description,
  monthlyZarCents: METERTRON_PLAN.amountMonthlyZarCents,
  annualZarCents: annualFromMonthly(METERTRON_PLAN.amountMonthlyZarCents),
  trialDays: TRIAL_DAYS,
  currency: "ZAR",
  vatNote: "Prices exclude 15% VAT.",
  features: [
    "Field capture with offline sync",
    "Office review, stock, and work orders",
    "Municipal export templates (including eThekwini-ready)",
    "Forms, catalogs, and team invites",
    "Org-scoped photos and audit-friendly history",
    "No seat or install caps",
  ],
} as const;

export function formatZar(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(cents / 100);
}
