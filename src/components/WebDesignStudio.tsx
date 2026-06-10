import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Monitor, 
  Smartphone, 
  Sparkles, 
  Layout, 
  Palette, 
  Code, 
  Zap, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  ArrowUpRight, 
  Check, 
  Globe, 
  Eye, 
  ChevronRight,
  Maximize2,
  Lock,
  Layers,
  Component
} from "lucide-react";

interface WebDesignStudioProps {
  theme: "black" | "slate" | "summit";
  addLog: (log: string) => void;
}

type AestheticType = "swiss" | "cosmic" | "tech" | "luxe";
type CompanyType = "ai" | "biotech" | "venture" | "creative";

export const WebDesignStudio: React.FC<WebDesignStudioProps> = ({ theme, addLog }) => {
  // Configurator states
  const [activeAesthetic, setActiveAesthetic] = useState<AestheticType>("swiss");
  const [activeCompany, setActiveCompany] = useState<CompanyType>("ai");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  
  // Custom design parameters
  const [glowStrength, setGlowStrength] = useState<number>(45);
  const [glassReflection, setGlassReflection] = useState<boolean>(true);
  const [showAssistant, setShowAssistant] = useState<boolean>(false);
  const [fontKerning, setFontKerning] = useState<"normal" | "wide">("wide");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["landing", "pricing", "blog"]);

  // Form Brief Submission
  const [clientName, setClientName] = useState("");
  const [customSlogan, setCustomSlogan] = useState("");
  const [isSubmittingBrief, setIsSubmittingBrief] = useState(false);
  const [submittedBrief, setSubmittedBrief] = useState<any>(null);

  useEffect(() => {
    addLog(`[DESIGN] Initiated Swiss Minimal brand architect framework.`);
  }, []);

  const handleAestheticChange = (type: AestheticType) => {
    setActiveAesthetic(type);
    addLog(`[DESIGN] Set simulator design aesthetic to: ${type.toUpperCase()}`);
  };

  const handleCompanyChange = (type: CompanyType) => {
    setActiveCompany(type);
    addLog(`[DESIGN] Updated company structure template: ${type.toUpperCase()}`);
  };

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
    addLog(`[DESIGN] Configured layout block selection toggled for: ${feat}`);
  };

  const getCompanyLabel = (code: string) => {
    const norm = String(code || "").toLowerCase();
    if (norm === "ai") return "Nexus AI Cluster";
    if (norm === "biotech") return "Vitalis Bio-Labs";
    if (norm === "venture") return "Synapse Ventures";
    if (norm === "creative") return "Creative Atelier";
    return "Nexus AI Cluster";
  };

  const handleSubmitBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;

    setIsSubmittingBrief(true);
    addLog(`[DESIGN] Compiling structural client specifications for ${clientName}...`);

    setTimeout(() => {
      setIsSubmittingBrief(false);

      const isInformational = 
        clientName.toLowerCase().includes("informational") || 
        clientName.toLowerCase().includes("simple") ||
        clientName.toLowerCase().includes("portfolio") ||
        clientName.toLowerCase().includes("basic") ||
        customSlogan.toLowerCase().includes("informational") ||
        customSlogan.toLowerCase().includes("simple") ||
        customSlogan.toLowerCase().includes("portfolio") ||
        customSlogan.toLowerCase().includes("basic");

      // Dynamic baseline
      const baseCost = isInformational ? 350 : 1200;
      
      // Dynamic feature add-ons
      const featureCosts = selectedFeatures.reduce((acc, feat) => {
        if (feat === "landing") return acc + (isInformational ? 150 : 400); // Edge Landings
        if (feat === "pricing") return acc + (isInformational ? 300 : 800);  // Stripe Metering
        if (feat === "blog") return acc + (isInformational ? 200 : 500);     // Live Telemetry
        return acc;
      }, 0);

      const totalInvestment = baseCost + featureCosts;

      // Dynamic schedule duration
      let schedule = "3-5 Business Days";
      if (isInformational) {
        if (selectedFeatures.length <= 1) schedule = "1-2 Business Days";
        else if (selectedFeatures.length === 2) schedule = "2 Business Days";
        else schedule = "2-3 Business Days";
      } else {
        if (selectedFeatures.length <= 1) schedule = "2-4 Business Days";
        else if (selectedFeatures.includes("pricing")) schedule = "5-8 Business Days";
        else schedule = "4-6 Business Days";
      }

      // Dynamic metric estimate description
      let metricType = "High-Speed Jamstack Site";
      if (selectedFeatures.includes("pricing")) {
        metricType = isInformational ? "Static Site + Secure Payments" : "Custom Server + Secure DB";
      } else if (selectedFeatures.includes("blog")) {
        metricType = "Static CMS Framework";
      } else if (isInformational) {
        metricType = "Ultra-light Static App";
      }

      setSubmittedBrief({
        id: "RFP-" + Math.floor(Math.random() * 90000 + 10000),
        client: clientName,
        slogan: customSlogan || "Pioneering the Next Digital Boundary",
        aesthetic: activeAesthetic,
        company: activeCompany,
        features: selectedFeatures,
        estDelivery: schedule,
        metricEst: metricType,
        estInvestment: totalInvestment.toLocaleString() + " USD"
      });
      addLog(`[DESIGN] Live web architecture requirements spec compiled and authorized!`);
    }, 1200);
  };

  // Content matching generators
  const getCompanyDetails = () => {
    switch (activeCompany) {
      case "ai":
        return {
          title: "NEXUS AI",
          tagline: "Autonomous Reasoning Engines",
          desc: "We deploy real-time context-aware conversational pipelines directly into cloud infrastructure.",
          cta: "Connect Cognition",
          sub: "Verifiable SLA model & immediate edge synthesis."
        };
      case "biotech":
        return {
          title: "VITALIS GEN",
          tagline: "Biological Synthesis Engines",
          desc: "Mapping custom cellular sequences & molecular folding dynamics with atomic precision.",
          cta: "Explore Research",
          sub: "ISO-27001 audited biomedical data modeling."
        };
      case "venture":
        return {
          title: "SYNAPSE VC",
          tagline: "Accelerating the Boundary",
          desc: "Capital backing for avant-garde technological breakthroughs across computing, quantum & energy.",
          cta: "Submit Paradigm",
          sub: "Current underwritten assets totaling 4.2B+."
        };
      case "creative":
        return {
          title: "ATELIER Studio",
          tagline: "Spatial Craft & Typography",
          desc: "Forging bespoke digital objects, Swiss typography structures & brutalist identity models.",
          cta: "Initiate Craft",
          sub: "Every pixel bound to responsive architectural vectors."
        };
    }
  };

  const company = getCompanyDetails();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-white pb-16 font-sans">
      
      {/* LEFT COLUMN: Controls & Brief Builder (Grid Span 4) */}
      <div className="lg:col-span-4 flex flex-col gap-6 relative z-20">
        
        {/* Core Description Unit */}
        <div className="p-6 rounded-3xl border border-white/[0.05] bg-neutral-950/40 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-25">
            <Layout className="w-10 h-10 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] font-mono text-cyan-400 uppercase">Interactive web design studio</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-sans tracking-tight leading-tight">
            CUSTOM HIGH-END DIGITAL EXPERIENCES
          </h2>
          <p className="text-white/60 text-xs mt-3 leading-relaxed">
            We write proprietary Web apps, interactive modular portfolios, and cinematic corporate landing assets compiled for instant loading speeds and spectacular user-retention.
          </p>
        </div>

        {/* 1. Interactive Aesthetic Selector */}
        <div className="p-6 rounded-3xl border border-white/[0.05] bg-neutral-950/40 backdrop-blur-xl">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-cyan-400" /> Choose Brand Aesthetic
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: "cosmic", label: "Cosmic Obsidian", desc: "Velvety dark glows" },
              { id: "swiss", label: "Swiss Minimal", desc: "Negative-space grid" },
              { id: "tech", label: "Brutalist Mono", desc: "Diagnostic matrix" },
              { id: "luxe", label: "Editorial Luxe", desc: "Editorial serif art" }
            ].map((aes) => (
              <button
                key={aes.id}
                onClick={() => handleAestheticChange(aes.id as AestheticType)}
                className={`p-3 rounded-2xl text-left transition-all duration-300 border text-xs relative overflow-hidden flex flex-col justify-between h-20 ${
                  activeAesthetic === aes.id
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.01] hover:bg-white/[0.03] border-white/5"
                }`}
              >
                {/* Background shimmer */}
                {activeAesthetic === aes.id && (
                  <motion.div
                    layoutId="aesthetic_shimmer"
                    className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 via-transparent to-transparent pointer-events-none"
                  />
                )}
                
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold tracking-tight">{aes.label}</span>
                  {activeAesthetic === aes.id && <CheckCircle2 className="w-4 h-4 text-cyan-500 fill-black shrink-0" />}
                </div>
                <span className={`text-[9px] mt-1 block leading-tight ${activeAesthetic === aes.id ? "text-neutral-700 font-medium" : "text-white/40"}`}>{aes.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Interactive Corporate Verticals */}
        <div className="p-6 rounded-3xl border border-white/[0.05] bg-neutral-950/40 backdrop-blur-xl">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-indigo-400" /> Target Industry Sphere
          </h4>
          <div className="flex flex-col gap-2">
            {[
              { id: "ai", label: "Nexus AI Cluster", sub: "Silicon, conversational overlays & LLMs" },
              { id: "biotech", label: "Vitalis Bio-Labs", sub: "Genetics research, labs & bio-modelling" },
              { id: "venture", label: "Synapse Ventures", sub: "Venture scale technology investments" },
              { id: "creative", label: "Creative Atelier", sub: "Luxury space, architecture & typography" }
            ].map((corp) => (
              <button
                key={corp.id}
                onClick={() => handleCompanyChange(corp.id as CompanyType)}
                className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 ${
                  activeCompany === corp.id
                    ? "bg-white/[0.06] border-white/30"
                    : "bg-white/[0.01] hover:bg-white/[0.03] border-white/5"
                }`}
              >
                <div className="text-left">
                  <span className={`text-xs font-semibold block transition-colors ${activeCompany === corp.id ? "text-cyan-400" : "text-white/90"}`}>
                    {corp.label}
                  </span>
                  <span className="text-[9px] text-white/45 block mt-0.5 font-mono">{corp.sub}</span>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${activeCompany === corp.id ? "bg-cyan-400" : "bg-white/10"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* 3. Realtime Parameter Sliders (Gloss & Kerning) */}
        <div className="p-6 rounded-3xl border border-white/[0.05] bg-neutral-950/40 backdrop-blur-xl flex flex-col gap-4">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Micro-Styling Knobs
          </h4>
          
          {/* Ambient Glow Strength slider */}
          <div>
            <div className="flex justify-between text-[10px] mb-2 font-mono text-white/60">
              <span className="uppercase">Ambient Glow Intensity</span>
              <span className="text-cyan-400 font-bold">{glowStrength}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={glowStrength}
              onChange={(e) => {
                setGlowStrength(Number(e.target.value));
              }}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Typography configuration */}
          <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/5">
            <span className="text-white/60 uppercase">Letter-Spacing</span>
            <div className="flex gap-1.5 border border-white/10 p-1.5 rounded-xl bg-black/40">
              <button 
                onClick={() => setFontKerning("normal")}
                className={`px-3 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider transition-all ${fontKerning === "normal" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
              >
                Normal
              </button>
              <button 
                onClick={() => setFontKerning("wide")}
                className={`px-3 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider transition-all ${fontKerning === "wide" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
              >
                Enlarged
              </button>
            </div>
          </div>

          {/* Glossy / Frosting Backdrop toggle */}
          <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/5">
            <span className="text-white/60 uppercase">Glossy Backdrop Frosting</span>
            <button
              onClick={() => {
                setGlassReflection(prev => !prev);
                addLog(`[DESIGN] Glossy backdrop reflection ${!glassReflection ? "ENABLED" : "DISABLED"}`);
              }}
              className={`px-3 py-1.5 rounded-xl text-[9px] tracking-wider uppercase font-extrabold border transition-all ${
                glassReflection 
                  ? "bg-cyan-950/20 text-cyan-400 border-cyan-500/20" 
                  : "bg-white/5 text-white/40 border-white/5"
              }`}
            >
              {glassReflection ? "Activated" : "Bypassed"}
            </button>
          </div>

          {/* Conversational chatbot widget component toggle */}
          <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/5">
            <span className="text-white/60 uppercase">AI Chatbot Assist Widget</span>
            <button
              onClick={() => {
                setShowAssistant(prev => !prev);
                addLog(`[DESIGN] Interactive conversational mockup assistance ${!showAssistant ? "INJECTED" : "REJECTED"}`);
              }}
              className={`px-3 py-1.5 rounded-xl text-[9px] tracking-wider uppercase font-extrabold border transition-all ${
                showAssistant 
                  ? "bg-indigo-950/20 text-indigo-400 border-indigo-500/20" 
                  : "bg-white/5 text-white/40 border-white/5"
              }`}
            >
              {showAssistant ? "Injected" : "Excluded"}
            </button>
          </div>
        </div>

      </div>

      {/* CENTER & RIGHT COLUMN: The Live interactive 60 FPS Mockup Preview Iframe canvas (Grid Span 8) */}
      <div className="lg:col-span-8 flex flex-col gap-6 relative z-10">
        
        {/* Device Mode controller & Diagnostic header */}
        <div className="p-4 rounded-2xl border border-white/[0.03] bg-[#0c0c0e]/30 backdrop-blur-2xl flex flex-col sm:flex-row justify-between items-center gap-4 relative">
          
          <div className="flex items-center gap-2.5">
            <Layout className="w-4 h-4 text-white/40" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] tracking-[0.15em] font-mono text-white/70 uppercase leading-none">Interactive Showcase</span>
              <span className="text-[9px] text-white/40 mt-0.5 uppercase tracking-wider font-sans font-light">Custom Mockup Render</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setDeviceMode("desktop"); addLog("[DESIGN] Switched mockup canvas to Desktop mode"); }}
              className={`p-2 rounded-xl transition-all ${deviceMode === "desktop" ? "bg-white text-black" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setDeviceMode("mobile"); addLog("[DESIGN] Switched mockup canvas to Mobile mode"); }}
              className={`p-2 rounded-xl transition-all ${deviceMode === "mobile" ? "bg-white text-black" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              title="Smartphone View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <span className="w-[1px] h-6 bg-white/10 mx-1" />
            <span className="text-[9px] font-mono uppercase bg-white/[0.06] border border-white/10 px-2 py-1 rounded text-white/70">
              {activeAesthetic.toUpperCase()} // APP_{activeCompany.toUpperCase()}
            </span>
          </div>

        </div>

        {/* MOCKUP CONTAINER WITH REAL TIME CSS ADJUSTMENTS */}
        <div className="flex justify-center items-center w-full min-h-[580px] bg-black/80 rounded-[2.5rem] border border-white/[0.05] relative overflow-hidden p-4 md:p-8">
          
          {/* Subtle luxurious grid alignment lines directly behind the mockup */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] opacity-45 pointer-events-none" />

          {/* Shimmering gloss sweep inside the canvas background */}
          <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />

          {/* 3D viewport canvas wrap */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={`relative transition-all duration-700 ease-out border shadow-2xl rounded-3xl overflow-hidden scrollbar-none flex flex-col ${
              deviceMode === "mobile" 
                ? "w-[325px] h-[550px] text-xxs" 
                : "w-full min-h-[460px] h-auto text-xs"
            } ${
              activeAesthetic === "cosmic" 
                ? "bg-[#0b0c16] border-neutral-800" 
                : activeAesthetic === "swiss"
                  ? "bg-white text-black border-transparent"
                  : activeAesthetic === "tech"
                    ? "bg-black border-zinc-700 font-mono"
                    : "bg-[#0c0905] border-amber-900/40"
            }`}
            style={{
              boxShadow: activeAesthetic === "cosmic" 
                ? `0 35px 100px -15px rgba(6, 182, 212, ${glowStrength * 0.0015})` 
                : activeAesthetic === "luxe"
                  ? `0 35px 100px -15px rgba(245, 158, 11, ${glowStrength * 0.001})`
                  : activeAesthetic === "tech"
                    ? "0 25px 70px -10px rgba(255,255,255,0.04)"
                    : "0 25px 70px -10px rgba(0,0,0,0.95)"
            }}
          >
            {/* Glass refraction layer overlay in Obsidian/Luxe themes */}
            {glassReflection && (activeAesthetic === "cosmic" || activeAesthetic === "luxe") && (
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none mix-blend-overlay z-[15]" />
            )}

            {/* Simulated browser menu bar / device header */}
            <div className={`p-3 border-b flex items-center justify-between select-none z-[16] ${
              activeAesthetic === "swiss"
                ? "bg-gray-100 border-gray-200 text-black"
                : activeAesthetic === "tech"
                  ? "bg-neutral-950 border-zinc-800 text-zinc-500"
                  : "bg-black/40 border-white/[0.05]"
            }`}>
              {/* Dot navigation indicators */}
              <div className="flex gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${activeAesthetic === "swiss" ? "bg-neutral-300" : "bg-white/10"}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${activeAesthetic === "swiss" ? "bg-neutral-300" : "bg-white/10"}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${activeAesthetic === "swiss" ? "bg-neutral-300" : "bg-white/10"}`} />
              </div>

              {/* Simulated active secure browser URL address */}
              <div className="flex items-center gap-3">
                <div className={`px-4 py-0.5 rounded-md text-[9px] flex items-center gap-1.5 ${
                  activeAesthetic === "swiss"
                    ? "bg-white text-gray-700"
                    : "bg-white/[0.03] text-white/40 border border-white/5"
                }`}>
                  <Lock className={`w-2.5 h-2.5 ${activeAesthetic === "swiss" ? "text-gray-400" : "text-emerald-500"}`} />
                  <span>{`${company.title.toLowerCase().replace(/\s+/g, '')}.global`}</span>
                </div>
              </div>

              {/* Dynamic decorative status code label */}
              <span className="text-[8px] font-mono opacity-30 select-none">
                {activeAesthetic.toUpperCase()}_v1.0
              </span>
            </div>

            {/* MOCKUP PAGE BODY CONTENT */}
            <div className={`p-6 md:p-8 flex-1 flex flex-col justify-between relative overflow-hidden transition-all duration-500 ${
              fontKerning === "wide" ? "tracking-widest" : "tracking-normal"
            }`}>


              
              {/* Giant background typography for Swiss and Brutalist aesthetics */}
              {activeAesthetic === "swiss" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-black text-black/[0.02] text-[18vw] leading-none pointer-events-none select-none z-0 tracking-tighter">
                  NXS
                </div>
              )}
              {activeAesthetic === "tech" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-white/[0.015] text-[15vw] leading-none pointer-events-none select-none z-0">
                  SYS_90
                </div>
              )}

              {/* Ambient backdrop glowing nodes behind mockup elements */}
              {activeAesthetic === "cosmic" && (
                <div 
                  className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none mix-blend-screen opacity-50 blur-[50px] transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle, rgba(34,211,238,0.2) 0%, rgba(139,92,246,0.1) 60%, transparent 100%)`,
                    filter: `blur(${110 - glowStrength}px)`,
                    transform: `translate3d(-50%, -50%, 0) scale(${0.5 + glowStrength * 0.015})`
                  }}
                />
              )}
              {activeAesthetic === "luxe" && (
                <div 
                  className="absolute top-1/3 right-10 w-48 h-48 rounded-full pointer-events-none mix-blend-screen opacity-15 blur-[60px] transition-all duration-700" 
                  style={{
                    background: `radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 80%)`,
                    filter: `blur(${100 - glowStrength}px)`
                  }}
                />
              )}

              {/* SECTION A: MOCKUP HEADER / LOGO BAR */}
              <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  {/* Decorative Logo Node */}
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                    activeAesthetic === "swiss"
                      ? "bg-black text-white"
                      : activeAesthetic === "cosmic"
                        ? "bg-cyan-500 shadow-[0_0_8px_cyan] text-black"
                        : activeAesthetic === "tech"
                          ? "border border-zinc-500 text-white"
                          : "bg-amber-600/20 border border-amber-500/30 text-amber-300"
                  }`}>
                    {activeCompany === "ai" ? <Layers className="w-3.5 h-3.5" /> : <Component className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`font-sans font-black text-xs uppercase tracking-widest ${
                    activeAesthetic === "swiss" ? "text-black" : "text-white"
                  }`}>
                    {company.title}
                  </span>
                </div>

                {/* Navigation simulation */}
                <div className={`hidden sm:flex items-center gap-4 text-[9px] uppercase tracking-wider font-semibold ${
                  activeAesthetic === "swiss" ? "text-black/55" : "text-white/45"
                }`}>
                  <span className={`hover:text-cyan-400 cursor-pointer transition-colors ${activeAesthetic === "swiss" ? "hover:text-black hover:underline" : ""}`}>Systems</span>
                  <span className={`hover:text-cyan-400 cursor-pointer transition-colors ${activeAesthetic === "swiss" ? "hover:text-black hover:underline" : ""}`}>Token</span>
                  <span className={`hover:text-cyan-400 cursor-pointer transition-colors ${activeAesthetic === "swiss" ? "hover:text-black hover:underline" : ""}`}>Research</span>
                </div>

                <div className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase ${
                  activeAesthetic === "swiss"
                    ? "bg-black text-white"
                    : activeAesthetic === "tech"
                      ? "border border-white/30 text-white"
                      : "bg-white/[0.06] text-white/80 border border-white/15"
                }`}>
                  ONLINE
                </div>
              </div>

              {/* SECTION B: HERO HEADLINES & CALLOUT (MAIN BODY) */}
              <div className="my-8 md:my-10 relative z-10 text-left flex flex-col justify-center">
                
                {/* Micro badge indicator */}
                <div className={`inline-flex items-center gap-1.5 mb-3 px-2.5 py-0.5 rounded-full w-fit ${
                  activeAesthetic === "swiss" ? "bg-gray-100 text-black border border-black/5" : "bg-white/[0.02] border border-white/5"
                }`}>
                  <Sparkles className={`w-3 h-3 ${activeAesthetic === "swiss" ? "text-black" : "text-cyan-400"} animate-pulse`} />
                  <span className="text-[8px] md:text-[9px] uppercase font-bold tracking-widest leading-none">
                    {company.tagline}
                  </span>
                </div>

                {/* Interactive Dynamic H1 Heading */}
                <h1 className={`text-xl md:text-3.5xl font-black leading-tight tracking-tight ${
                  activeAesthetic === "swiss"
                    ? "text-black"
                    : activeAesthetic === "luxe"
                      ? "text-amber-100 font-sans"
                      : "text-white"
                }`}>
                  {submittedBrief ? (
                    <span className="text-cyan-400">{submittedBrief.slogan}</span>
                  ) : activeCompany === "ai" ? (
                    <>Deploying Cognitive <span className="text-cyan-400">Logic Streams</span> at Global Scale</>
                  ) : activeCompany === "biotech" ? (
                    <>Custom <span className="text-amber-500 font-sans">Molecular Models</span> and Atomic Folding</>
                  ) : activeCompany === "venture" ? (
                    <>Underwriting tomorrow's next <span className="text-indigo-400">paradigm breakthroughs</span></>
                  ) : (
                    <>Bespoke <span className="text-white underline underline-offset-4 decoration-neutral-800">Spatial Systems</span> & brand typography</>
                  )}
                </h1>

                {/* Sub narrative descriptor */}
                <p className={`text-[10px] md:text-xs mt-4 leading-relaxed max-w-md ${
                  activeAesthetic === "swiss" ? "text-black/70 font-normal" : "text-white/55"
                }`}>
                  {company.desc} Combined with continuous database telemetry tracking and ultra-redundant cluster endpoints.
                </p>

                {/* Dynamic Call to Action button */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-6">
                  <button className={`px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.03] shadow group cursor-pointer flex items-center gap-1.5 ${
                    activeAesthetic === "swiss"
                      ? "bg-black text-white hover:bg-neutral-800"
                      : activeAesthetic === "cosmic"
                        ? "bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.18)] hover:bg-cyan-100"
                        : activeAesthetic === "tech"
                          ? "bg-neutral-900 text-white border border-zinc-700 hover:bg-white/5"
                          : "bg-amber-600 text-white hover:bg-amber-500"
                  }`}>
                    <span>{company.cta}</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <span className={`text-[8.5px] md:text-[9.5px] font-mono uppercase ${
                    activeAesthetic === "swiss" ? "text-black/50" : "text-white/40"
                  }`}>
                    {company.sub}
                  </span>
                </div>

              </div>

              {/* SECTION C: EXTRA FEATURE BLOCKS (Landing/Pricing/Blog selected states) */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-t border-white/5 pt-5 mb-4">
                
                {selectedFeatures.includes("landing") && (
                  <div className={`p-3 rounded-xl ${
                    activeAesthetic === "swiss" ? "bg-gray-100 text-black border border-black/5" : "bg-neutral-900/40 border border-white/5"
                  }`}>
                    <span className="text-[8px] font-mono opacity-40 uppercase block">01 / CAPTURE</span>
                    <span className="text-[10px] font-bold block mt-1">Multi-Region Edge</span>
                    <span className="text-[8.5px] opacity-60 block mt-0.5 leading-tight">Fast static deployment files.</span>
                  </div>
                )}

                {selectedFeatures.includes("pricing") && (
                  <div className={`p-3 rounded-xl ${
                    activeAesthetic === "swiss" ? "bg-gray-100 text-black border border-black/5" : "bg-neutral-900/40 border border-white/5"
                  }`}>
                    <span className="text-[8px] font-mono opacity-40 uppercase block">02 / BILLING</span>
                    <span className="text-[10px] font-bold block mt-1">SLA Metering</span>
                    <span className="text-[8.5px] opacity-60 block mt-0.5 leading-tight">Built-in secure Stripe routing.</span>
                  </div>
                )}

                {selectedFeatures.includes("blog") && (
                  <div className={`p-3 rounded-xl ${
                    activeAesthetic === "swiss" ? "bg-gray-100 text-black border border-black/5" : "bg-neutral-900/40 border border-white/5"
                  }`}>
                    <span className="text-[8px] font-mono opacity-40 uppercase block">03 / TELEMETRY</span>
                    <span className="text-[10px] font-bold block mt-1">Live Analytics</span>
                    <span className="text-[8.5px] opacity-60 block mt-0.5 leading-tight">60 FPS performance tracking.</span>
                  </div>
                )}

              </div>

              {/* FLOATING MINI AI CHATBOT SIMULATOR (If toggled) */}
              <AnimatePresence>
                {showAssistant && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className={`absolute bottom-4 right-4 p-3 rounded-2xl shadow-xl z-25 flex items-center gap-2 border ${
                      activeAesthetic === "swiss"
                        ? "bg-white text-black border-neutral-300"
                        : "bg-neutral-950 border-white/10"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-[8.5px] font-bold font-mono text-emerald-400 capitalize">Conversational Copilot</span>
                      <span className="text-[7.5px] opacity-60 leading-none">Awaiting telemetry inputs...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </motion.div>

        </div>

        {/* 4. DESIGN BRIEF RFQ GENERATOR BOX (BOTTOM) */}
        <div className="p-6 md:p-8 rounded-3xl border border-white/[0.05] bg-neutral-950/40 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-white/5">
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wide">Brand Brief Builder</h3>
              <p className="text-[11px] text-white/50">Describe your company specs to generate an architectural web framework contract quotation.</p>
            </div>
            
            {/* Dynamic feature block configuration buttons */}
            <div className="flex items-center gap-1.5">
              {[
                { id: "landing", label: "Edge Landings" },
                { id: "pricing", label: "Stripe Metering" },
                { id: "blog", label: "Live Telemetry" }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => toggleFeature(b.id)}
                  className={`text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg border transition-all ${
                    selectedFeatures.includes(b.id)
                      ? "bg-white text-black border-white"
                      : "bg-white/[0.01] hover:bg-white/[0.04] border-white/5 text-white/60"
                  }`}
                >
                  {selectedFeatures.includes(b.id) ? "✓ " : "+ "} {b.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmitBrief} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4 flex flex-col gap-1.5 text-left">
              <label className="text-[9px] font-mono uppercase tracking-widest text-white/40">Enterprise Client Identifier</label>
              <input 
                type="text" 
                placeholder="e.g. Nexus Computing Systems"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.06] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs outline-none transition-all placeholder:text-white/15"
              />
            </div>

            <div className="md:col-span-5 flex flex-col gap-1.5 text-left">
              <label className="text-[9px] font-mono uppercase tracking-widest text-white/40">Custom Brand CTA Slogan Accent</label>
              <input 
                type="text" 
                placeholder="e.g. Forging the next computational boundaries"
                value={customSlogan}
                onChange={(e) => setCustomSlogan(e.target.value)}
                className="w-full bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.06] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs outline-none transition-all placeholder:text-white/15"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingBrief || !clientName}
              className={`md:col-span-3 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 ${
                isSubmittingBrief 
                  ? "bg-neutral-800 text-white/50" 
                  : "bg-cyan-400 text-black hover:bg-cyan-300 cursor-pointer hover:shadow-[0_0_12px_rgba(34,211,238,0.4)]"
              }`}
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>{isSubmittingBrief ? "Generating..." : "Generate Brief"}</span>
            </button>
          </form>

          {/* GENERATED BRIEF BRIEFCASE DROPDOWN DISPLAY */}
          <AnimatePresence>
            {submittedBrief && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden mt-6"
              >
                <div className="p-6 rounded-2xl bg-[#0c0c0e]/40 border border-white/[0.04] flex flex-col md:flex-row md:items-stretch gap-6 relative justify-between">
                  
                  <div className="text-left flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-white/50 font-mono text-[9px] uppercase tracking-[0.15em]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white/40 shrink-0" />
                        <span>Specification {submittedBrief.id} Verified</span>
                      </div>

                      <h4 className="text-base font-medium mt-3 text-white tracking-tight">
                        {submittedBrief.client} Specs Package
                      </h4>
                    </div>

                    <div className="font-mono text-[9px] uppercase space-y-2 mt-5 pt-4 border-t border-white/[0.03] text-white/40">
                      <div className="flex justify-between max-w-xs"><span>Aesthetic Theme:</span> <strong className="text-white/80 font-medium">{submittedBrief.aesthetic.toUpperCase()}</strong></div>
                      <div className="flex justify-between max-w-xs"><span>Integration Core:</span> <strong className="text-white/80 font-medium">{getCompanyLabel(submittedBrief.company).toUpperCase()}</strong></div>
                      <div className="flex justify-between max-w-xs"><span>Selected Modules:</span> <strong className="text-white/80 font-medium">{submittedBrief.features.join(", ")}</strong></div>
                    </div>
                  </div>

                  {/* Pricing and parameters summary card segment */}
                  <div className="p-5 rounded-xl bg-white/[0.01] border border-white/[0.03] flex flex-col justify-between h-auto min-h-[140px] md:w-64 text-left">
                    <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase pb-2.5 border-b border-white/[0.03]">
                      <span>SCHEDULE</span>
                      <span className="text-white font-medium">{submittedBrief.estDelivery}</span>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="text-left">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider block">Est. Infrastructure</span>
                        <span className="text-[11px] font-medium text-white/70 block mt-0.5">{submittedBrief.metricEst || "Custom Site"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8.5px] font-mono text-white/30 uppercase tracking-wider block">Investment</span>
                        <span className="text-base font-bold text-white block tracking-tight mt-0.5">{submittedBrief.estInvestment}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
};
