import type { Metadata } from "next";
import { CategoryLanding } from "@/components/CategoryLanding";

export const metadata: Metadata = {
  title: "Günlük Yaşam Hesaplama Araçları – Ölçü ve Dönüşüm | PratikHesap",
  description: "Metrekare, vücut kitle indeksi, litre, kilogram ve saat dakika dönüşümlerini hesaplayın.",
  alternates: { canonical: "/gunluk-yasam" }
};

export default function GunlukYasamPage() {
  return <main><CategoryLanding categoryId="gunluk-yasam" /></main>;
}
