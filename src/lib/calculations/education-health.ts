import { educationHealthConfig2026, type ExamYearConfig } from "../../data/education-health-config";
import { formatTurkishNumber, parseDate, requiredNumber, result, type CalculatorResult, type CalculatorValues } from "./index";

type ExamId = keyof typeof educationHealthConfig2026.exams;

export function calculateExamScore(
  values: CalculatorValues,
  examId: ExamId,
  config: ExamYearConfig = educationHealthConfig2026.exams[examId]
): CalculatorResult {
  const scoreType = examId === "lgs" ? "LGS" : values["scoreType"] ?? "";
  const weights = config.weights[scoreType];
  if (!weights) {
    throw new Error(`${config.year} ${examId.toUpperCase()} puan katsayıları resmî kılavuzdan doğrulanmadığı için puan hesaplaması geçici olarak kapalıdır. ${config.note}`);
  }
  let weightedScore = 0;
  for (const section of config.sections) {
    const net = requiredNumber(values, section.key, section.label);
    if (net < 0) throw new Error(`${section.label} negatif olamaz.`);
    const weight = weights[section.key];
    if (weight === undefined || !Number.isFinite(weight) || weight < 0) {
      throw new Error(`${section.label} için ${config.year} puan ağırlığı yapılandırmada bulunmuyor.`);
    }
    weightedScore += net * weight;
  }
  return result("Ağırlıklı net puan indeksi", weightedScore, "puan", [
    `${config.year} ${examId.toUpperCase()} yapılandırması ve ${scoreType} puan türü kullanıldı.`,
    "Bu değer standart puan, resmî sınav puanı, OBP katkısı veya yerleştirme puanı değildir."
  ]);
}

export function calculateDiplomaGrade(values: CalculatorValues): CalculatorResult {
  const grades = [9, 10, 11, 12].map((year) => requiredNumber(values, `grade${year}`, `${year}. sınıf yıl sonu başarı puanı`));
  if (grades.some((grade) => grade < 0 || grade > 100)) throw new Error("Yıl sonu başarı puanları 0 ile 100 arasında olmalıdır.");
  return result("Dört yılın basit ortalaması", grades.reduce((sum, grade) => sum + grade, 0) / grades.length, "puan", [
    "Her sınıf eşit ağırlıklı alınmıştır; özel öğrenci durumları ve resmî e-Okul kaydı doğrulanmamıştır."
  ]);
}

export function calculateIdealWeight(values: CalculatorValues): CalculatorResult {
  const heightCm = requiredNumber(values, "height", "Boy");
  if (heightCm < 100 || heightCm > 250) throw new Error("Yetişkin boyunu santimetre olarak 100 ile 250 arasında girin.");
  const heightM = heightCm / 100;
  const min = 18.5 * heightM ** 2;
  const max = 24.9 * heightM ** 2;
  const midpoint = (min + max) / 2;
  return result("Yetişkin BMI referans kilo aralığı", midpoint, "kg", [
    `Yaklaşık aralık: ${formatTurkishNumber(min)}–${formatTurkishNumber(max)} kg`,
    "BMI aralığı 18,5–24,9'dur; kişisel ideal kilo veya sağlık tanısı değildir."
  ]);
}

export function calculateDailyCalories(values: CalculatorValues): CalculatorResult {
  const age = requiredNumber(values, "age", "Yaş");
  const height = requiredNumber(values, "height", "Boy");
  const weight = requiredNumber(values, "weight", "Ağırlık");
  const activity = requiredNumber(values, "activity", "Aktivite katsayısı");
  const sex = values["sex"];
  if (!Number.isInteger(age) || age < 18 || age > 120) throw new Error("Bu tahmin yalnızca 18–120 yaş arasındaki yetişkinler içindir.");
  if (height < 100 || height > 250 || weight <= 0 || weight > 500) throw new Error("Boy veya ağırlık değeri geçerli aralığın dışında.");
  if (sex !== "female" && sex !== "male") throw new Error("Denklem seçimini belirtin.");
  if (![1.2, 1.375, 1.55, 1.725, 1.9].includes(activity)) throw new Error("Geçerli bir aktivite düzeyi seçin.");
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === "male" ? 5 : -161);
  const daily = bmr * activity;
  return result("Yaklaşık günlük enerji harcaması", daily, "kcal/gün", [
    `Mifflin–St Jeor dinlenme enerji tahmini: ${formatTurkishNumber(bmr)} kcal/gün`,
    `${formatTurkishNumber(activity, 3)} aktivite katsayısı uygulanmıştır.`,
    "Kişisel beslenme hedefi veya tıbbi öneri değildir."
  ]);
}

export function calculateDailyWater(values: CalculatorValues): CalculatorResult {
  const weight = requiredNumber(values, "weight", "Ağırlık");
  const mlPerKg = requiredNumber(values, "mlPerKg", "Hesap varsayımı");
  if (weight <= 0 || weight > 500 || mlPerKg <= 0 || mlPerKg > 100) {
    throw new Error("Ağırlık ve mL/kg varsayımı sıfırdan büyük ve makul aralıkta olmalıdır.");
  }
  const ml = weight * mlPerKg;
  return result("Kullanıcı varsayımına göre günlük sıvı hesabı", ml, "mL/gün", [
    `Litre karşılığı: ${formatTurkishNumber(ml / 1000)} L`,
    "Katsayı kullanıcı tarafından seçilir; bu sonuç tıbbi sıvı hedefi değildir."
  ]);
}

