import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "./components/Logo";

/* ============================================================
   ARKA — SpaceX-language build.
   Every section = one moderate ALL-CAPS headline + 2-3 lines
   + one ghost button, full viewport. Photo sections alternate
   with clean solid black. No eyebrows, numbers, stats, grids.
   ============================================================ */

type Tab = "overview" | "solutions" | "lab" | "quote";

const NAV: { id: Tab; label: string }[] = [
  { id: "overview", label: "Home" },
  { id: "solutions", label: "Services" },
  { id: "lab", label: "Work" },
  { id: "quote", label: "Contact" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Ghost button ─────────────────────────────────────────
function GhostButton({
  children,
  onClick,
  size = "md",
  filled = false,
  type = "button",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  size?: "md" | "sm";
  filled?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
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

// ─── Section: one full-viewport beat ──────────────────────
const Section: React.FC<{
  image?: string;
  position?: string;
  align?: "left" | "right";
  valign?: "center" | "bottom";
  children: React.ReactNode;
  id?: string;
}> = ({
  image,
  position = "center",
  align = "left",
  valign = "center",
  children,
  id,
}) => {
  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden bg-black flex ${
        image
          ? "min-h-[100svh]"
          : "py-28 md:py-40 border-t border-white/[0.08]"
      }`}
    >
      {image && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: position,
              filter: "brightness(1.16) contrast(1.05) saturate(1.02)",
            }}
          />
          {/* soft directional wash behind the text side only */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                align === "left"
                  ? "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.34) 42%, rgba(0,0,0,0) 78%)"
                  : "linear-gradient(270deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.34) 42%, rgba(0,0,0,0) 78%)",
            }}
          />
        </>
      )}
      <div
        className={`relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 flex flex-col ${
          image
            ? valign === "bottom"
              ? "justify-end pb-24"
              : "justify-center"
            : ""
        } ${align === "right" ? "items-end text-right" : "items-start"}`}
      >
        <div
          className={`flex flex-col ${
            align === "right" ? "items-end" : "items-start"
          } max-w-xl`}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="u-head text-white"
      style={{ fontSize: "clamp(1.9rem, 4.2vw, 3.3rem)", lineHeight: 1.05 }}
    >
      {children}
    </h2>
  );
}

function Copy({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 text-[14px] leading-[1.75] text-white/72 max-w-md">
      {children}
    </p>
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
        scrolled ? "bg-black/95 border-b border-white/[0.1]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10 h-[64px] flex items-center justify-between">
        <button
          onClick={() => go("overview")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Logo className="w-8 h-8 md:w-9 md:h-9 text-white" />
          <span className="u-head text-[15px] md:text-[16px] tracking-[0.18em] text-white">
            ARKA
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
                  tab === n.id ? "text-white" : "text-white/45 hover:text-white/80"
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
          className="lg:hidden flex items-center gap-2 text-white/70 cursor-pointer"
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
          <div className="h-[64px] px-5 flex items-center justify-between border-b border-white/[0.1]">
            <span className="font-michroma text-[10px] tracking-[0.2em] uppercase text-white/45">
              Navigation
            </span>
            <button onClick={close} aria-label="Close menu" className="text-white/70 p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center gap-1 px-6">
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
                style={{ fontSize: "clamp(1.9rem, 11vw, 2.75rem)" }}
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
          <div className="px-6 py-6 border-t border-white/[0.1] flex items-center justify-between">
            <span className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/25">
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
    let cur = 0;
    const t = setInterval(() => {
      cur += 4;
      setProgress(cur);
      if (cur >= 100) {
        clearInterval(t);
        setTimeout(onEnter, 380);
      }
    }, 85);
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
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        <Logo className="w-16 h-16 md:w-20 md:h-20 text-white mb-6" />
        <h1 className="u-head text-white text-lg md:text-xl tracking-[0.3em]">
          ARKA GATEWAY
        </h1>
        <p className="font-michroma text-[8px] tracking-[0.28em] uppercase text-white/35 mt-3 mb-8">
          autonomous edge console
        </p>
        <div className="w-full border border-white/[0.14] p-6 flex flex-col items-center gap-4">
          {!loading ? (
            <>
              <p className="text-[12px] leading-relaxed text-white/55">
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
                  className="h-full w-full bg-white origin-left"
                  animate={{ scaleX: progress / 100 }}
                  transition={{ ease: EASE, duration: 0.3 }}
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
    <footer className="relative z-20 border-t border-white/[0.1] bg-black">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-7 flex flex-wrap items-center justify-between gap-4">
        <span className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/25">
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
              className="font-michroma text-[9px] tracking-[0.16em] uppercase text-white/25 hover:text-white/60 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Pages ────────────────────────────────────────────────
function HomePage({ go }: { go: (t: Tab) => void }) {
  return (
    <>
      {/* 1 — HERO (photo, bottom-left, no big headline) */}
      <Section image="/deep-black-hero.jpg" valign="bottom">
        <h1 className="u-head text-white text-[22px] md:text-[26px] tracking-[0.14em]">
          ARKA
        </h1>
        <p className="mt-5 text-[14px] leading-[1.75] text-white/72 max-w-sm">
          We build the digital systems modern companies scale on — automation,
          AI, and web that doesn't break.
        </p>
        <div className="mt-7">
          <GhostButton onClick={() => go("quote")}>
            Start a Project <ArrowRight className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </Section>

      {/* 2 — WHAT WE DO (black) */}
      <Section>
        <Heading>
          The Systems
          <br />
          You Scale On.
        </Heading>
        <Copy>
          AI automation, lead generation, custom web, and internal tools — built
          from scratch around your workflows, not a template. One senior
          operator, start to finish.
        </Copy>
        <div className="mt-8">
          <GhostButton onClick={() => go("solutions")}>
            See Services <ArrowRight className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </Section>

      {/* 3 — HOW WE WORK (photo, right) */}
      <Section image="/img-corridor.jpg" align="right" position="60% center">
        <Heading>Live in Under Two Weeks.</Heading>
        <Copy>
          A 30-minute call to scope it. Five to ten days to build it. Then it's
          live, monitored, and yours. No retainers until the system is working.
        </Copy>
        <div className="mt-8">
          <GhostButton onClick={() => go("quote")}>
            Start a Project <ArrowRight className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </Section>

      {/* 4 — PROOF (black) */}
      <Section>
        <Heading>Results, Not Retainers.</Heading>
        <Copy>
          3× more closed deals in 30 days. A site that converts at 6.8% instead
          of 0.4%. Fifteen manual tasks a day, gone. We don't get paid until the
          system performs.
        </Copy>
        <div className="mt-8">
          <GhostButton onClick={() => go("lab")}>
            See the Work <ArrowRight className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </Section>

      {/* 5 — CTA (photo, right) */}
      <Section image="/img-hall.jpg" align="right" position="70% center">
        <Heading>Start Automating. Today.</Heading>
        <Copy>
          Book a free 30-minute call. We'll map exactly what to automate and what
          it returns — no commitment.
        </Copy>
        <div className="mt-8">
          <GhostButton filled onClick={() => go("quote")}>
            Book a Free Call <ArrowRight className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </Section>
    </>
  );
}

const CAPABILITIES: {
  name: React.ReactNode;
  copy: string;
  image?: string;
  position?: string;
  align?: "left" | "right";
}[] = [
  {
    name: (
      <>
        AI
        <br />
        Automation.
      </>
    ),
    copy: "End-to-end systems that handle lead follow-up, scheduling, CRM syncing, and repetitive workflows — around the clock, without a team.",
    image: "/img-monolith.jpg",
    align: "right",
    position: "60% center",
  },
  {
    name: (
      <>
        AI Lead
        <br />
        Generation.
      </>
    ),
    copy: "Systems that find, qualify, and nurture high-intent leads on autopilot. More pipeline, less manual outreach.",
  },
  {
    name: (
      <>
        Web Design
        <br />& Development.
      </>
    ),
    copy: "Custom sites built to convert — fast, mobile-first, and structured for results. AI-enhanced design and build.",
    image: "/img-concrete.jpg",
    position: "50% 40%",
  },
  {
    name: (
      <>
        AI Application
        <br />
        Development.
      </>
    ),
    copy: "Custom AI apps, internal tools, and dashboards built specifically for your business workflows and data.",
  },
  {
    name: (
      <>
        Chatbots
        <br />& Assistants.
      </>
    ),
    copy: "Conversational AI deployed on your site, CRM, or internal tools — trained on your business to answer, qualify, and book.",
    image: "/img-space.jpg",
    align: "right",
    position: "40% center",
  },
  {
    name: (
      <>
        Marketing
        <br />
        Automation.
      </>
    ),
    copy: "AI-driven email sequences, retargeting flows, and campaign logic that run without manual input and scale with revenue.",
  },
];

function ServicesPage({ go }: { go: (t: Tab) => void }) {
  return (
    <>
      <Section image="/solutions-bg.jpg" valign="bottom" position="55% center">
        <Heading>What We Build.</Heading>
        <Copy>
          Six capabilities. One operator. Every system designed around your
          business logic — not recycled templates or off-the-shelf tools.
        </Copy>
        <div className="mt-7">
          <GhostButton onClick={() => go("quote")}>
            Start a Project <ArrowRight className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </Section>

      {CAPABILITIES.map((c, i) => (
        <Section
          key={i}
          image={c.image}
          align={c.align}
          position={c.position}
        >
          <Heading>{c.name}</Heading>
          <Copy>{c.copy}</Copy>
          <div className="mt-8">
            <GhostButton onClick={() => go("quote")}>
              Start a Project <ArrowRight className="w-3.5 h-3.5" />
            </GhostButton>
          </div>
        </Section>
      ))}

      <Section image="/img-monolith.jpg" align="right" position="65% center">
        <Heading>Pick a Service. Let's Build.</Heading>
        <Copy>
          Tell us the bottleneck. We'll scope the system, quote it, and have it
          live in under two weeks.
        </Copy>
        <div className="mt-8">
          <GhostButton filled onClick={() => go("quote")}>
            Start a Project <ArrowRight className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </Section>
    </>
  );
}

const CASES: {
  result: React.ReactNode;
  copy: string;
  image?: string;
  align?: "left" | "right";
  position?: string;
}[] = [
  {
    result: (
      <>
        3× More
        <br />
        Closed Deals.
      </>
    ),
    copy: "Commercial real estate lead pipeline. Replaced manual follow-up with a multi-step AI sequence across email, SMS, and CRM. Response times went from days to under 4 minutes. 400+ leads a month, handled autonomously. Live in 8 days.",
    image: "/img-space.jpg",
    align: "right",
    position: "40% center",
  },
  {
    result: (
      <>
        0.4% → 6.8%
        <br />
        Conversion.
      </>
    ),
    copy: "B2B SaaS marketing site, rebuilt from the ground up — mobile-first, sub-1s load, structured around a single funnel. Replaced a bloated agency site with a lean architecture that actually converts. Live in 7 days.",
  },
  {
    result: (
      <>
        15 Tasks
        <br />
        A Day, Gone.
      </>
    ),
    copy: "Operations and sales workflow automation. Mapped 15 recurring manual tasks, then built flows that sync data between tools, trigger follow-ups on deal-stage changes, and generate weekly reports — untouched by a human. Live in 6 days.",
    image: "/img-concrete.jpg",
    position: "50% 45%",
  },
];

function WorkPage({ go }: { go: (t: Tab) => void }) {
  return (
    <>
      <Section image="/img-space.jpg" valign="bottom" position="45% center">
        <Heading>Proven Results.</Heading>
        <Copy>
          Real systems, real outcomes — built for businesses that need to scale
          without adding headcount.
        </Copy>
        <div className="mt-7">
          <GhostButton onClick={() => go("quote")}>
            Book a Free Call <ArrowRight className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </Section>

      {CASES.map((c, i) => (
        <Section key={i} image={c.image} align={c.align} position={c.position}>
          <Heading>{c.result}</Heading>
          <Copy>{c.copy}</Copy>
          <div className="mt-8">
            <GhostButton onClick={() => go("quote")}>
              Start a Project <ArrowRight className="w-3.5 h-3.5" />
            </GhostButton>
          </div>
        </Section>
      ))}

      <Section image="/img-corridor.jpg" align="right" position="60% center">
        <Heading>Your Results Start Here.</Heading>
        <Copy>
          A free strategy call, a clear scope, a system live in days. Month-to-
          month — if it stops working, you walk.
        </Copy>
        <div className="mt-8">
          <GhostButton filled onClick={() => go("quote")}>
            Book a Free Call <ArrowRight className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </Section>
    </>
  );
}

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const field =
    "w-full bg-transparent border-b border-white/25 focus:border-white/70 outline-none py-3 text-[15px] text-white placeholder:text-white/25 transition-colors";

  return (
    <>
      <Section image="/img-hall.jpg" valign="bottom" position="70% center">
        <Heading>Let's Build.</Heading>
        <Copy>
          Tell us what you're working on. We'll scope it, quote it, and have it
          live in under two weeks.
        </Copy>
      </Section>

      <Section id="contact-form">
        {!submitted ? (
          <>
            <Heading>Start the Conversation.</Heading>
            <div className="mt-10 w-full max-w-md flex flex-col gap-7">
              <input
                className={field}
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className={field}
                placeholder="Business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                rows={3}
                className={`${field} resize-none`}
                placeholder="What are you trying to automate or build?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="pt-2">
                <GhostButton
                  filled
                  type="submit"
                  disabled={!name || !email}
                  onClick={() => {
                    if (!name || !email) return;
                    setSubmitted(true);
                  }}
                >
                  Request a Call <ArrowRight className="w-3.5 h-3.5" />
                </GhostButton>
              </div>
              <p className="font-michroma text-[8px] tracking-[0.14em] uppercase text-white/25">
                We respond within 24 hours. No commitment.
              </p>
            </div>
          </>
        ) : (
          <>
            <Heading>Request Received.</Heading>
            <Copy>
              We'll reach out to {email} within 24 hours to book your free
              strategy call.
            </Copy>
            <button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setMessage("");
              }}
              className="mt-8 font-michroma text-[9px] tracking-[0.16em] uppercase text-white/30 hover:text-white/60 transition-colors"
            >
              Submit another
            </button>
          </>
        )}
      </Section>

      <Section>
        <Heading>Or Reach Us Directly.</Heading>
        <Copy>
          hello@arka.systems — for detailed briefs or partnership inquiries.
          Otherwise, book the call and we'll map your highest-ROI automation in
          30 minutes.
        </Copy>
        <div className="mt-8">
          <GhostButton
            filled
            onClick={() => {
              const el = document.getElementById("contact-form");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Book a Free Call <ArrowRight className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </Section>
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
        const now = window.scrollY > 20;
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
    const r1 = requestAnimationFrame(() => window.scrollTo(0, 0));
    const t = setTimeout(() => window.scrollTo(0, 0), 120);
    return () => {
      cancelAnimationFrame(r1);
      clearTimeout(t);
    };
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
