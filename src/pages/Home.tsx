import { PROCESS, PROJECTS, SERVICES, STUDIO_FACTS } from "../content/site";
import { Button, HatchMark, Reveal, SectionLabel, ServiceCard } from "../components/ui";
import { Barcode, CircuitFrame, DotMatrix, Hatch, Place, SignalNode } from "../components/graphics";
import { ContactBanner } from "../components/layout";
import { Link } from "../lib/router";
import { Carousel } from "../components/Carousel";

/* ── 01 Hero ─────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <CircuitFrame
        className="hero__frame"
        desktop={{
          traces: [
            { pts: "c-470,t60 c-400,t60 c-352,t108 c+232,t108 c+280,t60 c+330,t60 c+390,t0" },
            { pts: "l0,t180 l44,t136 c-330,t136", tone: "faint" },
            { pts: "l40,t150 l40,t650", tone: "faint" },
            { pts: "l58,t270 l58,t600", tone: "faint" },
            { pts: "l0,t612 l48,t660 c-262,t660 c-214,t612 c+130,t612", pulse: true },
            { pts: "c-382,t604 c-318,t604", tone: "thick" },
            { pts: "c-14,t620 c-14,t378 c+124,t240 c+268,t240", tone: "faint" },
            { pts: "c+330,t168 c+330,b0", tone: "faint" },
            { pts: "c+355,t134 c+355,b0", tone: "ink", pulse: true },
            { pts: "c+355,t136 c+355,t196", tone: "thick" },
            { pts: "c+252,t486 c+355,t486" },
            { pts: "c+32,t218 c+32,t346", tone: "faint" },
            { pts: "c+355,b-8 c+540,b-8 c+620,b-88 r0,b-88" },
            { pts: "r-36,t0 r-36,t530", tone: "faint" },
          ],
          arcs: [{ c: "c+355,b0", r: 362, from: 180, to: 270, tone: "ink" }],
          nodes: [
            { at: "c-470,t60" },
            { at: "c+80,t108", kind: "pair" },
            { at: "l40,t138", kind: "chain", n: 4 },
            { at: "l58,t270" },
            { at: "c-314,t604", kind: "dot" },
            { at: "c+355,t360", kind: "dot" },
            { at: "c+290,t486" },
            { at: "c+330,t486" },
            { at: "c+32,t218" },
            { at: "c+32,t282", kind: "dot" },
            { at: "c+32,t346" },
            { at: "r-36,t300", kind: "chain", n: 6 },
          ],
        }}
        mobile={{
          traces: [
            { pts: "l12,t96 l12,b-40", tone: "faint" },
            { pts: "l0,b-24 l24,b0 r-120,b0 r-96,b-24 r0,b-24", tone: "line" },
          ],
          nodes: [{ at: "l12,t96" }],
        }}
      />

      <div className="hero__art" aria-hidden="true">
        <div className="hero__moon">
          <picture>
            <source media="(max-width: 700px)" srcSet="/media/moon-900.avif" type="image/avif" />
            <source media="(max-width: 700px)" srcSet="/media/moon-900.webp" type="image/webp" />
            <source srcSet="/media/moon-1600.avif" type="image/avif" />
            <img src="/media/moon-1600.webp" alt="" width={1600} height={1600} fetchPriority="high" decoding="async" />
          </picture>
        </div>
        <div className="hero__terrain">
          <picture>
            <source srcSet="/media/terrain-840.avif" type="image/avif" />
            <img src="/media/terrain-840.webp" alt="" width={840} height={740} decoding="async" />
          </picture>
        </div>
        <div className="hero__sphere">
          <img src="/media/sphere-260.webp" alt="" width={260} height={260} decoding="async" />
        </div>
        <svg className="hero__arc-m" viewBox="0 0 400 400" fill="none">
          <path d="M10 400 A 390 390 0 0 1 400 10" className="tr tr--ink" />
        </svg>
        <DotMatrix className="hero__dots1" cols={5} rows={4} gap={14} />
        <Barcode className="hero__barcode" n={7} gap={7} h={86} />
        <span className="hero__bars"><span /><span /><span /><span /></span>
        <Hatch className="hero__hatch" n={7} w={34} h={18} fade={false} />
        <DotMatrix className="hero__dots2" cols={5} rows={4} gap={13} />
        <Hatch className="hero__hatch-left" n={8} w={44} h={10} fade={false} />
      </div>

      <div className="container hero__content">
        <SectionLabel n="01" label="ARKA" className="hero__label" />
        <h1 id="hero-h" className="h-hero">
          <span className="h-hero__line">AI, Software &amp;</span>
          <em className="h-hero__line">Digital Growth.</em>
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
            { pts: "l40,t0 l40,b0", tone: "faint" },
            { pts: "c-332,t46 c-332,t236 c-286,t282 c+64,t282" },
            { pts: "c+96,t282 c+252,t282 c+282,t252 c+600,t252 c+620,t232", pulse: true },
            { pts: "c-110,t30 c+150,t30 c+168,t12 c+420,t12", tone: "faint" },
          ],
          nodes: [{ at: "c-332,t46" }, { at: "c+80,t282", kind: "pair" }],
        }}
        mobile={{ traces: [{ pts: "l12,t0 l12,b0", tone: "faint" }] }}
      />
      <div className="container sec__grid">
        <Reveal className="sec__intro">
          <SectionLabel n="02" label="Services" />
          <h2 id="svc-h" className="h-sec">What We <strong>Do.</strong></h2>
          <p className="sec__lead">End-to-end technology and growth solutions, powered by AI.</p>
          <HatchMark className="sec__hatch" />
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
      <CircuitFrame
        desktop={{
          traces: [
            { pts: "l40,t0 l40,b0", tone: "faint" },
            { pts: "R-40,t14 R+30,t14 R+46,t30", tone: "thick" },
            { pts: "c-306,t150 c-306,t228", tone: "ink" },
            { pts: "c-306,t228 c-290,t244 c-120,t244", tone: "faint" },
          ],
        }}
        mobile={{ traces: [{ pts: "l12,t0 l12,b0", tone: "faint" }] }}
      />
      <div className="container">
        <Carousel
          projects={PROJECTS}
          intro={
            <div className="sec__intro">
              <SectionLabel n="03" label="Featured Work" />
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
      <CircuitFrame
        desktop={{
          traces: [
            { pts: "L-60,t26 c-210,t26 c-170,t-14 c+150,t-14 c+190,t26 R-120,t26 R-80,t66 R+20,t66", tone: "faint" },
            { pts: "L-76,t90 L-76,t352 L-30,t398 c-50,t398", tone: "faint" },
            { pts: "c-440,t60 c-440,t340", tone: "ink" },
            { pts: "c-480,t100 c-480,t370", tone: "ink" },
            { pts: "c-52,t60 c-52,t420" },
            { pts: "c-52,t130 c-52,t176", tone: "thick" },
            { pts: "c-52,t300 c-110,t300", tone: "faint" },
            { pts: "R-60,t120 R+40,t120 R+100,t60 r0,t60", tone: "faint" },
            { pts: "l40,t0 l40,b0", tone: "faint" },
          ],
          arcs: [{ c: "c-270,t380", r: 240, from: 196, to: 352, tone: "ink" }],
          nodes: [
            { at: "c-440,t60", kind: "dot" },
            { at: "c-480,t100", kind: "dot" },
            { at: "c-52,t230", kind: "chain", n: 3 },
            { at: "c-110,t300", kind: "dot" },
            { at: "R-60,t120", kind: "dot" },
          ],
        }}
        mobile={{ traces: [{ pts: "l12,t0 l12,b0", tone: "faint" }] }}
      />
      <Place at="L-58,t40" className="hide-tablet"><DotMatrix cols={6} rows={4} gap={11} /></Place>
      <Place at="c-140,t80" className="hide-tablet"><Barcode n={7} gap={6} h={48} /></Place>
      <Place at="R-20,t250" className="hide-tablet"><DotMatrix cols={5} rows={5} gap={12} className="faint" /></Place>
      <div className="container about">
        <div className="about__media">
          <picture>
            <source srcSet="/media/terrain-840.avif" type="image/avif" />
            <img src="/media/terrain-840.webp" alt="" width={840} height={740} loading="lazy" decoding="async" />
          </picture>
        </div>
        <Reveal className="about__text">
          <SectionLabel n="04" label="About" />
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
export function ProcessTimeline({ steps = PROCESS, tail = false }: { steps?: { n?: string; t: string; d: string }[]; tail?: boolean }) {
  return (
    <ol className="timeline">
      {tail && (
        <svg className="timeline__tail hide-tablet" aria-hidden="true" viewBox="0 0 92 52" fill="none">
          <path d="M0 50.5 H22 L71 1.5 H88" className="tr tr--line" />
          <circle cx="88" cy="1.5" r="3" className="nd nd--fill" />
        </svg>
      )}
      {steps.map((p, i) => (
        <li key={p.t} className="timeline__step">
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
      <CircuitFrame
        desktop={{
          traces: [
            { pts: "l40,t0 l40,b0", tone: "faint" },
            { pts: "L-56,t22 L-56,t150", tone: "faint" },
          ],
          nodes: [
            { at: "L-56,t22" },
            { at: "L-56,t150" },
            { at: "l40,t120", kind: "chain", n: 5 },
          ],
        }}
        mobile={{ traces: [{ pts: "l12,t0 l12,b0", tone: "faint" }] }}
      />
      <Place at="R+10,t70" className="hide-tablet"><DotMatrix cols={4} rows={4} gap={12} className="faint" /></Place>
      <div className="container sec__grid">
        <Reveal className="sec__intro">
          <SectionLabel n="05" label="Process" />
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
  return (
    <>
      <Hero />
      <Services />
      <FeaturedWork />
      <AboutStudio />
      <Process />
      <ContactBanner id="contact" />
    </>
  );
}
