/* POST /api/contact — Vercel Function (Node runtime, Web Request/Response).

   Server-side validation, honeypot + minimum fill time, best-effort per-IP
   rate limiting, and delivery through Resend's HTTP API. Requires:
     RESEND_API_KEY  — Resend API key
     CONTACT_TO      — inbox that receives enquiries
     CONTACT_FROM    — verified sender, e.g. "ARKA Website <web@arkalegion.com>"
   If any are missing the function returns 503 and the form shows an honest
   "not sent" message with the direct email address. It never fakes success. */

const SERVICES = ["AI Solutions", "Web & Software Development", "Digital Marketing", "Technology Consulting"];
const BUDGETS = ["", "Under $5k", "$5k – $15k", "$15k – $50k", "$50k+", "Not sure yet"];
const TIMELINES = ["", "As soon as possible", "Within 1–3 months", "3–6 months", "Just exploring"];

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>(); // per warm instance; best-effort only

type Body = Record<string, unknown>;

const json = (status: number, data: object) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function validateBody(b: Body) {
  const fields: Record<string, string> = {};
  const name = str(b.name, 120);
  const email = str(b.email, 200);
  const company = str(b.company, 160);
  const details = typeof b.details === "string" ? b.details.trim() : "";
  const services = Array.isArray(b.services) ? b.services.filter((s): s is string => typeof s === "string") : [];
  const budget = str(b.budget, 40);
  const timeline = str(b.timeline, 40);

  if (name.length < 2) fields.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || /[\r\n]/.test(email)) fields.email = "Please enter a valid email address.";
  if (!services.length || services.some((s) => !SERVICES.includes(s))) fields.services = "Choose at least one service.";
  if (details.length < 20) fields.details = "Tell us a little more (at least 20 characters).";
  if (details.length > 5000) fields.details = "Please keep project details under 5,000 characters.";
  if (!BUDGETS.includes(budget)) fields.budget = "Invalid budget option.";
  if (!TIMELINES.includes(timeline)) fields.timeline = "Invalid timeline option.";
  if (b.consent !== true) fields.consent = "Please confirm we may contact you about your enquiry.";

  return { ok: Object.keys(fields).length === 0, fields, data: { name, email, company, details, services, budget, timeline } };
}

function rateLimited(ip: string, now = Date.now()) {
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

export async function POST(request: Request): Promise<Response> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) return json(415, { ok: false, error: "Unsupported content type." });

  const len = Number(request.headers.get("content-length") ?? 0);
  if (len > 20_000) return json(413, { ok: false, error: "Message is too large." });

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return json(429, { ok: false, error: "Too many messages from this connection. Please try again later or email us directly." });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json(400, { ok: false, error: "Invalid request." });
  }

  // Spam traps: filled honeypot or a form submitted faster than a human can.
  // Respond like a validation failure (not a fake success) and send nothing.
  if (str(body.website, 200) || (typeof body.elapsedMs === "number" && body.elapsedMs < 2500)) {
    return json(400, { ok: false, error: "Your message could not be verified. Please try again." });
  }

  const v = validateBody(body);
  if (!v.ok) return json(422, { ok: false, error: "Please correct the highlighted fields.", fields: v.fields });

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.error("contact: delivery not configured (RESEND_API_KEY / CONTACT_TO / CONTACT_FROM missing)");
    return json(503, { ok: false, error: "Online enquiries are temporarily unavailable, so your message was not sent." });
  }

  const d = v.data;
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Company", d.company || "—"],
    ["Services", d.services.join(", ")],
    ["Budget", d.budget || "—"],
    ["Timeline", d.timeline || "—"],
  ];
  const text = `${rows.map(([k, val]) => `${k}: ${val}`).join("\n")}\n\nProject details:\n${d.details}\n`;
  const html =
    `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
      .map(([k, val]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(val)}</td></tr>`)
      .join("")}</table><p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(d.details)}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: CONTACT_TO.split(",").map((s) => s.trim()),
        reply_to: d.email,
        subject: `New ARKA enquiry — ${d.name.replace(/[\r\n]/g, " ")}`,
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error("contact: resend error", res.status, await res.text().catch(() => ""));
      return json(502, { ok: false, error: "Our email service didn't accept the message, so it was not sent." });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error("contact: delivery failed", err);
    return json(502, { ok: false, error: "Delivery failed, so your message was not sent." });
  }
}

export function GET(): Response {
  return json(405, { ok: false, error: "Method not allowed." });
}
