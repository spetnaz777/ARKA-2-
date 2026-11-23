import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   ARKA signature graphics.

   Positions use an anchor notation so 45° geometry stays exact at every
   width: X = l|c|r|L|R + offset (section left, centre, right, container
   left/right edge), Y = t|b + offset (section top/bottom). A diagonal is
   always drawn between two points that share an X anchor, so it never
   skews. All graphics are aria-hidden and pointer-events: none.
   ───────────────────────────────────────────────────────────── */

const CONTAINER_HALF = 620;
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

function pad(w: number) {
  return w >= 768 ? 24 : 20;
}

function resolveX(tok: string, w: number) {
  const a = tok[0];
  const off = parseFloat(tok.slice(1)) || 0;
  const half = Math.min(CONTAINER_HALF, w / 2 - pad(w));
  switch (a) {
    case "l": return off;
    case "r": return w + off;
    case "c": return w / 2 + off;
    case "L": return w / 2 - half + off;
    case "R": return w / 2 + half + off;
    default: return off;
  }
}
function resolveY(tok: string, h: number) {
  const off = parseFloat(tok.slice(1)) || 0;
  return tok[0] === "b" ? h + off : off;
}
function pt(p: string, w: number, h: number): [number, number] {
  const [x, y] = p.split(",");
  return [resolveX(x.trim(), w), resolveY(y.trim(), h)];
}
export function toPath(pts: string, w: number, h: number) {
  return pts
    .trim()
    .split(/\s+/)
    .map((p, i) => {
      const [x, y] = pt(p, w, h);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/* CSS position for HTML decorations, mirrors resolveX/resolveY without JS. */
function cssX(tok: string) {
  const a = tok[0];
  const off = parseFloat(tok.slice(1)) || 0;
  const o = `${off}px`;
  switch (a) {
    case "l": return o;
    case "r": return `calc(100% + ${o})`;
    case "c": return `calc(50% + ${o})`;
    case "L": return `calc(50% - min(${CONTAINER_HALF}px, 50% - var(--pad)) + ${o})`;
    case "R": return `calc(50% + min(${CONTAINER_HALF}px, 50% - var(--pad)) + ${o})`;
    default: return o;
  }
}
function cssY(tok: string) {
  const off = parseFloat(tok.slice(1)) || 0;
  return tok[0] === "b" ? `calc(100% + ${off}px)` : `${off}px`;
}

export function Place({
  at,
  className = "",
  style,
  children,
  center = false,
}: {
  at: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  center?: boolean;
}) {
  const [x, y] = at.split(",");
  return (
    <div
      aria-hidden="true"
      className={`deco ${className}`}
      style={{
        left: cssX(x.trim()),
        top: cssY(y.trim()),
        transform: center ? "translate(-50%, -50%)" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Circuit frame ─────────────────────────────────────────── */
export type Trace = {
  pts: string;
  tone?: "line" | "faint" | "ink" | "thick" | "white";
  draw?: boolean;
  pulse?: boolean | "signal";
  delay?: number;
};
export type Node = {
  at: string;
  kind?: "ring" | "dot" | "square" | "squareFill" | "pair" | "chain";
  n?: number;
};
export type ArcSpec = { c: string; r: number; from: number; to: number; tone?: Trace["tone"] };
export type FrameSpec = { traces: Trace[]; nodes?: Node[]; arcs?: ArcSpec[] };

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const rad = (a: number) => (a * Math.PI) / 180;
  const x0 = cx + r * Math.cos(rad(a0));
  const y0 = cy + r * Math.sin(rad(a0));
  const x1 = cx + r * Math.cos(rad(a1));
  const y1 = cy + r * Math.sin(rad(a1));
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} ${sweep} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

function useSize<T extends HTMLElement>(fallback: [number, number]) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<[number, number]>(fallback);
  const [measured, setMeasured] = useState(false);
  useIso(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const set = () => {
      setSize([el.clientWidth, el.clientHeight]);
      setMeasured(true);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, size, measured };
}

function useInView<T extends Element>(ref: React.RefObject<T | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setInView(true);
    const io = new IntersectionObserver(
      (es) => es.some((e) => e.isIntersecting) && (setInView(true), io.disconnect()),
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

export function CircuitFrame({
  desktop,
  mobile,
  bp = 1100,
  className = "",
  scrub = false,
}: {
  desktop: FrameSpec;
  mobile?: FrameSpec;
  bp?: number;
  className?: string;
  /** tie stroke drawing to scroll progress of the enclosing .scene/section */
  scrub?: boolean;
}) {
  const { ref, size, measured } = useSize<HTMLDivElement>([1440, 800]);
  const inView = useInView(ref);
  useEffect(() => {
    const el = ref.current;
    if (!scrub || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--sp", "1");
      return;
    }
    const host = (el.closest(".scene, section, .band") as HTMLElement) ?? el.parentElement!;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (r.height > vh * 1.6) p = (-r.top + vh * 0.25) / (r.height - vh * 0.75); // pinned scene
      else p = (vh * 0.95 - r.top) / (Math.min(r.height, vh) * 0.9);
      el.style.setProperty("--sp", Math.max(0, Math.min(1, p)).toFixed(4));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [scrub, ref]);
  const [w, h] = size;
  const spec = w < bp ? mobile : desktop;

  const traces = useMemo(
    () => (spec?.traces ?? []).map((t) => ({ ...t, d: toPath(t.pts, w, h) })),
    [spec, w, h],
  );
  if (!spec) return <div ref={ref} aria-hidden="true" className="frame frame--empty" />;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`frame ${scrub ? "frame--scrub" : ""} ${measured ? "is-measured" : ""} ${inView ? "is-in" : ""} ${className}`}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
        {traces.map((t, i) => (
          <path
            key={i}
            d={t.d}
            pathLength={1}
            className={`tr tr--${t.tone ?? "line"} ${t.draw === false ? "" : "draw"}`}
            style={{ transitionDelay: `${t.delay ?? i * 0.08}s` }}
          />
        ))}
        {(spec.arcs ?? []).map((a, i) => {
          const [cx, cy] = pt(a.c, w, h);
          return (
            <path
              key={`a${i}`}
              d={arcPath(cx, cy, a.r, a.from, a.to)}
              pathLength={1}
              className={`tr tr--${a.tone ?? "line"} draw`}
              style={{ transitionDelay: `${0.3 + i * 0.1}s`, transitionDuration: "1.6s" }}
            />
          );
        })}
        {(spec.nodes ?? []).map((n, i) => {
          const [x, y] = pt(n.at, w, h);
          return <SignalNodeSvg key={`n${i}`} x={x} y={y} kind={n.kind} n={n.n} />;
        })}
      </svg>
      {traces
        .filter((t) => t.pulse)
        .map((t, i) => (
          <span
            key={`p${i}`}
            className={`pulse ${t.pulse === "signal" ? "pulse--signal" : ""}`}
            style={{ offsetPath: `path("${t.d}")`, animationDelay: `${1.4 + i * 2.7}s` }}
          />
        ))}
    </div>
  );
}

function SignalNodeSvg({ x, y, kind = "ring", n = 4 }: { x: number; y: number; kind?: Node["kind"]; n?: number }) {
  switch (kind) {
    case "dot":
      return <circle cx={x} cy={y} r={3.2} className="nd nd--fill" />;
    case "square":
      return <rect x={x - 5} y={y - 5} width={10} height={10} className="nd" />;
    case "squareFill":
      return <rect x={x - 5} y={y - 5} width={10} height={10} className="nd nd--fill" />;
    case "pair":
      return (
        <g>
          <circle cx={x - 6} cy={y} r={3} className="nd nd--bg" />
          <circle cx={x + 6} cy={y} r={3} className="nd nd--bg" />
        </g>
      );
    case "chain":
      return (
        <g>
          {Array.from({ length: n }, (_, i) => (
            <circle key={i} cx={x} cy={y + i * 9} r={2.6} className={`nd ${i % 2 ? "" : "nd--bg"}`} />
          ))}
        </g>
      );
    default:
      return <circle cx={x} cy={y} r={3.2} className="nd nd--bg" />;
  }
}

/* Standalone node for HTML layouts (process timeline, etc). */
export function SignalNode({ filled = false, className = "" }: { filled?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`signal-node ${filled ? "is-filled" : ""} ${className}`}>
      <span />
    </span>
  );
}

export function OrbitalArc({
  size = 400,
  from = 180,
  to = 300,
  className = "",
  spin = false,
}: {
  size?: number;
  from?: number;
  to?: number;
  className?: string;
  spin?: boolean;
}) {
  const r = size / 2 - 1;
  return (
    <svg
      aria-hidden="true"
      className={`orbital ${spin ? "orbital--spin" : ""} ${className}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
    >
      <path d={arcPath(size / 2, size / 2, r, from, to)} className="tr tr--line" />
    </svg>
  );
}

export function DotMatrix({ cols = 5, rows = 4, gap = 12, className = "" }: { cols?: number; rows?: number; gap?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={`dotmatrix ${className}`} width={(cols - 1) * gap + 2} height={(rows - 1) * gap + 2} fill="none">
      {Array.from({ length: cols * rows }, (_, i) => (
        <circle key={i} cx={(i % cols) * gap + 1} cy={Math.floor(i / cols) * gap + 1} r={1} />
      ))}
    </svg>
  );
}

export function Hatch({ n = 8, w = 52, h = 12, className = "", fade = true }: { n?: number; w?: number; h?: number; className?: string; fade?: boolean }) {
  const step = w / n;
  return (
    <svg aria-hidden="true" className={`hatch ${className}`} width={w + h} height={h} fill="none">
      {Array.from({ length: n }, (_, i) => (
        <line
          key={i}
          x1={i * step}
          y1={h}
          x2={i * step + h}
          y2={0}
          style={{ opacity: fade ? 1 - (i / n) * 0.65 : 1 }}
        />
      ))}
    </svg>
  );
}

export function Barcode({ n = 6, gap = 7, h = 64, className = "" }: { n?: number; gap?: number; h?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={`barcode ${className}`} width={(n - 1) * gap + 2} height={h} fill="none">
      {Array.from({ length: n }, (_, i) => (
        <line key={i} x1={i * gap + 1} y1={0} x2={i * gap + 1} y2={h} />
      ))}
    </svg>
  );
}

export function TechnicalDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`tdivider ${className}`}>
      <span className="tdivider__line" />
      <svg width="34" height="10" fill="none">
        <circle cx="5" cy="5" r="3" className="nd nd--bg" />
        <line x1="8" y1="5" x2="26" y2="5" className="tr tr--line" />
        <circle cx="29" cy="5" r="3" className="nd nd--bg" />
      </svg>
      <span className="tdivider__line" />
    </div>
  );
}

/* ── Contour wave: draped silver surface made of parallel strands ── */
export function ContourPattern({
  variant = 0,
  lines = 34,
  className = "",
}: {
  variant?: number;
  lines?: number;
  className?: string;
}) {
  const W = 640;
  const H = 260;
  const paths = useMemo(() => {
    const ph = variant * 0.9;
    const peak = 0.42 + ((variant * 0.13) % 0.3);
    const out: string[] = [];
    for (let i = 0; i < lines; i++) {
      const t = i / (lines - 1);
      let d = "";
      for (let s = 0; s <= 64; s++) {
        const u = s / 64;
        const x = u * W;
        const ridge = Math.exp(-Math.pow((u - peak - t * 0.18) / (0.2 + t * 0.08), 2));
        const swell = 0.5 + 0.5 * Math.sin(u * 3.2 + ph + t * 1.4);
        const y =
          H * (0.98 - t * 0.5) -
          ridge * H * (0.62 - t * 0.18) -
          swell * H * 0.06 * (1 - t);
        d += `${s ? "L" : "M"}${x.toFixed(1)} ${Math.max(2, y).toFixed(1)}`;
      }
      out.push(d);
    }
    return out;
  }, [variant, lines]);
  return (
    <svg aria-hidden="true" className={`contour ${className}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice" fill="none">
      <defs>
        <linearGradient id={`cg${variant}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.35" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <g className="contour__g" stroke={`url(#cg${variant})`}>
        {paths.map((d, i) => (
          <path key={i} d={d} strokeWidth={i % 6 === 0 ? 1.1 : 0.7} />
        ))}
      </g>
    </svg>
  );
}

/* Chamfered (top-left + bottom-right 45° cut) panel. The element itself is
   not clipped, so focus outlines and overflowing graphics stay visible. */
export function ChamferedPanel({
  as: Tag = "div",
  cut = 16,
  tone = "raised",
  className = "",
  children,
  ...rest
}: {
  as?: React.ElementType;
  cut?: number;
  tone?: "raised" | "sunken" | "clear" | "ink";
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={`chamfer chamfer--${tone} ${className}`}
      style={{ ["--cut" as string]: `${cut}px`, ...(rest.style ?? {}) }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Single decorative trace for internal pages (wrapper around CircuitFrame). */
export function CircuitTrace({ pts, mobilePts, tone = "line" }: { pts: string; mobilePts?: string; tone?: Trace["tone"] }) {
  return (
    <CircuitFrame
      desktop={{ traces: [{ pts, tone }] }}
      mobile={mobilePts ? { traces: [{ pts: mobilePts, tone }] } : undefined}
    />
  );
}

/* ── Icons ─────────────────────────────────────────────────── */
export function Icon({ name, size = 26 }: { name: "chip" | "code" | "bars" | "layers" | "arrow-ur" | "arrow-r" | "arrow-l" | "menu" | "close" | "mail" | "pin"; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "square" as const, "aria-hidden": true };
  switch (name) {
    case "chip":
      return (
        <svg {...p}>
          <rect x="6" y="6" width="12" height="12" />
          <rect x="9.5" y="9.5" width="5" height="5" />
          {[8, 12, 16].map((v) => (
            <g key={v}>
              <path d={`M${v} 6V3M${v} 18v3M6 ${v}H3M18 ${v}h3`} />
            </g>
          ))}
        </svg>
      );
    case "code":
      return (
        <svg {...p}>
          <path d="M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16" />
        </svg>
      );
    case "bars":
      return (
        <svg {...p}>
          <rect x="3.5" y="13" width="4" height="7" />
          <rect x="10" y="8.5" width="4" height="11.5" />
          <rect x="16.5" y="4" width="4" height="16" />
        </svg>
      );
    case "layers":
      return (
        <svg {...p}>
          <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
          <path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
        </svg>
      );
    case "arrow-ur":
      return (
        <svg {...p}>
          <path d="M7 17 17 7M8.5 7H17v8.5" />
        </svg>
      );
    case "arrow-r":
      return (
        <svg {...p}>
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      );
    case "arrow-l":
      return (
        <svg {...p}>
          <path d="M20 12H5M11 6l-6 6 6 6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...p}>
          <path d="M3 7h18M3 12h18M7 17h14" />
        </svg>
      );
    case "close":
      return (
        <svg {...p}>
          <path d="m5 5 14 14M19 5 5 19" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <path d="M3 5.5h18v13H3z" />
          <path d="m3 6 9 7 9-7" />
        </svg>
      );
    case "pin":
      return (
        <svg {...p}>
          <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      );
  }
}

/* ── HUD micro-detail ──────────────────────────────────────── */
/* Coordinate / index readout in mono, e.g. "N 43.65° / W 79.38°". */
export function Readout({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`readout ${className}`}>
      {children}
    </span>
  );
}

/* Tick ruler: minor ticks every `step`, major every `major` ticks. */
export function TickRuler({ length = 160, step = 8, major = 5, vertical = false, className = "" }: { length?: number; step?: number; major?: number; vertical?: boolean; className?: string }) {
  const n = Math.floor(length / step);
  const w = vertical ? 10 : length;
  const h = vertical ? length : 10;
  return (
    <svg aria-hidden="true" className={`ruler ${className}`} width={w} height={h} fill="none">
      {vertical ? <line x1={0.5} y1={0} x2={0.5} y2={length} /> : <line x1={0} y1={0.5} x2={length} y2={0.5} />}
      {Array.from({ length: n + 1 }, (_, i) => {
        const L = i % major === 0 ? 7 : 3.5;
        const p = i * step + 0.5;
        return vertical ? <line key={i} x1={0} y1={p} x2={L} y2={p} /> : <line key={i} x1={p} y1={0} x2={p} y2={L} />;
      })}
    </svg>
  );
}

/* Registration crosshair. */
export function Crosshair({ size = 13, className = "" }: { size?: number; className?: string }) {
  const c = size / 2;
  return (
    <svg aria-hidden="true" className={`crosshair ${className}`} width={size} height={size} fill="none">
      <line x1={c} y1={0} x2={c} y2={size} />
      <line x1={0} y1={c} x2={size} y2={c} />
    </svg>
  );
}

/* Hairline HUD corner brackets around a positioned parent. */
export function HudBrackets({ inset = -10, size = 14, className = "" }: { inset?: number; size?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`hud ${className}`} style={{ inset: `${inset}px`, ["--b" as string]: `${size}px` }}>
      <span /><span /><span /><span />
    </span>
  );
}

/* Crosshairs on all four corners of a positioned parent. */
export function CornerMarks({ offset = -16 }: { offset?: number }) {
  return (
    <span aria-hidden="true" className="cmarks" style={{ inset: `${offset}px` }}>
      <Crosshair /><Crosshair /><Crosshair /><Crosshair />
    </span>
  );
}

/* Edge-trace hover highlight for chamfered links. */
export function EdgeTrace() {
  return (
    <span aria-hidden="true" className="edge">
      <span className="edge__t" />
      <span className="edge__r" />
      <span className="edge__b" />
      <span className="edge__l" />
    </span>
  );
}
