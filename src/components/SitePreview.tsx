import { SITE_SHOTS } from "../content/siteShots";
import "./site-preview.css";

/* ════════════════════════════════════════════════════════════
   Live-site previews. Real screenshots of each client's live site
   (captured with Playwright, self-hosted under /media/sites, see
   scripts/capture-sites). A dark browser window whose page slowly
   scrolls on hover / focus (transform only), and a phone frame.
   Clicking either opens the real site in a new tab.
   ════════════════════════════════════════════════════════════ */

type Proj = { slug: string; name: string; url: string };

export const domainOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

function Shot({ base, widths, w, h, sizes, alt, eager, className }: { base: string; widths: number[]; w: number; h: number; sizes: string; alt: string; eager?: boolean; className?: string }) {
  const set = (ext: string) => widths.map((x) => `${base}-${x}.${ext} ${x}w`).join(", ");
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${base}-${widths[0]}.webp`}
        alt={alt}
        width={w}
        height={h}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

/** Browser window with the live site's tall capture; scrolls on hover. */
export function BrowserPreview({
  p, sizes = "(max-width: 899px) 100vw, 60vw", eager = false, className = "", tone = "dark", link = true,
}: { p: Proj; sizes?: string; eager?: boolean; className?: string; tone?: "dark" | "light"; link?: boolean }) {
  const s = SITE_SHOTS[p.slug];
  if (!s) return null;
  const domain = domainOf(p.url);
  /* the visible viewport is 1440×900 of the capture; scroll the rest */
  const travel = Math.max(0, 1 - 900 / s.tall.h) * -100;
  const inner = (
    <>
      <span className="sp__bar" aria-hidden="true">
        <span className="sp__dots"><i /><i /><i /></span>
        <span className="sp__url">
          <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2M3.5 7h9v7h-9z" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          {domain}
        </span>
        <span className="sp__go">Visit <svg width="10" height="10" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg></span>
      </span>
      <span className="sp__view">
        <Shot
          className="sp__shot"
          base={`/media/sites/${p.slug}-tall`}
          widths={[800, 1440, 2160]}
          w={s.tall.w}
          h={s.tall.h}
          sizes={sizes}
          alt={`Screenshot of the ${p.name} website homepage`}
          eager={eager}
        />
      </span>
    </>
  );
  const cls = `sp sp--${tone} ${className}`;
  const style = { ["--sp-y" as string]: `${travel.toFixed(2)}%` };
  return link ? (
    <a className={cls} style={style} href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit the ${p.name} live site at ${domain} (opens in a new tab)`}>
      {inner}
    </a>
  ) : (
    <span className={cls} style={style}>{inner}</span>
  );
}

/** Phone frame with the live site's mobile capture. */
export function PhonePreview({ p, className = "" }: { p: Proj; className?: string }) {
  const s = SITE_SHOTS[p.slug];
  if (!s) return null;
  return (
    <a className={`sp-phone ${className}`} href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit the ${p.name} live site on mobile (opens in a new tab)`}>
      <span className="sp-phone__screen">
        <Shot
          base={`/media/sites/${p.slug}-mobile`}
          widths={[780]}
          w={s.mobile.w}
          h={s.mobile.h}
          sizes="320px"
          alt={`Screenshot of the ${p.name} website on a phone`}
        />
        <span className="sp-phone__island" aria-hidden="true" />
      </span>
    </a>
  );
}

/** Wide above-the-fold capture (used as a full-bleed backdrop). */
export function SiteShot({ p, className = "", sizes = "100vw", alt = "" }: { p: Proj; className?: string; sizes?: string; alt?: string }) {
  const s = SITE_SHOTS[p.slug];
  if (!s) return null;
  return <Shot className={className} base={`/media/sites/${p.slug}-desktop`} widths={[960, 1920]} w={s.desktop.w} h={s.desktop.h} sizes={sizes} alt={alt} />;
}

/** "Visit live site ↗" link. */
export function VisitLink({ p, className = "" }: { p: Proj; className?: string }) {
  return (
    <a className={`sp-visit ${className}`} href={p.url} target="_blank" rel="noopener noreferrer">
      Visit live site
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
