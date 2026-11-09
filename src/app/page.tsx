import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Calculator, CalendarDays, CheckCircle2, GraduationCap, Wallet } from "lucide-react";
import { ToolExplorer } from "@/components/ToolExplorer";
import { HomeToolSearch } from "@/components/HomeToolSearch";
import { ToolActivity } from "@/components/ToolActivity";
import { FAQ } from "@/components/FAQ";
import { AdSlot } from "@/components/AdSlot";
import { PageStructuredData } from "@/components/PageStructuredData";
import { categories, tools } from "@/data/tools";
import { getToolKeywords } from "@/data/seo-keywords";
import { homeSeoParagraphs } from "@/data/home-seo-content";

const categoryIcons = {
  finans: Wallet,
  tarih: CalendarDays,
  egitim: GraduationCap,
  "gunluk-yasam": Calculator
};

export default function HomePage() {
  const popularTools = tools.filter((tool) => tool.popular);
  const toolSummaries = tools.map(({ id, name, category, description, createdAt }) => ({ id, name, category, description, createdAt }));
  const searchableTools = tools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    searchTerms: getToolKeywords(tool)
  }));
  return (
    <main>
      <PageStructuredData name="PratikHesap – Hesaplamak artık çok kolay" description="Finans, tarih, eğitim ve günlük yaşam için ücretsiz, kolay ve hızlı hesaplama araçları." path="/" />
      <section className="hero">
        <div className="container-page py-14 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">PratikHesap ile tanışın</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Hesaplamak artık <span className="text-blue-200">çok kolay.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
              İhtiyacınız olan hesabı bulun, bilgileri girin ve sonucunuzu hemen öğrenin. Ücretsiz, anlaşılır ve kullanımı kolay.
            </p>
            <Suspense fallback={<div aria-hidden="true" className="mt-7 h-14 max-w-2xl" />}>
              <HomeToolSearch tools={searchableTools} />
            </Suspense>
            <Link href="#araclar" className="hero-button mt-5 gap-2">
              Hesaplama araçlarını keşfet <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100">
              {["Ücretsiz kullanım", "Hızlı sonuç", "Kayıt gerekmez"].map((item) => (
                <li key={item} className="flex items-center gap-2"><CheckCircle2 size={16} aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="container-page py-10 sm:py-14">
        <ToolActivity tools={toolSummaries} />
        <section aria-labelledby="popular-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Hızlı erişim</p>
              <h2 id="popular-heading" className="section-title mt-2">Popüler hesaplama araçları</h2>
            </div>
            <Link href="#araclar" className="text-sm font-semibold text-blue hover:underline">Tüm araçları gör</Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <Link key={tool.id} href={`/${tool.id}`} className="tool-card group">
                <span className="font-semibold text-navy group-hover:text-blue">{tool.name}</span>
                <span className="mt-2 block text-sm leading-6 text-slate-600">{tool.description}</span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="categories-heading" className="content-section">
          <div className="mb-5">
            <p className="eyebrow">İhtiyacınıza göre keşfedin</p>
            <h2 id="categories-heading" className="section-title mt-2">Hesaplama kategorileri</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id];
              const count = tools.filter((tool) => tool.category === category.id).length;
              return (
                <Link key={category.id} href={category.href} className="category-card group">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pale-blue text-blue">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span className="mt-4 block font-bold text-navy group-hover:text-blue">{category.name}</span>
                  <span className="mt-2 block text-sm leading-6 text-slate-600">{category.description}</span>
                  <span className="mt-4 block text-xs font-semibold text-slate-500">{count} hesaplama aracı</span>
                </Link>
              );
            })}
          </div>
        </section>

        <AdSlot placement="content" className="my-10" />

        <section id="araclar" aria-labelledby="tools-heading" className="scroll-mt-8">
          <div className="mb-5">
            <p className="eyebrow">İhtiyacınız olan araç burada</p>
            <h2 id="tools-heading" className="section-title mt-2">Tüm hesaplama araçları</h2>
            <p className="mt-2 max-w-2xl text-slate-600">Aradığınız aracı ismine göre arayın veya bir kategori seçerek listeyi daraltın.</p>
          </div>
          <ToolExplorer tools={toolSummaries} showSearch={false} />
        </section>

        <section className="content-section rounded-2xl border border-blue-100 bg-white p-6 sm:p-8" aria-labelledby="about-tools-heading">
          <p className="eyebrow">Hesaplama araçları rehberi</p>
          <h2 id="about-tools-heading" className="section-title mt-2">İhtiyacınıza uygun hesaplama aracını bulun</h2>
          <div className="mt-4 max-w-4xl space-y-4 leading-7 text-slate-600">
            {homeSeoParagraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>
                {paragraph.map((segment, segmentIndex) => segment.href
                  ? <Link key={segmentIndex} href={segment.href} className="font-semibold text-blue underline decoration-blue/30 underline-offset-2 hover:decoration-blue">{segment.text}</Link>
                  : <span key={segmentIndex}>{segment.text}</span>)}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby="benefits-heading" className="content-section">
          <div className="mb-5">
            <p className="eyebrow">Pratik, şeffaf, erişilebilir</p>
            <h2 id="benefits-heading" className="section-title mt-2">Hesaplarınız için ihtiyacınız olan netlik</h2>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Hesabınız cihazınızda", "Hesaplama formülleri tarayıcınızda çalışır; hesaplama girdilerini sunucuya göndermeyiz."],
              ["Formüller açıklanır", "Her araçta kullanılan hesaplama yöntemini, örneği ve önemli varsayımları görebilirsiniz."],
              ["Kayıt olmadan kullanın", "Araçları bulup kullanmak için üyelik açmanız gerekmez."]
            ].map(([title, description]) => (
              <li key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <CheckCircle2 size={20} className="text-blue" aria-hidden="true" />
                <h3 className="mt-3 font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </li>
            ))}
          </ul>
        </section>

        <FAQ items={[
          { question: "PratikHesap araçlarını kullanmak ücretsiz mi?", answer: "Evet. Bu sürümde hesaplama araçlarını ücretsiz olarak, kayıt oluşturmadan kullanabilirsiniz." },
          { question: "Girdiğim bilgiler bir yere kaydediliyor mu?", answer: "Tutar, not ve tarih gibi hesaplama değerleri tarayıcınızda işlenir ve uygulama veritabanında saklanmaz. Döviz aracında seçtiğiniz para birimi kodu, kur verisini alabilmek için istekle sunucuya iletilir." },
          { question: "Hesaplama sonuçları resmî veya kesin danışmanlık yerine geçer mi?", answer: "Hayır. Sonuçlar girilen değerlere ve sayfada belirtilen formüle dayanır. Vergi, okul notu ve sağlık gibi uzmanlık veya kurum kuralı gerektiren konularda yetkili kaynaklara danışın." }
        ]} />
      </div>
    </main>
  );
}
