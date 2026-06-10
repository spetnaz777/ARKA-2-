import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";

interface TravelDimensionWarpProps {
  isActive: boolean;
  stage: "launch" | "tunnel" | "settle" | "idle";
  type: "planet-to-planet" | "space-to-mountain" | "mountain-to-space";
}

export const TravelDimensionWarp: React.FC<TravelDimensionWarpProps> = ({ isActive, stage }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-md overflow-hidden flex items-center justify-center select-none pointer-events-none"
        >
          {/* Subtle luxurious micro-grid overlay for high-definition depth perspective */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1.5px,transparent_1.5px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1.5px,transparent_1.5px)] bg-[size:60px_60px] opacity-40 mix-blend-overlay" />

          {/* ================= HIGH-PREMIUM PRISMATIC SPECTRUM DEEP BACKGROUND GLOWS ================= */}
          {/* Shifting cyan spectral glow */}
          <motion.div
            animate={{
              scale: [1.0, 1.35, 1.0],
              x: [-100, 100, -100],
              y: [-50, 50, -50],
              opacity: [0.18, 0.35, 0.18]
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute rounded-full w-[65vw] h-[65vw] bg-cyan-500/10 blur-[130px] mix-blend-screen"
            style={{ willChange: "transform, opacity" }}
          />

          {/* Shifting warm amber/indigo re-entry light flare */}
          <motion.div
            animate={{
              scale: [1.3, 0.95, 1.3],
              x: [100, -100, 100],
              y: [50, -50, 50],
              opacity: [0.12, 0.28, 0.12]
            }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute rounded-full w-[55vw] h-[55vw] bg-purple-500/10 blur-[140px] mix-blend-screen"
            style={{ willChange: "transform, opacity" }}
          />

          {/* Clean high-contrast dark vignette focus layer */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(1,1,3,0.7)_100%)] z-10" />


          {/* ================= MULTI-STAGE GLOSSY REFRACTION GLAMES (60 FPS GPU ACCELERATED) ================= */}
          <AnimatePresence>
            {stage === "tunnel" && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-20">
                
                {/* Visual Glaze 1: The Primary Super-Bright White Reflection Slit */}
                <motion.div
                  initial={{ x: "-120%", skewX: -28, opacity: 0 }}
                  animate={{ x: "120%", skewX: -28, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.95,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute top-0 bottom-0 w-[45%] bg-gradient-to-r from-transparent via-white/[0.04] via-white/[0.22] via-white/[0.04] to-transparent blur-[1px]"
                  style={{ willChange: "transform, opacity" }}
                />

                {/* Visual Glaze 2: Delayed Prismatic dispersion side highlight (Chromatic splitting) */}
                <motion.div
                  initial={{ x: "-145%", skewX: -28, opacity: 0 }}
                  animate={{ x: "145%", skewX: -28, opacity: 0.95 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.82,
                    delay: 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute top-0 bottom-0 w-[20%] bg-gradient-to-r from-transparent via-cyan-400/[0.18] via-purple-500/[0.12] to-transparent blur-[2px]"
                  style={{ willChange: "transform, opacity" }}
                />

                {/* Visual Glaze 3: Opposite angled hyper-fast light flare reflection */}
                <motion.div
                  initial={{ x: "150%", skewX: 32, opacity: 0 }}
                  animate={{ x: "-150%", skewX: 32, opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.02,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute top-0 bottom-0 w-[12%] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
                  style={{ willChange: "transform, opacity" }}
                />

                {/* Optical Bloom: Soft horizontal expanding pulse centered */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: [0, 1.4, 1.1], opacity: [0, 0.95, 0] }}
                  transition={{ duration: 0.85, ease: "easeOut" }}
                  className="absolute left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-white to-transparent blur-[1px]"
                  style={{ willChange: "transform, opacity" }}
                />

                {/* Prismatic flare ring expansion */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1.8, opacity: [0, 0.6, 0] }}
                  className="absolute w-[450px] h-[450px] rounded-full border-2 border-white/10 blur-[2px]"
                  transition={{ duration: 0.88, ease: "easeOut" }}
                />
              </div>
            )}
          </AnimatePresence>


          {/* ================= GLASSMORPHIC CIRCULAR FLOATING DISC FRAMING THE BRAND LOGO ================= */}
          <div 
            className="relative flex items-center justify-center z-30"
            style={{ perspective: "1200px" }}
          >
            {/* Concentric ambient light ripple expansions around the disc */}
            <motion.div
              animate={stage === "tunnel" ? { scale: [1.2, 1.6, 1.2], opacity: [0.15, 0.45, 0.15] } : { scale: 1, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-96 h-96 rounded-full bg-cyan-400/[0.03] blur-[40px]"
            />
            
            <motion.div
              animate={stage === "tunnel" ? { scale: [1.4, 2.1, 1.4], opacity: [0.08, 0.25, 0.08] } : { scale: 1, opacity: 0 }}
              transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[480px] h-[480px] rounded-full bg-purple-500/[0.02] blur-[60px]"
            />

            {/* Central 3D Premium Double-Layer Glass Disc */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, rotateX: 15, rotateY: -15, translateZ: -100 }}
              animate={
                stage === "tunnel"
                  ? { 
                      scale: [1, 1.14, 1.05], 
                      opacity: 1, 
                      rotateX: [12, -12, 12], 
                      rotateY: [-15, 15, -15],
                      translateZ: 80,
                    }
                  : { 
                      scale: 1, 
                      opacity: 1, 
                      rotateX: 0, 
                      rotateY: 0,
                      translateZ: 0,
                    }
              }
              exit={{ scale: 0.93, opacity: 0, rotateX: -10, rotateY: 10, translateZ: -80 }}
              transition={{ 
                duration: stage === "tunnel" ? 2.4 : 0.65, 
                ease: [0.16, 1, 0.3, 1],
                repeat: stage === "tunnel" ? Infinity : 0,
                repeatType: "reverse"
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative flex items-center justify-center w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] rounded-full border border-white/[0.09] bg-white/[0.03] backdrop-blur-2xl shadow-[0_32px_100px_rgba(0,0,0,0.75),inset_0_1.5px_2px_rgba(255,255,255,0.15)] overflow-hidden"
            >
              {/* Internal micro glazed glass reflection shine sweep */}
              <motion.div
                animate={{
                  x: ["-140%", "140%"]
                }}
                transition={{
                  duration: 2.3,
                  repeat: Infinity,
                  repeatDelay: 0.4,
                  ease: [0.25, 1, 0.5, 1]
                }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.12] via-white/[0.04] to-transparent skew-x-20 z-0 pointer-events-none"
              />

              {/* Dynamic decorative concentric rings orbiting inside the glass boundary */}
              <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.14] scale-[1.05] animate-[spin_35s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-dotted border-white/[0.06] scale-[0.98] animate-[spin_24s_linear_infinite_reverse]" />
              <div className="absolute inset-6 rounded-full border border-white/[0.03] scale-[0.92]" />

              {/* Core interactive light node embedded back-plate */}
              <motion.div 
                animate={{
                  scale: [0.93, 1.07, 0.93],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-28 h-28 rounded-full bg-cyan-400/[0.05] blur-[10px] z-0" 
              />

              {/* Brand logo centered with custom high-end drop shadow glowing flare */}
              <motion.div
                animate={{
                  y: [0, -4, 0],
                  filter: [
                    "drop-shadow(0 0 12px rgba(255,255,255,0.2))",
                    "drop-shadow(0 0 35px rgba(255,255,255,0.6))",
                    "drop-shadow(0 0 12px rgba(255,255,255,0.2))"
                  ]
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <Logo className="w-12 h-12 sm:w-16 sm:h-16 md:w-22 md:h-22 text-white filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
