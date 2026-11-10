import { useCallback, useEffect, useState } from "react";
import { startSmoothScroll, scrollToId, ScrollTrigger } from "./scroll.js";
import { useI18n } from "./i18n.jsx";
import Loader from "./components/Loader.jsx";
import Cursor from "./components/Cursor.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Manifesto from "./components/Manifesto.jsx";
import Ideas from "./components/Ideas.jsx";
import Services from "./components/Services.jsx";
import Builder from "./components/Builder.jsx";
import Process from "./components/Process.jsx";
import Faq from "./components/Faq.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const { lang } = useI18n();
  const [ready, setReady] = useState(false);
  const [preset, setPreset] = useState(null); // { style, type, features } from the gallery
  const [brief, setBrief] = useState("");

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

  const sendBrief = useCallback((text) => {
    setBrief(text);
    setTimeout(() => scrollToId("contact-form"), 60);
  }, []);

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Manifesto />
        <Ideas onUse={useStyle} />
        <Services />
        <Builder preset={preset} onSend={sendBrief} />
        <Process />
        <Faq />
        <Contact brief={brief} />
      </main>
      <Footer />
    </>
  );
}
