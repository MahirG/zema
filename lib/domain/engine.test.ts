import { describe, expect, it } from "vitest";
import { balanceForPayee, failPayout, importDemoStatement, requestPayout } from "@/lib/domain/engine";
import { createSeedDatabase } from "@/lib/domain/seed";

const NOW = "2026-08-27T12:00:00.000Z";

describe("royalty report processing", () => {
  it("matches by ISRC, allocates exactly, and is idempotent on replay", () => {
    const initial = createSeedDatabase();
    const first = importDemoStatement(initial, NOW, "test-report-001");
    expect(first.error).toBeUndefined();
    expect(first.report?.lineCount).toBe(3);
    const imported = first.db;
    const lines = imported.lines.filter((line) => line.reportId === first.report?.id);
    for (const line of lines) {
      const allocated = imported.allocations.filter((allocation) => allocation.royaltyLineId === line.id).reduce((sum, allocation) => sum + allocation.amountMinor, 0);
      expect(allocated).toBe(line.revenueMinor);
    }
    const ledgerCount = imported.ledger.length;
    const replay = importDemoStatement(imported, NOW, "test-report-001");
    expect(replay.replayed).toBe(true);
    expect(replay.db.ledger).toHaveLength(ledgerCount);
    expect(replay.db.reports).toHaveLength(imported.reports.length);
  });
});

describe("payout reservation", () => {
  it("debits the USD ledger when the payout is created", () => {
    const db = createSeedDatabase();
    const before = balanceForPayee(db, "payee_abel", Date.parse(NOW));
    const result = requestPayout(db, "payee_abel", 1_000, "Telebirr", 158.5, NOW);
    expect(result.error).toBeUndefined();
    expect(result.payout?.amountMinor).toBe(158_500);
    expect(balanceForPayee(result.db, "payee_abel", Date.parse(NOW))).toBe(before - 1_000);
    expect(result.db.ledger.some((entry) => entry.sourceType === "payout" && entry.sourceId === result.payout?.id)).toBe(true);
  });

  it("reverses a failed payout once", () => {
    const db = createSeedDatabase();
    const before = balanceForPayee(db, "payee_abel", Date.parse(NOW));
    const paid = requestPayout(db, "payee_abel", 1_000, "Chapa", 158.5, NOW);
    if (!paid.payout) throw new Error("Expected payout");
    const failed = failPayout(paid.db, paid.payout.id, "Provider rejected transfer", NOW);
    const replay = failPayout(failed, paid.payout.id, "Provider rejected transfer", NOW);
    expect(balanceForPayee(failed, "payee_abel", Date.parse(NOW))).toBe(before);
    expect(replay.ledger.filter((entry) => entry.sourceType === "payout_refund" && entry.sourceId === paid.payout?.id)).toHaveLength(1);
  });

  it("enforces the configured minimum payout", () => {
    const result = requestPayout(createSeedDatabase(), "payee_abel", 999, "Bank", 158.5, NOW);
    expect(result.error).toBe("Minimum withdrawal is $10.00.");
  });
});
