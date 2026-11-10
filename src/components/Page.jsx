import { lazy, Suspense } from "react";
import { useI18n } from "../i18n.jsx";
import { PAGE_COPY } from "../pageCopy.js";
import { Link, PAGES } from "../router.jsx";
import { SplitReveal, useRise } from "./Reveal.jsx";
import { Arrow } from "./Hero.jsx";

const PageScene = lazy(() => import("../three/PageScene.jsx"));

// The top of a single-topic page: its own headline beside its own 3D object.
export function PageHero({ page }) {
  const { lang } = useI18n();
  const c = PAGE_COPY[lang][page];
  return (
    <header className="page-hero wrap">
      <div className="page-hero-copy">
        <SplitReveal as="h1" className="page-title" text={c.title} immediate />
        <p className="lead">{c.sub}</p>
      </div>
      <div className="page-hero-stage">
        <Suspense fallback={<div className="page-canvas" />}><PageScene variant={page} /></Suspense>
      </div>
    </header>
  );
}

// Page-only content: a short ruled list of what matters most on this topic.
export function PageExtra({ page }) {
  const { lang } = useI18n();
  const c = PAGE_COPY[lang][page];
  const scope = useRise(".pe-item", [lang, page]);
  if (!c?.extra) return null;
  return (
    <section className="page-extra wrap" ref={scope}>
      <SplitReveal className="h2" text={c.extraTitle} />
      <ol className={`pe-list pe-${c.extra.length}`}>
        {c.extra.map(([h, p], i) => (
          <li className="pe-item" key={h}>
            <span className="pe-n">{String(i + 1).padStart(2, "0")}</span>
            <h3>{h}</h3>
            <p>{p}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Closing call to action on every page except the ones that already end in one.
export function PageCta({ page }) {
  const { t, lang } = useI18n();
  const c = PAGE_COPY[lang];
  if (page === "contact" || page === "price") return null;
  return (
    <section className="page-cta wrap">
      <SplitReveal className="display" text={c.ctaTitle} />
      <p className="lead">{c.ctaSub}</p>
      <div className="page-cta-actions">
        <Link to={PAGES.price} className="btn btn-flare">{t.nav.cta}<Arrow /></Link>
        <Link to={PAGES.contact} className="btn btn-line">{c.ctaWrite}</Link>
      </div>
    </section>
  );
}
