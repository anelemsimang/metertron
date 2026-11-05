"use client";

import {
  CtaPrimary,
  CtaSecondary,
  FaqAccordion,
} from "@/components/marketing/ui";
import { PRICING } from "@/lib/marketing/pricing";

const faqs = [
  {
    q: "What do we get?",
    a: "Full Metertron access for your organisation — field, office, exports, and team tools. No seat tiers.",
  },
  {
    q: "How do I get pricing?",
    a: "WhatsApp or call us for pricing.",
  },
  {
    q: "Is there a free trial?",
    a: `Yes. Every new organisation gets one ${PRICING.trialDays}-day trial with full access. No card required. The trial can only be used once per email.`,
  },
  {
    q: "How do I start?",
    a: `Start the ${PRICING.trialDays}-day trial online, or WhatsApp us if you want a walkthrough first.`,
  },
];

export function PricingTable() {
  return (
    <>
      <div className="mt-10 max-w-lg rounded-xl border border-line bg-white p-8 mk-glow">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--mt-leaf)]">Metertron</p>
        <p className="mt-4 font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--mt-grove)] md:text-4xl">
          Full access for your organisation
        </p>
        <p className="mt-2 text-sm text-muted">
          Capture, review, stock, and municipal exports — without seat tiers.
        </p>
        <p className="mt-3 text-sm font-semibold text-[var(--mt-leaf)]">
          {PRICING.trialDays}-day free trial
        </p>
        <p className="mt-2 text-sm text-muted">{PRICING.consultNote}</p>
        <ul className="mt-8 space-y-2 text-sm text-[var(--mt-slate-700)]">
          {PRICING.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="text-[var(--mt-leaf)]" aria-hidden>
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaPrimary />
          <CtaSecondary>WhatsApp for pricing</CtaSecondary>
        </div>
      </div>

      <div className="mt-16 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-line bg-[var(--mt-mist)]/40">
            <tr>
              <th className="px-4 py-3">Included</th>
              <th className="px-4 py-3">Metertron</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Field capture + offline", "Yes"],
              ["Photo & GPS evidence", "Yes"],
              ["Review queue", "Yes"],
              ["Municipal export templates", "Yes"],
              ["Team roles", "Yes"],
              ["Seat caps", "None"],
            ].map(([label, value]) => (
              <tr key={label} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-muted">{label}</td>
                <td className="px-4 py-3 font-medium text-[var(--mt-grove)]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-16 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">FAQ</h2>
        <div className="mt-6">
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </>
  );
}
