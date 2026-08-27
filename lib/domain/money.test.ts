import { describe, expect, it } from "vitest";
import { allocateLargestRemainder, percentToUnits } from "@/lib/domain/money";

describe("allocateLargestRemainder", () => {
  it("preserves every cent in the documented thirds example", () => {
    const result = allocateLargestRemainder(1_000, [
      { id: "A", percentUnits: percentToUnits(33.3333) },
      { id: "B", percentUnits: percentToUnits(33.3333) },
      { id: "C", percentUnits: percentToUnits(33.3334) },
    ]);
    expect(result.map((row) => row.amountMinor)).toEqual([333, 333, 334]);
    expect(result.reduce((sum, row) => sum + row.amountMinor, 0)).toBe(1_000);
  });

  it("breaks ties by split id", () => {
    const result = allocateLargestRemainder(1_001, [
      { id: "A", percentUnits: percentToUnits(50) },
      { id: "B", percentUnits: percentToUnits(50) },
    ]);
    expect(result.map((row) => row.amountMinor)).toEqual([501, 500]);
  });

  it("handles negative clawbacks without losing a cent", () => {
    const result = allocateLargestRemainder(-1_000, [
      { id: "A", percentUnits: percentToUnits(33.3333) },
      { id: "B", percentUnits: percentToUnits(33.3333) },
      { id: "C", percentUnits: percentToUnits(33.3334) },
    ]);
    expect(result.map((row) => row.amountMinor)).toEqual([-333, -333, -334]);
    expect(result.reduce((sum, row) => sum + row.amountMinor, 0)).toBe(-1_000);
  });

  it("rejects split totals other than exactly 100 percent", () => {
    expect(() => allocateLargestRemainder(100, [{ id: "A", percentUnits: percentToUnits(99.99) }])).toThrow("100.0000%");
  });
});
