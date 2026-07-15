export function HeatCell({ level = 1, label, value, size = 44, onClick, style }) {
  const heat = `var(--heat-${Math.min(5, Math.max(1, level))})`;
  const dark = level >= 5;
  return (
    <button onClick={onClick} title={label}
      style={{ width: size, height: size, background: heat, border: "1px solid oklch(100% 0 0 / 0.5)",
        borderRadius: 2, cursor: onClick ? "pointer" : "default", display: "inline-flex", alignItems: "center",
        justifyContent: "center", font: "600 11px var(--font-mono)", fontVariantNumeric: "tabular-nums",
        color: dark ? "#fff" : "var(--ink-1)", padding: 0, ...style }}>
      {value}
    </button>
  );
}
