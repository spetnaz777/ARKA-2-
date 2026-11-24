import { flushSync } from "react-dom";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* Tiny history-API router. Every route is also prerendered to static HTML at
   build time (scripts/prerender.mjs), so this only takes over navigation after
   hydration — links stay real <a href> elements and work without JS. */

type RouterCtx = { path: string; navigate: (to: string) => void };
const Ctx = createContext<RouterCtx>({ path: "/", navigate: () => {} });

export function normalize(p: string) {
  const clean = p.split(/[?#]/)[0] || "/";
  return clean.length > 1 ? clean.replace(/\/+$/, "") : "/";
}

export function RouterProvider({
  initialPath,
  children,
}: {
  initialPath: string;
  children: React.ReactNode;
}) {
  const [path, setPath] = useState(normalize(initialPath));

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.href);
    const next = normalize(url.pathname);
    window.history.pushState({}, "", url.pathname + url.search + url.hash);
    const commit = () => {
      setPath(next);
      if (!url.hash) window.scrollTo(0, 0);
    };
    // smooth page-to-page transition where supported (View Transitions API)
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(() => flushSync(commit));
    } else commit();
    if (url.hash) {
      requestAnimationFrame(() =>
        document.getElementById(url.hash.slice(1))?.scrollIntoView(),
      );
    }
  }, []);

  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useRouter = () => useContext(Ctx);

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
};

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const external = /^(https?:|mailto:|tel:)/.test(to) || to.startsWith("/blog/");
  return (
    <a
      href={to}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (
          external ||
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          rest.target === "_blank"
        )
          return;
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
