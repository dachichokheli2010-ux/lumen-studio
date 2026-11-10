import { useI18n } from "../i18n.jsx";
import { Link, PAGES } from "../router.jsx";
import { STUDIO } from "./Contact.jsx";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="footer-top wrap">
        <p>{t.footer}</p>
        <nav aria-label="Footer">
          <Link to={PAGES.ideas}>{t.nav.ideas}</Link>
          <Link to={PAGES.services}>{t.nav.services}</Link>
          <Link to={PAGES.ads}>{t.nav.ads}</Link>
          <Link to={PAGES.price}>{t.nav.price}</Link>
          <Link to={PAGES.contact}>{t.contact.write}</Link>
          <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
        </nav>
      </div>
      <p className="footer-mark" aria-hidden="true">LUMEN</p>
      <p className="footer-legal wrap">© {new Date().getFullYear()} LUMEN · {STUDIO.city}</p>
    </footer>
  );
}
