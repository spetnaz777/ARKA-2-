/* POST /api/contact — Vercel Function (Node runtime, Web Request/Response).

   Server-side validation, honeypot + minimum fill time, best-effort per-IP
   rate limiting, and delivery through Resend's HTTP API. Requires:
     RESEND_API_KEY  — Resend API key
     CONTACT_TO      — inbox that receives enquiries
     CONTACT_FROM    — verified sender, e.g. "ARKA <hello@mail.arkalegion.com>"
     CONTACT_REPLY_TO — optional; where visitors' replies go (default arka.secops@gmail.com)
   Sends the enquiry to the team (must succeed) and a confirmation with a ticket
   reference to the visitor (best effort).
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
  const ticket = makeTicket();
  const replyTo = process.env.CONTACT_REPLY_TO || "arka.secops@gmail.com";
  const rows: [string, string][] = [
    ["Ticket", ticket],
    ["Name", d.name],
    ["Email", d.email],
    ["Company", d.company || "—"],
    ["Services", d.services.join(", ")],
    ["Budget", d.budget || "—"],
    ["Timeline", d.timeline || "—"],
  ];

  // 1) The enquiry to ARKA. This one must land, or the visitor is told it was not sent.
  const team = await send(RESEND_API_KEY, {
    from: CONTACT_FROM,
    to: CONTACT_TO.split(",").map((s) => s.trim()),
    reply_to: d.email,
    subject: `New enquiry ${ticket} · ${d.name.replace(/[\r\n]/g, " ")} · ${d.services.join(", ")}`,
    text: `${rows.map(([k, val]) => `${k}: ${val}`).join("\n")}\n\nProject details:\n${d.details}\n`,
    html: teamHtml(rows, d.details),
    headers: { "X-Entity-Ref-ID": ticket },
  });
  if (!team.ok) {
    console.error("contact: resend error (team)", team.status, team.body);
    return json(502, { ok: false, error: "Our email service didn't accept the message, so it was not sent." });
  }

  // 2) Confirmation to the visitor. Nice to have: the enquiry already reached us.
  const first = d.name.split(/\s+/)[0];
  const visitor = await send(RESEND_API_KEY, {
    from: CONTACT_FROM,
    to: [d.email],
    reply_to: replyTo,
    subject: `We received your enquiry · ${ticket}`,
    text: `Hi ${first},\n\nThanks for reaching out to ARKA. Your enquiry is in, reference ${ticket}. A member of our team will reply within one business day.\n\nWhat you sent:\n${rows.slice(3).map(([k, val]) => `${k}: ${val}`).join("\n")}\n\n${d.details}\n\nReply to this email if you want to add anything.\n\nARKA · AI, Software & Digital Growth · https://www.arkalegion.com\n`,
    html: visitorHtml(first, ticket, rows.slice(3), d.details),
    headers: { "X-Entity-Ref-ID": `${ticket}-c` },
  });
  if (!visitor.ok) console.error("contact: confirmation to visitor failed (team copy delivered)", visitor.status, visitor.body);

  return json(200, { ok: true, ticket });
}

/* ── helpers ─────────────────────────────────────────────────────────── */

function makeTicket(now = new Date()) {
  const y = String(now.getUTCFullYear()).slice(2);
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(3)), (b) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");
  return `ARK-${y}${m}${day}-${rand}`;
}

async function send(key: string, payload: Record<string, unknown>) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, status: res.status, body: res.ok ? "" : await res.text().catch(() => "") };
  } catch (err) {
    return { ok: false, status: 0, body: String(err) };
  }
}

const FONT = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Inter','Segoe UI',Helvetica,Arial,sans-serif";

function shell(inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#f5f5f7;padding:32px 12px;font-family:${FONT};color:#111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e5e5ea">
<tr><td style="background:#05060a;padding:26px 32px;color:#f5f5f7;font-size:13px;letter-spacing:0.32em;font-weight:600">A R K A</td></tr>
<tr><td style="padding:32px">${inner}</td></tr>
<tr><td style="padding:18px 32px;border-top:1px solid #eee;font-size:12px;color:#86868b">ARKA · AI, Software &amp; Digital Growth · <a href="https://www.arkalegion.com" style="color:#86868b">arkalegion.com</a></td></tr>
</table></td></tr></table></body></html>`;
}

function rowsHtml(rows: [string, string][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse">${rows
    .map(([k, val]) => `<tr><td style="padding:9px 0;border-bottom:1px solid #f0f0f2;color:#86868b;width:120px;vertical-align:top">${k}</td><td style="padding:9px 0;border-bottom:1px solid #f0f0f2">${escapeHtml(val)}</td></tr>`)
    .join("")}</table>`;
}

function teamHtml(rows: [string, string][], details: string) {
  return shell(`<p style="margin:0 0 6px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#86868b">New website enquiry</p>
<h1 style="margin:0 0 22px;font-size:24px;font-weight:600;letter-spacing:-0.02em">${escapeHtml(rows[1][1])}</h1>
${rowsHtml(rows)}
<p style="margin:22px 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#86868b">Project details</p>
<p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(details)}</p>
<p style="margin:26px 0 0;font-size:13px;color:#86868b">Reply to this email to answer ${escapeHtml(rows[1][1])} directly.</p>`);
}

function visitorHtml(first: string, ticket: string, rows: [string, string][], details: string) {
  return shell(`<h1 style="margin:0 0 14px;font-size:26px;font-weight:600;letter-spacing:-0.02em">Thanks, ${escapeHtml(first)}.</h1>
<p style="margin:0 0 18px;font-size:16px;line-height:1.6">Your enquiry is in. A member of the ARKA team will reply within one business day.</p>
<p style="margin:0 0 24px;display:inline-block;background:#f5f5f7;border-radius:999px;padding:8px 16px;font-size:13px;letter-spacing:0.06em">Reference <strong>${ticket}</strong></p>
<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#86868b">What you sent</p>
${rowsHtml(rows)}
<p style="margin:18px 0 0;font-size:15px;line-height:1.6;white-space:pre-wrap;color:#3a3a3c">${escapeHtml(details)}</p>
<p style="margin:26px 0 0;font-size:14px;color:#3a3a3c">Want to add something? Just reply to this email.</p>`);
}

export function GET(): Response {
  return json(405, { ok: false, error: "Method not allowed." });
}
