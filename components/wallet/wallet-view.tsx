"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeDollarSign, Banknote, Building2, Landmark, LockKeyhole, Smartphone, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell/page-header";
import { useToast } from "@/components/providers/toast-provider";
import { Button, buttonStyles } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { balanceForPayee } from "@/lib/domain/engine";
import { PAYOUT_METHODS } from "@/lib/domain/constants";
import { convertUsdMinorToEtbMinor, formatEtb, formatUsd } from "@/lib/domain/money";
import type { PayoutMethodKind } from "@/lib/domain/types";
import { selectCurrentUser, useZemaStore } from "@/lib/store/zema-store";

const methodIcons = { Telebirr: Smartphone, Chapa: BadgeDollarSign, "CBE Birr": Landmark, Bank: Building2 } as const;

export function WalletView(): React.JSX.Element {
  const db = useZemaStore((state) => state.db);
  const user = useZemaStore(selectCurrentUser);
  const withdraw = useZemaStore((state) => state.withdraw);
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const available = user ? balanceForPayee(db, user.payeeId) : 0;
  const savedMethod = db.payoutMethods.find((item) => item.payeeId === user?.payeeId && item.isDefault);
  const [method, setMethod] = useState<PayoutMethodKind>(() => savedMethod?.kind ?? "Telebirr");
  const [amountUsd, setAmountUsd] = useState(() => (available / 100).toFixed(2));
  const [fxRate, setFxRate] = useState(() => String(db.settings.fxRateEtbPerUsd));
  const amountMinor = Math.max(0, Math.round((Number(amountUsd) || 0) * 100));
  const rate = Number(fxRate) || db.settings.fxRateEtbPerUsd;
  const previewEtb = convertUsdMinorToEtbMinor(amountMinor, rate);
  const history = db.payouts.filter((payout) => payout.payeeId === user?.payeeId);

  const showWithdraw = (): void => { setAmountUsd((available / 100).toFixed(2)); setFxRate(String(db.settings.fxRateEtbPerUsd)); setOpen(true); };
  const confirm = (): void => {
    const result = withdraw(amountMinor, method, rate);
    if (result.error) { toast({ tone: "error", message: result.error }); return; }
    toast(`Paid ${formatEtb(result.amountMinorEtb ?? 0)} to ${method}`);
    setOpen(false);
  };

  return (
    <>
      <PageHeader title="Wallet" eyebrow="Available balance & payouts" />
      <section className="wallet-balance-card"><div className="balance-copy"><span>Available balance</span><strong className="mono">{formatUsd(available)}</strong><p>≈ {formatEtb(Math.round(available * db.settings.fxRateEtbPerUsd))} at {db.settings.fxRateEtbPerUsd} Br/USD</p></div><div className="balance-actions"><Button size="lg" onClick={showWithdraw}>Withdraw to birr<ArrowRight aria-hidden="true" /></Button><Link href="/app/royalties" className={buttonStyles({ variant: "ghost", size: "lg" })}>Import earnings</Link></div></section>
      <div className="wallet-grid"><Panel><PanelHeader title="Payout history" description="FX is fixed and recorded at payout time." />{history.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Ref</th><th>Method</th><th>Status</th><th>Rate</th><th className="right">USD</th><th className="right">Paid (ETB)</th></tr></thead><tbody>{history.map((payout) => <tr key={payout.id}><td className="mono">{payout.reference}</td><td>{payout.method}</td><td><span className="processed-label">Paid</span></td><td className="mono">{payout.fxRateEtbPerUsd}</td><td className="right mono">{formatUsd(payout.sourceAmountMinor)}</td><td className="right mono">{formatEtb(payout.amountMinor)}</td></tr>)}</tbody></table></div> : <div className="wallet-history-empty"><Banknote aria-hidden="true" /><strong>No payouts yet.</strong><span>Withdraw your balance above.</span></div>}</Panel><div className="wallet-side-stack"><Panel className="wallet-note"><LockKeyhole aria-hidden="true" /><h3>Your money stays exact.</h3><p>Royalties accrue in USD minor units. Every payout reserves the USD balance when created, then records the live ETB rate and amount.</p><Link href="/app/royalties">See royalty allocations →</Link></Panel><Panel className="faster-payout"><span>Get paid faster</span><h3>Set your destination before earnings mature.</h3><p>Complete Telebirr, Chapa, CBE Birr or bank details once, then withdraw with less friction.</p><Link href="/app/settings">Set payout method <ArrowRight aria-hidden="true" /></Link></Panel></div></div>

      <AnimatePresence>
        {open && <motion.div className="withdraw-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="withdraw-title"><button type="button" className="withdraw-scrim" onClick={() => setOpen(false)} aria-label="Close withdrawal" /><motion.div className="withdraw-panel" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ type: "spring", stiffness: 390, damping: 34 }}><div className="withdraw-heading"><div><h2 id="withdraw-title">Withdraw</h2><p>FX is applied at payout, not at accrual.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close"><X aria-hidden="true" /></button></div><div className="form-field"><span className="field-label">Method</span><div className="method-grid">{PAYOUT_METHODS.map((value) => { const Icon = methodIcons[value]; return <label className={`method-option ${method === value ? "selected" : ""}`} key={value}><input type="radio" name="payout-method" checked={method === value} onChange={() => setMethod(value)} /><Icon aria-hidden="true" />{value}</label>; })}</div></div><div className="form-grid"><div className="form-field"><label htmlFor="withdraw-amount">Amount (USD)</label><input id="withdraw-amount" type="number" min="0" step="0.01" value={amountUsd} onChange={(event) => setAmountUsd(event.target.value)} /></div><div className="form-field"><label htmlFor="withdraw-fx">FX rate (Br/USD)</label><input id="withdraw-fx" type="number" min="1" step="0.01" value={fxRate} onChange={(event) => setFxRate(event.target.value)} /></div></div><div className="fx-preview"><span>You receive</span><strong className="mono">{formatEtb(previewEtb)}</strong></div><p className="withdraw-minimum">Minimum withdrawal {formatUsd(db.settings.payoutMinMinorUsd)} · available {formatUsd(available)}</p><div className="withdraw-actions"><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={confirm}>Confirm withdrawal</Button></div></motion.div></motion.div>}
      </AnimatePresence>
    </>
  );
}
