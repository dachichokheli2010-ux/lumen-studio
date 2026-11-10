import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reducedMotion =
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis = null;

export function startSmoothScroll() {
  if (reducedMotion) return () => {};
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
}

export function lockScroll(lock) {
  if (lenis) lock ? lenis.stop() : lenis.start();
  document.documentElement.classList.toggle("locked", lock);
}

export { gsap, ScrollTrigger, SplitText };
