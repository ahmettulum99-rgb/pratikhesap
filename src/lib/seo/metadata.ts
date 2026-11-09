import type { Metadata } from "next";
import { siteUrl } from "../site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function getOpenGraphImageUrl(title: string): string {
  return `/api/og?title=${encodeURIComponent(title)}`;
}

export function createPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const image = getOpenGraphImageUrl(title);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: "PratikHesap",
      title,
      description,
      url: `${siteUrl}${path === "/" ? "" : path}`,
      images: [{ url: image, width: 1200, height: 630, alt: `${title} – PratikHesap` }]
    },
    twitter: { card: "summary_large_image", title, description, images: [image] }
  };
}
