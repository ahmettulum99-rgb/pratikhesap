import type { MetadataRoute } from "next";
import { categories, tools } from "../data/tools";
import { siteUrl } from "../lib/site";

const staticPageLastModified: Record<string, string> = {
  "/hakkimizda": "2026-11-09",
  "/iletisim": "2026-11-09",
  "/gizlilik-politikasi": "2026-11-09",
  "/kullanim-kosullari": "2026-11-02",
  "/cerez-politikasi": "2026-11-09"
};

function getToolLastModified(tool: (typeof tools)[number]): string | undefined {
  const date = tool.updatedAt;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;
  const parsedDate = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date
    ? undefined
    : date;
}

function latestDate(dates: (string | undefined)[]): string | undefined {
  return dates.filter((date): date is string => Boolean(date)).sort().at(-1);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/hakkimizda",
    "/iletisim",
    "/gizlilik-politikasi",
    "/kullanim-kosullari",
    "/cerez-politikasi"
  ];
  const toolLastModified = new Map(tools.map((tool) => [tool.id, getToolLastModified(tool)]));

  return [
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      ...(path === "/" && { lastModified: latestDate([...toolLastModified.values()]) }),
      ...(staticPageLastModified[path] && { lastModified: staticPageLastModified[path] }),
      priority: path === "/" ? 1 : 0.5
    })),
    ...categories.map((category) => ({
      url: `${siteUrl}${category.href}`,
      lastModified: latestDate(tools.filter((tool) => tool.category === category.id).map((tool) => toolLastModified.get(tool.id))),
      priority: 0.7
    })),
    ...tools.map((tool) => ({
      url: `${siteUrl}/${tool.id}`,
      lastModified: toolLastModified.get(tool.id),
      priority: tool.popular ? 0.9 : 0.8
    }))
  ];
}
