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

Platformda finans, tarih, eğitim ve günlük yaşam kategorilerinde 62 hesaplama aracı bulunur. Birleşik not ortalaması/GANO aracı 4'lük veya 100'lük sistemde kredi ağırlıklı hesaplama yapar; maaş zam aracı yüzde ve sabit tutarlı artışı destekler. Evrensel birim dönüştürücü uzunluk, ağırlık, hacim, alan, sıcaklık ve süre kategorilerini kapsar. Eğitim araçlarına YKS, LGS, KPSS, ALES ve DGS puan alanları ile lise diploma ortalaması eklendi. Sınav puan türü katsayıları ve standardizasyon parametreleri 2026 resmî kılavuzlarında doğrulanmadığı için bu puan araçları sonuç üretmez; yapılandırma `src/data/education-health-config.ts` içinde kaynak ve TODO açıklamalarıyla tutulur. İdeal kilo, kalori, su ve adet döngüsü araçları yaklaşık hesaplamadır; sayfalarında görünür biçimde tıbbi tavsiye olmadığı belirtilir. Finans araçlarına kıdem, ihbar ve izin ücreti; kira artışı; konut, ihtiyaç ve taşıt kredisi; mevduat faizi; gelir ve damga vergisi; tapu harcı ve altın hesaplamaları eklenmiştir. Doğrulanan genel ihbar süreleri, yıllık izin alt sınırları ve tapu harcı oranları kullanılabilir; 2026'ya bağlı güncel tarife ve piyasa verileri doğrulanana kadar ilgili araçlar sonuç üretmez. Eksikler `src/data/regulated-config.ts` dosyasında kaynak ve TODO notlarıyla tutulur. Birim testlerinde formül davranışını doğrulamak için kullanılan sentetik değerler gerçek mevzuat oranı olarak sunulmaz. Eski not ortalaması ve maaş URL'leri kalıcı 301 yönlendirmeleriyle birleştirilmiş sayfalara gider. Döviz çevirme aracı, TCMB'nin günlük XML bültenindeki gösterge satış kurunu kullanır. Sunucu tarafındaki kur isteği bir saat önbelleğe alınır; bülten erişilemiyorsa uygulama hata gösterir ve eski ya da uydurma kurla hesaplama yapmaz. Sonuçlar bilgilendirme amaçlıdır ve işlem anındaki piyasa kuru olmayabilir.

Formüller gerekli alanlar dolduruldukça tarayıcıda hesaplanır; sonuç panoya kopyalanabilir veya yazdırılabilir. Döviz kuru aracı, kur verisini almak için ayrıca Hesapla düğmesi gerektirir. KDV hızlı oran kısayolları `src/data/calculation-config.ts` içindeki oran listesinden üretilir; gerçek işlem oranını kullanıcı güncel resmî kaynaklardan doğrulamalıdır.

Hesaplama mantığı tarayıcıda çalışır. Paylaşılabilir bağlantı özelliği form girdilerini URL query parametrelerine yazabilir; bağlantı açıldığında veya paylaşıldığında parametreler istek URL'sinin parçası olabilir. Hassas bilgi içeren değerleri paylaşmayın. Query içeren araç bağlantılarının canonical adresleri parametresiz sayfayı gösterir. Son kullanılan araçlar, favoriler ve tema tercihi yalnızca tarayıcı `localStorage` alanında tutulur. PWA manifesti ve servis çalışanı çevrimdışı bir bilgilendirme sayfası sağlar; hesaplama girdilerini önbelleğe almaz. Ana sayfa araması Türkçe karakter farklarını yok sayar ve klavye ile öneri seçimini destekler.

Kredi, eğitim notu, elektrik maliyeti ve benzeri hesaplamalarda kurum, sağlayıcı veya kullanıcı girdilerine göre değişebilen varsayımlar ilgili araç sayfasında belirtilir. Brüt-net maaş aracı için 2026 verileri `src/data/payroll-config.ts` dosyasında kaynak ve güncelleme tarihiyle tutulur. Resmî kaynaktan doğrulanan asgari ücret, prim oranları, damga vergisi oranı ve engellilik indirimi tanımlıdır; SGK tavanı, 2026 ücret vergi tarifesi, asgari ücret gelir ve damga vergisi istisnası yöntemleri TODO olduğundan yanlış sonuç vermemek için hesaplama geçici olarak devre dışıdır. Yeni finans araçlarının dönemsel parametreleri de `src/data/regulated-config.ts` içinde kaynak ve tarih notlarıyla tutulur. 2026 kıdem tavanı, kira TÜFE verisi, kredi vergileri, mevduat stopajı, ücret tarifesi, damga vergisi tarifesi ve altın ağırlıkları birincil kaynakta doğrulanana kadar ilgili araçlar kapalıdır. Eksik parametreler doğrulanmadan gerçek oran veya sonuç gösterilmez. Hesaplama mantığının birim testlerinde sentetik bordro ve finans oranları kullanılır ve gerçek 2026 değerleri olarak sunulmaz.

## Mimari