function addUtcDays(date: Date, days: number): Date {
  const resultDate = new Date(date.getTime());
  resultDate.setUTCDate(resultDate.getUTCDate() + days);
  return resultDate;
}

function formatIsoDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(date);
}

export function calculateMenstrualCalendar(values: CalculatorValues): CalculatorResult {
  const rawDate = values["lastPeriod"]?.trim();
  if (!rawDate) throw new Error("Son adet başlangıç tarihini girin.");
  const lastPeriod = parseDate(rawDate, "Son adet başlangıç tarihi");
  const cycleLength = requiredNumber(values, "cycleLength", "Döngü uzunluğu");
  const periodLength = requiredNumber(values, "periodLength", "Kanama süresi");
  if (!Number.isInteger(cycleLength) || cycleLength < 21 || cycleLength > 45) {
    throw new Error("Döngü uzunluğu 21–45 gün arasında tam sayı olmalıdır.");
  }
  if (!Number.isInteger(periodLength) || periodLength < 1 || periodLength > 10) {
    throw new Error("Kanama süresi 1–10 gün arasında tam sayı olmalıdır.");
  }
  if (periodLength >= cycleLength) throw new Error("Kanama süresi döngü uzunluğundan kısa olmalıdır.");
  const nextPeriod = addUtcDays(lastPeriod, cycleLength);
  const ovulation = addUtcDays(nextPeriod, -14);
  const fertileStart = addUtcDays(ovulation, -5);
  const fertileEnd = addUtcDays(ovulation, 1);
  return result("Tahmini sonraki adet başlangıcı", nextPeriod.getTime(), "", [
    `Tahmini yumurtlama: ${formatIsoDate(ovulation)}`,
    `Yaklaşık verimli dönem: ${formatIsoDate(fertileStart)} – ${formatIsoDate(fertileEnd)}`,
    `Girilen kanama süresi: ${periodLength} gün; takvim tahmini gebelikten korunma yöntemi değildir.`,
  ].map((text) => text),);
}

export function calculateHijriDate(values: CalculatorValues): CalculatorResult {
  const rawDate = values["date"]?.trim();
  if (!rawDate) throw new Error("Miladi tarihi girin.");
  const date = parseDate(rawDate, "Miladi tarih");
  try {
    const formatter = new Intl.DateTimeFormat("tr-TR-u-ca-islamic-umalqura-nu-latn", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    });
    const parts = formatter.formatToParts(date);
    const day = parts.find((part) => part.type === "day")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const year = parts.find((part) => part.type === "year")?.value;
    if (!day || !month || !year) throw new Error("Hicri takvim sonucu oluşturulamadı.");
    return {
      label: "Umm al-Qura Hicri tarihi",
      value: date.getTime(),
      displayValue: `${day} ${month} ${year}`,
      details: ["Yerel dini takvim ilanı veya hilal gözlemiyle bir gün farklılık olabilir."]
    };
  } catch {
    throw new Error("Bu çalışma ortamı Umm al-Qura Hicri takvim dönüşümünü desteklemiyor.");
  }
}

export function calculateDaysUntilDate(values: CalculatorValues, now = new Date()): CalculatorResult {
  const rawDate = values["targetDate"]?.trim();
  if (!rawDate) throw new Error("Hedef tarihi girin.");
  const target = parseDate(rawDate, "Hedef tarih");
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  return result(days >= 0 ? "Kalan takvim günü" : "Geçen takvim günü", Math.abs(days), "gün", [
    days === 0 ? "Hedef tarih bugün." : days > 0 ? `Hedef tarih ${formatIsoDate(target)}.` : `Hedef tarih ${formatIsoDate(target)} tarihinde geçti.`,
    "Saat, hafta sonları ve resmî tatiller hesaba katılmaz."
  ]);
}

const zodiacSigns = [
  { name: "Oğlak", starts: 1222, ends: 119 },
  { name: "Kova", starts: 120, ends: 218 },
  { name: "Balık", starts: 219, ends: 320 },
  { name: "Koç", starts: 321, ends: 419 },
  { name: "Boğa", starts: 420, ends: 520 },
  { name: "İkizler", starts: 521, ends: 621 },
  { name: "Yengeç", starts: 622, ends: 722 },
  { name: "Aslan", starts: 723, ends: 822 },
  { name: "Başak", starts: 823, ends: 922 },
  { name: "Terazi", starts: 923, ends: 1023 },
  { name: "Akrep", starts: 1024, ends: 1122 },
  { name: "Yay", starts: 1123, ends: 1221 }
];

export function calculateZodiacSign(values: CalculatorValues): CalculatorResult {
  const rawDate = values["birthDate"]?.trim();
  if (!rawDate) throw new Error("Doğum tarihini girin.");
  const date = parseDate(rawDate, "Doğum tarihi");
  const monthDay = (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
  const sign = zodiacSigns.find((item) => item.starts <= item.ends
    ? monthDay >= item.starts && monthDay <= item.ends
    : monthDay >= item.starts || monthDay <= item.ends);
  if (!sign) throw new Error("Doğum tarihi için burç bulunamadı.");
  return {
    label: "Yaklaşık Güneş burcu",
    value: monthDay,
    displayValue: sign.name,
    details: ["Yaygın tropikal tarih aralıkları kullanılır; sınır günlerinde saat ve doğum yeri sonucu değiştirebilir."]
  };
}
