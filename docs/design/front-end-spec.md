# Front-End Spec — JustInstitutions (PGA)

> Deliverable 1 of 2 named in the front-end brief. Companion to Deliverable 2, the **design system** (`design-system/` in this package: tokens, components, guidelines, readme). Designed in Claude Designer, July 2026. Product name TBD — plain-type wordmark placeholder "JustInstitutions".
>
> The `screens/*.dc.html` files are **design references** (HTML prototypes showing intended look and behavior), not production code. Recreate them in the target codebase's environment using its patterns; the spec + tokens are the source of truth.

## Fidelity

**High-fidelity.** Colors, type, spacing, and copy register are final-intent. Data values are illustrative (California sample). Recreate pixel-perfectly, wired to real data.

## Design framework — 8 principles

1. **Responsive** — desktop research posture first; grids collapse gracefully; plain register must read on a phone (findings are the shared artifact).
2. **Two registers, one voice** — plain surface, expert depth one page-level toggle away. Same citations in both; only the prose changes.
3. **Provenance travels with the fragment** — every card/claim carries a micro-stamp (source · vintage); hover opens the full provenance ladder (source → vintage → method → corpus version).
4. **Progressive disclosure over navigation** — depth in place (hover ladders, expanding rows, all-steps-visible config), not separate pages.
5. **Band-locked honesty** — words and colors never exceed the evidence: C0–C3 attribution vocabulary, gap ≠ fail, the word "causes" never appears.
6. **Visible workflow state** — numbered steps, status bars, run tickets: the system always says where it is.
7. **Data is the imagery** — no illustration; display-size numbers, flat washes, hierarchy from borders not elevation.
8. **Every view is addressable** — stable URLs; IDs (VLN-00142, PATCH-0091, RUN-01847), run numbers, and vintages appear in running text as citable objects.

## Information architecture

**Landing** (`/`) sits above the app sections as the signed-out entry point; its header nav links into **Test · Explore · Design · Methodology**, and its persona cards and question chips deep-link to specific views.

Primary nav (left, in 52px header): **Test · Explore · Design**. Explore has a segmented sub-nav (pill group in header): **Outcomes · Money · Compare · The Law**. Upper right, signed in: search, help, profile dropdown; signed out: **Sign in** (outline) + **Register** (accent fill) — all tiers require registration. Right edge of header: context stamp in mono (corpus version, vintage).

Core loop: Test (configure → report → block detail) → Explore (outcomes, money, compare, law) → Design (patch) → re-Test.

A test run's results are **three tabs under one page title**: Test Report · Vulnerability Explorer (all findings, filterable) · Rollup (sub-jurisdictions). Every finding also has a standalone permalink — the **Vulnerability Page** at `/v/VLN-…` — which is the product's most-shared artifact and is reachable from any finding card, explorer row, or external link without entering the Test flow.

## Screens

Each screen below exists as a `.dc.html` reference in `screens/`. Layout constants shared by all: header 52px, `--bg-1` on `--line-1` bottom border; content in a centered max-width main (900–1220px by density); cards are `--bg-1`, 1px `--line-1`, radius 10px, `--shadow-1`.

### 0 · Landing (`Landing Page.dc.html`)
Signed-out entry point, `--bg-0` page (no card chrome until content). 56px header: wordmark, nav (Test · Explore · Design · Methodology), Sign in + Register right. Sections top to bottom:
- **Hero** (centered, max 920): mono coverage overline (jurisdiction counts · corpus · vintage), 52px display headline ("Strengthen your government."), one-paragraph plain-register promise, then the **ask box** — search input whose placeholder rotates through viral example questions (3.8s interval, from example-questions.md) with an accent **Ask** button — and a row of 3 question chips (pill links).
- **Live scores**: auto-fit card grid (min 200px); per jurisdiction — name, delta chip vs prior corpus, 36px score, pass/partial/gap/fail stacked distribution bar, mono run stamp. Cards link to that jurisdiction's Test Report.
- **Start where you stand** (persona entries): auto-fit grid (min 320px) of 6 cards — mono persona tag (I LIVE HERE / STUDENT · TEACHER / JOURNALIST / RESEARCHER / ADVOCATE / STAFFER · OFFICIAL), a quoted example question, accent CTA → deep link.
- **The loop**: 4-up numbered cards (Test / Explore / Design / Re-test) on a `--bg-1` band, each with a mono footer stamp.
- **Skeptic strip** ("Don't trust us. Check us."): copy block + 4 skeptic-question rows, each routing to a methodology page (mono route label right).
- Footer: wordmark, links (Methodology · Data & vintages · API · Critique channel), mono corpus stamp.
Interactions: rotating placeholder pauses on input focus (implement; prototype rotates only). All content is public/indexable; the Ask box routes to Law Explorer.

