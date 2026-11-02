import { CategoryLanding } from "@/components/CategoryLanding";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Tarih Hesaplama Araçları – Yaş ve Gün Farkı | PratikHesap",
  description: "Yaşınızı, iki tarih arasındaki gün farkını ve tarihe gün ekleme veya çıkarma sonucunu hesaplayın.",
  path: "/tarih",
  keywords: ["tarih hesaplama", "yaş hesaplama", "iki tarih arası gün", "iş günü hesaplama", "doğum gününe kalan süre"]
});

export default function TarihPage() {
  return <main><CategoryLanding categoryId="tarih" /></main>;
}
