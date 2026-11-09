import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const canonicalOrigin = "https://www.hesappratik.xyz";
const nextCliPath = resolve(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const prerenderManifestPath = resolve(process.cwd(), ".next", "prerender-manifest.json");
const excludedPaths = new Set(["/icon.svg", "/manifest.webmanifest", "/robots.txt", "/sitemap.xml"]);
const serverOutput = [];

async function getAvailablePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string", "Could not allocate a local validation port");
  await new Promise((resolveClose, rejectClose) => {
    server.close((error) => error ? rejectClose(error) : resolveClose());
  });
  return address.port;
}

async function startBuiltApp() {
  const port = await getAvailablePort();
  const child = spawn(process.execPath, [nextCliPath, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      NEXT_TELEMETRY_DISABLED: "1"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  for (const stream of [child.stdout, child.stderr]) {
    stream.setEncoding("utf8");
    stream.on("data", (chunk) => serverOutput.push(chunk));
  }

  const baseUrl = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Built Next.js server exited before becoming ready.\n${serverOutput.join("")}`);
    }

    try {
      const response = await fetch(`${baseUrl}/robots.txt`, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return { child, baseUrl };
    } catch {
      await delay(250);
    }
  }

  child.kill();
  throw new Error(`Built Next.js server did not start within 30 seconds.\n${serverOutput.join("")}`);
}

async function stopBuiltApp(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill();
  await Promise.race([once(child, "exit"), delay(5_000)]);
  if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
}

const prerenderManifest = JSON.parse(await readFile(prerenderManifestPath, "utf8"));
const expectedPaths = Object.keys(prerenderManifest.routes)
  .filter((path) => path === "/" || (
    !path.startsWith("/_")
    && !path.startsWith("/api/")
    && !path.startsWith("/embed/")
    && !excludedPaths.has(path)
    && !/\.[a-z0-9]+$/i.test(path)
  ))
  .sort();

const { child, baseUrl } = await startBuiltApp();

try {
  const [sitemapResponse, robotsResponse] = await Promise.all([
    fetch(`${baseUrl}/sitemap.xml`, { redirect: "manual" }),
    fetch(`${baseUrl}/robots.txt`, { redirect: "manual" })
  ]);
  const [xml, robots] = await Promise.all([sitemapResponse.text(), robotsResponse.text()]);

  assert.equal(sitemapResponse.status, 200, "Sitemap route must return HTTP 200 without redirects");
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /^application\/xml\b/i);
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
  assert.deepEqual([...locations].sort(), expectedPaths, "Sitemap URLs must match generated public page routes");

  for (let index = 0; index < locations.length; index += 8) {
    const pageResponses = await Promise.all(locations.slice(index, index + 8).map(async (pathname) => {
      const response = await fetch(`${baseUrl}${pathname}`, { redirect: "manual" });
      const body = await response.text();
      assert.equal(response.status, 200, `Sitemap page must return HTTP 200: ${pathname}`);
      assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, `Sitemap URL must resolve to HTML: ${pathname}`);
      assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex/i, `Sitemap page has X-Robots-Tag noindex: ${pathname}`);
      assert.doesNotMatch(body, /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i, `Sitemap page has a noindex meta tag: ${pathname}`);
      return pathname;
    }));
    assert.equal(pageResponses.length, locations.slice(index, index + 8).length);
  }

  assert.equal(robotsResponse.status, 200, "robots.txt route must return HTTP 200 without redirects");
  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
  assert.match(robots, /^User-Agent: \*\r?\nAllow: \//m);
  assert.match(robots, /^Disallow: \/api\/$/m);
  assert.match(robots, /^Disallow: \/embed\/$/m);
  assert.doesNotMatch(robots, /^\s*Disallow:\s*\/\s*$/m);
  assert.match(robots, new RegExp(`^Sitemap: ${canonicalOrigin.replaceAll(".", "\\.")}/sitemap\\.xml$`, "m"));

  console.log(`Validated HTTP ${sitemapResponse.status} sitemap (${locations.length} URLs) and robots.txt.`);
} finally {
  await stopBuiltApp(child);
}
