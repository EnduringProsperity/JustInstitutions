const TONES = {
  neutral: { bg: "var(--bg-2)", fg: "var(--ink-2)", bd: "var(--line-1)" },
  accent: { bg: "var(--accent-wash)", fg: "var(--accent-strong)", bd: "var(--accent-line)" },
  pass: { bg: "var(--pass-wash)", fg: "var(--pass)", bd: "transparent" },
  partial: { bg: "var(--partial-wash)", fg: "var(--partial)", bd: "transparent" },
  gap: { bg: "var(--gap-wash)", fg: "var(--gap)", bd: "transparent" },
  fail: { bg: "var(--fail-wash)", fg: "var(--fail)", bd: "transparent" },
};
export function Badge({ tone = "neutral", mono, children, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: t.bg, color: t.fg,
      border: `1px solid ${t.bd}`, borderRadius: "var(--radius-1)", padding: "2px 7px",
      font: mono ? "500 11px var(--font-mono)" : "500 11.5px var(--font-sans)", lineHeight: 1.5, whiteSpace: "nowrap", ...style }}>
      {children}
    </span>
  );
}
