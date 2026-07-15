const css = `
.ji-input{font:13.5px var(--font-sans);color:var(--ink-1);background:var(--bg-1);border:1px solid var(--line-1);border-radius:var(--radius-2);padding:7px 10px;min-height:34px;box-shadow:var(--shadow-1);transition:border-color var(--dur) var(--ease);width:100%;box-sizing:border-box}
.ji-input::placeholder{color:var(--ink-3)}
.ji-input:hover{border-color:var(--ink-3)}
.ji-input:focus{outline:2px solid var(--focus-ring);outline-offset:1px;border-color:var(--accent)}
.ji-input[disabled]{opacity:.45;background:var(--bg-2)}
.ji-field{display:flex;flex-direction:column;gap:5px;font-family:var(--font-sans)}
.ji-label{font:500 12.5px var(--font-sans);color:var(--ink-1)}
.ji-hint{font:11.5px var(--font-sans);color:var(--ink-3)}
`;
if (typeof document !== "undefined" && !document.getElementById("ji-input-css")) {
  const s = document.createElement("style"); s.id = "ji-input-css"; s.textContent = css; document.head.appendChild(s);
}
export function Input({ label, hint, style, ...rest }) {
  const input = <input className="ji-input" {...rest} />;
  if (!label && !hint) return input;
  return (
    <label className="ji-field" style={style}>
      {label && <span className="ji-label">{label}</span>}
      {input}
      {hint && <span className="ji-hint">{hint}</span>}
    </label>
  );
}
