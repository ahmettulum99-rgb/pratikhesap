import { CategoryLanding } from "@/components/CategoryLanding";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Eğitim Hesaplama Araçları – Not ve Sınav Puanı | PratikHesap",
  description: "4'lük sistem GPA/AGNO, AKTS kredi ortalaması, vize-final notu, gerekli final puanı ve harf notu araçlarını kullanın.",
  path: "/egitim"
});

export default function EgitimPage() {
  return <main><CategoryLanding categoryId="egitim" /></main>;
}
