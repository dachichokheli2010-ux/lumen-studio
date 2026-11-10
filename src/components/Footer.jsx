import { useI18n } from "../i18n.jsx";
import { scrollToId } from "../scroll.js";
import { STUDIO } from "./Contact.jsx";

export default function Footer() {
  const { t } = useI18n();
  const go = (id) => (e) => { e.preventDefault(); scrollToId(id); };
  return (
    <footer className="footer">
      <div className="footer-top wrap">
        <p>{t.footer}</p>
        <nav aria-label="Footer">
          <a href="#ideas" onClick={go("ideas")}>{t.nav.ideas}</a>
          <a href="#services" onClick={go("services")}>{t.nav.services}</a>
          <a href="#ads" onClick={go("ads")}>{t.nav.ads}</a>
          <a href="#price" onClick={go("price")}>{t.nav.price}</a>
          <a href="#contact" onClick={go("contact")}>{t.contact.write}</a>
          <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
        </nav>
      </div>
      <p className="footer-mark" aria-hidden="true">LUMEN</p>
      <p className="footer-legal wrap">© {new Date().getFullYear()} LUMEN · {STUDIO.city}</p>
    </footer>
  );
}
