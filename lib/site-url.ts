const FALLBACK_SITE_URL = "https://zema.hisab.et";

export interface SiteUrlEnvironment {
  readonly [key: string]: string | undefined;
  readonly NEXT_PUBLIC_SITE_URL?: string;
  readonly VERCEL_PROJECT_PRODUCTION_URL?: string;
  readonly VERCEL_URL?: string;
}

function parseHttpUrl(value: string | undefined): URL | null {
  const trimmed = value?.trim();

  if (!trimmed) return null;

  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);

    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return new URL(url.origin);
  } catch {
    return null;
  }
}

/**
 * Resolves an absolute, origin-only URL for metadata and generated SEO routes.
 * Vercel can expose optional variables as empty strings, so every candidate is
 * validated before it reaches the URL constructor used by Next.js.
 */
export function resolveSiteUrl(
  environment: SiteUrlEnvironment = process.env,
): URL {
  const candidates = [
    environment.NEXT_PUBLIC_SITE_URL,
    environment.VERCEL_PROJECT_PRODUCTION_URL,
    environment.VERCEL_URL,
    FALLBACK_SITE_URL,
  ];

  for (const candidate of candidates) {
    const url = parseHttpUrl(candidate);
    if (url) return url;
  }

  // The fallback is a module constant we control, but keep the return explicit
  // so the function remains total if the candidate list changes later.
  return new URL(FALLBACK_SITE_URL);
}

export function resolveSiteOrigin(
  environment: SiteUrlEnvironment = process.env,
): string {
  return resolveSiteUrl(environment).origin;
}
