import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zema.hisab.et"; return ["", "/pricing", "/login", "/signup", "/privacy", "/terms"].map((path) => ({ url: `${base}${path}`, lastModified: new Date("2026-08-27"), changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : 0.7 })); }
