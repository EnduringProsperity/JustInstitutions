# Front-End Design Brief — JustInstitutions

> **Purpose:** self-contained handoff into Claude Design (or any design session). Everything needed to design the UX is in this one file; deeper detail lives in [prd.md](prd.md), [domain-model.md](domain-model.md), [architecture.md](architecture.md). **Expected deliverables from the design track:** `docs/front-end-spec.md` (BMAD UX spec) + a design system.
>
> *Product name: **JustInstitutions** (decided July 2026; record in the private business repo). Originally designed against a placeholder wordmark.*

## What the product is (one paragraph)

A public-interest platform that treats a jurisdiction's body of rules (constitutions, statutes, regulations, case law) like software: it **Tests** the rule system against test suites to find "vulnerabilities" (gaps, conflicts, loopholes, obsolescence, inequities…), lets users **Explore** outcomes (KPIs), spending (Money), comparisons (Compare), and the law itself (Law), and helps **Design** fixes ("patches") that can be pressure-tested and re-Tested. Any jurisdiction on Earth is selectable (US rules load first). Findings are versioned, provenance-backed, and every screen/view/finding has a stable shareable URL.

## Audiences (two registers, one product)

- **The People** (free, no account to browse): students, teachers, engaged citizens. Plain language is *essential* — no jargon, relatable examples, visual-first. WCAG conformance is a requirement (NFR-08).
- **Institutional Stewards** (paid tiers): researchers, journalists, advocates, staffers, officials. Need depth, citations, exports, methodology transparency.
- **Same content for everyone** — tiers gate *workflow* (exports, API, volume), never viewing depth. The design challenge is **progressive disclosure**: plain-language surface, expert depth on demand, one page serving both.

## The three areas (each a standalone entry point, chaining into a loop)

**Test → Explore → Design → re-Test.**

1. **Test**: pick jurisdiction → confirm sub-jurisdiction scope → (ingest/refresh law if stale) → configure run (System Type benchmark + Intent weighting) → select test blocks → view results three ways: **Test Report** (pass/partial/gap/fail per test, with citations), **Vulnerability Explorer** (filter by type/severity/layer/domain), **Vulnerability Rollup** (executive scorecard by block & layer). Democratic Design Score + per-block sub-scores; heat maps.
2. **Explore**: **KPI Explorer** (browse KPIs through 4 switchable views: Dimensional categories, SDG Pyramid (hierarchical), Design Principles scorecard, Capital Impact lens); **Money Explorer** (cascading budget drill-down — treemap/sunburst/indented tree — with paired revenue view, per-capita/YoY/share-of-parent toggles); **Compare** (side-by-side ×2 or ranked cohort ×N, vs. structural peers); **Law Explorer** (natural-language Q&A over the corpus; "effective law" = statute + case law — Phase 4).
3. **Design**: from any finding → structured patch proposal (7-step methodology: feasibility 1–5, precedent search, beneficiary analysis, draft language, impact assessment, unintended-consequence analysis, implementation pathway); legislation designer; simulation ("what if this passed?") feeding back into Test.

## Decided UX stances (owner decisions, 2026-07)

1. **Universal baseline is the default Test run** *(tentative — "let's see how it plays out")*: the benchmark-free "score anyone, judge no one" run (system-agnostic test blocks only) is the default; choosing a design-conformance benchmark (e.g., "Federal presidential republic") is an explicit opt-in step.
2. **Intent picker = multi-select, not sliders.** Nine baseline qualities (Responsive, Resilient, Elastic, Safe, Accurate, Accessible, Equal, Economically Viable, Sustainable). Default **Balanced** (all nine). User can "emphasize" a subset via multi-select. No weighting sliders.
3. **System Type picker = dimensions first, bundles second.** Lead with the five dimensions (sovereignty source, representation mode, executive structure, vertical distribution, practice-vs-paper); as the user sets dimensions, the matching named bundles (e.g., "Parliamentary democracy") narrow/surface as the confirmation step. (Note: D5 practice-vs-paper is *assessed by the platform*, not user-selected.)
4. **Job-status UX** — open to suggestions. Constraint: analyses run minutes-to-hours (Batch API up to 24h). Needs: enqueue → status ("run in progress, started 14:02") → notify/refresh; and the memoization message ("this analysis already exists — computed 2026-06-30 · corpus v41 — view it, or see what changed since").
5. **Data vintage & confidence display** — open to suggestions; acknowledged tricky. Every view must honestly show: corpus/data vintage ("law as of…", KPI year), attribution confidence bands (C0 Gap / C1 Association / C2 Supported / C3 Strong — never "proven"), Universal vs. Contested KPI labels — *without* cluttering the plain-language register. Progressive disclosure again.

## Hard product principles the design must honor

- **Deep linking is first-class** (FR-26): every screen/view/report/finding/data-point has a stable, bookmarkable URL; view state (selected KPI, time range, filters) lives in the URL; Open Graph previews everywhere. URL scheme examples: `/us/ca`, `/us/ca/view/sdg-pyramid`, `/us/ca/kpi/infant-mortality`, `/us/ca/vulnerability/VLN-00142`, `/compare/us/ca/us/mn`.
- **Provenance visible**: every claim cites source text; citations are tappable and lead to the actual rule text.
- **Correlation ≠ causation**: language and visual treatment must never imply proven causation (band-locked language exists in the data; the design carries it).
- **AI-output marking**: AI-drafted patch/legislation language is visibly marked as requiring expert review.
- **Free tier is frictionless**: no account, no nags for browsing; upgrade invitations only on workflow gates (exports, API, volume) and pattern-detected professional use — invite, never block.
- **SSR/SEO**: public pages are indexable, shareable, fast.

## Example questions (design fuel)

A curated prompt library lives in [example-questions.md](example-questions.md) — organized by persona and product area, with the unique-capability showcases tagged. Use it for: landing-page rotating prompts, per-persona entry points ("I'm a journalist →"), Law Explorer empty states, and demo flows. The system-level "viral" questions are strong landing-page material; the persona lists map one-to-one to the audience registers above.

## Primary UI surfaces to design (from prd.md)

Jurisdiction Explorer · Vulnerability Browser · Policy Domain Deep Dives · Country Comparison · Patch Proposals · Trend View — plus the Test run configuration flow, the three results views, Money Explorer cascade, Compare, and the four-way KPI view switcher.

## Suggested design-session sequence

1. Design system foundations (type, color, plain-language voice, the two-register disclosure pattern).
2. Test flow end-to-end (jurisdiction pick → config → job status → results) — it's the product's spine and contains decisions 1–4.
3. KPI Explorer + view switcher (contains decision 5).
4. Money Explorer cascade; Compare.
5. Finding/vulnerability page (the most-shared artifact — it's the unit of virality) + patch proposal page.
