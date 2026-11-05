import type { Metadata } from "next";
import { siteUrl } from "../site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createPageMetadata({ title, description, path, keywords }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: "PratikHesap",
      title,
      description,
      url: `${siteUrl}${path === "/" ? "" : path}`,
      images: [{
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PratikHesap – Hesaplamak artık çok kolay"
      }]
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] }
  };
}
