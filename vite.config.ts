import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

/* `vite preview` normally falls back to index.html for every path. Make it
   behave like the Vercel deployment instead: serve each prerendered
   <route>/index.html, and the real 404.html (with a 404 status) otherwise. */
function vercelLikePreview(): Plugin {
  return {
    name: "arka-vercel-like-preview",
    configurePreviewServer(server) {
      const dist = path.resolve(__dirname, "dist");
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? "/").split("?")[0];
        if (path.extname(url)) return next();
        const clean = url.replace(/\/+$/, "") || "/";
        const file = path.join(dist, clean, "index.html");
        if (fs.existsSync(file)) {
          req.url = (clean === "/" ? "" : clean) + "/index.html";
          return next();
        }
        if (fs.existsSync(path.join(dist, clean + ".html"))) {
          req.url = clean + ".html"; // cleanUrls, e.g. /blog/<slug>
          return next();
        }
        if (url.startsWith("/api/")) return next();
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(fs.readFileSync(path.join(dist, "404.html")));
      });
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), vercelLikePreview()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  build: { target: "es2020", cssCodeSplit: false, copyPublicDir: !isSsrBuild },
}));
