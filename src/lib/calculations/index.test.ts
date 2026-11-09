import { describe, expect, it } from "vitest";
import { calculate, formatTurkishNumber, parseDate, parseTurkishNumber } from "./index";
import { calculatePayroll } from "./payroll";
import type { CompletePayrollYearConfig } from "../../data/payroll-config";
import { tools } from "../../data/tools";
import { vatQuickRates } from "../../data/calculation-config";

const calculatorSamples = {
  "yuzde-hesaplama": { amount: "20", percent: "15" },
  "maas-zam-artis-hesaplama": { increaseType: "percent", salary: "1000", percent: "10" },
  "brut-net-maas-hesaplama": { direction: "gross-to-net", period: "monthly", amount: "50000", month: "1", disabilityDegree: "none" },
  "indirim-hesaplama": { amount: "100", percent: "10" },
  "kdv-hesaplama": { amount: "100", rate: "20" },
  "kar-zarar-hesaplama": { cost: "80", sale: "100" },
  "yas-hesaplama": { birthDate: "2000-01-01" },
  "iki-tarih-arasi-gun-hesaplama": { startDate: "2025-01-01", endDate: "2025-01-02" },
  "tarihe-gun-ekleme": { date: "2025-01-01", days: "1" },
  "tarihten-gun-cikarma": { date: "2025-01-02", days: "1" },
  "dogum-gunune-kalan-sure": { birthDate: "2000-01-01" },
  "gebelik-haftasi-hesaplama": { lastPeriod: "2024-01-01" },
  "not-ortalamasi-gano-hesaplama": { gradeSystem: "4", gradeEntry: "letter", courseName1: "A", grade1: "AA", credit1: "3" },
  "sinav-puani-hesaplama": { correct: "7", wrong: "1", total: "10", wrongPenalty: "4" },
  "basari-yuzdesi-hesaplama": { achieved: "5", total: "10" },
  "harf-notu-hesaplama": { grade: "70" },
  "metrekare-hesaplama": { shape: "rectangle", width: "2", length: "3" },
  "boy-kilo-orani-hesaplama": { height: "170", weight: "65" },
  "litre-donusumu": { amount: "1", conversion: "ml-to-l" },
  "kilogram-donusumu": { amount: "1", conversion: "kg-to-g" },
  "saat-dakika-donusturme": { amount: "1", conversion: "hours-to-minutes" },
  "birim-donusturme": { category: "length", amount: "2", fromUnit: "km", toUnit: "m" },
  "dortluk-not-sistemi-hesaplama": { courseName1: "A", grade1: "AA", credit1: "1" },
  "agirlikli-not-ortalamasi-hesaplama": {
    assessmentName1: "Vize", score1: "70", weight1: "40", assessmentName2: "Final", score2: "80", weight2: "50", assessmentName3: "Ödev", score3: "90", weight3: "10"
  },
  "finalde-gerekli-not-hesaplama": { currentGrade: "60", targetGrade: "70", finalWeight: "60" },
  "kredi-taksit-hesaplama": { principal: "1000", monthlyRate: "0", months: "10" },
  "bilesik-faiz-hesaplama": { principal: "1000", annualRate: "0", years: "1", periods: "12" },
  "basit-faiz-hesaplama": { principal: "1000", annualRate: "10", days: "30" },
  "doviz-hesaplama": { amount: "100", currency: "JPY", exchangeRate: "20", exchangeUnit: "100" },
  "yakit-tuketimi-hesaplama": { distance: "100", fuel: "7", price: "40" },
  "elektrik-faturasi-hesaplama": { mode: "consumption", usage: "100", unitPrice: "2" },
  "is-gunu-hesaplama": { startDate: "2025-01-06", endDate: "2025-01-07" },
  "pazaryeri-net-kar-hesaplama": { salePrice: "1000", productCost: "500", discountPercent: "0", commissionRate: "10", commissionBasis: "discounted", shipping: "50", extraExpenses: "20" },
  "birim-fiyat-karsilastirma": { productName1: "A", price1: "60", quantity1: "500", unit1: "g", productName2: "B", price2: "110", quantity2: "1", unit2: "kg" },
  "aylik-katkili-birikim-hesaplama": { principal: "1000", contribution: "100", annualRate: "5", months: "12", timing: "end" },
  "yolculuk-maliyeti-hesaplama": { distance: "100", consumption: "7", fuelPrice: "40", journey: "one-way", otherCosts: "0", people: "1" },
  "desi-hacim-hesaplama": { width: "30", length: "20", height: "10", sizeUnit: "cm", divisor: "3000" }
};

