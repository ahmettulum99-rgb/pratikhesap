import { unitGroups } from "./units";
import { getPayrollConfigTodo, isCompletePayrollConfig, payrollConfigs } from "../../data/payroll-config";
import { calculatePayroll } from "./payroll";

export type CalculatorResult = {
  label: string;
  value: number;
  unit?: string;
  displayValue?: string;
  details?: string[];
  table?: { headers: string[]; rows: string[][] };
};

export type CalculatorValues = Record<string, string>;

const requiredNumber = (values: CalculatorValues, key: string, label = key): number => {
  const raw = values[key]?.trim();
  if (!raw) throw new Error(`${label} alanını doldurun.`);
  const value = parseTurkishNumber(raw);
  if (!Number.isFinite(value) || Math.abs(value) > 1e15) throw new Error(`${label} için geçerli ve 1.000.000.000.000.000 değerini aşmayan bir sayı girin.`);
  return value;
};

export function parseTurkishNumber(raw: string): number {
  const normalized = raw.trim().replace(/\s/g, "");
  if (!normalized) return Number.NaN;
  if (normalized.includes(",") && !/^-?(?:\d+|\d{1,3}(?:\.\d{3})+),\d+$/.test(normalized)) return Number.NaN;
  const withDecimal = normalized.includes(",")
    ? normalized.replace(/\./g, "").replace(",", ".")
    : /^\-?\d{1,3}(\.\d{3})+$/.test(normalized)
      ? normalized.replace(/\./g, "")
      : normalized;
  if (!/^-?\d+(\.\d+)?$/.test(withDecimal)) return Number.NaN;
  return Number(withDecimal);
}

export function formatTurkishNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits }).format(value);
}

export function parseDate(value: string, label = "Tarih"): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`${label} için geçerli bir tarih seçin.`);
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`${label} geçerli bir takvim tarihi değil.`);
  }
  return date;
}

const dateValue = (values: CalculatorValues, key: string, label: string): Date => {
  const value = values[key]?.trim();
  if (!value) throw new Error(`${label} alanını doldurun.`);
  return parseDate(value, label);
};

const result = (label: string, value: number, unit?: string, details?: string[]): CalculatorResult => {
  if (!Number.isFinite(value)) throw new Error("Bu değerlerle sonuç hesaplanamıyor. Girdilerinizi kontrol edin.");
  return { label, value, unit, details };
};

export function calculatePercentage(values: CalculatorValues): CalculatorResult {
  const operation = values["operation"] || "of";
  if (operation === "difference") {
    const first = requiredNumber(values, "start", "Birinci sayı");
    const second = requiredNumber(values, "end", "İkinci sayı");
    const averageMagnitude = (Math.abs(first) + Math.abs(second)) / 2;
    if (averageMagnitude === 0) throw new Error("İki sayı da sıfır olduğunda yüzde fark hesaplanamaz.");
    const difference = Math.abs(first - second) / averageMagnitude * 100;
    return result("Yüzde fark", difference, "%", [`|${formatTurkishNumber(first)} − ${formatTurkishNumber(second)}| ÷ (${formatTurkishNumber(averageMagnitude)}) × 100`]);
  }
  if (operation === "share") {
    const amount = requiredNumber(values, "amount", "Sayı (A)");
    const base = requiredNumber(values, "base", "Taban sayı (B)");
    if (base === 0) throw new Error("Taban sayı sıfır olamaz.");
    return result("Oran", amount / base * 100, "%", [`${formatTurkishNumber(amount)} ÷ ${formatTurkishNumber(base)} × 100`]);
  }
  if (operation === "change") {
    const start = requiredNumber(values, "start", "Başlangıç değeri");
    const end = requiredNumber(values, "end", "Bitiş değeri");
    if (start === 0) throw new Error("Başlangıç değeri sıfır olduğunda yüzde değişim hesaplanamaz.");
    const percent = (end - start) / Math.abs(start) * 100;
    return result("Yüzde değişim", percent, "%", [`${percent >= 0 ? "Artış" : "Azalış"}: ${formatTurkishNumber(Math.abs(percent))}%`]);
  }
  const amount = requiredNumber(values, "amount", "Sayı");
  const percent = requiredNumber(values, "percent", "Yüzde oranı");
  if (amount < 0 || percent < 0) throw new Error("Sayı ve yüzde oranı negatif olamaz.");
  if (operation === "add" || operation === "subtract") {
    const delta = amount * percent / 100;
    const value = operation === "add" ? amount + delta : amount - delta;
    return result(operation === "add" ? "Yüzde eklenmiş değer" : "Yüzde çıkarılmış değer", value, "", [`İşlem farkı: ${formatTurkishNumber(delta)}`]);
  }
  if (operation !== "of") throw new Error("Geçerli bir yüzde işlemi seçin.");
  return result("Sonuç", amount * percent / 100, "", [`${formatTurkishNumber(amount)} sayısının %${formatTurkishNumber(percent)}'i`]);
}

export function calculateSalaryRaise(values: CalculatorValues): CalculatorResult {
  const salary = requiredNumber(values, "salary", "Mevcut maaş");
  const percent = requiredNumber(values, "percent", "Zam oranı");
  if (salary < 0 || percent < 0) throw new Error("Maaş ve zam oranı negatif olamaz.");
  const increase = salary * percent / 100;
  return result("Zamlı maaş", salary + increase, "₺", [`Zam tutarı: ${formatTurkishNumber(increase)} ₺`]);
}

export function calculateDiscount(values: CalculatorValues): CalculatorResult {
  const amount = requiredNumber(values, "amount", "Ürün fiyatı");
  const percent = requiredNumber(values, "percent", "İndirim oranı");
  if (amount < 0 || percent < 0 || percent > 100) throw new Error("Fiyat negatif olamaz; indirim oranı %0 ile %100 arasında olmalıdır.");
  const discount = amount * percent / 100;
  return result("İndirimli fiyat", amount - discount, "₺", [`İndirim tutarı: ${formatTurkishNumber(discount)} ₺`]);
}

export function calculateVat(values: CalculatorValues): CalculatorResult {
  const amount = requiredNumber(values, "amount", "KDV hariç tutar");
  const rate = requiredNumber(values, "rate", "KDV oranı");
  if (amount < 0 || rate < 0) throw new Error("Tutar ve KDV oranı negatif olamaz.");
  if (values["direction"] === "included-to-excluded") {
    const netAmount = amount / (1 + rate / 100);
    const tax = amount - netAmount;
    return result("KDV hariç tutar", netAmount, "₺", [`KDV tutarı: ${formatTurkishNumber(tax)} ₺`, `KDV dahil tutar: ${formatTurkishNumber(amount)} ₺`]);
  }
  if (values["direction"] && values["direction"] !== "excluded-to-included") {
    throw new Error("Geçerli bir KDV hesaplama yönü seçin.");
  }
  const tax = amount * rate / 100;
  return result("KDV dahil tutar", amount + tax, "₺", [`KDV tutarı: ${formatTurkishNumber(tax)} ₺`]);
}

