import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
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
  applicationName: "PratikHesap",
  verification: {
    google: "IrtJCR_0HoQKTJDawAT19KNVGhkNvTABV-nO6cyC6jw"
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "PratikHesap",
    title: "PratikHesap – Hesaplamak artık çok kolay",
    description: "Günlük ihtiyaçlarınız için ücretsiz hesaplama araçları."
  },
  robots: { index: true, follow: true }
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PratikHesap",
    url: siteUrl,
    description: "Ücretsiz çevrimiçi hesaplama araçları."
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PratikHesap",
    url: siteUrl
  }
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr">
      <Script
        src={adsenseScriptSrc}
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
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
