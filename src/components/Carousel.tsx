import React, { useCallback, useRef, useState } from "react";
import type { Project } from "../content/site";
import { ContourPattern, Hatch, Icon } from "./graphics";
import { Link } from "../lib/router";

/* Featured-work carousel: real ARKA client builds only.
   Prev/next buttons, ←/→ keys while focus is inside, swipe on touch,
   polite live region announcing the current slide. */
export function Carousel({ projects, intro }: { projects: Project[]; intro?: React.ReactNode }) {
  const [i, setI] = useState(0);
  const n = projects.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);
  const startX = useRef<number | null>(null);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <div
      className="carousel sec__grid"
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected work"
      onKeyDown={onKey}
    >
      <div className="carousel__left">
      {intro}
      <div className="carousel__controls">
        <button type="button" className="ctrl-btn chamfer chamfer--raised" aria-label="Previous project" onClick={() => go(-1)}>
          <Icon name="arrow-l" size={18} />
        </button>
        <button type="button" className="ctrl-btn chamfer chamfer--raised" aria-label="Next project" onClick={() => go(1)}>
          <Icon name="arrow-r" size={18} />
        </button>
      </div>
      </div>
      <div className="carousel__right">

      <div
        className="carousel__stage"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startX.current == null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => (startX.current = null)}
      >
        <div className="work-panel chamfer chamfer--raised" style={{ ["--cut" as string]: "22px" }}>
          {projects.map((p, k) => (
            <article
              key={p.slug}
              className={`slide ${k === i ? "is-active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${k + 1} of ${n}: ${p.name}`}
              aria-hidden={k !== i}
              inert={k !== i ? true : undefined}
            >
              <ContourPattern variant={p.wave} className="slide__wave" />
              <div className="slide__body">
                <span className="chip">{p.category}</span>
                <h3 className="slide__title">{p.name}</h3>
                <p className="slide__desc">
                  <span>{p.summary}</span>
                  <Link to={`/work/${p.slug}`} className="slide__link" aria-label={`View ${p.name} case study`}>
                    <Icon name="arrow-ur" size={18} />
                  </Link>
                </p>
              </div>
            </article>
          ))}
          <Hatch className="work-panel__hatch" n={10} w={46} h={12} fade={false} />
        </div>
        <span className="work-panel__bracket" aria-hidden="true" />
      </div>

      <div className="carousel__markers" aria-hidden="true">
        <span>{pad(i + 1)}</span>
        <span className="carousel__track">
          <span className="carousel__fill" style={{ width: `${((i + 1) / n) * 100}%` }} />
        </span>
        <span>{pad(n)}</span>
      </div>
      </div>
      <p className="sr-only" aria-live="polite">
        Project {i + 1} of {n}: {projects[i].name}
      </p>
    </div>
  );
}
