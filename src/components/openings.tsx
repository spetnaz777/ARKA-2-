import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Icon } from "./graphics";
import { Crumbs, Eyebrow, Kinetic, Photo, type PhotoKey } from "./v8";
import { SERVICES, PROJECTS } from "../content/site";
import { domainOf } from "./SitePreview";
import "../pages/openings.css";

/* ════════════════════════════════════════════════════════════
   Openings — one signature, scroll-pinned entrance per inner page.
   One family: a sticky 100svh stage, a single --p (0→1) written by a
   rAF-throttled scroll driver, transform/opacity-only motion, mono HUD
   hairlines. The H1 and all copy are in the prerendered HTML and fully
   visible without JS or under prefers-reduced-motion (the stage then
   renders as a static, un-pinned hero in its resolved state).
   ════════════════════════════════════════════════════════════ */

type Frame = (p: number, v: number) => void;

const ric = (cb: () => void, timeout = 2500) => {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 600);
  return () => window.clearTimeout(id);
};

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Scroll driver for one pinned section. `pinned`: 0 at the top of the
   section, 1 when its sticky stage is about to release. Otherwise 0 when
   the section top is at the viewport top, 1 once it has scrolled away. */
function useScene<T extends HTMLElement>(pinned: boolean, onFrame?: Frame) {
  const ref = useRef<T>(null);
  const cb = useRef(onFrame);
  cb.current = onFrame;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      el.classList.add("is-static");
      cb.current?.(1, 0);
      return;
    }
    el.classList.add("is-live");
    let on = true;
    let raf = 0;
    let last = -1;
    let lastT = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p = pinned ? -r.top / Math.max(1, r.height - vh) : -r.top / Math.max(1, r.height);
      p = Math.min(1, Math.max(0, p));
      if (Math.abs(p - last) < 0.0005) return;
      const now = performance.now();
      const v = last < 0 ? 0 : (p - last) / Math.max(8, now - lastT);
      last = p;
      lastT = now;
      el.style.setProperty("--p", p.toFixed(4));
      cb.current?.(p, v);
    };
    const req = () => {
      if (on && !raf) raf = requestAnimationFrame(measure);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (on) req();
    });
    io.observe(el);
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req, { passive: true });
    req();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, [pinned]);
  return ref;
}

/* Writes a value into a small fixed-width mono span without touching React. */
function useReadouts<K extends string>() {
  const refs = useRef<Partial<Record<K, HTMLSpanElement | null>>>({});
  const prev = useRef<Partial<Record<K, string>>>({});
  const set = (k: K, v: string) => {
    if (prev.current[k] === v) return;
    prev.current[k] = v;
    const el = refs.current[k];
    if (el) el.textContent = v;
  };
  const bind = (k: K) => (el: HTMLSpanElement | null) => {
    refs.current[k] = el;
  };
  return { set, bind };
}

/* ── Shared copy block ────────────────────────────────────── */
type Copy = {
  eyebrow: string; n?: string; title: string; accent?: string; intro?: string;
  crumbs?: [string, string?][]; children?: React.ReactNode;
};

function Lockup({ eyebrow, n, title, accent, intro, crumbs, children, early = false }: Copy & { early?: boolean }) {
  return (
    <div className="container op__inner">
      {crumbs && <Crumbs items={crumbs} />}
      <Eyebrow n={n} label={eyebrow} className="x-hero__eyebrow" />
      <Kinetic text={title} accent={accent} className="x-hero__title op__title" delay={180} />
      <div className={`op__reveal${early ? " op__reveal--early" : ""}`}>
        {intro && <p className="x-hero__intro">{intro}</p>}
        {children}
      </div>
    </div>
  );
}

/* HUD frame: corner brackets + four hairlines that draw in with scroll. */
function HudFrame({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="op-hud" aria-hidden="true">
      <i className="op-hud__c op-hud__c--tl" />
      <i className="op-hud__c op-hud__c--tr" />
      <i className="op-hud__c op-hud__c--bl" />
      <i className="op-hud__c op-hud__c--br" />
      <i className="op-hud__l op-hud__l--t" />
      <i className="op-hud__l op-hud__l--b" />
      <i className="op-hud__l op-hud__l--l" />
      <i className="op-hud__l op-hud__l--r" />
      {left && <span className="op-hud__r op-hud__r--l">{left}</span>}
      {right && <span className="op-hud__r op-hud__r--r">{right}</span>}
    </div>
  );
}

