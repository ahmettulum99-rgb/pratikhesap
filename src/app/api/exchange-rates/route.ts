import { isTcmbCurrencyCode, parseTcmbExchangeRate } from "@/lib/exchange-rates";

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "X-Robots-Tag": "noindex, nofollow" } });
}

export async function GET(request: Request) {
  const currencyCode = new URL(request.url).searchParams.get("currency") ?? "";
  if (!isTcmbCurrencyCode(currencyCode)) {
    return jsonResponse({ error: "Desteklenmeyen döviz türü seçildi." }, 400);
  }

  try {
    const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000)
    });
    if (!response.ok) {
      return jsonResponse({ error: "TCMB döviz kuru verisine şu anda ulaşılamıyor." }, 502);
    }

    const rate = parseTcmbExchangeRate(await response.text(), currencyCode);
    return jsonResponse(rate);
  } catch (error) {
    console.error("TCMB döviz kuru alınamadı.", error);
    return jsonResponse({ error: "TCMB döviz kuru alınamadı. Lütfen daha sonra tekrar deneyin." }, 502);
  }
}
