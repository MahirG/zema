import { DSP_TARGETS } from "@/lib/domain/constants";
import { issueIsrc, issueUpc, nextId } from "@/lib/domain/identifiers";
import { allocateLargestRemainder, convertUsdMinorToEtbMinor, percentToUnits } from "@/lib/domain/money";
import { canSubmitRelease, validateReleaseDraft } from "@/lib/domain/validation";
import type { Payout, PayoutMethodKind, ReleaseDraft, RoyaltyReport, ZemaDatabase } from "@/lib/domain/types";

const DEMO_TERRITORIES = ["ET", "US", "GB", "KE", "ZA", "DE"] as const;
const DEMO_REVENUES = [3826, 1944, 2781, 1329, 4288, 2156, 3164, 1648];
const DEMO_STREAMS = [7_240, 4_820, 6_315, 3_104, 8_950, 5_438, 6_892, 3_776];

export function cloneDatabase(db: ZemaDatabase): ZemaDatabase {
  return structuredClone(db);
}

export function balanceForPayee(db: ZemaDatabase, payeeId: string, now = Date.now()): number {
  return db.ledger
    .filter((entry) => entry.payeeId === payeeId && entry.currency === "USD" && Date.parse(entry.availableAt) <= now)
    .reduce((sum, entry) => sum + (entry.entryType === "credit" ? entry.amountMinor : -entry.amountMinor), 0);
}

export function totalEarnedForPayee(db: ZemaDatabase, payeeId: string): number {
  return db.ledger
    .filter((entry) => entry.payeeId === payeeId && entry.currency === "USD" && entry.entryType === "credit" && entry.sourceType === "royalty")
    .reduce((sum, entry) => sum + entry.amountMinor, 0);
}

export function submitReleaseDraft(db: ZemaDatabase, ownerId: string, draft: ReleaseDraft, now: string): { db: ZemaDatabase; releaseId?: string; errors: string[] } {
  const next = cloneDatabase(db);
  const issues = validateReleaseDraft(draft);
  if (!canSubmitRelease(issues)) return { db, errors: issues.filter((item) => item.severity === "error").map((item) => item.message) };
  const user = next.users.find((item) => item.id === ownerId);
  const artist = next.artists.find((item) => item.ownerId === ownerId);
  if (!user || !artist) return { db, errors: ["Account profile is incomplete."] };

  const releaseId = nextId(next, "release");
  next.releases.unshift({
    id: releaseId,
    ownerId,
    artistId: artist.id,
    title: draft.title.trim(),
    primaryArtist: draft.primaryArtist.trim(),
    type: draft.type,
    genre: draft.genre,
    language: draft.language,
    releaseDate: draft.releaseDate,
    artworkAssetId: nextId(next, "asset"),
    artworkReady: true,
    status: "delivering",
    upc: issueUpc(next),
    submittedAt: now,
    createdAt: now,
  });

  draft.tracks.forEach((trackDraft, sequenceIndex) => {
    const trackId = nextId(next, "track");
    next.tracks.push({ id: trackId, releaseId, title: trackDraft.title.trim(), audioAssetId: nextId(next, "asset"), audioReady: true, audioFormat: trackDraft.audioFormat ?? "wav", explicit: trackDraft.explicit, instrumental: false, isrc: issueIsrc(next), status: "delivered", sequence: sequenceIndex + 1 });
    trackDraft.splits.forEach((splitDraft) => {
      let payee = next.payees.find((item) => item.name.toLocaleLowerCase() === splitDraft.name.trim().toLocaleLowerCase());
      if (!payee) {
        payee = { id: nextId(next, "payee"), name: splitDraft.name.trim(), role: splitDraft.role, payoutReady: false };
        next.payees.push(payee);
      }
      next.splits.push({ id: nextId(next, "split"), trackId, payeeId: payee.id, rightType: "recording", role: splitDraft.role, percentUnits: percentToUnits(splitDraft.percent), status: "accepted", createdAt: now });
      next.trackCredits.push({ id: nextId(next, "credit"), trackId, name: payee.name, role: splitDraft.role });
    });
  });

  DSP_TARGETS.slice(0, 6).forEach((dsp) => {
    const deliveryId = nextId(next, "delivery");
    next.deliveries.push({ id: deliveryId, releaseId, dspId: dsp.id, status: "queued", updatedAt: now });
    next.deliveryEvents.push({ id: nextId(next, "event"), deliveryId, status: "queued", detail: "Release queued for delivery.", at: now });
  });
  next.billingCharges.push({ id: nextId(next, "charge"), releaseId, amountMinor: next.settings.releaseFeeMinorEtb, currency: "ETB", status: "pending" });
  next.validationIssues = issues;
  next.auditLog.push({ id: nextId(next, "audit"), actorId: ownerId, action: "release.submitted", entityType: "release", entityId: releaseId, data: { upc: next.releases[0]?.upc }, createdAt: now });
  return { db: next, releaseId, errors: [] };
}

