import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { startSmoothScroll, scrollToId, resetScroll, ScrollTrigger } from "./scroll.js";
import { useI18n } from "./i18n.jsx";
import { usePage, navigate, Link, PAGES, PAGE_ORDER } from "./router.jsx";
import Loader from "./components/Loader.jsx";
import Cursor from "./components/Cursor.jsx";
import Nav from "./components/Nav.jsx";
import Hero, { Arrow } from "./components/Hero.jsx";
import Manifesto from "./components/Manifesto.jsx";
import Marquee from "./components/Marquee.jsx";
import Ideas from "./components/Ideas.jsx";
import Services from "./components/Services.jsx";
import Ads from "./components/Ads.jsx";
import Builder from "./components/Builder.jsx";
import Process from "./components/Process.jsx";
import Faq from "./components/Faq.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import MobileCta from "./components/MobileCta.jsx";
import { PageHero, PageExtra, PageCta } from "./components/Page.jsx";

// The scroll-driven background world loads after first paint.
const ScrollWorld = lazy(() => import("./three/ScrollWorld.jsx"));
// Skipped on data-saver connections and low-memory devices; the page reads the same without it.
const worldOk = typeof navigator !== "undefined" && !navigator.connection?.saveData && !(navigator.deviceMemory && navigator.deviceMemory < 4);

// The end of every single-topic page: where to go next, and the way home.
function NextPage({ page }) {
  const { t } = useI18n();
  const next = PAGE_ORDER[(PAGE_ORDER.indexOf(page) + 1) % PAGE_ORDER.length];
  return (
    <nav className="next-page wrap" aria-label={t.nav.next}>
      <Link to="/" className="next-home">← {t.nav.home}</Link>
      <Link to={PAGES[next]} className="next-link">
        <span>{t.nav.next}</span>
        <strong>{t.nav[next]}<Arrow /></strong>
      </Link>
    </nav>
  );
}

function NotFound() {
  const { t } = useI18n();
  return (
    <section className="notfound wrap">
      <h1 className="h2">{t.nav.notFound}</h1>
      <Link to="/" className="btn btn-flare">{t.nav.home}<Arrow /></Link>
    </section>
  );
}

export default function App() {
  const { lang, t } = useI18n();
  const page = usePage();
  const home = page === "home";
  const [ready, setReady] = useState(false);
  const [preset, setPreset] = useState(null); // { style } from the gallery or { add: featureId } from a service
  const [brief, setBrief] = useState(null); // { text, estimate } from the price builder

  useEffect(() => startSmoothScroll(), []);

  // A new page starts at the top, with its own title, and re-measures its scroll animations.
  useEffect(() => {
    resetScroll();
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://lumen-studio-virid.vercel.app${home ? "/" : location.pathname}`);
    document.title = home ? "LUMEN — Websites, 3D & Ads Studio in Tbilisi" : `${t.nav[page] || t.nav.notFound} — LUMEN`;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [page]);

  // Text length changes between languages; re-measure pinned sections.
  useEffect(() => {
    if (!home) document.title = `${t.nav[page] || t.nav.notFound} — LUMEN`;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lang]);

  // On the home page actions scroll to the section; on a single page they open the right page.
  const go = useCallback((id, anchor = id) => {
    if (home) setTimeout(() => scrollToId(anchor), 60);
    else if (PAGES[id] && page !== id) navigate(PAGES[id]);
    else setTimeout(() => scrollToId(anchor), 60);
  }, [home, page]);

  const useStyle = useCallback((tpl) => { setPreset({ style: tpl, at: Date.now() }); go("price"); }, [go]);
  const addFeature = useCallback((id) => { setPreset({ add: id, at: Date.now() }); go("price"); }, [go]);
  const sendBrief = useCallback((text, estimate) => {
    setBrief({ text, estimate, at: Date.now() });
    go("contact", "contact-form");
  }, [go]);

  const sections = {
    ideas: <Ideas onUse={useStyle} />,
    services: <Services onAddFeature={addFeature} onGo={go} />,
    ads: <Ads onAddFeature={addFeature} />,
    price: <Builder preset={preset} onSend={sendBrief} />,
    process: <Process />,
    faq: <Faq />,
    contact: <Contact brief={brief} />,
  };

  return (
    <>
      <a className="skip" href="#main">{t.nav.skip}</a>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      {ready && worldOk && <Suspense fallback={null}><ScrollWorld immediate={!home} /></Suspense>}
      <Nav page={page} />
      {home ? (
        <main id="main" key="home">
          <Hero ready={ready} />
          <Manifesto />
          <Marquee />
          {PAGE_ORDER.map((id) => <div key={id}>{sections[id]}</div>)}
        </main>
      ) : (
        <main id="main" className={`page page-${page}`} key={page}>
          {sections[page] ? (
            <>
              {page !== "contact" && <PageHero page={page} />}
              {sections[page]}
              <PageExtra page={page} />
              <PageCta page={page} />
              <NextPage page={page} />
            </>
          ) : <NotFound />}
        </main>
      )}
      <MobileCta page={page} />
      <Footer />
    </>
  );
}
