import { ObjectId } from "mongodb";
import { getDb } from "../_lib/db.js";
import { handle, isAdmin, methods, readJson, send } from "../_lib/http.js";
import { STATUSES } from "../_lib/validate.js";

// PATCH: move a request through new → contacted → won / lost, with a private note. DELETE: remove it.
export default handle(async (req, res) => {
  if (!methods(req, res, ["PATCH", "DELETE"])) return;
  if (!isAdmin(req)) return send(res, 401, { error: "unauthorized" });
  const id = req.query?.id;
  if (!id || !ObjectId.isValid(id)) return send(res, 400, { error: "bad_id" });
  const col = (await getDb()).collection("inquiries");
  const _id = new ObjectId(id);

  if (req.method === "DELETE") {
    const { deletedCount } = await col.deleteOne({ _id });
    return deletedCount ? send(res, 200, { ok: true }) : send(res, 404, { error: "not_found" });
  }

  const body = await readJson(req);
  const set = { updatedAt: new Date() };
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return send(res, 400, { error: "bad_status" });
    set.status = body.status;
  }
  if (body.note !== undefined) set.note = String(body.note).slice(0, 2000);
  const doc = await col.findOneAndUpdate({ _id }, { $set: set }, { returnDocument: "after", projection: { ipHash: 0, userAgent: 0 } });
  doc ? send(res, 200, { ok: true, item: doc }) : send(res, 404, { error: "not_found" });
});
