/* Centralised site content. Every claim here is drawn from ARKA's existing
   site copy, brand knowledge base or services playbook. No invented metrics,
   clients, testimonials, addresses or social accounts. */

export const SITE = {
  name: "ARKA",
  url: "https://www.arkalegion.com",
  email: "hello@arkalegion.com",
  location: "Greater Toronto Area, Canada",
  locationShort: "GTA-Based · Worldwide",
  positioning: "AI, Software & Digital Growth",
  cta: "Let's Build What's Next.",
};

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
];

export type ServiceIconName = "chip" | "code" | "bars" | "layers";

export type Service = {
  slug: string;
  n: string;
  short: string; // card title
  name: string; // page title
  icon: ServiceIconName;
  card: string;
  graphic: "ai" | "web" | "marketing" | "consulting";
  heroTitle: [string, string]; // second part italic
  intro: string;
  metaTitle: string;
  metaDesc: string;
  problems: { t: string; d: string }[];
  solution: { lead: string; points: string[] };
  capabilities: { t: string; d: string }[];
  useCases: { t: string; d: string }[];
  workflow: { t: string; d: string }[];
  exampleSlugs: string[];
  faq: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "ai-solutions",
    n: "01",
    short: "AI Solutions",
    name: "AI Solutions",
    icon: "chip",
    card: "Custom AI tools, automation and system integration.",
    graphic: "ai",
    heroTitle: ["AI systems that do", "the repetitive work."],
    intro:
      "Custom AI tools, automation and integrations built around your workflows: lead follow-up, customer enquiries, scheduling, CRM syncing and the manual work in between.",
    metaTitle: "AI Solutions — Automation, Chatbots & Custom AI Tools | ARKA",
    metaDesc:
      "ARKA builds custom AI automation, AI chatbots and assistants, AI lead generation systems and internal AI tools, integrated with the software you already run.",
    problems: [
      { t: "Leads go cold", d: "Enquiries arrive after hours or during busy periods and wait too long for a reply." },
      { t: "Manual busywork", d: "Your team copies data between tools, chases follow-ups and rebuilds the same reports every week." },
      { t: "Disconnected tools", d: "CRM, inbox, calendar and billing each hold part of the picture, and none of them talk to each other." },
      { t: "AI without a plan", d: "You know AI could help, but nothing has been implemented in a way that actually saves time." },
    ],
    solution: {
      lead: "We map the workflows that cost you the most time, then build AI systems that run them end to end, connected to the tools you already use.",
      points: [
        "Built from scratch around your process, not a recycled template",
        "Large language models (Claude, OpenAI) wired into real business logic",
        "Workflow automation with tools such as Make.com, n8n and custom API code",
        "You own the code, workflows and integrations we deliver",
      ],
    },
    capabilities: [
      { t: "AI Automation", d: "End-to-end workflows for lead follow-up, scheduling, CRM syncing and repetitive back-office tasks." },
      { t: "AI Chatbots & Assistants", d: "Assistants trained on your business that answer questions, qualify leads and book meetings on your site or CRM." },
      { t: "AI Lead Generation", d: "Systems that find, qualify and nurture prospects against criteria you define, then route them to your calendar or CRM." },
      { t: "AI Customer Service", d: "Instant responses to website enquiries and messages so first contact never waits for office hours." },
      { t: "AI Applications & Internal Tools", d: "Custom AI apps, dashboards and document tools built on your own workflows and data." },
      { t: "Integrations", d: "Connections between CRMs, inboxes, calendars, spreadsheets and any tool with a REST API or webhook." },
    ],
    useCases: [
      { t: "Lead intake & follow-up", d: "A form submission is captured, enriched, replied to and logged in your CRM without anyone touching it." },
      { t: "Website assistant", d: "Visitors get accurate answers about your services, pricing approach and availability, with a hand-off to a human." },
      { t: "Proposal & document drafting", d: "AI drafts quotes, proposals and documents from your templates and notes for review." },
      { t: "Reporting", d: "Recurring reports are compiled from your tools automatically instead of by hand." },
    ],
    workflow: [
      { t: "Discover", d: "Map your workflows and find the highest-value automation." },
      { t: "Build", d: "Design the system, connect your tools and test with real cases." },
      { t: "Launch", d: "Go live with monitoring and a clear hand-over." },
      { t: "Refine", d: "Review performance and extend what works." },
    ],
    exampleSlugs: [],
    faq: [
      { q: "Do I need technical knowledge to work with ARKA?", a: "No. You explain the bottlenecks and the goal in plain terms; we handle everything technical." },
      { q: "Which tools can you integrate with?", a: "Most CRMs, inboxes, calendars and spreadsheets, plus any service with a REST API or webhook. We confirm specifics during scoping." },
      { q: "Who owns the systems you build?", a: "You do. Code, workflows and integrations are transferred to you." },
      { q: "How is pricing set?", a: "Every build is scoped and quoted per project after a free strategy call. There is no public price list." },
    ],
  },
  {
    slug: "web-development",
    n: "02",
    short: "Web Development",
    name: "Web & Software Development",
    icon: "code",
    card: "High-performance websites and digital platforms.",
    graphic: "web",
    heroTitle: ["Websites and platforms", "built to perform."],
    intro:
      "Custom websites, web applications and digital platforms: fast, mobile-first, accessible and structured for search, with the integrations your business runs on.",
    metaTitle: "Web & Software Development — Custom Websites & Web Apps | ARKA",
    metaDesc:
      "Custom websites and web applications from ARKA: mobile-first, fast, accessible and structured for search, built with modern frameworks and integrated with your tools.",
    problems: [
      { t: "Slow, dated sites", d: "Template sites that load slowly on phones and do not reflect the quality of the business behind them." },
      { t: "Invisible in search", d: "Pages without proper structure, metadata or sitemaps that search engines struggle to index." },
      { t: "Dead-end forms", d: "Contact forms that drop enquiries or never reach the right inbox." },
      { t: "No room to grow", d: "Platforms that can't take new pages, features or integrations without a rebuild." },
    ],
    solution: {
      lead: "We design and build each site from scratch with a modern stack, tuned for speed, accessibility and search from the first commit.",
      points: [
        "Custom design, no templates",
        "Modern frameworks such as React and Next.js, deployed on Vercel",
        "Technical SEO foundations: metadata, structured data, sitemaps, prerendering",
        "Forms, booking and CRM integrations that actually deliver",
      ],
    },
    capabilities: [
      { t: "Marketing Websites", d: "Conversion-focused business sites with clear service pages and calls to action." },
      { t: "Web Applications", d: "Custom web apps, portals and internal tools built around your workflows." },
      { t: "Technical SEO", d: "Clean URLs, per-page metadata, schema markup, sitemaps and prerendered HTML." },
      { t: "Performance & Accessibility", d: "Mobile-first builds with optimised assets, keyboard support and readable contrast." },
      { t: "Integrations", d: "Forms, email delivery, booking, payments and CRM connections." },
      { t: "AI-Enhanced Features", d: "Chat assistants, lead capture and automation wired into the site from launch." },
    ],
    useCases: [
      { t: "Service business site", d: "A local or regional business that needs credibility, clear services and enquiries that convert." },
      { t: "Professional profile", d: "A personal brand site for a practitioner or agent, built around trust and contact." },
      { t: "Clinic or practice", d: "Service, practitioner and location pages structured for patients and search." },
      { t: "Internal platform", d: "A custom tool or dashboard that replaces spreadsheets and manual processes." },
    ],
    workflow: [
      { t: "Discover", d: "Goals, audience, pages and content." },
      { t: "Design", d: "Layout, visual system and key journeys." },
      { t: "Develop", d: "Build, integrate and test across devices." },
      { t: "Launch", d: "Deploy, submit for indexing and monitor." },
    ],
    exampleSlugs: ["royal-caspian", "healexa-clinic", "mehri-noshad", "six-side-marketing", "noctavius-aviation"],
    faq: [
      { q: "Do you use templates?", a: "No. Each site is designed and built for the business it represents." },
      { q: "Will my site be optimised for search?", a: "Every build ships with technical SEO foundations: unique titles and descriptions, canonical URLs, structured data and a sitemap." },
      { q: "Can you work with my existing domain and email?", a: "Yes. We connect your existing domain and leave email and DNS records you rely on intact." },
      { q: "Can the site grow later?", a: "Yes. Sites are built on modern, component-based frameworks so new pages and features can be added without a rebuild." },
    ],
  },
  {
    slug: "digital-marketing",
    n: "03",
    short: "Digital Marketing",
    name: "Digital Marketing",
    icon: "bars",
    card: "Data-driven campaigns, content and brand growth.",
    graphic: "marketing",
    heroTitle: ["Marketing that compounds", "into growth."],
    intro:
      "Content, social, paid campaigns and marketing automation, planned around data and connected to the systems that capture and follow up every lead.",
    metaTitle: "Digital Marketing — Content, Paid Ads & Marketing Automation | ARKA",
    metaDesc:
      "ARKA plans and runs digital marketing: content and social media, paid ads, photo and video, SEO content and AI-driven marketing automation connected to your CRM.",
    problems: [
      { t: "Inconsistent content", d: "Posting happens when there is time, so the brand disappears for weeks." },
      { t: "Ads without tracking", d: "Spend goes out but nobody can say which campaigns produced enquiries." },
      { t: "Leads without follow-up", d: "Campaigns generate interest that is never nurtured into a conversation." },
      { t: "Few reviews", d: "Happy customers rarely leave reviews unless someone asks at the right moment." },
    ],
    solution: {
      lead: "We connect content, campaigns and automation into one system, so every channel feeds a follow-up process you can measure.",
      points: [
        "Content and social planned around a consistent brand voice",
        "Paid campaigns with tracking set up before spend starts",
        "Email sequences and retargeting flows that run without manual sending",
        "Review requests and reputation workflows built into the customer journey",
      ],
    },
    capabilities: [
      { t: "Content & Social Media", d: "Planned content and posting that keeps your brand visible." },
      { t: "Paid Ads", d: "Campaigns built to drive real enquiries, with tracking in place." },
      { t: "Photo & Video", d: "Visual content for your site, social channels and campaigns." },
      { t: "Marketing Automation", d: "AI-assisted email sequences, retargeting flows and campaign logic." },
      { t: "SEO & Content Strategy", d: "Search-focused pages and articles structured to be found and cited." },
      { t: "Reviews & Reputation", d: "Automated review requests and response workflows." },
    ],
    useCases: [
      { t: "Launch campaign", d: "A new service or location announced across site, social and paid channels." },
      { t: "Nurture sequence", d: "New leads receive a timed, personalised sequence until they book or opt out." },
      { t: "Content engine", d: "A repeatable process that turns your expertise into regular posts and articles." },
      { t: "Review growth", d: "Customers are asked for a review automatically after a completed job." },
    ],
    workflow: [
      { t: "Audit", d: "Channels, audience and current performance." },
      { t: "Plan", d: "Positioning, content and campaign roadmap." },
      { t: "Launch", d: "Produce, publish and switch on tracking." },
      { t: "Optimise", d: "Measure, test and reallocate effort." },
    ],
    exampleSlugs: [],
    faq: [
      { q: "Do you run ads directly?", a: "Yes. We set up and manage paid campaigns, with conversion tracking configured before spend begins." },
      { q: "Can marketing connect to my CRM?", a: "Yes. Leads from forms and campaigns can flow into your CRM and trigger follow-up sequences automatically." },
      { q: "Do you produce content?", a: "Yes. Content, social media, photo and video are part of the service." },
      { q: "How do you report results?", a: "We agree the metrics that matter for your business at the start and report against them, not vanity numbers." },
    ],
  },
  {
    slug: "technology-consulting",
    n: "04",
    short: "Tech Consulting",
    name: "Technology Consulting",
    icon: "layers",
    card: "Strategy, architecture and scalable tech solutions.",
    graphic: "consulting",
    heroTitle: ["Clear technology decisions,", "built to scale."],
    intro:
      "Strategy, architecture, IT setup and security for growing businesses: a clear plan for which tools to use, how they connect and how to keep them protected.",
    metaTitle: "Technology Consulting — Strategy, IT Setup & Cybersecurity | ARKA",
    metaDesc:
      "Technology consulting from ARKA: AI and automation strategy, systems architecture, tool selection, IT and office setup, and cybersecurity for small and growing businesses.",
    problems: [
      { t: "Tool sprawl", d: "Subscriptions pile up while the team still works around the gaps between them." },
      { t: "No roadmap", d: "Technology decisions are made one emergency at a time." },
      { t: "Security gaps", d: "Small businesses are easy targets because basic protections were never set up." },
      { t: "Setup friction", d: "New staff, devices and offices take days to get working properly." },
    ],
    solution: {
      lead: "We review how your business actually runs, then design a practical architecture and roadmap, and can implement it with you.",
      points: [
        "Workflow and tool audit with clear recommendations",
        "Architecture for systems that can grow with the business",
        "IT and office setup so teams are productive from day one",
        "Security fundamentals informed by an IT and cybersecurity background",
      ],
    },
    capabilities: [
      { t: "AI & Automation Strategy", d: "Find where AI creates real leverage and where it doesn't." },
      { t: "Systems Architecture", d: "How your tools, data and integrations should fit together." },
      { t: "Tool Selection", d: "Choose platforms that fit your workflows and budget." },
      { t: "IT & Office Setup", d: "Devices, accounts, email and workspace configured properly." },
      { t: "Cybersecurity", d: "Practical protection for accounts, devices and data." },
      { t: "Implementation Support", d: "Hands-on help turning the plan into working systems." },
    ],
    useCases: [
      { t: "Automation readiness", d: "Identify the workflows worth automating first, and in what order." },
      { t: "Stack consolidation", d: "Replace overlapping tools with a smaller, connected set." },
      { t: "New office or team", d: "Get people, devices and accounts set up securely." },
      { t: "Security baseline", d: "Close the common gaps that leave small businesses exposed." },
    ],
    workflow: [
      { t: "Assess", d: "Current tools, workflows and risks." },
      { t: "Design", d: "Target architecture and priorities." },
      { t: "Roadmap", d: "Sequenced plan with clear next steps." },
      { t: "Implement", d: "Build, migrate and secure, together." },
    ],
    exampleSlugs: [],
    faq: [
      { q: "Is consulting a separate engagement?", a: "It can be. Many projects start with a strategy session that becomes the plan for a build." },
      { q: "Do you only advise, or also implement?", a: "Both. We can hand you a roadmap or build it with you." },
      { q: "Do you work remotely?", a: "Yes. ARKA is based in the Greater Toronto Area and works with clients remotely, across time zones." },
      { q: "What does the first conversation cover?", a: "Your current setup, what is slowing you down and where technology can help. You leave with clear next steps either way." },
    ],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

export type Project = {
  slug: string;
  name: string;
  category: string;
  sector: string;
  location: string;
  summary: string;
  overview: string;
  scope: string[];
  url: string;
  image?: string;
  wave: number; // contour-wave variant
};

/* Real ARKA client builds. Descriptions reflect each live site's public
   positioning; no performance metrics are published without client approval. */
export const PROJECTS: Project[] = [
  {
    slug: "royal-caspian",
    name: "Royal Caspian",
    category: "Web Platform",
    sector: "Luxury residential & commercial cleaning",
    location: "Toronto & GTA",
    summary: "Luxury cleaning brand website with service and location pages built for search.",
    overview:
      "Royal Caspian is a luxury cleaning company serving Toronto and the GTA: estate, house, deep, office and Airbnb cleaning by consultation. ARKA designed and built the website and its search foundations.",
    scope: ["Website design & development", "Service & location page architecture", "Technical & local SEO"],
    url: "https://royalcaspiancleaning.com",
    wave: 0,
  },
  {
    slug: "healexa-clinic",
    name: "Healexa Clinic",
    category: "Healthcare Website",
    sector: "Multidisciplinary health clinic",
    location: "North York & Thornhill",
    summary: "Clinic website for physiotherapy, chiropractic, massage and acupuncture services.",
    overview:
      "Healexa is a multidisciplinary clinic in North York and Thornhill offering physiotherapy, chiropractic care, therapeutic massage and acupuncture. ARKA designed and built the clinic's website.",
    scope: ["Website design & development", "Service & practitioner pages"],
    url: "https://drhealexa.com",
    wave: 1,
  },
  {
    slug: "mehri-noshad",
    name: "Mehri Noshad",
    category: "Real Estate Website",
    sector: "Real estate sales representative",
    location: "Toronto & GTA",
    summary: "Personal brand website for a GTA real estate sales representative.",
    overview:
      "Mehri Noshad is a RE/MAX sales representative serving the Greater Toronto Area. ARKA designed and built her personal brand website.",
    scope: ["Website design & development", "Personal brand presentation"],
    url: "https://mehrinoshad.ca",
    wave: 2,
  },
  {
    slug: "six-side-marketing",
    name: "Six Side Marketing",
    category: "Agency Website",
    sector: "Creative marketing & production",
    location: "Toronto",
    summary: "Website for a Toronto creative marketing and production team.",
    overview:
      "Six Side Marketing is a Toronto creative marketing team covering strategy, cinematic content, ads, websites and CRM. ARKA designed and built the team's website.",
    scope: ["Website design & development", "Portfolio & services presentation"],
    url: "https://sixsidemarketing.com",
    wave: 3,
  },
  {
    slug: "noctavius-aviation",
    name: "Noctavius Aviation",
    category: "Aviation Website",
    sector: "Private aircraft detailing",
    location: "Toronto & Ontario",
    summary: "Brand and website for a private aircraft detailing service across Ontario.",
    overview:
      "Noctavius Aviation provides private aircraft detailing for jets, turboprops and helicopters in Toronto and across Ontario. ARKA built the website and its brand presentation.",
    scope: ["Website design & development", "Brand presentation", "Regional service pages"],
    url: "https://rc-avation.vercel.app",
    wave: 4,
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export const PROCESS = [
  { n: "01", t: "Discover", d: "Goals, audience and opportunity." },
  { n: "02", t: "Build", d: "Design, develop and integrate." },
  { n: "03", t: "Grow", d: "Launch, market and optimize." },
  { n: "04", t: "Scale", d: "Iterate and expand results." },
];

/* Capability labels instead of unverified counts (no "50+ projects"). */
export const STUDIO_FACTS = [
  { v: "4", l: "Core Services" },
  { v: "AI", l: "Powered Delivery" },
  { v: "1:1", l: "Founder-Led" },
  { v: "GTA", l: "Based · Worldwide" },
];

export const PRINCIPLES = [
  { t: "Founder-led, not outsourced", d: "You work directly with the person designing and building your system. No account managers, no hand-offs." },
  { t: "No templates", d: "Every system is built around your workflows, your tools and your customers." },
  { t: "AI-powered efficiency", d: "AI accelerates our production, so you get senior-level work without agency overhead." },
  { t: "You own it", d: "Code, workflows and integrations are transferred to you." },
];
