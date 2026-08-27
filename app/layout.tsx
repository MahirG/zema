import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Ethiopic, Sora } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", fallback: ["system-ui", "sans-serif"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", fallback: ["system-ui", "sans-serif"] });
const ethiopic = Noto_Sans_Ethiopic({ subsets: ["ethiopic"], variable: "--font-ethiopic", display: "swap", fallback: ["sans-serif"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://zema.hisab.et"),
  title: { default: "Zema — Music distribution for Ethiopia & Africa", template: "%s · Zema" },
  description: "Distribute Ethiopian and African music worldwide, collect royalties, split earnings fairly, and get paid in birr.",
  applicationName: "Zema",
  keywords: ["music distribution", "Ethiopia", "African artists", "royalties", "Telebirr", "music splits"],
  authors: [{ name: "Hisab Technologies" }],
  creator: "Hisab Technologies",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", alternateLocale: "am_ET", siteName: "Zema", title: "Your music, everywhere. Royalties, home.", description: "Music distribution and royalty monetization for Ethiopian & African artists.", url: "/", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Zema — Your music, everywhere. Royalties, home." }] },
  twitter: { card: "summary_large_image", title: "Zema", description: "Your music, everywhere. Royalties, home.", images: ["/opengraph-image"] },
  icons: { icon: "/zema-mark.svg", apple: "/zema-mark.svg" },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#0b0a08", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>): React.JSX.Element {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${ethiopic.variable}`} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div className="ambient-glow" aria-hidden="true" />
        <div className="grain-layer" aria-hidden="true" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