function Cue() {
  return (
    <div className="op__cue" aria-hidden="true">
      <span>Scroll</span>
      <i />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   /services — ORBIT. The four disciplines converge from deep space onto
   ellipses around the moon, link up with hairlines, then the system
   settles and the copy resolves.
   ════════════════════════════════════════════════════════════ */
export function OrbitOpening(props: Copy) {
  const ro = useReadouts<"deg" | "lock">();
  const ref = useScene<HTMLElement>(true, (p) => {
    ro.set("deg", String(Math.round(p * 140)).padStart(3, "0"));
    ro.set("lock", p > 0.58 ? "LOCKED" : "ACQUIRING");
  });
  return (
    <section ref={ref} className="op op--orbit">
      <div className="op__stage">
        <div className="op-orbit" aria-hidden="true">
          <div className="op-orbit__halo" />
          <svg className="op-orbit__rings" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMidYMid meet">
            <ellipse className="op-orbit__ring op-orbit__ring--1" cx="0" cy="0" rx="470" ry="169" />
            <ellipse className="op-orbit__ring op-orbit__ring--2" cx="0" cy="0" rx="370" ry="133" />
            <ellipse className="op-orbit__ring op-orbit__ring--3" cx="0" cy="0" rx="230" ry="83" />
          </svg>
          <picture className="op-orbit__moon">
            <source type="image/avif" srcSet="/media/moon-real-900.avif" />
            <img src="/media/moon-real-900.webp" alt="" width={900} height={900} decoding="async" fetchPriority="high" />
          </picture>
          {SERVICES.map((s, i) => (
            <div key={s.slug} className="op-orbit__sat" style={{ ["--a0" as string]: `${i * 90 + 24}deg`, ["--i" as string]: i }}>
              <i className="op-orbit__tether" />
              <span className="op-orbit__node">
                <span className="op-orbit__icon"><Icon name={s.icon} size={18} /></span>
                <span className="op-orbit__label"><b>{s.n}</b>{s.short}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="op__shade op__shade--orbit" aria-hidden="true" />
        <HudFrame
          left={<>ORBIT.SYS · 4 MODULES</>}
          right={<>Θ <span ref={ro.bind("deg")}>000</span>° · <span ref={ro.bind("lock")}>ACQUIRING</span></>}
        />
        <Lockup {...props} />
        <Cue />
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   /work — WARP. A starfield streaks toward the viewer (speed follows
   scroll velocity); the real site previews fly in as floating screens
   on a 3D lane and pass the camera before the copy resolves.
   ════════════════════════════════════════════════════════════ */
function Starfield({ host, speed }: { host: React.RefObject<HTMLElement | null>; speed: React.MutableRefObject<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    const h = host.current;
    if (!c || !h) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduce = reducedMotion();
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const N = narrow ? 200 : 420;
    const dpr = Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 1.25);
    let w = 0, hh = 0, cx = 0, cy = 0, f = 0;
    const xs = new Float32Array(N), ys = new Float32Array(N), zs = new Float32Array(N), pz = new Float32Array(N);
    const seed = (i: number, far: boolean) => {
      xs[i] = (Math.random() * 2 - 1) * 1.2;
      ys[i] = (Math.random() * 2 - 1) * 1.2;
      zs[i] = far ? 1 : Math.random() * 0.98 + 0.02;
      pz[i] = zs[i];
    };
    for (let i = 0; i < N; i++) seed(i, false);
    const size = () => {
      const r = c.getBoundingClientRect();
      w = r.width; hh = r.height; cx = w / 2; cy = hh * 0.46; f = Math.max(w, hh) * 0.5;
      c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    let raf = 0, visible = true, lastT = 0, cur = 0.12;
    const draw = (dt: number) => {
      const target = 0.12 + Math.min(3.2, speed.current);
      cur += (target - cur) * Math.min(1, dt * 0.006);
      const step = cur * dt * 0.00022;
      ctx.clearRect(0, 0, w, hh);
      ctx.lineCap = "round";
      for (let b = 0; b < 3; b++) {
        ctx.beginPath();
        ctx.strokeStyle = b === 0 ? "rgba(139,145,155,0.55)" : b === 1 ? "rgba(214,218,224,0.75)" : "rgba(255,255,255,0.95)";
        ctx.lineWidth = b === 2 ? 1.4 : 1;
        for (let i = b; i < N; i += 3) {
          pz[i] = zs[i];
          zs[i] -= step;
          if (zs[i] <= 0.02) { seed(i, true); continue; }
          const sx = cx + (xs[i] / zs[i]) * f, sy = cy + (ys[i] / zs[i]) * f;
          if (sx < -40 || sx > w + 40 || sy < -40 || sy > hh + 40) { seed(i, true); continue; }
          const tz = Math.min(1, zs[i] + step * (1 + cur * 5));
          const px = cx + (xs[i] / tz) * f, py = cy + (ys[i] / tz) * f;
          ctx.moveTo(px, py);
          ctx.lineTo(sx + 0.01, sy + 0.01);
        }
        ctx.stroke();
      }
    };
    const tick = (t: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = lastT ? Math.min(50, t - lastT) : 16;
      lastT = t;
      draw(dt);
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && visible && !reduce) { lastT = 0; raf = requestAnimationFrame(tick); } };
    if (reduce) draw(16);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(h);
    const ro = new ResizeObserver(() => { size(); if (reduce) draw(16); });
    ro.observe(c);
    const vis = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", vis);
    c.classList.add("is-on");
    start();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [host, speed]);
  return <canvas ref={canvas} className="op-warp__stars" aria-hidden="true" />;
}

/* lane positions for the floating screens (x,y in % of stage, start depth) */
const LANE: [number, number, number][] = [
  [-30, -14, -900],
  [34, 14, -1500],
  [-42, 24, -2100],
  [46, -22, -2700],
  [2, -8, -3300],
];

export function WarpOpening(props: Copy) {
  const speed = useRef(0);
  const [stars, setStars] = useState(false);
  const ro = useReadouts<"v" | "n">();
  const ref = useScene<HTMLElement>(true, (p, v) => {
    speed.current = Math.abs(v) * 900 + Math.sin(Math.min(1, p) * Math.PI) * 1.4;
    ro.set("v", (0.12 + speed.current).toFixed(2));
    ro.set("n", String(Math.min(PROJECTS.length, Math.max(0, Math.floor(p * 1.25 * PROJECTS.length)))).padStart(2, "0"));
  });
  useEffect(() => {
    // decay the velocity term when scrolling stops
    let id = 0;
    const decay = () => {
      speed.current *= 0.9;
      id = window.setTimeout(decay, 80);
    };
    decay();
    const cancel = ric(() => setStars(true), 1800);
    return () => { window.clearTimeout(id); cancel(); };
  }, []);
  const shots = PROJECTS.slice(0, LANE.length);
  return (
    <section ref={ref} className="op op--warp">
      <div className="op__stage">
        <div className="op-warp__glow" aria-hidden="true" />
        {stars && <Starfield host={ref} speed={speed} />}
        <div className="op-warp__space" aria-hidden="true">
          {shots.map((p, i) => {
            const [x, y, z] = LANE[i];
            return (
              <figure key={p.slug} className="op-warp__screen" style={{ ["--x" as string]: x, ["--y" as string]: y, ["--z0" as string]: z }}>
                <span className="op-warp__bar"><i /><i /><i /><em>{domainOf(p.url)}</em></span>
                <img src={`/media/sites/${p.slug}-desktop-960.webp`} alt="" width={960} height={600} decoding="async" loading={i < 2 ? "eager" : "lazy"} />
              </figure>
            );
          })}
        </div>
        <div className="op__shade op__shade--warp" aria-hidden="true" />
        <HudFrame
          left={<>WARP · INDEX <span ref={ro.bind("n")}>00</span>/{String(PROJECTS.length).padStart(2, "0")}</>}
          right={<>V <span ref={ro.bind("v")}>0.12</span> c</>}
        />
        <Lockup {...props} />
        <Cue />
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   /about — DESCENT. Earth from orbit, slowly zooming as you scroll; the
   frame dissolves into the night side over Toronto while HUD readouts
   count the altitude down and a targeting reticle locks.
   ════════════════════════════════════════════════════════════ */
export function DescentOpening(props: Copy) {
  const ro = useReadouts<"alt" | "vel" | "pct">();
  const ref = useScene<HTMLElement>(true, (p) => {
    const e = 1 - Math.pow(1 - p, 2.2);
    ro.set("alt", (408 - e * 396).toFixed(1).padStart(5, "0"));
    ro.set("vel", (7.66 - e * 7.2).toFixed(2));
    ro.set("pct", String(Math.round(p * 100)).padStart(3, "0"));
  });
  return (
    <section ref={ref} className="op op--descent">
      <div className="op__stage">
        <div className="op-descent__media op-descent__media--day" aria-hidden="true">
          <Photo k="orbit-day" alt="" eager className="op-descent__img" />
        </div>
        <div className="op-descent__media op-descent__media--night" aria-hidden="true">
          <Photo k="orbit-night" alt="" className="op-descent__img" />
        </div>
        <div className="op__shade op__shade--descent" aria-hidden="true" />
        <div className="op-descent__reticle" aria-hidden="true">
          <i /><i /><i /><i />
          <span className="op-descent__cross" />
          <span className="op-descent__tag">TGT · TORONTO</span>
        </div>
        <div className="op-descent__ruler" aria-hidden="true"><i /></div>
        <dl className="op-descent__read" aria-hidden="true">
          <div><dt>ALT</dt><dd><span ref={ro.bind("alt")}>408.0</span> KM</dd></div>
          <div><dt>VEL</dt><dd><span ref={ro.bind("vel")}>7.66</span> KM/S</dd></div>
          <div><dt>DESC</dt><dd><span ref={ro.bind("pct")}>000</span> %</dd></div>
        </dl>
        <HudFrame left={<>STUDIO · 43.65°N 79.38°W</>} right={<>ORBIT → GROUND</>} />
        <Lockup {...props} />
        <Cue />
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   /contact — EVENT HORIZON. The ray-traced black hole (monochrome,
   30fps, pixel-capped, paused off-screen) mounts at idle behind the
   copy; a static CSS horizon stands in until then and on weak devices.
   ════════════════════════════════════════════════════════════ */
const BlackHole = lazy(() => import("./ui/blackhole-hero-section"));

export function HorizonOpening(props: Copy) {
  const ref = useScene<HTMLElement>(false);
  const [mode, setMode] = useState<"css" | "gl">("css");
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    if (reducedMotion()) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const weak = !!nav.connection?.saveData || (nav.hardwareConcurrency || 8) < 4 || (nav.deviceMemory ?? 8) < 4;
    let gl = false;
    try { const c = document.createElement("canvas"); gl = !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { gl = false; }
    if (weak || !gl) return;
    setNarrow(window.matchMedia("(max-width: 767px)").matches);
    let cancel = () => {};
    const t = window.setTimeout(() => { cancel = ric(() => setMode("gl"), 3000); }, 700);
    return () => { window.clearTimeout(t); cancel(); };
  }, []);
  return (
    <section ref={ref} className={`op op--horizon${mode === "gl" ? " is-gl" : ""}`}>
      <div className="op__stage">
        <div className="op-horizon__bg" aria-hidden="true">
          <div className="op-horizon__css"><i /></div>
          {mode === "gl" && (
            <Suspense fallback={null}>
              <BlackHole
                className="op-horizon__gl"
                hotColor="#FFFFFF" midColor="#B9BEC6" coolColor="#3A3E46"
                doppler={0.55} exposure={1.0} glow={narrow ? 0.5 : 0.6}
                focus={narrow ? [0.5, 0.3] : [0.7, 0.48]} distance={narrow ? 23 : 18}
                roll={narrow ? -10 : -18} fov={narrow ? 56 : 40} elevation={narrow ? -6 : -5}
                steps={narrow ? 140 : 170} resolution={narrow ? 0.55 : 0.6} maxDpr={1.25}
                maxFps={30} maxScenePixels={narrow ? 180_000 : 300_000}
                scrim={narrow ? "bottom" : "left"} scrimStrength={0.86} vignette={0.32} starBrightness={0.45}
              />
            </Suspense>
          )}
        </div>
        <div className="op__shade op__shade--horizon" aria-hidden="true" />
        <HudFrame left={<>CH.06 · OPEN CHANNEL</>} right={<>R<sub>s</sub> · SIGNAL CLEAR</>} />
        <Lockup {...props} early />
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   Service + case-study detail pages — a shorter cinematic intro: pinned
   image push-in, kinetic headline, HUD hairlines drawing on with scroll.
   ════════════════════════════════════════════════════════════ */
export function DetailOpening({ photo, alt, readout, ...copy }: Copy & { photo: PhotoKey; alt: string; readout: string }) {
  const ro = useReadouts<"pct">();
  const ref = useScene<HTMLElement>(true, (p) => ro.set("pct", String(Math.round(p * 100)).padStart(3, "0")));
  return (
    <section ref={ref} className="op op--detail">
      <div className="op__stage">
        <div className="op-detail__media">
          <Photo k={photo} alt={alt} eager className="op-detail__img" />
        </div>
        <div className="op__shade op__shade--detail" aria-hidden="true" />
        <div className="op-detail__scan" aria-hidden="true"><i /></div>
        <HudFrame left={<>{readout}</>} right={<>SCAN <span ref={ro.bind("pct")}>000</span>%</>} />
        <Lockup {...copy} early />
      </div>
    </section>
  );
}
