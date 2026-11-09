export type OfficialSource = {
  name: string;
  url: string;
  reference: string;
};

export type PayrollYearConfig = {
  year: number;
  lastUpdated: string;
  minimumWage: {
    grossMonthly: number;
    source: OfficialSource;
  };
  socialSecurity: {
    baseFloor: number;
    baseCeiling: number | null;
    employeeRate: number;
    employerRate: number;
    employeeUnemploymentRate: number;
    employerUnemploymentRate: number;
    source: OfficialSource;
  };
  incomeTax: {
    brackets: { upTo: number | null; rate: number }[] | null;
    minimumWageExemptionMethodVerified: boolean;
    disabilityMonthlyDeduction: { "1": number; "2": number; "3": number };
    source: OfficialSource;
    disabilitySource: OfficialSource;
  };
  stampTax: {
    rate: number;
    minimumWageExemptionMethodVerified: boolean;
    source: OfficialSource;
  };
};

export type CompletePayrollYearConfig = PayrollYearConfig & {
  socialSecurity: PayrollYearConfig["socialSecurity"] & { baseCeiling: number };
  incomeTax: PayrollYearConfig["incomeTax"] & {
    brackets: { upTo: number | null; rate: number }[];
    minimumWageExemptionMethodVerified: true;
  };
};

export const payrollConfigs: Partial<Record<number, PayrollYearConfig>> = {
  2026: {
    year: 2026,
    lastUpdated: "2026-11-05",
    minimumWage: {
      grossMonthly: 33030,
      source: {
        name: "Çalışma ve Sosyal Güvenlik Bakanlığı – Asgari ücretin net hesabı ve işverene maliyeti",
        url: "https://www.csgb.gov.tr/poco-pages/asgari-ucret/",
        reference: "2026 dönemi: 01.01.2026–31.12.2026; brüt asgari ücret 33.030 TL."
      }
    },
    socialSecurity: {
      baseFloor: 33030,
      baseCeiling: null,
      employeeRate: 0.14,
      employerRate: 0.2175,
      employeeUnemploymentRate: 0.01,
      employerUnemploymentRate: 0.02,
      source: {
        name: "Çalışma ve Sosyal Güvenlik Bakanlığı – Asgari ücretin net hesabı ve işverene maliyeti",
        url: "https://www.csgb.gov.tr/poco-pages/asgari-ucret/",
        reference: "2026 tablosu: işçi SGK %14, işçi işsizlik %1, indirimsiz işveren SGK %21,75, işveren işsizlik %2. 2026 PEK üst sınırı TODO: resmî tutar ve çarpan doğrulanmalı."
      }
    },
    incomeTax: {
      brackets: null,
      minimumWageExemptionMethodVerified: false,
      disabilityMonthlyDeduction: { "1": 12000, "2": 7000, "3": 3000 },
      source: {
        name: "Gelir İdaresi Başkanlığı – Gelir Vergisi Tarifesi 2026",
        url: "https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv/yardim-kaynaklar/yararli-bilgiler/gelir-vergisi-tarifeleri/gelir-vergisi-tarifesi-2026.pdf",
        reference: "2026 tarifesi yayımlanmış resmî belgedir; ücret gelirleri dilim sınırları/oranları TODO: PDF içindeki değerler doğrulanmalı."
      },
      disabilitySource: {
        name: "Gelir İdaresi Başkanlığı – Engellilik indirimi tutarları",
        url: "https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv/yardim-kaynaklar/yararli-bilgiler/engellilik-indirimi-tutari.pdf",
        reference: "332 Seri No.lu Gelir Vergisi Genel Tebliği (31.12.2025): aylık 1. derece 12.000 TL, 2. derece 7.000 TL, 3. derece 3.000 TL."
      }
    },
    stampTax: {
      rate: 0.00759,
      minimumWageExemptionMethodVerified: false,
      source: {
        name: "488 sayılı Damga Vergisi Kanunu",
        url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.488.pdf",
        reference: "(1) sayılı tablo, IV/1-b: ücret kâğıtları için binde 7,59; asgari ücret istisnasının uygulama hesabı TODO: GVK 23/18 yöntemi resmî kaynaktan doğrulanmalı."
      }
    }
  }
};

export function getPayrollConfigTodo(config: PayrollYearConfig): string[] {
  const missing: string[] = [];
  if (config.socialSecurity.baseCeiling === null) missing.push("SGK prime esas kazanç üst sınırı");
  if (!config.incomeTax.brackets) missing.push("gelir vergisi ücret tarifesi dilim ve oranları");
  if (!config.incomeTax.minimumWageExemptionMethodVerified) missing.push("asgari ücret gelir vergisi istisnası hesap yöntemi");
  if (!config.stampTax.minimumWageExemptionMethodVerified) missing.push("asgari ücret damga vergisi istisnası hesap yöntemi");
  return missing;
}

export function isCompletePayrollConfig(config: PayrollYearConfig): config is CompletePayrollYearConfig {
  return getPayrollConfigTodo(config).length === 0;
}
