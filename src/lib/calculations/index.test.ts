import { describe, expect, it } from "vitest";
import { calculate, formatTurkishNumber, parseDate, parseTurkishNumber } from "./index";

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
    expect(calculate("indirim-hesaplama", { amount: "1000", percent: "25" }).value).toBe(750);
  });

  it("calculates salary, VAT, and loss", () => {
    expect(calculate("maas-zam-hesaplama", { salary: "30000", percent: "20" }).value).toBe(36000);
    expect(calculate("kdv-hesaplama", { amount: "1000", rate: "20" }).value).toBe(1200);
    expect(calculate("kar-zarar-hesaplama", { cost: "100", sale: "80" }).value).toBe(20);
    expect(calculate("kar-zarar-hesaplama", { cost: "0", sale: "80" }).details?.[0]).toMatch(/hesaplanamaz/);
    expect(calculate("maas-artis-hesaplama", { salary: "0", increase: "500" }).details?.[0]).toMatch(/hesaplanamaz/);
  });

  it("supports zero values and rejects invalid amounts", () => {
    expect(calculate("yuzde-hesaplama", { amount: "0", percent: "15" }).value).toBe(0);
    expect(calculate("yuzde-hesaplama", { amount: "999999999999999", percent: "100" }).value).toBe(999999999999999);
    expect(() => calculate("indirim-hesaplama", { amount: "10", percent: "101" })).toThrow();
    expect(() => calculate("maas-artis-hesaplama", { salary: "-1", increase: "5" })).toThrow();
    expect(() => calculate("yuzde-hesaplama", { amount: "", percent: "5" })).toThrow(/doldurun/);
    expect(() => calculate("kdv-hesaplama", { amount: "1e999", rate: "20" })).toThrow();
  });
});

describe("date calculators", () => {
  it("validates calendar dates and handles leap days", () => {
    expect(() => parseDate("2023-02-29")).toThrow(/geçerli/);
    expect(parseDate("2024-02-29").getUTCDate()).toBe(29);
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
  });

  it("rejects non-integer date offsets", () => {
    expect(() => calculate("tarihe-gun-ekleme", { date: "2024-01-01", days: "1,5" })).toThrow(/tam sayı/);
    expect(() => calculate("iki-tarih-arasi-gun-hesaplama", { startDate: "2024-02-30", endDate: "2024-03-01" })).toThrow(/geçerli/);
  });
});

describe("education and daily-life calculators", () => {
  it("calculates score, averages, and percentages", () => {
    expect(calculate("sinav-puani-hesaplama", { correct: "30", wrong: "4", total: "40" }).value).toBe(72.5);
    expect(calculate("not-ortalamasi-hesaplama", { grade1: "70", grade2: "90" }).value).toBe(80);
    expect(calculate("basari-yuzdesi-hesaplama", { achieved: "0", total: "10" }).value).toBe(0);
    expect(calculate("harf-notu-hesaplama", { grade: "90" }).displayValue).toBe("AA");
  });

  it("validates grade ranges and exam totals", () => {
    expect(() => calculate("not-ortalamasi-hesaplama", { grade1: "101", grade2: "90" })).toThrow();
    expect(() => calculate("sinav-puani-hesaplama", { correct: "8", wrong: "4", total: "10" })).toThrow();
    expect(() => calculate("basari-yuzdesi-hesaplama", { achieved: "11", total: "10" })).toThrow();
  });

  it("converts units and calculates area and BMI", () => {
    expect(calculate("metrekare-hesaplama", { width: "4", length: "5" }).value).toBe(20);
    expect(calculate("boy-kilo-orani-hesaplama", { height: "170", weight: "65" }).value).toBeCloseTo(22.4913, 3);
    expect(calculate("litre-donusumu", { amount: "2,5", conversion: "l-to-ml" }).value).toBe(2500);
    expect(calculate("kilogram-donusumu", { amount: "1,5", conversion: "kg-to-g" }).value).toBe(1500);
    expect(calculate("saat-dakika-donusturme", { amount: "1,5", conversion: "hours-to-minutes" }).value).toBe(90);
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
    expect(calculate("is-gunu-hesaplama", { startDate: "2024-01-15", endDate: "2024-01-08" }).value).toBe(5);
    expect(calculate("is-gunu-hesaplama", { startDate: "2024-01-06", endDate: "2024-01-07" }).value).toBe(0);
  });
});
