import { useEffect, useState } from "react";

/* Data-stream micro-typography: a quiet terminal log in the hero corner.
   Decorative (aria-hidden), desktop only, static under reduced motion. */
const LINES = [
  "› arka.boot()                ok",
  "› orbit.render(lunar)        60fps",
  "› systems.ai.link()          ok",
  "› web.deploy(edge)           ok",
  "› growth.signal              ▲ live",
  "› N 43.65° / W 79.38°        gta",
];

export function Terminal() {
  const [n, setN] = useState(LINES.length);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let i = 0;
    const id = window.setInterval(() => {
      if (document.documentElement.classList.contains("intro-pending")) return;
      i = (i + 1) % (LINES.length + 4);
      setN(Math.min(i, LINES.length));
    }, 650);
    return () => window.clearInterval(id);
  }, []);
  return (
    <pre className="term hide-tablet" aria-hidden="true">
      {LINES.slice(0, n).map((l, k) => (
        <span key={k} className={k === n - 1 ? "is-new" : ""}>{l}{"\n"}</span>
      ))}
      <span className="term__caret" />
    </pre>
  );
}
