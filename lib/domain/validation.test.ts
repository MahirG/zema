import { describe, expect, it } from "vitest";
import { canSubmitRelease, validateReleaseDraft } from "@/lib/domain/validation";
import type { ReleaseDraft } from "@/lib/domain/types";

const validDraft: ReleaseDraft = {
  title: "New Tizita",
  type: "Single",
  primaryArtist: "Abel Bekele",
  genre: "Ethiopian Traditional",
  language: "Amharic",
  releaseDate: "2026-10-01",
  artworkReady: true,
  tracks: [{ id: "track-1", title: "New Tizita", audioReady: true, audioFormat: "wav", explicit: false, splits: [{ id: "split-1", name: "Abel", role: "Primary artist", percent: 60 }, { id: "split-2", name: "Selam", role: "Featured", percent: 25 }, { id: "split-3", name: "Dawit", role: "Producer", percent: 15 }] }],
};

describe("release validation", () => {
  it("accepts a complete release", () => {
    const issues = validateReleaseDraft(validDraft);
    expect(canSubmitRelease(issues)).toBe(true);
    expect(issues.filter((item) => item.severity === "error")).toHaveLength(0);
  });

  it("returns the existing user-facing messages for missing fields", () => {
    const issues = validateReleaseDraft({ ...validDraft, title: "", artworkReady: false, tracks: [] });
    expect(issues.map((item) => item.message)).toEqual(expect.arrayContaining(["Release title is required.", "Cover artwork is required (min 3000×3000).", "Add at least one track."]));
    expect(canSubmitRelease(issues)).toBe(false);
  });

  it("requires recording splits to total exactly 100 percent", () => {
    const issues = validateReleaseDraft({ ...validDraft, tracks: [{ ...validDraft.tracks[0]!, splits: [{ id: "split-1", name: "Abel", role: "Primary artist", percent: 99.9999 }] }] });
    expect(issues.some((item) => item.code === "SPLIT_TOTAL_NOT_100")).toBe(true);
  });
});
