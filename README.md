# ARKA — arkalegion.com

AI, Software & Digital Growth. Marketing site for ARKA, built with React 19 + Vite 6 + Tailwind v4 (light use) + TypeScript, deployed on Vercel.

## Commands

```bash
npm install
npm run dev        # dev server on :3000 (client-rendered)
npm run build      # client build → SSR build → prerender every route into dist/
npm run preview    # serves dist/ like Vercel (per-route HTML, real 404)
npm run typecheck  # tsc --noEmit
```

## How it fits together

- `src/content/site.ts` — all copy: services, projects, process, facts. Only verified claims; no invented metrics, clients or social accounts.
- `src/lib/seo.ts` — per-route title/description/JSON-LD + sitemap priorities. Add a route here **and** in `resolve()` in `src/App.tsx`.
- `scripts/prerender.mjs` — renders each route to `dist/<route>/index.html` with its own meta, writes `dist/404.html` and `dist/sitemap.xml` (routes + `public/blog/*.html`). The build fails if any page is missing its title or markup.
- `src/lib/router.tsx` — tiny history router; links are real `<a href>` so the site works without JS.
- `src/components/graphics.tsx` — signature graphics: `CircuitFrame`, `CircuitTrace`, `SignalNode`, `OrbitalArc`, `DotMatrix`, `Hatch`, `Barcode`, `TechnicalDivider`, `ContourPattern`, `ChamferedPanel`. Frames use anchor notation (`l|c|r|L|R ± px`, `t|b ± px`) so 45° geometry stays exact at every width.
- `src/index.css` — design tokens (`--surface #F3F4F6`, `--ink #111`, …), chamfer system, layout and motion. Easing `cubic-bezier(0.22,1,0.36,1)`; everything is static under `prefers-reduced-motion`.
- `api/contact.ts` — Vercel Function for the contact form (validation, honeypot, timing check, per-IP rate limit, Resend delivery).
- `public/blog/` — existing static articles, served at `/blog/<slug>` via `cleanUrls`.

## Contact form configuration

Copy `.env.example` and set in Vercel: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` (a sender on a domain verified in Resend). Until they are set the form returns an honest "not sent" error with the direct email address.

## Brand assets & imagery

- Logo: original mark (`public/arka-logo.svg`, `src/components/Logo.tsx`) + "ARKA" set in Anurati — the live site's treatment. `public/fonts/anurati-arka.woff2` is a glyph subset of the existing `Anurati-Regular.otf`.
- Fonts: Instrument Sans (OFL) for text, Geist Mono (OFL) for labels, self-hosted woff2.
- Moon / small sphere: `public/media/moon-*.{avif,webp}`, `sphere-260.webp` — procedurally generated, no external imagery (`python3 scripts/assets/generate-moon.py out.png 1600`).
- Terrain: `public/media/terrain-*.{avif,webp}` — derived from the existing `public/services-hero-poster.jpg` (`scripts/assets/derive-terrain.py`).
- Contour waves, orbital arcs and circuitry are SVG drawn in code.

## Legal

`/privacy` and `/terms` are drafts and are labelled as such on the page. They need review before being relied on.
