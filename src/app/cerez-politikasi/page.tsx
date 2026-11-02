import { Breadcrumb } from "@/components/Breadcrumb";
import { PageStructuredData } from "@/components/PageStructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Çerez Politikası | PratikHesap",
  description: "PratikHesap'ta Google AdSense reklam betiği ve üçüncü taraf çerez kullanımı hakkında bilgi.",
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
        <p className="mt-5 leading-7 text-slate-600">PratikHesap’ın hesaplama araçları kendi başına hesaplama girdilerini çerezlere kaydetmez. Bununla birlikte Google AdSense betiği sayfalara yüklenir; reklamların sunulması, ölçülmesi veya tercihlere göre kişiselleştirilmesi sırasında Google ya da iş ortakları çerez veya benzer tarayıcı teknolojileri kullanabilir.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Tercihleri yönetme</h2>
        <p className="mt-3 leading-7 text-slate-600">Google reklam kişiselleştirme tercihlerinizi <a className="font-semibold text-blue underline" href="https://adssettings.google.com/">Google Reklam Ayarları</a>’ndan; çerezleri ise tarayıcınızın gizlilik ayarlarından yönetebilirsiniz. Üçüncü taraf çerezlerinin kapsamı ve saklama süresi ilgili sağlayıcının politikalarına bağlıdır. Daha fazla bilgi için <a className="font-semibold text-blue underline" href="https://policies.google.com/technologies/ads">Google Reklam Teknolojileri Politikası</a>’nı okuyun.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">İzin ve bölgesel gereklilikler</h2>
        <p className="mt-3 leading-7 text-slate-600">Bu site kodunda ayrıca bir çerez tercih ekranı yapılandırılmamıştır. Reklam gösterimi için geçerli olan bölgesel izin ve onay gereklilikleri, AdSense hesabında yetkili bir onay yönetim çözümüyle ayrıca yapılandırılmalıdır. Bu açıklama, söz konusu ayarların tamamlandığı anlamına gelmez.</p>
      </article>
    </main>
  );
}
