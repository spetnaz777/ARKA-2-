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
- Fonts — see "Typography" below.
- Moon / small sphere: `public/media/moon-*.{avif,webp}`, `sphere-260.webp` — procedurally generated, no external imagery (`python3 scripts/assets/generate-moon.py out.png 1600`).
- Terrain: `public/media/terrain-*.{avif,webp}` — derived from the existing `public/services-hero-poster.jpg` (`scripts/assets/derive-terrain.py`).
- Contour waves, orbital arcs and circuitry are SVG drawn in code.

## Legal

`/privacy` and `/terms` are drafts and are labelled as such on the page. They need review before being relied on.

## Typography

| Role | Face | Settings |
|---|---|---|
| Display (h1/h2, banner, slide & card titles, stats) | **Saira** (OFL) | `font-stretch: 112%` (semi-expanded), weight 300, tracking −0.02…−0.028em; true italic for the accent ("Digital Growth.") |
| Body, UI, buttons | **Saira** | normal width (100%), weight 400; sub-heads at 106% / 550 |
| Labels, indices, coordinates, nav micro-text | **Geist Mono** (OFL) | 10.5–12px, uppercase, +0.09–0.14em |
| Wordmark only | Anurati (existing) | live-site treatment |

Why: specimens of Saira, Chakra Petch, Sora, Space Grotesk and Michroma/Exo were set on the real hero, a service card and a body paragraph (`redesign-qa/fonts/`). Saira's width axis gives a wide, engineered display voice that reads as futuristic without the gimmick of Michroma or the squared terminals of Chakra Petch, keeps a true italic for the accent (Sora/Space Grotesk have none), and the same family at normal width is clean and highly readable for body copy — one file family, one voice.

Delivery: `public/fonts/saira-latin.woff2` (variable wght 300–650 × wdth 100–112, latin subset, 36 KB, preloaded) and `saira-italic-latin.woff2` (wght 300–400 at wdth 112, 18 KB), produced with fontTools `instancer` + `pyftsubset` from the upstream variable font. A metric-adjusted Arial fallback (`Saira Fallback`) keeps the swap shift-free.

## Signature linework

Continuous left/right rails run through every section (header → footer) with `SYS.0n` indices; 45° frames, signal nodes, one signal-red pulse per view (hero spine), mono readouts (`N 43.65° / W 79.38°`), tick rulers, registration crosshairs, HUD corner brackets and a faint grid/scanline texture. All decorative SVG/HTML is `aria-hidden`, `pointer-events: none`, never crosses text, and is static under `prefers-reduced-motion`.

## Existing media in the design

Re-graded derivatives (grayscale, raised exposure) of the site's own assets in `public/media/`:

| Asset | Used in |
|---|---|
| `deep-black-hero.jpg` → `pale-deep-black-hero-*` | home hero depth (horizon band), Work page hero |
| `img-hall.jpg` (= section-bg / solutions-bg) | Royal Caspian slide/card, Technology Consulting hero |
| `img-concrete.jpg` | Healexa slide/card, Services overview hero |
| `img-monolith.jpg` | Mehri Noshad slide/card, Digital Marketing hero, About page hero |
| `img-space.jpg` | Six Side slide/card, AI Solutions hero |
| `img-corridor.jpg` | Web Development hero |
| `rocket-hangar.jpg` | Noctavius Aviation slide/card |
| `services-hero-mobile.mp4` → `terrain-loop.{webm,mp4}` | home About panel (muted loop) |
| `landing-bg.mp4` → `horizon-loop.{webm,mp4}` | contact banner (muted loop) |
| `deep-black-hero-1280.jpg` → `gate-*` | entry gate backdrop |

Videos are muted, `preload="none"`, start only on screen, pause off screen, and stay on their poster under reduced motion or Save-Data. Regenerate with the ffmpeg/ImageMagick commands in `scripts/assets/README.md`.
