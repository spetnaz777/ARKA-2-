import { useEffect, useRef } from "react";

/* Existing site imagery, re-graded for the white system (grayscale, raised
   exposure) as AVIF/WebP derivatives in /media (see scripts/assets). */
export type PaleName = "img-space" | "img-monolith" | "img-corridor" | "img-hall" | "img-concrete" | "rocket-hangar" | "deep-black-hero";

export function PaleImage({ name, className = "", sizes = "(max-width: 700px) 100vw, 640px", eager = false }: { name: PaleName; className?: string; sizes?: string; eager?: boolean }) {
  const set = (ext: string) => `/media/pale-${name}-640.${ext} 640w, /media/pale-${name}-1200.${ext} 1200w`;
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img src={`/media/pale-${name}-640.webp`} alt="" width={1200} height={675} loading={eager ? "eager" : "lazy"} decoding="async" />
    </picture>
  );
}

/* Muted, looping background video derived from the site's existing footage.
   Never preloaded; starts only while on screen; stays on its poster under
   prefers-reduced-motion or Save-Data. */
export function LazyVideo({ name, className = "", poster }: { name: "terrain-loop" | "horizon-loop" | "film-720"; className?: string; poster?: string }) {
  const posterUrl = poster ?? `/media/${name}-poster.webp`;
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!("IntersectionObserver" in window)) {
      v.poster = posterUrl;
      return;
    }
    if (reduce || saveData) {
      v.poster = posterUrl;
      return;
    }
    let loaded = false;
    // poster is attached only once the video nears the viewport (keeps it off the critical path)
    const po = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        v.poster = posterUrl;
        po.disconnect();
      }
    }, { rootMargin: "400px" });
    po.observe(v);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!loaded) {
            v.preload = "auto";
            v.load();
            loaded = true;
          }
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      po.disconnect();
    };
  }, [name]);
  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    >
      <source src={`/media/${name}.webm`} type="video/webm" />
      <source src={`/media/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
