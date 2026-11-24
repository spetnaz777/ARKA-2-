// Prerender every route to static HTML with its own <title>, description,
// canonical, Open Graph and JSON-LD, then write sitemap.xml and 404.html.
// Runs after `vite build` (client) and `vite build --ssr` (server entry).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssr = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);
// Inline the single stylesheet: removes the render-blocking request (small file).
let template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
template = template.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (m, href) => {
  const css = fs.readFileSync(path.join(dist, href), "utf8");
  return css.length < 140000 ? `<style>${css}</style>` : m;
});

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const DEFAULT_OG = "https://www.arkalegion.com/og/home.jpg";
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

function head(meta, urlPath) {
  const url = ssr.canonical(urlPath);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.noindex
      ? `<meta name="robots" content="noindex, follow" />`
      : `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    meta.noindex ? "" : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    meta.noindex ? "" : `<link rel="alternate" hreflang="en-CA" href="${url}" />`,
    meta.noindex ? "" : `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    `<meta property="og:type" content="${meta.ogType ?? "website"}" />`,
    `<meta property="og:image" content="${meta.ogImage ?? DEFAULT_OG}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(meta.ogImageAlt ?? meta.title)}" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${meta.ogImage ?? DEFAULT_OG}" />`,
    `<meta name="twitter:image:alt" content="${esc(meta.ogImageAlt ?? meta.title)}" />`,
    ...(meta.preload ?? []).map((l) =>
      l.srcset
        ? `<link rel="preload" as="image" type="${l.type}" imagesrcset="${l.srcset}" imagesizes="${l.sizes ?? "100vw"}" />`
        : `<link rel="preload" as="image" href="${l.href}" type="${l.type}"${l.media ? ` media="${l.media}"` : ""} fetchpriority="high" />`,
    ),
    ...(meta.jsonLd ?? []).map((o) => `<script type="application/ld+json">${json(o)}</script>`),
  ];
  return tags.filter(Boolean).join("\n    ");
}

function page(meta, urlPath, renderPath = urlPath) {
  const html = ssr.render(renderPath);
  return template.replace("<!--head-->", head(meta, urlPath)).replace("<!--app-->", html);
}

const today = new Date().toISOString().slice(0, 10);
let count = 0;
for (const meta of ssr.ROUTES) {
  const out = meta.path === "/" ? path.join(dist, "index.html") : path.join(dist, meta.path.slice(1), "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(meta, meta.path));
  count++;
}
fs.writeFileSync(path.join(dist, "404.html"), page(ssr.NOT_FOUND, "/404"));

// sitemap: prerendered routes + static blog articles (dist/blog/<slug>.html)
const blogDir = path.join(dist, "blog");
const blog = fs.existsSync(blogDir) ? fs.readdirSync(blogDir).filter((f) => f.endsWith(".html") && f !== "index.html").sort() : [];
const postMeta = new Map(ssr.POSTS.map((p) => [p.slug, p]));
for (const f of blog) {
  const slug = f.replace(/\.html$/, "");
  if (!postMeta.has(slug)) throw new Error(`blog/${f} is missing from POSTS in src/content/growth.ts`);
}
for (const p of ssr.POSTS) {
  if (!blog.includes(`${p.slug}.html`)) throw new Error(`POSTS entry ${p.slug} has no public/blog/${p.slug}.html`);
}
const urls = [
  ...ssr.ROUTES.filter((r) => !r.noindex).map((r) => ({ loc: ssr.canonical(r.path), ...r.sitemap })),
  ...blog.map((f) => {
    const p = postMeta.get(f.replace(/\.html$/, ""));
    return { loc: `https://www.arkalegion.com/blog/${p.slug}`, lastmod: p.updated, changefreq: "monthly", priority: "0.6" };
  }),
];
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod ?? today}</lastmod>\n    <changefreq>${u.changefreq ?? "monthly"}</changefreq>\n    <priority>${u.priority ?? "0.5"}</priority>\n  </url>`)
    .join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), xml);

// sanity checks: every page must contain its own title and real markup
for (const meta of ssr.ROUTES) {
  const f = meta.path === "/" ? path.join(dist, "index.html") : path.join(dist, meta.path.slice(1), "index.html");
  const s = fs.readFileSync(f, "utf8");
  if (!s.includes(`<title>${esc(meta.title)}</title>`) || !s.includes("<main")) {
    throw new Error(`prerender check failed for ${meta.path}`);
  }
}
console.log(`prerendered ${count} routes + 404.html; sitemap.xml with ${urls.length} URLs`);
