"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, FileAudio, ImagePlus, Music2, Plus, Trash2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app-shell/page-header";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { GENRES, LANGUAGES } from "@/lib/domain/constants";
import type { ReleaseDraft, ReleaseType, WizardSplit, WizardTrack } from "@/lib/domain/types";
import { canSubmitRelease, validateReleaseDraft } from "@/lib/domain/validation";
import { selectCurrentUser, useZemaStore } from "@/lib/store/zema-store";

const steps = ["Details", "Tracks", "Splits", "Review"] as const;
const roles = ["Primary artist", "Featured", "Producer", "Writer", "Composer"];

const draftId = (): string => `draft_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

export function ReleaseWizard(): React.JSX.Element {
  const router = useRouter();
  const toast = useToast();
  const user = useZemaStore(selectCurrentUser);
  const submitRelease = useZemaStore((state) => state.submitRelease);
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState<ReleaseDraft>({ title: "", type: "Single", primaryArtist: user?.name ?? "", genre: "", language: "", releaseDate: "", artworkReady: false, tracks: [] });
  const issues = useMemo(() => validateReleaseDraft(draft), [draft]);

  const addTrack = (): void => {
    const track: WizardTrack = { id: draftId(), title: "", audioReady: false, explicit: false, splits: [{ id: draftId(), name: user?.name ?? "", role: "Primary artist", percent: 100 }] };
    setDraft((current) => ({ ...current, tracks: [...current.tracks, track] }));
  };
  const updateTrack = (trackId: string, update: Partial<WizardTrack>): void => setDraft((current) => ({ ...current, tracks: current.tracks.map((track) => track.id === trackId ? { ...track, ...update } : track) }));
  const removeTrack = (trackId: string): void => setDraft((current) => ({ ...current, tracks: current.tracks.filter((track) => track.id !== trackId) }));
  const updateSplit = (trackId: string, splitId: string, update: Partial<WizardSplit>): void => setDraft((current) => ({ ...current, tracks: current.tracks.map((track) => track.id === trackId ? { ...track, splits: track.splits.map((split) => split.id === splitId ? { ...split, ...update } : split) } : track) }));
  const addSplit = (trackId: string): void => setDraft((current) => ({ ...current, tracks: current.tracks.map((track) => track.id === trackId ? { ...track, splits: [...track.splits, { id: draftId(), name: "", role: "Producer", percent: 0 }] } : track) }));
  const removeSplit = (trackId: string, splitId: string): void => setDraft((current) => ({ ...current, tracks: current.tracks.map((track) => track.id === trackId ? { ...track, splits: track.splits.filter((split) => split.id !== splitId) } : track) }));

  const goBack = (): void => {
    if (step === 0) router.push("/app"); else setStep((value) => value - 1);
  };
  const submit = (): void => {
    if (!canSubmitRelease(issues)) return;
    setSubmitting(true);
    const result = submitRelease(draft);
    if (!result.releaseId) {
      toast({ tone: "error", message: result.errors[0] ?? "Release could not be submitted." });
      setSubmitting(false);
      return;
    }
    toast(`“${draft.title}” submitted — delivering to stores`);
    router.push(`/app/release/${result.releaseId}`);
  };

  return (
    <>
      <PageHeader title="New Release" eyebrow="Distribution" />
      <nav className="wizard-steps" aria-label="Release progress">{steps.map((label, index) => <button type="button" key={label} className={`${index === step ? "active" : ""} ${index < step ? "complete" : ""}`} onClick={() => index < step && setStep(index)} disabled={index > step}><span>{index < step ? <Check aria-hidden="true" /> : index + 1}</span><strong>{label}</strong></button>)}</nav>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} initial={reduced ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? undefined : { opacity: 0, x: -10 }} transition={{ duration: 0.22 }}>
          {step === 0 && <DetailsStep draft={draft} onChange={setDraft} />}
          {step === 1 && <TracksStep tracks={draft.tracks} onAdd={addTrack} onUpdate={updateTrack} onRemove={removeTrack} />}
          {step === 2 && <SplitsStep tracks={draft.tracks} onUpdate={updateSplit} onAdd={addSplit} onRemove={removeSplit} />}
          {step === 3 && <ReviewStep draft={draft} />}
        </motion.div>
      </AnimatePresence>
      <div className="wizard-actions"><Button variant="ghost" onClick={goBack}><ArrowLeft aria-hidden="true" />{step === 0 ? "Cancel" : "Back"}</Button>{step < 3 ? <Button onClick={() => setStep((value) => value + 1)}>Continue<ArrowRight aria-hidden="true" /></Button> : <Button onClick={submit} disabled={!canSubmitRelease(issues) || submitting}>{submitting ? "Submitting…" : "Submit & distribute"}<UploadCloud aria-hidden="true" /></Button>}</div>
    </>
  );
}

function DetailsStep({ draft, onChange }: { draft: ReleaseDraft; onChange: (draft: ReleaseDraft) => void }): React.JSX.Element {
  return <Panel className="wizard-panel"><PanelHeader title="Release details" description="The metadata stores use to present and identify your release." /><div className="form-grid"><div className="form-field"><label htmlFor="release-title">Release title</label><input id="release-title" value={draft.title} onChange={(event) => onChange({ ...draft, title: event.target.value })} placeholder="e.g. Tizita" /></div><div className="form-field"><label htmlFor="release-type">Type</label><select id="release-type" value={draft.type} onChange={(event) => onChange({ ...draft, type: event.target.value as ReleaseType })}>{["Single", "EP", "Album"].map((value) => <option key={value}>{value}</option>)}</select></div><div className="form-field"><label htmlFor="primary-artist">Primary artist</label><input id="primary-artist" value={draft.primaryArtist} onChange={(event) => onChange({ ...draft, primaryArtist: event.target.value })} /></div><div className="form-field"><label htmlFor="genre">Genre</label><select id="genre" value={draft.genre} onChange={(event) => onChange({ ...draft, genre: event.target.value })}><option value="">Select…</option>{GENRES.map((genre) => <option key={genre}>{genre}</option>)}</select></div><div className="form-field"><label htmlFor="language">Language</label><select id="language" value={draft.language} onChange={(event) => onChange({ ...draft, language: event.target.value })}><option value="">Select…</option>{LANGUAGES.map((language) => <option key={language}>{language}</option>)}</select></div><div className="form-field"><label htmlFor="release-date">Release date</label><input id="release-date" type="date" value={draft.releaseDate} onChange={(event) => onChange({ ...draft, releaseDate: event.target.value })} /></div></div><div className="form-field artwork-field"><span className="field-label">Cover artwork (min 3000×3000)</span><button className={`upload-zone ${draft.artworkReady ? "ready" : ""}`} type="button" onClick={() => onChange({ ...draft, artworkReady: true })}>{draft.artworkReady ? <><Check aria-hidden="true" /><strong>artwork.jpg</strong><span>3000×3000 · RGB · ready</span></> : <><ImagePlus aria-hidden="true" /><strong>Tap to upload cover art</strong><span>Square JPG or PNG, at least 3000×3000</span></>}</button></div></Panel>;
}

function TracksStep({ tracks, onAdd, onUpdate, onRemove }: { tracks: WizardTrack[]; onAdd: () => void; onUpdate: (id: string, update: Partial<WizardTrack>) => void; onRemove: (id: string) => void }): React.JSX.Element {
  return <Panel className="wizard-panel"><PanelHeader title="Tracks" description="Add lossless masters. WAV or FLAC is recommended." action={<Button variant="ghost" size="sm" onClick={onAdd}><Plus aria-hidden="true" />Add track</Button>} />{tracks.length ? <div className="wizard-track-list">{tracks.map((track, index) => <article className="wizard-track" key={track.id}><span className="track-sequence">{String(index + 1).padStart(2, "0")}</span><div className="form-field"><label htmlFor={`track-title-${track.id}`}>Track title</label><input id={`track-title-${track.id}`} value={track.title} onChange={(event) => onUpdate(track.id, { title: event.target.value })} placeholder="Track title" /></div><button type="button" className={`audio-upload ${track.audioReady ? "ready" : ""}`} onClick={() => onUpdate(track.id, { audioReady: true, audioFormat: "wav" })}>{track.audioReady ? <><FileAudio aria-hidden="true" /><span>WAV ready</span></> : <><UploadCloud aria-hidden="true" /><span>Upload audio</span></>}</button><button type="button" className="remove-button" onClick={() => onRemove(track.id)} aria-label={`Remove track ${index + 1}`}><Trash2 aria-hidden="true" /></button></article>)}</div> : <div className="wizard-empty"><Music2 aria-hidden="true" /><strong>No tracks yet. Add your first.</strong><Button size="sm" onClick={onAdd}><Plus aria-hidden="true" />Add track</Button></div>}</Panel>;
}

function SplitsStep({ tracks, onUpdate, onAdd, onRemove }: { tracks: WizardTrack[]; onUpdate: (trackId: string, splitId: string, update: Partial<WizardSplit>) => void; onAdd: (trackId: string) => void; onRemove: (trackId: string, splitId: string) => void }): React.JSX.Element {
  if (!tracks.length) return <Panel className="wizard-panel"><div className="wizard-empty"><Music2 aria-hidden="true" /><strong>Add tracks first.</strong></div></Panel>;
  return <div className="split-panels">{tracks.map((track, trackIndex) => { const total = track.splits.reduce((sum, split) => sum + (Number.isFinite(split.percent) ? split.percent : 0), 0); const ready = Math.abs(total - 100) < 0.0001; return <Panel className="wizard-panel" key={track.id}><PanelHeader title={track.title || `Track ${trackIndex + 1}`} description="Recording splits — must total 100%." /> <div className="split-editor-list">{track.splits.map((split, splitIndex) => <div className="split-editor-row" key={split.id}><div className="form-field"><label htmlFor={`split-name-${split.id}`}>Payee</label><input id={`split-name-${split.id}`} value={split.name} onChange={(event) => onUpdate(track.id, split.id, { name: event.target.value })} placeholder="Name" /></div><div className="form-field"><label htmlFor={`split-role-${split.id}`}>Role</label><select id={`split-role-${split.id}`} value={split.role} onChange={(event) => onUpdate(track.id, split.id, { role: event.target.value })}>{roles.map((role) => <option key={role}>{role}</option>)}</select></div><div className="form-field percent-field"><label htmlFor={`split-percent-${split.id}`}>Percent</label><div><input id={`split-percent-${split.id}`} type="number" value={split.percent} min="0" max="100" step="0.0001" onChange={(event) => onUpdate(track.id, split.id, { percent: Number(event.target.value) })} /><span>%</span></div></div><button type="button" className="remove-button" onClick={() => onRemove(track.id, split.id)} aria-label={`Remove split ${splitIndex + 1}`}><Trash2 aria-hidden="true" /></button></div>)}</div><div className="split-editor-footer"><Button variant="ghost" size="sm" onClick={() => onAdd(track.id)}><Plus aria-hidden="true" />Add collaborator</Button><div className={`split-total ${ready ? "ready" : "error"}`}><span>Total</span><strong>{Number(total.toFixed(4))}%</strong>{ready ? <Check aria-hidden="true" /> : <span>· needs 100%</span>}</div></div></Panel>; })}</div>;
}

function ReviewStep({ draft }: { draft: ReleaseDraft }): React.JSX.Element {
  const issues = validateReleaseDraft(draft);
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  return <div className="review-grid"><Panel className="wizard-panel"><PanelHeader title="Review & submit" description="Confirm your release metadata before delivery." /><dl className="review-table"><div><dt>Title</dt><dd>{draft.title || "—"}</dd></div><div><dt>Type</dt><dd>{draft.type}</dd></div><div><dt>Artist</dt><dd>{draft.primaryArtist || "—"}</dd></div><div><dt>Genre</dt><dd>{draft.genre || "—"}</dd></div><div><dt>Language</dt><dd>{draft.language || "—"}</dd></div><div><dt>Date</dt><dd>{draft.releaseDate || "—"}</dd></div><div><dt>Tracks</dt><dd>{draft.tracks.length}</dd></div></dl></Panel><Panel className="wizard-panel"><PanelHeader title="Validation" description="Checks follow the production delivery rulebook." /><div className="issue-list">{errors.map((issue, index) => <div className="issue issue-error" key={`${issue.code}-${index}`}><AlertTriangle aria-hidden="true" /><span>{issue.message}</span></div>)}{warnings.map((issue, index) => <div className="issue issue-warning" key={`${issue.code}-${index}`}><AlertTriangle aria-hidden="true" /><span>{issue.message}</span></div>)}{errors.length === 0 && <div className="issue issue-success"><Check aria-hidden="true" /><span>All checks passed. Ready to distribute.</span></div>}</div></Panel></div>;
}
