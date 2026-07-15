window.__dsCardLoad = function(dir, names){
  for (const k of Object.keys(window)) { try { const v = window[k]; if (v && typeof v === "object" && v[names[0]]) return v; } catch(e){} }
  const reg = {};
  const load = (name) => {
    if (reg[name]) return reg[name];
    const xhr = new XMLHttpRequest();
    xhr.open("GET", dir + name + ".jsx", false);
    xhr.send();
    const out = Babel.transform(xhr.responseText, { presets: [["react", { runtime: "classic" }]], plugins: [["transform-modules-commonjs"]] }).code;
    const module = { exports: {} };
    const req = (p) => { if (p === "react" || p === "react/jsx-runtime") return window.React; return load(p.replace(/^\.\//, "").replace(/\.jsx$/, "")); };
    new Function("module", "exports", "require", "React", out)(module, module.exports, req, window.React);
    reg[name] = module.exports;
    return module.exports;
  };
  const api = {};
  names.forEach((n) => { try { Object.assign(api, load(n)); } catch(e) { console.error("cardBoot failed for", n, e); } });
  return api;
};