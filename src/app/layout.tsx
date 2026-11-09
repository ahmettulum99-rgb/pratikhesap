import type { Metadata } from "next";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { adsenseScriptSrc } from "@/lib/ads";
import { siteUrl } from "@/lib/site";
import { getOpenGraphImageUrl } from "@/lib/seo/metadata";
import { homeMetaDescription, homeMetaTitle } from "@/data/home-seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: homeMetaTitle,
    template: "%s"
  },
  description: homeMetaDescription,
  applicationName: "PratikHesap",
  manifest: "/manifest.webmanifest",
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
    title: homeMetaTitle,
    description: homeMetaDescription,
    url: "/",
    images: [{
      url: getOpenGraphImageUrl(homeMetaTitle),
      width: 1200,
      height: 630,
      alt: `${homeMetaTitle} – PratikHesap`
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: homeMetaTitle,
    description: homeMetaDescription,
    images: [getOpenGraphImageUrl(homeMetaTitle)]
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#142B4A"
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "PratikHesap",
    url: siteUrl,
    description: "Ücretsiz çevrimiçi hesaplama araçları.",
    inLanguage: "tr-TR",
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?ara={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "PratikHesap",
    url: siteUrl,
    description: "Ücretsiz çevrimiçi hesaplama araçları.",
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/icon.svg`
    }
  }
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem("pratikhesap.theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}`}
        </Script>
        <script async src={adsenseScriptSrc} crossOrigin="anonymous" />
      </head>
      <body>
        {structuredData.map((data) => <JsonLd key={data["@type"]} data={data} />)}
        <a className="skip-link" href="#main-content">İçeriğe geç</a>
        <Header />
        <AdSlot placement="header" className="container-page my-3" />
        <div id="main-content" tabIndex={-1}>{children}</div>
        <AdSlot placement="footer" className="container-page mt-8" />
        <Footer />
      </body>
    </html>
  );
}
