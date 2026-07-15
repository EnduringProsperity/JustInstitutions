export function Checkbox({ label, checked, onChange, disabled, description }) {
  return (
    <label style={{ display: "flex", gap: 9, alignItems: "flex-start", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, fontFamily: "var(--font-sans)" }}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}
        style={{ appearance: "auto", accentColor: "var(--accent)", width: 15, height: 15, marginTop: 2, cursor: "inherit" }} />
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ font: "500 13px var(--font-sans)", color: "var(--ink-1)" }}>{label}</span>
        {description && <span style={{ font: "11.5px/1.45 var(--font-sans)", color: "var(--ink-3)" }}>{description}</span>}
      </span>
    </label>
  );
}
