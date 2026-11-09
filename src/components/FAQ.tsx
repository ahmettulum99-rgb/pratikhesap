import { JsonLd } from "@/components/JsonLd";
import { createFAQPageStructuredData, type FAQItem } from "@/lib/seo/faq";

export function FAQ({ items, structuredData = false }: { items: FAQItem[]; structuredData?: boolean }) {
  return (
    <>
      {structuredData && items.length > 0 && <JsonLd data={createFAQPageStructuredData(items)} />}
      <section aria-labelledby="faq-heading" className="content-section">
        <h2 id="faq-heading" className="section-title">Sıkça sorulan sorular</h2>
        <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5">
          {items.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="cursor-pointer list-none pr-6 font-semibold text-navy marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue">
                {item.question}
                <span aria-hidden="true" className="float-right text-blue transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
