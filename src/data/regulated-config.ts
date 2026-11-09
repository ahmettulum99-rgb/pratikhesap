export type RegulatedValue<T> = {
  value: T | null;
  source: string;
  url: string;
  lastUpdated: string;
  note: string;
};

const ministry = "https://www.hmb.gov.tr/";
const revenueAdministration = "https://www.gib.gov.tr/";
const officialGazette = "https://www.resmigazete.gov.tr/";

export const regulatedConfig2026 = {
  year: 2026,
  lastUpdated: "2026-11-09",
  severance: {
    ceiling: {
      value: null as number | null,
      source: "Hazine ve Maliye Bakanlığı – 2026 ikinci yarı mali ve sosyal haklar genelgesi",
      url: ministry,
      lastUpdated: "2026-11-09",
      note: "TODO: 2026 Temmuz-Aralık kıdem tazminatı tavanı ve yürürlük genelgesi birincil kaynaktan doğrulanmalı."
    } satisfies RegulatedValue<number>
  },
  noticePeriods: {
    source: "4857 sayılı İş Kanunu, madde 17",
    url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4857.pdf",
    lastUpdated: "2026-11-09",
    bands: [
      { monthsLessThan: 6, weeks: 2 },
      { monthsLessThan: 18, weeks: 4 },
      { monthsLessThan: 36, weeks: 6 },
      { monthsLessThan: null, weeks: 8 }
    ]
  },
  annualLeave: {
    source: "4857 sayılı İş Kanunu, maddeler 53-54",
    url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4857.pdf",
    lastUpdated: "2026-11-09",
    firstBandYears: 5,
    firstBandMinimumDays: 14,
    secondBandStartsAtYears: 15,
    secondBandMinimumDays: 20,
    thirdBandMinimumDays: 26,
    protectedAgeMinimum: 20,
    protectedAgeUnder: 18,
    protectedAgeFrom: 50
  },
  rentIncrease: {
    latestCpi12MonthAverage: {
      value: null as number | null,
      source: "TÜİK – Tüketici Fiyat Endeksi, Ekim 2026",
      url: "https://data.tuik.gov.tr/",
      lastUpdated: "2026-11-09",
      note: "TODO: Ekim 2026 TÜFE 12 aylık ortalama değeri ve bültenin yayımlanma tarihi doğrulanmalı."
    } satisfies RegulatedValue<number>
  },
  loans: {
    konut: { kkdf: null as number | null, bsmv: null as number | null },
    ihtiyac: { kkdf: null as number | null, bsmv: null as number | null },
    tasit: { kkdf: null as number | null, bsmv: null as number | null },
    source: "6802 sayılı Gider Vergileri Kanunu ve 88/12944 sayılı KKDF Kararı ile değişiklikleri",
    url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6802.pdf",
    lastUpdated: "2026-11-09",
    note: "TODO: 2026 itibarıyla her finansman türünün vergi oranı, matrahı ve istisnası birincil kaynaktan doğrulanmalı."
  },
  deposit: {
    withholdingByMaturity: [] as { minDays: number; maxDays: number | null; rate: number; effectiveFrom: string; effectiveTo: string | null }[],
    source: "193 sayılı Gelir Vergisi Kanunu, geçici madde 67; yürürlükteki Cumhurbaşkanı Kararı",
    url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.193.pdf",
    lastUpdated: "2026-11-09",
    note: "TODO: TL mevduat stopaj oranları vade ve hesap açılış/yenileme tarihine göre doğrulanmalı."
  },
  incomeTax: {
    salaryBrackets: null as { upTo: number | null; rate: number }[] | null,
    source: "Gelir İdaresi Başkanlığı – 2026 ücret gelirleri tarifesi",
    url: "https://www.gib.gov.tr/",
    lastUpdated: "2026-11-09",
    note: "TODO: 2026 ücret geliri tarife dilimleri ve oranları GİB/Resmî Gazete birincil kaynağından doğrulanmalı."
  },
  stampDuty: {
    ratesByDocument: { lease: null, wage: null, contract: null } as Record<"lease" | "wage" | "contract", number | null>,
    ceilingsByDocument: { lease: null, wage: null, contract: null } as Record<"lease" | "wage" | "contract", number | null>,
    source: "488 sayılı Damga Vergisi Kanunu, (1) sayılı tablo",
    url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.488.pdf",
    lastUpdated: "2026-11-09",
    note: "TODO: 2026 geçerli tarife oranları ve yıllık üst sınırlar belge türüne göre kontrol edilmeli."
  },
  titleDeed: {
    buyerRate: {
      value: 0.02,
      source: "492 sayılı Harçlar Kanunu, (4) sayılı tarife, I/20-a",
      url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.492.pdf",
      lastUpdated: "2026-11-09",
      note: "Taşınmaz satış/devir harcı alıcı payı."
    } satisfies RegulatedValue<number>,
    sellerRate: {
      value: 0.02,
      source: "492 sayılı Harçlar Kanunu, (4) sayılı tarife, I/20-a",
      url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.492.pdf",
      lastUpdated: "2026-11-09",
      note: "Taşınmaz satış/devir harcı satıcı payı."
    } satisfies RegulatedValue<number>
  },
  gold: {
    productWeights: { gram: null, quarter: null, half: null, full: null } as Record<"gram" | "quarter" | "half" | "full", number | null>,
    source: "Darphane ve Damga Matbaası Genel Müdürlüğü – ürün tanım ve ağırlıkları",
    url: "https://www.darphane.gov.tr/",
    lastUpdated: "2026-11-09",
    note: "TODO: Gram, çeyrek, yarım ve tam ürünlerin kullanılacak net altın ağırlıkları resmî ürün kaynağından doğrulanmalı."
  },
  sources: { revenueAdministration, officialGazette }
};

export function getRegulatedToolTodo(toolId: string): string[] {
  const config = regulatedConfig2026;
  switch (toolId) {
    case "kidem-tazminati-hesaplama":
      return config.severance.ceiling.value === null ? [config.severance.ceiling.note] : [];
    case "kira-artis-orani-hesaplama":
      return config.rentIncrease.latestCpi12MonthAverage.value === null ? [config.rentIncrease.latestCpi12MonthAverage.note] : [];
    case "konut-kredisi-hesaplama":
    case "ihtiyac-kredisi-hesaplama":
    case "tasit-kredisi-hesaplama": {
      const kind = toolId === "konut-kredisi-hesaplama" ? "konut" : toolId === "ihtiyac-kredisi-hesaplama" ? "ihtiyac" : "tasit";
      const rates = config.loans[kind];
      return rates.kkdf === null || rates.bsmv === null ? [config.loans.note] : [];
    }
    case "mevduat-faiz-hesaplama":
      return config.deposit.withholdingByMaturity.length === 0 ? [config.deposit.note] : [];
    case "gelir-vergisi-dilimi-hesaplama":
      return config.incomeTax.salaryBrackets === null ? [config.incomeTax.note] : [];
    case "damga-vergisi-hesaplama":
      return Object.values(config.stampDuty.ratesByDocument).some((rate) => rate === null)
        || Object.values(config.stampDuty.ceilingsByDocument).some((ceiling) => ceiling === null)
        ? [config.stampDuty.note]
        : [];
    case "altin-hesaplama":
      return Object.values(config.gold.productWeights).some((weight) => weight === null) ? [config.gold.note] : [];
    default:
      return [];
  }
}
