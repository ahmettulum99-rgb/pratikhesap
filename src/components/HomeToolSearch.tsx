"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

type SearchTool = {
  id: string;
  name: string;
  description: string;
  searchTerms: string[];
};

export function HomeToolSearch({ tools }: { tools: SearchTool[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    if (!normalizedQuery) return [];
    return tools
      .filter((tool) => `${tool.name} ${tool.description} ${tool.searchTerms.join(" ")}`.toLocaleLowerCase("tr-TR").includes(normalizedQuery))
      .slice(0, 5);
  }, [query, tools]);

  function navigateToFirstMatch() {
    if (matches[0]) router.push(`/${matches[0].id}`);
    else setIsOpen(true);
  }

  return (
    <div className="relative mt-7 max-w-2xl">
      <div role="search">
        <label htmlFor="home-tool-search" className="sr-only">Hesaplama aracı ara</label>
        <div className="relative">
          <Search size={20} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="home-tool-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setIsOpen(false);
              if (event.key === "Enter") {
                event.preventDefault();
                navigateToFirstMatch();
              }
            }}
            placeholder="Örn. 4'lük not, KDV, yaş hesaplama"
            autoComplete="off"
            className="hero-search-input"
          />
          <button type="button" className="hero-search-button" onClick={navigateToFirstMatch}>Ara</button>
        </div>
      </div>
      {isOpen && query.trim().length > 0 && (
        <div id="home-tool-search-results" aria-label="Eşleşen hesaplama araçları" className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 text-navy shadow-card">
          {matches.length > 0 ? (
            <ul>
              {matches.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/${tool.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start justify-between gap-3 rounded-lg px-3 py-3 hover:bg-pale-blue focus-visible:bg-pale-blue focus-visible:outline-none"
                  >
                    <span>
                      <span className="block font-semibold">{tool.name}</span>
                      <span className="mt-1 block text-sm leading-5 text-slate-600">{tool.description}</span>
                    </span>
                    <ArrowRight size={17} aria-hidden="true" className="mt-1 shrink-0 text-blue" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p role="status" className="px-3 py-4 text-sm text-slate-600">Eşleşen araç bulamadık. Farklı bir arama deneyin.</p>
          )}
        </div>
      )}
    </div>
  );
}