export function calculateProfitLoss(values: CalculatorValues): CalculatorResult {
  const cost = requiredNumber(values, "cost", "Alış fiyatı");
  const sale = requiredNumber(values, "sale", "Satış fiyatı");
  if (cost < 0 || sale < 0) throw new Error("Fiyatlar negatif olamaz.");
  const difference = sale - cost;
  const percent = cost === 0 ? 0 : difference / cost * 100;
  const ratio = cost === 0
    ? "Alış fiyatı sıfır olduğundan yüzde oranı hesaplanamaz."
    : `Alış fiyatına göre ${difference >= 0 ? "kâr" : "zarar"} oranı: %${formatTurkishNumber(Math.abs(percent))}`;
  return result(difference >= 0 ? "Kâr" : "Zarar", Math.abs(difference), "₺", [ratio]);
}

export function calculateSalaryIncrease(values: CalculatorValues): CalculatorResult {
  const salary = requiredNumber(values, "salary", "Mevcut maaş");
  const isPercent = values["increaseType"] === "percent" || (!values["increaseType"] && !values["increase"]);
  const amount = requiredNumber(values, isPercent ? "percent" : "increase", isPercent ? "Zam oranı" : "Artış tutarı");
  if (salary < 0 || amount < 0) throw new Error("Maaş ve artış değeri negatif olamaz.");
  const increase = isPercent ? salary * amount / 100 : amount;
  const percent = salary === 0 ? 0 : increase / salary * 100;
  return result("Yeni maaş", salary + increase, "₺", [
    `Artış tutarı: ${formatTurkishNumber(increase)} ₺`,
    salary === 0 ? "Mevcut maaş sıfır olduğundan artış oranı hesaplanamaz." : `Artış oranı: %${formatTurkishNumber(percent)}`
  ]);
}

const todayUtc = (now: Date): Date => new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

export function calculateAge(values: CalculatorValues, now = new Date()): CalculatorResult {
  const birth = dateValue(values, "birthDate", "Doğum tarihi");
  const today = todayUtc(now);
  if (birth > today) throw new Error("Doğum tarihi gelecekte olamaz.");
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const birthMonth = birth.getUTCMonth();
  const birthDay = birthMonth === 1 && birth.getUTCDate() === 29 && !isLeapYear(today.getUTCFullYear())
    ? 28
    : birth.getUTCDate();
  const monthDiff = today.getUTCMonth() - birthMonth;
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birthDay)) age--;
  return result("Yaşınız", age, "yıl");
}

export function calculateDateDifference(values: CalculatorValues): CalculatorResult {
  const start = dateValue(values, "startDate", "Başlangıç tarihi");
  const end = dateValue(values, "endDate", "Bitiş tarihi");
  return result("Gün farkı", Math.abs(end.getTime() - start.getTime()) / 86_400_000, "gün");
}

function calculateDateOffset(values: CalculatorValues, direction: 1 | -1): CalculatorResult {
  const date = dateValue(values, "date", "Başlangıç tarihi");
  const days = requiredNumber(values, "days", "Gün sayısı");
  if (!Number.isSafeInteger(days) || days < 0) throw new Error("Gün sayısı sıfır veya daha büyük bir tam sayı olmalıdır.");
  date.setUTCDate(date.getUTCDate() + direction * days);
  if (!Number.isFinite(date.getTime())) throw new Error("Hesaplanan tarih desteklenen takvim aralığının dışında.");
  const displayValue = `${date.getUTCDate().toString().padStart(2, "0")}.${(date.getUTCMonth() + 1).toString().padStart(2, "0")}.${date.getUTCFullYear()}`;
  return { label: "Yeni tarih", value: date.getTime(), displayValue };
}

export function calculateAddDays(values: CalculatorValues): CalculatorResult {
  return calculateDateOffset(values, 1);
}

export function calculateSubtractDays(values: CalculatorValues): CalculatorResult {
  return calculateDateOffset(values, -1);
}

export function calculateDaysUntilBirthday(values: CalculatorValues, now = new Date()): CalculatorResult {
  const birth = dateValue(values, "birthDate", "Doğum tarihi");
  const today = todayUtc(now);
  if (birth > today) throw new Error("Doğum tarihi gelecekte olamaz.");
  let year = today.getUTCFullYear();
  const month = birth.getUTCMonth();
  let day = birth.getUTCDate();
  if (month === 1 && day === 29 && !isLeapYear(year)) day = 28;
  let nextBirthday = new Date(Date.UTC(year, month, day));
  if (nextBirthday < today) {
    year++;
    day = month === 1 && birth.getUTCDate() === 29 && !isLeapYear(year) ? 28 : birth.getUTCDate();
    nextBirthday = new Date(Date.UTC(year, month, day));
  }
  return result("Kalan süre", (nextBirthday.getTime() - today.getTime()) / 86_400_000, "gün");
}

export function calculatePregnancyWeeks(values: CalculatorValues, now = new Date()): CalculatorResult {
  const lastPeriod = dateValue(values, "lastPeriod", "Son adet tarihi");
  const today = todayUtc(now);
  if (lastPeriod > today) throw new Error("Son adet tarihi gelecekte olamaz.");
  const elapsedDays = (today.getTime() - lastPeriod.getTime()) / 86_400_000;
  const weeks = Math.floor(elapsedDays / 7);
  const days = elapsedDays % 7;
  const estimatedDueDate = new Date(lastPeriod);
  estimatedDueDate.setUTCDate(estimatedDueDate.getUTCDate() + 280);
  if (!Number.isFinite(estimatedDueDate.getTime())) throw new Error("Tahmini tarih desteklenen takvim aralığının dışında.");
  const dueDateLabel = `${estimatedDueDate.getUTCDate().toString().padStart(2, "0")}.${(estimatedDueDate.getUTCMonth() + 1).toString().padStart(2, "0")}.${estimatedDueDate.getUTCFullYear().toString().padStart(4, "0")}`;
  return result("Tahmini gebelik haftası", weeks + days / 7, "hafta", [
    `Yaklaşık ${weeks} hafta ${days} gün.`,
    `Son adet tarihine göre tahmini doğum tarihi: ${dueDateLabel} (280 gün hesabı).`,
    "Bu sonuç yaklaşık bilgilendirme içindir; gebelik haftası ve doğum tarihi için sağlık uzmanının değerlendirmesi esas alınmalıdır."
  ]);
}

export function calculateGradeAverage(values: CalculatorValues): CalculatorResult {
  return calculateCourseAverage({ ...values, averageMode: "equal" });
}

export function calculateExamScore(values: CalculatorValues): CalculatorResult {
  const correct = requiredNumber(values, "correct", "Doğru sayısı");
  const wrong = requiredNumber(values, "wrong", "Yanlış sayısı");
  const total = requiredNumber(values, "total", "Toplam soru sayısı");
  if (![correct, wrong, total].every(Number.isSafeInteger) || correct < 0 || wrong < 0 || total <= 0 || correct + wrong > total) {
    throw new Error("Soru sayıları tam sayı olmalı ve doğru ile yanlış toplamı toplam soru sayısını aşmamalıdır.");
  }
  const penaltyRaw = values["wrongPenalty"] ?? "4";
  const penalty = penaltyRaw === "custom" ? requiredNumber(values, "customPenalty", "Yanlış götürme katsayısı") : Number(penaltyRaw);
  if (!Number.isFinite(penalty) || penalty < 0 || (penalty !== 0 && penalty > 100)) throw new Error("Yanlış götürme katsayısı 0 veya 0 ile 100 arasında olmalıdır.");
  const net = correct - (penalty === 0 ? 0 : wrong / penalty);
  return result("Net", net, "net", [
    `Basit net / toplam soru oranı: ${formatTurkishNumber(net / total * 100)}%. Bu oran resmî sınav puanı değildir.`,
    penalty === 0 ? "Yanlış cevaplar netten düşülmedi." : `Her ${formatTurkishNumber(penalty)} yanlış 1 doğruyu götürür.`
  ]);
}

