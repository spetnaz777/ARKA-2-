import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X, Check } from "lucide-react";
import { Logo } from "./components/Logo";
import { LiquidMetalButton } from "./components/ui/liquid-metal-button";
import ScrollExpandMedia from "./components/ui/scroll-expansion-hero";

/* ============================================================
   ARKA — conventional agency landing page, styled with the
   SpaceX design system (void black, star white, industrial
   uppercase type, 1px ghost buttons, hairline borders).
   ============================================================ */

type Tab = "overview" | "solutions" | "lab" | "quote";

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV: { id: Tab; label: string }[] = [
  { id: "overview", label: "Home" },
  { id: "solutions", label: "Services" },
  { id: "lab", label: "Work" },
  { id: "quote", label: "Contact" },
];

const SERVICES = [
  {
    n: "01",
    name: "AI Automation",
    desc: "End-to-end systems that handle lead follow-up, scheduling, CRM syncing, and repetitive workflows — around the clock, without a team.",
  },
  {
    n: "02",
    name: "AI Lead Generation",
    desc: "Systems that find, qualify, and nurture high-intent leads on autopilot. More pipeline, less manual outreach.",
  },
  {
    n: "03",
    name: "Web Design & Development",
    desc: "Custom sites built to convert — fast, mobile-first, structured for results. AI-enhanced design and build.",
  },
  {
    n: "04",
    name: "AI Application Development",
    desc: "Custom AI apps, internal tools, and dashboards built specifically for your business workflows and data.",
  },
  {
    n: "05",
    name: "AI Chatbots & Assistants",
    desc: "Conversational AI on your site, CRM, or internal tools — trained on your business to answer, qualify, and book.",
  },
  {
    n: "06",
    name: "Marketing Automation",
    desc: "AI-driven email sequences, retargeting flows, and campaign logic that run without manual input and scale with revenue.",
  },
];

const WHY = [
  {
    t: "No templates",
    d: "Every system is built from scratch around your workflows, your CRM, and your customers.",
  },
  {
    t: "Solo operator",
    d: "You work directly with the person building your system. No account managers, no handoffs.",
  },
  {
    t: "Results first",
    d: "We don't charge retainers until the system is live and performing. If it doesn't work, you don't pay.",
  },
  {
    t: "You own it",
    d: "The code, the workflows, the integrations — all transferred to you. No lock-in, month-to-month.",
  },
];

const PROCESS = [
  {
    n: "01",
    t: "Discovery Call",
    time: "30 min",
    d: "We map your workflows, find the highest-ROI automation opportunities, and scope the build. No upsell.",
  },
  {
    n: "02",
    t: "Custom Build",
    time: "5–10 days",
    d: "We build the system end to end — automation flows, AI integrations, CRM connections, testing. Daily updates.",
  },
  {
    n: "03",
    t: "Deploy & Monitor",
    time: "Ongoing",
    d: "The system goes live. We monitor, iterate, and handle issues. Most clients see ROI within 30 days.",
  },
];

const STATS = [
  { v: "40–60%", l: "Less manual ops work" },
  { v: "30 days", l: "Average time to first ROI" },
  { v: "99.9%", l: "Uptime SLA on all pipelines" },
  { v: "2–5×", l: "Lead pipeline increase" },
];

const TESTIMONIALS = [
  {
    q: "ARKA automated our entire follow-up sequence. Response times dropped from days to under 4 minutes. We closed 3× more deals in the first month.",
    n: "Marcus T.",
    r: "Founder, Commercial Real Estate Group",
  },
  {
    q: "The website ARKA built converts at 6.8%. Our previous agency delivered 0.4%. It took 7 days to ship.",
    n: "Sarah K.",
    r: "CMO, B2B SaaS Platform",
  },
  {
    q: "We eliminated 15 manual tasks daily across sales and ops. My team now spends 100% of their time on growth work.",
    n: "Jason R.",
    r: "Operations Director, E-Commerce Brand",
  },
];

