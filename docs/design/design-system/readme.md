# JustInstitutions Design System

**JustInstitutions** (working name — product naming TBD, see business/naming.md; wordmark is plain type, no logo exists yet) is a public-interest platform that treats a jurisdiction's body of rules like software: **Test** the rule system for vulnerabilities, **Explore** outcomes (KPIs), spending (Money), comparisons and the law itself, **Design** feasibility-scored patches — then re-Test.

Sources: `uploads/front-end-brief.md` (design handoff), `uploads/prd.md`, `uploads/project-brief.md`, `uploads/domain-model.md` (methodology: test blocks A–L, KPI catalog, confidence model), `uploads/example-questions.md` (prompt library). Deliverables from this track: this design system + `docs/front-end-spec.md`.

## Design position

**Modern research tool** — cool neutrals, precise sans, data-forward (Observable/Linear kin), desktop-first. One product serving two registers: plain-language surface for The People, expert depth on demand for Institutional Stewards. Progressive disclosure is the core design pattern, not a feature.

## ACCESS TIERS (decision 2026-07-15 — supersedes brief's "free, no account to browse")

All three tiers require registration:
1. **Free** — limited by activity cap or trial days, then maxes out.
2. **The Public** — minimum fee (cost-covering); see PRD definitions.
3. **Institutional Stewards** — see PRD definitions.

Open note: Journalists may move from Stewards to The Public. Landing header now shows Sign in + Register; "no account" copy removed product-wide.

## DESIGN FRAMEWORK — 8 principles (converged 2026-07)

1. **Responsive** — one layout system that reflows: desktop research posture first, grids collapse gracefully, plain register must read on a phone (findings are the shared artifact).
2. **Two registers, one voice** — plain surface, expert depth one page-level toggle away (pattern 1h).
3. **Provenance travels with the fragment** — every card carries its own micro-stamp; hover opens the full ladder (pattern 1f).
4. **Progressive disclosure over navigation** — depth in place (hover ladders, drawers, all-steps-visible config), not separate pages.
5. **Band-locked honesty** — words and colors never exceed the evidence: C0–C3 vocabulary, gap ≠ fail, "causes" never appears.
6. **Visible workflow state** — numbered steps, status bars, run tickets: the system always says where it is (pattern 2a).
7. **Data is the imagery** — no illustration; display-size numbers, flat washes, hierarchy from borders not elevation.
8. **Every view is addressable** — stable URLs; IDs, run numbers, vintages live in running text as citable objects.

## CONTENT FUNDAMENTALS

- **Two registers, one voice.** Every surface leads in plain language (short declarative sentences, no jargon, concrete local examples: "my county", "your rent"), with expert depth one interaction away. Never dumb down the expert layer; never let jargon leak into the plain layer.
- **Band-locked language.** Attribution claims use only the vocabulary their confidence band allows: C0 "no rule governs this", C1 "moves together with", C2 "evidence supports a link", C3 "strong association". The words "causes" / "proven" never appear.
- **Verdicts are technical terms**: pass / partial / gap / fail, always lowercase in UI chips, and a Gap is *not* a Fail — copy must preserve the distinction ("nothing governs this" vs "the rule fails the test").
- **Accountable, not partisan.** Questions with a villain or a surprise ("Who benefits from my state's tax carve-outs?") — but the methodology answers, never editorializes. Skeptic prompts are first-class.
- **Sentence case everywhere.** Uppercase reserved for mono microlabels (CORPUS V41 · LAW AS OF 2026-05-01). No emoji. No exclamation points.
- **Provenance is copy.** Citations, vintages, and version numbers appear in running UI text as mono chips — they are part of the sentence, not a footnote.
- **AI-drafted language is marked** ("AI-drafted — requires expert review") wherever patch/legislation text appears.

## VISUAL FOUNDATIONS

- **Color:** subtly cool near-white page (`--bg-0`), white cards, blue-gray ink ramp. One civic-blue accent (`--accent`, oklch 51% .14 255). Verdict palette: pass green / partial amber / **gap violet** / fail red — gap is deliberately a different hue family from fail. Confidence C0–C3 is a single blue ramp (gray → deep blue). Heat ramp `--heat-1..5` for scorecards. Dark ink panels (`--ink-surface`) reserved for executive scorecards and the score itself.
- **Type:** IBM Plex trio. **Sans** for all UI; **Mono** for data, IDs (VLN-00142), vintages, verdict chips, microlabels (uppercase, +0.08em); **Serif** exclusively for quoted rule text — the law itself always renders in serif, so source text is visually unmistakable from our analysis.
- **Numbers are display.** Scores and KPIs render huge (`--text-3xl/4xl`, tight tracking, tabular-nums); everything else stays dense (13–14.5px).
- **Spacing:** 4px scale, dense research-tool rhythm; prose measures capped (`--measure`, plain register narrower).
- **Shape:** small radii (3/6/10px), 1px cool borders; shadows are whisper-quiet (`--shadow-1/2`) — hierarchy comes from borders and washes, not elevation. No gradients.
- **Backgrounds:** flat washes only. No imagery, no illustration, no texture. Data visualizations are the imagery of this brand.
- **Interaction:** 140ms ease; hover = wash tint (`--bg-3`) or accent underline; press = darker fill, no shrink. Focus = 2px `--focus-ring` outline, offset 2px. Links underlined, accent-colored.
- **Every view carries its provenance**: a vintage stamp (corpus/data version + as-of date) and, where claims are attributed, a confidence pill. These are systematized components, never ad-hoc text.

## ICONOGRAPHY

No proprietary icon set exists. Use **Lucide** (CDN) at 1.5px stroke, 16/20px, `currentColor` — its precision matches Plex. Unicode arrows (→ ↗) permitted in running text and links. No emoji, ever. No logo exists: render "JustInstitutions" in Plex Sans 600 wherever a mark would go (see Brand card).

## Index

- `styles.css` → `tokens/` (colors, typography, spacing, effects, fonts)
- `guidelines/` — foundation specimen cards (Design System tab)
- `components/core/` — Button, Input, Select, Checkbox, Tabs, Card, Badge
- `components/evidence/` — VerdictBadge, ConfidencePill, ProvenanceCite, VintageStamp, AIMark
- `components/disclosure/` — RegisterReveal (the two-register pattern)
- `components/dataviz/` — HeatCell, ScoreBar
- `Test Flow Explorations.dc.html` — first-pass design explorations (config, job status, vintage/confidence, register)
- `docs/front-end-spec.md` — UX spec (written after key screens land)

## Intentional additions

All components are additions by definition (no prior source); the evidence/ and disclosure/ families exist because the brief's hard principles (provenance, confidence bands, two registers) demand systematized primitives.
