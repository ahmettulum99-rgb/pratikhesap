import { Breadcrumb } from "@/components/Breadcrumb";
import { PageStructuredData } from "@/components/PageStructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Hakkımızda | PratikHesap",
  description: "PratikHesap'ın amacı, hesaplama yöntemleri, kullanılan kaynaklar, içerik güncelleme ve hata bildirimi süreci hakkında bilgi alın.",
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
        <h2 className="mt-8 text-xl font-bold text-navy">Hesaplama yöntemleri ve kaynaklar</h2>
        <p className="mt-3 leading-7 text-slate-600">Hesaplama mantıkları ayrı, test edilebilir fonksiyonlarda tutulur ve normal girişlerin yanı sıra sınır değerler ile hatalı girdiler için kontrol edilir. Araç sayfalarında formül, örnek, son güncelleme tarihi ve kullanılan kaynaklar bulunur. Mevzuata veya resmî katsayılara bağlı araçlarda ilgili kurumların yayımladığı bilgi ve belgeler esas alınır: <a className="font-semibold text-blue underline" href="https://www.gib.gov.tr/" target="_blank" rel="noopener noreferrer">Gelir İdaresi Başkanlığı</a>, <a className="font-semibold text-blue underline" href="https://www.sgk.gov.tr/" target="_blank" rel="noopener noreferrer">Sosyal Güvenlik Kurumu</a>, <a className="font-semibold text-blue underline" href="https://www.tuik.gov.tr/" target="_blank" rel="noopener noreferrer">Türkiye İstatistik Kurumu</a>, <a className="font-semibold text-blue underline" href="https://www.tcmb.gov.tr/" target="_blank" rel="noopener noreferrer">Türkiye Cumhuriyet Merkez Bankası</a>, <a className="font-semibold text-blue underline" href="https://www.osym.gov.tr/" target="_blank" rel="noopener noreferrer">ÖSYM</a> ve <a className="font-semibold text-blue underline" href="https://www.meb.gov.tr/" target="_blank" rel="noopener noreferrer">Millî Eğitim Bakanlığı</a>. Kaynağı veya güncel değeri doğrulanamayan bir parametre kesinmiş gibi sunulmaz; ilgili hesaplama kapalı tutulabilir ya da sınırlılığı açıkça belirtilir.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">İçerik güncelleme politikası</h2>
        <p className="mt-3 leading-7 text-slate-600">Değişken oran ve kuralları ilgili resmî duyurular yayımlandığında gözden geçirmeyi, araç sayfalarında son gözden geçirme tarihini ve kaynakları göstermeyi amaçlıyoruz. Tarih bilgisi, her girdinin ayrıca resmî kurum tarafından onaylandığı anlamına gelmez. Önemli mevzuat veya yöntem değişikliklerinde içerik ve hesaplama mantığı birlikte değerlendirilir.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Hata bildirimi</h2>
        <p className="mt-3 leading-7 text-slate-600">Bir sonuçta, formülde, kaynak bağlantısında veya anlatımda hata fark ederseniz ilgili araç sayfasındaki “Hata mı gördünüz? Bildirin” bağlantısını kullanabilir ya da <a className="font-semibold text-blue underline" href="mailto:ahmet.tulum99@gmail.com">ahmet.tulum99@gmail.com</a> adresine araç bağlantısı, beklenen sonuç ve mümkünse hatayı yeniden oluşturacak örnekle e-posta gönderebilirsiniz. Lütfen mesajınıza hassas kişisel veya finansal bilgi eklemeyin. Bildirim incelenir; doğrulanan sorunlarda ilgili içerik veya hesaplama düzeltilir.</p>
      </article>
    </main>
  );
}
