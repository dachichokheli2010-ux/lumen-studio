import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "../scroll.js";
import { useI18n } from "../i18n.jsx";

export default function Loader({ onDone }) {
  const { t } = useI18n();
  const el = useRef();
  const num = useRef();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reducedMotion) { setGone(true); onDone(); return; }
    document.documentElement.classList.add("locked");
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("locked");
        setGone(true);
      },
    });
    tl.to(counter, {
      v: 100, duration: 1.6, ease: "power2.inOut",
      onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, "0"); },
    })
      .add(() => onDone(), "+=0.05")
      .to(el.current, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "<");
    return () => tl.kill();
  }, []);

  if (gone) return null;
  return (
    <div className="loader" ref={el} aria-hidden="true">
      <span className="loader-label">{t.loading}</span>
      <span className="loader-num" ref={num}>000</span>
    </div>
  );
}
