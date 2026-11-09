import { CategoryLanding } from "@/components/CategoryLanding";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Tarih Hesaplama Araçları – Yaş ve Gün Farkı | PratikHesap",
  description: "Yaşınızı, iki tarih arasındaki gün farkını ve tarihe gün ekleme veya çıkarma sonucunu hesaplayın.",
  path: "/tarih"
});

export default function TarihPage() {
  return <main><CategoryLanding categoryId="tarih" /></main>;
}
