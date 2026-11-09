export type HomeSeoSegment = {
  text: string;
  href?: string;
};

export const homeSeoParagraphs: HomeSeoSegment[][] = [
  [
    { text: "PratikHesap, günlük kararlar sırasında ihtiyaç duyulan temel hesapları tek bir yerde ve anlaşılır biçimde yapmanıza yardımcı olur. Bir tutarın yüzdesini bulmak, fiyat indirimi uygulamak veya mevcut maaşa zam eklemek için " },
    { text: "yüzde hesaplama", href: "/yuzde-hesaplama" },
    { text: ", " },
    { text: "indirim hesaplama", href: "/indirim-hesaplama" },
    { text: " ve " },
    { text: "maaş zam ve artış hesaplama", href: "/maas-zam-artis-hesaplama" },
    { text: " araçlarını kullanabilirsiniz. Her araçta gerekli girdiler, formül ve örnek açıklanır; böylece sonuç yalnızca bir sayı olarak değil, işlemin nasıl yapıldığını gösteren kısa bilgilerle birlikte sunulur." }
  ],
  [
    { text: "Finans kategorisinde " },
    { text: "KDV hesaplama", href: "/kdv-hesaplama" },
    { text: ", kredi taksiti, faiz, döviz, kâr-zarar ve alışveriş maliyeti gibi araçlar yer alır. KDV oranı, kredi maliyeti ve benzeri koşullar işleme veya sağlayıcıya göre değişebileceğinden, oranları kendi durumunuza göre girmeniz ve resmî ya da yetkili kaynaklardan doğrulamanız önemlidir. Araçlar sabit ve güncelliği belirsiz vergi oranlarıyla kesin mali yükümlülük belirlemez; tahmini sonuçları karar öncesinde kontrol etmeniz gerekir. " },
    { text: "Finans araçlarını inceleyin.", href: "/finans" }
  ],
  [
    { text: "Eğitim araçları; not ortalaması, 4’lük sistem, harf notu, başarı yüzdesi ve sınav puanı hesaplamalarına destek olur. " },
    { text: "Not ortalaması / GANO hesaplama", href: "/not-ortalamasi-gano-hesaplama" },
    { text: " veya " },
    { text: "4’lük not sistemi hesaplama", href: "/dortluk-not-sistemi-hesaplama" },
    { text: " yaparken ders kredisi ve harf notu katsayılarının üniversite yönetmeliğine göre değişebileceğini göz önünde bulundurun. Tarih kategorisindeki " },
    { text: "yaş hesaplama", href: "/yas-hesaplama" },
    { text: " ve " },
    { text: "iki tarih arası gün hesaplama", href: "/iki-tarih-arasi-gun-hesaplama" },
    { text: " araçları; planlama ve tarih farkı bulma işlerini kolaylaştırır. Tarih aralığı, başlangıç ve bitiş günlerinin dahil edilmesine göre değişebileceği için araç açıklamasındaki varsayımları kontrol edin." }
  ],
  [
    { text: "Günlük Yaşam kategorisinde alan, ölçü dönüşümü, vücut kitle indeksi, gebelik haftası, yakıt tüketimi ve elektrik enerjisi maliyeti gibi farklı ihtiyaçlara yönelik hesaplamalar bulunur. Bu araçların sonuçları girilen ölçü ve varsayımlara dayanır; sağlıkla ilişkili sonuçlar tıbbi değerlendirme yerine geçmez, enerji veya yakıt tahminleri ise gerçek fatura ve seyahat giderleriyle aynı olmayabilir. " },
    { text: "Günlük Yaşam araçlarına göz atın.", href: "/gunluk-yasam" }
  ],
  [
    { text: "Hesaplamalar tarayıcınızda gerçekleştirilir; araçları kullanmak için üyelik açmanız gerekmez. Döviz aracında seçilen para biriminin kuru alınırken, girdiğiniz tutar hesaplama için tarayıcıda kalır. PratikHesap sonuçları genel bilgilendirme içindir: vergi ve mevzuat, finansal karar, eğitim kurumu kuralı veya sağlık değerlendirmesi gereken durumlarda yetkili kaynağı esas alın. Bir sonuçta hata fark ederseniz, " },
    { text: "iletişim sayfasından", href: "/iletisim" },
    { text: " bize bildirebilirsiniz. Aradığınız araca yukarıdaki aramadan veya kategori sayfalarından ulaşabilir, kullanılan formül ve örneği ilgili araç sayfasında inceleyebilirsiniz." }
  ]
];