### 1 · Test Config (`Test Config.dc.html`)
Five-step checklist, **all steps visible at once** (no wizard): 1 Jurisdiction, 2 Test blocks, 3 Corpus & vintage, 4 KPI joins, 5 Review & run. Max-width 900. Footer becomes a persistent status bar after kickoff; runs drawer carries notify-me; identical configs offer the cached result.

### 2 · Test Report (`Results Page.dc.html`)
First of the three result tabs (see IA). Overall score (display-size number /100), block heat strip, findings list. Findings are cards with verdict badge, C-band pill, provenance micro-stamp, plain/expert copy per register toggle. Findings link to their Vulnerability Pages; the list footer links into the Vulnerability Explorer tab.

### 2a · Vulnerability Explorer + Rollup (`Vulnerability Explorer.dc.html`)
Result tabs two and three, same page shell/title as the Test Report (tab bar switches in place; each tab is its own URL).
- **Vulnerability Explorer tab**: filter row — verdict-count pill toggles (fail/gap/partial/pass; active = verdict-wash fill + verdict-color border, inactive = `--bg-1` + `--ink-3`), block select, sort select (severity / confidence / patch difficulty / newest change), mono match-count right. Findings table: ID (mono) · finding title (register-dependent: plain sentence vs expert citation line) · test · verdict chip · severity as five 14px heat segments + number · C-band pill with vocabulary tooltip. Rows link to Vulnerability Pages. Footer reminders: "gap ≠ fail", every row a stable URL.
- **Rollup tab**: dark `--ink-surface` summary card (median score display-size, spread, vintage) + score-distribution histogram (accent bars, median band highlighted, hover count tooltips). Below, counties table: name · score · Δ vs prior corpus (pass-green/fail-red/—) · verdict-mix stacked bar · top local finding (one line, truncates). Footer: pagination link + export CSV (workflow gate).

### 2b · Vulnerability Page (`Vulnerability Page.dc.html`) — the shareable unit
Per-finding permalink (`/v/VLN-…`), the most-shared artifact; must render complete for signed-out visitors and carry Open Graph metadata. Max-width 1200; page-level register toggle in header.
- **Title block**: breadcrumb (report → explorer → ID), chip row (mono ID · verdict chip · C-band pill with band-vocabulary tooltip · test/topic mono), register-dependent headline (30px plain sentence / 26px expert statement) + dek, provenance summary line with hover ladder.
- **Right of title**: dark `--ink-surface` card — SEVERITY and PATCH DIFFICULTY as paired display numbers (n/5), heat-segment bar, one-line reading, accent CTA "Design a patch →" (to Patch Proposal).
- **Main column** (flex-wrap: rail drops below at narrow widths): "The rule as written" (statute quoted in serif, left border, mono cite footer, link to source text; register-dependent commentary below) · "What the test checked" (per-criterion verdict chips + rubric link) · "Why it matters" (C-band chip in header; register-dependent evidence prose — only real, cited facts — + three stat cards: 20px value + label) · "Who benefits from the status quo" (tagged rows: EXECUTIVE/AGENCIES/COST…, with the incentives-not-motives disclaimer).
- **Rail**: Share card (readonly stable URL + Copy button with copied-state, cite line + BibTeX link) · Provenance ladder card (key–value mono rows: source / law as of / finding / confidence / run) · Related findings (verdict chip + ID + one-liner) · Watch card (`--accent-wash`): notify on law change, verdict move, or patch.

### 3 · Block Detail (`Block Detail.dc.html`)
One test block's methodology made legible: the questions asked, verdicts per test, rule citations in serif, C-band rationale.

