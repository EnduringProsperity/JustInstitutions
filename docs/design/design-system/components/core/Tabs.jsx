const css = `
.ji-tabs{display:flex;gap:2px;border-bottom:1px solid var(--line-1);font-family:var(--font-sans)}
.ji-tab{font:500 13px var(--font-sans);color:var(--ink-2);background:none;border:none;border-bottom:2px solid transparent;padding:8px 12px;margin-bottom:-1px;cursor:pointer;transition:color var(--dur) var(--ease)}
.ji-tab:hover{color:var(--ink-1)}
.ji-tab[aria-selected="true"]{color:var(--ink-1);border-bottom-color:var(--accent);font-weight:600}
.ji-tab:focus-visible{outline:2px solid var(--focus-ring);outline-offset:-2px}
.ji-tab .ct{font:11px var(--font-mono);color:var(--ink-3);margin-left:5px}
`;
if (typeof document !== "undefined" && !document.getElementById("ji-tabs-css")) {
  const s = document.createElement("style"); s.id = "ji-tabs-css"; s.textContent = css; document.head.appendChild(s);
}
export function Tabs({ tabs = [], active, onChange, style }) {
  return (
    <div className="ji-tabs" role="tablist" style={style}>
      {tabs.map((t) => {
        const id = typeof t === "string" ? t : t.id;
        const label = typeof t === "string" ? t : t.label;
        const count = typeof t === "object" ? t.count : undefined;
        return (
          <button key={id} role="tab" className="ji-tab" aria-selected={active === id} onClick={() => onChange && onChange(id)}>
            {label}{count !== undefined && <span className="ct">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
