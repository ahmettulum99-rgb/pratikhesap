import { describe, expect, it } from "vitest";
import { normalizeTurkishSearchText } from "./search";

describe("Turkish-insensitive search", () => {
  it("normalizes dotted and dotless i and Turkish diacritics", () => {
    expect(normalizeTurkishSearchText("IĞDIR")).toBe("igdir");
    expect(normalizeTurkishSearchText("Şişli, Çığ ve ÖĞÜT")).toBe("sisli, cig ve ogut");
  });
});
