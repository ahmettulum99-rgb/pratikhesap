import { Breadcrumb } from "@/components/Breadcrumb";
import { PageStructuredData } from "@/components/PageStructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Hakkımızda | PratikHesap",
  description: "PratikHesap'ın amacı, hesaplama araçları ve kullanıcı odaklı yaklaşımı hakkında bilgi alın.",
  path: "/hakkimizda"
});

export default function AboutPage() {
  return (
    <main className="container-page py-10 sm:py-14">
      <PageStructuredData name="Hakkımızda | PratikHesap" description="PratikHesap'ın amacı, hesaplama araçları ve kullanıcı odaklı yaklaşımı." path="/hakkimizda" />
      <Breadcrumb items={[{ label: "Hakkımızda" }]} path="/hakkimizda" />
      <article className="max-w-3xl">
        <p className="eyebrow">PratikHesap</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Hesaplamak artık çok kolay.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">PratikHesap, günlük hayatta ihtiyaç duyulan hesaplamalara kolayca ulaşabilmeniz için hazırlanmış ücretsiz bir araç platformudur.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Nasıl çalışır?</h2>
        <p className="mt-3 leading-7 text-slate-600">Finans, tarih, eğitim ve günlük yaşam kategorilerindeki araçları seçip gerekli değerleri girebilirsiniz. Hesaplama girdileri tarayıcınızda işlenir; döviz aracı yalnızca seçilen para biriminin kodunu kur isteği için sunucuya gönderir. Üyelik oluşturmanız gerekmez. Her araçta kullanılan formül ve örnek ayrıca açıklanır.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Doğruluk ve kapsam</h2>
        <p className="mt-3 leading-7 text-slate-600">Araçlar, sayfalarında belirtilen formüller doğrultusunda genel bilgilendirme amacıyla sonuç üretir. Vergi mevzuatı, eğitim kurumlarının not sistemi ve benzeri değişken kurallar için sonuçları ilgili yetkili kaynaklardan doğrulamanız gerekir.</p>
      </article>
    </main>
  );
}
