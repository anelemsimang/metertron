/** South Africa VAT helpers. Amounts are integer ZAR cents (excl. VAT unless noted). */

export function vatFromExclusive(subtotalZarCents: number, vatRateBps = 1500) {
  const vatZarCents = Math.round((subtotalZarCents * vatRateBps) / 10_000);
  return {
    subtotalZarCents,
    vatRateBps,
    vatZarCents,
    totalZarCents: subtotalZarCents + vatZarCents,
  };
}

/** Annual = 10× monthly (2 months free). */
export function annualFromMonthly(monthlyZarCents: number) {
  return monthlyZarCents * 10;
}

export function formatZarFromCents(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}
