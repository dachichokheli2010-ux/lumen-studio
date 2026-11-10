import { TYPES, FEATURES, SPEEDS, estimate } from "../../src/data.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isPhone = (v) => /^[+()\d\s.-]+$/.test(v) && v.replace(/\D/g, "").length >= 7;
const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export const STATUSES = ["new", "contacted", "won", "lost"];

// Rebuilds an estimate from its inputs so a stored price is always the real one.
export function cleanEstimate(e) {
  if (!e || typeof e !== "object") return null;
  if (!TYPES.some((t) => t.id === e.type)) return null;
  const pages = Math.min(Math.max(Math.round(Number(e.pages) || 1), 1), 25);
  const speed = SPEEDS.includes(Number(e.speed)) ? Number(e.speed) : 1;
  const ids = Array.isArray(e.features) ? e.features.filter((id) => FEATURES.some((f) => f.id === id)) : [];
  const feats = new Set(ids);
  const q = estimate({ type: e.type, pages, feats, speed });
  return {
    type: e.type,
    pages,
    features: [...feats],
    speed,
    care: Boolean(e.care),
    style: str(e.style, 40) || null,
    total: q.total,
    weeks: q.weeks,
  };
}

// Same rules as the contact form, enforced again on the server.
export function cleanInquiry(body) {
  const data = {
    name: str(body.name, 120),
    contact: str(body.contact, 160),
    business: str(body.business, 160),
    message: str(body.message, 4000),
    lang: body.lang === "ka" ? "ka" : "en",
  };
  const errors = {};
  if (!data.name) errors.name = "required";
  if (!data.contact) errors.contact = "required";
  else if (!EMAIL.test(data.contact) && !isPhone(data.contact)) errors.contact = "invalid";
  if (!data.message) errors.message = "required";
  return { data, errors, estimate: cleanEstimate(body.estimate), trap: str(body.website, 200) };
}
