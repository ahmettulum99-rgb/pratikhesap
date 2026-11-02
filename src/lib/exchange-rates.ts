export const tcmbCurrencies = [
  { code: "USD", name: "ABD Doları" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "İngiliz Sterlini" },
  { code: "CHF", name: "İsviçre Frangı" },
  { code: "JPY", name: "Japon Yeni" }
] as const;

export type TcmbCurrencyCode = (typeof tcmbCurrencies)[number]["code"];

export type TcmbExchangeRate = {
  currencyCode: TcmbCurrencyCode;
  unit: number;
  forexSelling: number;
  date: string;
};

export function isTcmbCurrencyCode(value: string): value is TcmbCurrencyCode {
  return tcmbCurrencies.some((currency) => currency.code === value);
}

export function parseTcmbExchangeRate(xml: string, currencyCode: TcmbCurrencyCode): TcmbExchangeRate {
  const currencyMatch = xml.match(new RegExp(
    `<Currency\\b(?=[^>]*\\bCurrencyCode="${currencyCode}")[^>]*>([\\s\\S]*?)<\\/Currency>`
  ));
  const date = xml.match(/<Tarih_Date\b[^>]*\bTarih="([^"]+)"/)?.[1];
  const unit = currencyMatch?.[1].match(/<Unit>\s*(\d+)\s*<\/Unit>/)?.[1];
  const forexSelling = currencyMatch?.[1].match(/<ForexSelling>\s*(\d+(?:\.\d+)?)\s*<\/ForexSelling>/)?.[1];
  const parsedUnit = Number(unit);
  const parsedForexSelling = Number(forexSelling);

  if (!date || !Number.isSafeInteger(parsedUnit) || parsedUnit <= 0 || !Number.isFinite(parsedForexSelling) || parsedForexSelling <= 0) {
    throw new Error(`TCMB verisinde ${currencyCode} için geçerli satış kuru bulunamadı.`);
  }

  return { currencyCode, unit: parsedUnit, forexSelling: parsedForexSelling, date };
}
