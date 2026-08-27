"use client";

import { BarChart3, Check, Crown, FileDown, Link2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { formatUsd } from "@/lib/domain/money";
import { useZemaStore } from "@/lib/store/zema-store";

export function RoyaltiesView(): React.JSX.Element {
  const db = useZemaStore((state) => state.db);
  const importStatement = useZemaStore((state) => state.importStatement);
  const toast = useToast();
  const lines = db.lines.slice(-12).reverse();
  const matched = db.lines.filter((line) => line.matchStatus === "matched").length;
  const gross = db.reports.reduce((sum, report) => sum + report.grossMinor, 0);

  const runImport = (): void => {
    const result = importStatement();
    if (result.error) { toast({ tone: "error", message: result.error }); return; }
    toast(`Statement imported · ${formatUsd(result.grossMinor ?? 0)} across ${result.lineCount ?? 0} lines`);
  };

  return (
    <>
      <PageHeader title="Royalties" eyebrow="Statements & allocations" />
      <div className="royalty-summary">
        <Panel><span className="stat-label"><FileDown aria-hidden="true" />Statements</span><strong>{db.reports.length}</strong><p>processed reports</p></Panel>
        <Panel><span className="stat-label"><Link2 aria-hidden="true" />Matched lines</span><strong>{matched.toLocaleString()}</strong><p>matched automatically by ISRC</p></Panel>
        <Panel><span className="stat-label"><BarChart3 aria-hidden="true" />Reported gross</span><strong className="mono">{formatUsd(gross)}</strong><p>before contributor splits</p></Panel>
      </div>
      <Panel className="royalty-panel"><PanelHeader title="Statements" description="Import a statement to see it matched, split and credited to wallets." action={<Button size="sm" onClick={runImport}><FileDown aria-hidden="true" />Import demo statement</Button>} />
        {db.reports.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Period</th><th>Source</th><th>Lines</th><th>Status</th><th className="right">Gross</th></tr></thead><tbody>{db.reports.slice(0, 6).map((report) => <tr key={report.id}><td>{report.period}</td><td>{report.source}</td><td className="mono">{report.lineCount}</td><td><span className="processed-label"><Check aria-hidden="true" />Processed</span></td><td className="right mono">{formatUsd(report.grossMinor)}</td></tr>)}</tbody></table></div> : <EmptyState icon={FileDown} title="No statements yet." description="Import the demo statement to see the matching and allocation rail in action." />}
      </Panel>
      {lines.length > 0 && <Panel className="royalty-panel"><PanelHeader title="Recent lines (matched by ISRC)" description="Revenue remains in report currency until payout." /><div className="table-scroll"><table className="data-table"><thead><tr><th>Track</th><th>DSP</th><th>Territory</th><th>Streams</th><th className="right">Revenue</th></tr></thead><tbody>{lines.map((line) => { const track = db.tracks.find((item) => item.id === line.trackId); const dsp = db.dspTargets.find((item) => item.id === line.dspId); return <tr key={line.id}><td>{track?.title ?? "—"}</td><td>{dsp?.name ?? "—"}</td><td>{line.territory}</td><td className="mono">{line.streams.toLocaleString()}</td><td className="right mono">{formatUsd(line.revenueMinor)}</td></tr>; })}</tbody></table></div></Panel>}
      <Panel className="premium-insight"><div className="premium-icon"><Crown aria-hidden="true" /></div><div><span><Sparkles aria-hidden="true" />Coming next</span><h2>Premium analytics</h2><p>Go beyond statements with country, platform and fan-growth intelligence — right beside the money it explains.</p></div><div className="preview-bars" aria-label="Premium analytics preview"><i style={{ height: "42%" }} /><i style={{ height: "66%" }} /><i style={{ height: "51%" }} /><i style={{ height: "88%" }} /><i style={{ height: "72%" }} /></div></Panel>
    </>
  );
}
