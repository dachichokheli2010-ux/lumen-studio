import { useI18n } from "../i18n.jsx";
import { SplitReveal, useRise } from "./Reveal.jsx";

export default function Services() {
  const { t, lang } = useI18n();
  const scope = useRise(".svc", [lang]);
  return (
    <section className="services wrap" id="services" ref={scope}>
      <SplitReveal className="h2" text={t.services.title} />
      <ul className="svc-list">
        {t.services.items.map(([name, desc, price]) => (
          <li className="svc" key={name}>
            <span className="svc-name">{name}</span>
            <span className="svc-desc">{desc}</span>
            <span className="svc-price">{price}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
