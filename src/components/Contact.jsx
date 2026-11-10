import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { SplitReveal } from "./Reveal.jsx";
import { Arrow } from "./Hero.jsx";

const CtaScene = lazy(() => import("../three/CtaScene.jsx"));

// Placeholder contact details; replace before launch.
export const STUDIO = { email: "hello@lumen.ge", city: "Tbilisi, Georgia" };
// Set VITE_FORM_ENDPOINT (e.g. a Formspree URL) in .env to receive submissions.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;

export default function Contact({ brief }) {
  const { t } = useI18n();
  const c = t.contact;
  const msg = useRef();
  const [status, setStatus] = useState({ kind: "", text: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!brief) return;
    msg.current.value = brief;
    setTimeout(() => {
      msg.current.focus({ preventScroll: true });
      msg.current.setSelectionRange(brief.length, brief.length);
    }, 1200);
  }, [brief]);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    let ok = true;
    ["name", "contact", "message"].forEach((k) => {
      const field = form.elements[k];
      const bad = !String(data.get(k) || "").trim();
      field.setAttribute("aria-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) { setStatus({ kind: "err", text: c.err }); return; }

    setBusy(true);
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.statusText);
      } else {
        const body = `${data.get("message")}\n\n${data.get("name")} · ${data.get("contact")} · ${data.get("business") || ""}`;
        setStatus({ kind: "ok", text: c.mailOpened });
        form.reset();
        location.href = `mailto:${STUDIO.email}?subject=${encodeURIComponent("LUMEN — " + data.get("name"))}&body=${encodeURIComponent(body)}`;
        return;
      }
      setStatus({ kind: "ok", text: c.ok });
      form.reset();
    } catch {
      setStatus({ kind: "err", text: `${c.err} ${STUDIO.email}` });
    } finally {
      setBusy(false);
    }
  };

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
        <form className="form" id="contact-form" onSubmit={submit} noValidate>
          <div className="form-row">
            <label>
              <span>{c.name}</span>
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              <span>{c.email}</span>
              <input name="contact" autoComplete="email" required />
            </label>
          </div>
          <label>
            <span>{c.business}</span>
            <input name="business" autoComplete="organization" />
          </label>
          <label>
            <span>{c.message}</span>
            <textarea name="message" ref={msg} rows="7" required />
          </label>
          <button className="btn btn-bone" type="submit" disabled={busy}>
            {busy ? c.sending : c.send}<Arrow />
          </button>
          <p className={`form-status ${status.kind}`} role="status">{status.text}</p>
        </form>
      </div>
    </section>
  );
}
