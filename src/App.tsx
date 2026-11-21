import React, { useEffect, useRef } from "react";
import { RouterProvider, useRouter } from "./lib/router";
import { canonical, metaFor } from "./lib/seo";
import { Footer, Header } from "./components/layout";
import { Gate } from "./components/Gate";
import { CursorCrosshair, useMagnetic } from "./components/fx";
import Home from "./pages/Home";
import { About, CaseStudy, Contact, NotFound, Privacy, ServicePage, ServicesOverview, Terms, Work } from "./pages/pages";
import { PROJECTS, SERVICES } from "./content/site";

export function resolve(path: string): { el: React.ReactNode; found: boolean } {
  if (path === "/") return { el: <Home />, found: true };
  if (path === "/services") return { el: <ServicesOverview />, found: true };
  const svc = path.match(/^\/services\/([a-z-]+)$/);
  if (svc && SERVICES.some((s) => s.slug === svc[1])) return { el: <ServicePage slug={svc[1]} />, found: true };
  if (path === "/work") return { el: <Work />, found: true };
  const cs = path.match(/^\/work\/([a-z-]+)$/);
  if (cs && PROJECTS.some((p) => p.slug === cs[1])) return { el: <CaseStudy slug={cs[1]} />, found: true };
  if (path === "/about") return { el: <About />, found: true };
  if (path === "/contact") return { el: <Contact />, found: true };
  if (path === "/privacy") return { el: <Privacy />, found: true };
  if (path === "/terms") return { el: <Terms />, found: true };
  return { el: <NotFound />, found: false };
}

/* Keeps <title>, description, canonical and OG tags in sync after client
   navigation (the initial HTML for every route is prerendered with them). */
function useHeadSync(path: string, found: boolean) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const m = found ? metaFor(path) : metaFor("/404");
    document.title = m.title;
    const set = (sel: string, attr: string, val: string) => document.head.querySelector(sel)?.setAttribute(attr, val);
    set('meta[name="description"]', "content", m.description);
    set('meta[property="og:title"]', "content", m.title);
    set('meta[property="og:description"]', "content", m.description);
    set('meta[property="og:url"]', "content", canonical(path));
    set('meta[name="twitter:title"]', "content", m.title);
    set('meta[name="twitter:description"]', "content", m.description);
    set('link[rel="canonical"]', "href", canonical(path));
    // move focus to the new page heading for screen-reader and keyboard users
    const h1 = document.querySelector<HTMLElement>("main h1");
    if (h1) {
      h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    }
  }, [path, found]);
}

function Shell() {
  const { path } = useRouter();
  const { el, found } = resolve(path);
  useHeadSync(path, found);
  useMagnetic();
  return (
    <>
    <Gate />
    <div className="site">
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main" key={path}>
        {el}
      </main>
      <Footer />
    </div>
    <CursorCrosshair />
    </>
  );
}

export default function App({ url }: { url: string }) {
  return (
    <RouterProvider initialPath={url}>
      <Shell />
    </RouterProvider>
  );
}
