"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import type { FieldDefinition, ToolDefinition } from "@/data/tools";
import { vatQuickRates } from "@/data/calculation-config";
import { calculate, formatTurkishNumber, type CalculatorResult, type CalculatorValues } from "@/lib/calculations";
import { buildShareText, createCalculatorQuery, parseCalculatorQuery } from "@/lib/calculator-url";
import { unitGroups } from "@/lib/calculations/units";
import { rememberTool } from "@/lib/local-tools";

type ExchangeRateResponse = {
  currencyCode: string;
  unit: number;
  forexSelling: number;
  date: string;
};

function isExchangeRateResponse(value: unknown): value is ExchangeRateResponse {
  if (!value || typeof value !== "object") return false;
  return "currencyCode" in value
    && typeof value.currencyCode === "string"
    && "unit" in value
    && typeof value.unit === "number"
    && "forexSelling" in value
    && typeof value.forexSelling === "number"
    && "date" in value
    && typeof value.date === "string";
}

async function fetchExchangeRate(currency: string): Promise<ExchangeRateResponse> {
  const response = await fetch(`/api/exchange-rates?currency=${encodeURIComponent(currency)}`, { cache: "no-store" });
  const payload: unknown = await response.json();
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
      ? payload.error
      : "TCMB döviz kuru alınamadı. Lütfen daha sonra tekrar deneyin.";
    throw new Error(message);
  }
  if (!isExchangeRateResponse(payload)) throw new Error("TCMB döviz kuru yanıtı geçersiz. Lütfen daha sonra tekrar deneyin.");
  return payload;
}

