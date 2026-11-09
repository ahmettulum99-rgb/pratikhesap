import type { CompletePayrollYearConfig } from "@/data/payroll-config";
import type { CalculatorResult } from "./index";

type PayrollInput = {
  amount: number;
  direction: string;
  period: string;
  month: number;
  disabilityDegree: string;
};

type MonthlyPayroll = {
  gross: number;
  employeeSgk: number;
  employeeUnemployment: number;
  taxableBase: number;
  cumulativeTaxableBase: number;
  grossIncomeTax: number;
  incomeTaxExemption: number;
  incomeTax: number;
  grossStampTax: number;
  stampTaxExemption: number;
  stampTax: number;
  net: number;
  employerSgk: number;
  employerUnemployment: number;
  employerCost: number;
};

const monthNames = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];
const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const amountText = (value: number) => currencyFormatter.format(value);
const roundCurrency = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

function progressiveIncomeTax(taxableBase: number, config: CompletePayrollYearConfig): number {
  let tax = 0;
  let lowerLimit = 0;
  for (const bracket of config.incomeTax.brackets) {
    const upperLimit = bracket.upTo ?? Number.POSITIVE_INFINITY;
    const taxableInBracket = Math.max(0, Math.min(taxableBase, upperLimit) - lowerLimit);
    tax += taxableInBracket * bracket.rate;
    if (taxableBase <= upperLimit) break;
    lowerLimit = upperLimit;
  }
  return roundCurrency(tax);
}

function contributionBase(gross: number, config: CompletePayrollYearConfig): number {
  return Math.min(config.socialSecurity.baseCeiling, Math.max(config.socialSecurity.baseFloor, gross));
}

function calculateMonth(
  gross: number,
  previousTaxableBase: number,
  previousMinimumWageTaxableBase: number,
  disabilityDeduction: number,
  config: CompletePayrollYearConfig
): MonthlyPayroll {
  const base = contributionBase(gross, config);
  const employeeSgk = roundCurrency(base * config.socialSecurity.employeeRate);
  const employeeUnemployment = roundCurrency(base * config.socialSecurity.employeeUnemploymentRate);
  const taxableBase = roundCurrency(Math.max(0, gross - employeeSgk - employeeUnemployment - disabilityDeduction));
  const cumulativeTaxableBase = roundCurrency(previousTaxableBase + taxableBase);
  const grossIncomeTax = roundCurrency(
    progressiveIncomeTax(cumulativeTaxableBase, config) - progressiveIncomeTax(previousTaxableBase, config)
  );
  const minimumWageTaxableBase = roundCurrency(
    config.minimumWage.grossMonthly
      - roundCurrency(config.minimumWage.grossMonthly * config.socialSecurity.employeeRate)
      - roundCurrency(config.minimumWage.grossMonthly * config.socialSecurity.employeeUnemploymentRate)
  );
  const cumulativeMinimumWageTaxableBase = roundCurrency(previousMinimumWageTaxableBase + minimumWageTaxableBase);
  const incomeTaxExemption = Math.min(
    grossIncomeTax,
    roundCurrency(
      progressiveIncomeTax(cumulativeMinimumWageTaxableBase, config)
        - progressiveIncomeTax(previousMinimumWageTaxableBase, config)
    )
  );
  const incomeTax = roundCurrency(Math.max(0, grossIncomeTax - incomeTaxExemption));
  const grossStampTax = roundCurrency(gross * config.stampTax.rate);
  const stampTaxExemption = Math.min(
    grossStampTax,
    roundCurrency(config.minimumWage.grossMonthly * config.stampTax.rate)
  );
  const stampTax = roundCurrency(Math.max(0, grossStampTax - stampTaxExemption));
  const employerSgk = roundCurrency(base * config.socialSecurity.employerRate);
  const employerUnemployment = roundCurrency(base * config.socialSecurity.employerUnemploymentRate);
  const net = roundCurrency(gross - employeeSgk - employeeUnemployment - incomeTax - stampTax);

  return {
    gross: roundCurrency(gross),
    employeeSgk,
    employeeUnemployment,
    taxableBase,
    cumulativeTaxableBase,
    grossIncomeTax,
    incomeTaxExemption,
    incomeTax,
    grossStampTax,
    stampTaxExemption,
    stampTax,
    net,
    employerSgk,
    employerUnemployment,
    employerCost: roundCurrency(gross + employerSgk + employerUnemployment)
  };
}

