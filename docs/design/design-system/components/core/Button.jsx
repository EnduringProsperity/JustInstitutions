const css = `
.ji-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-family:var(--font-sans);font-weight:500;border-radius:var(--radius-2);border:1px solid transparent;cursor:pointer;transition:background var(--dur) var(--ease),border-color var(--dur) var(--ease);white-space:nowrap}
.ji-btn:focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}
.ji-btn[disabled]{opacity:.45;cursor:not-allowed}
.ji-btn-md{font-size:13.5px;padding:7px 14px;min-height:34px}
.ji-btn-sm{font-size:12.5px;padding:4px 10px;min-height:27px}
.ji-btn-lg{font-size:15px;padding:10px 20px;min-height:42px}
.ji-btn-primary{background:var(--accent);color:var(--on-accent)}
.ji-btn-primary:hover:not([disabled]){background:var(--accent-strong)}
.ji-btn-secondary{background:var(--bg-1);color:var(--ink-1);border-color:var(--line-1);box-shadow:var(--shadow-1)}
.ji-btn-secondary:hover:not([disabled]){background:var(--bg-3)}
.ji-btn-ghost{background:transparent;color:var(--ink-2)}
.ji-btn-ghost:hover:not([disabled]){background:var(--bg-3);color:var(--ink-1)}
.ji-btn-danger{background:var(--fail);color:#fff}
.ji-btn-danger:hover:not([disabled]){filter:brightness(.92)}
`;
if (typeof document !== "undefined" && !document.getElementById("ji-btn-css")) {
  const s = document.createElement("style"); s.id = "ji-btn-css"; s.textContent = css; document.head.appendChild(s);
}
export function Button({ variant = "primary", size = "md", disabled, children, ...rest }) {
  return (
    <button className={`ji-btn ji-btn-${size} ji-btn-${variant}`} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
