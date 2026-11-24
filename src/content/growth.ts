/* Journal index + GTA landing pages. Same rule as site.ts: no invented
   metrics, clients, reviews, addresses or phone numbers. Regulatory facts
   (AODA, PIPEDA, CASL) are stated at the level of the public guidance and
   point readers to the official source for compliance decisions. */

export type Post = {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  topic: string;
};

/* Static articles live in public/blog/<slug>.html. Keep in sync. */
export const POSTS: Post[] = [
  {
    slug: "choosing-a-web-design-company-toronto",
    title: "How to Choose a Web Design Company in Toronto",
    description: "A buyer's checklist for hiring a Toronto web design company: questions to ask, red flags, ownership, accessibility and what a fair proposal includes.",
    published: "2026-11-24",
    updated: "2026-11-24",
    topic: "Web Development",
  },
  {
    slug: "custom-software-vs-off-the-shelf",
    title: "Custom Software vs Off-the-Shelf: How to Decide",
    description: "When off-the-shelf software is enough, when custom software pays off, and the hybrid path most growing businesses should consider first.",
    published: "2026-11-24",
    updated: "2026-11-24",
    topic: "Software",
  },
  {
    slug: "aoda-website-accessibility-ontario",
    title: "AODA Website Accessibility: A Practical Guide for Ontario Businesses",
    description: "What AODA requires of Ontario business websites, who it applies to, how WCAG 2.0 AA fits in, and a practical checklist for your next build.",
    published: "2026-11-24",
    updated: "2026-11-24",
    topic: "Web Development",
  },
  {
    slug: "ai-automation-for-business-guide",
    title: "AI Automation for Business: The Complete Guide",
    description: "What AI automation is, how to adopt it, which workflows to start with, common mistakes, tools and costs.",
    published: "2026-07-07",
    updated: "2026-11-24",
    topic: "AI Automation",
  },
  {
    slug: "ai-automation-cost",
    title: "AI Automation Cost: What You'll Actually Pay",
    description: "The real factors that move AI automation cost up or down, and how to budget for a first system.",
    published: "2026-07-07",
    updated: "2026-11-24",
    topic: "AI Automation",
  },
  {
    slug: "ai-chatbots-for-business-guide",
    title: "AI Chatbots for Business: A Practical Guide",
    description: "What an AI chatbot can and can't do for a business, how it's deployed, and mistakes to avoid.",
    published: "2026-07-07",
    updated: "2026-11-24",
    topic: "AI Automation",
  },
  {
    slug: "ai-automation-agency-vs-hiring",
    title: "AI Automation Agency vs Hiring In-House",
    description: "Costs, timelines and risk compared across an in-house hire, a large agency and a founder-led studio.",
    published: "2026-07-07",
    updated: "2026-11-24",
    topic: "AI Automation",
  },
  {
    slug: "ai-automation-vs-traditional-automation",
    title: "AI Automation vs Traditional Automation",
    description: "How rule-based and AI automation differ, and where each one still wins.",
    published: "2026-07-07",
    updated: "2026-11-24",
    topic: "AI Automation",
  },
  {
    slug: "lead-follow-up-automation",
    title: "Lead Follow-Up Automation: Fix Speed to Lead",
    description: "Why slow follow-up loses deals, and how an automated first response fixes it.",
    published: "2026-07-07",
    updated: "2026-11-24",
    topic: "AI Automation",
  },
  {
    slug: "ai-lead-generation-guide",
    title: "AI Lead Generation: The Complete Guide",
    description: "How AI prospecting, outreach and qualification work together as one system.",
    published: "2026-07-07",
    updated: "2026-11-24",
    topic: "Digital Marketing",
  },
  {
    slug: "marketing-automation-with-ai-guide",
    title: "Marketing Automation with AI: The Complete Guide",
    description: "How AI-driven marketing automation works and how to set it up step by step.",
    published: "2026-07-07",
    updated: "2026-11-24",
    topic: "Digital Marketing",
  },
  {
    slug: "ai-enhanced-web-design-guide",
    title: "AI-Enhanced Web Design: The Complete Guide",
    description: "What AI-enhanced web design means, how it differs from AI site builders, and how a fast build runs.",
    published: "2026-07-07",
    updated: "2026-11-24",
    topic: "Web Development",
  },
  {
    slug: "website-conversion-rate-optimization",
    title: "Website Conversion Rate Optimization Checklist",
    description: "Speed, mobile layout, forms and trust signals: the conversion fixes in priority order.",
    published: "2026-07-07",
    updated: "2026-11-24",
    topic: "Web Development",
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

/* Related reading per service (internal links service → journal). */
export const SERVICE_READING: Record<string, string[]> = {
  "ai-solutions": ["ai-automation-for-business-guide", "ai-automation-cost", "ai-chatbots-for-business-guide", "lead-follow-up-automation"],
  "web-development": ["choosing-a-web-design-company-toronto", "aoda-website-accessibility-ontario", "custom-software-vs-off-the-shelf", "website-conversion-rate-optimization"],
  "digital-marketing": ["marketing-automation-with-ai-guide", "ai-lead-generation-guide", "website-conversion-rate-optimization", "lead-follow-up-automation"],
  "technology-consulting": ["custom-software-vs-off-the-shelf", "ai-automation-agency-vs-hiring", "ai-automation-vs-traditional-automation", "ai-automation-cost"],
};

/* GTA cities named in areaServed and on local pages (service area, not offices). */
export const GTA_AREAS = ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville"];

export type LocalPage = {
  slug: string;
  service: string; // service slug this page supports
  short: string; // breadcrumb label
  eyebrow: string;
  title: [string, string];
  intro: string;
  metaTitle: string;
  metaDesc: string;
  photo: "ai-datacentre" | "web-code" | "con-blueprint" | "mkt-analytics";
  photoAlt: string;
  answer: string[]; // self-contained overview paragraphs (citable)
  build: { t: string; d: string }[];
  local: { t: string; d: string }[];
  projects: string[];
  faq: { q: string; a: string }[];
  reading: string[];
};

export const LOCAL_PAGES: LocalPage[] = [
  {
    slug: "ai-automation-toronto",
    service: "ai-solutions",
    short: "AI Automation Toronto",
    eyebrow: "AI Automation · Toronto & GTA",
    title: ["AI automation for", "Toronto businesses."],
    intro:
      "ARKA designs and builds custom AI automation, AI chatbots and lead follow-up systems for small and growing businesses in Toronto and across the GTA, connected to the tools you already run.",
    metaTitle: "AI Automation Agency in Toronto & the GTA | ARKA",
    metaDesc:
      "Custom AI automation, AI chatbots and lead follow-up systems for Toronto and GTA businesses. Founder-led, built around your tools, and owned by you.",
    photo: "ai-datacentre",
    photoAlt: "An engineer working on a laptop in a blue-lit data centre aisle",
    answer: [
      "AI automation uses large language models and workflow tools to handle work that used to need a person to read, decide and respond: replying to new enquiries, qualifying leads, booking meetings, drafting documents and keeping your CRM up to date. ARKA is a founder-led studio based in the Greater Toronto Area that builds these systems for small and growing businesses, from a single lead follow-up workflow to an AI assistant on your website.",
      "Every system is built around how your business already works. We map the workflow that costs your team the most time, connect the tools involved (CRM, inbox, calendar, spreadsheets or any service with an API) and ship a narrow first version you can measure. You work directly with the person building it, and you own the code, workflows and integrations we deliver.",
      "We work with businesses in Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville and the rest of the GTA, remotely and in the same Eastern time zone, as well as with clients outside Canada.",
    ],
    build: [
      { t: "Lead follow-up", d: "New enquiries get an immediate, relevant reply, are logged in your CRM and routed to the right person, day or night." },
      { t: "AI chatbots & assistants", d: "An assistant trained on your services and policies that answers questions, qualifies visitors and hands off to a human." },
      { t: "Back-office automation", d: "Data entry, document drafting, reminders and recurring reports handled by a workflow instead of a person." },
      { t: "Integrations", d: "CRMs, inboxes, calendars, spreadsheets and any tool with a REST API or webhook, connected so data moves on its own." },
    ],
    local: [
      { t: "Privacy (PIPEDA)", d: "Ontario businesses handling customer data in commercial activity generally fall under PIPEDA, Canada's federal private-sector privacy law. We document what data each automation touches and where it is stored, so your privacy obligations are easy to answer." },
      { t: "Consent for messages (CASL)", d: "Automated emails and texts to prospects are commercial electronic messages under Canada's Anti-Spam Legislation. Follow-up flows are built with consent, sender identification and unsubscribe handling in mind." },
      { t: "Where data lives", d: "Some clients, such as clinics or professional firms, need to know which country a tool stores data in. We confirm hosting regions for each tool during scoping rather than after launch." },
      { t: "Same time zone", d: "Based in the GTA, we work in Eastern Time, so reviews, fixes and launches happen during your business day." },
    ],
    projects: [],
    faq: [
      { q: "How much does AI automation cost for a small business in Toronto?", a: "It depends on how many workflows are involved, how many tools need to connect and how much decision logic the system needs. ARKA scopes and quotes every build per project after a free strategy call; there is no public price list." },
      { q: "What should we automate first?", a: "Usually the workflow with the clearest cost: slow replies to new leads, manual data entry between tools, or repetitive scheduling. Starting narrow makes the result easy to measure before you expand." },
      { q: "Will an AI chatbot replace our staff?", a: "No. A well-built assistant handles repetitive, answerable questions and hands anything complex or sensitive to a person. The goal is faster first responses and fewer interruptions for your team." },
      { q: "Do you meet in person?", a: "ARKA works remotely by default, by video call and email, with clients across the GTA and beyond. That keeps the work fast and the cost of overhead out of your quote." },
      { q: "Who owns the automation once it's built?", a: "You do. Code, workflows and integrations are transferred to you, with documentation of how they work." },
    ],
    reading: ["ai-automation-for-business-guide", "ai-automation-cost", "ai-chatbots-for-business-guide", "lead-follow-up-automation"],
  },
  {
    slug: "web-design-toronto",
    service: "web-development",
    short: "Web Design Toronto",
    eyebrow: "Web Design · Toronto & GTA",
    title: ["Web design and development", "in Toronto."],
    intro:
      "Custom websites for Toronto and GTA businesses: designed from scratch, fast on phones, accessible, structured for search and connected to the tools that handle your enquiries.",
    metaTitle: "Web Design & Development Company in Toronto | ARKA",
    metaDesc:
      "Custom, fast, accessible websites for Toronto and GTA businesses, built with modern frameworks and technical SEO. See real client builds from ARKA.",
    photo: "web-code",
    photoAlt: "Colour-highlighted source code on a laptop screen",
    answer: [
      "ARKA is a founder-led web design and development studio in the Greater Toronto Area. We design and build custom websites and web applications for service businesses, clinics, professionals and creative teams: no templates, a modern component-based stack, and technical SEO foundations in place from the first release.",
      "Our public builds include a luxury cleaning brand serving Toronto and the GTA, a multidisciplinary clinic in North York and Thornhill, a GTA real estate sales representative, a Toronto creative marketing team and an Ontario aircraft detailing service. Each one was designed around the business it represents, with service pages structured for the searches its customers actually make.",
      "A website for a Toronto business also has local requirements a template rarely handles: accessibility expectations under Ontario's AODA, location and service-area pages that are genuinely useful rather than thin, and enquiry forms that reliably reach the right inbox.",
    ],
    build: [
      { t: "Service business websites", d: "Clear service and location pages, strong calls to action and enquiry forms that deliver." },
      { t: "Clinic & practice sites", d: "Service, practitioner and location pages structured for patients and for search." },
      { t: "Personal brand sites", d: "Professional profiles for agents and practitioners built around trust and contact." },
      { t: "Web apps & portals", d: "Custom tools and dashboards that replace spreadsheets and manual processes." },
    ],
    local: [
      { t: "Accessibility (AODA)", d: "Ontario's AODA requires private and non-profit organizations with 50 or more employees to make public websites meet WCAG 2.0 Level AA. We build to that standard regardless of company size: keyboard support, readable contrast, real headings and labelled forms." },
      { t: "Local search structure", d: "Per-page titles and descriptions, structured data, sitemaps and prerendered HTML, plus service-area pages only where they add real information for customers in Toronto, Mississauga, Vaughan, Markham and beyond." },
      { t: "Your domain, your accounts", d: "We connect your existing domain without disturbing the email and DNS records you rely on, and you keep ownership of the code and hosting accounts." },
      { t: "Built for phones first", d: "Most local searches happen on a phone, so layouts, images and forms are designed and tested at mobile sizes before desktop." },
    ],
    projects: ["royal-caspian", "healexa-clinic", "mehri-noshad", "six-side-marketing"],
    faq: [
      { q: "How much does a website cost in Toronto?", a: "It depends on the number of pages, custom features and integrations. ARKA scopes and quotes each site after a free strategy call, so the quote reflects your actual project rather than a package." },
      { q: "How long does a custom website take?", a: "A focused marketing site with content ready moves much faster than a large site or web application. We agree the timeline during scoping and share progress as the build happens." },
      { q: "Will my website meet AODA requirements?", a: "We build to WCAG 2.0 Level AA, the standard AODA references for websites. Whether AODA applies to your organization depends on its size and type; Ontario's official guidance is the authority for compliance decisions." },
      { q: "Do you work with businesses outside Toronto?", a: "Yes. We work with businesses across the GTA, including Mississauga, Brampton, Vaughan, Markham, Richmond Hill and Oakville, and with clients outside Canada." },
      { q: "Can you redesign our existing site without losing search rankings?", a: "Yes, with care. We map existing URLs, set up permanent redirects for any that change, and keep titles, content and structured data intact or improved." },
    ],
    reading: ["choosing-a-web-design-company-toronto", "aoda-website-accessibility-ontario", "website-conversion-rate-optimization", "ai-enhanced-web-design-guide"],
  },
  {
    slug: "custom-software-development-toronto",
    service: "web-development",
    short: "Custom Software Toronto",
    eyebrow: "Custom Software · Toronto & GTA",
    title: ["Custom software development", "for Toronto teams."],
    intro:
      "Web applications, internal tools, client portals and integrations for Toronto and GTA businesses that have outgrown spreadsheets and disconnected subscriptions.",
    metaTitle: "Custom Software Development in Toronto | ARKA",
    metaDesc:
      "Custom web apps, internal tools, portals and integrations for Toronto and GTA businesses. Scoped per project, built on modern frameworks, owned by you.",
    photo: "con-blueprint",
    photoAlt: "Blue system architecture wireframes",
    answer: [
      "Custom software development means building an application around your own workflow instead of bending your workflow around a product. For a small or mid-sized business that usually looks like an internal dashboard, a client or partner portal, a quoting or scheduling tool, or the integration layer that makes several existing products behave like one system.",
      "ARKA is a founder-led studio in the Greater Toronto Area that builds these tools with modern web frameworks such as React and Next.js, typed code and standard APIs, so they stay maintainable after hand-over. AI features (document drafting, classification, search over your own data) can be built in where they genuinely save time.",
      "We start by checking whether you need custom software at all. If an off-the-shelf product covers the job, we will say so and help you configure and connect it instead.",
    ],
    build: [
      { t: "Internal tools & dashboards", d: "One place for the data your team currently copies between spreadsheets and apps." },
      { t: "Client & partner portals", d: "Secure areas where customers submit information, track progress or download documents." },
      { t: "Integration layers", d: "Connections between your CRM, billing, scheduling and other tools so records stay in sync." },
      { t: "AI-powered features", d: "Drafting, summarising, classifying and searching your own documents inside the tools your team uses." },
    ],
    local: [
      { t: "Build vs buy, honestly", d: "Custom software only makes sense when your process is a competitive advantage or no product fits it. Many projects start with a short consulting phase that answers this first." },
      { t: "Privacy by design", d: "PIPEDA generally governs personal information handled in commercial activity in Ontario. Access control, data minimisation and clear records of where data is stored are part of the architecture, not an afterthought." },
      { t: "You own the code", d: "Source code, infrastructure accounts and documentation are transferred to you, so you are never locked in to ARKA." },
      { t: "Phased delivery", d: "We ship a usable first version early, then extend it, so you see working software before committing to the full roadmap." },
    ],
    projects: [],
    faq: [
      { q: "When is custom software worth it over an off-the-shelf product?", a: "When your process is genuinely different, when you are paying for several tools that still need manual work between them, or when per-seat pricing grows faster than the value. If a product already fits, configuring it is usually cheaper." },
      { q: "What technology do you use?", a: "Modern web frameworks such as React and Next.js, typed code, standard databases and APIs, and hosting platforms such as Vercel. We choose tools your future developers will recognise." },
      { q: "How is pricing set?", a: "Every build is scoped and quoted per project after a free strategy call. Larger systems are usually split into phases with a clear scope for each." },
      { q: "Can you work with our existing systems?", a: "Yes. Most projects involve connecting to existing CRMs, billing, calendars or databases through their APIs rather than replacing them." },
    ],
    reading: ["custom-software-vs-off-the-shelf", "ai-automation-vs-traditional-automation", "ai-automation-agency-vs-hiring", "ai-automation-cost"],
  },
  {
    slug: "digital-marketing-gta",
    service: "digital-marketing",
    short: "Digital Marketing GTA",
    eyebrow: "Digital Marketing · Mississauga · Vaughan · Markham",
    title: ["Digital marketing across", "the GTA."],
    intro:
      "Content, paid campaigns, local SEO and marketing automation for businesses in Toronto, Mississauga, Vaughan, Markham and the rest of the GTA, connected to the systems that follow up every lead.",
    metaTitle: "Digital Marketing Agency for the GTA | ARKA",
    metaDesc:
      "Digital marketing for GTA businesses in Mississauga, Vaughan, Markham and Toronto: content, paid ads, local SEO and marketing automation tied to your CRM.",
    photo: "mkt-analytics",
    photoAlt: "An analytics dashboard with colourful charts on a laptop",
    answer: [
      "Digital marketing for a GTA business has two jobs: be found by people searching nearby, and turn the enquiries that arrive into conversations. ARKA plans and runs both, combining content and social media, paid campaigns, local search work and marketing automation into one system with tracking set up before spend begins.",
      "The Greater Toronto Area is not one market. Someone searching in Mississauga, Vaughan or Markham often sees different local results from someone downtown, and many service businesses cover several of these cities at once. We structure websites, Google Business Profiles and campaigns around the areas you actually serve, without creating thin duplicate pages for every town.",
      "Because ARKA also builds websites and AI automation, leads from campaigns can flow straight into your CRM and trigger follow-up automatically, so the marketing budget is not wasted on enquiries nobody answers.",
    ],
    build: [
      { t: "Local SEO", d: "Service-area structure, Google Business Profile guidance, citations and on-page work for the cities you serve." },
      { t: "Paid campaigns", d: "Search and social campaigns with conversion tracking configured before the first dollar is spent." },
      { t: "Content & social", d: "A consistent publishing plan that turns your expertise into posts, pages and articles." },
      { t: "Marketing automation", d: "Nurture sequences, review requests and retargeting flows that run without manual sending." },
    ],
    local: [
      { t: "Service areas, not fake offices", d: "If you serve Mississauga or Markham from a Toronto base, we present that honestly as a service area. Google's guidelines don't allow listing locations you don't operate from." },
      { t: "CASL-aware email", d: "Commercial emails and texts in Canada need consent, clear sender identification and a working unsubscribe. Sequences are built with that in mind." },
      { t: "Reviews from real customers", d: "Automated review requests go to real customers after real jobs. We never write, buy or incentivise reviews." },
      { t: "Measured against enquiries", d: "We agree the metrics that matter at the start, usually calls, form submissions and booked meetings, and report against them." },
    ],
    projects: ["royal-caspian"],
    faq: [
      { q: "Do you work with businesses in Mississauga, Vaughan and Markham?", a: "Yes. ARKA works with businesses across the GTA, including Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill and Oakville, remotely and in the same time zone." },
      { q: "Do I need separate pages for every city I serve?", a: "Only if each page has genuinely useful, specific information for that area. Near-duplicate city pages tend to be ignored by search engines and don't help customers." },
      { q: "Can you run our Google Ads?", a: "Yes. We set up and manage paid campaigns, with conversion tracking configured before spend begins so results can be measured." },
      { q: "How do you report results?", a: "Against the metrics agreed at the start, such as enquiries, booked calls and cost per lead, rather than vanity numbers." },
    ],
    reading: ["marketing-automation-with-ai-guide", "ai-lead-generation-guide", "website-conversion-rate-optimization", "lead-follow-up-automation"],
  },
];

export const localBySlug = (slug: string) => LOCAL_PAGES.find((p) => p.slug === slug);
