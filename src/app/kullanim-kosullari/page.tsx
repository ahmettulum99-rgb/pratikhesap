import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageStructuredData } from "@/components/PageStructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Kullanım Koşulları | PratikHesap",
  description: "PratikHesap hesaplama araçlarının kullanım kapsamı, varsayımları ve bilgilendirme sınırları.",
  path: "/kullanim-kosullari"
});

export default function TermsPage() {
  return (
    <main className="container-page py-10 sm:py-14">
      <PageStructuredData name="Kullanım Koşulları | PratikHesap" description="PratikHesap hesaplama araçlarının kullanım kapsamı ve bilgilendirme sınırları." path="/kullanim-kosullari" />
      <Breadcrumb items={[{ label: "Kullanım Koşulları" }]} path="/kullanim-kosullari" />
      <article className="max-w-3xl">
        <p className="eyebrow">Kullanım</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Kullanım Koşulları</h1>
        <p className="mt-5 leading-7 text-slate-600">PratikHesap’taki araçlar, sayfalarında açıklanan formül ve girdilere göre genel bilgilendirme amacıyla hesaplama yapar. Aracı kullanırken girdiğiniz bilgilerin doğruluğunu ve seçtiğiniz oranların ya da varsayımların size uygunluğunu kontrol etmeniz gerekir.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Sonuçların kapsamı</h2>
        <p className="mt-3 leading-7 text-slate-600">Hesaplama sonuçları finansal, hukuki, tıbbi veya eğitim kurumuna özgü profesyonel danışmanlık ya da resmî karar değildir. Kredi maliyetleri masraf ve sözleşme koşullarına; kur sonuçları TCMB bültenine; vergi ve not hesapları ise seçtiğiniz oranlara veya kurum kurallarına bağlı olarak farklılık gösterebilir. Önemli kararlar öncesinde yetkili kurum veya uzmanınızdan doğrulama alın.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Hizmet ve üçüncü taraflar</h2>
        <p className="mt-3 leading-7 text-slate-600">Araçlar üyelik gerektirmeden sunulur. Döviz aracı TCMB’nin yayımladığı gösterge satış kurunu kullanır; üçüncü taraf reklam hizmetleri kendi koşullarına tabidir. Site özellikleri ve kaynakları güncellenebilir; bu araçların kesintisiz veya hatasız çalışacağı garanti edilmez.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Gizlilik</h2>
        <p className="mt-3 leading-7 text-slate-600">Hesaplama değerlerinin ve reklam hizmetlerinin işlenme biçimi için <Link className="font-semibold text-blue underline" href="/gizlilik-politikasi">Gizlilik Politikası</Link>’nı inceleyin.</p>
      </article>
    </main>
  );
}
