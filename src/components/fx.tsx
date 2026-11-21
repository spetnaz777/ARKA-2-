import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Signature interactions. Lightweight (no libraries), all disabled under
   prefers-reduced-motion, and none of them hold content hostage: every
   element is fully visible and usable without them.
   ───────────────────────────────────────────────────────────── */

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
export const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ── Cyber text decode ─────────────────────────────────────── */
const GLYPHS = "ABCDEFGHJKLMNPRSTUVXYZ0123456789/<>_#";
function scramble(el: HTMLElement, text: string, ms = 420) {
  if (reduced()) return;
  const start = performance.now();
  const chars = [...text];
  let raf = 0;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / ms);
    const settled = Math.floor(p * chars.length);
    el.textContent = chars
      .map((c, i) => (i < settled || c === " " || c === "/" ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
      .join("");
    if (p < 1) raf = requestAnimationFrame(tick);
    else el.textContent = text;
  };
  cancelAnimationFrame((el as HTMLElement & { _raf?: number })._raf ?? 0);
  raf = requestAnimationFrame(tick);
  (el as HTMLElement & { _raf?: number })._raf = raf;
}

/* Text that decodes once when it scrolls into view and again on hover.
   Screen readers get the real text; the animated copy is aria-hidden. */
export function Decode({ text, className = "", hover = true, onView = true }: { text: string; className?: string; hover?: boolean; onView?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !onView || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          scramble(el, text, 520);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, onView]);
  return (
    <span className={`decode ${className}`} onMouseEnter={hover ? () => ref.current && scramble(ref.current, text, 360) : undefined}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

/* Attach decode-on-hover to any element containing [data-decode] text. */
export function useHoverDecode(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || !finePointer()) return;
    const on = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-decode]");
      if (!t) return;
      const target = t.querySelector<HTMLElement>("[data-decode-text]");
      if (target) scramble(target, t.dataset.decode!, 340);
    };
    el.addEventListener("mouseover", on);
    return () => el.removeEventListener("mouseover", on);
  }, [root]);
}

/* ── Cursor crosshair (desktop, fine pointer only) ─────────── */
export function CursorCrosshair() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reduced()) return;
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0, shown = false;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        x = tx;
        y = ty;
        shown = true;
        el.classList.add("is-on");
      }
      const t = e.target as HTMLElement;
      el.classList.toggle("is-hot", !!t.closest("a, button, [role=button], summary, label, input, select, textarea"));
    };
    const leave = () => {
      shown = false;
      el.classList.remove("is-on");
    };
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div ref={ref} className="xhair" aria-hidden="true">
      <span className="xhair__h" />
      <span className="xhair__v" />
      <span className="xhair__ring" />
    </div>
  );
}

