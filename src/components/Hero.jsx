import { lazy, Suspense } from "react";
import { useI18n } from "../i18n.jsx";
import { scrollToId } from "../scroll.js";
import { SplitReveal } from "./Reveal.jsx";

const HeroScene = lazy(() => import("../three/HeroScene.jsx"));

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="arrow">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero({ ready }) {
  const { t } = useI18n();
  const go = (id) => (e) => { e.preventDefault(); scrollToId(id); };
  return (
    <div className="hero-track">
    <section className="hero" id="top">
      <Suspense fallback={<div className="hero-canvas" />}>
        <HeroScene />
      </Suspense>
      <div className="hero-copy">
        <h1 className="hero-title">
          <SplitReveal as="span" className="hero-line" text={t.hero.title[0]} immediate play={ready} />
          <SplitReveal as="span" className="hero-line" text={t.hero.title[1]} immediate play={ready} delay={0.1} />
        </h1>
        <div className={`hero-row${ready ? " in" : ""}`}>
          <p className="hero-sub">{t.hero.sub}</p>
          <div className="hero-actions">
            <a href="#price" className="btn btn-bone" onClick={go("price")}>
              {t.hero.primary}
              <Arrow />
            </a>
            <a href="#ideas" className="btn btn-line" onClick={go("ideas")}>{t.hero.secondary}</a>
          </div>
        </div>
      </div>
      <div className={`hero-meta${ready ? " in" : ""}`}>
        <span>{t.hero.place}</span>
        <span className="hero-scroll">{t.hero.scroll}<i /></span>
      </div>
    </section>
    </div>
  );
}
