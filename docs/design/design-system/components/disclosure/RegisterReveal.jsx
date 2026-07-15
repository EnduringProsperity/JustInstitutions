export function RegisterReveal({ plain, expandLabel = "Show the evidence", children, defaultOpen = false, style }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ fontFamily: "var(--font-sans)", ...style }}>
      <p style={{ margin: 0, font: "var(--text-lg)/var(--leading-snug) var(--font-sans)", color: "var(--ink-1)", maxWidth: "var(--measure-plain)" }}>{plain}</p>
      <button onClick={() => setOpen(!open)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, background: "none",
          border: "none", padding: 0, cursor: "pointer", font: "600 12.5px var(--font-sans)", color: "var(--accent)" }}>
        <span style={{ display: "inline-block", transition: "transform 140ms var(--ease)", transform: open ? "rotate(90deg)" : "none", fontSize: 11 }}>▸</span>
        {open ? "Hide the evidence" : expandLabel}
      </button>
      {open && (
        <div style={{ marginTop: 12, paddingLeft: 14, borderLeft: "2px solid var(--line-1)",
          font: "var(--text-md)/var(--leading-body) var(--font-sans)", color: "var(--ink-1)" }}>
          {children}
        </div>
      )}
    </div>
  );
}
