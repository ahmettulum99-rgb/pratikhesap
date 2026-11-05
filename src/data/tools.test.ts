import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { categories, tools } from "./tools";
import { getRelatedTools, relatedToolIds } from "./related-tools";
import { getToolKeywords } from "./seo-keywords";
import sitemap from "../app/sitemap";
import { createPageMetadata } from "../lib/seo/metadata";

describe("calculator catalog", () => {
  it("includes each requested tool with a unique root URL and SEO metadata", () => {
    expect(tools).toHaveLength(37);
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
    expect(tools.find((tool) => tool.id === "doviz-hesaplama")).toBeDefined();
    expect(tools.filter((tool) => tool.isNew)).toContainEqual(expect.objectContaining({ id: "pazaryeri-net-kar-hesaplama" }));
  });

  it("builds unique canonical, Open Graph, and Twitter metadata for every calculator", () => {
    const metadata = tools.map((tool) => createPageMetadata({
      title: tool.title,
      description: tool.metaDescription,
      path: `/${tool.id}`,
      keywords: getToolKeywords(tool)
    }));
    expect(new Set(metadata.map((page) => page.title)).size).toBe(tools.length);
    for (const [index, page] of metadata.entries()) {
      expect(page.alternates?.canonical).toBe(`/${tools[index].id}`);
      expect(page.openGraph).toMatchObject({
        title: tools[index].title,
        description: tools[index].metaDescription,
        url: `https://www.hesappratik.xyz/${tools[index].id}`,
        images: [{
          url: "/og-image.png",
          width: 1200,
          height: 630
        }]
      });
      expect(page.twitter).toMatchObject({
        card: "summary_large_image",
        title: tools[index].title,
        description: tools[index].metaDescription,
        images: ["/og-image.png"]
      });
    }
  });

  it("publishes the shared social image as a 1200 by 630 PNG", () => {
    const image = readFileSync(new URL("../../public/og-image.png", import.meta.url));
    expect(image.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(image.readUInt32BE(16)).toBe(1200);
    expect(image.readUInt32BE(20)).toBe(630);
  });

  it("uses only valid, distinct, non-self internal recommendations for each calculator", () => {
    const toolIds = new Set(tools.map((tool) => tool.id));
    for (const tool of tools) {
      const related = getRelatedTools(tool.id);
      const ids = related.map((item) => item.id);
      expect(relatedToolIds[tool.id], tool.id).toBeDefined();
      expect(ids.length, tool.id).toBeGreaterThanOrEqual(2);
      expect(ids.length, tool.id).toBeLessThanOrEqual(3);
      expect(new Set(ids).size, tool.id).toBe(ids.length);
      expect(ids, tool.id).not.toContain(tool.id);
      for (const id of ids) expect(toolIds.has(id), `${tool.id} -> ${id}`).toBe(true);
    }
  });

  it("publishes the AdSense seller declaration at the public root", () => {
    const adsTxt = readFileSync(new URL("../../public/ads.txt", import.meta.url), "utf8").trim();
    expect(adsTxt).toBe("google.com, pub-6994844378081796, DIRECT, f08c47fec0942fa0");
  });

  it("generates one canonical sitemap URL for every static page, category, and calculator", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(entries).toHaveLength(6 + categories.length + tools.length);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.startsWith("https://www.hesappratik.xyz/"))).toBe(true);
    for (const tool of tools) expect(urls).toContain(`https://www.hesappratik.xyz/${tool.id}`);
    expect(urls).toContain("https://www.hesappratik.xyz/kullanim-kosullari");
    expect(urls).toContain("https://www.hesappratik.xyz/cerez-politikasi");
  });
});
