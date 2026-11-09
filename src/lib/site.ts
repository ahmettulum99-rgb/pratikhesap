const canonicalSiteUrl = "https://www.hesappratik.xyz";
const configuredSiteUrl = process.env.SITE_URL ?? canonicalSiteUrl;
const configuredUrl = new URL(configuredSiteUrl);

if (!["hesappratik.xyz", "www.hesappratik.xyz"].includes(configuredUrl.hostname)) {
  throw new Error("SITE_URL must use hesappratik.xyz or www.hesappratik.xyz.");
}

export const siteUrl = canonicalSiteUrl;
