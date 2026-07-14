# PRD — Public Policy Vulnerability Analyzer (PGA)

> **BMAD Product Requirements Document** (PM-owned). Upstream context: [project-brief.md](project-brief.md). Technical realization: [architecture.md](architecture.md). Domain framework (test blocks, KPI catalog, taxonomies, methodology): [domain-model.md](domain-model.md). Business exhibits: [business/](business/).
>
> *Status: assembled from the original master plan (now retired; superseded by this `docs/` set). Sections marked `{DRAFT}` were proposed by Claude and need owner review. When BMAD is installed, the PM agent will regenerate/validate this against its template and generate the formal Epic List from these requirements.*

## Goals

- Make the **rules → outcomes** link visible and analyzable for any jurisdiction — connecting specific rules to measurable societal outcomes.
- Give **The People** plain-language access to how their government works and where it fails; give **Institutional Stewards** rigorous, citable research tooling.
- Turn diagnosis into action: produce **feasibility-scored, precedent-backed patch proposals**, not vague calls for reform.
- Establish **methodological credibility** — a framework defensible to academics and funders, publishable on its own.

## Non-Goals (initial release)

- **Not legal advice.** A research tool; all AI-generated legal language requires expert review.
- **Not a bill tracker.** Legislative monitoring is well served by competitors; PGA analyzes the standing corpus, not pending bills.
- **Does not claim causation.** Surfaces correlation and likely mechanisms only.
- **No non-US rules corpora at launch** (capability exists; data load is sequenced — see brief Scope).
- **No additional analysis domains** (corporate, healthcare) at launch — architecture stays pluggable.
- **One analysis mode** *(iceboxed 2026-07, was OQ-3)* — no quick-scan vs. exhaustive selector; a single well-tuned depth. Revisit only if run cost or latency demands tiering.

## Success Metrics

*{DRAFT — proposed product metrics for review; targets TBD.}*

| Category | Metric |
|----------|--------|
| **Reach** | Monthly active users; # jurisdictions viewed; % traffic from organic search (public-interest discoverability) |
| **Engagement** | Analyses (Test runs) executed; reports downloaded; shareable URLs opened per shared link |
| **Research credibility** | Academic citations of PGA findings; verified researcher signups; university partnerships; peer-reviewed papers using the platform |
| **Civic impact** | Patch proposals referenced by advocacy orgs, journalists, or in actual legislation |
| **Quality** | Human-review agreement rate on vulnerability findings (against known policy debates) |
| **Sustainability** | Professional/institutional conversions; earned-revenue share (see [business/revenue.md](business/revenue.md)) |

## User Personas

### The People
*General public users; no professional obligation to the platform. Access is free. Plain language is essential.*

