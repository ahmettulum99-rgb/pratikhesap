import { describe, expect, it } from "vitest";
import { isTcmbCurrencyCode, parseTcmbExchangeRate } from "./exchange-rates";

describe("TCMB exchange-rate parser", () => {
  it("extracts the bulletin date, currency unit, and selling rate", () => {
    const xml = `<Tarih_Date Tarih="02.11.2026">
      <Currency CrossOrder="19" Kod="JPY" CurrencyCode="JPY">
        <Unit>100</Unit>
        <ForexSelling>22.3456</ForexSelling>
      </Currency>
    </Tarih_Date>`;

    expect(parseTcmbExchangeRate(xml, "JPY")).toEqual({
      currencyCode: "JPY",
      unit: 100,
      forexSelling: 22.3456,
      date: "02.11.2026"
    });
  });

  it("accepts only configured currencies and rejects missing or invalid quotes", () => {
    expect(isTcmbCurrencyCode("USD")).toBe(true);
    expect(isTcmbCurrencyCode("TRY")).toBe(false);
    expect(() => parseTcmbExchangeRate("<Tarih_Date Tarih=\"02.11.2026\"></Tarih_Date>", "USD")).toThrow(/USD/);
    expect(() => parseTcmbExchangeRate(
      `<Tarih_Date Tarih="02.11.2026"><Currency CurrencyCode="USD"><Unit>0</Unit><ForexSelling>1</ForexSelling></Currency></Tarih_Date>`,
      "USD"
    )).toThrow(/USD/);
  });
});
