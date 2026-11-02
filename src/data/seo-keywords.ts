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
  "maas-zam-hesaplama": ["maaş zam hesaplama", "zamlı maaş hesaplayıcı", "maaş zammı hesaplama", "zam oranı maaş"],
  "indirim-hesaplama": ["indirim hesaplama", "indirimli fiyat hesaplama", "indirim oranı bulma", "yüzde indirim hesaplayıcı"],
  "kdv-hesaplama": ["KDV hesaplama", "KDV dahil fiyat", "KDV tutarı hesaplama", "vergi ekleme hesaplayıcı"],
  "kar-zarar-hesaplama": ["kâr zarar hesaplama", "kâr oranı hesaplama", "alış satış kâr hesaplayıcı", "zarar hesaplama"],
  "maas-artis-hesaplama": ["maaş artış hesaplama", "maaşa eklenen tutar", "yeni maaş hesaplayıcı", "maaş artış yüzdesi"],
  "yas-hesaplama": ["yaş hesaplama", "kaç yaşındayım", "doğum tarihine göre yaş", "tam yaş hesaplayıcı"],
  "iki-tarih-arasi-gun-hesaplama": ["iki tarih arası gün hesaplama", "tarih farkı gün", "tarihler arasındaki gün sayısı", "gün farkı hesaplayıcı"],
  "tarihe-gun-ekleme": ["tarihe gün ekleme", "ileri tarih hesaplama", "gün sonrası tarih", "tarih bulma hesaplayıcı"],
  "tarihten-gun-cikarma": ["tarihten gün çıkarma", "geçmiş tarih hesaplama", "gün öncesi tarih", "tarih çıkarma hesaplayıcı"],
  "dogum-gunune-kalan-sure": ["doğum gününe kaç gün kaldı", "doğum günü sayacı", "doğum gününe kalan süre", "doğum günü hesaplama"],
  "not-ortalamasi-hesaplama": ["not ortalaması hesaplama", "sınav notu ortalaması", "iki not ortalaması", "puan ortalaması hesaplayıcı"],
  "sinav-puani-hesaplama": ["sınav puanı hesaplama", "net hesaplama", "4 yanlış 1 doğru", "doğru yanlış puan hesaplayıcı"],
  "basari-yuzdesi-hesaplama": ["başarı yüzdesi hesaplama", "doğru yüzdesi hesaplama", "tamamlanma oranı", "başarı oranı hesaplayıcı"],
  "harf-notu-hesaplama": ["harf notu hesaplama", "100'lük not harf karşılığı", "notu harfe çevirme", "AA BA BB not sistemi"],
  "ders-ortalamasi-hesaplama": ["ders ortalaması hesaplama", "ders notları ortalaması", "eşit ağırlıklı ders ortalaması", "öğrenci not hesaplayıcı"],
  "metrekare-hesaplama": ["metrekare hesaplama", "m2 hesaplama", "oda alanı hesaplama", "en boy alan hesaplayıcı"],
  "boy-kilo-orani-hesaplama": ["boy kilo endeksi hesaplama", "VKİ hesaplama", "vücut kitle indeksi", "boya göre kilo indeksi"],
  "litre-donusumu": ["litre mililitre çevirme", "litre dönüşümü", "hacim birimi dönüştürücü", "litre metreküp hesaplama"],
  "kilogram-donusumu": ["kilogram gram çevirme", "kg gram dönüştürme", "kilogram ton hesaplama", "ağırlık birimi dönüştürücü"],
  "saat-dakika-donusturme": ["saat dakika dönüştürme", "saat kaç dakika", "dakika saat hesaplama", "zaman birimi çevirici"],
  "dortluk-not-sistemi-hesaplama": ["4'lük not sistemi hesaplama", "4 üzerinden not ortalaması", "üniversite GPA hesaplama", "AGNO hesaplama", "AKTS not ortalaması", "harf notu kredi ortalaması"],
  "agirlikli-not-ortalamasi-hesaplama": ["ağırlıklı not ortalaması", "vize final ortalaması hesaplama", "vize final yüzde hesaplama", "ders başarı notu hesaplama"],
  "finalde-gerekli-not-hesaplama": ["finalde kaç almalıyım", "finalde gerekli not hesaplama", "hedef not için final puanı", "vize final hedef ortalama"],
  "kredi-taksit-hesaplama": ["kredi taksit hesaplama", "aylık kredi taksiti hesaplayıcı", "kredi geri ödeme hesaplama", "kredi faiz hesaplama"],
  "bilesik-faiz-hesaplama": ["bileşik faiz hesaplama", "bileşik getiri hesaplayıcı", "faiz getirisi hesaplama", "yatırım dönem sonu tutarı"],
  "yakit-tuketimi-hesaplama": ["yakıt tüketimi hesaplama", "araç 100 km kaç litre yakar", "L/100 km hesaplama", "araç yakıt maliyeti"],
  "elektrik-faturasi-hesaplama": ["elektrik tüketim maliyeti", "kWh hesaplama", "elektrik birim fiyat hesaplama", "tahmini enerji bedeli"],
  "is-gunu-hesaplama": ["iş günü hesaplama", "iki tarih arası iş günü", "hafta içi gün sayısı hesaplama", "resmî tatiller hariç iş günü"]
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