export function CalculatorForm({
  tool,
  trackUsage = true
}: {
  tool: Pick<ToolDefinition, "id" | "fields" | "mode">;
  trackUsage?: boolean;
}) {
  const pathname = usePathname();
  const initialValues = useMemo(() => Object.fromEntries(tool.fields
    .filter((field) => field.type === "select")
    .map((field) => [field.name, field.options?.[0]?.value ?? ""])), [tool.fields]);
  const [values, setValues] = useState<CalculatorValues>(initialValues);
  const [rowCount, setRowCount] = useState(2);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, ExchangeRateResponse>>({});
  const [queryLoaded, setQueryLoaded] = useState(false);
  const [shouldSyncUrl, setShouldSyncUrl] = useState(false);
  const maximumRows = 30;

  useEffect(() => {
    function loadQueryValues() {
      const parsed = parseCalculatorQuery(window.location.search, tool.fields.map((field) => field.name), tool.mode);
      setValues({ ...initialValues, ...parsed.values });
      setRowCount(parsed.rowCount);
      setHasInteracted(parsed.hasValues);
      setShouldSyncUrl(false);
      setQueryLoaded(true);
    }
    loadQueryValues();
    window.addEventListener("popstate", loadQueryValues);
    return () => window.removeEventListener("popstate", loadQueryValues);
  }, [initialValues, tool.fields, tool.id, tool.mode]);

  useEffect(() => {
    if (!queryLoaded || !shouldSyncUrl) return;
    const query = createCalculatorQuery(values, rowCount, tool.mode);
    window.history.replaceState(window.history.state, "", query ? `${pathname}?${query}` : pathname);
  }, [pathname, queryLoaded, rowCount, shouldSyncUrl, tool.mode, values]);

  useEffect(() => {
    if (!queryLoaded || !shouldSyncUrl || !trackUsage) return;
    rememberTool(tool.id);
  }, [queryLoaded, shouldSyncUrl, tool.id, trackUsage]);

  const fields: FieldDefinition[] = (() => {
    if (tool.mode === "grade-list") {
      return Array.from({ length: rowCount }, (_, index) => ({
        name: `grade${index + 1}`,
        label: `${index + 1}. not`,
        type: "number",
        placeholder: "Örn. 80",
        unit: "puan"
      }));
    }
    if (tool.mode === "course-list") {
      return [
        tool.fields[0],
        ...Array.from({ length: rowCount }, (_, index) => {
          const number = index + 1;
          return [
            { name: `courseName${number}`, label: `${number}. ders adı`, type: "text" as const, placeholder: "Örn. Matematik" },
            { name: `grade${number}`, label: `${number}. ders notu`, type: "number" as const, placeholder: "Örn. 80", unit: "puan" },
            { name: `credit${number}`, label: `${number}. ders kredisi / saati`, type: "number" as const, placeholder: "Örn. 3", unit: "ağırlık", showWhen: { field: "averageMode", value: "weighted" } }
          ];
        }).flat()
      ];
    }
    if (tool.mode === "gpa-list") {
      const gradeOptions = tool.fields[0]?.options ?? [];
      return [
        ...Array.from({ length: rowCount }, (_, index) => {
          const number = index + 1;
          return [
            { name: `courseName${number}`, label: `${number}. ders adı`, type: "text" as const, placeholder: "Örn. Matematik" },
            { name: `grade${number}`, label: `${number}. ders harf notu`, type: "select" as const, options: gradeOptions },
            { name: `credit${number}`, label: `${number}. ders kredisi`, type: "number" as const, placeholder: "Örn. 3", unit: "kredi" }
          ];
        }).flat(),
        { name: "previousCredits", label: "Önceki toplam kredi (isteğe bağlı)", type: "number", placeholder: "Örn. 60", unit: "kredi" },
        { name: "previousGpa", label: "Önceki genel ortalama (isteğe bağlı)", type: "number", placeholder: "Örn. 3,10", unit: "/ 4,00" }
      ];
    }
    if (tool.mode === "unified-gpa") {
      const gradeSystem = values.gradeSystem ?? "4";
      const gradeEntry = values.gradeEntry ?? "letter";
      const letterOptions = [
        { label: "Harf notu seçin", value: "" },
        { label: "AA (4,00)", value: "AA" },
        { label: "BA (3,50)", value: "BA" },
        { label: "BB (3,00)", value: "BB" },
        { label: "CB (2,50)", value: "CB" },
        { label: "CC (2,00)", value: "CC" },
        { label: "DC (1,50)", value: "DC" },
        { label: "DD (1,00)", value: "DD" },
        { label: "FD (0,50)", value: "FD" },
        { label: "FF (0,00)", value: "FF" }
      ];
      return [
        ...tool.fields.slice(0, 2).map((field) => ({
          ...field,
          showWhen: field.name === "gradeEntry" ? { field: "gradeSystem", value: "4" } : undefined
        })),
        ...Array.from({ length: rowCount }, (_, index) => {
          const number = index + 1;
          return [
            { name: `courseName${number}`, label: `${number}. ders adı`, type: "text" as const, placeholder: "Örn. Matematik" },
            { name: `credit${number}`, label: `${number}. ders kredisi`, type: "number" as const, placeholder: "Örn. 3", unit: "kredi" },
            gradeSystem === "4" && gradeEntry === "letter"
              ? { name: `grade${number}`, label: `${number}. ders harf notu`, type: "select" as const, options: letterOptions }
              : { name: `grade${number}`, label: `${number}. ders notu`, type: "number" as const, placeholder: gradeSystem === "4" ? "Örn. 3,5" : "Örn. 80", unit: gradeSystem === "4" ? "/ 4" : "puan" }
          ];
        }).flat()
      ];
    }
    if (tool.mode === "weighted-list") {
      return Array.from({ length: rowCount }, (_, index) => {
        const number = index + 1;
        return [
          { name: `assessmentName${number}`, label: `${number}. değerlendirme adı`, type: "text" as const, placeholder: "Örn. Vize" },
          { name: `score${number}`, label: `${number}. değerlendirme notu`, type: "number" as const, placeholder: "Örn. 70", unit: "puan" },
          { name: `weight${number}`, label: `${number}. değerlendirme ağırlığı`, type: "number" as const, placeholder: "Örn. 40", unit: "%" }
        ];
      }).flat();
    }
    if (tool.mode === "unit-price") {
      const options = tool.fields.find((field) => field.name === "unit1")?.options ?? [];
      return Array.from({ length: rowCount }, (_, index) => {
        const number = index + 1;
        return [
          { name: `productName${number}`, label: `${number}. ürün adı`, type: "text" as const, placeholder: "Örn. Ürün A" },
          { name: `price${number}`, label: `${number}. ürün fiyatı`, type: "number" as const, placeholder: "Örn. 60", unit: "₺" },
          { name: `quantity${number}`, label: `${number}. ürün miktarı`, type: "number" as const, placeholder: "Örn. 500" },
          { name: `unit${number}`, label: `${number}. ürün birimi`, type: "select" as const, options },
          { name: `packages${number}`, label: `${number}. ürün paket adedi`, type: "number" as const, placeholder: "Örn. 1 paket" }
        ];
      }).flat();
    }
    if (tool.mode === "unit-conversion") {
      const group = unitGroups.find((item) => item.value === (values.category ?? "length")) ?? unitGroups[0];
      return tool.fields.map((field) => field.name === "fromUnit" || field.name === "toUnit"
        ? { ...field, options: group.units.map(({ value, label }) => ({ value, label })) }
        : field);
    }
    return tool.fields;
  })();

  const visibleFields = fields.filter((field) => {
    if (!field.showWhen) return true;
    const selected = values[field.showWhen.field] ?? "";
    return Array.isArray(field.showWhen.value)
      ? field.showWhen.value.includes(selected)
      : field.showWhen.value === selected;
  });

  useEffect(() => {
    if (!hasInteracted) return;
    if (tool.id === "doviz-hesaplama") {
      const currency = values.currency ?? "";
      if (!currency) return;
      let active = true;
      const timer = window.setTimeout(async () => {
        try {
          const exchangeRate = exchangeRates[currency] ?? await fetchExchangeRate(currency);
          if (!exchangeRates[currency]) setExchangeRates((current) => ({ ...current, [currency]: exchangeRate }));
          if (!active) return;
          setResult(calculate(tool.id, {
            ...values,
            _rowCount: String(rowCount),
            exchangeRate: exchangeRate.forexSelling.toFixed(4),
            exchangeUnit: String(exchangeRate.unit),
            rateDate: exchangeRate.date
          }));
          setError("");
        } catch (caught) {
          if (!active) return;
          setResult(null);
          setError(caught instanceof Error ? caught.message : "Kur alınamadı. Lütfen daha sonra tekrar deneyin.");
        }
      }, exchangeRates[currency] ? 0 : 350);
      return () => {
        active = false;
        window.clearTimeout(timer);
      };
    }
    const timer = window.setTimeout(() => {
      try {
        setResult(calculate(tool.id, { ...values, _rowCount: String(rowCount) }));
        setError("");
      } catch (caught) {
        setResult(null);
        setError(caught instanceof Error ? caught.message : "Hesaplama yapılamadı. Girdilerinizi kontrol edin.");
      }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [exchangeRates, hasInteracted, rowCount, tool.id, values]);

  async function calculateResult() {
    setError("");
    setCopyMessage("");
    setIsCalculating(true);
    try {
      if (tool.id === "doviz-hesaplama") {
        const currency = values.currency ?? "";
        const payload = await fetchExchangeRate(currency);
        setExchangeRates((current) => ({ ...current, [currency]: payload }));
        setResult(calculate(tool.id, {
          ...values,
          _rowCount: String(rowCount),
          exchangeRate: payload.forexSelling.toFixed(4),
          exchangeUnit: String(payload.unit),
          rateDate: payload.date
        }));
      } else {
        setResult(calculate(tool.id, { ...values, _rowCount: String(rowCount) }));
      }
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Hesaplama yapılamadı. Girdilerinizi kontrol edin.");
    } finally {
      setIsCalculating(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      event.preventDefault();
      void calculateResult();
    }
  }

  function fillExample() {
    const examples: Record<string, CalculatorValues> = {
      "yuzde-hesaplama": { operation: "of", amount: "2000", percent: "15" },
      "not-ortalamasi-gano-hesaplama": { gradeSystem: "4", gradeEntry: "letter", courseName1: "Matematik", grade1: "AA", credit1: "3", courseName2: "Fen", grade2: "BB", credit2: "2" },
      "maas-zam-artis-hesaplama": { increaseType: "percent", salary: "30000", percent: "20" },
      "brut-net-maas-hesaplama": { direction: "gross-to-net", period: "monthly", amount: "50000", month: "1", disabilityDegree: "none" },
      "birim-donusturme": { category: "length", amount: "2,5", fromUnit: "km", toUnit: "m" },
      "metrekare-hesaplama": { shape: "rectangle", width: "4", length: "5" },
      "dortluk-not-sistemi-hesaplama": { courseName1: "Matematik", grade1: "AA", credit1: "3", courseName2: "Fen", grade2: "BB", credit2: "2" },
      "agirlikli-not-ortalamasi-hesaplama": { assessmentName1: "Vize", score1: "70", weight1: "40", assessmentName2: "Final", score2: "80", weight2: "60" },
      "sinav-puani-hesaplama": { correct: "30", wrong: "4", total: "40", wrongPenalty: "4" },
      "birim-fiyat-karsilastirma": { productName1: "Ürün A", price1: "60", quantity1: "500", unit1: "g", packages1: "1", productName2: "Ürün B", price2: "110", quantity2: "1", unit2: "kg", packages2: "1" },
      "pazaryeri-net-kar-hesaplama": { salePrice: "1000", productCost: "500", discountPercent: "0", commissionRate: "10", commissionBasis: "discounted", shipping: "50", extraExpenses: "20" },
      "aylik-katkili-birikim-hesaplama": { principal: "10000", contribution: "1000", annualRate: "12", months: "12", timing: "end", target: "25000" },
      "yolculuk-maliyeti-hesaplama": { distance: "300", consumption: "7", fuelPrice: "40", journey: "one-way", otherCosts: "0", people: "1" },
      "desi-hacim-hesaplama": { width: "30", length: "20", height: "10", sizeUnit: "cm", divisor: "3000", actualWeight: "1,5" },
      "kredi-taksit-hesaplama": { principal: "100000", monthlyRate: "2", months: "12", fee: "0" },
      "doviz-hesaplama": { amount: "100", direction: "to-try", currency: "USD" },
      "elektrik-faturasi-hesaplama": { mode: "device", watts: "1500", hoursPerDay: "4", days: "30", unitPrice: "2,5" }
    };
    const sample = examples[tool.id] ?? Object.fromEntries(tool.fields.map((field) => [
      field.name,
      field.type === "select" ? field.options?.find((option) => option.value)?.value ?? "" : field.type === "date" ? "2000-01-01" : "10"
    ]));
    setRowCount(tool.mode === "unit-price"
      ? Math.max(2, Object.keys(sample).filter((key) => /^productName\d+$/.test(key)).length)
      : tool.mode?.endsWith("-list")
        ? Math.max(2, Object.keys(sample).filter((key) => /(?:grade|score|weight)\d+$/.test(key)).length)
        : 2);
    setValues({ ...initialValues, ...sample });
    setHasInteracted(true);
    setShouldSyncUrl(true);
    setResult(null);
    setError("");
    setCopyMessage("");
  }

  function clearForm() {
    setRowCount(2);
    setValues(initialValues);
    setResult(null);
    setError("");
    setCopyMessage("");
    setHasInteracted(false);
    setShouldSyncUrl(false);
    window.history.replaceState(window.history.state, "", pathname);
  }

  function removeLastRow() {
    const row = rowCount;
    setHasInteracted(true);
    setShouldSyncUrl(true);
    setRowCount((count) => Math.max(1, count - 1));
    setValues((current) => {
      const next = { ...current };
      for (const prefix of ["grade", "courseName", "credit", "assessmentName", "score", "weight", "productName", "price", "quantity", "unit", "packages"]) {
        delete next[`${prefix}${row}`];
      }
      return next;
    });
  }

  async function copyResult() {
    if (!result) return;
    const text = [
      `${result.label}: ${result.displayValue ?? formatTurkishNumber(result.value)}${result.unit ? ` ${result.unit}` : ""}`,
      ...(result.details ?? [])
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Sonuç panoya kopyalandı.");
    } catch {
      setCopyMessage("Sonuç kopyalanamadı. Tarayıcı izinlerini kontrol edin.");
    }
  }

  function downloadCsv() {
    if (!result?.table) return;
    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [result.table.headers, ...result.table.rows].map((row) => row.map(escapeCell).join(";")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${tool.id}-sonuc.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function changeValue(name: string, value: string) {
    setValues((current) => {
      if (tool.mode === "unit-conversion" && name === "category") {
        const group = unitGroups.find((item) => item.value === value) ?? unitGroups[0];
        return { ...current, category: value, fromUnit: group.units[0].value, toUnit: group.units[1]?.value ?? group.units[0].value };
      }
      if (tool.mode === "unified-gpa" && (name === "gradeSystem" || name === "gradeEntry")) {
        const next = { ...current, [name]: value };
        for (const key of Object.keys(next)) {
          if (/^grade\d+$/.test(key)) next[key] = "";
        }
        return next;
      }
      return { ...current, [name]: value };
    });
    setResult(null);
    setError("");
    setCopyMessage("");
    setHasInteracted(true);
    setShouldSyncUrl(true);
  }

  const shareUrl = typeof window === "undefined"
    ? ""
    : `${window.location.origin}${pathname}?${createCalculatorQuery(values, rowCount, tool.mode)}`;
  const resultText = result
    ? [
      `${result.label}: ${result.displayValue ?? formatTurkishNumber(result.value)}${result.unit ? ` ${result.unit}` : ""}`,
      ...(result.details ?? [])
    ].join("\n")
    : "";
  const shareText = buildShareText(shareUrl, resultText);

  async function shareResult() {
    if (!result || !shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopyMessage("Sonuç ve paylaşılabilir bağlantı panoya kopyalandı.");
    } catch {
      setCopyMessage("Bağlantı kopyalanamadı. Tarayıcı izinlerini kontrol edin.");
    }
  }

  function displayLabel(field: FieldDefinition) {
    if (tool.mode === "percentage" && field.name === "amount") {
      return values.operation === "share" ? "Sayı (A)" : "Sayı";
    }
    return field.label;
  }

  return (
    <div role="form" aria-label="Hesaplama aracı" onKeyDown={handleKeyDown} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
      {["grade-list", "course-list", "weighted-list", "gpa-list", "unified-gpa", "unit-price"].includes(tool.mode ?? "") && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">En fazla {maximumRows} satır ekleyebilirsiniz. Sayısal girişlerde 2.000,50 veya 2000,50 yazabilirsiniz.</p>
          <div className="flex gap-2">
            <button type="button" className="secondary-button" onClick={() => { setHasInteracted(true); setShouldSyncUrl(true); setRowCount((count) => Math.min(maximumRows, count + 1)); }} disabled={rowCount >= maximumRows}>Satır ekle</button>
            <button type="button" className="secondary-button" onClick={removeLastRow} disabled={rowCount <= 1}>Son satırı sil</button>
          </div>
        </div>
      )}
      {tool.mode === "weighted-list" && (
        <p className="mb-4 text-sm text-slate-600">Toplam ağırlık: %{formatTurkishNumber(Array.from({ length: rowCount }, (_, index) => Number(values[`weight${index + 1}`]?.replace(",", ".") ?? 0)).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0))}</p>
      )}
      {tool.mode === "salary-payroll" && (
        <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          Bilgilendirme amaçlı 2026 tahminidir. Yıllık tutar 12 aya eşit bölünür; tablo, tüm yıl aynı işyerinde ve aynı ücretle çalışma varsayımıyla hazırlanır. Teşvikler ve kişiye özel bordro kalemleri hesaplanmaz.
        </p>
      )}
      {tool.id === "kdv-hesaplama" && (
        <div className="mb-5">
          <p className="mb-2 text-sm font-semibold text-navy">Hızlı KDV oranı seçin</p>
          <div className="flex flex-wrap gap-2">
            {vatQuickRates.map((rate) => (
              <button key={rate} type="button" className={`secondary-button ${values.rate === String(rate) ? "border-blue-600 bg-blue-50 text-blue-800" : ""}`} onClick={() => changeValue("rate", String(rate))}>
                %{rate}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-600">Bu kısayollar yalnızca oran girişini doldurur. Gerçek işlem için uygulanacak güncel oranı ayrıca doğrulayın.</p>
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {visibleFields.map((field) => (
          <label key={field.name} className="block">
            <span className="mb-2 block text-sm font-semibold text-navy">{displayLabel(field)}</span>
            {field.type === "select" ? (
              <select
                value={values[field.name] ?? field.options?.[0]?.value ?? ""}
                onChange={(event) => changeValue(field.name, event.target.value)}
                disabled={isCalculating}
                className="form-input"
                aria-label={field.label}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "calculator-error" : undefined}
              >
                {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            ) : (
              <span className="relative block">
                <input
                  type={field.type === "date" ? "date" : "text"}
                  inputMode={field.type === "number" ? "decimal" : undefined}
                  autoComplete="off"
                  value={values[field.name] ?? ""}
                  onChange={(event) => changeValue(field.name, event.target.value)}
                  disabled={isCalculating}
                  placeholder={field.placeholder}
                  className={`form-input ${field.unit ? "pr-14" : ""}`}
                  aria-label={field.label}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "calculator-error" : field.help ? `${field.name}-help` : undefined}
                />
                {field.unit && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">{field.unit}</span>}
              </span>
            )}
            {field.help && <span id={`${field.name}-help`} className="mt-1 block text-xs text-slate-600">{field.help}</span>}
          </label>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={calculateResult} disabled={isCalculating} aria-busy={isCalculating} className="primary-button w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto">
          {isCalculating ? "Kur alınıyor..." : "Hesapla"}
        </button>
        <button type="button" onClick={fillExample} className="secondary-button">Örnek doldur</button>
        <button type="button" onClick={clearForm} className="secondary-button">Temizle</button>
      </div>
      <p className="mt-3 text-xs text-slate-600">Hesaplama, gerekli alanlar dolduruldukça otomatik güncellenir. Döviz aracında seçilen kur otomatik alınır; Hesapla düğmesiyle kuru yenileyebilirsiniz.</p>
      {error && <p id="calculator-error" role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {result && (
        <div id="calculator-result" role="status" aria-live="polite" className="calculator-result mt-5 rounded-xl border border-blue-100 bg-pale-blue p-5">
          <p className="text-sm font-medium text-slate-600">{result.label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-navy">
            {result.displayValue ?? formatTurkishNumber(result.value)}{result.unit ? ` ${result.unit}` : ""}
          </p>
          {result.details?.map((detail) => <p key={detail} className="mt-2 text-sm text-slate-600">{detail}</p>)}
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={copyResult} className="secondary-button">Sonucu kopyala</button>
            <button type="button" onClick={shareResult} className="secondary-button">Sonucu paylaş</button>
            <a className="secondary-button" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">WhatsApp&apos;ta paylaş</a>
            <button type="button" onClick={() => window.print()} className="secondary-button">Sonucu yazdır</button>
            {result.table && <button type="button" onClick={downloadCsv} className="secondary-button">CSV indir</button>}
          </div>
          {copyMessage && <p role="status" className="mt-2 text-sm text-slate-700">{copyMessage}</p>}
          {result.table && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead><tr>{result.table.headers.map((header) => <th key={header} className="border-b border-slate-300 px-3 py-2">{header}</th>)}</tr></thead>
                <tbody>{result.table.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border-b border-slate-200 px-3 py-2">{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
