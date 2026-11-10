import { useI18n } from "../i18n.jsx";
import { SplitReveal } from "./Reveal.jsx";

export default function Faq() {
  const { t } = useI18n();
  return (
    <section className="faq wrap" id="faq">
      <SplitReveal className="h2" text={t.faq.title} />
      <div className="faq-list">
        {t.faq.items.map(([q, a]) => (
          <details key={q}>
            <summary>
              <span>{q}</span>
              <i aria-hidden="true" />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
