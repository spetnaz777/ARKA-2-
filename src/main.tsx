import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App url={window.location.pathname} />
  </StrictMode>
);

// Every route ships prerendered HTML; hydrate it. Fall back to a fresh render
// if the page was served without markup (e.g. the dev server).
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
