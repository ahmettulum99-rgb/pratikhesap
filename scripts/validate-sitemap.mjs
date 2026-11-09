import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const buildDirectory = resolve(process.cwd(), ".next", "server", "app");
const sitemapPath = resolve(buildDirectory, "sitemap.xml.body");
const sitemapMetadataPath = resolve(buildDirectory, "sitemap.xml.meta");
const robotsPath = resolve(buildDirectory, "robots.txt.body");
const robotsMetadataPath = resolve(buildDirectory, "robots.txt.meta");
const prerenderManifestPath = resolve(process.cwd(), ".next", "prerender-manifest.json");
const canonicalOrigin = "https://www.hesappratik.xyz";

const [xml, sitemapMetadataJson, robots, robotsMetadataJson, prerenderManifestJson] = await Promise.all([
  readFile(sitemapPath, "utf8"),
  readFile(sitemapMetadataPath, "utf8"),
  readFile(robotsPath, "utf8"),
  readFile(robotsMetadataPath, "utf8"),
  readFile(prerenderManifestPath, "utf8")
]);

assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
assert.equal(XMLValidator.validate(xml), true, "Generated sitemap must be valid XML");

const sitemapDocument = new XMLParser({ ignoreAttributes: false }).parse(xml);
const urlset = sitemapDocument.urlset;
assert.equal(urlset["@_xmlns"], "http://www.sitemaps.org/schemas/sitemap/0.9");

const sitemapUrls = Array.isArray(urlset.url) ? urlset.url : [urlset.url];
assert.ok(sitemapUrls.length > 0, "Sitemap must contain public page URLs");
assert.ok(sitemapUrls.length <= 50_000, "Sitemap exceeded the single-file URL limit");
assert.ok(Buffer.byteLength(xml, "utf8") <= 50 * 1024 * 1024, "Sitemap exceeded the single-file size limit");

const locations = sitemapUrls.map((entry) => {
  assert.equal(typeof entry.loc, "string", "Every sitemap entry must have a location");
  const parsedUrl = new URL(entry.loc);
  assert.equal(parsedUrl.origin, canonicalOrigin, `Noncanonical sitemap URL: ${entry.loc}`);
  assert.equal(parsedUrl.search, "", `Query parameters are not allowed: ${entry.loc}`);
  assert.equal(parsedUrl.hash, "", `Fragments are not allowed: ${entry.loc}`);
  assert.ok(!parsedUrl.pathname.startsWith("/embed/"), `Noindex embed URL found: ${entry.loc}`);
  return parsedUrl.pathname;
});

assert.equal(new Set(locations).size, locations.length, "Sitemap contains duplicate URLs");

const prerenderManifest = JSON.parse(prerenderManifestJson);
const excludedPaths = new Set(["/icon.svg", "/manifest.webmanifest", "/robots.txt", "/sitemap.xml"]);
const expectedPaths = Object.keys(prerenderManifest.routes)
  .filter((path) => path === "/" || (
    !path.startsWith("/_")
    && !path.startsWith("/api/")
    && !path.startsWith("/embed/")
    && !excludedPaths.has(path)
    && !/\.[a-z0-9]+$/i.test(path)
  ))
  .sort();
assert.deepEqual([...locations].sort(), expectedPaths, "Sitemap URLs must match generated public page routes");

const sitemapMetadata = JSON.parse(sitemapMetadataJson);
assert.equal(sitemapMetadata.status, 200);
assert.match(sitemapMetadata.headers["content-type"], /^application\/xml\b/);

const robotsMetadata = JSON.parse(robotsMetadataJson);
assert.equal(robotsMetadata.status, 200);
assert.match(robotsMetadata.headers["content-type"], /^text\/plain\b/);
assert.match(robots, /^User-Agent: \*\r?\nAllow: \//m);
assert.doesNotMatch(robots, /^\s*Disallow:\s*\/\s*$/m);
assert.match(robots, new RegExp(`^Sitemap: ${canonicalOrigin.replaceAll(".", "\\.")}/sitemap\\.xml$`, "m"));

console.log(`Validated ${locations.length} canonical sitemap URLs and robots.txt.`);
