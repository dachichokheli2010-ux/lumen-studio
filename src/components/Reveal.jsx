import { useLayoutEffect, useRef } from "react";
import { gsap, SplitText, reducedMotion } from "../scroll.js";

// Line-masked headline reveal. Keyed by text so a language switch remounts a clean node.
export function SplitReveal({ as: Tag = "h2", text, className, delay = 0, immediate = false, play = true }) {
  const ref = useRef();
  useLayoutEffect(() => {
    if (reducedMotion || !play) return;
    let anim;
    const split = SplitText.create(ref.current, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
      autoSplit: true,
      onSplit(self) {
        anim = gsap.from(self.lines, {
          yPercent: 115,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.09,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: ref.current, start: "top 88%", once: true },
        });
        return anim;
      },
    });
    return () => { anim?.scrollTrigger?.kill(); anim?.kill(); split.revert(); };
  }, [text, play]);
  return (
    <Tag ref={ref} className={className} key={text}>
      {text}
    </Tag>
  );
}

// Soft rise for blocks: starts visible if JS never runs.
export function useRise(selector, deps = []) {
  const scope = useRef();
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(selector).forEach((el) => {
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    }, scope);
    return () => ctx.revert();
  }, deps);
  return scope;
}
