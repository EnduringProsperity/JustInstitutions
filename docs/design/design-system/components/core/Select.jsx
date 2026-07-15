const css = `
.ji-select{appearance:none;font:13.5px var(--font-sans);color:var(--ink-1);background:var(--bg-1) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23667' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center;border:1px solid var(--line-1);border-radius:var(--radius-2);padding:7px 30px 7px 10px;min-height:34px;box-shadow:var(--shadow-1);cursor:pointer;width:100%;box-sizing:border-box}
.ji-select:hover{border-color:var(--ink-3)}
.ji-select:focus{outline:2px solid var(--focus-ring);outline-offset:1px}
`;
if (typeof document !== "undefined" && !document.getElementById("ji-select-css")) {
  const s = document.createElement("style"); s.id = "ji-select-css"; s.textContent = css; document.head.appendChild(s);
}
export function Select({ options = [], label, style, ...rest }) {
  const sel = (
    <select className="ji-select" {...rest}>
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  );
  if (!label) return sel;
  return (
    <label className="ji-field" style={{ display: "flex", flexDirection: "column", gap: 5, fontFamily: "var(--font-sans)", ...style }}>
      <span style={{ font: "500 12.5px var(--font-sans)", color: "var(--ink-1)" }}>{label}</span>
      {sel}
    </label>
  );
}
