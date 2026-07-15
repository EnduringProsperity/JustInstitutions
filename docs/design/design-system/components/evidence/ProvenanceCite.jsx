export function ProvenanceCite({ cite, href = "#", quote, style }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <a href={href} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        style={{ font: "500 11px var(--font-mono)", color: "var(--accent-strong)", background: "var(--accent-wash)",
          border: "1px solid var(--accent-line)", borderRadius: "var(--radius-1)", padding: "1px 6px",
          textDecoration: "none", whiteSpace: "nowrap" }}>
        {cite}
      </a>
      {quote && open && (
        <span style={{ position: "absolute", left: 0, top: "calc(100% + 6px)", zIndex: 40, width: 340,
          background: "var(--bg-1)", border: "1px solid var(--line-1)", borderRadius: "var(--radius-3)",
          boxShadow: "var(--shadow-pop)", padding: "12px 14px", display: "block" }}>
          <span style={{ display: "block", font: "italic 13.5px/1.55 var(--font-serif)", color: "var(--ink-1)" }}>"{quote}"</span>
          <span style={{ display: "block", marginTop: 8, font: "10.5px var(--font-mono)", color: "var(--ink-3)" }}>{cite} · open source text →</span>
        </span>
      )}
    </span>
  );
}
