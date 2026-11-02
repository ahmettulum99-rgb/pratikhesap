import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CalculatorForm } from "@/components/CalculatorForm";
import { FAQ } from "@/components/FAQ";
import { categories, getCategory, getTool, tools } from "@/data/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = getTool(params.slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.metaDescription,
    alternates: { canonical: `/${tool.id}` },
    openGraph: { title: tool.title, description: tool.metaDescription, url: `/${tool.id}`, type: "website" }
  };
}

export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool) notFound();
  const category = getCategory(tool.category)!;
  const relatedTools = tools.filter((item) => item.category === tool.category && item.id !== tool.id).slice(0, 3);
  const faqs = [
    { question: `${tool.name} nasıl kullanılır?`, answer: `${tool.intro} Form alanlarını doldurup “Hesapla” düğmesine basın; sonucu ve varsa ek bilgileri aynı sayfada görebilirsiniz.` },
    { question: `${tool.name} hangi formülü kullanır?`, answer: tool.formula },
    { question: "Hesaplama sonucu nasıl doğrulanır?", answer: `Sonuç, girdiğiniz değerlere göre ${tool.formula.toLocaleLowerCase("tr-TR")} kullanılarak hesaplanır. Ondalık değerler için virgül veya uygun binlik ayırıcıyla Türkçe sayı girişi yapabilirsiniz.` }
  ];

  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumb items={[{ label: category.name, href: category.href }, { label: tool.name }]} path={`/${tool.id}`} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div>
          <header className="mb-6">
            <p className="eyebrow">{category.name} hesaplama aracı</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{tool.name}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{tool.intro}</p>
          </header>
          <CalculatorForm tool={tool} />
          <AdSlot placement="calculator" className="mt-6" />
          <section className="content-section">
            <h2 className="section-title">Hesaplama formülü</h2>
            <p className="mt-3 leading-7 text-slate-600">{tool.formula}</p>
          </section>
          <AdSlot placement="content" className="mt-8" />
          <section className="content-section">
            <h2 className="section-title">Hesaplama örneği</h2>
            <p className="mt-3 leading-7 text-slate-600">{tool.example}</p>
          </section>
          <FAQ items={faqs} />
        </div>
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-6">
          <h2 className="font-bold text-navy">İlgili hesaplama araçları</h2>
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
