import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
import { PingScanner } from "./components/PingScanner";
import { TravelDimensionWarp } from "./components/TravelDimensionWarp";
import { WebDesignStudio } from "./components/WebDesignStudio";
import { Specimen, AutomationPreset, GlowVariant } from "./types";

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

  // Agreement Quote Builder / SLA Form State
  const [estimateVolume, setEstimateVolume] = useState<number>(250); // in thousands
  const [slaTier, setSlaTier] = useState<"standard" | "gold" | "defence">("gold");
  const [connectors, setConnectors] = useState({
    stripe: true,
    crm: true,
    shopify: false,
    gmail: true,
    database: false
  });
  const [isQuoteLocked, setIsQuoteLocked] = useState(false);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [theme, setTheme] = useState<"black" | "slate" | "summit">(() => {
    const saved = localStorage.getItem("arka_theme");
    return (saved === "slate" || saved === "black" || saved === "summit") ? saved as any : "black";
  });

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

  // Track cursor spotlight + scroll parallax.
  // On touch / small screens we skip continuous tracking entirely so the
  // page scrolls natively at 60fps (no per-frame React re-renders). On
  // desktop the handlers are rAF-throttled to at most one update per frame.
  useEffect(() => {
    const lowPower =
      window.matchMedia("(hover: none), (pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;

    if (lowPower) {
      // Center the spotlight once and do nothing else — buttery scrolling.
      document.documentElement.style.setProperty("--x-mouse", "50%");
      document.documentElement.style.setProperty("--y-mouse", "50%");
      return;
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
        botResponse = "Custom ARKA automation microservices start at $950/mo. Access our Strategic Quote Builder in the main navbar for a precise ROI calculation!";
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

  // Calculate pricing estimates based on SLA inputs
  const calculatedPrice = () => {
    let base = 500;
    // Volume multiplier
    base += (estimateVolume / 10) * 12;
    // SLA Tiers
    if (slaTier === "gold") base += 450;
    if (slaTier === "defence") base += 1200;
    // Connectors Count
    const selectedCount = Object.values(connectors).filter(Boolean).length;
    base += selectedCount * 80;

    return Math.round(base);
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
                      className="w-full mt-1 py-2.5 px-6 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer active:scale-98"
                    >
                      INITIALISE SECURE ENTRY
                    </button>
                  </div>
                ) : (
                  <div className="w-full py-4 flex flex-col justify-center">
                    {/* Custom sleek progress bar, pure white with high-contrast ambient halo, zero secondary text */}
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                        style={{ width: `${portalProgress}%` }}
                        transition={{ ease: "easeInOut" }}
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
                className="mt-5 text-[8.5px] sm:text-[10px] font-mono tracking-wider uppercase text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                skip secure handshake &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isPortalEntered && (
        <>
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
                  ? "scale(1.08)" 
                  : `scale(1.06) translateY(${scrollY * -0.06}px)`,
                opacity: isWarping ? 0.75 : 1.0,
                filter: isWarping 
                  ? "grayscale(100%) contrast(245%) brightness(95%) blur(5px)" 
                  : "grayscale(100%) contrast(245%) brightness(82%) blur(0px)",
                transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            />
          </div>
        ) : (
          <>
            {/* Mobile: reliable static gradient backdrop. Autoplay video is
                paused by iOS Safari in Low Power Mode and is GPU-heavy, so
                phones get a clean themed gradient instead. */}
            <div
              className={`md:hidden absolute inset-0 w-full h-full ${
                theme === "slate"
                  ? "bg-[radial-gradient(125%_90%_at_50%_0%,#1b2742_0%,#0b0f19_45%,#05070d_100%)]"
                  : "bg-[radial-gradient(125%_90%_at_50%_0%,#171327_0%,#0a0812_45%,#040308_100%)]"
              }`}
            />
            {/* Desktop: cinematic video */}
            <video
              id="bloom_video_bg"
              autoPlay
              loop
              muted
              playsInline
              style={{ objectFit: "cover" }}
              className={`hidden md:block absolute inset-0 w-full h-full object-cover pointer-events-none filter transition-all duration-1000 ${
                isWarping ? "scale-105 blur-[6px]" : "scale-102"
              } ${
                theme === "slate"
                  ? "saturate-[0.8] brightness-[0.6] contrast-125"
                  : "saturate-50 brightness-70 contrast-115"
              }`}
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
                type="video/mp4"
              />
            </video>
          </>
        )}
        {/* Apple iOS high dynamic physical shading mask overlay - lighter in summit mode to expose detail */}
        <div className={`absolute inset-0 transition-all duration-700 ${theme === "slate" ? "bg-slate-950/35" : theme === "summit" ? "bg-black/15" : "bg-black/25"}`} />
        <div className="absolute inset-0 apple-cinematic-vignette opacity-[0.75] transition-all duration-700" />
      </div>

      {/* Floating Ambient Glow particles */}
      <div className={`fixed top-[15%] left-1/4 w-[400px] h-[400px] rounded-full transition-all duration-1000 blur-[140px] pointer-events-none z-0 ${theme === "slate" ? "bg-blue-600/18" : theme === "summit" ? "bg-zinc-800/10" : "bg-indigo-500/12"}`} />
      <div className={`fixed bottom-[15%] right-1/4 w-[400px] h-[400px] rounded-full transition-all duration-1000 blur-[140px] pointer-events-none z-0 ${theme === "slate" ? "bg-indigo-600/18" : theme === "summit" ? "bg-white/[0.02]" : "bg-cyan-500/12"}`} />

      {/* ================= STICKY COHESIVE HEADER NAVIGATION ================= */}
      <header className="sticky top-0 z-40 w-full px-4 py-3 md:px-12 md:py-4 border-b border-transparent bg-transparent transition-all duration-500 overflow-hidden">
        {/* Dynamic spot lighting glare layer following mouse cursor or finger touch */}
        <div className="absolute inset-0 apple-spotlight-bg opacity-35 z-0 pointer-events-none" />
        
        {/* Dynamic scroll-velocity shimmer reflection sweep */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[300%] h-full pointer-events-none transition-transform duration-300 ease-out z-0"
          style={{
            transform: `translateX(calc(-50% + ${(scrollY % 500) * 1.2}px))`
          }}
        />

        {/* Dynamic scrolling specular spark particles simulating physical Apple-style crystal reflection */}
        <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden pointer-events-none z-0">
          {[...Array(8)].map((_, i) => {
            const xOffset = (i * 12.5) + 6;
            const scrollFactor = (scrollY * (0.2 + i * 0.1)) % 70;
            return (
              <div 
                key={i}
                className="absolute w-[1.2px] h-[1.2px] rounded-full bg-white/70 transition-all duration-150 ease-out"
                style={{
                  left: `${xOffset}%`,
                  top: `${15 + (scrollFactor % 40)}px`,
                  opacity: Math.max(0, Math.sin((scrollY + i * 40) * 0.04)) * 0.4,
                  transform: `scale(${1 + Math.sin(scrollY * 0.06) * 0.6})`,
                  boxShadow: "0 0 4px rgba(255, 255, 255, 0.4)",
                  filter: "blur(0.2px)"
                }}
              />
            );
          })}
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          
          {/* Logo & Platform Status Tag */}
          <div className="flex items-center gap-3 md:gap-4.5 group cursor-pointer" onClick={() => { setCurrentTab("overview"); addRegistryLog("[NAV] Navigated to home via Logo click"); }}>
            <Logo className="w-10 h-10 md:w-14 md:h-14 text-white filter drop-shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-all duration-500 group-hover:scale-105" />
            <div className="flex flex-col text-left">
              <span className="font-sans font-black text-lg md:text-2xl tracking-[0.18em] text-white uppercase leading-none transition-colors group-hover:text-neutral-100">ARKA</span>
              <span className="text-[9px] md:text-[10px] text-white/40 lowercase tracking-[0.1em] font-mono mt-0.5 md:mt-1">systems.global</span>
            </div>
          </div>

          {/* Desktop Tab Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-1.5 border p-1 rounded-full relative transition-all duration-500 ${
            theme === "slate"
              ? "bg-slate-950/40 border-blue-500/10"
              : "bg-white/[0.03] border-white/[0.05]"
          }`}>
            {[
              { id: "overview", label: "Overview" },
              { id: "solutions", label: "Solutions" },
              { id: "design", label: "Web Design" },
              { id: "lab", label: "Lab" },
              { id: "registry", label: "Registry" },
              { id: "globe", label: "Telemetry" },
              { id: "pingscan", label: "Scanner" },
              { id: "quote", label: "Quote" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id as any);
                  addRegistryLog(`[NAV] Navigated to page: ${tab.label}`);
                }}
                className="relative px-5 py-2 rounded-full text-xs transition-all duration-300 tracking-wide font-semibold focus:outline-none"
              >
                <span className={`relative z-10 transition-colors duration-300 ${
                  currentTab === tab.id
                    ? (theme === "slate" ? "text-blue-950 font-extrabold" : "text-black")
                    : "text-white/60 hover:text-white"
                }`}>
                  {tab.label}
                </span>
                {currentTab === tab.id && (
                  <motion.div
                    layoutId="active_tab_hologram"
                    className={`absolute inset-0 rounded-full z-0 transition-colors duration-500 ${
                      theme === "slate" ? "bg-cyan-200" : "bg-white"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Aesthetic Theme Switcher Pin */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-all duration-500 flex items-center justify-center cursor-pointer ${
                theme === "slate"
                  ? "bg-slate-900 border-blue-500/30 text-blue-400 hover:bg-slate-850"
                  : theme === "summit"
                    ? "bg-[#18181b] border-zinc-700 text-zinc-100 hover:bg-zinc-850"
                    : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white"
              }`}
              title={
                theme === "slate"
                  ? "Switch to Cinematic Summit Theme"
                  : theme === "summit"
                    ? "Switch to Deep Black Theme"
                    : "Switch to Charcoal Slate Theme"
              }
            >
              {theme === "slate" ? (
                <Sun className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-300 animate-[spin_8s_linear_infinite]" />
              ) : theme === "summit" ? (
                <Mountain className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-200" />
              ) : (
                <Moon className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-200" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              id="btn_nav_menu"
              onClick={() => setIsMenuOpen(true)}
              className="px-5 py-2.5 md:px-6 md:py-3 rounded-full text-xs font-semibold uppercase tracking-widest text-white border border-white/10 hover:bg-white/5 bg-transparent transition-all cursor-pointer interactive"
            >
              Console Menu
            </motion.button>
          </div>
        </div>
      </header>

      {/* ================= PRIMARY CONTENT AREA WITH MOTION SWITCHER ================= */}
      <main 
        id="main_viewport" 
        className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-3.5 sm:py-6 md:py-8 min-h-[calc(100dvh-72px)] sm:min-h-[calc(100vh-100px)] flex flex-col justify-between transition-all duration-700 w-full"
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
        
        <AnimatePresence mode="wait">
          
          {/* PAGE 1: OVERVIEW / HOMEPAGE */}
          {currentTab === "overview" && (
            <motion.div
              key="overview-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-10 md:py-16"
            >
              {/* Left Column: Visionary copy and CTA buttons */}
              <div className="lg:col-span-6 flex flex-col text-left gap-8 pr-0 lg:pr-8">
                
                {/* Visionary title */}

                <h1 className="font-sans font-medium text-4xl sm:text-5xl lg:text-[4.2rem] tracking-[-0.04em] leading-[1.02] text-white">
                  Automate systems. <br />
                  <span className="font-sans text-white/80 font-normal">Build with ARKA.</span>
                </h1>

                <p className="text-sm md:text-base font-sans font-light text-white/50 leading-relaxed max-w-xl">
                  We architect tailored conversational chatbots, orchestrate deep API workflow automations, and craft high-end immersive web designs to help companies scale with absolute precision.
                </p>

                {/* Quiet layout spacer */}
                <div className="pt-2" />

                {/* Call To Actions */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setCurrentTab("lab");
                      addRegistryLog("[NAV] Navigated to lab workbench");
                    }}
                    className="px-8 py-4.5 rounded-full text-xs font-bold tracking-widest bg-white text-black hover:bg-neutral-100 transition-all uppercase flex items-center gap-3 shadow-xl cursor-pointer interactive"
                  >
                    Open Workstation
                    <ArrowRight className="w-4 h-4 text-black" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, bg: "rgba(255,255,255,0.06)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentTab("solutions");
                      addRegistryLog("[NAV] Navigated to solutions matrix");
                    }}
                    className="px-6 py-4 rounded-full text-xs font-semibold text-white/80 border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Explore Matrix &rarr;
                  </motion.button>
                </div>
              </div>

              {/* Right Column: Globe showcased with beautiful, free-floating transparency (Scroll Parallax Dynamic Depth) */}
              <div 
                className="lg:col-span-6 flex flex-col items-center justify-center relative transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${Math.min(30, Math.max(-30, scrollY * -0.05))}px)`, willChange: "transform" }}
              >
                <div className="w-full max-w-lg aspect-square rounded-[3rem] relative flex items-center justify-center p-4">
                  
                  {/* Subtle decorative glow ring behind globe only */}
                  <div className="absolute inset-0 rounded-full border border-white/[0.02] bg-white/[0.01] pointer-events-none" />

                  <div className="w-full h-full flex items-center justify-center scale-95 md:scale-100">
                    <StructureSimulator />
                  </div>

                  <button
                    onClick={() => setCurrentTab("globe")}
                    className="absolute bottom-6 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-mono tracking-widest uppercase text-white/50 flex items-center gap-2 transition-all interactive"
                  >
                    <Globe className="w-4 h-4 text-cyan-400 animate-[spin_10s_linear_infinite]" /> Live Telemetry Detail &rarr;
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* PAGE 2: SOLUTIONS INTERACTIVE MATRIX */}
          {currentTab === "solutions" && (
            <motion.div
              key="solutions-page"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-8 text-left"
            >
              <div>
                <span className="text-[10px] tracking-widest uppercase text-white/40 block font-bold mb-1 font-mono">Bespoke Enterprise Capabilities</span>
                <h2 className="font-sans text-3xl md:text-5xl text-white/95 leading-none">Interactive ARKA Solutions Matrix</h2>
                <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-2xl leading-relaxed">
                  Experience live interactive simulations of each core service pillar of the ARKA organization. Connect nodes, validate logic and view latency performance.
                </p>
              </div>

              {/* Bento Grid Solutions Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* 1. Conversational NLP Bots Simulator (7 Columns) */}
                <motion.div
                  whileHover={{ borderColor: "rgba(255, 255, 255, 0.15)", scale: 1.005 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="md:col-span-7 liquid-glass rounded-[2rem] p-6 flex flex-col justify-between bg-white/[0.01] border border-white/5 transition-colors relative overflow-hidden"
                  style={{ transform: `translateY(${Math.min(25, Math.max(-25, (scrollY - 250) * -0.035))}px)`, willChange: "transform" }}
                >
                  {/* Glossy Apple high-contrast glare refraction overlay */}
                  <div className="absolute inset-0 apple-spotlight-bg opacity-30 z-0 pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] uppercase tracking-wider font-mono text-cyan-300">Live Simulator</span>
                      <span className="text-[10px] font-mono text-white/30">NLP LATENCY: 42MS</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white/95 mt-3 font-sans">Conversational Chatbot Node</h3>
                    <p className="text-xs text-white/50 mt-1 max-w-lg leading-relaxed">
                      Custom-trained intelligence blocks matching query syntax to semantic backend intents instantly. Try the simulated console prompt below.
                    </p>
                  </div>

                  {/* Chat Console Sandbox */}
                  <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-3 my-5 h-56 justify-between overflow-hidden">
                    <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 custom-scrollbar text-xs">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`max-w-[80%] p-2.5 rounded-xl ${
                          msg.sender === "bot" 
                            ? "bg-white/5 self-start text-white/90 border border-white/5 text-left" 
                            : "bg-white text-black self-end font-medium text-right"
                        }`}>
                          <p>{msg.text}</p>
                          <span className={`text-[8px] block mt-1 ${msg.sender === "bot" ? "text-white/30" : "text-black/40"}`}>{msg.time}</span>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="p-2 bg-white/5 self-start rounded-lg text-white/40 text-[10px] font-mono animate-pulse">
                          ARKA chatbot formulating response stream...
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type 'pricing', 'scale', 'safety' or any goal..."
                        onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                        className="flex-1 bg-white/[0.03] outline-none px-4 py-2.5 rounded-xl text-xs text-white border border-white/5 focus:border-white/10 transition-colors"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={handleSendMessage}
                        className="p-2.5 bg-white text-black hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Action Link */}
                  <motion.button
                    whileHover={{ x: 3 }}
                    onClick={() => {
                      setLabPreset("chatbot");
                      setCurrentTab("lab");
                      addRegistryLog("[NAV] Intent mapped to lab for Chatbot development");
                    }}
                    className="text-xs font-semibold text-white text-left underline underline-offset-4 flex items-center gap-1.5 cursor-pointer"
                  >
                    Build customized chatbot model in Lab &rarr;
                  </motion.button>
                </div>
                </motion.div>

                {/* 2. Automated API Workflow Pipelines (5 Columns) */}
                <motion.div
                  whileHover={{ borderColor: "rgba(255, 255, 255, 0.15)", scale: 1.005 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="md:col-span-5 liquid-glass rounded-[2rem] p-6 flex flex-col justify-between bg-white/[0.01] border border-white/5 transition-colors"
                  style={{ transform: `translateY(${Math.min(25, Math.max(-25, (scrollY - 250) * 0.03))}px)`, willChange: "transform" }}
                >
                  <div>
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] uppercase tracking-wider font-mono text-indigo-300">Edge Integrator</span>
                    <h3 className="text-xl font-semibold text-white/95 mt-3 font-sans">Autonomous API Pipelines</h3>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      Sync client inputs to CRMs, notify managers via Gmail instantly, and update Stripe ledgers without server-side maintenance.
                    </p>
                  </div>

                  {/* API route visualizer node map */}
                  <div className="my-5 p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-[11px] font-mono flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-white/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ingress request payload validated</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/70">
                      <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-ping" />
                      <span>Dispatching transaction webhooks...</span>
                    </div>
                    <div className="h-0.5 bg-white/10 w-full relative overflow-hidden my-1">
                      <div className="h-full bg-cyan-400 w-1/3 rounded animate-[shimmer_2s_infinite]" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-white/40">
                      <span>Target: Stripe API v3</span>
                      <span>Latency: 72ms</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setLabPreset("workflow");
                      setCurrentTab("lab");
                      addRegistryLog("[NAV] Intent mapped to lab for API Pipeline setup");
                    }}
                    className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer text-center"
                  >
                    Deploy live Workflow Pipeline
                  </motion.button>
                </motion.div>

                {/* 3. Immersive UX/UI Web Design (6 Columns) */}
                <motion.div
                  whileHover={{ borderColor: "rgba(255, 255, 255, 0.15)", scale: 1.005 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="md:col-span-6 liquid-glass rounded-[2rem] p-6 flex flex-col justify-between bg-white/[0.01] border border-white/5 transition-colors"
                  style={{ transform: `translateY(${Math.min(25, Math.max(-25, (scrollY - 450) * -0.03))}px)`, willChange: "transform" }}
                >
                  <div>
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] uppercase tracking-wider font-mono text-orange-300">Aesthetic Premium</span>
                    <h3 className="text-xl font-semibold text-white/95 mt-3 font-sans">Fluid Immersive Web design</h3>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      We craft high-fidelity, responsive responsive web canvases styled with glossy glass structures, floating depth axes, and smooth frame transitions that absolute convert visitors.
                    </p>
                  </div>

                  {/* Portfolio Gallery Preview Component */}
                  <div className="my-5 flex gap-3 overflow-hidden">
                    {[
                      { title: "Bento Slate", img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400", desc: "Glossy structure grid" },
                      { title: "Quantum Glass", img: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=400", desc: "Depth layout UI" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 rounded-xl bg-black/40 border border-white/5 overflow-hidden group/item">
                        <img src={item.img} alt={item.title} className="w-full h-24 object-cover filter grayscale group-hover/item:grayscale-0 transition-all duration-700 group-hover/item:scale-105" />
                        <div className="p-2 text-left">
                          <h4 className="text-[10px] font-bold text-white/90">{item.title}</h4>
                          <p className="text-[9px] text-white/40">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ x: 3 }}
                    onClick={() => {
                      setLabPreset("webdesign");
                      setCurrentTab("lab");
                      addRegistryLog("[NAV] Intent mapped to lab for Webdesign workspace rendering");
                    }}
                    className="text-xs font-semibold text-white text-left flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Generate stunning design blueprint &rarr;
                  </motion.button>
                </motion.div>

                {/* 4. Autonomous Cognitive Agents (6 Columns) */}
                <motion.div
                  whileHover={{ borderColor: "rgba(255, 255, 255, 0.15)", scale: 1.005 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="md:col-span-6 liquid-glass rounded-[2rem] p-6 flex flex-col justify-between bg-white/[0.01] border border-white/5 transition-colors"
                  style={{ transform: `translateY(${Math.min(25, Math.max(-25, (scrollY - 450) * 0.035))}px)`, willChange: "transform" }}
                >
                  <div>
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] uppercase tracking-wider font-mono text-emerald-300">Cognitive Layer</span>
                    <h3 className="text-xl font-semibold text-white/95 mt-3 font-sans">Autonomous Agents Layer</h3>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed font-sans mt-2">
                      Deploy recursive software agents that execute deep model searches, automate product management, process customer transactions and audit logs on schedule.
                    </p>
                  </div>

                  {/* Agent intelligence slider simulation */}
                  <div className="my-5 p-4 bg-white/[0.02] border border-white/5 rounded-xl text-left">
                    <div className="flex justify-between items-center text-[10px] font-mono text-white/50 mb-1">
                      <span>MOCK WORKLOAD HOURS SAVED</span>
                      <span className="text-emerald-400 font-bold">~ 180 hrs / month</span>
                    </div>
                    <div className="flex gap-2 items-center text-xs text-white mt-1">
                      <Server className="w-4 h-4 text-white/60" />
                      <span className="text-xs font-bold">Deep Cognitive Level 8 Node</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setLabPreset("agents");
                      setCurrentTab("lab");
                      addRegistryLog("[NAV] Intent mapped to lab for Autonomous Agents workbench");
                    }}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/90 text-xs font-semibold tracking-wider rounded-xl transition-all cursor-pointer text-center"
                  >
                    Test Autonomous Agent logic
                  </motion.button>
                </motion.div>

              </div>
            </motion.div>
          )}

          {/* PAGE 3: EMBEDDED AUTOMATION LAB WORKBENCH */}
          {currentTab === "lab" && (
            <motion.div
              key="lab-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-6 text-left"
            >
              <div>
                <span className="text-[10px] tracking-widest uppercase text-white/40 block font-bold mb-1 font-mono">ARKA WORKSTATION</span>
                <h2 className="font-sans text-3xl md:text-5xl text-white/95">Lab Automation Workbench</h2>
                <p className="text-xs sm:text-sm text-white/50 mt-1.5 max-w-2xl">
                  Configure custom chatbot directives, workflow webhook endpoints, and hosting backbone requirements. Compile and test live simulation schemas on standard edge networks.
                </p>
              </div>

              {/* Lab Embedded Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Embedded Controls Formulation (Columns 7) */}
                <div className="lg:col-span-7 liquid-glass rounded-[2rem] p-6 lg:p-8 flex flex-col gap-6 bg-white/[0.01]">
                  
                  {/* Objective Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-wider uppercase text-white/40 font-bold">
                      Automation Pipeline Objective
                    </label>
                    <input
                      type="text"
                      value={labPrompt}
                      onChange={(e) => setLabPrompt(e.target.value)}
                      placeholder="e.g. Sync high-ticket leads to CRM and dispatch billing summaries via email"
                      className="w-full px-4 py-3.5 bg-white/[0.03] focus:bg-white/[0.06] rounded-xl outline-none text-xs text-white border-none transition-colors"
                    />
                  </div>

                  {/* Preset Matrix */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-wider uppercase text-white/40 font-bold">
                      Implementation Architecture
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "workflow", name: "Workflows" },
                        { id: "chatbot", name: "Conversational" },
                        { id: "webdesign", name: "Interfaces" },
                        { id: "agents", name: "Autonomous" }
                      ].map((preset) => (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          key={preset.id}
                          onClick={() => {
                            setLabPreset(preset.id as any);
                            addRegistryLog(`[LAB] Swap preset architecture to: ${preset.name}`);
                          }}
                          className={`p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            labPreset === preset.id
                              ? "bg-white text-black font-extrabold"
                              : "bg-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {preset.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Complexity & Connectivity sliders */}
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-semibold text-white/50">
                        <span>SYSTEM RELIABILITY CO-EFFICIENT</span>
                        <span>{labComplexity}% SLA Cap</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={labComplexity}
                        onChange={(e) => setLabComplexity(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 appearance-none rounded cursor-pointer accent-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-semibold text-white/50">
                        <span>CONNECTED API ENDPOINTS</span>
                        <span>{labSymmetry} webhooks</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="16"
                        value={labSymmetry}
                        onChange={(e) => setLabSymmetry(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 appearance-none rounded cursor-pointer accent-white"
                      />
                    </div>
                  </div>

                  {/* Backbone Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-wider uppercase text-white/40 font-bold">
                      Execution Backbone
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "cosmic", label: "Edge Accelerated CJS" },
                        { id: "dawn", label: "Multi-Region Cloud Sync" },
                        { id: "eclipse", label: "ISO-27001 Enterprise" },
                        { id: "aurora", label: "Smart Cognitive Route" }
                      ].map((backbone) => (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={backbone.id}
                          onClick={() => {
                            setLabGlow(backbone.id as any);
                            addRegistryLog(`[LAB] Swap backbone infrastructure to: ${backbone.label}`);
                          }}
                          className={`px-3.5 py-2 rounded-full text-[10px] uppercase font-bold tracking-wider border transition-all cursor-pointer ${
                            labGlow === backbone.id
                              ? "bg-white/15 text-white border-white/30"
                              : "bg-white/[0.02] text-white/55 border-white/5 hover:bg-white/[0.05]"
                          }`}
                        >
                          {backbone.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleEmbeddedCompile}
                    disabled={isEmbeddedProcessing}
                    className="w-full mt-2 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isEmbeddedProcessing ? (
                      <>
                        <Activity className="w-4 h-4 animate-spin" />
                        Synchronising schemas: {embeddedProgress}%
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4" />
                        Compile microservice schema
                      </>
                    )}
                  </motion.button>

                </div>

                {/* Compile diagnostics preview sandbox (Columns 5) */}
                <div className="lg:col-span-5 rounded-[2rem] bg-black/45 border border-white/5 flex flex-col p-6 text-center justify-center items-center min-h-[350px]">
                  <AnimatePresence mode="wait">
                    {isEmbeddedProcessing ? (
                      <motion.div
                        key="embedding-pro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-4 w-full"
                      >
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border border-white/10 border-t-white animate-spin" />
                          <Activity className="w-6 h-6 text-white/80 animate-pulse" />
                        </div>
                        <span className="text-xs font-mono text-white/80 leading-tight mt-2">{embeddedStep}</span>
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-white transition-all duration-300" style={{ width: `${embeddedProgress}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-white/40">{embeddedProgress}% validated</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="lab-uncompiled"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center p-6 text-center"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                          <Code className="w-6 h-6 text-white/30" />
                        </div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white/85">Awaiting Parameters Formulation</h4>
                        <p className="text-xs text-white/50 max-w-xs mt-2 leading-relaxed">
                          Enter your custom business details on the left, slide connectivity indexes, and click 'Compile Pipeline' to review code responses here.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}

          {/* PAGE 4: ARKA BLUEPRINTS REGISTRY TERMINAL */}
          {currentTab === "registry" && (
            <motion.div
              key="registry-page"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
            >
              
              {/* Left Column: List of saved specimens (Columns 7) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-white/40 block font-bold mb-1 font-mono">Compiled Blueprints Repository</span>
                  <h2 className="font-sans text-3xl md:text-5xl text-white/95">Registered ARKA Blueprints</h2>
                  <p className="text-xs text-white/50 mt-1">
                    Manage active enterprise integrations, inspect parameter configurations, and fire mock payloads to live state terminals below.
                  </p>
                </div>

                <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
                  {specimens.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center gap-3 liquid-glass rounded-2xl">
                      <BookOpen className="w-8 h-8 text-white/20" />
                      <p className="text-xs text-white/50">No blueprints registered in edge database.</p>
                      <button
                        onClick={() => setCurrentTab("lab")}
                        className="text-xs font-bold text-white underline underline-offset-4"
                      >
                        Compile your first blueprint schema inside workstation &rarr;
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
                            <span className="text-[9px] font-mono text-cyan-400">ID: {spec.id}</span>
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
                              className="px-2.5 py-1 bg-white/15 hover:bg-white/20 rounded text-[9px] font-semibold text-white tracking-wider uppercase transition-colors pointer-events-auto cursor-pointer"
                            >
                              Dispatch Ping
                            </motion.button>
                            <span className="text-[9px] font-mono text-white/30 truncate">Target: {spec.lumens}ms latency</span>
                          </div>
                        </div>

                        {/* Delete absolute button */}
                        <motion.button
                          whileHover={{ scale: 1.1, color: "#ef4444" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeleteSpecimen(spec.id, e)}
                          className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/5 text-white/30 transition-colors cursor-pointer z-10"
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
                    <span className="text-[10px] tracking-widest uppercase text-white/40 font-bold font-mono">SYS TELEMETRY FEEDS</span>
                    <button
                      onClick={() => {
                        setRegistryLogs([
                          `[SYS] Logger state cleared. Awaiting signals...`
                        ]);
                      }}
                      className="text-[9.5px] uppercase font-mono text-white/40 hover:text-white transition-colors underline underline-offset-2"
                    >
                      Clear Shell
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

                  <div className="text-[9px] uppercase font-mono tracking-widest text-white/35">
                    STATE: SECURE EDGE PORT 3000 // ARKA CORE PROTOCOL V2
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* PAGE 5: DEDICATED GLOBAL TELEMETRY DOME */}
          {currentTab === "globe" && (
            <motion.div
              key="globe-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-stretch"
            >
              
              {/* Left Sidebar Control Box (Columns 4) */}
              <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-white/40 block font-bold mb-1 font-mono">Interactive Edge Network</span>
                  <h2 className="font-sans text-3xl md:text-5xl text-white/95">Telemetry Dome</h2>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    Adjust orbital coordinate layers, holographic pitch, and sub-routing nests. Trigger ping signals dynamically by clicking global data gateways on the globe.
                  </p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] flex flex-col gap-4">
                  <span className="text-[10px] tracking-widest uppercase text-white/40 font-bold block font-mono">Mesh Tuning Controls</span>
                  <StructureSimulator />
                </div>

                <div className="flex gap-2 text-[10px] font-mono text-white/40 uppercase">
                  <span>ORBITAL SPEED: 40s/CYCLE</span>
                  <span>·</span>
                  <span>TILT LEVEL: 15° PITCH</span>
                </div>
              </div>

              {/* Central Large Globe Dome View (Columns 8) */}
              <div className="lg:col-span-8 liquid-glass p-6 md:p-8 rounded-[2.5rem] flex flex-col justify-between items-center relative overflow-hidden min-h-[400px] bg-white/[0.01]">
                
                {/* Floating details heading overlay */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10 select-none">
                  <div className="text-left">
                    <span className="text-[9px] tracking-widest uppercase text-cyan-400 font-bold block font-mono">Live Edge Viewport</span>
                    <h3 className="font-sans text-2xl text-white/90">Orthographic Core</h3>
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
                      <div key={idx} className="p-2 bg-white/[0.02] rounded border border-white/5 hover:bg-white/10 transition-colors pointer-events-auto cursor-pointer" onClick={() => {
                        addRegistryLog(`[PING SUCCESS] Routed diagnostic sweep packets through regional ledger ${loc.city}. Roundtrip: ${loc.ping}`);
                      }}>
                        <div className="font-bold text-white/95 truncate">{loc.city.split(" ")[0]}</div>
                        <div className="text-cyan-400 mt-1">{loc.ping}</div>
                        <div className="text-white/30 text-[8px] uppercase mt-0.5">{loc.health}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full text-center text-[10px] text-white/30 uppercase tracking-widest">
                  Click any regional gate block above to dispatch diagnostic sweep packets
                </div>

              </div>

            </motion.div>
          )}

          {/* PAGE 6: AGREEMENT kalkulator / STRATEGIC SLA QUOTE */}
          {currentTab === "quote" && (
            <motion.div
              key="quote-page"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-stretch"
            >
              
              {/* Sliders and pricing parameters (Columns 7) */}
              <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-white/40 block font-bold mb-1 font-mono">Automated Strategic Onboarding</span>
                  <h2 className="font-sans text-3xl md:text-5xl text-white/95">Agreement Builder</h2>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    Configure desired query volume capacity, choose the corresponding support tier, and select the tools you want to connect. Real-time cost formulation.
                  </p>
                </div>

                <div className="flex flex-col gap-5 p-6 bg-white/[0.01] border border-white/5 rounded-[2rem]">
                  
                  {/* Estimator Volume Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-white/50">
                      <span>ESTIMATED CONVERSATIONS / WORKFLOWS</span>
                      <span className="text-white font-mono">{estimateVolume}k / month</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="50"
                      value={estimateVolume}
                      onChange={(e) => setEstimateVolume(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 appearance-none rounded cursor-pointer accent-white"
                    />
                    <span className="text-[10px] text-white/40">Adjust parameters from 50,000 up to 1,000,000 requests/mo.</span>
                  </div>

                  {/* SLA Support Tiers Grid */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs tracking-wider uppercase text-white/40 font-bold">Guaranteed SLA support Tier</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "standard", name: "Standard SLA", desc: "24h Response · Email support" },
                        { id: "gold", name: "Enterprise Gold", desc: "2h Response · Team collaboration" },
                        { id: "defence", name: "Defence Level SLA", desc: "15m Response · Technical engineer line" }
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          onClick={() => setSlaTier(tier.id as any)}
                          className={`p-3 rounded-xl text-left border transition-all ${
                            slaTier === tier.id
                              ? "bg-white text-black border-white scale-102"
                              : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.05]"
                          }`}
                        >
                          <span className="text-xs font-bold block">{tier.name}</span>
                          <span className={`text-[9px] leading-tight block mt-1 ${slaTier === tier.id ? "text-black/60" : "text-white/40"}`}>{tier.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Connectors checkboxes toggles */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs tracking-wider uppercase text-white/40 font-bold">Encrypted Integrations Nodes</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "stripe", label: "Stripe Ledger Broker" },
                        { id: "crm", label: "HubSpot CRM Contacts" },
                        { id: "shopify", label: "Shopify Webhooks Sync" },
                        { id: "gmail", label: "Gmail Notification Gateway" },
                        { id: "database", label: "Structured Postgres Sync" }
                      ].map((connector) => (
                        <button
                          key={connector.id}
                          onClick={() => setConnectors((prev: any) => ({ ...prev, [connector.id]: !prev[connector.id] }))}
                          className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all border ${
                            connectors[connector.id as keyof typeof connectors]
                              ? "bg-white/15 text-white border-white/20"
                              : "bg-white/[0.01] border-white/5 text-white/40 hover:bg-white/[0.04]"
                          }`}
                        >
                          {connectors[connector.id as keyof typeof connectors] ? "✓ " : "+ "}
                          {connector.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="text-[10px] font-mono text-white/40">
                  ESTIMATES GENERATED INSTANTLY ACCORDING TO REALTIME EDGE ROUTING COMPILATION.
                </div>
              </div>

              {/* Visualized final Quote Summary Agreement card (Columns 5) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {!isQuoteLocked ? (
                    <motion.div
                      key="quote-form-state"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="liquid-glass rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between bg-white/[0.01] h-full min-h-[440px] border border-white/5"
                    >
                      <div className="text-left flex flex-col gap-1">
                        <span className="text-[10px] tracking-widest uppercase text-white/40 font-bold font-mono">CONSOLIDATED PROPOSAL</span>
                        <h3 className="font-sans text-2xl text-white/90">Strategic SLA Summary</h3>
                      </div>

                      {/* Quote metrics list */}
                      <div className="my-6 flex flex-col gap-3.5 text-left border-y border-white/5 py-5 text-sm">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/50">Simulated Traffic Capacity</span>
                          <span className="font-mono text-white/90">{estimateVolume},000 workflows / mo</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/50">Enterprise Support Tier</span>
                          <span className="text-white/90 uppercase font-bold">{slaTier} Grade</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/50 font-sans">Encrypted Connected APIs</span>
                          <span className="font-mono text-cyan-400">
                            {Object.values(connectors).filter(Boolean).length} node routes
                          </span>
                        </div>
                        
                        <div className="h-0.5 bg-white/5 w-full my-1" />

                        <div className="flex justify-between items-end">
                          <span className="text-white/55 font-sans">Monthly Retainer Option</span>
                          <div className="text-right">
                            <span className="text-2xl font-bold font-mono text-white">${calculatedPrice()}</span>
                            <span className="text-[9px] block text-white/35 uppercase font-mono mt-0.5">USD / month</span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsQuoteLocked(true);
                          addRegistryLog(`[SLA QUOTE COMPLETE] Locked strategic SLA proposal: Tier ${slaTier.toUpperCase()}, Vol ${estimateVolume}k at $${calculatedPrice()}/mo.`);
                        }}
                        className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
                      >
                        Lock Proposal & Onboard
                      </motion.button>

                      <div className="flex items-center gap-2 justify-center text-[9px] text-white/40 uppercase font-mono leading-none mt-4">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>ISO-27001 Strict Compliance Guaranteed</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="quote-locked-state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="liquid-glass rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between bg-emerald-950/[0.05] border border-emerald-500/20 h-full min-h-[440px] text-center"
                    >
                      <div className="flex flex-col items-center gap-3 mt-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center animate-bounce">
                          <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h4 className="text-xs tracking-widest uppercase font-mono font-extrabold text-emerald-400 mt-2">SLA CORE PROTOCOL INITIATED</h4>
                        <h3 className="font-sans text-2xl text-white/95">Proposal Locked Successfully</h3>
                        <p className="text-xs text-white/60 max-w-xs mt-2 leading-relaxed">
                          We have recorded your specifications in our secure database ledger. A direct communication line is being established between ARKA’s lead technical architect and your company’s technical contact inbox.
                        </p>
                      </div>

                      <div className="my-5 p-4 bg-black/40 rounded-2xl border border-emerald-500/10 text-left font-mono text-[10px] text-emerald-300 flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="text-white/40">PLAN TIER:</span>
                          <span className="font-bold text-white uppercase">{slaTier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">CAPACITY MESH:</span>
                          <span className="text-white">{estimateVolume},000 msg/mo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">MONTHLY FIXED RET:</span>
                          <span className="text-white font-bold">${calculatedPrice()}/mo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">LEDGER HASH:</span>
                          <span className="text-white/70 overflow-hidden text-ellipsis max-w-[140px] whitespace-nowrap">ark_tx_s0f2b9a7</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5 w-full">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setIsQuoteLocked(false);
                            addRegistryLog("[SLA QUOTE REEDIT] User unlocked SLA proposal parameters.");
                          }}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-semibold rounded-xl border border-white/10 transition-colors cursor-pointer"
                        >
                          Modify Parameters
                        </motion.button>
                        <span className="text-[9px] uppercase tracking-wider font-mono text-white/35">
                          ISO-27001 Cryptically Signed Reference
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          )}

          {currentTab === "pingscan" && (
            <motion.div
              key="pingscan-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
            >
              <PingScanner theme={theme} addLog={addRegistryLog} />
            </motion.div>
          )}

          {currentTab === "design" && (
            <motion.div
              key="design-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
            >
              <WebDesignStudio theme={theme} addLog={addRegistryLog} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ================= GLOBAL SUB-COMPONENTS/MODALS/FOOTERS ================= */}

      {/* Footer Branding Links */}
      <footer className="w-full py-10 px-4 md:px-8 border-t border-white/5 bg-black/80 backdrop-blur-xl relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/40">
          
          <div className="flex items-center gap-3">
            <Logo className="w-6 h-6 text-white/60" />
            <span className="font-sans font-bold uppercase tracking-wider text-white/80">ARKA COGNITIVE WEB</span>
          </div>

          <p className="text-[11px] leading-relaxed max-w-md text-center md:text-left font-light text-white/50">
            Pixel-perfect corporate UI layouts paired seamlessly with edge conversational state models. Created with pride for modern multi-region enterprises.
          </p>

          <div className="flex items-center gap-4 text-white/60">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Twitter"><Twitter className="w-4 h-4" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="LinkedIn"><Linkedin className="w-4 h-4" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Instagram"><Instagram className="w-4 h-4" /></a>
            <span className="w-[1px] h-3 bg-white/20" />
            <span className="text-[10px] tracking-wider font-mono uppercase text-white/40">ARKA CORP 2026</span>
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
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-white" />
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
                        <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-mono block">{spec.preset} framework</span>
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
                    setCurrentTab("lab");
                  }}
                  className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Compile new blueprint
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
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>

              <AnimatePresence mode="wait">
                {!isEmailSubmitted ? (
                  <motion.div
                    key="pre-signup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
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
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center animate-bounce">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">ONBOARDING TRANSMITTAL INITIALISED</h4>
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

      {/* 4. Complete Mobile/Overlay Navigation Menu Console Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-[2.5rem] liquid-glass p-8 flex flex-col justify-between text-white relative z-50"
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute right-6 top-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>

              <h3 className="font-sans font-medium text-lg uppercase tracking-widest text-white/40 mb-6">ARKA ENTERPRISE SUITE</h3>

              <nav className="flex flex-col gap-4 text-left">
                {[
                  { name: "Explore Corporate Overview", desc: "Main corporate portal value propositions & stats", action: () => setCurrentTab("overview") },
                  { name: "Interactive Services Matrix", desc: "Click and simulate conversational chatbots & schemas", action: () => setCurrentTab("solutions") },
                  { name: "Bespoke Web Design Studio", desc: "Interactive customized brand mockups configurator", action: () => setCurrentTab("design") },
                  { name: "Automation Lab workbench", desc: "Compile and manifest new workflow items", action: () => setCurrentTab("lab") },
                  { name: "Saved Blueprints Registry", desc: "View lists of registered templates, logs & details", action: () => setCurrentTab("registry") },
                  { name: "Live Edge Telemetry Globe", desc: "Aesthetic rotating 3D projection model", action: () => setCurrentTab("globe") },
                  { name: "Live Edge Diagnostic Scanner", desc: "Ping latency route scans and corporate bandwidth test", action: () => setCurrentTab("pingscan") },
                  { name: "Agreement SLA Calculator", desc: "ROI estimator for estimated monthly conversations", action: () => setCurrentTab("quote") }
                ].map((route, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      route.action();
                      setIsMenuOpen(false);
                    }}
                    className="p-3.5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] transition-all flex items-center justify-between text-left group cursor-pointer border border-white/5"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">{route.name}</h4>
                      <p className="text-[10px] text-white/40 mt-0.5">{route.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1.5 transition-all" />
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between sm:items-center text-[10px] uppercase font-mono tracking-wider text-white/40">
                <span>ARKA SYSTEMS GLOBAL 2026</span>
                <button
                  onClick={() => {
                    setIsPortalEntered(false);
                    localStorage.setItem("arka_portal_entered", "false");
                    setIsMenuOpen(false);
                    addRegistryLog("[SYS] Handshake session terminated: Locked Gateway console.");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-950/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors border border-red-500/15 font-mono text-[9px] uppercase tracking-wider text-center cursor-pointer"
                >
                  RESET GATEWAY (LOGOUT)
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
