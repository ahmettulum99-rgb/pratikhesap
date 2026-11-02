import type { Metadata } from "next";
import { CategoryLanding } from "@/components/CategoryLanding";

export const metadata: Metadata = {
  title: "Tarih Hesaplama Araçları – Yaş ve Gün Farkı | PratikHesap",
  description: "Yaşınızı, iki tarih arasındaki gün farkını ve tarihe gün ekleme veya çıkarma sonucunu hesaplayın.",
  keywords: ["tarih hesaplama", "yaş hesaplama", "iki tarih arası gün", "iş günü hesaplama", "doğum gününe kalan süre"],
  alternates: { canonical: "/tarih" }
};

export default function TarihPage() {
  return <main><CategoryLanding categoryId="tarih" /></main>;
}
