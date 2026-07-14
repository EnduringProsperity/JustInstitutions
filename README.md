# Public Policy Vulnerability Analyzer (PGA)

A public-interest platform that treats a jurisdiction's body of rules (constitutions, statutes, regulations, codes, and interpreting case law) like software — analyzing it for "vulnerabilities" (gaps, conflicts, loopholes, obsolescence, enforcement gaps, inequities, and more), linking those rules to outcome KPIs, and surfacing actionable "patches."

Organized around three areas, each a valid standalone entry point that also chains into a loop:
**Test** (diagnose the rule system) → **Explore** (outcomes, spending, and the law) → **Design** (propose & pressure-test fixes) → re-test.

---

## Load-bearing design tenets

These are the principles the whole system is built to honor. Change them only deliberately.

- **Jurisdiction-agnostic by construction.** The platform must apply to **any UN-recognized jurisdiction and any of its sub-jurisdictions** (nation → state / province / region → county / department / kreis / district → city → special district). This is an *architectural capability*, realized through generic jurisdiction modeling and the pluggable `CorpusAdapter` / `SystemType` / `TestSuite` / `KPIView` interfaces. **"US-first" is only an initial data-load / sequencing choice — never a structural limit.** US-specific content (e.g., the Federalist-derived test blocks) exists as *one instance* of a system type, never hardcoded into the core schema. Always distinguish **capability** (all jurisdictions) from **initial load** (US rules first; international KPI/spend data from launch).
- **Correlation ≠ causation.** Rule→outcome causality is probabilistic. The system surfaces correlations and flags likely mechanisms, but never presents them as proven causation.
- **Public-interest first.** Free for public/civic use; commercial users subsidize. Every finding, view, and report has a stable, shareable URL.
- **Domain-pluggable.** Government/democratic governance is the first domain; the architecture must not foreclose others (corporate, healthcare, international).

---

## Document map

The project has been fanned out from a single master plan into [BMAD-method](https://github.com/bmad-code-org/BMAD-METHOD) artifacts. (The original `plan.md` has been retired; its content now lives in the documents below.)

| Document | Owner (BMAD) | Purpose |
|----------|--------------|---------|
| [docs/project-brief.md](docs/project-brief.md) | Analyst | Problem, premise, vision, scope, context |
| [docs/prd.md](docs/prd.md) | PM | Goals, success metrics, personas, FR/NFR, epics, open questions |
| [docs/architecture.md](docs/architecture.md) | Architect | System architecture, tech stack & rationale, project structure, extensibility |
| [docs/architecture-principles.md](docs/architecture-principles.md) | — (frozen snapshot) | Cross-project software architecture principles (canonical copy lives outside the repo at `~/.claude/docs/`); how they bind PGA is in architecture.md |
| [docs/domain-model.md](docs/domain-model.md) | — (reference) | The domain framework: Rule Taxonomy, Test Blocks A–L, Vulnerability Taxonomy, KPI catalog + Views, and methodology (system types, budget crosswalk, peer grouping, attribution confidence). Not a native BMAD artifact. |
| [docs/business/](docs/business/) | — | Supporting exhibits: [cost](docs/business/cost.md) · [revenue](docs/business/revenue.md) · [funding](docs/business/funding.md) · [partners](docs/business/partners.md) · [naming](docs/business/naming.md) *(name TBD)* |

---

## BMAD adoption

We are adopting BMAD in two stages, deliberately decoupled:

1. **Now — document structure (manual).** The hand-written material has been reshaped into BMAD-convention artifacts under `docs/` (complete). Remaining polish: owner review of the `{DRAFT}` problem statement and success metrics, and the open questions in [prd.md](docs/prd.md#open-questions).
2. **At the code boundary — full agent workflow.** Install the BMAD toolchain (`npx bmad-method install`, v6.x) and use its agents. Because we already have rich hand-written docs, this is a **brownfield** adoption: the PM agent ingests our material and **generates the epic list** from the PRD (epics are not hand-authored); the Scrum Master shards epics into stories for the Dev agent.

Doing structure now and agents later avoids fighting BMAD's greenfield "generate from a blank brief" flow while the plan is still evolving, and means the docs already conform when the toolchain goes in.
