import { DEMO_NOW, DSP_TARGETS } from "@/lib/domain/constants";
import { allocateLargestRemainder, percentToUnits } from "@/lib/domain/money";
import type { LedgerEntry, TrackSplit, ZemaDatabase } from "@/lib/domain/types";

const seedRevenue = [1482, 2294, 814, 1905, 2741, 1202, 3380, 962, 1744, 2516, 1136, 3068, 1840, 925, 2884, 1295, 2372, 1643, 3210, 778, 2014, 2659, 1431, 2990];

export function createSeedDatabase(): ZemaDatabase {
  const now = DEMO_NOW;
  const splits: TrackSplit[] = [
    { id: "split_abel", trackId: "track_tizita", payeeId: "payee_abel", rightType: "recording", role: "Primary artist", percentUnits: percentToUnits(60), status: "accepted", createdAt: now },
    { id: "split_selam", trackId: "track_tizita", payeeId: "payee_selam", rightType: "recording", role: "Featured", percentUnits: percentToUnits(25), status: "accepted", createdAt: now },
    { id: "split_dawit", trackId: "track_tizita", payeeId: "payee_dawit", rightType: "recording", role: "Producer", percentUnits: percentToUnits(15), status: "accepted", createdAt: now },
  ];

  const ledger: LedgerEntry[] = [];
  seedRevenue.forEach((revenueMinor, lineIndex) => {
    const allocations = allocateLargestRemainder(revenueMinor, splits.map((split) => ({ id: split.id, percentUnits: split.percentUnits })));
    allocations.forEach((allocation) => {
      const split = splits.find((row) => row.id === allocation.id);
      if (!split) return;
      ledger.push({
        id: `ledger_seed_${lineIndex + 1}_${split.id}`,
        payeeId: split.payeeId,
        entryType: allocation.amountMinor >= 0 ? "credit" : "debit",
        amountMinor: Math.abs(allocation.amountMinor),
        currency: "USD",
        sourceType: "royalty",
        sourceId: `allocation_seed_${lineIndex + 1}_${split.id}`,
        availableAt: "2026-05-31T00:00:00.000Z",
        createdAt: "2026-05-01T00:00:00.000Z",
      });
    });
  });

  return {
    schemaVersion: 1,
    users: [{ id: "user_abel", name: "Abel Bekele", email: "abel@demo.et", payeeId: "payee_abel", locale: "en", createdAt: now }],
    artists: [{ id: "artist_abel", ownerId: "user_abel", name: "Abel", countryCode: "ET" }],
    payees: [
      { id: "payee_abel", ownerId: "user_abel", name: "Abel", role: "You", email: "abel@demo.et", payoutReady: true },
      { id: "payee_selam", name: "Selam", role: "Featured", payoutReady: false },
      { id: "payee_dawit", name: "Dawit", role: "Producer", payoutReady: false },
    ],
    payoutMethods: [{ id: "method_telebirr", payeeId: "payee_abel", kind: "Telebirr", label: "Telebirr", destination: "09••••••42", isDefault: true }],
    assets: [
      { id: "asset_tizita_art", ownerId: "user_abel", kind: "artwork", fileName: "tizita-cover.jpg", mimeType: "image/jpeg", byteSize: 2_104_320, width: 3000, height: 3000 },
      { id: "asset_tizita_audio", ownerId: "user_abel", kind: "audio", fileName: "tizita.wav", mimeType: "audio/wav", byteSize: 42_880_000, audioFormat: "wav", sampleRate: 44_100, bitDepth: 24, durationSeconds: 247 },
    ],
    releases: [{ id: "release_tizita", ownerId: "user_abel", artistId: "artist_abel", title: "Tizita", primaryArtist: "Abel", type: "Single", genre: "Ethiopian Traditional", language: "Amharic", releaseDate: "2026-05-01", artworkAssetId: "asset_tizita_art", artworkReady: true, status: "live", upc: "8600000000001", submittedAt: "2026-04-10T10:00:00.000Z", createdAt: "2026-04-09T10:00:00.000Z" }],
    tracks: [{ id: "track_tizita", releaseId: "release_tizita", title: "Tizita (feat. Selam)", audioAssetId: "asset_tizita_audio", audioReady: true, audioFormat: "wav", explicit: false, instrumental: false, isrc: "ET-ZMA-26-00001", status: "live", sequence: 1 }],
    trackCredits: [
      { id: "credit_abel", trackId: "track_tizita", name: "Abel", role: "Primary artist" },
      { id: "credit_selam", trackId: "track_tizita", name: "Selam", role: "Featured" },
      { id: "credit_dawit", trackId: "track_tizita", name: "Dawit", role: "Producer" },
    ],
    splits,
    dspTargets: DSP_TARGETS,
    deliveries: DSP_TARGETS.slice(0, 6).map((dsp) => ({ id: `delivery_${dsp.id}`, releaseId: "release_tizita", dspId: dsp.id, status: "live", updatedAt: "2026-05-01T08:00:00.000Z" })),
    deliveryEvents: [],
    reports: [{ id: "report_may_2026", source: "Demo DSP bundle", externalKey: "demo-may-2026", period: "May 2026", currency: "USD", status: "processed", grossMinor: seedRevenue.reduce((sum, value) => sum + value, 0), lineCount: 24, importedAt: now }],
    lines: [],
    allocations: [],
    ledger,
    payouts: [],
    billingCharges: [],
    auditLog: [],
    validationIssues: [],
    settings: { payoutMinMinorUsd: 1_000, payoutHoldDays: 45, releaseFeeMinorEtb: 150_000, fxRateEtbPerUsd: 158.5 },
    counters: { id: 100, isrc: 2, upc: 2, report: 2, payout: 1 },
  };
}
