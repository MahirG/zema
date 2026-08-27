import Link from "next/link";
import { Brand } from "@/components/ui/brand";

const footerColumns = [
  { title: "Product", links: [{ label: "How it works", href: "/#how" }, { label: "Pricing", href: "/pricing" }, { label: "Sign up", href: "/signup" }] },
  { title: "Company", links: [{ label: "About", href: "/#company" }, { label: "Contact", href: "mailto:hello@hisab.et" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
];

export function MarketingFooter({ locale }: { locale: "en" | "am" }): React.JSX.Element {
  return (
    <footer className="marketing-footer" id="company">
      <div className="site-wrap footer-top">
        <div className="footer-intro"><Brand /><p lang={locale === "am" ? "am" : "en"}>{locale === "am" ? "የኢትዮጵያና አፍሪካ የሙዚቃ ስርጭትና ሮያሊቲ መስመር።" : "The music distribution and royalty rail for Ethiopia and Africa."}</p></div>
        <div className="footer-columns">
          {footerColumns.map((column) => <div key={column.title}><h2>{column.title}</h2>{column.links.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}</div>)}
        </div>
      </div>
      <div className="site-wrap footer-bottom"><span>© 2026 Zema · Hisab Technologies, Addis Ababa</span><span>Made in Ethiopia <span role="img" aria-label="Ethiopian flag">🇪🇹</span></span></div>
    </footer>
  );
}
