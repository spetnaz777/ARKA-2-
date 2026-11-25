import React, { useRef, useState } from "react";
import { SERVICES, SITE } from "../content/site";
import { Button } from "./ui";
import { Link } from "../lib/router";

/* Contact form. Validated in the browser for fast feedback and again on the
   server (/api/contact). Success is only shown when the server confirms the
   message was delivered; if delivery isn't configured the visitor is told so
   and given the direct email address instead. */

type Fields = {
  name: string;
  email: string;
  company: string;
  services: string[];
  details: string;
  budget: string;
  timeline: string;
  consent: boolean;
  website: string; // honeypot
};

const EMPTY: Fields = { name: "", email: "", company: "", services: [], details: "", budget: "", timeline: "", consent: false, website: "" };

export const BUDGETS = ["Under $5k", "$5k – $15k", "$15k – $50k", "$50k+", "Not sure yet"];
export const TIMELINES = ["As soon as possible", "Within 1–3 months", "3–6 months", "Just exploring"];

export function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (f.services.length === 0) e.services = "Choose at least one service.";
  if (f.details.trim().length < 20) e.details = "Tell us a little more (at least 20 characters).";
  if (f.details.length > 5000) e.details = "Please keep project details under 5,000 characters.";
  if (!f.consent) e.consent = "Please confirm we may contact you about your enquiry.";
  return e;
}

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; ticket?: string } | { kind: "error"; msg: string };

export function ContactForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const summary = useRef<HTMLDivElement>(null);
  const started = useRef(Date.now());

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status.kind === "sending") return;
    const e = validate(f);
    setErrors(e);
    const firstKey = Object.keys(e)[0];
    if (firstKey) {
      const target = document.getElementById(`cf-${firstKey}`) as HTMLElement | null;
      target?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...f, elapsedMs: Date.now() - started.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; ticket?: string; error?: string; fields?: Record<string, string> };
      if (res.ok && data.ok) {
        setStatus({ kind: "sent", ticket: data.ticket });
        setF(EMPTY);
      } else {
        if (data.fields) setErrors(data.fields as typeof errors);
        setStatus({ kind: "error", msg: data.error || "Your message could not be sent." });
        requestAnimationFrame(() => summary.current?.focus());
      }
    } catch {
      setStatus({ kind: "error", msg: "Network error — your message was not sent." });
      requestAnimationFrame(() => summary.current?.focus());
    }
  };

  if (status.kind === "sent") {
    return (
      <div className="form-success chamfer chamfer--raised" role="status" tabIndex={-1}>
        <p className="label"><span>Received</span></p>
        <h2 className="h-card">Thank you — your message has been delivered.</h2>
        {status.ticket && <p>Your reference is <strong>{status.ticket}</strong>. A confirmation is on its way to your inbox.</p>}
        <p>We’ll reply to the email address you provided, usually within one business day. If it’s urgent, write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        <button type="button" className="textlink" onClick={() => setStatus({ kind: "idle" })}>Send another message</button>
      </div>
    );
  }

  const err = (k: keyof Fields) =>
    errors[k] ? (
      <p className="field__err" id={`cf-${k}-err`}>
        {errors[k]}
      </p>
    ) : null;
  const desc = (k: keyof Fields) => (errors[k] ? `cf-${k}-err` : undefined);

  return (
    <form className="cform" noValidate onSubmit={submit} aria-describedby="cf-required-note">
      <p id="cf-required-note" className="cform__note">Fields marked * are required.</p>

      {status.kind === "error" && (
        <div ref={summary} tabIndex={-1} className="form-alert" role="alert">
          <strong>Message not sent.</strong> {status.msg}{" "}
          You can email us directly at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </div>
      )}

      <div className="cform__row">
        <div className={`field ${errors.name ? "has-err" : ""}`}>
          <label htmlFor="cf-name">Name *</label>
          <input id="cf-name" name="name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={desc("name")} required maxLength={120} />
          {err("name")}
        </div>
        <div className={`field ${errors.email ? "has-err" : ""}`}>
          <label htmlFor="cf-email">Business email *</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={desc("email")} required maxLength={200} />
          {err("email")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" autoComplete="organization" value={f.company} onChange={(e) => set("company", e.target.value)} maxLength={160} />
      </div>

      <fieldset className={`field field--group ${errors.services ? "has-err" : ""}`} aria-describedby={desc("services")}>
        <legend>Service(s) *</legend>
        <div className="checks" id="cf-services" tabIndex={-1}>
          {SERVICES.map((s) => {
            const on = f.services.includes(s.name);
            return (
              <label key={s.slug} className={`check chamfer ${on ? "chamfer--ink is-on" : "chamfer--raised"}`} style={{ ["--cut" as string]: "8px" }}>
                <input
                  type="checkbox"
                  name="services"
                  value={s.name}
                  checked={on}
                  onChange={() => set("services", on ? f.services.filter((x) => x !== s.name) : [...f.services, s.name])}
                />
                <span>{s.name}</span>
              </label>
            );
          })}
        </div>
        {err("services")}
      </fieldset>

      <div className={`field ${errors.details ? "has-err" : ""}`}>
        <label htmlFor="cf-details">Project details *</label>
        <textarea id="cf-details" name="details" rows={6} value={f.details} onChange={(e) => set("details", e.target.value)} aria-invalid={!!errors.details} aria-describedby={desc("details")} required maxLength={5000} placeholder="What are you building, what’s slowing you down, and what would success look like?" />
        {err("details")}
      </div>

      <div className="cform__row">
        <div className="field">
          <label htmlFor="cf-budget">Budget (optional)</label>
          <select id="cf-budget" name="budget" value={f.budget} onChange={(e) => set("budget", e.target.value)}>
            <option value="">Select…</option>
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cf-timeline">Timeline (optional)</label>
          <select id="cf-timeline" name="timeline" value={f.timeline} onChange={(e) => set("timeline", e.target.value)}>
            <option value="">Select…</option>
            {TIMELINES.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* honeypot: hidden from people and assistive tech */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div className={`field field--consent ${errors.consent ? "has-err" : ""}`}>
        <label className="consent" htmlFor="cf-consent">
          <input id="cf-consent" type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={desc("consent")} />
          <span>
            I agree that ARKA may use these details to respond to my enquiry, as described in the{" "}
            <Link to="/privacy">privacy policy</Link>. *
          </span>
        </label>
        {err("consent")}
      </div>

      <div className="cform__submit">
        <Button type="submit" variant="primary" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send Message"}
        </Button>
        <span className="sr-only" aria-live="polite">{status.kind === "sending" ? "Sending your message" : ""}</span>
      </div>
    </form>
  );
}
