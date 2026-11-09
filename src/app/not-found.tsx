import Link from "next/link";
import type { Metadata } from "next";
import { getOpenGraphImageUrl } from "@/lib/seo/metadata";

const title = "Sayfa Bulunamadı | PratikHesap";
const description = "Aradığınız sayfayı bulamadık. PratikHesap'ta yüzde, maaş, KDV, tarih ve eğitim hesaplama araçlarını keşfedin.";
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: getOpenGraphImageUrl(title), width: 1200, height: 630, alt: title }]
  },
  twitter: { card: "summary_large_image", title, description, images: [getOpenGraphImageUrl(title)] },
  robots: { index: false, follow: true }
};

export default function NotFound() {
  return (
    <main className="container-page grid min-h-[55vh] place-content-center py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue">404 · Sayfa bulunamadı</p>
      <h1 className="mt-3 text-3xl font-extrabold text-navy">Aradığınız sayfaya ulaşamadık.</h1>
      <p className="mt-3 max-w-lg text-slate-600">Adres değişmiş veya sayfa kaldırılmış olabilir. Ana sayfadan ihtiyacınız olan hesaplama aracını bulabilirsiniz.</p>
      <Link href="/" className="primary-button mx-auto mt-6">Ana sayfaya dön</Link>
    </main>
  );
}
