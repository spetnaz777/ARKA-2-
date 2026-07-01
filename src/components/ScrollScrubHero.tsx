import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ╔══════════════════════════════════════════════════════════════╗
// ║  CONFIGURABLE CONSTANTS — tune these without reading the   ║
// ║  rest of the code.                                          ║
// ╚══════════════════════════════════════════════════════════════╝

/** Pixels of window scroll per second of video.
 *  200 → 5s video = 1000px scrub distance (scroll container height).
 *  Increase for a more deliberate, slower feel (250-300).
 *  Decrease for a snappier pass-through (150). */
const SCROLL_MULTIPLIER = 200;

/** Lerp smoothing factor on desktop / trackpad.
 *  0.08 = very smooth, slow catch-up (buttery)
 *  0.12 = smooth and responsive  ← recommended
 *  0.20 = fast, minimal lag      */
const LERP_FACTOR = 0.12;

/** Lerp factor on mobile touch-scroll.
 *  Lower than desktop — touch already has OS momentum smoothing. */
const MOBILE_LERP_FACTOR = 0.08;

/** Viewport width in px at which mobile lerp kicks in. */
const MOBILE_BREAKPOINT = 768;

/** Show the center overlay text during the scrub.
 *  Set to false to remove all overlay text. */
const SHOW_OVERLAY_TEXT = true;

/** Text shown between 28%–68% scroll progress.
 *  Edit freely — single line, all-caps recommended. */
const OVERLAY_TEXT = "Built Different.";

/** MP4 path relative to /public — place the file at exactly this path. */
const VIDEO_SRC = "/video/arka-hero.mp4";

/** Scroll progress at which overlay text starts fading IN.  0–1. */
const OVERLAY_FADE_IN_START = 0.28;

/** Scroll progress at which overlay text starts fading OUT. 0–1. */
const OVERLAY_FADE_OUT_START = 0.62;

/** Width of the fade-in / fade-out window in scroll-progress units. */
const OVERLAY_FADE_WIDTH = 0.10;

/** Minimum scroll offset from page top before scrubbing begins.
 *  Should roughly match header height so the first frame shows
 *  as soon as the container enters the viewport. */
const SCRUB_START_OFFSET = 80; // px

// ╔══════════════════════════════════════════════════════════════╗
// ║  COMPONENT                                                  ║
// ╚══════════════════════════════════════════════════════════════╝

interface ScrollScrubHeroProps {
  /** Called once when the user scrolls past the entire scrub section. */
  onScrollComplete?: () => void;
}

