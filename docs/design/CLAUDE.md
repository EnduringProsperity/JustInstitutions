# CLAUDE.md — JustInstitutions design handoff

This folder is a **design handoff package**, not production code. Read in this order:

1. `README.md` — package map and ground rules.
2. `front-end-spec.md` — the authoritative spec: design framework, IA, all screens, tokens, components, interactions, responsive rules.
3. `design-system/` — canonical tokens (`tokens/*.css`) and React component references (`components/**/*.jsx` + `.d.ts` + `.prompt.md`).
4. `screens/` — HTML prototypes (`.dc.html`). Open in a browser as visual reference only.
5. `docs/` — source PRD, front-end brief, domain model, example questions.

## Implementation rules

- **Do not ship anything from `screens/`.** `support.js` is a prototype runtime; `.dc.html` markup is reference-only. Recreate the designs in this codebase's framework and conventions (if none exists, pick a server-rendering framework — the brief requires SSR/SEO for public permalinks).
- **Tokens are canonical.** Port `design-system/tokens/*.css` as-is (CSS custom properties) and build all styling on them. Never hard-code a color/space/type value the tokens already define.
- **Components:** use `design-system/components/**` as the reference API surface; each has a `.prompt.md` describing intent and states. Adapt to local component conventions rather than copying files verbatim.
- **Copy and vocabulary are final-intent.** Preserve register (Plain/Expert) wording, C-band vocabulary, and the band-locked honesty rules (gap ≠ fail; never "causes").
- **Data is illustrative.** All scores, KPIs, budget figures, and citations in the prototypes are California sample data — wire to real data sources.
- **Routing:** the prototypes are wired as a clickthrough (`.dc.html` links mirror the intended routes in the spec's IA section). Links marked `href="#"` with `title="Not in prototype scope"` are real product surfaces (Methodology, search, help, profile, exports) that were out of prototype scope — stub them, don't drop them.
- Every view must have a stable, shareable URL; Vulnerability Pages (`/v/VLN-…`) must render complete for signed-out visitors with Open Graph metadata.
