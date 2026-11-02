import type { Metadata } from "next";
import { CategoryLanding } from "@/components/CategoryLanding";

export const metadata: Metadata = {
  title: "Eğitim Hesaplama Araçları – Not ve Sınav Puanı | PratikHesap",
  description: "Not ortalaması, sınav puanı, başarı yüzdesi ve harf notu hesaplama araçlarını keşfedin.",
  alternates: { canonical: "/egitim" }
};

export default function EgitimPage() {
  return <main><CategoryLanding categoryId="egitim" /></main>;
}
