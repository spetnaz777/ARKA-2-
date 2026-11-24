import { useEffect, useRef, useState } from "react";
import { PROCESS, PROJECTS, SERVICES, STUDIO_FACTS } from "../content/site";
import { Reveal } from "../components/ui";
import { CircuitFrame, HudBrackets, Icon, Place, Readout, SignalNode, TickRuler, type Trace, type Node as FNode } from "../components/graphics";
import { Link } from "../lib/router";
import { Carousel } from "../components/Carousel";
import { LazyVideo, PaleImage } from "../components/media";
import { Decode, useHeroParallax, useScene } from "../components/fx";
import { Terminal } from "../components/Terminal";
import { ShowreelButton } from "../components/Showreel";
import AirlockHero from "../components/ui/airlock-spaceship-hero";
import { lazy, Suspense } from "react";
const BlackHole = lazy(() => import("../components/ui/blackhole-hero-section"));

/* Black hole behind the closing CTA: mounted only near the viewport and only on
   capable devices; everyone else keeps the horizon loop. */
function EventHorizon() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"wait" | "gl" | "video">("wait");
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const weak = !!nav.connection?.saveData || (nav.hardwareConcurrency || 8) < 4 || (nav.deviceMemory ?? 8) < 4;
    let gl = false;
    try { const c = document.createElement("canvas"); gl = !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { gl = false; }
    setNarrow(window.matchMedia("(max-width: 767px)").matches);
    if (weak || !gl) { setMode("video"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMode("gl"); io.disconnect(); } }, { rootMargin: "60% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`cta__bg cta__bg--bh${mode === "gl" ? " is-gl" : ""}`} aria-hidden="true">
      {mode === "video" && <LazyVideo name="horizon-loop" />}
      {mode === "gl" && (
        <Suspense fallback={null}>
          <BlackHole
            hotColor="#FFFFFF" midColor="#C9CED6" coolColor="#3A3F48"
            doppler={0.5} exposure={0.95} glow={narrow ? 0.8 : 1.05}
            focus={narrow ? [0.5, 0.78] : [0.5, 0.56]} distance={narrow ? 24 : 12} roll={narrow ? -12 : -16}
            fov={narrow ? 60 : 40} elevation={narrow ? -7 : -5}
            steps={narrow ? 170 : 230} resolution={narrow ? 0.5 : 0.62} maxDpr={narrow ? 1.5 : 1.75}
            scrim={narrow ? "top" : "none"} scrimStrength={0.85} vignette={0.4} starBrightness={0.35}
          />
        </Suspense>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Home: cinematic scenes. One idea per screen. On desktop (≥1100px, motion
   allowed) the hero and services are sticky "stages" whose progress is
   driven by native scroll; elsewhere every scene renders as a static,
   fully visible layout.
   ════════════════════════════════════════════════════════════ */

/* ── Cyber line layer ────────────────────────────────────────
   One frame per scene: continuous left/right rails (they meet the next
   scene's rails, so the trace runs top to bottom), 45° connectors along the
   content edges, hollow/filled nodes, a mono readout and a tick ruler.
   Strokes draw with scroll; white on dark scenes, graphite on light ones. */
function Lines({ traces = [], nodes = [], readout, readoutAt = "L+0,b-44", ruler, top = "t0", scrub = true }: { traces?: Trace[]; nodes?: FNode[]; readout?: string; readoutAt?: string; ruler?: string; top?: string; scrub?: boolean }) {
  return (
    <>
      <CircuitFrame
        scrub={scrub}
        className="lines"
        desktop={{
          traces: [{ pts: `l40,${top} l40,b0`, tone: "faint" }, { pts: `r-40,${top} r-40,b0`, tone: "faint" }, ...traces],
          nodes: [{ at: "l40,b-1", kind: "square" }, { at: "r-40,b-1", kind: "square" }, ...nodes],
        }}
        mobile={{ traces: [{ pts: `l10,${top} l10,b0`, tone: "faint" }], nodes: [{ at: "l10,b-1", kind: "square" }] }}
      />
      {readout && <Place at={readoutAt} className="hide-tablet"><Readout>{readout}</Readout></Place>}
      {ruler && <Place at={ruler} className="hide-tablet"><TickRuler length={140} vertical /></Place>}
    </>
  );
}

/* Word swap with a light trail (saas-motion-film signature 7). The fixed
   words never move; the slot word exits up with blur, the next whips in
   from the right, and a blurred light bar flashes behind the slot. Static
   under reduced motion. Screen readers get one stable sentence. */
function WordSwap({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    const start = window.setTimeout(function tick() {
      if (!document.hidden && !document.documentElement.classList.contains("intro-pending")) setI((v) => (v + 1) % words.length);
      t = window.setTimeout(tick, 2800);
    }, 3400);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(t);
    };
  }, [words.length]);
  return (
    <span className="swap">
      <span className="sr-only">{words.join(", ")}</span>
      <span className="swap__slot" aria-hidden="true">
        {words.map((w, k) => (
          <span key={w} className={`swap__w ${k === i ? "is-on" : ""}`}>{w}</span>
        ))}
        <span key={i} className="swap__trail" />
      </span>
    </span>
  );
}

/* ── Scene 1 · Hero ─────────────────────────────────────── */
function Hero() {
  const scene = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useScene(scene, { mode: "pin" });
  useHeroParallax(stage);
  // WebGL signature (lazy, capability-gated; the static moon is the fallback)
  useEffect(() => {
    const hero = stage.current;
    const sc = scene.current;
    const canvas = hero?.querySelector<HTMLCanvasElement>(".hero__gl");
    if (!hero || !sc || !canvas) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowPower = (navigator.hardwareConcurrency || 8) < 4 || (nav.deviceMemory ?? 8) < 4 || nav.connection?.saveData;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || lowPower) return;
    let stop = () => {};
    let cancelled = false;
    const go = () => {
      import("../components/heroGL").then(({ startHeroGL }) => {
        if (cancelled) return;
        // assemble the moon only while the gate still covers the hero;
        // otherwise add the cloud and rings without hiding the visible moon
        const assemble = document.documentElement.classList.contains("intro-pending");
        hero.classList.add(assemble ? "gl-on" : "gl-lite");
        stop = startHeroGL(canvas, hero, sc, assemble);
      });
    };
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const id = ric ? ric(go, { timeout: 1200 }) : window.setTimeout(go, 400);
    return () => {
      cancelled = true;
      if (!ric) window.clearTimeout(id);
      stop();
    };
  }, []);
  // intro (construct → unmask, ≈1.4s) waits for the gate; any input skips it
  useEffect(() => {
    const html = document.documentElement;
    const skip = () => html.classList.add("intro-skip");
    const off = () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    const t = window.setTimeout(off, 4000);
    return () => {
      window.clearTimeout(t);
      off();
    };
  }, []);

  return (
    <section ref={scene} className="scene scene--hero" data-tone="dark" aria-labelledby="hero-h">
      <div ref={stage} className="stage hero">
        <div className="scangrid" aria-hidden="true" />
        <Lines
          scrub={false}
          top="t126"
          traces={[
            { pts: "l40,t126 l80,t86 c-360,t86", tone: "line" },
            { pts: "c+360,t86 r-80,t86 r-40,t126", tone: "line" },
            { pts: "l40,b-120 l80,b-80 c-240,b-80", tone: "line", pulse: true },
            { pts: "c-240,b-80 c-200,b-40 c+40,b-40", tone: "faint" },
          ]}
          nodes={[{ at: "c-360,t86" }, { at: "c+360,t86" }, { at: "c-240,b-80", kind: "dot" }, { at: "l40,t126" }, { at: "r-40,t126" }]}
          readout="SYS.01 · N 43.65° / W 79.38°"
          readoutAt="L+0,b-118"
          ruler="r-58,t300"
        />
        <div className="hero__art" aria-hidden="true">
          <div className="bgfield bgfield--hero" />
          <div className="hero__moon">
            <div className="hero__moon-inner">
              <picture>
                <source media="(max-width: 700px)" srcSet="/media/moon-real-900.avif" type="image/avif" />
                <source media="(max-width: 700px)" srcSet="/media/moon-real-900.webp" type="image/webp" />
                <source srcSet="/media/moon-real-1600.avif" type="image/avif" />
                <img src="/media/moon-real-1600.webp" alt="" width={1600} height={1600} fetchPriority="high" decoding="async" />
              </picture>
              <canvas className="hero__gl" aria-hidden="true" />
              <span className="hero__light" />
              <span className="hero__shade" />
            </div>
          </div>
          <div className="hero__orbit">
            <div className="hero__sphere">
              <img src="/media/sphere-260.webp" alt="" width={260} height={260} decoding="async" />
            </div>
          </div>
          {/* the single technical accent: a trace that emerges from the moon and leads on */}
          <svg className="hero__trace" viewBox="0 0 200 600" preserveAspectRatio="xMidYMin meet" fill="none">
            <path d="M100 0 V300 L60 340 V600" pathLength={1} />
            <circle cx="100" cy="0" r="3.5" />
          </svg>
        </div>

        <div className="container hero__content">
          <p className="eyebrow hero__label"><Decode text="ARKA · AI STUDIO · EST. GTA" hover={false} /></p>
          <h1 id="hero-h" className="h-hero">
            <span className="h-hero__line"><span className="h-hero__in">AI, Software &amp;</span></span>{" "}
            <span className="h-hero__line"><em className="h-hero__in sweep">Digital Growth.</em></span>
          </h1>
          <p className="hero__copy">
            We engineer <WordSwap words={["AI systems.", "modern websites.", "real growth."]} />
          </p>
          <div className="hero__ctas">
            <Link to="/contact" className="pill pill--solid">Get Started</Link>
            <ShowreelButton className="pill glass glass--pill glass--dark" />
          </div>
        </div>
        <Terminal />
        <span className="hero__scroll" aria-hidden="true"><span /></span>
      </div>
    </section>
  );
}

/* ── Scene 2 · Services (pinned, one service per beat) ───── */
function Services() {
  const scene = useRef<HTMLElement>(null);
  useScene(scene, { mode: "pin", steps: SERVICES.length });
  // keyboard users: focusing a beat scrolls the stage to it
  const focusStep = (k: number) => {
    const el = scene.current;
    if (!el || !el.hasAttribute("data-step")) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((k + 0.5) / SERVICES.length) * total, behavior: "auto" });
  };
  return (
    <section ref={scene} className="scene scene--svc" data-tone="dark" aria-labelledby="svc-h">
      <div className="stage svc-stage">
        <div className="bgfield bgfield--svc" aria-hidden="true">
          <picture>
            <source srcSet="/media/moon-gibbous-1400.avif" type="image/avif" />
            <img src="/media/moon-gibbous-1400.webp" alt="" width={1400} height={1400} loading="lazy" decoding="async" />
          </picture>
        </div>
        <div className="scangrid" aria-hidden="true" />
        <Lines
          traces={[
            { pts: "l40,t120 l80,t160 L-20,t160", tone: "line" },
            { pts: "R+20,b-150 r-80,b-150 r-40,b-110", tone: "line", pulse: true },
          ]}
          nodes={[{ at: "L-20,t160" }, { at: "R+20,b-150" }]}
          readout="SYS.02 · 4 MODULES"
          readoutAt="L+0,b-60"
        />
        <div className="container svc-stage__grid">
          <div className="svc-stage__head">
            <p className="eyebrow">Services</p>
            <h2 id="svc-h" className="h-sec">Four disciplines.<br />One system.</h2>
            <ol className="svc-rail" aria-hidden="true">
              {SERVICES.map((s) => (
                <li key={s.slug}><span className="svc-rail__node" /><span className="svc-rail__n">{s.n}</span></li>
              ))}
              <span className="svc-rail__fill" />
            </ol>
          </div>
          <div className="svc-panel">
          <HudBrackets inset={-12} size={14} className="hide-tablet" />
          <ul className="svc-beats" role="list">
            {SERVICES.map((s, k) => (
              <li key={s.slug} className="svc-beat glass glass--panel glass--dark" data-tilt="" style={{ ["--k" as string]: k }}>
                <span className="svc-beat__icon" aria-hidden="true"><Icon name={s.icon} size={120} /></span>
                <span className="svc-beat__n"><Decode text={`SYS.${s.n} // ${s.short.toUpperCase()}`} /></span>
                <h3 className="svc-beat__t">{s.short}</h3>
                <p className="svc-beat__d">{s.card}</p>
                <Link to={`/services/${s.slug}`} className="svc-beat__link" onFocus={() => focusStep(k)}>
                  Explore {s.short} <Icon name="arrow-r" size={16} />
                </Link>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Scene 3 · Work (cinematic frame that settles in) ─────── */
function Work() {
  const scene = useRef<HTMLElement>(null);
  useScene(scene, { mode: "enter" });
  return (
    <section ref={scene} className="scene scene--work" aria-labelledby="work-h">
      <Lines
        traces={[{ pts: "l40,t110 l80,t150 L-26,t150", tone: "line" }, { pts: "R+26,b-140 r-80,b-140 r-40,b-100", tone: "line", pulse: true }]}
        nodes={[{ at: "L-26,t150" }, { at: "R+26,b-140" }]}
        ruler="r-58,t240"
      />
      <div className="container">
        <Carousel
          projects={PROJECTS}
          intro={
            <div className="work-head">
              <p className="eyebrow">Featured work</p>
              <h2 id="work-h" className="h-sec">Built to perform.</h2>
            </div>
          }
        />
      </div>
    </section>
  );
}

/* ── Scene 4 · Studio (statement, numerals, cinematic band) ── */
function Studio() {
  const band = useRef<HTMLDivElement>(null);
  useScene(band, { mode: "enter" });
  return (
    <section className="scene scene--studio" aria-labelledby="about-h">
      <Lines traces={[{ pts: "l40,t140 l80,t180 L-26,t180", tone: "line" }]} nodes={[{ at: "L-26,t180" }]} readout="SYS.04 · STUDIO · GTA" readoutAt="R-200,t120" />
      <div className="container studio">
        <Reveal className="studio__head">
          <p className="eyebrow">About</p>
          <h2 id="about-h" className="h-display">
            The <span className="anurati">ARKA</span> Studio.
          </h2>
          <p className="studio__p">
            A modern technology company at the intersection of AI, software, design and growth. We turn ideas into
            intelligent products and scalable digital systems.
          </p>
        </Reveal>
      </div>
      <div ref={band} className="band" data-tone="dark">
        <Lines traces={[{ pts: "l40,t60 L-26,t60", tone: "line" }]} nodes={[{ at: "L-26,t60" }]} readout="FIG.04 — TERRAIN · 43.65°N" readoutAt="L+0,t36" />
        <div className="band__frame">
          <PaleImage name="storm-peaks" className="band__img" sizes="100vw" />
        </div>
        <dl className="numerals container">
          {STUDIO_FACTS.map((f, i) => (
            <Reveal key={f.l} className="numerals__item glass glass--panel glass--dark" data-tilt="" delay={i * 80}>
              <dt className="numerals__v">{f.v}</dt>
              <dd className="numerals__l">{f.l}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ── Scene 5 · Process (draws as it enters) ──────────────── */
export function ProcessTimeline({ steps = PROCESS }: { steps?: { n?: string; t: string; d: string }[]; tail?: boolean; ruler?: boolean }) {
  return (
    <ol className="timeline">
      {steps.map((p, i) => (
        <li key={p.t} className="timeline__step glass glass--panel" data-tilt="" style={{ ["--i" as string]: i }}>
          <SignalNode filled={i === 0} />
          <span className="timeline__n">{p.n ?? `0${i + 1}`}</span>
          <span className="timeline__t">{p.t}</span>
          <span className="timeline__d">{p.d}</span>
        </li>
      ))}
    </ol>
  );
}

function Process() {
  return (
    <section className="scene scene--process" aria-labelledby="proc-h">
      <div className="bgfield bgfield--chrome" aria-hidden="true" />
      <Lines traces={[{ pts: "l40,t140 l80,t180 L-26,t180", tone: "line" }]} nodes={[{ at: "L-26,t180" }]} readout="SYS.05 · 4 PHASES" readoutAt="R-170,t120" />
      <div className="container">
        <Reveal className="process-head">
          <p className="eyebrow">Process</p>
          <h2 id="proc-h" className="h-sec">From idea to growth.</h2>
        </Reveal>
        <Reveal className="process-body">
          <ProcessTimeline />
        </Reveal>
      </div>
    </section>
  );
}

/* ── Scene · Film (the ARKA brand film, playing behind glass) ── */
function Film() {
  const scene = useRef<HTMLElement>(null);
  useScene(scene, { mode: "enter" });
  return (
    <section ref={scene} className="scene scene--film" data-tone="dark" aria-labelledby="film-h">
      <div className="scangrid" aria-hidden="true" />
      <Lines
        traces={[{ pts: "l40,b-300 l80,b-260 L-30,b-260", tone: "line" }]}
        nodes={[{ at: "L-30,b-260" }]}
        readout="SYS.03 · FILM 00:12 · 60FPS"
        readoutAt="R-230,t48"
      />
      <div className="film__bg" aria-hidden="true">
        <LazyVideo name="film-720" poster="/media/film-poster.webp" className="film__video" />
      </div>
      <Reveal className="container film__card glass glass--panel glass--dark glass--refract" data-tilt="">
        <HudBrackets inset={-12} size={14} />
        <p className="eyebrow">The film</p>
        <h2 id="film-h" className="h-sec">See ARKA in motion.</h2>
        <p className="film__p">Twelve seconds on how we think about AI, software and growth.</p>
        <ShowreelButton className="pill glass glass--pill glass--dark" />
      </Reveal>
    </section>
  );
}

/* ── Scene 6 · Closing CTA ───────────────────────────────── */
function Closing() {
  return (
    <section id="contact" className="scene scene--cta" data-tone="dark" aria-labelledby="cta-h">
      <div className="scangrid" aria-hidden="true" />
      <Lines
        traces={[{ pts: "l40,t160 l80,t200 c-360,t200", tone: "line" }, { pts: "c+360,b-200 r-80,b-200 r-40,b-160", tone: "line", pulse: true }]}
        nodes={[{ at: "c-360,t200" }, { at: "c+360,b-200" }]}
        readout="SYS.06 · CONTACT · CH 01"
        readoutAt="L+0,b-60"
      />
      <EventHorizon />
      <Reveal className="container cta glass glass--panel glass--dark glass--refract">
        <HudBrackets inset={-14} size={16} />
        <h2 id="cta-h" className="h-display cta__h">
          <span className="cta__l">
            {"Let’s Build".split(" ").map((w, i) => (<span key={w}>{i > 0 && " "}<span className="whip" style={{ ["--w" as string]: i }}>{w}</span></span>))}
          </span>{" "}
          <em className="cta__l">
            {"What’s Next.".split(" ").map((w, i) => (<span key={w}>{i > 0 && " "}<span className="whip" style={{ ["--w" as string]: i + 2 }}>{w}</span></span>))}
          </em>
        </h2>
        <p className="cta__p">From AI systems to full digital growth — tell us what you’re building.</p>
        <Link to="/contact" className="pill pill--solid">Get in Touch</Link>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <div className="home home--v4">
      <Hero />
      <AirlockHero
        id="orbit"
        videoSrc="/media/lunar-scrub-1080.mp4"
        mobileVideoSrc="/media/lunar-scrub-540.mp4"
        posterSrc="/media/lunar-scrub-poster.jpg"
        eyebrow="ARKA · Orbit"
        title="SYSTEMS ONLINE"
        tagline="Engineered for what’s next — AI, software and growth, in orbit around your business."
      />
      <Services />
      <Film />
      <Work />
      <Studio />
      <Process />
      <Closing />
    </div>
  );
}
