import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Activity, Shield, Zap, Sliders, RefreshCw, BarChart, Server } from "lucide-react";

export const StructureSimulator: React.FC = () => {
  // Simulator Controls
  const [nodes, setNodes] = useState<number>(14);
  const [intensity, setIntensity] = useState<number>(75);
  const [rotation, setRotation] = useState<number>(30);
  const [reachRadius, setReachRadius] = useState<number>(70);
  const [depthLayers, setDepthLayers] = useState<number>(3);
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const [telemetry, setTelemetry] = useState<string[]>(["ARKA Integration Core initialized."]);
  const [activeTab, setActiveTab] = useState<"architecture" | "telemetry">("architecture");

  const spinAngleRef = useRef<number>(0);
  const [spinAngle, setSpinAngle] = useState<number>(0);

  // continuous animation ticker using requestAnimationFrame for smooth fluid orbit
  useEffect(() => {
    let animId: number;
    const tick = () => {
      if (isSpinning) {
        spinAngleRef.current = (spinAngleRef.current + 0.3) % 360;
        setSpinAngle(spinAngleRef.current);
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isSpinning]);

  // Log active telemetry deforms
  const addLog = (logMsg: string) => {
    setTelemetry((prev) => [
      `[${new Date().toLocaleTimeString()}] ${logMsg}`,
      ...prev.slice(0, 5)
    ]);
  };

  const automationNodes = [
    { name: "SFO Gateway", lat: 37.7, lon: -122.4, status: "Active", throughput: "1.4k req/s" },
    { name: "LDN Interface", lat: 51.5, lon: -0.1, status: "Active", throughput: "1.8k req/s" },
    { name: "TKY Core Router", lat: 35.7, lon: 139.7, status: "Optimal", throughput: "2.1k req/s" },
    { name: "SGP Cloud Link", lat: 1.3, lon: 103.8, status: "Active", throughput: "950 req/s" },
    { name: "SYD Edge Node", lat: -33.8, lon: 151.2, status: "Active", throughput: "620 req/s" },
    { name: "FRA Ledger Proxy", lat: 50.1, lon: 8.6, status: "Optimal", throughput: "1.2k req/s" },
    { name: "NYC API Gateway", lat: 40.7, lon: -74.0, status: "Optimal", throughput: "2.4k req/s" },
    { name: "SPO Sync Node", lat: -23.5, lon: -46.6, status: "Idle", throughput: "410 req/s" }
  ];

  // Map 3d coordinates to projected orthographic space on 300x300 canvas
  const generateSvgContent = () => {
    const cx = 150;
    const cy = 150;
    const R = reachRadius + 20; // Expanded globe size to make it majorly visible!

    // Generate latitude coordinate arcs (horizontal lines projected as ellipses)
    const lats = [-60, -30, 0, 30, 60];
    const latEllipses = lats.map((latVal) => {
      const radLat = (latVal * Math.PI) / 180;
      const r_lat = R * Math.cos(radLat);
      const y_lat = cy + R * Math.sin(radLat) * 0.15; // Incorporate a 3D tilt perspective (15 degrees)
      return {
        cx,
        cy: y_lat,
        rx: r_lat,
        ry: r_lat * 0.15,
        opacity: 0.12 + (1 - Math.abs(latVal) / 90) * 0.1
      };
    });

    // Generate longitude coordinate arcs (ellipses that rotate in 3D projection based on spinAngle)
    const lons = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    const lonEllipses = lons.map((lonVal) => {
      const radLon = ((lonVal + spinAngle) * Math.PI) / 180;
      const cosLon = Math.cos(radLon);
      const sinLon = Math.sin(radLon);
      const rx = R * Math.abs(cosLon);
      const isFront = sinLon >= 0;
      return {
        cx,
        cy,
        rx,
        ry: R,
        strokeOpacity: isFront ? 0.22 : 0.05,
        strokeDash: isFront ? "" : "2,2"
      };
    });

    // Project global city/node locations based on current rotate angle
    const projectedNodes = automationNodes.map((n) => {
      const radLat = (n.lat * Math.PI) / 180;
      const radLon = ((n.lon + spinAngle) * Math.PI) / 180;
      
      // Basic 3D conversion relative to globe center
      const projX = cx + R * Math.cos(radLat) * Math.sin(radLon);
      const projY = cy - R * Math.sin(radLat) * 0.95; // Orthographic squish along vertical axis
      const isFront = Math.cos(radLon) >= 0;

      return {
        ...n,
        x: projX,
        y: projY,
        isFront
      };
    });

    return (
      <svg
        id="structure_svg_canvas"
        viewBox="0 0 300 300"
        className="w-full aspect-square max-w-[290px] mx-auto filter drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
      >
        <defs>
          <radialGradient id="meshGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.16} />
            <stop offset="60%" stopColor="#ffffff" stopOpacity={0.03} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Ambient background glow sphere */}
        <circle cx="150" cy="150" r={R} fill="url(#meshGrad)" className="animate-[pulse_4s_ease-in-out_infinite]" />

        {/* Outer Orbital Ring to show orbital satellites */}
        <circle cx="150" cy="150" r={R + 15} fill="none" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="5,15" className="animate-[spin_40s_linear_infinite]" />
        
        {/* Latitude lines */}
        {latEllipses.map((e, idx) => (
          <ellipse
            key={`lat-${idx}`}
            cx={e.cx}
            cy={e.cy}
            rx={e.rx}
            ry={e.ry}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={e.opacity}
            strokeWidth="0.75"
          />
        ))}

        {/* Longitude lines */}
        {lonEllipses.map((e, idx) => (
          <ellipse
            key={`lon-${idx}`}
            cx={e.cx}
            cy={e.cy}
            rx={e.rx}
            ry={e.ry}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={e.strokeOpacity}
            strokeWidth="0.75"
            strokeDasharray={e.strokeDash}
          />
        ))}

        {/* Polar caps points */}
        <circle cx="150" cy={150 - R} r="1.5" fill="#ffffff" fillOpacity="0.8" />
        <circle cx="150" cy={150 + R} r="1.5" fill="#ffffff" fillOpacity="0.8" />

        {/* Draw network cables between active front-facing nodes */}
        {projectedNodes.map((n1, idx1) => {
          if (!n1.isFront) return null;
          return projectedNodes.map((n2, idx2) => {
            if (idx2 <= idx1 || !n2.isFront) return null;
            const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
            // Draw visual routing path lines if nodes are adjacent or within threshold
            if (dist < 130) {
              return (
                <path
                  key={`cable-${idx1}-${idx2}`}
                  d={`M ${n1.x} ${n1.y} Q 150 150 ${n2.x} ${n2.y}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity={0.16}
                  strokeWidth="0.75"
                  strokeDasharray="2,4"
                />
              );
            }
            return null;
          });
        })}

        {/* Draw pulsing front-facing city nodes */}
        {projectedNodes.map((n, idx) => {
          // Hide back-facing nodes for realistic occlusion, or render them extremely translucent
          if (!n.isFront) {
            return (
              <circle
                key={`back-pt-${idx}`}
                cx={n.x}
                cy={n.y}
                r="1.5"
                fill="#ffffff"
                fillOpacity="0.08"
              />
            );
          }

          return (
            <g key={`front-pt-${idx}`} className="cursor-pointer group/node" onClick={() => addLog(`Ping dispatched to ${n.name} [IP mapping validated]`)}>
              {/* Outer pulsing ping wave */}
              <circle
                cx={n.x}
                cy={n.y}
                r="7"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.25"
                strokeWidth="0.5"
                className="animate-ping"
                style={{ animationDuration: `${1.5 + (idx % 2)}s` }}
              />
              
              {/* Core glow */}
              <circle
                cx={n.x}
                cy={n.y}
                r="3"
                fill="#ffffff"
                className="filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
              />

              {/* Dynamic technical city label */}
              <text
                x={n.x + 6}
                y={n.y + 3}
                fill="#ffffff"
                fontSize="6.5"
                fontFamily="monospace"
                fontWeight="bold"
                fillOpacity="0.7"
                className="pointer-events-none drop-shadow-md select-none tracking-tight"
              >
                {n.name.split(" ")[0]}
              </text>
            </g>
          );
        })}

        {/* Symmetry-bound center core locator */}
        <path
          d="M 144 150 L 156 150 M 150 144 L 150 156"
          stroke="#ffffff"
          strokeWidth="0.75"
          strokeOpacity="0.3"
        />
      </svg>
    );
  };

  return (
    <div id="lattice_simulation_module" className="flex flex-col gap-4 h-full">
      {/* Visual Live Grid and Canvas split */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 items-stretch">
        
        {/* Left Side: Geometry interactive Canvas */}
        <div className="liquid-glass p-4 rounded-3xl flex flex-col justify-between relative overflow-hidden bg-white/[0.01]">
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            {generateSvgContent()}
          </div>

          {/* Quick toggle controls */}
          <div className="flex items-center justify-end border-t border-white/5 pt-3 mt-1">
            <button
              onClick={() => {
                setIsSpinning(!isSpinning);
                addLog(isSpinning ? "Automation mapping frozen" : "Continuous stream routing started");
              }}
              className="text-[9px] uppercase font-semibold font-exo text-white/80 hover:text-white flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full interactive"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isSpinning ? "animate-spin" : ""}`} />
              {isSpinning ? "Freeze Router" : "Route Live"}
            </button>
          </div>
        </div>

        {/* Right Side: Parameter Sliders panel */}
        <div className="hidden md:flex flex-col justify-between gap-3 bg-white/[0.01] p-3 rounded-3xl border border-white/5">
          <div className="flex rounded-lg bg-white/5 p-1">
            <button
              onClick={() => setActiveTab("architecture")}
              className={`flex-1 py-1 text-[9px] uppercase font-bold font-exo rounded-md tracking-wider transition-all cursor-pointer ${
                activeTab === "architecture" ? "bg-white text-black" : "text-white/40 hover:text-white"
              }`}
            >
              Parameters
            </button>
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`flex-1 py-1 text-[9px] uppercase font-bold font-exo rounded-md tracking-wider transition-all cursor-pointer ${
                activeTab === "telemetry" ? "bg-white text-black" : "text-white/40 hover:text-white"
              }`}
            >
              Systems Status
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "architecture" ? (
              <motion.div
                key="architecture-sliders"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex-1 flex flex-col gap-2.5 text-left pt-2"
              >
                {/* 1. Simulated Traffic Capacity */}
                <div>
                  <div className="flex justify-between text-[9px] font-exo text-white/50 mb-1">
                    <span>ACTIVE BOT CHANNELS</span>
                    <span>{nodes * 80} active agents</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="22"
                    value={nodes}
                    onChange={(e) => {
                      setNodes(parseInt(e.target.value));
                      addLog(`Reallocated load balancer capacity: ${parseInt(e.target.value) * 80} active instances`);
                    }}
                    className="w-full accent-white opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* 2. Globe Zoom Scale */}
                <div>
                  <div className="flex justify-between text-[9px] font-exo text-white/50 mb-1">
                    <span>GLOBE VISUAL ZOOM</span>
                    <span>{reachRadius + 20}px radius</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={reachRadius}
                    onChange={(e) => {
                      setReachRadius(parseInt(e.target.value));
                      addLog(`Globe visualization projection size scaled to ${parseInt(e.target.value) + 20}px`);
                    }}
                    className="w-full accent-white opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* 3. Hologram Tilt Axis */}
                <div>
                  <div className="flex justify-between text-[9px] font-exo text-white/50 mb-1">
                    <span>HOLOGRAPHIC TILT PERSPECTIVE</span>
                    <span>{rotation}° pitch</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={rotation}
                    onChange={(e) => {
                      setRotation(parseInt(e.target.value));
                      addLog(`Adjusted spatial rendering focal angle to ${e.target.value}°`);
                    }}
                    className="w-full accent-white opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* 4. API Mesh layers */}
                <div>
                  <div className="flex justify-between text-[9px] font-exo text-white/50 mb-1">
                    <span>DEEP RETRIEVAL NESTS</span>
                    <span>{depthLayers} levels deep</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={depthLayers}
                    onChange={(e) => {
                      setDepthLayers(parseInt(e.target.value));
                      addLog(`Sub-routing logic execution nests updated to depth level ${e.target.value}`);
                    }}
                    className="w-full accent-white opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="telemetry-logs"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex-1 flex flex-col justify-between text-left pt-2"
              >
                <div className="p-2.5 bg-white/[0.02] rounded-xl flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-white/60" />
                    <span className="text-[9px] font-mono text-white/50 uppercase">AVERAGE LATENCY SPEED</span>
                  </div>
                  <span className="text-lg font-bold font-mono tracking-tight text-white/90">2.41 ms</span>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white animate-pulse" style={{ width: "97%" }} />
                  </div>
                </div>

                <div className="p-2.5 bg-white/[0.02] rounded-xl mt-1.5">
                  <span className="text-[9px] block text-white/30 lowercase font-mono pb-1 border-b border-white/5">Operational Efficiency</span>
                  <div className="flex justify-between items-center text-[10px] mt-1.5 text-white/70">
                    <span>Data Througput</span>
                    <span className="font-mono text-white">4.8 GB/s</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1 text-white/70">
                    <span>Success Rate</span>
                    <span className="font-mono text-white">99.998%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Telemetry live computer feed output box */}
      <div className="hidden md:block p-2.5 bg-black/40 rounded-2xl text-left border border-white/5 mt-1">
        <span className="text-[8px] block text-white/30 tracking-widest lowercase font-mono mb-1.5">ARKA_AUTOMATION_EVENT_STREAM</span>
        <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto font-mono text-[9px] text-white/60 scrollbar-none">
          {telemetry.map((log, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              key={`log-${idx}`}
              className="truncate"
            >
              {log}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
