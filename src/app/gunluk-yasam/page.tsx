import type { Metadata } from "next";
import { CategoryLanding } from "@/components/CategoryLanding";

export const metadata: Metadata = {
  title: "Günlük Yaşam Hesaplama Araçları – Ölçü ve Dönüşüm | PratikHesap",
  description: "Metrekare, VKİ, litre ve kilogram dönüşümlerine ek olarak araç yakıt tüketimi ve kWh enerji maliyetini hesaplayın.",
  keywords: ["metrekare hesaplama", "VKİ hesaplama", "yakıt tüketimi", "100 km yakıt hesaplama", "kWh elektrik maliyeti", "litre dönüşümü", "kilogram dönüşümü"],
  alternates: { canonical: "/gunluk-yasam" }
};

export default function GunlukYasamPage() {
  return <main><CategoryLanding categoryId="gunluk-yasam" /></main>;
}
