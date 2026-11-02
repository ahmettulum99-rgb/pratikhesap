const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hesappratik.xyz").replace(/\/+$/, "");

export const siteUrl = configuredSiteUrl.replace(
  /^https:\/\/hesappratik\.xyz$/i,
  "https://www.hesappratik.xyz"
);
