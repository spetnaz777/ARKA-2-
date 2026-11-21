import { PROJECTS, SERVICES, SITE } from "../content/site";

export type Meta = {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  jsonLd?: object[];
  /** Critical images to preload for this route (emitted by the prerenderer). */
  preload?: { href: string; type: string; media?: string }[];
  sitemap?: { priority: string; changefreq: string };
};

const ORG_ID = `${SITE.url}/#organization`;

/* Organization: verified facts only (name, site, logo, email, GTA base,
   services). No sameAs — no social accounts are verified yet. */
export const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: "ARKA",
  url: SITE.url,
  logo: `${SITE.url}/arka-logo.svg`,
  image: `${SITE.url}/deep-black-hero.jpg`,
  email: SITE.email,
  slogan: SITE.positioning,
  description:
    "ARKA provides AI solutions, web and software development, digital marketing and technology consulting. Based in the Greater Toronto Area, working with clients worldwide.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "AI Automation",
    "AI Chatbots",
    "Web Development",
    "Digital Marketing",
    "Marketing Automation",
    "Technology Consulting",
    "Cybersecurity",
  ],
};

const crumbs = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: SITE.url + (path === "/" ? "/" : path),
  })),
});

export const ROUTES: Meta[] = [
  {
    path: "/",
    title: "ARKA — AI, Software & Digital Growth",
    description:
      "ARKA builds intelligent systems, modern websites and marketing ecosystems that drive real growth. AI solutions, web development, digital marketing and tech consulting. GTA-based, worldwide.",
    jsonLd: [
      ORGANIZATION,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: "ARKA",
        url: SITE.url,
        publisher: { "@id": ORG_ID },
        inLanguage: "en",
      },
    ],
    preload: [
      { href: "/media/terrain-480.avif", type: "image/avif", media: "(max-width: 700px)" },
      { href: "/media/moon-1600.avif", type: "image/avif", media: "(min-width: 1100px)" },
    ],
    sitemap: { priority: "1.0", changefreq: "monthly" },
  },
  {
    path: "/services",
    title: "Services — AI, Web, Marketing & Tech Consulting | ARKA",
    description:
      "Four connected services: AI solutions, web and software development, digital marketing and technology consulting — designed to work as one growth system.",
    jsonLd: [crumbs([["Home", "/"], ["Services", "/services"]])],
    sitemap: { priority: "0.9", changefreq: "monthly" },
  },
  ...SERVICES.map<Meta>((s) => ({
    path: `/services/${s.slug}`,
    title: s.metaTitle,
    description: s.metaDesc,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: s.name,
        description: s.metaDesc,
        provider: { "@id": ORG_ID },
        areaServed: "Worldwide",
        url: `${SITE.url}/services/${s.slug}`,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: s.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      crumbs([["Home", "/"], ["Services", "/services"], [s.name, `/services/${s.slug}`]]),
    ],
    sitemap: { priority: "0.8", changefreq: "monthly" },
  })),
  {
    path: "/work",
    title: "Work — Selected Client Builds | ARKA",
    description:
      "Selected websites and digital platforms ARKA has designed and built for businesses in Toronto, the GTA and Ontario.",
    jsonLd: [crumbs([["Home", "/"], ["Work", "/work"]])],
    sitemap: { priority: "0.8", changefreq: "monthly" },
  },
  ...PROJECTS.map<Meta>((p) => ({
    path: `/work/${p.slug}`,
    title: `${p.name} — ${p.category} | ARKA Work`,
    description: `${p.summary} Designed and built by ARKA.`,
    jsonLd: [crumbs([["Home", "/"], ["Work", "/work"], [p.name, `/work/${p.slug}`]])],
    sitemap: { priority: "0.6", changefreq: "yearly" },
  })),
  {
    path: "/about",
    title: "About — The ARKA Studio",
    description:
      "ARKA is a founder-led technology studio at the intersection of AI, software, design and growth. Based in the Greater Toronto Area, working worldwide.",
    jsonLd: [crumbs([["Home", "/"], ["About", "/about"]])],
    sitemap: { priority: "0.7", changefreq: "yearly" },
  },
  {
    path: "/contact",
    title: "Contact — Let's Build What's Next | ARKA",
    description:
      "Tell ARKA about your project. Free strategy call, clear scope and a quote — AI solutions, web development, digital marketing and tech consulting.",
    jsonLd: [crumbs([["Home", "/"], ["Contact", "/contact"]])],
    sitemap: { priority: "0.8", changefreq: "yearly" },
  },
  {
    path: "/privacy",
    title: "Privacy Policy (Draft) | ARKA",
    description: "How ARKA handles information submitted through this website. Draft pending legal review.",
    sitemap: { priority: "0.2", changefreq: "yearly" },
  },
  {
    path: "/terms",
    title: "Terms of Use (Draft) | ARKA",
    description: "Terms governing use of the ARKA website. Draft pending legal review.",
    sitemap: { priority: "0.2", changefreq: "yearly" },
  },
];

export const NOT_FOUND: Meta = {
  path: "/404",
  title: "Page Not Found | ARKA",
  description: "The page you were looking for doesn't exist.",
  noindex: true,
};

export const metaFor = (path: string) => ROUTES.find((r) => r.path === path) ?? NOT_FOUND;
export const canonical = (path: string) => SITE.url + (path === "/" ? "/" : path);
