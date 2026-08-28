import { describe, expect, it } from "vitest";
import { resolveSiteOrigin, resolveSiteUrl } from "@/lib/site-url";

describe("resolveSiteUrl", () => {
  it("survives the empty Vercel value that previously broke page collection", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "",
        VERCEL_URL: "zema-preview.vercel.app",
      }).href,
    ).toBe("https://zema-preview.vercel.app/");
  });

  it("prefers the configured production origin", () => {
    expect(
      resolveSiteOrigin({
        NEXT_PUBLIC_SITE_URL: " https://music.zema.et/path?ignored=yes ",
        VERCEL_PROJECT_PRODUCTION_URL: "zema.vercel.app",
      }),
    ).toBe("https://music.zema.et");
  });

  it("accepts Vercel hostnames without a protocol", () => {
    expect(
      resolveSiteUrl({
        VERCEL_PROJECT_PRODUCTION_URL: "zema.vercel.app",
      }).href,
    ).toBe("https://zema.vercel.app/");
  });

  it("skips malformed and unsafe candidates", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "javascript:alert(1)",
        VERCEL_PROJECT_PRODUCTION_URL: "https://",
        VERCEL_URL: "zema-safe.vercel.app",
      }).href,
    ).toBe("https://zema-safe.vercel.app/");
  });

  it("uses the stable Zema fallback when no deployment URL is available", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "   " }).href).toBe(
      "https://zema.hisab.et/",
    );
  });
});
