import { describe, expect, it } from "vitest";
import { categories, tools } from "./tools";

describe("calculator catalog", () => {
  it("includes each requested tool with a unique root URL and SEO metadata", () => {
    expect(tools).toHaveLength(21);
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
});
