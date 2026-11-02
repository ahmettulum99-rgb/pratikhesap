import { CategoryLanding } from "@/components/CategoryLanding";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Eğitim Hesaplama Araçları – Not ve Sınav Puanı | PratikHesap",
  description: "4'lük sistem GPA/AGNO, AKTS kredi ortalaması, vize-final notu, gerekli final puanı ve harf notu araçlarını kullanın.",
  path: "/egitim",
  keywords: ["4'lük not sistemi hesaplama", "GPA hesaplama", "AGNO hesaplama", "AKTS ortalaması", "vize final not hesaplama", "finalde kaç almalıyım", "harf notu hesaplama"]
});

export default function EgitimPage() {
  return <main><CategoryLanding categoryId="egitim" /></main>;
}
