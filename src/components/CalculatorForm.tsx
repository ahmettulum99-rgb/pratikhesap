"use client";

import { useState, type FormEvent } from "react";
import type { ToolDefinition } from "@/data/tools";
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

export function CalculatorForm({ tool }: { tool: Pick<ToolDefinition, "id" | "fields"> }) {
  const initialValues = Object.fromEntries(tool.fields
    .filter((field) => field.type === "select")
    .map((field) => [field.name, field.options?.[0]?.value ?? ""]));
  const [values, setValues] = useState<CalculatorValues>(initialValues);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setResult(null);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
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
          exchangeRate: payload.forexSelling.toFixed(4),
          exchangeUnit: String(payload.unit),
          rateDate: payload.date
        }));
      } else {
        setResult(calculate(tool.id, values));
      }
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Hesaplama yapılamadı. Girdilerinizi kontrol edin.");
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-7" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        {tool.fields.map((field) => (
          <label key={field.name} className="block">
            <span className="mb-2 block text-sm font-semibold text-navy">{field.label}</span>
            {field.type === "select" ? (
              <select
                value={values[field.name] ?? ""}
                onChange={(event) => updateValue(field.name, event.target.value)}
                disabled={isCalculating}
                className="form-input"
                aria-label={field.label}
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
                  onChange={(event) => updateValue(field.name, event.target.value)}
                  disabled={isCalculating}
                  placeholder={field.placeholder}
                  className={`form-input ${field.unit ? "pr-14" : ""}`}
                  aria-label={field.label}
                  required
                />
                {field.unit && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">{field.unit}</span>}
              </span>
            )}
          </label>
        ))}
      </div>
      <button type="submit" disabled={isCalculating} aria-busy={isCalculating} className="primary-button mt-6 w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto">
        {isCalculating ? "Kur alınıyor..." : "Hesapla"}
      </button>
      {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {result && (
        <div role="status" aria-live="polite" className="mt-5 rounded-xl border border-blue-100 bg-pale-blue p-5">
          <p className="text-sm font-medium text-slate-600">{result.label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-navy">
            {result.displayValue ?? formatTurkishNumber(result.value)}{result.unit ? ` ${result.unit}` : ""}
          </p>
          {result.details?.map((detail) => <p key={detail} className="mt-2 text-sm text-slate-600">{detail}</p>)}
        </div>
      )}
    </form>
  );
}
