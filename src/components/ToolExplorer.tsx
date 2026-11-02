"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { CategoryId, ToolDefinition } from "@/data/tools";
import { categories } from "@/data/tools";
import { ToolCard } from "./ToolCard";

export function ToolExplorer({
  tools,
  showSearch = true,
  initialCategory
}: {
  tools: ToolDefinition[];
  showSearch?: boolean;
  initialCategory?: CategoryId;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "tumu">(initialCategory ?? "tumu");
  const filtered = useMemo(() => tools.filter((tool) => {
    const matchesCategory = category === "tumu" || tool.category === category;
    const searchText = `${tool.name} ${tool.description}`.toLocaleLowerCase("tr-TR");
    return matchesCategory && searchText.includes(query.trim().toLocaleLowerCase("tr-TR"));
  }), [category, query, tools]);

  return (
    <div>
      {showSearch && (
        <div className="mb-6 space-y-4">
          <label className="relative block">
            <span className="sr-only">Hesaplama aracı ara</span>
            <Search size={19} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Hangi hesabı yapmak istiyorsunuz?"
              className="search-input"
              type="search"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2" aria-label="Kategori filtreleri">
            <SlidersHorizontal size={17} aria-hidden="true" className="mr-1 text-slate-500" />
            <button type="button" className={`filter-chip ${category === "tumu" ? "filter-chip-active" : ""}`} onClick={() => setCategory("tumu")} aria-pressed={category === "tumu"}>Tüm araçlar</button>
            {categories.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`filter-chip ${category === item.id ? "filter-chip-active" : ""}`}
                onClick={() => setCategory(item.id)}
                aria-pressed={category === item.id}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">Aramanızla eşleşen bir araç bulamadık. Farklı bir kelime deneyin.</p>
      )}
    </div>
  );
}
