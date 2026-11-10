import { useLayoutEffect, useRef } from "react";
import { useI18n } from "../i18n.jsx";
import { gsap, SplitText, reducedMotion } from "../scroll.js";

// Words brighten as they pass the reading line.
export default function Manifesto() {
  const { t, lang } = useI18n();
  const ref = useRef();
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const split = SplitText.create(ref.current, { type: "words", wordsClass: "w" });
    const tw = gsap.fromTo(split.words, { opacity: 0.22 }, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
    });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); split.revert(); };
  }, [lang]);
  return (
    <section className="manifesto" aria-label="LUMEN">
      <p ref={ref} key={lang}>{t.manifesto}</p>
    </section>
  );
}