export function advanceDeliveries(db: ZemaDatabase, releaseId: string, now: string): ZemaDatabase {
  const next = cloneDatabase(db);
  const delivery = next.deliveries.find((item) => item.releaseId === releaseId && item.status !== "live" && item.status !== "taken_down");
  if (!delivery) return next;
  const states = ["queued", "sent", "accepted", "live"] as const;
  const index = states.indexOf(delivery.status as (typeof states)[number]);
  delivery.status = states[Math.min(index + 1, states.length - 1)] ?? "live";
  delivery.updatedAt = now;
  next.deliveryEvents.push({ id: nextId(next, "event"), deliveryId: delivery.id, status: delivery.status, detail: `Delivery moved to ${delivery.status}.`, at: now });
  if (next.deliveries.filter((item) => item.releaseId === releaseId).every((item) => item.status === "live")) {
    const release = next.releases.find((item) => item.id === releaseId);
    if (release) release.status = "live";
    next.tracks.filter((item) => item.releaseId === releaseId).forEach((track) => { track.status = "live"; });
  }
  return next;
}

export function importDemoStatement(db: ZemaDatabase, now: string, requestedExternalKey?: string): { db: ZemaDatabase; report?: RoyaltyReport; error?: string; replayed?: boolean } {
  const next = cloneDatabase(db);
  const liveTracks = next.tracks.filter((track) => track.status === "live" && track.isrc);
  if (liveTracks.length === 0) return { db, error: "No live tracks yet — release music first" };
  const externalKey = requestedExternalKey ?? `demo-${next.counters.report}`;
  const existing = next.reports.find((report) => report.externalKey === externalKey);
  if (existing) return { db, report: existing, replayed: true };
  if (!requestedExternalKey) next.counters.report += 1;
  const reportId = nextId(next, "report");
  let grossMinor = 0;
  let lineCount = 0;

  liveTracks.forEach((track, trackIndex) => {
    const splits = next.splits.filter((split) => split.trackId === track.id && split.rightType === "recording");
    for (let lineIndex = 0; lineIndex < 3; lineIndex += 1) {
      const valueIndex = (trackIndex * 3 + lineIndex + next.counters.report) % DEMO_REVENUES.length;
      const revenueMinor = DEMO_REVENUES[valueIndex] ?? 0;
      const streams = DEMO_STREAMS[valueIndex] ?? 0;
      const dsp = next.dspTargets[(trackIndex + lineIndex + next.counters.report) % next.dspTargets.length] ?? next.dspTargets[0];
      if (!dsp || !track.isrc) continue;
      const lineId = nextId(next, "line");
      const externalLineKey = `${externalKey}-${track.isrc}-${lineIndex + 1}`;
      next.lines.push({ id: lineId, reportId, externalLineKey, isrc: track.isrc, dspId: dsp.id, territory: DEMO_TERRITORIES[valueIndex % DEMO_TERRITORIES.length] ?? "ET", streams, revenueMinor, currency: "USD", trackId: track.id, matchStatus: "matched" });
      const shares = allocateLargestRemainder(revenueMinor, splits.map((split) => ({ id: split.id, percentUnits: split.percentUnits })));
      shares.forEach((share) => {
        const split = splits.find((item) => item.id === share.id);
        if (!split) return;
        const allocationId = nextId(next, "allocation");
        next.allocations.push({ id: allocationId, royaltyLineId: lineId, trackSplitId: split.id, payeeId: split.payeeId, amountMinor: share.amountMinor, currency: "USD" });
        if (!next.ledger.some((entry) => entry.sourceType === "royalty" && entry.sourceId === allocationId)) {
          next.ledger.push({ id: nextId(next, "ledger"), payeeId: split.payeeId, entryType: share.amountMinor >= 0 ? "credit" : "debit", amountMinor: Math.abs(share.amountMinor), currency: "USD", sourceType: "royalty", sourceId: allocationId, availableAt: now, createdAt: now });
        }
      });
      grossMinor += revenueMinor;
      lineCount += 1;
    }
  });

  const report: RoyaltyReport = { id: reportId, source: "Demo DSP bundle", externalKey, period: new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(now)), currency: "USD", status: "processed", grossMinor, lineCount, importedAt: now };
  next.reports.unshift(report);
  next.auditLog.push({ id: nextId(next, "audit"), action: "royalty_report.processed", entityType: "royalty_report", entityId: reportId, data: { grossMinor, lineCount }, createdAt: now });
  return { db: next, report };
}