const payrollTestConfig: CompletePayrollYearConfig = {
  year: 2099,
  lastUpdated: "2099-01-01",
  minimumWage: {
    grossMonthly: 10000,
    source: { name: "Test", url: "https://example.test", reference: "Yalnızca test verisi." }
  },
  socialSecurity: {
    baseFloor: 10000,
    baseCeiling: 1000000,
    employeeRate: 0.14,
    employerRate: 0.2175,
    employeeUnemploymentRate: 0.01,
    employerUnemploymentRate: 0.02,
    source: { name: "Test", url: "https://example.test", reference: "Yalnızca test verisi." }
  },
  incomeTax: {
    brackets: [
      { upTo: 100000, rate: 0.15 },
      { upTo: 400000, rate: 0.2 },
      { upTo: 1000000, rate: 0.27 },
      { upTo: null, rate: 0.35 }
    ],
    minimumWageExemptionMethodVerified: true,
    disabilityMonthlyDeduction: { "1": 3000, "2": 2000, "3": 1000 },
    source: { name: "Test", url: "https://example.test", reference: "Yalnızca test verisi." },
    disabilitySource: { name: "Test", url: "https://example.test", reference: "Yalnızca test verisi." }
  },
  stampTax: {
    rate: 0.00759,
    source: { name: "Test", url: "https://example.test", reference: "Yalnızca test verisi." }
  }
};

function calculateTestPayroll(overrides: Partial<Parameters<typeof calculatePayroll>[0]> = {}) {
  return calculatePayroll({
    amount: 50000,
    direction: "gross-to-net",
    period: "monthly",
    month: 1,
    disabilityDegree: "none",
    ...overrides
  }, payrollTestConfig);
}

describe("Turkish number helpers", () => {
  it("parses comma decimals and grouped thousands", () => {
    expect(parseTurkishNumber("1.234,56")).toBe(1234.56);
    expect(parseTurkishNumber("1.234")).toBe(1234);
    expect(parseTurkishNumber("12,5")).toBe(12.5);
    expect(formatTurkishNumber(1234.5)).toBe("1.234,5");
  });

  it("rejects empty and malformed values", () => {
    expect(Number.isNaN(parseTurkishNumber(""))).toBe(true);
    expect(Number.isNaN(parseTurkishNumber("1,2,3"))).toBe(true);
    expect(Number.isNaN(parseTurkishNumber("12.34,56"))).toBe(true);
    expect(Number.isNaN(parseTurkishNumber("Infinity"))).toBe(true);
  });
});

