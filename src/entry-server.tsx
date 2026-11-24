import { renderToString } from "react-dom/server";
import App from "./App";

export { ROUTES, NOT_FOUND, canonical } from "./lib/seo";
export { POSTS } from "./content/growth";

export function render(url: string) {
  return renderToString(<App url={url} />);
}
