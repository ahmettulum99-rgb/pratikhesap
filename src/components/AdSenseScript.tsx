"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { adsenseScriptSrc } from "@/lib/ads";

export function AdSenseScript() {
  const pathname = usePathname();
  if (pathname.startsWith("/embed/")) return null;

  return <Script id="adsense-script" src={adsenseScriptSrc} strategy="afterInteractive" crossOrigin="anonymous" />;
}
