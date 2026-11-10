import { useEffect, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { Link } from "../router.jsx";
import { Arrow } from "./Hero.jsx";

// Phones: the header's price button is hidden, so one thumb-reach button carries the main action.
export default function MobileCta({ page }) {
  const { t } = useI18n();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const check = () => {
      const footer = document.querySelector(".footer");
      const nearEnd = footer && footer.getBoundingClientRect().top < innerHeight;
      setOn(scrollY > innerHeight * (page === "home" ? 1.4 : 0.3) && !nearEnd);
    };
    check();
    addEventListener("scroll", check, { passive: true });
    return () => removeEventListener("scroll", check);
  }, [page]);
  if (page === "price" || page === "contact") return null;
  return (
    <div className={`mobile-cta${on ? " is-on" : ""}`}>
      <Link to="/pricing" className="btn btn-flare" tabIndex={on ? 0 : -1}>{t.nav.cta}<Arrow /></Link>
    </div>
  );
}
