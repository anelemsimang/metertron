"use client";

import { useState } from "react";
import {
  CtaPrimary,
  CtaSecondary,
  FaqAccordion,
} from "@/components/marketing/ui";
import { PRICING, formatZar } from "@/lib/marketing/pricing";

const faqs = [
  {
    q: "Is there more than one plan?",
    a: "No. One Metertron subscription per organisation includes full product access. We do not sell seat tiers.",
  },
  {
    q: "How do I pay?",
    a: "Paid access is arranged with us directly (WhatsApp or phone) — monthly or annual. There is no card checkout on the site for now.",
  },
  {
    q: "How long is the trial?",
    a: `Every new organisation gets one ${PRICING.trialDays}-day trial with full access. No card is required. The free trial can only be used once per email.`,
  },
  {
    q: "Does annual billing discount two months?",
    a: "No. Annual is exactly 12 × the monthly rate — predictable cash planning without promotional fine print.",
  },
  {
    q: "Is VAT included?",
    a: PRICING.vatNote,
  },
];

export function PricingTable() {
  const [annual, setAnnual] = useState(false);
  const price = annual ? PRICING.annualZarCents : PRICING.monthlyZarCents;
  const period = annual ? "year" : "month";

  return (
    <>
      <div className="mt-8 inline-flex rounded-lg border border-line bg-white p-1 text-sm">
        <button
          type="button"
          onClick={() => setAnnual(false)}
          className={`rounded-md px-4 py-2 font-semibold ${!annual ? "bg-[var(--mt-grove)] text-white" : "text-muted"}`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setAnnual(true)}
          className={`rounded-md px-4 py-2 font-semibold ${annual ? "bg-[var(--mt-grove)] text-white" : "text-muted"}`}
        >
          Annual
        </button>
      </div>

      <div className="mt-10 max-w-lg rounded-xl border border-line bg-white p-8 mk-glow">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--mt-leaf)]">Metertron</p>
        <p className="mt-4 font-[family-name:var(--font-display)] text-5xl font-medium text-[var(--mt-grove)]">
          {formatZar(price)}
          <span className="text-lg font-normal text-muted"> / {period} excl. VAT</span>
        </p>
        <p className="mt-2 text-sm text-muted">
          {annual
            ? `Billed annually (${formatZar(PRICING.monthlyZarCents)} × 12)`
            : `Or ${formatZar(PRICING.annualZarCents)} / year excl. VAT`}
        </p>
        <p className="mt-3 text-sm font-semibold text-[var(--mt-leaf)]">
          {PRICING.trialDays}-day free trial · paid access arranged with us
        </p>
        <p className="mt-2 text-sm text-muted">
          Start a trial online anytime. For monthly or annual access after the trial, WhatsApp us — we activate your
          organisation from our control panel.
        </p>
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
          <CtaSecondary>WhatsApp to arrange access</CtaSecondary>
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