| Persona | Who They Are | Primary Goal | What They Need Most |
|---------|-------------|--------------|-------------------|
| **Student (K–16)** | Middle or high school student exploring civics, government, or current events — for a class project, personal curiosity, or debate prep | Understand why their community, state, or country works (or doesn't) the way it does | Plain-language explanations; visual representations; relatable local examples; no jargon |
| **Teacher (K–16)** | Civics, social studies, or government teacher building lessons or assignments | Find reliable, citable data and findings that map to curriculum and spark discussion | Classroom-ready visualizations; citable sources; content students can explore independently |
| **Engaged Citizen** | Voting adult active in community life — attends town halls, follows local news, may organize around specific issues | Understand the root causes of problems they see in their community and what could change | Issue-driven entry points; shareable findings; plain-language vulnerability summaries; actionable patch proposals |

### Institutional Stewards
*Professional users with domain knowledge and specific research or advocacy purposes. Deeper access tiers.*

| Persona | Who They Are | Primary Goal | What They Need Most |
|---------|-------------|--------------|-------------------|
| **Graduate Student** | Master's or PhD student in public policy, law, political science, or related fields | Use the platform as a research tool — find patterns, export data, cite findings | Raw data exports; methodology documentation; API access; cross-jurisdiction comparison; historical trends |
| **Policy Researcher** | Academic or think tank analyst publishing on governance, law, or policy outcomes | Conduct or support rigorous research; find evidence for or against policy hypotheses | Methodology transparency; data exports; citable findings; ability to query across the full corpus |
| **Journalist** | Investigative or beat reporter covering politics, inequality, or government accountability | Find the story — the specific vulnerability, outlier jurisdiction, or trend worth writing about | Fast story discovery; shareable stable URLs; embeddable data; findings framed as narrative hooks |
| **Policy Advocate** | NGO, advocacy org, or issue campaign staffer pushing for specific reform | Build the evidence case for a predetermined cause; show their jurisdiction is an outlier | Comparative data across jurisdictions; patch proposals to point to as solutions; downloadable reports |
| **Staffer** | Legislative aide at federal, state, or local level | Quickly understand the vulnerability landscape in a specific domain for their legislator | Jurisdiction-specific findings; patch proposals with feasibility ratings; policy domain deep dives |
| **Government Official** | Elected or appointed official — city manager, agency head, state legislator | Understand how their jurisdiction compares to peers and what is actionable | Executive-level summaries; peer jurisdiction benchmarks; high-severity findings with clear patch pathways |

## Functional Requirements

*Phase column is a suggested MVP-vs-later hint that pre-maps to the roadmap; the PM agent may re-phase during epic generation.*

### Test — Governance Vulnerability Testing
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-01 | Select a jurisdiction at any level (nation → state/province → county/district → city → special district) for any UN-recognized jurisdiction; US rules loaded first | 1 |
| FR-02 | Resolve and confirm sub-jurisdiction scope (this level only vs. cascade into children) | 1 |
| FR-03 | Ingest/refresh a jurisdiction's rules corpus on demand; display data vintage (last-updated + version); preserve full version history (event-sourced) | 1–2 |
| FR-04 | Configure an analysis run: Intent and System Type (enumerations defined in [domain-model.md](domain-model.md#analysis-configuration--intent--system-type); analysis Modes iceboxed — one mode) | 1 |
| FR-05 | Select Test Blocks (standard battery A–L) or a subset; support admin- and (later) user-defined custom blocks | 1 |
| FR-06 | Run selected blocks against the rules (Layers 1–5); return pass/partial/gap/fail per test with citations to source text | 1 |
| FR-07 | Present results three ways: Test Report, Vulnerability Explorer (filter by type/severity/layer/domain), Vulnerability Rollup (scored by block & layer) | 1 |
| FR-08 | Each vulnerability carries severity, affected jurisdiction(s), KPI-impact estimate, beneficiary analysis, patch-difficulty rating, refactoring tag | 1–2 |
| FR-09 | Compute a Democratic Design Score (aggregate + per-block sub-scores) | 1 |
| FR-10 | From any finding, launch corrective action into Design | 2 |

### Explore
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-11 | Browse KPIs and pivot across the four Views (Dimensional, SDG Pyramid, Design Principles, Capital Impact) over the same data | 1–2 |
| FR-12 | Surface correlations across KPIs and between KPIs and jurisdiction characteristics (legal, cultural, physical), labeled correlation-not-causation | 2–4 |
| FR-13 | Tie KPIs to vulnerabilities: Gap detection (direct), rule-to-outcome attribution (hypotheses w/ confidence), union findings | 2–4 |
| FR-14 | Money Explorer: cascading drill-down budget visualization for any level (per-capita, YoY, share-of-parent) | 2 |
| FR-15 | Money Explorer: paired revenue view (how each item is funded) | 2 |
| FR-16 | Money Explorer: values inference (Core/Supporting/Generic per J8; capital types; budget→KPI/SDG mapping) | 3 |
| FR-17 | Compare same-type jurisdictions & peer groups, side-by-side and ranked, on KPIs, Money, Democratic Design, vulnerabilities | 2 |
| FR-18 | Normalize comparisons (per-capita/100k; PPP/cost-of-living for cross-country) | 2 |
| FR-19 | Law Explorer: natural-language Q&A over the corpus (what laws apply; plain-language meaning) | 4 |
| FR-20 | Law Explorer: show "effective law" (statute + controlling case law, Layer 3) | 4 |

### Design
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-21 | Generate a structured patch proposal via the six-step methodology (feasibility, precedent search, beneficiary analysis, draft language, impact assessment, implementation pathway) | 4 |
| FR-22 | Legislation Designer: draft new legislation from a user prompt or KPI-driven gap; AI-generated, marked for expert review | 4 |
| FR-23 | Passage Guidance (committees, vote thresholds, veto points, minimum viable patch) | 4 |
| FR-24 | Simulation: project consequences of a proposed law (KPI deltas as ranges, downstream conflicts, capital impacts, beneficiary shifts); feed back into Test to re-score | 4 |
| FR-25 | Output patches in four formats (one-pager, full proposal, draft-language appendix, comparable-models report) | 4 |

### Platform (cross-cutting behaviors)
| ID | Requirement | Phase |
|----|-------------|-------|
| FR-26 | Provide shareable, embeddable deep links (with Open Graph previews) to any screen/view/report/finding/data point | 1 |
| FR-27 | Downloadable reports (PDF) each with a permanent online URL | 2 |
| FR-28 | Access tiers with auth (Public / Researcher / Professional / Institutional / Government); all tiers get the same functionality — tiers set pricing, and users self-identify a persona at registration | 2–3 |
| FR-29 | Admin can add KPI categories/KPIs and Test Blocks; later, end users can too | 2 |
| FR-30 | Real-person identity verification on paid/Steward tiers via managed IDV (government ID + liveness), plus affiliation signals (institutional email, ORCID, LinkedIn) per tier — see [Identity & Verification](#identity--verification) | 2–3 |
| FR-31 | Usage-pattern detection on free/anonymous traffic (IP/ASN classification, volume & crawl-pattern analysis, org-domain clustering) driving rate limits on expensive operations + upgrade invitations — never hard blocks; see [Free-tier free-rider posture](#free-tier-free-rider-posture) | 2–3 |

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | **Jurisdiction generality** — represent/analyze any UN-recognized jurisdiction & sub-jurisdiction with no core changes (extension via adapters) |
| NFR-02 | **Provenance** — every analytical claim cites source rule text / data |
| NFR-03 | **Correlation ≠ causation** — outputs distinguish correlation from causation; projections labeled as projections |
| NFR-04 | **AI-output disclaimer** — all AI-generated legal language marked; requires expert review |
| NFR-05 | **Reproducibility / versioning** — analyses versioned; finding/patch URLs stable across updates; "law as of date X" queryable |
| NFR-06 | **Performance** — semantic search p99 < 500ms (documented migration path if exceeded) |
| NFR-07 | **Cost efficiency** — prompt caching, Batch API, pgvector, serverless |
| NFR-08 | **Accessibility & plain language** — The People tier readable without jargon; WCAG target; language access |
| NFR-09 | **Discoverability** — SSR; public pages indexable (SEO) |
| NFR-10 | **Data freshness** — scheduled corpus/KPI refresh; display data vintage |
| NFR-11 | **Methodology transparency** — scoring rubrics & KPI definitions published/traceable (domain-model.md) |
| NFR-12 | **Extensibility isolation** — new Domain/SystemType/TestSuite/KPIView/CorpusAdapter without core changes |
| NFR-13 | **Privacy & security** — standard protections; tier/account security over public data |

## Feature Detail & User Flows

Narrative detail behind the requirements above. The three areas (Test / Explore / Design) each stand alone and also chain: Test → Explore → Design → re-test.

### Test — Governance Vulnerability Testing (primary flow)

Run a jurisdiction's actual rule system (Layers 1–5) against the Test Blocks to produce a structured vulnerability report — the diagnostic core of the platform.

1. **Choose jurisdiction** — country, federal, state, county (or province, regional municipality, kreis, department, district depending on the country), city, or special district. At first release, rules data is loaded for the USA only, though every UN-recognized nation appears in the picker; KPI data is loaded for other nations too (for Explore).
2. **Confirm sub-jurisdictions** — the system resolves the jurisdiction's children (e.g., a state's counties and major cities) and asks the user to confirm scope: this level only, or cascade into sub-jurisdictions.
3. **Ingest / refresh law** — if the corpus is missing or stale, trigger ingestion; display last-updated date and corpus version so the user knows exactly what vintage of law they are testing (event-sourced storage preserves every version).
4. **Select analysis configuration** — **System Type** (the benchmark bundle, e.g. "Federal presidential republic," which selects the test suite and scoring rubric; any jurisdiction can be scored against any bundle, and against multiple bundles in separate runs) and **Intent weighting** (the analyst's lens over nine baseline qualities — Responsive, Resilient, Elastic, Safe, Accurate, Accessible, Equal, Economically Viable, Sustainable; default Balanced). Either axis can stand alone: System Type with Balanced intent, or an **intent-only run** via the **Universal baseline bundle** (system-agnostic blocks only — no design claim asserted; "score anyone, judge no one"). Defined in [domain-model.md](domain-model.md#analysis-configuration--intent--system-type). *(Analysis Modes — quick scan vs. exhaustive — are iceboxed; there is one mode.)*
5. **Select Test Blocks** — the standard battery (A–L) or a subset (e.g., only fiscal capacity + separation of powers), or an admin/user-defined custom block.
6. **Review the Vulnerability Analysis Report** — three views: **Test Report** (pass/partial/gap/fail per test with citations), **Vulnerability Explorer** (filter/drill by type, severity, layer, policy domain), **Vulnerability Rollup** (executive summary scored by block and layer). *Results are shared artifacts: an identical configuration against the same corpus version is served from the existing stored run (memoized per test block), never re-executed — see architecture.md, Analysis Engine.*
7. **Propose Corrective Action** — from any finding, jump into Design to draft a patch.

### Explore

Investigative tools over the same corpus and data. Where Test is rule-first (structure → vulnerability, more theory), Explore is outcome-and-practice first.

**(i) KPI / Outcome Explorer.** Start from outcomes and work back toward the rules that may shape them — bottom-up analysis focused on content law (Layer 5) but reaching up into structural causes.
- Browse KPIs through any of the four KPI Views (valuable on its own).
- Surface **correlations** across KPIs and between KPIs and a jurisdiction's characteristics — always labeled correlation, with likely mechanisms flagged but distinguished from causation. Characteristics include legal, religious, cultural, and **physical** (size, population, topography, weather — anything that may affect outcomes). This is a hard problem, governed by the [Attribution Confidence Model](domain-model.md#kpirule-attribution-confidence-model).
- **Tying KPIs to vulnerabilities:** *Gaps* (a KPI shortfall in a domain with no governing rule — the most reliable tie); *rule-to-outcome attribution* (hypothesis with confidence, never proven causation); *union findings* (outcome failure + rule vulnerability presented together); *KPI-driven proposals* (a persistent shortfall with no coverage triggers new legislation in Design).
- **Propose Corrective Action** — launch a patch (meta or content; the system indicates which layer).

**(ii) Money Explorer / Budget.** *"How you spend your money reflects your values."* Cascading, drill-down budget visualization (treemap / sunburst / indented tree) for any level of government — revealing, by inference, the de facto values behind that government.
- **Spending cascade** — expandable node by node. Federal: Branch → Department/Agency → Sub-agency/Bureau → Program/Account → Object class (e.g., Executive → HHS → CMS → Medicaid → benefit payments). State: Branch → Department → Division → Program → Line item. County/City: Government → Department → Division → Program → Line item. Non-US: adapt to that nation's ministry/department structure. Every node supports per-capita normalization, year-over-year trend, and share-of-parent.
- **Revenue view** — pair spending with funding sources (taxes, fees, borrowing/deficit, intergovernmental transfers); reliance on transfers feeds Test Block L (fiscal dependency). Budget taxonomies differ across jurisdictions; normalization uses the COFOG-based [Budget Taxonomy Crosswalk](domain-model.md#budget-taxonomy-crosswalk).
- **Values inference** — Core vs. Supporting vs. Generic split (Test J8), allocation across the five capital types, and budget mapped onto KPI dimensions / SDGs (spend vs. outcomes achieved).
- **Data sources** — Federal: USAspending.gov, OMB, Treasury Fiscal Data. State: budget portals & ACFRs. Local: municipal budgets, Census of Governments.

**(iii) Compare.** Side-by-side and ranked comparison of same-type jurisdictions — the fastest route to outliers (the jurisdiction doing markedly better/worse is where the story or model to emulate usually is).
- **Peer sets** — same type (country↔country, state↔state, etc.) plus **peer grouping** by similarity (population band, GDP/median income, region, urban/rural mix) for fair comparison, per the [Peer Grouping Methodology](domain-model.md#peer-grouping-methodology).
- **What can be compared** — KPIs (any View); Money (spending + revenue); Democratic Design (score, per-block, individual tests); Vulnerabilities (counts/severity by type & layer).
- **Modes** — side-by-side (2) and cohort/ranked leaderboard (N).
- **Normalization** — per-capita/100k; PPP / cost-of-living for cross-country money.
- **Outputs** — delta highlights, a best-in-class pointer, and a jump from a leader's result into its actual rules (feeds Design's precedent search). Stable shareable URLs (`/compare/...`).

**(iv) Law Explorer.** Natural-language access to the corpus for non-experts (and experts in a hurry): ask what laws apply to a scenario ("what governs eviction in Cook County?"); understand what an existing law means in plain language; see the **effective law** (statute + controlling case law, Layer 3) rather than just the paper text. *(RAG-over-corpus chat; Epic 4.)*

### Design

Where Test and Explore identify problems, Design produces remedies — and pressure-tests them before anyone spends political capital.
- **Propose Corrective Action / Patch** — every finding routes to a structured patch proposal via the six-step **Governance Patch Proposal Methodology** (defined in [domain-model.md](domain-model.md#governance-patch-proposal-methodology)).
- **Legislation Designer** — draft new legislation from scratch (e.g., to fill a KPI-driven Gap), AI-generated section-level language marked for expert review.
- **Passage Guidance** — jurisdiction-specific: required committees, vote thresholds, veto points, companion agency actions, and the "minimum viable patch."
- **Simulation** — *"What if this law were passed?"* Project consequences: KPI deltas (ranges, labeled projections), downstream rule conflicts, affected capital types, beneficiary/harm-bearer shifts. A proposed patch can be fed back into Test to re-score the jurisdiction as if live.

## Identity & Verification

*(Resolves OQ-2; realized by FR-28/FR-30.)* All personas get the same functionality; the persona chosen at registration drives pricing and default presentation only. What differs by tier is **how sure we are the account is a real, non-aliased person** — this matters because Steward-tier output (exports, API access, citable reports) borrows the platform's credibility.

**Verification ladder:**

| Tier | Requirement | Rationale |
|------|------------|-----------|
| **Public (The People)** | None — browsing requires no account; saving/sharing preferences needs only an email | Free civic access is the mission; friction here is a bug |
| **Researcher** | Real-person IDV (below) **+** an affiliation signal: institutional (.edu) email or ORCID iD | ORCID is the academic identity standard and free to check |
| **Professional / Institutional** | Real-person IDV; institutional plans name a verified admin who vouches for seats | Billing relationship adds accountability |
| **Government** | Real-person IDV **+** .gov/.mil (or equivalent) email verification | Domain check is cheap and strong for this tier |

**How real-person verification works (the "no alias" check):** use a **managed identity-verification provider — Stripe Identity or Persona** — which performs government-ID document verification plus a biometric liveness selfie match. This is the industry-standard, legally-sound answer to "is this a real, specific human," and it is bought, not built (Generic domain — see architecture.md). Cost is ~$1.50–3 per verification, charged once at tier signup and absorbed into the paid tier price.

**Why not LinkedIn as the verifier:** LinkedIn profiles are self-asserted, and LinkedIn's own "verified" badge is itself powered by third-party IDV (CLEAR/Persona) — so relying on LinkedIn means depending on the same verification with less coverage (no LinkedIn account ≠ not a real person) plus an unstable API surface. LinkedIn is useful as an optional **affiliation signal** (claimed employer/role for the honesty-check on persona selection), never as the identity root.

**Honesty check on self-identified persona:** the persona claim (e.g., "journalist") is soft-verified from affiliation signals (email domain, ORCID, optional LinkedIn). Mismatches don't block access — same functionality for everyone — they flag the account for pricing-tier review.

**Privacy commitments:** the IDV provider retains the ID documents; PGA stores only the verification result (verified: yes/no, date, provider reference). We never hold ID images. Verification status appears on nothing public — it gates tier features only.

### Free-tier free-rider posture

The Public tier requires no account, so "is this really the Public and not an institution riding free?" is unanswerable for anonymous traffic — and the design deliberately does not try to answer it with identity. The defense is structural: make free-riding *uninteresting*, not impossible.

1. **Cost asymmetry bounds the loss.** Run memoization (architecture.md, Analysis Engine) means anonymous browsing serves precomputed artifacts at near-zero marginal cost. An institutional analyst reading pages for free is a tolerable leak, not a subsidy hemorrhage. The expensive actions are where the gates are.
2. **Gate what institutions need, not what citizens need.** "Same functionality for all" means *viewing depth* — every tier sees full findings, full citations, every view. What paid tiers add is **workflow**: bulk data exports, API access, high rate limits, volume PDF/report generation, priority for new analysis runs, embed/citation tooling, and support. A citizen never hits those walls; an institution cannot do its job without them.
3. **License terms carry the legal weight.** Free-tier use is licensed for personal, educational, and civic non-commercial purposes; commercial use requires a paid license (standard public-data-platform model; see business/revenue.md). No wall enforces this — the term exists so detected institutional use is a compliance conversation, not an ambiguity. Institutions generally *prefer* to be licensed (procurement, invoices, SLAs, audit).
4. **Detect patterns; invite, don't block.** (FR-31.) Institutional usage is recognizable — corporate IP/ASN ranges, sustained systematic volume, crawl-shaped access across jurisdictions, export-shaped scraping, clusters of accounts on one company domain. Detected patterns trigger rate limits on expensive endpoints plus an upgrade invitation ("It looks like you're using this professionally"), never a hard block — an aggressive gate would inevitably catch the teachers, librarians, and freelancers the free tier exists for. (Wikipedia/OpenStreetMap posture.)

*Owner note (2026-07): the anonymous-access posture itself is accepted for now but not settled — see OQ-10.*

## Web Application — Primary UI Surfaces

*(Moved from architecture.md — these are product surfaces, not technical components.)*

- **Jurisdiction Explorer** — browse by state/county/city; rule corpus + KPI dashboard side by side
- **Vulnerability Browser** — filter by type, severity, policy domain, jurisdiction
- **Policy Domain Deep Dives** — criminal justice, healthcare, housing, education, environment
- **Country Comparison** — US vs. OECD peers on the same KPI dimensions
- **Patch Proposals** — AI-drafted recommendations with editability
- **Trend View** — KPI trajectory over time ("is this jurisdiction improving or degrading?")

## Deep Linking & Shareable URLs (product principle)

Every screen, view, report, finding, and data point has a unique, stable, bookmarkable URL. This is a first-class design requirement — the platform is meant to be cited, shared, and embedded in research. Sharing a vulnerability finding, a jurisdiction scorecard, or a specific KPI trend must require nothing more than copying a URL. *(Realizes FR-26; stability guaranteed by NFR-05.)*

URL scheme examples:
```
/us                                          # Federal overview
/us/ca                                       # California jurisdiction page
/us/ca/view/sdg-pyramid                      # SDG Pyramid view for California
/us/ca/kpi/infant-mortality                  # Specific KPI for California
/us/ca/vulnerability/VLN-00142               # Specific vulnerability finding
/us/ca/patch/PCH-00089                       # Specific patch proposal
/us/ca/constitution/test/democratic-design   # Democratic Design scorecard for CA
/compare/us/ca/us/mn                         # Side-by-side comparison
/case/citizens-united-v-fec                  # Case law entry
/domain/healthcare                           # Policy domain view across jurisdictions
```

Rules for shareable URLs:
- IDs are stable — a vulnerability or patch does not change its URL when the analysis is updated (updates are versioned)
- Views preserve their state in the URL (selected KPI, time range, jurisdiction filters)
- Every downloadable report has a permanent URL for the online version
- Social preview metadata (Open Graph) on every URL

## Epics / Roadmap

*Epic-shaped from the original Build Phases. **Not final epics** — when BMAD is installed the PM agent generates the formal Epic List from the requirements above; this is the intended shape and sequencing.*

### Epic 1 (Phase 1) — Meta Foundation (MVP)
*Goal: a usable product that scores structural (meta) vulnerabilities for the highest jurisdictions.*
- Schema supporting the Layer 1–5 taxonomy and the Democratic Design Test Suite
- Meta-first ingestion: U.S. Constitution + all 27 Amendments; all 50 state constitutions; ~50 major city/county charters
- Test Suite implemented as structured prompts against each document
- Democratic Design Score dashboard: federal vs. states vs. cities — heat map by test block
- 10 core KPIs (federal/state) for initial outcome context
- Web UI: Constitutional Explorer + Democratic Design scorecard
- *(Primary FRs: 01–09, 11, 26)*

### Epic 2 (Phase 2) — Full Federal Content + All 50 States
*Goal: extend from meta to content law, add money & comparison.*
- Content-layer ingestion: US Code, CFR, all state statutes & administrative codes
- Process/Participation layer (Layer 2): election codes, APAs, open-government laws
- Conflict detection: federal vs. state; content rules that violate meta
- Full KPI pipeline (all dimensions); Money Explorer; Compare
- Causal chain analysis: meta → content → KPI shortfalls
- Country comparison (US vs. OECD top 20); PDF reports
- *(Primary FRs: 03, 08, 10, 12–18, 27–29)*

### Epic 3 (Phase 3) — County + City + Special Districts
*Goal: deep local coverage and intra-state comparison.*
- Municode integration for municipal codes
- Local-level KPI data where available
- Intra-state comparison (county↔county, city↔city); Money values-inference
- *(Primary FRs: 16, extends 01–18)*

### Epic 4 (Phase 4) — Intelligence Layer
*Goal: natural-language access and the full Design suite.*
- Chat interface: NL Q&A with RAG over corpus + KPIs (Law Explorer)
- Pattern analysis; patch difficulty scoring; beneficiary analysis
- Full Design suite (patch proposals, legislation designer, simulation)
- Public contribution layer: flag vulnerabilities, propose patches
- *(Primary FRs: 19–25)*

## Open Questions

Consolidated from `{TBR}` markers across the planning docs. Product-level items live here; technical `{TBR}`s remain in [architecture.md](architecture.md).

### Resolved (2026-07)

- **OQ-1 — Problem statement.** ✅ Revised in [project-brief.md](project-brief.md).
- **OQ-2 — Persona self-identification & identity verification.** ✅ Decision: same functionality for all personas; users self-identify at registration and are charged by tier. Real-person verification (no aliases) for paid/Steward tiers via a managed identity-verification provider — see [Identity & Verification](#identity--verification) below and FR-30.
- **OQ-3 — "Mode" definition.** ✅ **Iceboxed.** One analysis mode for now; FR-04 and the Test flow no longer reference Mode (see Icebox note under Non-Goals).
- **OQ-4 — "Intent" and "System Type" enumerations.** ✅ Defined in [domain-model.md — Analysis Configuration](domain-model.md#analysis-configuration--intent--system-type) (revised after owner review): **System Type** is a dimensional model — five dimensions (sovereignty source, representation mode, executive structure, vertical distribution, practice-vs-paper) with named bundles as picklist entries (e.g., "Federal presidential republic" = the US bundle) and test logic keyed to dimensions; **multi-benchmark scoring** is first-class (any jurisdiction × any bundle; claimed-vs-effective divergence is always computed). **Intent** is nine baseline qualities — Responsive, Resilient, Elastic, Safe, Accurate, Accessible (shared with the software architecture principles) + Equal, Economically Viable, Sustainable (governance-specific) — defaulting to Balanced; intents reweight emphasis, never evidence.
- **OQ-5 — Budget taxonomy normalization.** ✅ Yes, it fits the domain model: [Budget Taxonomy Crosswalk](domain-model.md#budget-taxonomy-crosswalk) — COFOG (UN standard) as the canonical spine, weighted many-to-many mapping from native lines, existing OMB/Census-of-Governments crosswalks reused, LLM-assisted mapping for the long tail with human review.
- **OQ-6 — Compare peer-grouping.** ✅ Defined in [Peer Grouping Methodology](domain-model.md#peer-grouping-methodology) (domain model, since it's citable methodology): kNN structural peers on z-scored covariates + named cohorts + labeled aspirational comparisons; rankings only within peer set; covariates always displayed.
- **OQ-7 — KPI→vulnerability attribution rigor.** ✅ Defined in [KPI→Rule Attribution Confidence Model](domain-model.md#kpirule-attribution-confidence-model): Bradford Hill / GRADE-adapted evidence signals, four confidence bands (C0 Gap → C3 Strong association) with **no "proven causation" band by design**, band-locked language templates, contrary evidence always shown.
- **OQ-11 — Source license.** ✅ *Decided (2026-07), one verification pending:* **BSL (Business Source License)** for the platform code — source-available, self-hosting free for civic/research/internal/governmental use, competing commercial hosted offerings prohibited during the protection window; parameters: Change License = Apache 2.0, Change Date ≤ 4 years per release, Additional Use Grant drafted per HashiCorp/MariaDB precedent (consider FSL as a simpler modern variant of the same intent). **Layered licensing:** BSL covers code only — domain-model.md methodology → CC BY-SA (citable), published findings/data → CC BY, product trademark registered separately. Requires a CLA (not just DCO). Always describe as "source-available," never "open source." **Pending verification: confirm BSL compatibility with target foundation funders before locking** (some foundations require OSI-approved licenses for funded software — see business/funding.md). *Rationale note (owner, 2026-07): commercial users pay for the operated service (hosted, continuously ingested corpus, memoized analyses, support) — never the code — so BSL restricts no constituency in the revenue model, only would-be competing hosts; conversely, because revenue doesn't depend on code secrecy, falling back to an OSI license (Apache/AGPL) is survivable if a priority funder requires it. BSL is cheap insurance, not a load-bearing wall.*

### Still open

- **OQ-8 — Identity-verification friction vs. conversion.** FR-30 mandates IDV for paid tiers; measure drop-off once live and decide whether Researcher tier keeps full IDV or drops to institutional-email + ORCID only.
- **OQ-9 — Naming.** Product name still TBD (see [business/naming.md](business/naming.md)).
- **OQ-10 — Anonymous-access posture (owner reservation).** The no-account free tier is accepted for now (mission: frictionless civic access) but the owner is not certain it holds long-term. Revisit with real data: free-rider leakage observed (FR-31 telemetry), abuse volume, and the trade-offs of a lightweight free account (email-only) — pros: measurable audience, saved state, gentler upgrade path, abuse throttling per account; cons: friction excludes exactly the casual civic users the mission targets, and creates PII obligations the anonymous model avoids. Decision point: after Epic 2, with FR-31 data in hand.

## Next Steps

1. Owner review of the `{DRAFT}` success metrics, the OQ resolutions above (especially the Identity & Verification ladder and the iceboxed Mode), and the new domain-model methodology sections (system types, budget crosswalk, peer grouping, attribution confidence).
2. UX design pass (Claude Design) over the primary UI surfaces.
3. At the code boundary: install BMAD (`npx bmad-method install`, v6.x); PM agent regenerates/validates this PRD and produces the formal Epic List and sharded stories.
