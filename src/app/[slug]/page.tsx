import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CalculatorForm } from "@/components/CalculatorForm";
import { FavoriteToolButton } from "@/components/ToolActivity";
import { FAQ } from "@/components/FAQ";
import { PageStructuredData } from "@/components/PageStructuredData";
import { categories, getCategory, getTool, tools } from "@/data/tools";
import { getPayrollConfigTodo, isCompletePayrollConfig, payrollConfigs } from "@/data/payroll-config";
import { getRelatedTools } from "@/data/related-tools";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return createPageMetadata({
    title: tool.title,
    description: tool.metaDescription,
    path: `/${tool.id}`
  });
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const category = getCategory(tool.category)!;
  const relatedTools = getRelatedTools(tool.id);
  const toolSummaries = tools.map(({ id, name, category, description, createdAt }) => ({ id, name, category, description, createdAt }));
  const fieldLabels = tool.fields.filter((field) => !field.showWhen).map((field) => field.label);
  const inputInstructions: Record<string, string> = {
    percentage: "Önce işlem türünü seçin; form yalnızca o işleme gereken sayıları gösterir.",
    "grade-list": "Bir veya daha fazla not girin. Boş bırakılan satırlar ortalamaya katılmaz.",
    "course-list": "Her ders için not girin; ağırlıklı seçenekte ders kredisi veya saatini de girmeniz gerekir.",
    "weighted-list": "Her değerlendirme için not ve ağırlık girin; ağırlıkların toplamı %100 olmalıdır.",
    "gpa-list": "Her dersin harf notunu ve kredisini girin. İsterseniz önceki kredi ve ortalamanızı birlikte ekleyin.",
    "exam-net": "Doğru, yanlış ve toplam soru sayısını; gerekiyorsa yanlış götürme katsayısını belirtin.",
    "loan-plan": "Kredi tutarı, aylık faiz oranı, vade ve varsa aylık gideri girin. Sonuç tahminidir.",
    currency: "Dönüşüm yönünü ve para birimini seçin; tutarı girin. Kur isteği seçilen para birimiyle yapılır.",
    electricity: "Tüketim veya cihaz hesabını seçin; yalnızca seçiminize karşılık gelen alanları doldurun.",
    "marketplace-profit": "Satış fiyatı, ürün maliyeti, indirim, komisyon ve giderleri girin; komisyon matrahını seçin.",
    "unit-price": "Her ürün için fiyat, miktar ve birim girin. Yalnızca aynı tür ölçüler karşılaştırılabilir.",
    "monthly-savings": "Başlangıç tutarı, aylık katkı ve varsayımsal oranı girin; süreyi ay olarak belirtin.",
    "trip-cost": "Tek yön mesafesi, tüketim, yakıt fiyatı ve kişi sayısını girin; gidiş-dönüşü ayrıca seçin.",
    "dimensional-weight": "Paket ölçülerini, ölçü birimini ve taşıyıcınızın kullandığı desi bölenini girin.",
    "salary-payroll": "Aylık veya yıllık brüt/net ücreti, hesaplama yönünü, ayı ve varsa engellilik indirimi derecesini seçin. Tablo 2026 yılı için tam yıl, aynı ücret ve aynı işveren varsayımıyla hazırlanır."
  };
  const inputDescription = inputInstructions[tool.mode ?? ""] ?? `${fieldLabels.join(", ")} alanlarını doldurun.`;
  const content = tool.content;
  const payrollConfig = tool.mode === "salary-payroll" ? payrollConfigs[2026] : undefined;
  const payrollConfigTodo = payrollConfig ? getPayrollConfigTodo(payrollConfig) : [];

  return (
    <main className="container-page py-8 sm:py-12">
      <PageStructuredData name={tool.title} description={tool.metaDescription} path={`/${tool.id}`} webApplication />
      <Breadcrumb items={[{ label: category.name, href: category.href }, { label: tool.name }]} path={`/${tool.id}`} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div>
          <header className="mb-6">
            <p className="eyebrow">{category.name} hesaplama aracı</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{tool.name}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{tool.intro}</p>
          </header>
          <FavoriteToolButton toolId={tool.id} tools={toolSummaries} />
          {payrollConfig && !isCompletePayrollConfig(payrollConfig) ? (
            <aside role="status" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
              <h2 className="text-lg font-bold">2026 bordro parametreleri doğrulanmayı bekliyor</h2>
              <p className="mt-2 leading-6">
                Yanlış net maaş veya kesinti sonucu göstermemek için hesaplama geçici olarak kapalıdır. Aşağıdaki değerler resmî kaynakta doğrulanmadan tahmin edilmeyecektir:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {payrollConfigTodo.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="mt-3 text-sm leading-6">
                Kaynaklarda doğrulanan parametreler yapılandırmada tutulur; eksikler doğrulandığında araç otomatik olarak etkinleştirilecektir.
              </p>
            </aside>
          ) : (
            <CalculatorForm tool={{ id: tool.id, fields: tool.fields, mode: tool.mode }} />
          )}
          <AdSlot placement="calculator" className="mt-6" />
          <section className="content-section">
            <h2 className="section-title">{tool.name} nedir?</h2>
            <p className="mt-3 leading-7 text-slate-600">
              {content?.definition ?? `TODO: ${tool.name} için en az 150 kelimelik özgün kavram açıklaması hazırlanmalı.`}
            </p>
          </section>
          <section className="content-section">
            <h2 className="section-title">Nasıl hesaplanır?</h2>
            <p className="mt-3 leading-7 text-slate-600"><strong>Formül:</strong> {tool.formula}</p>
            {content ? (
              <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7 text-slate-600">
                {content.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            ) : (
              <p className="mt-3 leading-7 text-slate-600">TODO: Bu araca özel adım adım açıklama eklenmeli. {inputDescription}</p>
            )}
          </section>
          <AdSlot placement="content" className="mt-8" />
          <section className="content-section">
            <h2 className="section-title">Çözümlü örnekler</h2>
            {content ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {content.examples.map((example) => (
                  <article key={example.title} className="rounded-xl border border-slate-200 bg-white p-5">
                    <h3 className="font-bold text-navy">{example.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600"><strong>İşlem:</strong> {example.calculation}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700"><strong>Sonuç:</strong> {example.result}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-3 space-y-2 leading-7 text-slate-600">
                <p>TODO: İlk senaryoya ait adım adım çözüm hazırlanmalı. Mevcut katalog örneği: {tool.example}</p>
                <p>TODO: Farklı girdiler kullanan ikinci çözümlü örnek eklenmeli.</p>
              </div>
            )}
          </section>
          {content?.referenceTable && (
            <section className="content-section">
              <h2 className="section-title">Örnek referans tablosu</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <caption className="mb-3 text-left leading-6 text-slate-600">{content.referenceTable.caption}</caption>
                  <thead><tr>{content.referenceTable.headers.map((header) => <th key={header} scope="col" className="border-b border-slate-300 px-3 py-2">{header}</th>)}</tr></thead>
                  <tbody>
                    {content.referenceTable.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border-b border-slate-200 px-3 py-2">{cell}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">Tablo, araçta açıklanan formüle göre hazırlanmış örnek değerler içerir; kullanıcıya özel resmî veya bağlayıcı sonuç oluşturmaz.</p>
            </section>
          )}
          {content ? (
            <FAQ items={content.faqs} structuredData />
          ) : (
            <section className="content-section">
              <h2 className="section-title">Sıkça sorulan sorular</h2>
              <p className="mt-3 leading-7 text-slate-600">TODO: Bu araç için 6–8 özgün soru ve yanıt hazırlanmalı. SSS içeriği tamamlanmadan FAQPage yapılandırılmış verisi yayımlanmaz.</p>
            </section>
          )}
          <section className="content-section">
            <h2 className="section-title">Son güncelleme ve kaynaklar</h2>
            {content ? (
              <>
                <p className="mt-3 text-sm text-slate-600">Son güncelleme: <time dateTime={content.lastUpdated}>{new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${content.lastUpdated}T00:00:00Z`))}</time></p>
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-6 text-slate-600">
                  {content.sources.map((source) => (
                    <li key={source.name}>
                      {source.url
                        ? <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue underline">{source.name}</a>
                        : <span className="font-semibold">{source.name}</span>}
                      {source.note && <span>: {source.note}</span>}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-3 leading-7 text-slate-600">TODO: İçerik gözden geçirme tarihi ve doğrulanmış kaynak listesi eklenmeli.</p>
            )}
          </section>
        </div>
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-6">
          <h2 className="font-bold text-navy">{category.name} kategorisinden ilgili araçlar</h2>
          <ul className="mt-3 space-y-3">
            {relatedTools.map((related) => (
              <li key={related.id}>
                <Link href={`/${related.id}`} className="font-semibold text-blue hover:underline">{related.name}</Link>
                <p className="mt-1 text-sm leading-5 text-slate-600">{related.description}</p>
              </li>
            ))}
          </ul>
          <Link href={category.href} className="mt-5 inline-block text-sm font-semibold text-blue hover:underline">{category.name} araçlarının tümü →</Link>
          <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">Araç sonuçları bilgilendirme amaçlıdır. Kurumlara ve mevzuata bağlı hesaplamalarda ilgili resmî kuralları doğrulayın.</p>
        </aside>
      </div>
      <nav aria-label="Diğer kategoriler" className="mt-10 border-t border-slate-200 pt-5">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {categories.filter((item) => item.id !== category.id).map((item) => <li key={item.id}><Link href={item.href} className="text-blue hover:underline">{item.name} araçları</Link></li>)}
        </ul>
      </nav>
    </main>
  );
}
