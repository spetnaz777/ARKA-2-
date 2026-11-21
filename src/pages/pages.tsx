import React from "react";
import { PRINCIPLES, PROJECTS, SERVICES, SITE, STUDIO_FACTS, projectBySlug, serviceBySlug } from "../content/site";
import { Button, FAQ, PageIntro, Reveal, SectionLabel, ServiceCard } from "../components/ui";
import { ChamferedPanel, CircuitFrame, ContourPattern, CornerMarks, DotMatrix, EdgeTrace, Icon, Readout, TechnicalDivider } from "../components/graphics";
import { PaleImage, type PaleName } from "../components/media";

const PROJECT_IMG: Record<string, PaleName> = {
  "royal-caspian": "img-hall",
  "healexa-clinic": "img-concrete",
  "mehri-noshad": "img-monolith",
  "six-side-marketing": "img-space",
  "noctavius-aviation": "rocket-hangar",
};
const SERVICE_IMG: Record<string, PaleName> = {
  ai: "img-space",
  web: "img-corridor",
  marketing: "img-monolith",
  consulting: "img-hall",
};

/* Framed asset panel: existing imagery in a chamfered frame with registration marks. */
function AssetPanel({ name, caption, children, eager = false }: { name: PaleName; caption: string; children?: React.ReactNode; eager?: boolean }) {
  return (
    <div className="asset-panel">
      <div className="asset-panel__clip">
        <PaleImage name={name} eager={eager} sizes="(max-width: 1099px) 100vw, 520px" />
        <div className="asset-panel__scan" aria-hidden="true" />
        {children}
      </div>
      <CornerMarks offset={-8} />
      <Readout className="asset-panel__cap">{caption}</Readout>
    </div>
  );
}
import { ContactBanner } from "../components/layout";
import { ServiceGraphic } from "../components/ServiceGraphic";
import { ContactForm } from "../components/ContactForm";
import { ProcessTimeline } from "./Home";
import { Link } from "../lib/router";

/* Shared hero frame for internal pages. */
function PageHeroFrame() {
  return (
    <CircuitFrame
      desktop={{
        traces: [
          { pts: "c-470,t60 c-400,t60 c-352,t108 c+232,t108 c+280,t60 c+330,t60 c+390,t0" },
          { pts: "l40,t150 l40,b0", tone: "faint" },
          { pts: "l0,b-40 l40,b0 c-200,b0 c-160,b-40 c+300,b-40 c+340,b0 r0,b0", pulse: true },
          { pts: "r-36,t0 r-36,b0", tone: "faint" },
          { pts: "c+355,t134 c+355,t196", tone: "thick" },
        ],
        nodes: [{ at: "c-470,t60" }, { at: "c+80,t108", kind: "pair" }, { at: "l40,t150", kind: "chain", n: 4 }],
      }}
      mobile={{ traces: [{ pts: "l12,t96 l12,b0", tone: "faint" }, { pts: "l0,b-1 r0,b-1", tone: "faint" }] }}
    />
  );
}

