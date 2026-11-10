import { createHash, timingSafeEqual } from "node:crypto";
import { NotConfigured } from "./db.js";

const MAX_BODY = 32 * 1024;

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

// Vercel pre-parses JSON into req.body; the local dev server does not.
export async function readJson(req) {
  if (req.body !== undefined && req.body !== null && typeof req.body !== "string") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) throw Object.assign(new Error("Body too large"), { status: 413 });
  }
  return raw ? JSON.parse(raw) : {};
}

export function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  return (Array.isArray(fwd) ? fwd[0] : fwd || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
}

// IPs are stored only as salted hashes, for rate limiting.
export function hashIp(ip) {
  return createHash("sha256").update(`${process.env.IP_SALT || "lumen"}:${ip}`).digest("hex").slice(0, 32);
}

export function isAdmin(req) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) throw new NotConfigured("ADMIN_TOKEN is not set");
  const given = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given), b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Shared error mapping: a missing database or token is a 503, so the site can fall back.
export function handle(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof NotConfigured) return send(res, 503, { error: "not_configured", detail: err.message });
      if (err instanceof SyntaxError) return send(res, 400, { error: "bad_json" });
      if (err.status) return send(res, err.status, { error: err.message });
      console.error(err);
      send(res, 500, { error: "server_error" });
    }
  };
}

export function methods(req, res, allowed) {
  if (allowed.includes(req.method)) return true;
  res.setHeader("Allow", allowed.join(", "));
  send(res, 405, { error: "method_not_allowed" });
  return false;
}
