import { useEffect, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { scrollToId, lockScroll } from "../scroll.js";

const LINKS = ["ideas", "services", "price", "process", "faq"];

function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang" role="group" aria-label="Language">
      <button type="button" aria-pressed={lang === "ka"} onClick={() => setLang("ka")} lang="ka">ქარ</button>
      <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")} lang="en">EN</button>
    </div>
  );
}

export default function Nav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(scrollY > 60);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const esc = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`nav${solid ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <a href="#top" className="brand" onClick={go("top")} aria-label="LUMEN">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M12 2.5l8 9.5-8 9.5-8-9.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        LUMEN
      </a>
      <nav className="nav-links" aria-label="Main">
        {LINKS.map((id) => (
          <a key={id} href={`#${id}`} onClick={go(id)}>{t.nav[id]}</a>
        ))}
      </nav>
      <div className="nav-end">
        <LangSwitch />
        <a href="#price" className="btn btn-bone btn-sm nav-cta" onClick={go("price")}>{t.nav.cta}</a>
        <button type="button" className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          <span /><span />
        </button>
      </div>
      <div className="menu" id="menu" hidden={!open}>
        {LINKS.map((id, i) => (
          <a key={id} href={`#${id}`} onClick={go(id)} style={{ "--i": i }}>{t.nav[id]}</a>
        ))}
        <a href="#price" className="btn btn-bone" onClick={go("price")}>{t.nav.cta}</a>
        <div className="menu-foot"><LangSwitch /></div>
      </div>
    </header>
  );
}
