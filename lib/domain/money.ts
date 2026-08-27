import { FULL_PERCENT_UNITS, SPLIT_PERCENT_SCALE } from "@/lib/domain/constants";

export interface AllocationInput {
  id: string;
  percentUnits: number;
}

export interface AllocationResult extends AllocationInput {
  amountMinor: number;
}

function assertSafeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`${label} must be a safe integer minor-unit value.`);
  }
}

/**
 * Deterministic largest-remainder allocation using integer arithmetic only.
 * The result always sums to amountMinor, including negative clawbacks.
 */
export function allocateLargestRemainder(
  amountMinor: number,
  inputs: readonly AllocationInput[],
): AllocationResult[] {
  assertSafeInteger(amountMinor, "amountMinor");
  if (inputs.length === 0) {
    throw new Error("At least one split is required.");
  }

  const total = inputs.reduce((sum, input) => {
    assertSafeInteger(input.percentUnits, "percentUnits");
    if (input.percentUnits <= 0) throw new Error("Split percentages must be above zero.");
    return sum + input.percentUnits;
  }, 0);

  if (total !== FULL_PERCENT_UNITS) {
    throw new Error(`Split total must equal 100.0000%; received ${(total / SPLIT_PERCENT_SCALE).toFixed(4)}%.`);
  }

  const amount = BigInt(amountMinor);
  const denominator = BigInt(FULL_PERCENT_UNITS);
  const working = inputs.map((input) => {
    const numerator = amount * BigInt(input.percentUnits);
    const truncated = numerator / denominator;
    const fractionalMagnitude = numerator >= 0n ? numerator % denominator : -(numerator % denominator);
    return { input, amount: truncated, fractionalMagnitude };
  });

  const allocated = working.reduce((sum, row) => sum + row.amount, 0n);
  const remainder = amount - allocated;
  const direction = remainder < 0n ? -1n : 1n;
  const count = Number(remainder < 0n ? -remainder : remainder);

  const order = [...working].sort((a, b) => {
    if (a.fractionalMagnitude === b.fractionalMagnitude) return a.input.id.localeCompare(b.input.id);
    return a.fractionalMagnitude > b.fractionalMagnitude ? -1 : 1;
  });

  for (let index = 0; index < count; index += 1) {
    const row = order[index % order.length];
    if (!row) throw new Error("Allocation remainder could not be distributed.");
    row.amount += direction;
  }

  const byId = new Map(working.map((row) => [row.input.id, row.amount]));
  const result = inputs.map((input) => ({
    ...input,
    amountMinor: Number(byId.get(input.id) ?? 0n),
  }));

  const resultTotal = result.reduce((sum, row) => sum + row.amountMinor, 0);
  if (resultTotal !== amountMinor) throw new Error("Allocation invariant failed: minor units were lost.");
  return result;
}

export function percentToUnits(percent: number): number {
  const units = Math.round(percent * SPLIT_PERCENT_SCALE);
  assertSafeInteger(units, "percent");
  return units;
}

export function unitsToPercent(percentUnits: number): number {
  return percentUnits / SPLIT_PERCENT_SCALE;
}

export function formatUsd(minor: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(minor / 100);
}

export function formatEtb(minor: number): string {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(minor / 100)} Br`;
}

export function convertUsdMinorToEtbMinor(usdMinor: number, fxRateEtbPerUsd: number): number {
  assertSafeInteger(usdMinor, "usdMinor");
  if (!Number.isFinite(fxRateEtbPerUsd) || fxRateEtbPerUsd <= 0) throw new Error("FX rate must be above zero.");
  return Math.round(usdMinor * fxRateEtbPerUsd);
}
