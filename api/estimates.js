import { getDb } from "./_lib/db.js";
import { handle, isAdmin, methods, readJson, send } from "./_lib/http.js";
import { cleanEstimate } from "./_lib/validate.js";

// POST: an anonymous record of a configuration someone priced (no personal data).
// GET: what people price, summarised for the studio (admin token required).
export default handle(async (req, res) => {
  if (!methods(req, res, ["POST", "GET"])) return;
  const col = (await getDb()).collection("estimates");

  if (req.method === "POST") {
    const body = await readJson(req);
    const est = cleanEstimate(body);
    if (!est) return send(res, 400, { error: "invalid" });
    await col.insertOne({ ...est, lang: body.lang === "ka" ? "ka" : "en", createdAt: new Date() });
    return send(res, 201, { ok: true });
  }

  if (!isAdmin(req)) return send(res, 401, { error: "unauthorized" });
  const [summary] = await col.aggregate([
    {
      $facet: {
        total: [{ $count: "n" }],
        avg: [{ $group: { _id: null, total: { $avg: "$total" } } }],
        byType: [{ $group: { _id: "$type", n: { $sum: 1 }, avg: { $avg: "$total" } } }, { $sort: { n: -1 } }],
        byFeature: [{ $unwind: "$features" }, { $group: { _id: "$features", n: { $sum: 1 } } }, { $sort: { n: -1 } }],
      },
    },
  ]).toArray();
  send(res, 200, {
    count: summary.total[0]?.n || 0,
    avgTotal: Math.round(summary.avg[0]?.total || 0),
    byType: summary.byType.map((t) => ({ type: t._id, n: t.n, avg: Math.round(t.avg) })),
    byFeature: summary.byFeature.map((f) => ({ feature: f._id, n: f.n })),
  });
});
