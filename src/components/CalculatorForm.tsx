"use client";

import { useState, type KeyboardEvent } from "react";
import type { FieldDefinition, ToolDefinition } from "@/data/tools";
import { calculate, formatTurkishNumber, type CalculatorResult, type CalculatorValues } from "@/lib/calculations";

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

export function CalculatorForm({ tool }: { tool: Pick<ToolDefinition, "id" | "fields" | "mode"> }) {
  const initialValues = Object.fromEntries(tool.fields
    .filter((field) => field.type === "select")
    .map((field) => [field.name, field.options?.[0]?.value ?? ""]));
  const [values, setValues] = useState<CalculatorValues>(initialValues);
  const [rowCount, setRowCount] = useState(2);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const maximumRows = 30;

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
    return tool.fields;
  })();

  const visibleFields = fields.filter((field) => {
    if (!field.showWhen) return true;
    const selected = values[field.showWhen.field] ?? "";
    return Array.isArray(field.showWhen.value)
      ? field.showWhen.value.includes(selected)
      : field.showWhen.value === selected;
  });

  async function calculateResult() {
    setError("");
    setCopyMessage("");
    setIsCalculating(true);
    try {
      if (tool.id === "doviz-hesaplama") {
        const currency = values.currency ?? "";
        const response = await fetch(`/api/exchange-rates?currency=${encodeURIComponent(currency)}`, { cache: "no-store" });
        const payload: unknown = await response.json();
        if (!response.ok) {
          const message = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "TCMB döviz kuru alınamadı. Lütfen daha sonra tekrar deneyin.";
          throw new Error(message);
        }
        if (!isExchangeRateResponse(payload)) throw new Error("TCMB döviz kuru yanıtı geçersiz. Lütfen daha sonra tekrar deneyin.");
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
      "not-ortalamasi-hesaplama": { grade1: "70", grade2: "80", grade3: "90" },
      "ders-ortalamasi-hesaplama": { averageMode: "weighted", courseName1: "Matematik", grade1: "80", credit1: "3", courseName2: "Fen", grade2: "70", credit2: "1" },
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
    setValues((current) => ({ ...current, [name]: value }));
    setResult(null);
    setError("");
    setCopyMessage("");
  }

  function displayLabel(field: FieldDefinition) {
    if (tool.mode === "percentage" && field.name === "amount") {
      return values.operation === "share" ? "Sayı (A)" : "Sayı";
    }
    return field.label;
  }

  return (
    <div role="form" aria-label="Hesaplama aracı" onKeyDown={handleKeyDown} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
      {["grade-list", "course-list", "weighted-list", "gpa-list", "unit-price"].includes(tool.mode ?? "") && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">En fazla {maximumRows} satır ekleyebilirsiniz. Sayısal girişlerde 2.000,50 veya 2000,50 yazabilirsiniz.</p>
          <div className="flex gap-2">
            <button type="button" className="secondary-button" onClick={() => setRowCount((count) => Math.min(maximumRows, count + 1))} disabled={rowCount >= maximumRows}>Satır ekle</button>
            <button type="button" className="secondary-button" onClick={() => setRowCount((count) => Math.max(1, count - 1))} disabled={rowCount <= 1}>Son satırı sil</button>
          </div>
        </div>
      )}
      {tool.mode === "weighted-list" && (
        <p className="mb-4 text-sm text-slate-600">Toplam ağırlık: %{formatTurkishNumber(Array.from({ length: rowCount }, (_, index) => Number(values[`weight${index + 1}`]?.replace(",", ".") ?? 0)).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0))}</p>
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
      {error && <p id="calculator-error" role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {result && (
        <div role="status" aria-live="polite" className="mt-5 rounded-xl border border-blue-100 bg-pale-blue p-5">
          <p className="text-sm font-medium text-slate-600">{result.label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-navy">
            {result.displayValue ?? formatTurkishNumber(result.value)}{result.unit ? ` ${result.unit}` : ""}
          </p>
          {result.details?.map((detail) => <p key={detail} className="mt-2 text-sm text-slate-600">{detail}</p>)}
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={copyResult} className="secondary-button">Sonucu kopyala</button>
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
