import type { Metadata } from "next";
import { CategoryLanding } from "@/components/CategoryLanding";

export const metadata: Metadata = {
  title: "Finans Hesaplama Araçları – Maaş, Yüzde, KDV | PratikHesap",
  description: "Yüzde, maaş zammı, indirim, KDV ve kâr zarar hesaplama araçlarını ücretsiz kullanın.",
  alternates: { canonical: "/finans" }
};

export default function FinansPage() {
  return <main><CategoryLanding categoryId="finans" /></main>;
}