export function calculateSuccessPercentage(values: CalculatorValues): CalculatorResult {
  const achieved = requiredNumber(values, "achieved", "Doğru veya tamamlanan sayısı");
  const total = requiredNumber(values, "total", "Toplam sayı");
  if (achieved < 0 || total <= 0 || achieved > total) throw new Error("Toplam sıfırdan büyük olmalı; gerçekleşen değer sıfırdan küçük olmamalı ve toplamı aşmamalıdır.");
  return result("Başarı oranı", achieved / total * 100, "%");
}

export function calculateLetterGrade(values: CalculatorValues): CalculatorResult {
  const grade = requiredNumber(values, "grade", "Not");
  if (grade < 0 || grade > 100) throw new Error("Not 0 ile 100 arasında olmalıdır.");
  const letter = grade >= 90 ? "AA" : grade >= 85 ? "BA" : grade >= 80 ? "BB" : grade >= 75 ? "CB" : grade >= 70 ? "CC" : grade >= 60 ? "DC" : grade >= 50 ? "DD" : "FF";
  return {
    label: "Harf notu",
    value: grade,
    displayValue: letter,
    details: [`${formatTurkishNumber(grade)} puan`, "Yaygın 100'lük not sistemi eşikleri kullanılmıştır; kurumunuzun yönetmeliğini kontrol edin."]
  };
}

export function calculateCourseAverage(values: CalculatorValues): CalculatorResult {
  const count = Math.min(30, Math.max(1, Number(values["_rowCount"] ?? 3)));
  const rows: { name: string; grade: number; credit: number }[] = [];
  for (let number = 1; number <= count; number++) {
    const rawGrade = values[`grade${number}`]?.trim() ?? "";
    const name = values[`courseName${number}`]?.trim() || `${number}. ders`;
    const rawCredit = values[`credit${number}`]?.trim() ?? "";
    if (!rawGrade && !rawCredit) continue;
    if (!rawGrade) throw new Error(`${name}: not alanını doldurun.`);
    const grade = parseTurkishNumber(rawGrade);
    if (!Number.isFinite(grade) || grade < 0 || grade > 100) throw new Error(`${name}: not 0 ile 100 arasında olmalıdır.`);
    const credit = values["averageMode"] === "weighted" ? parseTurkishNumber(rawCredit) : 1;
    if (values["averageMode"] === "weighted" && (!Number.isFinite(credit) || credit <= 0)) throw new Error(`${name}: ağırlık sıfırdan büyük olmalıdır.`);
    rows.push({ name, grade, credit });
  }
  if (!rows.length) throw new Error("En az bir geçerli not girin.");
  const credits = rows.reduce((sum, row) => sum + row.credit, 0);
  const average = rows.reduce((sum, row) => sum + row.grade * row.credit, 0) / credits;
  return result("Ders ortalaması", average, "puan", [
    `${rows.length} ders üzerinden ${values["averageMode"] === "weighted" ? "girilen kredi/ders saati ağırlıklarıyla" : "eşit ağırlıkla"} hesaplandı.`
  ]);
}

export function calculateSquareMeters(values: CalculatorValues): CalculatorResult {
  const shape = values["shape"] || "rectangle";
  const positiveMeasure = (key: string, label: string) => {
    const measure = requiredNumber(values, key, label);
    if (measure <= 0) throw new Error(`${label} sıfırdan büyük olmalıdır.`);
    return measure;
  };
  let area: number;
  if (shape === "rectangle") {
    area = positiveMeasure("width", "En") * positiveMeasure("length", "Boy");
  } else if (shape === "square") {
    const side = positiveMeasure("side", "Kenar uzunluğu");
    area = side * side;
  } else if (shape === "triangle") {
    area = positiveMeasure("base", "Taban uzunluğu") * positiveMeasure("height", "Yükseklik") / 2;
  } else if (shape === "circle") {
    const radius = positiveMeasure("radius", "Yarıçap");
    area = Math.PI * radius ** 2;
  } else if (shape === "trapezoid") {
    area = (positiveMeasure("base", "Alt taban uzunluğu") + positiveMeasure("upperBase", "Üst taban uzunluğu"))
      * positiveMeasure("height", "Yükseklik") / 2;
  } else {
    throw new Error("Geçerli bir geometrik şekil seçin.");
  }
  if (area <= 0) throw new Error("Ölçüler sıfırdan büyük olmalıdır.");
  return result("Alan", area, "m²", [`Şekil: ${shape === "rectangle" ? "Dikdörtgen" : shape === "square" ? "Kare" : shape === "triangle" ? "Üçgen" : shape === "circle" ? "Daire" : "Yamuk"}.`]);
}

const letterGradePoints: Record<string, number> = { AA: 4, BA: 3.5, BB: 3, CB: 2.5, CC: 2, DC: 1.5, DD: 1, FD: 0.5, FF: 0 };

export function calculateUnifiedGpa(values: CalculatorValues): CalculatorResult {
  const count = Math.min(30, Math.max(1, Number(values["_rowCount"] ?? 2)));
  const system = values["gradeSystem"] === "100" ? "100" : "4";
  const rows: { name: string; grade: number; credit: number }[] = [];
  for (let number = 1; number <= count; number++) {
    const rawGrade = values[`grade${number}`]?.trim() ?? "";
    const rawCredit = values[`credit${number}`]?.trim() ?? "";
    if (!rawGrade && !rawCredit) continue;
    const name = values[`courseName${number}`]?.trim() || `${number}. ders`;
    if (!rawGrade) throw new Error(`${name}: not alanını doldurun.`);
    if (!rawCredit) throw new Error(`${name}: kredi alanını doldurun.`);
    const credit = parseTurkishNumber(rawCredit);
    if (!Number.isFinite(credit) || credit <= 0) throw new Error(`${name}: kredi sıfırdan büyük olmalıdır.`);
    const grade = system === "4" && values["gradeEntry"] !== "score"
      ? letterGradePoints[rawGrade]
      : parseTurkishNumber(rawGrade);
    const maximum = system === "4" ? 4 : 100;
    if (!Number.isFinite(grade) || grade < 0 || grade > maximum) {
      throw new Error(`${name}: not ${system === "4" ? "0 ile 4" : "0 ile 100"} arasında olmalıdır.`);
    }
    rows.push({ name, grade, credit });
  }
  if (!rows.length) throw new Error("En az bir ders için kredi ve not girin.");
  const totalCredits = rows.reduce((sum, row) => sum + row.credit, 0);
  const average = rows.reduce((sum, row) => sum + row.grade * row.credit, 0) / totalCredits;
  return result(system === "4" ? "Ağırlıklı genel not ortalaması (GANO)" : "Ağırlıklı not ortalaması", average, system === "4" ? "/ 4,00" : "/ 100", [
    `${rows.length} ders ve toplam ${formatTurkishNumber(totalCredits)} kredi üzerinden hesaplandı.`,
    system === "4" ? "Harf notu karşılıkları yaygın örnek değerlerdir; kurumunuzun yönetmeliği farklı olabilir." : "Üniversitenizin kredi, yuvarlama ve değerlendirme kurallarını kontrol edin."
  ]);
}

