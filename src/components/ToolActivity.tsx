"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import type { ToolSummary } from "@/data/tools";
import { favoriteToolsKey, readToolIds, rememberTool, saveToolIds, recentToolsKey, toggleFavoriteTool, toolStorageEvent } from "@/lib/local-tools";

type Props = {
  tools: ToolSummary[];
  currentTool?: ToolSummary;
};

export function ToolActivity({ tools, currentTool }: Props) {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [storageError, setStorageError] = useState(false);
  const toolById = useMemo(() => new Map(tools.map((tool) => [tool.id, tool])), [tools]);

  useEffect(() => {
    const load = (event?: Event) => {
      setRecentIds(readToolIds(recentToolsKey).filter((id) => toolById.has(id)));
      setFavoriteIds(readToolIds(favoriteToolsKey).filter((id) => toolById.has(id)));
      if (event instanceof CustomEvent && typeof event.detail?.saved === "boolean") {
        setStorageError(!event.detail.saved);
      }
    };
    load();
    window.addEventListener("storage", load);
    const onToolStorage = (event: Event) => load(event);
    window.addEventListener(toolStorageEvent, onToolStorage);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener(toolStorageEvent, onToolStorage);
    };
  }, [toolById]);

  useEffect(() => {
    if (!currentTool) return;
    rememberTool(currentTool.id);
  }, [currentTool]);

  function toggleCurrentFavorite() {
    if (!currentTool) return;
    const update = toggleFavoriteTool(currentTool.id);
    setStorageError(!update.saved);
    setFavoriteIds(readToolIds(favoriteToolsKey));
  }

  if (currentTool) {
    const isFavorite = favoriteIds.includes(currentTool.id);
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggleCurrentFavorite}
          aria-pressed={isFavorite}
          className="secondary-button"
        >
          <Heart size={17} aria-hidden="true" className={isFavorite ? "fill-current text-rose-600" : ""} />
          {isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
        </button>
        {storageError && <p role="status" className="text-sm text-amber-800">Tarayıcı depolaması kullanılamıyor; tercihiniz kaydedilmedi.</p>}
      </div>
    );
  }

  const recentTools = recentIds.map((id) => toolById.get(id)).filter((tool): tool is ToolSummary => Boolean(tool)).slice(0, 5);
  const favoriteTools = favoriteIds.map((id) => toolById.get(id)).filter((tool): tool is ToolSummary => Boolean(tool));

  return (
    <>
      {storageError && <p role="status" className="mb-4 text-sm text-amber-800">Tarayıcı depolaması kullanılamıyor; son kullanılanlar ve favoriler kaydedilemedi.</p>}
      {recentTools.length > 0 && (
        <section aria-labelledby="recent-tools-heading" className="mb-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Cihazınızda saklanır</p>
              <h2 id="recent-tools-heading" className="section-title mt-2">Son kullandıklarım</h2>
            </div>
            <button type="button" className="text-sm font-semibold text-blue hover:underline" onClick={() => {
              const saved = saveToolIds(recentToolsKey, []);
              setStorageError(!saved);
              setRecentIds([]);
            }}>Temizle</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => <ToolLink key={tool.id} tool={tool} />)}
          </div>
        </section>
      )}
      {favoriteTools.length > 0 && (
        <section aria-labelledby="favorite-tools-heading" className="mb-8">
          <p className="eyebrow">Hızlı erişim</p>
          <h2 id="favorite-tools-heading" className="section-title mt-2">Favorilerim</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => <ToolLink key={tool.id} tool={tool} />)}
          </div>
        </section>
      )}
      {recentTools.length === 0 && favoriteTools.length === 0 && (
        <p className="mb-8 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Kullandığınız araçları son kullanılanlar listesinde görmek için bir hesaplama sayfasını ziyaret edin. Favorileriniz yalnızca bu cihazda saklanır.
        </p>
      )}
    </>
  );
}

function ToolLink({ tool }: { tool: ToolSummary }) {
  return (
    <Link href={`/${tool.id}`} className="tool-card min-h-0 p-4">
      <span className="font-semibold text-navy">{tool.name}</span>
      <span className="mt-1 block text-sm text-slate-600">{tool.description}</span>
    </Link>
  );
}

export function FavoriteToolButton({ toolId, tools }: { toolId: string; tools: ToolSummary[] }) {
  const tool = tools.find((item) => item.id === toolId);
  return tool ? <ToolActivity tools={tools} currentTool={tool} /> : null;
}