const CASES = [
  {
    result: "3× more closed deals in 30 days",
    title: "Commercial Real Estate — Lead Pipeline",
    service: "AI Automation",
    timeline: "8 days to live",
    img: "/img-monolith.jpg",
    desc: "Replaced manual follow-up with a multi-step AI sequence across email, SMS, and CRM. Response times went from days to under 4 minutes. 400+ leads a month, handled autonomously.",
  },
  {
    result: "0.4% → 6.8% conversion rate",
    title: "B2B SaaS — Marketing Site Rebuild",
    service: "Web Design & Development",
    timeline: "7 days to live",
    img: "/img-corridor.jpg",
    desc: "Full rebuild — mobile-first, sub-1s load, structured around a single funnel. Replaced a bloated agency site with a lean architecture that converts.",
  },
  {
    result: "2.4× more booked calls per week",
    title: "E-Commerce Brand — Outbound Engine",
    service: "AI Lead Generation",
    timeline: "10 days to live",
    img: "/rocket-hangar.jpg",
    desc: "AI-powered outbound targeting wholesale and retail buyers. Auto-qualifies prospects, personalises outreach at scale, routes hot leads into the sales calendar.",
  },
  {
    result: "15 manual tasks eliminated daily",
    title: "Operations & Sales — Workflow Automation",
    service: "Marketing Automation",
    timeline: "6 days to live",
    img: "/img-concrete.jpg",
    desc: "Mapped 15 recurring manual tasks, then built flows that sync data between tools, trigger follow-ups on deal-stage changes, and generate weekly reports untouched by a human.",
  },
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
  "OpenAI",
  "Anthropic",
];

const FAQ = [
  {
    q: "How fast can you actually deliver?",
    a: "Most systems go live in 5–10 business days from signed contract. Complex multi-integration builds can take up to 2 weeks. You get daily progress updates throughout.",
  },
  {
    q: "Do I need technical knowledge to work with you?",
    a: "No. You explain what you need in plain terms — the bottlenecks, the manual work, the goals. We handle everything technical.",
  },
  {
    q: "What happens if the system breaks after delivery?",
    a: "Active retainer clients get priority support with guaranteed response times. Issues are resolved, not handed off.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Every engagement is month-to-month. No lock-in, no penalty clauses.",
  },
  {
    q: "Who owns the systems you build?",
    a: "You do. The code, workflows, and integrations are all transferred to you. ARKA doesn't retain IP on client-specific builds.",
  },
];

