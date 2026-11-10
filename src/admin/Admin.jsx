import { useCallback, useEffect, useState } from "react";
import { TYPES, FEATURES, fmt } from "../data.js";

const STATUSES = ["new", "contacted", "won", "lost"];
const KEY = "lumen-admin-token";
const typeName = (id) => TYPES.find((t) => t.id === id)?.name.en || id;
const featName = (id) => FEATURES.find((f) => f.id === id)?.name.en || id;
const when = (d) => new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function useApi(token, onAuthFail) {
  return useCallback(async (path, opts = {}) => {
    const res = await fetch(path, {
      ...opts,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...opts.headers },
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 401) onAuthFail();
    if (!res.ok) throw Object.assign(new Error(body.error || res.statusText), { status: res.status, body });
    return body;
  }, [token, onAuthFail]);
}

function Login({ onToken, error }) {
  const [value, setValue] = useState("");
  return (
    <main className="adm-login">
      <p className="adm-brand">LUMEN</p>
      <h1 className="h2">Requests</h1>
      <form onSubmit={(e) => { e.preventDefault(); if (value.trim()) onToken(value.trim()); }}>
        <label className="fld">
          <span className="fld-label">Admin token</span>
          <input type="password" autoComplete="current-password" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
          <span className="fld-error" role="alert">{error}</span>
        </label>
        <button className="btn btn-flare" type="submit">Open</button>
      </form>
    </main>
  );
}

function Inquiry({ item, api, onChange, onRemove }) {
  const [note, setNote] = useState(item.note || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const est = item.estimate;
  const isEmail = item.contact.includes("@");

  const patch = async (body) => {
    setBusy(true); setErr("");
    try { onChange((await api(`/api/inquiries/${item._id}`, { method: "PATCH", body: JSON.stringify(body) })).item); }
    catch (e) { setErr(`Could not save (${e.message}).`); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (!confirm(`Delete the request from ${item.name}? This cannot be undone.`)) return;
    setBusy(true);
    try { await api(`/api/inquiries/${item._id}`, { method: "DELETE" }); onRemove(item._id); }
    catch (e) { setErr(`Could not delete (${e.message}).`); setBusy(false); }
  };

  return (
    <article className={`adm-card is-${item.status}`}>
      <header className="adm-card-head">
        <div>
          <h2>{item.name}</h2>
          <p className="adm-meta">
            <a href={isEmail ? `mailto:${item.contact}` : `tel:${item.contact.replace(/[^\d+]/g, "")}`}>{item.contact}</a>
            {item.business && <> · {item.business}</>} · {when(item.createdAt)} · {item.lang.toUpperCase()}
          </p>
        </div>
        <div className="adm-status" role="group" aria-label="Status">
          {STATUSES.map((s) => (
            <button key={s} type="button" aria-pressed={item.status === s} disabled={busy} onClick={() => patch({ status: s })}>{s}</button>
          ))}
        </div>
      </header>
      <p className="adm-msg">{item.message}</p>
      {est && (
        <dl className="adm-est">
          <div><dt>Estimate</dt><dd className="adm-total">{fmt(est.total)}</dd></div>
          <div><dt>Project</dt><dd>{typeName(est.type)}, {est.pages} pages</dd></div>
          <div><dt>Features</dt><dd>{est.features.length ? est.features.map(featName).join(", ") : "None"}</dd></div>
          <div><dt>Timeline</dt><dd>{est.weeks[0]}–{est.weeks[1]} weeks{est.speed > 1 ? ` (×${est.speed})` : ""}{est.care ? " · care plan" : ""}</dd></div>
          {est.style && <div><dt>Style</dt><dd>{est.style}</dd></div>}
        </dl>
      )}
      <div className="adm-note">
        <textarea rows="2" placeholder="Private note" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Private note" />
        <div className="adm-actions">
          <button type="button" className="btn btn-line btn-sm" disabled={busy || note === (item.note || "")} onClick={() => patch({ note })}>Save note</button>
          <button type="button" className="adm-delete" disabled={busy} onClick={remove}>Delete</button>
        </div>
        {err && <p className="fld-error" role="alert">{err}</p>}
      </div>
    </article>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => { try { return sessionStorage.getItem(KEY) || ""; } catch { return ""; } });
  const [authError, setAuthError] = useState("");
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const logout = useCallback((msg = "") => {
    try { sessionStorage.removeItem(KEY); } catch {}
    setToken(""); setData(null); setAuthError(msg);
  }, []);
  const api = useApi(token, useCallback(() => logout("That token was not accepted."), [logout]));

  const load = useCallback(async () => {
    if (!token) return;
    setError("");
    try {
      const q = filter === "all" ? "" : `?status=${filter}`;
      const [list, est] = await Promise.all([api(`/api/inquiries${q}`), api("/api/estimates")]);
      setData(list); setStats(est);
      try { sessionStorage.setItem(KEY, token); } catch {}
    } catch (e) {
      if (e.status === 503) setError("The database is not connected yet. Set MONGODB_URI and ADMIN_TOKEN in Vercel, then redeploy.");
      else if (e.status !== 401) setError(`Could not load requests (${e.message}).`);
    }
  }, [api, filter, token]);

  useEffect(() => { load(); }, [load]);

  if (!token) return <Login onToken={(t) => { setAuthError(""); setToken(t); }} error={authError} />;

  const counts = data?.counts || {};
  const all = STATUSES.reduce((s, k) => s + (counts[k] || 0), 0);
  const replace = (item) => setData((d) => ({ ...d, items: d.items.map((x) => (x._id === item._id ? item : x)) }));
  const remove = (id) => setData((d) => ({ ...d, items: d.items.filter((x) => x._id !== id) }));

  return (
    <main className="adm wrap">
      <header className="adm-top">
        <div>
          <p className="adm-brand">LUMEN</p>
          <h1 className="h2">Requests</h1>
        </div>
        <div className="adm-top-actions">
          <button type="button" className="btn btn-line btn-sm" onClick={load}>Refresh</button>
          <button type="button" className="btn btn-line btn-sm" onClick={() => logout()}>Sign out</button>
        </div>
      </header>

      {stats && (
        <section className="adm-stats" aria-label="Estimator activity">
          <div><span>{stats.count}</span><p>estimates priced</p></div>
          <div><span>{stats.count ? fmt(stats.avgTotal) : "—"}</span><p>average estimate</p></div>
          <div><span>{stats.byType[0] ? typeName(stats.byType[0].type) : "—"}</span><p>most priced project</p></div>
          <div><span>{stats.byFeature[0] ? featName(stats.byFeature[0].feature) : "—"}</span><p>most added feature</p></div>
        </section>
      )}

      <div className="chips adm-filter" role="group" aria-label="Filter by status">
        {["all", ...STATUSES].map((s) => (
          <button key={s} type="button" className="chip" aria-pressed={filter === s} onClick={() => setFilter(s)}>
            {s} {s === "all" ? all : counts[s] || 0}
          </button>
        ))}
      </div>

      {error && <p className="adm-error" role="alert">{error}</p>}
      {!data && !error && <p className="adm-empty">Loading…</p>}
      {data && data.items.length === 0 && (
        <p className="adm-empty">{filter === "all" ? "No requests yet. They appear here as soon as someone sends the contact form." : `Nothing marked “${filter}”.`}</p>
      )}
      <div className="adm-list">
        {data?.items.map((item) => <Inquiry key={item._id} item={item} api={api} onChange={replace} onRemove={remove} />)}
      </div>
    </main>
  );
}
