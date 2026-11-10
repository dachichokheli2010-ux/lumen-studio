import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { startSmoothScroll, scrollToId, ScrollTrigger } from "./scroll.js";
import { useI18n } from "./i18n.jsx";
import Loader from "./components/Loader.jsx";
import Cursor from "./components/Cursor.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
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

// The scroll-driven background world loads after first paint.
const ScrollWorld = lazy(() => import("./three/ScrollWorld.jsx"));
// Skipped on data-saver connections and low-memory devices; the page reads the same without it.
const worldOk = typeof navigator !== "undefined" && !navigator.connection?.saveData && !(navigator.deviceMemory && navigator.deviceMemory < 4);

export default function App() {
  const { lang, t } = useI18n();
  const [ready, setReady] = useState(false);
  const [preset, setPreset] = useState(null); // { style } from the gallery or { add: featureId } from a service
  const [brief, setBrief] = useState(null); // { text, estimate } from the price builder

  useEffect(() => startSmoothScroll(), []);

  // Text length changes between languages; re-measure pinned sections.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lang]);

  const useStyle = useCallback((tpl) => {
    setPreset({ style: tpl, at: Date.now() });
    setTimeout(() => scrollToId("price"), 60);
  }, []);

  const addFeature = useCallback((id) => {
    setPreset({ add: id, at: Date.now() });
    setTimeout(() => scrollToId("price"), 60);
  }, []);

  const sendBrief = useCallback((text, estimate) => {
    setBrief({ text, estimate, at: Date.now() });
    setTimeout(() => scrollToId("contact-form"), 120);
  }, []);

  return (
    <>
      <a className="skip" href="#main">{t.nav.skip}</a>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      {ready && worldOk && <Suspense fallback={null}><ScrollWorld /></Suspense>}
      <Nav />
      <main id="main">
        <Hero ready={ready} />
        <Manifesto />
        <Marquee />
        <Ideas onUse={useStyle} />
        <Services onAddFeature={addFeature} onGo={scrollToId} />
        <Ads onAddFeature={addFeature} />
        <Builder preset={preset} onSend={sendBrief} />
        <Process />
        <Faq />
        <Contact brief={brief} />
      </main>
      <Footer />
    </>
  );
}
