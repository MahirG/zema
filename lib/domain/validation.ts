import { FULL_PERCENT_UNITS } from "@/lib/domain/constants";
import { percentToUnits } from "@/lib/domain/money";
import type { ReleaseDraft, ValidationIssue, WizardTrack } from "@/lib/domain/types";

const issue = (
  code: string,
  severity: ValidationIssue["severity"],
  scope: ValidationIssue["scope"],
  message: string,
  entityId?: string,
): ValidationIssue => ({ code, severity, scope, message, ...(entityId ? { entityId } : {}) });

function containsEmoji(value: string): boolean {
  return /\p{Extended_Pictographic}/u.test(value);
}

function validateTrack(track: WizardTrack, index: number): ValidationIssue[] {
  const label = track.title || `Track ${index + 1}`;
  const issues: ValidationIssue[] = [];
  if (!track.title.trim()) issues.push(issue("TRACK_MISSING_TITLE", "error", "track", `Track ${index + 1} needs a title.`, track.id));
  if (!track.audioReady) issues.push(issue("MISSING_AUDIO", "error", "track", `“${label}” has no audio.`, track.id));
  if (track.audioFormat === "mp3") issues.push(issue("AUDIO_LOSSY_SOURCE", "warning", "track", `“${label}” is MP3 — WAV/FLAC recommended.`, track.id));
  if (containsEmoji(track.title)) issues.push(issue("EMOJI_IN_METADATA", "error", "track", `“${label}” contains emoji, which DSP metadata does not accept.`, track.id));
  if (/\b(feat\.?|ft\.?)\b/i.test(track.title) && !track.splits.some((split) => split.role === "Featured")) {
    issues.push(issue("FEAT_NOT_CREDITED", "warning", "track", `“${label}” names a featured artist who is not credited.`, track.id));
  }

  if (track.splits.length === 0) {
    issues.push(issue("SPLIT_MISSING", "error", "splits", `“${label}” has no splits.`, track.id));
  } else {
    const total = track.splits.reduce((sum, split) => sum + percentToUnits(split.percent), 0);
    if (total !== FULL_PERCENT_UNITS) {
      issues.push(
        issue(
          "SPLIT_TOTAL_NOT_100",
          "error",
          "splits",
          `“${label}” splits total ${(total / 10_000).toFixed(total % 10_000 === 0 ? 0 : 2)}%, must equal 100%.`,
          track.id,
        ),
      );
    }
    if (track.splits.some((split) => !split.name.trim())) {
      issues.push(issue("SPLIT_MISSING", "error", "splits", `“${label}” has a split without a payee.`, track.id));
    }
  }
  return issues;
}

export function validateReleaseDraft(draft: ReleaseDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!draft.title.trim()) issues.push(issue("MISSING_TITLE", "error", "release", "Release title is required."));
  if (!draft.genre) issues.push(issue("MISSING_GENRE", "error", "release", "Select a primary genre."));
  if (!draft.language) issues.push(issue("MISSING_LANGUAGE", "error", "release", "Set the release language."));
  if (!draft.primaryArtist.trim()) issues.push(issue("MISSING_PRIMARY_ARTIST", "error", "release", "Primary artist is required."));
  if (!draft.releaseDate) issues.push(issue("RELEASE_DATE_MISSING", "error", "release", "Set a release date."));
  else {
    const date = new Date(`${draft.releaseDate}T00:00:00`);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysUntilRelease = (date.getTime() - today.getTime()) / 86_400_000;
    if (daysUntilRelease < 0) issues.push(issue("RELEASE_DATE_IN_PAST", "error", "release", "New releases can't be dated in the past. Set an original release date for catalog titles."));
    else if (daysUntilRelease < 7) issues.push(issue("RELEASE_DATE_TOO_SOON", "warning", "release", "Release in under 7 days — too late for editorial pitching."));
  }
  if (!draft.artworkReady) issues.push(issue("MISSING_ARTWORK", "error", "release", "Cover artwork is required (min 3000×3000)."));
  if (draft.tracks.length === 0) issues.push(issue("NO_TRACKS", "error", "release", "Add at least one track."));
  if (draft.type === "Single" && draft.tracks.length > 3) {
    issues.push(issue("SINGLE_TRACK_COUNT", "warning", "release", "Singles usually contain no more than three tracks."));
  }
  if (draft.title && draft.title === draft.title.toUpperCase() && /[A-Z]/.test(draft.title)) {
    issues.push(issue("ALL_CAPS_TITLE", "warning", "release", "Release title is all caps. Confirm this is intentional."));
  }
  if (containsEmoji(draft.title)) issues.push(issue("EMOJI_IN_METADATA", "error", "release", "Release title contains emoji, which DSP metadata does not accept."));
  draft.tracks.forEach((track, index) => issues.push(...validateTrack(track, index)));
  return issues;
}

export function canSubmitRelease(issues: readonly ValidationIssue[]): boolean {
  return !issues.some((item) => item.severity === "error");
}
