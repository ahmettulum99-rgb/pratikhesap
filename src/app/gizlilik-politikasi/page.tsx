import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | PratikHesap",
  description: "PratikHesap'ın hesaplama girdileri, çerezler ve kullanıcı gizliliği konusundaki yaklaşımı.",
  alternates: { canonical: "/gizlilik-politikasi" }
};

export default function PrivacyPage() {
  return (
    <main className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Gizlilik Politikası" }]} path="/gizlilik-politikasi" />
      <article className="max-w-3xl">
        <p className="eyebrow">Gizlilik</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Gizlilik Politikası</h1>
        <p className="mt-5 leading-7 text-slate-600">PratikHesap, temel hesaplama araçlarını çalıştırmak için kullanıcı hesabı veya kişisel bilgi istemez. Araçlara girdiğiniz değerler tarayıcınızda hesaplanır; bu sürümde hesaplama girdileri sunucuya gönderilmez veya sitede saklanmaz.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Çerezler ve reklamlar</h2>
        <p className="mt-3 leading-7 text-slate-600">Bu sürümde reklam gösterimi ve reklam sağlayıcısı entegrasyonu etkin değildir. İleride analiz veya reklam hizmetleri eklenirse bu politika güncellenerek kullanılan hizmetler ve çerezler açıklanacaktır.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Politika değişiklikleri</h2>
        <p className="mt-3 leading-7 text-slate-600">Siteye yeni özellikler veya üçüncü taraf hizmetleri eklendiğinde bu sayfa yeni uygulamaları açıklayacak şekilde güncellenir.</p>
      </article>
    </main>
  );
}
