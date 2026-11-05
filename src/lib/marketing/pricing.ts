import { METERTRON_PLAN, TRIAL_DAYS } from "@/server/billing/plans";

/** Public marketing access copy — pricing is only via WhatsApp or call. */
export const PRICING = {
  planName: METERTRON_PLAN.name,
  description: METERTRON_PLAN.description,
  trialDays: TRIAL_DAYS,
  consultNote: "WhatsApp or call us for pricing.",
  features: [
    "Field capture with offline sync",
    "Office review, stock, and work orders",
    "Municipal export templates (including eThekwini-ready)",
    "Forms, catalogs, and team invites",
    "Org-scoped photos and audit-friendly history",
    "No seat or install caps",
  ],
} as const;
