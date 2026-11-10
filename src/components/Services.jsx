import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { ScrollTrigger, gsap } from "../scroll.js";
import { SplitReveal, useRise } from "./Reveal.jsx";
import { Arrow } from "./Hero.jsx";

const ServicesScene = lazy(() => import("../three/ServicesScene.jsx"));

// Three disciplines scroll past one sticky 3D stage; the object on stage follows the panel in view.
export default function Services({ onAddFeature, onGo }) {
  const { t, lang } = useI18n();
  const s = t.services;
  const [active, setActive] = useState(0);
  const panels = useRef();
  const also = useRise(".svc-row", [lang]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".svc-panel").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el, start: "top 62%", end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, panels);
    return () => ctx.revert();
  }, [lang]);

  const actions = [() => onGo("price"), () => onAddFeature("3d"), () => onGo("ads")];

  return (
    <section className="services" id="services">
      <div className="svc-head wrap">
        <SplitReveal className="h2" text={s.title} />
        <p className="lead">{s.sub}</p>
      </div>

      <div className="svc-stage wrap" ref={panels}>
        <div className="svc-sticky">
          <Suspense fallback={<div className="svc-canvas" />}>
            <ServicesScene active={active} />
          </Suspense>
          <p className="svc-counter" aria-hidden="true">
            <span key={active}>{String(active + 1).padStart(2, "0")}</span> / {String(s.items.length).padStart(2, "0")}
          </p>
        </div>
        <ol className="svc-panels">
          {s.items.map((it, i) => (
            <li key={it.name} className={`svc-panel${active === i ? " is-active" : ""}`}>
              <span className="svc-n">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="svc-title">{it.name}</h3>
              <p className="svc-value">{it.value}</p>
              <ul className="svc-points">
                {it.list.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <div className="svc-foot">
                <span className="svc-from">{it.price}</span>
                <button type="button" className="link-arrow" onClick={actions[i]}>
                  {it.cta}<Arrow />
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="svc-also wrap" ref={also}>
        <h3 className="svc-also-title">{s.alsoTitle}</h3>
        <ul>
          {s.also.map(([name, desc, price]) => (
            <li className="svc-row" key={name}>
              <span className="svc-row-name">{name}</span>
              <span className="svc-row-desc">{desc}</span>
              <span className="svc-row-price">{price}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