export const ScrollScrubHero: React.FC<ScrollScrubHeroProps> = ({ onScrollComplete }) => {
  // ── Refs — never cause re-renders ────────────────────────────
  const containerRef   = useRef<HTMLDivElement>(null);
  const videoWrapRef   = useRef<HTMLDivElement>(null);
  const videoRef       = useRef<HTMLVideoElement>(null);
  const overlayTextRef = useRef<HTMLParagraphElement>(null);

  // ── Height comes from actual video duration once metadata loads ─
  const [scrollHeight, setScrollHeight] = useState(SCROLL_MULTIPLIER * 5);

  // ── Effect — scroll + RAF loop ────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const wrap      = videoWrapRef.current;
    const video     = videoRef.current;
    const overlay   = overlayTextRef.current;
    if (!container || !wrap || !video) return;

    // ── Device-aware lerp ─────────────────────────────────────
    const isMobile  = window.innerWidth < MOBILE_BREAKPOINT;
    const lerpAlpha = isMobile ? MOBILE_LERP_FACTOR : LERP_FACTOR;

    // ── Lerp accumulators (mutable, not React state) ──────────
    let targetTime   = 0;
    let displayTime  = 0;
    let rafId        = 0;
    let notifiedDone = false;

    // ── Safari fastSeek helper ────────────────────────────────
    const seekTo = (t: number) => {
      const clamped = Math.max(0, Math.min(video.duration || 0, t));
      if ((video as any).fastSeek) {
        (video as any).fastSeek(clamped);
      } else {
        video.currentTime = clamped;
      }
    };

    // ── DOM write guards — only write when value changes ──────
    let lastOpacity      = -1;
    let lastOverlayOpac  = -1;
    const setWrapOpacity = (v: number) => {
      const rounded = Math.round(v * 100) / 100;
      if (rounded !== lastOpacity) {
        wrap.style.opacity = String(rounded);
        lastOpacity = rounded;
      }
    };
    const setOverlayOpacity = (v: number) => {
      if (!overlay) return;
      const rounded = Math.round(v * 100) / 100;
      if (rounded !== lastOverlayOpac) {
        overlay.style.opacity = String(rounded);
        lastOverlayOpac = rounded;
      }
    };

    // ══════════════════════════════════════════════════════════
    // Per-frame tick — runs every animation frame
    // ══════════════════════════════════════════════════════════
    const tick = () => {
      rafId = requestAnimationFrame(tick);

      // ── Document-coordinate top of the scroll container ───
      // getBoundingClientRect().top is viewport-relative; add scrollY for doc coords.
      const containerTop  = container.getBoundingClientRect().top + window.scrollY;
      const scrollDist    = container.clientHeight;
      const sy            = window.scrollY;
      const vh            = window.innerHeight;

      // ── Is the container's leading edge within view?
      // This makes the first frame visible on page load if the container
      // is near the top (common case: first section below sticky header).
      const containerVisible = (sy + vh) > (containerTop - SCRUB_START_OFFSET);
      const pastContainer    = sy >= containerTop + scrollDist;

      // ── BEFORE / not yet visible ──────────────────────────
      if (!containerVisible) {
        setWrapOpacity(0);
        setOverlayOpacity(0);
        displayTime = 0;
        targetTime  = 0;
        if (video.readyState >= 2) seekTo(0);
        return;
      }

      // ── PAST container — hold last frame, fire callback ───
      if (pastContainer) {
        setWrapOpacity(0);
        setOverlayOpacity(0);
        if (video.readyState >= 2 && video.duration) {
          seekTo(video.duration);
          displayTime = video.duration;
          targetTime  = video.duration;
        }
        if (!notifiedDone) {
          notifiedDone = true;
          onScrollComplete?.();
        }
        return;
      }

      // ── ACTIVE scrub zone ─────────────────────────────────
      notifiedDone = false;
      setWrapOpacity(1);

      if (video.readyState >= 2 && video.duration) {
        const rawProgress = (sy - containerTop) / scrollDist;
        const progress    = Math.max(0, Math.min(1, rawProgress));

        // Lerp toward target
        targetTime  = progress * video.duration;
        displayTime += (targetTime - displayTime) * lerpAlpha;
        seekTo(displayTime);

        // ── Overlay text opacity ──────────────────────────
        if (overlay && SHOW_OVERLAY_TEXT) {
          const fadeIn  = Math.max(0, Math.min(1,
            (progress - OVERLAY_FADE_IN_START)  / OVERLAY_FADE_WIDTH));
          const fadeOut = Math.max(0, Math.min(1,
            (OVERLAY_FADE_OUT_START + OVERLAY_FADE_WIDTH - progress) / OVERLAY_FADE_WIDTH));
          setOverlayOpacity(Math.min(fadeIn, fadeOut));
        }
      } else {
        // Video not ready yet — show first frame with opacity
        setWrapOpacity(1);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [onScrollComplete]);

  // ── The portal target must exist in DOM ──────────────────────
  // document.body is always available in a Vite SPA. createPortal
  // is used to escape <main>'s CSS transform stacking context,
  // which would otherwise break position:fixed on the video wrapper.
  const portalTarget =
    typeof document !== "undefined" ? document.body : null;

  return (
    <>
      {/* ── Scroll container — stays in normal flow ───────────
          Provides the vertical scroll distance. The video itself
          is portal'd out so transform on <main> doesn't break fixed. */}
      <div
        ref={containerRef}
        style={{ height: `${scrollHeight}px` }}
        aria-hidden="true"
      />

      {/* ── Fixed video — rendered directly in <body> ─────────
          createPortal ensures position:fixed works correctly even
          when ancestor elements have CSS transform applied. */}
      {portalTarget &&
        createPortal(
          <div
            ref={videoWrapRef}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 20,          // above main (z-10), below header (z-40)
              opacity: 0,          // controlled by RAF tick
              pointerEvents: "none",
              transition: "opacity 0.25s ease",  // smooth entry/exit at zone boundary
              willChange: "opacity",
            }}
          >
            {/* ── Full-viewport video ── */}
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              tabIndex={-1}
              aria-hidden="true"
              onLoadedMetadata={(e) => {
                const dur = e.currentTarget.duration;
                if (dur && dur > 0) {
                  setScrollHeight(Math.ceil(dur * SCROLL_MULTIPLIER));
                }
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                willChange: "transform",  // GPU layer hint
              }}
            >
              <source src={VIDEO_SRC} type="video/mp4" />
            </video>

            {/* ── Top-left: ARKA logo watermark ── */}
            <div
              style={{
                position: "absolute",
                top: "clamp(16px, 3vh, 28px)",
                left: "clamp(16px, 4vw, 48px)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <img
                src="/arka-logo.svg"
                alt="ARKA"
                style={{ width: "clamp(36px, 5vw, 52px)", height: "auto", opacity: 0.85 }}
              />
            </div>

            {/* ── Center: scroll-progress overlay text ── */}
            {SHOW_OVERLAY_TEXT && (
              <p
                ref={overlayTextRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 0,
                  opacity: 0,      // controlled by RAF tick
                  pointerEvents: "none",
                  zIndex: 1,
                  fontFamily: "'Michroma', sans-serif",
                  fontSize: "clamp(1.6rem, 4.5vw, 5rem)",
                  fontWeight: 300,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.9)",
                  textShadow: "0 2px 40px rgba(0,0,0,0.6)",
                }}
              >
                {OVERLAY_TEXT}
              </p>
            )}

            {/* ── Bottom: scroll indicator (before scrub begins) ── */}
            <div
              style={{
                position: "absolute",
                bottom: "clamp(24px, 5vh, 48px)",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                pointerEvents: "none",
                zIndex: 1,
                opacity: 0.55,
              }}
            >
              <span
                style={{
                  fontFamily: "'Michroma', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Scroll
              </span>
              {/* Animated chevron */}
              <svg
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                style={{ animation: "scrub-bounce 1.6s ease-in-out infinite" }}
              >
                <path
                  d="M1 1L7 7L13 1"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>,
          portalTarget
        )}
    </>
  );
};
