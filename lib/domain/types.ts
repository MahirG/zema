export type Locale = "en" | "am";
export type Currency = "USD" | "ETB";
export type MinorAmount = number;

export type ReleaseStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "approved"
  | "delivering"
  | "live"
  | "update_pending"
  | "takedown_requested"
  | "taken_down"
  | "rejected";

export type TrackStatus = "draft" | "ready" | "delivered" | "live" | "taken_down";
export type DeliveryStatus = "queued" | "sent" | "accepted" | "live" | "failed" | "taken_down";
export type SplitStatus = "pending" | "accepted" | "declined";
export type PayoutStatus = "requested" | "approved" | "processing" | "paid" | "failed" | "cancelled";
export type PayoutMethodKind = "Telebirr" | "Chapa" | "CBE Birr" | "Bank";
export type EntryType = "credit" | "debit";
export type RightType = "recording" | "publishing";
export type ReleaseType = "Single" | "EP" | "Album";
export type ReportStatus = "uploaded" | "processing" | "processed" | "failed";
export type Severity = "error" | "warning";

export interface User {
  id: string;
  name: string;
  email: string;
  payeeId: string;
  locale: Locale;
  createdAt: string;
}

export interface Artist {
  id: string;
  ownerId: string;
  name: string;
  countryCode: string;
  spotifyArtistId?: string;
  appleArtistId?: string;
}

export interface Payee {
  id: string;
  ownerId?: string;
  name: string;
  role: string;
  email?: string;
  payoutReady: boolean;
}

export interface PayoutMethod {
  id: string;
  payeeId: string;
  kind: PayoutMethodKind;
  label: string;
  destination: string;
  isDefault: boolean;
}

export interface Asset {
  id: string;
  ownerId: string;
  kind: "artwork" | "audio";
  fileName: string;
  mimeType: string;
  byteSize: number;
  width?: number;
  height?: number;
  audioFormat?: "wav" | "flac" | "mp3";
  sampleRate?: number;
  bitDepth?: number;
  durationSeconds?: number;
}

export interface Release {
  id: string;
  ownerId: string;
  artistId: string;
  title: string;
  primaryArtist: string;
  type: ReleaseType;
  genre: string;
  language: string;
  releaseDate: string;
  artworkAssetId?: string;
  artworkReady: boolean;
  status: ReleaseStatus;
  upc?: string;
  submittedAt?: string;
  createdAt: string;
}

export interface Track {
  id: string;
  releaseId: string;
  title: string;
  version?: string;
  audioAssetId?: string;
  audioReady: boolean;
  audioFormat?: "wav" | "flac" | "mp3";
  explicit: boolean;
  instrumental: boolean;
  lyrics?: string;
  previewStartSeconds?: number;
  isrc?: string;
  status: TrackStatus;
  sequence: number;
}

export interface TrackCredit {
  id: string;
  trackId: string;
  name: string;
  role: string;
}

/** Percent is stored as ten-thousandths of one percent. 100% = 1,000,000. */
export interface TrackSplit {
  id: string;
  trackId: string;
  payeeId: string;
  rightType: RightType;
  role: string;
  percentUnits: number;
  status: SplitStatus;
  createdAt: string;
}

export interface DspTarget {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

export interface Delivery {
  id: string;
  releaseId: string;
  dspId: string;
  status: DeliveryStatus;
  updatedAt: string;
}

export interface DeliveryEvent {
  id: string;
  deliveryId: string;
  status: DeliveryStatus;
  detail: string;
  at: string;
}

export interface RoyaltyReport {
  id: string;
  source: string;
  externalKey: string;
  period: string;
  currency: Currency;
  status: ReportStatus;
  grossMinor: MinorAmount;
  lineCount: number;
  importedAt: string;
}

export interface RoyaltyLine {
  id: string;
  reportId: string;
  externalLineKey: string;
  isrc: string;
  dspId: string;
  territory: string;
  streams: number;
  revenueMinor: MinorAmount;
  currency: Currency;
  trackId?: string;
  matchStatus: "matched" | "unmatched";
}

export interface RoyaltyAllocation {
  id: string;
  royaltyLineId: string;
  trackSplitId: string;
  payeeId: string;
  amountMinor: MinorAmount;
  currency: Currency;
}

export interface LedgerEntry {
  id: string;
  payeeId: string;
  entryType: EntryType;
  amountMinor: MinorAmount;
  currency: Currency;
  sourceType: "royalty" | "payout" | "payout_refund" | "adjustment";
  sourceId: string;
  availableAt: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  payeeId: string;
  method: PayoutMethodKind;
  status: PayoutStatus;
  sourceCurrency: "USD";
  sourceAmountMinor: MinorAmount;
  fxRateEtbPerUsd: number;
  currency: "ETB";
  amountMinor: MinorAmount;
  reference: string;
  createdAt: string;
  paidAt?: string;
  failureReason?: string;
}

export interface BillingCharge {
  id: string;
  releaseId: string;
  amountMinor: MinorAmount;
  currency: "ETB";
  status: "pending" | "paid" | "failed" | "waived";
}

export interface AuditEvent {
  id: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface ValidationIssue {
  code: string;
  severity: Severity;
  scope: "release" | "track" | "splits" | "system";
  message: string;
  entityId?: string;
}

export interface DomainSettings {
  payoutMinMinorUsd: number;
  payoutHoldDays: number;
  releaseFeeMinorEtb: number;
  fxRateEtbPerUsd: number;
}

export interface ZemaDatabase {
  schemaVersion: number;
  users: User[];
  artists: Artist[];
  payees: Payee[];
  payoutMethods: PayoutMethod[];
  assets: Asset[];
  releases: Release[];
  tracks: Track[];
  trackCredits: TrackCredit[];
  splits: TrackSplit[];
  dspTargets: DspTarget[];
  deliveries: Delivery[];
  deliveryEvents: DeliveryEvent[];
  reports: RoyaltyReport[];
  lines: RoyaltyLine[];
  allocations: RoyaltyAllocation[];
  ledger: LedgerEntry[];
  payouts: Payout[];
  billingCharges: BillingCharge[];
  auditLog: AuditEvent[];
  validationIssues: ValidationIssue[];
  settings: DomainSettings;
  counters: {
    id: number;
    isrc: number;
    upc: number;
    report: number;
    payout: number;
  };
}

export interface WizardSplit {
  id: string;
  name: string;
  role: string;
  percent: number;
}

export interface WizardTrack {
  id: string;
  title: string;
  audioReady: boolean;
  audioFormat?: "wav" | "flac" | "mp3";
  explicit: boolean;
  splits: WizardSplit[];
}

export interface ReleaseDraft {
  title: string;
  type: ReleaseType;
  primaryArtist: string;
  genre: string;
  language: string;
  releaseDate: string;
  artworkReady: boolean;
  tracks: WizardTrack[];
}
