import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { TEMPLATES, fmt } from "../data.js";
import { gsap, lockScroll } from "../scroll.js";
import { SplitReveal } from "./Reveal.jsx";
import Mock from "./Mock.jsx";
import { Arrow } from "./Hero.jsx";

function Preview({ tpl, onClose, onUse }) {
  const { t, lang } = useI18n();
  const panel = useRef();
  const closeBtn = useRef();

  useEffect(() => {
    lockScroll(true);
    closeBtn.current.focus();
    const key = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", key);
    gsap.fromTo(panel.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "expo.out" });
    return () => { lockScroll(false); removeEventListener("keydown", key); };
  }, []);

  return (
    <div className="preview" role="dialog" aria-modal="true" aria-labelledby="pv-title" ref={panel} data-lenis-prevent>
      <div className="preview-inner">
        <div className="preview-mock"><Mock tpl={tpl} big /></div>
        <aside className="preview-info">
          <h3 id="pv-title">{tpl.name}</h3>
          <p className="preview-cat">{tpl.cat[lang]}</p>
          <p className="preview-desc">{tpl.desc[lang]}</p>
          <p className="preview-sub">{t.ideas.includes}</p>
          <ul className="preview-feats">
            {tpl.features[lang].map((f) => <li key={f}>{f}</li>)}
          </ul>
          <p className="preview-price">
            {lang === "ka" ? <><strong>{fmt(tpl.price)}</strong>-{t.ideas.from}</> : <>{t.ideas.from} <strong>{fmt(tpl.price)}</strong></>}
          </p>
          <button type="button" className="btn btn-bone btn-block" onClick={() => { onUse(tpl); onClose(); }}>
            {t.ideas.use}<Arrow />
          </button>
        </aside>
        <button type="button" className="preview-close" ref={closeBtn} onClick={onClose}>
          {t.ideas.close}
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}

export default function Ideas({ onUse }) {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const pin = useRef();
  const track = useRef();
  const lastFocus = useRef(null);

  const cats = ["all", ...new Set(TEMPLATES.map((x) => x.cat.en))];
  const list = filter === "all" ? TEMPLATES : TEMPLATES.filter((x) => x.cat.en === filter);

  // Desktop: vertical scroll drives the reel sideways.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current;
      const dist = () => Math.max(0, el.scrollWidth - el.parentElement.clientWidth);
      gsap.set(el, { x: 0 });
      gsap.to(el, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, [filter, lang]);

  const openTpl = (tpl, e) => { lastFocus.current = e.currentTarget; setOpen(tpl); };
  const close = () => { setOpen(null); requestAnimationFrame(() => lastFocus.current?.focus()); };

  return (
    <section className="ideas" id="ideas">
      <div className="ideas-pin" ref={pin}>
        <div className="ideas-head wrap">
          <SplitReveal className="h2" text={t.ideas.title} />
          <div className="ideas-side">
            <p className="lead">{t.ideas.sub}</p>
            <div className="chips" role="group" aria-label={t.ideas.all}>
              {cats.map((c) => {
                const label = c === "all" ? t.ideas.all : TEMPLATES.find((x) => x.cat.en === c).cat[lang];
                return (
                  <button type="button" key={c} className="chip" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="reel">
          <ul className="reel-track" ref={track}>
            {list.map((tpl) => (
              <li key={tpl.id} className="reel-item">
                <button type="button" className="idea" data-cursor={t.ideas.open} onClick={(e) => openTpl(tpl, e)}>
                  <Mock tpl={tpl} />
                  <span className="idea-meta">
                    <span className="idea-name">{tpl.name}</span>
                    <span className="idea-cat">{tpl.cat[lang]}</span>
                    <span className="idea-price">{fmt(tpl.price)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {open && <Preview tpl={open} onClose={close} onUse={onUse} />}
    </section>
  );
}
