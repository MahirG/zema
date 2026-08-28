import type { MetadataRoute } from "next";
import { resolveSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = resolveSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/login", "/signup"],
      disallow: "/app/",
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
