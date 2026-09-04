import React from "react";
import {
  siHubspot,
  siStripe,
  siShopify,
  siNotion,
  siAirtable,
  siZapier,
  siMake,
  siN8n,
  siAnthropic,
  siGmail,
  siGooglesheets,
  siGooglecalendar,
  siGoogledrive,
  siCalendly,
  siWhatsapp,
  siVercel,
} from "simple-icons";

/* ============================================================
   MarqueeLogoScroller — infinite, hover-to-pause logo marquee.

   Adapted to the ARKA design system (void black, hairline
   borders, Michroma micro-labels, monochrome brand marks that
   light up on hover) rather than the shadcn theme tokens the
   original shipped with. Self-contained: its keyframes live in
   an inline <style>, no tailwind.config changes needed.
   ============================================================ */

type SimpleIcon = { title: string; path: string };

// Real brand marks (simple-icons). Names here are the lookup keys.
const MARKS: Record<string, SimpleIcon> = {
  HubSpot: siHubspot,
  Stripe: siStripe,
  Shopify: siShopify,
  Notion: siNotion,
  Airtable: siAirtable,
  Zapier: siZapier,
  Make: siMake,
  n8n: siN8n,
  Anthropic: siAnthropic,
  Gmail: siGmail,
  "Google Sheets": siGooglesheets,
  "Google Calendar": siGooglecalendar,
  "Google Drive": siGoogledrive,
  Calendly: siCalendly,
  WhatsApp: siWhatsapp,
  Vercel: siVercel,
};

export interface MarqueeLogo {
  /** Lookup key into the brand-mark set (e.g. "HubSpot"). */
  name: string;
  /** Optional caption override; defaults to `name`. */
  label?: string;
}

interface MarqueeLogoScrollerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  logos: MarqueeLogo[];
  speed?: "normal" | "slow" | "fast";
}

const DURATION = { normal: "46s", slow: "80s", fast: "24s" } as const;

const MarqueeLogoScroller = React.forwardRef<
  HTMLDivElement,
  MarqueeLogoScrollerProps
>(
  (
    { title, description, logos, speed = "normal", className = "", ...props },
    ref,
  ) => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // duplicate the set so the -50% translate loops seamlessly
    const row = reduce ? logos : [...logos, ...logos];

    return (
      <section
        ref={ref}
        aria-label={title}
        className={`border-y border-[#262629] bg-[#050506] overflow-hidden ${className}`}
        {...props}
      >
        <style>{`
          @keyframes arka-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>

        <div className="wrap pt-14 md:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5 lg:gap-8 pb-10 md:pb-14 border-b border-[#262629]">
            <h2
              className="u-head text-balance"
              style={{ fontSize: "clamp(1.4rem, 5vw, 2.4rem)", lineHeight: 1.1 }}
            >
              {title}
            </h2>
            <p className="body-dim text-[13px] md:text-[14px] self-start lg:justify-self-end lg:text-right max-w-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div
          className="w-full overflow-hidden py-8 md:py-10"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div
            className="flex w-max items-center gap-3 md:gap-4 hover:[animation-play-state:paused]"
            style={
              reduce
                ? { flexWrap: "wrap", justifyContent: "center" }
                : { animation: `arka-marquee ${DURATION[speed]} linear infinite` }
            }
          >
            {row.map((logo, i) => {
              const mark = MARKS[logo.name];
              return (
                <div
                  key={`${logo.name}-${i}`}
                  className="group relative h-20 w-36 md:h-24 md:w-44 shrink-0 flex flex-col items-center justify-center gap-2.5 rounded-[4px] border border-[#1b1b1e] bg-[#08080a] transition-colors duration-300 hover:border-[#3a3a3f] hover:bg-[#0c0c0e]"
                >
                  {mark ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7 md:h-8 md:w-8 text-[#6b6b72] transition-colors duration-300 group-hover:text-[#f0f0fa]"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d={mark.path} />
                    </svg>
                  ) : null}
                  <span className="u-label text-[8px] text-[#545457] transition-colors duration-300 group-hover:text-[#9a9aa2]">
                    {logo.label ?? logo.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);

MarqueeLogoScroller.displayName = "MarqueeLogoScroller";

export { MarqueeLogoScroller };