export function calculateUniversalUnitConversion(values: CalculatorValues): CalculatorResult {
  const amount = requiredNumber(values, "amount", "Miktar");
  const category = unitGroups.find((group) => group.value === values["category"]);
  const from = category?.units.find((unit) => unit.value === values["fromUnit"]);
  const to = category?.units.find((unit) => unit.value === values["toUnit"]);
  if (!category || !from || !to) throw new Error("Seçilen kategoriye uygun başlangıç ve hedef birimleri seçin.");
  if (category.value === "temperature") {
    const absoluteZero = from.value === "k" ? 0 : from.value === "f" ? -459.67 : -273.15;
    if (amount < absoluteZero) throw new Error("Sıcaklık mutlak sıfırın altında olamaz.");
  } else if (amount < 0) {
    throw new Error("Ölçü miktarı negatif olamaz.");
  }
  let converted: number;
  if (category.value === "temperature") {
    const celsius = from.value === "c" ? amount : from.value === "f" ? (amount - 32) * 5 / 9 : amount - 273.15;
    converted = to.value === "c" ? celsius : to.value === "f" ? celsius * 9 / 5 + 32 : celsius + 273.15;
  } else {
    converted = amount * from.factor / to.factor;
  }
  if (!Number.isFinite(converted)) throw new Error("Bu miktar için dönüşüm yapılamıyor.");
  return result("Dönüştürülmüş değer", converted, to.label, [`${formatTurkishNumber(amount)} ${from.label} = ${formatTurkishNumber(converted)} ${to.label}`]);
}

export function calculateBmi(values: CalculatorValues): CalculatorResult {
  const height = requiredNumber(values, "height", "Boy");
  const weight = requiredNumber(values, "weight", "Kilo");
  if (height <= 0 || weight <= 0) throw new Error("Boy ve kilo sıfırdan büyük olmalıdır.");
  const meters = height > 3 ? height / 100 : height;
  const bmi = weight / (meters * meters);
  const category = bmi < 18.5 ? "Düşük" : bmi < 25 ? "Normal aralık" : bmi < 30 ? "Yüksek" : "Çok yüksek";
  return result("Vücut kitle indeksi", bmi, "", [`Sonuç aralığı: ${category}. Bu değer tek başına tıbbi değerlendirme yerine geçmez.`]);
}

export function calculateVolumeConversion(values: CalculatorValues): CalculatorResult {
  const amount = requiredNumber(values, "amount", "Miktar");
  const conversion = values["conversion"];
  if (amount < 0) throw new Error("Miktar negatif olamaz.");
  if (conversion === "ml-to-l") return result("Litre", amount / 1000, "L");
  if (conversion === "l-to-ml") return result("Mililitre", amount * 1000, "ml");
  if (conversion === "l-to-m3") return result("Metreküp", amount / 1000, "m³");
  throw new Error("Geçerli bir dönüşüm seçin.");
}

export function calculateWeightConversion(values: CalculatorValues): CalculatorResult {
  const amount = requiredNumber(values, "amount", "Miktar");
  const conversion = values["conversion"];
  if (amount < 0) throw new Error("Miktar negatif olamaz.");
  if (conversion === "kg-to-g") return result("Gram", amount * 1000, "g");
  if (conversion === "g-to-kg") return result("Kilogram", amount / 1000, "kg");
  if (conversion === "kg-to-ton") return result("Ton", amount / 1000, "t");
  throw new Error("Geçerli bir dönüşüm seçin.");
}

export function calculateTimeConversion(values: CalculatorValues): CalculatorResult {
  const amount = requiredNumber(values, "amount", "Süre");
  const conversion = values["conversion"];
  if (amount < 0) throw new Error("Süre negatif olamaz.");
  if (conversion === "hours-to-minutes") return result("Dakika", amount * 60, "dk");
  if (conversion === "minutes-to-hours") return result("Saat", amount / 60, "saat");
  if (conversion === "minutes-to-seconds") return result("Saniye", amount * 60, "sn");
  throw new Error("Geçerli bir dönüşüm seçin.");
}

export function calculateFourPointGpa(values: CalculatorValues): CalculatorResult {
  const gradePoints: Record<string, number> = {
    AA: 4, BA: 3.5, BB: 3, CB: 2.5, CC: 2, DC: 1.5, DD: 1, FD: 0.5, FF: 0
  };
  let weightedPoints = 0;
  let totalCredits = 0;
  let courseCount = 0;
  const count = Math.min(30, Math.max(1, Number(values["_rowCount"] ?? 5)));

  for (let course = 1; course <= count; course++) {
    const grade = values[`grade${course}`]?.trim() ?? "";
    const rawCredit = values[`credit${course}`]?.trim() ?? "";
    if (!grade && !rawCredit) continue;
    if (!grade || !rawCredit) throw new Error(`${course}. ders için harf notu ve kredi bilgisini birlikte girin.`);
    const credit = parseTurkishNumber(rawCredit);
    if (!Number.isFinite(credit) || credit <= 0) throw new Error(`${course}. ders kredisi sıfırdan büyük geçerli bir sayı olmalıdır.`);
    if (!Object.prototype.hasOwnProperty.call(gradePoints, grade)) throw new Error(`${course}. ders için geçerli bir harf notu seçin.`);
    weightedPoints += gradePoints[grade] * credit;
    totalCredits += credit;
    courseCount++;
  }

  if (courseCount === 0) throw new Error("En az bir dersin harf notunu ve kredisini girin.");
  const previousCreditsRaw = values["previousCredits"]?.trim() ?? "";
  const previousGpaRaw = values["previousGpa"]?.trim() ?? "";
  if (Boolean(previousCreditsRaw) !== Boolean(previousGpaRaw)) throw new Error("Kümülatif ortalama için önceki toplam kredi ve ortalamayı birlikte girin.");
  let average = weightedPoints / totalCredits;
  let cumulativeDetail = "";
  if (previousCreditsRaw && previousGpaRaw) {
    const previousCredits = parseTurkishNumber(previousCreditsRaw);
    const previousGpa = parseTurkishNumber(previousGpaRaw);
    if (!Number.isFinite(previousCredits) || previousCredits <= 0 || !Number.isFinite(previousGpa) || previousGpa < 0 || previousGpa > 4) {
      throw new Error("Önceki kredi pozitif, önceki ortalama 0 ile 4 arasında olmalıdır.");
    }
    average = (weightedPoints + previousCredits * previousGpa) / (totalCredits + previousCredits);
    cumulativeDetail = `Önceki kayıtlarla birlikte toplam ${formatTurkishNumber(totalCredits + previousCredits)} kredi üzerinden kümülatif sonuç.`;
  }
  return result(previousCreditsRaw ? "Kümülatif 4'lük genel ortalama" : "4'lük sistemde ağırlıklı not ortalaması", average, " / 4,00", [
    `${courseCount} yeni ders ve ${formatTurkishNumber(totalCredits)} yeni kredi üzerinden hesaplandı.`,
    ...(cumulativeDetail ? [cumulativeDetail] : []),
    "AA=4,00; BA=3,50; BB=3,00; CB=2,50; CC=2,00; DC=1,50; DD=1,00; FD=0,50; FF=0,00. Üniversitenizin katsayı tablosu farklı olabilir."
  ]);
}

