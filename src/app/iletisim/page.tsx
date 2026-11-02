import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "İletişim | PratikHesap",
  description: "PratikHesap hakkında bilgi, hata bildirimi veya araç önerisi için iletişim sayfasını ziyaret edin.",
  alternates: { canonical: "/iletisim" }
};

export default function ContactPage() {
  return (
    <main className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "İletişim" }]} path="/iletisim" />
      <article className="max-w-3xl">
        <p className="eyebrow">Bize ulaşın</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">İletişim</h1>
        <p className="mt-5 leading-7 text-slate-600">Hesaplama araçlarıyla ilgili bir hata fark ettiyseniz veya yeni bir araç öneriniz varsa bu sayfadan ulaşabilirsiniz. İletişim kanalı henüz yapılandırılmadığı için burada doğrulanmamış bir e-posta adresi veya çalışmayan bir form yayımlamıyoruz.</p>
      </article>
    </main>
  );
}
