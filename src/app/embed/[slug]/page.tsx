import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalculatorForm } from "@/components/CalculatorForm";
import { getTool, tools } from "@/data/tools";
import { getPayrollConfigTodo, isCompletePayrollConfig, payrollConfigs } from "@/data/payroll-config";
import { getRegulatedToolTodo } from "@/data/regulated-config";
import { educationHealthConfig2026, getExamConfigTodo } from "@/data/education-health-config";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return {
    title: `${tool.name} | PratikHesap`,
    description: tool.description,
    robots: { index: false, follow: true },
    alternates: { canonical: `${siteUrl}/embed/${tool.id}` }
  };
}

export default async function EmbeddedCalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const payrollConfig = tool.mode === "salary-payroll" ? payrollConfigs[2026] : undefined;
  const payrollTodo = payrollConfig ? getPayrollConfigTodo(payrollConfig) : [];
  const regulatedTodo = getRegulatedToolTodo(tool.id);
  const examId = tool.mode?.startsWith("exam-score-")
    ? tool.mode.slice("exam-score-".length) as keyof typeof educationHealthConfig2026.exams
    : undefined;
  const examConfig = examId ? educationHealthConfig2026.exams[examId] : undefined;
  const examTodo = examConfig ? getExamConfigTodo(examConfig) : [];
  const unavailableReasons = [...payrollTodo, ...regulatedTodo, ...examTodo];
  const isPayrollUnavailable = payrollConfig && !isCompletePayrollConfig(payrollConfig);
  const isUnavailable = Boolean(isPayrollUnavailable || unavailableReasons.length > 0);

  return (
    <main className="embed-shell mx-auto max-w-3xl px-4 py-4 sm:px-5">
      <h1 className="mb-4 text-xl font-bold tracking-tight text-navy">{tool.name}</h1>
      {isUnavailable ? (
        <section role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <h2 className="font-bold">Güncel parametre doğrulaması bekleniyor</h2>
          <p className="mt-2">Yanlış veya güncel olmayan sonuç göstermemek için bu araç geçici olarak hesaplama yapmıyor. Parametreler resmî kaynakta doğrulandığında etkinleştirilecektir.</p>
          {unavailableReasons.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {unavailableReasons.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          )}
        </section>
      ) : (
        <>
          {(tool.category === "finans" || tool.medicalDisclaimer) && (
            <p role="note" className="mb-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
              {tool.medicalDisclaimer
                ? "Tıbbi tavsiye değildir. Sonuç yaklaşık bilgilendirme içindir; sağlık uzmanına danışın."
                : "Bu araç bilgilendirme amaçlıdır; finansal, vergi veya hukuki danışmanlık yerine geçmez."}
            </p>
          )}
          <CalculatorForm tool={{ id: tool.id, fields: tool.fields, mode: tool.mode }} trackUsage={false} />
        </>
      )}
      <p className="mt-3 text-right text-xs text-slate-600">
        <Link href={`/${tool.id}`} className="font-semibold text-blue underline">PratikHesap tarafından</Link>
      </p>
    </main>
  );
}
