import { describe, expect, it } from "vitest";
import { buildShareText, createCalculatorQuery, parseCalculatorQuery } from "./calculator-url";

describe("calculator query sharing", () => {
  it("round-trips calculator values and dynamic rows", () => {
    const values = { amount: "1.000,50", rate: "20", direction: "included-to-excluded", grade1: "AA", courseName1: "Matematik" };
    const query = createCalculatorQuery(values, 3, "unified-gpa");
    const parsed = parseCalculatorQuery(`?${query}`, ["amount", "rate", "direction"], "unified-gpa");
    expect(parsed).toEqual({ values, rowCount: 3, hasValues: true });
  });

  it("ignores unknown keys, unsafe row counts, oversized values, and unrelated array fields", () => {
    const parsed = parseCalculatorQuery("?amount=100&unknown=secret&grade30=AA&grade900=FF&satir=99&rate=" + "x".repeat(501), ["amount"], "grade-list");
    expect(parsed.values).toEqual({ amount: "100", grade30: "AA" });
    expect(parsed.rowCount).toBe(30);
  });

  it("keeps dynamic parameters disabled for tools without row-based inputs", () => {
    const parsed = parseCalculatorQuery("?grade1=90&satir=3&amount=100", ["amount"], "percentage");
    expect(parsed).toEqual({ values: { amount: "100" }, rowCount: 1, hasValues: true });
    expect(createCalculatorQuery({ amount: "", rate: "20" }, 2)).toBe("rate=20");
  });

  it("includes the generated link with result text for sharing", () => {
    expect(buildShareText("https://example.test/yuzde-hesaplama?amount=100", "Sonuç: 20")).toBe(
      "Sonuç: 20\nhttps://example.test/yuzde-hesaplama?amount=100"
    );
  });
});
