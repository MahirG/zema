import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site-url";

const publicRoutes = [
  "/",
  "/pricing",
  "/login",
  "/signup",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = resolveSiteUrl();

  return publicRoutes.map((path) => ({
    url: new URL(path, siteUrl).href,
    lastModified: new Date("2026-08-27"),
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : 0.7,
  }));
}
