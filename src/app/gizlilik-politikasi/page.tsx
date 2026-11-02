import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageStructuredData } from "@/components/PageStructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Gizlilik Politikası | PratikHesap",
  description: "PratikHesap'ın hesaplama girdileri, çerezler ve kullanıcı gizliliği konusundaki yaklaşımı.",
  path: "/gizlilik-politikasi"
});

export default function PrivacyPage() {
  return (
    <main className="container-page py-10 sm:py-14">
      <PageStructuredData name="Gizlilik Politikası | PratikHesap" description="PratikHesap'ın hesaplama girdileri, çerezler ve reklam hizmetleri hakkındaki açıklamaları." path="/gizlilik-politikasi" />
      <Breadcrumb items={[{ label: "Gizlilik Politikası" }]} path="/gizlilik-politikasi" />
      <article className="max-w-3xl">
        <p className="eyebrow">Gizlilik</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Gizlilik Politikası</h1>
        <p className="mt-5 leading-7 text-slate-600">PratikHesap hesaplama araçları için üyelik veya hesap açmanızı istemez. Araçlarda girdiğiniz tutar, not ve tarih değerleri tarayıcınızda işlenir; site bu değerleri uygulama veritabanında saklamaz. Döviz aracında seçilen para birimi kur isteği için PratikHesap sunucusuna iletilir; girdiğiniz döviz miktarı ile hesaplanan sonuç sunucuya gönderilmez. Sunucu, kur verisini TCMB’nin yayımladığı bültenden alır.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Çerezler ve reklamlar</h2>
        <p className="mt-3 leading-7 text-slate-600">Google AdSense reklam hizmeti betiği sayfalara yüklenir. Google ve iş ortakları reklam sunmak, ölçmek ve ayarlarınıza bağlı olarak kişiselleştirmek için tarayıcı veya cihaz bilgilerini ve çerezler ya da benzer teknolojileri kullanabilir. Bu üçüncü tarafların veri işleme koşulları Google’ın <a className="font-semibold text-blue underline" href="https://policies.google.com/technologies/ads">Reklam Teknolojileri Politikası</a> ve ilgili gizlilik açıklamalarında yer alır.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Teknik kayıtlar ve tercih yönetimi</h2>
        <p className="mt-3 leading-7 text-slate-600">Site, hesaplama girdilerini analiz veya reklam amacıyla kendi uygulamasında toplamaz. Siteyi barındıran altyapı, hizmetin güvenliği ve çalışması için standart teknik istek kayıtlarını kendi koşullarına göre işleyebilir. Google reklam tercihlerinizi <a className="font-semibold text-blue underline" href="https://adssettings.google.com/">Google Reklam Ayarları</a> üzerinden, çerezleri ise tarayıcınızdan yönetebilirsiniz. Ayrıntılar için <Link className="font-semibold text-blue underline" href="/cerez-politikasi">Çerez Politikası</Link>’na bakın.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Politika değişiklikleri</h2>
        <p className="mt-3 leading-7 text-slate-600">Yeni özellikler veya üçüncü taraf hizmetleri eklendiğinde bu açıklamalar güncellenmelidir. Bu sayfa, sitenin teknik çalışma biçimini açıklar; yasal danışmanlık yerine geçmez.</p>
      </article>
    </main>
  );
}
