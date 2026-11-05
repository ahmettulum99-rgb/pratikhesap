import { Breadcrumb } from "@/components/Breadcrumb";
import { PageStructuredData } from "@/components/PageStructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "İletişim | PratikHesap",
  description: "PratikHesap hakkında bilgi, hata bildirimi veya araç önerisi için iletişim sayfasını ziyaret edin.",
  path: "/iletisim"
});

export default function ContactPage() {
  return (
    <main className="container-page py-10 sm:py-14">
      <PageStructuredData name="İletişim | PratikHesap" description="PratikHesap iletişim sayfası." path="/iletisim" />
      <Breadcrumb items={[{ label: "İletişim" }]} path="/iletisim" />
      <article className="max-w-3xl">
        <p className="eyebrow">Bize ulaşın</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">İletişim</h1>
        <p className="mt-5 leading-7 text-slate-600">Hesaplama araçlarıyla ilgili bir hata fark ettiyseniz, yeni bir araç önermek veya gizlilikle ilgili bir talepte bulunmak istiyorsanız <a className="font-semibold text-blue underline" href="mailto:ahmet.tulum99@gmail.com">ahmet.tulum99@gmail.com</a> adresine e-posta gönderebilirsiniz.</p>
      </article>
    </main>
  );
}
