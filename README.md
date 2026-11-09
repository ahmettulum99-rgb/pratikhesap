# PratikHesap

Hesaplamak artık çok kolay. PratikHesap; finans, tarih, eğitim ve günlük yaşam kategorilerinde ücretsiz hesaplama araçları sunan, Next.js App Router ile hazırlanmış bir web platformudur.

## Gereksinimler

- Node.js 20.9 veya üzeri (Next.js 16 gereksinimi)
- npm

## Kurulum ve çalıştırma

```bash
npm install
npm run dev
```

Uygulamayı `http://localhost:3000` adresinde açın.

## Komutlar

- `npm run dev`: Geliştirme sunucusu
- `npm run build`: Üretim derlemesi
- `npm start`: Üretim sunucusu
- `npm run lint`: ESLint
- `npm test`: Hesaplama fonksiyonları testleri

## Araçlar ve güncel veri

Platformda finans, tarih, eğitim ve günlük yaşam kategorilerinde 37 hesaplama aracı bulunur. Birleşik not ortalaması/GANO aracı 4'lük veya 100'lük sistemde kredi ağırlıklı hesaplama yapar; maaş zam aracı yüzde ve sabit tutarlı artışı destekler. Evrensel birim dönüştürücü uzunluk, ağırlık, hacim, alan, sıcaklık ve süre kategorilerini kapsar. Eski not ortalaması ve maaş URL'leri kalıcı 301 yönlendirmeleriyle birleştirilmiş sayfalara gider. Döviz çevirme aracı, TCMB'nin günlük XML bültenindeki gösterge satış kurunu kullanır. Sunucu tarafındaki kur isteği bir saat önbelleğe alınır; bülten erişilemiyorsa uygulama hata gösterir ve eski ya da uydurma kurla hesaplama yapmaz. Sonuçlar bilgilendirme amaçlıdır ve işlem anındaki piyasa kuru olmayabilir.

Formüller gerekli alanlar dolduruldukça tarayıcıda hesaplanır; sonuç panoya kopyalanabilir veya yazdırılabilir. Döviz kuru aracı, kur verisini almak için ayrıca Hesapla düğmesi gerektirir. KDV hızlı oran kısayolları `src/data/calculation-config.ts` içindeki oran listesinden üretilir; gerçek işlem oranını kullanıcı güncel resmî kaynaklardan doğrulamalıdır.

Hesaplama girdileri paylaşılabilir bağlantılara query parametresi olarak yazılır ve bu değerler sunucuya gönderilmez; query içeren araç bağlantılarının canonical adresleri parametresiz sayfayı gösterir. Son kullanılan araçlar ve favoriler yalnızca tarayıcı `localStorage` alanında tutulur. Koyu tema sistem tercihinden başlar ve elle değiştirilebilir. PWA manifesti, yükleme düğmesi ve servis çalışanı çevrimdışı bir bilgilendirme sayfası sağlar; hesaplama girdilerini önbelleğe almaz. Ana sayfa araması Türkçe karakter farklarını yok sayar ve klavye ile öneri seçimini destekler.

Kredi, eğitim notu, elektrik maliyeti ve benzeri hesaplamalarda kurum, sağlayıcı veya kullanıcı girdilerine göre değişebilen varsayımlar ilgili araç sayfasında belirtilir. Brüt-net maaş aracı için 2026 verileri `src/data/payroll-config.ts` dosyasında kaynak ve güncelleme tarihiyle tutulur. Resmî kaynaktan doğrulanan asgari ücret, prim oranları, damga vergisi oranı ve engellilik indirimi tanımlıdır; SGK tavanı, 2026 ücret vergi tarifesi ve asgari ücret vergi istisnası yöntemi TODO olduğundan yanlış sonuç vermemek için hesaplama geçici olarak devre dışıdır. Eksik parametreler doğrulanmadan gerçek maaş sonucu gösterilmez. Hesaplama mantığının birim testlerinde sentetik bordro oranları kullanılır ve gerçek 2026 değerleri olarak sunulmaz.

## Mimari

- `src/app`: App Router sayfaları, SEO metadata, sitemap ve robots
- `src/components`: Paylaşılan navigasyon, araç kartı, SSS ve reklam alanı bileşenleri
- `src/data/tools.ts`: Hesaplama araçlarının tek katalog kaynağı
- `src/lib/calculations`: Bağımsız, test edilebilir formüller ve Türkçe sayı yardımcıları
- `src/app/[slug]`: Her araca ayrı kök URL ve sayfa metadata'sı

Yeni bir araç eklemek için hesaplama fonksiyonunu ve araç tanımını kataloğa ekleyin. Sayfa, ana sayfa kartı, kategori listesi ve sitemap katalogdan otomatik oluşturulur. `createdAt` alanı, araca yalnızca oluşturulma tarihinden sonraki 14 gün boyunca yeni rozeti gösterir.

## Reklam alanları

AdSense yükleme kodu ortak layout'ta bulunur. Reklam yerleşimleri `src/components/AdSlot.tsx` ve `src/lib/ads.ts` üzerinden merkezi yönetilir; reklam alanları, yerleşimler yapılandırılana kadar kapalıdır. `public/ads.txt`, yayıncı hesabı için `https://www.hesappratik.xyz/ads.txt` adresinde sunulmak üzere yapılandırılmıştır. AdSense panelinde yayıncı hesabı ve domain durumunu onaylayın; dosyanın erişilebilirliğini ve yayıncı kimliğini panelinizdeki değerle karşılaştırın.

Auto ads kullanılıyorsa AdSense panelinde site için otomatik reklamları etkinleştirin. Manuel reklam birimleri, her birimin AdSense panelinden alınan slot kimliği eklenmeden açılmaz.

## Hesaplama araçları ve içerik

Hesaplama araçları formülleri ve site içi arama ifadeleriyle katalogda tanımlanır. Yeni araç sayfaları metadata, canonical adres, breadcrumb, dinamik Open Graph görseli ve sitemap'e katalogdan eklenir. Arama ifadeleri `meta keywords` etiketi olarak yayımlanmaz. Üniversite not katsayıları, kredi, elektrik tarifesi ve kredi maliyetleri kurum/sağlayıcıya göre değişebileceğinden araçlar kullandığı varsayımları sonuç sayfasında açıklar. Kullanım koşulları ve çerez açıklamaları `/kullanim-kosullari` ve `/cerez-politikasi` sayfalarındadır. Gerçek bir iletişim kanalı ve AdSense onaylı bir izin yönetim platformu yapılandırılmadan bu bilgiler veya izin yönetimi tamamlanmış kabul edilmemelidir.

## SEO ve alan adı

Site adresi `NEXT_PUBLIC_SITE_URL` ile yapılandırılır; varsayılan kanonik adres `https://www.hesappratik.xyz` değeridir. Alan adının `www` olmayan biçimi `www` adresine yönlendirildiğinden sitemap, robots.txt ve canonical adresler aynı `www` alan adını kullanmalıdır. Vercel'de `NEXT_PUBLIC_SITE_URL=https://www.hesappratik.xyz` ortam değişkenini ayarlayıp yeniden deploy edin. Metadata, canonical adresler, sitemap, robots.txt ve WebSite/Organization/BreadcrumbList yapılandırılmış verileri bu adresi kullanır. Sosyal paylaşım görseli `public/og-image.png`, AI crawler bilgilendirme dosyası `public/llms.txt` konumundadır; sosyal profil bağlantıları yalnızca gerçek hesap adresleri sağlandığında eklenmelidir.
