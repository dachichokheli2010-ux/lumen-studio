import { getDb } from "./_lib/db.js";
import { clientIp, handle, hashIp, isAdmin, methods, readJson, send } from "./_lib/http.js";
import { cleanInquiry, STATUSES } from "./_lib/validate.js";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// POST: a visitor sends a request. GET: the studio lists requests (admin token required).
export default handle(async (req, res) => {
  if (!methods(req, res, ["POST", "GET"])) return;
  return req.method === "POST" ? create(req, res) : list(req, res);
});

async function create(req, res) {
  const { data, errors, estimate, trap } = cleanInquiry(await readJson(req));
  if (trap) return send(res, 201, { ok: true }); // honeypot filled: a bot, quietly ignored
  if (Object.keys(errors).length) return send(res, 400, { error: "invalid", fields: errors });

  const db = await getDb();
  const col = db.collection("inquiries");
  const ipHash = hashIp(clientIp(req));
  const recent = await col.countDocuments({ ipHash, createdAt: { $gt: new Date(Date.now() - WINDOW_MS) } });
  if (recent >= MAX_PER_WINDOW) return send(res, 429, { error: "too_many" });

  const doc = {
    ...data,
    estimate,
    status: "new",
    note: "",
    ipHash,
    userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const { insertedId } = await col.insertOne(doc);
  send(res, 201, { ok: true, id: insertedId });
}

async function list(req, res) {
  if (!isAdmin(req)) return send(res, 401, { error: "unauthorized" });
  const url = new URL(req.url, "http://x");
  const status = url.searchParams.get("status");
  const limit = Math.min(Number(url.searchParams.get("limit")) || 100, 500);
  const filter = STATUSES.includes(status) ? { status } : {};
  const db = await getDb();
  const col = db.collection("inquiries");
  const [items, counts] = await Promise.all([
    col.find(filter, { projection: { ipHash: 0, userAgent: 0 } }).sort({ createdAt: -1 }).limit(limit).toArray(),
    col.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]).toArray(),
  ]);
  send(res, 200, { items, counts: Object.fromEntries(counts.map((c) => [c._id, c.n])) });
}
