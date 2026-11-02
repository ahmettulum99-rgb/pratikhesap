export type CategoryId = "finans" | "tarih" | "egitim" | "gunluk-yasam";
export type FieldDefinition = {
  name: string;
  label: string;
  type: "number" | "date" | "select";
  placeholder?: string;
  unit?: string;
  options?: { label: string; value: string }[];
};
export type ToolDefinition = {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  title: string;
  metaDescription: string;
  intro: string;
  formula: string;
  example: string;
  fields: FieldDefinition[];
  popular?: boolean;
};

export const categories: { id: CategoryId; name: string; href: string; description: string }[] = [
  { id: "finans", name: "Finans", href: "/finans", description: "Bütçe, maaş, vergi ve alışveriş hesaplamaları." },
  { id: "tarih", name: "Tarih", href: "/tarih", description: "Yaş, gün farkı ve tarih planlama araçları." },
  { id: "egitim", name: "Eğitim", href: "/egitim", description: "Not, sınav ve başarı hesaplamaları." },
  { id: "gunluk-yasam", name: "Günlük Yaşam", href: "/gunluk-yasam", description: "Ölçü, dönüşüm ve günlük ihtiyaç araçları." }
];

const numberField = (name: string, label: string, placeholder: string, unit?: string): FieldDefinition =>
  ({ name, label, type: "number", placeholder, unit });
const dateField = (name: string, label: string): FieldDefinition => ({ name, label, type: "date" });
const selectField = (name: string, label: string, options: FieldDefinition["options"]): FieldDefinition =>
  ({ name, label, type: "select", options });

