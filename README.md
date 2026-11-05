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

Platformda finans, tarih, eğitim ve günlük yaşam kategorilerinde 32 hesaplama aracı bulunur. Döviz çevirme aracı, TCMB'nin günlük XML bültenindeki gösterge satış kurunu kullanır. Sunucu tarafındaki kur isteği bir saat önbelleğe alınır; bülten erişilemiyorsa uygulama hata gösterir ve eski ya da uydurma kurla hesaplama yapmaz. Sonuçlar bilgilendirme amaçlıdır ve işlem anındaki piyasa kuru olmayabilir.

Kredi, eğitim notu, elektrik maliyeti ve benzeri hesaplamalarda kurum, sağlayıcı veya kullanıcı girdilerine göre değişebilen varsayımlar ilgili araç sayfasında belirtilir. Net/brüt maaş hesaplaması gibi güncel mevzuat ve kişisel bordro bilgileri gerektiren araçlar, doğrulanmış parametreler olmadan sunulmaz.

## Mimari

- `src/app`: App Router sayfaları, SEO metadata, sitemap ve robots
- `src/components`: Paylaşılan navigasyon, araç kartı, SSS ve reklam alanı bileşenleri
- `src/data/tools.ts`: Hesaplama araçlarının tek katalog kaynağı
- `src/lib/calculations`: Bağımsız, test edilebilir formüller ve Türkçe sayı yardımcıları
- `src/app/[slug]`: Her araca ayrı kök URL ve sayfa metadata'sı

Yeni bir araç eklemek için hesaplama fonksiyonunu ve araç tanımını kataloğa ekleyin. Sayfa, ana sayfa kartı, kategori listesi ve sitemap katalogdan otomatik oluşturulur.

## Reklam alanları

AdSense yükleme kodu ortak layout'ta bulunur. Reklam yerleşimleri `src/components/AdSlot.tsx` ve `src/lib/ads.ts` üzerinden merkezi yönetilir; reklam alanları, yerleşimler yapılandırılana kadar kapalıdır. `public/ads.txt`, yayıncı hesabı için `https://www.hesappratik.xyz/ads.txt` adresinde sunulmak üzere yapılandırılmıştır. AdSense panelinde yayıncı hesabı ve domain durumunu onaylayın; dosyanın erişilebilirliğini ve yayıncı kimliğini panelinizdeki değerle karşılaştırın.

Auto ads kullanılıyorsa AdSense panelinde site için otomatik reklamları etkinleştirin. Manuel reklam birimleri, her birimin AdSense panelinden alınan slot kimliği eklenmeden açılmaz.

## Hesaplama araçları ve içerik

Hesaplama araçları formülleri ve SEO arama ifadeleriyle katalogda tanımlanır. Yeni araç sayfaları metadata, canonical adres, breadcrumb ve sitemap'e katalogdan eklenir. `src/data/seo-keywords.ts` araca özgü, kullanıcı arama amacına uygun terimleri içerir; anahtar kelimeler sayfa içeriğini desteklemek içindir, sıralama garantisi vermez. Üniversite not katsayıları, kredi, elektrik tarifesi ve kredi maliyetleri kurum/sağlayıcıya göre değişebileceğinden araçlar kullandığı varsayımları sonuç sayfasında açıklar. Kullanım koşulları ve çerez açıklamaları `/kullanim-kosullari` ve `/cerez-politikasi` sayfalarındadır. Gerçek bir iletişim kanalı ve AdSense onaylı bir izin yönetim platformu yapılandırılmadan bu bilgiler veya izin yönetimi tamamlanmış kabul edilmemelidir.

## SEO ve alan adı

Site adresi `NEXT_PUBLIC_SITE_URL` ile yapılandırılır; varsayılan kanonik adres `https://www.hesappratik.xyz` değeridir. Alan adının `www` olmayan biçimi `www` adresine yönlendirildiğinden sitemap, robots.txt ve canonical adresler aynı `www` alan adını kullanmalıdır. Vercel'de `NEXT_PUBLIC_SITE_URL=https://www.hesappratik.xyz` ortam değişkenini ayarlayıp yeniden deploy edin. Metadata, canonical adresler, sitemap, robots.txt ve WebSite/Organization/BreadcrumbList yapılandırılmış verileri bu adresi kullanır. Sosyal paylaşım görseli `public/og-image.png`, AI crawler bilgilendirme dosyası `public/llms.txt` konumundadır; sosyal profil bağlantıları yalnızca gerçek hesap adresleri sağlandığında eklenmelidir.
