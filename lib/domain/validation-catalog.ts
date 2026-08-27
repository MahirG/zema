import type { Severity, ValidationIssue } from "@/lib/domain/types";

export interface ValidationRuleDefinition {
  code: string;
  severity: Severity;
  scope: ValidationIssue["scope"];
  field: string;
  message: string;
  automated: boolean;
}

/** Stable rule codes from validation-rules.pdf. */
export const VALIDATION_RULES: readonly ValidationRuleDefinition[] = [
  { code: "MISSING_TITLE", severity: "error", scope: "release", field: "title", message: "Release title is required.", automated: true },
  { code: "MISSING_GENRE", severity: "error", scope: "release", field: "genre", message: "Select a primary genre.", automated: true },
  { code: "MISSING_LANGUAGE", severity: "error", scope: "release", field: "language", message: "Set the release language.", automated: true },
  { code: "MISSING_PRIMARY_ARTIST", severity: "error", scope: "release", field: "primary_artist", message: "A primary artist is required.", automated: true },
  { code: "NO_TRACKS", severity: "error", scope: "release", field: "tracks", message: "Add at least one track.", automated: true },
  { code: "MISSING_ARTWORK", severity: "error", scope: "release", field: "artwork", message: "Cover artwork is required.", automated: true },
  { code: "ARTWORK_TOO_SMALL", severity: "error", scope: "release", field: "artwork", message: "Artwork must be at least 3000×3000.", automated: true },
  { code: "ARTWORK_NOT_SQUARE", severity: "error", scope: "release", field: "artwork", message: "Artwork must be square.", automated: true },
  { code: "ARTWORK_NOT_RGB", severity: "warning", scope: "release", field: "artwork", message: "Artwork should be RGB, not CMYK/grayscale.", automated: true },
  { code: "ARTWORK_TEXT_VIOLATION", severity: "warning", scope: "release", field: "artwork", message: "Remove social handles, URLs, pricing or contact information from the cover.", automated: false },
  { code: "RELEASE_DATE_MISSING", severity: "error", scope: "release", field: "release_date", message: "Set a release date.", automated: true },
  { code: "RELEASE_DATE_TOO_SOON", severity: "warning", scope: "release", field: "release_date", message: "Release in under 7 days — too late for editorial pitching.", automated: true },
  { code: "RELEASE_DATE_IN_PAST", severity: "error", scope: "release", field: "release_date", message: "New releases can't be dated in the past. Set an original release date for catalog titles.", automated: true },
  { code: "SINGLE_TRACK_COUNT", severity: "warning", scope: "release", field: "type", message: "Singles usually have ≤3 tracks; consider an EP.", automated: true },
  { code: "VARIOUS_ARTISTS_MISUSE", severity: "warning", scope: "release", field: "display_artist", message: "“Various Artists” is only for compilations.", automated: true },
  { code: "ALL_CAPS_TITLE", severity: "warning", scope: "release", field: "title", message: "All-caps titles are often rejected.", automated: true },
  { code: "EMOJI_IN_METADATA", severity: "error", scope: "release", field: "title", message: "Emojis in title/artist metadata are rejected by DSPs.", automated: true },
  { code: "DUPLICATE_RELEASE", severity: "warning", scope: "release", field: "upc", message: "A live release already uses this UPC.", automated: true },
  { code: "MISSING_AUDIO", severity: "error", scope: "track", field: "audio", message: "Upload an audio file for every track.", automated: true },
  { code: "AUDIO_BELOW_SPEC", severity: "error", scope: "track", field: "audio", message: "Audio must be ≥16-bit / 44.1 kHz.", automated: true },
  { code: "AUDIO_LOSSY_SOURCE", severity: "warning", scope: "track", field: "audio", message: "Lossy source detected — WAV/FLAC recommended for full DSP support.", automated: true },
  { code: "AUDIO_TOO_SHORT", severity: "warning", scope: "track", field: "audio", message: "Tracks under 30 seconds may be rejected or not monetized.", automated: false },
  { code: "TRACK_MISSING_TITLE", severity: "error", scope: "track", field: "title", message: "Track title is required.", automated: true },
  { code: "VERSION_IN_TITLE", severity: "warning", scope: "track", field: "title", message: "Put version information in the version field, not the title.", automated: true },
  { code: "FEAT_NOT_CREDITED", severity: "warning", scope: "track", field: "credits", message: "Add a featured-artist credit for the artist named in the title.", automated: true },
  { code: "EXPLICIT_MISMATCH", severity: "warning", scope: "track", field: "explicit", message: "Lyrics look explicit but the track is marked clean.", automated: false },
  { code: "INSTRUMENTAL_HAS_LYRICS", severity: "warning", scope: "track", field: "lyrics", message: "Instrumental tracks should not carry lyrics.", automated: true },
  { code: "PREVIEW_OUT_OF_RANGE", severity: "warning", scope: "track", field: "preview", message: "Preview starts past the end of the track.", automated: true },
  { code: "ISRC_DUPLICATE", severity: "error", scope: "track", field: "isrc", message: "This ISRC is already assigned to another track.", automated: true },
  { code: "ENCODING_MOJIBAKE", severity: "warning", scope: "track", field: "title", message: "Character encoding may be corrupted; check Amharic text.", automated: true },
  { code: "SPLIT_MISSING", severity: "error", scope: "splits", field: "splits", message: "Add recording splits for every track.", automated: true },
  { code: "SPLIT_TOTAL_NOT_100", severity: "error", scope: "splits", field: "splits", message: "Recording splits must total exactly 100%.", automated: true },
  { code: "SPLIT_PAYEE_NO_PAYOUT", severity: "warning", scope: "splits", field: "splits", message: "A collaborator can earn but can't be paid yet without a verified payout method.", automated: true },
  { code: "SPLIT_UNACCEPTED", severity: "warning", scope: "splits", field: "splits", message: "A collaborator hasn't accepted their split.", automated: true },
  { code: "SYS_UPC_UNASSIGNED", severity: "error", scope: "system", field: "upc", message: "Allocate a UPC before delivery.", automated: true },
  { code: "SYS_ISRC_UNASSIGNED", severity: "error", scope: "system", field: "isrc", message: "Allocate an ISRC for every track before delivery.", automated: true },
  { code: "SYS_ARTIST_ID_MISSING", severity: "warning", scope: "system", field: "artist_id", message: "Link artist profiles to reduce wrong-artist delivery risk.", automated: true },
] as const;
