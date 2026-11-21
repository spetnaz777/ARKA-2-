import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./graphics";

/* ARKA brand film in a minimal fullscreen lightbox.
   Nothing loads until it's opened (preload="none"); 720p on small screens or
   Save-Data, 1080p otherwise. The film is silent (no audio track), so it plays muted with no sound toggle; Esc or the
   close button dismisses it, focus is trapped while open and returned to the
   trigger, and the video pauses on close. */
export function ShowreelButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  }, []);
  return (
    <>
      <button ref={trigger} type="button" className={`playlink ${className}`} onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="playlink__ring" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3.5 2.2v7.6L9.8 6z" fill="currentColor" /></svg>
        </span>
        Watch the Film
      </button>
      {open && createPortal(<Lightbox onClose={close} />, document.body)}
    </>
  );
}

function Lightbox({ onClose }: { onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [res] = useState(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    return window.innerWidth < 1100 || saveData ? "720" : "1080";
  });

  useEffect(() => {
    const el = box.current!;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const site = document.querySelector<HTMLElement>(".site");
    if (site) site.inert = true;
    el.querySelector<HTMLElement>(".reel__close")?.focus();
    video.current?.play().catch(() => {});
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        const f = Array.from(el.querySelectorAll<HTMLElement>("button, video[controls]"));
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      video.current?.pause();
      document.body.style.overflow = prev;
      if (site) site.inert = false;
      document.removeEventListener("keydown", key);
    };
  }, [onClose]);

  return (
    <div ref={box} className="reel" role="dialog" aria-modal="true" aria-label="ARKA brand film" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="reel__frame">
        <video
          ref={video}
          className="reel__video"
          muted
          playsInline
          controls
          preload="none"
          poster="/media/film-poster.webp"
        >
          <source src={`/media/film-${res}.webm`} type="video/webm" />
          <source src={`/media/film-${res}.mp4`} type="video/mp4" />
        </video>
      </div>
      <div className="reel__bar">
        <button type="button" className="reel__btn reel__close" onClick={onClose} aria-label="Close film">
          <Icon name="close" size={18} />
        </button>
      </div>
    </div>
  );
}
