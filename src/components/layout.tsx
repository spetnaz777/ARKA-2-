import React, { useEffect, useRef, useState } from "react";
import { LiquidNavbar, NimbusIcons, type LiquidNavItem } from "@/components/ui/liquid-glass-navbar";
import { Link, useRouter } from "../lib/router";
import { NAV, SERVICES, SITE } from "../content/site";
import { Button, Wordmark } from "./ui";
import { CircuitFrame, Icon } from "./graphics";
import { LazyVideo } from "./media";
import { Logo } from "./Logo";

const isActive = (path: string, to: string) => (to === "/" ? path === "/" : path === to || path.startsWith(to + "/"));

const G = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const NAV_ITEMS: LiquidNavItem[] = [
  { label: "Home", href: "/", icon: NimbusIcons.home, fx: "glow" },
  { label: "Services", href: "/services", icon: G(<><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>), fx: "pop" },
  { label: "Work", href: "/work", icon: G(<><rect x="3.5" y="5" width="17" height="12" rx="2" /><path d="M8 20h8M12 17v3" /></>), fx: "spin" },
  { label: "About", href: "/about", icon: NimbusIcons.globe, fx: "spin" },
  { label: "Contact", href: "/contact", icon: G(<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>), fx: "wave" },
];

/* Which tone sits under the header: sections opt in with data-tone="dark". */
function useToneUnder() {
  const [tone, setTone] = useState<"light" | "dark">("light");
  const { path } = useRouter();
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const els = document.elementsFromPoint(window.innerWidth / 2, 40);
      const dark = els.some((el) => !el.closest(".gnav") && el.closest('[data-tone="dark"]'));
      setTone(dark ? "dark" : "light");
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [path]);
  return tone;
}

export function Header() {
  const { path, navigate } = useRouter();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const tone = useToneUnder();
  const active = Math.max(0, NAV_ITEMS.findIndex((n) => (n.href === "/" ? path === "/" : path === n.href || path.startsWith(n.href + "/"))));

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setCompact(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <header className="gnav site-header" data-tone={tone}>
        <Link to="/" className="gnav__brand glass glass--pill" aria-label="ARKA — home">
          <Wordmark />
        </Link>
        <div className="gnav__bar site-header__nav">
          <LiquidNavbar
            items={NAV_ITEMS}
            active={NAV_ITEMS.some((n) => isActive(path, n.href!)) ? active : -1}
            tone={tone}
            compact={compact}
            onNavigate={(href, e) => { e.preventDefault(); navigate(href); }}
          />
        </div>
        <div className="gnav__actions">
          <Link to="/contact" className="glass glass--pill glass-btn site-header__cta">
            Get in Touch <Icon name="arrow-ur" size={15} />
          </Link>
          <button
            ref={trigger}
            type="button"
            className="glass glass--pill menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="menu-btn__lines" aria-hidden="true"><span /><span /><span /></span>
          </button>
        </div>
      </header>
      <MenuPanel open={open} onClose={() => { setOpen(false); trigger.current?.focus(); }} />
    </>
  );
}

function MenuPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { path } = useRouter();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = panel.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(el?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    requestAnimationFrame(() => focusables()[0]?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="site-menu"
      ref={panel}
      className={`menu-panel ${open ? "is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      hidden={!open}
    >
      {open && (
        <CircuitFrame
          desktop={{
            traces: [
              { pts: "l40,t140 l40,b-60", tone: "faint" },
              { pts: "c-80,t96 c-80,t500 c-40,t540 c+260,t540", tone: "faint" },
              { pts: "R-180,b-120 R-120,b-60 r0,b-60" },
            ],
            nodes: [{ at: "l40,t140", kind: "chain", n: 4 }, { at: "c-80,t96" }, { at: "R-180,b-120", kind: "dot" }],
          }}
          mobile={{ traces: [{ pts: "l12,t96 l12,b-40", tone: "faint" }] }}
        />
      )}
      <div className="menu-panel__deco" aria-hidden="true">
        {open && <img src="/media/moon-900.webp" alt="" width={900} height={900} />}
      </div>
      <div className="menu-panel__bar container">
        <Wordmark />
        <button type="button" className="menu-btn menu-btn--close" onClick={onClose} aria-label="Close menu">
          <Icon name="close" size={22} />
        </button>
      </div>
      <div className="container menu-panel__body">
        <nav aria-label="Menu">
          <ul className="menu-panel__primary">
            {[...NAV, { to: "/contact", label: "Contact" }].map((n, i) => (
              <li key={n.to}>
                <Link to={n.to} aria-current={isActive(path, n.to) ? "page" : undefined}>
                  <span className="menu-panel__n">0{i + 1}</span>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-panel__side">
          <p className="label"><span>Services</span></p>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
          <p className="label menu-panel__contact-label"><span>Contact</span></p>
          <a href={`mailto:${SITE.email}`} className="menu-panel__mail">{SITE.email}</a>
          <p className="menu-panel__loc">{SITE.location}</p>
        </div>
      </div>
    </div>
  );
}

export function ContactBanner({ id }: { id?: string }) {
  return (
    <section id={id} className="cbanner-sec" data-tone="dark" aria-labelledby={`${id ?? "cb"}-h`}>
      <CircuitFrame
        desktop={{
          traces: [
            { pts: "c-260,t24 c-120,t24 c-100,t4 c+500,t4 c+520,t-16" },
            { pts: "c+240,t24 c+340,t24", tone: "thick" },
            { pts: "R+40,t30 R+40,b-60 R+10,b-30", tone: "faint" },
          ],
          nodes: [{ at: "c-280,t24", kind: "pair" }],
        }}
        mobile={{ traces: [{ pts: "l12,t20 l12,b-10", tone: "faint" }], nodes: [] }}
      />
      <div className="container">
        <div className="cbanner chamfer chamfer--raised" style={{ ["--cut" as string]: "26px" }}>
          <div className="cbanner__video" aria-hidden="true">
            <LazyVideo name="horizon-loop" />
          </div>
          <div className="cbanner__moon" aria-hidden="true">
            <picture>
              <source srcSet="/media/moon-900.avif" type="image/avif" />
              <img src="/media/moon-900.webp" alt="" width={900} height={900} loading="lazy" decoding="async" />
            </picture>
            <svg className="cbanner__arc" viewBox="0 0 400 400" fill="none">
              <path d="M30 360 A 330 330 0 0 1 300 40" className="tr tr--ink" />
            </svg>
          </div>
          <div className="cbanner__symbol" aria-hidden="true">
            <Logo className="cbanner__logo" />
          </div>
          <span className="cbanner__sep" aria-hidden="true" />
          <div className="cbanner__text">
            <h2 id={`${id ?? "cb"}-h`} className="cbanner__h">Let’s Build What’s Next.</h2>
            <p>From AI systems to full digital growth — we’re ready to bring your vision to life.</p>
          </div>
          <Button to="/contact" variant="primary" className="cbanner__btn">
            Get in Touch
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { path } = useRouter();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <Link to="/" aria-label="ARKA — home" className="site-footer__brand">
            <Wordmark />
          </Link>
          <nav aria-label="Footer">
            <ul className="site-footer__nav">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="navlink" aria-current={isActive(path, n.to) ? "page" : undefined}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a className="site-footer__mail" href={`mailto:${SITE.email}`}>
            <Icon name="mail" size={18} />
            <span>{SITE.email}</span>
          </a>
        </div>
        <div className="site-footer__bottom">
          <p>
            © <span suppressHydrationWarning>{year}</span> ARKA. All rights reserved. <span className="site-footer__loc">{SITE.locationShort}</span>
          </p>
          <ul className="site-footer__legal">
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
