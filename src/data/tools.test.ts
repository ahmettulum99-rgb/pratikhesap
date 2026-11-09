import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { categories, isRecentlyAdded, legacyCalculatorRedirects, tools } from "./tools";
import { getRelatedTools, relatedToolIds } from "./related-tools";
import { getToolKeywords } from "./seo-keywords";
import { homeMetaDescription, homeMetaTitle } from "./home-seo";
import { homeSeoParagraphs } from "./home-seo-content";
import sitemap from "../app/sitemap";
import { createPageMetadata } from "../lib/seo/metadata";
import { createFAQPageStructuredData } from "../lib/seo/faq";
import { getPayrollConfigTodo, payrollConfigs } from "./payroll-config";
import { getRegulatedToolTodo, regulatedConfig2026 } from "./regulated-config";
import { regulatedTools } from "./regulated-tools";
import { educationHealthTools } from "./education-health-tools";
import { educationHealthConfig2026, getExamConfigTodo } from "./education-health-config";

describe("calculator catalog", () => {
  it("includes each requested tool with a unique root URL and SEO metadata", () => {
    expect(tools).toHaveLength(62);
    expect(new Set(tools.map((tool) => tool.id)).size).toBe(tools.length);
    expect(new Set(tools.map((tool) => tool.title)).size).toBe(tools.length);
    expect(new Set(tools.map((tool) => tool.metaDescription)).size).toBe(tools.length);
    for (const tool of tools) {
      expect(tool.id).toMatch(/^[a-z0-9-]+$/);
      expect(tool.title.length).toBeGreaterThan(20);
      expect(tool.metaDescription.length).toBeGreaterThan(60);
      expect(categories.some((category) => category.id === tool.category)).toBe(true);
      expect(tool.fields.length).toBeGreaterThan(0);
    }
  });

  it("provides search-intent phrases for on-site search without duplicate phrases", () => {
    for (const tool of tools) {
      const keywords = getToolKeywords(tool);
      expect(keywords.length).toBeGreaterThanOrEqual(5);
      expect(new Set(keywords).size).toBe(keywords.length);
    }
    expect(tools.find((tool) => tool.id === "dortluk-not-sistemi-hesaplama")).toBeDefined();
    expect(tools.find((tool) => tool.id === "doviz-hesaplama")).toBeDefined();
    expect(tools.find((tool) => tool.id === "pazaryeri-net-kar-hesaplama")?.createdAt).toBe("2026-11-05T10:35:47+03:00");
  });

  it("keeps verified payroll values sourced and blocks incomplete 2026 tax assumptions", () => {
    const config = payrollConfigs[2026];
    expect(config).toBeDefined();
    expect(config?.lastUpdated).toBe("2026-11-05");
    expect(config?.minimumWage.grossMonthly).toBe(33030);
    expect(config?.socialSecurity).toMatchObject({
      baseFloor: 33030,
      employeeRate: 0.14,
      employeeUnemploymentRate: 0.01,
      employerRate: 0.2175,
      employerUnemploymentRate: 0.02,
      baseCeiling: null
    });
    expect(config?.incomeTax.disabilityMonthlyDeduction).toEqual({ "1": 12000, "2": 7000, "3": 3000 });
    expect(config?.incomeTax.brackets).toBeNull();
    expect(config && getPayrollConfigTodo(config)).toEqual([
      "SGK prime esas kazanç üst sınırı",
      "gelir vergisi ücret tarifesi dilim ve oranları",
      "asgari ücret gelir vergisi istisnası hesap yöntemi",
      "asgari ücret damga vergisi istisnası hesap yöntemi"
    ]);
  });

  it("builds canonical and title-specific social metadata without meta keywords", () => {
    const metadata = tools.map((tool) => createPageMetadata({
      title: tool.title,
      description: tool.metaDescription,
      path: `/${tool.id}`
    }));
    expect(new Set(metadata.map((page) => page.title)).size).toBe(tools.length);
    for (const [index, page] of metadata.entries()) {
      expect(page.alternates?.canonical).toBe(`/${tools[index].id}`);
      expect(page).not.toHaveProperty("keywords");
      expect(page.openGraph).toMatchObject({
        title: tools[index].title,
        description: tools[index].metaDescription,
        url: `https://www.hesappratik.xyz/${tools[index].id}`,
        images: [{
          url: `/api/og?title=${encodeURIComponent(tools[index].title)}`,
          width: 1200,
          height: 630,
          alt: `${tools[index].title} – PratikHesap`
        }]
      });
      expect(page.twitter).toMatchObject({
        card: "summary_large_image",
        title: tools[index].title,
        description: tools[index].metaDescription,
        images: [`/api/og?title=${encodeURIComponent(tools[index].title)}`]
      });
    }
  });

  it("keeps the home title and description within search snippet length targets", () => {
    expect(homeMetaTitle.length).toBeLessThanOrEqual(60);
    expect(homeMetaDescription.length).toBeGreaterThanOrEqual(150);
    expect(homeMetaDescription.length).toBeLessThanOrEqual(160);
  });

  it("adds a 300–400 word home guide with useful internal links", () => {
    const text = homeSeoParagraphs.flat().map((segment) => segment.text).join(" ");
    const wordCount = text.trim().split(/\s+/).length;
    expect(wordCount).toBeGreaterThanOrEqual(300);
    expect(wordCount).toBeLessThanOrEqual(400);
    const links = homeSeoParagraphs.flatMap((paragraph) => paragraph.flatMap((segment) => segment.href ? [segment.href] : []));
    for (const href of links) {
      expect(href.startsWith("/")).toBe(true);
      if (href !== "/finans" && href !== "/egitim" && href !== "/tarih" && href !== "/gunluk-yasam" && href !== "/iletisim") {
        expect(tools.some((tool) => `/${tool.id}` === href), href).toBe(true);
      }
    }
  });

  it("shows a new badge only for tools added within the previous 14 days", () => {
    const today = new Date("2026-11-05T12:00:00Z");
    expect(isRecentlyAdded({ createdAt: "2026-11-05T10:35:47+03:00" }, today)).toBe(true);
    expect(isRecentlyAdded({ createdAt: "2026-10-23T12:00:00Z" }, today)).toBe(true);
    expect(isRecentlyAdded({ createdAt: "2026-10-22T12:00:00Z" }, today)).toBe(false);
    expect(isRecentlyAdded({}, today)).toBe(false);
    expect(isRecentlyAdded({ createdAt: "2026-11-06" }, today)).toBe(false);
  });

  it("uses only valid, distinct, non-self internal recommendations for each calculator", () => {
    const toolIds = new Set(tools.map((tool) => tool.id));
    for (const tool of tools) {
      const related = getRelatedTools(tool.id);
      const ids = related.map((item) => item.id);
      expect(relatedToolIds[tool.id], tool.id).toBeDefined();
      expect(ids.length, tool.id).toBeGreaterThanOrEqual(4);
      expect(ids.length, tool.id).toBeLessThanOrEqual(4);
      expect(new Set(ids).size, tool.id).toBe(ids.length);
      expect(ids, tool.id).not.toContain(tool.id);
      for (const id of ids) expect(toolIds.has(id), `${tool.id} -> ${id}`).toBe(true);
      expect(related.filter((item) => item.category === tool.category).length, tool.id).toBeGreaterThanOrEqual(4);
    }
  });

  it("provides complete long-form content and FAQ schema for the four prioritized calculators", () => {
    const prioritized = ["kdv-hesaplama", "yuzde-hesaplama", "maas-zam-artis-hesaplama", "not-ortalamasi-gano-hesaplama", "birim-donusturme", "brut-net-maas-hesaplama"];
    for (const id of prioritized) {
      const tool = tools.find((item) => item.id === id);
      expect(tool?.content, id).toBeDefined();
      const content = tool!.content!;
      expect(content.definition.trim().split(/\s+/).length, id).toBeGreaterThanOrEqual(150);
      expect(content.steps.length, id).toBeGreaterThanOrEqual(3);
      expect(content.examples.length, id).toBeGreaterThanOrEqual(2);
      expect(content.faqs.length, id).toBeGreaterThanOrEqual(6);
      expect(content.faqs.length, id).toBeLessThanOrEqual(8);
      expect(content.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(content.sources.length).toBeGreaterThan(0);
      expect(createFAQPageStructuredData(content.faqs).mainEntity).toEqual(content.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer }
      })));
    }
    expect(tools.find((item) => item.id === "kdv-hesaplama")?.content?.referenceTable?.rows).toHaveLength(3);
  });

  it("provides long-form content, six or more FAQs, and official sources for every new finance calculator", () => {
    expect(regulatedTools).toHaveLength(12);
    for (const tool of regulatedTools) {
      expect(tool.content, tool.id).toBeDefined();
      const content = tool.content!;
      expect(content.definition.trim().split(/\s+/).length, tool.id).toBeGreaterThanOrEqual(150);
      expect(content.steps.length, tool.id).toBeGreaterThanOrEqual(3);
      expect(content.examples.length, tool.id).toBeGreaterThanOrEqual(2);
      expect(content.faqs.length, tool.id).toBeGreaterThanOrEqual(6);
      expect(content.faqs.length, tool.id).toBeLessThanOrEqual(8);
      expect(content.sources.length, tool.id).toBeGreaterThan(0);
    }
  });

  it("keeps unverified annual financial values blocked and cites statutory labor and title-deed values", () => {
    for (const id of [
      "kidem-tazminati-hesaplama", "kira-artis-orani-hesaplama", "konut-kredisi-hesaplama",
      "ihtiyac-kredisi-hesaplama", "tasit-kredisi-hesaplama", "mevduat-faiz-hesaplama",
      "gelir-vergisi-dilimi-hesaplama", "damga-vergisi-hesaplama", "altin-hesaplama"
    ]) {
      expect(getRegulatedToolTodo(id).length, id).toBeGreaterThan(0);
    }
    expect(getRegulatedToolTodo("ihbar-tazminati-hesaplama")).toEqual([]);
    expect(getRegulatedToolTodo("yillik-izin-ucreti-hesaplama")).toEqual([]);
    expect(getRegulatedToolTodo("tapu-harci-hesaplama")).toEqual([]);
    expect(regulatedConfig2026.noticePeriods.bands.map((band) => band.weeks)).toEqual([2, 4, 6, 8]);
    expect([
      regulatedConfig2026.annualLeave.firstBandMinimumDays,
      regulatedConfig2026.annualLeave.secondBandMinimumDays,
      regulatedConfig2026.annualLeave.thirdBandMinimumDays
    ]).toEqual([14, 20, 26]);
    expect(regulatedConfig2026.titleDeed.buyerRate.value).toBe(0.02);
    expect(regulatedConfig2026.titleDeed.sellerRate.value).toBe(0.02);
  });

  it("adds the requested exam, diploma, health, and calendar tools with long-form content", () => {
    expect(educationHealthTools).toHaveLength(13);
    for (const tool of educationHealthTools) {
      expect(tool.content, tool.id).toBeDefined();
      const content = tool.content!;
      expect(content.definition.trim().split(/\s+/).length, tool.id).toBeGreaterThanOrEqual(150);
      expect(content.steps.length, tool.id).toBeGreaterThanOrEqual(3);
      expect(content.examples.length, tool.id).toBeGreaterThanOrEqual(2);
      expect(content.faqs.length, tool.id).toBeGreaterThanOrEqual(6);
      expect(content.faqs.length, tool.id).toBeLessThanOrEqual(8);
      expect(content.sources.length, tool.id).toBeGreaterThan(0);
    }
    const medicalTools = tools.filter((tool) => tool.medicalDisclaimer);
    expect(medicalTools.map((tool) => tool.id)).toEqual(expect.arrayContaining([
      "ideal-kilo-hesaplama", "gunluk-kalori-ihtiyaci-hesaplama", "gunluk-su-ihtiyaci-hesaplama",
      "yumurtlama-adet-takvimi-hesaplama", "boy-kilo-orani-hesaplama", "gebelik-haftasi-hesaplama"
    ]));
    for (const exam of Object.values(educationHealthConfig2026.exams)) {
      expect(getExamConfigTodo(exam)).toHaveLength(1);
      expect(exam.lastUpdated).toBe("2026-11-09");
      expect(exam.sections.length).toBeGreaterThan(0);
    }
  });

  it("leaves all other calculator content explicitly pending for follow-up", () => {
    const completed = new Set([
      "kdv-hesaplama", "yuzde-hesaplama", "maas-zam-artis-hesaplama",
      "not-ortalamasi-gano-hesaplama", "birim-donusturme", "brut-net-maas-hesaplama",
      ...regulatedTools.map((tool) => tool.id),
      ...educationHealthTools.map((tool) => tool.id)
    ]);
    const todoTools = tools.filter((tool) => !tool.content);
    expect(todoTools).toHaveLength(tools.length - completed.size);
    expect(todoTools.every((tool) => !completed.has(tool.id))).toBe(true);
  });

  it("removes merged tool URLs from the catalogue and maps legacy paths to replacements", () => {
    expect(legacyCalculatorRedirects).toEqual({
      "/not-ortalamasi-hesaplama": "/not-ortalamasi-gano-hesaplama",
      "/ders-ortalamasi-hesaplama": "/not-ortalamasi-gano-hesaplama",
      "/maas-zam-hesaplama": "/maas-zam-artis-hesaplama",
      "/maas-artis-hesaplama": "/maas-zam-artis-hesaplama"
    });
    for (const oldId of ["not-ortalamasi-hesaplama", "ders-ortalamasi-hesaplama", "maas-zam-hesaplama", "maas-artis-hesaplama"]) {
      expect(tools.some((tool) => tool.id === oldId)).toBe(false);
    }
    expect(tools.some((tool) => tool.id === "not-ortalamasi-gano-hesaplama")).toBe(true);
    expect(tools.some((tool) => tool.id === "maas-zam-artis-hesaplama")).toBe(true);
    const config = readFileSync(new URL("../../next.config.mjs", import.meta.url), "utf8");
    expect((config.match(/statusCode: 301/g) ?? [])).toHaveLength(4);
  });

  it("links legacy volume, weight, and time calculators to the universal converter", () => {
    for (const id of ["litre-donusumu", "kilogram-donusumu", "saat-dakika-donusturme"]) {
      expect(getRelatedTools(id).map((tool) => tool.id)).toContain("birim-donusturme");
    }
  });

  it("publishes the AdSense seller declaration at the public root", () => {
    const adsTxt = readFileSync(new URL("../../public/ads.txt", import.meta.url), "utf8").trim();
    expect(adsTxt).toBe("google.com, pub-6994844378081796, DIRECT, f08c47fec0942fa0");
  });

  it("documents current privacy practices and provides working contact and reporting paths", () => {
    const calculatorPage = readFileSync(new URL("../app/[slug]/page.tsx", import.meta.url), "utf8");
    const contactPage = readFileSync(new URL("../app/iletisim/page.tsx", import.meta.url), "utf8");
    const contactForm = readFileSync(new URL("../components/ContactForm.tsx", import.meta.url), "utf8");
    const privacyPage = readFileSync(new URL("../app/gizlilik-politikasi/page.tsx", import.meta.url), "utf8");
    const cookiePage = readFileSync(new URL("../app/cerez-politikasi/page.tsx", import.meta.url), "utf8");

    expect(calculatorPage).toContain("Bu araç bilgilendirme amaçlıdır.");
    expect(calculatorPage).toContain("Hata mı gördünüz? Bildirin");
    expect(calculatorPage).toContain("tool.medicalDisclaimer || category.id === \"finans\"");
    expect(contactPage).toContain("<ContactForm />");
    expect(contactForm).toContain("mailto:${contactEmail}");
    expect(privacyPage).toContain("şu anda ayrıca bir analitik hizmeti yapılandırılmamıştır");
    expect(privacyPage).toContain("localStorage");
    expect(cookiePage).toContain("çerez tercih paneli");
    expect(cookiePage).toContain("Google AdSense");
  });

  it("generates a noindex embeddable page for every calculator with attribution and an embed-code dialog", () => {
    const embedPage = readFileSync(new URL("../app/embed/[slug]/page.tsx", import.meta.url), "utf8");
    const calculatorPage = readFileSync(new URL("../app/[slug]/page.tsx", import.meta.url), "utf8");
    const embedButton = readFileSync(new URL("../components/EmbedToolButton.tsx", import.meta.url), "utf8");
    const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

    expect(embedPage).toContain("return tools.map((tool) => ({ slug: tool.id }))");
    expect(embedPage).toContain("robots: { index: false, follow: true }");
    expect(embedPage).toContain("PratikHesap tarafından");
    expect(embedPage).toContain('trackUsage={false}');
    expect(calculatorPage).toContain("<EmbedToolButton");
    expect(embedButton).toContain("<dialog");
    expect(embedButton).toContain("navigator.clipboard.writeText(embedCode)");
    expect(embedButton).toContain('src="${embedUrl}"');
    expect(layout).toContain("<AdSenseScript />");
  });

  it("generates one canonical sitemap URL for every static page, category, and calculator", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(entries).toHaveLength(6 + categories.length + tools.length);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.startsWith("https://www.hesappratik.xyz/"))).toBe(true);
    expect(urls.every((url) => !url.includes("?") && !url.includes("#") && !url.includes("/embed/"))).toBe(true);
    for (const tool of tools) expect(urls).toContain(`https://www.hesappratik.xyz/${tool.id}`);
    expect(urls).toContain("https://www.hesappratik.xyz/kullanim-kosullari");
    expect(urls).toContain("https://www.hesappratik.xyz/cerez-politikasi");
    const entriesByUrl = new Map(entries.map((entry) => [entry.url, entry]));
    for (const tool of tools) {
      const lastModified = tool.updatedAt ?? tool.content?.lastUpdated ?? tool.createdAt?.slice(0, 10);
      if (lastModified) expect(entriesByUrl.get(`https://www.hesappratik.xyz/${tool.id}`)?.lastModified).toBe(lastModified);
    }
    for (const path of ["/hakkimizda", "/iletisim", "/gizlilik-politikasi", "/cerez-politikasi"]) {
      expect(entriesByUrl.get(`https://www.hesappratik.xyz${path}`)?.lastModified).toBe("2026-11-09");
    }
    expect(entriesByUrl.get("https://www.hesappratik.xyz/kullanim-kosullari")?.lastModified).toBe("2026-11-02");
  });

  it("publishes crawler rules and a sitemap URL", () => {
    const source = readFileSync(new URL("../app/robots.ts", import.meta.url), "utf8");
    expect(source).toContain('allow: "/"');
    expect(source).toContain("`${siteUrl}/sitemap.xml`");
  });
});
