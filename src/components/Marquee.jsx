import { Fragment, useEffect, useRef } from "react";
import { useI18n } from "../i18n.jsx";
import { gsap, ScrollTrigger, reducedMotion } from "../scroll.js";

// A slow band of disciplines; scrolling faster pushes it faster, in the scroll's direction.
export default function Marquee() {
  const { t } = useI18n();
  const track = useRef();

  useEffect(() => {
    if (reducedMotion) return;
    let x = 0, boost = 0, dir = 1;
    const st = ScrollTrigger.create({
      onUpdate: (s) => { boost = Math.min(Math.abs(s.getVelocity()) / 220, 14); dir = s.direction; },
    });
    const tick = (_, dt) => {
      boost *= 0.93;
      x -= (0.7 + boost) * dir * (dt / 16);
      const half = track.current.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.current.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); st.kill(); };
  }, []);

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" ref={track}>
        {[0, 1].map((k) => (
          <span className="marquee-set" key={k}>
            {t.marquee.map((w, i) => (
              <Fragment key={w}>
                <b className={i % 2 ? "is-outline" : ""}>{w}</b>
                <i />
              </Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
