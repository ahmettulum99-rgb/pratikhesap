export type CalculatorResult = {
  label: string;
  value: number;
  unit?: string;
  displayValue?: string;
  details?: string[];
};

export type CalculatorValues = Record<string, string>;

const requiredNumber = (values: CalculatorValues, key: string, label = key): number => {
  const raw = values[key]?.trim();
  if (!raw) throw new Error(`${label} alanını doldurun.`);
  const value = parseTurkishNumber(raw);
  if (!Number.isFinite(value)) throw new Error(`${label} için geçerli bir sayı girin.`);
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
  const amount = requiredNumber(values, "amount", "Tutar");
  const percent = requiredNumber(values, "percent", "Yüzde");
  return result("Sonuç", amount * percent / 100, "", [`${formatTurkishNumber(amount)} tutarının %${formatTurkishNumber(percent)}'i`]);
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
  const increase = requiredNumber(values, "increase", "Artış tutarı");
  if (salary < 0 || increase < 0) throw new Error("Maaş ve artış tutarı negatif olamaz.");
  const percent = salary === 0 ? 0 : increase / salary * 100;
  return result("Yeni maaş", salary + increase, "₺", [
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
  const first = requiredNumber(values, "grade1", "1. not");
  const second = requiredNumber(values, "grade2", "2. not");
  if (first < 0 || second < 0 || first > 100 || second > 100) throw new Error("Notlar 0 ile 100 arasında olmalıdır.");
  return result("Not ortalaması", (first + second) / 2, "puan");
}

export function calculateExamScore(values: CalculatorValues): CalculatorResult {
  const correct = requiredNumber(values, "correct", "Doğru sayısı");
  const wrong = requiredNumber(values, "wrong", "Yanlış sayısı");
  const total = requiredNumber(values, "total", "Toplam soru sayısı");
  if (![correct, wrong, total].every(Number.isSafeInteger) || correct < 0 || wrong < 0 || total <= 0 || correct + wrong > total) {
    throw new Error("Soru sayıları tam sayı olmalı ve doğru ile yanlış toplamı toplam soru sayısını aşmamalıdır.");
  }
  const net = Math.max(0, correct - wrong / 4);
  return result("Sınav puanı", net / total * 100, "puan", [`Net sayısı (4 yanlış 1 doğruyu götürür): ${formatTurkishNumber(net)}`]);
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
  const grades = [1, 2, 3].map((number) => requiredNumber(values, `grade${number}`, `${number}. ders notu`));
  if (grades.some((grade) => grade < 0 || grade > 100)) throw new Error("Ders notları 0 ile 100 arasında olmalıdır.");
  return result("Ders ortalaması", grades.reduce((sum, grade) => sum + grade, 0) / grades.length, "puan");
}

export function calculateSquareMeters(values: CalculatorValues): CalculatorResult {
  const width = requiredNumber(values, "width", "En");
  const length = requiredNumber(values, "length", "Boy");
  if (width < 0 || length < 0) throw new Error("Ölçüler negatif olamaz.");
  return result("Alan", width * length, "m²");
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

  for (let course = 1; course <= 5; course++) {
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
  return result("4'lük sistemde ağırlıklı not ortalaması", weightedPoints / totalCredits, " / 4,00", [
    `${courseCount} ders ve ${formatTurkishNumber(totalCredits)} toplam kredi üzerinden hesaplandı.`,
    "AA=4,00; BA=3,50; BB=3,00; CB=2,50; CC=2,00; DC=1,50; DD=1,00; FD=0,50; FF=0,00. Üniversitenizin katsayı tablosu farklı olabilir."
  ]);
}

export function calculateWeightedGrade(values: CalculatorValues): CalculatorResult {
  let weightedTotal = 0;
  let totalWeight = 0;
  for (let exam = 1; exam <= 3; exam++) {
    const score = requiredNumber(values, `score${exam}`, `${exam}. sınav notu`);
    const weight = requiredNumber(values, `weight${exam}`, `${exam}. sınav ağırlığı`);
    if (score < 0 || score > 100) throw new Error("Sınav notları 0 ile 100 arasında olmalıdır.");
    if (weight < 0 || weight > 100) throw new Error("Sınav ağırlıkları %0 ile %100 arasında olmalıdır.");
    weightedTotal += score * weight;
    totalWeight += weight;
  }
  if (Math.abs(totalWeight - 100) > 0.001) throw new Error(`Sınav ağırlıklarının toplamı %100 olmalıdır. Şu anki toplam: %${formatTurkishNumber(totalWeight)}.`);
  return result("Ağırlıklı not ortalaması", weightedTotal / 100, "puan");
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
  if (principal <= 0 || monthlyRate < 0 || !Number.isSafeInteger(months) || months <= 0) {
    throw new Error("Kredi tutarı ve vade pozitif olmalı; faiz oranı negatif olmamalıdır.");
  }
  const rate = monthlyRate / 100;
  const installment = rate === 0
    ? principal / months
    : principal * rate * (1 + rate) ** months / ((1 + rate) ** months - 1);
  const totalRepayment = installment * months;
  return result("Tahmini aylık taksit", installment, "₺", [
    `Toplam geri ödeme: ${formatTurkishNumber(totalRepayment)} ₺`,
    `Toplam faiz: ${formatTurkishNumber(totalRepayment - principal)} ₺. Vergi, sigorta, tahsis ücreti ve diğer masraflar dahil değildir.`
  ]);
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
  const converted = amount * rate / unit;
  return result("Yaklaşık Türk lirası karşılığı", converted, "₺", [
    `TCMB ${values["rateDate"] || "güncel"} tarihli ${currency} ForexSelling kuru: ${formatTurkishNumber(rate)} ₺ / ${unit} ${currency}.`,
    "Bu gösterge niteliğindeki TCMB satış kurudur; banka, ödeme kuruluşu veya döviz bürosu kuru ve işlem masrafları farklı olabilir."
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
  const usage = requiredNumber(values, "usage", "Elektrik tüketimi");
  const unitPrice = requiredNumber(values, "unitPrice", "Birim fiyat");
  if (usage < 0 || unitPrice < 0) throw new Error("Tüketim ve birim fiyat negatif olamaz.");
  return result("Tahmini enerji bedeli", usage * unitPrice, "₺", [
    `${formatTurkishNumber(usage)} kWh × ${formatTurkishNumber(unitPrice)} ₺/kWh`,
    "Vergi, dağıtım bedeli, kademe, fon ve diğer tarife kalemleri dahil değildir; fatura tutarı farklı olabilir."
  ]);
}

export function calculateBusinessDays(values: CalculatorValues): CalculatorResult {
  const start = dateValue(values, "startDate", "Başlangıç tarihi");
  const end = dateValue(values, "endDate", "Bitiş tarihi");
  const firstDay = start < end ? start : end;
  const lastDay = start < end ? end : start;
  const dayCount = (lastDay.getTime() - firstDay.getTime()) / 86_400_000;
  const fullWeeks = Math.floor(dayCount / 7);
  const remainingDays = dayCount % 7;
  let count = fullWeeks * 5;
  for (let offset = 1; offset <= remainingDays; offset++) {
    const weekday = (firstDay.getUTCDay() + offset) % 7;
    if (weekday !== 0 && weekday !== 6) count++;
  }
  return result("İş günü farkı", count, "iş günü", [
    "Başlangıç tarihi sayılmaz; bitiş tarihi sayılır. Resmî ve yerel tatiller hesaba katılmaz."
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
  "metrekare-hesaplama": calculateSquareMeters,
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
  "is-gunu-hesaplama": calculateBusinessDays
};

export function calculate(toolId: string, values: CalculatorValues, now = new Date()): CalculatorResult {
  if (!Object.prototype.hasOwnProperty.call(calculators, toolId)) throw new Error("Bu hesaplama aracı bulunamadı.");
  const calculator = calculators[toolId];
  return calculator(values, now);
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
