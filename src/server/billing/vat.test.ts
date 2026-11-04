import assert from "node:assert/strict";
import test from "node:test";
import { annualFromMonthly, vatFromExclusive } from "./vat";

test("VAT 15% on exclusive amounts", () => {
  const result = vatFromExclusive(149_000, 1500);
  assert.equal(result.vatZarCents, 22_350);
  assert.equal(result.totalZarCents, 171_350);
});

test("annual billing is twelve months", () => {
  assert.equal(annualFromMonthly(149_000), 1_788_000);
});