export function calculateWeightedGrade(values: CalculatorValues): CalculatorResult {
  let weightedTotal = 0;
  let totalWeight = 0;
  const count = Math.min(30, Math.max(1, Number(values["_rowCount"] ?? 3)));
  let assessmentCount = 0;
  for (let exam = 1; exam <= count; exam++) {
    const rawScore = values[`score${exam}`]?.trim() ?? "";
    const rawWeight = values[`weight${exam}`]?.trim() ?? "";
    const name = values[`assessmentName${exam}`]?.trim() || `${exam}. değerlendirme`;
    if (!rawScore && !rawWeight) continue;
    if (!rawScore || !rawWeight) throw new Error(`${name}: not ve ağırlığı birlikte girin.`);
    const score = requiredNumber(values, `score${exam}`, `${name} notu`);
    const weight = requiredNumber(values, `weight${exam}`, `${name} ağırlığı`);
    if (score < 0 || score > 100) throw new Error("Sınav notları 0 ile 100 arasında olmalıdır.");
    if (weight < 0 || weight > 100) throw new Error("Sınav ağırlıkları %0 ile %100 arasında olmalıdır.");
    weightedTotal += score * weight;
    totalWeight += weight;
    assessmentCount++;
  }
  if (!assessmentCount) throw new Error("En az bir değerlendirme notu ve ağırlığı girin.");
  if (Math.abs(totalWeight - 100) > 0.001) throw new Error(`Sınav ağırlıklarının toplamı %100 olmalıdır. Şu anki toplam: %${formatTurkishNumber(totalWeight)}.`);
  return result("Ağırlıklı not ortalaması", weightedTotal / 100, "puan", [`${assessmentCount} değerlendirme; toplam ağırlık %${formatTurkishNumber(totalWeight)}.`]);
}

export function calculateRequiredFinalGrade(values: CalculatorValues): CalculatorResult {
  const currentGrade = requiredNumber(values, "currentGrade", "Mevcut ara sınav notu");
  const targetGrade = requiredNumber(values, "targetGrade", "Hedef dönem notu");
  const finalWeight = requiredNumber(values, "finalWeight", "Final sınavı ağırlığı");
  if (currentGrade < 0 || currentGrade > 100 || targetGrade < 0 || targetGrade > 100) {
    throw new Error("Notlar 0 ile 100 arasında olmalıdır.");
  }
  if (finalWeight <= 0 || finalWeight > 100) throw new Error("Final ağırlığı %0'dan büyük ve en fazla %100 olmalıdır.");
  const needed = (targetGrade - currentGrade * (100 - finalWeight) / 100) / (finalWeight / 100);
  if (needed <= 0) {
    return result("Hedef için gereken minimum final notu", 0, "puan", [
      "Ara sınav notunuzla hedef ortalamaya finalden 0 alınsa bile ulaşabilirsiniz."
    ]);
  }
  if (needed > 100) {
    return {
      label: "Hedef not",
      value: needed,
      displayValue: "Mümkün değil",
      details: [`Bu hedef için finalden ${formatTurkishNumber(needed)} puan gerekir; not aralığı 0–100 olduğundan hedef mevcut ağırlıklarla ulaşılamaz.`]
    };
  }
  return result("Hedef için gereken minimum final notu", needed, "puan", [
    `${formatTurkishNumber(currentGrade)} ara sınav notu ve finalin %${formatTurkishNumber(finalWeight)} ağırlığı ile hedef dönem notu ${formatTurkishNumber(targetGrade)} puandır.`,
    "Sınav notu tam sayı olarak veriliyorsa gereken değeri bir üst tam sayıya yuvarlayın."
  ]);
}

export function calculateLoanInstallment(values: CalculatorValues): CalculatorResult {
  const principal = requiredNumber(values, "principal", "Kredi tutarı");
  const monthlyRate = requiredNumber(values, "monthlyRate", "Aylık faiz oranı");
  const months = requiredNumber(values, "months", "Vade");
  if (principal <= 0 || monthlyRate < 0 || !Number.isSafeInteger(months) || months <= 0 || months > 1200) {
    throw new Error("Kredi tutarı ve faiz oranı geçerli olmalı; vade 1–1.200 tam ay arasında olmalıdır.");
  }
  const fee = values["fee"]?.trim() ? requiredNumber(values, "fee", "Aylık diğer gider") : 0;
  if (fee < 0) throw new Error("Aylık diğer gider negatif olamaz.");
  const rate = monthlyRate / 100;
  const baseInstallment = rate === 0
    ? principal / months
    : principal * rate * (1 + rate) ** months / ((1 + rate) ** months - 1);
  const payment = Math.round(baseInstallment * 100) / 100;
  let balance = Math.round(principal * 100) / 100;
  let interestTotal = 0;
  let principalTotal = 0;
  const rows: string[][] = [];
  for (let month = 1; month <= months; month++) {
    const interest = Math.round(balance * rate * 100) / 100;
    const principalPaid = month === months
      ? balance
      : Math.min(balance, Math.round((payment - interest) * 100) / 100);
    const installment = Math.round((interest + principalPaid) * 100) / 100;
    balance = Math.max(0, Math.round((balance - principalPaid) * 100) / 100);
    interestTotal += interest;
    principalTotal += principalPaid;
    rows.push([
      String(month),
      `${formatTurkishNumber(installment)} ₺`,
      `${formatTurkishNumber(interest)} ₺`,
      `${formatTurkishNumber(principalPaid)} ₺`,
      `${formatTurkishNumber(balance)} ₺`
    ]);
  }
  const totalRepayment = principalTotal + interestTotal + fee * months;
  return {
    label: "Tahmini aylık taksit",
    value: payment + fee,
    unit: "₺",
    details: [
      `Temel aylık taksit: ${formatTurkishNumber(payment)} ₺; aylık ek gider: ${formatTurkishNumber(fee)} ₺; toplam geri ödeme: ${formatTurkishNumber(totalRepayment)} ₺.`,
      `Toplam faiz: ${formatTurkishNumber(interestTotal)} ₺. Vergi, sigorta, tahsis ücreti ve banka koşulları dahil değildir. Son taksit kuruş yuvarlamasına göre ayarlanmıştır.`
    ],
    table: {
      headers: ["Ay", "Taksit", "Faiz", "Anapara", "Kalan borç"],
      rows
    }
  };
}

export function calculateCompoundInterest(values: CalculatorValues): CalculatorResult {
  const principal = requiredNumber(values, "principal", "Başlangıç tutarı");
  const annualRate = requiredNumber(values, "annualRate", "Yıllık getiri oranı");
  const years = requiredNumber(values, "years", "Süre");
  const periods = requiredNumber(values, "periods", "Yıllık bileşikleşme sayısı");
  if (principal < 0 || annualRate < 0 || years < 0 || !Number.isSafeInteger(periods) || periods <= 0) {
    throw new Error("Tutar ve oran negatif olamaz; süre sıfır veya daha büyük, bileşikleşme sayısı pozitif tam sayı olmalıdır.");
  }
  const endingBalance = principal * (1 + annualRate / 100 / periods) ** (periods * years);
  return result("Tahmini dönem sonu tutarı", endingBalance, "₺", [
    `Getiri: ${formatTurkishNumber(endingBalance - principal)} ₺`,
    "Düzenli ek ödeme, vergi, enflasyon ve işlem masrafları hesaba katılmaz; sonuç yatırım tavsiyesi değildir."
  ]);
}

