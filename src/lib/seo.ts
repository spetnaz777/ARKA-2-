import { PROJECTS, SERVICES, SITE } from "../content/site";
import { GTA_AREAS, LOCAL_PAGES, POSTS } from "../content/growth";

export type Meta = {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  /** Absolute URL of the 1200×630 social card for this route. */
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: "website" | "article";
  jsonLd?: object[];
  /** Critical images to preload for this route (emitted by the prerenderer). */
  preload?: { href?: string; srcset?: string; sizes?: string; type: string; media?: string }[];
  sitemap?: { priority: string; changefreq: string; lastmod?: string };
};

/* Bump when a page's content materially changes (drives sitemap <lastmod>). */
const UPDATED = "2026-11-24";

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;
const og = (name: string) => `${SITE.url}/og/${name}.jpg`;
const abs = (path: string) => SITE.url + (path === "/" ? "/" : path);

/* Hero photo preload (AVIF, same srcset/sizes as the CineHero <picture>). */
const heroPreload = (k: string) => [
  { srcset: `/media/v8/${k}-800.avif 800w, /media/v8/${k}-1600.avif 1600w`, sizes: "100vw", type: "image/avif" },
];

const AREA_SERVED = [
  ...GTA_AREAS.map((name) => ({ "@type": "City", name, containedInPlace: { "@type": "AdministrativeArea", name: "Ontario" } })),
  { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
  { "@type": "Country", name: "Canada" },
];

/* Organization: verified facts only (name, site, logo, email, GTA base,
   services). No street address, phone, reviews or sameAs: none are
   published/verified yet. */
export const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: "ARKA",
  url: `${SITE.url}/`,
  logo: { "@type": "ImageObject", url: `${SITE.url}/arka-logo.svg`, width: 400, height: 400 },
  image: og("home"),
  email: SITE.email,
  slogan: SITE.positioning,
  description:
    "ARKA is a founder-led AI, software and digital-growth studio based in the Greater Toronto Area, Canada. It builds AI automation and chatbots, custom websites and software, digital marketing systems and technology consulting for small and growing businesses, working with clients worldwide.",
  address: { "@type": "PostalAddress", addressLocality: "Toronto", addressRegion: "ON", addressCountry: "CA" },
  areaServed: AREA_SERVED,
  contactPoint: { "@type": "ContactPoint", email: SITE.email, contactType: "sales", availableLanguage: ["English"], areaServed: "Worldwide" },
  knowsAbout: [
    "AI automation",
    "AI chatbots",
    "Lead follow-up automation",
    "Web development",
    "Custom software development",
    "Technical SEO",
    "Digital marketing",
    "Marketing automation",
    "Technology consulting",
    "Cybersecurity",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "ARKA services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: `${SITE.url}/services/${s.slug}` },
    })),
  },
};

const WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": SITE_ID,
  name: "ARKA",
  url: `${SITE.url}/`,
  description: "AI, software and digital growth studio in the Greater Toronto Area.",
  publisher: { "@id": ORG_ID },
  inLanguage: "en-CA",
};

const crumbs = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});

const webPage = (type: string, path: string, name: string, description: string, image: string, extra: object = {}) => ({
  "@context": "https://schema.org",
  "@type": type,
  "@id": `${abs(path)}#webpage`,
  url: abs(path),
  name,
  description,
  isPartOf: { "@id": SITE_ID },
  about: { "@id": ORG_ID },
  primaryImageOfPage: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
  inLanguage: "en-CA",
  dateModified: UPDATED,
  ...extra,
});

const faqPage = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

const page = (
  path: string,
  title: string,
  description: string,
  image: string,
  opts: { type?: string; crumbs?: [string, string][]; extra?: object[]; preload?: Meta["preload"]; sitemap: Meta["sitemap"]; alt?: string },
): Meta => ({
  path,
  title,
  description,
  ogImage: image,
  ogImageAlt: opts.alt ?? title,
  preload: opts.preload,
  jsonLd: [
    webPage(opts.type ?? "WebPage", path, title, description, image),
    ...(opts.extra ?? []),
    ...(opts.crumbs ? [crumbs(opts.crumbs)] : []),
  ],
  sitemap: { lastmod: UPDATED, ...opts.sitemap! },
});