function Breadcrumbs({ items }: { items: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol>
        {items.map(([label, to], i) => (
          <li key={label}>
            {to ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}
            {i < items.length - 1 && <span aria-hidden="true" className="crumbs__sep">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SubHead({ n, label, title, children }: { n: string; label: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="subhead">
      <SectionLabel n={n} label={label} />
      <h2 className="h-sec">{title}</h2>
      {children && <p className="sec__lead">{children}</p>}
    </div>
  );
}

/* ── Services overview ───────────────────────────────────── */
export function ServicesOverview() {
  return (
    <>
      <section className="page-hero">
        <PageHeroFrame />
        <div className="container page-hero__grid">
          <PageIntro n="02" label="Services" title="Four disciplines," italic="one growth system." intro="AI solutions, web and software development, digital marketing and technology consulting — designed to connect, so every part of your business works with the others." />
          <AssetPanel name="img-concrete" caption="FIG.02 — SYSTEMS · 4 MODULES" eager>
            <ServiceGraphic kind="consulting" />
          </AssetPanel>
        </div>
      </section>
      <section className="sec">
        <div className="container">
          <ul className="svc-grid svc-grid--page" role="list">
            {SERVICES.map((s, i) => <ServiceCard key={s.slug} s={s} index={i} />)}
          </ul>
        </div>
      </section>
      <section className="sec">
        <div className="container stack-lg">
          {SERVICES.map((s) => (
            <Reveal key={s.slug} className="svc-row">
              <div className="svc-row__head">
                <span className="svc-row__n">{s.n}</span>
                <h2 className="h-card">{s.name}</h2>
                <p>{s.intro}</p>
                <Button to={`/services/${s.slug}`} variant="outline">Explore {s.short}</Button>
              </div>
              <ul className="svc-row__caps">
                {s.capabilities.map((c) => <li key={c.t}>{c.t}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="sec">
        <div className="container sec__grid">
          <div className="sec__intro">
            <SectionLabel n="05" label="Process" />
            <h2 className="h-sec">How we work.</h2>
            <p className="sec__lead">The same clear workflow across every service.</p>
          </div>
          <div className="sec__body"><ProcessTimeline /></div>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}

/* ── Service detail template ─────────────────────────────── */
export function ServicePage({ slug }: { slug: string }) {
  const s = serviceBySlug(slug)!;
  const examples = s.exampleSlugs.map(projectBySlug).filter(Boolean) as typeof PROJECTS;
  return (
    <>
      <section className="page-hero">
        <PageHeroFrame />
        <div className="container page-hero__grid">
          <div>
            <Breadcrumbs items={[["Home", "/"], ["Services", "/services"], [s.name]]} />
            <PageIntro n={s.n} label={s.name} title={s.heroTitle[0]} italic={s.heroTitle[1]} intro={s.intro}>
              <div className="page-intro__ctas">
                <Button to="/contact" variant="primary">Start a Project</Button>
              </div>
            </PageIntro>
          </div>
          <AssetPanel name={SERVICE_IMG[s.graphic]} caption={`FIG.${s.n} — ${s.short.toUpperCase()}`} eager>
            <ServiceGraphic kind={s.graphic} />
          </AssetPanel>
        </div>
      </section>

      <section className="sec" aria-labelledby="problems-h">
        <div className="container">
          <SubHead n="A" label="The problem" title={<span id="problems-h">What gets in the way.</span>} />
          <ul className="card-grid card-grid--4" role="list">
            {s.problems.map((p, i) => (
              <Reveal as="li" key={p.t} delay={i * 60}>
                <ChamferedPanel className="mini-card" cut={12}>
                  <span className="mini-card__n">0{i + 1}</span>
                  <h3 className="h-mini">{p.t}</h3>
                  <p>{p.d}</p>
                </ChamferedPanel>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec" aria-labelledby="solution-h">
        <div className="container split">
          <SubHead n="B" label="The solution" title={<span id="solution-h">How ARKA solves it.</span>} />
          <Reveal className="split__body">
            <p className="lead">{s.solution.lead}</p>
            <ul className="ticks">
              {s.solution.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="sec" aria-labelledby="caps-h">
        <div className="container">
          <SubHead n="C" label="Capabilities" title={<span id="caps-h">What we deliver.</span>} />
          <ul className="card-grid card-grid--3" role="list">
            {s.capabilities.map((c, i) => (
              <Reveal as="li" key={c.t} delay={i * 50}>
                <ChamferedPanel className="mini-card" cut={12}>
                  <h3 className="h-mini">{c.t}</h3>
                  <p>{c.d}</p>
                </ChamferedPanel>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec" aria-labelledby="uses-h">
        <div className="container split">
          <SubHead n="D" label="Use cases" title={<span id="uses-h">Where it fits.</span>} />
          <dl className="uses split__body">
            {s.useCases.map((u) => (
              <div key={u.t} className="uses__item">
                <dt>{u.t}</dt>
                <dd>{u.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="sec" aria-labelledby="flow-h">
        <div className="container sec__grid">
          <div className="sec__intro">
            <SectionLabel n="E" label="Workflow" />
            <h2 id="flow-h" className="h-sec">The workflow.</h2>
          </div>
          <div className="sec__body"><ProcessTimeline steps={s.workflow} /></div>
        </div>
      </section>

      <section className="sec" aria-labelledby="ex-h">
        <div className="container">
          <SubHead n="F" label="Real examples" title={<span id="ex-h">Work in this area.</span>} />
          {examples.length ? (
            <ul className="proj-grid" role="list">
              {examples.map((p) => <li key={p.slug}><ProjectCard p={p} /></li>)}
            </ul>
          ) : (
            <ChamferedPanel className="note-panel" cut={14}>
              <p>
                Client work in this area is published once clients approve it. Our public builds are on the{" "}
                <Link to="/work">Work</Link> page, and we’re happy to walk through relevant examples on a call.
              </p>
            </ChamferedPanel>
          )}
        </div>
      </section>

      <section className="sec" aria-labelledby="faq-h">
        <div className="container split">
          <SubHead n="G" label="FAQ" title={<span id="faq-h">Common questions.</span>} />
          <div className="split__body"><FAQ items={s.faq} /></div>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}

/* ── Work ────────────────────────────────────────────────── */
export function ProjectCard({ p }: { p: (typeof PROJECTS)[number] }) {
  return (
    <Link to={`/work/${p.slug}`} className="proj-card chamfer chamfer--raised" style={{ ["--cut" as string]: "18px" }}>
      <PaleImage name={PROJECT_IMG[p.slug] ?? "img-hall"} className="proj-card__img" />
      <ContourPattern variant={p.wave} className="proj-card__wave" />
      <EdgeTrace />
      <span className="chip">{p.category}</span>
      <span className="proj-card__title">{p.name}</span>
      <span className="proj-card__desc">{p.summary}</span>
      <span className="proj-card__meta">
        {p.location}
        <Icon name="arrow-ur" size={18} />
      </span>
    </Link>
  );
}

export function Work() {
  return (
    <>
      <section className="page-hero">
        <PageHeroFrame />
        <div className="container">
          <div className="page-hero__grid">
            <PageIntro n="03" label="Work" title="Selected" italic="Work." intro="Websites and digital platforms ARKA has designed and built for real businesses across Toronto, the GTA and Ontario. We don’t publish client performance figures without their approval." />
            <AssetPanel name="deep-black-hero" caption="FIG.03 — INDEX · 05 BUILDS" eager />
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="container">
          <ul className="proj-grid" role="list">
            {PROJECTS.map((p) => <li key={p.slug}><ProjectCard p={p} /></li>)}
          </ul>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}

/* ── Case study template ─────────────────────────────────── */
export function CaseStudy({ slug }: { slug: string }) {
  const p = projectBySlug(slug)!;
  const idx = PROJECTS.findIndex((x) => x.slug === slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  return (
    <>
      <section className="page-hero">
        <PageHeroFrame />
        <div className="container">
          <Breadcrumbs items={[["Home", "/"], ["Work", "/work"], [p.name]]} />
          <PageIntro n={String(idx + 1).padStart(2, "0")} label={p.category} title={p.name} intro={p.summary} />
        </div>
      </section>

      <section className="sec">
        <div className="container">
          <ChamferedPanel className="case-visual" cut={24}>
            <PaleImage name={PROJECT_IMG[p.slug] ?? "img-hall"} className="case-visual__img" sizes="100vw" />
            <ContourPattern variant={p.wave} lines={44} className="case-visual__wave" />
            <span className="chip">{p.category}</span>
            <a className="case-visual__link" href={p.url} target="_blank" rel="noopener noreferrer">
              Visit live site <Icon name="arrow-ur" size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </ChamferedPanel>
        </div>
      </section>

      <section className="sec">
        <div className="container case-grid">
          <dl className="case-facts">
            <div><dt>Client</dt><dd>{p.name}</dd></div>
            <div><dt>Sector</dt><dd>{p.sector}</dd></div>
            <div><dt>Location</dt><dd>{p.location}</dd></div>
            <div><dt>Live site</dt><dd><a href={p.url} target="_blank" rel="noopener noreferrer">{p.url.replace(/^https?:\/\//, "")}<span className="sr-only"> (opens in a new tab)</span></a></dd></div>
          </dl>
          <div className="case-body">
            <SectionLabel n="A" label="Overview" />
            <p className="lead">{p.overview}</p>
            <TechnicalDivider className="case-divider" />
            <SectionLabel n="B" label="What we delivered" />
            <ul className="ticks">
              {p.scope.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <TechnicalDivider className="case-divider" />
            <SectionLabel n="C" label="Results" />
            <p>
              Performance figures for this project are shared with the client’s permission only. Ask us about it on a
              call.
            </p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="container next-proj">
          <span className="label"><span>Next project</span></span>
          <Link to={`/work/${next.slug}`} className="next-proj__link">
            {next.name} <Icon name="arrow-r" size={22} />
          </Link>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}

/* ── About ───────────────────────────────────────────────── */
export function About() {
  return (
    <>
      <section className="page-hero">
        <PageHeroFrame />
        <div className="container page-hero__grid">
          <PageIntro n="04" label="About" title="The ARKA" italic="Studio." intro="A modern technology company at the intersection of AI, software, design and growth. We turn ideas into intelligent products and scalable digital systems." />
          <AssetPanel name="img-monolith" caption="FIG.04 — STUDIO · 43.65°N 79.38°W" eager />
        </div>
      </section>

      <section className="sec">
        <div className="container">
          <dl className="facts facts--wide">
            {STUDIO_FACTS.map((f) => (
              <div key={f.l} className="facts__item">
                <dt className="facts__v">{f.v}</dt>
                <dd className="facts__l">{f.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="sec">
        <div className="container split">
          <SubHead n="A" label="Who we are" title="Founder-led, AI-powered." />
          <div className="split__body prose">
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
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="container">
          <SubHead n="B" label="Principles" title="How we operate." />
          <ul className="card-grid card-grid--4" role="list">
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p.t} delay={i * 60}>
                <ChamferedPanel className="mini-card" cut={12}>
                  <span className="mini-card__n">0{i + 1}</span>
                  <h3 className="h-mini">{p.t}</h3>
                  <p>{p.d}</p>
                </ChamferedPanel>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec">
        <div className="container sec__grid">
          <div className="sec__intro">
            <SectionLabel n="C" label="Process" />
            <h2 className="h-sec">Our Process.</h2>
            <p className="sec__lead">A clear, focused workflow from idea to growth.</p>
          </div>
          <div className="sec__body"><ProcessTimeline /></div>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}

/* ── Contact ─────────────────────────────────────────────── */
export function Contact() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <PageHeroFrame />
        <div className="container">
          <PageIntro n="06" label="Contact" title="Let’s Build" italic="What’s Next." intro="Tell us what you’re working on. We’ll set up a free strategy call, then send a clear scope and quote." />
        </div>
      </section>
      <section className="sec">
        <div className="container contact-grid">
          <ChamferedPanel className="contact-form-panel" cut={22}>
            <ContactForm />
          </ChamferedPanel>
          <aside className="contact-side" aria-label="Other ways to reach ARKA">
            <ChamferedPanel className="mini-card" cut={12}>
              <p className="label"><span>Email</span></p>
              <a className="contact-side__big" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <p>For detailed briefs or partnership enquiries.</p>
            </ChamferedPanel>
            <ChamferedPanel className="mini-card" cut={12}>
              <p className="label"><span>Based</span></p>
              <p className="contact-side__big">{SITE.location}</p>
              <p>Remote-first — clients worldwide, every time zone.</p>
            </ChamferedPanel>
            <ChamferedPanel className="mini-card" cut={12}>
              <p className="label"><span>What to expect</span></p>
              <ol className="expect">
                <li>We read every enquiry and reply by email.</li>
                <li>A free strategy call — no pitch.</li>
                <li>A clear scope and quote after the call.</li>
              </ol>
            </ChamferedPanel>
            <DotMatrix cols={8} rows={3} gap={12} className="faint" />
          </aside>
        </div>
      </section>
    </>
  );
}

/* ── Legal (drafts) ──────────────────────────────────────── */
function DraftNotice() {
  return (
    <div className="draft-notice" role="note">
      <strong>Draft — pending legal review.</strong> This page is a working draft and has not been reviewed by a lawyer.
      It is not final legal terms. Questions: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
    </div>
  );
}

export function Privacy() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <PageHeroFrame />
        <div className="container"><PageIntro n="—" label="Legal" title="Privacy Policy" intro="Draft. Last updated November 2026." /></div>
      </section>
      <section className="sec">
        <div className="container prose legal">
          <DraftNotice />
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
        </div>
      </section>
    </>
  );
}

export function Terms() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <PageHeroFrame />
        <div className="container"><PageIntro n="—" label="Legal" title="Terms of Use" intro="Draft. Last updated November 2026." /></div>
      </section>
      <section className="sec">
        <div className="container prose legal">
          <DraftNotice />
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
        </div>
      </section>
    </>
  );
}

/* ── 404 ─────────────────────────────────────────────────── */
export function NotFound() {
  return (
    <section className="page-hero page-hero--404">
      <PageHeroFrame />
      <div className="container nf">
        <PageIntro n="404" label="Not found" title="Signal" italic="lost." intro="The page you were looking for doesn’t exist or has moved." />
        <div className="page-intro__ctas">
          <Button to="/" variant="primary">Back to Home</Button>
          <Button to="/services" variant="outline" arrow="r">Our Services</Button>
        </div>
        <div className="nf__moon" aria-hidden="true">
          <img src="/media/moon-900.webp" alt="" width={900} height={900} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