- `src/app`: App Router sayfaları, SEO metadata, sitemap ve robots
- `src/components`: Paylaşılan navigasyon, araç kartı, SSS ve reklam alanı bileşenleri
- `src/app/embed/[slug]`: Her araç için noindex iframe sayfası; araç sayfasındaki modal gömme kodunu kopyalar
- `src/data/tools.ts`: Hesaplama araçlarının tek katalog kaynağı
- `src/data/regulated-tools.ts`: Kaynaklı finans araçları, form alanları ve uzun sayfa içerikleri
- `src/data/regulated-config.ts`: Yıl bazlı mevzuat parametreleri ve doğrulanmamış değerler için güvenli kapılar
- `src/data/education-health-tools.ts`: Sınav, sağlık ve takvim araçlarının içerikleri
- `src/data/education-health-config.ts`: Sınav yılına bağlı katsayılar, resmî kaynaklar ve doğrulama durumu
- `src/lib/calculations`: Bağımsız, test edilebilir formüller ve Türkçe sayı yardımcıları
- `src/app/[slug]`: Her araca ayrı kök URL ve sayfa metadata'sı

Yeni bir araç eklemek için hesaplama fonksiyonunu ve araç tanımını kataloğa ekleyin. Sayfa, ana sayfa kartı, kategori listesi ve sitemap katalogdan otomatik oluşturulur. `createdAt` alanı, araca yalnızca oluşturulma tarihinden sonraki 14 gün boyunca yeni rozeti gösterir.

## Reklam alanları

AdSense yükleme kodu ortak layout'ta merkezi yönetilir; sade iframe sayfalarında yüklenmez. Reklam yerleşimleri `src/components/AdSlot.tsx` ve `src/lib/ads.ts` üzerinden merkezi yönetilir; reklam alanları, yerleşimler yapılandırılana kadar kapalıdır. `public/ads.txt`, yayıncı hesabı için `https://www.hesappratik.xyz/ads.txt` adresinde sunulmak üzere yapılandırılmıştır. AdSense panelinde yayıncı hesabı ve domain durumunu onaylayın; dosyanın erişilebilirliğini ve yayıncı kimliğini panelinizdeki değerle karşılaştırın.

Auto ads kullanılıyorsa AdSense panelinde site için otomatik reklamları etkinleştirin. Manuel reklam birimleri, her birimin AdSense panelinden alınan slot kimliği eklenmeden açılmaz.

## Hesaplama araçları ve içerik

Hesaplama araçları formülleri ve site içi arama ifadeleriyle katalogda tanımlanır. Yeni araç sayfaları metadata, canonical adres, breadcrumb, dinamik Open Graph görseli ve sitemap'e katalogdan eklenir. Arama ifadeleri `meta keywords` etiketi olarak yayımlanmaz. Üniversite not katsayıları, kredi, elektrik tarifesi ve kredi maliyetleri kurum/sağlayıcıya göre değişebileceğinden araçlar kullandığı varsayımları sonuç sayfasında açıklar. Gizlilik ve çerez açıklamaları `/gizlilik-politikasi` ve `/cerez-politikasi` sayfalarındadır. İletişim sayfasındaki form, girilen bilgileri sunucuya göndermek yerine kullanıcının e-posta uygulamasında bir ileti hazırlar; iletişim adresi `ahmet.tulum99@gmail.com`'dur. AdSense betiği yüklenir; site kodunda şu anda analitik hizmeti veya çerez tercih paneli yapılandırılmamıştır. Bölgesel reklam izinleri ve onay gereklilikleri ayrıca yayıncı/AdSense yapılandırmasında değerlendirilmelidir.

## SEO ve alan adı

Site adresi tek bir sunucu ortam değişkeni olan `SITE_URL` ile yapılandırılır; varsayılan ve zorunlu kanonik adres `https://www.hesappratik.xyz` değeridir. `https://hesappratik.xyz` girdisi de kanonik olarak `www` adresine sabitlenir; farklı domain değerleri build'i hata ile durdurur. Vercel Production ortamında `SITE_URL=https://www.hesappratik.xyz` ayarlayıp yeniden deploy edin. Vercel custom-domain yönlendirmeleri panelde yönetilir; primary domain `www.hesappratik.xyz` olmalı ve apex doğrudan bu domaine yönlendirilmelidir. Vercel'in HTTP→HTTPS yönlendirmesi, apex yönlendirmesiyle zincir oluşturabilir; bu hosting ayarı uygulama kodundan değiştirilemez. Metadata, canonical adresler, sitemap, robots.txt ve WebSite/Organization/BreadcrumbList yapılandırılmış verileri aynı adresi kullanır. Sitemap Next.js `src/app/sitemap.ts` Metadata Route'undan üretilir; yalnızca kaynakta güncelleme/oluşturulma tarihi bulunan girdilerde gerçek `<lastmod>` yayımlanır, bilinmeyen tarihler uydurulmaz. Her build sonrasında XML, canonical URL, yinelenen/parametreli/noindex adresler ve statik sayfa rotaları `scripts/validate-sitemap.mjs` ile kontrol edilir. Sosyal paylaşım görseli `public/og-image.png`, AI crawler bilgilendirme dosyası `public/llms.txt` konumundadır; sosyal profil bağlantıları yalnızca gerçek hesap adresleri sağlandığında eklenmelidir.
