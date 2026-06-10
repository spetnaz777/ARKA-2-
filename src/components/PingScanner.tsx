import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Terminal, 
  Globe, 
  Wifi, 
  Zap, 
  RefreshCw, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Check
} from "lucide-react";

interface PingScannerProps {
  theme: "black" | "slate";
  addLog: (text: string) => void;
}

interface EdgeNode {
  id: string;
  location: string;
  region: string;
  basePing: number;
  currentPing?: number;
  status: "idle" | "pinging" | "success" | "warning";
  jitter: number;
}

export const PingScanner: React.FC<PingScannerProps> = ({ theme, addLog }) => {
  // Input domain state
  const [targetUrl, setTargetUrl] = useState("systems.global");
  const [activePreset, setActivePreset] = useState("systems.global");

  // Ping scan task states
  const [isPinging, setIsPinging] = useState(false);
  const [pingStep, setPingStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [scannedNodes, setScannedNodes] = useState<EdgeNode[]>([
    { id: "node-us", location: "SFO Gateway (USA West)", region: "us-west", basePing: 18, jitter: 1.2, status: "idle" },
    { id: "node-eu", location: "LDN Interface (Europe North)", region: "eu-north", basePing: 72, jitter: 2.4, status: "idle" },
    { id: "node-jp", location: "TKY Core Router (Asia East)", region: "ap-east", basePing: 124, jitter: 4.1, status: "idle" },
    { id: "node-sg", location: "SGP Exchange (Asia South)", region: "ap-south", basePing: 168, jitter: 3.8, status: "idle" },
    { id: "node-au", location: "SYD Node (Oceania)", region: "oc-east", basePing: 215, jitter: 5.6, status: "idle" },
    { id: "node-sa", location: "SAO Hub (South America)", region: "sa-east", basePing: 145, jitter: 4.8, status: "idle" },
  ]);

  const [pingStats, setPingStats] = useState<{
    min: number;
    max: number;
    avg: number;
    loss: number;
    jitter: number;
    grade: string;
  } | null>(null);

  // Speed test simulation states
  const [speedStage, setSpeedStage] = useState<"idle" | "ping" | "download" | "upload" | "done">("idle");
  const [speedProgress, setSpeedProgress] = useState(0);
  const [currentSpeedValue, setCurrentSpeedValue] = useState(0);
  const [speedMetrics, setSpeedMetrics] = useState({
    ping: 0,
    jitter: 0,
    download: 0,
    upload: 0,
    isp: "ARKA Core Node #023",
    ip: "107.12.84.149"
  });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Quick preset options
  const presets = [
    { label: "ARKA Core", value: "systems.global" },
    { label: "Google Cloud", value: "gcp.google.com" },
    { label: "GitHub API", value: "api.github.com" },
    { label: "Cloudflare Edge", value: "cloudflare.com" },
  ];

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Clean URLs
  const cleanDomain = (url: string) => {
    return url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
  };

  const handlePresetSelect = (value: string) => {
    setActivePreset(value);
    setTargetUrl(value);
  };

  // Launch Ping Scan
  const startPingScan = () => {
    if (isPinging) return;
    setIsPinging(true);
    setPingStats(null);
    setTerminalLogs([]);

    const domain = cleanDomain(targetUrl || "systems.global");
    addLog(`[DIAG] Initiated edge ICMP ping scan for: ${domain}`);

    setTerminalLogs([
      `[SYS] ARKA Central Probe routing node starting ping scan...`,
      `[SYS] Domain resolved: ${domain}`,
      `[SYS] Query Type: ICMP IPV4_ECHO_REQUEST via global anycast subnet...`,
      `================================================================`
    ]);

    // Reset nodes to idle
    setScannedNodes(prev => prev.map(node => ({ ...node, status: "idle", currentPing: undefined })));

    let currentLogIndex = 0;
    const intervalTime = 600;

    const pingTimeout = setTimeout(() => {
      // Step 1: probe US west
      setScannedNodes(prev => prev.map(n => n.id === "node-us" ? { ...n, status: "pinging" } : n));
      setTerminalLogs(prev => [...prev, `[PROBE: us-west] dispatching ICMP payload packet [32 bytes] to ${domain}...`]);

      setTimeout(() => {
        const ping = Math.round(18 + Math.random() * 5);
        setScannedNodes(prev => prev.map(n => n.id === "node-us" ? { ...n, status: "success", currentPing: ping } : n));
        setTerminalLogs(prev => [...prev, `[REPLY: us-west] resolved from SFO Gateway in ${ping}ms (ttl=56)`]);
      }, 500);
    }, intervalTime * 1);

    setTimeout(() => {
      // Step 2: probe EU north
      setScannedNodes(prev => prev.map(n => n.id === "node-eu" ? { ...n, status: "pinging" } : n));
      setTerminalLogs(prev => [...prev, `[PROBE: eu-north] negotiating secure TLS node handshake with LDN Interface...`]);

      setTimeout(() => {
        const ping = Math.round(72 + Math.random() * 10);
        setScannedNodes(prev => prev.map(n => n.id === "node-eu" ? { ...n, status: "success", currentPing: ping } : n));
        setTerminalLogs(prev => [...prev, `[REPLY: eu-north] connection established in ${ping}ms under global SLA`]);
      }, 550);
    }, intervalTime * 3);

    setTimeout(() => {
      // Step 3: probe AP east
      setScannedNodes(prev => prev.map(n => n.id === "node-jp" ? { ...n, status: "pinging" } : n));
      setTerminalLogs(prev => [...prev, `[PROBE: ap-east] routing packets across transpacific backbone gateway...`]);

      setTimeout(() => {
        const ping = Math.round(124 + Math.random() * 12);
        setScannedNodes(prev => prev.map(n => n.id === "node-jp" ? { ...n, status: "success", currentPing: ping } : n));
        setTerminalLogs(prev => [...prev, `[REPLY: ap-east] response from TKY Core Router in ${ping}ms (jitter: 1.4ms)`]);
      }, 600);
    }, intervalTime * 5);

    setTimeout(() => {
      // Step 4: probe remaining nodes in bulk
      setScannedNodes(prev => prev.map(n => 
        ["node-sg", "node-au", "node-sa"].includes(n.id) ? { ...n, status: "pinging" } : n
      ));
      setTerminalLogs(prev => [...prev, `[ASYNC-DIAG] broadcasting telemetry signals to Singapore, Sydney, & Sao Paulo...`]);

      setTimeout(() => {
        setScannedNodes(prev => prev.map(n => {
          if (n.id === "node-sg") return { ...n, status: "success", currentPing: Math.round(168 + Math.random() * 15) };
          if (n.id === "node-au") return { ...n, status: "warning", currentPing: Math.round(215 + Math.random() * 20) };
          if (n.id === "node-sa") return { ...n, status: "success", currentPing: Math.round(145 + Math.random() * 14) };
          return n;
        }));
        setTerminalLogs(prev => [
          ...prev, 
          `[REPLY: ap-south] SGP Exchange completed roundtrip: 171ms`,
          `[REPLY: oc-east] SYD Node ping threshold alert: 228ms (high deviation)`,
          `[REPLY: sa-east] SAO Hub completed roundtrip: 149ms`
        ]);
      }, 700);
    }, intervalTime * 7);

    setTimeout(() => {
      // Final formulation
      setTerminalLogs(prev => [
        ...prev,
        `================================================================`,
        `[SUCCESS] Ping scan successfully compiled! Code SLA parity: OPTIMAL`,
        `[SYS] Transmitting secure gateway log signature: ark_ping_sec_k9...`
      ]);

      // Calculate sample stats
      setPingStats({
        min: 18,
        max: 228,
        avg: 122,
        loss: 0,
        jitter: 3.2,
        grade: "A- Grade"
      });
      setIsPinging(false);
      addLog(`[SUCCESS] Ping diagnostic completed for ${domain}. Avg latency: 122ms.`);
    }, intervalTime * 10);
  };

  // Run Network Speed Test
  const runSpeedTest = () => {
    if (speedStage !== "idle" && speedStage !== "done") return;
    
    setSpeedStage("ping");
    setSpeedProgress(0);
    setCurrentSpeedValue(0);
    setSpeedMetrics(prev => ({ ...prev, ping: 0, jitter: 0, download: 0, upload: 0 }));
    addLog("[DIAG] Starting ARKA Core corporate bandwidth speed test simulation...");

    let counter = 0;
    
    // Stage 1: Ping / Jitter
    const pingInterval = setInterval(() => {
      counter += 10;
      setSpeedProgress(counter);
      setCurrentSpeedValue(Math.round(10 + Math.random() * 15));
      if (counter >= 100) {
        clearInterval(pingInterval);
        const finalPing = Math.round(12 + Math.random() * 4);
        const finalJitter = parseFloat((0.8 + Math.random() * 1.5).toFixed(1));
        setSpeedMetrics(prev => ({ ...prev, ping: finalPing, jitter: finalJitter }));
        
        // Setup state for Download Test
        setSpeedStage("download");
        setSpeedProgress(0);
        counter = 0;
        
        // Stage 2: Download Banwidth (Spikes up to high Mbps)
        const downloadInterval = setInterval(() => {
          counter += 4;
          setSpeedProgress(counter);
          // Curve that spikes and fluctuates
          let currentDl = 0;
          if (counter < 40) {
            currentDl = Math.round((counter / 40) * 350 + Math.random() * 40);
          } else {
            currentDl = Math.round(350 + Math.random() * 90);
          }
          setCurrentSpeedValue(currentDl);

          if (counter >= 100) {
            clearInterval(downloadInterval);
            const finalDl = Math.round(412.5 + Math.random() * 25);
            setSpeedMetrics(prev => ({ ...prev, download: finalDl }));

            // Setup state for Upload Test
            setSpeedStage("upload");
            setSpeedProgress(0);
            counter = 0;

            // Stage 3: Upload Bandwidth
            const uploadInterval = setInterval(() => {
              counter += 5;
              setSpeedProgress(counter);
              let currentUl = 0;
              if (counter < 40) {
                currentUl = Math.round((counter / 40) * 150 + Math.random() * 20);
              } else {
                currentUl = Math.round(150 + Math.random() * 35);
              }
              setCurrentSpeedValue(currentUl);

              if (counter >= 100) {
                clearInterval(uploadInterval);
                const finalUl = Math.round(180.2 + Math.random() * 12);
                setSpeedMetrics(prev => ({ ...prev, upload: finalUl }));
                
                // Done!
                setSpeedStage("done");
                addLog(`[SUCCESS] Speed Test complete: DL ${finalDl} Mbps / UL ${finalUl} Mbps.`);
              }
            }, 100);
          }
        }, 100);
      }
    }, 150);
  };

  // Radial Gauge circular math
  const maxGaugeVal = speedStage === "upload" ? 250 : 600;
  const currentRatio = Math.min(1, currentSpeedValue / maxGaugeVal);
  const strokeDashoffset = 251.2 - 251.2 * currentRatio;

  const currentThemeClasses = {
    bgGlass: theme === "slate" 
      ? "bg-slate-950/20 border-blue-500/10" 
      : "bg-white/[0.01] border-white/5",
    terminalBg: theme === "slate"
      ? "bg-slate-950/80 border-blue-500/15 text-blue-300"
      : "bg-black/80 border-white/10 text-emerald-400",
    buttonPrimary: theme === "slate"
      ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
      : "bg-white text-black hover:bg-neutral-100",
    pillActive: theme === "slate"
      ? "bg-blue-600/20 border-cyan-500/30 text-cyan-400"
      : "bg-white/10 border-white/20 text-white",
    ringColor: theme === "slate" ? "stroke-cyan-400" : "stroke-white",
    accentText: theme === "slate" ? "text-cyan-400" : "text-white"
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* HEADER EXPLANATION ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div className="text-left">
          <span className="text-[10px] tracking-widest uppercase text-white/40 block font-bold mb-1 font-mono">ARKA Secure Route Diagnostics</span>
          <h2 className="font-serif italic text-3xl md:text-5xl text-white/95 leading-none">Diagnostic Scan & Bandwidth</h2>
          <p className="text-xs text-white/50 mt-2 max-w-xl leading-relaxed font-light">
            Measure round-trip server routes across custom edge nodes instantly, analyze packet hops, and execute a live fiber transport speed test simulation.
          </p>
        </div>
        
        {/* Dynamic Telemetry Status badge */}
        <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border text-xs font-mono select-none ${
          theme === "slate" ? "bg-slate-900/40 border-blue-500/15 text-blue-300" : "bg-white/[0.02] border-white/5 text-neutral-300"
        }`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>GATEWAY TUNNEL: ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: ACTIVE INTERACTIVE PING CONTROLLER & TERMINAL LOGS (7 COLUMNS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className={`liquid-glass rounded-[2rem] p-6 md:p-8 border flex flex-col gap-5 relative overflow-hidden ${currentThemeClasses.bgGlass}`}>
            {/* Glossy Apple high-contrast glare refraction overlay */}
            <div className="absolute inset-0 apple-spotlight-bg opacity-30 z-0 pointer-events-none" />
            <div className="flex flex-col gap-2.5 text-left relative z-10">
              <span className="text-[10px] tracking-widest uppercase text-white/40 font-bold block font-mono">ROUTE AUDITING NODE</span>
              <h3 className="font-serif italic text-2xl text-white/90">Multi-Region Ping Scope</h3>
            </div>

            {/* Input URL field box */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex bg-black/40 border border-white/10 rounded-xl p-1.5 focus-within:border-white/20 transition-colors items-center gap-2">
                <div className="pl-3">
                  <Search className="w-4 h-4 text-white/40" />
                </div>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="systems.global"
                  className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/20 p-2 text-left"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") startPingScan();
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startPingScan}
                  disabled={isPinging}
                  className={`px-5 py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
                    isPinging ? "bg-white/10 text-white/40" : currentThemeClasses.buttonPrimary
                  }`}
                >
                  {isPinging ? "Executing..." : "Scan Route"}
                </motion.button>
              </div>

              {/* presets shortcut labels */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-white/30 uppercase font-mono mr-1">Hot targets:</span>
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset.value)}
                    className={`px-3 py-1 rounded-full text-[10px] tracking-wide transition-all border cursor-pointer ${
                      activePreset === preset.value
                        ? currentThemeClasses.pillActive
                        : "bg-white/[0.01] border-white/5 text-white/50 hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live nodes grid results */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {scannedNodes.map((node) => (
                <div 
                  key={node.id} 
                  className={`p-3 rounded-xl bg-black/30 border text-left flex flex-col gap-1 transition-all ${
                    node.status === "pinging"
                      ? "border-cyan-500/40 shadow-lg shadow-cyan-500/5 scale-102"
                      : node.status === "success"
                      ? "border-emerald-500/20"
                      : node.status === "warning"
                      ? "border-amber-500/20"
                      : "border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-wide font-mono text-white/80 lowercase truncate max-w-[85px]">
                      {node.region}.arka
                    </span>
                    
                    {/* Bouncing statuses dot */}
                    <span className="relative flex h-1.5 w-1.5">
                      {node.status === "pinging" && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                        node.status === "pinging" 
                          ? "bg-cyan-400 animate-pulse" 
                          : node.status === "success" 
                          ? "bg-emerald-400" 
                          : node.status === "warning" 
                          ? "bg-amber-400" 
                          : "bg-white/10"
                      }`}></span>
                    </span>
                  </div>
                  
                  <div className="text-xs font-semibold text-white/95 truncate">
                    {node.location.split(" ")[0]}
                  </div>

                  <div className="mt-1 flex items-baseline gap-1 text-[9px] font-mono text-white/40">
                    LATENCY: 
                    <span className={`text-[12px] font-bold ${
                      node.currentPing 
                        ? (node.currentPing < 50 ? "text-emerald-400" : node.currentPing < 150 ? "text-cyan-400" : "text-amber-400") 
                        : "text-white/20"
                    }`}>
                      {node.currentPing ? `${node.currentPing}ms` : "--"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Live Diagnostic ICMP Terminal Output wrapper */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> SECURE TRACEROUTE OUTPUT</span>
                <span>STATE: {isPinging ? "RUNNING_CMD" : "IDLE"}</span>
              </div>
              <div className={`h-[180px] rounded-2xl p-4 font-mono text-[10.5px] overflow-y-auto leading-relaxed text-left border flex flex-col gap-1 ${currentThemeClasses.terminalBg}`}>
                {terminalLogs.length === 0 ? (
                  <span className="text-white/30 italic">Awaiting route probe sequence triggers. Enter target URL above to start...</span>
                ) : (
                  terminalLogs.map((log, index) => (
                    <div key={index} className="whitespace-pre-wrap">{log}</div>
                  ))
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>

            {/* Scorecard metric stats */}
            {pingStats && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-black/40 border border-white/5 rounded-2xl p-4 text-left font-mono"
              >
                <div>
                  <span className="text-[10px] text-white/30 lowercase font-mono">rtt.avg</span>
                  <div className={`text-lg font-bold ${currentThemeClasses.accentText}`}>{pingStats.avg}ms</div>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 lowercase font-mono">rtt.jitter</span>
                  <div className="text-lg font-bold text-white/90">{pingStats.jitter}ms</div>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 lowercase font-mono">packet.loss</span>
                  <div className="text-lg font-bold text-emerald-400">0.0%</div>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 lowercase font-mono">route.grade</span>
                  <div className="text-lg font-bold text-cyan-400 uppercase">{pingStats.grade}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REVOLUTIONARY CIRCULAR SPEED TACHOMETER TESTING COMPONENT (5 COLUMNS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className={`liquid-glass rounded-[2rem] p-6 md:p-8 border flex flex-col justify-between items-center bg-white/[0.01] h-full relative overflow-hidden min-h-[480px] ${currentThemeClasses.bgGlass}`}>
            {/* Glossy Apple high-contrast glare refraction overlay */}
            <div className="absolute inset-0 apple-spotlight-bg opacity-30 z-0 pointer-events-none" />
            
            {/* Header indicators */}
            <div className="w-full flex justify-between items-start text-left relative z-10">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-white/40 block font-bold font-mono">SLA ROUTING SPEED</span>
                <h3 className="font-serif italic text-2xl text-white/90">Bandwidth Test</h3>
              </div>
              
              <div className="text-right text-[10px] font-mono text-white/40">
                <div>SERVER: SFO-WEST</div>
                <div>METHOD: MULTI-THREAD</div>
              </div>
            </div>

            {/* Beautiful Interactive Circular Gauge Speedometer */}
            <div className="relative w-56 h-56 flex flex-col items-center justify-center select-none my-6">
              
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/5 pointer-events-none" />
              <div className={`absolute inset-4 rounded-full border transition-colors duration-500 bg-black/45 pointer-events-none ${
                speedStage === "download" ? "border-cyan-500/10" : speedStage === "upload" ? "border-purple-500/10" : "border-white/5"
              }`} />

              {/* Glowing active center */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-b from-white/[0.01] to-white/[0.08] flex flex-col justify-center items-center z-10 p-4">
                <span className="text-[10px] font-mono tracking-widest text-white/45 block uppercase">
                  {speedStage === "idle" ? "READY" : speedStage === "ping" ? "PING TEST" : speedStage === "download" ? "DOWNLOAD" : speedStage === "upload" ? "UPLOAD" : "COMPLETE"}
                </span>

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`${speedStage}-${currentSpeedValue}`}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-mono font-black text-white leading-none my-1 flex items-baseline justify-center"
                  >
                    {speedStage === "idle" ? "0.0" : speedStage === "ping" ? speedMetrics.ping || currentSpeedValue : currentSpeedValue}
                  </motion.div>
                </AnimatePresence>

                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  {speedStage === "ping" ? "ms LATENCY" : "MBPS BANDWIDTH"}
                </span>

                {/* Simulated dynamic progress bar line */}
                {speedStage !== "idle" && speedStage !== "done" && (
                  <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden mt-3 max-w-[80px]">
                    <motion.div 
                      key={speedStage}
                      className={`h-full ${speedStage === "upload" ? "bg-purple-400" : "bg-cyan-400"}`}
                      animate={{ width: `${speedProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                )}
              </div>

              {/* SVG Ring Path for active gauge */}
              <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-white/5 fill-none"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={`fill-none transition-all duration-100 ${
                    speedStage === "upload" ? "stroke-purple-400" : speedStage === "download" ? "stroke-cyan-400" : "stroke-white/80"
                  }`}
                  strokeWidth="6.5"
                  strokeDasharray="251.2"
                  animate={{ strokeDashoffset }}
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Realtime stats summary list */}
            <div className="w-full grid grid-cols-4 gap-2 bg-black/40 border border-white/5 rounded-2xl p-4 text-center font-mono text-xs mb-4 relative z-10">
              <div>
                <span className="text-[9px] text-white/30 uppercase tracking-wider block mb-0.5">PING</span>
                <span className="text-sm font-bold text-white/90">
                  {speedMetrics.ping ? `${speedMetrics.ping}ms` : "--"}
                </span>
              </div>
              
              <div>
                <span className="text-[9px] text-white/30 uppercase tracking-wider block mb-0.5">JITTER</span>
                <span className="text-sm font-bold text-white/90">
                  {speedMetrics.jitter ? `${speedMetrics.jitter}ms` : "--"}
                </span>
              </div>

              <div>
                <span className="text-[9px] text-white/30 uppercase tracking-wider block mb-0.5">DOWNLOAD</span>
                <span className="text-sm font-extrabold text-cyan-400">
                  {speedStage === "download" ? `${currentSpeedValue}M` : speedMetrics.download ? `${speedMetrics.download}M` : "--"}
                </span>
              </div>

              <div>
                <span className="text-[9px] text-white/30 uppercase tracking-wider block mb-0.5">UPLOAD</span>
                <span className="text-sm font-extrabold text-purple-400">
                  {speedStage === "upload" ? `${currentSpeedValue}M` : speedMetrics.upload ? `${speedMetrics.upload}M` : "--"}
                </span>
              </div>
            </div>

            {/* Controls button triggers */}
            <div className="w-full flex flex-col gap-3 relative z-10">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={runSpeedTest}
                disabled={speedStage !== "idle" && speedStage !== "done"}
                className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  speedStage !== "idle" && speedStage !== "done"
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : currentThemeClasses.buttonPrimary
                }`}
              >
                {speedStage === "idle" ? (
                  <>
                    <Zap className="w-4 h-4 text-current" />
                    Launch Speed Test
                  </>
                ) : speedStage === "done" ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-current animate-spin" />
                    Rerun Speed Test
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
                    Testing Bandwidth...
                  </>
                )}
              </motion.button>

              <div className="flex justify-between items-center text-[9px] font-mono text-white/30 px-1">
                <span>ISP: {speedMetrics.isp}</span>
                <span>TARGET IP: {speedMetrics.ip}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
