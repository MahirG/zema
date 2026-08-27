"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Brand } from "@/components/ui/brand";
import { buttonStyles } from "@/components/ui/button";
import { marketingNav, t } from "@/lib/content/marketing";
import { useZemaStore } from "@/lib/store/zema-store";
import { cn } from "@/lib/utils";

export function MarketingHeader(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = useZemaStore((state) => state.locale);
  const setLocale = useZemaStore((state) => state.setLocale);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.lang = locale === "am" ? "am" : "en";
  }, [locale]);

  return (
    <header className="marketing-header">
      <div className="site-wrap marketing-nav">
        <Brand />
        <nav className="marketing-links" aria-label="Main navigation">
          {marketingNav.map((item) => <Link href={item.href} key={item.label.en}>{t(item.label, locale)}</Link>)}
        </nav>
        <div className="marketing-controls">
          <LanguageToggle locale={locale} onChange={setLocale} />
          <Link href="/login" className="login-link">{locale === "am" ? "ግባ" : "Log in"}</Link>
          <Link href="/signup" className={buttonStyles({ size: "sm" })}>{locale === "am" ? "ተመዝገብ" : "Create account"}</Link>
          <button className="mobile-menu-button" type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu aria-hidden="true" /></button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="drawer-scrim" type="button" onClick={() => setOpen(false)} aria-label="Close menu" />
            <motion.div className="drawer-panel" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 360, damping: 36 }}>
              <div className="drawer-top"><Brand /><button type="button" onClick={() => setOpen(false)} aria-label="Close menu"><X aria-hidden="true" /></button></div>
              <nav aria-label="Mobile navigation">
                {marketingNav.map((item, index) => (
                  <motion.div key={item.label.en} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + index * 0.04 }}>
                    <Link href={item.href}>{t(item.label, locale)}<span aria-hidden="true">0{index + 1}</span></Link>
                  </motion.div>
                ))}
                <Link href="/login">{locale === "am" ? "ግባ" : "Log in"}</Link>
              </nav>
              <Link href="/signup" className={buttonStyles({ size: "lg", className: "drawer-cta" })}>{locale === "am" ? "ተመዝገብ" : "Create account"}</Link>
              <LanguageToggle locale={locale} onChange={setLocale} />
              <p>Hisab Technologies<br />Addis Ababa, Ethiopia</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LanguageToggle({ locale, onChange }: { locale: "en" | "am"; onChange: (locale: "en" | "am") => void }): React.JSX.Element {
  return (
    <div className="language-toggle" role="group" aria-label="Language">
      <button type="button" className={cn(locale === "en" && "active")} onClick={() => onChange("en")} aria-pressed={locale === "en"}>EN</button>
      <button type="button" className={cn(locale === "am" && "active")} onClick={() => onChange("am")} aria-pressed={locale === "am"} lang="am">አማ</button>
    </div>
  );
}
