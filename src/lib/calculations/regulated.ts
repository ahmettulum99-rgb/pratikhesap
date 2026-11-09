import { getRegulatedToolTodo, regulatedConfig2026 } from "../../data/regulated-config";
import { formatTurkishNumber, parseDate, requiredNumber, result, type CalculatorResult, type CalculatorValues } from "./index";

function todoError(toolId: string): never {
  const missing = getRegulatedToolTodo(toolId);
  if (missing.length) throw new Error(`Resmî parametre doğrulanana kadar bu hesaplama kullanılamıyor: ${missing.join(" ")}`);
  throw new Error("Bu araç için hesaplama yapılandırması bulunamadı.");
}

function requiredDate(values: CalculatorValues, key: string, label: string): Date {
  const raw = values[key]?.trim();
  if (!raw) throw new Error(`${label} alanını doldurun.`);
  return parseDate(raw, label);
}

function completeMonths(start: Date, end: Date): number {
  let months = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth();
  if (months < 0) throw new Error("Ayrılış tarihi işe giriş tarihinden önce olamaz.");
  if (anniversaryTime(start, months) > end.getTime()) months -= 1;
  return months;
}

function anniversaryTime(start: Date, offsetMonths: number): number {
  const year = start.getUTCFullYear() + Math.floor((start.getUTCMonth() + offsetMonths) / 12);
  const month = (start.getUTCMonth() + offsetMonths) % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Date.UTC(year, month, Math.min(start.getUTCDate(), lastDay));
}

export function calculateSeverance(values: CalculatorValues): CalculatorResult {
  const config = regulatedConfig2026.severance.ceiling;
  if (config.value === null) todoError("kidem-tazminati-hesaplama");
  const salary = requiredNumber(values, "monthlyGross", "Aylık brüt ücret");
  const benefits = requiredNumber(values, "regularBenefits", "Düzenli aylık ücret ekleri");
  if (salary <= 0 || benefits < 0) throw new Error("Aylık brüt ücret sıfırdan büyük, düzenli ekler sıfır veya daha büyük olmalıdır.");
  const start = requiredDate(values, "startDate", "İşe giriş tarihi");
  const end = requiredDate(values, "endDate", "İşten ayrılış tarihi");
  if (end <= start) throw new Error("İşten ayrılış tarihi işe giriş tarihinden sonra olmalıdır.");
  const serviceDays = (end.getTime() - start.getTime()) / 86_400_000;
  const completedMonths = completeMonths(start, end);
  const completedYears = Math.floor(completedMonths / 12);
  const yearAnniversary = new Date(anniversaryTime(start, completedYears * 12));
  const remainingDays = (end.getTime() - yearAnniversary.getTime()) / 86_400_000;
  const serviceYears = completedYears + remainingDays / 365;
  const monthlyBase = Math.min(salary + benefits, config.value);
  const amount = monthlyBase * serviceYears;
  return result("Tahmini brüt kıdem tazminatı", amount, "₺", [
    `Hizmet süresi: yaklaşık ${formatTurkishNumber(serviceYears, 3)} yıl (${formatTurkishNumber(serviceDays, 0)} gün)`,
    `Tazminata esas aylık tutar: ${formatTurkishNumber(monthlyBase)} ₺ (dönem tavanı uygulanmış)`
  ]);
}

export function calculateNotice(values: CalculatorValues): CalculatorResult {
  const monthlyGross = requiredNumber(values, "monthlyGross", "Aylık brüt ücret");
  if (monthlyGross <= 0) throw new Error("Aylık brüt ücret sıfırdan büyük olmalıdır.");
  const start = requiredDate(values, "startDate", "İşe giriş tarihi");
  const end = requiredDate(values, "endDate", "İşten ayrılış tarihi");
  if (end <= start) throw new Error("İşten ayrılış tarihi işe giriş tarihinden sonra olmalıdır.");
  const months = completeMonths(start, end);
  const band = regulatedConfig2026.noticePeriods.bands.find((item) => item.monthsLessThan === null || months < item.monthsLessThan);
  if (!band) throw new Error("Hizmet süresine uygun ihbar süresi bulunamadı.");
  const days = band.weeks * 7;
  return result("Tahmini brüt ihbar tazminatı", monthlyGross / 30 * days, "₺", [
    `Genel ihbar süresi: ${band.weeks} hafta (${days} takvim günü)`,
    `Hizmet süresi: ${formatTurkishNumber(months / 12, 2)} yıl`,
    "Sözleşme ve fesih koşulları değerlendirilmemiştir."
  ]);
}

