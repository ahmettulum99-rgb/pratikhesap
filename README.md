# PratikHesap

Hesaplamak artık çok kolay. PratikHesap; finans, tarih, eğitim ve günlük yaşam kategorilerinde ücretsiz hesaplama araçları sunan, Next.js App Router ile hazırlanmış bir web platformudur.

## Gereksinimler

- Node.js 18.17 veya üzeri
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

## Mimari

- `src/app`: App Router sayfaları, SEO metadata, sitemap ve robots
- `src/components`: Paylaşılan navigasyon, araç kartı, SSS ve reklam alanı bileşenleri
- `src/data/tools.ts`: Hesaplama araçlarının tek katalog kaynağı
- `src/lib/calculations`: Bağımsız, test edilebilir formüller ve Türkçe sayı yardımcıları
- `src/app/[slug]`: Her araca ayrı kök URL ve sayfa metadata'sı

Yeni bir araç eklemek için hesaplama fonksiyonunu ve araç tanımını kataloğa ekleyin. Sayfa, ana sayfa kartı, kategori listesi ve sitemap katalogdan otomatik oluşturulur.

## Reklam alanları

Gerçek reklam gösterimi kapalıdır. `src/components/AdSlot.tsx` ve `src/lib/ads.ts` reklam alanlarının metinlerini ve konumlarını merkezi olarak yönetir. AdSense entegrasyonu, bu bileşene ileride tek noktadan eklenebilir.

## SEO ve alan adı

Site adresi `NEXT_PUBLIC_SITE_URL` ile yapılandırılır; varsayılan değer `https://hesappratik.xyz` adresidir. Vercel'de özel alan adınızı bağladıktan sonra `NEXT_PUBLIC_SITE_URL=https://hesappratik.xyz` ortam değişkenini ekleyip yeniden deploy edin. Metadata, canonical adresler, sitemap, robots.txt ve WebSite/Organization/BreadcrumbList yapılandırılmış verileri bu adresi kullanır.
