import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { TYPES, FEATURES, PACKAGES, PER_PAGE, CARE, fmt } from "../data.js";
import { gsap, reducedMotion } from "../scroll.js";
import { SplitReveal } from "./Reveal.jsx";
import { Arrow } from "./Hero.jsx";

const SPEEDS = [1, 1.25, 1.5];

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
  const [type, setType] = useState("business");
  const [pages, setPages] = useState(5);
  const [feats, setFeats] = useState(() => new Set(["seo"]));
  const [speed, setSpeed] = useState(1);
  const [care, setCare] = useState(false);
  const [style, setStyle] = useState(null);

  const applyPackage = (key) => {
    const p = PACKAGES[key];
    setType(p.type);
    setPages(p.pages);
    setFeats(new Set(p.features));
  };

  // A style chosen in the gallery pre-fills type and matching features.
  useEffect(() => {
    if (!preset?.style) return;
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
  }, [preset]);

  const q = useMemo(() => {
    const typ = TYPES.find((x) => x.id === type);
    const extra = Math.max(0, pages - typ.pages);
    const chosen = FEATURES.filter((f) => feats.has(f.id));
    const lines = [[typ.name[lang], typ.base]];
    if (extra) lines.push([`${extra} ${b.extra}`, extra * PER_PAGE]);
    chosen.forEach((f) => lines.push([f.name[lang], f.price]));
    const subtotal = lines.reduce((s, l) => s + l[1], 0);
    if (speed > 1) lines.push([b.rush, Math.round(subtotal * (speed - 1))]);
    const total = Math.round(subtotal * speed);
    const addWeeks = chosen.reduce((s, f) => s + (f.weeks || 0), 0) + Math.floor(extra / 6);
    const k = speed === 1.5 ? 0.6 : speed === 1.25 ? 0.8 : 1;
    const w0 = Math.max(1, Math.round((typ.weeks[0] + addWeeks) * k));
    const w1 = Math.max(w0 + 1, Math.round((typ.weeks[1] + addWeeks) * k));
    return { typ, chosen, lines, total, weeks: `${w0}–${w1}` };
  }, [type, pages, feats, speed, lang, b]);

  const totalRef = useCountUp(q.total);

  const toggle = (id) => setFeats((s) => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const send = () => {
    const rows = [
      t.briefIntro,
      `— ${q.typ.name[lang]}, ${pages} ${b.pagesWord}`,
      style ? `— ${b.style}: ${style.name} (${style.cat[lang]})` : null,
      q.chosen.length ? `— ${q.chosen.map((f) => f.name[lang]).join(", ")}` : null,
      `— ${b.delivery}: ${q.weeks} ${b.weeks} (${b.speeds[SPEEDS.indexOf(speed)]})`,
      care ? `— ${b.care} (${fmt(CARE)} ${b.perMonth})` : null,
      `— ${b.estimate}: ${fmt(q.total)}`,
      "",
    ].filter((r) => r !== null);
    onSend(rows.join("\n"));
  };

  return (
    <section className="builder wrap" id="price">
      <div className="builder-head">
        <SplitReveal className="h2" text={b.title} />
        <p className="lead">{b.sub}</p>
      </div>

      <div className="builder-grid">
        <div className="builder-form">
          <fieldset className="field">
            <legend>{b.packages}</legend>
            <div className="chips">
              {Object.keys(PACKAGES).map((k) => (
                <button type="button" className="chip" key={k} onClick={() => applyPackage(k)}>{b.pkg[k]}</button>
              ))}
            </div>
          </fieldset>

          <fieldset className="field">
            <legend>{b.type}</legend>
            <div className="types">
              {TYPES.map((x) => (
                <label key={x.id} className="type">
                  <input type="radio" name="type" value={x.id} checked={type === x.id}
                    onChange={() => { setType(x.id); setPages((p) => Math.max(p, x.pages)); }} />
                  <span className="type-name">{x.name[lang]}</span>
                  <span className="type-meta">{x.pages} {x.pages > 1 ? b.pagesWord : b.page} {b.included}</span>
                  <span className="type-price">{fmt(x.base)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field">
            <legend>
              {b.pages} <output htmlFor="pages">{pages}</output>
            </legend>
            <input id="pages" type="range" min="1" max="25" value={pages}
              onChange={(e) => setPages(+e.target.value)}
              style={{ "--fill": `${((pages - 1) / 24) * 100}%` }} aria-describedby="pages-hint" />
            <p className="hint" id="pages-hint">{b.pagesHint}</p>
          </fieldset>

          <fieldset className="field">
            <legend>{b.features}</legend>
            <div className="feats">
              {FEATURES.map((f) => (
                <label key={f.id} className="feat">
                  <input type="checkbox" checked={feats.has(f.id)} onChange={() => toggle(f.id)} />
                  <span>{f.name[lang]}</span>
                  <em>+{fmt(f.price)}</em>
                </label>
              ))}
            </div>
          </fieldset>

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
          </fieldset>

          <label className="switch">
            <input type="checkbox" checked={care} onChange={(e) => setCare(e.target.checked)} />
            <span className="switch-ui" aria-hidden="true" />
            <span>{b.care} <strong>{fmt(CARE)} {b.perMonth}</strong></span>
          </label>
        </div>

        <aside className="receipt" aria-live="polite">
          <p className="receipt-label">{b.estimate}</p>
          {style && <p className="receipt-style">{b.style}: {style.name}</p>}
          <p className="receipt-total" ref={totalRef}>{fmt(q.total)}</p>
          <p className="receipt-meta">
            {b.delivery}: {q.weeks} {b.weeks}
            {care && <> · +{fmt(CARE)} {b.perMonth}</>}
          </p>
          <ul className="receipt-lines">
            {q.lines.map(([n, p]) => (
              <li key={n}><span>{n}</span><span>{fmt(p)}</span></li>
            ))}
          </ul>
          <button type="button" className="btn btn-bone btn-block" onClick={send}>
            {b.send}<Arrow />
          </button>
          <p className="hint">{b.note}</p>
        </aside>
      </div>
    </section>
  );
}
