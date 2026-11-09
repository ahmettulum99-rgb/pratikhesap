"use client";

import { useRef, useState } from "react";
import { Code2, Copy, X } from "lucide-react";

export function EmbedToolButton({ toolId, toolName, siteUrl }: { toolId: string; toolName: string; siteUrl: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState("");
  const embedUrl = `${siteUrl}/embed/${toolId}`;
  const embedCode = `<iframe src="${embedUrl}" title="${toolName} - PratikHesap" width="100%" height="560" style="border:0;border-radius:12px;max-width:100%;" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;

  async function copyEmbedCode() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setMessage("Gömme kodu panoya kopyalandı.");
    } catch {
      setMessage("Kod kopyalanamadı. Kodu seçip elle kopyalayabilirsiniz.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMessage("");
          dialogRef.current?.showModal();
        }}
        className="secondary-button"
        aria-haspopup="dialog"
      >
        <Code2 size={17} aria-hidden="true" />
        Bu aracı sitene ekle
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="embed-dialog-title"
        onClose={() => setMessage("")}
        className="w-[min(100%-2rem,38rem)] rounded-2xl border border-slate-200 bg-white p-0 text-navy shadow-2xl backdrop:bg-navy/50"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
          <div>
            <p className="eyebrow">Gömülebilir hesaplama aracı</p>
            <h2 id="embed-dialog-title" className="mt-2 text-xl font-bold">{toolName}</h2>
          </div>
          <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Pencereyi kapat">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-sm leading-6 text-slate-600">Bu kodu sitenizin HTML alanına ekleyin. Araç, PratikHesap üzerinden iframe içinde açılır.</p>
          <label htmlFor={`embed-code-${toolId}`} className="sr-only">Gömme kodu</label>
          <textarea
            id={`embed-code-${toolId}`}
            readOnly
            rows={5}
            value={embedCode}
            onFocus={(event) => event.currentTarget.select()}
            className="form-input mt-4 resize-y font-mono text-xs leading-5"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={copyEmbedCode} className="primary-button">
              <Copy size={16} aria-hidden="true" />
              Kodu kopyala
            </button>
            <a className="text-sm font-semibold text-blue underline" href={`${siteUrl}/embed/${toolId}`} target="_blank" rel="noopener noreferrer">
              Önizlemeyi aç
            </a>
          </div>
          <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-slate-600">{message}</p>
        </div>
      </dialog>
    </>
  );
}
