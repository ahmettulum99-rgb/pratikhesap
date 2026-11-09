import { CategoryLanding } from "@/components/CategoryLanding";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Finans Hesaplama Araçları – Maaş, Yüzde, KDV | PratikHesap",
  description: "Yüzde, maaş zammı, indirim, KDV, faiz, döviz ve kâr zarar hesaplama araçlarını ücretsiz kullanın.",
  path: "/finans"
});

export default function FinansPage() {
  return <main><CategoryLanding categoryId="finans" /></main>;
}