export function calculateSimpleInterest(values: CalculatorValues): CalculatorResult {
  const principal = requiredNumber(values, "principal", "Anapara");
  const annualRate = requiredNumber(values, "annualRate", "Yıllık faiz oranı");
  const days = requiredNumber(values, "days", "Süre");
  if (principal < 0 || annualRate < 0 || !Number.isSafeInteger(days) || days < 0) {
    throw new Error("Anapara ve faiz oranı negatif olamaz; süre sıfır veya daha büyük tam sayı olmalıdır.");
  }
  const interest = principal * annualRate / 100 * days / 365;
  return result("Tahmini basit faiz getirisi", interest, "₺", [
    `Tahmini dönem sonu tutarı: ${formatTurkishNumber(principal + interest)} ₺`,
    "365 günlük yıl varsayımı kullanılır; vergi, masraf ve kurum koşulları dahil değildir."
  ]);
}

export function calculateCurrencyConversion(values: CalculatorValues): CalculatorResult {
  const amount = requiredNumber(values, "amount", "Döviz tutarı");
  const rate = requiredNumber(values, "exchangeRate", "TCMB satış kuru");
  const unit = requiredNumber(values, "exchangeUnit", "Kur birimi");
  const currency = values["currency"]?.trim() ?? "";
  const allowedCurrencies = ["USD", "EUR", "GBP", "CHF", "JPY"];
  if (!allowedCurrencies.includes(currency)) throw new Error("Desteklenen bir döviz türü seçin.");
  if (amount < 0 || rate <= 0 || !Number.isSafeInteger(unit) || unit <= 0) {
    throw new Error("Döviz tutarı negatif olamaz; kur ve kur birimi geçerli olmalıdır.");
  }
  const direction = values["direction"] || "to-try";
  if (direction !== "to-try" && direction !== "from-try") throw new Error("Geçerli bir dönüşüm yönü seçin.");
  const converted = direction === "to-try" ? amount * rate / unit : amount * unit / rate;
  return result(direction === "to-try" ? "Yaklaşık Türk lirası karşılığı" : `Yaklaşık ${currency} karşılığı`, converted, direction === "to-try" ? "₺" : currency, [
    `TCMB ${values["rateDate"] || "güncel"} tarihli ${currency} ForexSelling kuru: ${formatTurkishNumber(rate)} ₺ / ${unit} ${currency}.`,
    direction === "to-try"
      ? "Bu gösterge niteliğindeki TCMB satış kurudur; banka, ödeme kuruluşu veya döviz bürosu kuru ve işlem masrafları farklı olabilir."
      : "TL tutarı aynı gösterge satış kuruna bölünerek yaklaşık döviz karşılığı hesaplandı; bu işlem bankanın alış kuru veya piyasa işlem tutarı değildir."
  ]);
}

export function calculateFuelConsumption(values: CalculatorValues): CalculatorResult {
  const distance = requiredNumber(values, "distance", "Mesafe");
  const fuel = requiredNumber(values, "fuel", "Harcanan yakıt");
  const price = requiredNumber(values, "price", "Litre fiyatı");
  if (distance <= 0 || fuel < 0 || price < 0) throw new Error("Mesafe sıfırdan büyük olmalı; yakıt ve litre fiyatı negatif olmamalıdır.");
  const consumption = fuel / distance * 100;
  return result("Ortalama yakıt tüketimi", consumption, "L/100 km", [
    `Yakıt maliyeti: ${formatTurkishNumber(fuel * price)} ₺`,
    `Yakıt maliyeti kilometre başına: ${formatTurkishNumber(fuel * price / distance)} ₺/km`
  ]);
}

export function calculateElectricityCost(values: CalculatorValues): CalculatorResult {
  const deviceMode = values["mode"] === "device";
  const usage = deviceMode
    ? requiredNumber(values, "watts", "Cihaz gücü") / 1000
      * requiredNumber(values, "hoursPerDay", "Günlük kullanım")
      * requiredNumber(values, "days", "Gün sayısı")
    : requiredNumber(values, "usage", "Elektrik tüketimi");
  const unitPrice = requiredNumber(values, "unitPrice", "Birim fiyat");
  if (usage < 0 || unitPrice < 0 || (deviceMode && (requiredNumber(values, "watts", "Cihaz gücü") <= 0 || requiredNumber(values, "hoursPerDay", "Günlük kullanım") > 24 || requiredNumber(values, "days", "Gün sayısı") <= 0))) {
    throw new Error("Tüketim ve birim fiyat negatif olamaz; günlük cihaz kullanımı 0 ile 24 saat arasında, gün sayısı pozitif olmalıdır.");
  }
  return result("Tahmini enerji bedeli", usage * unitPrice, "₺", [
    `${formatTurkishNumber(usage)} kWh × ${formatTurkishNumber(unitPrice)} ₺/kWh`,
    ...(deviceMode ? [`Cihaz tüketimi: güç × günlük saat × gün = ${formatTurkishNumber(usage)} kWh.`] : []),
    "Vergi, dağıtım bedeli, kademe, fon ve diğer tarife kalemleri dahil değildir; fatura tutarı farklı olabilir."
  ]);
}

export function calculateBusinessDays(values: CalculatorValues): CalculatorResult {
  const start = dateValue(values, "startDate", "Başlangıç tarihi");
  const end = dateValue(values, "endDate", "Bitiş tarihi");
  if (start > end) throw new Error("Başlangıç tarihi bitiş tarihinden sonra olamaz.");
  const includeStart = values["includeStart"] === "yes";
  const includeEnd = values["includeEnd"] !== "no";
  const saturday = values["saturday"] === "yes";
  const holidays = new Set((values["holidays"] ?? "").split(/[,\s]+/).filter(Boolean).map((value) => {
    parseDate(value, "Tatil tarihi");
    return value;
  }));
  let count = 0;
  for (let date = new Date(start); date <= end; date.setUTCDate(date.getUTCDate() + 1)) {
    const isStart = date.getTime() === start.getTime();
    const isEnd = date.getTime() === end.getTime();
    if ((isStart && !includeStart) || (isEnd && !includeEnd)) continue;
    const weekday = date.getUTCDay();
    if ((weekday !== 0 && (weekday !== 6 || saturday)) && !holidays.has(date.toISOString().slice(0, 10))) count++;
  }
  return result("İş günü farkı", count, "iş günü", [
    `Başlangıç ${includeStart ? "dahil" : "hariç"}, bitiş ${includeEnd ? "dahil" : "hariç"}; cumartesi ${saturday ? "iş günü" : "hariç"}.`,
    holidays.size ? `${holidays.size} kullanıcı tanımlı tam gün tatil çıkarıldı.` : "Resmî tatiller otomatik tanınmaz. Yarım gün tatilleri ayrıca hesaplanmaz."
  ]);
}

