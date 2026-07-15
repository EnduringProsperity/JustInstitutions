# Architecture — JustInstitutions

> **BMAD Architecture Document.** Companion to [project-brief.md](project-brief.md) (vision) and [prd.md](prd.md) (requirements). This is the single source of truth for technical architecture, technology selection, and project structure. Section order follows the BMAD architecture template.

## Introduction

This document describes the technical architecture that realizes the functional components defined in [prd.md](prd.md) — **Test** (governance vulnerability testing), **Explore** (KPI / Money / Compare / Law), and **Design** (patch & legislation authoring). It is intended to be the definitive technical reference for implementation: any technology choice, component boundary, or project-structure question is answered here, not in the PRD.

*Scope note:* the initial build targets a single domain (US governmental / democratic governance). The architecture is deliberately domain-pluggable (see Extensibility) but the first release will not implement additional domains.

## Architectural Principles — Software

The full principles catalog — the six Intent qualities (**Elastic, Resilient, Responsive, Safe, Accurate, Accessible**), Reactive Design, Domain-Driven Design, 12-Factor, the nine sources of nondeterminism and their mitigations, and supplementary paradigms (ports & adapters, event sourcing/CQRS, bulkheads, consistency models, telemetry) — is a **cross-project document**, not a JustInstitutions-specific one.

- **Canonical (living) version:** `~/.claude/docs/software-architecture-principles.md` — applies to all projects; referenced from the global `~/.claude/CLAUDE.md` so it is consulted in every session.
- **Frozen snapshot in this repo:** [architecture-principles.md](architecture-principles.md) (freeze date noted in its header) — keeps this doc set self-contained and stable.

What belongs *here* is how those principles bind **this** system:

### How the principles bind JustInstitutions

| Principle | Binding commitment in JustInstitutions |
|-----------|--------------------------|
| **Responsive** | Analyses are **shared, versioned artifacts computed asynchronously** — user-facing reads serve precomputed results from Postgres/CDN, never wait on an LLM. Long-running work (ingestion, test runs) is job-based with visible status; the UI always answers, even if the answer is "run in progress, started 14:02." |
| **Resilient** | Each corpus adapter and ETL pipeline is a **bulkhead**: one broken scraper or rate-limited API degrades one source, never the platform. Every external call (government APIs, Claude API) has timeouts, retries with backoff + jitter, and a circuit breaker. |
| **Elastic** | Compute is stateless and queue-buffered; heavy analysis goes through the Batch API; idle cost approaches zero. Load is dominated by *reads of precomputed results*, which scale via CDN/SSR caching, not by scaling the analysis engine. |
| **Safe** | AI-generated legal language is architecturally gated behind disclaimers and review flags (NFR-04); access tiers enforce depth (FR-28); secrets in the platform secret store, never in code; audit trail on admin actions. |
| **Accurate** | Provenance is a schema property, not a convention: every finding row carries citations to source text (NFR-02); analysis runs are versioned and reproducible (NFR-05); correlation vs. causation labeling is enforced at the data-model level (NFR-03). |
| **Accessible** | Plain-language surfaces for The People tier (NFR-08); SSR for indexable public pages (NFR-09); WCAG conformance checked in CI. |

| Paradigm | Binding commitment in JustInstitutions |
|----------|--------------------------|
| **Reactive** | Ingestion and analysis are **message-driven jobs** on a queue; Claude API rate limits are handled with backpressure (bounded concurrency per worker), not retry storms. |
| **DDD** | Bounded contexts: **Corpus** (rules + case law ingestion/versioning), **Analysis** (test execution, vulnerabilities), **KPI** (observations, views), **Money** (budget/revenue), **Patch** (proposals). The plugin interfaces (`Domain`, `SystemType`, `TestSuite`, `KPIView`, `CorpusAdapter`) are the ports; the ubiquitous language is [domain-model.md](domain-model.md). Core domain = the analysis framework; auth/billing are Generic — **bought, not built** (managed auth + Stripe). |
| **12-Factor** | Config in environment; stateless API processes; structured logs to stdout; migrations/backfills as one-off admin processes; strict build/release separation via CI. |
| **Nondeterminism discipline** | The rule corpus is **event-sourced** (enact/amend/repeal events; state = replay) — recovery and "law as of date X" are deterministic. Ingestion is **idempotent** (content-hash dedup keys; re-running a scrape is always safe). Analysis runs are pinned to (corpus version, model version, prompt version) so results are reproducible and comparable. UIs display **data vintage** rather than implying freshness (NFR-10). LLM output is the one *intentionally* nondeterministic component — contained by structured-output schemas, versioned prompts, and golden-set regression tests (see Test Strategy). |


## High Level Architecture

The single most important architectural observation, missed in the first pass: **this system has two very different halves, and they must not share a runtime.**

1. **A read-heavy public site.** The overwhelming majority of traffic is people *reading precomputed results* — scorecards, findings, KPI views, comparisons. An analysis of California's constitution is a **shared, versioned artifact** computed once and read thousands of times, not a per-user computation. This half must be fast, cacheable, SEO-indexable, and cheap: SSR + CDN over denormalized read models in Postgres.
2. **A slow, expensive compute plane.** Ingestion (scraping, chunking, embedding) and analysis (test-block execution via the Claude API, much of it through the Batch API with up to 24-hour turnaround) are long-running, failure-prone batch jobs. This half must be job-based, idempotent, resumable, and rate-limit-aware — the opposite of request/response.

The architecture is therefore **CQRS-shaped**: the compute plane *writes* versioned artifacts (corpus events, embeddings, test results, KPI observations); the serving plane *reads* projections of them. A job queue is the boundary between the two — it was absent from the first-pass diagram and is load-bearing.

```
                 READ / SERVING PLANE (fast, cheap, cacheable)
┌──────────────────────────────────────────────────────────────┐
│   CDN / edge cache                                            │
│   Next.js (SSR, React, TypeScript) — public pages indexable   │
└──────────────────────────────────────────────────────────────┘
                              ↑
┌──────────────────────────────────────────────────────────────┐
│   API Layer — FastAPI (Python)                                │
│   reads: projections (scores, findings, KPI views, budgets)   │
│   writes: enqueue jobs only (ingest, analyze) + status        │
└──────────────────────────────────────────────────────────────┘
             ↑                                  │ enqueue
             │ read models                      ▼
┌────────────────────────────┐   ┌─────────────────────────────┐
│  PostgreSQL + pgvector     │◄──│  Job Queue (Postgres-backed) │
│  • event-sourced rule store│   │  ingest / embed / analyze /  │
│  • embeddings (pgvector)   │   │  etl jobs, retries, status   │
│  • KPI time series         │   └─────────────────────────────┘
│  • test results, vulns,    │                 │
│    patches (versioned)     │                 ▼
│  • read-model projections  │   ┌─────────────────────────────┐
└────────────────────────────┘◄──│  Workers (compute plane)     │
                                 │  • Ingestion: adapters →     │
                                 │    events → chunks → embeds  │
                                 │  • Analysis Engine: Claude   │
                                 │    API (caching + Batch)     │
                                 │  • KPI ETL: 10+ sources      │
                                 └─────────────────────────────┘
                                               ↑
                          external sources: federal APIs, state portals,
                          Municode, CourtListener, Census/CDC/BLS/OECD…
```

Key properties of this shape:

- **One database, many roles.** PostgreSQL holds the event-sourced rule store, pgvector embeddings, KPI time series, analysis artifacts, and the job queue itself. At this scale, one well-modeled Postgres beats five specialized services — fewer moving parts, transactional consistency between events and projections, one backup story. Each role is schema-isolated so any one can be extracted later (the bulkhead is logical first, physical when evidence demands).
- **The API layer never does heavy work.** It reads projections and enqueues jobs. Nothing user-facing ever blocks on a scrape or an LLM call; analysis progress is exposed as job status.
- **Versioned artifacts everywhere.** A test run is pinned to (corpus version, prompt version, model version). Re-analysis creates a new version; existing finding URLs keep resolving to what they cited (NFR-05).
- **A modular monolith, not microservices.** API and workers are one codebase (the bounded contexts from the principles section are enforced as module boundaries) deployed as two process types — 12-Factor web + worker. Splitting into services is a later, evidence-driven step.

