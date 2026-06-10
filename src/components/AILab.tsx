import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Sliders,
  Cpu,
  Layers,
  Activity,
  Check,
  RefreshCw,
  X,
  Plus,
  AlertCircle
} from "lucide-react";
import { AutomationPreset, GlowVariant, Specimen } from "../types";

interface AILabProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSpecimen: (specimen: Specimen) => void;
}

export const AILab: React.FC<AILabProps> = ({ isOpen, onClose, onAddSpecimen }) => {
  const [prompt, setPrompt] = useState("");
  const [preset, setPreset] = useState<AutomationPreset>("workflow");
  const [glow, setGlow] = useState<GlowVariant>("cosmic");
  const [complexity, setComplexity] = useState(82);
  const [symmetry, setSymmetry] = useState(6);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState("");
  const [sculpted, setSculpted] = useState<Specimen | null>(null);

  const presetImages: Record<AutomationPreset, string> = {
    workflow: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    chatbot: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=800",
    webdesign: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    agents: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  };

  const steps = [
    "Analyzing custom business workspace layout...",
    "Injecting conversational NLP models & training logs...",
    "Compiling responsive, high-end web design frames...",
    "Seeding active Google Sheets & Stripe API endpoints...",
    "Synchronizing live chatbot and webhook routes...",
  ];

  const handleSculpt = () => {
    setIsProcessing(true);
    setProgress(0);
    setProgressStep(steps[0]);
    setSculpted(null);
  };

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        const currentStepIdx = Math.min(
          Math.floor((next / 100) * steps.length),
          steps.length - 1
        );
        setProgressStep(steps[currentStepIdx]);

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const calculatedSilica = parseFloat(((complexity * 1.22) + (symmetry * 3.5)).toFixed(1));
            const calculatedLumens = glow === "cosmic" ? 180 : glow === "dawn" ? 430 : glow === "eclipse" ? 95 : 880;
            const seedName = prompt.trim() || `ARKA ${preset.toUpperCase()} System`;
            
            const newSpecimen: Specimen = {
              id: Math.random().toString(36).substr(2, 9),
              name: seedName,
              preset,
              glow,
              complexity,
              symmetry,
              silicaContent: calculatedSilica,
              lumens: calculatedLumens,
              imageUrl: presetImages[preset],
              statusText: "Operational pipeline synchronised successfully at edge nodes",
            };
            setSculpted(newSpecimen);
            setIsProcessing(false);
          }, 300);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isProcessing, preset, glow, complexity, symmetry, prompt]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] liquid-glass-strong flex flex-col text-white relative"
          >
            {/* Glossy Apple high-contrast glare refraction overlay */}
            <div className="absolute inset-0 apple-spotlight-bg opacity-30 z-0 pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-white/80 animate-pulse animate-[spin_8s_linear_infinite]" />
                <div>
                  <h2 className="font-sans font-semibold text-lg leading-none">ARKA Automation Lab</h2>
                  <p className="text-xs text-white/50 mt-1">Configure intelligent chatbots, customized CRM flows, and responsive layouts</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-transform cursor-pointer"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* Split Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {/* Left Controls Column */}
              <div className="flex flex-col gap-6">
                {/* Prompt Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-wider uppercase text-white/40 font-bold text-left">
                    Core Business Objective
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Automate client intake, sync CRM contacts, and deploy interactive web app."
                      className="w-full px-4 py-3 bg-white/[0.03] rounded-2xl border-none outline-none focus:bg-white/[0.06] transition-colors text-xs text-white/90 placeholder-white/20"
                    />
                  </div>
                </div>

                {/* Preset Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-wider uppercase text-white/40 font-bold text-left">
                    Implementation Matrix
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "workflow", name: "AI Web Workflows" },
                      { id: "chatbot", name: "Conversational Bots" },
                      { id: "webdesign", name: "Award-winning WebDesign" },
                      { id: "agents", name: "Autonomous Agents" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setPreset(item.id as AutomationPreset)}
                        className={`p-3 text-left rounded-xl transition-all cursor-pointer ${
                          preset === item.id
                            ? "bg-white/[0.08] text-white shadow-inner"
                            : "bg-white/[0.01] text-white/60 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="text-xs font-semibold block">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="bg-white/[0.01] rounded-2xl p-4 flex flex-col gap-3.5 border border-white/5">
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="flex justify-between text-xs font-bold text-white/50">
                      <span className="flex items-center gap-1.5"><Sliders className="w-3 h-3" /> System Reliability Index</span>
                      <span>{complexity}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={complexity}
                      onChange={(e) => setComplexity(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="flex justify-between text-xs font-bold text-white/50">
                      <span className="flex items-center gap-1.5"><Layers className="w-3 h-3" /> Connected Webhooks / API Endpoints</span>
                      <span>{symmetry} nodes</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="16"
                      value={symmetry}
                      onChange={(e) => setSymmetry(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>

                {/* Glow Option */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-wider uppercase text-white/40 font-bold text-left">
                    Hosting Backbone
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "cosmic", label: "Edge Accelerated CJS" },
                      { id: "dawn", label: "Multi-Region Cloud Sync" },
                      { id: "eclipse", label: "ISO-27001 Enterprise" },
                      { id: "aurora", label: "Smart Cognitive Route" },
                    ].map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setGlow(variant.id as GlowVariant)}
                        className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                          glow === variant.id
                            ? "bg-white text-black font-extrabold shadow-md scale-102"
                            : "bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
                        }`}
                      >
                        {variant.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Trigger */}
                <button
                  onClick={handleSculpt}
                  disabled={isProcessing}
                  className="w-full mt-auto py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Synchronizing Router...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      Manifest Automation Solution
                    </>
                  )}
                </button>
              </div>

              {/* Right Render Sandbox Column */}
              <div className="rounded-[2.5rem] bg-black/40 border border-white/5 relative flex flex-col overflow-hidden justify-center items-center min-h-[300px] p-6 text-center">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 w-full"
                    >
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-white/10 border-t-white animate-spin" />
                        <Activity className="w-6 h-6 text-white/80 animate-pulse" />
                      </div>
                      <div className="text-xs font-semibold tracking-wide text-white/80 mt-2 font-mono">
                        {progressStep}
                      </div>
                      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-white"
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                          transition={{ ease: "easeInOut" }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-white/40">{progress}% compiled</span>
                    </motion.div>
                  ) : sculpted ? (
                    <motion.div
                      key="sculpted"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col h-full w-full justify-between"
                    >
                      {/* Crystalline Image Preview */}
                      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden group">
                        <img
                          src={sculpted.imageUrl}
                          alt={sculpted.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                        
                        {/* Dynamic glow overlay based on variant */}
                        <div className={`absolute inset-0 transition-opacity duration-750 pointer-events-none mix-blend-screen opacity-45 ${
                          sculpted.glow === "aurora" ? "bg-gradient-to-tr from-cyan-950/20 via-white/5 to-transparent" :
                          sculpted.glow === "dawn" ? "bg-gradient-to-tr from-orange-950/20 via-neutral-100/5 to-transparent" :
                          "bg-transparent"
                        }`} />

                        {/* Plant Label Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 text-left">
                          <span className="text-[9px] tracking-widest text-white/50 uppercase font-semibold">ARKA LIVE CLONE READY</span>
                          <h4 className="text-sm font-bold text-white tracking-tight leading-tight truncate">
                            {sculpted.name}
                          </h4>
                        </div>
                      </div>

                      {/* Technical specifications */}
                      <div className="mt-4 grid grid-cols-2 gap-2 text-left">
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] uppercase tracking-wider text-white/40 block font-semibold">Execution Pacing</span>
                          <span className="text-xs font-bold font-mono text-white/95">{sculpted.silicaContent} tasks/sec</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] uppercase tracking-wider text-white/40 block font-semibold">API Latency</span>
                          <span className="text-xs font-bold font-mono text-white/95">{sculpted.lumens} ms</span>
                        </div>
                      </div>

                      {/* Add specimen trigger */}
                      <button
                        onClick={() => {
                          onAddSpecimen(sculpted);
                          onClose();
                        }}
                        className="w-full mt-4 py-2.5 bg-white/10 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/15 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Save Schema to Cloud Console
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3 p-6"
                    >
                      <div className="w-12 h-12 rounded-full border border-white/5 bg-white/[0.01] flex items-center justify-center mb-1 animate-pulse">
                        <Cpu className="w-5 h-5 text-white/30" />
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">Awaiting Deployment Parameters</h3>
                      <p className="text-xs text-white/40 max-w-[240px]">
                        Custom-tune client inputs, select the implementation framework, and compile custom pipelines to simulate live endpoints here.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
