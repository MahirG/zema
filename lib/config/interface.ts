import type { Locale } from "@/lib/domain/types";

/**
 * Keep the complete bilingual product in source while launching the public
 * interface in English. Re-enable this flag when the Amharic UI is ready to
 * return; no translation content needs to be restored.
 */
export const INTERFACE_LANGUAGE_SWITCH_ENABLED = false;

export const DEFAULT_INTERFACE_LOCALE: Locale = "en";

export function resolveInterfaceLocale(locale?: Locale | null): Locale {
  if (!INTERFACE_LANGUAGE_SWITCH_ENABLED) return DEFAULT_INTERFACE_LOCALE;
  return locale ?? DEFAULT_INTERFACE_LOCALE;
}