function solveGrossForNet(
  targetNet: number,
  previousTaxableBase: number,
  previousMinimumWageTaxableBase: number,
  disabilityDeduction: number,
  config: CompletePayrollYearConfig
): number {
  const minimumGross = config.minimumWage.grossMonthly;
  const netAtMinimum = calculateMonth(
    minimumGross,
    previousTaxableBase,
    previousMinimumWageTaxableBase,
    disabilityDeduction,
    config
  ).net;
  if (targetNet < netAtMinimum) {
    throw new Error(`Hedef net tutar, seçili ay için tam zamanlı asgari ücret netinden düşük olamaz (${amountText(netAtMinimum)} ₺).`);
  }

  let low = minimumGross;
  let high = Math.max(minimumGross * 2, targetNet * 2);
  while (calculateMonth(high, previousTaxableBase, previousMinimumWageTaxableBase, disabilityDeduction, config).net < targetNet) {
    if (high >= 1e15) throw new Error("Bu net tutar için geçerli brüt maaş bulunamadı.");
    high = Math.min(1e15, high * 2);
  }
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const middle = (low + high) / 2;
    const net = calculateMonth(
      middle,
      previousTaxableBase,
      previousMinimumWageTaxableBase,
      disabilityDeduction,
      config
    ).net;
    if (net < targetNet) low = middle;
    else high = middle;
  }
  return roundCurrency(high);
}

function formatPayrollRow(month: string, payroll: MonthlyPayroll): string[] {
  return [
    month,
    amountText(payroll.gross),
    amountText(payroll.employeeSgk),
    amountText(payroll.employeeUnemployment),
    amountText(payroll.cumulativeTaxableBase),
    amountText(payroll.incomeTax),
    amountText(payroll.incomeTaxExemption),
    amountText(payroll.stampTax),
    amountText(payroll.stampTaxExemption),
    amountText(payroll.net),
    amountText(payroll.employerCost)
  ];
}