export function calculateMarketplaceProfit(values: CalculatorValues): CalculatorResult {
  const salePrice = requiredNumber(values, "salePrice", "Liste satış fiyatı");
  const productCost = requiredNumber(values, "productCost", "Ürün maliyeti");
  const discount = requiredNumber(values, "discountPercent", "İndirim oranı");
  const commissionRate = requiredNumber(values, "commissionRate", "Komisyon oranı");
  const shipping = requiredNumber(values, "shipping", "Kargo gideri");
  const extraExpenses = requiredNumber(values, "extraExpenses", "Diğer giderler");
  if ([salePrice, productCost, shipping, extraExpenses].some((value) => value < 0)
    || discount < 0 || discount > 100 || commissionRate < 0 || commissionRate > 100) {
    throw new Error("Fiyat ve giderler negatif olamaz; indirim ve komisyon oranları %0–%100 arasında olmalıdır.");
  }
  const discountedPrice = salePrice * (1 - discount / 100);
  const commissionBasis = values["commissionBasis"] === "list" ? salePrice : discountedPrice;
  const commission = commissionBasis * commissionRate / 100;
  const profit = discountedPrice - productCost - commission - shipping - extraExpenses;
  const details = [
    `İndirim sonrası satış: ${formatTurkishNumber(discountedPrice)} ₺; komisyon: ${formatTurkishNumber(commission)} ₺ (${values["commissionBasis"] === "list" ? "liste fiyatı" : "indirimli fiyat"} üzerinden).`,
    `Satış fiyatına göre kâr marjı: ${discountedPrice === 0 ? "hesaplanamaz (satış tutarı sıfır)" : `%${formatTurkishNumber(profit / discountedPrice * 100)}`}.`,
    `Ürün maliyetine göre kâr oranı: ${productCost === 0 ? "hesaplanamaz (ürün maliyeti sıfır)" : `%${formatTurkishNumber(profit / productCost * 100)}`}.`,
    "Vergi, iade, reklam ve platform kesintileri yalnızca yukarıdaki giderlere girildiyse dahildir."
  ];
  return result("Girilen giderlere göre tahmini kâr", profit, "₺", details);
}

export function calculateUnitPriceComparison(values: CalculatorValues): CalculatorResult {
  const count = Math.min(30, Math.max(2, Number(values["_rowCount"] ?? 2)));
  const units: Record<string, { group: string; factor: number; display: string }> = {
    kg: { group: "mass", factor: 1000, display: "g" },
    g: { group: "mass", factor: 1, display: "g" },
    l: { group: "volume", factor: 1000, display: "ml" },
    ml: { group: "volume", factor: 1, display: "ml" },
    adet: { group: "count", factor: 1, display: "adet" },
    m: { group: "length", factor: 100, display: "cm" },
    cm: { group: "length", factor: 1, display: "cm" }
  };
  const products: { name: string; price: number; unitPrice: number; displayUnit: string; group: string }[] = [];
  for (let index = 1; index <= count; index++) {
    const rawPrice = values[`price${index}`]?.trim() ?? "";
    const rawQuantity = values[`quantity${index}`]?.trim() ?? "";
    const name = values[`productName${index}`]?.trim() || `${index}. ürün`;
    if (!rawPrice && !rawQuantity) continue;
    if (!rawPrice || !rawQuantity) throw new Error(`${name}: fiyat ve miktarı birlikte girin.`);
    const price = requiredNumber(values, `price${index}`, `${name} fiyatı`);
    const quantity = requiredNumber(values, `quantity${index}`, `${name} miktarı`);
    const packages = values[`packages${index}`]?.trim() ? requiredNumber(values, `packages${index}`, `${name} paket adedi`) : 1;
    const unit = units[values[`unit${index}`] || "kg"];
    if (price < 0 || quantity <= 0 || packages <= 0 || !Number.isSafeInteger(packages) || !unit) {
      throw new Error(`${name}: fiyat negatif olamaz; miktar ve tam paket adedi pozitif, birim geçerli olmalıdır.`);
    }
    products.push({ name, price, unitPrice: price / (quantity * packages * unit.factor), displayUnit: unit.display, group: unit.group });
  }
  if (products.length < 2) throw new Error("En az iki ürünün fiyat ve miktarını girin.");
  if (products.some((product) => product.group !== products[0].group)) {
    throw new Error("Karşılaştırılan ürünlerin miktar birimleri aynı türde olmalıdır.");
  }
  const ranked = [...products].sort((a, b) => a.unitPrice - b.unitPrice);
  const winner = ranked[0];
  const details = [
    `En ekonomik seçenek: ${winner.name}, ${formatTurkishNumber(winner.unitPrice)} ₺/${winner.displayUnit}.`,
    ...(ranked[1] ? [`Bir sonraki seçeneğe göre fark: ${formatTurkishNumber(ranked[1].unitPrice - winner.unitPrice)} ₺/${winner.displayUnit}.`] : [])
  ];
  return {
    label: "En düşük birim fiyat",
    value: winner.unitPrice,
    unit: `₺/${winner.displayUnit}`,
    details,
    table: {
      headers: ["Ürün", `Birim fiyat (₺/${winner.displayUnit})`],
      rows: ranked.map((item) => [item.name, formatTurkishNumber(item.unitPrice)])
    }
  };
}

export function calculateMonthlySavings(values: CalculatorValues): CalculatorResult {
  const principal = requiredNumber(values, "principal", "Başlangıç tutarı");
  const contribution = requiredNumber(values, "contribution", "Aylık katkı");
  const annualRate = requiredNumber(values, "annualRate", "Varsayımsal yıllık oran");
  const months = requiredNumber(values, "months", "Süre");
  const targetRaw = values["target"]?.trim() ?? "";
  const target = targetRaw ? parseTurkishNumber(targetRaw) : undefined;
  if (principal < 0 || contribution < 0 || annualRate < 0 || !Number.isSafeInteger(months) || months < 1 || months > 1200
    || (target !== undefined && (!Number.isFinite(target) || target <= 0))) {
    throw new Error("Tutarlar ve oran negatif olamaz; süre 1–1.200 tam ay, hedef tutar ise pozitif olmalıdır.");
  }
  const monthlyRate = annualRate / 1200;
  const beginning = values["timing"] === "beginning";
  let balance = principal;
  let totalContributions = principal;
  const rows: string[][] = [];
  for (let month = 1; month <= months; month++) {
    if (beginning) balance += contribution;
    balance *= 1 + monthlyRate;
    if (!beginning) balance += contribution;
    totalContributions += contribution;
    if (month % 12 === 0 || month === months) {
      rows.push([
        String(month),
        `${formatTurkishNumber(totalContributions)} ₺`,
        `${formatTurkishNumber(balance)} ₺`,
        `${formatTurkishNumber(balance - totalContributions)} ₺`
      ]);
    }
  }
  let targetMonths: number | null = target !== undefined && principal >= target ? 0 : null;
  if (target !== undefined && targetMonths === null) {
    let targetBalance = principal;
    for (let month = 1; month <= 1200; month++) {
      if (beginning) targetBalance += contribution;
      targetBalance *= 1 + monthlyRate;
      if (!beginning) targetBalance += contribution;
      if (!Number.isFinite(targetBalance)) break;
      if (targetBalance >= target) {
        targetMonths = month;
        break;
      }
    }
  }
  if (!Number.isFinite(balance)) throw new Error("Bu tutar ve oranla dönem sonu tutarı hesaplanamıyor.");
  return {
    label: "Varsayımsal dönem sonu tutarı",
    value: balance,
    unit: "₺",
    details: [
      `Toplam başlangıç ve katkı: ${formatTurkishNumber(totalContributions)} ₺; varsayımsal getiri: ${formatTurkishNumber(balance - totalContributions)} ₺.`,
      target === undefined
        ? "Hedef tutar girmediğiniz için hedefe ulaşma süresi hesaplanmadı."
        : targetMonths === null
          ? "Bu katkı ve oranla 1.200 ay içinde hedefe ulaşılamıyor."
          : `Hedefe ulaşma tahmini: ${targetMonths === 0 ? "başlangıçta" : `${targetMonths} ay içinde`}.`,
      "Oran sabit ve varsayımsal kabul edilir; getiri garanti değildir ve vergi, ücret, enflasyon veya piyasa değişimleri hesaba katılmaz."
    ],
    table: {
      headers: ["Ay", "Toplam katkı", "Tahmini bakiye", "Varsayımsal getiri"],
      rows
    }
  };
}

