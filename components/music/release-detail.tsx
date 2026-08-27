"use client";

import { ArrowLeft, Check, Clock3, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { PageHeader } from "@/components/app-shell/page-header";
import { useToast } from "@/components/providers/toast-provider";
import { AlbumArt } from "@/components/ui/album-art";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { unitsToPercent } from "@/lib/domain/money";
import { useZemaStore } from "@/lib/store/zema-store";

export function ReleaseDetail({ releaseId }: { releaseId: string }): React.JSX.Element {
  const db = useZemaStore((state) => state.db);
  const progressDelivery = useZemaStore((state) => state.progressDelivery);
  const toast = useToast();
  const announced = useRef(false);
  const release = db.releases.find((item) => item.id === releaseId);
  const tracks = db.tracks.filter((track) => track.releaseId === releaseId).sort((a, b) => a.sequence - b.sequence);
  const deliveries = db.deliveries.filter((delivery) => delivery.releaseId === releaseId);

  useEffect(() => {
    if (!release || release.status !== "delivering") return;
    const timer = window.setInterval(() => progressDelivery(releaseId), 650);
    return () => window.clearInterval(timer);
  }, [progressDelivery, release, releaseId]);

  useEffect(() => {
    if (release?.status === "live" && !announced.current && release.id !== "release_tizita") {
      announced.current = true;
      toast(`“${release.title}” is now live on all stores`);
    }
  }, [release, toast]);

  if (!release) return <EmptyState icon={Clock3} title="Not found." description="This release is not in your catalog." action={<Link href="/app/music" className={buttonStyles({ variant: "ghost", size: "sm" })}>Back to catalog</Link>} />;

  return (
    <>
      <PageHeader title={release.title} eyebrow="Release detail" action={<StatusBadge status={release.status} />} />
      <Panel className="release-detail-hero">
        <AlbumArt title={release.title} size="lg" />
        <div className="release-detail-summary"><StatusBadge status={release.status} /><h2>{release.title}</h2><p>{release.primaryArtist} · {release.type}</p><div className="release-meta-grid"><Meta label="Type" value={release.type} /><Meta label="UPC" value={release.upc ?? "—"} mono /><Meta label="Genre" value={release.genre} /><Meta label="Release date" value={release.releaseDate} /></div></div>
      </Panel>
      <div className="detail-columns">
        <Panel><PanelHeader title="Tracks & splits" description="Recording splits allocate every minor unit deterministically." />{tracks.map((track) => { const splits = db.splits.filter((split) => split.trackId === track.id); return <article className="track-card" key={track.id}><div className="track-heading"><div><strong>{track.title}</strong><span className="mono">ISRC {track.isrc ?? "— (assigned at submit)"}</span></div><StatusBadge status={track.status} /></div>{splits.map((split) => { const payee = db.payees.find((item) => item.id === split.payeeId); const percent = unitsToPercent(split.percentUnits); return <div className="split-view" key={split.id}><div className="split-person"><div className="avatar">{payee?.name.charAt(0) ?? "?"}</div><span>{payee?.name ?? "Unknown"} <small>· {split.role}</small></span></div><div className="split-track"><span style={{ width: `${percent}%` }} /></div><strong>{percent}%</strong></div>; })}</article>; })}</Panel>
        <Panel><PanelHeader title="Delivery status" description={release.status === "delivering" ? "Sending to stores now." : "Store-by-store delivery state."} action={release.status === "delivering" ? <RefreshCw className="delivery-spinner" aria-label="Delivery in progress" /> : <Check className="delivery-complete" aria-label="Delivery complete" />} /><div className="delivery-grid">{deliveries.length ? deliveries.map((delivery) => { const dsp = db.dspTargets.find((item) => item.id === delivery.dspId); const live = delivery.status === "live"; return <div className={`delivery-cell ${live ? "live" : "sending"}`} key={delivery.id}><span>{dsp?.name ?? "Store"}</span><span>{live ? "Live" : delivery.status === "queued" ? "Queued" : "Sending"}<i aria-hidden="true" /></span></div>; }) : <p className="muted text-sm">Not submitted yet.</p>}</div></Panel>
      </div>
      <Link href="/app/music" className={buttonStyles({ variant: "ghost", className: "mt-4" })}><ArrowLeft aria-hidden="true" />Back to catalog</Link>
    </>
  );
}

function Meta({ label, value, mono = false }: { label: string; value: string; mono?: boolean }): React.JSX.Element { return <div className="meta-block"><span>{label}</span><strong className={mono ? "mono" : ""}>{value}</strong></div>; }
