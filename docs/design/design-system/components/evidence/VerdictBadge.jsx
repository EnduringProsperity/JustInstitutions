const V = {
  pass: { c: "var(--pass)", w: "var(--pass-wash)" },
  partial: { c: "var(--partial)", w: "var(--partial-wash)" },
  gap: { c: "var(--gap)", w: "var(--gap-wash)" },
  fail: { c: "var(--fail)", w: "var(--fail-wash)" },
};
export function VerdictBadge({ verdict = "pass", solid, style }) {
  const v = V[verdict] || V.pass;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6,
      background: solid ? v.c : v.w, color: solid ? "#fff" : v.c,
      borderRadius: "var(--radius-1)", padding: "2px 8px",
      font: "600 11px var(--font-mono)", lineHeight: 1.6, letterSpacing: "0.02em", whiteSpace: "nowrap", ...style }}>
      <span style={{ width: 6, height: 6, borderRadius: verdict === "gap" ? 0 : "50%",
        transform: verdict === "gap" ? "rotate(45deg)" : "none",
        background: solid ? "#fff" : v.c, opacity: solid ? 0.85 : 1,
        border: "none", flex: "none" }} />
      {verdict}
    </span>
  );
}
