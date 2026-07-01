import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, useMotionValue, useVelocity } from "motion/react";
import {
  Sparkles,
  Download,
  Wand2,
  BookOpen,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  Plus,
  Play,
  Share2,
  Lock,
  Globe,
  Users,
  Compass,
  CheckCircle2,
  Activity,
  Trash2,
  Sliders,
  Layers,
  Cpu,
  Code,
  Terminal,
  Send,
  ShieldCheck,
  Zap,
  Check,
  Server,
  Moon,
  Sun,
  Mountain
} from "lucide-react";
import { Logo } from "./components/Logo";
import { AILab } from "./components/AILab";
import { StructureSimulator } from "./components/StructureSimulator";
import { SpinningGlobe } from "./components/SpinningGlobe";
import { PingScanner } from "./components/PingScanner";
import { TravelDimensionWarp } from "./components/TravelDimensionWarp";
import { ROICalculator } from "./components/ROICalculator";
import { ScrollScrubHero } from "./components/ScrollScrubHero";
import { Specimen, AutomationPreset, GlowVariant } from "./types";

// ─── Custom cursor with spring lag + hover expansion ───────────────────────
function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const [hovered, setHovered] = useState(false);
  const dotX = useSpring(mouseX, { damping: 16, stiffness: 800, mass: 0.15 });
  const dotY = useSpring(mouseY, { damping: 16, stiffness: 800, mass: 0.15 });
  const ringX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.9 });
  const ringY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.9 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    const onOver = (e: MouseEvent) => {
      setHovered(!!(e.target as Element).closest('button, a, [role="button"], input, select, label'));
    };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    return () => { window.removeEventListener('mousemove', onMove); document.removeEventListener('mouseover', onOver); };
  }, [mouseX, mouseY]);
  return (
    <>
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference" style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}>
        <motion.div className="bg-white rounded-full" animate={{ width: hovered ? 46 : 10, height: hovered ? 46 : 10 }} transition={{ type: "spring", damping: 16, stiffness: 280 }} />
      </motion.div>
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9998]" style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}>
        <motion.div className="rounded-full border border-white/25" animate={{ width: hovered ? 72 : 38, height: hovered ? 72 : 38, borderColor: hovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)" }} transition={{ type: "spring", damping: 16, stiffness: 160 }} />
      </motion.div>
    </>
  );
}

// ─── Word-by-word text reveal with clip-path ───────────────────────────────
function SplitText({ text, className, delay = 0, animate = false }: {
  text: string; className?: string; delay?: number; animate?: boolean;
}) {
  const words = text.split(' ');
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: delay } } };
  const word = { hidden: { y: "108%", opacity: 0 }, visible: { y: "0%", opacity: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } } };
  return (
    <motion.span className={className} variants={container} initial="hidden" {...(animate ? { animate: "visible" } : { whileInView: "visible", viewport: { once: true, margin: "-50px" } })} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ paddingBottom: "0.08em" }}>
          <motion.span className="inline-block will-change-transform" variants={word}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// ─── Magnetic pull button ───────────────────────────────────────────────────
function MagneticButton({ children, className, onClick, style }: {
  children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { damping: 14, stiffness: 140, mass: 0.4 });
  const sy = useSpring(my, { damping: 14, stiffness: 140, mass: 0.4 });
  const move = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.32);
    my.set((e.clientY - r.top - r.height / 2) * 0.32);
  };
  const leave = () => { mx.set(0); my.set(0); };
  return (
    <motion.button ref={ref} className={className} style={{ ...style, x: sx, y: sy }} onMouseMove={move} onMouseLeave={leave} onClick={onClick} whileTap={{ scale: 0.94 }}>
      {/* inner span ensures text nodes sit above btn-glow-pulse pseudo-elements */}
      <span style={{ position: "relative", zIndex: 3, display: "contents" }}>{children}</span>
    </motion.button>
  );
}

// ─── Parallax banner — sticky-window "fall into" effect ───────────────────
function ParallaxBanner({ src, label, ratio = "21/9", mobileRatio = "16/9", brightness = 0.65 }: {
  src: string; label: string; ratio?: string; mobileRatio?: string; brightness?: number;
}) {
  // Read once at render — no listener needed; orientation changes re-mount anyway
  const isMob = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const { scrollY: globalY } = useScroll();
  const velocity = useVelocity(globalY);
  // Image stays nearly fixed — extreme reverse parallax gives "descending into" feel
  const y = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  // Slow scale-in as viewer approaches: scene "opens up"
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.1, 1.18]);
  // Velocity-based skew — clamped to 0 on mobile to prevent iOS momentum-scroll jank
  const rawSkew = useTransform(velocity, [-4500, 0, 4500], [isMob ? 0 : -2.5, 0, isMob ? 0 : 2.5]);
  const skewY = useSpring(rawSkew, { damping: 60, stiffness: 350 });
  // Brightness lifts as image enters full view
  const imgBrightness = useTransform(scrollYProgress, [0, 0.5, 1], [brightness * 0.7, brightness, brightness * 0.7]);
  const imgFilter = useTransform(imgBrightness, (b) => `brightness(${b}) contrast(1.12) saturate(0.78)`);
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, clipPath: "inset(12% 0 12% 0 round 32px)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0 0% 0 round 32px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden rounded-[2rem]"
      style={{ aspectRatio: isMob ? mobileRatio : ratio, skewY: isMob ? 0 : skewY }}
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ y, scale }}>
        <motion.img
          src={src}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          style={{ filter: imgFilter }}
        />
      </motion.div>
      {/* Deep vignette — heavier bottom shadow for cave/depth sensation */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/28 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/18 pointer-events-none" />
      {/* Corner edge darkening — cinematic letterbox feel */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 120px rgba(0,0,0,0.55)" }} />
      <div className="absolute bottom-7 left-9 flex items-center gap-3">
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="h-px w-6 bg-white/25 origin-left" />
        <motion.span initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.9, duration: 0.5 }} className="font-michroma text-[7.5px] tracking-[0.35em] uppercase text-white/30">{label}</motion.span>
      </div>
    </motion.div>
  );
}

// ─── Ambient cursor-follow glow ────────────────────────────────────────────
function AmbientGlow() {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);
  const x = useSpring(mouseX, { damping: 45, stiffness: 120, mass: 1.2 });
  const y = useSpring(mouseY, { damping: 45, stiffness: 120, mass: 1.2 });
  useEffect(() => {
    const fn = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, [mouseX, mouseY]);
  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[1] hidden lg:block"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
    >
      <div style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(255,255,255,0.028) 0%, transparent 70%)", borderRadius: "50%" }} />
    </motion.div>
  );
}

