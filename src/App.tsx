import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "./components/Logo";

/* ============================================================
   ARKA — SpaceX-language rebuild. Void black, full-bleed
   photography, industrial uppercase type, ghost buttons only.
   Single visual theme. No warp, no gadgets.
   ============================================================ */

type Tab = "overview" | "solutions" | "lab" | "quote";

const NAV: { id: Tab; label: string }[] = [
  { id: "overview", label: "Home" },
  { id: "solutions", label: "Services" },
  { id: "lab", label: "Work" },
  { id: "quote", label: "Contact" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Scroll-into-view fade-up ──────────────────────────────
const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}> = ({ children, className, delay = 0, y = 16 }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
};

// ─── Ghost button (the only button) ───────────────────────
function GhostButton({
  children,
  onClick,
  size = "md",
  filled = false,
  className = "",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  size?: "md" | "sm";
  filled?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ghost-btn ${size === "sm" ? "ghost-btn--sm" : ""} ${
        filled ? "ghost-btn--filled" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Full-bleed photo panel ───────────────────────────────
function Panel({
  img,
  position = "center",
  index,
  tall = false,
  children,
  id,
}: {
  img: string;
  position?: string;
  index?: string;
  tall?: boolean;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden bg-black ${
        tall ? "min-h-[100svh]" : ""
      }`}
    >
      <img
        src={img}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: position,
          filter: tall
            ? "brightness(1.12) contrast(1.05)"
            : "brightness(1.05) contrast(1.02)",
          opacity: tall ? 1 : 0.22,
        }}
      />
      {tall && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.3) 68%, rgba(0,0,0,0.12) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 66%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </>
      )}
      {!tall && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.8) 100%)",
          }}
        />
      )}
      {index && (
        <span
          className="u-head absolute right-5 top-16 md:right-10 md:top-24 text-white/[0.08] select-none pointer-events-none"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          {index}
        </span>
      )}
      <div
        className={`relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 flex flex-col justify-center ${
          tall ? "min-h-[100svh] py-32" : "py-20 md:py-28"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px w-6 bg-white/25" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

function Headline({
  lines,
  className = "",
}: {
  lines: [string, string?];
  className?: string;
}) {
  return (
    <h2
      className={`u-head text-white ${className}`}
      style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
    >
      {lines[0]}
      {lines[1] && (
        <>
          <br />
          <span className="text-white/60">{lines[1]}</span>
        </>
      )}
    </h2>
  );
}

// ─── Header ───────────────────────────────────────────────
function Header({
  tab,
  go,
  scrolled,
  openMenu,
}: {
  tab: Tab;
  go: (t: Tab) => void;
  scrolled: boolean;
  openMenu: () => void;
}) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-black border-b border-white/[0.12]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10 h-[68px] flex items-center justify-between">
        <button
          onClick={() => go("overview")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Logo className="w-9 h-9 md:w-10 md:h-10 text-white" />
          <span className="flex flex-col text-left leading-none">
            <span className="u-head text-[15px] md:text-[17px] tracking-[0.16em] text-white">
              ARKA
            </span>
            <span className="font-michroma text-[8px] tracking-[0.14em] lowercase text-white/40 mt-1">
              systems.global
            </span>
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className="relative py-1 cursor-pointer"
            >
              <span
                className={`font-michroma text-[10px] tracking-[0.16em] uppercase transition-colors ${
                  tab === n.id ? "text-white" : "text-white/40 hover:text-white/75"
                }`}
              >
                {n.label}
              </span>
              {tab === n.id && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-white" />
              )}
            </button>
          ))}
          <GhostButton size="sm" onClick={() => go("quote")}>
            Start a Project
          </GhostButton>
        </nav>

        <button
          onClick={openMenu}
          className="lg:hidden flex items-center gap-2 text-white/60 cursor-pointer"
          aria-label="Open menu"
        >
          <span className="font-michroma text-[10px] tracking-[0.16em] uppercase">
            Menu
          </span>
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

function MobileMenu({
  open,
  close,
  go,
  exitSession,
}: {
  open: boolean;
  close: () => void;
  go: (t: Tab) => void;
  exitSession: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black flex flex-col"
        >
          <div className="h-[68px] px-5 flex items-center justify-between border-b border-white/[0.12]">
            <span className="font-michroma text-[10px] tracking-[0.2em] uppercase text-white/40">
              Navigation
            </span>
            <button onClick={close} aria-label="Close menu" className="text-white/60 p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center gap-2 px-6">
            {NAV.map((n, i) => (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.4, ease: EASE }}
                onClick={() => {
                  go(n.id);
                  close();
                }}
                className="u-head text-left text-white py-3"
                style={{ fontSize: "clamp(2rem, 12vw, 3rem)" }}
              >
                {n.label}
              </motion.button>
            ))}
            <div className="mt-6">
              <GhostButton
                onClick={() => {
                  go("quote");
                  close();
                }}
              >
                Start a Project
              </GhostButton>
            </div>
          </nav>
          <div className="px-6 py-6 border-t border-white/[0.12] flex items-center justify-between">
            <span className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/60">
              ARKA · 2026
            </span>
            <button
              onClick={() => {
                exitSession();
                close();
              }}
              className="font-michroma text-[9px] tracking-[0.16em] uppercase text-white/30 hover:text-white/60 transition-colors"
            >
              Exit Session
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Splash gate ──────────────────────────────────────────
const SplashGate: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const initialise = () => {
    if (loading) return;
    setLoading(true);
    setProgress(0);
    let cur = 0;
    const t = setInterval(() => {
      cur += 4;
      setProgress(cur);
      if (cur >= 100) {
        clearInterval(t);
        setTimeout(onEnter, 400);
      }
    }, 90);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      <img
        src="/deep-black-hero.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        <Logo className="w-20 h-20 md:w-24 md:h-24 text-white mb-6" />
        <h1 className="u-head text-white text-xl md:text-2xl tracking-[0.28em]">
          ARKA GATEWAY
        </h1>
        <p className="eyebrow mt-3 mb-8">autonomous edge console</p>

        <div className="w-full border border-white/[0.14] p-6 flex flex-col items-center gap-4">
          {!loading ? (
            <>
              <p className="text-[12px] leading-relaxed text-white/50">
                Establish a secured session with the central routing cluster.
              </p>
              <GhostButton filled className="w-full justify-center" onClick={initialise}>
                Initialise Secure Entry
              </GhostButton>
            </>
          ) : (
            <div className="w-full py-3">
              <div className="h-px w-full bg-white/15 overflow-hidden">
                <motion.div
                  className="h-full bg-white origin-left"
                  animate={{ scaleX: progress / 100 }}
                  transition={{ ease: EASE, duration: 0.3 }}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onEnter}
          className="mt-4 font-michroma text-[9px] tracking-[0.16em] uppercase text-white/30 hover:text-white/60 transition-colors"
        >
          Skip &rarr;
        </button>
      </div>
    </motion.div>
  );
};

function Footer() {
  return (
    <footer className="relative z-20 border-t border-white/[0.12] bg-black">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-7 flex flex-wrap items-center justify-between gap-4">
        <span className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/60">
          ARKA · Systems Global · 2026
        </span>
        <div className="flex items-center gap-5">
          {[
            ["LinkedIn", "https://www.linkedin.com/"],
            ["X", "https://x.com/"],
            ["Instagram", "https://www.instagram.com/"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-michroma text-[9px] tracking-[0.16em] uppercase text-white/60 hover:text-white/60 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Reusable content blocks ──────────────────────────────
function StatStrip({ items }: { items: { val: string; label: string }[] }) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/[0.12] pt-5">
      {items.map((s, i) => (
        <div key={i} className="flex items-baseline gap-2">
          <span className="font-michroma text-[12px] text-white/80">{s.val}</span>
          <span className="font-michroma text-[8px] tracking-[0.14em] uppercase text-white/30">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function NumberedList({
  items,
}: {
  items: { num: string; name: string; desc: string }[];
}) {
  return (
    <div className="mt-12 border-t border-white/[0.12]">
      {items.map((it, i) => (
        <Reveal key={i} delay={i * 0.04}>
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12 py-7 border-b border-white/[0.12]">
            <span className="font-michroma text-[10px] tracking-[0.16em] text-white/30 md:w-10 shrink-0">
              {it.num}
            </span>
            <h3 className="u-head text-white text-lg md:text-xl md:w-72 shrink-0">
              {it.name}
            </h3>
            <p className="text-[13px] leading-relaxed text-white/60 max-w-xl">
              {it.desc}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

const SERVICES = [
  {
    num: "01",
    name: "AI Automation",
    desc: "End-to-end automation systems that handle lead follow-up, scheduling, CRM syncing, and repetitive workflows — around the clock, without a team.",
  },
  {
    num: "02",
    name: "AI Lead Generation",
    desc: "AI-powered systems that find, qualify, and nurture high-intent leads on autopilot — more pipeline, less manual work.",
  },
  {
    num: "03",
    name: "Web Design & Development",
    desc: "Custom websites built to convert — fast, mobile-first, and structured for results. AI-enhanced design and development.",
  },
  {
    num: "04",
    name: "AI Application Development",
    desc: "Custom AI apps, internal tools, and intelligent dashboards built specifically for your business workflows and data.",
  },
  {
    num: "05",
    name: "AI Chatbots & Assistants",
    desc: "Conversational AI systems deployed on your site, CRM, or internal tools — trained on your business to answer, qualify, and book.",
  },
  {
    num: "06",
    name: "Marketing Automation",
    desc: "AI-driven email sequences, retargeting flows, and campaign logic that run without manual input and scale with your revenue.",
  },
];

const APPROACH = [
  {
    num: "01",
    name: "No templates",
    desc: "Every system is built from scratch around your workflows, your CRM, and your customers — not adapted from a generic playbook.",
  },
  {
    num: "02",
    name: "Solo operator",
    desc: "You work directly with the person building your system. No account managers, no handoffs, no communication lag.",
  },
  {
    num: "03",
    name: "Results first",
    desc: "We don't charge retainers until the system is live and performing. If it doesn't work, you don't pay.",
  },
  {
    num: "04",
    name: "Permanent leverage",
    desc: "What we build keeps working after the engagement ends. You own the systems, the code, and the workflows.",
  },
];

const OUTCOMES = [
  { metric: "40–60%", label: "Reduction in manual ops work" },
  { metric: "30 days", label: "Average time to first ROI" },
  { metric: "Sub-100ms", label: "Global response latency" },
  { metric: "99.9%", label: "Uptime SLA on all pipelines" },
  { metric: "2×–5×", label: "Lead pipeline increase" },
  { metric: "Zero", label: "Lock-in. Cancel anytime." },
];

const TESTIMONIALS = [
  {
    quote:
      "ARKA automated our entire follow-up sequence. Response times dropped from days to under 4 minutes. We closed 3× more deals in the first month.",
    name: "Marcus T.",
    role: "Founder, Commercial Real Estate Group",
    metric: "3× more closed deals",
  },
  {
    quote:
      "The website ARKA built converts at 6.8%. Our previous agency delivered 0.4%. The difference is night and day — and it took 7 days to ship.",
    name: "Sarah K.",
    role: "CMO, B2B SaaS Platform",
    metric: "6.8% conversion rate",
  },
  {
    quote:
      "We eliminated 15 manual tasks daily across sales and ops. My team now spends 100% of their time on growth work instead of copy-paste.",
    name: "Jason R.",
    role: "Operations Director, E-Commerce Brand",
    metric: "15 tasks automated daily",
  },
];

const CASE_STUDIES = [
  {
    service: "AI Automation",
    result: "3× more closed deals in 30 days",
    title: "Commercial Real Estate Lead Pipeline",
    desc: "Replaced manual follow-up with a multi-step AI sequence across email, SMS, and CRM. Response times dropped from days to under 4 minutes. The system now handles 400+ leads per month autonomously.",
    industry: "Real Estate",
    timeline: "8 days to go live",
  },
  {
    service: "Web Design & Dev",
    result: "6.8% conversion rate (up from 0.4%)",
    title: "B2B SaaS Marketing Site Rebuild",
    desc: "Full rebuild from the ground up — mobile-first, sub-1s load times, and structured around a clear funnel. Replaced a bloated agency site with a lean, conversion-focused architecture that actually converts.",
    industry: "SaaS / Technology",
    timeline: "7 days to go live",
  },
  {
    service: "AI Lead Generation",
    result: "2.4× more booked calls per week",
    title: "E-Commerce Brand Outbound Engine",
    desc: "Built an AI-powered outbound system targeting wholesale and retail buyers. Auto-qualifies prospects, personalises outreach at scale, and routes hot leads directly into the sales calendar. Zero manual effort.",
    industry: "E-Commerce",
    timeline: "10 days to go live",
  },
  {
    service: "Marketing Automation",
    result: "15 manual tasks eliminated daily",
    title: "Operations & Sales Workflow Automation",
    desc: "Mapped 15 recurring manual tasks across ops and sales. Built automated flows that sync data between tools, trigger follow-ups on deal stage changes, and generate weekly reports without a human touching anything.",
    industry: "Professional Services",
    timeline: "6 days to go live",
  },
];

const TECH = [
  { name: "Make.com", cat: "Automation" },
  { name: "n8n", cat: "Automation" },
  { name: "OpenAI", cat: "AI / LLMs" },
  { name: "Anthropic", cat: "AI / LLMs" },
  { name: "HubSpot", cat: "CRM" },
  { name: "Salesforce", cat: "CRM" },
  { name: "React / Next.js", cat: "Web Dev" },
  { name: "Vercel", cat: "Infrastructure" },
  { name: "Cloudflare", cat: "Security" },
  { name: "Stripe", cat: "Payments" },
  { name: "Zapier", cat: "Integrations" },
  { name: "Airtable", cat: "Databases" },
];

const INDUSTRIES = [
  "Real Estate",
  "E-Commerce",
  "SaaS / Technology",
  "Marketing Agencies",
  "Professional Services",
  "Healthcare Tech",
  "Financial Services",
  "Media & Content",
];

const INTEGRATIONS = [
  "HubSpot",
  "Salesforce",
  "Stripe",
  "Shopify",
  "Gmail",
  "Slack",
  "Notion",
  "Airtable",
  "Zapier",
  "Make",
  "PostgreSQL",
  "OpenAI",
];

const CONTACT_FAQ = [
  {
    q: "How fast can you actually deliver?",
    a: "Most systems go live in 5–10 business days from signed contract. Complex multi-integration builds can take up to 2 weeks. You get daily progress updates throughout.",
  },
  {
    q: "Do I need technical knowledge to work with you?",
    a: "No. You explain what you need in plain terms — the bottlenecks, the manual work, the goals. I handle everything technical.",
  },
  {
    q: "What happens if the system breaks after delivery?",
    a: "All active retainer clients get priority support with guaranteed response times based on their SLA tier. Issues are resolved — not handed off.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Every engagement is month-to-month. If the system stops working for your business, you cancel. No lock-in, no penalty clauses.",
  },
  {
    q: "Who owns the systems you build?",
    a: "You do. The code, the workflows, the integrations — all transferred to you. ARKA doesn't retain IP on client-specific builds.",
  },
  {
    q: "Do you work with companies outside North America?",
    a: "Yes. We work remotely across time zones. Primary clients are in the US and Canada, but international engagements are common.",
  },
];

// ─── Pages ────────────────────────────────────────────────
function HomePage({ go }: { go: (t: Tab) => void }) {
  return (
    <>
      <Panel img="/deep-black-hero.jpg" index="01" tall>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Eyebrow>ARKA · Systems Operator</Eyebrow>
          <h1
            className="u-head text-white mt-7"
            style={{ fontSize: "clamp(2.75rem, 9vw, 7rem)", lineHeight: 0.98 }}
          >
            Digital
            <br />
            <span className="text-white/60">Infrastructure.</span>
          </h1>
          <p className="mt-8 max-w-md text-[14px] leading-relaxed text-white/50">
            We build the systems modern companies scale on — automation, AI, and
            web that doesn't break.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <GhostButton onClick={() => go("quote")}>
              Start a Project <ArrowRight className="w-3.5 h-3.5" />
            </GhostButton>
            <button
              onClick={() => go("solutions")}
              className="ghost-link"
            >
              Explore Services <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <StatStrip
            items={[
              { val: "12+", label: "Clients" },
              { val: "4", label: "Countries" },
              { val: "30 days", label: "Avg ROI" },
              { val: "99.9%", label: "Uptime SLA" },
            ]}
          />
        </motion.div>
      </Panel>

      <Panel img="/rocket-hangar.jpg" position="center" index="02">
        <Reveal>
          <Eyebrow>What We Build</Eyebrow>
          <Headline lines={["Six Capabilities."]} className="mt-6" />
        </Reveal>
        <NumberedList items={SERVICES} />
        <Reveal className="mt-10">
          <button onClick={() => go("solutions")} className="ghost-link">
            All Services <ArrowRight className="w-3 h-3" />
          </button>
        </Reveal>
      </Panel>

      <Panel img="/img-monolith.jpg" index="03">
        <Reveal>
          <Eyebrow>Our Approach</Eyebrow>
          <Headline lines={["Not an Agency.", "A Systems Operator."]} className="mt-6" />
          <p className="mt-7 max-w-md text-[13px] leading-relaxed text-white/60">
            Every system is designed around your specific business logic — not
            recycled templates or off-the-shelf tools.
          </p>
        </Reveal>
        <NumberedList items={APPROACH} />
      </Panel>

      <Panel img="/img-corridor.jpg" index="04">
        <Reveal>
          <Eyebrow>The Process</Eyebrow>
          <Headline lines={["Live in Under", "Two Weeks."]} className="mt-6" />
        </Reveal>
        <div className="mt-12 border-t border-white/[0.12]">
          {[
            {
              num: "01",
              name: "Discovery Call",
              time: "30 min",
              desc: "We map your workflows, identify the highest-ROI automation opportunities, and scope the build. No fluff, no upsell.",
            },
            {
              num: "02",
              name: "Custom Build",
              time: "5–10 days",
              desc: "We build the system end-to-end — automation flows, AI integrations, CRM connections, and testing. Daily progress updates.",
            },
            {
              num: "03",
              name: "Deploy & Monitor",
              time: "Ongoing",
              desc: "System goes live. We monitor, iterate, and handle issues. Most clients see ROI within the first 30 days.",
            },
          ].map((it, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12 py-7 border-b border-white/[0.12]">
                <span className="font-michroma text-[10px] tracking-[0.16em] text-white/30 md:w-10 shrink-0">
                  {it.num}
                </span>
                <div className="md:w-56 shrink-0 flex flex-col gap-1">
                  <h3 className="u-head text-white text-lg md:text-xl">{it.name}</h3>
                  <span className="font-michroma text-[8px] tracking-[0.14em] uppercase text-white/35">
                    {it.time}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-white/60 max-w-lg">
                  {it.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel img="/img-concrete.jpg" index="05">
        <Reveal>
          <Eyebrow>What Clients Get</Eyebrow>
          <Headline lines={["Outcomes,", "Not Activity."]} className="mt-6" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/[0.12]">
          {OUTCOMES.map((o, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="border-b border-r border-white/[0.12] p-7 flex flex-col gap-3 h-full">
                <span className="u-head text-white text-2xl md:text-3xl">
                  {o.metric}
                </span>
                <span className="font-michroma text-[9px] tracking-[0.12em] uppercase text-white/40 leading-relaxed">
                  {o.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel img="/img-space.jpg" index="06">
        <Reveal>
          <Eyebrow>Client Results</Eyebrow>
          <Headline lines={["What Clients Say."]} className="mt-6" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/[0.12]">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="border-b border-r border-white/[0.12] p-7 flex flex-col gap-5 h-full">
                <span className="font-michroma text-[8px] tracking-[0.12em] uppercase text-white/35 border border-white/15 px-2.5 py-1 w-fit">
                  {t.metric}
                </span>
                <p className="text-[13px] leading-relaxed text-white/55 flex-1">
                  "{t.quote}"
                </p>
                <div className="border-t border-white/[0.12] pt-4 flex flex-col gap-1">
                  <span className="text-[13px] text-white/70">{t.name}</span>
                  <span className="font-michroma text-[8px] tracking-[0.1em] uppercase text-white/30">
                    {t.role}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel img="/img-hall.jpg" index="07">
        <Reveal>
          <Eyebrow>Get Started</Eyebrow>
          <Headline lines={["Start Automating.", "Today."]} className="mt-6" />
          <p className="mt-7 max-w-sm text-[13px] leading-relaxed text-white/60">
            Book a free 30-minute call. We'll map exactly what to automate and
            what it returns.
          </p>
          <div className="mt-9">
            <GhostButton filled onClick={() => go("quote")}>
              Book a Free Call <ArrowRight className="w-3.5 h-3.5" />
            </GhostButton>
          </div>
        </Reveal>
      </Panel>
    </>
  );
}

function ServicesPage({ go }: { go: (t: Tab) => void }) {
  return (
    <>
      <Panel img="/solutions-bg.jpg" tall>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Eyebrow>ARKA · Services</Eyebrow>
          <h1
            className="u-head text-white mt-7"
            style={{ fontSize: "clamp(2.75rem, 9vw, 7rem)", lineHeight: 0.98 }}
          >
            What We
            <br />
            <span className="text-white/60">Build.</span>
          </h1>
          <p className="mt-8 max-w-md text-[14px] leading-relaxed text-white/50">
            Digital infrastructure for brands that need to move fast and scale
            further. Six core capabilities, one operator.
          </p>
          <StatStrip
            items={[
              { val: "6", label: "Core Services" },
              { val: "5–10d", label: "Delivery" },
              { val: "100%", label: "Custom Built" },
              { val: "0", label: "Lock-in" },
            ]}
          />
        </motion.div>
      </Panel>

      <Panel img="/img-space.jpg" index="02">
        <Reveal>
          <Eyebrow>Full Service List</Eyebrow>
          <Headline lines={["Six Capabilities."]} className="mt-6" />
        </Reveal>
        <NumberedList items={SERVICES} />
      </Panel>

      <Panel img="/img-monolith.jpg" index="03">
        <Reveal>
          <Eyebrow>Our Approach</Eyebrow>
          <Headline lines={["Built Different."]} className="mt-6" />
          <p className="mt-7 max-w-md text-[13px] leading-relaxed text-white/60">
            Every system is designed around your specific business logic — not
            recycled templates or off-the-shelf tools.
          </p>
        </Reveal>
        <NumberedList items={APPROACH} />
      </Panel>

      <Panel img="/img-concrete.jpg" index="04">
        <Reveal>
          <Eyebrow>Integrations</Eyebrow>
          <Headline lines={["Connects to Everything."]} className="mt-6" />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-l border-white/[0.12]">
          {INTEGRATIONS.map((t, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <div className="border-b border-r border-white/[0.12] py-8 px-3 flex items-center justify-center">
                <span className="font-michroma text-[9px] tracking-[0.12em] uppercase text-white/40 text-center">
                  {t}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 font-michroma text-[10px] tracking-[0.14em] uppercase text-white/60">
          + Any REST API or webhook endpoint
        </p>
      </Panel>

      <Panel img="/solutions-bg.jpg" index="05">
        <Reveal>
          <Eyebrow>Outcomes</Eyebrow>
          <Headline lines={["What Clients Get."]} className="mt-6" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/[0.12]">
          {OUTCOMES.map((o, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="border-b border-r border-white/[0.12] p-7 flex flex-col gap-3 h-full">
                <span className="u-head text-white text-2xl md:text-3xl">
                  {o.metric}
                </span>
                <span className="font-michroma text-[9px] tracking-[0.12em] uppercase text-white/40 leading-relaxed">
                  {o.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel img="/img-monolith.jpg">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <Eyebrow>Get Started</Eyebrow>
            <Headline lines={["Pick a Service.", "Let's Build."]} className="mt-6" />
          </div>
          <div className="shrink-0">
            <GhostButton filled onClick={() => go("quote")}>
              Start a Project <ArrowRight className="w-3.5 h-3.5" />
            </GhostButton>
          </div>
        </Reveal>
      </Panel>
    </>
  );
}

function WorkPage({ go }: { go: (t: Tab) => void }) {
  return (
    <>
      <Panel img="/img-space.jpg" tall>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Eyebrow>ARKA · Proof of Work</Eyebrow>
          <h1
            className="u-head text-white mt-7"
            style={{ fontSize: "clamp(2.75rem, 9vw, 7rem)", lineHeight: 0.98 }}
          >
            Proven
            <br />
            <span className="text-white/60">Results.</span>
          </h1>
          <p className="mt-8 max-w-md text-[14px] leading-relaxed text-white/50">
            Real systems. Real outcomes. Built for businesses that need to scale
            without adding headcount.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <GhostButton filled onClick={() => go("quote")}>
              Book a Free Call <ArrowRight className="w-3.5 h-3.5" />
            </GhostButton>
            <button onClick={() => go("solutions")} className="ghost-link">
              Explore Services <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </Panel>

      <Panel img="/section-bg.jpg" index="02">
        <Reveal>
          <Eyebrow>Case Studies</Eyebrow>
          <Headline lines={["What We've Built."]} className="mt-6" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 border-t border-l border-white/[0.12]">
          {CASE_STUDIES.map((cs, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="border-b border-r border-white/[0.12] p-7 flex flex-col gap-5 h-full">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-michroma text-[8px] tracking-[0.12em] uppercase text-white/35 border border-white/15 px-2.5 py-1">
                    {cs.service}
                  </span>
                  <span className="font-michroma text-[8px] tracking-[0.1em] uppercase text-white/30">
                    {cs.timeline}
                  </span>
                </div>
                <div>
                  <span className="u-head text-white text-xl md:text-2xl block mb-1">
                    {cs.result}
                  </span>
                  <h3 className="font-michroma text-[9px] tracking-[0.12em] uppercase text-white/30">
                    {cs.title}
                  </h3>
                </div>
                <p className="text-[12px] leading-relaxed text-white/60 flex-1">
                  {cs.desc}
                </p>
                <div className="border-t border-white/[0.12] pt-4">
                  <span className="font-michroma text-[8px] tracking-[0.1em] uppercase text-white/60">
                    Industry: {cs.industry}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel img="/img-hall.jpg" index="03">
        <Reveal>
          <Eyebrow>Stack</Eyebrow>
          <Headline lines={["Best-in-Class Tools."]} className="mt-6" />
          <p className="mt-7 max-w-sm text-[13px] leading-relaxed text-white/60">
            We use the tools that are genuinely best for the job — not the ones
            with the biggest marketing budget.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-l border-white/[0.12]">
          {TECH.map((t, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <div className="border-b border-r border-white/[0.12] p-5 flex flex-col gap-1 h-full">
                <span className="text-[13px] text-white/70">{t.name}</span>
                <span className="font-michroma text-[8px] tracking-[0.1em] uppercase text-white/60">
                  {t.cat}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel img="/img-concrete.jpg" index="04">
        <Reveal>
          <Eyebrow>Industries</Eyebrow>
          <Headline lines={["Who We Work With."]} className="mt-6" />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-t border-l border-white/[0.12]">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="border-b border-r border-white/[0.12] p-6">
                <span className="text-[14px] text-white/55">{ind}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel img="/img-corridor.jpg">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <Eyebrow>Next Steps</Eyebrow>
            <Headline lines={["Your Results", "Start Here."]} className="mt-6" />
          </div>
          <div className="shrink-0">
            <GhostButton filled onClick={() => go("quote")}>
              Book Free Strategy Call <ArrowRight className="w-3.5 h-3.5" />
            </GhostButton>
          </div>
        </Reveal>
      </Panel>
    </>
  );
}

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggle = (s: string) =>
    setServices((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const fieldCls =
    "w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-[14px] text-white placeholder:text-white/60 transition-colors";

  return (
    <>
      <Panel img="/img-hall.jpg" tall>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Eyebrow>ARKA · Contact</Eyebrow>
          <h1
            className="u-head text-white mt-7"
            style={{ fontSize: "clamp(2.75rem, 9vw, 7rem)", lineHeight: 0.98 }}
          >
            Let's
            <br />
            <span className="text-white/60">Build.</span>
          </h1>
          <p className="mt-8 max-w-md text-[14px] leading-relaxed text-white/50">
            Tell us what you're working on. We'll scope it, quote it, and have it
            live in under two weeks.
          </p>
          <StatStrip
            items={[
              { val: "Free", label: "Strategy Call" },
              { val: "24h", label: "Response Time" },
              { val: "5–10d", label: "To Go Live" },
              { val: "Zero", label: "Lock-in" },
            ]}
          />
        </motion.div>
      </Panel>

      <Panel img="/img-space.jpg" index="02" id="contact-form">
        <Reveal>
          <Eyebrow>Get in Touch</Eyebrow>
          <Headline lines={["Tell Us What You Need."]} className="mt-6" />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-michroma text-[9px] tracking-[0.16em] uppercase text-white/35">
                  Your Name
                </label>
                <input
                  className={fieldCls}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-michroma text-[9px] tracking-[0.16em] uppercase text-white/35">
                  Business Email
                </label>
                <input
                  type="email"
                  className={fieldCls}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-michroma text-[9px] tracking-[0.16em] uppercase text-white/35">
                What do you need?
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "AI Automation",
                  "Web Design & Dev",
                  "AI Lead Generation",
                  "Marketing Automation",
                  "AI App Development",
                  "AI Chatbots",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggle(s)}
                    className={`font-michroma text-[9px] tracking-[0.08em] uppercase px-3 py-2 border transition-colors ${
                      services.includes(s)
                        ? "bg-white text-black border-white"
                        : "border-white/20 text-white/40 hover:text-white/70 hover:border-white/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-michroma text-[9px] tracking-[0.16em] uppercase text-white/35">
                Tell us about your project
              </label>
              <textarea
                rows={3}
                className={`${fieldCls} resize-none`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What are you trying to automate or build?"
              />
            </div>

            <div>
              <GhostButton
                filled
                type="submit"
                disabled={!name || !email}
                onClick={() => {
                  if (!name || !email) return;
                  setSubmitted(true);
                }}
              >
                Request Free Strategy Call <ArrowRight className="w-3.5 h-3.5" />
              </GhostButton>
              <p className="mt-4 font-michroma text-[8px] tracking-[0.14em] uppercase text-white/20">
                We respond within 24 hours. No commitment required.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-white/[0.12] p-7 flex flex-col gap-6"
                >
                  <span className="eyebrow">What happens next</span>
                  <div className="border-t border-white/[0.12]">
                    {[
                      ["01", "We reach out within 24h", "A confirmation email, then we book your free 30-minute call."],
                      ["02", "30-min strategy call", "We map your workflows, identify quick wins, and scope the build."],
                      ["03", "System live in 5–10 days", "We build and deploy. You get daily updates."],
                    ].map(([n, t, d]) => (
                      <div key={n} className="flex gap-4 py-4 border-b border-white/[0.12]">
                        <span className="font-michroma text-[9px] tracking-[0.14em] text-white/60 pt-0.5">
                          {n}
                        </span>
                        <div className="flex flex-col gap-1">
                          <span className="font-michroma text-[9px] tracking-[0.08em] uppercase text-white/55">
                            {t}
                          </span>
                          <p className="text-[11px] leading-relaxed text-white/30">{d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-white/[0.12] p-8 flex flex-col items-center text-center gap-5 min-h-[360px] justify-center"
                >
                  <h3 className="u-head text-white text-2xl">Request Received</h3>
                  <p className="font-michroma text-[9px] tracking-[0.08em] text-white/35 leading-relaxed max-w-xs">
                    We'll reach out to {email} within 24 hours to book your free
                    strategy call.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setServices([]);
                      setMessage("");
                    }}
                    className="font-michroma text-[8px] tracking-[0.14em] uppercase text-white/60 hover:text-white/50 transition-colors"
                  >
                    Submit another request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Panel>

      <Panel img="/section-bg.jpg" index="03">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <Headline lines={["Common Questions."]} className="mt-6" />
        </Reveal>
        <div className="mt-12 border-t border-white/[0.12]">
          {CONTACT_FAQ.map((f, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="py-7 border-b border-white/[0.12] flex flex-col gap-2">
                <h3 className="u-head text-white text-base md:text-lg">{f.q}</h3>
                <p className="text-[13px] leading-relaxed text-white/60 max-w-2xl">
                  {f.a}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel img="/img-hall.jpg" index="04">
        <Reveal>
          <Eyebrow>Direct Contact</Eyebrow>
          <Headline lines={["Reach Out Directly."]} className="mt-6" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 border-t border-l border-white/[0.12]">
          {[
            {
              method: "Email",
              value: "hello@arka.systems",
              desc: "For detailed project briefs or partnership inquiries. Responds within 24 hours.",
            },
            {
              method: "LinkedIn",
              value: "ARKA Systems",
              desc: "Connect for quick questions, company updates, and case study walkthroughs.",
            },
            {
              method: "Strategy Call",
              value: "Book Free Call →",
              desc: "30 minutes. We map out your highest-ROI automation and scope the build.",
            },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="border-b border-r border-white/[0.12] p-7 flex flex-col gap-3 h-full">
                <span className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/60">
                  {c.method}
                </span>
                <span className="u-head text-white text-lg">{c.value}</span>
                <p className="text-[12px] leading-relaxed text-white/35">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel img="/img-monolith.jpg">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <Eyebrow>Start Now</Eyebrow>
            <Headline lines={["30 Minutes.", "Then We Build."]} className="mt-6" />
          </div>
          <div className="shrink-0">
            <GhostButton
              filled
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Start Your Project <ArrowRight className="w-3.5 h-3.5" />
            </GhostButton>
          </div>
        </Reveal>
      </Panel>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState<Tab>("overview");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [entered, setEntered] = useState<boolean>(() => {
    try {
      return localStorage.getItem("arka_portal_entered") === "true";
    } catch {
      return false;
    }
  });

  const wasScrolled = useRef(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const now = window.scrollY > 24;
        if (now !== wasScrolled.current) {
          wasScrolled.current = now;
          setScrolled(now);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab]);

  const go = (t: Tab) => setTab(t);

  const enter = () => {
    setEntered(true);
    try {
      localStorage.setItem("arka_portal_entered", "true");
    } catch {
      /* ignore */
    }
  };

  const exitSession = () => {
    setEntered(false);
    try {
      localStorage.setItem("arka_portal_entered", "false");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white antialiased selection:bg-white selection:text-black">
      <AnimatePresence>
        {!entered && <SplashGate key="gate" onEnter={enter} />}
      </AnimatePresence>

      {entered && (
        <>
          <Header tab={tab} go={go} scrolled={scrolled} openMenu={() => setMenuOpen(true)} />
          <MobileMenu
            open={menuOpen}
            close={() => setMenuOpen(false)}
            go={go}
            exitSession={exitSession}
          />

          <main key={tab} className="animate-[fadein_0.4s_ease]">
            {tab === "overview" && <HomePage go={go} />}
            {tab === "solutions" && <ServicesPage go={go} />}
            {tab === "lab" && <WorkPage go={go} />}
            {tab === "quote" && <ContactPage />}
          </main>

          <Footer />
        </>
      )}
    </div>
  );
}
