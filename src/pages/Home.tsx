import { useEffect, useRef, type ReactNode } from "react";
import { PROCESS, PROJECTS, SERVICES, STUDIO_FACTS } from "../content/site";
import { Button, Reveal, SectionLabel, ServiceCard } from "../components/ui";
import { CircuitFrame, Readout, SignalNode } from "../components/graphics";
import { ContactBanner } from "../components/layout";
import { Link } from "../lib/router";
import { Carousel } from "../components/Carousel";
import { LazyVideo } from "../components/media";
import { ScrollCircuit, useHeroParallax } from "../components/fx";

/* Anchor for the scroll-drawn circuit. */
function Node({ children }: { children: ReactNode }) {
  return <div data-circuit-node="">{children}</div>;
}

/* ── 01 Hero ─────────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  useHeroParallax(ref);
  // the intro (lines construct → headline unmasks, ~1.4s) is skippable:
  // any key, click or wheel during it jumps straight to the end state
  useEffect(() => {
    const html = document.documentElement;
    const skip = () => html.classList.add("intro-skip");
    const t = window.setTimeout(() => off(), 2600);
    const off = () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    return () => {
      window.clearTimeout(t);
      off();
    };
  }, []);
  return (
    <section ref={ref} className="hero" aria-labelledby="hero-h">
      <CircuitFrame
        className="hero__frame"
        desktop={{
          traces: [
            { pts: "c-470,t60 c-400,t60 c-352,t108 c+232,t108 c+280,t60 c+330,t60 c+390,t0" },
            { pts: "l0,b-68 l48,b-20 c-262,b-20 c-214,b-68 c+130,b-68", tone: "faint" },
            { pts: "c+355,t134 c+355,b0", tone: "ink", pulse: "signal" },
            { pts: "c+355,t136 c+355,t196", tone: "thick" },
            { pts: "c+355,b-8 c+540,b-8 c+620,b-88 r0,b-88", tone: "faint" },
          ],
          arcs: [{ c: "c+355,b0", r: 362, from: 180, to: 270, tone: "ink" }],
          nodes: [{ at: "c-470,t60" }, { at: "c+80,t108", kind: "pair" }, { at: "c+355,t360", kind: "dot" }],
        }}
        mobile={{ traces: [{ pts: "l0,b-24 l24,b0 r-120,b0 r-96,b-24 r0,b-24", tone: "faint" }] }}
      />

      <div className="hero__art" aria-hidden="true">
        <div className="hero__moon">
          <div className="hero__moon-inner">
            <picture>
              <source media="(max-width: 700px)" srcSet="/media/moon-900.avif" type="image/avif" />
              <source media="(max-width: 700px)" srcSet="/media/moon-900.webp" type="image/webp" />
              <source srcSet="/media/moon-1600.avif" type="image/avif" />
              <img src="/media/moon-1600.webp" alt="" width={1600} height={1600} fetchPriority="high" decoding="async" />
            </picture>
            <span className="hero__light" />
          </div>
        </div>
        <div className="hero__terrain">
          <picture>
            <source media="(max-width: 700px)" srcSet="/media/terrain-480.avif" type="image/avif" />
            <source media="(max-width: 700px)" srcSet="/media/terrain-480.webp" type="image/webp" />
            <source srcSet="/media/terrain-840.avif" type="image/avif" />
            <img src="/media/terrain-840.webp" alt="" width={840} height={740} decoding="async" fetchPriority="high" />
          </picture>
        </div>
        <div className="hero__orbit">
          <div className="hero__sphere">
            <img src="/media/sphere-260.webp" alt="" width={260} height={260} decoding="async" />
          </div>
        </div>
        <svg className="hero__arc-m" viewBox="0 0 400 400" fill="none">
          <path d="M10 400 A 390 390 0 0 1 400 10" className="tr tr--ink" />
        </svg>
        <Readout className="hero__coord">N 43.65° / W 79.38°</Readout>
      </div>

      <div className="container hero__content">
        <Node>
          <SectionLabel n="01" label="ARKA" className="hero__label" />
        </Node>
        <h1 id="hero-h" className="h-hero">
          <span className="h-hero__line"><span className="h-hero__in">AI, Software &amp;</span></span>{" "}
          <span className="h-hero__line"><em className="h-hero__in">Digital Growth.</em></span>
        </h1>
        <p className="hero__copy">
          We build intelligent systems, modern websites, and marketing ecosystems that drive real growth.
        </p>
        <div className="hero__ctas">
          <Button to="/contact" variant="primary">Get Started</Button>
          <Link to="/work" className="playlink">
            <span className="playlink__ring" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6h8M6.5 2.5 10 6 6.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
            </span>
            Explore Our Work
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── 02 Services ─────────────────────────────────────────── */
function Services() {
  return (
    <section className="sec sec--services" aria-labelledby="svc-h">
      <CircuitFrame
        desktop={{
          traces: [
            { pts: "c-332,t96 c-332,b-96 c-286,b-50 c+64,b-50", tone: "faint" },
            { pts: "c+96,b-50 c+600,b-50 c+620,b-70", tone: "faint" },
          ],
          nodes: [{ at: "c-332,t96" }, { at: "c+80,b-50", kind: "pair" }],
        }}
      />
      <div className="container sec__grid">
        <Reveal className="sec__intro">
          <Node><SectionLabel n="02" label="Services" /></Node>
          <h2 id="svc-h" className="h-sec">What We <strong>Do.</strong></h2>
          <p className="sec__lead">End-to-end technology and growth solutions, powered by AI.</p>
        </Reveal>
        <ul className="svc-grid" role="list">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.slug} s={s} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── 03 Featured work ────────────────────────────────────── */
function FeaturedWork() {
  return (
    <section className="sec sec--work" aria-labelledby="work-h">
      <div className="container">
        <Carousel
          projects={PROJECTS}
          intro={
            <div className="sec__intro">
              <Node><SectionLabel n="03" label="Featured Work" /></Node>
              <h2 id="work-h" className="h-sec">Selected <strong>Work.</strong></h2>
              <p className="sec__lead">A look at what we’ve built.</p>
            </div>
          }
        />
      </div>
    </section>
  );
}

/* ── 04 About ────────────────────────────────────────────── */
function AboutStudio() {
  return (
    <section className="sec sec--about" aria-labelledby="about-h">
      <div className="container about">
        <div className="about__frame">
          <div className="about__media">
            <LazyVideo name="terrain-loop" className="about__video" />
            <svg className="about__arc" viewBox="0 0 600 340" fill="none" aria-hidden="true">
              <path d="M70 340 A 250 250 0 0 1 570 340" className="tr tr--ink" />
            </svg>
          </div>
          <Readout className="about__cap">FIG.04 — TERRAIN · 43.65°N</Readout>
        </div>
        <Reveal className="about__text">
          <Node><SectionLabel n="04" label="About" /></Node>
          <h2 id="about-h" className="h-sec">
            The <span className="anurati">ARKA</span> Studio.
          </h2>
          <p className="about__p">
            A modern technology company at the intersection of AI, software, design and growth. We turn ideas into
            intelligent products and scalable digital systems.
          </p>
          <dl className="facts">
            {STUDIO_FACTS.map((f) => (
              <div key={f.l} className="facts__item">
                <dt className="facts__v">{f.v}</dt>
                <dd className="facts__l">{f.l}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 05 Process ──────────────────────────────────────────── */
export function ProcessTimeline({ steps = PROCESS, tail = false }: { steps?: { n?: string; t: string; d: string }[]; tail?: boolean; ruler?: boolean }) {
  return (
    <ol className="timeline">
      {tail && (
        <svg className="timeline__tail hide-tablet" aria-hidden="true" viewBox="0 0 92 52" fill="none">
          <path d="M0 50.5 H22 L71 1.5 H88" className="tr tr--line" />
          <circle cx="88" cy="1.5" r="3" className="nd nd--fill" />
        </svg>
      )}
      {steps.map((p, i) => (
        <li key={p.t} className="timeline__step" style={{ ["--i" as string]: i }}>
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
    <section className="sec sec--process" aria-labelledby="proc-h">
      <div className="container sec__grid">
        <Reveal className="sec__intro">
          <Node><SectionLabel n="05" label="Process" /></Node>
          <h2 id="proc-h" className="h-sec">Our Process.</h2>
          <p className="sec__lead">A clear, focused workflow from idea to growth.</p>
        </Reveal>
        <Reveal className="sec__body">
          <ProcessTimeline tail />
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  return (
    <div ref={root} className="home">
      <ScrollCircuit root={root} />
      <Hero />
      <Services />
      <FeaturedWork />
      <AboutStudio />
      <Process />
      <ContactBanner id="contact" circuitNode />
    </div>
  );
}
