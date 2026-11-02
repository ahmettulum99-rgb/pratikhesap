import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/site";

export function PageStructuredData({ name, description, path }: { name: string; description: string; path: string }) {
  const pageUrl = new URL(path, siteUrl).toString();
  return (
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name,
      description,
      isPartOf: { "@id": `${siteUrl}/#website` }
    }} />
  );
}
