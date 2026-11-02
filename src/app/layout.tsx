import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { adsenseScriptSrc } from "@/lib/ads";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PratikHesap – Hesaplamak artık çok kolay",
    template: "%s"
  },
  description: "Finans, tarih, eğitim ve günlük yaşam için ücretsiz, kolay ve hızlı hesaplama araçları.",
  keywords: [
    "hesaplama araçları",
    "ücretsiz hesap makinesi",
    "çevrimiçi hesaplama",
    "yüzde hesaplama",
    "maaş zam hesaplama",
    "KDV hesaplama",
    "yaş hesaplama",
    "not ortalaması hesaplama",
    "4'lük not sistemi hesaplama",
    "vize final hesaplama",
    "tarih hesaplama",
    "birim dönüştürme"
  ],
  applicationName: "PratikHesap",
  verification: {
    google: "IrtJCR_0HoQKTJDawAT19KNVGhkNvTABV-nO6cyC6jw"
  },
  other: {
    "google-adsense-account": "ca-pub-6994844378081796"
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "PratikHesap",
    title: "PratikHesap – Hesaplamak artık çok kolay",
    description: "Günlük ihtiyaçlarınız için ücretsiz hesaplama araçları.",
    url: "/"
  },
  twitter: {
    card: "summary",
    title: "PratikHesap – Hesaplamak artık çok kolay",
    description: "Finans, tarih, eğitim ve günlük yaşam için ücretsiz, kolay ve hızlı hesaplama araçları."
  },
  robots: { index: true, follow: true }
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "PratikHesap",
    url: siteUrl,
    description: "Ücretsiz çevrimiçi hesaplama araçları.",
    publisher: { "@id": `${siteUrl}/#organization` }
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "PratikHesap",
    url: siteUrl
  }
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr">
      <head>
        <script async src={adsenseScriptSrc} crossOrigin="anonymous" />
      </head>
      <body>
        {structuredData.map((data) => <JsonLd key={data["@type"]} data={data} />)}
        <Header />
        <AdSlot placement="header" className="container-page my-3" />
        {children}
        <AdSlot placement="footer" className="container-page mt-8" />
        <Footer />
      </body>
    </html>
  );
}
