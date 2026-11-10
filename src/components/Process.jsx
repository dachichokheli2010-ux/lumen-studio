import { useLayoutEffect, useRef } from "react";
import { useI18n } from "../i18n.jsx";
import { gsap, reducedMotion } from "../scroll.js";
import { SplitReveal } from "./Reveal.jsx";

export default function Process() {
  const { t, lang } = useI18n();
  const scope = useRef();
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".proc-rule i", { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: ".proc-list", start: "top 80%", end: "bottom 60%", scrub: true },
      });
      gsap.from(".proc", {
        y: 30, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.12,
        scrollTrigger: { trigger: ".proc-list", start: "top 85%", once: true },
      });
    }, scope);
    return () => ctx.revert();
  }, [lang]);
  return (
    <section className="process wrap" id="process" ref={scope}>
      <SplitReveal className="h2" text={t.process.title} />
      <div className="proc-rule" aria-hidden="true"><i /></div>
      <ol className="proc-list">
        {t.process.steps.map(([name, text], i) => (
          <li className="proc" key={name}>
            <span className="proc-n">{String(i + 1).padStart(2, "0")}</span>
            <h3>{name}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
