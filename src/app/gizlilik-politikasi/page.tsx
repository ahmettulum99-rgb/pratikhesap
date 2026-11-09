import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageStructuredData } from "@/components/PageStructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Gizlilik Politikası | PratikHesap",
  description: "PratikHesap'ın tarayıcıda hesaplanan girdiler, yerel tercihler, reklamlar ve iletişim formu hakkındaki gizlilik açıklaması.",
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
        <p className="mt-5 leading-7 text-slate-600">PratikHesap üyelik veya hesap açmanızı istemez. Bu politika, 9 Kasım 2026 tarihinde sitenin mevcut teknik işleyişine göre gözden geçirilmiştir. Araçlarda girdiğiniz sayılar, notlar ve tarihler hesaplama için tarayıcınızda işlenir; PratikHesap uygulaması bunları kendi hesabına bir veritabanında toplamaz. Ancak araç girdileri paylaşılabilir bağlantı özelliğiyle adres çubuğundaki URL parametrelerine yazılabilir. Bağlantıyı açmak veya paylaşmak, bu parametreleri barındırma altyapısının istek kayıtlarına taşıyabilir ve bağlantıyı alan kişilere gösterebilir. Paylaşılabilir bağlantılara hassas veya kişisel bilgi koymayın.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Döviz kuru isteği</h2>
        <p className="mt-3 leading-7 text-slate-600">Döviz aracı, seçilen para biriminin kodunu kuru almak için PratikHesap sunucusuna iletir; hesaplamak istediğiniz tutar ve sonuç sunucuya gönderilmez. Sunucu kuru TCMB’nin yayımladığı bültenden alır. Barındırma sağlayıcısı hizmetin güvenliği ve işletimi kapsamında IP adresi, istek zamanı ve erişilen URL gibi standart teknik kayıtları kendi koşullarına göre işleyebilir.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Tarayıcıda saklanan tercihler</h2>
        <p className="mt-3 leading-7 text-slate-600">Tema seçiminiz, favori araçlarınız ve son kullandığınız araç listesi yalnızca tarayıcınızdaki localStorage alanında saklanır; PratikHesap sunucusuna gönderilmez. Tarayıcı ayarlarından site verilerini silerek bu tercihleri kaldırabilirsiniz. Bu depolama tarayıcı çerezlerinden farklıdır. Ayrıntı için <Link className="font-semibold text-blue underline" href="/cerez-politikasi">Çerez Politikası</Link>’na bakın.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Reklamlar ve analitik</h2>
        <p className="mt-3 leading-7 text-slate-600">Google AdSense reklam betiği normal site sayfalarında yüklenir; sade iframe araç sayfalarında yüklenmez. Google ve iş ortakları reklam sunma, ölçme veya ayarlarınıza ve bölgenizde geçerli tercihlere göre kişiselleştirme amacıyla tarayıcı/cihaz bilgilerini, çerezleri veya benzer teknolojileri kullanabilir. Bu üçüncü tarafların işlemleri Google’ın <a className="font-semibold text-blue underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Reklam Teknolojileri Politikası</a> ve <a className="font-semibold text-blue underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Gizlilik Politikası</a> kapsamındadır. Sitede şu anda ayrıca bir analitik hizmeti yapılandırılmamıştır; bu durum değişirse politika ve ilgili tercih mekanizması güncellenmelidir. Kodda ayrıca bir çerez tercih ekranı bulunmamaktadır; reklam ve onay ayarlarının bölgesel gerekliliklere uygunluğu yayıncı/AdSense yapılandırmasına bağlıdır. Google reklam tercihlerinizi <a className="font-semibold text-blue underline" href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google Reklam Ayarları</a>’ndan yönetebilirsiniz.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">İletişim ve talepler</h2>
        <p className="mt-3 leading-7 text-slate-600">İletişim sayfasındaki form, bilgileri sunucuya göndermez; e-posta uygulamanızda hazır bir ileti açar. E-postayı gönderdiğinizde mesaj ve yanıt için paylaştığınız adres, e-posta sağlayıcıları üzerinden işlenir. Gizlilikle ilgili sorularınız için <a className="font-semibold text-blue underline" href="mailto:ahmet.tulum99@gmail.com">ahmet.tulum99@gmail.com</a> adresine ulaşabilirsiniz. Mesajınıza gerekli olmayan hassas bilgileri eklemeyin.</p>
        <h2 className="mt-8 text-xl font-bold text-navy">Politika değişiklikleri</h2>
        <p className="mt-3 leading-7 text-slate-600">Yeni özellikler, reklam/analitik hizmetleri veya teknik değişiklikler devreye alındığında bu açıklama gözden geçirilip güncellenecektir. Bu metin mevcut teknik uygulamayı anlatır; hukuki danışmanlık veya her üçüncü tarafın veri işleme uygulamalarının garantisi değildir.</p>
      </article>
    </main>
  );
}
