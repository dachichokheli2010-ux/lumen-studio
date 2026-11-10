import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "../scroll.js";

// Ring that trails the pointer and grows with a label over [data-cursor] targets.
export default function Cursor() {
  const ring = useRef();
  const label = useRef();
  useEffect(() => {
    if (reducedMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const xTo = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "expo.out" });
    const yTo = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "expo.out" });
    const move = (e) => { ring.current.classList.add("is-on"); xTo(e.clientX); yTo(e.clientY); };
    const over = (e) => {
      const target = e.target.closest?.("[data-cursor], a, button, label, summary, input[type=range]");
      ring.current.classList.toggle("is-link", !!target);
      const text = target?.getAttribute("data-cursor") || "";
      label.current.textContent = text;
      ring.current.classList.toggle("is-label", !!text);
    };
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerover", over, { passive: true });
    return () => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerover", over);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);
  return (
    <div className="cursor" ref={ring} aria-hidden="true">
      <span ref={label} />
    </div>
  );
}