export function calculateAnnualLeave(values: CalculatorValues): CalculatorResult {
  const monthlyGross = requiredNumber(values, "monthlyGross", "Aylık brüt ücret");
  const start = requiredDate(values, "startDate", "İşe giriş tarihi");
  const asOf = requiredDate(values, "asOfDate", "İzin / ayrılış tarihi");
  const age = requiredNumber(values, "age", "Yaş");
  const usedDays = requiredNumber(values, "usedDays", "Kullanılacak izin günü");
  const unusedDays = requiredNumber(values, "unusedDays", "Kalan kullanılmamış izin günü");
  if (asOf < start) throw new Error("İzin / ayrılış tarihi işe giriş tarihinden önce olamaz.");
  if (monthlyGross <= 0 || age < 0 || usedDays < 0 || unusedDays < 0) {
    throw new Error("Ücret sıfırdan büyük; yaş ve izin günleri sıfır veya daha büyük olmalıdır.");
  }
  if (!Number.isInteger(age) || !Number.isInteger(usedDays) || !Number.isInteger(unusedDays)) {
    throw new Error("Yaş ve izin günlerini tam sayı olarak girin.");
  }
  const leaveConfig = regulatedConfig2026.annualLeave;
  const eligible = asOf >= new Date(anniversaryTime(start, 12));
  const statutoryDays = !eligible
    ? 0
    : Math.max(
      asOf <= new Date(anniversaryTime(start, leaveConfig.firstBandYears * 12))
        ? leaveConfig.firstBandMinimumDays
        : asOf < new Date(anniversaryTime(start, leaveConfig.secondBandStartsAtYears * 12))
          ? leaveConfig.secondBandMinimumDays
          : leaveConfig.thirdBandMinimumDays,
      age < leaveConfig.protectedAgeUnder || age >= leaveConfig.protectedAgeFrom ? leaveConfig.protectedAgeMinimum : 0
    );
  const completedMonths = completeMonths(start, asOf);
  const completedYears = Math.floor(completedMonths / 12);
  const remainderDays = Math.max(0, (asOf.getTime() - anniversaryTime(start, completedYears * 12)) / 86_400_000);
  const serviceYears = completedYears + remainderDays / 365;
  const dailyGross = monthlyGross / 30;
  const usedLeavePay = dailyGross * usedDays;
  const unusedLeavePay = dailyGross * unusedDays;
  return result("Kullanılmamış izin için tahmini brüt tutar", unusedLeavePay, "₺", [
    `Kanuni asgari yıllık izin süresi: ${statutoryDays} gün`,
    `Hizmet süresi: yaklaşık ${formatTurkishNumber(serviceYears, 2)} yıl`,
    `Kullanılacak izin döneminin brüt ücret karşılığı: ${formatTurkishNumber(usedLeavePay)} ₺ (ek ödeme değildir)`,
    `Kullanılmamış ${unusedDays} gün için brüt tahmin: ${formatTurkishNumber(unusedLeavePay)} ₺`
  ]);
}

export function calculateRentIncrease(values: CalculatorValues): CalculatorResult {
  const cpi = regulatedConfig2026.rentIncrease.latestCpi12MonthAverage;
  if (cpi.value === null) todoError("kira-artis-orani-hesaplama");
  const currentRent = requiredNumber(values, "currentRent", "Mevcut kira tutarı");
  const renewalMonth = requiredNumber(values, "renewalMonth", "Kira yenileme ayı");
  if (currentRent < 0 || !Number.isInteger(renewalMonth) || renewalMonth < 1 || renewalMonth > 12) {
    throw new Error("Kira tutarı sıfır veya daha büyük; yenileme ayı 1–12 arasında olmalıdır.");
  }
  if (renewalMonth !== 11) {
    throw new Error("Yapılandırmada yalnızca Kasım 2026 yenilemesi için TÜİK dönemi tanımlıdır; başka ay için güncel veri eklenmelidir.");
  }
  const increase = currentRent * cpi.value / 100;
  return result("Örnek yeni kira tutarı", currentRent + increase, "₺", [
    `Uygulanan TÜFE 12 aylık ortalaması: %${formatTurkishNumber(cpi.value)}`,
    `Örnek artış tutarı: ${formatTurkishNumber(increase)} ₺`,
    `Kaynak dönemi: ${cpi.source}`
  ]);
}

type LoanKind = "konut" | "ihtiyac" | "tasit";

