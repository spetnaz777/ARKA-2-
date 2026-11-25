/* Journal index + GTA landing pages. Same rule as site.ts: no invented
   metrics, clients, reviews, addresses or phone numbers. Regulatory facts
   (AODA, PIPEDA, CASL) are stated at the level of the public guidance and
   point readers to the official source for compliance decisions. */

import type { PhotoKey } from "../components/v8";

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
  {
    slug: "ai-receptionist-small-business-guide",
    title: "AI Receptionists for Small Businesses: A Practical Guide",
    description: "What an AI receptionist does, where it helps a small business, where it doesn't, and how to set one up responsibly in Canada.",
    published: "2026-11-25",
    updated: "2026-11-25",
    topic: "AI Solutions",
  },
  {
    slug: "n8n-vs-make-vs-zapier",
    title: "n8n vs Make vs Zapier: Choosing a Workflow Automation Tool",
    description: "How n8n, Make.com and Zapier differ in hosting, flexibility, ease of use and ownership, and how to pick the right one for your business workflows.",
    published: "2026-11-25",
    updated: "2026-11-25",
    topic: "AI Solutions",
  },
  {
    slug: "local-seo-checklist-toronto",
    title: "Local SEO Checklist for Toronto & GTA Businesses",
    description: "A practical local SEO checklist for Toronto and GTA businesses: Google Business Profile, consistent business details, service and area pages, reviews and links.",
    published: "2026-11-25",
    updated: "2026-11-25",
    topic: "Digital Marketing",
  },
  {
    slug: "website-redesign-seo-checklist",
    title: "Website Redesign SEO Checklist: Keep Your Rankings",
    description: "A step-by-step checklist for redesigning a website without losing search traffic: URL inventory, redirects, content, metadata and post-launch checks.",
    published: "2026-11-25",
    updated: "2026-11-25",
    topic: "Web Development",
  },
  {
    slug: "website-privacy-compliance-canada",
    title: "Website Privacy Basics for Canadian Businesses",
    description: "The privacy basics every Canadian business website should cover: contact forms, privacy policies, PIPEDA principles, CASL consent for email and analytics tracking.",
    published: "2026-11-25",
    updated: "2026-11-25",
    topic: "Web Development",
  },
  {
    slug: "website-cost-toronto",
    title: "What Drives the Cost of a Website in Toronto",
    description: "What decides website cost in Toronto: scope, design, content, integrations, SEO, accessibility and ongoing care, plus how to compare quotes fairly.",
    published: "2026-11-25",
    updated: "2026-11-25",
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
  photo: PhotoKey;
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
  {
    slug: "ai-receptionist-toronto",
    service: "ai-solutions",
    short: "AI Receptionist",
    eyebrow: "AI Receptionist · Toronto & GTA",
    title: ["An AI receptionist that", "never misses a lead."],
    intro:
      "ARKA builds AI receptionists for Toronto and GTA businesses: an assistant that answers enquiries from your website, email and messages around the clock, books appointments and hands anything sensitive to your team.",
    metaTitle: "AI Receptionist for Small Businesses in Toronto | ARKA",
    metaDesc:
      "A custom AI receptionist for Toronto and GTA businesses: instant replies to website and message enquiries, booking, lead capture and human hand-off.",
    photo: "ai-robot",
    photoAlt: "A white humanoid robot hand reaching toward the camera",
    answer: [
      "An AI receptionist is an assistant that handles first contact with your customers. It answers common questions about your services, hours and process, captures the details of new enquiries, books appointments into your calendar and passes anything complex, urgent or sensitive to a person. Unlike a generic chatbot, it is set up around your own services, policies and booking rules.",
      "For most small businesses the value is speed. Enquiries arrive in the evening, on weekends and while your team is busy with customers, and the first business to reply usually wins the conversation. An AI receptionist gives every new enquiry an immediate, accurate first response and logs it so nobody has to chase it later.",
      "ARKA builds these assistants for businesses in Toronto, Mississauga, Vaughan, Markham and across the GTA. Website chat, email and message channels are the usual starting point; text-message follow-up and voice options depend on your phone provider and are scoped per project. You work directly with the person building it, and you own the system once it is delivered.",
    ],
    build: [
      { t: "Website assistant", d: "Answers questions from your own service information and policies, in your tone, with a clear hand-off when a person is needed." },
      { t: "Booking & scheduling", d: "Checks availability and books appointments or calls into the calendar you already use." },
      { t: "Enquiry capture", d: "Collects the details your team needs, then logs the lead in your CRM or inbox with a summary." },
      { t: "After-hours follow-up", d: "New enquiries that arrive outside business hours get a reply right away and a follow-up the next morning." },
    ],
    local: [
      { t: "Privacy (PIPEDA)", d: "Conversations can contain personal information. We document what the assistant collects, where it is stored and who can see it, so your privacy obligations under PIPEDA are easy to answer." },
      { t: "Consent for follow-ups (CASL)", d: "Automated follow-up emails and texts to prospects are commercial electronic messages under CASL, so flows are built with consent, sender identification and an unsubscribe option." },
      { t: "Honest about being AI", d: "The assistant identifies itself as automated and offers a person whenever a visitor asks, which protects trust as well as your reputation." },
      { t: "Eastern Time support", d: "We are based in the GTA, so tuning, fixes and changes to opening hours or services happen during your business day." },
    ],
    projects: [],
    faq: [
      { q: "What is the difference between an AI receptionist and a chatbot?", a: "A basic chatbot follows a fixed script. An AI receptionist is set up around your real services, availability and policies, can book appointments and log leads, and knows when to hand the conversation to a person." },
      { q: "Can it answer phone calls?", a: "Website chat, email and message channels are the usual starting point. Voice and text-message options depend on your phone provider and are scoped per project during the strategy call." },
      { q: "Will it give customers wrong answers?", a: "It answers from the information you approve, and it is set up to hand off rather than guess when a question falls outside that information. We test it with real questions before launch." },
      { q: "How much does an AI receptionist cost?", a: "It depends on the channels, integrations and booking logic involved. ARKA scopes and quotes each build after a free strategy call; there is no public price list." },
      { q: "Who owns the assistant?", a: "You do. The configuration, workflows and integrations are handed over with documentation." },
    ],
    reading: ["ai-receptionist-small-business-guide", "ai-chatbots-for-business-guide", "lead-follow-up-automation", "ai-automation-cost"],
  },
  {
    slug: "ai-chatbot-development-toronto",
    service: "ai-solutions",
    short: "AI Chatbot Development",
    eyebrow: "AI Chatbots · Toronto & GTA",
    title: ["Custom AI chatbots", "for your business."],
    intro:
      "ARKA designs and builds custom AI chatbots and assistants for Toronto and GTA businesses, trained on your own services and documents, connected to your CRM and calendar, and owned by you.",
    metaTitle: "AI Chatbot Development Company in Toronto | ARKA",
    metaDesc:
      "Custom AI chatbots for Toronto and GTA businesses: trained on your content, connected to your CRM and calendar, with human hand-off. Founder-led studio.",
    photo: "ai-network",
    photoAlt: "Abstract glowing network lines representing connected AI systems",
    answer: [
      "A custom AI chatbot is an assistant built on a large language model and grounded in your own information: service pages, policies, product details, FAQs and internal documents. It can answer customer questions in natural language, qualify leads against your criteria, book meetings and pass conversations to your team, on your website or inside internal tools.",
      "The difference between a useful chatbot and a frustrating one is the work around the model. ARKA defines what the assistant should and should not answer, connects it to the systems it needs (CRM, calendar, help desk or database), sets clear hand-off rules and tests it against the real questions your customers ask before it goes live.",
      "We build with models such as Claude and OpenAI's GPT family, chosen per project for quality, cost and data-handling requirements, and we work with businesses across Toronto and the GTA as well as clients outside Canada.",
    ],
    build: [
      { t: "Customer-facing assistants", d: "Answer questions about services, availability and process on your website, with lead capture and booking." },
      { t: "Internal knowledge assistants", d: "Help your team find answers in policies, manuals and past documents instead of asking each other." },
      { t: "Lead qualification", d: "Ask the right questions, score the answers against your criteria and route qualified leads to the right person." },
      { t: "Integrated actions", d: "Create CRM records, book calendar slots or open support tickets, not just reply with text." },
    ],
    local: [
      { t: "Data handling", d: "We confirm which model provider and hosting region each project uses during scoping, which matters for clinics, professional firms and anyone handling sensitive data." },
      { t: "Privacy (PIPEDA)", d: "Chat transcripts can include personal information. Retention, access and storage are documented so your PIPEDA obligations stay clear." },
      { t: "Accessible by design", d: "Chat widgets are built to be usable with a keyboard and screen reader, consistent with the WCAG practices Ontario's AODA references." },
      { t: "Plain-language hand-off", d: "Every assistant tells visitors it is automated and offers a human, which keeps trust intact when questions get complicated." },
    ],
    projects: [],
    faq: [
      { q: "Which AI model do you use?", a: "We choose per project. Claude and OpenAI's models are the usual options, picked for answer quality, cost and the data-handling requirements of your business." },
      { q: "Can the chatbot use our own documents?", a: "Yes. The assistant can be grounded in your website, policies and internal documents so its answers come from your information rather than general knowledge." },
      { q: "How do you stop it making things up?", a: "By limiting it to approved information, instructing it to hand off when unsure, and testing it with real customer questions before launch. No AI system is perfect, so hand-off rules matter." },
      { q: "Can it connect to our CRM?", a: "Yes. Most CRMs and calendars can be connected through their APIs, so conversations become records and bookings automatically." },
      { q: "How is pricing set?", a: "Every chatbot is scoped and quoted per project after a free strategy call. There is no public price list." },
    ],
    reading: ["ai-chatbots-for-business-guide", "ai-receptionist-small-business-guide", "ai-automation-for-business-guide", "ai-automation-cost"],
  },
  {
    slug: "n8n-make-automation-agency",
    service: "ai-solutions",
    short: "n8n & Make Automation",
    eyebrow: "Workflow Automation · n8n · Make.com",
    title: ["n8n and Make.com", "automation, built properly."],
    intro:
      "ARKA builds workflow automation with n8n, Make.com and custom API code for businesses in Toronto, the GTA and beyond: reliable, documented automations that connect your tools and hand off to AI where it helps.",
    metaTitle: "n8n & Make.com Automation Agency | ARKA",
    metaDesc:
      "Workflow automation built with n8n, Make.com and custom code: CRM syncing, lead routing, reporting and AI steps, documented and handed over to you.",
    photo: "con-network",
    photoAlt: "Glowing network connections across a dark background",
    answer: [
      "n8n and Make.com are visual workflow automation platforms. They let you connect apps such as CRMs, inboxes, spreadsheets, calendars and payment tools, so that an event in one system (a new form submission, a paid invoice, a booked call) automatically triggers actions in others. n8n can also be self-hosted, which some businesses prefer for cost or data control; Make.com is a hosted service with a large catalogue of ready-made app connections.",
      "Most automation problems are not about the platform. They come from workflows that were built quickly, never documented and break silently when an app changes. ARKA designs automations with error handling, logging and clear naming, chooses the platform that suits the job, and adds custom code or AI steps only where the visual tools run out.",
      "We build new automations and rescue existing ones for businesses across the GTA and for clients outside Canada, and every workflow is handed over with documentation so your team can see what runs, when and why.",
    ],
    build: [
      { t: "CRM & lead routing", d: "New leads are captured, enriched, de-duplicated and assigned to the right person automatically." },
      { t: "Operations workflows", d: "Invoices, onboarding steps, reminders and status updates move between tools without copy-paste." },
      { t: "AI steps in workflows", d: "Classify enquiries, summarise messages or draft replies with a language model inside the automation." },
      { t: "Automation rescue", d: "Audit fragile existing workflows, fix failures, add error alerts and document how they work." },
    ],
    local: [
      { t: "Choosing the platform", d: "We recommend n8n, Make.com or custom code based on your volume, budget, data requirements and who will maintain it, not on habit." },
      { t: "Self-hosting option", d: "Where data control matters, n8n can run on infrastructure you control. We confirm the hosting region during scoping." },
      { t: "Error handling", d: "Every workflow has failure alerts and logs, so a broken connection is noticed in minutes rather than weeks." },
      { t: "You own it", d: "Workflows live in your accounts, not ours, and come with documentation your team can follow." },
    ],
    projects: [],
    faq: [
      { q: "Should we use n8n, Make.com or Zapier?", a: "It depends on volume, budget, how complex the logic is and whether you need self-hosting. Our comparison article covers the trade-offs; we recommend a platform during the strategy call based on your actual workflows." },
      { q: "Can you fix automations someone else built?", a: "Yes. We audit existing workflows, repair failures, add error alerts and document them, then extend them if needed." },
      { q: "Do you add AI to automations?", a: "Where it helps. Language models are useful for classifying, summarising and drafting inside a workflow; simple data moves don't need AI." },
      { q: "Whose account do the workflows live in?", a: "Yours. We build in accounts you own so nothing depends on ARKA to keep running." },
      { q: "How is pricing set?", a: "Each automation project is scoped and quoted after a free strategy call. There is no public price list." },
    ],
    reading: ["n8n-vs-make-vs-zapier", "ai-automation-vs-traditional-automation", "lead-follow-up-automation", "ai-automation-for-business-guide"],
  },
  {
    slug: "website-redesign-toronto",
    service: "web-development",
    short: "Website Redesign",
    eyebrow: "Website Redesign · Toronto & GTA",
    title: ["A website redesign", "that keeps your rankings."],
    intro:
      "ARKA redesigns websites for Toronto and GTA businesses: a faster, clearer, mobile-first site that reflects the business today, migrated carefully so existing search visibility carries over.",
    metaTitle: "Website Redesign Company in Toronto | ARKA",
    metaDesc:
      "Website redesigns for Toronto and GTA businesses: faster, mobile-first and accessible, with URL mapping and redirects so search rankings carry over.",
    photo: "web-desk",
    photoAlt: "A clean desk with a laptop showing a website design",
    answer: [
      "A website redesign replaces the design, structure and usually the technology of an existing site. Done well, it makes the business look as good online as it is in person, loads quickly on phones and turns more visitors into enquiries. Done carelessly, it can wipe out years of search visibility because pages move, content disappears and old links lead nowhere.",
      "ARKA treats the migration as part of the design work. Before anything changes we record every existing URL, its title and the pages that earn traffic or links. New pages keep or improve that content, any URL that changes gets a permanent redirect, and structured data, sitemaps and metadata are in place on launch day. After launch we submit the new sitemap and check indexing.",
      "We redesign sites for service businesses, clinics, professionals and creative teams across Toronto and the GTA. Public examples include sites for a luxury cleaning brand, a multidisciplinary clinic and a GTA real estate sales representative.",
    ],
    build: [
      { t: "Content & structure review", d: "Decide what stays, what merges and what is missing, based on what customers actually look for." },
      { t: "New design system", d: "A custom visual direction built for your brand, not a template, designed for phones first." },
      { t: "Migration & redirects", d: "Every old URL mapped, redirects set, metadata and structured data carried over or improved." },
      { t: "Launch & indexing", d: "New sitemap submitted, key pages checked in search tools, and errors fixed in the first weeks." },
    ],
    local: [
      { t: "Accessibility (AODA)", d: "A redesign is the moment to fix accessibility. We build to WCAG 2.0 Level AA practices, the standard Ontario's AODA references for websites." },
      { t: "Domain & email safety", d: "We change website records only, leaving the email and DNS records you rely on untouched." },
      { t: "Local search continuity", d: "Location and service-area content, business details and Google Business Profile links stay consistent through the move." },
      { t: "Your accounts", d: "Code and hosting live in accounts you own, so the new site doesn't tie you to us." },
    ],
    projects: ["royal-caspian", "healexa-clinic", "mehri-noshad"],
    faq: [
      { q: "Will a redesign hurt our Google rankings?", a: "It can if URLs and content change without redirects. We map every existing URL, set permanent redirects and keep or improve the content that earns traffic, which is how rankings carry over." },
      { q: "Do we have to rewrite all our content?", a: "No. Strong existing content is kept and improved; weak or outdated pages are merged or rewritten. We decide page by page." },
      { q: "Can you keep our domain and email?", a: "Yes. Only the records that point to the website change; email and other DNS records stay as they are." },
      { q: "How long does a redesign take?", a: "It depends on the number of pages and how ready the content is. We agree the timeline during scoping." },
      { q: "How is pricing set?", a: "Each redesign is scoped and quoted after a free strategy call. There is no public price list." },
    ],
    reading: ["website-redesign-seo-checklist", "choosing-a-web-design-company-toronto", "website-conversion-rate-optimization", "aoda-website-accessibility-ontario"],
  },
  {
    slug: "real-estate-agent-websites",
    service: "web-development",
    short: "Real Estate Agent Websites",
    eyebrow: "Real Estate · Websites for Agents",
    title: ["Websites for", "real estate agents."],
    intro:
      "ARKA designs custom personal-brand websites for real estate sales representatives and teams in Toronto and the GTA: built around trust, local expertise and getting contacted, not a recycled template.",
    metaTitle: "Real Estate Agent Website Design in Toronto | ARKA",
    metaDesc:
      "Custom websites for Toronto and GTA real estate agents: personal brand, neighbourhood pages, lead capture and fast mobile performance. See a real build.",
    photo: "case-toronto",
    photoAlt: "The Toronto skyline at dusk",
    answer: [
      "Most real estate agents start with a brokerage template that looks like everyone else's. A personal-brand website does a different job: it tells buyers and sellers who you are, which neighbourhoods you know and why they should call you, and it makes contacting you effortless on a phone.",
      "ARKA builds these sites from scratch around the agent. That usually means a strong profile and story, pages for the areas and property types you focus on, clear ways to book a call or request a valuation, and enquiry forms that reach you reliably. Sites are fast, accessible and structured for search so they keep working long after launch.",
      "One public example is the website ARKA built for Mehri Noshad, a GTA real estate sales representative. If you want listings pulled in automatically, that depends on the data access your brokerage and board allow, and we confirm it during scoping.",
    ],
    build: [
      { t: "Personal brand profile", d: "Your story, approach and credentials presented clearly, with professional photography where you have it." },
      { t: "Neighbourhood & market pages", d: "Pages about the areas you actually serve, written to be useful to buyers and sellers." },
      { t: "Lead capture", d: "Valuation requests, buyer enquiries and call booking that land in your inbox or CRM." },
      { t: "Follow-up automation", d: "Optional automated replies and reminders so new leads hear from you quickly." },
    ],
    local: [
      { t: "Advertising rules", d: "Ontario real estate advertising has its own rules for registrants, including how brokerage names appear. We build pages so you can follow your brokerage's and RECO's guidance; they remain the authority." },
      { t: "Listing data access", d: "Automated listing feeds depend on the permissions your board and brokerage provide. We confirm what is available before promising it." },
      { t: "Consent (CASL)", d: "Follow-up emails and texts to leads are built with consent and unsubscribe handling in mind." },
      { t: "Mobile first", d: "Buyers browse on phones between viewings, so every page is designed and tested at phone size first." },
    ],
    projects: ["mehri-noshad"],
    faq: [
      { q: "Can my website show MLS listings?", a: "It depends on the data access your board and brokerage allow. We confirm what's available during scoping and build around it." },
      { q: "Do I own the website or does my brokerage?", a: "You own the site we build for you, including the code and the accounts it runs on." },
      { q: "Can you add automated follow-up for leads?", a: "Yes. New enquiries can get an immediate reply and be logged in your CRM, built with consent rules in mind." },
      { q: "Will the site help me rank in search?", a: "Every build ships with technical SEO foundations and area pages written to be useful. Rankings also depend on reviews, links and competition, which we can help with through marketing work." },
      { q: "How is pricing set?", a: "Each site is scoped and quoted after a free strategy call. There is no public price list." },
    ],
    reading: ["choosing-a-web-design-company-toronto", "lead-follow-up-automation", "local-seo-checklist-toronto", "website-conversion-rate-optimization"],
  },
  {
    slug: "clinic-website-design",
    service: "web-development",
    short: "Clinic Website Design",
    eyebrow: "Healthcare · Clinic Websites",
    title: ["Clinic websites", "patients can use."],
    intro:
      "ARKA designs websites for clinics and practices in Toronto and the GTA: clear service and practitioner pages, booking that works on a phone, and structure that helps patients find you in search.",
    metaTitle: "Clinic & Healthcare Website Design in Toronto | ARKA",
    metaDesc:
      "Websites for physiotherapy, chiropractic, massage and multidisciplinary clinics in Toronto and the GTA: service pages, booking and local search structure.",
    photo: "case-rehab",
    photoAlt: "A bright, calm rehabilitation clinic interior",
    answer: [
      "A clinic website has to do several things at once: explain each service in plain language, introduce the practitioners, show locations and hours, and make booking or contacting the clinic easy on a phone. It also has to be trustworthy and accessible, because many visitors arrive anxious, in pain or on behalf of someone else.",
      "ARKA builds clinic sites around those visitors. Each service gets its own page that answers the common questions, practitioners have profiles, locations are clear and consistent, and booking links or forms are prominent without being pushy. Structured data and per-page metadata help patients searching for a service nearby find the right page.",
      "A public example is the website ARKA built for Healexa Clinic, a multidisciplinary clinic offering physiotherapy, chiropractic, massage and acupuncture. Health content claims are written with care and should always be reviewed by the clinic's own practitioners.",
    ],
    build: [
      { t: "Service pages", d: "One page per treatment, answering what it is, who it helps and what to expect at a visit." },
      { t: "Practitioner profiles", d: "Credentials, focus areas and approach, so patients can choose the right person." },
      { t: "Booking & enquiries", d: "Links to your booking system or enquiry forms that reach the right inbox reliably." },
      { t: "Locations & hours", d: "Consistent address, hours and map details for each location, matching your Google Business Profile." },
    ],
    local: [
      { t: "Health information privacy", d: "Clinics in Ontario may have obligations under PHIPA as well as PIPEDA. We keep contact forms minimal and avoid collecting health details through the website unless your booking platform is designed for it." },
      { t: "Accessibility (AODA)", d: "We build to WCAG 2.0 Level AA practices, the standard Ontario's AODA references, which matters especially for healthcare visitors." },
      { t: "Professional advertising rules", d: "Regulated health professions have advertising standards set by their colleges. Content is written so your practitioners can review it against those standards." },
      { t: "Multi-location structure", d: "Clinics with several locations get location pages with real, distinct information rather than duplicated text." },
    ],
    projects: ["healexa-clinic"],
    faq: [
      { q: "Can patients book online through the website?", a: "Yes. We connect your existing booking system or build enquiry forms that reach the right inbox. Clinical intake is best handled by booking platforms designed for health information." },
      { q: "Do you write the medical content?", a: "We structure and draft service pages in plain language, and your practitioners review them for accuracy and against their college's advertising standards." },
      { q: "Will the site be accessible?", a: "Yes. We build to WCAG 2.0 Level AA practices: keyboard support, readable contrast, real headings and labelled forms." },
      { q: "Can you handle several locations?", a: "Yes. Each location gets its own accurate details and page where it adds real information for patients." },
      { q: "How is pricing set?", a: "Each site is scoped and quoted after a free strategy call. There is no public price list." },
    ],
    reading: ["aoda-website-accessibility-ontario", "local-seo-checklist-toronto", "choosing-a-web-design-company-toronto", "website-privacy-compliance-canada"],
  },
  {
    slug: "home-service-business-websites",
    service: "web-development",
    short: "Home Service Websites",
    eyebrow: "Home & Local Services · Websites",
    title: ["Websites for", "home service businesses."],
    intro:
      "ARKA builds websites for cleaning, detailing, renovation and other home and local service businesses in Toronto and Ontario: service and area pages that rank, quote requests that convert, and a brand that looks premium.",
    metaTitle: "Websites for Home Service Businesses in Ontario | ARKA",
    metaDesc:
      "Websites for cleaning, detailing and home service businesses in Toronto and Ontario: service and area pages, quote requests and local search structure.",
    photo: "case-luxury-interior",
    photoAlt: "A calm, luxurious living room interior",
    answer: [
      "Home and local service businesses win most of their work from people searching for a service in their area. Their websites need clear pages for each service, honest pages for the areas they cover, visible trust signals such as reviews and insurance, and a quote or booking request that takes seconds on a phone.",
      "ARKA designs these sites to look as good as the work itself and to be easy for search engines to understand. Each service and service area gets its own useful page, business details are consistent with your Google Business Profile, structured data describes the business and its services, and enquiries are delivered reliably to the people who respond to them.",
      "Public examples include the website for Royal Caspian, a luxury residential and commercial cleaning brand in Toronto and the GTA, and the brand and website for Noctavius Aviation, a private aircraft detailing service in Ontario.",
    ],
    build: [
      { t: "Service pages", d: "One page per service, explaining scope, process and what is included, written for the searches customers make." },
      { t: "Service-area pages", d: "Pages for the cities you actually cover, with real local information instead of copy-pasted text." },
      { t: "Quote & booking requests", d: "Short forms and clear calls to action that deliver enquiries to your inbox or CRM." },
      { t: "Trust signals", d: "Reviews, insurance, guarantees and process explained clearly, without invented claims." },
    ],
    local: [
      { t: "Google Business Profile", d: "Name, address, phone and hours on the site match your Business Profile, and the site links to it, which supports local search." },
      { t: "No thin area pages", d: "City pages only where you serve customers and can say something specific, avoiding duplicate pages search engines discount." },
      { t: "Review requests", d: "Optional automation asks happy customers for a review after a completed job, at the moment they are most likely to leave one." },
      { t: "Mobile first", d: "Most local searches happen on phones, so forms and calls to action are designed for thumbs first." },
    ],
    projects: ["royal-caspian", "noctavius-aviation"],
    faq: [
      { q: "Do I need a page for every city I serve?", a: "Only where you genuinely serve customers and can provide useful, specific information. Copy-pasted city pages tend to be ignored or discounted by search engines." },
      { q: "Can customers book or request quotes online?", a: "Yes. We build short quote forms or connect your booking tool, with enquiries delivered reliably to your inbox or CRM." },
      { q: "Will the website help with Google Maps rankings?", a: "The website supports local rankings through consistent business details, service and area pages and structured data. Your Google Business Profile, reviews and local links matter just as much." },
      { q: "Can you automate review requests?", a: "Yes. A follow-up can ask customers for a review after a completed job, built with consent rules in mind." },
      { q: "How is pricing set?", a: "Each site is scoped and quoted after a free strategy call. There is no public price list." },
    ],
    reading: ["local-seo-checklist-toronto", "website-conversion-rate-optimization", "lead-follow-up-automation", "choosing-a-web-design-company-toronto"],
  },
  {
    slug: "ai-automation-for-real-estate",
    service: "ai-solutions",
    short: "AI for Real Estate",
    eyebrow: "Real Estate · AI Automation",
    title: ["AI automation for", "real estate teams."],
    intro:
      "ARKA builds AI automation for real estate agents, teams and brokerages in Toronto and the GTA: instant lead replies, CRM updates, showing scheduling and follow-up that runs without manual work.",
    metaTitle: "AI Automation for Real Estate Agents in Toronto | ARKA",
    metaDesc:
      "AI automation for Toronto real estate agents and teams: instant lead response, CRM syncing, showing scheduling and consent-aware follow-up sequences.",
    photo: "ai-3d",
    photoAlt: "An abstract 3D render of interconnected shapes",
    answer: [
      "Real estate runs on response time and follow-up. Leads arrive from portals, social ads, websites and referrals at all hours, and the agent who replies first and keeps in touch for months is usually the one who gets the listing or the sale. That follow-up is exactly the kind of repetitive, time-sensitive work AI automation handles well.",
      "ARKA builds systems that reply to new leads immediately with a relevant message, log them in your CRM with their source and details, offer showing or call times from your calendar, and keep long-term leads warm with personalised, consent-aware sequences. Anything that needs judgement, such as pricing advice or negotiations, goes to you.",
      "We work with agents and teams across Toronto and the GTA and connect to the CRMs, calendars and lead sources you already use, confirming integrations during scoping.",
    ],
    build: [
      { t: "Instant lead response", d: "Every new enquiry gets a relevant reply within moments, day or night, and lands in your CRM." },
      { t: "Showing & call scheduling", d: "Leads can pick a time from your real availability without back-and-forth messages." },
      { t: "Long-term nurture", d: "Personalised sequences keep in touch with buyers and sellers who aren't ready yet, until they reply or opt out." },
      { t: "Admin automation", d: "Transaction checklists, reminders and document drafting handled by workflows instead of by hand." },
    ],
    local: [
      { t: "Consent (CASL)", d: "Follow-up emails and texts to leads are commercial electronic messages under CASL, so sequences are built around consent, identification and unsubscribe handling." },
      { t: "Advertising rules", d: "Automated messages follow the same rules as your other advertising. Your brokerage and RECO's guidance remain the authority on what registrants may say." },
      { t: "Privacy (PIPEDA)", d: "Client information collected by automations is documented: what is stored, where, and who can access it." },
      { t: "Human judgement stays", d: "Automation handles speed and repetition; pricing opinions, negotiation and advice stay with you." },
    ],
    projects: [],
    faq: [
      { q: "Which CRMs can you connect to?", a: "Most real estate CRMs and general CRMs with an API can be connected. We confirm your specific tools during the strategy call." },
      { q: "Will automated messages sound robotic?", a: "They are written in your voice and personalised with the details each lead provides, and anything requiring judgement is handed to you." },
      { q: "Can AI book showings?", a: "It can offer times from your real calendar and book them, with confirmations and reminders sent automatically." },
      { q: "Is automated follow-up allowed in Canada?", a: "Yes, with consent and proper identification and unsubscribe handling under CASL. We build sequences with those requirements in mind; legal decisions remain yours." },
      { q: "How is pricing set?", a: "Each build is scoped and quoted after a free strategy call. There is no public price list." },
    ],
    reading: ["lead-follow-up-automation", "ai-lead-generation-guide", "ai-receptionist-small-business-guide", "marketing-automation-with-ai-guide"],
  },
  {
    slug: "local-seo-toronto",
    service: "digital-marketing",
    short: "Local SEO Toronto",
    eyebrow: "Local SEO · Toronto & GTA",
    title: ["Local SEO for", "Toronto businesses."],
    intro:
      "ARKA helps Toronto and GTA businesses get found by nearby customers: Google Business Profile, service and area pages, structured data, reviews and citations, worked on together as one system.",
    metaTitle: "Local SEO Services in Toronto & the GTA | ARKA",
    metaDesc:
      "Local SEO for Toronto and GTA businesses: Google Business Profile, service and area pages, schema, reviews and citations, with honest reporting.",
    photo: "mkt-growth",
    photoAlt: "A rising line chart on a dark screen",
    answer: [
      "Local SEO is the work that helps a business appear when people nearby search for what it offers, both in the map results and in the regular results below them. Google describes local ranking as a mix of relevance, distance and prominence, which in practice means accurate business information, pages that clearly describe your services and areas, reviews, and mentions and links from other trustworthy sites.",
      "ARKA works on all of it together. We audit and improve your Google Business Profile, fix inconsistent business details across directories, build or improve service and area pages, add structured data, set up review requests and track what changes. Because we also build websites, technical problems such as slow pages, missing metadata or indexing errors get fixed at the source.",
      "We work with service businesses, clinics, professionals and agencies across Toronto, Mississauga, Vaughan, Markham and the rest of the GTA. We don't promise rankings; we fix what's holding a business back and report honestly on what moves.",
    ],
    build: [
      { t: "Google Business Profile", d: "Categories, services, photos, hours and posts set up properly and kept current." },
      { t: "Citations & consistency", d: "Your name, address and phone made consistent across the directories customers and search engines check." },
      { t: "Service & area pages", d: "Useful pages for what you offer and where, with structured data, built without thin duplicates." },
      { t: "Reviews workflow", d: "Automated, consent-aware review requests after completed work, plus a process for responding." },
    ],
    local: [
      { t: "The GTA isn't one market", d: "Results in Mississauga, Vaughan or Markham differ from downtown Toronto, so we look at the areas you actually serve." },
      { t: "Service-area businesses", d: "If you visit customers rather than receive them, your profile and pages are set up for a service area rather than a storefront." },
      { t: "Directory listings", d: "In many GTA categories, directories such as HomeStars, BBB or Clutch rank on page one, so being listed there accurately matters." },
      { t: "Honest reporting", d: "We report on visibility, enquiries and what changed, and we don't guarantee positions no one can guarantee." },
    ],
    projects: ["royal-caspian"],
    faq: [
      { q: "How long does local SEO take?", a: "Fixes to your profile and site can be noticed within weeks, while reviews, links and new content build over months. It depends on your category and competition." },
      { q: "Do you guarantee first-page rankings?", a: "No. Nobody controls Google's results. We fix what's holding you back, build what's missing and report honestly on progress." },
      { q: "Do I need a page for every city?", a: "No. Area pages help only where you serve customers and can say something specific. Thin, duplicated city pages can do more harm than good." },
      { q: "Can you manage our Google Business Profile?", a: "Yes, with manager access that you grant and can remove at any time. The profile always remains yours." },
      { q: "How is pricing set?", a: "Local SEO work is scoped and quoted after a free strategy call. There is no public price list." },
    ],
    reading: ["local-seo-checklist-toronto", "website-conversion-rate-optimization", "choosing-a-web-design-company-toronto", "marketing-automation-with-ai-guide"],
  },
  {
    slug: "web-app-development-toronto",
    service: "web-development",
    short: "Web App Development",
    eyebrow: "Web Applications · Toronto & GTA",
    title: ["Web apps and portals", "built for your workflow."],
    intro:
      "ARKA builds custom web applications, client portals and internal tools for Toronto and GTA businesses, replacing spreadsheets and manual processes with software shaped around how your team works.",
    metaTitle: "Web App Development Company in Toronto | ARKA",
    metaDesc:
      "Custom web apps, client portals and internal tools for Toronto and GTA businesses, built on modern frameworks, integrated with your systems, owned by you.",
    photo: "web-laptop",
    photoAlt: "A laptop displaying a web application interface",
    answer: [
      "A web application is software that runs in the browser: a client portal, a booking or quoting tool, an internal dashboard, or a system that ties several tools together. Businesses usually need one when spreadsheets, email threads and off-the-shelf software no longer fit the way they work, and the workarounds start costing more time than they save.",
      "ARKA designs and builds these applications with modern frameworks such as React and Next.js, connects them to the systems you already run through their APIs, and adds AI features where they genuinely help, such as document drafting or search across your own data. We start with the smallest version that solves the real problem, then extend it.",
      "We build for businesses across Toronto and the GTA and for clients outside Canada. You own the code, the accounts it runs on and the documentation, so the application is an asset rather than a dependency.",
    ],
    build: [
      { t: "Client portals", d: "A secure place for clients to see status, documents, invoices or bookings without emailing you." },
      { t: "Internal tools", d: "Dashboards and admin tools that replace spreadsheets and repetitive manual steps." },
      { t: "Quoting & booking tools", d: "Custom calculators, quote builders and booking flows that match how you actually sell." },
      { t: "Integration layers", d: "Software that connects your CRM, accounting, scheduling and other tools into one workflow." },
    ],
    local: [
      { t: "Privacy by design", d: "Applications handling customer data are designed with PIPEDA obligations in mind: access control, minimal collection and documented storage." },
      { t: "Accessible interfaces", d: "Internal and client-facing tools are built with keyboard support and readable contrast, consistent with WCAG practices." },
      { t: "Hosting region", d: "Where it matters, we confirm which country your data is stored in during scoping." },
      { t: "Ownership", d: "Code, repositories and hosting accounts belong to you, with documentation for future developers." },
    ],
    projects: [],
    faq: [
      { q: "Should we build custom software or buy a tool?", a: "If an off-the-shelf tool fits most of your process, use it. Custom software pays off when your process is a competitive advantage or when workarounds cost more than building. Our guide covers the decision in detail." },
      { q: "What technology do you use?", a: "Modern web frameworks such as React and Next.js, typically deployed on Vercel, with APIs and databases chosen per project." },
      { q: "Can you add AI features?", a: "Yes, where they help: drafting documents, summarising information or searching your own data. Not every application needs AI." },
      { q: "Who owns the code?", a: "You do. Repositories and accounts are yours, and the code is documented for future developers." },
      { q: "How is pricing set?", a: "Each application is scoped and quoted after a free strategy call. There is no public price list." },
    ],
    reading: ["custom-software-vs-off-the-shelf", "ai-automation-for-business-guide", "ai-enhanced-web-design-guide", "website-privacy-compliance-canada"],
  },
];

export const localBySlug = (slug: string) => LOCAL_PAGES.find((p) => p.slug === slug);