### Why there is no service decomposition (deliberately)

Readers expecting a breakdown by *service* should read this architecture's layers instead: the **bounded contexts** (Corpus, Analysis, KPI, Money, Patch, Platform) are the would-be services — explicit boundaries, contracts, schema isolation, everything a service has except a network between them; the **Components** section is the functional breakdown; the **process types** (`api`, `worker`) are the deployment breakdown. Network boundaries are withheld on purpose:

1. **Every network boundary imports the nine nondeterminism problems** (see architecture-principles.md) — partial failure, retries, ordering, dual writes — *between* components that, in-process, have none of them. That price buys independent scaling and team autonomy; at this stage the project needs neither.
2. **Transactional enqueue requires the shared database.** The queue's core correctness property — a rule event and its follow-on jobs commit atomically — cannot survive the queue and the corpus living in different services.
3. **Boundaries now, distribution later.** Boundaries and the data model are the expensive-to-change parts and are locked in from day one; the monolith keeps them cheap to enforce and cheap to extract from.

**Extraction path (pre-planned, evidence-driven):** bounded context → own schema (done) → own process type → own service. Triggers: sustained differential scaling needs (e.g., embedding workers vs. API), queue/serving contention in Postgres, or multiple teams. If services materialize, their breakdown lives here, in the Components section — not in a separate document.

### Accepted trade-offs of the modular monolith (stated plainly)

The no-services decision is a bet, and these are its costs. They are accepted knowingly, not overlooked — listed in order of how much they are expected to bite this project:

1. **Boundary erosion is enforced by discipline, not physics.** In microservices the network *makes* callers respect the boundary; in a monolith, the Corpus/Analysis boundary is one lazy import away from fiction. This is the top risk for JustInstitutions specifically because BMAD dev agents will generate code at high volume, and code generators take the shortest path unless a linter refuses it. **Mitigation (mandatory, see Coding Standards): `import-linter` contracts in CI** — cross-context imports fail the build.
2. **Shared database = shared performance fate.** One Postgres serves the event store, embeddings, KPI series, the job queue, and user-facing reads. A heavy ETL burst, an HNSW index build, or autovacuum on a large table can degrade public-page latency. Schema isolation isolates *logic*, not *IO*. Watch item: per-context query latency in observability; the queue-contention trigger above is one instance of this broader exposure.
3. **Deployment coupling.** Every deploy ships everything — a one-line KPI fix redeploys ingestion and analysis code; rollbacks are all-or-nothing; a bad migration touches every context. Nearly free solo; becomes coordination friction with multiple contributors.
4. **Runtime blast radius within a process type.** The `api`/`worker` split contains much, but within `worker`, a memory-leaking scraper degrades co-resident analysis jobs. We rely on job-level isolation, restarts, and crash-only design — weaker than per-service crash isolation.
5. **One dependency tree, one runtime.** SDK/library/Python upgrades hit all contexts simultaneously; conflicting version needs cannot be isolated; a hot spot cannot be rewritten in another language without breaking the single-codebase premise.
6. **Team-scaling ceiling (Conway's law).** Monoliths serialize teams: shared CI, merge contention, no independent ownership. Irrelevant at solo scale; real if the project is funded and staffed — which is the roadmap's ambition. Team growth is an explicit extraction trigger for this reason.
7. **Extraction costs more than "cheap later" implies.** Code behind clean boundaries lifts out easily; two things do not: (a) **data migration** out of the shared Postgres, and (b) the **transactional-enqueue guarantee** — rule event + follow-on job committing atomically *only exists because everything shares one database*. Extracting a context across that seam means rebuilding the guarantee as an **outbox pattern** with at-least-once delivery — a genuine redesign of the seam, not a lift-and-shift. Price it into any future extraction decision.
8. **The sociological failure mode: "later" never comes.** Evidence-driven splits compete with feature work and usually lose; teams live with a degrading monolith past its trigger points because extraction is never the urgent thing. Partial defense: the triggers are written down above, in advance — but written triggers still require someone to act on them. Revisit this section at every major phase boundary (each Epic).

**The other side of the ledger, for honest comparison:** these costs mostly scale with team size and traffic and are therefore *deferred*; microservices' costs (distributed failure modes — the nine nondeterminism problems at every boundary — operational surface, dual writes) are paid *immediately and constantly*. For a one-builder, pre-revenue, batch-heavy system, deferring the monolith's costs while avoiding distribution's upfront costs is the actual bet. If the premises change (team, traffic, funding), the bet must be re-evaluated — that is what the triggers are for.

## Tech Stack

*This table is the **definitive technology selection** for the project — the single source of truth. Rationale for each choice follows. (Revised 2026-07: hosting moved off Lambda-first, LangChain dropped in favor of the direct SDK, queue/ORM/auth/CI rows added, LLM claims updated to current facts.)*

| Layer | Choice | Primary alternatives considered |
|-------|--------|--------------------------------|
| Front end | Next.js + React + TypeScript | Remix/React Router, SvelteKit, Astro |
| API layer | FastAPI (Python) + Pydantic | Node.js/TypeScript, Go |
| ORM / migrations | SQLAlchemy + Alembic | Django ORM, raw SQL + sqlc-style codegen |
| Vector + relational store | PostgreSQL + pgvector (managed: Neon or Supabase) | Weaviate, Pinecone, Qdrant, Elasticsearch |
| Job queue / workers | Postgres-backed queue (Procrastinate or pgmq; `SELECT … FOR UPDATE SKIP LOCKED`) | Celery + Redis, AWS SQS, Temporal |
| LLM / analysis | Claude API — direct Anthropic Python SDK, with prompt caching + Batch API + structured outputs | OpenAI, Gemini, self-hosted open-weights (Llama/Mistral/Qwen) |
| Auth & billing | Managed auth (Clerk or Supabase Auth) + Stripe | Auth0, roll-your-own |
| Hosting | Vercel (front end) + one small container platform for API + workers (Railway / Render / Fly.io); GitHub Actions for scheduled ETL | AWS Lambda, ECS/Fargate, EC2 |
| CI/CD | GitHub Actions | CircleCI, Buildkite |
| Observability | Sentry (errors) + structured JSON logs + LLM cost telemetry per run | Datadog (later, if warranted) |
| Edge protection & usage-pattern detection | Cloudflare (free/Pro) in front of the API — WAF, bot detection, per-IP rate limits, ASN data — + app-level usage events in Postgres analyzed by a nightly classification job (FR-31) | AWS WAF, Fastly, Vercel WAF alone |

### Architectural Choices and Rationale

#### Why PostgreSQL + pgvector (not a dedicated vector database)?
- **Options considered:** pgvector (chosen), Qdrant/Weaviate ($25–250/month managed), Pinecone ($70+/month), Elasticsearch (complex ops)
- **Chosen because:** pgvector is a PostgreSQL extension — zero additional service, zero additional cost, one database to manage, and **transactional consistency between a chunk's text, its metadata, and its embedding** (a real correctness benefit dedicated vector DBs give up). With HNSW indexes, pgvector comfortably serves the corpus scale in view: even the full US Code + CFR + 50 states is single-digit millions of chunks, well within pgvector's proven range. Vector search is also *not* this system's core retrieval mode — most queries are metadata-filtered (jurisdiction, layer, domain) with semantic search layered on, which plays to Postgres's strengths (combined SQL + vector predicates in one query).
- **When to revisit:** sustained p99 > 500ms on ANN queries after HNSW tuning, or corpus growth past ~50M chunks. Migration path: Qdrant (self-hostable, no lock-in) before Pinecone.

#### Why FastAPI (Python)?
- **Options considered:** FastAPI/Python (chosen), Node.js/TypeScript, Go
- **Chosen because:** the compute plane is data engineering + NLP — pandas/polars for KPI ETL, BeautifulSoup/Scrapy for scraping, the Anthropic Python SDK for analysis — and keeping API + workers in **one language and one codebase** (modular monolith, two process types) is worth more than any per-request performance difference. FastAPI's Pydantic models double as the validation layer for LLM structured outputs: the same schema that defines a `TestResult` validates what Claude returns. Async support handles the I/O-bound fan-out to external APIs.
- **Deliberate revision:** the first pass cited LangChain as a pillar. Dropped — the orchestration needs here (prompt assembly, caching markers, batch submission, retry) are a thin layer over the **direct Anthropic SDK**, and a framework between us and the API adds versioning churn and obscures token/cost control. We write that thin layer ourselves.
- **Tradeoff:** two languages in the repo (Python + TypeScript). Accepted; the boundary is a typed OpenAPI contract, with client types generated from the FastAPI schema so the front end can't drift.

#### Why Next.js (not plain React or another framework)?
- **Options considered:** Next.js (chosen), Remix/React Router, SvelteKit, Astro
- **Chosen because:** SSR is a hard requirement, not a preference — public findings pages must be indexable (NFR-09) and render Open Graph previews for shareable URLs (FR-26). Next.js has the largest ecosystem for data-heavy dashboards, first-class incremental static regeneration (ideal for "versioned artifact, read many times" pages), and native Vercel deployment. Astro was worth considering for the mostly-static public pages, but the app's interactive surfaces (explorers, cascading budget views, compare) dominate.

#### Why Claude API (not open-weights or another provider)?
- **Options considered:** Claude API (chosen), OpenAI, Gemini, self-hosted open-weights (Llama/Mistral/Qwen)
- **Chosen because:** (1) **Cost structure fits the workload** — legal documents are large, stable, and re-queried: prompt caching makes cache reads ~90% cheaper than fresh input tokens, and the Batch API halves the price of the non-interactive bulk analysis that dominates our volume; the two stack. (2) **Long context** — full constitutions, charters, and statute clusters are analyzed whole (200K-token standard context, with 1M-token options), avoiding chunking artifacts precisely where whole-document structural analysis matters most (Track A). (3) **Quality of legal reasoning, citation fidelity, and schema-conforming structured output** is the deciding factor for a system whose credibility rests on findings that cite real text accurately.
- **Honest correction to the first pass:** the claim that OpenAI "has no prompt caching equivalent" is outdated — major providers now offer caching and batch pricing. The durable differentiators are reasoning/citation quality on legal text and the context-length fit; the cost mechanics are necessary but no longer unique. Self-hosting open-weights remains rejected: GPU hosting cost + eval burden + weaker legal reasoning, against no requirement for data residency (the corpus is public).
- **Vendor-risk mitigation:** all model calls go through one internal `AnalysisModel` interface with versioned prompts and schema-validated outputs, so a provider swap is an adapter change, not a rewrite. Every run records model + prompt version (reproducibility, NFR-05).

#### Why a Postgres-backed job queue (not Celery/Redis or SQS)?
- **Options considered:** Postgres-backed (chosen — Procrastinate or pgmq), Celery + Redis, AWS SQS, Temporal
- **Chosen because:** the queue is load-bearing (it is the seam between serving and compute planes) but the *scale* is modest — thousands of jobs/day, not millions/second. A Postgres queue means **zero extra infrastructure**, and — decisive for correctness — **jobs enqueue transactionally with the data they operate on** (an ingestion event and its follow-on embed job commit atomically; no dual-write problem). Retries, scheduled jobs, and status queries are plain SQL.
- **When to revisit — throughput:** if job throughput starts contending with serving queries (watch lock contention), move the queue to SQS — the worker code doesn't change, only the transport adapter.
- **When to revisit — orchestration (Temporal & friends):** durable-execution frameworks (Temporal is the reference) are the right *category* for this compute plane — internally they event-source and deterministically replay workflow state, the same discipline we apply to the rule corpus — but they are premature while workflows are shallow 2–4-step chains of idempotent jobs, where "just re-run it" already provides the recovery guarantee for free. Adopt durable execution when any of these **explicit triggers** fire:
  1. **Epic 4's Design suite ships** — patch simulation → downstream-conflict checks → re-Test loops are genuinely long-lived, branching, stateful workflows (the first honest Temporal-shaped requirement on the roadmap).
  2. **Human-in-the-loop pauses enter automated pipelines** — e.g., expert-review gates (NFR-04) woven into runs: "analyze, wait days for a reviewer, continue." Durable workflows beat status-column state machines here.
  3. **The smell test** — worker code accumulating hand-rolled resumption logic (status columns, "which step were we on" fields, scattered retry bookkeeping) means we are re-implementing Temporal badly; switch before it spreads.
- **Middle ground before a Temporal cluster:** Postgres-native durable-execution tools — **DBOS** (durable execution as a library on the Postgres you already run) and **Hatchet** (Postgres-backed workflow engine) — deliver Temporal-style guarantees without a new service and without giving up transactional enqueue. If a trigger fires earlier than Epic 4, evaluate these first; Temporal (self-hosted or Cloud) when workflow volume/complexity outgrows them. Note Temporal reintroduces a dual-write seam between our database and its own — one reason it is not the default.
- **Keeping the option cheap (binding rule now):** every job is a pure, idempotent *activity*; orchestration ("what runs after what") stays thin and separate from activity logic. A later migration to DBOS/Hatchet/Temporal then moves only the thin layer — activities port unchanged.

#### Why managed auth + Stripe (buy, not build)?
Auth and billing are **Generic domains** (Test Block J8 applied to ourselves): they differentiate nothing and are dangerous to get wrong. Clerk or Supabase Auth for identity (including the identity-verification step in FR-30 — see prd.md OQ-2 resolution), Stripe for tiered billing. Revisit only if pricing at scale becomes hostile.

#### Why container hosting for compute (revised from "AWS Lambda, serverless-first")?
- **Options considered:** small container platform (chosen — Railway/Render/Fly.io), AWS Lambda, ECS/Fargate, EC2
- **Deliberate revision.** The first pass chose Lambda for compute; that conflicts with the actual workload three ways: (1) **runtime caps** — Lambda's 15-minute limit is wrong for ingestion crawls and analysis jobs that run for hours and poll 24-hour Batch API results; (2) **packaging** — the Python data stack (pandas, scrapers, SDKs) fights Lambda's image/cold-start constraints; (3) **the job model** — long-polling a queue from Lambda is an anti-pattern. What we actually keep from "serverless-first" is the *principle* (cost tracks usage, no idle fleet, no DevOps): one small always-on container for the API (~$10–20/month) plus workers that scale to zero (Fly machines / Railway cron), with scheduled ETL on GitHub Actions (free tier covers early cadence). The front end stays on Vercel (genuinely serverless, free at low traffic).
- **When to revisit:** sustained multi-instance load or compliance needs → ECS/Fargate on AWS with the same container images. Nothing in the code assumes the platform (12-Factor III/IV).

## Data Models

Entities are organized by bounded context (see Architectural Principles). Names below are the ubiquitous language of [domain-model.md](domain-model.md) and are binding for schema, code, and API. Concrete DDL for the load-bearing tables is in Database Schema.

### Corpus context (event-sourced — the system of record for law)

| Entity | Purpose | Key fields / notes |
|--------|---------|-------------------|
| **Jurisdiction** | Any governable unit, any country, any level | Stable slug id (`us`, `us-ca`, `us-ca-alameda-county`); parent link + materialized path (ltree) for hierarchy queries; level (nation/primary/county/municipal/special); population & covariates (feeds peer grouping). Exists independently of corpus availability. |
| **LegalDocument** | A versionable body of rule text (constitution, statute title, charter, code, ordinance set) | jurisdiction; layer (1–5); doc_type; source adapter + URL + license status. |
| **RuleEvent** | *The append-only event log* — one row per enactment/amendment/repeal | Monotonic id = global order; document; event_type; effective_date vs. recorded_at (bitemporal); payload (text or delta); source citation; **content_hash (idempotency key)**. Never updated, never deleted. |
| **DocumentVersion** | *Projection* — the text of a document over a validity interval, derived by replaying RuleEvents | valid_from/valid_to interval; full text; derived_from event range. "Law as of date X" = the version whose interval contains X. Rebuildable from scratch (replay determinism is a CI test). |
| **Chunk** | Retrieval unit for content-layer documents | document_version; section ref; text; metadata tags (policy domain, layer, bounded context); **embedding + embedding_model + embedding_version** (re-embedding is a versioned migration). |
| **JudicialDecision** (Layer 3) | Court decision shaping effective law | court, decision_date, citation, holding summary, **precedential_scope** (which jurisdictions it binds); full text ref. |
| **DecisionRuleLink** | How a decision affects a rule | decision ↔ document/section; effect (interprets / narrows / expands / overrules); feeds Effective Law Synthesis & Drift Detection. |

### Analysis context (versioned artifacts — the system of record for findings)

| Entity | Purpose | Key fields / notes |
|--------|---------|-------------------|
| **SystemTypeBundle** | A named bundle of dimension positions (domain-model dimensional model) | d1_sovereignty…d4_vertical (nullable enums; D5 is assessed, not stored as claim); suite composition. Data, not code — admins add rows. Includes the Universal baseline (all dims null). |
| **TestSuite / TestBlock / Test** | The versioned test battery | Block carries **scope_tag** (design_conformance / system_agnostic / mixed); Test carries per-test scope where block is mixed; pass criteria text; all three are versioned — results pin the version. |
| **AnalysisRun** | One memoized run | **run_key = hash(jurisdiction, corpus_version, bundle@version, suite@version, prompt_version, model_version)** — UNIQUE. Intent is deliberately excluded (read-time weighting). corpus_version = the max RuleEvent id in scope at run start (a watermark). status; timing; **cost telemetry** (tokens in/out, cache reads, batch flag). |
| **BlockResult** | Memoized unit of LLM work | Keyed by (document_version × test_block@version × prompt_version × model_version) — shared across runs via a run↔block join. A run assembles block results; a subset run reuses them. |
| **TestResult** | One test's outcome within a BlockResult | rating (pass/partial/gap/fail); rationale; **citations (jsonb, CHECK non-empty)** — a result without citations cannot exist (NFR-02 at the schema level). |
| **Vulnerability** | A finding with a *stable public identity* | Public id (`VLN-00142`) minted once; jurisdiction; taxonomy type; layer; policy domain. URL-stable forever (NFR-05). |
| **VulnerabilityVersion** | The finding's content at a given run | severity, description, KPI-impact estimate, beneficiary analysis, patch difficulty, refactoring tags, citations; links to the producing run. Re-analysis appends a version; the old one keeps resolving. |
| **Attribution** | KPI ↔ rule/vulnerability linkage | **confidence_band (C0–C3, no higher value exists in the enum)**; evidence signals (S1–S6 + contrary) as structured jsonb; band-locked display template id. |

### KPI context

| Entity | Purpose | Key fields / notes |
|--------|---------|-------------------|
| **KPI** | Catalog entry | slug; category; unit; direction (higher-is-better?); **universal_or_contested label**; tags: SDG(s), Design Principle(s), capital type(s) — the four views are *tag pivots over one table*, not four datasets. Admin-extensible (FR-29). |
| **KPIObservation** | Time-series datum | (kpi, jurisdiction, period, source, ingest_version) unique; **value_raw preserved alongside value_normalized** + normalization method; vintage date (NFR-10). Out-of-tolerance values quarantine (status field), never publish silently. |

### Money context

| Entity | Purpose | Key fields / notes |
|--------|---------|-------------------|
| **BudgetLine** | Native budget node (spend or revenue), as published | jurisdiction; fiscal_year; parent link (native cascade); kind (spending/revenue); amount; funding-source links (revenue pairing, FR-15). |
| **CofogMapping** | Crosswalk to canonical taxonomy | budget_line → COFOG class with **weight (weights per line sum to 1)**; mapping_confidence + review status (LLM-assisted long tail). |
| **CofogClass** | Reference taxonomy | COFOG code/hierarchy; carries the values-inference tags once (J8 core/supporting/generic, capital types, SDG links) — every mapped budget inherits them. |

### Patch & Platform contexts

| Entity | Purpose | Key fields / notes |
|--------|---------|-------------------|
| **Patch / PatchVersion** | Proposal with stable public id (`PCH-00089`) + versioned seven-step content | difficulty 1–5, feasibility, refactoring tags, draft language (marked AI-generated), four output formats; optional link to originating Vulnerability. |
| **Account / Verification** | Identity (Platform) | Tier; persona (self-identified); **verification result only** (provider ref, date — never ID documents); affiliation signals. |
| **UsageEvent** | FR-31 telemetry | hashed IP (rotating salt), ASN, endpoint class, timestamp; 90-day aggregate-then-delete. |
| **Job** | Queue row (Postgres-backed) | type; typed args; idempotency key; status; retries; dead-letter context. Enqueued transactionally with the data it operates on. |

**Cross-context rules:** contexts reference each other only by stable ids (never foreign-key into another context's internals beyond the id); all analysis artifacts are append-only or versioned — the only hard deletes in the system are UsageEvent aging and GDPR-style account erasure.

## Components (Key System Components)

Six components. The first pass listed four; the **Job Orchestrator** was implicit and is now explicit — it is the seam the whole system hangs on (see High Level Architecture) — and **Usage Telemetry & Pattern Detection** was added with FR-31.

**0. Job Orchestrator**
- Postgres-backed queue; every unit of compute-plane work (ingest a source, embed a batch, run a test block, refresh an ETL) is a typed, idempotent job with an idempotency key.
- Jobs enqueue transactionally with the data that triggered them; retries with backoff + jitter; per-external-service concurrency caps (backpressure against Claude API and government API rate limits).
- Job status is queryable by the API layer — this is what makes long-running analysis compatible with a responsive UI (FR-03's "ingest on demand" enqueues and reports, never blocks).
- Dead-letter handling: a job that exhausts retries parks with its error context for operator review; it never silently disappears.

**1. Ingestion Pipeline**
- Source-specific adapters (federal APIs, state scrapers, Municode parser) implementing the `CorpusAdapter` interface — each adapter is a bulkhead: rate limits, failures, and format drift in one source are contained to that adapter.
- **Event-sourced storage**: each enactment, amendment, and repeal stored as an immutable event. Current law is derived by replaying events. Enables "what was the law on date X?" queries — both for the platform's analysis and as a direct governance quality test (J9).
- **Idempotent by construction**: documents are deduplicated by content hash; re-running any scrape or backfill is always safe (at-least-once delivery + idempotent handlers = exactly-once effect).
- Document chunking by section/statute (content layer); full-document ingestion for meta documents (short enough for full-context analysis)
- Metadata tagging: jurisdiction, level, date enacted, date amended, policy domain, layer (1–5), bounded context, DDD vulnerability flags
- Embedding generation (for semantic search); embedding model + version recorded per chunk so re-embedding is an explicit, versioned migration

**2. Analysis Engine (Claude API) — Multi-Track Architecture**

Cross-cutting properties (all tracks):
- An analysis run is a **shared, versioned artifact** pinned to (corpus version, prompt version, model version, test-suite version). Users read runs; they rarely trigger them. Re-analysis produces a new version; old finding URLs keep resolving (NFR-05).
- **Run memoization (content-addressed runs).** A run's identity is the hash of its evidence-bearing configuration: (jurisdiction, corpus version, system-type bundle, test-suite version, prompt version, model version). Before any run is enqueued, the engine looks up that **run key** — if a completed run exists, it is served, not re-executed; if one is *in flight*, the request attaches to it rather than starting a duplicate. Two users testing the same jurisdiction against the same corpus vintage with the same configuration always converge on one artifact and zero new LLM spend. "Refresh" is therefore never a user whim — a new run happens only when some component of the key actually changed (new corpus events, new prompt/suite version).
- **Intent is not part of the run key.** Intent weightings (domain-model.md, nine baseline qualities) reweight emphasis and ordering but never alter evidence — so they are applied at *read/assembly time* over stored block results. Changing intent re-sorts a report for free; it never triggers analysis.
- **Memoization is per test block, not per report.** Results are stored at (document @ corpus version × test block × config) granularity and reports are *assembled* from block results. A user selecting a subset of blocks (FR-05) reuses blocks already computed for the full battery; running one new block against an already-tested constitution costs one block, not a re-run of twelve.
- All model calls go through one internal `AnalysisModel` interface: versioned prompt templates, prompt caching markers on stable document prefixes, Batch API for bulk work, and **Pydantic-schema-validated structured outputs** — a malformed model response is a retryable job failure, never a malformed database row.
- Every output row carries **provenance**: the exact source-text citations (document, section, corpus version) supporting the finding (NFR-02). A finding without citations is rejected at the schema level.
- Token usage and cost are recorded per run (cost telemetry — see Observability).

*Track A: Meta Analysis (Layers 1–2)*
- Full constitutional/charter document fits within Claude's context window — analyzed whole, not chunked
- Democratic Design Test Suite run against each document: structured extraction of rights, powers, checks, amendment procedures
- Comparative analysis: how does this jurisdiction's structure compare to peer jurisdictions and democratic design best practices?
- Causal chain detection: which meta vulnerabilities explain downstream content or outcome failures?
- Prompt caching on constitutional documents (short, stable, frequently re-queried)

*Layer 4 routing (Rights / Civil Liberties — dual-track by design)*
- Layer 4 has no dedicated track because the domain model assigns it **both** analyses: rights statutes (Civil Rights Act, ADA, Fair Housing, Title IX and state/local equivalents) run through **Track A's test-suite treatment** (equal-citizenship tests — Block C, esp. C4 equal protection and C6 enforceability, with protected-class and enforcement-mechanism extraction) **and** through **Track B's KPI linkage** (disparity metrics, complaint rates — the Inequity vulnerability type)
- Operationally: a Layer 4 document produces block results in both tracks against the same document version; the finding assembler joins them (a rights guarantee that passes on text but shows unmitigated KPI disparity is precisely the Layer 4 signature finding — paper right, broken enforcement)

*Track B: Content Analysis (Layer 5)*
- Vulnerability detection prompts per taxonomy type (Gap, Conflict, Loophole, Obsolescence, Ambiguity, Enforcement Gap, Inequity, Preemption Conflict)
- Intent extraction from preambles, legislative history, committee reports
- KPI-to-rule linkage: "Which rules are likely responsible for this KPI shortfall?"
- Patch drafting: "Given this gap/conflict, what would a fix look like?"
- Batch API for bulk analysis tasks (50% discount on non-real-time processing)

*Track C: Interaction Analysis*
- Surfaces causal chains: meta vulnerability → process corruption → content failure → KPI shortfall
- Constitutional validity flagging: content rules that conflict with meta
- "Root cause vs. symptom" classification for every vulnerability

*Track D: Judicial Interpretation Analysis (Layer 3)*
- Ingest landmark and precedent-setting decisions linked to each statute in the corpus
- Extract: holding, affected statutory provisions, court level, date, precedential scope
- **Effective Law Synthesis:** combine the statute text with controlling case law to produce a plain-language statement of what the rule actually means in practice today — distinct from what the text says
- **Drift Detection:** compare the statute's stated intent (from preambles, legislative history) against the effective rule as shaped by case law; flag statutes where drift exceeds a defined threshold
- **Overruled/Modified Flag:** identify statutes whose practical application has been substantially altered by decisions like *Loper Bright* (agency deference restructured), *Shelby County* (VRA coverage formula), *Dobbs*, or *Citizens United*
- **Dissent Tracking:** track minority opinions that may signal future shifts in interpretation — dissents that become majorities over time represent a predictable form of legal evolution
- Precedent is jurisdiction-specific: a 9th Circuit holding governs 9 states; Supreme Court governs all. Data model tracks precedential scope.

**3. KPI Data Service**
- ETL pipelines pulling from 10+ data sources on schedule; each pipeline is an isolated, idempotent job (a Census schema change cannot break the CDC pipeline)
- Normalization to per-capita, per-100k, or percentage as appropriate; PPP/cost-of-living adjustment for cross-country money (FR-18)
- Time-series storage keyed by (KPI, jurisdiction, period, source, ingest version) — raw source values preserved alongside normalized values so normalization bugs are re-runnable, not data-destroying
- Validation against published figures at ingest (see Test Strategy); out-of-tolerance values quarantine rather than publish
- Jurisdiction-level resolution where available (federal, state, county, city); vintage displayed with every series (NFR-10)

**4. Web Application** — the front-end tier (Next.js). Its primary UI surfaces (Jurisdiction Explorer, Vulnerability Browser, Policy Domain Deep Dives, Country Comparison, Patch Proposals, Trend View) are product requirements and are specified in [prd.md](prd.md#web-application--primary-ui-surfaces).

**5. Usage Telemetry & Pattern Detection** *(realizes FR-31 — the free-tier free-rider posture in prd.md)*
- **Edge layer (buy):** Cloudflare in front of the API domain — WAF, bot scoring, and per-IP/per-ASN rate limits on the expensive endpoints (run triggers, exports, report generation). Static/browse traffic stays fast and ungated.
- **Usage events (build, minimal):** every request to a gated-capability endpoint logs a usage event (coarse: hashed IP, ASN, account ID if any, endpoint class, timestamp) to Postgres. This is operational telemetry, not analytics tracking — no fingerprinting, no third-party trackers on public pages.
- **Classification (a nightly job, like everything else):** a scheduled queue job aggregates usage events and flags institutional-shaped patterns — corporate ASN + sustained volume, crawl-shaped jurisdiction sweeps, export-shaped scraping, account clusters on one org email domain. Flags produce two actions only: tighter rate limits on expensive endpoints for that source, and an upgrade invitation surfaced in the UI/response headers. **Never a hard block** (prd.md posture: invite, don't block).
- **Privacy discipline:** raw IPs are hashed with a rotating salt; events older than 90 days are aggregated then deleted; nothing here creates a PII store for anonymous visitors (this constraint is deliberate — it keeps the anonymous-access model clean while OQ-10 remains open).
- **Feeds OQ-10:** the aggregate leakage/abuse numbers from this component are exactly the evidence the owner wants before revisiting the anonymous-access posture after Epic 2.

## External APIs & Data Sources

Corpus and KPI ingestion draw on external public data sources. US rules load first; every UN-recognized nation is selectable, with adapters added over time.

**Adapter contract.** Every source is wrapped in an adapter that declares, in code: auth mechanism (API key / none / scrape), rate limits and polite-crawl policy, data format, update cadence, historical availability (full history vs. current-snapshot-only — this determines whether event sourcing can be backfilled or starts "from now"), and license/ToS status. *{TBR — fill the per-source contract table as each adapter is built; the fields are fixed, the values need verification per source.}*

**Source risk assessment (informs sequencing):**
- **Low risk / build first:** congress.gov, govinfo.gov, Federal Register, regulations.gov, CourtListener, Census, BLS, CDC, USAspending — official APIs, free, documented, stable.
- **Medium risk:** state open-data portals (quality varies wildly by state; ~10 states are excellent, a long tail is scrape-only); OpenStates covers legislative data but not full codes.
- **High risk / defer & isolate:** Municode and American Legal Publishing (ToS constraints on scraping — pursue partnership or licensed access before bulk ingestion; see business/partners.md); Westlaw/Lexis (licensing cost is incompatible with the public-interest cost model — treat as gap-filler of last resort, not a dependency).
- **Standing assumption to monitor:** the whole model assumes continued free availability of government data APIs (see project-brief Key Risks). Mitigation: raw responses are archived at ingest, so a source going dark freezes vintage rather than destroying capability.

**Legal corpus (rules):**
- **Federal statutes & regulations:** congress.gov API, GPO (govinfo.gov), regulations.gov, Federal Register API
- **States:** most have open data portals; Westlaw/LexisNexis for gaps; OpenStates API
- **Local:** Municode (~2,700 municipalities), American Legal Publishing, direct scraping
- **Case law (Layer 3):** CourtListener / Free Law Project (free open API; comprehensive federal + growing state), Caselaw Access Project — Harvard (digitized historical, state + federal), Oyez.org (SCOTUS + oral arguments), Google Scholar (broad supplementary)
- **International:** OECD legal databases, EUR-Lex (EU), national open data portals

**KPIs:** Census, CDC WONDER/BRFSS, FBI NIBRS/UCR, BLS, EPA (AQS/TRI/SDWA), OECD, World Bank, WHO, Gallup, Transparency International, Freedom House, World Justice Project, and others (full catalog in [domain-model.md](domain-model.md#kpi-catalog)).

**Budget/Money:** USAspending.gov, OMB, Treasury Fiscal Data; state budget portals/ACFRs; Census of Governments.

## Core Workflows

*{TBR — document the primary end-to-end flows as sequence diagrams. The canonical user-facing flow (Test) is specified in [prd.md](prd.md#feature-detail--user-flows); the technical workflows to detail here are: (a) corpus ingestion & event replay, (b) test-block execution against a document, (c) KPI→vulnerability linkage, (d) patch simulation & re-test.}*

## Database Schema

Concrete DDL for the load-bearing tables (Corpus event store, Analysis artifacts with memoization keys, KPI time series). Money/Patch/Platform tables follow the same patterns and are added with their epics. Extensions: `pgvector`, `ltree`, `pgcrypto`.

```sql
-- ============ CORPUS (event-sourced system of record) ============

CREATE TABLE jurisdiction (
  id            text PRIMARY KEY,              -- stable slug: 'us', 'us-ca', 'us-ca-alameda-county'
  parent_id     text REFERENCES jurisdiction(id),
  path          ltree NOT NULL,                -- us.ca.alameda_county — subtree queries
  name          text NOT NULL,
  level         text NOT NULL CHECK (level IN ('nation','primary','county','municipal','special')),
  country_code  char(2) NOT NULL,
  covariates    jsonb NOT NULL DEFAULT '{}'    -- population, income, urbanization… (peer grouping)
);
CREATE INDEX ON jurisdiction USING gist (path);

CREATE TABLE legal_document (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  jurisdiction_id text NOT NULL REFERENCES jurisdiction(id),
  layer         smallint NOT NULL CHECK (layer BETWEEN 1 AND 5),
  doc_type      text NOT NULL,                 -- constitution | statute_title | charter | admin_code | ordinance_set
  title         text NOT NULL,
  source_adapter text NOT NULL,
  source_url    text,
  license_status text NOT NULL DEFAULT 'public'
);

-- Append-only. No UPDATE/DELETE grants; enforced additionally by trigger.
CREATE TABLE rule_event (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- global order (corpus_version watermark)
  document_id   bigint NOT NULL REFERENCES legal_document(id),
  event_type    text NOT NULL CHECK (event_type IN ('enact','amend','repeal')),
  effective_date date NOT NULL,                -- when the law changed (domain time)
  recorded_at   timestamptz NOT NULL DEFAULT now(),  -- when we learned of it (system time)
  payload       jsonb NOT NULL,                -- full text ref or structured delta
  source_citation text NOT NULL,
  content_hash  text NOT NULL,                 -- idempotency: re-ingest is a no-op
  ingest_job_id bigint,
  UNIQUE (document_id, content_hash)
);

-- Projection: rebuildable by replay; replay determinism is a CI test.
CREATE TABLE document_version (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_id   bigint NOT NULL REFERENCES legal_document(id),
  valid_from    date NOT NULL,
  valid_to      date,                          -- NULL = current
  full_text     text NOT NULL,
  from_event_id bigint NOT NULL,
  to_event_id   bigint NOT NULL,
  UNIQUE (document_id, valid_from)
);
-- "law as of X": WHERE document_id=? AND valid_from<=X AND (valid_to IS NULL OR valid_to>X)

CREATE TABLE chunk (
  id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_version_id bigint NOT NULL REFERENCES document_version(id),
  section_ref         text NOT NULL,           -- e.g. '42 USC §1983'
  text                text NOT NULL,
  metadata            jsonb NOT NULL DEFAULT '{}',   -- policy_domain, tags
  embedding           vector(1024),
  embedding_model     text NOT NULL,
  embedding_version   int  NOT NULL
);
CREATE INDEX ON chunk USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON chunk USING gin (metadata);

CREATE TABLE judicial_decision (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  court         text NOT NULL,
  decision_date date NOT NULL,
  citation      text NOT NULL UNIQUE,
  slug          text NOT NULL UNIQUE,          -- '/case/citizens-united-v-fec'
  holding_summary text,
  precedential_scope ltree NOT NULL,           -- jurisdiction subtree this binds
  full_text_ref text
);

CREATE TABLE decision_rule_link (
  decision_id   bigint NOT NULL REFERENCES judicial_decision(id),
  document_id   bigint NOT NULL REFERENCES legal_document(id),
  section_ref   text,
  effect        text NOT NULL CHECK (effect IN ('interprets','narrows','expands','overrules')),
  PRIMARY KEY (decision_id, document_id, section_ref)
);

-- ============ ANALYSIS (versioned artifacts + memoization) ============

CREATE TABLE system_type_bundle (
  id      text PRIMARY KEY,                    -- 'universal-baseline', 'federal-presidential-republic'
  version int  NOT NULL DEFAULT 1,
  name    text NOT NULL,
  d1_sovereignty text, d2_representation text, d3_executive text, d4_vertical text,
  suite_config jsonb NOT NULL                  -- which blocks/tests, variant weightings
);

CREATE TABLE test_block (
  id        text NOT NULL,                     -- 'A'..'L'
  version   int  NOT NULL,
  name      text NOT NULL,
  scope_tag text NOT NULL CHECK (scope_tag IN ('design_conformance','system_agnostic','mixed')),
  PRIMARY KEY (id, version)
);

CREATE TABLE test (
  id         text NOT NULL,                    -- 'A1', 'H3'
  block_id   text NOT NULL,
  block_version int NOT NULL,
  scope_tag  text,                             -- per-test override where block is 'mixed'
  pass_criteria text NOT NULL,
  PRIMARY KEY (id, block_version),
  FOREIGN KEY (block_id, block_version) REFERENCES test_block(id, version)
);

CREATE TABLE analysis_run (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  run_key        text NOT NULL UNIQUE,         -- hash(jurisdiction, corpus_version, bundle@v, suite@v, prompt_v, model_v)
  jurisdiction_id text NOT NULL REFERENCES jurisdiction(id),
  corpus_version bigint NOT NULL,              -- rule_event.id watermark at start
  bundle_id      text NOT NULL,
  bundle_version int  NOT NULL,
  prompt_version text NOT NULL,
  model_version  text NOT NULL,
  status         text NOT NULL DEFAULT 'queued'
                 CHECK (status IN ('queued','running','awaiting_batch','completed','failed')),
  started_at     timestamptz, completed_at timestamptz,
  tokens_in bigint DEFAULT 0, tokens_out bigint DEFAULT 0,
  tokens_cache_read bigint DEFAULT 0, used_batch_api boolean DEFAULT true
);
-- Intent is NOT here: it is read-time weighting, never an analysis input.

CREATE TABLE block_result (               -- memoized unit of LLM work, shared across runs
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  block_key      text NOT NULL UNIQUE,        -- hash(document_version, block@v, prompt_v, model_v)
  document_version_id bigint NOT NULL REFERENCES document_version(id),
  block_id       text NOT NULL, block_version int NOT NULL,
  prompt_version text NOT NULL, model_version text NOT NULL,
  status         text NOT NULL DEFAULT 'pending',
  tokens_in bigint DEFAULT 0, tokens_out bigint DEFAULT 0
);

CREATE TABLE run_block_result (           -- a run assembles shared block results
  run_id bigint NOT NULL REFERENCES analysis_run(id),
  block_result_id bigint NOT NULL REFERENCES block_result(id),
  PRIMARY KEY (run_id, block_result_id)
);

CREATE TABLE test_result (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  block_result_id bigint NOT NULL REFERENCES block_result(id),
  test_id        text NOT NULL,
  rating         text NOT NULL CHECK (rating IN ('pass','partial','gap','fail')),
  rationale      text NOT NULL,
  citations      jsonb NOT NULL CHECK (jsonb_array_length(citations) > 0),  -- NFR-02: no citation, no result
  UNIQUE (block_result_id, test_id)
);

CREATE TABLE vulnerability (              -- stable public identity (NFR-05)
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  public_id   text NOT NULL UNIQUE,           -- 'VLN-00142', minted once, never reused
  jurisdiction_id text NOT NULL REFERENCES jurisdiction(id),
  vuln_type   text NOT NULL,                  -- taxonomy enum (Gap, Conflict, … Starvation Capture)
  layer       smallint NOT NULL CHECK (layer BETWEEN 1 AND 5),
  policy_domain text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE vulnerability_version (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  vulnerability_id bigint NOT NULL REFERENCES vulnerability(id),
  version_no     int NOT NULL,
  produced_by_run bigint NOT NULL REFERENCES analysis_run(id),
  severity       smallint NOT NULL,
  description    text NOT NULL,
  kpi_impact     jsonb, beneficiary_analysis jsonb,
  patch_difficulty smallint CHECK (patch_difficulty BETWEEN 1 AND 5),
  refactoring_tags text[],
  citations      jsonb NOT NULL CHECK (jsonb_array_length(citations) > 0),
  UNIQUE (vulnerability_id, version_no)
);

CREATE TABLE attribution (                -- KPI ↔ rule/vulnerability, confidence-capped
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  vulnerability_id bigint REFERENCES vulnerability(id),
  kpi_id        bigint NOT NULL,             -- → kpi(id)
  jurisdiction_id text NOT NULL REFERENCES jurisdiction(id),
  confidence_band text NOT NULL CHECK (confidence_band IN ('C0','C1','C2','C3')),  -- no C4 by design
  evidence_signals jsonb NOT NULL,           -- {S1..S6, contrary:[…]}
  produced_by_run bigint REFERENCES analysis_run(id)
);

-- ============ KPI (time series, four views = tag pivots) ============

CREATE TABLE kpi (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug      text NOT NULL UNIQUE,             -- 'infant-mortality'
  name      text NOT NULL,
  category  text NOT NULL,                    -- View A dimension
  unit      text NOT NULL,
  higher_is_better boolean,
  consensus text NOT NULL CHECK (consensus IN ('universal','contested')),
  sdg_tags  smallint[] NOT NULL DEFAULT '{}',       -- View B
  design_principle_tags smallint[] NOT NULL DEFAULT '{}',  -- View C
  capital_tags text[] NOT NULL DEFAULT '{}',        -- View D
  methodology text
);

CREATE TABLE kpi_observation (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kpi_id       bigint NOT NULL REFERENCES kpi(id),
  jurisdiction_id text NOT NULL REFERENCES jurisdiction(id),
  period       daterange NOT NULL,
  value_raw    numeric NOT NULL,              -- as published (normalization bugs are re-runnable)
  value_normalized numeric,
  normalization text,                         -- 'per_100k', 'per_capita', 'pct', 'ppp_usd'
  source       text NOT NULL, source_url text,
  ingest_version int NOT NULL,
  vintage_date date NOT NULL,                 -- NFR-10: displayed in UI
  status       text NOT NULL DEFAULT 'published' CHECK (status IN ('published','quarantined')),
  UNIQUE (kpi_id, jurisdiction_id, period, source, ingest_version)
);
CREATE INDEX ON kpi_observation (jurisdiction_id, kpi_id);
```

**Schema-level invariants worth naming:** `rule_event` is append-only (revoked UPDATE/DELETE + trigger); `test_result` and `vulnerability_version` cannot exist without citations (CHECK); `analysis_run.run_key` and `block_result.block_key` UNIQUE constraints *are* the memoization mechanism (a duplicate enqueue loses the race and attaches); `attribution.confidence_band` has no value above C3 — the "never assert causation" rule is a type, not a convention.

*{TBR — remaining DDL with their epics: Money (budget_line, cofog_mapping, cofog_class), Patch (patch, patch_version), Platform (account, verification, usage_event, job — job table per Procrastinate/pgmq's schema).}*

## Source Tree / Project Structure — Plugin Architecture

```
/core/                          # Domain-agnostic framework
  /analysis/                    # Base analysis pipeline (layer-agnostic)
  /vulnerability/               # Vulnerability taxonomy (abstract)
  /kpi/                         # KPI data model and tagging framework
  /corpus/                      # Corpus ingestion interfaces
  /scoring/                     # Scoring engine (abstract)

/domains/                       # Domain-specific implementations
  /government/                  # Initial domain: governmental systems
    /system-types/
      /democratic/              # System type: democratic governance
        test-suite/             # Democratic Design Test Suite (Blocks A–L)
        corpus-adapters/        # Federal/state/local legal corpus adapters
        kpi-views/              # The 4 KPI view frameworks (A–D)
    /corpus/
      /federal/                 # US federal corpus adapters
      /state/                   # State-level corpus adapters
      /local/                   # Municipal corpus adapters
      /judicial/                # Case law adapters (CourtListener, etc.)

/plugins/                       # Additional domains/system-types registered here
  /corporate-governance/        # Future: corporate bylaws, charters, SEC rules
  /healthcare-systems/          # Future: hospital governance, accreditation rules
  /international/               # Future: treaty frameworks, international law
```

## Infrastructure & Deployment

*(Revised with the Tech Stack hosting decision — container platform for compute, not Lambda.)*

- **Topology:** Vercel (front end, per-PR preview deploys) · one container platform (Railway / Render / Fly.io) running two process types from one image — `api` (FastAPI, always-on) and `worker` (queue consumers, scale-to-zero) · managed Postgres + pgvector (Neon or Supabase) · scheduled ETL triggers via GitHub Actions cron hitting an enqueue endpoint (jobs execute on workers, so Actions' runtime limits don't matter).
- **Environments:** `dev` (local — Docker Compose with the same Postgres + pgvector image as prod; 12-Factor X), `staging` (small clone, seeded with one state's corpus), `prod`. Same build artifact promoted across environments; config differs only via environment variables.
- **CI/CD:** GitHub Actions — lint + typecheck + tests on every PR; build once; deploy front end (Vercel) and container image on merge to main. Database migrations (Alembic) run as a release step, always backward-compatible with the previous app version (expand-migrate-contract pattern).
- **Secrets:** platform secret stores (Vercel/Railway env vars) now; no secrets in the repo, ever. Graduate to a dedicated secret manager when there are multiple operators.
- **Backups / recovery:** managed Postgres PITR (both Neon and Supabase provide it) + weekly logical dumps to object storage. **Restore is drilled, not assumed** — the event-sourced corpus makes recovery verifiable: replay must reproduce projections.
- **Observability:** Sentry for errors (front + back); structured JSON logs to stdout (platform aggregation); per-run **LLM cost telemetry** (tokens in/out, cache hits, batch vs. interactive — Claude spend is the dominant marginal cost, so it is a first-class metric, reconciled monthly against business/cost.md estimates); uptime check on the public site.
- **Cost posture:** ~$0 idle beyond one small API container (~$10–20/mo) and managed Postgres free/low tier; everything else scales with usage.

## Coding Standards

*Kept deliberately concrete — in BMAD this section (plus Tech Stack and Source Tree) is loaded into the Dev agent's always-in-context set.*

**Python (API + workers)**
- Python 3.12+; `uv` for dependency management, lockfile committed.
- `ruff` (lint + format) and `mypy --strict` on all new code; both gate CI.
- Type hints everywhere; **Pydantic models at every boundary** (API request/response, LLM structured outputs, adapter payloads, job arguments). Internal domain objects are plain dataclasses/entities — the domain layer does not import FastAPI or SQLAlchemy (ports & adapters).
- **Context boundaries are CI-enforced with `import-linter`** (this is the mitigation for accepted trade-off #1 — see "Accepted trade-offs of the modular monolith"). Contracts declared in `pyproject.toml`: (a) *independence* — the bounded contexts (`corpus`, `analysis`, `kpi`, `money`, `patch`, `platform`) may not import each other's internals, only each other's published `contracts` module (ids, events, typed interfaces); (b) *layering* — `domain` may not import `infrastructure` in any context. A cross-context import is a **build failure**, not a review comment — this rule exists precisely because BMAD dev agents will generate code at volume, and generated code takes the shortest path unless the build refuses it. Same applies to SQL: no queries joining across another context's schema (enforced by per-context database roles with schema-scoped grants).
- Errors: raise typed exceptions; adapters translate external failures into domain errors at the boundary; never `except Exception: pass`. Every job failure lands in the dead-letter queue with context.
- Logging: structured (`structlog`), one event per line, with `job_id` / `run_id` / `jurisdiction_id` correlation fields. No `print`.
- Naming follows the **ubiquitous language** of domain-model.md: `Jurisdiction`, `Rule`, `RuleEvent`, `TestBlock`, `TestResult`, `Vulnerability`, `KPIObservation`, `Patch`. Same word, same meaning, everywhere (J1 applied to ourselves).

**TypeScript (front end)**
- `strict: true`; ESLint + Prettier gate CI.
- API client types **generated from the FastAPI OpenAPI schema** — no hand-written mirrors of backend types.
- Server components / SSR by default; client components only where interactivity requires.
- Accessibility is a standard, not a sweep: semantic HTML, labeled controls, keyboard paths; `eslint-plugin-jsx-a11y` + automated checks in CI (NFR-08).

**Cross-cutting**
- Every mutating operation has an idempotency key. Every LLM prompt is a versioned artifact in the repo (`prompts/` with semver), never an inline string.
- Migrations are append-only and reversible; no destructive migration without a backfill plan.
- Conventional commits; PRs small and single-purpose; CI green before merge.

## Test Strategy

The distinctive testing problem here: **an LLM is a nondeterministic dependency at the heart of the system.** Classic tests cover the deterministic core; an eval harness covers the model boundary; humans cover analytical credibility. Deterministic layers get classic CI tests; the model boundary gets evals with golden sets; nothing ships on "the demo looked right."

**Deterministic core (classic tests, run in CI on every PR)**
- **Ingestion-adapter unit tests** — each corpus adapter validated against *recorded fixtures* of real source responses (not live calls); parser output checked for structure, metadata completeness, and layer tagging. Fixture drift detected by a scheduled live "canary" job per source, so a source format change surfaces as a canary failure, not a prod incident.
- **Event-replay / versioning tests** — apply a known sequence of enact/amend/repeal events; assert derived current law and **"law as of date X"** for several X. Replay determinism: replaying the same log twice yields byte-identical projections.
- **Idempotency tests** — every job type executed twice with the same input produces the same end state (the at-least-once contract).
- **Semantic-retrieval integration tests** — ingest a known statute into a real Postgres + pgvector (Docker in CI); verify the expected chunk returns for known queries, including combined metadata + vector predicates.
- **KPI-pipeline validation** — golden comparisons against officially published figures for sampled (KPI, jurisdiction, year) triples; normalization math property-tested (per-capita, per-100k, PPP).
- **Contract tests** — front-end client generated from the OpenAPI schema compiles against the current API; breaking changes fail CI.

**Model boundary (eval harness, run on prompt/model/suite changes — not every PR)**
- **Golden-set regression for test-block scoring** — a human-labeled set of (document, test) → expected (rating, citation) pairs; start with ~all Blocks against the U.S. Constitution + 3–5 diverse state constitutions where expert consensus exists. A prompt or model change must not regress agreement below threshold; disagreements are reviewed, not auto-accepted.
- **Citation integrity checks (automated)** — every citation in every model output is verified to exist in the referenced corpus version and to contain the quoted text. This is mechanical and non-negotiable: a hallucinated citation is a released-blocking defect (NFR-02).
- **Schema conformance** — structured outputs validated against Pydantic schemas; conformance failure rate tracked per prompt version.
- **Cost regression** — evals record token usage; a prompt change that doubles per-run cost fails loudly.

**Human review (credibility)**
- **Analysis-quality review** — periodic expert review of vulnerability findings against known policy debates (does the finding match expert understanding?); agreement rate is a product KPI (see prd.md Success Metrics).
- **UI edge-case testing** — jurisdiction explorer renders territories, DC, consolidated city-counties, and unusual sub-structures; comparison views handle missing-data jurisdictions honestly.

## Cross-Cutting: Deep Linking & Shareable URLs

The **deep-linking / shareable-URL product principle and URL scheme** live in [prd.md](prd.md#deep-linking--shareable-urls-product-principle) (realizes FR-26; stability guaranteed by NFR-05). Architectural implications to honor here: stable, content-addressable IDs; server-side rendering for indexable public pages (NFR-09); versioned records so a finding/patch URL survives re-analysis (NFR-05).

## Extensibility & Extension Points

The framework is designed to generalize beyond its initial configuration. This instantiation is:
- **Domain:** Governmental / public policy systems
- **System Type within domain:** Democratic governance
- **Test Suite:** Democratic Design Test Suite (Blocks A–L)
- **KPI Views:** The four frameworks (Dimensional, SDG, Design Principles, Capital Impact)

The code is organized so that each of these is a pluggable module — not hardcoded. New domains, new system types within a domain, and new KPI views can be added without restructuring the core platform. This is both good software architecture and strategically important: the same analytical infrastructure could be applied to corporate governance systems, healthcare system architectures, educational institution governance, or international treaty frameworks.

### Extension Points

| Extension Point | What It Enables | Interface Required |
|----------------|----------------|-------------------|
| **New Domain** | Apply the full analysis framework to a non-governmental rule system (corporate governance, hospital systems, educational institutions) | `Domain` interface: defines corpus structure, layer taxonomy, and default analysis approach |
| **New System Type** | Within a domain, analyze a different system variant (e.g., within government: parliamentary vs. presidential vs. autocratic systems) | `SystemType` interface: defines the test suite, scoring rubric, and comparison benchmarks |
| **New Test Suite** | Add a new analytical lens to an existing system type (e.g., "Fiscal Responsibility Test Suite" or "Environmental Governance Test Suite") | `TestSuite` interface: defines test blocks, pass/fail criteria, scoring, and evidence citation |
| **New KPI View** | Add a fifth way to pivot over the same underlying KPI data (e.g., a "Happiness Index View" or "Planetary Boundaries View") | `KPIView` interface: defines how KPIs are categorized, hierarchically organized, and visualized |
| **New Corpus Adapter** | Ingest rules from a new data source | `CorpusAdapter` interface: fetch, parse, chunk, embed, and metadata-tag documents |

### Configuration-Driven Analysis

Every analysis run is configured by a manifest specifying:
- Which domain to analyze
- Which system type within that domain
- Which test suites to apply
- Which KPI views to generate
- Which jurisdiction hierarchy to traverse

This means a researcher studying corporate governance failures could configure the platform for "corporate governance domain, US Fortune 500 system type, Corporate Governance Test Suite" and get the same analysis infrastructure applied to SEC filings, corporate bylaws, and board charters that we apply to constitutions and statutes.

The initial build will not implement multiple domains — but the architecture will not foreclose them.