/* ── Magnetic buttons (delegated, desktop only) ────────────── */
export function useMagnetic() {
  useEffect(() => {
    if (!finePointer() || reduced()) return;
    let active: HTMLElement | null = null;
    const move = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>(".btn, .ctrl-btn, .playlink");
      if (active && active !== b) {
        active.style.transform = "";
        active = null;
      }
      if (!b) return;
      active = b;
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      b.style.transform = `translate(${(dx * 5).toFixed(2)}px, ${(dy * 4).toFixed(2)}px)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
}

/* ── Hero parallax: writes --mx/--my (-1..1) on the hero ───── */
export function useHeroParallax(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reduced()) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, running = false;
    const loop = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    el.addEventListener("pointermove", move, { passive: true });
    return () => {
      el.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

/* ── One continuous circuit that draws itself with scroll ──────
   Measures [data-circuit-node] anchors inside `root`, builds a single
   polyline down a rail with 45° jogs into each node, then maps scroll
   progress to stroke length. Nodes light as the stroke reaches them. */
export function ScrollCircuit({ root }: { root: React.RefObject<HTMLElement | null> }) {
  const svg = useRef<SVGSVGElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string; len: number; nodes: { x: number; y: number; at: number }[] } | null>(null);

  useIso(() => {
    // parent refs attach after child layout effects, so resolve the host via the DOM
    const host = root.current ?? (probe.current?.parentElement as HTMLElement | null);
    if (!host) return;
    const build = () => {
      const hr = host.getBoundingClientRect();
      const w = host.clientWidth;
      const h = host.scrollHeight;
      const mobile = w < 1100;
      const pad = w >= 768 ? 24 : 20;
      const half = Math.min(620, w / 2 - pad);
      const rail = mobile ? 10 : Math.max(18, w / 2 - half - 52);
      const anchors = Array.from(host.querySelectorAll<HTMLElement>("[data-circuit-node]"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left - hr.left, y: r.top - hr.top + r.height / 2 };
        })
        .sort((a, b) => a.y - b.y);
      if (!anchors.length) return;
      const pts: [number, number][] = [];
      const nodes: { x: number; y: number; seg: number }[] = [];
      const j = mobile ? 0 : 26; // 45° jog distance
      pts.push([rail, anchors[0].y - 140]);
      anchors.forEach((a, i) => {
        const nx = mobile ? rail : Math.min(a.x - 14, rail + j);
        if (i === anchors.length - 1 && !mobile) {
          // final run: into the contact banner, then along its top edge
          pts.push([rail, a.y - (nx - rail)]);
          pts.push([nx, a.y]);
          nodes.push({ x: nx, y: a.y, seg: pts.length - 1 });
          pts.push([a.x + 220, a.y]);
        } else if (mobile) {
          pts.push([rail, a.y]);
          nodes.push({ x: rail, y: a.y, seg: pts.length - 1 });
        } else {
          pts.push([rail, a.y - j]);
          pts.push([rail + j, a.y]);
          nodes.push({ x: rail + j, y: a.y, seg: pts.length - 1 });
          pts.push([rail + j, a.y + 2 * j]);
          pts.push([rail, a.y + 3 * j]);
        }
      });
      // cumulative lengths
      const cum = [0];
      for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const len = cum[cum.length - 1];
      setGeo({
        w,
        h,
        len,
        d: pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" "),
        nodes: nodes.map((n) => ({ x: n.x, y: n.y, at: cum[n.seg] / len })),
      });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(host);
    window.addEventListener("load", build);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", build);
    };
  }, [root]);

  useEffect(() => {
    if (!geo || !svg.current) return;
    const host = (root.current ?? probe.current?.parentElement) as HTMLElement;
    const path = svg.current.querySelector<SVGPathElement>(".sc__draw");
    const nodeEls = Array.from(svg.current.querySelectorAll<SVGGElement>(".sc__node"));
    if (!path) return;
    if (reduced()) {
      path.style.strokeDashoffset = "0";
      nodeEls.forEach((n) => n.classList.add("is-lit"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const top = host.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight;
      // the drawing head sits ~62% down the viewport
      const head = window.scrollY + vh * 0.62 - top;
      // convert head (y) to path progress by walking node anchors
      const pts = geo.nodes;
      let p = 0;
      if (head <= pts[0].y) p = (Math.max(0, head - (pts[0].y - 140)) / 140) * pts[0].at;
      else if (head >= pts[pts.length - 1].y) p = pts[pts.length - 1].at + (1 - pts[pts.length - 1].at) * Math.min(1, (head - pts[pts.length - 1].y) / 260);
      else {
        for (let i = 0; i < pts.length - 1; i++) {
          if (head >= pts[i].y && head < pts[i + 1].y) {
            const f = (head - pts[i].y) / (pts[i + 1].y - pts[i].y);
            p = pts[i].at + f * (pts[i + 1].at - pts[i].at);
            break;
          }
        }
      }
      if (window.scrollY + vh >= document.documentElement.scrollHeight - 4) p = 1; // page end: complete the run
      p = Math.max(0, Math.min(1, p));
      path.style.strokeDashoffset = String(geo.len * (1 - p));
      nodeEls.forEach((n, i) => n.classList.toggle("is-lit", p >= geo.nodes[i].at - 0.002));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [geo, root]);

  if (!geo) return <span ref={probe} hidden />;
  return (
    <>
    <span ref={probe} hidden />
    <svg ref={svg} className="sc" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true" fill="none">
      <path d={geo.d} className="sc__track" />
      <path d={geo.d} className="sc__draw" style={{ strokeDasharray: geo.len, strokeDashoffset: geo.len }} />
      {geo.nodes.map((n, i) => (
        <g key={i} className="sc__node" transform={`translate(${n.x} ${n.y})`}>
          <rect x={-4.5} y={-4.5} width={9} height={9} />
          <rect className="sc__core" x={-1.5} y={-1.5} width={3} height={3} />
        </g>
      ))}
    </svg>
    </>
  );
}