describe("financial calculators", () => {
  it("calculates percentage and discount with decimal values", () => {
    expect(calculate("yuzde-hesaplama", { amount: "1.200,50", percent: "12,5" }).value).toBeCloseTo(150.0625);
    expect(calculate("yuzde-hesaplama", { operation: "difference", start: "40", end: "60" }).value).toBe(40);
    expect(() => calculate("yuzde-hesaplama", { operation: "difference", start: "0", end: "0" })).toThrow(/sıfır/);
    expect(calculate("indirim-hesaplama", { amount: "1000", percent: "25" }).value).toBe(750);
  });

  it("calculates salary, VAT, and loss", () => {
    expect(calculate("maas-zam-artis-hesaplama", { increaseType: "percent", salary: "30000", percent: "20" }).value).toBe(36000);
    expect(calculate("maas-zam-artis-hesaplama", { increaseType: "fixed", salary: "30000", increase: "5000" }).value).toBe(35000);
    expect(calculate("kdv-hesaplama", { amount: "1000", rate: "20" }).value).toBe(1200);
    expect(calculate("kdv-hesaplama", { amount: "1200", rate: "20", direction: "included-to-excluded" }).value).toBe(1000);
    expect(calculate("kdv-hesaplama", { amount: "1200", rate: "0", direction: "included-to-excluded" }).value).toBe(1200);
    expect(() => calculate("kdv-hesaplama", { amount: "100", rate: "20", direction: "unexpected" })).toThrow(/yönü/);
    expect(calculate("kar-zarar-hesaplama", { cost: "100", sale: "80" }).value).toBe(20);
    expect(calculate("kar-zarar-hesaplama", { cost: "0", sale: "80" }).details?.[0]).toMatch(/hesaplanamaz/);
    expect(calculate("maas-zam-artis-hesaplama", { increaseType: "fixed", salary: "0", increase: "500" }).details?.[1]).toMatch(/hesaplanamaz/);
  });

  it("calculates a 12-month gross-to-net payroll with separate statutory deductions", () => {
    const payroll = calculateTestPayroll({ amount: 100000, month: 12 });
    expect(payroll.label).toBe("Tahmini net maaş");
    expect(payroll.value).toBeGreaterThan(0);
    expect(payroll.table?.rows).toHaveLength(12);
    expect(payroll.table?.rows[11][0]).toBe("Aralık");
    expect(payroll.details?.some((detail) => detail.includes("SGK işçi payı"))).toBe(true);
    expect(payroll.details?.some((detail) => detail.includes("işveren maliyeti"))).toBe(true);
  });

  it("applies cumulative income-tax bands so a later month can have a lower net", () => {
    const january = calculateTestPayroll({ amount: 100000, month: 1 });
    const december = calculateTestPayroll({ amount: 100000, month: 12 });
    expect(december.value).toBeLessThan(january.value);
  });

  it("distributes annual input over twelve months", () => {
    const monthly = calculateTestPayroll({ amount: 100000, month: 5 });
    const annual = calculateTestPayroll({ amount: 1200000, period: "annual", month: 5 });
    expect(annual.value).toBe(monthly.value);
  });

  it("solves a gross amount for a target net throughout the year", () => {
    const payroll = calculateTestPayroll({ direction: "net-to-gross", amount: 30000, month: 8 });
    expect(payroll.label).toBe("Tahmini brüt maaş");
    for (const row of payroll.table!.rows) expect(Number(row[9].replace(/\./g, "").replace(",", "."))).toBeCloseTo(30000, 0);
  });

  it("applies the selected disability deduction and validates payroll inputs", () => {
    const withoutDeduction = calculateTestPayroll({ amount: 60000, month: 1 });
    const withDeduction = calculateTestPayroll({ amount: 60000, month: 1, disabilityDegree: "1" });
    expect(withDeduction.value).toBeGreaterThan(withoutDeduction.value);
    expect(() => calculateTestPayroll({ amount: -1 })).toThrow(/sıfırdan büyük/);
    expect(() => calculateTestPayroll({ month: 13 })).toThrow(/1 ile 12/);
  });

  it("supports zero values and rejects invalid amounts", () => {
    expect(calculate("yuzde-hesaplama", { amount: "0", percent: "15" }).value).toBe(0);
    expect(calculate("yuzde-hesaplama", { amount: "999999999999999", percent: "100" }).value).toBe(999999999999999);
    expect(() => calculate("indirim-hesaplama", { amount: "10", percent: "101" })).toThrow();
    expect(() => calculate("maas-zam-artis-hesaplama", { increaseType: "fixed", salary: "-1", increase: "5" })).toThrow();
    expect(() => calculate("yuzde-hesaplama", { amount: "", percent: "5" })).toThrow(/doldurun/);
    expect(() => calculate("kdv-hesaplama", { amount: "1e999", rate: "20" })).toThrow();
  });
});

describe("date calculators", () => {
  it("validates calendar dates and handles leap days", () => {
    expect(() => parseDate("2023-02-29")).toThrow(/geçerli/);
    expect(parseDate("2024-02-29").getUTCDate()).toBe(29);
    expect(parseDate("0099-01-01").getUTCFullYear()).toBe(99);
    expect(calculate("tarihe-gun-ekleme", { date: "2024-02-28", days: "1" }).displayValue).toBe("29.02.2024");
    expect(calculate("tarihten-gun-cikarma", { date: "2024-03-01", days: "1" }).displayValue).toBe("29.02.2024");
  });

  it("counts completed birthdays and days between dates", () => {
    expect(calculate("yas-hesaplama", { birthDate: "2000-12-31" }, new Date(2025, 0, 1, 12)).value).toBe(24);
    expect(calculate("yas-hesaplama", { birthDate: "2025-01-01" }, new Date(2025, 0, 1, 12)).value).toBe(0);
    expect(calculate("yas-hesaplama", { birthDate: "2000-02-29" }, new Date(2025, 1, 28, 12)).value).toBe(25);
    expect(calculate("iki-tarih-arasi-gun-hesaplama", { startDate: "2024-02-28", endDate: "2024-03-01" }).value).toBe(2);
    expect(() => calculate("yas-hesaplama", { birthDate: "2030-01-01" }, new Date("2025-01-01"))).toThrow(/gelecekte/);
    expect(() => calculate("dogum-gunune-kalan-sure", { birthDate: "2030-01-01" }, new Date("2025-01-01"))).toThrow(/gelecekte/);
    expect(calculate("dogum-gunune-kalan-sure", { birthDate: "2000-01-01" }, new Date("2025-01-01")).value).toBe(0);
  });

  it("rejects non-integer date offsets", () => {
    expect(() => calculate("tarihe-gun-ekleme", { date: "2024-01-01", days: "1,5" })).toThrow(/tam sayı/);
    expect(() => calculate("iki-tarih-arasi-gun-hesaplama", { startDate: "2024-02-30", endDate: "2024-03-01" })).toThrow(/geçerli/);
  });
});

