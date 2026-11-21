import React, { useEffect, useRef, useState } from "react";
import { Link } from "../lib/router";
import { Logo } from "./Logo";
import { EdgeTrace, Hatch, Icon } from "./graphics";
import { Decode } from "./fx";
import type { Service } from "../content/site";

/* Live-site brand treatment: original mark + "ARKA" set in Anurati. */
export function Wordmark({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" }) {
  return (
    <span className={`wordmark wordmark--${size} ${className}`}>
      <Logo className="wordmark__mark" />
      <span className="wordmark__text" aria-label="ARKA">
        {"ARKA".split("").map((ch, i) => (
          <span key={i} className="wordmark__ch" aria-hidden="true" style={{ ["--i" as string]: i }}>{ch}</span>
        ))}
      </span>
    </span>
  );
}

type BtnProps = {
  to?: string;
  variant?: "primary" | "outline" | "ghost";
  arrow?: "ur" | "r" | "none";
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick">;

export function Button({ to, variant = "primary", arrow = "ur", children, className = "", type = "button", disabled, onClick, ...rest }: BtnProps) {
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {arrow !== "none" && (
        <span className="btn__arrow">
          <Icon name={arrow === "ur" ? "arrow-ur" : "arrow-r"} size={16} />
        </span>
      )}
    </>
  );
  const cls = `btn btn--${variant} ${className}`;
  if (to)
    return (
      <Link to={to} className={cls} onClick={onClick} {...rest}>
        {inner}
      </Link>
    );
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {inner}
    </button>
  );
}

export function SectionLabel({ n, label, className = "" }: { n: string; label: string; className?: string }) {
  return (
    <p className={`label ${className}`}>
      <span>{n}</span>
      <span aria-hidden="true">//</span>
      <Decode text={label} />
    </p>
  );
}

/* Adds .is-in when the element scrolls into view (CSS handles the motion,
   and content is fully visible without JS or with reduced motion). */
export function Reveal({ as: Tag = "div", className = "", children, delay = 0, ...rest }: { as?: React.ElementType; className?: string; children: React.ReactNode; delay?: number } & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setIn(true);
    const io = new IntersectionObserver(
      (es) => es.some((e) => e.isIntersecting) && (setIn(true), io.disconnect()),
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

export function ServiceCard({ s, index = 0 }: { s: Service; index?: number }) {
  return (
    <Reveal as="li" className="svc-card-wrap" delay={index * 80}>
      <Link to={`/services/${s.slug}`} className="svc-card chamfer chamfer--raised" style={{ ["--cut" as string]: "14px" }}>
        <span className="svc-card__top">
          <span className="svc-card__icon">
            <Icon name={s.icon} size={26} />
          </span>
          <span className="svc-card__arrow">
            <Icon name="arrow-ur" size={18} />
          </span>
        </span>
        <span className="svc-card__title">{s.short}</span>
        <span className="svc-card__desc">{s.card}</span>
        <EdgeTrace />
      </Link>
    </Reveal>
  );
}

export function HatchMark({ className = "" }: { className?: string }) {
  return <Hatch className={className} n={9} w={44} h={11} />;
}

export function PageIntro({ n, label, title, italic, intro, children }: { n: string; label: string; title: string; italic?: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="page-intro">
      <SectionLabel n={n} label={label} />
      <h1 className="h-page">
        {title}
        {italic && (
          <>
            {" "}
            <em>{italic}</em>
          </>
        )}
      </h1>
      {intro && <p className="lead">{intro}</p>}
      {children}
    </div>
  );
}

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q} className="faq__item">
          <summary>
            <span>{f.q}</span>
            <span className="faq__icon" aria-hidden="true" />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
