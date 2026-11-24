import React from "react";
import { PRINCIPLES, PROCESS, PROJECTS, SERVICES, SITE, STUDIO_FACTS, projectBySlug, serviceBySlug, type Service } from "../content/site";
import { Button, FAQ, Reveal } from "../components/ui";
import { Icon } from "../components/graphics";
import { ContactBanner } from "../components/layout";
import { ContactForm } from "../components/ContactForm";
import { Link } from "../lib/router";
import {
  Arrow, CineHero, Eyebrow, Hud, Kinetic, Marquee, Photo, ScrubFrame, ScrubText, StepRail, StickySwap, TiltCard, useProgress,
  type PhotoKey,
} from "../components/v8";
import { BrowserPreview, PhonePreview, SiteShot, VisitLink, domainOf } from "../components/SitePreview";
import "./v8.css";

/* ── Imagery + accent per service / project ──────────────── */
type Look = { hero: PhotoKey; heroAlt: string; a: PhotoKey; aAlt: string; b: PhotoKey; bAlt: string; c: PhotoKey; acc: string; acc2: string };
const LOOK: Record<Service["graphic"], Look> = {
  ai: {
    hero: "ai-datacentre", heroAlt: "An engineer working on a laptop in a blue-lit data centre aisle",
    a: "ai-robot", aAlt: "A humanoid service robot with a tablet",
    b: "ai-network", bAlt: "Connected glowing blocks forming a network",
    c: "ai-3d",
    acc: "#4fd6ff", acc2: "#7c6cff",
  },
  web: {
    hero: "web-code", heroAlt: "Colour-highlighted source code on a laptop screen",
    a: "web-team", aAlt: "A team building software together on laptops",
    b: "web-desk", bAlt: "A developer's desk with code on a laptop and a monitor",
    c: "web-laptop",
    acc: "#a78bff", acc2: "#4fd6ff",
  },
  marketing: {
    hero: "mkt-analytics", heroAlt: "An analytics dashboard with colourful charts on a laptop",
    a: "mkt-growth", aAlt: "A hand-drawn rising growth chart on paper beside a pen and ruler",
    b: "mkt-dashboard", bAlt: "Marketing performance charts on a laptop",
    c: "mkt-team",
    acc: "#ff7aa8", acc2: "#ffb547",
  },
  consulting: {
    hero: "con-circuit", heroAlt: "A glowing blue circuit board schematic on a screen",
    a: "con-blueprint", aAlt: "Blue system architecture wireframes",
    b: "con-network", bAlt: "Network cables patched into a switch",
    c: "con-strategy",
    acc: "#5b8cff", acc2: "#4fd6ff",
  },
};

const CASE: Record<string, { acc: string; sky: PhotoKey; skyAlt: string }> = {
  "royal-caspian": { acc: "#e8c37a", sky: "orbit-night", skyAlt: "City lights across a continent at night, seen from orbit" },
  "healexa-clinic": { acc: "#ff8a5b", sky: "aurora", skyAlt: "Green aurora borealis over a dark forest" },
  "mehri-noshad": { acc: "#ffa86b", sky: "night-sky", skyAlt: "A star-filled night sky over a mountain ridge at dusk" },
  "six-side-marketing": { acc: "#ff5fd2", sky: "nebula", skyAlt: "A colourful nebula bubble in deep space, imaged by the Hubble Space Telescope" },
  "noctavius-aviation": { acc: "#ffb36b", sky: "launch", skyAlt: "A rocket lifting off on a column of smoke and fire" },
};

const accVars = (acc: string, acc2?: string) => ({ ["--acc" as string]: acc, ["--acc2" as string]: acc2 ?? acc }) as React.CSSProperties;

/* Section heading block */
function Head({ n, label, title, accent, lead, id, center = false }: { n?: string; label: string; title: string; accent?: string; lead?: string; id?: string; center?: boolean }) {
  return (
    <Reveal className={`x-head ${center ? "x-head--center" : ""}`}>
      <Eyebrow n={n} label={label} />
      <h2 className="x-h2" id={id}>
        {title}
        {accent && <> <span className="x-grad">{accent}</span></>}
      </h2>
      {lead && <p className="x-lead">{lead}</p>}
    </Reveal>
  );
}

function Page({ children, style, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={`v8 ${className}`} data-tone="dark" style={style}>
      <div className="v8__stars" aria-hidden="true" />
      {children}
    </div>
  );
}

