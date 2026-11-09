import type { CalculatorValues } from "./calculations";

const rowModes = new Set(["grade-list", "course-list", "weighted-list", "gpa-list", "unified-gpa", "unit-price"]);
const dynamicFieldPrefixes = ["grade", "courseName", "credit", "assessmentName", "score", "weight", "productName", "price", "quantity", "unit", "packages"];
const maximumRows = 30;

export function parseCalculatorQuery(
  search: string,
  fieldNames: string[],
  mode?: string
): { values: CalculatorValues; rowCount: number; hasValues: boolean } {
  const params = new URLSearchParams(search);
  const allowedFields = new Set(fieldNames);
  const dynamicFieldsAllowed = mode ? rowModes.has(mode) : false;
  const values: CalculatorValues = {};
  let rowCount = 1;
  let hasValues = false;
  for (const [key, value] of params) {
    if (key === "satir" && dynamicFieldsAllowed) {
      const requestedRows = Number(value);
      if (Number.isSafeInteger(requestedRows) && requestedRows >= 1 && requestedRows <= maximumRows) {
        rowCount = requestedRows;
        hasValues = true;
      }
      continue;
    }
    const dynamicPrefix = dynamicFieldsAllowed ? dynamicFieldPrefixes.find((prefix) => new RegExp(`^${prefix}\\d+$`).test(key)) : undefined;
    const dynamicIndex = dynamicPrefix ? Number(key.slice(dynamicPrefix.length)) : 0;
    const dynamicField = Boolean(dynamicPrefix && dynamicIndex >= 1 && dynamicIndex <= maximumRows);
    if (!allowedFields.has(key) && !dynamicField) continue;
    if (value.length > 500) continue;
    values[key] = value;
    hasValues = true;
    const rowIndex = key.match(/\d+$/);
    if (rowIndex) rowCount = Math.max(rowCount, Math.min(maximumRows, Number(rowIndex[0])));
  }
  return { values, rowCount: Math.max(1, rowCount), hasValues };
}

export function createCalculatorQuery(values: CalculatorValues, rowCount: number, mode?: string): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value.trim()) params.set(key, value);
  }
  if (mode && rowModes.has(mode)) params.set("satir", String(Math.min(maximumRows, Math.max(1, rowCount))));
  return params.toString();
}

export function buildShareText(url: string, resultText: string): string {
  return `${resultText}\n${url}`;
}