// ─── Primitives ───────────────────────────────────────────
function Btn({
  children,
  onClick,
  variant = "ghost",
  size = "md",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "primary" | "secondary";
  size?: "md" | "sm";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant === "primary" ? "btn--primary" : ""} ${
        variant === "secondary" ? "btn--secondary" : ""
      } ${size === "sm" ? "btn--sm" : ""}`}
    >
      {children}
    </button>
  );
}

function SectionHead({
  label,
  title,
  intro,
}: {
  label: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{label}</p>
      <h2
        className="u-head mt-4"
        style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.5rem)" }}
      >
        {title}
      </h2>
      {intro && <p className="body-dim mt-4 text-[14px] max-w-xl">{intro}</p>}
    </div>
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
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        scrolled
          ? "bg-black/95 border-b border-[#262629]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="wrap flex items-center justify-between h-[64px]">
        <button
          onClick={() => go("overview")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Logo className="w-8 h-8 text-white" />
          <span className="u-head text-[15px] tracking-[0.2em]">ARKA</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`u-label text-[10px] transition-colors ${
                tab === n.id ? "text-[#f0f0fa]" : "text-[#6b6b72] hover:text-[#f0f0fa]"
              }`}
            >
              {n.label}
            </button>
          ))}
          <LiquidMetalButton
            label="Start a Project"
            onClick={() => go("quote")}
          />
        </nav>

        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => go("quote")}
            className="tap u-label text-[9px] text-[#f0f0fa] border border-[#3a3a3f] rounded-full px-3.5"
          >
            Start
          </button>
          <button
            onClick={openMenu}
            className="tap flex items-center gap-2 text-[#9a9aa2] pl-1"
            aria-label="Open menu"
          >
            <span className="u-label text-[10px]">Menu</span>
            <Menu className="w-4 h-4" />
          </button>
        </div>
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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black flex flex-col"
        >
          <div className="wrap flex items-center justify-between h-[64px] border-b border-[#262629]">
            <span className="u-label text-[10px] text-[#6b6b72]">Menu</span>
            <button onClick={close} aria-label="Close" className="text-[#9a9aa2] p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center gap-2 wrap">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  go(n.id);
                  close();
                }}
                className="u-head text-left py-3"
                style={{ fontSize: "2rem" }}
              >
                {n.label}
              </button>
            ))}
            <div className="mt-6">
              <LiquidMetalButton
                label="Start a Project"
                onClick={() => {
                  go("quote");
                  close();
                }}
              />
            </div>
          </nav>
          <div className="wrap py-6 border-t border-[#262629] flex items-center justify-between">
            <span className="u-label text-[9px] text-[#4a4a50]">ARKA · 2026</span>
            <button
              onClick={() => {
                exitSession();
                close();
              }}
              className="u-label text-[9px] text-[#6b6b72] hover:text-[#f0f0fa] transition-colors"
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
  const start = () => {
    if (loading) return;
    setLoading(true);
    let c = 0;
    const t = setInterval(() => {
      c += 5;
      setProgress(c);
      if (c >= 100) {
        clearInterval(t);
        setTimeout(onEnter, 320);
      }
    }, 70);
  };
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* faint backdrop for depth */}
      <img
        src="/deep-black-hero-1280.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl scale-125 pointer-events-none" />
          <Logo className="relative w-16 h-16 md:w-20 md:h-20 text-white" />
        </div>
        <h1 className="u-head text-lg md:text-xl tracking-[0.32em] text-white">
          ARKA
        </h1>
        <p className="u-label text-[8px] text-[#8a8a92] mt-3 mb-8">
          Systems Operator
        </p>

        {/* blurred glass panel */}
        <div
          className="w-full rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-xl p-6 md:p-7 flex flex-col items-center gap-4 relative overflow-hidden"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.22), 0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.10), transparent 55%)",
            }}
          />
          {!loading ? (
            <>
              <p className="relative text-[12px] leading-relaxed text-white/65">
                Digital systems, built by one operator — live in days, not
                months.
              </p>
              <button
                onClick={start}
                className="relative w-full py-3.5 rounded-full bg-[#f0f0fa] text-black font-michroma text-[10px] tracking-[0.16em] uppercase hover:bg-white transition-colors"
              >
                Enter
              </button>
            </>
          ) : (
            <div className="relative w-full py-2">
              <div className="w-full h-px bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full w-full bg-white origin-left"
                  animate={{ scaleX: progress / 100 }}
                  transition={{ duration: 0.25 }}
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onEnter}
          className="relative mt-4 u-label text-[9px] text-[#5a5a60] hover:text-[#9a9aa2] transition-colors"
        >
          Skip &rarr;
        </button>
      </div>
    </motion.div>
  );
};

// ─── Footer ───────────────────────────────────────────────
function Footer({ go }: { go: (t: Tab) => void }) {
  return (
    <footer className="border-t border-[#262629] bg-black">
      <div className="wrap py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <Logo className="w-7 h-7 text-white" />
            <span className="u-head text-[14px] tracking-[0.2em]">ARKA</span>
          </div>
          <p className="body-dim text-[12px] mt-4 max-w-[200px]">
            Digital infrastructure for companies that move fast. AI automation,
            web, and internal tools — built by one operator.
          </p>
        </div>
        <div>
          <p className="u-label text-[9px] text-[#545457] mb-4">Navigate</p>
          <ul className="flex flex-col gap-2.5">
            {NAV.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => go(n.id)}
                  className="text-[12px] text-[#9a9aa2] hover:text-[#f0f0fa] transition-colors"
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="u-label text-[9px] text-[#545457] mb-4">Services</p>
          <ul className="flex flex-col gap-2.5">
            {SERVICES.slice(0, 5).map((s) => (
              <li key={s.n}>
                <button
                  onClick={() => go("solutions")}
                  className="text-[12px] text-[#9a9aa2] hover:text-[#f0f0fa] transition-colors text-left"
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="u-label text-[9px] text-[#545457] mb-4">Contact</p>
          <ul className="flex flex-col gap-2.5 text-[12px] text-[#9a9aa2]">
            <li>hello@arkalegion.com</li>
            <li>
              <button
                onClick={() => go("quote")}
                className="hover:text-[#f0f0fa] transition-colors"
              >
                Book a strategy call
              </button>
            </li>
            <li className="flex gap-4 pt-2">
              {["LinkedIn", "X"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="u-label text-[9px] text-[#6b6b72] hover:text-[#f0f0fa] transition-colors"
                >
                  {s}
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#262629]">
        <div className="wrap py-5 flex flex-wrap items-center justify-between gap-3">
          <span className="u-label text-[9px] text-[#4a4a50]">
            © 2026 ARKA Systems
          </span>
          <span className="u-label text-[9px] text-[#4a4a50]">
            United States &amp; Canada
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Reusable blocks ──────────────────────────────────────
function ServiceGrid({
  go,
  detailed = false,
}: {
  go: (t: Tab) => void;
  detailed?: boolean;
}) {
  return (
    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SERVICES.map((s) => (
        <div key={s.n} className="card card--hover flex flex-col">
          <span className="u-label text-[10px] text-[#545457]">{s.n}</span>
          <h3 className="u-head text-[16px] mt-4">{s.name}</h3>
          <p className="body-dim text-[13px] mt-3 flex-1">{s.desc}</p>
          <button
            onClick={() => go(detailed ? "quote" : "solutions")}
            className="u-label text-[9px] text-[#6b6b72] hover:text-[#f0f0fa] transition-colors mt-5 flex items-center gap-2 self-start"
          >
            {detailed ? "Start a project" : "Learn more"}
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

function CTABand({ go }: { go: (t: Tab) => void }) {
  return (
    <section className="border-y border-[#262629]">
      <div className="wrap py-14 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <h2
            className="u-head"
            style={{ fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)" }}
          >
            Start automating. Today.
          </h2>
          <p className="body-dim text-[13px] mt-3">
            Book a free 30-minute call. We map what to automate and what it
            returns — no commitment.
          </p>
        </div>
        <div className="shrink-0">
          <LiquidMetalButton
            label="Book a Free Call"
            onClick={() => go("quote")}
          />
        </div>
      </div>
    </section>
  );
}

function PageHero({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="wrap pt-28 pb-14 md:pt-36 md:pb-20 border-b border-[#262629]">
      <p className="eyebrow">{label}</p>
      <h1
        className="u-head mt-5"
        style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
      >
        {title}
      </h1>
      <p className="body-dim mt-5 text-[15px] max-w-xl">{intro}</p>
    </section>
  );
}

// ─── Pages ────────────────────────────────────────────────
function HomePage({ go }: { go: (t: Tab) => void }) {
  return (
    <>
      {/* HERO */}
      <section className="cinematic-edges relative border-b border-[#262629] overflow-hidden">
        {/* moving image backdrop — capped width, centred, so ultra-wide
            screens get black edge-fade rather than an over-zoomed crop */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[2200px] overflow-hidden pointer-events-none">
          <img
            src="/deep-black-hero.jpg"
            srcSet="/deep-black-hero-1280.jpg 1440w, /deep-black-hero.jpg 2400w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            className="hero-drift absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(1.12) contrast(1.04) saturate(1.03)" }}
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.22) 74%, rgba(0,0,0,0.4) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 64%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        <div className="hero-sweep" />
        <div className="hero-grain" />

        <div className="relative wrap pt-28 pb-16 md:pt-36 md:pb-24 w-full">
          <p className="rise eyebrow" style={{ animationDelay: "0.05s" }}>
            ARKA · Systems Operator
          </p>

          <h1
            className="u-head mt-5 max-w-4xl"
            style={{
              fontSize: "clamp(2.05rem, 7.5vw, 5rem)",
              lineHeight: 1.04,
            }}
          >
            <span className="headline-reveal">
              <span style={{ animationDelay: "0.14s" }}>Digital infrastructure</span>
            </span>
            <span className="headline-reveal">
              <span style={{ animationDelay: "0.24s" }} className="text-[#8a8a92]">
                for companies that move fast.
              </span>
            </span>
          </h1>

          <p
            className="rise mt-7 text-[15px] md:text-[16px] text-[#b9b9c0] max-w-xl leading-relaxed"
            style={{ animationDelay: "0.38s" }}
          >
            AI automation, lead generation, and custom web — built from scratch
            around your workflows, live in under two weeks.
          </p>

          <div
            className="rise mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.48s" }}
          >
            <LiquidMetalButton
              label="Start a Project"
              onClick={() => go("quote")}
            />
            <Btn variant="secondary" onClick={() => go("lab")}>
              See the Work
            </Btn>
          </div>

          <div
            className="rise mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-l border-[#262629] max-w-3xl"
            style={{ animationDelay: "0.62s" }}
          >
            {[
              ["12+", "Clients delivered"],
              ["4", "Countries"],
              ["30 days", "Avg time to ROI"],
              ["99.9%", "Uptime SLA"],
            ].map(([v, l]) => (
              <div
                key={l}
                className="border-b border-r border-[#262629] px-4 py-5 md:px-5 md:py-6"
              >
                <div className="u-head text-[18px] md:text-[20px]">{v}</div>
                <div className="u-label text-[8px] md:text-[8.5px] text-[#545457] mt-1.5">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="wrap py-16 md:py-32">
        <SectionHead
          label="What we build"
          title="Six ways we put your business on autopilot."
          intro="Every system is designed around your specific business logic — not recycled templates or off-the-shelf tools."
        />
        <ServiceGrid go={go} />
      </section>

      {/* WHY */}
      <section className="border-t border-[#262629]">
        <div className="wrap py-16 md:py-32">
          <SectionHead
            label="Why ARKA"
            title={
              <>
                Not an agency.
                <br />A systems operator.
              </>
            }
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY.map((w) => (
              <div key={w.t} className="card">
                <h3 className="u-head text-[14px]">{w.t}</h3>
                <p className="body-dim text-[12.5px] mt-3">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-[#262629]">
        <div className="wrap py-16 md:py-32">
          <SectionHead
            label="How it works"
            title="From first call to live system in under two weeks."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROCESS.map((p) => (
              <div key={p.n} className="card">
                <div className="flex items-baseline justify-between">
                  <span className="u-label text-[10px] text-[#545457]">{p.n}</span>
                  <span className="u-label text-[8.5px] text-[#545457]">
                    {p.time}
                  </span>
                </div>
                <h3 className="u-head text-[16px] mt-5">{p.t}</h3>
                <p className="body-dim text-[13px] mt-3">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="border-t border-[#262629]">
        <div className="wrap py-16 md:py-32">
          <SectionHead label="Results" title="What clients get." />
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-[#262629]">
            {STATS.map((s) => (
              <div
                key={s.l}
                className="border-b border-r border-[#262629] px-6 py-8"
              >
                <div
                  className="u-head"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)" }}
                >
                  {s.v}
                </div>
                <div className="u-label text-[8.5px] text-[#545457] mt-2">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.n} className="card flex flex-col">
                <p className="text-[13px] text-[#cfcfd6] leading-relaxed flex-1">
                  "{t.q}"
                </p>
                <div className="mt-5 pt-4 border-t border-[#262629]">
                  <div className="text-[12px] text-[#f0f0fa]">{t.n}</div>
                  <div className="u-label text-[8px] text-[#545457] mt-1">
                    {t.r}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand go={go} />
    </>
  );
}

function ServicesPage({ go }: { go: (t: Tab) => void }) {
  return (
    <>
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/services-hero.mp4"
        mobileMediaSrc="/services-hero-mobile.mp4"
        posterSrc="/services-hero-poster.jpg"
        bgImageSrc="/img-space.jpg"
        bgImageSrcMobile="/img-space-1280.jpg"
        title="What We Build"
        date="ARKA · Services"
        scrollToExpand="Scroll to explore"
        textBlend
      >
        <div className="wrap">
          <SectionHead
            label="Full service list"
            title="Six ways we put your business on autopilot."
            intro="AI-native systems, built from scratch around your business, that plug into the tools you already run."
          />
          <ServiceGrid go={go} detailed />
        </div>
      </ScrollExpandMedia>

      <section className="border-t border-[#262629]">
        <div className="wrap py-14 md:py-28">
          <SectionHead
            label="Integrations"
            title="Connects to everything you already use."
          />
          <div className="mt-12 flex flex-wrap gap-3">
            {INTEGRATIONS.map((i) => (
              <span
                key={i}
                className="border border-[#262629] rounded-[4px] px-4 py-2.5 u-label text-[9px] text-[#9a9aa2]"
              >
                {i}
              </span>
            ))}
            <span className="px-4 py-2.5 u-label text-[9px] text-[#545457]">
              + any REST API or webhook
            </span>
          </div>
        </div>
      </section>

      <CTABand go={go} />
    </>
  );
}

function WorkPage({ go }: { go: (t: Tab) => void }) {
  return (
    <>
      <PageHero
        label="ARKA · Work"
        title="Proven results."
        intro="Real systems, real outcomes — built for businesses that need to scale without adding headcount."
      />
      <section className="wrap py-14 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CASES.map((c) => (
            <div
              key={c.title}
              className="card card--hover flex flex-col overflow-hidden"
            >
              <div className="-mx-6 -mt-6 mb-5 relative aspect-[16/9] overflow-hidden border-b border-[#262629]">
                <img
                  src={c.img}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(0.35) brightness(0.82) contrast(1.05)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-transparent to-transparent" />
              </div>
              <div className="flex items-center justify-between">
                <span className="u-label text-[8.5px] text-[#545457]">
                  {c.service}
                </span>
                <span className="u-label text-[8.5px] text-[#545457]">
                  {c.timeline}
                </span>
              </div>
              <h3
                className="u-head mt-5"
                style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.75rem)" }}
              >
                {c.result}
              </h3>
              <p className="u-label text-[9px] text-[#6b6b72] mt-2">{c.title}</p>
              <p className="body-dim text-[13px] mt-4 flex-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <CTABand go={go} />
    </>
  );
}

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const field =
    "w-full bg-black border border-[#262629] focus:border-[#545457] rounded-[4px] px-4 py-3 text-[14px] text-[#f0f0fa] placeholder:text-[#4a4a50] outline-none transition-colors";

  return (
    <>
      <PageHero
        label="ARKA · Contact"
        title="Let's build."
        intro="Tell us what you're working on. We'll scope it, quote it, and have it live in under two weeks."
      />
      <section className="wrap py-14 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="card">
              {!sent ? (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="u-label text-[9px] text-[#6b6b72]">
                        Name
                      </label>
                      <input
                        className={field}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="u-label text-[9px] text-[#6b6b72]">
                        Business email
                      </label>
                      <input
                        type="email"
                        className={field}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="u-label text-[9px] text-[#6b6b72]">
                      What do you need built?
                    </label>
                    <textarea
                      rows={4}
                      className={`${field} resize-none`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="The bottleneck, the manual work, the goal…"
                    />
                  </div>
                  <div className="pt-1">
                    <LiquidMetalButton
                      label="Request a Call"
                      disabled={!name || !email}
                      onClick={() => {
                        if (!name || !email) return;
                        setSent(true);
                      }}
                    />
                  </div>
                  <p className="u-label text-[8px] text-[#4a4a50]">
                    We respond within 24 hours. No commitment.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 py-6">
                  <div className="w-10 h-10 rounded-full border border-[#545457] flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#f0f0fa]" />
                  </div>
                  <h3 className="u-head text-[18px]">Request received.</h3>
                  <p className="body-dim text-[13px] max-w-sm">
                    We'll reach out to {email} within 24 hours to book your free
                    strategy call.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="u-label text-[9px] text-[#6b6b72] hover:text-[#f0f0fa] transition-colors self-start"
                  >
                    Submit another
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="card">
              <p className="u-label text-[9px] text-[#545457]">Direct</p>
              <p className="text-[14px] text-[#f0f0fa] mt-3">hello@arkalegion.com</p>
              <p className="body-dim text-[12px] mt-2">
                For detailed briefs or partnership inquiries. Responds within 24
                hours.
              </p>
            </div>
            <div className="card">
              <p className="u-label text-[9px] text-[#545457]">What to expect</p>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  "Confirmation email within 24h",
                  "30-minute strategy call, no upsell",
                  "Clear scope and quote after the call",
                  "System live within 5–10 days",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-[#545457] mt-2 shrink-0" />
                    <span className="text-[12.5px] text-[#9a9aa2]">{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#262629]">
        <div className="wrap py-14 md:py-28">
          <SectionHead label="FAQ" title="Common questions." />
          <div className="mt-12 border-t border-[#262629]">
            {FAQ.map((f) => (
              <div key={f.q} className="py-7 border-b border-[#262629]">
                <h3 className="u-head text-[14px]">{f.q}</h3>
                <p className="body-dim text-[13px] mt-2.5 max-w-2xl">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState<Tab>("overview");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // sessionStorage, not localStorage — the gateway re-appears every time
  // the tab is closed and the site is opened fresh (it stays dismissed
  // across reloads / in-tab navigation within the same session).
  const [entered, setEntered] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("arka_portal_entered") === "true";
    } catch {
      return false;
    }
  });

  const was = useRef(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const now = window.scrollY > 16;
        if (now !== was.current) {
          was.current = now;
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
    const r = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(r);
  }, [tab]);

  const go = (t: Tab) => setTab(t);
  const enter = () => {
    setEntered(true);
    try {
      sessionStorage.setItem("arka_portal_entered", "true");
    } catch {
      /* ignore */
    }
  };
  const exitSession = () => {
    setEntered(false);
    try {
      sessionStorage.removeItem("arka_portal_entered");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#f0f0fa] selection:bg-[#f0f0fa] selection:text-black">
      <AnimatePresence>
        {!entered && <SplashGate key="gate" onEnter={enter} />}
      </AnimatePresence>

      {entered && (
        <>
          <Header
            tab={tab}
            go={go}
            scrolled={scrolled}
            openMenu={() => setMenuOpen(true)}
          />
          <MobileMenu
            open={menuOpen}
            close={() => setMenuOpen(false)}
            go={go}
            exitSession={exitSession}
          />
          <main key={tab} className="animate-[fadein_0.35s_ease]">
            {tab === "overview" && <HomePage go={go} />}
            {tab === "solutions" && <ServicesPage go={go} />}
            {tab === "lab" && <WorkPage go={go} />}
            {tab === "quote" && <ContactPage />}
          </main>
          <Footer go={go} />
        </>
      )}
    </div>
  );
}
