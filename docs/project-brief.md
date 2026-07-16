# Project Brief — JustInstitutions

> **BMAD Project Brief** (Analyst-owned). The upstream vision/context document that seeds [prd.md](prd.md).

## Problem Statement

The body of rules that define how a society is governed — constitutions, statutes, regulations, codes, and the case law that interprets them — is one of the most consequential systems humans build, it impacts our economic prosperity, the bounds of our collective achievement, our health, our safety, and our pursuit of meaning and happiness, yet it is analyzed less systematically and less rigorously than a mid-sized software product. 

We are living in an age where pattern recognition exceeds that of human capabilities. 

Yet, currently, in the realm of societal governance:

- **Vulnerabilities and failures are diagnosed anecdotally and reactively.**  Gaps, conflicts, loopholes, and obsolete rules are usually noticed only after harm occurs, one story at a time — never as a systematic, standing audit of the whole corpus.

- **The link between rules and outcomes is often not clear.** Some tools track legislation; others track outcome metrics; few systematically connect *which specific rules* drive or impede *which measurable societal outcomes*.

- **The system is often incomprehensible to the people it governs.** Citizens, students, and even legislative staff cannot easily interpret what the law is, why an outcome is poor, or what could change it without professional intermediation.

- **Reform is often proposed without due rigor.** Fixes are advanced without a consistent understanding of the entire system, a read on feasibility, who benefits from the status quo, what comparable jurisdictions have tried, or all the likely outcome consequences.

This system seeks to do better. We can accelerate our such capabilities leveraging the best of what AI has to offer.
## Premise

Governance behaves like software. Software has bugs, security vulnerabilities, outdated dependencies, and conflicting modules; governance systems have the same failure modes — gaps in coverage, contradictory rules, exploitable loopholes, and laws that produce outcomes opposite to their intent. Treating the legal corpus as an analyzable system — with a test suite, a vulnerability taxonomy, and outcome KPIs as performance metrics — makes those failures visible, comparable, and fixable.

**Logical model:**

```
Intent / Expected Behavior
        ↓
  Rule Corpus (Law)         ← "The Software"
        ↓
  Enforcement & Culture     ← "Runtime Environment"
        ↓
  Outcomes (KPIs)           ← "System Performance"
        ↓
  Gap = KPI Shortfall + Rule Analysis → Vulnerability
```

**Key acknowledgment:** unlike software, causality between rules and outcomes is probabilistic, not deterministic. The platform surfaces correlations and flags likely causal mechanisms, but always distinguishes correlation from confirmed causation.

## Proposed Solution

A platform that:

1. Ingests the full legal corpus of the US (federal → state → county → city)
2. Tracks outcome KPIs as a proxy for system "performance"
3. Analyzes the corpus for vulnerabilities relative to intent/KPIs
4. Enables comparison across jurisdictions and countries
5. Surfaces actionable "patches" (policy recommendations)
6. Lets users explore outcomes and spending for any jurisdiction, and compare them

Organized around three areas, each a valid standalone entry point that also chains into a loop:

- **Test** — diagnose the rule system and find vulnerabilities.
- **Explore** — investigate outcomes, spending, and the law itself (KPI / Money / Compare / Law).
- **Design** — propose and pressure-test fixes.

*Find what's broken (Test) → understand why and how it compares (Explore) → craft the remedy (Design) → re-test.* A user may also work entirely within one area without engaging the others.

```
   TEST ───────────► EXPLORE ───────────► DESIGN
 (diagnose the      (understand           (propose &
  rule system)       outcomes, money,      simulate the
        ▲            and the law)          fix)   │
        └───────────────────────────────────────◄┘
                 (re-test after a proposed patch)
```

Delivered as an interactive web app plus downloadable reports.

## Target Users

Two broad classes (detailed personas live in [prd.md](prd.md)):

- **The People** — Students (K–16), Teachers (K–16), Engaged Citizens. Free access; plain language essential.
- **Institutional Stewards** — Graduate Students, Policy Researchers, Journalists, Policy Advocates, Legislative Staffers, Government Officials. Deeper access tiers.

## Scope

**Design goal — jurisdiction-agnostic by construction.** The platform is designed to apply to **any UN-recognized jurisdiction and any of its sub-jurisdictions** (nation → state/province/region → county/department/kreis/district → city → special district). This generality is an *architectural capability*, realized through generic jurisdiction modeling and the pluggable `CorpusAdapter` / `SystemType` / `TestSuite` / `KPIView` interfaces. Nothing about which data we load first constrains which jurisdictions the system can represent. US-specific content (e.g., the Federalist-derived test blocks) exists as *one instance* of a system type, never as the core schema.

The distinction below is therefore between **capability** (all jurisdictions, always) and **initial data load** (a sequencing choice).

**In scope (initial data load):**
- **Rules corpus:** United States first. Every UN-recognized nation is selectable in the picker; non-US nations simply have no rules ingested *yet* (the adapter slot exists).
- **KPI/outcome + spending data:** loaded for other nations from launch, to support Explore and Compare internationally.
- All three functional areas (Test, Explore, Design), the four KPI Views, and the Democratic Design Test Suite (Blocks A–L).

**Deferred (not a capability limit — a loading/sequencing choice):**
- Ingesting rules corpora for non-US jurisdictions (adapters added over time).
- Additional analysis *domains* (corporate, healthcare, international law) — architecture stays domain-pluggable; only the government/democratic domain ships first.
- Full US local coverage (county/city/special districts) — phased in.

## Context / Differentiation

No existing platform combines the three capabilities this one requires (full landscape in partners.md, private business repo):

1. **Rules-to-outcomes linkage** — connecting specific statutes/regulations to measurable societal outcomes.
2. **Full-hierarchy vulnerability analysis** across the complete federal → state → county → city corpus.
3. **Multi-framework analytical lenses** (Dimensional, SDG Pyramid, Design Principles, Capital Impact) over the same corpus.

Legislative trackers (GovTrack, OpenStates, Quorum), legal-research tools (Westlaw/Lexis), and governance indices (WJP, OECD, UN SDG Tracker) each cover a slice; none link rules to outcomes and surface fixable vulnerabilities.

## Constraints & Assumptions

- **Public-interest first**, not commercial-product first. Free for public/civic use; commercial users subsidize (see revenue.md, private business repo).
- **Cost-efficient by design** — pgvector over a dedicated vector DB, prompt caching, Batch API, serverless (see cost.md, private business repo).
- Assumes continued availability of free government data APIs for both corpus and KPIs.

## Key Risks

- **Attribution risk** — over-claiming rule→outcome causation. Mitigated by the correlation-vs-causation discipline baked into the design.
- **Data-coverage risk** — local corpora and some KPIs are incomplete or exist only as current snapshots (no history). Mitigated by event-sourced storage and phased local rollout.
- **Legitimacy risk** — the methodology (test blocks, KPI selection) must withstand academic and funder scrutiny; it is maintained as a separately citable framework (see [domain-model.md](domain-model.md)).
