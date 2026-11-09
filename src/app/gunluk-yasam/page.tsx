import { CategoryLanding } from "@/components/CategoryLanding";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Günlük Yaşam Hesaplama Araçları – Ölçü ve Dönüşüm | PratikHesap",
  description: "Metrekare, VKİ, gebelik haftası, litre ve kilogram dönüşümü ile yakıt tüketimi ve kWh enerji maliyetini hesaplayın.",
  path: "/gunluk-yasam"
});

export default function GunlukYasamPage() {
  return <main><CategoryLanding categoryId="gunluk-yasam" /></main>;
}
