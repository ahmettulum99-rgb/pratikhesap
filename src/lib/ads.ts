export const adSlots = {
  header: { id: "header", label: "Reklam alanı", description: "İçeriğin üstünde yer alabilecek reklam alanı." },
  content: { id: "content", label: "Reklam alanı", description: "İçerik akışında yer alabilecek reklam alanı." },
  calculator: { id: "calculator", label: "Reklam alanı", description: "Hesaplama aracının altında yer alabilecek reklam alanı." },
  footer: { id: "footer", label: "Reklam alanı", description: "Sayfa sonunda yer alabilecek reklam alanı." }
} as const;

export type AdSlotId = keyof typeof adSlots;
export const adsEnabled = false;
export const adsensePublisherId = "ca-pub-6994844378081796";
export const adsenseScriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`;
