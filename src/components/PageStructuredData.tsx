import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/site";

export function PageStructuredData({ name, description, path, webApplication = false }: { name: string; description: string; path: string; webApplication?: boolean }) {
  const pageUrl = new URL(path, siteUrl).toString();
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name,
        description,
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${siteUrl}/#website` }
      }} />
      {webApplication && <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": `${pageUrl}#application`,
        name,
        url: pageUrl,
        description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${siteUrl}/#website` }
      }} />}
    </>
  );
}