export function calculateAmortizedLoan(values: CalculatorValues, kind: LoanKind): CalculatorResult {
  const toolId = `${kind === "konut" ? "konut" : kind === "ihtiyac" ? "ihtiyac" : "tasit"}-kredisi-hesaplama`;
  const rates = regulatedConfig2026.loans[kind];
  if (rates.kkdf === null || rates.bsmv === null) todoError(toolId);
  const principal = requiredNumber(values, "principal", "Kredi anaparası");
  const monthlyRatePercent = requiredNumber(values, "monthlyRate", "Aylık faiz oranı");
  const months = requiredNumber(values, "months", "Vade");
  if (principal <= 0 || monthlyRatePercent < 0 || !Number.isInteger(months) || months < 1 || months > 1200) {
    throw new Error("Anapara sıfırdan büyük, faiz oranı sıfır veya daha büyük, vade 1–1.200 ay arasında tam sayı olmalıdır.");
  }
  const kkdf = values["applyKkdf"] === "yes" ? rates.kkdf : 0;
  const bsmv = values["applyBsmv"] === "yes" ? rates.bsmv : 0;
  if (!["yes", "no"].includes(values["applyKkdf"]) || !["yes", "no"].includes(values["applyBsmv"])) {
    throw new Error("KKDF ve BSMV seçeneklerini belirtin.");
  }
  const monthlyRate = monthlyRatePercent / 100;
  const effectiveRate = monthlyRate * (1 + kkdf + bsmv);
  const monthlyPayment = effectiveRate === 0
    ? principal / months
    : principal * effectiveRate / (1 - (1 + effectiveRate) ** -months);
  let balance = principal;
  let totalInterest = 0;
  let totalKkdf = 0;
  let totalBsmv = 0;
  const rows: string[][] = [];
  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    const kkdfAmount = interest * kkdf;
    const bsmvAmount = interest * bsmv;
    const principalPaid = Math.min(balance, monthlyPayment - interest - kkdfAmount - bsmvAmount);
    const payment = principalPaid + interest + kkdfAmount + bsmvAmount;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    totalKkdf += kkdfAmount;
    totalBsmv += bsmvAmount;
    rows.push([
      String(month), formatTurkishNumber(payment), formatTurkishNumber(principalPaid),
      formatTurkishNumber(interest), formatTurkishNumber(kkdfAmount),
      formatTurkishNumber(bsmvAmount), formatTurkishNumber(balance)
    ]);
  }
  const totalPayment = principal + totalInterest + totalKkdf + totalBsmv;
  return {
    label: "Tahmini aylık eşit taksit",
    value: monthlyPayment,
    unit: "₺",
    details: [
      `Toplam geri ödeme: ${formatTurkishNumber(totalPayment)} ₺`,
      `Toplam faiz: ${formatTurkishNumber(totalInterest)} ₺`,
      `Toplam KKDF: ${formatTurkishNumber(totalKkdf)} ₺`,
      `Toplam BSMV: ${formatTurkishNumber(totalBsmv)} ₺`,
      "Banka ücreti, sigorta ve özel ödeme koşulları dahil değildir."
    ],
    table: {
      headers: ["Ay", "Taksit", "Anapara", "Faiz", "KKDF", "BSMV", "Kalan borç"],
      rows
    }
  };
}

export function calculateDepositInterest(values: CalculatorValues): CalculatorResult {
  const principal = requiredNumber(values, "principal", "Mevduat anaparası");
  const annualRate = requiredNumber(values, "annualRate", "Yıllık brüt faiz oranı");
  const days = requiredNumber(values, "days", "Vade günü");
  const openingDate = requiredDate(values, "openingDate", "Hesap açılış / yenileme tarihi");
  if (principal <= 0 || annualRate < 0 || days < 1 || !Number.isInteger(days)) {
    throw new Error("Anapara sıfırdan büyük, faiz oranı sıfır veya daha büyük, vade ise pozitif tam gün olmalıdır.");
  }
  const withholding = regulatedConfig2026.deposit.withholdingByMaturity.find((item) =>
    days >= item.minDays && (item.maxDays === null || days <= item.maxDays)
      && openingDate >= new Date(`${item.effectiveFrom}T00:00:00Z`)
      && (item.effectiveTo === null || openingDate <= new Date(`${item.effectiveTo}T23:59:59Z`))
  );
  if (!withholding) todoError("mevduat-faiz-hesaplama");
  const gross = principal * annualRate / 100 * days / 365;
  const tax = gross * withholding.rate;
  return result("Stopaj sonrası net faiz", gross - tax, "₺", [
    `Brüt faiz: ${formatTurkishNumber(gross)} ₺`,
    `Stopaj (%${formatTurkishNumber(withholding.rate * 100)}): ${formatTurkishNumber(tax)} ₺`,
    `Vade sonu toplam: ${formatTurkishNumber(principal + gross - tax)} ₺`,
    "365 gün yılı ve basit faiz varsayımı kullanılmıştır."
  ]);
}

