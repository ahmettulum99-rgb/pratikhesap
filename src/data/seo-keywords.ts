import type { CategoryId, ToolDefinition } from "./tools";
import { getCategory } from "./tools";

const categoryKeywords: Record<CategoryId, string[]> = {
  finans: ["finans hesaplama araçları", "ücretsiz finans hesaplayıcıları"],
  tarih: ["tarih hesaplama araçları", "tarih farkı hesaplayıcı"],
  egitim: ["eğitim hesaplama araçları", "not hesaplama araçları", "öğrenci hesaplayıcıları"],
  "gunluk-yasam": ["günlük yaşam hesaplayıcıları", "ölçü ve birim dönüştürücü"]
};

const toolKeywords: Record<string, string[]> = {
  "yuzde-hesaplama": ["yüzde hesaplama", "yüzde hesaplayıcı", "bir sayının yüzdesi", "yüzde bulma", "oran hesaplama"],
  "maas-zam-artis-hesaplama": ["maaş zam hesaplama", "maaş artış hesaplama", "zamlı maaş hesaplayıcı", "sabit maaş artışı", "zam oranı maaş"],
  "brut-net-maas-hesaplama": ["brüt net maaş hesaplama", "netten brüte maaş hesaplama", "brütten nete maaş hesaplama", "2026 maaş hesaplama", "maaş bordro hesaplama", "işveren maliyeti hesaplama", "SGK ve vergi kesintisi hesaplama"],
  "indirim-hesaplama": ["indirim hesaplama", "indirimli fiyat hesaplama", "indirim oranı bulma", "yüzde indirim hesaplayıcı"],
  "kdv-hesaplama": ["KDV hesaplama", "KDV dahil fiyat", "KDV tutarı hesaplama", "vergi ekleme hesaplayıcı"],
  "kar-zarar-hesaplama": ["kâr zarar hesaplama", "kâr oranı hesaplama", "alış satış kâr hesaplayıcı", "zarar hesaplama"],
  "yas-hesaplama": ["yaş hesaplama", "kaç yaşındayım", "doğum tarihine göre yaş", "tam yaş hesaplayıcı"],
  "iki-tarih-arasi-gun-hesaplama": ["iki tarih arası gün hesaplama", "tarih farkı gün", "tarihler arasındaki gün sayısı", "gün farkı hesaplayıcı"],
  "tarihe-gun-ekleme": ["tarihe gün ekleme", "ileri tarih hesaplama", "gün sonrası tarih", "tarih bulma hesaplayıcı"],
  "tarihten-gun-cikarma": ["tarihten gün çıkarma", "geçmiş tarih hesaplama", "gün öncesi tarih", "tarih çıkarma hesaplayıcı"],
  "dogum-gunune-kalan-sure": ["doğum gününe kaç gün kaldı", "doğum günü sayacı", "doğum gününe kalan süre", "doğum günü hesaplama"],
  "gebelik-haftasi-hesaplama": ["gebelik haftası hesaplama", "kaç haftalık gebeyim", "son adet tarihine göre gebelik haftası", "tahmini doğum tarihi hesaplama"],
  "not-ortalamasi-gano-hesaplama": ["not ortalaması hesaplama", "GANO hesaplama", "AGNO hesaplama", "4'lük not ortalaması", "100'lük not ortalaması", "kredi ağırlıklı ortalama"],
  "sinav-puani-hesaplama": ["sınav puanı hesaplama", "net hesaplama", "4 yanlış 1 doğru", "doğru yanlış puan hesaplayıcı"],
  "basari-yuzdesi-hesaplama": ["başarı yüzdesi hesaplama", "doğru yüzdesi hesaplama", "tamamlanma oranı", "başarı oranı hesaplayıcı"],
  "harf-notu-hesaplama": ["harf notu hesaplama", "100'lük not harf karşılığı", "notu harfe çevirme", "AA BA BB not sistemi"],
  "metrekare-hesaplama": ["metrekare hesaplama", "m2 hesaplama", "oda alanı hesaplama", "en boy alan hesaplayıcı"],
  "boy-kilo-orani-hesaplama": ["boy kilo endeksi hesaplama", "VKİ hesaplama", "vücut kitle indeksi", "boya göre kilo indeksi"],
  "litre-donusumu": ["litre mililitre çevirme", "litre dönüşümü", "hacim birimi dönüştürücü", "litre metreküp hesaplama"],
  "kilogram-donusumu": ["kilogram gram çevirme", "kg gram dönüştürme", "kilogram ton hesaplama", "ağırlık birimi dönüştürücü"],
  "saat-dakika-donusturme": ["saat dakika dönüştürme", "saat kaç dakika", "dakika saat hesaplama", "zaman birimi çevirici"],
  "birim-donusturme": ["birim dönüştürücü", "birim çevirme", "uzunluk ağırlık hacim dönüştürme", "sıcaklık birimi dönüştürme"],
  "dortluk-not-sistemi-hesaplama": ["4'lük not sistemi hesaplama", "4 üzerinden not ortalaması", "üniversite GPA hesaplama", "AGNO hesaplama", "AKTS not ortalaması", "harf notu kredi ortalaması"],
  "agirlikli-not-ortalamasi-hesaplama": ["ağırlıklı not ortalaması", "vize final ortalaması hesaplama", "vize final yüzde hesaplama", "ders başarı notu hesaplama"],
  "finalde-gerekli-not-hesaplama": ["finalde kaç almalıyım", "finalde gerekli not hesaplama", "hedef not için final puanı", "vize final hedef ortalama"],
  "kredi-taksit-hesaplama": ["kredi taksit hesaplama", "aylık kredi taksiti hesaplayıcı", "kredi geri ödeme hesaplama", "kredi faiz hesaplama"],
  "bilesik-faiz-hesaplama": ["bileşik faiz hesaplama", "bileşik getiri hesaplayıcı", "faiz getirisi hesaplama", "yatırım dönem sonu tutarı"],
  "basit-faiz-hesaplama": ["basit faiz hesaplama", "basit faiz getirisi", "anapara faiz hesaplayıcı", "günlük faiz hesabı"],
  "doviz-hesaplama": ["döviz hesaplama", "döviz çevirici", "dolar TL hesaplama", "euro TL hesaplama", "TCMB döviz kuru", "döviz TL çevirme"],
  "yakit-tuketimi-hesaplama": ["yakıt tüketimi hesaplama", "araç 100 km kaç litre yakar", "L/100 km hesaplama", "araç yakıt maliyeti"],
  "elektrik-faturasi-hesaplama": ["elektrik tüketim maliyeti", "kWh hesaplama", "elektrik birim fiyat hesaplama", "tahmini enerji bedeli"],
  "is-gunu-hesaplama": ["iş günü hesaplama", "iki tarih arası iş günü", "hafta içi gün sayısı hesaplama", "resmî tatiller hariç iş günü"],
  "pazaryeri-net-kar-hesaplama": ["pazaryeri komisyon sonrası kâr", "ürün net kâr hesaplama", "satış kâr marjı", "komisyon ve kargo maliyeti"],
  "birim-fiyat-karsilastirma": ["birim fiyat hesaplama", "ürün fiyatı karşılaştırma", "paket fiyatı karşılaştır", "kg litre birim maliyet"],
  "aylik-katkili-birikim-hesaplama": ["aylık birikim hesaplama", "düzenli yatırım getirisi", "aylık katkı hesaplayıcı", "birikim hedefi hesaplama"],
  "yolculuk-maliyeti-hesaplama": ["yol masrafı hesaplama", "yolculuk yakıt maliyeti", "araç seyahat gideri", "kişi başı yol masrafı"],
  "desi-hacim-hesaplama": ["desi hesaplama", "kargo hacim ağırlığı", "paket hacmi hesaplama", "desi böleni hesaplama"],
  "kidem-tazminati-hesaplama": ["kıdem tazminatı hesaplama", "kıdem tazminatı tavanı", "brüt kıdem tazminatı", "hizmet süresi kıdem hesabı"],
  "ihbar-tazminati-hesaplama": ["ihbar tazminatı hesaplama", "ihbar süresi hesaplama", "4857 ihbar haftası", "brüt ihbar tazminatı"],
  "yillik-izin-ucreti-hesaplama": ["yıllık izin ücreti hesaplama", "kullanılmamış izin alacağı", "yıllık izin gün sayısı", "izin ücreti brüt hesaplama"],
  "kira-artis-orani-hesaplama": ["kira artış oranı hesaplama", "TÜFE kira artışı", "12 aylık ortalama kira", "yeni kira hesaplama"],
  "konut-kredisi-hesaplama": ["konut kredisi hesaplama", "ev kredisi taksiti", "konut kredisi amortisman tablosu", "konut finansmanı geri ödeme"],
  "ihtiyac-kredisi-hesaplama": ["ihtiyaç kredisi hesaplama", "tüketici kredisi taksiti", "ihtiyaç kredisi KKDF BSMV", "ihtiyaç kredisi geri ödeme"],
  "tasit-kredisi-hesaplama": ["taşıt kredisi hesaplama", "araç kredisi taksiti", "taşıt kredisi geri ödeme", "taşıt kredisi amortisman tablosu"],
  "mevduat-faiz-hesaplama": ["mevduat faiz hesaplama", "vadeli mevduat net getiri", "TL mevduat stopaj hesaplama", "vade faiz getirisi"],
  "gelir-vergisi-dilimi-hesaplama": ["gelir vergisi dilimi hesaplama", "ücret gelir vergisi tarifesi", "kümülatif vergi matrahı", "marjinal vergi oranı"],
  "damga-vergisi-hesaplama": ["damga vergisi hesaplama", "kira sözleşmesi damga vergisi", "ücret kağıdı damga vergisi", "sözleşme damga vergisi"],
  "tapu-harci-hesaplama": ["tapu harcı hesaplama", "alıcı satıcı tapu harcı", "tapu masrafı hesaplama", "taşınmaz satış harcı"],
  "altin-hesaplama": ["altın hesaplama", "çeyrek altın teorik değer", "gram altın hesaplayıcı", "yarım tam altın ağırlık hesabı"],
  "yks-puan-hesaplama": ["YKS puan hesaplama", "TYT AYT puan hesaplama", "YKS net puanı", "TYT AYT net hesaplama"],
  "lgs-puan-hesaplama": ["LGS puan hesaplama", "LGS net hesaplama", "LGS merkezi sınav puanı", "MEB LGS puan tahmini"],
  "kpss-puan-hesaplama": ["KPSS puan hesaplama", "KPSS P3 hesaplama", "KPSS net puanı", "KPSS puan türleri"],
  "ales-puan-hesaplama": ["ALES puan hesaplama", "ALES sayısal sözel puanı", "ALES net hesaplama", "ALES eşit ağırlık"],
  "dgs-puan-hesaplama": ["DGS puan hesaplama", "DGS ÖBP hesaplama", "DGS sayısal sözel puanı", "DGS net hesaplama"],
  "lise-diploma-notu-hesaplama": ["lise diploma notu hesaplama", "diploma puanı hesaplama", "9 10 11 12 sınıf ortalaması", "lise yıl sonu puanı"],
  "ideal-kilo-hesaplama": ["ideal kilo hesaplama", "boya göre kilo aralığı", "yetişkin BMI kilo aralığı", "sağlıklı kilo tahmini"],
  "gunluk-kalori-ihtiyaci-hesaplama": ["günlük kalori ihtiyacı hesaplama", "BMR hesaplama", "bazal metabolizma hızı", "günlük enerji harcaması"],
  "gunluk-su-ihtiyaci-hesaplama": ["günlük su ihtiyacı hesaplama", "kiloya göre su hesabı", "mL kg su hesaplayıcı", "günlük sıvı hesabı"],
  "yumurtlama-adet-takvimi-hesaplama": ["yumurtlama günü hesaplama", "adet takvimi hesaplama", "sonraki adet tarihi", "verimli dönem takvimi"],
  "hicri-takvim-cevirme": ["Hicri takvim çevirme", "Miladi Hicri tarih çevirici", "Hicri tarih hesaplama", "Miladi tarihi Hicriye çevir"],
  "tarihe-kac-gun-kaldi-hesaplama": ["tarihe kaç gün kaldı", "tarih geri sayım hesaplama", "sınava kaç gün kaldı", "hedef tarihe kalan gün"],
  "burc-hesaplama": ["burç hesaplama", "doğum tarihine göre burç", "Güneş burcu bulma", "burç bulucu"]
};

export function getToolKeywords(tool: ToolDefinition): string[] {
  const category = getCategory(tool.category);
  return [...new Set([
    tool.name,
    `${tool.name} hesaplayıcı`,
    ...(category ? categoryKeywords[tool.category] : []),
    ...(toolKeywords[tool.id] ?? [])
  ])];
}
