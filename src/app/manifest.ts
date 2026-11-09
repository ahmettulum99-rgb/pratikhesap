import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "PratikHesap – Hesaplamak artık çok kolay",
    short_name: "PratikHesap",
    description: "Finans, tarih, eğitim ve günlük yaşam için ücretsiz hesaplama araçları.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F5F8FC",
    theme_color: "#142B4A",
    lang: "tr",
    dir: "ltr",
    categories: ["utilities", "finance", "education"],
    prefer_related_applications: false,
    icons: [
      { src: "/pwa-icon.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: "/pwa-icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
      { src: "/pwa-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }
    ]
  };
}
