"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const themeStorageKey = "pratikhesap.theme";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  window.dispatchEvent(new Event("pratikhesap:theme-change"));
}

function getThemeSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribeToTheme(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const syncSystemTheme = (event: MediaQueryListEvent) => {
    let hasManualPreference = false;
    try {
      hasManualPreference = Boolean(window.localStorage.getItem(themeStorageKey));
    } catch {
      hasManualPreference = true;
    }
    if (!hasManualPreference) {
      document.documentElement.classList.toggle("dark", event.matches);
      document.documentElement.style.colorScheme = event.matches ? "dark" : "light";
      onChange();
    }
  };
  window.addEventListener("pratikhesap:theme-change", onChange);
  media.addEventListener("change", syncSystemTheme);
  return () => {
    window.removeEventListener("pratikhesap:theme-change", onChange);
    media.removeEventListener("change", syncSystemTheme);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // The selected theme still applies for this page view.
    }
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={theme === "dark" ? "Açık temaya geç" : "Karanlık temaya geç"}
      title={theme === "dark" ? "Açık tema" : "Karanlık tema"}
    >
      {theme === "dark" ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
      <span className="sr-only">{theme === "dark" ? "Açık temaya geç" : "Karanlık temaya geç"}</span>
    </button>
  );
}