export function calculatePayroll(input: PayrollInput, config: CompletePayrollYearConfig): CalculatorResult {
  const { amount, direction, period, month, disabilityDegree } = input;
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Maaş tutarı sıfırdan büyük olmalıdır.");
  if (direction !== "gross-to-net" && direction !== "net-to-gross") throw new Error("Geçerli bir brüt/net hesaplama yönü seçin.");
  if (period !== "monthly" && period !== "annual") throw new Error("Ücret dönemi aylık veya yıllık olmalıdır.");
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new Error("Çalışma ayı 1 ile 12 arasında olmalıdır.");
  if (!["none", "1", "2", "3"].includes(disabilityDegree)) throw new Error("Geçerli bir engellilik indirimi derecesi seçin.");

  const monthlyAmount = period === "annual" ? amount / 12 : amount;
  const disabilityDeduction = disabilityDegree === "none"
    ? 0
    : config.incomeTax.disabilityMonthlyDeduction[disabilityDegree as "1" | "2" | "3"];
  let cumulativeTaxableBase = 0;
  let cumulativeMinimumWageTaxableBase = 0;
  const payrolls: MonthlyPayroll[] = [];

  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    const gross = direction === "gross-to-net"
      ? monthlyAmount
      : solveGrossForNet(
        monthlyAmount,
        cumulativeTaxableBase,
        cumulativeMinimumWageTaxableBase,
        disabilityDeduction,
        config
      );
    if (gross < config.minimumWage.grossMonthly) {
      throw new Error(`Aylık brüt maaş 2026 tam zamanlı asgari brüt ücretten düşük olamaz (${amountText(config.minimumWage.grossMonthly)} ₺).`);
    }

    const monthPayroll = calculateMonth(
      gross,
      cumulativeTaxableBase,
      cumulativeMinimumWageTaxableBase,
      disabilityDeduction,
      config
    );
    payrolls.push(monthPayroll);
    cumulativeTaxableBase = monthPayroll.cumulativeTaxableBase;
    cumulativeMinimumWageTaxableBase = roundCurrency(
      cumulativeMinimumWageTaxableBase
        + config.minimumWage.grossMonthly
        - roundCurrency(config.minimumWage.grossMonthly * config.socialSecurity.employeeRate)
        - roundCurrency(config.minimumWage.grossMonthly * config.socialSecurity.employeeUnemploymentRate)
    );
  }

  const selected = payrolls[month - 1];
  const isGrossToNet = direction === "gross-to-net";
  const resultValue = isGrossToNet ? selected.net : selected.gross;
  const resultLabel = isGrossToNet ? "Tahmini net maaş" : "Tahmini brüt maaş";
  const totals = payrolls.reduce((sum, item) => ({
    employeeSgk: sum.employeeSgk + item.employeeSgk,
    employeeUnemployment: sum.employeeUnemployment + item.employeeUnemployment,
    incomeTax: sum.incomeTax + item.incomeTax,
    incomeTaxExemption: sum.incomeTaxExemption + item.incomeTaxExemption,
    stampTax: sum.stampTax + item.stampTax,
    stampTaxExemption: sum.stampTaxExemption + item.stampTaxExemption,
    employerCost: sum.employerCost + item.employerCost
  }), {
    employeeSgk: 0,
    employeeUnemployment: 0,
    incomeTax: 0,
    incomeTaxExemption: 0,
    stampTax: 0,
    stampTaxExemption: 0,
    employerCost: 0
  });

  return {
    label: resultLabel,
    value: resultValue,
    unit: "₺",
    details: [
      `${config.year} parametreleri; ${monthNames[month - 1]} ayı, ${period === "annual" ? "yıllık tutarın 12 aya eşit dağılımı" : "aylık ücret"} varsayımı.`,
      `Brüt maaş: ${amountText(selected.gross)} ₺`,
      `SGK işçi payı: ${amountText(selected.employeeSgk)} ₺; işsizlik sigortası işçi payı: ${amountText(selected.employeeUnemployment)} ₺`,
      `Gelir vergisi: ${amountText(selected.incomeTax)} ₺; asgari ücret gelir vergisi istisnası: ${amountText(selected.incomeTaxExemption)} ₺`,
      `Damga vergisi: ${amountText(selected.stampTax)} ₺; asgari ücret damga vergisi istisnası: ${amountText(selected.stampTaxExemption)} ₺`,
      `Kümülatif vergi matrahı: ${amountText(selected.cumulativeTaxableBase)} ₺`,
      `İşveren maliyeti: ${amountText(selected.employerCost)} ₺ (işveren SGK ${amountText(selected.employerSgk)} ₺ + işsizlik ${amountText(selected.employerUnemployment)} ₺)`,
      `12 aylık toplam: net ${amountText(payrolls.reduce((sum, item) => sum + item.net, 0))} ₺; işveren maliyeti ${amountText(totals.employerCost)} ₺.`,
      `Parametre güncelleme tarihi: ${config.lastUpdated}. Teşvik ve kişiye özel bordro kalemleri dahil değildir.`
    ],
    table: {
      headers: [
        "Ay", "Brüt maaş (₺)", "SGK işçi (₺)", "İşsizlik işçi (₺)", "Kümülatif vergi matrahı (₺)",
        "Gelir vergisi (₺)", "Asgari ücret GV istisnası (₺)", "Damga vergisi (₺)",
        "Asgari ücret damga istisnası (₺)", "Net maaş (₺)", "İşveren maliyeti (₺)"
      ],
      rows: payrolls.map((item, index) => formatPayrollRow(monthNames[index], item))
    }
  };
}
