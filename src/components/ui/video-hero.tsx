import { useEffect, useRef, useState, type ReactNode } from "react";

interface VideoHeroProps {
  videoSrc: string;
  /** Lighter encode served to narrow / touch screens. */
  videoSrcMobile?: string;
  poster?: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}

/**
 * Full-bleed looping video hero. The video always autoplays (muted, inline)
 * regardless of scroll. Same behaviour on every screen size — no scroll
 * hijacking. Content below renders in normal document flow.
 */
export default function VideoHero({
  videoSrc,
  videoSrcMobile,
  poster,
  eyebrow,
  title,
  children,
}: VideoHeroProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src] = useState(() => {
    if (typeof window === "undefined") return videoSrc;
    try {
      return window.matchMedia("(max-width: 767px)").matches && videoSrcMobile
        ? videoSrcMobile
        : videoSrc;
    } catch {
      return videoSrc;
    }
  });

  // Some browsers won't honour the autoplay attribute until asked directly.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    const onVis = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [src]);

  return (
    <section className="relative overflow-hidden bg-black border-b border-[#262629] min-h-[78svh] flex items-end">
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* darkeners for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.42)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 34%, rgba(0,0,0,0.2) 62%, rgba(0,0,0,0.82) 100%)",
        }}
      />
      <div className="hero-grain" />

      <div className="relative z-10 wrap pt-32 pb-16 md:pt-40 md:pb-20 w-full">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1
          className="u-head mt-4 max-w-4xl"
          style={{ fontSize: "clamp(2rem, 7vw, 4.4rem)", lineHeight: 1.05 }}
        >
          {title}
        </h1>
        {children}
      </div>
    </section>
  );
}