// ─── Ghost section number (editorial luxury) ───────────────────────────────
function GhostNum({ n }: { n: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  return (
    <motion.div ref={ref} className="absolute right-0 top-0 pointer-events-none select-none overflow-hidden hidden lg:block" style={{ y }}>
      <span className="font-michroma leading-none" style={{ fontSize: "clamp(6rem,18vw,16rem)", color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.045)", letterSpacing: "-0.02em" }}>{n}</span>
    </motion.div>
  );
}

// ─── Animated count-up number ──────────────────────────────────────────────
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = React.useState(0);
  useEffect(() => {
    if (!isInView) return;
    const steps = 60; const duration = 1400; let frame = 0;
    const timer = setInterval(() => { frame++; setVal(Math.min(to, Math.round((to / steps) * frame))); if (frame >= steps) clearInterval(timer); }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function App() {
  // Navigation & Page State
  const [currentTab, setCurrentTab] = useState<"overview" | "solutions" | "lab" | "registry" | "globe" | "quote" | "pingscan" | "design">("overview");
  const [scrollY, setScrollY] = useState(0);
  
  // Modals & UI States
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [isProcessingLocal, setIsProcessingLocal] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePill, setActivePill] = useState<string>("AI Generation");

  // Interactive Live Chat Simulator State (for Solutions Page)
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string; time: string }[]>([
    { sender: "bot", text: "Welcome to ARKA Core. How can we automate your client workflows today?", time: "Just now" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Active terminal logs (for Blueprints Registry)
  const [registryLogs, setRegistryLogs] = useState<string[]>([
    "[SYS] ARKA Central Routing Engine initialised.",
    "[SYS] 5 global multi-region edge gateways connected.",
    "[READY] Awaiting custom pipeline telemetry signals..."
  ]);

  // Contact / Booking Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactService, setContactService] = useState<string[]>([]);
  const [contactMessage, setContactMessage] = useState("");
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia("(max-width: 768px), (pointer: coarse)").matches
  );
  const [theme, setTheme] = useState<"black" | "slate" | "summit">(() => {
    const saved = localStorage.getItem("arka_theme");
    return (saved === "slate" || saved === "black" || saved === "summit") ? saved as any : "black";
  });

  // Scroll progress + velocity-based page skew
  const { scrollYProgress, scrollY: scrollYMV } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const scrollVelocity = useVelocity(scrollYMV);
  const rawPageSkew = useTransform(scrollVelocity, [-6000, 0, 6000], [-0.7, 0, 0.7]);
  const pageSkewY = useSpring(rawPageSkew, { damping: 65, stiffness: 420 });

  // Welcome Gate / Portal State
  const [isPortalEntered, setIsPortalEntered] = useState<boolean>(() => {
    const saved = localStorage.getItem("arka_portal_entered");
    return saved === "true";
  });
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalStep, setPortalStep] = useState("");
  const [portalProgress, setPortalProgress] = useState(0);

  // Reliable background images with hotlinking fallback (including no-referrer support)
  const MOUNTAIN_IMAGES = [
    "https://images.unsplash.com/photo-1549880181-56a44cf8a4a1?q=80&w=2560&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2560&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop"
  ];
  const [bgImageSrc, setBgImageSrc] = useState(MOUNTAIN_IMAGES[0]);
  const [bgImageIndex, setBgImageIndex] = useState(0);

  const handleBgImageError = () => {
    const nextIndex = bgImageIndex + 1;
    if (nextIndex < MOUNTAIN_IMAGES.length) {
      setBgImageIndex(nextIndex);
      setBgImageSrc(MOUNTAIN_IMAGES[nextIndex]);
    }
  };

  const handlePortalInitialize = () => {
    if (portalLoading) return;
    setPortalLoading(true);
    setPortalProgress(0);
    
    const steps = [
      "Securing network edge endpoints...",
      "Resolving cognitive DNS routing handshakes...",
      "Encrypting session telemetry datasets...",
      "Symmetrizing styled viewport reflections...",
      "Handshake verified. Entering ARKA Core Console..."
    ];
    
    setPortalStep(steps[0]);
    let current = 0;
    const interval = setInterval(() => {
      current += 4;
      setPortalProgress(current);
      
      const stepIdx = Math.min(Math.floor((current / 100) * steps.length), steps.length - 1);
      setPortalStep(steps[stepIdx]);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPortalEntered(true);
          localStorage.setItem("arka_portal_entered", "true");
          addRegistryLog("[SECURE] Summit Gateway handshake complete: Session decrypted.");
        }, 500);
      }
    }, 100);
  };

  // Keep isMobile in sync with orientation/resize
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Track cursor spotlight + scroll parallax.
  // On touch / small screens we skip continuous tracking entirely so the
  // page scrolls natively at 60fps (no per-frame React re-renders). On
  // desktop the handlers are rAF-throttled to at most one update per frame.
  useEffect(() => {
    const lowPower =
      window.matchMedia("(hover: none), (pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;

    if (lowPower) {
      // Center the spotlight once — no per-move repaint on touch.
      document.documentElement.style.setProperty("--x-mouse", "50%");
      document.documentElement.style.setProperty("--y-mouse", "50%");
      // Still need header state to update when user crosses 24px — but only
      // fire a React re-render when the threshold is actually crossed so we
      // don't trigger 60 re-renders per second on every scroll frame.
      let wasScrolled = false;
      let raf = 0;
      const mobileScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const nowScrolled = window.scrollY > 24;
          if (nowScrolled !== wasScrolled) {
            wasScrolled = nowScrolled;
            setScrollY(window.scrollY);
          }
        });
      };
      window.addEventListener("scroll", mobileScroll, { passive: true });
      return () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("scroll", mobileScroll);
      };
    }

    let mouseRaf = 0;
    let scrollRaf = 0;
    let mx = 50;
    let my = 50;

    const handleMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 100;
      my = (e.clientY / window.innerHeight) * 100;
      if (mouseRaf) return;
      mouseRaf = requestAnimationFrame(() => {
        mouseRaf = 0;
        document.documentElement.style.setProperty("--x-mouse", `${mx}%`);
        document.documentElement.style.setProperty("--y-mouse", `${my}%`);
      });
    };
    const handleScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const y = window.scrollY;
        setScrollY(y);
        document.documentElement.style.setProperty("--scroll-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (mouseRaf) cancelAnimationFrame(mouseRaf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isWarping, setIsWarping] = useState(false);
  const [warpStage, setWarpStage] = useState<"launch" | "tunnel" | "settle" | "idle">("idle");
  const [warpType, setWarpType] = useState<"planet-to-planet" | "space-to-mountain" | "mountain-to-space">("planet-to-planet");

  const toggleTheme = () => {
    if (isWarping) return;
    setIsWarping(true);
    setWarpStage("launch");
    addRegistryLog("[SYS] Initialising smooth theme realignment... Sweeping ambient glossy shaders.");

    let nextTheme: "black" | "slate" | "summit";
    let transitionType: "planet-to-planet" | "space-to-mountain" | "mountain-to-space" = "planet-to-planet";

    if (theme === "black") {
      nextTheme = "slate";
      transitionType = "planet-to-planet";
    } else if (theme === "slate") {
      nextTheme = "summit";
      transitionType = "space-to-mountain";
    } else {
      nextTheme = "black";
      transitionType = "mountain-to-space";
    }
    setWarpType(transitionType);

    // Step 1: Engage full-screen warp speed simulation
    setTimeout(() => {
      setWarpStage("tunnel");
      setTheme(nextTheme);
      localStorage.setItem("arka_theme", nextTheme);
    }, 450);

    // Step 2: Shifting from tunnel dimension to new coordinate space
    setTimeout(() => {
      setWarpStage("settle");
      const label = nextTheme === "slate" 
        ? "Slate (Charcoal)" 
        : nextTheme === "summit" 
          ? "Summit Peak (Cinematic)" 
          : "Deep Black";
      addRegistryLog(`[THEME] Aesthetic environment aligned: ${label}`);
    }, 1150);

    // Step 3: Complete and restore user interaction
    setTimeout(() => {
      setIsWarping(false);
      setWarpStage("idle");
    }, 1450);
  };

  // Embedded Lab custom creation states
  const [labPrompt, setLabPrompt] = useState("");
  const [labPreset, setLabPreset] = useState<AutomationPreset>("workflow");
  const [labGlow, setLabGlow] = useState<GlowVariant>("aurora");
  const [labComplexity, setLabComplexity] = useState(85);
  const [labSymmetry, setLabSymmetry] = useState(6);
  const [embeddedProgress, setEmbeddedProgress] = useState(0);
  const [embeddedStep, setEmbeddedStep] = useState("");
  const [isEmbeddedProcessing, setIsEmbeddedProcessing] = useState(false);

  // Initial premium automation templates saved in local state
  const [specimens, setSpecimens] = useState<Specimen[]>([
    {
      id: "spec-1",
      name: "E-Commerce Autopilot v2",
      preset: "workflow",
      glow: "dawn",
      complexity: 84,
      symmetry: 12,
      silicaContent: 28.4, // tasks/sec
      lumens: 240,        // latency (ms)
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
      statusText: "Active pipeline sync optimal",
    },
    {
      id: "spec-2",
      name: "Omnilingual Concierge Bot",
      preset: "chatbot",
      glow: "aurora",
      complexity: 92,
      symmetry: 8,
      silicaContent: 94.5, // tasks/sec
      lumens: 88,         // latency (ms)
      imageUrl: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=400",
      statusText: "Dynamic cognitive route established",
    }
  ]);

  const presetImages: Record<AutomationPreset, string> = {
    workflow: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    chatbot: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=800",
    webdesign: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    agents: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  };

  const compilationSteps = [
    "Injecting ARKA conversational neural layers...",
    "Establishing encrypted JSON-RPC state handshakes...",
    "Routing workflow webhooks to Hubspot & Salesforce...",
    "Validating secure edge latency benchmarks...",
    "Automation live! Generating unique signature ticket..."
  ];

  // Embedded Lab custom compile handler
  const handleEmbeddedCompile = () => {
    if (isEmbeddedProcessing) return;
    setIsEmbeddedProcessing(true);
    setEmbeddedProgress(0);
    setEmbeddedStep(compilationSteps[0]);

    let stepPercent = 0;
    const interval = setInterval(() => {
      stepPercent += 10;
      setEmbeddedProgress(stepPercent);
      const stepIdx = Math.min(Math.floor((stepPercent / 100) * compilationSteps.length), compilationSteps.length - 1);
      setEmbeddedStep(compilationSteps[stepIdx]);

      if (stepPercent >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const silicaVal = parseFloat((labComplexity * 1.1 + labSymmetry * 2.8).toFixed(1));
          const lumensVal = labGlow === "cosmic" ? 170 : labGlow === "dawn" ? 410 : labGlow === "eclipse" ? 110 : 75;
          const nameVal = labPrompt.trim() || `ARKA ${labPreset.toUpperCase()} System`;

          const newlyCreated: Specimen = {
            id: Math.random().toString(36).substring(2, 9),
            name: nameVal,
            preset: labPreset,
            glow: labGlow,
            complexity: labComplexity,
            symmetry: labSymmetry,
            silicaContent: silicaVal,
            lumens: lumensVal,
            imageUrl: presetImages[labPreset],
            statusText: "Operational pipeline live across global edge ports."
          };
          
          setSpecimens((prev) => [newlyCreated, ...prev]);
          addRegistryLog(`[SUCCESS] New blueprint '${nameVal}' compiled & persisted in Registry.`);
          setIsEmbeddedProcessing(false);
          setLabPrompt("");
          // Switch to registry tab to show compile succeeded
          setCurrentTab("registry");
        }, 300);
      }
    }, 280);
  };

  // Helper to add custom timestamped logs
  const addRegistryLog = (logText: string) => {
    const timeStr = new Date().toLocaleTimeString();
    setRegistryLogs((prev) => [...prev, `[${timeStr}] ${logText}`]);
  };

  // Chat Simulator handlers
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg, time: "Just now" }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "Our technical engineers can connect your APIs instantly.";
      if (userMsg.toLowerCase().includes("pricing") || userMsg.toLowerCase().includes("cost")) {
        botResponse = "Book a free 30-minute strategy call and we'll scope the exact solution for your business — no commitment required.";
      } else if (userMsg.toLowerCase().includes("scale") || userMsg.toLowerCase().includes("speed")) {
        botResponse = "We achieve sub-100ms response rates globally by caching chatbot models directly at our geographical CDN edge gateways.";
      } else if (userMsg.toLowerCase().includes("reliability") || userMsg.toLowerCase().includes("safe")) {
        botResponse = "All ARKA automation pipelines offer strict ISO-27001 standard data encryption, protecting transactional customer databases flawlessly.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: botResponse, time: "Just now" }]);
      setIsTyping(false);
    }, 1200);
  };

  // Helper: Adding specs
  const handleAddSpecimen = (newSpec: Specimen) => {
    setSpecimens((prev) => [newSpec, ...prev]);
    addRegistryLog(`[SUCCESS] Custom blueprint '${newSpec.name}' added via popup lab.`);
  };

  const handleDeleteSpecimen = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const removedItem = specimens.find((s) => s.id === id);
    setSpecimens((prev) => prev.filter((s) => s.id !== id));
    if (removedItem) {
      addRegistryLog(`[REMOVE] Dropped blueprint '${removedItem.name}' from active state memory.`);
    }
  };

  // Simulate global "Processing" diagnostic routine
  const triggerLocalProcessing = () => {
    if (isProcessingLocal) return;
    setIsProcessingLocal(true);
    setProcessingProgress(0);
    
    const steps = [
      "Securing network edge endpoints...",
      "Analyzing active conversational dialog trees...",
      "Optimizing query-to-intent mappings...",
      "Compiling reactive layouts & styled blocks...",
      "ARKA AI automations live & fully functional!"
    ];
    
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += 20;
      setProcessingProgress(currentPercent);
      
      const stepIdx = Math.min(Math.floor((currentPercent / 100) * steps.length), steps.length - 1);
      setProcessingStep(steps[stepIdx]);

      if (currentPercent >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessingLocal(false);
          addRegistryLog("[AUDIT] Edge mapping health scan complete: All API pipelines returning status code 200.");
        }, 1200);
      }
    }, 400);
  };

  const toggleContactService = (svc: string) => {
    setContactService((prev) => prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]);
  };

  return (
    <div id="bloom_app_container" className={`font-sans w-full relative transition-colors duration-500 text-white selection:bg-white selection:text-black ${
      !isPortalEntered ? "h-[100vh] h-[100dvh] overflow-hidden touch-none" : "min-h-screen"
    } ${theme === "slate" ? "bg-[#0b0f19] theme-slate" : theme === "summit" ? "bg-[#010103] theme-summit" : "bg-black theme-black"}`} style={{ perspective: "1200px" }}>
      
      {/* 3D Cinematic Welcome Gate / Splash Screen Portal */}
      <AnimatePresence>
        {!isPortalEntered && (
          <motion.div
            key="summit-portal-gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden bg-[#010103] px-4 w-full h-[100dvh] touch-none"
          >
            {/* Seamless 8K B&W mountain backdrop image (High-contrast, highly visible match for user's uploaded masterwork) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <img
                src={bgImageSrc}
                alt="Majestic Mountain Background"
                referrerPolicy="no-referrer"
                onError={handleBgImageError}
                className="w-full h-full object-cover opacity-100 scale-102 transition-all duration-1000 select-none animate-[pulse_10s_ease-in-out_infinite_alternate]"
                style={{
                  filter: "grayscale(100%) contrast(125%) brightness(75%)",
                }}
              />
              {/* Subtle shading overlays matching user's image gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#010103] via-transparent to-black/5" />
              <div className="absolute inset-0 bg-radial-gradient" style={{ background: "radial-gradient(circle at center, transparent 50%, rgba(1,1,3,0.2) 100%)" }} />
            </div>

            {/* Clean, luxury minimalist typography layout */}
            <div className="relative flex flex-col items-center justify-center text-center p-4 sm:p-6 z-10 w-full max-w-md my-auto">
              
              {/* Ultra-thin monochrome guide ring */}
              <div className="absolute w-[20rem] h-[20rem] sm:w-[24rem] sm:h-[24rem] rounded-full border border-white/[0.04] pointer-events-none hidden md:block" />
              <div className="absolute w-[16rem] h-[16rem] sm:w-[18rem] sm:h-[18rem] rounded-full border border-white/[0.03] pointer-events-none" />

              {/* Logo - right in the center and BIG */}
              <div className="relative mb-4 sm:mb-8 group cursor-pointer">
                {/* Elegant quiet light behind logo */}
                <div className="absolute inset-0 bg-white/[0.03] rounded-full blur-3xl scale-110 pointer-events-none" />
                
                <Logo className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 text-white filter drop-shadow-[0_0_16px_rgba(255,255,255,0.15)] transition-transform duration-700 hover:scale-[1.03]" />
              </div>

              <h2 className="font-sans font-light text-lg sm:text-2xl md:text-3xl tracking-[0.3em] text-white uppercase leading-none mb-2">
                ARKA GATEWAY
              </h2>
              <p className="text-[8.5px] sm:text-[9.5px] text-white/30 uppercase tracking-[0.2em] font-mono mb-5 sm:mb-8">
                autonomous edge console
              </p>

              {/* Glowing Glass Entry Panel */}
              <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col items-center">
                {/* Glossy spotlight reflection across card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                
                {!portalLoading ? (
                  <div className="w-full flex flex-col items-center gap-3">
                    <p className="text-[10px] sm:text-xs text-white/50 text-center leading-relaxed font-light">
                      Establish a cryptographically secured websocket handshake with the central cognitive routing cluster.
                    </p>
                    <button
                      onClick={handlePortalInitialize}
                      className="w-full mt-1 py-4 px-6 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer active:scale-98"
                    >
                      INITIALISE SECURE ENTRY
                    </button>
                  </div>
                ) : (
                  <div className="w-full py-4 flex flex-col justify-center">
                    {/* Custom sleek progress bar, pure white with high-contrast ambient halo, zero secondary text */}
                    <div className="w-full h-[1.5px] bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full w-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)] origin-left"
                        animate={{ scaleX: portalProgress / 100 }}
                        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setIsPortalEntered(true);
                  localStorage.setItem("arka_portal_entered", "true");
                  addRegistryLog("[SYS] Skipped splash entry page: direct terminal access granted.");
                }}
                className="mt-2 py-3 px-4 text-[10px] font-michroma tracking-wider uppercase text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                skip secure handshake &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isPortalEntered && (
        <>
          {/* Horizontal scroll progress line — color matches theme accent */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-[60] origin-left pointer-events-none"
            style={{
              scaleX: progressScaleX,
              height: "1.5px",
              background: theme === "slate"
                ? "linear-gradient(to right, rgba(80,160,255,0.9), rgba(120,200,255,0.6))"
                : theme === "summit"
                ? "linear-gradient(to right, rgba(210,165,80,0.9), rgba(240,200,120,0.6))"
                : "rgba(255,255,255,0.85)",
              boxShadow: theme === "slate"
                ? "0 0 8px rgba(80,160,255,0.5)"
                : theme === "summit"
                ? "0 0 8px rgba(210,165,80,0.5)"
                : "0 0 6px rgba(255,255,255,0.35)",
            }}
          />
          {/* Vertical scroll progress line — left edge */}
          <motion.div
            className="fixed left-0 top-0 bottom-0 z-[59] origin-top pointer-events-none hidden lg:block"
            style={{
              scaleY: progressScaleX,
              width: "1px",
              background: theme === "slate"
                ? "linear-gradient(to bottom, rgba(80,160,255,0.5), rgba(80,160,255,0.06))"
                : theme === "summit"
                ? "linear-gradient(to bottom, rgba(210,165,80,0.5), rgba(210,165,80,0.06))"
                : "linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.08))",
            }}
          />
          {/* Ambient cursor-follow glow */}
          <AmbientGlow />
          {/* Cool hyperspace travel portal dimension transition effect */}
          <TravelDimensionWarp isActive={isWarping} stage={warpStage} type={warpType} />

      <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden z-0 pointer-events-none select-none">
         {theme === "summit" ? (
          <div className="absolute inset-0 w-full h-full bg-[#010103]">
            <img
              src={bgImageSrc}
              alt="Majestic Mountain Summit Peaks"
              referrerPolicy="no-referrer"
              onError={handleBgImageError}
              className="absolute inset-0 w-full h-full object-cover object-[center_35%] sm:object-center origin-center select-none"
              style={{
                transform: isWarping
                  ? "scale(1.12)"
                  : `scale(${1.08 + scrollY * 0.00012}) translateY(${scrollY * -0.04}px)`,
                opacity: isWarping ? 0.75 : 1.0,
                filter: isWarping
                  ? "grayscale(100%) contrast(245%) brightness(95%) blur(5px)"
                  : "grayscale(100%) contrast(245%) brightness(82%) blur(0px)",
                transition: isWarping ? "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)" : "filter 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            />
          </div>
        ) : theme === "black" ? (
          <div className="absolute inset-0 w-full h-full bg-black">
            <img
              src="/deep-black-hero.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover select-none"
              style={{
                objectPosition: "center center",
                transform: isMobile
                  ? "scale(1.0) translateZ(0)"
                  : isWarping
                    ? "scale(1.10) translateZ(0)"
                    : `scale(${1.03 + scrollY * 0.00009}) translateY(${scrollY * -0.025}px) translateZ(0)`,
                opacity: isWarping ? 0.65 : 1,
                filter: isWarping ? "brightness(75%) blur(5px)" : "brightness(108%) saturate(105%) blur(0px)",
                transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.9s cubic-bezier(0.16,1,0.3,1)",
                willChange: "transform, opacity",
              }}
            />
          </div>
        ) : (
          <>
            {/* Video background — all screen sizes */}
            <video
              id="bloom_video_bg"
              autoPlay
              loop
              muted
              playsInline
              style={{ objectFit: "cover" }}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none filter transition-all duration-1000 ${
                isWarping ? "scale-105 blur-[6px]" : "scale-102"
              } saturate-[0.8] brightness-[0.6] contrast-125`}
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
                type="video/mp4"
              />
            </video>
          </>
        )}
        {/* Overlay — deep black theme keeps overlay near-zero; vignette handles edge darkening */}
        <div className={`absolute inset-0 transition-all duration-700 ${theme === "slate" ? "bg-slate-950/35" : theme === "summit" ? "bg-black/15" : "bg-black/[0.08]"}`} />
        <div className={`absolute inset-0 apple-cinematic-vignette transition-all duration-700 ${theme === "black" ? "opacity-[0.22]" : "opacity-[0.75]"}`} />
      </div>


      {/* Floating Ambient Glow particles — only on slate/summit themes */}
      {theme !== "black" && (
        <>
          <div className={`fixed top-[15%] left-1/4 w-[400px] h-[400px] rounded-full transition-all duration-1000 blur-[140px] pointer-events-none z-0 ${theme === "slate" ? "bg-blue-600/18" : "bg-zinc-800/10"}`} />
          <div className={`fixed bottom-[15%] right-1/4 w-[400px] h-[400px] rounded-full transition-all duration-1000 blur-[140px] pointer-events-none z-0 ${theme === "slate" ? "bg-indigo-600/18" : "bg-white/[0.02]"}`} />
        </>
      )}

      {/* ================= STICKY COHESIVE HEADER NAVIGATION ================= */}
      <header data-scrolled={scrollY > 24 ? "true" : "false"} className="sticky top-0 z-40 w-full px-4 py-3 md:px-12 md:py-4 border-b border-transparent bg-transparent transition-all duration-500 overflow-hidden">
        {/* Cursor-follow spotlight — static on touch, animated on desktop */}
        <div className="absolute inset-0 apple-spotlight-bg opacity-35 z-0 pointer-events-none" />

        {/* CSS-only shimmer sweep — zero JS, zero re-renders */}
        <div className="header-shimmer-sweep z-0" />

        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          
          {/* Logo & Platform Status Tag */}
          <div className="flex items-center gap-3 md:gap-4.5 group cursor-pointer" onClick={() => { setCurrentTab("overview"); addRegistryLog("[NAV] Navigated to home via Logo click"); }}>
            <Logo className="w-10 h-10 md:w-14 md:h-14 text-white filter drop-shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-all duration-300 group-hover:scale-[1.06] group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.5)]" />
            <div className="flex flex-col text-left">
              <span className="font-sans font-black text-lg md:text-2xl tracking-[0.18em] text-white uppercase leading-none transition-colors group-hover:text-neutral-100">ARKA</span>
              <span className="text-[9px] md:text-[10px] text-white/40 lowercase tracking-[0.1em] font-mono mt-0.5 md:mt-1">systems.global</span>
            </div>
          </div>

          {/* Desktop Tab Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { id: "overview", label: "Home" },
              { id: "solutions", label: "Services" },
              { id: "pingscan", label: "Scanner" },
              { id: "lab", label: "Work" },
              { id: "registry", label: "Registry" },
              { id: "quote", label: "Contact" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id as any);
                  addRegistryLog(`[NAV] Navigated to page: ${tab.label}`);
                }}
              >
                <span className={`nav-link font-michroma text-[9px] tracking-[0.18em] uppercase transition-colors duration-250 ${
                  currentTab === tab.id ? "text-white nav-link-active" : "text-white/35 hover:text-white/65"
                }`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-11 h-11 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors cursor-pointer"
              title={theme === "slate" ? "Cinematic Summit" : theme === "summit" ? "Deep Black" : "Charcoal Slate"}
            >
              {theme === "slate" ? (
                <Sun className="w-4 h-4" />
              ) : theme === "summit" ? (
                <Mountain className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.button>

            <button
              id="btn_nav_menu"
              onClick={() => setIsMenuOpen(true)}
              className="px-4 py-3 text-[10px] font-michroma tracking-[0.18em] uppercase text-white/35 hover:text-white/70 transition-colors cursor-pointer"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* ================= PRIMARY CONTENT AREA WITH MOTION SWITCHER ================= */}
      <main 
        id="main_viewport" 
        className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-3.5 sm:py-6 md:py-8 flex flex-col transition-all duration-700 w-full"
        style={{
          transformStyle: "preserve-3d",
          transform: isWarping 
            ? "scale(0.94) rotateX(6deg) translateZ(-80px)"
            : "scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)",
          transition: isWarping 
            ? "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)" 
            : "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: isWarping ? 0.3 : 1.0,
          filter: isWarping ? "blur(7px)" : "blur(0px)"
        }}
      >
        
        {/* Velocity skew wrapper — GPU composited, only transform/opacity */}
        <motion.div style={{ skewY: isMobile ? 0 : pageSkewY }} className="will-change-transform" data-scroll-skew="true">
        <AnimatePresence mode="wait">

          {/* PAGE 1: OVERVIEW / HOMEPAGE */}
          {currentTab === "overview" && (
            <motion.div
              key="overview-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col pb-24"
            >

              {/* ── SECTION 1: HERO ─────────────────────────────────── */}
              <div className="relative flex flex-col justify-between min-h-[calc(100dvh-80px)] py-10 sm:py-16 pb-16 overflow-hidden">
                <GhostNum n="01" />

                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-6 bg-white/20" />
                    <span className="font-michroma text-[9px] tracking-[0.3em] text-white/30 uppercase">ARKA · SYSTEMS GLOBAL</span>
                  </div>
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.5 }} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]">
                    <span className="font-michroma text-[7px] tracking-[0.3em] uppercase text-white/30">Available for new projects</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col gap-0 -mt-4 sm:mt-0">
                  <h1 className="font-sans font-light tracking-[-0.01em] uppercase select-none overflow-hidden" style={{ fontSize: "clamp(3rem, 10vw, 9.5rem)", lineHeight: 0.9 }}>
                    <div className="overflow-hidden">
                      <motion.span
                        initial={{ y: "110%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="text-white block"
                      >Digital</motion.span>
                    </div>
                    <div className="overflow-hidden">
                      <motion.span
                        initial={{ y: "110%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="block"
                        style={{ color: "rgba(255,255,255,0.18)" }}
                      >Infrastructure.</motion.span>
                    </div>
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 mt-8 sm:mt-10">
                    <div className="h-px w-16 bg-white/15 mt-1 shrink-0 hidden sm:block" />
                    <p className="font-sans font-light text-[13px] sm:text-[14px] text-white/35 leading-relaxed tracking-wide max-w-xs">
                      We build the digital systems that modern companies scale on — websites, AI automation, and infrastructure that doesn't break.
                    </p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col gap-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <MagneticButton onClick={() => { setCurrentTab("quote"); addRegistryLog("[NAV] Navigated to booking"); }} className="btn-glow-pulse w-full sm:w-auto px-8 py-4 rounded-full font-michroma text-[9px] tracking-[0.22em] bg-white text-black hover:bg-neutral-100 transition-colors uppercase flex items-center justify-center gap-3">
                      Book a Free Call <ArrowRight className="w-3 h-3" />
                    </MagneticButton>
                    <MagneticButton onClick={() => { setCurrentTab("solutions"); addRegistryLog("[NAV] Navigated to solutions"); }} className="py-3 font-michroma text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/65 transition-colors duration-200 flex items-center gap-2">
                      Explore Services <ArrowRight className="w-3 h-3" />
                    </MagneticButton>
                  </div>
                  <motion.div
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.06] pt-5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.6 }}
                  >
                    {[{ val: "12+", label: "Clients Delivered" }, { val: "4", label: "Countries" }, { val: "30 days", label: "Avg Time to ROI" }, { val: "99.9%", label: "Uptime SLA" }].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.7 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-baseline gap-1.5">
                        <span className="font-michroma text-[11px] text-white/70 stat-val">{item.val}</span>
                        <span className="font-michroma text-[8px] tracking-[0.12em] uppercase text-white/20">{item.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Scroll down indicator */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="absolute bottom-20 left-0 flex items-center gap-3 hidden sm:flex">
                  <div className="scroll-indicator w-px h-10 bg-white/20" />
                  <span className="font-michroma text-[7px] tracking-[0.3em] uppercase text-white/20">Scroll</span>
                </motion.div>

                {/* Capability marquee ticker */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.04] py-4 marquee-outer">
                  <div className="marquee-inner">
                    {[...Array(2)].flatMap((_, rep) =>
                      ["AI Automation", "Web Design", "AI Lead Generation", "Chatbots", "Marketing Automation", "AI Apps", "Edge Infrastructure", "Systems Integration", "ISO-27001", "99.9% Uptime"].map((item, i) => (
                        <React.Fragment key={`${rep}-${i}`}>
                          <span className="font-michroma text-[8px] tracking-[0.22em] uppercase text-white/18 whitespace-nowrap">{item}</span>
                          <span className="text-white/10 mx-6">·</span>
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* ── SECTION 2: FEATURED SERVICES ────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06]"
              >
                <div className="relative flex flex-col gap-3 mb-12">
                  <GhostNum n="02" />
                  <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">What We Build</motion.span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                    <SplitText text="Core Capabilities" />
                  </h2>
                </div>

                <div className="mb-12">
                  <ParallaxBanner src="/rocket-hangar.png" label="ARKA · Systems Infrastructure" ratio="16/7" brightness={0.82} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
                  {[
                    { num: "01", name: "AI Automation", desc: "End-to-end systems that handle lead follow-up, CRM syncing, scheduling, and repetitive workflows — around the clock.", tag: "Most Popular" },
                    { num: "02", name: "AI Lead Generation", desc: "AI systems that find, qualify, and nurture high-intent prospects on autopilot. More pipeline, less manual outreach.", tag: "High ROI" },
                    { num: "03", name: "Web Design & Dev", desc: "Fast, conversion-focused websites built mobile-first. AI-enhanced design that loads instantly and actually converts.", tag: "Fast Delivery" },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: i * 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)", y: -4, transition: { duration: 0.25 } }}
                      onClick={() => { setCurrentTab("solutions"); }}
                      className="flex flex-col gap-4 p-6 sm:p-8 glass-card cursor-pointer group glow-border"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-michroma text-[9px] tracking-widest text-white/20">{s.num}</span>
                        <span className="font-michroma text-[8px] tracking-[0.12em] uppercase text-white/20 border border-white/10 px-2 py-1 rounded-full">{s.tag}</span>
                      </div>
                      <h3 className="font-sans font-light text-xl tracking-[0.04em] uppercase text-white/80 group-hover:text-white transition-colors duration-200">{s.name}</h3>
                      <p className="text-[12px] text-white/30 font-light leading-relaxed tracking-wide flex-1 group-hover:text-white/45 transition-colors duration-200">{s.desc}</p>
                      <div className="flex items-center gap-2 font-michroma text-[8px] tracking-[0.15em] uppercase text-white/20 group-hover:text-white/40 transition-colors duration-200">
                        Learn more <ArrowRight className="w-3 h-3" />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setCurrentTab("solutions")} className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors duration-200 cursor-pointer flex items-center gap-2 mx-auto">
                    View all 6 services <ArrowRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>

              {/* ── CINEMATIC DIVIDER: CONCRETE ─── */}
              <ParallaxBanner src="/img-concrete.png" label="ARKA · Infrastructure" />

              {/* ── SECTION 3: HOW IT WORKS ─────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-hall"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                  <div className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24 relative">
                    <GhostNum n="03" />
                    <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">The Process</motion.span>
                    <h2 className="font-sans font-light text-[2rem] md:text-[2.8rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                      <SplitText text="How ARKA Works" />
                    </h2>
                    <p className="text-[13px] font-light text-white/35 leading-relaxed tracking-wide">
                      From first call to live system in under two weeks. No retainers until the system is working.
                    </p>
                    <MagneticButton onClick={() => setCurrentTab("quote")} className="mt-4 w-fit px-6 py-3 rounded-full font-michroma text-[9px] tracking-[0.18em] bg-white text-black hover:bg-neutral-100 transition-colors uppercase flex items-center gap-2">
                      Start now <ArrowRight className="w-3 h-3" />
                    </MagneticButton>
                  </div>
                  <div className="lg:col-span-8 flex flex-col gap-0 border-t border-white/[0.06]">
                    {[
                      { step: "01", title: "Discovery Call", time: "30 min", desc: "We map your existing workflows, identify the highest-ROI automation opportunities, and scope the build. No fluff, no upsell." },
                      { step: "02", title: "Custom Build", time: "5–10 days", desc: "We build the system end-to-end — automation flows, AI integrations, CRM connections, and testing. You get daily progress updates." },
                      { step: "03", title: "Deploy & Monitor", time: "Ongoing", desc: "System goes live. We monitor, iterate, and handle any issues. Most clients see ROI within the first 30 days." },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex gap-6 sm:gap-10 py-8 border-b border-white/[0.06] group step-row"
                      >
                        <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
                          <span className="font-michroma text-[9px] tracking-widest text-white/20">{item.step}</span>
                          <div className="w-px flex-1 bg-white/[0.06]" />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="font-sans font-light text-lg sm:text-xl tracking-[0.04em] uppercase text-white/80 group-hover:text-white transition-colors duration-200">{item.title}</h3>
                            <span className="font-michroma text-[8px] tracking-[0.15em] uppercase text-white/25 border border-white/10 px-2.5 py-1 rounded-full">{item.time}</span>
                          </div>
                          <p className="text-[13px] text-white/35 font-light leading-relaxed tracking-wide">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── SECTION 4: WHY ARKA ─────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-space"
              >
                <div className="relative flex flex-col gap-3 mb-14">
                  <GhostNum n="04" />
                  <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Why ARKA</motion.span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                    <SplitText text="Not an Agency." /><br />
                    <SplitText text="A Systems Operator." delay={0.2} />
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
                  {[
                    { val: "Solo-built", label: "No agency overhead. One senior operator builds and runs every system." },
                    { val: "5–10 days", label: "Average delivery time from signed contract to live system." },
                    { val: "Month-to-month", label: "No lock-in contracts. If it's not working, cancel anytime." },
                    { val: "US & Canada", label: "We operate in your timezone. Available remotely across North America." },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
                      className="flex flex-col gap-3 p-6 sm:p-8 glass-card transition-colors duration-300 glow-border"
                    >
                      <span className="font-sans font-light text-2xl sm:text-3xl text-white tracking-tight">{item.val}</span>
                      <p className="text-[12px] text-white/30 font-light leading-relaxed tracking-wide">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── SECTION 5: CLIENT RESULTS ───────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-solutions"
              >
                <div className="relative flex flex-col gap-3 mb-14">
                  <GhostNum n="05" />
                  <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Social Proof</motion.span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                    <SplitText text="What clients say." />
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
                  {[
                    { quote: "ARKA automated our entire follow-up sequence. Response times dropped from days to under 4 minutes. We closed 3× more deals in the first month.", name: "Marcus T.", role: "Founder, Commercial Real Estate Group", metric: "3× more closed deals" },
                    { quote: "The website ARKA built converts at 6.8%. Our previous agency delivered 0.4%. The difference is night and day — and it took 7 days to ship.", name: "Sarah K.", role: "CMO, B2B SaaS Platform", metric: "6.8% conversion rate" },
                    { quote: "We eliminated 15 manual tasks daily across sales and ops. My team now spends 100% of their time on growth work instead of copy-paste.", name: "Jason R.", role: "Operations Director, E-Commerce Brand", metric: "15 tasks automated daily" },
                  ].map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: i * 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col gap-6 p-6 sm:p-8 glass-card"
                    >
                      <span className="font-michroma text-[9px] tracking-[0.15em] uppercase text-white/20 border border-white/10 px-2.5 py-1 rounded-full w-fit">{t.metric}</span>
                      <p className="text-[13px] text-white/55 font-light leading-relaxed tracking-wide flex-1">"{t.quote}"</p>
                      <div className="flex flex-col gap-0.5 border-t border-white/[0.06] pt-4">
                        <span className="font-sans font-light text-[13px] text-white/70">{t.name}</span>
                        <span className="font-michroma text-[8px] tracking-[0.1em] uppercase text-white/25">{t.role}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── SECTION 6: KNOWLEDGE BASE (AEO) ──────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-section"
              >
                <div className="relative flex flex-col gap-3 mb-14">
                  <GhostNum n="06" />
                  <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Knowledge Base</motion.span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                    <SplitText text="Common Questions." />
                  </h2>
                  <p className="text-[13px] font-light text-white/35 leading-relaxed tracking-wide max-w-xs">
                    Direct answers to the most common questions about AI automation, web development, and working with ARKA.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.04]" aria-label="Frequently asked questions">
                  {[
                    {
                      q: "What is AI automation and how can it help my business?",
                      a: "AI automation uses artificial intelligence to execute business tasks automatically — lead follow-up, CRM syncing, email campaigns, data entry, report generation — without human intervention. Most ARKA clients reduce manual operational work by 40–60% and see measurable ROI within the first 30 days."
                    },
                    {
                      q: "How is ARKA different from a traditional marketing agency?",
                      a: "ARKA is AI-native. Every system is built with AI at its core — not bolted on. There is no account manager overhead, no junior handoffs, and no 3-month timelines. ARKA delivers working systems in 5–10 days, run by a single senior operator, on month-to-month agreements with no lock-in."
                    },
                    {
                      q: "What is the difference between AI automation and traditional automation?",
                      a: "Traditional automation follows rigid rules: if X then Y. AI automation adds intelligence — it can understand natural language, make contextual decisions, generate personalised content, and handle exceptions that rule-based systems cannot. An AI follow-up system writes unique emails for each lead; a traditional automation sends the same template to everyone."
                    },
                    {
                      q: "How does AI lead generation work?",
                      a: "ARKA's AI lead generation works in three stages: (1) Prospecting — AI identifies high-intent prospects based on your ideal customer profile; (2) Personalised outreach — AI writes unique messages for each prospect at scale; (3) Qualification and routing — AI scores responses and books meetings directly into your calendar. The entire process runs continuously without manual input."
                    },
                    {
                      q: "What types of businesses benefit most from AI automation?",
                      a: "Businesses with high volumes of repetitive tasks, fast-moving sales cycles, or growing teams where adding headcount is expensive see the highest ROI from AI automation. Industries that benefit most: real estate, e-commerce, SaaS, professional services, marketing agencies, financial services, and healthcare technology."
                    },
                    {
                      q: "What marketing automation services does ARKA offer?",
                      a: "ARKA builds AI-enhanced marketing automation including email sequences, lead nurture flows, re-engagement campaigns, social scheduling, ad retargeting triggers, and campaign performance reporting — all running automatically based on behaviour and business rules. Unlike generic platforms, ARKA's systems use AI to personalise content for each recipient."
                    },
                    {
                      q: "What does ARKA's web design include?",
                      a: "ARKA's web design includes full custom design and development (React/Next.js), mobile-first responsive layouts, sub-1s load time optimisation, conversion rate optimisation, SEO structure, AI integrations (chatbots, lead capture, CRM sync), and ongoing performance monitoring. Most websites are delivered in 5–7 days."
                    },
                    {
                      q: "What cybersecurity services does ARKA provide?",
                      a: "ARKA provides security audits, vulnerability assessments, data protection strategy, compliance implementation (ISO-27001, SOC 2, GDPR), secure development practices for all builds, and security monitoring setup. All ARKA-built systems use multi-region encryption and secure API handling by default."
                    },
                    {
                      q: "What video production services does ARKA offer?",
                      a: "ARKA creates brand videos, product demo videos, testimonial videos, social media content (short-form for LinkedIn, Instagram, YouTube), and sales enablement videos. ARKA uses AI-assisted production workflows to deliver professional video content significantly faster than traditional production timelines."
                    },
                    {
                      q: "How quickly can ARKA deliver a system?",
                      a: "Most automation systems and websites go live in 5–10 business days. Simple automation flows and single-page websites can be delivered in as few as 3–5 days. Complex multi-integration builds take 10–14 days. Clients receive daily progress updates throughout the build."
                    },
                    {
                      q: "Do I own the systems ARKA builds for me?",
                      a: "Yes. You own everything ARKA builds — all code, workflows, integrations, and automation systems are transferred to you. ARKA does not lock clients into proprietary platforms. If you stop working with ARKA, you keep everything and can continue running or modifying your systems independently."
                    },
                    {
                      q: "Does ARKA require a long-term contract?",
                      a: "No. All ARKA engagements are month-to-month. There is no lock-in, no minimum term, and no cancellation fee. The work continues as long as it is delivering results for your business."
                    },
                  ].map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ delay: Math.floor(i / 2) * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col gap-3 p-6 sm:p-8 glass-card aeo-speakable"
                    >
                      <h3 className="font-sans font-light text-[14px] sm:text-[15px] tracking-[0.02em] text-white/80 leading-snug">{faq.q}</h3>
                      <p className="text-[12px] text-white/35 font-light leading-relaxed tracking-wide">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <MagneticButton onClick={() => setCurrentTab("quote")} className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors duration-200 cursor-pointer flex items-center gap-2 mx-auto">
                    Still have questions? Book a free call <ArrowRight className="w-3 h-3" />
                  </MagneticButton>
                </div>
              </motion.div>

              {/* ── SECTION 7: FINAL CTA ────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="pt-20 sm:pt-28 border-t border-white/[0.06] flex flex-col gap-10"
              >
                {/* Full-width corridor image */}
                <ParallaxBanner src="/img-corridor.png" label="ARKA · Systems Global" ratio="21/9" brightness={0.55} />

                <div className="pb-20 sm:pb-28 flex flex-col sm:flex-row sm:items-end justify-between gap-10">
                  <div className="flex flex-col gap-4">
                    <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Get Started</span>
                    <p className="font-sans font-light tracking-[-0.01em] uppercase text-white leading-[1.0]" style={{ fontSize: "clamp(2rem, 7vw, 6rem)" }}>
                      Start automating.<br />Today.
                    </p>
                    <p className="text-[13px] font-light text-white/35 leading-relaxed tracking-wide max-w-xs">
                      Book a free 30-minute call. We'll map out exactly what to automate and what it'll return.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 shrink-0">
                    <MagneticButton onClick={() => { setCurrentTab("quote"); addRegistryLog("[NAV] Navigated to booking"); }} className="btn-glow-pulse w-full sm:w-auto px-10 py-5 rounded-full font-michroma text-[9px] tracking-[0.22em] bg-white text-black hover:bg-neutral-100 transition-colors uppercase flex items-center justify-center gap-3">
                      Book a Free Call <ArrowRight className="w-3 h-3" />
                    </MagneticButton>
                    <span className="font-michroma text-[8px] tracking-[0.15em] uppercase text-white/20 text-center">No commitment · Free strategy call</span>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}

          {/* PAGE 2: SOLUTIONS */}
          {currentTab === "solutions" && (
            <motion.div
              key="solutions-page"
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col pb-24"
            >

              {/* ── SECTION 1: HERO ─── */}
              <div className="relative flex flex-col justify-center min-h-[calc(100dvh-80px)] py-16">

                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4 mb-12">
                  <div className="h-px w-6 bg-white/20" />
                  <span className="font-michroma text-[9px] tracking-[0.3em] text-white/30 uppercase">ARKA · Services</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                  <h1 className="font-sans font-light tracking-[-0.01em] uppercase select-none overflow-hidden" style={{ fontSize: "clamp(3rem, 10vw, 9.5rem)", lineHeight: 0.9 }}>
                    <div className="overflow-hidden"><motion.span initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="text-white block">What We</motion.span></div>
                    <div className="overflow-hidden"><motion.span initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.42, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block" style={{ color: "rgba(255,255,255,0.18)" }}>Build.</motion.span></div>
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 mt-8 sm:mt-10">
                    <div className="h-px w-16 bg-white/15 mt-1 shrink-0 hidden sm:block" />
                    <p className="font-sans font-light text-[13px] sm:text-[14px] text-white/35 leading-relaxed tracking-wide max-w-xs">
                      Digital infrastructure for brands that need to move fast and scale further. Six core capabilities, one operator.
                    </p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.06] pt-5">
                  {[{ val: "6", label: "Core Services" }, { val: "5–10d", label: "Delivery" }, { val: "100%", label: "Custom Built" }, { val: "0", label: "Lock-in Contracts" }].map((item, i) => (
                    <div key={i} className="flex items-baseline gap-1.5">
                      <span className="font-michroma text-[11px] text-white/70">{item.val}</span>
                      <span className="font-michroma text-[8px] tracking-[0.12em] uppercase text-white/20">{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* ── SECTION 2: SERVICES LIST ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-space"
              >
                <div className="relative flex flex-col gap-3 mb-12">
                  <GhostNum n="02" />
                  <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Full Service List</motion.span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                    <SplitText text="Six Capabilities" />
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-t border-white/5">
                  {[
                    { num: "01", name: "AI Automation", desc: "End-to-end automation systems that handle lead follow-up, scheduling, CRM syncing, and repetitive workflows — around the clock, without a team." },
                    { num: "02", name: "AI Lead Generation", desc: "AI-powered systems that find, qualify, and nurture high-intent leads on autopilot — more pipeline, less manual work." },
                    { num: "03", name: "Web Design & Development", desc: "Custom websites built to convert — fast, mobile-first, and structured for results. AI-enhanced design and development." },
                    { num: "04", name: "AI Application Development", desc: "Custom AI apps, internal tools, and intelligent dashboards built specifically for your business workflows and data." },
                    { num: "05", name: "AI Chatbots & Assistants", desc: "Conversational AI systems deployed on your site, CRM, or internal tools — trained on your business to answer, qualify, and book." },
                    { num: "06", name: "Marketing Automation", desc: "AI-driven email sequences, retargeting flows, and campaign logic that run without manual input and scale with your revenue." }
                  ].map((service, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.03)", transition: { duration: 0.22 } }}
                      onClick={() => { setCurrentTab("quote"); addRegistryLog(`[NAV] Service interest: ${service.name}`); }}
                      className="md:col-span-12 border-b border-white/5 py-6 sm:py-8 px-3 sm:px-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-16 cursor-pointer group step-row"
                    >
                      <span className="text-[10px] font-michroma text-white/20 tracking-widest w-8 shrink-0 transition-colors duration-200 group-hover:text-white/35">{service.num}</span>
                      <h3 className="font-sans font-light text-xl md:text-2xl tracking-[0.04em] uppercase text-white/80 group-hover:text-white transition-colors duration-200 md:w-72 shrink-0">{service.name}</h3>
                      <p className="text-[13px] text-white/35 font-light leading-relaxed tracking-wide flex-1 group-hover:text-white/50 transition-colors duration-200">{service.desc}</p>
                      <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/55 group-hover:translate-x-2 transition-all duration-200 shrink-0 hidden md:block" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── CINEMATIC DIVIDER: MONOLITH ─── */}
              <ParallaxBanner src="/img-monolith.png" label="ARKA · Singular. Powerful." brightness={0.6} />

              {/* ── SECTION 3: HOW WE APPROACH IT ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-hall"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                  <div className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24 relative">
                    <GhostNum n="03" />
                    <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Our Approach</motion.span>
                    <h2 className="font-sans font-light text-[2rem] md:text-[2.8rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                      <SplitText text="Built Different" />
                    </h2>
                    <p className="text-[13px] font-light text-white/35 leading-relaxed tracking-wide">
                      Every system is designed around your specific business logic — not recycled templates or off-the-shelf tools.
                    </p>
                  </div>
                  <div className="lg:col-span-8 flex flex-col gap-0 border-t border-white/[0.06]">
                    {[
                      { step: "01", title: "No templates", desc: "Every system is built from scratch around your workflows, your CRM, and your customers — not adapted from a generic playbook." },
                      { step: "02", title: "Solo operator", desc: "You work directly with the person building your system. No account managers, no handoffs, no communication lag." },
                      { step: "03", title: "Results first", desc: "We don't charge retainers until the system is live and performing. If it doesn't work, you don't pay." },
                      { step: "04", title: "Permanent leverage", desc: "What we build keeps working after the engagement ends. You own the systems, the code, and the workflows." },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex gap-6 sm:gap-10 py-8 border-b border-white/[0.06] group step-row"
                      >
                        <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
                          <span className="font-michroma text-[9px] tracking-widest text-white/20">{item.step}</span>
                          <div className="w-px flex-1 bg-white/[0.06]" />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <h3 className="font-sans font-light text-lg sm:text-xl tracking-[0.04em] uppercase text-white/80 group-hover:text-white transition-colors duration-200">{item.title}</h3>
                          <p className="text-[13px] text-white/35 font-light leading-relaxed tracking-wide">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── SECTION 4: INTEGRATIONS ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-concrete"
              >
                <div className="flex flex-col gap-3 mb-14">
                  <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Integrations</span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">Connects to Everything</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-white/[0.04]">
                  {["HubSpot", "Salesforce", "Stripe", "Shopify", "Gmail", "Slack", "Notion", "Airtable", "Zapier", "Make", "PostgreSQL", "OpenAI"].map((tool, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04, duration: 0.4 }}
                      className="flex flex-col items-center justify-center py-8 px-4 glass-card hover:bg-white/[0.06]! transition-colors duration-200 group"
                    >
                      <span className="font-michroma text-[9px] tracking-[0.12em] uppercase text-white/30 group-hover:text-white/55 transition-colors duration-200 text-center">{tool}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="mt-6 text-[11px] font-michroma tracking-[0.12em] uppercase text-white/20 text-center">+ any REST API or webhook endpoint</p>
              </motion.div>

              {/* ── SECTION 5: RESULTS ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-solutions"
              >
                <div className="flex flex-col gap-3 mb-14">
                  <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Outcomes</span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">What Clients Get</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
                  {[
                    { metric: "40–60%", label: "Reduction in manual ops work", desc: "Systems handle the repetitive tasks so your team works on what matters." },
                    { metric: "30 days", label: "Average time to first ROI", desc: "Most clients recoup the monthly retainer within the first month of operation." },
                    { metric: "Sub-100ms", label: "Global response latency", desc: "Edge-cached systems respond faster than any human team can." },
                    { metric: "99.9%", label: "Uptime SLA on all pipelines", desc: "Multi-region failover keeps your systems running around the clock." },
                    { metric: "2×–5×", label: "Lead pipeline increase", desc: "AI lead gen systems consistently outperform manual outreach at scale." },
                    { metric: "Zero", label: "Lock-in. Cancel anytime.", desc: "Month-to-month agreements. If it stops working, you walk. Simple." },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-3 p-6 sm:p-8 glass-card">
                      <span className="font-sans font-light text-2xl sm:text-3xl text-white tracking-tight">{item.metric}</span>
                      <span className="font-michroma text-[9px] tracking-[0.12em] uppercase text-white/45">{item.label}</span>
                      <p className="text-[12px] text-white/30 font-light leading-relaxed tracking-wide">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ── SECTION 6: CTA ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-end justify-between gap-10 section-with-bg sbg-monolith"
              >
                <div className="flex flex-col gap-4">
                  <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Get Started</span>
                  <p className="font-sans font-light tracking-[-0.01em] uppercase text-white leading-[1.0]" style={{ fontSize: "clamp(2rem, 7vw, 6rem)" }}>
                    Pick a service.<br />Let's build.
                  </p>
                </div>
                <div className="flex flex-col gap-4 shrink-0">
                  <MagneticButton onClick={() => { setCurrentTab("quote"); addRegistryLog("[NAV] Navigated to contact from services"); }} className="btn-glow-pulse w-full sm:w-auto px-10 py-5 rounded-full font-michroma text-[9px] tracking-[0.22em] bg-white text-black hover:bg-neutral-100 transition-colors uppercase flex items-center justify-center gap-3">
                    Start a Project <ArrowRight className="w-3 h-3" />
                  </MagneticButton>
                  <span className="font-michroma text-[8px] tracking-[0.15em] uppercase text-white/20 text-center">Free strategy call · No commitment</span>
                </div>
              </motion.div>

            </motion.div>
          )}

          {/* PAGE 3: CASE STUDIES & RESULTS */}
          {currentTab === "lab" && (
            <motion.div
              key="lab-page"
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col pb-24"
            >

              {/* ── SECTION 1: HERO ─── */}
              <div className="relative flex flex-col justify-center min-h-[calc(100dvh-80px)] py-16 overflow-hidden">
                <GhostNum n="03" />
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4 mb-12">
                  <div className="h-px w-6 bg-white/20" />
                  <span className="font-michroma text-[9px] tracking-[0.3em] text-white/30 uppercase">ARKA · Proof of Work</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                  <h1 className="font-sans font-light tracking-[-0.01em] uppercase select-none overflow-hidden" style={{ fontSize: "clamp(3rem, 10vw, 9.5rem)", lineHeight: 0.9 }}>
                    <div className="overflow-hidden"><motion.span initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="text-white block">Proven</motion.span></div>
                    <div className="overflow-hidden"><motion.span initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.42, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block" style={{ color: "rgba(255,255,255,0.18)" }}>Results.</motion.span></div>
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 mt-8 sm:mt-10">
                    <div className="h-px w-16 bg-white/15 mt-1 shrink-0 hidden sm:block" />
                    <p className="font-sans font-light text-[13px] sm:text-[14px] text-white/35 leading-relaxed tracking-wide max-w-xs">
                      Real systems. Real outcomes. Built for businesses that need to scale without adding headcount.
                    </p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <MagneticButton onClick={() => { setCurrentTab("quote"); addRegistryLog("[NAV] Navigated to booking from work page"); }} className="btn-glow-pulse w-full sm:w-auto px-8 py-4 rounded-full font-michroma text-[9px] tracking-[0.22em] bg-white text-black hover:bg-neutral-100 transition-colors uppercase flex items-center justify-center gap-3">
                    Book a Free Call <ArrowRight className="w-3 h-3" />
                  </MagneticButton>
                  <MagneticButton onClick={() => { setCurrentTab("solutions"); }} className="py-3 font-michroma text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/65 transition-colors duration-200 flex items-center gap-2">
                    Explore Services <ArrowRight className="w-3 h-3" />
                  </MagneticButton>
                </motion.div>
              </div>

              {/* ── SECTION 2: CASE STUDIES ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-space"
              >
                <div className="relative flex flex-col gap-3 mb-12">
                  <GhostNum n="02" />
                  <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Case Studies</motion.span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                    <SplitText text="What We've Built" />
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
                  {[
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
                  ].map((cs, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)", transition: { duration: 0.2 } }}
                      className="flex flex-col gap-5 p-6 sm:p-8 glass-card group glow-border cursor-default"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <span className="font-michroma text-[8px] tracking-[0.12em] uppercase text-white/20 border border-white/10 px-2.5 py-1 rounded-full">{cs.service}</span>
                        <span className="font-michroma text-[8px] tracking-[0.1em] uppercase text-white/35">{cs.timeline}</span>
                      </div>
                      <div>
                        <span className="font-sans font-light text-2xl sm:text-3xl text-white tracking-tight block mb-1">{cs.result}</span>
                        <h3 className="font-michroma text-[9px] tracking-[0.12em] uppercase text-white/30">{cs.title}</h3>
                      </div>
                      <p className="text-[12px] text-white/35 font-light leading-relaxed tracking-wide flex-1 group-hover:text-white/50 transition-colors duration-200">{cs.desc}</p>
                      <div className="border-t border-white/[0.06] pt-4">
                        <span className="font-michroma text-[8px] tracking-[0.1em] uppercase text-white/20">Industry: {cs.industry}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── CINEMATIC DIVIDER ─── */}
              <ParallaxBanner src="/img-concrete.png" label="ARKA · Proof of Work" brightness={0.55} />

              {/* ── SECTION 3: TECH STACK ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-hall"
              >
                <div className="relative flex flex-col gap-3 mb-14">
                  <GhostNum n="03" />
                  <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Stack</motion.span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                    <SplitText text="Built With Best-in-Class Tools" />
                  </h2>
                  <p className="text-[13px] font-light text-white/35 leading-relaxed tracking-wide max-w-sm">
                    We use the tools that are genuinely best for the job — not the ones with the biggest marketing budget.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-white/[0.04]">
                  {[
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
                  ].map((tool, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04, duration: 0.4 }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                      className="flex flex-col gap-1 p-5 glass-card transition-colors duration-200"
                    >
                      <span className="font-sans font-light text-[13px] text-white/70">{tool.name}</span>
                      <span className="font-michroma text-[8px] tracking-[0.1em] uppercase text-white/20">{tool.cat}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── SECTION 4: INDUSTRIES ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-concrete"
              >
                <div className="relative flex flex-col gap-3 mb-14">
                  <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Industries</motion.span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                    <SplitText text="Who We Work With" />
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/[0.04]">
                  {[
                    "Real Estate", "E-Commerce", "SaaS / Technology", "Marketing Agencies",
                    "Professional Services", "Healthcare Tech", "Financial Services", "Media & Content",
                  ].map((ind, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="p-5 sm:p-6 glass-card"
                    >
                      <span className="font-sans font-light text-[13px] sm:text-[15px] text-white/55">{ind}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── SECTION 5: CTA ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-end justify-between gap-10 section-with-bg sbg-corridor"
              >
                <div className="flex flex-col gap-4">
                  <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Next Steps</span>
                  <p className="font-sans font-light tracking-[-0.01em] uppercase text-white leading-[1.0]" style={{ fontSize: "clamp(2rem, 7vw, 6rem)" }}>
                    Your results<br />start here.
                  </p>
                </div>
                <div className="flex flex-col gap-4 shrink-0">
                  <MagneticButton onClick={() => { setCurrentTab("quote"); addRegistryLog("[NAV] Navigated to booking from work page CTA"); }} className="btn-glow-pulse w-full sm:w-auto px-10 py-5 rounded-full font-michroma text-[9px] tracking-[0.22em] bg-white text-black hover:bg-neutral-100 transition-colors uppercase flex items-center justify-center gap-3">
                    Book Free Strategy Call <ArrowRight className="w-3 h-3" />
                  </MagneticButton>
                  <span className="font-michroma text-[8px] tracking-[0.15em] uppercase text-white/20 text-center">Free call · No commitment · Results in 30 days</span>
                </div>
              </motion.div>

            </motion.div>
          )}

          {/* PAGE 4: ARKA BLUEPRINTS REGISTRY TERMINAL */}
          {currentTab === "registry" && (
            <motion.div
              key="registry-page"
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col pb-24"
            >

              {/* ── SECTION 1: HERO ─── */}
              <div className="relative flex flex-col justify-center min-h-[calc(100dvh-80px)] py-16 overflow-hidden">
                <GhostNum n="04" />
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4 mb-12">
                  <div className="h-px w-6 bg-white/20" />
                  <span className="font-michroma text-[9px] tracking-[0.3em] text-white/30 uppercase">ARKA · System Registry</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                  <h1 className="font-sans font-light tracking-[-0.01em] uppercase select-none overflow-hidden" style={{ fontSize: "clamp(3rem, 10vw, 9.5rem)", lineHeight: 0.9 }}>
                    <div className="overflow-hidden"><motion.span initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="text-white block">Blueprint</motion.span></div>
                    <div className="overflow-hidden"><motion.span initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.42, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block" style={{ color: "rgba(255,255,255,0.18)" }}>Registry.</motion.span></div>
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 mt-8 sm:mt-10">
                    <div className="h-px w-16 bg-white/15 mt-1 shrink-0 hidden sm:block" />
                    <p className="font-sans font-light text-[13px] sm:text-[14px] text-white/35 leading-relaxed tracking-wide max-w-xs">
                      Active integrations, parameter configurations, and live telemetry feeds for every deployed pipeline.
                    </p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.06] pt-5">
                  {[{ val: `${specimens.length}`, label: "Active Blueprints" }, { val: "5", label: "Edge Gateways" }, { val: "99.9%", label: "Uptime" }, { val: "24/7", label: "Telemetry" }].map((item, i) => (
                    <div key={i} className="flex items-baseline gap-1.5">
                      <span className="font-michroma text-[11px] text-white/70">{item.val}</span>
                      <span className="font-michroma text-[8px] tracking-[0.12em] uppercase text-white/20">{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* ── CINEMATIC DIVIDER: SPACE ─── */}
              <ParallaxBanner src="/img-space.png" label="ARKA · Global Edge Network" brightness={0.7} />

              {/* ── SECTION 2: BLUEPRINTS + LOGS ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-space"
              >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">

              {/* Left Column: List of saved specimens (Columns 7) */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                <div className="relative flex flex-col gap-3">
                  <GhostNum n="02" />
                  <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-[10px] font-michroma tracking-[0.2em] uppercase text-white/25">System Registry</motion.span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[2.8rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                    <SplitText text="Blueprints" />
                  </h2>
                  <p className="text-[13px] font-light text-white/40 leading-relaxed max-w-sm tracking-wide">
                    Active integrations, parameter configurations, and live telemetry feeds.
                  </p>
                </div>

                <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
                  {specimens.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center gap-3 liquid-glass rounded-2xl">
                      <BookOpen className="w-8 h-8 text-white/20" />
                      <p className="text-xs text-white/50">No blueprints registered in edge database.</p>
                      <button
                        onClick={() => setCurrentTab("quote")}
                        className="text-xs font-bold text-white underline underline-offset-4"
                      >
                        Book a free strategy call to get started &rarr;
                      </button>
                    </div>
                  ) : (
                    specimens.map((spec) => (
                      <motion.div
                        whileHover={{ y: -3, borderColor: "rgba(255, 255, 255, 0.12)", backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        key={spec.id}
                        onClick={() => {
                          addRegistryLog(`[INSPECT] Inspected blueprint schema properties for: ${spec.name}`);
                        }}
                        className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 cursor-pointer grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-4 items-center relative group transition-colors duration-300"
                      >
                        <img
                          src={spec.imageUrl}
                          alt={spec.name}
                          className="w-full aspect-[4/3] object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-[8px] uppercase tracking-wider font-extrabold">{spec.preset}</span>
                            <span className="text-[9px] font-mono text-white/40">ID: {spec.id}</span>
                          </div>
                          <h4 className="text-sm font-semibold tracking-tight text-white">{spec.name}</h4>
                          <span className="text-[10px] text-white/40 mt-1 leading-normal font-mono">
                            Sync: {spec.symmetry} ports · SLA Index: {spec.complexity}%
                          </span>

                          {/* Quick test parameters */}
                          <div className="flex items-center gap-2 mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                addRegistryLog(`[TRIGGER] Fired mock payload to gateway: '${spec.name}' [Throughput: ${spec.silicaContent} msg/s]`);
                              }}
                              className="px-3 py-2 bg-white/15 hover:bg-white/20 rounded-lg font-michroma text-[9px] tracking-[0.1em] uppercase text-white transition-colors pointer-events-auto cursor-pointer"
                            >
                              Dispatch Ping
                            </motion.button>
                            <span className="font-michroma text-[8px] tracking-[0.08em] uppercase text-white/25 truncate">{spec.lumens}ms</span>
                          </div>
                        </div>

                        {/* Delete absolute button */}
                        <motion.button
                          whileHover={{ scale: 1.1, color: "#ef4444" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeleteSpecimen(spec.id, e)}
                          className="absolute right-3 top-3 p-3 rounded-full hover:bg-white/5 text-white/30 transition-colors cursor-pointer z-10"
                          title="Delete schema"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Simulated Live Logs Console (Columns 5) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="liquid-glass rounded-[2rem] p-6 flex flex-col gap-3 justify-between bg-white/[0.01] h-full h-[400px] md:h-[480px]">
                  
                  <div className="flex items-center justify-between">
                    <span className="font-michroma text-[9px] tracking-[0.18em] uppercase text-white/30">Sys Telemetry Feeds</span>
                    <button
                      onClick={() => {
                        setRegistryLogs([
                          `[SYS] Logger state cleared. Awaiting signals...`
                        ]);
                      }}
                      className="px-3 py-2 font-michroma text-[9px] tracking-[0.1em] uppercase text-white/30 hover:text-white transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Terminal Core logs */}
                  <div className="flex-1 bg-black/60 border border-white/5 rounded-2xl p-4 font-mono text-[10.5px] text-white/80 overflow-y-auto flex flex-col gap-2 text-left custom-scrollbar">
                    {registryLogs.map((log, index) => (
                      <div key={index} className="leading-relaxed whitespace-pre-wrap select-all">
                        {log}
                      </div>
                    ))}
                    <div className="h-2 w-1 bg-white inline-block animate-pulse shrink-0" />
                  </div>

                  <div className="text-[9px] uppercase font-michroma tracking-widest text-white/35">
                    STATE: SECURE EDGE PORT 3000 // ARKA CORE PROTOCOL V2
                  </div>
                </div>
              </div>

              </div>
              </motion.div>

              {/* ── SECTION 3: GLOBAL EDGE STATS ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-hall"
              >
                <div className="flex flex-col gap-3 mb-14">
                  <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Infrastructure</span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">Global Edge Network</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.04]">
                  {[
                    { city: "SFO", region: "West Coast", ping: "42ms", status: "Optimal" },
                    { city: "LDN", region: "Europe", ping: "94ms", status: "Active" },
                    { city: "TKY", region: "Asia Pacific", ping: "135ms", status: "Optimal" },
                    { city: "SGP", region: "Southeast Asia", ping: "188ms", status: "Active" },
                    { city: "FRA", region: "Central Europe", ping: "82ms", status: "Optimal" },
                  ].map((loc, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      onClick={() => addRegistryLog(`[PING] Diagnostic sweep routed through ${loc.city} gateway. Roundtrip: ${loc.ping}`)}
                      className="flex flex-col gap-3 p-6 sm:p-8 glass-card hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer group"
                    >
                      <span className="font-sans font-light text-2xl text-white">{loc.city}</span>
                      <span className="font-michroma text-[9px] tracking-[0.12em] uppercase text-white/30">{loc.region}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/70 transition-colors duration-200" />
                        <span className="font-michroma text-[8px] tracking-[0.1em] uppercase text-white/25">{loc.ping} · {loc.status}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── SECTION 4: CTA ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-end justify-between gap-10 section-with-bg sbg-monolith"
              >
                <div className="flex flex-col gap-4">
                  <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Deploy</span>
                  <p className="font-sans font-light tracking-[-0.01em] uppercase text-white leading-[1.0]" style={{ fontSize: "clamp(2rem, 7vw, 6rem)" }}>
                    Build your<br />first blueprint.
                  </p>
                </div>
                <div className="flex flex-col gap-4 shrink-0">
                  <MagneticButton onClick={() => { setCurrentTab("quote"); addRegistryLog("[NAV] Navigated to booking from registry"); }} className="btn-glow-pulse w-full sm:w-auto px-10 py-5 rounded-full font-michroma text-[9px] tracking-[0.22em] bg-white text-black hover:bg-neutral-100 transition-colors uppercase flex items-center justify-center gap-3">
                    Book Free Strategy Call <ArrowRight className="w-3 h-3" />
                  </MagneticButton>
                  <span className="font-michroma text-[8px] tracking-[0.15em] uppercase text-white/20 text-center">Free call · No commitment</span>
                </div>
              </motion.div>

            </motion.div>
          )}

          {/* PAGE 5: DEDICATED GLOBAL TELEMETRY DOME */}
          {currentTab === "globe" && (
            <motion.div
              key="globe-page"
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6 text-left py-10"
            >
              {/* Mobile-only title (sidebar is hidden on mobile) */}
              <div className="lg:hidden flex flex-col gap-2">
                <span className="text-[10px] font-michroma tracking-[0.2em] uppercase text-white/25">Network</span>
                <h2 className="font-sans font-light text-[2rem] tracking-[0.04em] uppercase text-white leading-[1.05]">Telemetry</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

              {/* Left Sidebar Control Box (Columns 4) — hidden on mobile to avoid duplicate heavy canvas */}
              <div className="hidden lg:flex lg:col-span-4 flex-col gap-8 justify-between">
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-michroma tracking-[0.2em] uppercase text-white/25">Network</span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[2.8rem] tracking-[0.04em] uppercase text-white leading-[1.05]">Telemetry</h2>
                  <p className="text-[13px] font-light text-white/40 leading-relaxed max-w-xs tracking-wide">
                    Global edge network visualization. Click regional gateways to dispatch diagnostic sweeps.
                  </p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] flex flex-col gap-4">
                  <span className="font-michroma text-[9px] tracking-[0.18em] uppercase text-white/30 block">Mesh Tuning Controls</span>
                  <StructureSimulator />
                </div>

                <div className="flex gap-2 font-michroma text-[9px] uppercase tracking-[0.1em] text-white/25">
                  <span>40s / Cycle</span>
                  <span>·</span>
                  <span>15° Pitch</span>
                </div>
              </div>

              {/* Central Large Globe Dome View (Columns 8) */}
              <div className="lg:col-span-8 liquid-glass p-6 md:p-8 rounded-[2.5rem] flex flex-col justify-between items-center relative overflow-hidden min-h-[400px] bg-white/[0.01]">
                
                {/* Floating details heading overlay */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10 select-none">
                  <div className="text-left">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-mono">Live Edge Viewport</span>
                    <h3 className="font-sans font-light text-xl tracking-[0.06em] uppercase text-white/80">Orthographic Core</h3>
                  </div>
                  <div className="text-right text-[10px] font-mono text-white/40">
                    <div>LATENCY GRADE: SLA-A</div>
                    <div>ACTIVE AGENTS: 900+</div>
                  </div>
                </div>

                {/* Big Orbit Globe visual representation in single panel frame */}
                <div className="w-full h-full flex flex-col justify-center items-center py-10 relative">
                  <div className="w-full max-w-lg aspect-square">
                    <StructureSimulator />
                  </div>
                  
                  {/* Regions dashboard panel */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 w-full max-w-2xl bg-black/40 border border-white/5 p-4 rounded-xl text-[10.5px] font-mono">
                    {[
                      { city: "SFO Gateway", ping: "42ms", health: "Optimal" },
                      { city: "LDN Interface", ping: "94ms", health: "Active" },
                      { city: "TKY Core Router", ping: "135ms", health: "Optimal" },
                      { city: "SGP Cloud Link", ping: "188ms", health: "Active" },
                      { city: "FRA Ledger Proxy", ping: "82ms", health: "Optimal" }
                    ].map((loc, idx) => (
                      <div key={idx} className="p-2 bg-white/[0.02] rounded border border-white/5 hover:bg-white/[0.07] hover:border-white/10 hover:scale-[1.03] transition-all duration-200 pointer-events-auto cursor-pointer" onClick={() => {
                        addRegistryLog(`[PING SUCCESS] Routed diagnostic sweep packets through regional ledger ${loc.city}. Roundtrip: ${loc.ping}`);
                      }}>
                        <div className="font-bold text-white/95 truncate">{loc.city.split(" ")[0]}</div>
                        <div className="text-white/40 mt-1">{loc.ping}</div>
                        <div className="text-white/30 text-[8px] uppercase mt-0.5">{loc.health}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full text-center font-michroma text-[9px] text-white/20 uppercase tracking-[0.15em]">
                  Click any regional gate block above to dispatch diagnostic sweep packets
                </div>

              </div>

              </div>{/* end inner grid */}

            </motion.div>
          )}

          {/* PAGE 6: CONTACT / QUOTE */}
          {currentTab === "quote" && (
            <motion.div
              key="quote-page"
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col pb-24"
            >

              {/* ── SECTION 1: HERO ─── */}
              <div className="relative flex flex-col justify-center min-h-[calc(100dvh-80px)] py-16 overflow-hidden">
                <GhostNum n="06" />
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4 mb-12">
                  <div className="h-px w-6 bg-white/20" />
                  <span className="font-michroma text-[9px] tracking-[0.3em] text-white/30 uppercase">ARKA · Contact</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                  <h1 className="font-sans font-light tracking-[-0.01em] uppercase select-none overflow-hidden" style={{ fontSize: "clamp(3rem, 10vw, 9.5rem)", lineHeight: 0.9 }}>
                    <div className="overflow-hidden"><motion.span initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="text-white block">Let's</motion.span></div>
                    <div className="overflow-hidden"><motion.span initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.42, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block" style={{ color: "rgba(255,255,255,0.18)" }}>Build.</motion.span></div>
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 mt-8 sm:mt-10">
                    <div className="h-px w-16 bg-white/15 mt-1 shrink-0 hidden sm:block" />
                    <p className="font-sans font-light text-[13px] sm:text-[14px] text-white/35 leading-relaxed tracking-wide max-w-xs">
                      Tell us what you're working on. We'll scope it, quote it, and have it live in under two weeks.
                    </p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.06] pt-5">
                  {[{ val: "Free", label: "Strategy Call" }, { val: "24h", label: "Response Time" }, { val: "5–10d", label: "To Go Live" }, { val: "Zero", label: "Lock-in" }].map((item, i) => (
                    <div key={i} className="flex items-baseline gap-1.5">
                      <span className="font-michroma text-[11px] text-white/70">{item.val}</span>
                      <span className="font-michroma text-[8px] tracking-[0.12em] uppercase text-white/20">{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* ── SECTION 2: CONTACT FORM ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-space"
              >
              <div className="relative flex flex-col gap-3 mb-10">
                <GhostNum n="02" />
                <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Get in Touch</motion.span>
                <h2 className="font-sans font-light text-[2rem] md:text-[2.8rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                  <SplitText text="Tell us what you need." />
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">

              {/* Left Column — Contact Form (Columns 7) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex flex-col gap-6 p-6 sm:p-8 bg-white/[0.01] border border-white/5 rounded-[2rem]">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-michroma text-[9px] tracking-[0.18em] uppercase text-white/35">Your Name</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full px-4 py-3.5 bg-white/[0.03] focus:bg-white/[0.06] rounded-xl outline-none font-michroma text-[10px] sm:text-[10px] tracking-[0.05em] text-white border border-white/5 focus:border-white/15 transition-colors"
                        style={{ fontSize: "max(16px, 10px)" }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-michroma text-[9px] tracking-[0.18em] uppercase text-white/35">Business Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="jane@company.com"
                        className="w-full px-4 py-3.5 bg-white/[0.03] focus:bg-white/[0.06] rounded-xl outline-none font-michroma text-[10px] tracking-[0.05em] text-white border border-white/5 focus:border-white/15 transition-colors"
                        style={{ fontSize: "max(16px, 10px)" }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-michroma text-[9px] tracking-[0.18em] uppercase text-white/35">What do you need? (select all that apply)</label>
                    <div className="flex flex-wrap gap-2">
                      {["AI Automation", "Web Design & Dev", "AI Lead Generation", "Marketing Automation", "AI App Development", "Video Production", "Cybersecurity / IT"].map((svc) => (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => toggleContactService(svc)}
                          className={`px-3.5 py-2.5 rounded-full font-michroma text-[9px] tracking-[0.08em] uppercase transition-all border cursor-pointer ${
                            contactService.includes(svc)
                              ? "bg-white/15 text-white border-white/25"
                              : "bg-white/[0.01] border-white/5 text-white/30 hover:text-white/50 hover:bg-white/[0.04]"
                          }`}
                        >
                          {contactService.includes(svc) ? "✓ " : ""}{svc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-michroma text-[9px] tracking-[0.18em] uppercase text-white/35">Tell us about your project</label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="What are you trying to automate or build? What’s the biggest bottleneck right now?"
                      rows={4}
                      className="w-full px-4 py-3.5 bg-white/[0.03] focus:bg-white/[0.06] rounded-xl outline-none font-michroma text-[10px] tracking-[0.05em] text-white border border-white/5 focus:border-white/15 transition-colors resize-none"
                      style={{ fontSize: "max(16px, 10px)" }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      if (!contactName || !contactEmail) return;
                      setIsContactSubmitted(true);
                      addRegistryLog(`[CONTACT] Strategy call request submitted from: ${contactEmail}`);
                    }}
                    disabled={!contactName || !contactEmail}
                    className="w-full py-4 bg-white text-black font-michroma text-[10px] tracking-[0.2em] uppercase rounded-xl hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Request Free Strategy Call <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                <span className="font-michroma text-[8px] tracking-[0.15em] uppercase text-white/20">
                  We respond within 24 hours. No commitment required.
                </span>
              </div>

              {/* Right Column — Trust & Next Steps (Columns 5) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {!isContactSubmitted ? (
                    <motion.div
                      key="contact-idle"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="liquid-glass rounded-[2rem] p-6 lg:p-8 flex flex-col gap-8 bg-white/[0.01] h-full border border-white/5"
                    >
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-michroma tracking-[0.2em] uppercase text-white/25">What happens next</span>
                        <h3 className="font-sans font-light text-xl tracking-[0.06em] uppercase text-white/80">3 Steps to Live</h3>
                      </div>

                      <div className="flex flex-col gap-0 border-t border-white/[0.06]">
                        {[
                          { step: "01", title: "We reach out within 24h", desc: "A quick confirmation email, then we book your free 30-minute strategy call at a time that works for you." },
                          { step: "02", title: "30-min strategy call", desc: "We map your workflows, identify quick wins, and scope the build. No upsell. Just a clear plan." },
                          { step: "03", title: "System live in 5–10 days", desc: "We build and deploy. You get daily updates. Most clients see ROI before the first 30 days are up." },
                        ].map((item, i) => (
                          <div key={i} className="flex gap-5 py-5 border-b border-white/[0.06]">
                            <span className="font-michroma text-[9px] tracking-widest text-white/20 pt-0.5 shrink-0">{item.step}</span>
                            <div className="flex flex-col gap-1">
                              <span className="font-michroma text-[9px] tracking-[0.08em] uppercase text-white/55">{item.title}</span>
                              <p className="text-[11px] text-white/25 font-light leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { val: "Free", label: "Strategy Call" },
                          { val: "24h", label: "Response Time" },
                          { val: "5–10d", label: "To Go Live" },
                          { val: "Zero", label: "Lock-in" },
                        ].map((item, i) => (
                          <div key={i} className="flex flex-col gap-0.5 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                            <span className="font-michroma text-[13px] text-white/75">{item.val}</span>
                            <span className="font-michroma text-[7.5px] tracking-[0.12em] uppercase text-white/20">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="contact-submitted"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="liquid-glass rounded-[2rem] p-6 lg:p-8 flex flex-col items-center justify-center text-center gap-6 bg-white/[0.01] border border-white/5 h-full min-h-[440px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-white/70" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-sans font-light text-2xl tracking-[0.06em] uppercase text-white/80">Request Received</h3>
                        <p className="font-michroma text-[9px] tracking-[0.08em] text-white/35 max-w-xs leading-relaxed">
                          We’ll reach out to {contactEmail} within 24 hours to book your free strategy call.
                        </p>
                      </div>
                      <div className="w-full p-4 bg-black/40 rounded-2xl border border-white/5 text-left flex flex-col gap-2">
                        <span className="font-michroma text-[8px] tracking-[0.15em] uppercase text-white/25 block mb-1">What to expect</span>
                        {["Confirmation email shortly", "Strategy call booked within 48h", "Custom proposal delivered after call", "System live within 5–10 days"].map((line, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
                            <span className="font-michroma text-[8px] tracking-[0.05em] text-white/45">{line}</span>
                          </div>
                        ))}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setIsContactSubmitted(false); setContactName(""); setContactEmail(""); setContactService([]); setContactMessage(""); }}
                        className="font-michroma text-[8px] tracking-[0.15em] uppercase text-white/25 hover:text-white/50 transition-colors cursor-pointer"
                      >
                        Submit another request
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              </div>
              </motion.div>

              {/* ── CINEMATIC DIVIDER: HALL ─── */}
              <ParallaxBanner src="/img-hall.png" label="ARKA · The Gateway" brightness={0.55} />

              {/* ── SECTION 3: FAQ ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-section"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                  <div className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24 relative">
                    <GhostNum n="03" />
                    <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">FAQ</motion.span>
                    <h2 className="font-sans font-light text-[2rem] md:text-[2.8rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                      <SplitText text="Common Questions" />
                    </h2>
                    <p className="text-[13px] font-light text-white/35 leading-relaxed tracking-wide">
                      Straight answers. No filler.
                    </p>
                  </div>
                  <div className="lg:col-span-8 flex flex-col gap-0 border-t border-white/[0.06]">
                    {[
                      { q: "How fast can you actually deliver?", a: "Most systems go live in 5–10 business days from signed contract. Complex multi-integration builds can take up to 2 weeks. You get daily progress updates throughout." },
                      { q: "Do I need technical knowledge to work with you?", a: "No. You explain what you need in plain terms — the bottlenecks, the manual work, the goals. I handle everything technical." },
                      { q: "What happens if the system breaks after delivery?", a: "All active retainer clients get priority support with guaranteed response times based on their SLA tier. Issues are resolved — not handed off." },
                      { q: "Can I cancel at any time?", a: "Yes. Every engagement is month-to-month. If the system stops working for your business, you cancel. No lock-in, no penalty clauses." },
                      { q: "Who owns the systems you build?", a: "You do. The code, the workflows, the integrations — all transferred to you. ARKA doesn't retain IP on client-specific builds." },
                      { q: "Do you work with companies outside North America?", a: "Yes. We work remotely across time zones. Primary clients are in the US and Canada, but international engagements are common." },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex gap-6 sm:gap-10 py-7 border-b border-white/[0.06] group step-row"
                      >
                        <div className="flex flex-col gap-2 flex-1">
                          <h3 className="font-sans font-light text-base sm:text-lg tracking-[0.03em] uppercase text-white/80 group-hover:text-white transition-colors duration-200">{item.q}</h3>
                          <p className="text-[13px] text-white/35 font-light leading-relaxed tracking-wide">{item.a}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── SECTION 4: OTHER WAYS TO REACH US ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-hall"
              >
                <div className="relative flex flex-col gap-3 mb-14">
                  <GhostNum n="04" />
                  <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Direct Contact</motion.span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
                    <SplitText text="Reach Out Directly" />
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.04]">
                  {[
                    { method: "Email", value: "hello@arka.systems", desc: "For detailed project briefs or partnership inquiries. Responds within 24 hours." },
                    { method: "LinkedIn", value: "ARKA Systems", desc: "Connect for quick questions, company updates, and case study walkthroughs." },
                    { method: "Strategy Call", value: "Book Free Call →", desc: "30 minutes. We map out your highest-ROI automation and scope the build.", action: true },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      onClick={item.action ? () => { const el = document.querySelector("#quote-builder"); el?.scrollIntoView({ behavior: "smooth" }); } : undefined}
                      className={`flex flex-col gap-3 p-6 sm:p-8 glass-card group glow-border ${item.action ? "cursor-pointer" : ""}`}
                    >
                      <span className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/25">{item.method}</span>
                      <span className="font-sans font-light text-xl text-white/80 group-hover:text-white transition-colors duration-200">{item.value}</span>
                      <p className="text-[12px] text-white/30 font-light leading-relaxed tracking-wide">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── SECTION 5: FINAL CTA ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-end justify-between gap-10 section-with-bg sbg-monolith"
              >
                <div className="flex flex-col gap-4">
                  <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Start Now</span>
                  <p className="font-sans font-light tracking-[-0.01em] uppercase text-white leading-[1.0]" style={{ fontSize: "clamp(2rem, 7vw, 6rem)" }}>
                    30 minutes.<br />Then we build.
                  </p>
                </div>
                <div className="flex flex-col gap-4 shrink-0">
                  <MagneticButton onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-glow-pulse w-full sm:w-auto px-10 py-5 rounded-full font-michroma text-[9px] tracking-[0.22em] bg-white text-black hover:bg-neutral-100 transition-colors uppercase flex items-center justify-center gap-3">
                    Start Your Project <ArrowRight className="w-3 h-3" />
                  </MagneticButton>
                  <span className="font-michroma text-[8px] tracking-[0.15em] uppercase text-white/20 text-center">Free call · No commitment · Results in 30 days</span>
                </div>
              </motion.div>

            </motion.div>
          )}

          {currentTab === "pingscan" && (
            <motion.div
              key="pingscan-page"
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col pb-24"
            >
              {/* ── SECTION 1: HERO ─── */}
              <div className="relative flex flex-col justify-center min-h-[calc(100dvh-80px)] py-16 overflow-hidden">
                <GhostNum n="05" />
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4 mb-12">
                  <div className="h-px w-6 bg-white/20" />
                  <span className="font-michroma text-[9px] tracking-[0.3em] text-white/30 uppercase">ARKA · Diagnostics</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                  <h1 className="font-sans font-light tracking-[-0.01em] uppercase select-none overflow-hidden" style={{ fontSize: "clamp(3rem, 10vw, 9.5rem)", lineHeight: 0.9 }}>
                    <div className="overflow-hidden"><motion.span initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="text-white block">Network</motion.span></div>
                    <div className="overflow-hidden"><motion.span initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.42, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block" style={{ color: "rgba(255,255,255,0.18)" }}>Scanner.</motion.span></div>
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 mt-8 sm:mt-10">
                    <div className="h-px w-16 bg-white/15 mt-1 shrink-0 hidden sm:block" />
                    <p className="font-sans font-light text-[13px] sm:text-[14px] text-white/35 leading-relaxed tracking-wide max-w-xs">
                      Real-time network diagnostics and edge gateway latency analysis across global ARKA infrastructure.
                    </p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.06] pt-5">
                  {[{ val: "5", label: "Edge Gateways" }, { val: "<100ms", label: "Avg Latency" }, { val: "Live", label: "Diagnostics" }, { val: "ISO-27001", label: "Encrypted" }].map((item, i) => (
                    <div key={i} className="flex items-baseline gap-1.5">
                      <span className="font-michroma text-[11px] text-white/70">{item.val}</span>
                      <span className="font-michroma text-[8px] tracking-[0.12em] uppercase text-white/20">{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* ── SECTION 2: SCANNER ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-concrete"
              >
                <div className="flex flex-col gap-3 mb-10">
                  <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Live Tool</span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[2.8rem] tracking-[0.04em] uppercase text-white leading-[1.05]">Ping Scanner</h2>
                </div>
                <PingScanner theme={theme} addLog={addRegistryLog} />
              </motion.div>

              {/* ── SECTION 3: WHAT IT TESTS ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] section-with-bg sbg-hall"
              >
                <div className="flex flex-col gap-3 mb-12">
                  <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Diagnostics</span>
                  <h2 className="font-sans font-light text-[2rem] md:text-[3rem] tracking-[0.04em] uppercase text-white leading-[1.05]">What Gets Tested</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
                  {[
                    { num: "01", name: "Latency Analysis", desc: "Round-trip time measured from your connection to each regional edge gateway. Identifies bottlenecks across the global mesh." },
                    { num: "02", name: "Gateway Health", desc: "Status checks across all five ARKA edge nodes — SFO, LDN, TKY, SGP, and FRA — with real-time health grades." },
                    { num: "03", name: "Route Diagnostics", desc: "Trace the network path your data takes to reach each endpoint. Useful for optimising delivery and reducing latency." },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col gap-4 p-6 sm:p-8 glass-card group hover:bg-white/[0.06]! transition-colors duration-200"
                    >
                      <span className="font-michroma text-[9px] tracking-widest text-white/20">{s.num}</span>
                      <h3 className="font-sans font-light text-xl tracking-[0.04em] uppercase text-white/80 group-hover:text-white transition-colors duration-200">{s.name}</h3>
                      <p className="text-[12px] text-white/30 font-light leading-relaxed tracking-wide group-hover:text-white/45 transition-colors duration-200">{s.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── SECTION 4: CTA ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="py-20 sm:py-28 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-end justify-between gap-10 section-with-bg sbg-space"
              >
                <div className="flex flex-col gap-4">
                  <span className="font-michroma text-[9px] tracking-[0.25em] uppercase text-white/25">Integrate</span>
                  <p className="font-sans font-light tracking-[-0.01em] uppercase text-white leading-[1.0]" style={{ fontSize: "clamp(2rem, 7vw, 6rem)" }}>
                    Need custom<br />monitoring?
                  </p>
                </div>
                <div className="flex flex-col gap-4 shrink-0">
                  <MagneticButton onClick={() => { setCurrentTab("quote"); addRegistryLog("[NAV] Navigated to contact from scanner"); }} className="btn-glow-pulse w-full sm:w-auto px-10 py-5 rounded-full font-michroma text-[9px] tracking-[0.22em] bg-white text-black hover:bg-neutral-100 transition-colors uppercase flex items-center justify-center gap-3">
                    Talk to Us <ArrowRight className="w-3 h-3" />
                  </MagneticButton>
                  <span className="font-michroma text-[8px] tracking-[0.15em] uppercase text-white/20 text-center">Custom telemetry dashboards available</span>
                </div>
              </motion.div>

            </motion.div>
          )}

          {currentTab === "design" && (
            <motion.div
              key="design-page"
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <ROICalculator theme={theme} addLog={addRegistryLog} onBookCall={() => setCurrentTab("quote")} />
            </motion.div>
          )}

        </AnimatePresence>
        </motion.div>
      </main>

      {/* ================= GLOBAL SUB-COMPONENTS/MODALS/FOOTERS ================= */}

      {/* Footer */}
      <footer className="w-full py-6 px-4 md:px-12 border-t border-white/[0.04] relative z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-michroma tracking-[0.2em] uppercase text-white/20">ARKA · SYSTEMS GLOBAL · 2026</span>
          <div className="flex items-center gap-1">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-3 text-white/20 hover:text-white/60 hover:scale-110 transition-all duration-200"><Twitter className="w-4 h-4" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-3 text-white/20 hover:text-white/60 hover:scale-110 transition-all duration-200"><Linkedin className="w-4 h-4" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-3 text-white/20 hover:text-white/60 hover:scale-110 transition-all duration-200"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>

      {/* 1. Traditional Floating AI Lab popup (Keep as secondary accessibility access) */}
      <AILab
        isOpen={isLabOpen}
        onClose={() => setIsLabOpen(false)}
        onAddSpecimen={handleAddSpecimen}
      />

      {/* 2. Systems Blueprints Drawers Overlay */}
      <AnimatePresence>
        {isArchiveOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setIsArchiveOpen(false)} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-50 w-full max-w-md h-full liquid-glass-strong border-l border-white/5 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-white/70" />
                    <h3 className="font-sans font-medium text-lg text-white">ARKA Blueprints Drawer</h3>
                  </div>
                  <button
                    onClick={() => setIsArchiveOpen(false)}
                    className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1">
                  {specimens.map((spec) => (
                    <div
                      key={spec.id}
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all grid grid-cols-[80px_1fr] gap-3 items-center relative group text-left"
                    >
                      <img src={spec.imageUrl} alt={spec.name} className="w-20 h-14 object-cover rounded-md filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono block">{spec.preset} framework</span>
                        <span className="text-xs font-semibold text-white/90 truncate leading-tight mt-0.5 block">{spec.name}</span>
                        <span className="text-[10px] text-white/50 font-mono mt-1 leading-none block">Latency: {spec.lumens}ms</span>
                      </div>

                      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDeleteSpecimen(spec.id, e)}
                          className="p-1 text-white/40 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    setIsArchiveOpen(false);
                    setCurrentTab("quote");
                  }}
                  className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Book a strategy call
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Community Info Onboarding Overlay */}
      <AnimatePresence>
        {isCommunityOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-[2rem] liquid-glass-strong text-white text-center flex flex-col items-center gap-5 relative z-50 border border-white/10"
            >
              <button
                onClick={() => {
                  setIsCommunityOpen(false);
                  setIsEmailSubmitted(false);
                }}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>

              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white mt-2 animate-pulse">
                <Globe className="w-5 h-5 text-white/40" />
              </div>

              <AnimatePresence mode="wait">
                {!isEmailSubmitted ? (
                  <motion.div
                    key="pre-signup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full flex flex-col items-center gap-4"
                  >
                    <div>
                      <h3 className="font-sans font-medium text-lg leading-none">Register for ARKA SLA Core</h3>
                      <p className="text-xs text-white/50 mt-1.5 max-w-[280px] mx-auto">
                        Acquire secure API integration tokens, deploy cloud chatbots, and configure custom notification webhooks with modern developers.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full bg-white/[0.02] p-4 rounded-xl text-left border border-white/5">
                      <div>
                        <span className="text-[10px] block text-white/30 lowercase font-mono">systems.active</span>
                        <span className="text-sm font-semibold font-mono text-white/90">24,198</span>
                      </div>
                      <div>
                        <span className="text-[10px] block text-white/30 lowercase font-mono">workflows.launched</span>
                        <span className="text-sm font-semibold font-mono text-white/90">242,109</span>
                      </div>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                      <input
                        type="email"
                        placeholder="Enter corporate email to secure token"
                        className="w-full px-4 py-2.5 bg-white/[0.04] rounded-xl outline-none focus:bg-white/10 transition-colors text-xs text-center border-none text-white/90"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsEmailSubmitted(true);
                          addRegistryLog("[ONBOARD] Registered interest for company client API access key.");
                        }}
                        className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
                      >
                        Request access token
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="post-signup"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex flex-col items-center gap-4 py-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-bounce">
                      <ShieldCheck className="w-5 h-5 text-white/50" />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-michroma tracking-widest text-white/50 font-bold">ONBOARDING TRANSMITTAL INITIALISED</h4>
                      <h3 className="font-sans text-xl mt-1 text-white">Direct Verification SLA</h3>
                      <p className="text-xs text-white/50 mt-1.5 max-w-[290px] mx-auto leading-relaxed">
                        Secure endpoint generated! Our corporate technical team is routing your specific token and custom setup files to your designated email inbox. Expected delivery is within 2 hours.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsCommunityOpen(false);
                        setIsEmailSubmitted(false);
                      }}
                      className="mt-2 px-6 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Close Window
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Navigation Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 flex flex-col gap-8 text-white relative z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-michroma tracking-[0.2em] uppercase text-white/25">Navigation</span>
                <button onClick={() => setIsMenuOpen(false)} className="w-11 h-11 flex items-center justify-center text-white/25 hover:text-white/60 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col">
                {[
                  { name: "Home", action: () => setCurrentTab("overview") },
                  { name: "Services", action: () => setCurrentTab("solutions") },
                  { name: "Work", action: () => setCurrentTab("lab") },
                  { name: "Registry", action: () => setCurrentTab("registry") },
                  { name: "Telemetry", action: () => setCurrentTab("globe") },
                  { name: "Scanner", action: () => setCurrentTab("pingscan") },
                  { name: "ROI Calc", action: () => setCurrentTab("design") },
                  { name: "Contact", action: () => setCurrentTab("quote") }
                ].map((route, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.045, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => { route.action(); setIsMenuOpen(false); }}
                    className="py-4 text-left text-[12px] font-michroma tracking-[0.12em] uppercase text-white/40 hover:text-white active:text-white transition-colors duration-200 cursor-pointer border-b border-white/[0.04] last:border-0"
                  >
                    {route.name}
                  </motion.button>
                ))}
              </nav>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[9px] font-michroma tracking-[0.18em] uppercase text-white/20">ARKA · 2026</span>
                <button
                  onClick={() => {
                    setIsPortalEntered(false);
                    localStorage.setItem("arka_portal_entered", "false");
                    setIsMenuOpen(false);
                  }}
                  className="py-3 px-2 text-[10px] font-michroma tracking-[0.12em] uppercase text-white/20 hover:text-white/50 transition-colors cursor-pointer"
                >
                  Exit Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      )}

    </div>
  );
}