### 4 · KPI Explorer (`KPI Explorer.dc.html`) — Explore / Outcomes
Four switchable views under one tab bar (view label echoes in mono, right):
- **Dimensions** (default): 3×2 card grid, one card per category — headline KPI at 32px, delta chip, plain-register paragraph or expert KPI rows, footer provenance stamp + "all N →" link.
- **SDG pyramid**: dependency pyramid, bottom-up (Mayerhofer 2024 hierarchy). Cells wash-coded on-track/at-risk/failing; **click a cell** to open an inspect panel showing the mapped KPIs vs 50-state medians and the threshold math (≥70% at/above median = on track; 40–69% at risk; <40% failing).
- **Design principles**: 10-row scorecard, score bar + 0–100 number; **click a row** to expand the computation: component KPIs → raw value → percentile bar → normalized score; formula line `mean of component percentiles × rule-coverage factor = score`.
- **Capital lens**: five-capital filter chips (Financial/Manufactured/Human/Social/Natural); KPI list per capital with U/C tags; framing line "which capital did the rules optimize — and which did they externalize onto?"
Page-level Plain/Expert toggle (top right of h1 row).

### 4a · Category Detail (`Category Detail.dc.html`)
Target of "all 31 →" (Health & Wellbeing sample). Three headline stat cards (value + rank-of-50 chip), then grouped KPI tables (Outcomes / Access & quality / Subjective wellbeing). Plain register: KPI + one-line meaning + rank chip. Expert register: dense grid — value, trend arrow, percentile bar in the 50-state distribution, peer median, U/C tag, provenance stamp. Rank direction always adjusted so higher percentile = better.

### 5 · Money Explorer (`Money Explorer.dc.html`) — Explore / Money
Headline total ($325.1B, 40px). Left: drillable spending cascade in the government's **native structure** (click ▸ rows to open sub-lines), unit switcher $/per-capita/% of parent, share-of-total bars, YoY chips. Right rail: paired revenue panel + dark fiscal-findings scorecard (links to findings). Bottom, full width: **"Does the money follow the values?"** crosswalk — budget area → mapped SDGs → share of spend vs share of failing/at-risk KPIs → reading chip (PROPORTIONATE / UNDERWEIGHTED, threshold: gap share ≥ 2× spend share). Method note states the mapping chain (DOF line → COFOG → SDG targets → KPI gap counts) and that mismatch ≠ proof more money fixes it.

### 6 · Patch Proposal (`Patch Proposal.dc.html`) — Design
Seven-step numbered timeline (accent circles + connecting line):
1. **Feasibility** — change type, difficulty n/5, typical timeline.
2. **Precedent** — comparable-jurisdiction cards (name, instrument, outcome one-liner) + search provenance line.
3. **Beneficiaries** — gains/pays two-up + coalition map paragraph.
4. **Draft language** — serif statutory text, **AI-DRAFTED banner in partial-wash (required by brief)**, scope note.
5. **Impact** — three cards: test delta (projection, not measurement) / timeline to effect / watch-after-passage KPIs.
6. **Unintended consequences** — the patch is applied to a corpus copy and re-run: conflict scan over every referencing section plus incentive analysis against how peers gamed the same fix. Rows tagged CONFLICT / INCENTIVE / CAPACITY / DRIFT, each with a mitigation sentence and a status chip (addressed in draft / needs draft change / monitored). Mono footer: simulation provenance + AI-assisted disclaimer.
7. **Pathway** — committees, votes, veto points + minimum viable patch.
Right rail: scoring summary card (difficulty dots, change type, refactoring name, feasibility chip, timeline, projected impact) + "re-test with this patch →". Footer: four export formats, each with a stable URL. Header stamp reads "patch methodology v2 · seven steps".

### 7 · Compare (`Compare.dc.html`) — Explore / Compare
Two modes (segmented toggle): **Head-to-head** — paired score cards, mirrored per-block bar chart (gap ≥ 10 flagged with reason), "why the gap" + "where X leads" narrative cards linking to the patch. **Ranked cohort** — jurisdictions × blocks matrix, cells wash-coded by verdict share, subject row highlighted. Rule: comparison only among runs on the same corpus vintage.

### 8 · Law Explorer (`Law Explorer.dc.html`) — Explore / The Law
Centered Q&A: search bar + suggested-question chips (language indicator EN·ES·中文·TL·VI). Answer card: register toggle, citation count + C-band in header; every claim carries an inline `[§…]` citation chip; citation chips repeat as tappable list under the answer. "Related in the rulebook" three-up: finding / patch / compare, each linking into Test & Design. Guardrail line: answers what the law *says*, never legal advice. **No citation, no claim.**

