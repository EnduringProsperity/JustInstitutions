export function Card({ title, meta, children, pad = true, style, dark }) {
  return (
    <section style={{
      background: dark ? "var(--ink-surface)" : "var(--surface-card)",
      color: dark ? "var(--on-ink)" : "var(--ink-1)",
      border: dark ? "1px solid transparent" : "1px solid var(--line-1)",
      borderRadius: "var(--radius-3)", boxShadow: "var(--shadow-1)",
      fontFamily: "var(--font-sans)", overflow: "hidden", ...style }}>
      {(title || meta) && (
        <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12,
          padding: "12px 16px", borderBottom: dark ? "1px solid var(--ink-surface-2)" : "1px solid var(--line-2)" }}>
          {title && <h3 style={{ margin: 0, font: "600 14px var(--font-sans)" }}>{title}</h3>}
          {meta && <span style={{ font: "11px var(--font-mono)", color: dark ? "var(--on-ink-dim)" : "var(--ink-3)" }}>{meta}</span>}
        </header>
      )}
      <div style={{ padding: pad ? "14px 16px" : 0 }}>{children}</div>
    </section>
  );
}