export const tools: ToolDefinition[] = [
  {
    id: "yuzde-hesaplama", name: "Yüzde hesaplama", category: "finans", popular: true,
    description: "Bir tutarın belirli bir yüzdeye karşılık gelen değerini bulun.",
    title: "Yüzde Hesaplama – Bir Sayının Yüzdesini Bulun | PratikHesap",
    metaDescription: "Bir sayının yüzde kaçını hesaplayın. Tutarı ve oranı girin, yüzde hesabı sonucunu anında ve Türkçe sayı formatında görün.",
    intro: "Yüzde hesaplama aracıyla herhangi bir tutarın belirlediğiniz oran kadarını kolayca bulabilirsiniz. Sonuç, girdiğiniz tutarın yüzde karşılığıdır.",
    formula: "Yüzde tutarı = Tutar × Yüzde oranı ÷ 100",
    example: "2.000 TL'nin %15'i: 2.000 × 15 ÷ 100 = 300 TL.",
    fields: [numberField("amount", "Tutar", "Örn. 2000"), numberField("percent", "Yüzde oranı", "Örn. 15", "%")]
  },
  {
    id: "maas-zam-hesaplama", name: "Maaş zam hesaplama", category: "finans", popular: true,
    description: "Zam oranına göre yeni maaşınızı ve zam tutarını hesaplayın.",
    title: "Maaş Zam Hesaplama – Zamlı Maaşınızı Öğrenin | PratikHesap",
    metaDescription: "Mevcut maaşınıza uygulanacak zam oranını girerek zam tutarını ve zamlı maaşınızı hesaplayın.",
    intro: "Mevcut maaşınıza uygulanacak yüzde artışını girerek zam tutarını ve yeni brüt ya da net maaşınızı görüntüleyin. Hesaplama, girdiğiniz tutar üzerinden yapılır.",
    formula: "Zam tutarı = Mevcut maaş × Zam oranı ÷ 100; yeni maaş = Mevcut maaş + zam tutarı",
    example: "30.000 TL maaşa %20 zamda artış 6.000 TL, yeni maaş 36.000 TL olur.",
    fields: [numberField("salary", "Mevcut maaş", "Örn. 30000", "₺"), numberField("percent", "Zam oranı", "Örn. 20", "%")]
  },
  {
    id: "indirim-hesaplama", name: "İndirim hesaplama", category: "finans", popular: true,
    description: "İndirim oranından sonra ödeyeceğiniz fiyatı görün.",
    title: "İndirim Hesaplama – İndirimli Fiyatı Bulun | PratikHesap",
    metaDescription: "Ürün fiyatı ve indirim yüzdesini girin; indirim tutarını ve indirim sonrası ödeyeceğiniz fiyatı hemen öğrenin.",
    intro: "Bir ürünün indirim sonrası fiyatını ve cebinizde kalacak tutarı hesaplayın. İndirim oranı yüzde olarak girilir.",
    formula: "İndirim tutarı = Etiket fiyatı × İndirim oranı ÷ 100; indirimli fiyat = Etiket fiyatı − indirim tutarı",
    example: "1.000 TL'lik üründe %25 indirim 250 TL'dir; indirimli fiyat 750 TL olur.",
    fields: [numberField("amount", "Ürün fiyatı", "Örn. 1000", "₺"), numberField("percent", "İndirim oranı", "Örn. 25", "%")]
  },
  {
    id: "kdv-hesaplama", name: "KDV hesaplama", category: "finans",
    description: "KDV hariç tutara vergi ekleyerek KDV dahil fiyatı bulun.",
    title: "KDV Hesaplama – KDV Dahil Fiyatı Bulun | PratikHesap",
    metaDescription: "KDV hariç tutar ve oranı girerek KDV tutarını ve KDV dahil toplam fiyatı hesaplayın.",
    intro: "KDV hariç tutar ile uygulamak istediğiniz KDV oranını girin. Araç, vergi tutarını ve vergi eklenmiş toplam bedeli gösterir. Uygulanacak oranı işlem türünüze göre kontrol edin.",
    formula: "KDV tutarı = KDV hariç tutar × KDV oranı ÷ 100; toplam = tutar + KDV",
    example: "1.000 TL tutara örnek olarak %20 KDV uygulanırsa KDV 200 TL, toplam 1.200 TL olur.",
    fields: [numberField("amount", "KDV hariç tutar", "Örn. 1000", "₺"), numberField("rate", "KDV oranı", "Örn. 20", "%")]
  },
  {
    id: "kar-zarar-hesaplama", name: "Kâr zarar hesaplama", category: "finans",
    description: "Alış ve satış fiyatı arasındaki kâr veya zarar tutarını bulun.",
    title: "Kâr Zarar Hesaplama – Kârınızı veya Zararınızı Bulun | PratikHesap",
    metaDescription: "Alış ve satış fiyatlarınızı karşılaştırarak kâr veya zarar tutarını ve alış fiyatına göre oranını hesaplayın.",
    intro: "Bir ürünün alış ve satış bedelini karşılaştırarak işlem sonucundaki kâr ya da zarar miktarını görün. Kâr/zarar oranı alış fiyatına göre hesaplanır.",
    formula: "Kâr veya zarar = Satış fiyatı − Alış fiyatı; oran = fark ÷ alış fiyatı × 100",
    example: "800 TL'ye alınıp 1.000 TL'ye satılan üründe 200 TL, yani alış fiyatına göre %25 kâr vardır.",
    fields: [numberField("cost", "Alış fiyatı", "Örn. 800", "₺"), numberField("sale", "Satış fiyatı", "Örn. 1000", "₺")]
  },
  {
    id: "maas-artis-hesaplama", name: "Maaş artış hesaplama", category: "finans",
    description: "Maaşa eklenecek tutarı ve artış oranını birlikte hesaplayın.",
    title: "Maaş Artış Hesaplama – Yeni Maaş ve Artış Oranı | PratikHesap",
    metaDescription: "Maaşınıza eklenecek sabit tutara göre yeni maaşınızı ve artışın yüzde oranını hesaplayın.",
    intro: "Yüzde yerine maaşınıza eklenecek net tutarı biliyorsanız bu araçla yeni maaşı ve artışın mevcut maaşınıza oranını bulun.",
    formula: "Yeni maaş = Mevcut maaş + Artış tutarı; artış oranı = Artış tutarı ÷ Mevcut maaş × 100",
    example: "25.000 TL maaşa 5.000 TL eklendiğinde yeni maaş 30.000 TL, artış oranı %20 olur.",
    fields: [numberField("salary", "Mevcut maaş", "Örn. 25000", "₺"), numberField("increase", "Artış tutarı", "Örn. 5000", "₺")]
  },
  {
    id: "yas-hesaplama", name: "Yaş hesaplama", category: "tarih", popular: true,
    description: "Doğum tarihinize göre tamamlanmış yaşınızı hesaplayın.",
    title: "Yaş Hesaplama – Doğum Tarihine Göre Yaşınızı Öğrenin | PratikHesap",
    metaDescription: "Doğum tarihinizi seçin ve bugün itibarıyla tamamlanmış yaşınızı ücretsiz hesaplayın.",
    intro: "Doğum tarihinizden bugüne kadar tamamladığınız yıl sayısını bulun. Hesaplama, içinde bulunulan yılın henüz gelmemiş doğum gününü dikkate alır. 29 Şubat doğumlular için artık olmayan yıllarda 28 Şubat esas alınır.",
    formula: "Yaş = İçinde bulunulan yıl − doğum yılı; doğum günü henüz gelmediyse sonuçtan 1 çıkarılır. 29 Şubat doğumlular için artık olmayan yıllarda 28 Şubat doğum günü kabul edilir.",
    example: "1990 yılında doğan bir kişinin 2025 doğum günü geldiyse yaşı 35, gelmediyse 34'tür.",
    fields: [dateField("birthDate", "Doğum tarihi")]
  },
  {
    id: "iki-tarih-arasi-gun-hesaplama", name: "İki tarih arası gün hesaplama", category: "tarih", popular: true,
    description: "İki takvim tarihi arasındaki gün farkını öğrenin.",
    title: "İki Tarih Arası Gün Hesaplama – Gün Farkını Bulun | PratikHesap",
    metaDescription: "Başlangıç ve bitiş tarihini seçerek iki tarih arasında kaç gün olduğunu hızlıca hesaplayın.",
    intro: "İki tarih arasındaki takvim günü farkını bulun. Başlangıç ve bitiş sırasından bağımsız olarak pozitif gün sayısı verilir; iki uç tarih ayrıca sayılmaz.",
    formula: "Gün farkı = İki tarihin UTC zaman damgaları farkının 86.400.000 milisaniyeye bölümü",
    example: "1 Mart ile 8 Mart arasındaki fark 7 gündür.",
    fields: [dateField("startDate", "Başlangıç tarihi"), dateField("endDate", "Bitiş tarihi")]
  },
  {
    id: "tarihe-gun-ekleme", name: "Tarihe gün ekleme", category: "tarih",
    description: "Bir tarihe ekleyeceğiniz gün sayısından yeni tarihi bulun.",
    title: "Tarihe Gün Ekleme – İleri Tarihi Hesaplayın | PratikHesap",
    metaDescription: "Başlangıç tarihine gün sayısı ekleyerek oluşan yeni tarihi kolayca hesaplayın.",
    intro: "Bir başlangıç tarihinden belirli sayıda gün sonrasını hesaplayın. Takvim geçişleri ve artık yıllar otomatik olarak dikkate alınır.",
    formula: "Yeni tarih = Başlangıç tarihi + Girilen tam gün sayısı",
    example: "10 Nisan tarihine 20 gün eklendiğinde sonuç 30 Nisan olur.",
    fields: [dateField("date", "Başlangıç tarihi"), numberField("days", "Eklenecek gün", "Örn. 20", "gün")]
  },
  {
    id: "tarihten-gun-cikarma", name: "Tarihten gün çıkarma", category: "tarih",
    description: "Bir tarihten gün çıkararak önceki tarihi hesaplayın.",
    title: "Tarihten Gün Çıkarma – Önceki Tarihi Hesaplayın | PratikHesap",
    metaDescription: "Bir tarihten çıkarılacak gün sayısını girin ve geriye doğru oluşan tarihi bulun.",
    intro: "Belirlediğiniz gün sayısı kadar geriye giderek yeni tarihi bulun. Ay ve yıl değişiklikleri takvim kurallarına göre hesaplanır.",
    formula: "Yeni tarih = Başlangıç tarihi − Girilen tam gün sayısı",
    example: "10 Nisan tarihinden 10 gün çıkarıldığında sonuç 31 Mart olur.",
    fields: [dateField("date", "Başlangıç tarihi"), numberField("days", "Çıkarılacak gün", "Örn. 10", "gün")]
  },
  {
    id: "dogum-gunune-kalan-sure", name: "Doğum gününe kalan süre", category: "tarih",
    description: "Bir sonraki doğum gününüze kaç gün kaldığını öğrenin.",
    title: "Doğum Gününe Kalan Süre – Kaç Gün Kaldı? | PratikHesap",
    metaDescription: "Doğum tarihinizi girin; sıradaki doğum gününüze kalan gün sayısını ücretsiz hesaplayın.",
    intro: "Doğum tarihinizi seçin ve bir sonraki doğum gününüze kalan takvim gününü öğrenin. Bugün doğum gününüzse sonuç sıfır gündür. 29 Şubat doğumlular için artık olmayan yıllarda 28 Şubat esas alınır.",
    formula: "Kalan gün = Bir sonraki doğum günü − Bugünün tarihi",
    example: "Bir sonraki doğum gününüz 20 gün sonraysa araç 20 gün sonucunu verir.",
    fields: [dateField("birthDate", "Doğum tarihi")]
  },
  {
    id: "not-ortalamasi-hesaplama", name: "Not ortalaması hesaplama", category: "egitim", popular: true,
    description: "İki sınav notunuzun basit aritmetik ortalamasını bulun.",
    title: "Not Ortalaması Hesaplama – Sınav Notu Ortalamanızı Bulun | PratikHesap",
    metaDescription: "İki sınav notunuzu girerek 100 üzerinden basit not ortalamanızı hesaplayın.",
    intro: "İki sınav notunun eşit ağırlıklı aritmetik ortalamasını hesaplayın. Ağırlıklandırma veya okul yönetmeliğine bağlı katsayılar bu basit hesaplamaya dahil değildir.",
    formula: "Not ortalaması = (1. not + 2. not) ÷ 2",
    example: "70 ve 90 notlarının eşit ağırlıklı ortalaması (70 + 90) ÷ 2 = 80 puandır.",
    fields: [numberField("grade1", "1. not", "Örn. 70", "puan"), numberField("grade2", "2. not", "Örn. 90", "puan")]
  },
  {
    id: "sinav-puani-hesaplama", name: "Sınav puanı hesaplama", category: "egitim",
    description: "Doğru ve yanlış cevaplarınıza göre net ve puan hesabı yapın.",
    title: "Sınav Puanı Hesaplama – Net ve Puanınızı Bulun | PratikHesap",
    metaDescription: "Doğru, yanlış ve toplam soru sayısını girin; 4 yanlışın 1 doğruyu götürdüğü 100'lük sınav puanınızı hesaplayın.",
    intro: "Doğru ve yanlış sayınıza göre netinizi hesaplayın. Bu araçta dört yanlış bir doğruyu götürür ve net, toplam soru sayısına oranlanarak 100 puana çevrilir.",
    formula: "Net = Doğru − Yanlış ÷ 4; puan = max(0, net) ÷ toplam soru × 100",
    example: "40 soruda 30 doğru ve 4 yanlış, 29 net ve 72,5 puan verir.",
    fields: [numberField("correct", "Doğru sayısı", "Örn. 30"), numberField("wrong", "Yanlış sayısı", "Örn. 4"), numberField("total", "Toplam soru sayısı", "Örn. 40")]
  },
  {
    id: "basari-yuzdesi-hesaplama", name: "Başarı yüzdesi hesaplama", category: "egitim",
    description: "Tamamlanan veya doğru sayısının toplam içindeki yüzdesini bulun.",
    title: "Başarı Yüzdesi Hesaplama – Yüzde Başarınızı Öğrenin | PratikHesap",
    metaDescription: "Gerçekleşen ve toplam değerleri girerek başarı ya da tamamlanma yüzdenizi hesaplayın.",
    intro: "Doğru cevap, tamamlanan görev veya ulaşılan hedef miktarının toplam içindeki yüzdesini hesaplayın.",
    formula: "Başarı yüzdesi = Gerçekleşen değer ÷ Toplam değer × 100",
    example: "50 sorunun 40'ı doğruysa başarı yüzdesi 40 ÷ 50 × 100 = %80 olur.",
    fields: [numberField("achieved", "Gerçekleşen / doğru sayı", "Örn. 40"), numberField("total", "Toplam sayı", "Örn. 50")]
  },
  {
    id: "harf-notu-hesaplama", name: "Harf notu hesaplama", category: "egitim",
    description: "100'lük puanın yaygın harf notu karşılığını görüntüleyin.",
    title: "Harf Notu Hesaplama – 100'lük Notu Harf Notuna Çevirin | PratikHesap",
    metaDescription: "100 üzerinden notunuzu girerek yaygın not aralıklarına göre AA–FF harf notu karşılığını bulun.",
    intro: "100'lük notunuzu yaygın kullanılan aralıklara göre harf notuna dönüştürün. Üniversiteler ve okullar farklı değerlendirme tabloları kullanabilir; kesin sonuç için kurum yönetmeliğinizi kontrol edin.",
    formula: "AA: 90–100, BA: 85–89, BB: 80–84, CB: 75–79, CC: 70–74, DC: 60–69, DD: 50–59, FF: 0–49",
    example: "82 puan, bu hesaplamada BB harf notu aralığındadır.",
    fields: [numberField("grade", "100 üzerinden not", "Örn. 82", "puan")]
  },
  {
    id: "ders-ortalamasi-hesaplama", name: "Ders ortalaması hesaplama", category: "egitim",
    description: "Üç ders notunun eşit ağırlıklı ortalamasını hesaplayın.",
    title: "Ders Ortalaması Hesaplama – Notlarınızın Ortalamasını Bulun | PratikHesap",
    metaDescription: "Üç ders notunu girerek 100 üzerinden eşit ağırlıklı ders ortalamanızı hemen hesaplayın.",
    intro: "Üç ders notunun eşit ağırlıklı ortalamasını hesaplayın. Ders kredileri farklıysa sonuç kurumunuzdaki ağırlıklı ortalamadan farklı olabilir.",
    formula: "Ders ortalaması = (1. ders + 2. ders + 3. ders) ÷ 3",
    example: "80, 70 ve 90 notlarının eşit ağırlıklı ortalaması 80 puandır.",
    fields: [numberField("grade1", "1. ders notu", "Örn. 80"), numberField("grade2", "2. ders notu", "Örn. 70"), numberField("grade3", "3. ders notu", "Örn. 90")]
  },
  {
    id: "metrekare-hesaplama", name: "Metrekare hesaplama", category: "gunluk-yasam",
    description: "Dikdörtgen alanın metrekaresini ölçülerle hesaplayın.",
    title: "Metrekare Hesaplama – Alanı m² Olarak Bulun | PratikHesap",
    metaDescription: "Dikdörtgen alanın en ve boy ölçülerini girerek metrekare değerini hesaplayın.",
    intro: "En ve boy ölçüleri metre cinsindeyse dikdörtgen bir yüzeyin alanını metrekare olarak hesaplayın. Düzensiz şekillerde sonuç yaklaşık değer verir.",
    formula: "Alan (m²) = En (m) × Boy (m)",
    example: "4 metre eninde ve 5 metre boyundaki bir odanın alanı 20 m²'dir.",
    fields: [numberField("width", "En", "Örn. 4", "metre"), numberField("length", "Boy", "Örn. 5", "metre")]
  },
  {
    id: "boy-kilo-orani-hesaplama", name: "Boy ve kilo oranı hesaplama", category: "gunluk-yasam",
    description: "Boy ve kilonuza göre vücut kitle indeksi (VKİ) hesaplayın.",
    title: "Boy Kilo Endeksi Hesaplama – VKİ Değerinizi Bulun | PratikHesap",
    metaDescription: "Boy ve kilonuzu girerek vücut kitle indeksinizi (VKİ) hesaplayın. Sonucun genel bilgilendirme amaçlı olduğunu unutmayın.",
    intro: "Vücut kitle indeksi (VKİ), kilogram cinsinden ağırlığın metre cinsinden boyun karesine bölünmesiyle hesaplanan genel bir ölçüdür. Tek başına sağlık tanısı koymaz.",
    formula: "VKİ = Ağırlık (kg) ÷ Boy (m)²",
    example: "1,70 m boyunda ve 65 kg ağırlığındaki bir kişinin VKİ değeri yaklaşık 22,49'dur.",
    fields: [numberField("height", "Boy", "Örn. 170", "cm veya m"), numberField("weight", "Kilo", "Örn. 65", "kg")]
  },
  {
    id: "litre-donusumu", name: "Litre dönüşümü", category: "gunluk-yasam",
    description: "Litreyi mililitreye veya metreküpe, mililitreyi litreye çevirin.",
    title: "Litre Dönüşümü – Litre, Mililitre ve m³ Çevirici | PratikHesap",
    metaDescription: "Litre, mililitre ve metreküp arasında hacim dönüşümü yapın. Miktarı ve dönüşüm yönünü seçmeniz yeterli.",
    intro: "Sıvı hacimlerini litre, mililitre ve metreküp birimleri arasında dönüştürün. Dönüşüm, seçtiğiniz yöndeki standart birim eşitliklerini kullanır.",
    formula: "1 L = 1.000 ml; 1 m³ = 1.000 L",
    example: "2,5 litre 2.500 mililitreye; 1.000 litre 1 metreküpe eşittir.",
    fields: [
      numberField("amount", "Miktar", "Örn. 2,5"),
      selectField("conversion", "Dönüşüm yönü", [{ label: "Litre → mililitre", value: "l-to-ml" }, { label: "Mililitre → litre", value: "ml-to-l" }, { label: "Litre → metreküp", value: "l-to-m3" }])
    ]
  },
  {
    id: "kilogram-donusumu", name: "Kilogram dönüşümü", category: "gunluk-yasam",
    description: "Kilogram, gram ve ton arasında ağırlık dönüşümü yapın.",
    title: "Kilogram Dönüşümü – kg, Gram ve Ton Çevirici | PratikHesap",
    metaDescription: "Kilogramı grama veya tona, gramı kilograma dönüştürün. Sonuçları Türkçe sayı biçiminde görün.",
    intro: "Ağırlık miktarlarını kilogram, gram ve ton birimleri arasında dönüştürün. Sonuç, seçtiğiniz hedef birimde gösterilir.",
    formula: "1 kg = 1.000 g; 1 t = 1.000 kg",
    example: "2,5 kilogram 2.500 grama, 3.000 kilogram 3 tona eşittir.",
    fields: [
      numberField("amount", "Miktar", "Örn. 2,5"),
      selectField("conversion", "Dönüşüm yönü", [{ label: "Kilogram → gram", value: "kg-to-g" }, { label: "Gram → kilogram", value: "g-to-kg" }, { label: "Kilogram → ton", value: "kg-to-ton" }])
    ]
  },
  {
    id: "saat-dakika-donusturme", name: "Saat dakika dönüştürme", category: "gunluk-yasam",
    description: "Saat, dakika ve saniye arasında süre dönüşümü yapın.",
    title: "Saat Dakika Dönüştürme – Süre Birimi Hesaplayıcı | PratikHesap",
    metaDescription: "Saat ve dakika arasındaki dönüşümü yapın; ayrıca dakika değerini saniyeye çevirin.",
    intro: "Zaman miktarlarını saat, dakika ve saniye arasında dönüştürün. Ondalıklı girişler de hesaplamaya dahil edilir.",
    formula: "1 saat = 60 dakika; 1 dakika = 60 saniye",
    example: "1,5 saat 90 dakikaya; 120 dakika 2 saate eşittir.",
    fields: [
      numberField("amount", "Süre", "Örn. 1,5"),
      selectField("conversion", "Dönüşüm yönü", [{ label: "Saat → dakika", value: "hours-to-minutes" }, { label: "Dakika → saat", value: "minutes-to-hours" }, { label: "Dakika → saniye", value: "minutes-to-seconds" }])
    ]
  }
];

export const getTool = (slug: string): ToolDefinition | undefined => tools.find((tool) => tool.id === slug);
export const getCategory = (id: string) => categories.find((category) => category.id === id);
