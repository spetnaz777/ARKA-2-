import React, { useEffect, useRef, useState } from "react";
import { Link } from "../lib/router";
import { Icon } from "./graphics";
import { Decode } from "./fx";

/* ════════════════════════════════════════════════════════════
   v8 — inner-page kit. Colour photography (licensed, self-hosted,
   see public/media/CREDITS.md), one shared scroll driver that writes a
   --p progress variable (transform/opacity only), kinetic headings,
   pointer-tilt cards. Everything is fully visible without JS and under
   prefers-reduced-motion.
   ════════════════════════════════════════════════════════════ */

export type PhotoKey =
  | "ai-datacentre" | "ai-robot" | "ai-network"
  | "web-code" | "web-team" | "web-desk"
  | "mkt-analytics" | "mkt-dashboard" | "mkt-team"
  | "con-circuit" | "con-blueprint" | "con-network"
  | "ai-3d" | "web-laptop" | "mkt-growth" | "con-strategy"
  | "orbit-night" | "orbit-day" | "nebula" | "launch" | "aurora" | "night-sky" | "laptop-glow"
  | "case-luxury-interior" | "case-rehab" | "case-toronto" | "case-edit-suite" | "case-jet";

export function Photo({ k, alt = "", className = "", sizes = "100vw", eager = false }: { k: PhotoKey; alt?: string; className?: string; sizes?: string; eager?: boolean }) {
  const base = `/media/v8/${k}`;
  const set = (ext: string) => `${base}-800.${ext} 800w, ${base}-1600.${ext} 1600w`;
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${base}-1600.webp`}
        alt={alt}
        width={1600}
        height={1067}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}

/* ── Scroll driver ─────────────────────────────────────────
   "through": 0 when the element's top enters the bottom of the viewport,
   1 when its bottom leaves the top. "sticky": 0→1 across a tall section
   whose child is position:sticky. Only elements on screen are measured. */
type Mode = "through" | "sticky" | "enter";
const tracked = new Map<HTMLElement, Mode>();
const visible = new Set<HTMLElement>();
let io: IntersectionObserver | null = null;
let ticking = false;
let reduce = false;

function measure() {
  ticking = false;
  const vh = window.innerHeight;
  visible.forEach((el) => {
    const r = el.getBoundingClientRect();
    const mode = tracked.get(el);
    let p: number;
    if (mode === "sticky") p = -r.top / Math.max(1, r.height - vh);
    else if (mode === "enter") p = (vh - r.top) / Math.max(1, vh * 0.75);
    else p = (vh - r.top) / (vh + r.height);
    p = Math.min(1, Math.max(0, p));
    el.style.setProperty("--p", p.toFixed(4));
  });
}
function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(measure);
  }
}

export function useProgress<T extends HTMLElement>(mode: Mode = "through") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    if (!io) {
      io = new IntersectionObserver(
        (es) => {
          es.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement)));
          onScroll();
        },
        { rootMargin: "120px 0px" },
      );
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }
    tracked.set(el, mode);
    el.classList.add("is-driven");
    io.observe(el);
    return () => {
      io?.unobserve(el);
      tracked.delete(el);
      visible.delete(el);
    };
  }, [mode]);
  return ref;
}

/* ── Pointer tilt + glare (hover-capable pointers only) ───── */
export function useTilt<T extends HTMLElement>(max = 7) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let rect: DOMRect | null = null;
    const enter = () => {
      rect = el.getBoundingClientRect();
      el.classList.add("is-tilting");
    };
    const move = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--ry", `${((x - 0.5) * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${((0.5 - y) * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      rect = null;
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);
  return ref;
}

/* Kinetic heading: each word rises out of its own line mask on mount
   (transform + opacity only; nothing persists after the animation). */
export function Kinetic({ text, accent, as: Tag = "h1", className = "", id, delay = 0 }: { text: string; accent?: string; as?: "h1" | "h2" | "p"; className?: string; id?: string; delay?: number }) {
  const words: { w: string; acc: boolean }[] = [
    ...text.split(" ").filter(Boolean).map((w) => ({ w, acc: false })),
    ...(accent ? accent.split(" ").filter(Boolean).map((w) => ({ w, acc: true })) : []),
  ];
  return (
    <Tag className={`x-kin ${className}`} id={id}>
      {words.map((x, i) => (
        <React.Fragment key={i}>
          <span className={`x-kin__m ${x.acc ? "x-kin__m--acc" : ""}`}>
            <span className="x-kin__w" style={{ ["--d" as string]: `${delay + i * 70}ms` }}>{x.w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/* Statement whose words light up as it scrolls through the viewport. */
export function ScrubText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useProgress<HTMLParagraphElement>("enter");
  const words = text.split(" ");
  const n = words.length;
  return (
    <p ref={ref} className={`x-scrub ${className}`}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span style={{ ["--t" as string]: (i / n).toFixed(3) }}>{w}</span>
          {i < n - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </p>
  );
}

export function Eyebrow({ n, label, className = "" }: { n?: string; label: string; className?: string }) {
  return (
    <p className={`x-eyebrow ${className}`}>
      {n && <span className="x-eyebrow__n">{n}</span>}
      <span className="x-eyebrow__bar" aria-hidden="true" />
      <Decode text={label} />
    </p>
  );
}

export function Crumbs({ items }: { items: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="x-crumbs">
      <ol>
        {items.map(([label, to], i) => (
          <li key={label}>
            {to ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}
            {i < items.length - 1 && <span aria-hidden="true" className="x-crumbs__sep">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* HUD registration marks + a mono readout (restrained cyber layer). */
export function Hud({ readout, className = "" }: { readout?: string; className?: string }) {
  return (
    <div className={`x-hud ${className}`} aria-hidden="true">
      <span className="x-hud__c x-hud__c--tl" />
      <span className="x-hud__c x-hud__c--tr" />
      <span className="x-hud__c x-hud__c--bl" />
      <span className="x-hud__c x-hud__c--br" />
      {readout && <span className="x-hud__r">{readout}</span>}
    </div>
  );
}

/* ── Cinematic hero ─────────────────────────────────────── */
export function CineHero({
  photo, alt, eyebrow, n, title, accent, intro, crumbs, readout, children, size = "full",
}: {
  photo: PhotoKey; alt: string; eyebrow: string; n?: string; title: string; accent?: string; intro?: string;
  crumbs?: [string, string?][]; readout?: string; children?: React.ReactNode; size?: "full" | "mid" | "compact";
}) {
  const ref = useProgress<HTMLElement>("through");
  return (
    <section ref={ref} className={`x-hero x-hero--${size}`}>
      <div className="x-hero__media">
        <Photo k={photo} alt={alt} eager className="x-hero__img" />
      </div>
      <div className="x-hero__shade" aria-hidden="true" />
      <div className="x-hero__grid" aria-hidden="true" />
      <Hud readout={readout} className="x-hero__hud" />
      <div className="container x-hero__inner">
        {crumbs && <Crumbs items={crumbs} />}
        <Eyebrow n={n} label={eyebrow} className="x-hero__eyebrow" />
        <Kinetic text={title} accent={accent} className="x-hero__title" />
        {intro && <p className="x-hero__intro">{intro}</p>}
        {children}
      </div>
      {size === "full" && (
        <div className="x-hero__cue" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      )}
    </section>
  );
}

/* Full-bleed image that grows from an inset frame to the full width as it
   scrolls in (scale on a wrapper; the image counter-scales for parallax). */
export function ScrubFrame({ photo, alt, caption, children }: { photo: PhotoKey; alt: string; caption?: string; children?: React.ReactNode }) {
  const ref = useProgress<HTMLElement>("through");
  return (
    <section ref={ref} className="x-frame">
      <div className="x-frame__win">
        <Photo k={photo} alt={alt} className="x-frame__img" />
        <div className="x-frame__shade" aria-hidden="true" />
        {children && <div className="x-frame__body container">{children}</div>}
        <Hud readout={caption} />
      </div>
    </section>
  );
}

/* Horizontally-drifting band of words (pure CSS loop). */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <span className="x-marquee__row" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <React.Fragment key={t}>
          <span className="x-marquee__t">{t}</span>
          <span className="x-marquee__dot" aria-hidden="true" />
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div className="x-marquee" aria-hidden="true">
      <div className="x-marquee__track">
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}

/* Process rail: line draws as the section scrolls; each step lights up. */
export function StepRail({ steps }: { steps: { n?: string; t: string; d: string }[] }) {
  const ref = useProgress<HTMLOListElement>("enter");
  return (
    <ol ref={ref} className="x-rail" style={{ ["--n" as string]: steps.length }}>
      <span className="x-rail__line" aria-hidden="true"><i /></span>
      {steps.map((s, i) => (
        <li key={s.t} className="x-rail__step" style={{ ["--i" as string]: i, ["--at" as string]: ((i + 0.5) / steps.length).toFixed(3) }}>
          <span className="x-rail__dot" aria-hidden="true" />
          <span className="x-rail__n">{s.n ?? `0${i + 1}`}</span>
          <span className="x-rail__t">{s.t}</span>
          <span className="x-rail__d">{s.d}</span>
        </li>
      ))}
    </ol>
  );
}

/* Card with pointer tilt + glare. */
export function TiltCard({ as: Tag = "div", className = "", children, style, ...rest }: { as?: React.ElementType; className?: string; children: React.ReactNode; style?: React.CSSProperties; [k: string]: unknown }) {
  const ref = useTilt<HTMLElement>();
  return (
    <Tag ref={ref} className={`x-tilt ${className}`} style={style} {...rest}>
      {children}
      <span className="x-tilt__glare" aria-hidden="true" />
    </Tag>
  );
}

/* Sticky stage: the photo on the left swaps as each chapter on the right
   becomes active. On small screens each chapter carries its own photo. */
export function StickySwap({ chapters }: { chapters: { photo: PhotoKey; alt: string; content: React.ReactNode; accent: string }[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);
  return (
    <div className="x-swap">
      <div className="x-swap__stage" aria-hidden="true">
        <div className="x-swap__frame" >
          {chapters.map((c, i) => (
            <div key={c.photo} className={`x-swap__img ${i === active ? "is-on" : ""}`}>
              <Photo k={c.photo} alt="" sizes="(max-width: 999px) 100vw, 50vw" />
            </div>
          ))}
          <Hud readout={`CH.0${active + 1} / 0${chapters.length}`} />
          <div className="x-swap__ticks">
            {chapters.map((c, i) => <i key={c.photo} className={i === active ? "is-on" : ""} />)}
          </div>
        </div>
      </div>
      <div className="x-swap__list">
        {chapters.map((c, i) => (
          <div
            key={c.photo}
            ref={(el) => { refs.current[i] = el; }}
            data-i={i}
            className={`x-swap__ch ${i === active ? "is-on" : ""}`}
            
          >
            <div className="x-swap__inline"><Photo k={c.photo} alt={c.alt} sizes="100vw" /></div>
            {c.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Arrow({ dir = "ur", size = 18 }: { dir?: "ur" | "r"; size?: number }) {
  return <Icon name={dir === "ur" ? "arrow-ur" : "arrow-r"} size={size} />;
}
