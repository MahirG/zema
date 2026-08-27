"use client";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { useZemaStore } from "@/lib/store/zema-store";

export function LegalPage({ type }: { type: "privacy" | "terms" }): React.JSX.Element {
  const locale = useZemaStore((state) => state.locale);
  const privacy = type === "privacy";
  return <><MarketingHeader /><main id="main-content" className="legal-page"><article className="site-wrap"><span className="eyebrow">Legal</span><h1>{privacy ? "Privacy" : "Terms"}</h1><p className="legal-lead">Zema is an early-access product of Hisab Technologies in Addis Ababa, Ethiopia.</p>{privacy ? <><h2>Demo data</h2><p>The current experience stores demo account and music data in your browser. It does not upload audio, artwork, passwords or payout details to a production backend.</p><h2>Future services</h2><p>Production distribution, identity, payments and analytics will require an updated privacy notice before real user data is processed.</p><h2>Contact</h2><p>Questions can be sent to <a href="mailto:hello@hisab.et">hello@hisab.et</a>.</p></> : <><h2>Early-access experience</h2><p>The current app demonstrates release creation, distribution status, royalty allocation and payouts with local demo data. It is not a live distribution or payment service.</p><h2>Music rights</h2><p>Artists remain responsible for having the rights and permissions required for audio, artwork, metadata and contributor splits they submit.</p><h2>Money displays</h2><p>Royalty, FX and payout values shown in the demo are illustrative unless a production agreement explicitly states otherwise.</p></>}</article></main><MarketingFooter locale={locale} /></>;
}
