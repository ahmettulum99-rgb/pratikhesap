import type { MetadataRoute } from "next";
import { categories, tools } from "../data/tools";
import { siteUrl } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/hakkimizda",
    "/iletisim",
    "/gizlilik-politikasi",
    "/kullanim-kosullari",
    "/cerez-politikasi"
  ];
  return [
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.5
    })),
    ...categories.map((category) => ({ url: `${siteUrl}${category.href}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...tools.map((tool) => ({ url: `${siteUrl}/${tool.id}`, changeFrequency: "monthly" as const, priority: tool.popular ? 0.9 : 0.8 }))
  ];
}
