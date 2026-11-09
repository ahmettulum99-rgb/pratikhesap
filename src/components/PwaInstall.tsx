"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        setMessage("Uygulama çevrimdışı desteği başlatılamadı.");
      });
    }
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setMessage("PratikHesap cihazınıza eklendi.");
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) {
      setMessage(/iphone|ipad|ipod/i.test(navigator.userAgent)
        ? "Yüklemek için Paylaş menüsünü açıp “Ana Ekrana Ekle” seçeneğine dokunun."
        : "Yükleme seçeneği tarayıcı menüsünde bulunabilir: “Uygulamayı yükle” veya “Ana ekrana ekle”.");
      return;
    }
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setMessage(choice.outcome === "accepted" ? "PratikHesap yükleniyor." : "Uygulama yükleme isteği kapatıldı.");
      setInstallPrompt(null);
    } catch {
      setMessage("Uygulama yükleme penceresi açılamadı. Tarayıcı menüsünü deneyin.");
    }
  }

  return (
    <div className="pwa-install-wrap">
      <button type="button" className="pwa-install-button" onClick={installApp}>
        <Download size={16} aria-hidden="true" />
        <span>Uygulamayı yükle</span>
      </button>
      {message && <p role="status" className="pwa-install-message">{message}</p>}
    </div>
  );
}