## Design tokens

Full values in `design-system/tokens/*.css`; import chain is `styles.css`. Key values:

- **Fonts**: IBM Plex Sans (UI), IBM Plex Mono (data, IDs, provenance, overlines), IBM Plex Serif (rule/statute text only).
- **Neutrals** (cool blue-toned oklch): `--bg-0` page 98.4%, `--bg-1` #fff cards, `--bg-2` inset, `--bg-3` hover; `--ink-1/2/3` text ramp; `--line-1/2` borders/hairlines; `--ink-surface` dark panels.
- **Accent**: civic blue `oklch(51% 0.14 255)` + strong/wash/line variants.
- **Verdicts**: pass green 158, partial amber 78, **gap violet 300 (deliberately distinct from fail)**, fail red 26 — each with a wash.
- **Confidence C0–C3**: single-hue blue ramp (never "proven").
- **Heat 1–5**: calm→hot ramp for scorecards.
- **AI mark**: shares gap-violet family.
- **Shape**: radius 3/6/10px; shadows `--shadow-1/2/pop`; motion 140ms `--ease`.

## Components (design-system/components/)

- **core/**: Button, Input, Select, Checkbox, Tabs, Card, Badge
- **evidence/**: VerdictBadge, ConfidencePill, ProvenanceCite, VintageStamp, AIMark
- **dataviz/**: ScoreBar, HeatCell
- **disclosure/**: RegisterReveal (plain/expert)
Each has `.jsx`, `.d.ts`, and a `.prompt.md` usage note.

## Interactions & state

- **Register toggle**: page-level state, default plain; swaps prose blocks only — layout, citations, and stamps identical in both registers.
- **Provenance ladder**: micro-stamp (`SOURCE · VINTAGE ⓘ`) on hover/tap reveals multiline ladder (currently `title` tooltips in prototypes — implement as popover, 300ms hover intent, tap on touch).
- **Expanding rows**: single-open accordion behavior on principles scorecard; multi-open on money cascade.
- **Selected states**: 2px accent ring (SDG cells), accent-fill chips (capital lens), `--accent-wash` row highlight (cohort).
- **Run lifecycle**: config footer → status bar after kickoff; runs are minutes-to-hours, notify-me in runs drawer; identical config → offer cached result.
- **State needed per page**: register, active view/tab, selection (SDG cell, principle row, capital, compare mode), open rows, run status.

## Responsive behavior

Prototypes are desktop-first (1100–1440px design widths). Intended collapse:
- 3-col card grids → 2 → 1; two-up panels stack; right rails drop below main.
- Compare cohort matrix and expert-register tables scroll horizontally.
- Plain register is the mobile priority — findings and Law answers must read cleanly at 375px, 44px minimum hit targets.
- Header nav collapses to a menu; segmented sub-nav becomes horizontally scrollable pills.

## Non-negotiables from the brief

- Provenance visible and tappable on every claim.
- Correlation ≠ causation: band-locked language (C0–C3) in copy and color; never imply proven causation.
- AI-drafted language visibly marked as requiring expert review.
- **Access model**: three tiers, all requiring registration — **Free** (activity- or day-capped), **The Public** (minimum cost-covering fee), **Institutional Stewards** (see PRD definitions; Journalists may move to The Public — open). Tiers gate *workflow* (exports, API, volume), never viewing depth. Signed-out header shows Sign in + Register; no "no account" copy anywhere. Upgrade prompts invite, never block.
- Public pages SSR, indexable, fast, shareable (stable URLs); Vulnerability Pages carry Open Graph previews.

## Files in this package

- `front-end-spec.md` — this file
- `design-system/` — tokens/, components/, guidelines/, styles.css, readme.md (Deliverable 2)
- `screens/` — 12 `.dc.html` design references (Landing Page, Test Config, Results Page, Vulnerability Explorer, Vulnerability Page, Block Detail, KPI Explorer, Category Detail, Money Explorer, Patch Proposal, Compare, Law Explorer) + `Master Canvas.dc.html` (all screens on one navigable canvas) + `support.js` (prototype runtime; not production code)
- `docs/` — prd.md (annotated handoff copy), front-end-brief.md, domain-model.md, example-questions.md (source inputs, citable)