describe("education and daily-life calculators", () => {
  it("calculates score, averages, and percentages", () => {
    expect(calculate("sinav-puani-hesaplama", { correct: "30", wrong: "4", total: "40", wrongPenalty: "4" }).details?.[0]).toContain("72,5");
    expect(calculate("not-ortalamasi-gano-hesaplama", {
      gradeSystem: "4", gradeEntry: "letter", grade1: "AA", credit1: "3", grade2: "BB", credit2: "1"
    }).value).toBe(3.75);
    expect(calculate("not-ortalamasi-gano-hesaplama", {
      gradeSystem: "100", grade1: "80", credit1: "3", grade2: "70", credit2: "1"
    }).value).toBe(77.5);
    expect(calculate("not-ortalamasi-gano-hesaplama", {
      gradeSystem: "4", gradeEntry: "score", grade1: "3,5", credit1: "2"
    }).value).toBe(3.5);
    expect(calculate("basari-yuzdesi-hesaplama", { achieved: "0", total: "10" }).value).toBe(0);
    expect(calculate("harf-notu-hesaplama", { grade: "90" }).displayValue).toBe("AA");
  });

  it("validates grade ranges and exam totals", () => {
    expect(() => calculate("not-ortalamasi-gano-hesaplama", { gradeSystem: "100", grade1: "101", credit1: "1" })).toThrow();
    expect(() => calculate("sinav-puani-hesaplama", { correct: "8", wrong: "4", total: "10", wrongPenalty: "4" })).toThrow();
    expect(() => calculate("basari-yuzdesi-hesaplama", { achieved: "11", total: "10" })).toThrow();
  });

  it("converts units and calculates area and BMI", () => {
    expect(calculate("metrekare-hesaplama", { width: "4", length: "5" }).value).toBe(20);
    expect(calculate("boy-kilo-orani-hesaplama", { height: "170", weight: "65" }).value).toBeCloseTo(22.4913, 3);
    expect(calculate("litre-donusumu", { amount: "2,5", conversion: "l-to-ml" }).value).toBe(2500);
    expect(calculate("kilogram-donusumu", { amount: "1,5", conversion: "kg-to-g" }).value).toBe(1500);
    expect(calculate("saat-dakika-donusturme", { amount: "1,5", conversion: "hours-to-minutes" }).value).toBe(90);
    expect(calculate("birim-donusturme", { category: "length", amount: "2,5", fromUnit: "km", toUnit: "m" }).value).toBe(2500);
    expect(calculate("birim-donusturme", { category: "temperature", amount: "20", fromUnit: "c", toUnit: "f" }).value).toBe(68);
    expect(calculate("birim-donusturme", { category: "time", amount: "2", fromUnit: "hour", toUnit: "min" }).value).toBe(120);
    expect(() => calculate("birim-donusturme", { category: "length", amount: "2", fromUnit: "km", toUnit: "kg" })).toThrow(/uygun/);
    expect(vatQuickRates).toEqual([1, 10, 20]);
    expect(calculate("metrekare-hesaplama", { shape: "square", side: "4" }).value).toBe(16);
    expect(calculate("metrekare-hesaplama", { shape: "triangle", base: "3", height: "2" }).value).toBe(3);
    expect(calculate("metrekare-hesaplama", { shape: "circle", radius: "2" }).value).toBeCloseTo(Math.PI * 4);
    expect(calculate("metrekare-hesaplama", { shape: "trapezoid", base: "4", upperBase: "2", height: "3" }).value).toBe(9);
    expect(() => calculate("metrekare-hesaplama", { shape: "square", side: "-4" })).toThrow(/sıfırdan büyük/);
    expect(() => calculate("boy-kilo-orani-hesaplama", { height: "0", weight: "65" })).toThrow();
  });

  it("calculates a credit-weighted four-point GPA", () => {
    const gpa = calculate("dortluk-not-sistemi-hesaplama", {
      grade1: "AA", credit1: "3",
      grade2: "BB", credit2: "2"
    });
    expect(gpa.value).toBe(3.6);
    expect(gpa.unit).toBe(" / 4,00");
    expect(calculate("dortluk-not-sistemi-hesaplama", { grade1: "FF", credit1: "4" }).value).toBe(0);
    expect(() => calculate("dortluk-not-sistemi-hesaplama", {})).toThrow(/En az bir ders/);
    expect(() => calculate("dortluk-not-sistemi-hesaplama", { grade1: "AA", credit1: "" })).toThrow(/birlikte/);
    expect(() => calculate("dortluk-not-sistemi-hesaplama", { grade1: "AA", credit1: "0" })).toThrow(/kredi/);
    expect(() => calculate("dortluk-not-sistemi-hesaplama", { grade1: "__proto__", credit1: "1" })).toThrow(/harf notu/);
  });

  it("calculates weighted grades and the final exam grade needed", () => {
    expect(calculate("agirlikli-not-ortalamasi-hesaplama", {
      score1: "70", weight1: "40", score2: "80", weight2: "50", score3: "100", weight3: "10"
    }).value).toBe(78);
    expect(() => calculate("agirlikli-not-ortalamasi-hesaplama", {
      score1: "70", weight1: "40", score2: "80", weight2: "40", score3: "100", weight3: "10"
    })).toThrow(/%100/);
    expect(calculate("finalde-gerekli-not-hesaplama", {
      currentGrade: "60", targetGrade: "70", finalWeight: "60"
    }).value).toBeCloseTo(76.6667, 3);
    expect(calculate("finalde-gerekli-not-hesaplama", {
      currentGrade: "100", targetGrade: "50", finalWeight: "50"
    }).value).toBe(0);
    expect(calculate("finalde-gerekli-not-hesaplama", {
      currentGrade: "0", targetGrade: "100", finalWeight: "50"
    }).displayValue).toBe("Mümkün değil");
  });

  it("calculates loan and compound interest with a zero-interest case", () => {
    expect(calculate("kredi-taksit-hesaplama", { principal: "1200", monthlyRate: "0", months: "12" }).value).toBe(100);
    expect(calculate("kredi-taksit-hesaplama", { principal: "100000", monthlyRate: "2", months: "12" }).value).toBeCloseTo(9455.96, 2);
    expect(() => calculate("kredi-taksit-hesaplama", { principal: "1000", monthlyRate: "2", months: "1,5" })).toThrow();
    expect(calculate("bilesik-faiz-hesaplama", { principal: "1000", annualRate: "10", years: "1", periods: "1" }).value).toBe(1100);
    expect(calculate("bilesik-faiz-hesaplama", { principal: "1000", annualRate: "0", years: "10", periods: "12" }).value).toBe(1000);
  });

  it("estimates fuel, electricity and business-day calculations", () => {
    expect(calculate("yakit-tuketimi-hesaplama", { distance: "500", fuel: "35", price: "45" }).value).toBeCloseTo(7);
    expect(calculate("yakit-tuketimi-hesaplama", { distance: "500", fuel: "35", price: "45" }).details?.[0]).toContain("1.575");
    expect(calculate("elektrik-faturasi-hesaplama", { usage: "250", unitPrice: "2,5" }).value).toBe(625);
    expect(calculate("is-gunu-hesaplama", { startDate: "2024-01-08", endDate: "2024-01-15" }).value).toBe(5);
    expect(() => calculate("is-gunu-hesaplama", { startDate: "2024-01-15", endDate: "2024-01-08" })).toThrow(/sonra olamaz/);
    expect(calculate("is-gunu-hesaplama", { startDate: "2024-01-06", endDate: "2024-01-07" }).value).toBe(0);
    expect(calculate("is-gunu-hesaplama", {
      startDate: "2024-01-08", endDate: "2024-01-15", includeStart: "yes", includeEnd: "no", holidays: "2024-01-09"
    }).value).toBe(4);
  });

  it("supports percentage operations and dynamic calculator boundaries", () => {
    expect(calculate("yuzde-hesaplama", { operation: "share", amount: "1", base: "4" }).value).toBe(25);
    expect(calculate("yuzde-hesaplama", { operation: "change", start: "100", end: "0" }).value).toBe(-100);
    expect(calculate("yuzde-hesaplama", { operation: "add", amount: "200", percent: "15" }).value).toBe(230);
    expect(calculate("yuzde-hesaplama", { operation: "subtract", amount: "200", percent: "15" }).value).toBe(170);
    expect(() => calculate("yuzde-hesaplama", { operation: "change", start: "0", end: "100" })).toThrow(/sıfır/);
    expect(() => calculate("yuzde-hesaplama", { operation: "share", amount: "1", base: "0" })).toThrow(/sıfır/);
    expect(calculate("birim-fiyat-karsilastirma", {
      _rowCount: "3", productName2: "A", price2: "60", quantity2: "500", unit2: "g",
      productName3: "B", price3: "110", quantity3: "1", unit3: "kg"
    }).value).toBeCloseTo(0.11);
    expect(() => calculate("birim-fiyat-karsilastirma", {
      productName1: "A", price1: "60", quantity1: "500", unit1: "g",
      productName2: "B", price2: "110", quantity2: "1", unit2: "l"
    })).toThrow(/aynı türde/);
    const savings = calculate("aylik-katkili-birikim-hesaplama", {
      principal: "0", contribution: "100", annualRate: "0", months: "1", target: "200"
    });
    expect(savings.details?.[1]).toContain("2 ay içinde");
    expect(() => calculate("kredi-taksit-hesaplama", {
      principal: "1000", monthlyRate: "0", months: "1201"
    })).toThrow(/1–1.200/);
  });

  it("calculates simple interest, exchange conversion, and pregnancy week estimates", () => {
    expect(calculate("basit-faiz-hesaplama", { principal: "10000", annualRate: "10", days: "180" }).value).toBeCloseTo(493.15068, 4);
    expect(calculate("basit-faiz-hesaplama", { principal: "10000", annualRate: "10", days: "0" }).value).toBe(0);
    expect(() => calculate("basit-faiz-hesaplama", { principal: "10000", annualRate: "10", days: "1,5" })).toThrow();
    expect(calculate("doviz-hesaplama", {
      amount: "100", currency: "JPY", exchangeRate: "22,5", exchangeUnit: "100", rateDate: "02.11.2026"
    }).value).toBe(22.5);
    expect(calculate("doviz-hesaplama", {
      amount: "100", currency: "EUR", exchangeRate: "1.2340", exchangeUnit: "1"
    }).value).toBe(123.4);
    expect(() => calculate("doviz-hesaplama", {
      amount: "100", currency: "TRY", exchangeRate: "22,5", exchangeUnit: "1"
    })).toThrow(/döviz türü/);
    const pregnancy = calculate("gebelik-haftasi-hesaplama", { lastPeriod: "2024-01-01" }, new Date("2024-03-04T12:00:00Z"));
    expect(pregnancy.value).toBe(9);
    expect(pregnancy.details?.[1]).toContain("07.10.2024");
    expect(pregnancy.details?.[2]).toContain("sağlık uzmanının değerlendirmesi");
    expect(() => calculate("gebelik-haftasi-hesaplama", { lastPeriod: "2025-01-02" }, new Date("2025-01-01"))).toThrow(/gelecekte/);
  });

  it("has a working calculation for every catalog entry and rejects inherited object keys", () => {
    expect(Object.keys(calculatorSamples).sort()).toEqual(tools.map((tool) => tool.id).sort());
    for (const tool of tools) {
      if (tool.id === "brut-net-maas-hesaplama") {
        expect(() => calculate(tool.id, calculatorSamples[tool.id as keyof typeof calculatorSamples], new Date("2025-01-01T00:00:00Z"))).toThrow(/doğrulanmamış 2026 bordro parametreleri/);
        continue;
      }
      const result = calculate(tool.id, calculatorSamples[tool.id as keyof typeof calculatorSamples], new Date("2025-01-01T00:00:00Z"));
      expect(Number.isFinite(result.value), tool.id).toBe(true);
    }
    expect(() => calculate("toString", {})).toThrow(/bulunamadı/);
  });
});
