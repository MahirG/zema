"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BarChart3, Check, CircleDollarSign, Globe2, Music2, Radio, UploadCloud, WalletCards } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/app-shell/page-header";
import { AlbumArt } from "@/components/ui/album-art";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { balanceForPayee, totalEarnedForPayee } from "@/lib/domain/engine";
import { formatEtb, formatUsd } from "@/lib/domain/money";
import { selectCurrentUser, useZemaStore } from "@/lib/store/zema-store";

const chartValues = [62, 48, 78, 55, 90, 70];
const chartLabels = ["Spotify", "Apple", "YouTube", "Boomplay", "TikTok", "Amazon"];

export function DashboardView(): React.JSX.Element {
  const db = useZemaStore((state) => state.db);
  const user = useZemaStore(selectCurrentUser);
  const reduced = useReducedMotion();
  if (!user) return <></>;
  const releases = db.releases.filter((release) => release.ownerId === user.id);
  const streams = db.lines.reduce((sum, line) => sum + line.streams, 18_420);
  const totalEarned = totalEarnedForPayee(db, user.payeeId);
  const available = balanceForPayee(db, user.payeeId);
  const live = releases.filter((release) => release.status === "live").length;

  const stats = [
    { label: "Total streams", value: streams.toLocaleString(), detail: "↑ live catalog", icon: Music2, positive: true },
    { label: "Total earned", value: formatUsd(totalEarned), detail: "all time", icon: BarChart3 },
    { label: "Available", value: formatUsd(available), detail: formatEtb(Math.round(available * db.settings.fxRateEtbPerUsd)), icon: CircleDollarSign },
    { label: "Releases live", value: String(live), detail: `${releases.length} total`, icon: Globe2 },
  ];

  return (
    <>
      <PageHeader title="Dashboard" eyebrow="Artist overview" />
      <section className="stat-grid" aria-label="Account statistics">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return <motion.article key={stat.label} className="stat-card" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}><span className="stat-label"><Icon aria-hidden="true" />{stat.label}</span><strong className="stat-value mono">{stat.value}</strong><span className={`stat-detail ${stat.positive ? "positive" : ""}`}>{stat.detail}</span></motion.article>;
        })}
      </section>

      <div className="dashboard-grid">
        <Panel className="chart-card"><PanelHeader title="Earnings by platform" description="Last statement · illustrative" action={<span className="status-badge status-live"><span />Live data</span>} /><div className="earnings-chart" aria-label="Earnings by platform bar chart">{chartValues.map((height, index) => <div className="earnings-column" key={chartLabels[index]}><div className="earnings-bar-track"><motion.div className="earnings-bar" initial={reduced ? false : { height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: 0.18 + index * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} title={`${chartLabels[index]}: illustrative index ${height}`} /></div><span>{chartLabels[index]}</span></div>)}</div></Panel>
        <Panel className="journey-panel"><PanelHeader title="Your release journey" description="Every step, in one clear rail." /><div className="journey-list"><JourneyItem icon={UploadCloud} title="Upload" body="Audio, artwork and metadata validated." complete /><JourneyItem icon={Radio} title="Go live" body={`${live} release${live === 1 ? "" : "s"} active across stores.`} complete={live > 0} active={live === 0} /><JourneyItem icon={BarChart3} title="Earn" body="Statements match automatically by ISRC." complete={db.reports.length > 0} /><JourneyItem icon={WalletCards} title="Get paid in birr" body="Telebirr, Chapa, CBE Birr or bank." active={available > 0} /></div><Link className={buttonStyles({ variant: "ghost", size: "sm", className: "journey-action" })} href="/app/release/new">Start a new release<ArrowRight aria-hidden="true" /></Link></Panel>
      </div>

      <Panel className="recent-panel"><PanelHeader title="Recent releases" action={<Link className={buttonStyles({ variant: "ghost", size: "sm" })} href="/app/music">View all</Link>} />{releases.length ? <div className="release-list">{releases.slice(0, 3).map((release) => { const tracks = db.tracks.filter((track) => track.releaseId === release.id); return <article className="release-row" key={release.id}><AlbumArt title={release.title} size="sm" /><div className="release-row-main"><strong>{release.title}</strong><span>{release.type} · {tracks.length} track{tracks.length === 1 ? "" : "s"} · {release.primaryArtist}</span></div><StatusBadge status={release.status} /><Link href={`/app/release/${release.id}`} aria-label={`Open ${release.title}`} /></article>; })}</div> : <EmptyState icon={Music2} title="No releases yet." action={<Link href="/app/release/new" className={buttonStyles({ size: "sm" })}>Create your first release</Link>} />}</Panel>
    </>
  );
}

function JourneyItem({ icon: Icon, title, body, complete = false, active = false }: { icon: typeof UploadCloud; title: string; body: string; complete?: boolean; active?: boolean }): React.JSX.Element {
  return <div className={`journey-item ${complete ? "complete" : ""} ${active ? "active" : ""}`}><span className="journey-icon">{complete ? <Check aria-hidden="true" /> : <Icon aria-hidden="true" />}</span><div><strong>{title}</strong><p>{body}</p></div></div>;
}
