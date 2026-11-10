import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { TYPES, FEATURES, PACKAGES, PER_PAGE, CARE, SPEEDS, estimate, fmt } from "../data.js";
import { gsap, reducedMotion, scrollToId } from "../scroll.js";
import { SplitReveal } from "./Reveal.jsx";
import { Arrow } from "./Hero.jsx";

function useCountUp(value) {
  const ref = useRef();
  const prev = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (reducedMotion) { el.textContent = fmt(value); prev.current = value; return; }
    const o = { v: prev.current };
    const tw = gsap.to(o, {
      v: value, duration: 0.9, ease: "expo.out",
      onUpdate: () => { el.textContent = fmt(Math.round(o.v)); },
    });
    prev.current = value;
    return () => tw.kill();
  }, [value]);
  return ref;
}

export default function Builder({ preset, onSend }) {
  const { t, lang } = useI18n();
  const b = t.builder;
  const [step, setStep] = useState(0);
  const [type, setType] = useState("business");
  const [pages, setPages] = useState(5);
  const [feats, setFeats] = useState(() => new Set(["seo"]));
  const [speed, setSpeed] = useState(1);
  const [care, setCare] = useState(false);
  const [style, setStyle] = useState(null);
  const panel = useRef();
  const sendBtn = useRef();
  const receipt = useRef();
  const [receiptOn, setReceiptOn] = useState(false);
  const steps = b.steps.length;

  // The phone price bar steps aside once the full receipt is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setReceiptOn(e.isIntersecting), { threshold: 0.2 });
    io.observe(receipt.current);
    return () => io.disconnect();
  }, []);

  const applyPackage = (key) => {
    const p = PACKAGES[key];
    setType(p.type);
    setPages(p.pages);
    setFeats(new Set(p.features));
  };

  // A style from the gallery pre-fills type and matching features; a service link adds one feature.
  useEffect(() => {
    if (!preset) return;
    if (preset.add) {
      setFeats((s) => new Set([...s, preset.add]));
      setStep(2);
      return;
    }
    const tpl = preset.style;
    setStyle(tpl);
    setType(tpl.type);
    const typ = TYPES.find((x) => x.id === tpl.type);
    setPages((p) => Math.max(p, typ.pages));
    const f = new Set(["seo"]);
    const names = tpl.features.en.join(" ").toLowerCase();
    if (names.includes("3d")) f.add("3d");
    if (names.includes("booking")) f.add("booking");
    if (names.includes("language")) f.add("lang");
    if (names.includes("cms") || names.includes("blog")) f.add("cms");
    if (names.includes("ads")) f.add("ads");
    setFeats(f);
    setStep(0);
  }, [preset]);

  const q = useMemo(() => estimate({ type, pages, feats, speed }), [type, pages, feats, speed]);
  const lines = [[q.typ.name[lang], q.typ.base]];
  if (q.extra) lines.push([`${q.extra} ${b.extra}`, q.extra * PER_PAGE]);
  q.chosen.forEach((f) => lines.push([f.name[lang], f.price]));
  if (q.rush) lines.push([b.rush, q.rush]);
  const weeks = `${q.weeks[0]}–${q.weeks[1]}`;

  const totalRef = useCountUp(q.total);
  const barRef = useCountUp(q.total);

  useLayoutEffect(() => {
    if (reducedMotion || !panel.current) return;
    const tw = gsap.fromTo(panel.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out" });
    return () => tw.kill();
  }, [step]);

  const toggle = (id) => setFeats((s) => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const goStep = (i) => setStep(Math.min(Math.max(i, 0), steps - 1));
  const review = () => {
    scrollToId("estimate");
    setTimeout(() => sendBtn.current?.focus({ preventScroll: true }), 900);
  };

  const send = () => {
    const rows = [
      t.briefIntro,
      `— ${q.typ.name[lang]}, ${pages} ${b.pagesWord}`,
      style ? `— ${b.style}: ${style.name} (${style.cat[lang]})` : null,
      q.chosen.length ? `— ${q.chosen.map((f) => f.name[lang]).join(", ")}` : null,
      `— ${b.delivery}: ${weeks} ${b.weeks} (${b.speeds[SPEEDS.indexOf(speed)]})`,
      care ? `— ${b.care} (${fmt(CARE)} ${b.perMonth})` : null,
      `— ${b.estimate}: ${fmt(q.total)}`,
      "",
    ].filter((r) => r !== null);
    const config = { type, pages, features: [...feats], speed, care, style: style?.name || null };
    // Anonymous record of what was priced; failures never block the visitor.
    fetch("/api/estimates", {
      method: "POST", keepalive: true, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...config, lang }),
    }).catch(() => {});
    onSend(rows.join("\n"), config);
  };

  return (
    <section className="builder wrap" id="price">
      <div className="builder-head">
        <SplitReveal className="h2" text={b.title} />
        <p className="lead">{b.sub}</p>
      </div>

      <div className="builder-grid">
        <div className="builder-form">
          <div className="stepper">
            <ol className="steps">
              {b.steps.map((name, i) => (
                <li key={name}>
                  <button type="button" onClick={() => goStep(i)} aria-current={step === i ? "step" : undefined}
                    className={i < step ? "is-done" : ""}>
                    <span className="step-n">{String(i + 1).padStart(2, "0")}</span>{name}
                  </button>
                </li>
              ))}
            </ol>
            <div className="step-bar" role="progressbar" aria-valuemin={1} aria-valuemax={steps} aria-valuenow={step + 1}
              aria-valuetext={b.stepOf(step + 1, steps)}>
              <i style={{ transform: `scaleX(${(step + 1) / steps})` }} />
            </div>
          </div>

          <div className="step-panel" ref={panel} key={step}>
            {step === 0 && (
              <>
                <fieldset className="field">
                  <legend>{b.type}</legend>
                  <div className="types">
                    {TYPES.map((x) => (
                      <label key={x.id} className="type">
                        <input type="radio" name="type" value={x.id} checked={type === x.id}
                          onChange={() => { setType(x.id); setPages((p) => Math.max(p, x.pages)); }} />
                        <span className="type-name">{x.name[lang]}</span>
                        <span className="type-meta">{x.desc[lang]} · {x.pages} {x.pages > 1 ? b.pagesWord : b.page} {b.included}</span>
                        <span className="type-price">{fmt(x.base)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="field">
                  <legend>{b.packages}</legend>
                  <div className="chips">
                    {Object.keys(PACKAGES).map((k) => (
                      <button type="button" className="chip" key={k} onClick={() => applyPackage(k)}>{b.pkg[k]}</button>
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            {step === 1 && (
              <fieldset className="field">
                <legend>
                  {b.pages} <output htmlFor="pages">{pages}</output>
                </legend>
                <input id="pages" type="range" min="1" max="25" value={pages}
                  onChange={(e) => setPages(+e.target.value)}
                  style={{ "--fill": `${((pages - 1) / 24) * 100}%` }} aria-describedby="pages-hint" />
                <div className="range-scale" aria-hidden="true"><span>1</span><span>25</span></div>
                <p className="hint" id="pages-hint">
                  {q.typ.name[lang]}: {q.typ.pages} {q.typ.pages > 1 ? b.pagesWord : b.page} {b.included}. {b.pagesHint}
                </p>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="field">
                <legend>{b.features}</legend>
                <p className="hint field-hint">{b.featuresHint}</p>
                <div className="feats">
                  {FEATURES.map((f) => (
                    <label key={f.id} className="feat">
                      <input type="checkbox" checked={feats.has(f.id)} onChange={() => toggle(f.id)} />
                      <span className="feat-name">{f.name[lang]}</span>
                      <em>+{fmt(f.price)}</em>
                      <small>{f.desc[lang]}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <>
                <fieldset className="field">
                  <legend>{b.speed}</legend>
                  <div className="seg">
                    {SPEEDS.map((s, i) => (
                      <label key={s}>
                        <input type="radio" name="speed" checked={speed === s} onChange={() => setSpeed(s)} />
                        <span>{b.speeds[i]}</span>
                      </label>
                    ))}
                  </div>
                  <p className="hint">{b.speedDesc[SPEEDS.indexOf(speed)]} {b.delivery}: {weeks} {b.weeks}.</p>
                </fieldset>
                <label className="switch">
                  <input type="checkbox" checked={care} onChange={(e) => setCare(e.target.checked)} />
                  <span className="switch-ui" aria-hidden="true" />
                  <span className="switch-text">
                    <span>{b.care} <strong>{fmt(CARE)} {b.perMonth}</strong></span>
                    <small>{b.careDesc}</small>
                  </span>
                </label>
              </>
            )}
          </div>

          <div className="step-nav">
            <button type="button" className="btn btn-line" onClick={() => goStep(step - 1)} disabled={step === 0}>{b.back}</button>
            <span className="step-of">{b.stepOf(step + 1, steps)}</span>
            {step < steps - 1
              ? <button type="button" className="btn btn-bone" onClick={() => goStep(step + 1)}>{b.next}<Arrow /></button>
              : <button type="button" className="btn btn-bone" onClick={review}>{b.review}<Arrow /></button>}
          </div>
        </div>

        <aside className="receipt" id="estimate" ref={receipt} aria-live="polite">
          <p className="receipt-label">{b.estimate}</p>
          {style && <p className="receipt-style">{b.style}: {style.name}</p>}
          <p className="receipt-total" ref={totalRef}>{fmt(q.total)}</p>
          <p className="receipt-meta">
            {b.delivery}: {weeks} {b.weeks}
            {care && <> · +{fmt(CARE)} {b.perMonth}</>}
          </p>
          <ul className="receipt-lines">
            {lines.map(([n, p]) => (
              <li key={n}><span>{n}</span><span>{fmt(p)}</span></li>
            ))}
          </ul>
          <button type="button" ref={sendBtn} className="btn btn-flare btn-block" onClick={send}>
            {b.send}<Arrow />
          </button>
          <p className="hint">{b.note}</p>
        </aside>
      </div>

      <div className={`builder-bar${receiptOn ? " is-hidden" : ""}`} aria-hidden="true">
        <span><small>{b.estimate}</small><b ref={barRef}>{fmt(q.total)}</b></span>
        <button type="button" className="btn btn-flare btn-sm" tabIndex={-1} onClick={review}>{b.review}</button>
      </div>
    </section>
  );
}
