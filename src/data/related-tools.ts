import { tools, type ToolDefinition } from "./tools";

export const relatedToolIds: Record<string, string[]> = {
  "yuzde-hesaplama": ["indirim-hesaplama", "kdv-hesaplama", "maas-zam-artis-hesaplama"],
  "maas-zam-artis-hesaplama": ["yuzde-hesaplama", "kredi-taksit-hesaplama", "kar-zarar-hesaplama"],
  "brut-net-maas-hesaplama": ["maas-zam-artis-hesaplama", "basit-faiz-hesaplama", "yuzde-hesaplama"],
  "indirim-hesaplama": ["yuzde-hesaplama", "kdv-hesaplama", "kar-zarar-hesaplama"],
  "kdv-hesaplama": ["yuzde-hesaplama", "indirim-hesaplama", "kar-zarar-hesaplama"],
  "kar-zarar-hesaplama": ["indirim-hesaplama", "yuzde-hesaplama", "maas-zam-artis-hesaplama"],
  "yas-hesaplama": ["dogum-gunune-kalan-sure", "iki-tarih-arasi-gun-hesaplama", "gebelik-haftasi-hesaplama"],
  "iki-tarih-arasi-gun-hesaplama": ["is-gunu-hesaplama", "tarihe-gun-ekleme", "tarihten-gun-cikarma"],
  "tarihe-gun-ekleme": ["tarihten-gun-cikarma", "iki-tarih-arasi-gun-hesaplama", "is-gunu-hesaplama"],
  "tarihten-gun-cikarma": ["tarihe-gun-ekleme", "iki-tarih-arasi-gun-hesaplama", "is-gunu-hesaplama"],
  "dogum-gunune-kalan-sure": ["yas-hesaplama", "iki-tarih-arasi-gun-hesaplama", "gebelik-haftasi-hesaplama"],
  "gebelik-haftasi-hesaplama": ["yas-hesaplama", "dogum-gunune-kalan-sure", "iki-tarih-arasi-gun-hesaplama"],
  "not-ortalamasi-gano-hesaplama": ["agirlikli-not-ortalamasi-hesaplama", "dortluk-not-sistemi-hesaplama", "finalde-gerekli-not-hesaplama"],
  "sinav-puani-hesaplama": ["basari-yuzdesi-hesaplama", "agirlikli-not-ortalamasi-hesaplama", "finalde-gerekli-not-hesaplama"],
  "basari-yuzdesi-hesaplama": ["sinav-puani-hesaplama", "yuzde-hesaplama", "not-ortalamasi-gano-hesaplama"],
  "harf-notu-hesaplama": ["dortluk-not-sistemi-hesaplama", "not-ortalamasi-gano-hesaplama"],
  "metrekare-hesaplama": ["birim-donusturme", "desi-hacim-hesaplama", "litre-donusumu"],
  "boy-kilo-orani-hesaplama": ["gebelik-haftasi-hesaplama", "yas-hesaplama"],
  "litre-donusumu": ["birim-donusturme", "kilogram-donusumu", "yakit-tuketimi-hesaplama"],
  "kilogram-donusumu": ["birim-donusturme", "litre-donusumu", "boy-kilo-orani-hesaplama"],
  "saat-dakika-donusturme": ["birim-donusturme", "iki-tarih-arasi-gun-hesaplama", "is-gunu-hesaplama"],
  "birim-donusturme": ["litre-donusumu", "kilogram-donusumu", "saat-dakika-donusturme"],
  "dortluk-not-sistemi-hesaplama": ["agirlikli-not-ortalamasi-hesaplama", "harf-notu-hesaplama", "not-ortalamasi-gano-hesaplama"],
  "agirlikli-not-ortalamasi-hesaplama": ["finalde-gerekli-not-hesaplama", "not-ortalamasi-gano-hesaplama", "dortluk-not-sistemi-hesaplama"],
  "finalde-gerekli-not-hesaplama": ["agirlikli-not-ortalamasi-hesaplama", "not-ortalamasi-gano-hesaplama", "sinav-puani-hesaplama"],
  "kredi-taksit-hesaplama": ["basit-faiz-hesaplama", "bilesik-faiz-hesaplama", "maas-zam-artis-hesaplama"],
  "bilesik-faiz-hesaplama": ["basit-faiz-hesaplama", "kredi-taksit-hesaplama", "yuzde-hesaplama"],
  "basit-faiz-hesaplama": ["bilesik-faiz-hesaplama", "kredi-taksit-hesaplama", "yuzde-hesaplama"],
  "doviz-hesaplama": ["yuzde-hesaplama", "basit-faiz-hesaplama", "bilesik-faiz-hesaplama"],
  "yakit-tuketimi-hesaplama": ["elektrik-faturasi-hesaplama", "litre-donusumu", "yuzde-hesaplama"],
  "elektrik-faturasi-hesaplama": ["yakit-tuketimi-hesaplama", "yuzde-hesaplama", "kredi-taksit-hesaplama"],
  "is-gunu-hesaplama": ["iki-tarih-arasi-gun-hesaplama", "tarihe-gun-ekleme", "tarihten-gun-cikarma"],
  "pazaryeri-net-kar-hesaplama": ["kar-zarar-hesaplama", "indirim-hesaplama", "kdv-hesaplama"],
  "birim-fiyat-karsilastirma": ["indirim-hesaplama", "yuzde-hesaplama", "kilogram-donusumu"],
  "aylik-katkili-birikim-hesaplama": ["bilesik-faiz-hesaplama", "basit-faiz-hesaplama", "kredi-taksit-hesaplama"],
  "yolculuk-maliyeti-hesaplama": ["yakit-tuketimi-hesaplama", "litre-donusumu", "doviz-hesaplama"],
  "desi-hacim-hesaplama": ["metrekare-hesaplama", "litre-donusumu", "kilogram-donusumu"],
  "kidem-tazminati-hesaplama": ["ihbar-tazminati-hesaplama", "yillik-izin-ucreti-hesaplama", "brut-net-maas-hesaplama", "maas-zam-artis-hesaplama"],
  "ihbar-tazminati-hesaplama": ["kidem-tazminati-hesaplama", "yillik-izin-ucreti-hesaplama", "brut-net-maas-hesaplama", "maas-zam-artis-hesaplama"],
  "yillik-izin-ucreti-hesaplama": ["kidem-tazminati-hesaplama", "ihbar-tazminati-hesaplama", "brut-net-maas-hesaplama", "maas-zam-artis-hesaplama"],
  "kira-artis-orani-hesaplama": ["konut-kredisi-hesaplama", "mevduat-faiz-hesaplama", "gelir-vergisi-dilimi-hesaplama", "tapu-harci-hesaplama"],
  "konut-kredisi-hesaplama": ["ihtiyac-kredisi-hesaplama", "tasit-kredisi-hesaplama", "mevduat-faiz-hesaplama", "kira-artis-orani-hesaplama"],
  "ihtiyac-kredisi-hesaplama": ["konut-kredisi-hesaplama", "tasit-kredisi-hesaplama", "mevduat-faiz-hesaplama", "damga-vergisi-hesaplama"],
  "tasit-kredisi-hesaplama": ["konut-kredisi-hesaplama", "ihtiyac-kredisi-hesaplama", "mevduat-faiz-hesaplama", "damga-vergisi-hesaplama"],
  "mevduat-faiz-hesaplama": ["konut-kredisi-hesaplama", "ihtiyac-kredisi-hesaplama", "tasit-kredisi-hesaplama", "altin-hesaplama"],
  "gelir-vergisi-dilimi-hesaplama": ["brut-net-maas-hesaplama", "damga-vergisi-hesaplama", "kidem-tazminati-hesaplama", "mevduat-faiz-hesaplama"],
  "damga-vergisi-hesaplama": ["tapu-harci-hesaplama", "gelir-vergisi-dilimi-hesaplama", "kira-artis-orani-hesaplama", "konut-kredisi-hesaplama"],
  "tapu-harci-hesaplama": ["damga-vergisi-hesaplama", "konut-kredisi-hesaplama", "kira-artis-orani-hesaplama", "mevduat-faiz-hesaplama"],
  "altin-hesaplama": ["mevduat-faiz-hesaplama", "doviz-hesaplama", "yuzde-hesaplama", "kar-zarar-hesaplama"],
  "yks-puan-hesaplama": ["lgs-puan-hesaplama", "kpss-puan-hesaplama", "ales-puan-hesaplama", "dgs-puan-hesaplama"],
  "lgs-puan-hesaplama": ["yks-puan-hesaplama", "kpss-puan-hesaplama", "ales-puan-hesaplama", "dgs-puan-hesaplama"],
  "kpss-puan-hesaplama": ["yks-puan-hesaplama", "lgs-puan-hesaplama", "ales-puan-hesaplama", "dgs-puan-hesaplama"],
  "ales-puan-hesaplama": ["yks-puan-hesaplama", "lgs-puan-hesaplama", "kpss-puan-hesaplama", "dgs-puan-hesaplama"],
  "dgs-puan-hesaplama": ["yks-puan-hesaplama", "lgs-puan-hesaplama", "kpss-puan-hesaplama", "ales-puan-hesaplama"],
  "lise-diploma-notu-hesaplama": ["not-ortalamasi-gano-hesaplama", "sinav-puani-hesaplama", "yks-puan-hesaplama", "lgs-puan-hesaplama"],
  "ideal-kilo-hesaplama": ["boy-kilo-orani-hesaplama", "gunluk-kalori-ihtiyaci-hesaplama", "gunluk-su-ihtiyaci-hesaplama", "yumurtlama-adet-takvimi-hesaplama"],
  "gunluk-kalori-ihtiyaci-hesaplama": ["ideal-kilo-hesaplama", "boy-kilo-orani-hesaplama", "gunluk-su-ihtiyaci-hesaplama", "yumurtlama-adet-takvimi-hesaplama"],
  "gunluk-su-ihtiyaci-hesaplama": ["ideal-kilo-hesaplama", "boy-kilo-orani-hesaplama", "gunluk-kalori-ihtiyaci-hesaplama", "yumurtlama-adet-takvimi-hesaplama"],
  "yumurtlama-adet-takvimi-hesaplama": ["gebelik-haftasi-hesaplama", "yas-hesaplama", "dogum-gunune-kalan-sure", "gunluk-kalori-ihtiyaci-hesaplama"],
  "hicri-takvim-cevirme": ["iki-tarih-arasi-gun-hesaplama", "tarihe-kac-gun-kaldi-hesaplama", "tarihe-gun-ekleme", "tarihten-gun-cikarma"],
  "tarihe-kac-gun-kaldi-hesaplama": ["iki-tarih-arasi-gun-hesaplama", "tarihe-gun-ekleme", "tarihten-gun-cikarma", "hicri-takvim-cevirme"],
  "burc-hesaplama": ["yas-hesaplama", "dogum-gunune-kalan-sure", "iki-tarih-arasi-gun-hesaplama", "gunluk-kalori-ihtiyaci-hesaplama"]
};

export function getRelatedTools(toolId: string): ToolDefinition[] {
  const tool = tools.find((item) => item.id === toolId);
  if (!tool) return [];
  const curated = (relatedToolIds[toolId] ?? [])
    .map((id) => tools.find((item) => item.id === id))
    .filter((item): item is ToolDefinition => item !== undefined && item.id !== toolId && item.category === tool.category);
  const related = [...curated];
  for (const candidate of tools) {
    if (related.length >= 4) break;
    if (candidate.id !== toolId && candidate.category === tool.category && !related.some((item) => item.id === candidate.id)) {
      related.push(candidate);
    }
  }
  return related.slice(0, 4);
}
