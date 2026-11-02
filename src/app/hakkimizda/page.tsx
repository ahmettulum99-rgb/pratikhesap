import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Hakkımızda | PratikHesap",
  description: "PratikHesap'ın amacı, hesaplama araçları ve kullanıcı odaklı yaklaşımı hakkında bilgi alın.",
  alternates: { canonical: "/hakkimizda" }
};

export default function AboutPage() {
  return (
    <main className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Hakkımızda" }]} path="/hakkimizda" />
      <article className="max-w-3xl">
        <p className="eyebrow">PratikHesap</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Hesaplamak artık çok kolay.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">PratikHesap, günlük hayatta ihtiyaç duyulan hesaplamalara kolayca ulaşabilmeniz için hazırlanmış ücretsiz bir araç platformudur.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Nasıl çalışır?</h2>
        <p className="mt-3 leading-7 text-slate-600">Finans, tarih, eğitim ve günlük yaşam kategorilerindeki araçları seçip gerekli değerleri girebilirsiniz. Hesaplamalar tarayıcınızda gerçekleşir; üyelik oluşturmanız gerekmez. Her araçta kullanılan formül ve örnek ayrıca açıklanır.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Doğruluk ve kapsam</h2>
        <p className="mt-3 leading-7 text-slate-600">Araçlar, sayfalarında belirtilen formüller doğrultusunda genel bilgilendirme amacıyla sonuç üretir. Vergi mevzuatı, eğitim kurumlarının not sistemi ve benzeri değişken kurallar için sonuçları ilgili yetkili kaynaklardan doğrulamanız gerekir.</p>
      </article>
    </main>
  );
}
