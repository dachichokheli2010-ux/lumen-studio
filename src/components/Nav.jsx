import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { lockScroll } from "../scroll.js";
import { Link, PAGES } from "../router.jsx";
import { STUDIO } from "./Contact.jsx";

const LINKS = ["ideas", "services", "ads", "price", "process", "faq"];
const DRAWER = [...LINKS, "contact"];

function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang" role="group" aria-label="Language">
      <button type="button" aria-pressed={lang === "ka"} onClick={() => setLang("ka")} lang="ka">ქარ</button>
      <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")} lang="en">EN</button>
    </div>
  );
}

// The section whose top has crossed the upper third of the screen.
function useActiveSection() {
  const [active, setActive] = useState(null);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = innerHeight * 0.34;
      let cur = null;
      for (const id of LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      const contact = document.getElementById("contact");
      if (contact && contact.getBoundingClientRect().top <= line) cur = null;
      setActive(cur);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  return active;
}

export default function Nav({ page }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const section = useActiveSection();
  const active = page === "home" ? section : page;
  const drawer = useRef();
  const toggle = useRef();

  // Solid after the first screen's top; tucks away on the way down, returns on the way up.
  useEffect(() => {
    let last = scrollY;
    const on = () => {
      const y = scrollY;
      setSolid(y > 60);
      if (Math.abs(y - last) > 6) { setHidden(y > last && y > innerHeight * 1.2); last = y; }
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const first = drawer.current.querySelector("a, button");
    first?.focus({ preventScroll: true });
    const key = (e) => {
      if (e.key === "Escape") { setOpen(false); toggle.current.focus(); return; }
      if (e.key !== "Tab") return;
      const items = [toggle.current, ...drawer.current.querySelectorAll("a, button")];
      const i = items.indexOf(document.activeElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === items.length - 1 ? 0 : i + 1);
      e.preventDefault();
      items[next].focus();
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open]);

  // Links open pages; release the scroll lock first so the new page can reset its scroll.
  const close = () => { if (open) lockScroll(false); setOpen(false); };

  const cls = ["nav", solid && "is-solid", open && "is-open", hidden && !open && "is-hidden"].filter(Boolean).join(" ");

  return (
    <>
      <header className={cls}>
        <Link to="/" className="brand" onClick={close} aria-label="LUMEN">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M12 2.5l8 9.5-8 9.5-8-9.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M4 12h16" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          LUMEN
        </Link>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map((id) => (
            <Link key={id} to={PAGES[id]} onClick={close} aria-current={active === id ? "page" : undefined}>{t.nav[id]}</Link>
          ))}
        </nav>
        <div className="nav-end">
          <LangSwitch />
          <Link to={PAGES.price} className="btn btn-flare btn-sm nav-cta" onClick={close}>{t.nav.cta}</Link>
          <button type="button" ref={toggle} className="menu-btn" aria-expanded={open} aria-controls="drawer"
            onClick={() => setOpen((o) => !o)} aria-label={open ? t.nav.close : t.nav.menu}>
            <span /><span />
          </button>
        </div>
      </header>

      <div className={`scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className={`drawer${open ? " is-open" : ""}`} id="drawer" ref={drawer} aria-label={t.nav.menu}
        inert={open ? undefined : ""} data-lenis-prevent>
        <nav className="drawer-links" aria-label="Mobile">
          {DRAWER.map((id, i) => (
            <Link key={id} to={PAGES[id]} onClick={close} style={{ "--i": i }} aria-current={active === id ? "page" : undefined}>
              <span>{t.nav[id]}</span>
            </Link>
          ))}
        </nav>
        <Link to={PAGES.price} className="btn btn-flare btn-block" onClick={close}>{t.nav.cta}</Link>
        <div className="drawer-foot">
          <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
          <LangSwitch />
        </div>
      </aside>
    </>
  );
}