export const ROUTES: Meta[] = [
  {
    path: "/",
    title: "ARKA — AI, Software & Digital Growth Studio | GTA",
    description:
      "ARKA builds AI automation, custom websites, software and marketing systems for growth. Founder-led studio in the Greater Toronto Area, working worldwide.",
    ogImage: og("home"),
    ogImageAlt: "ARKA — AI, Software & Digital Growth",
    jsonLd: [ORGANIZATION, WEBSITE, webPage("WebPage", "/", "ARKA — AI, Software & Digital Growth Studio", "AI, software and digital growth studio in the Greater Toronto Area.", og("home"))],
    sitemap: { priority: "1.0", changefreq: "monthly", lastmod: UPDATED },
  },
  page(
    "/services",
    "Services: AI, Web, Marketing & Tech Consulting | ARKA",
    "Four connected services from a GTA studio: AI solutions, web and software development, digital marketing and tech consulting, built as one system.",
    og("services"),
    {
      type: "CollectionPage",
      crumbs: [["Home", "/"], ["Services", "/services"]],
      preload: heroPreload("orbit-night"),
      extra: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `${SITE.url}/services/${s.slug}` })),
        },
      ],
      sitemap: { priority: "0.9", changefreq: "monthly" },
    },
  ),
  ...SERVICES.map<Meta>((s) =>
    page(`/services/${s.slug}`, s.metaTitle, s.metaDesc, og(`service-${s.slug}`), {
      crumbs: [["Home", "/"], ["Services", "/services"], [s.name, `/services/${s.slug}`]],
      preload: heroPreload(({ ai: "ai-datacentre", web: "web-code", marketing: "mkt-analytics", consulting: "con-circuit" } as const)[s.graphic]),
      extra: [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${SITE.url}/services/${s.slug}#service`,
          name: s.name,
          serviceType: s.name,
          description: s.intro,
          provider: { "@id": ORG_ID },
          areaServed: AREA_SERVED,
          url: `${SITE.url}/services/${s.slug}`,
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${s.name} capabilities`,
            itemListElement: s.capabilities.map((c) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: c.t, description: c.d } })),
          },
        },
        faqPage(s.faq),
      ],
      sitemap: { priority: "0.9", changefreq: "monthly" },
    }),
  ),
  ...LOCAL_PAGES.map<Meta>((l) => {
    const svc = SERVICES.find((s) => s.slug === l.service)!;
    return page(`/${l.slug}`, l.metaTitle, l.metaDesc, og(`local-${l.slug}`), {
      crumbs: [["Home", "/"], ["Services", "/services"], [svc.name, `/services/${svc.slug}`], [l.short, `/${l.slug}`]],
      preload: heroPreload(l.photo),
      extra: [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: l.metaTitle.replace(/ \| ARKA$/, ""),
          serviceType: svc.name,
          description: l.intro,
          provider: { "@id": ORG_ID },
          areaServed: AREA_SERVED,
          url: abs(`/${l.slug}`),
          isRelatedTo: { "@id": `${SITE.url}/services/${svc.slug}#service` },
        },
        faqPage(l.faq),
      ],
      sitemap: { priority: "0.8", changefreq: "monthly" },
    });
  }),
  page(
    "/work",
    "Work: Websites & Platforms Built in the GTA | ARKA",
    "Selected websites and digital platforms ARKA has designed and built for real businesses in Toronto, the GTA and Ontario, with live links and case studies.",
    og("work"),
    {
      type: "CollectionPage",
      crumbs: [["Home", "/"], ["Work", "/work"]],
      preload: heroPreload("night-sky"),
      extra: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: PROJECTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: `${SITE.url}/work/${p.slug}` })),
        },
      ],
      sitemap: { priority: "0.8", changefreq: "monthly" },
    },
  ),
  ...PROJECTS.map<Meta>((p) => {
    const title = `${p.name}: ${p.category} Case Study | ARKA`;
    const desc = `${p.summary} ${p.sector}, ${p.location}. Designed and built by ARKA.`;
    return page(`/work/${p.slug}`, title.length <= 60 ? title : `${p.name} Case Study | ARKA`, desc.length <= 155 ? desc : `${p.summary} Designed and built by ARKA.`, og(`work-${p.slug}`), {
      crumbs: [["Home", "/"], ["Work", "/work"], [p.name, `/work/${p.slug}`]],
      extra: [
        {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "@id": `${SITE.url}/work/${p.slug}#work`,
          name: `${p.name} website`,
          headline: `${p.name} — ${p.category}`,
          description: p.overview,
          genre: p.category,
          creator: { "@id": ORG_ID },
          about: { "@type": "Organization", name: p.name, url: p.url, description: p.sector },
          url: p.url,
          mainEntityOfPage: `${SITE.url}/work/${p.slug}`,
          keywords: p.scope.join(", "),
          inLanguage: "en-CA",
        },
      ],
      sitemap: { priority: "0.6", changefreq: "yearly" },
    });
  }),
  page(
    "/blog",
    "Journal: Guides on AI, Web & Digital Growth | ARKA",
    "Practical guides on AI automation, chatbots, websites, custom software and digital marketing for growing businesses, from ARKA, a GTA studio.",
    og("blog"),
    {
      type: "CollectionPage",
      crumbs: [["Home", "/"], ["Journal", "/blog"]],
      preload: heroPreload("night-sky"),
      extra: [
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${SITE.url}/blog#blog`,
          name: "The ARKA Journal",
          url: `${SITE.url}/blog`,
          publisher: { "@id": ORG_ID },
          inLanguage: "en-CA",
          blogPost: POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE.url}/blog/${p.slug}`,
            datePublished: p.published,
            dateModified: p.updated,
          })),
        },
      ],
      sitemap: { priority: "0.7", changefreq: "weekly" },
    },
  ),
  page(
    "/about",
    "About ARKA: Founder-Led AI & Software Studio in the GTA",
    "ARKA is a founder-led technology studio at the intersection of AI, software, design and growth. Based in the Greater Toronto Area, working worldwide.",
    og("about"),
    { type: "AboutPage", crumbs: [["Home", "/"], ["About", "/about"]], preload: heroPreload("orbit-day"), sitemap: { priority: "0.7", changefreq: "yearly" } },
  ),
  page(
    "/contact",
    "Contact ARKA: Book a Free Strategy Call",
    "Tell ARKA about your project. Free strategy call, clear scope and a quote for AI solutions, web development, digital marketing or tech consulting.",
    og("contact"),
    { type: "ContactPage", crumbs: [["Home", "/"], ["Contact", "/contact"]], preload: heroPreload("aurora"), sitemap: { priority: "0.8", changefreq: "yearly" } },
  ),
  page("/privacy", "Privacy Policy (Draft) | ARKA", "How ARKA handles information submitted through this website, including the contact form. Draft pending legal review.", og("home"), {
    crumbs: [["Home", "/"], ["Privacy", "/privacy"]],
    sitemap: { priority: "0.2", changefreq: "yearly" },
  }),
  page("/terms", "Terms of Use (Draft) | ARKA", "Terms governing use of the ARKA website, its content and external links. Draft pending legal review.", og("home"), {
    crumbs: [["Home", "/"], ["Terms", "/terms"]],
    sitemap: { priority: "0.2", changefreq: "yearly" },
  }),
];

export const NOT_FOUND: Meta = {
  path: "/404",
  title: "Page Not Found | ARKA",
  description: "The page you were looking for doesn't exist.",
  ogImage: og("home"),
  noindex: true,
};

export const metaFor = (path: string) => ROUTES.find((r) => r.path === path) ?? NOT_FOUND;
export const canonical = (path: string) => SITE.url + (path === "/" ? "/" : path);
