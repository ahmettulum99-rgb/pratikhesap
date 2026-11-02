import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { categories, tools } from "./tools";
import { getToolKeywords } from "./seo-keywords";
import sitemap from "../app/sitemap";

describe("calculator catalog", () => {
  it("includes each requested tool with a unique root URL and SEO metadata", () => {
    expect(tools).toHaveLength(29);
    expect(new Set(tools.map((tool) => tool.id)).size).toBe(tools.length);
    expect(new Set(tools.map((tool) => tool.title)).size).toBe(tools.length);
    expect(new Set(tools.map((tool) => tool.metaDescription)).size).toBe(tools.length);
    for (const tool of tools) {
      expect(tool.id).toMatch(/^[a-z0-9-]+$/);
      expect(tool.title.length).toBeGreaterThan(20);
      expect(tool.metaDescription.length).toBeGreaterThan(60);
      expect(categories.some((category) => category.id === tool.category)).toBe(true);
      expect(tool.fields.length).toBeGreaterThan(0);
    }
  });

  it("provides search-intent keywords for every tool without duplicate phrases", () => {
    for (const tool of tools) {
      const keywords = getToolKeywords(tool);
      expect(keywords.length).toBeGreaterThanOrEqual(5);
      expect(new Set(keywords).size).toBe(keywords.length);
    }
    expect(tools.find((tool) => tool.id === "dortluk-not-sistemi-hesaplama")).toBeDefined();
  });

  it("publishes the AdSense seller declaration at the public root", () => {
    const adsTxt = readFileSync(new URL("../../public/ads.txt", import.meta.url), "utf8").trim();
    expect(adsTxt).toBe("google.com, pub-6994844378081796, DIRECT, f08c47fec0942fa0");
  });

  it("generates one canonical sitemap URL for every static page, category, and calculator", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(entries).toHaveLength(4 + categories.length + tools.length);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.startsWith("https://www.hesappratik.xyz/") || url === "https://www.hesappratik.xyz")).toBe(true);
    for (const tool of tools) expect(urls).toContain(`https://www.hesappratik.xyz/${tool.id}`);
  });
});
