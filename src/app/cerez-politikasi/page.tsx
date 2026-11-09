import { Breadcrumb } from "@/components/Breadcrumb";
import { PageStructuredData } from "@/components/PageStructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Çerez Politikası | PratikHesap",
  description: "PratikHesap'ın tarayıcı yerel depolaması, Google AdSense, analitik ve çerez tercihleri hakkındaki güncel açıklaması.",
  path: "/cerez-politikasi"
});

export default function CookiePolicyPage() {
  return (
    <main className="container-page py-10 sm:py-14">
      <PageStructuredData name="Çerez Politikası | PratikHesap" description="PratikHesap'ta Google AdSense ve üçüncü taraf çerez kullanımı hakkında açıklama." path="/cerez-politikasi" />
      <Breadcrumb items={[{ label: "Çerez Politikası" }]} path="/cerez-politikasi" />
      <article className="max-w-3xl">
        <p className="eyebrow">Çerezler</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Çerez Politikası</h1>
        <p className="mt-5 leading-7 text-slate-600">Bu sayfa 9 Kasım 2026 tarihinde sitenin mevcut teknik işleyişine göre gözden geçirilmiştir. PratikHesap kendi çerezlerini hesaplama girdilerini saklamak için kullanmaz. Tema, favoriler ve son kullanılan araçlar gibi tercihler tarayıcının localStorage alanında tutulur; bu, çerezlerden ayrı bir tarayıcı depolama teknolojisidir ve tarayıcı ayarlarından silinebilir.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Reklam teknolojileri</h2>
        <p className="mt-3 leading-7 text-slate-600">Google AdSense betiği normal site sayfalarına yüklenir; sade iframe araç sayfalarında yüklenmez. Reklam sunma ve ölçme sırasında Google veya iş ortakları çerez ya da benzer teknolojiler kullanabilir. Kişiselleştirilmiş reklamların kullanımı kullanıcının tercihleri, bölgesi ve yayıncı hesabındaki yapılandırmaya bağlıdır; üçüncü tarafların kullandığı teknolojiler ve saklama süreleri bu sitenin kontrolünde değildir. Ayrıntılar için <a className="font-semibold text-blue underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google Reklam Teknolojileri Politikası</a>’nı inceleyin.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Analitik ve tercih yönetimi</h2>
        <p className="mt-3 leading-7 text-slate-600">Sitede şu anda ayrıca bir analitik hizmeti yapılandırılmamıştır. Kodda siteye ait bir çerez tercih paneli de bulunmamaktadır. Tarayıcı ayarlarından çerezleri engelleyebilir veya silebilirsiniz; bu işlem üçüncü taraf reklamlarının bazı işlevlerini etkileyebilir. Google reklam tercihleri <a className="font-semibold text-blue underline" href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google Reklam Ayarları</a> üzerinden yönetilebilir. Kullanılan bölgesel izin/onay ayarları yayıncı hesabı ve reklam sağlayıcısının yapılandırmasına bağlıdır; bu sayfa tek başına bir izin panelinin veya uyumluluk yapılandırmasının var olduğu anlamına gelmez.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Güncellemeler</h2>
        <p className="mt-3 leading-7 text-slate-600">Reklam sağlayıcısı, analitik aracı veya tarayıcı depolaması değişirse bu açıklama güncellenecektir. Üçüncü taraf hizmetleri hakkında en güncel bilgi ilgili sağlayıcının kendi politikalarında bulunur.</p>
      </article>
    </main>
  );
}
