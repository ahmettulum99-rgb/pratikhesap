import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { siteUrl } from "@/lib/site";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items, path }: { items: BreadcrumbItem[]; path: string }) {
  const allItems = [{ label: "Ana Sayfa", href: "/" }, ...items];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => {
      const href = item.href ?? (index === allItems.length - 1 ? path : undefined);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(href ? { item: `${siteUrl}${href}` } : {})
      };
    })
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <nav aria-label="Sayfa konumu" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-blue">Ana Sayfa</Link></li>
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              {item.href && index < items.length - 1
                ? <Link href={item.href} className="hover:text-blue">{item.label}</Link>
                : <span aria-current="page">{item.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
