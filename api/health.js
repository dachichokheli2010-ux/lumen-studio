import { getDb } from "./_lib/db.js";
import { handle, send } from "./_lib/http.js";

// Reports whether the database is configured and reachable.
export default handle(async (_req, res) => {
  const db = await getDb();
  await db.command({ ping: 1 });
  send(res, 200, { ok: true, db: db.databaseName });
});
