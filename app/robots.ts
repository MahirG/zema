import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zema.hisab.et"; return { rules: { userAgent: "*", allow: ["/", "/pricing", "/login", "/signup"], disallow: "/app/" }, sitemap: `${base}/sitemap.xml` }; }
