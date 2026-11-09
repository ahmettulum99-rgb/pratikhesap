"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { normalizeTurkishSearchText } from "@/lib/search";

type SearchTool = {
  id: string;
  name: string;
  description: string;
  searchTerms: string[];
};

export function HomeToolSearch({ tools }: { tools: SearchTool[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [hasEditedQuery, setHasEditedQuery] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const urlQuery = searchParams.get("ara") ?? "";
  const displayedQuery = hasEditedQuery ? query : urlQuery;
  const matches = useMemo(() => {
    const normalizedQuery = normalizeTurkishSearchText(displayedQuery.trim());
    if (!normalizedQuery) return [];
    return tools
      .filter((tool) => normalizeTurkishSearchText(`${tool.name} ${tool.description} ${tool.searchTerms.join(" ")}`).includes(normalizedQuery))
      .slice(0, 5);
  }, [displayedQuery, tools]);

  function navigateToFirstMatch() {
    const selected = matches[activeIndex] ?? matches[0];
    if (selected) router.push(`/${selected.id}`);
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
            value={displayedQuery}
            onChange={(event) => {
              setQuery(event.target.value);
              setHasEditedQuery(true);
              setIsOpen(true);
              setActiveIndex(0);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setIsOpen(false);
              if (event.key === "ArrowDown" && matches.length > 0) {
                event.preventDefault();
                setIsOpen(true);
                setActiveIndex((index) => (index + 1) % matches.length);
              }
              if (event.key === "ArrowUp" && matches.length > 0) {
                event.preventDefault();
                setIsOpen(true);
                setActiveIndex((index) => (index - 1 + matches.length) % matches.length);
              }
              if (event.key === "Enter") {
                event.preventDefault();
                navigateToFirstMatch();
              }
            }}
            placeholder="Örn. 4'lük not, KDV, yaş hesaplama"
            autoComplete="off"
            className="hero-search-input"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen && displayedQuery.trim().length > 0}
            aria-controls={isOpen && displayedQuery.trim().length > 0 ? "home-tool-search-results" : undefined}
            aria-activedescendant={isOpen && matches[activeIndex] ? `home-search-option-${matches[activeIndex].id}` : undefined}
          />
          <button type="button" className="hero-search-button" onClick={navigateToFirstMatch}>Ara</button>
        </div>
      </div>
      {isOpen && displayedQuery.trim().length > 0 && (
        <div id="home-tool-search-results" aria-label="Eşleşen hesaplama araçları" className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 text-navy shadow-card">
          {matches.length > 0 ? (
            <ul role="listbox">
              {matches.map((tool) => (
                <li key={tool.id} role="presentation">
                  <Link
                    id={`home-search-option-${tool.id}`}
                    href={`/${tool.id}`}
                    role="option"
                    aria-selected={activeIndex === matches.indexOf(tool)}
                    onClick={() => setIsOpen(false)}
                    onMouseEnter={() => setActiveIndex(matches.indexOf(tool))}
                    className={`flex items-start justify-between gap-3 rounded-lg px-3 py-3 hover:bg-pale-blue focus-visible:bg-pale-blue focus-visible:outline-none ${activeIndex === matches.indexOf(tool) ? "bg-pale-blue" : ""}`}
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
