export const recentToolsKey = "pratikhesap.recent-tools";
export const favoriteToolsKey = "pratikhesap.favorite-tools";
export const toolStorageEvent = "pratikhesap:storage";

export function readToolIds(key: string): string[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(stored)
      ? [...new Set(stored.filter((value): value is string => typeof value === "string"))]
      : [];
  } catch {
    return [];
  }
}

export function saveToolIds(key: string, ids: string[]): boolean {
  let saved = true;
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    saved = false;
  }
  window.dispatchEvent(new CustomEvent(toolStorageEvent, { detail: { saved } }));
  return saved;
}

export function rememberTool(id: string): boolean {
  const recent = readToolIds(recentToolsKey).filter((recentId) => recentId !== id);
  return saveToolIds(recentToolsKey, [id, ...recent].slice(0, 8));
}

export function toggleFavoriteTool(id: string): { favorite: boolean; saved: boolean } {
  const favorites = readToolIds(favoriteToolsKey);
  const favorite = !favorites.includes(id);
  const next = favorite ? [...favorites, id] : favorites.filter((favoriteId) => favoriteId !== id);
  return { favorite, saved: saveToolIds(favoriteToolsKey, next) };
}
