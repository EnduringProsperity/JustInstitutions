export function VintageStamp({ corpus, asOf, kpiYear, refreshHref, style }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, font: "11px var(--font-mono)",
      color: "var(--ink-2)", background: "var(--bg-2)", border: "1px solid var(--line-2)",
      borderRadius: "var(--radius-1)", padding: "3px 9px", whiteSpace: "nowrap", ...style }}>
      {corpus && <span>corpus {corpus}</span>}
      {asOf && <span style={{ color: "var(--ink-3)" }}>law as of {asOf}</span>}
      {kpiYear && <span style={{ color: "var(--ink-3)" }}>KPI data {kpiYear}</span>}
      {refreshHref && <a href={refreshHref} style={{ color: "var(--accent)", textDecoration: "none" }}>refresh →</a>}
    </span>
  );
}
