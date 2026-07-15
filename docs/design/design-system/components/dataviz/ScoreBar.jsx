export function ScoreBar({ label, score, max = 100, counts, style }) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(140px, 1fr) 2fr 44px", alignItems: "center", gap: 12, fontFamily: "var(--font-sans)", ...style }}>
      <span style={{ font: "500 13px var(--font-sans)", color: "var(--ink-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <div style={{ position: "relative", height: 8, background: "var(--bg-2)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${pct}%`, background: pct >= 70 ? "var(--pass)" : pct >= 45 ? "var(--partial)" : "var(--fail)", borderRadius: 99 }} />
      </div>
      <span style={{ font: "600 13px var(--font-mono)", fontVariantNumeric: "tabular-nums", color: "var(--ink-1)", textAlign: "right" }}>
        {score}
        {counts && <span style={{ font: "10px var(--font-mono)", color: "var(--ink-3)", display: "block" }}>{counts}</span>}
      </span>
    </div>
  );
}