/* ── Services overview ───────────────────────────────────── */
export function ServicesOverview() {
  return (
    <Page style={accVars("#4fd6ff", "#a78bff")}>
      <CineHero
        photo="orbit-night"
        alt="City lights across a continent at night, seen from orbit"
        n="02"
        eyebrow="Services"
        title="Four disciplines,"
        accent="one growth system."
        intro="AI solutions, web and software development, digital marketing and technology consulting — designed to connect, so every part of your business works with the others."
        readout="SYS.02 · 4 MODULES · ORBIT VIEW"
      >
        <div className="x-hero__ctas">
          <Button to="/contact" variant="primary">Start a Project</Button>
          <a href="#svc-list" className="x-ghost">See the four services <Arrow dir="r" size={16} /></a>
        </div>
      </CineHero>

      <Marquee items={SERVICES.flatMap((s) => s.capabilities.slice(0, 3).map((c) => c.t))} />

      <section className="x-sec" id="svc-list" aria-labelledby="svc-h">
        <div className="container">
          <Head n="A" label="Disciplines" title="Built to work" accent="together." id="svc-h" lead="Each service stands on its own. Combined, they form one system: AI handles the workload, the website captures demand, marketing feeds it, and the architecture keeps it secure." />
          <ul className="x-svc-grid" role="list">
            {SERVICES.map((s, i) => {
              const L = LOOK[s.graphic];
              return (
                <Reveal as="li" key={s.slug} delay={i * 80}>
                  <TiltCard as={Link} to={`/services/${s.slug}`} className="x-svc-card" style={accVars(L.acc, L.acc2)}>
                    <Photo k={L.hero} alt="" className="x-svc-card__img" sizes="(max-width: 899px) 100vw, 50vw" />
                    <span className="x-svc-card__shade" aria-hidden="true" />
                    <span className="x-svc-card__n">{s.n}</span>
                    <span className="x-svc-card__body">
                      <span className="x-svc-card__icon"><Icon name={s.icon} size={22} /></span>
                      <span className="x-svc-card__t">{s.name}</span>
                      <span className="x-svc-card__d">{s.card}</span>
                      <span className="x-svc-card__go">Explore <Arrow size={16} /></span>
                    </span>
                  </TiltCard>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="x-sec" aria-labelledby="caps-ov-h">
        <div className="container">
          <Head n="B" label="Capabilities" title="What sits inside" accent="each module." id="caps-ov-h" />
          <StickySwap
            chapters={SERVICES.map((s) => {
              const L = LOOK[s.graphic];
              return {
                photo: L.c,
                alt: "",
                accent: L.acc,
                content: (
                  <>
                    <p className="x-swap__n">{s.n} — {s.short}</p>
                    <h3 className="x-h3">{s.heroTitle[0]} <span className="x-grad">{s.heroTitle[1]}</span></h3>
                    <p className="x-body">{s.intro}</p>
                    <ul className="x-chips" role="list">
                      {s.capabilities.map((c) => <li key={c.t}>{c.t}</li>)}
                    </ul>
                    <Link to={`/services/${s.slug}`} className="x-ghost">Explore {s.short} <Arrow dir="r" size={16} /></Link>
                  </>
                ),
              };
            })}
          />
        </div>
      </section>

      <ScrubFrame photo="launch" alt="A rocket lifting off on a column of smoke and fire" caption="SYS.05 · LAUNCH SEQUENCE">
        <Kinetic as="h2" text="One clear workflow" accent="across every service." className="x-frame__title" />
      </ScrubFrame>

      <section className="x-sec" aria-labelledby="proc-ov-h">
        <div className="container">
          <Head n="C" label="Process" title="How we" accent="work." id="proc-ov-h" lead="The same clear workflow across every service." />
          <StepRail steps={PROCESS} />
        </div>
      </section>
      <ContactBanner />
    </Page>
  );
}

/* ── Service detail template ─────────────────────────────── */
export function ServicePage({ slug }: { slug: string }) {
  const s = serviceBySlug(slug)!;
  const L = LOOK[s.graphic];
  const examples = s.exampleSlugs.map(projectBySlug).filter(Boolean) as typeof PROJECTS;
  const stickyRef = useProgress<HTMLElement>("sticky");
  return (
    <Page style={accVars(L.acc, L.acc2)} className={`v8--${s.graphic}`}>
      <CineHero
        photo={L.hero}
        alt={L.heroAlt}
        n={s.n}
        eyebrow={s.name}
        title={s.heroTitle[0]}
        accent={s.heroTitle[1]}
        intro={s.intro}
        crumbs={[["Home", "/"], ["Services", "/services"], [s.name]]}
        readout={`FIG.${s.n} · ${s.short.toUpperCase()}`}
      >
        <div className="x-hero__ctas">
          <Button to="/contact" variant="primary">Start a Project</Button>
          <a href="#problems-h" className="x-ghost">How it works <Arrow dir="r" size={16} /></a>
        </div>
      </CineHero>

      <Marquee items={s.capabilities.map((c) => c.t)} />

      {/* Problem: sticky photo stage on desktop */}
      <section ref={stickyRef} className="x-sec x-problem" aria-labelledby="problems-h">
        <div className="container x-problem__grid">
          <div className="x-problem__stage">
            <div className="x-problem__sticky">
              <Head n="A" label="The problem" title="What gets" accent="in the way." id="problems-h" />
              <div className="x-problem__photo">
                <Photo k={L.a} alt={L.aAlt} sizes="(max-width: 999px) 100vw, 45vw" />
                <Hud readout={`DIAG.${s.n} · ${s.problems.length} BLOCKERS`} />
              </div>
            </div>
          </div>
          <ol className="x-problem__list" role="list">
            {s.problems.map((p, i) => (
              <Reveal as="li" key={p.t} className="x-problem__item" delay={i * 40}>
                <span className="x-problem__n">0{i + 1}</span>
                <h3 className="x-h3">{p.t}</h3>
                <p className="x-body">{p.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Solution: scroll-lit statement */}
      <section className="x-sec x-solution" aria-labelledby="solution-h">
        <div className="container">
          <Eyebrow n="B" label="The solution" />
          <h2 id="solution-h" className="sr-only">How ARKA solves it.</h2>
          <ScrubText text={s.solution.lead} className="x-statement" />
          <ul className="x-ticks" role="list">
            {s.solution.points.map((p, i) => (
              <Reveal as="li" key={p} delay={i * 60}>
                <span className="x-ticks__i" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {p}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Capabilities bento */}
      <section className="x-sec" aria-labelledby="caps-h">
        <div className="container">
          <Head n="C" label="Capabilities" title="What we" accent="deliver." id="caps-h" />
          <ul className="x-bento" role="list">
            <Reveal as="li" className="x-bento__feature">
              <TiltCard className="x-bento__photo">
                <Photo k={L.b} alt={L.bAlt} sizes="(max-width: 899px) 100vw, 40vw" />
                <span className="x-bento__shade" aria-hidden="true" />
                <span className="x-bento__cap">
                  <span className="x-mono">{s.capabilities.length} capabilities</span>
                  <span className="x-bento__big">{s.short}</span>
                </span>
              </TiltCard>
            </Reveal>
            {s.capabilities.map((c, i) => (
              <Reveal as="li" key={c.t} delay={i * 50}>
                <TiltCard className="x-card">
                  <span className="x-card__n">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="x-h4">{c.t}</h3>
                  <p className="x-body">{c.d}</p>
                </TiltCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ScrubFrame photo={L.c} alt="" caption={`FIG.${s.n}.B · ${s.short.toUpperCase()}`}>
        <Kinetic as="p" text={s.heroTitle[0]} accent={s.heroTitle[1]} className="x-frame__title" />
      </ScrubFrame>

      {/* Use cases */}
      <section className="x-sec" aria-labelledby="uses-h">
        <div className="container x-split">
          <Head n="D" label="Use cases" title="Where it" accent="fits." id="uses-h" />
          <dl className="x-uses">
            {s.useCases.map((u, i) => (
              <Reveal key={u.t} className="x-uses__item" delay={i * 50}>
                <dt><span className="x-uses__i">{String(i + 1).padStart(2, "0")}</span>{u.t}</dt>
                <dd>{u.d}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="x-sec" aria-labelledby="flow-h">
        <div className="container">
          <Head n="E" label="Workflow" title="The" accent="workflow." id="flow-h" />
          <StepRail steps={s.workflow} />
        </div>
      </section>

      <section className="x-sec" aria-labelledby="ex-h">
        <div className="container">
          <Head n="F" label="Real examples" title="Work in" accent="this area." id="ex-h" />
          {examples.length ? (
            <ul className="x-proj-grid" role="list">
              {examples.map((p, i) => <Reveal as="li" key={p.slug} delay={i * 60}><ProjectCard p={p} /></Reveal>)}
            </ul>
          ) : (
            <Reveal className="x-note">
              <p>
                Client work in this area is published once clients approve it. Our public builds are on the{" "}
                <Link to="/work">Work</Link> page, and we’re happy to walk through relevant examples on a call.
              </p>
              <Button to="/work" variant="outline" arrow="r">See our work</Button>
            </Reveal>
          )}
        </div>
      </section>

      <section className="x-sec" aria-labelledby="faq-h">
        <div className="container x-split">
          <Head n="G" label="FAQ" title="Common" accent="questions." id="faq-h" />
          <div className="x-faq"><FAQ items={s.faq} /></div>
        </div>
      </section>

      <ServiceNav current={s.slug} />
      <ContactBanner />
    </Page>
  );
}

function ServiceNav({ current }: { current: string }) {
  const others = SERVICES.filter((s) => s.slug !== current);
  return (
    <section className="x-sec x-sec--tight" aria-label="Other services">
      <div className="container">
        <Eyebrow label="Other services" />
        <ul className="x-other" role="list">
          {others.map((s) => {
            const L = LOOK[s.graphic];
            return (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="x-other__link" style={accVars(L.acc, L.acc2)}>
                  <Photo k={L.hero} alt="" className="x-other__img" sizes="(max-width: 899px) 100vw, 33vw" />
                  <span className="x-other__shade" aria-hidden="true" />
                  <span className="x-other__n">{s.n}</span>
                  <span className="x-other__t">{s.short}</span>
                  <Arrow size={18} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── Work ────────────────────────────────────────────────── */
export function ProjectCard({ p }: { p: (typeof PROJECTS)[number] }) {
  const c = CASE[p.slug];
  return (
    <article className="x-proj" style={accVars(c?.acc ?? "#4fd6ff")}>
      <BrowserPreview p={p} sizes="(max-width: 899px) 100vw, 46vw" className="x-proj__shot" />
      <div className="x-proj__body">
        <span className="x-proj__chip">{p.category}</span>
        <Link to={`/work/${p.slug}`} className="x-proj__t">{p.name}</Link>
        <span className="x-proj__d">{p.summary}</span>
        <span className="x-proj__actions">
          <Link to={`/work/${p.slug}`} className="x-ghost">Case study <Arrow dir="r" size={16} /></Link>
          <VisitLink p={p} />
        </span>
      </div>
    </article>
  );
}

function WorkRow({ p, i }: { p: (typeof PROJECTS)[number]; i: number }) {
  const c = CASE[p.slug];
  return (
    <li className={`x-row ${i % 2 ? "x-row--flip" : ""}`} style={accVars(c.acc)}>
      <div className="x-row__link">
        <Reveal className="x-row__media">
          <BrowserPreview p={p} sizes="(max-width: 899px) 100vw, 58vw" eager={i === 0} />
        </Reveal>
        <span className="x-row__text">
          <span className="x-row__n">{String(i + 1).padStart(2, "0")}</span>
          <span className="x-row__chip">{p.category}</span>
          <h2 className="x-row__t"><Link to={`/work/${p.slug}`}>{p.name}</Link></h2>
          <span className="x-row__d">{p.summary}</span>
          <span className="x-row__meta">
            <span>{p.sector}</span>
            <span>{p.location}</span>
          </span>
          <span className="x-row__actions">
            <Link to={`/work/${p.slug}`} className="x-ghost">View case study <Arrow dir="r" size={16} /></Link>
            <VisitLink p={p} />
          </span>
        </span>
      </div>
    </li>
  );
}

export function Work() {
  return (
    <Page style={accVars("#a78bff", "#ff7aa8")}>
      <CineHero
        photo="night-sky"
        alt="A star-filled night sky over a mountain ridge at dusk"
        n="03"
        eyebrow="Work"
        title="Selected"
        accent="Work."
        intro="Websites and digital platforms ARKA has designed and built for real businesses across Toronto, the GTA and Ontario. We don’t publish client performance figures without their approval."
        readout={`INDEX · ${String(PROJECTS.length).padStart(2, "0")} BUILDS`}
        size="mid"
      />
      <Marquee items={PROJECTS.map((p) => p.name)} />
      <section className="x-sec" aria-label="Projects">
        <div className="container">
          <ol className="x-rows" role="list">
            {PROJECTS.map((p, i) => <WorkRow key={p.slug} p={p} i={i} />)}
          </ol>
        </div>
      </section>
      <ContactBanner />
    </Page>
  );
}

/* ── Case study template ─────────────────────────────────── */
export function CaseStudy({ slug }: { slug: string }) {
  const p = projectBySlug(slug)!;
  const idx = PROJECTS.findIndex((x) => x.slug === slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const c = CASE[p.slug];
  const nc = CASE[next.slug];
  return (
    <Page style={accVars(c.acc, "#a78bff")}>
      <CineHero
        photo={c.sky}
        alt={c.skyAlt}
        n={String(idx + 1).padStart(2, "0")}
        eyebrow={p.category}
        title={p.name}
        intro={p.summary}
        crumbs={[["Home", "/"], ["Work", "/work"], [p.name]]}
        readout={`CASE.${String(idx + 1).padStart(2, "0")} · ${p.location.toUpperCase()}`}
      >
        <div className="x-hero__ctas">
          <a className="btn btn--primary" href={p.url} target="_blank" rel="noopener noreferrer">
            <span className="btn__label">Visit live site</span>
            <span className="btn__arrow"><Icon name="arrow-ur" size={16} /></span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <span className="x-hero__domain">{domainOf(p.url)}</span>
        </div>
      </CineHero>

      <section className="x-sec x-showcase" aria-label={`${p.name} live website preview`}>
        <div className="container">
          <Reveal className="sp-stage">
            <BrowserPreview p={p} sizes="(max-width: 760px) 100vw, 1100px" eager />
            <PhonePreview p={p} />
          </Reveal>
          <p className="x-showcase__cap">
            <span>Live site · {domainOf(p.url)}</span>
            <span className="hide-mobile">Hover to scroll · click to open</span>
          </p>
        </div>
      </section>

      <section className="x-sec x-sec--tight" aria-label="Project facts">
        <div className="container">
          <dl className="x-facts">
            <Reveal><dt>Client</dt><dd>{p.name}</dd></Reveal>
            <Reveal delay={60}><dt>Sector</dt><dd>{p.sector}</dd></Reveal>
            <Reveal delay={120}><dt>Location</dt><dd>{p.location}</dd></Reveal>
            <Reveal delay={180}><dt>Live site</dt><dd><a href={p.url} target="_blank" rel="noopener noreferrer">{p.url.replace(/^https?:\/\//, "")}<span className="sr-only"> (opens in a new tab)</span></a></dd></Reveal>
          </dl>
        </div>
      </section>

      <section className="x-sec" aria-labelledby="ov-h">
        <div className="container">
          <Eyebrow n="A" label="Overview" />
          <h2 id="ov-h" className="sr-only">Overview</h2>
          <ScrubText text={p.overview} className="x-statement" />
        </div>
      </section>

      <section className="x-sec" aria-labelledby="scope-h">
        <div className="container x-split">
          <Head n="B" label="What we delivered" title="Scope of" accent="the build." id="scope-h" />
          <ul className="x-scope" role="list">
            {p.scope.map((x, i) => (
              <Reveal as="li" key={x} delay={i * 60}>
                <TiltCard className="x-card x-card--row">
                  <span className="x-card__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="x-h4">{x}</span>
                </TiltCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="x-sec" aria-labelledby="res-h">
        <div className="container x-split">
          <Head n="C" label="Results" title="Shared with" accent="permission." id="res-h" />
          <Reveal className="x-note">
            <p>Performance figures for this project are shared with the client’s permission only. Ask us about it on a call.</p>
            <Button to="/contact" variant="outline" arrow="r">Book a call</Button>
          </Reveal>
        </div>
      </section>

      <section className="x-next" aria-label="Next project" style={accVars(nc.acc)}>
        <Link to={`/work/${next.slug}`} className="x-next__link">
          <SiteShot p={next} className="x-next__img" />
          <span className="x-next__shade" aria-hidden="true" />
          <span className="container x-next__inner">
            <span className="x-eyebrow"><span className="x-eyebrow__bar" aria-hidden="true" />Next project</span>
            <span className="x-next__t">{next.name} <Arrow dir="r" size={36} /></span>
            <span className="x-next__d">{next.summary}</span>
          </span>
        </Link>
      </section>
      <ContactBanner />
    </Page>
  );
}

/* ── About ───────────────────────────────────────────────── */
export function About() {
  return (
    <Page style={accVars("#4fd6ff", "#a78bff")}>
      <CineHero
        photo="orbit-day"
        alt="Earth from orbit with a spacecraft module in the foreground"
        n="04"
        eyebrow="About"
        title="The ARKA"
        accent="Studio."
        intro="A modern technology company at the intersection of AI, software, design and growth. We turn ideas into intelligent products and scalable digital systems."
        readout="STUDIO · 43.65°N 79.38°W"
      />

      <section className="x-sec x-sec--tight" aria-label="Studio facts">
        <div className="container">
          <dl className="x-stats">
            {STUDIO_FACTS.map((f, i) => (
              <Reveal key={f.l} delay={i * 70}>
                <TiltCard className="x-stat">
                  <dt className="x-stat__v">{f.v}</dt>
                  <dd className="x-stat__l">{f.l}</dd>
                </TiltCard>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="x-sec" aria-labelledby="who-h">
        <div className="container x-story">
          <div className="x-story__text">
            <Head n="A" label="Who we are" title="Founder-led," accent="AI-powered." id="who-h" />
            <Reveal className="x-prose">
              <p>
                ARKA is a founder-led studio based in the Greater Toronto Area, working with clients worldwide. We design and
                build AI systems, websites and marketing ecosystems, and we stay close to every project from first call to
                launch.
              </p>
              <p>
                We combine hands-on experience running a real service business with AI-accelerated production. That means
                you work directly with the person building your system, and you get senior-level work without the overhead of
                a traditional agency.
              </p>
            </Reveal>
          </div>
          <Reveal className="x-story__media">
            <TiltCard className="x-story__photo">
              <Photo k="nebula" alt="A colourful nebula bubble in deep space, imaged by the Hubble Space Telescope" sizes="(max-width: 999px) 100vw, 45vw" />
              <Hud readout="NGC 7635 · HUBBLE" />
            </TiltCard>
          </Reveal>
        </div>
      </section>

      <section className="x-sec" aria-labelledby="pr-h">
        <div className="container">
          <Head n="B" label="Principles" title="How we" accent="operate." id="pr-h" />
          <ul className="x-principles" role="list">
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p.t} delay={i * 70}>
                <TiltCard className="x-card x-card--tall">
                  <span className="x-card__n">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="x-h4">{p.t}</h3>
                  <p className="x-body">{p.d}</p>
                </TiltCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ScrubFrame photo="launch" alt="A rocket lifting off on a column of smoke and fire" caption="SYS.C · IDEA → GROWTH">
        <Kinetic as="h2" text="From idea" accent="to growth." className="x-frame__title" />
      </ScrubFrame>

      <section className="x-sec" aria-labelledby="proc-h">
        <div className="container">
          <Head n="C" label="Process" title="Our" accent="Process." id="proc-h" lead="A clear, focused workflow from idea to growth." />
          <StepRail steps={PROCESS} />
        </div>
      </section>
      <ContactBanner />
    </Page>
  );
}

/* ── Contact ─────────────────────────────────────────────── */
export function Contact() {
  return (
    <Page style={accVars("#5cffb0", "#4fd6ff")} className="v8--contact">
      <CineHero
        photo="aurora"
        alt="Green aurora borealis over a dark forest"
        n="06"
        eyebrow="Contact"
        title="Let’s Build"
        accent="What’s Next."
        intro="Tell us what you’re working on. We’ll set up a free strategy call, then send a clear scope and quote."
        readout="CH.06 · OPEN CHANNEL"
        size="mid"
      />
      <section className="x-sec x-contact" aria-label="Contact form">
        <div className="container x-contact__grid">
          <Reveal className="x-contact__form">
            <Hud readout="FORM · SECURE" />
            <ContactForm />
          </Reveal>
          <aside className="x-contact__side" aria-label="Other ways to reach ARKA">
            <Reveal className="x-card">
              <p className="x-mono">Email</p>
              <a className="x-contact__big" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <p className="x-body">For detailed briefs or partnership enquiries.</p>
            </Reveal>
            <Reveal className="x-card x-contact__based" delay={60}>
              <Photo k="orbit-night" alt="" className="x-contact__bg" sizes="420px" />
              <span className="x-contact__bgshade" aria-hidden="true" />
              <p className="x-mono">Based</p>
              <p className="x-contact__big">{SITE.location}</p>
              <p className="x-body">Remote-first — clients worldwide, every time zone.</p>
            </Reveal>
            <Reveal className="x-card" delay={120}>
              <p className="x-mono">What to expect</p>
              <ol className="x-expect">
                <li>We read every enquiry and reply by email.</li>
                <li>A free strategy call — no pitch.</li>
                <li>A clear scope and quote after the call.</li>
              </ol>
            </Reveal>
          </aside>
        </div>
      </section>
    </Page>
  );
}

/* ── Legal (drafts) ──────────────────────────────────────── */
function DraftNotice() {
  return (
    <div className="draft-notice x-draft" role="note">
      <strong>Draft — pending legal review.</strong> This page is a working draft and has not been reviewed by a lawyer.
      It is not final legal terms. Questions: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
    </div>
  );
}

function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Page style={accVars("#a78bff", "#4fd6ff")}>
      <CineHero photo="night-sky" alt="A star-filled night sky over a mountain ridge at dusk" n="—" eyebrow="Legal" title={title} intro="Draft. Last updated November 2026." readout="DOC · DRAFT" size="compact" />
      <section className="x-sec x-sec--tight">
        <div className="container">
          <div className="x-legal">
            <DraftNotice />
            {children}
          </div>
        </div>
      </section>
    </Page>
  );
}

export function Privacy() {
  return (
    <LegalShell title="Privacy Policy">
      <h2>What we collect</h2>
      <p>When you use the contact form we receive the details you enter: your name, email address, company (optional), the services you’re interested in, your project details and, if you choose, a budget range and timeline. We also receive standard technical information your browser sends with any request (such as IP address and user agent), which our hosting provider processes to deliver and protect the site.</p>
      <h2>How we use it</h2>
      <p>We use contact-form information only to respond to your enquiry and to discuss a potential project with you. We don’t sell it, and we don’t add you to marketing lists without your separate consent.</p>
      <h2>Service providers</h2>
      <p>The site is hosted on Vercel. Contact-form messages are delivered to our inbox by an email delivery provider. These providers process data on our behalf to run the site and deliver messages.</p>
      <h2>Cookies and analytics</h2>
      <p>This site does not set advertising or analytics cookies. If that changes, this policy will be updated first.</p>
      <h2>Retention</h2>
      <p>We keep enquiry emails for as long as needed to respond and to maintain a record of our business correspondence, then delete them.</p>
      <h2>Your choices</h2>
      <p>You can ask us to access, correct or delete the information you sent us by emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
    </LegalShell>
  );
}

export function Terms() {
  return (
    <LegalShell title="Terms of Use">
      <h2>Using this site</h2>
      <p>This website provides information about ARKA and its services. You may browse it for your own information. Please don’t misuse it, attempt to disrupt it, or submit unlawful or misleading content through its forms.</p>
      <h2>No offer or advice</h2>
      <p>Content on this site is general information, not professional advice and not a binding offer. Any engagement is governed by a separate written agreement.</p>
      <h2>Intellectual property</h2>
      <p>The ARKA name, logo, design and content of this site belong to ARKA unless stated otherwise. Client names and projects are shown as examples of our work.</p>
      <h2>External links</h2>
      <p>Links to client and third-party sites are provided for reference. We aren’t responsible for their content or practices.</p>
      <h2>Liability</h2>
      <p>The site is provided “as is”. To the extent permitted by law, ARKA isn’t liable for losses arising from use of the site.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
    </LegalShell>
  );
}

/* ── 404 ─────────────────────────────────────────────────── */
export function NotFound() {
  return (
    <Page style={accVars("#ff7aa8", "#a78bff")}>
      <CineHero photo="nebula" alt="" n="404" eyebrow="Not found" title="Signal" accent="lost." intro="The page you were looking for doesn’t exist or has moved." readout="ERR.404 · NO CARRIER" size="mid">
        <div className="x-hero__ctas">
          <Button to="/" variant="primary">Back to Home</Button>
          <Link to="/services" className="x-ghost">Our Services <Arrow dir="r" size={16} /></Link>
        </div>
      </CineHero>
    </Page>
  );
}
