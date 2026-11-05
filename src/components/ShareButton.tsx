"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ShareButton() {
  const [message, setMessage] = useState("");

  async function sharePage() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMessage("Sayfa paylaşılamadı.");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setMessage("Sayfa bağlantısı kopyalandı.");
    } catch {
      setMessage("Bağlantı kopyalanamadı. Sayfa adresini tarayıcıdan kopyalayabilirsiniz.");
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={sharePage}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue"
      >
        <Share2 size={16} aria-hidden="true" />
        Sayfayı paylaş
      </button>
      <p className="sr-only" role="status" aria-live="polite">{message}</p>
    </div>
  );
}
