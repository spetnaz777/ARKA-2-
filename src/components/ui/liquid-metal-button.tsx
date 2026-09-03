import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { Sparkles } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
  /** Fixed pixel width for text mode. Defaults to a width sized to the label. */
  width?: number;
  disabled?: boolean;
}

/** Static metallic pill — only used when the visitor has asked for
 *  reduced motion. Phones get the real WebGL shader like desktop. */
function StaticMetalButton({
  label,
  onClick,
  viewMode,
  width,
  disabled,
}: Required<Omit<LiquidMetalButtonProps, "width">> & { width?: number }) {
  const w =
    viewMode === "icon"
      ? 46
      : (width ?? Math.max(158, Math.round(label.length * 9) + 66));
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-label={label}
      disabled={disabled}
      style={{
        width: w,
        height: 46,
        borderRadius: 100,
        border: "1px solid rgba(255,255,255,0.16)",
        background:
          "linear-gradient(150deg, #3a3a40 0%, #17171a 46%, #050506 100%)",
        color: "#ececf2",
        fontFamily: "Michroma, sans-serif",
        fontSize: 10,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -6px 12px rgba(0,0,0,0.5)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {viewMode === "icon" ? <Sparkles size={16} /> : label}
    </button>
  );
}

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
  width,
  disabled = false,
}: LiquidMetalButtonProps) {
  const [useShader] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return true;
    }
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: External library without full types
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const dimensions = useMemo(() => {
    if (viewMode === "icon") {
      return {
        width: 46,
        height: 46,
        innerWidth: 42,
        innerHeight: 42,
        shaderWidth: 46,
        shaderHeight: 46,
      };
    }
    const w =
      width ?? Math.max(158, Math.round(label.length * 9) + 66);
    return {
      width: w,
      height: 46,
      innerWidth: w - 4,
      innerHeight: 42,
      shaderWidth: w,
      shaderHeight: 46,
    };
  }, [viewMode, width, label]);

  useEffect(() => {
    if (!useShader) return;
    const styleId = "shader-canvas-style-exploded";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const cleanup = () => {
      const m = shaderMount.current;
      if (m?.dispose) m.dispose();
      else if (m?.destroy) m.destroy();
      shaderMount.current = null;
    };

    try {
      if (shaderRef.current) {
        cleanup();
        shaderMount.current = new ShaderMount(
          shaderRef.current,
          liquidMetalFragmentShader,
          {
            u_repetition: 4,
            u_softness: 0.5,
            u_shiftRed: 0.3,
            u_shiftBlue: 0.3,
            u_distortion: 0,
            u_contour: 0,
            u_angle: 45,
            u_scale: 8,
            u_shape: 1,
            u_offsetX: 0.1,
            u_offsetY: -0.1,
          },
          undefined,
          0.6,
        );
      }
    } catch (error) {
      console.error("[liquid-metal-button] shader init failed:", error);
    }

    return cleanup;
  }, [dimensions.shaderWidth, dimensions.shaderHeight, useShader]);

  if (!useShader) {
    return (
      <StaticMetalButton
        label={label}
        onClick={onClick ?? (() => {})}
        viewMode={viewMode}
        width={width}
        disabled={disabled}
      />
    );
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (shaderMount.current?.setSpeed) {
      shaderMount.current.setSpeed(2.4);
      setTimeout(() => {
        shaderMount.current?.setSpeed?.(isHovered ? 1 : 0.6);
      }, 300);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  };

  return (
    <div
      className="relative inline-block align-middle"
      style={{
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? "none" : "auto",
        transition: "opacity 0.2s ease",
      }}
    >
      <div style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}>
        <div
          style={{
            position: "relative",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformStyle: "preserve-3d",
            transition:
              "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
          }}
        >
          {/* Label layer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transformStyle: "preserve-3d",
              transform: "translateZ(20px)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            {viewMode === "icon" ? (
              <Sparkles
                size={16}
                style={{
                  color: "#ececf2",
                  filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.7))",
                }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "Michroma, sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "#ececf2",
                  fontWeight: 400,
                  textShadow: "0px 1px 3px rgba(0,0,0,0.8), 0px 0px 1px rgba(0,0,0,0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            )}
          </div>

          {/* Inner plate */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transform: `translateZ(10px) ${
                isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"
              }`,
              zIndex: 20,
              transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div
              style={{
                width: `${dimensions.innerWidth}px`,
                height: `${dimensions.innerHeight}px`,
                margin: "2px",
                borderRadius: "100px",
                background: "linear-gradient(180deg, #202020 0%, #000000 100%)",
                boxShadow: isPressed
                  ? "inset 0px 2px 4px rgba(0,0,0,0.4), inset 0px 1px 2px rgba(0,0,0,0.3)"
                  : "none",
                transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>

          {/* Shader layer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transform: `translateZ(0px) ${
                isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"
              }`,
              zIndex: 10,
              transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div
              style={{
                height: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                borderRadius: "100px",
                boxShadow: isPressed
                  ? "0px 0px 0px 1px rgba(0,0,0,0.5), 0px 1px 2px 0px rgba(0,0,0,0.3)"
                  : isHovered
                    ? "0px 0px 0px 1px rgba(0,0,0,0.4), 0px 8px 5px 0px rgba(0,0,0,0.1), 0px 4px 4px 0px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.2)"
                    : "0px 0px 0px 1px rgba(0,0,0,0.3), 0px 9px 9px 0px rgba(0,0,0,0.12), 0px 2px 5px 0px rgba(0,0,0,0.15)",
                transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "rgb(0 0 0 / 0)",
              }}
            >
              <div
                ref={shaderRef}
                className="shader-container-exploded"
                style={{
                  borderRadius: "100px",
                  overflow: "hidden",
                  position: "relative",
                  width: `${dimensions.shaderWidth}px`,
                  maxWidth: `${dimensions.shaderWidth}px`,
                  height: `${dimensions.shaderHeight}px`,
                }}
              />
            </div>
          </div>

          {/* Interaction layer */}
          <button
            ref={buttonRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
              zIndex: 40,
              transformStyle: "preserve-3d",
              transform: "translateZ(25px)",
              overflow: "hidden",
              borderRadius: "100px",
            }}
            aria-label={label}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                style={{
                  position: "absolute",
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
                  pointerEvents: "none",
                  animation: "ripple-animation 0.6s ease-out",
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}
