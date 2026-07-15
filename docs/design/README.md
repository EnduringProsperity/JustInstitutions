# Handoff: JustInstitutions — Public Governance Analyzer (PGA)

Design handoff from Claude Designer → Claude Code. Contains both deliverables named in the front-end brief.

## Start here

1. **`front-end-spec.md`** — Deliverable 1. The complete spec: design framework, IA, all 9 screens, tokens, components, interactions, responsive rules, brief non-negotiables. Self-sufficient.
2. **`design-system/`** — Deliverable 2. Tokens (CSS custom properties), React component references (`.jsx` + `.d.ts` + `.prompt.md` each), visual guidelines, system readme.
3. **`screens/`** — HTML design references. Open `Master Canvas.dc.html` in a browser to see every adopted screen on one navigable canvas; each screen also opens standalone.
4. **`docs/`** — Source inputs (PRD, brief, domain model, example questions) for citation and context. The PRD, brief, and domain model carry a dated design-track amendment note: the patch methodology is now **seven steps** (Step 6 — Unintended consequences added; Pathway renumbered to 7).

## About the design files

The `.dc.html` files are **design references created in HTML** — high-fidelity prototypes showing intended look and behavior, not production code. `support.js` is the prototype runtime; do not ship it. The task is to **recreate these designs in the target codebase's environment** using its established patterns — or, if no front-end exists yet, choose the appropriate framework (the brief's SSR/SEO requirement points to a server-rendering framework) and implement there. The design system was established fresh in Designer and is intended to be synced toward the codebase: treat `design-system/tokens/*.css` as the canonical token source and port the `components/*.jsx` references into the codebase's component conventions.

## Fidelity

**High-fidelity** for layout, color, type, spacing, and copy register. All data values (scores, KPIs, budget figures, citations) are illustrative California samples — wire to real data.

## Suggested storage in the repo

```
docs/design/front-end-spec.md
docs/design/references/        ← screens/
src/styles/tokens/             ← design-system/tokens/
```
(or wherever the codebase keeps design docs — the spec is the durable artifact; screens are references.)
