import { tools, type ToolDefinition } from "./tools";

export const relatedToolIds: Record<string, string[]> = {
  "yuzde-hesaplama": ["indirim-hesaplama", "kdv-hesaplama", "maas-artis-hesaplama"],
  "maas-zam-hesaplama": ["maas-artis-hesaplama", "yuzde-hesaplama", "kredi-taksit-hesaplama"],
  "indirim-hesaplama": ["yuzde-hesaplama", "kdv-hesaplama", "kar-zarar-hesaplama"],
  "kdv-hesaplama": ["yuzde-hesaplama", "indirim-hesaplama", "kar-zarar-hesaplama"],
  "kar-zarar-hesaplama": ["indirim-hesaplama", "yuzde-hesaplama", "maas-artis-hesaplama"],
  "maas-artis-hesaplama": ["maas-zam-hesaplama", "yuzde-hesaplama", "kar-zarar-hesaplama"],
  "yas-hesaplama": ["dogum-gunune-kalan-sure", "iki-tarih-arasi-gun-hesaplama", "gebelik-haftasi-hesaplama"],
  "iki-tarih-arasi-gun-hesaplama": ["is-gunu-hesaplama", "tarihe-gun-ekleme", "tarihten-gun-cikarma"],
  "tarihe-gun-ekleme": ["tarihten-gun-cikarma", "iki-tarih-arasi-gun-hesaplama", "is-gunu-hesaplama"],
  "tarihten-gun-cikarma": ["tarihe-gun-ekleme", "iki-tarih-arasi-gun-hesaplama", "is-gunu-hesaplama"],
  "dogum-gunune-kalan-sure": ["yas-hesaplama", "iki-tarih-arasi-gun-hesaplama", "gebelik-haftasi-hesaplama"],
  "gebelik-haftasi-hesaplama": ["yas-hesaplama", "dogum-gunune-kalan-sure", "iki-tarih-arasi-gun-hesaplama"],
  "not-ortalamasi-hesaplama": ["ders-ortalamasi-hesaplama", "agirlikli-not-ortalamasi-hesaplama", "dortluk-not-sistemi-hesaplama"],
  "sinav-puani-hesaplama": ["basari-yuzdesi-hesaplama", "agirlikli-not-ortalamasi-hesaplama", "finalde-gerekli-not-hesaplama"],
  "basari-yuzdesi-hesaplama": ["sinav-puani-hesaplama", "yuzde-hesaplama", "not-ortalamasi-hesaplama"],
  "harf-notu-hesaplama": ["dortluk-not-sistemi-hesaplama", "not-ortalamasi-hesaplama", "ders-ortalamasi-hesaplama"],
  "ders-ortalamasi-hesaplama": ["not-ortalamasi-hesaplama", "agirlikli-not-ortalamasi-hesaplama", "dortluk-not-sistemi-hesaplama"],
  "metrekare-hesaplama": ["litre-donusumu", "kilogram-donusumu"],
  "boy-kilo-orani-hesaplama": ["gebelik-haftasi-hesaplama", "yas-hesaplama"],
  "litre-donusumu": ["kilogram-donusumu", "metrekare-hesaplama", "yakit-tuketimi-hesaplama"],
  "kilogram-donusumu": ["litre-donusumu", "metrekare-hesaplama", "boy-kilo-orani-hesaplama"],
  "saat-dakika-donusturme": ["iki-tarih-arasi-gun-hesaplama", "is-gunu-hesaplama", "tarihe-gun-ekleme"],
  "dortluk-not-sistemi-hesaplama": ["agirlikli-not-ortalamasi-hesaplama", "harf-notu-hesaplama", "ders-ortalamasi-hesaplama"],
  "agirlikli-not-ortalamasi-hesaplama": ["finalde-gerekli-not-hesaplama", "not-ortalamasi-hesaplama", "dortluk-not-sistemi-hesaplama"],
  "finalde-gerekli-not-hesaplama": ["agirlikli-not-ortalamasi-hesaplama", "not-ortalamasi-hesaplama", "sinav-puani-hesaplama"],
  "kredi-taksit-hesaplama": ["basit-faiz-hesaplama", "bilesik-faiz-hesaplama", "maas-zam-hesaplama"],
  "bilesik-faiz-hesaplama": ["basit-faiz-hesaplama", "kredi-taksit-hesaplama", "yuzde-hesaplama"],
  "basit-faiz-hesaplama": ["bilesik-faiz-hesaplama", "kredi-taksit-hesaplama", "yuzde-hesaplama"],
  "doviz-hesaplama": ["yuzde-hesaplama", "basit-faiz-hesaplama", "bilesik-faiz-hesaplama"],
  "yakit-tuketimi-hesaplama": ["elektrik-faturasi-hesaplama", "litre-donusumu", "yuzde-hesaplama"],
  "elektrik-faturasi-hesaplama": ["yakit-tuketimi-hesaplama", "yuzde-hesaplama", "kredi-taksit-hesaplama"],
  "is-gunu-hesaplama": ["iki-tarih-arasi-gun-hesaplama", "tarihe-gun-ekleme", "tarihten-gun-cikarma"]
};

export function getRelatedTools(toolId: string): ToolDefinition[] {
  return (relatedToolIds[toolId] ?? [])
    .map((id) => tools.find((tool) => tool.id === id))
    .filter((tool): tool is ToolDefinition => tool !== undefined && tool.id !== toolId)
    .slice(0, 3);
}
