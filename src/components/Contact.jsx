import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { SplitReveal } from "./Reveal.jsx";
import { Arrow } from "./Hero.jsx";

const CtaScene = lazy(() => import("../three/CtaScene.jsx"));

// Placeholder contact details; replace before launch.
export const STUDIO = { email: "hello@lumen.ge", city: "Tbilisi, Georgia" };
// Set VITE_FORM_ENDPOINT (e.g. a Formspree URL) in .env to receive submissions.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isPhone = (v) => /^[+()\d\s.-]+$/.test(v) && v.replace(/\D/g, "").length >= 7;

function validate(data, c) {
  const errs = {};
  const name = String(data.get("name") || "").trim();
  const contact = String(data.get("contact") || "").trim();
  const message = String(data.get("message") || "").trim();
  if (!name) errs.name = c.errName;
  if (!contact) errs.contact = c.errContact;
  else if (!EMAIL.test(contact) && !isPhone(contact)) errs.contact = c.errContactBad;
  if (!message) errs.message = c.errMessage;
  return errs;
}

function Field({ name, label, error, children, hint }) {
  return (
    <label className={`fld${error ? " has-error" : ""}`}>
      <span className="fld-label">{label}{hint && <em>{hint}</em>}</span>
      {children}
      <span className="fld-error" id={`${name}-err`} aria-live="polite">{error}</span>
    </label>
  );
}

export default function Contact({ brief }) {
  const { t, lang } = useI18n();
  const c = t.contact;
  const form = useRef();
  const msg = useRef();
  const [errors, setErrors] = useState({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState({ kind: "", text: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!brief) return;
    setSent(false);
    requestAnimationFrame(() => {
      if (!msg.current) return;
      msg.current.value = brief.text;
      setTimeout(() => {
        msg.current?.focus({ preventScroll: true });
        msg.current?.setSelectionRange(brief.text.length, brief.text.length);
      }, 1200);
    });
  }, [brief]);

  // After the first attempt, errors clear as soon as a field is fixed.
  const recheck = () => { if (tried) setErrors(validate(new FormData(form.current), c)); };

  const submit = async (e) => {
    e.preventDefault();
    const el = e.currentTarget;
    const data = new FormData(el);
    const errs = validate(data, c);
    setTried(true);
    setErrors(errs);
    const bad = Object.keys(errs);
    if (bad.length) {
      setStatus({ kind: "err", text: c.err });
      el.elements[bad[0]].focus();
      return;
    }

    setBusy(true);
    setStatus({ kind: "", text: "" });

    // 1. The studio's own backend (MongoDB). Anything but a clear answer falls through to 2.
    const fields = Object.fromEntries(data);
    const estimate = brief && String(fields.message).startsWith(t.briefIntro) ? brief.estimate : null;
    let res = null;
    try {
      res = await fetch("/api/inquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, lang, estimate }),
      });
    } catch {}
    if (res?.status === 201) {
      el.reset(); setTried(false); setSent(true); setBusy(false);
      setStatus({ kind: "ok", text: c.ok });
      return;
    }
    if (res?.status === 400) {
      const body = await res.json().catch(() => ({}));
      const map = { name: c.errName, contact: body.fields?.contact === "invalid" ? c.errContactBad : c.errContact, message: c.errMessage };
      setErrors(Object.fromEntries(Object.keys(body.fields || {}).map((k) => [k, map[k]])));
      setStatus({ kind: "err", text: c.err }); setBusy(false);
      return;
    }
    if (res?.status === 429) {
      setStatus({ kind: "err", text: `${c.tooMany} ${STUDIO.email}` }); setBusy(false);
      return;
    }

    // 2. Fallbacks while the backend is not connected: Formspree if configured, else the visitor's mail app.
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.statusText);
        setSent(true);
        setStatus({ kind: "ok", text: c.ok });
      } else {
        const body = `${data.get("message")}\n\n${data.get("name")} · ${data.get("contact")} · ${data.get("business") || ""}`;
        setStatus({ kind: "ok", text: c.mailOpened });
        location.href = `mailto:${STUDIO.email}?subject=${encodeURIComponent("LUMEN — " + data.get("name"))}&body=${encodeURIComponent(body)}`;
      }
      el.reset();
      setTried(false);
    } catch {
      setStatus({ kind: "err", text: `${c.fail} ${STUDIO.email}` });
    } finally {
      setBusy(false);
    }
  };

  const aria = (k) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <section className="contact" id="contact">
      <div className="contact-stage">
        <Suspense fallback={null}><CtaScene /></Suspense>
        <div className="contact-title wrap">
          <SplitReveal as="h2" className="display" text={c.title[0]} />
          <SplitReveal as="p" className="display display-dim" text={c.title[1]} delay={0.08} />
        </div>
      </div>
      <div className="contact-body wrap">
        <div className="contact-info">
          <p className="lead">{c.sub}</p>
          <dl>
            <div><dt>{c.write}</dt><dd><a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a></dd></div>
            <div><dt>{c.visit}</dt><dd>{STUDIO.city}</dd></div>
          </dl>
        </div>

        {sent ? (
          <div className="form-done" role="status">
            <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M15 24.5l6 6 12-13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <p className="form-done-title">{c.okTitle}</p>
            <p className="lead">{c.ok}</p>
            <button type="button" className="btn btn-line" onClick={() => { setSent(false); setStatus({ kind: "", text: "" }); }}>{c.again}</button>
          </div>
        ) : (
          <form className="form" id="contact-form" ref={form} onSubmit={submit} onInput={recheck} noValidate>
            <div className="form-row">
              <Field name="name" label={c.name} error={errors.name}>
                <input name="name" autoComplete="name" required {...aria("name")} />
              </Field>
              <Field name="contact" label={c.email} error={errors.contact}>
                <input name="contact" autoComplete="email" inputMode="email" required {...aria("contact")} />
              </Field>
            </div>
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <Field name="business" label={c.business} hint={c.optional}>
              <input name="business" autoComplete="organization" />
            </Field>
            <Field name="message" label={c.message} error={errors.message}>
              <textarea name="message" ref={msg} rows="7" required {...aria("message")} />
            </Field>
            <div className="form-end">
              <button className="btn btn-flare" type="submit" disabled={busy} aria-busy={busy}>
                {busy ? c.sending : c.send}<Arrow />
              </button>
              <p className={`form-status ${status.kind}`} role="status">{status.text}</p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
