const BANDS = {
  0: { c: "var(--conf-0)", name: "Gap", phrase: "no rule governs this" },
  1: { c: "var(--conf-1)", name: "Association", phrase: "moves together with" },
  2: { c: "var(--conf-2)", name: "Supported", phrase: "evidence supports a link" },
  3: { c: "var(--conf-3)", name: "Strong", phrase: "strong association" },
};
export function ConfidencePill({ band = 1, showName = true, style }) {
  const b = BANDS[band] || BANDS[1];
  return (
    <span title={`C${band} ${b.name} — band-locked language: "${b.phrase}". Never "proven".`}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${b.c}`,
        color: b.c, borderRadius: 99, padding: "1.5px 8px 1.5px 4px",
        font: "600 10.5px var(--font-mono)", lineHeight: 1.7, whiteSpace: "nowrap", cursor: "help", background: "var(--bg-1)", ...style }}>
      <span style={{ display: "inline-flex", gap: 1.5 }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ width: 3.5, height: 9, borderRadius: 1, background: i <= band ? b.c : "var(--line-1)" }} />
        ))}
      </span>
      C{band}{showName ? ` ${b.name}` : ""}
    </span>
  );
}
