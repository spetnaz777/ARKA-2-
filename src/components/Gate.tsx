import { useEffect, useState } from "react";
import { Logo } from "./Logo";

/* The ARKA entry gate, kept exactly as on the previous live site: dark
   backdrop, glowing mark, "The sky is our limit", glass panel with Enter +
   progress bar, and Skip. Shown once per browser session (sessionStorage,
   same key as before). An inline head script adds `gate-done` to <html> for
   returning visitors so the prerendered gate never flashes. The page content
   is always in the HTML underneath, so crawlers and no-JS visitors still get
   the full site. */

const KEY = "arka_portal_entered";

export function Gate() {
  const [state, setState] = useState<"open" | "leaving" | "gone">("open");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let done = false;
    try {
      done = sessionStorage.getItem(KEY) === "true";
    } catch {
      /* storage blocked: show the gate */
    }
    if (done || document.documentElement.classList.contains("gate-done")) {
      document.documentElement.classList.remove("intro-pending");
      setState("gone");
      return;
    }
    document.documentElement.classList.add("gate-open");
    const site = document.querySelector<HTMLElement>(".site");
    if (site) site.inert = true;
  }, []);

  const finish = () => {
    try {
      sessionStorage.setItem(KEY, "true");
    } catch {
      /* ignore */
    }
    setState("leaving");
    document.documentElement.classList.remove("gate-open", "intro-pending");
    const site = document.querySelector<HTMLElement>(".site");
    if (site) site.inert = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      setState("gone");
      document.documentElement.classList.add("gate-done");
      document.getElementById("main")?.focus({ preventScroll: true });
    }, reduce ? 0 : 550);
  };

  const start = () => {
    if (loading) return;
    setLoading(true);
    let c = 0;
    const t = window.setInterval(() => {
      c += 5;
      setProgress(c);
      if (c >= 100) {
        window.clearInterval(t);
        window.setTimeout(finish, 320);
      }
    }, 70);
  };

  if (state === "gone") return null;

  return (
    <div
      className={`arka-gate fixed inset-0 z-[80] bg-black flex flex-col items-center justify-center px-6 overflow-hidden ${state === "leaving" ? "is-leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Enter ARKA"
    >
      {/* faint backdrop for depth */}
      <picture aria-hidden="true">
        <source type="image/avif" srcSet="/media/gate-800.avif 800w, /media/gate-1440.avif 1440w" sizes="100vw" />
        <source type="image/webp" srcSet="/media/gate-1440.webp" />
        <img
          src="/deep-black-hero-1280.jpg"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
      </picture>
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl scale-125 pointer-events-none" />
          <Logo className="relative w-16 h-16 md:w-20 md:h-20 text-white" />
        </div>
        <p className="gate-brand text-xl md:text-2xl">ARKA</p>
        <p className="gate-label text-[8px] text-[#8a8a92] mt-3 mb-8">The sky is our limit</p>

        {/* blurred glass panel */}
        <div
          className="w-full rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-xl p-6 md:p-7 flex flex-col items-center gap-4 relative overflow-hidden"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 24px 60px rgba(0,0,0,0.5)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.10), transparent 55%)" }}
          />
          {!loading ? (
            <>
              <p className="gate-body relative text-[12px] leading-relaxed text-white/65">
                Digital systems, built by one operator — live in days, not months.
              </p>
              <button
                type="button"
                onClick={start}
                className="gate-enter relative w-full py-3.5 rounded-full bg-[#f0f0fa] text-black text-[10px] tracking-[0.16em] uppercase hover:bg-white transition-colors"
              >
                Enter
              </button>
            </>
          ) : (
            <div className="relative w-full py-2" role="progressbar" aria-label="Entering" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <div className="w-full h-px bg-white/20 overflow-hidden">
                <div className="gate-bar h-full w-full bg-white origin-left" style={{ transform: `scaleX(${progress / 100})` }} />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={finish}
          className="gate-label relative mt-4 text-[9px] text-[#8a8a92] hover:text-[#c4c4cc] transition-colors"
        >
          Skip &rarr;
        </button>
      </div>
    </div>
  );
}
