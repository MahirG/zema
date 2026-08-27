import type { DspTarget, PayoutMethodKind, ReleaseStatus } from "@/lib/domain/types";

export const DSP_NAMES = [
  "Spotify",
  "Apple Music",
  "YouTube Music",
  "TikTok",
  "Boomplay",
  "Audiomack",
  "Deezer",
  "Amazon Music",
] as const;

export const ALL_MARKETING_DSP_NAMES = [...DSP_NAMES, "Tidal", "Anghami"] as const;

export const DSP_TARGETS: DspTarget[] = DSP_NAMES.map((name, index) => ({
  id: `dsp_${index + 1}`,
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  active: true,
}));

export const PAYOUT_METHODS: PayoutMethodKind[] = ["Telebirr", "Chapa", "CBE Birr", "Bank"];

export const GENRES = [
  "Ethiopian Traditional",
  "Gospel",
  "Afrobeats",
  "Hip Hop",
  "Jazz",
  "Pop",
  "Amapiano",
  "Orthodox",
] as const;

export const LANGUAGES = ["Amharic", "Afaan Oromo", "Tigrinya", "Somali", "English"] as const;

export const RELEASE_STATUS_LABELS: Record<ReleaseStatus, string> = {
  draft: "Draft",
  submitted: "In review",
  in_review: "In review",
  approved: "In review",
  delivering: "Delivering",
  live: "Live",
  update_pending: "In review",
  takedown_requested: "In review",
  taken_down: "Taken down",
  rejected: "Draft",
};

export const SPLIT_PERCENT_SCALE = 10_000;
export const FULL_PERCENT_UNITS = 100 * SPLIT_PERCENT_SCALE;
export const DEMO_NOW = "2026-06-18T10:00:00.000Z";
