import { describe, expect, it } from "vitest";
import {
  DEFAULT_INTERFACE_LOCALE,
  INTERFACE_LANGUAGE_SWITCH_ENABLED,
  resolveInterfaceLocale,
} from "@/lib/config/interface";

describe("interface language launch configuration", () => {
  it("ships the temporary launch in English", () => {
    expect(INTERFACE_LANGUAGE_SWITCH_ENABLED).toBe(false);
    expect(DEFAULT_INTERFACE_LOCALE).toBe("en");
  });

  it("ignores an old persisted Amharic preference while the switch is hidden", () => {
    expect(resolveInterfaceLocale("am")).toBe("en");
    expect(resolveInterfaceLocale("en")).toBe("en");
    expect(resolveInterfaceLocale()).toBe("en");
  });
});