export function requestPayout(
  db: ZemaDatabase,
  payeeId: string,
  amountMinorUsd: number,
  method: PayoutMethodKind,
  fxRateEtbPerUsd: number,
  now: string,
): { db: ZemaDatabase; payout?: Payout; error?: string } {
  if (!Number.isSafeInteger(amountMinorUsd) || amountMinorUsd <= 0) return { db, error: "Enter an amount above zero." };
  const available = balanceForPayee(db, payeeId);
  if (amountMinorUsd > available) return { db, error: "Amount exceeds available balance." };
  if (amountMinorUsd < db.settings.payoutMinMinorUsd) return { db, error: "Minimum withdrawal is $10.00." };
  const next = cloneDatabase(db);
  const payoutId = nextId(next, "payout");
  const reference = `TX${String(next.counters.payout).padStart(8, "0")}`;
  next.counters.payout += 1;
  const payout: Payout = { id: payoutId, payeeId, method, status: "paid", sourceCurrency: "USD", sourceAmountMinor: amountMinorUsd, fxRateEtbPerUsd, currency: "ETB", amountMinor: convertUsdMinorToEtbMinor(amountMinorUsd, fxRateEtbPerUsd), reference, createdAt: now, paidAt: now };
  next.payouts.unshift(payout);
  // The debit is written on creation, reserving funds before provider success.
  next.ledger.push({ id: nextId(next, "ledger"), payeeId, entryType: "debit", amountMinor: amountMinorUsd, currency: "USD", sourceType: "payout", sourceId: payoutId, availableAt: now, createdAt: now });
  next.settings.fxRateEtbPerUsd = fxRateEtbPerUsd;
  next.auditLog.push({ id: nextId(next, "audit"), actorId: next.users.find((user) => user.payeeId === payeeId)?.id, action: "payout.paid", entityType: "payout", entityId: payoutId, data: { method, fxRateEtbPerUsd }, createdAt: now });
  return { db: next, payout };
}

export function failPayout(db: ZemaDatabase, payoutId: string, reason: string, now: string): ZemaDatabase {
  const next = cloneDatabase(db);
  const payout = next.payouts.find((item) => item.id === payoutId);
  if (!payout || payout.status === "failed") return next;
  payout.status = "failed";
  payout.failureReason = reason;
  payout.paidAt = undefined;
  if (!next.ledger.some((entry) => entry.sourceType === "payout_refund" && entry.sourceId === payoutId)) {
    next.ledger.push({ id: nextId(next, "ledger"), payeeId: payout.payeeId, entryType: "credit", amountMinor: payout.sourceAmountMinor, currency: "USD", sourceType: "payout_refund", sourceId: payoutId, availableAt: now, createdAt: now });
  }
  return next;
}