export function calculateIncomeTax(values: CalculatorValues): CalculatorResult {
  const taxableIncome = requiredNumber(values, "taxableIncome", "Kümülatif ücret vergi matrahı");
  const brackets = regulatedConfig2026.incomeTax.salaryBrackets;
  if (!brackets) todoError("gelir-vergisi-dilimi-hesaplama");
  if (taxableIncome < 0) throw new Error("Kümülatif vergi matrahı negatif olamaz.");
  let lower = 0;
  let tax = 0;
  let marginalRate = 0;
  for (const bracket of brackets) {
    const upper = bracket.upTo ?? Number.POSITIVE_INFINITY;
    const taxableInBand = Math.max(0, Math.min(taxableIncome, upper) - lower);
    tax += taxableInBand * bracket.rate;
    if (taxableIncome > lower) marginalRate = bracket.rate;
    lower = upper;
    if (taxableIncome <= upper) break;
  }
  return result("Ücret gelirinde hesaplanan vergi", tax, "₺", [
    `Marjinal vergi oranı: %${formatTurkishNumber(marginalRate * 100)}`,
    `Kümülatif matrah: ${formatTurkishNumber(taxableIncome)} ₺`
  ]);
}

export function calculateStampDuty(values: CalculatorValues): CalculatorResult {
  const type = values["documentType"] as keyof typeof regulatedConfig2026.stampDuty.ratesByDocument;
  if (!["lease", "wage", "contract"].includes(type)) throw new Error("Geçerli bir belge türü seçin.");
  const rate = regulatedConfig2026.stampDuty.ratesByDocument[type];
  const cap = regulatedConfig2026.stampDuty.ceilingsByDocument[type];
  if (rate === null || cap === null) todoError("damga-vergisi-hesaplama");
  let taxBase = requiredNumber(values, "taxBase", "Belge tutarı / matrah");
  if (type === "lease") {
    const term = requiredNumber(values, "term", "Belge süresi");
    if (!Number.isInteger(term) || term < 1) throw new Error("Kira sözleşmesi süresi pozitif tam yıl olmalıdır.");
    taxBase *= term;
  }
  if (taxBase < 0) throw new Error("Belge tutarı negatif olamaz.");
  return result("Hesaplanan damga vergisi", Math.min(taxBase * rate, cap), "₺", [
    `Vergi matrahı: ${formatTurkishNumber(taxBase)} ₺`,
    `Yapılandırılmış oran: ${formatTurkishNumber(rate * 1000, 3)}‰`
  ]);
}

export function calculateTitleDeed(values: CalculatorValues): CalculatorResult {
  const amount = requiredNumber(values, "propertyValue", "Harca esas taşınmaz bedeli");
  if (amount <= 0) throw new Error("Taşınmaz bedeli sıfırdan büyük olmalıdır.");
  const party = values["party"];
  const buyerRate = regulatedConfig2026.titleDeed.buyerRate.value;
  const sellerRate = regulatedConfig2026.titleDeed.sellerRate.value;
  if (buyerRate === null || sellerRate === null) throw new Error("Tapu harcı yapılandırması eksik.");
  const buyer = amount * buyerRate;
  const seller = amount * sellerRate;
  const value = party === "buyer" ? buyer : party === "seller" ? seller : party === "both" ? buyer + seller : NaN;
  if (!Number.isFinite(value)) throw new Error("Alıcı, satıcı veya toplam seçeneklerinden birini seçin.");
  return result("Tahmini tapu harcı", value, "₺", [
    `Alıcı payı (%${formatTurkishNumber(buyerRate * 100)}): ${formatTurkishNumber(buyer)} ₺`,
    `Satıcı payı (%${formatTurkishNumber(sellerRate * 100)}): ${formatTurkishNumber(seller)} ₺`,
    "Döner sermaye ve diğer işlem giderleri dahil değildir."
  ]);
}

export function calculateGoldValue(values: CalculatorValues): CalculatorResult {
  const product = values["product"] as keyof typeof regulatedConfig2026.gold.productWeights;
  if (!["gram", "quarter", "half", "full"].includes(product)) throw new Error("Geçerli bir altın türü seçin.");
  const weight = regulatedConfig2026.gold.productWeights[product];
  if (weight === null) todoError("altin-hesaplama");
  const price = requiredNumber(values, "gramPrice", "Gram altın fiyatı");
  if (price < 0) throw new Error("Gram altın fiyatı negatif olamaz.");
  return result("Teorik metal karşılığı", price * weight, "₺", [
    `Yapılandırılmış net altın ağırlığı: ${formatTurkishNumber(weight, 4)} g`,
    "İşçilik, piyasa primi ve alış-satış farkı dahil değildir."
  ]);
}
