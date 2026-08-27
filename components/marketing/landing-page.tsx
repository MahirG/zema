"use client";

import { ArrowDown, ArrowRight, BarChart3, Banknote, Globe2, Languages, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import Link from "next/link";
import { DspCloud } from "@/components/marketing/dsp-cloud";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Waveform } from "@/components/marketing/waveform";
import { buttonStyles } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { featureCopy, heroCopy, howSteps, t } from "@/lib/content/marketing";
import { formatEtb } from "@/lib/domain/money";
import { useZemaStore } from "@/lib/store/zema-store";

const featureIcons = { globe: Globe2, money: Banknote, users: UsersRound, chart: BarChart3, shield: ShieldCheck, language: Languages } as const;

export function LandingPage(): React.JSX.Element {
  const locale = useZemaStore((state) => state.locale);
  const releaseFee = useZemaStore((state) => state.db.settings.releaseFeeMinorEtb);
  return (
    <>
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-section" id="distribution">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="site-wrap hero-inner">
            <Reveal className="addis-badge"><span aria-hidden="true" />{t(heroCopy.badge, locale)}</Reveal>
            <Reveal delay={0.05}><h1 lang={locale === "am" ? "am" : "en"}>{t(heroCopy.title, locale)} <span className="gold-text">{t(heroCopy.accent, locale)}</span></h1></Reveal>
            <Reveal delay={0.1}><p className="hero-copy" lang={locale === "am" ? "am" : "en"}>{t(heroCopy.description, locale)}</p></Reveal>
            <Reveal delay={0.15} className="hero-actions">
              <Link href="/signup" className={buttonStyles({ size: "lg" })}>{locale === "am" ? "ቀድመህ ተቀላቀል" : "Get early access"}<ArrowRight aria-hidden="true" /></Link>
              <Link href="#how" className={buttonStyles({ variant: "ghost", size: "lg" })}>{locale === "am" ? "እንዴት እንደሚሰራ" : "See how it works"}<ArrowDown aria-hidden="true" /></Link>
            </Reveal>
            <Reveal delay={0.2}><div className="early-price"><Sparkles aria-hidden="true" /><span><strong>{formatEtb(releaseFee)}</strong> {locale === "am" ? "ለአንድ ሪሊዝ" : "early-access release fee"}</span><i />{locale === "am" ? "የማስተር መብትህ ያንተ ነው" : "Masters stay yours"}</div></Reveal>
            <Waveform />
          </div>
        </section>

        <section className="dsp-section" aria-labelledby="dsp-heading">
          <div className="site-wrap"><p id="dsp-heading">{locale === "am" ? "ለሚያስፈልጉ መድረኮች ይላካል" : "Delivered to the platforms that matter"}</p><DspCloud /></div>
        </section>

        <section className="marketing-section process-section" id="how">
          <div className="site-wrap">
            <Reveal className="section-heading"><span className="eyebrow">{locale === "am" ? "እንዴት እንደሚሰራ" : "How it works"}</span><h2 lang={locale === "am" ? "am" : "en"}>{locale === "am" ? "ከስቱዲዮህ ወደ ዓለም በአራት ደረጃ" : "From your studio to the world in four steps"}</h2></Reveal>
            <div className="steps-grid">
              {howSteps.map((step, index) => <Reveal key={step.title.en} delay={index * 0.07} className="step-card"><span className="step-number">0{index + 1}</span><div className="step-line" aria-hidden="true" /><h3 lang={locale === "am" ? "am" : "en"}>{t(step.title, locale)}</h3><p lang={locale === "am" ? "am" : "en"}>{t(step.body, locale)}</p></Reveal>)}
            </div>
          </div>
        </section>

        <section className="marketing-section feature-section" id="publishing">
          <div className="site-wrap">
            <Reveal className="section-heading"><span className="eyebrow">{locale === "am" ? "ለምን ዜማ" : "Why Zema"}</span><h2 lang={locale === "am" ? "am" : "en"}>{locale === "am" ? "አፍሪካዊ አርቲስት የሚያስፈልገው ሁሉ" : "Everything an African artist actually needs"}</h2></Reveal>
            <div className="feature-grid">
              {featureCopy.map((feature, index) => {
                const Icon = featureIcons[feature.icon as keyof typeof featureIcons] ?? Globe2;
                return <Reveal key={feature.title.en} delay={(index % 3) * 0.06} className="feature-card"><div className="feature-icon"><Icon aria-hidden="true" /></div><span className="feature-index">0{index + 1}</span><h3 lang={locale === "am" ? "am" : "en"}>{t(feature.title, locale)}</h3><p lang={locale === "am" ? "am" : "en"}>{t(feature.body, locale)}</p></Reveal>;
              })}
            </div>
          </div>
        </section>

        <section className="marketing-section">
          <div className="site-wrap">
            <Reveal className="cta-band"><div><span className="eyebrow">{locale === "am" ? "ቅድመ ተደራሽነት" : "Early access"}</span><h2 lang={locale === "am" ? "am" : "en"}>{locale === "am" ? "ወደ ዓለም ለመልቀቅ ዝግጁ ነህ?" : "Ready to release to the world?"}</h2><p lang={locale === "am" ? "am" : "en"}>{locale === "am" ? "አካውንትህን ፍጠር እና ሙሉ ሂደቱን ሞክር።" : "Create your account and try the full flow — build a release, set splits, watch it deliver."}</p></div><Link href="/signup" className={buttonStyles({ size: "lg" })}>{locale === "am" ? "አካውንት ፍጠር" : "Create your account"}<ArrowRight aria-hidden="true" /></Link></Reveal>
          </div>
        </section>
      </main>
      <MarketingFooter locale={locale} />
    </>
  );
}
