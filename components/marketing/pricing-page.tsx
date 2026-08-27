"use client";

import { ArrowRight, Check, Clock3, Coins, Globe2, ShieldCheck, WalletCards } from "lucide-react";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { buttonStyles } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { formatEtb, formatUsd } from "@/lib/domain/money";
import { useZemaStore } from "@/lib/store/zema-store";

const inclusions = [
  "Distribution to 150+ stores",
  "UPC and ISRC identifiers included",
  "Royalty collection and ISRC matching",
  "Fair contributor splits",
  "USD wallet with birr withdrawals",
  "Your masters and rights stay yours",
];

export function PricingPage(): React.JSX.Element {
  const locale = useZemaStore((state) => state.locale);
  const settings = useZemaStore((state) => state.db.settings);
  return (
    <>
      <MarketingHeader />
      <main id="main-content" className="pricing-page">
        <section className="pricing-hero"><div className="site-wrap"><Reveal><span className="eyebrow">{locale === "am" ? "ግልጽ ዋጋ" : "Clear early-access pricing"}</span><h1>{locale === "am" ? "ሙዚቃህን ወደ ዓለም ላክ። መብትህን ጠብቅ።" : <>Release worldwide. <span className="gold-text">Keep what is yours.</span></>}</h1><p>{locale === "am" ? "የስርጭት፣ የሮያሊቲ እና የብር ክፍያ መስመር — ያለ ማሰሪያ።" : "One clear rail for distribution, royalties and birr payouts — with no lock-in."}</p></Reveal></div></section>
        <section className="site-wrap pricing-grid"><Reveal className="price-card"><div className="price-card-top"><span>Early access</span><p>Per release</p></div><div className="price-value"><strong>{formatEtb(settings.releaseFeeMinorEtb)}</strong><span>default release fee</span></div><ul>{inclusions.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul><Link href="/signup" className={buttonStyles({ size: "lg" })}>Create your account<ArrowRight aria-hidden="true" /></Link><small>Demo checkout is not charged. Production billing can be connected later.</small></Reveal><Reveal delay={0.08} className="pricing-facts"><article><Globe2 aria-hidden="true" /><div><strong>150+ platforms</strong><p>Spotify, Apple Music, YouTube Music, TikTok, Boomplay and more.</p></div></article><article><WalletCards aria-hidden="true" /><div><strong>{formatUsd(settings.payoutMinMinorUsd)} payout minimum</strong><p>Withdraw to Telebirr, Chapa, CBE Birr or bank.</p></div></article><article><Clock3 aria-hidden="true" /><div><strong>{settings.payoutHoldDays}-day royalty hold</strong><p>A configurable safety period for adjustments and clawbacks.</p></div></article><article><Coins aria-hidden="true" /><div><strong>FX at payout time</strong><p>Royalties stay exact in USD cents until you request ETB.</p></div></article><article><ShieldCheck aria-hidden="true" /><div><strong>You keep your rights</strong><p>Masters stay yours. Transparent contracts, no lock-in.</p></div></article></Reveal></section>
      </main>
      <MarketingFooter locale={locale} />
    </>
  );
}