export function calculateTripCost(values: CalculatorValues): CalculatorResult {
  const distance = requiredNumber(values, "distance", "Tek yön mesafe");
  const consumption = requiredNumber(values, "consumption", "Araç tüketimi");
  const fuelPrice = requiredNumber(values, "fuelPrice", "Yakıt fiyatı");
  const otherCosts = requiredNumber(values, "otherCosts", "Diğer giderler");
  const people = requiredNumber(values, "people", "Yolcu sayısı");
  if (distance <= 0 || consumption < 0 || fuelPrice < 0 || otherCosts < 0 || !Number.isSafeInteger(people) || people <= 0) {
    throw new Error("Mesafe ve yolcu sayısı pozitif olmalı; tüketim ve fiyatlar negatif olmamalıdır.");
  }
  const multiplier = values["journey"] === "round-trip" ? 2 : 1;
  const fuelCost = distance * multiplier * consumption / 100 * fuelPrice;
  const total = fuelCost + otherCosts;
  return result("Tahmini toplam yolculuk maliyeti", total, "₺", [
    `Hesaplanan mesafe: ${formatTurkishNumber(distance * multiplier)} km; yakıt gideri: ${formatTurkishNumber(fuelCost)} ₺.`,
    `Kişi başı: ${formatTurkishNumber(total / people)} ₺ (${people} kişi). Mesafe ve fiyatlar sizin girişlerinize dayanır.`
  ]);
}

export function calculateDimensionalWeight(values: CalculatorValues): CalculatorResult {
  const width = requiredNumber(values, "width", "En");
  const length = requiredNumber(values, "length", "Boy");
  const height = requiredNumber(values, "height", "Yükseklik");
  const divisor = requiredNumber(values, "divisor", "Desi böleni");
  const unit = values["sizeUnit"];
  const factor = unit === "mm" ? 0.1 : unit === "m" ? 100 : unit === "cm" ? 1 : Number.NaN;
  const actualRaw = values["actualWeight"]?.trim() ?? "";
  const actualWeight = actualRaw ? parseTurkishNumber(actualRaw) : undefined;
  if (width <= 0 || length <= 0 || height <= 0 || divisor <= 0 || !Number.isFinite(factor)
    || (actualWeight !== undefined && (!Number.isFinite(actualWeight) || actualWeight < 0))) {
    throw new Error("Ölçüler ve desi böleni pozitif olmalı; birim geçerli, gerçek ağırlık ise sıfır veya daha büyük olmalıdır.");
  }
  const volume = width * factor * length * factor * height * factor;
  const volumetricWeight = volume / divisor;
  return result("Hacim ağırlığı", volumetricWeight, "kg", [
    `Paket hacmi: ${formatTurkishNumber(volume)} cm³; kullanılan desi böleni: ${formatTurkishNumber(divisor)}.`,
    actualWeight === undefined ? "Gerçek ağırlık girilmedi." : `Gerçek ağırlık: ${formatTurkishNumber(actualWeight)} kg; büyük değer: ${formatTurkishNumber(Math.max(actualWeight, volumetricWeight))} kg.`,
    "Taşıyıcıların bölen ve ücretlendirme kuralları farklı olabilir; sonuç gönderi ücreti değildir."
  ]);
}

type Calculator = (values: CalculatorValues, now: Date) => CalculatorResult;

const calculators: Record<string, Calculator> = {
  "yuzde-hesaplama": calculatePercentage,
  "maas-zam-hesaplama": calculateSalaryRaise,
  "indirim-hesaplama": calculateDiscount,
  "kdv-hesaplama": calculateVat,
  "kar-zarar-hesaplama": calculateProfitLoss,
  "maas-artis-hesaplama": calculateSalaryIncrease,
  "maas-zam-artis-hesaplama": calculateSalaryIncrease,
  "brut-net-maas-hesaplama": (values) => {
    const config = payrollConfigs[2026];
    if (!config) throw new Error("2026 bordro parametreleri tanımlı değil.");
    if (!isCompletePayrollConfig(config)) {
      throw new Error(`Hesaplama doğrulanmamış 2026 bordro parametreleri nedeniyle kullanılamıyor. Eksik resmî veriler: ${getPayrollConfigTodo(config).join("; ")}.`);
    }
    return calculatePayroll({
      amount: requiredNumber(values, "amount", "Maaş tutarı"),
      direction: values.direction ?? "",
      period: values.period ?? "",
      month: requiredNumber(values, "month", "Çalışma ayı"),
      disabilityDegree: values.disabilityDegree ?? "none"
    }, config);
  },
  "yas-hesaplama": calculateAge,
  "iki-tarih-arasi-gun-hesaplama": calculateDateDifference,
  "tarihe-gun-ekleme": calculateAddDays,
  "tarihten-gun-cikarma": calculateSubtractDays,
  "dogum-gunune-kalan-sure": calculateDaysUntilBirthday,
  "gebelik-haftasi-hesaplama": calculatePregnancyWeeks,
  "not-ortalamasi-hesaplama": calculateGradeAverage,
  "sinav-puani-hesaplama": calculateExamScore,
  "basari-yuzdesi-hesaplama": calculateSuccessPercentage,
  "harf-notu-hesaplama": calculateLetterGrade,
  "ders-ortalamasi-hesaplama": calculateCourseAverage,
  "not-ortalamasi-gano-hesaplama": calculateUnifiedGpa,
  "metrekare-hesaplama": calculateSquareMeters,
  "birim-donusturme": calculateUniversalUnitConversion,
  "boy-kilo-orani-hesaplama": calculateBmi,
  "litre-donusumu": calculateVolumeConversion,
  "kilogram-donusumu": calculateWeightConversion,
  "saat-dakika-donusturme": calculateTimeConversion,
  "dortluk-not-sistemi-hesaplama": calculateFourPointGpa,
  "agirlikli-not-ortalamasi-hesaplama": calculateWeightedGrade,
  "finalde-gerekli-not-hesaplama": calculateRequiredFinalGrade,
  "kredi-taksit-hesaplama": calculateLoanInstallment,
  "bilesik-faiz-hesaplama": calculateCompoundInterest,
  "basit-faiz-hesaplama": calculateSimpleInterest,
  "doviz-hesaplama": calculateCurrencyConversion,
  "yakit-tuketimi-hesaplama": calculateFuelConsumption,
  "elektrik-faturasi-hesaplama": calculateElectricityCost,
  "is-gunu-hesaplama": calculateBusinessDays,
  "pazaryeri-net-kar-hesaplama": calculateMarketplaceProfit,
  "birim-fiyat-karsilastirma": calculateUnitPriceComparison,
  "aylik-katkili-birikim-hesaplama": calculateMonthlySavings,
  "yolculuk-maliyeti-hesaplama": calculateTripCost,
  "desi-hacim-hesaplama": calculateDimensionalWeight
};

export function calculate(toolId: string, values: CalculatorValues, now = new Date()): CalculatorResult {
  if (!Object.prototype.hasOwnProperty.call(calculators, toolId)) throw new Error("Bu hesaplama aracı bulunamadı.");
  const calculator = calculators[toolId];
  return calculator(values, now);
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
