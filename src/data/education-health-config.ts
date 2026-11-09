import type { RegulatedValue } from "./regulated-config";

export type ExamSection = { key: string; label: string };
export type ExamYearConfig = {
  year: number;
  source: string;
  url: string;
  lastUpdated: string;
  sections: ExamSection[];
  scoreTypes: string[];
  weights: Record<string, Record<string, number> | null>;
  note: string;
};

const examSource = "ÖSYM – ilgili yıl sınav kılavuzu ve değerlendirme esasları";
const osymUrl = "https://www.osym.gov.tr/";
const lastUpdated = "2026-11-09";

function pendingExam(
  sections: ExamSection[],
  scoreTypes: string[],
  note: string
): ExamYearConfig {
  return {
    year: 2026,
    source: examSource,
    url: osymUrl,
    lastUpdated,
    sections,
    scoreTypes,
    weights: Object.fromEntries(scoreTypes.map((type) => [type, null])),
    note
  };
}

export const educationHealthConfig2026 = {
  exams: {
    yks: pendingExam([
      { key: "tytTurkce", label: "TYT Türkçe neti" },
      { key: "tytSocial", label: "TYT Sosyal Bilimler neti" },
      { key: "tytMath", label: "TYT Temel Matematik neti" },
      { key: "tytScience", label: "TYT Fen Bilimleri neti" },
      { key: "aytMath", label: "AYT Matematik neti" },
      { key: "aytScience", label: "AYT Fen Bilimleri neti" },
      { key: "aytLiterature", label: "AYT Türk Dili ve Edebiyatı-Sosyal Bilimler-1 neti" },
      { key: "aytSocial", label: "AYT Sosyal Bilimler-2 neti" },
      { key: "language", label: "YDT neti" }
    ], ["SAY", "EA", "SÖZ", "DİL"], "TODO: 2026 TYT/AYT/YDT puan türü ağırlıkları, standart puan yöntemi, taban puan ve OBP katkısı ÖSYM kılavuzundan doğrulanmalı."),
    lgs: pendingExam([
      { key: "turkish", label: "Türkçe neti" },
      { key: "math", label: "Matematik neti" },
      { key: "science", label: "Fen Bilimleri neti" },
      { key: "history", label: "T.C. İnkılap Tarihi ve Atatürkçülük neti" },
      { key: "religion", label: "Din Kültürü ve Ahlak Bilgisi neti" },
      { key: "language", label: "Yabancı Dil neti" }
    ], ["LGS"], "TODO: 2026 MEB merkezi sınav ağırlıklı standart puan hesap yöntemi ve dağılım parametreleri resmî kılavuzdan doğrulanmalı."),
    kpss: pendingExam([
      { key: "generalAbility", label: "Genel Yetenek neti" },
      { key: "generalCulture", label: "Genel Kültür neti" },
      { key: "education", label: "Eğitim Bilimleri neti" },
      { key: "field", label: "Alan Bilgisi neti" }
    ], ["P1", "P2", "P3", "ÖĞRETMENLİK"], "TODO: 2026 KPSS oturumuna ve puan türüne göre test ağırlıkları, standart puan ve değerlendirme kuralları ÖSYM kılavuzundan doğrulanmalı."),
    ales: pendingExam([
      { key: "numerical", label: "Sayısal test neti" },
      { key: "verbal", label: "Sözel test neti" }
    ], ["SAYISAL", "SÖZEL", "EŞİT AĞIRLIK"], "TODO: 2026 ALES sayısal, sözel ve eşit ağırlık test katsayıları ile standart puanlama yöntemi ÖSYM kılavuzundan doğrulanmalı."),
    dgs: pendingExam([
      { key: "numerical", label: "Sayısal test neti" },
      { key: "verbal", label: "Sözel test neti" }
    ], ["SAYISAL", "SÖZEL", "EŞİT AĞIRLIK"], "TODO: 2026 DGS puan türü katsayıları, standart puan ve ÖBP katkısı ÖSYM kılavuzundan doğrulanmalı.")
  },
  references: {
    osym: { name: "ÖSYM", url: osymUrl },
    meb: { name: "Millî Eğitim Bakanlığı", url: "https://www.meb.gov.tr/" },
    who: { name: "Dünya Sağlık Örgütü", url: "https://www.who.int/" },
    nih: { name: "NIH – Office of Dietary Supplements", url: "https://ods.od.nih.gov/" }
  },
  healthDefaults: {
    hydrationMlPerKg: 30,
    hydrationFactor: {
      value: null,
      source: "Kişisel sıvı gereksinimi klinik duruma göre değişir",
      url: "https://www.who.int/",
      lastUpdated,
      note: "Değer yalnızca kullanıcı tarafından seçilebilen genel bir hesap varsayımıdır; tıbbi öneri değildir."
    } satisfies RegulatedValue<number>
  }
};

export function getExamConfigTodo(exam: ExamYearConfig): string[] {
  return Object.values(exam.weights).some((weights) => weights === null) ? [exam.note] : [];
}
