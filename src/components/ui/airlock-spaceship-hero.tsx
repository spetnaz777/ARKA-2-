import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────
   AIRLOCK — scroll-scrubbed video moment (adapted for a mid-page
   section). The original pinned <body> and hijacked the wheel; on a
   page with content above it that traps readers and janks on phones.
   This version uses a tall section with a sticky stage: native scroll
   drives video.currentTime forward AND backward, so it never locks,
   keyboard / trackpad / touch all just work, and scrolling back up
   plays it in reverse. Same look: headline blurs out, payoff blurs in,
   thin progress line. Reduced motion: static payoff frame, short section.
   ────────────────────────────────────────────────────────────── */

export interface AirlockHeroProps {
  videoSrc: string;
  mobileVideoSrc?: string;
  posterSrc?: string;
  eyebrow?: string;
  title?: string;
  tagline?: string;
  scrollHint?: string;
  /** Section height in viewport heights (scrub length). */
  length?: number;
  id?: string;
  /** Two small HUD readouts across the top. */
  hud?: [string, string];
  /** Monochrome grade (the moon) or full colour (the astronaut). */
  tone?: "mono" | "color";
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function AirlockHero({
  videoSrc,
  mobileVideoSrc,
  posterSrc,
  eyebrow,
  title = "THE AIRLOCK OPENS",
  tagline = "",
  scrollHint = "SCROLL",
  length = 3.2,
  id,
  hud = ["LUNAR APPROACH · 384,400 KM", "SYS.02 · ARKA/ORBIT"],
  tone = "mono",
}: AirlockHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    const narrow = window.matchMedia("(max-width: 767px)").matches;

    // load the clip only when the section is about a screen away
    const lazy = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSrc(narrow && mobileVideoSrc ? mobileVideoSrc : videoSrc);
          lazy.disconnect();
        }
      },
      { rootMargin: "120% 0px" },
    );
    lazy.observe(section);

    let duration = 0;
    let target = 0;
    let shown = 0;
    let raf = 0;
    let seeking = false;
    let queued: number | null = null;
    let active = false;

    const seek = (t: number) => {
      if (seeking) { queued = t; return; }
      seeking = true;
      video.currentTime = t;
    };
    const onSeeked = () => {
      seeking = false;
      if (queued !== null) { const t = queued; queued = null; seek(t); }
    };
    const onLoaded = () => {
      duration = video.duration || 0;
      setReady(true);
      if (rm) seek(Math.max(0, duration - 0.05));
    };

    // Phones: crossfade only. A half-finished blur on text reads as a rendering bug and is costly on mobile GPUs.
    const noBlur = window.matchMedia("(max-width: 767px)").matches;
    const paint = (p: number) => {
      const vp = clamp(p / 0.8, 0, 1); // last 20% holds the final frame
      if (duration > 0) {
        const t = Math.min(vp * duration, duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.01) seek(t);
      }
      const ta = 1 - clamp(vp / 0.3, 0, 1);
      const pa = clamp((vp - 0.78) / 0.22, 0, 1);
      video.style.transform = `scale(${1 + vp * 0.08})`;
      if (scrimRef.current) scrimRef.current.style.opacity = String(Math.max(ta, pa) * 0.9);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(ta);
        titleRef.current.style.transform = `translateY(${(1 - ta) * -28}px) scale(${0.96 + ta * 0.04})`;
        titleRef.current.style.filter = noBlur ? "" : `blur(${(1 - ta) * 12}px)`;
      }
      if (tagRef.current) {
        tagRef.current.style.opacity = String(pa);
        tagRef.current.style.transform = `translateY(${(1 - pa) * 22}px) scale(${0.97 + pa * 0.03})`;
        tagRef.current.style.filter = noBlur ? "" : `blur(${(1 - pa) * 10}px)`;
      }
      if (hintRef.current) hintRef.current.style.opacity = p > 0.02 ? "0" : "1";
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };

    const read = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      target = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
    };
    const frame = () => {
      raf = 0;
      shown += (target - shown) * 0.2;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      paint(shown);
      if (active && shown !== target) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      read();
      if (active && !raf) raf = requestAnimationFrame(frame);
    };
    const vis = new IntersectionObserver(([e]) => {
      active = e.isIntersecting;
      if (active) onScroll();
    });
    vis.observe(section);

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("seeked", onSeeked);
    if (!rm) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      read(); shown = target; paint(shown);
    } else {
      paint(1);
    }
    return () => {
      lazy.disconnect();
      vis.disconnect();
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [videoSrc, mobileVideoSrc]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`airlock airlock--${tone}`}
      data-tone="dark"
      aria-label={title}
      style={{ height: reduced ? "100svh" : `${length * 100}svh` }}
    >
      <div className="airlock__stage">
        {posterSrc && <img className="airlock__poster" src={posterSrc} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
        <video
          ref={videoRef}
          src={src ?? undefined}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="airlock__video"
          style={{ opacity: ready ? 1 : 0 }}
        />
        <div className="airlock__falloff" aria-hidden="true" />
        <div ref={scrimRef} className="airlock__scrim" aria-hidden="true" />
        <div className="airlock__hud" aria-hidden="true">
          <span>{hud[0]}</span>
          <span>{hud[1]}</span>
        </div>
        <div ref={titleRef} className="airlock__layer">
          <div>
            {eyebrow && <p className="airlock__eyebrow">{eyebrow}</p>}
            <h2 className="airlock__title">{title}</h2>
          </div>
        </div>
        {tagline && (
          <div ref={tagRef} className="airlock__layer" style={{ opacity: 0 }}>
            <p className="airlock__tag">{tagline}</p>
          </div>
        )}
        <div ref={hintRef} className="airlock__hint" aria-hidden="true">
          <span>{scrollHint}</span>
          <svg width="14" height="18" viewBox="0 0 14 18"><path d="M7 1 L7 17 M2 12 L7 17 L12 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div className="airlock__track" aria-hidden="true"><div ref={barRef} className="airlock__bar" /></div>
      </div>
    </section>
  );
}
