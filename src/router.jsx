import { useEffect, useState } from "react";

// Tiny history router: the home page holds every section; each section also has its own page.
export const PAGES = {
  ideas: "/ideas",
  services: "/services",
  ads: "/ads",
  price: "/pricing",
  process: "/process",
  faq: "/faq",
  contact: "/contact",
};
export const PAGE_ORDER = ["ideas", "services", "ads", "price", "process", "faq", "contact"];

export function pageFromPath(path) {
  const clean = path.replace(/\/+$/, "") || "/";
  return Object.keys(PAGES).find((k) => PAGES[k] === clean) || (clean === "/" ? "home" : "notfound");
}

export function navigate(to) {
  if (to === location.pathname) { scrollTo(0, 0); return; }
  history.pushState(null, "", to);
  dispatchEvent(new PopStateEvent("popstate"));
}

export function usePage() {
  const [page, setPage] = useState(() => pageFromPath(location.pathname));
  useEffect(() => {
    const on = () => setPage(pageFromPath(location.pathname));
    addEventListener("popstate", on);
    return () => removeEventListener("popstate", on);
  }, []);
  return page;
}

// A real link (works with new tab / copy link) that routes in place on a normal click.
export function Link({ to, onClick, ...props }) {
  const click = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={click} {...props} />;
}
