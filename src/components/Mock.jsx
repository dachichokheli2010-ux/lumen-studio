// Miniature, fully typeset site in a template's own look. Scales with its container.
export default function Mock({ tpl, big = false }) {
  const { look } = tpl;
  const style = {
    "--m-bg": look.bg,
    "--m-fg": look.fg,
    "--m-accent": look.accent,
    "--m-soft": look.soft,
    "--m-art": look.art,
  };
  const cells = tpl.layout === "shop" ? 4 : 3;
  return (
    <div className={`mock mock-${tpl.layout} mock-font-${look.font}${big ? " mock-big" : ""}`} style={style}>
      <div className="mk-bar">
        <i /><i /><i />
        <span>{tpl.domain}</span>
      </div>
      <div className="mk-page">
        <div className="mk-nav">
          <b>{tpl.name}</b>
          <span>{tpl.nav.map((n) => <em key={n}>{n}</em>)}</span>
        </div>
        <div className="mk-art" />
        <div className="mk-hero">
          <h4>{tpl.headline}</h4>
          <p className="mk-sub">{tpl.sub}</p>
          <span className="mk-btn">{tpl.nav[tpl.nav.length - 1]}</span>
        </div>
        <div className="mk-grid">
          {Array.from({ length: cells }, (_, i) => <i key={i} />)}
        </div>
      </div>
    </div>
  );
}
