export function AIMark({ compact, style }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "500 11px var(--font-sans)",
      color: "var(--ai-mark)", background: "var(--gap-wash)", border: "1px dashed var(--ai-mark)",
      borderRadius: "var(--radius-1)", padding: "2px 8px", whiteSpace: "nowrap", ...style }}>
      <span style={{ width: 6, height: 6, background: "var(--ai-mark)", transform: "rotate(45deg)", flex: "none" }} />
      {compact ? "AI-drafted" : "AI-drafted — requires expert review"}
    </span>
  );
}
