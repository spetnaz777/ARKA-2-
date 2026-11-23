import { useEffect, useRef, useState } from "react";
import { PROCESS, PROJECTS, SERVICES, STUDIO_FACTS } from "../content/site";
import { Reveal } from "../components/ui";
import { Icon, SignalNode } from "../components/graphics";
import { Link } from "../lib/router";
import { Carousel } from "../components/Carousel";
import { LazyVideo } from "../components/media";
import { useHeroParallax, useScene } from "../components/fx";
import { ShowreelButton } from "../components/Showreel";

/* ════════════════════════════════════════════════════════════
   Home: cinematic scenes. One idea per screen. On desktop (≥1100px, motion
   allowed) the hero and services are sticky "stages" whose progress is
   driven by native scroll; elsewhere every scene renders as a static,
   fully visible layout.
   ════════════════════════════════════════════════════════════ */

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
        <div className="hero__art" aria-hidden="true">
          <div className="bgfield bgfield--hero" />
          <div className="hero__moon">
            <div className="hero__moon-inner">
              <picture>
                <source media="(max-width: 700px)" srcSet="/media/moon-900.avif" type="image/avif" />
                <source media="(max-width: 700px)" srcSet="/media/moon-900.webp" type="image/webp" />
                <source srcSet="/media/moon-1600.avif" type="image/avif" />
                <img src="/media/moon-1600.webp" alt="" width={1600} height={1600} fetchPriority="high" decoding="async" />
              </picture>
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
          <p className="eyebrow hero__label">ARKA · AI studio</p>
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
          <img src="/media/moon-900.webp" alt="" width={900} height={900} loading="lazy" decoding="async" />
        </div>
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
          <ul className="svc-beats glass glass--panel glass--dark" data-tilt="" role="list">
            {SERVICES.map((s, k) => (
              <li key={s.slug} className="svc-beat" style={{ ["--k" as string]: k }}>
                <span className="svc-beat__icon" aria-hidden="true"><Icon name={s.icon} size={120} /></span>
                <span className="svc-beat__n">{s.n}</span>
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
    </section>
  );
}

/* ── Scene 3 · Work (cinematic frame that settles in) ─────── */
function Work() {
  const scene = useRef<HTMLElement>(null);
  useScene(scene, { mode: "enter" });
  return (
    <section ref={scene} className="scene scene--work" aria-labelledby="work-h">
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
        <div className="band__frame">
          <LazyVideo name="terrain-loop" className="band__video" />
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
      <div className="film__bg" aria-hidden="true">
        <LazyVideo name="film-720" poster="/media/film-poster.webp" className="film__video" />
      </div>
      <Reveal className="container film__card glass glass--panel glass--dark glass--refract" data-tilt="">
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
      <div className="cta__bg" aria-hidden="true">
        <LazyVideo name="horizon-loop" />
      </div>
      <Reveal className="container cta glass glass--panel glass--dark glass--refract">
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
      <Services />
      <Film />
      <Work />
      <Studio />
      <Process />
      <Closing />
    </div>
  );
}
