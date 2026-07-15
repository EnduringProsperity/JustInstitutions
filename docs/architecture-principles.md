# Software Architecture Principles

> **Frozen snapshot for this project (JustInstitutions), taken 2026-07-12.** The canonical, living version lives outside the repo at `~/.claude/docs/software-architecture-principles.md` and applies to all of John Mayerhofer's projects. This copy keeps the JustInstitutions doc set self-contained and stable; refresh it deliberately, not automatically. How these principles bind *this* project specifically is stated in [architecture.md](architecture.md#architectural-principles--software).

---

## Intent of Principles

Every architectural decision should be traceable to one or more of six system qualities. They are the *ends*; the paradigms below (Reactive, DDD, 12-Factor, etc.) are *means*.

| Quality | Definition | What it demands | How to verify |
|---------|-----------|-----------------|---------------|
| **Responsive** | The system answers users and operators within predictable, bounded time — including when degraded. | Latency budgets per interaction; timeouts everywhere; graceful degradation paths; async work moved off the request path. | p50/p99 latency SLOs measured in production; chaos drills confirm degraded-mode responses. |
| **Resilient** | The system stays available through partial failure. Failure is an expected input, not an exception. | Bulkheads and isolation between components; retries with backoff + jitter; circuit breakers; no single point of failure for critical paths; crash-only recovery (restart is the recovery strategy). | Kill a dependency in staging; the blast radius stays contained and the system self-heals. |
| **Elastic** | Capacity follows demand — up under load spikes, down to near-zero when idle — without redesign. | Stateless compute; queue-buffered ingestion; horizontally scalable stores or documented scale ceilings; cost that tracks usage. | Load tests at 10× expected traffic; idle-state cost approaches zero. |
| **Safe** | The system protects its users, its data, and the world it acts on. Includes security, privacy, and preventing harmful output. | Least privilege; secrets never in code; input validation at trust boundaries; auditability of consequential actions; explicit review gates on AI-generated or externally-visible output. | Threat model exists and is revisited; security review before launch; audit log answers "who did what, when." |
| **Accurate** | The system's outputs are correct, provenance-backed, and honest about uncertainty. | Every claim traceable to a source; versioned, reproducible computations; correlation never presented as causation; validation of ingested data against ground truth. | Spot-check outputs against authoritative sources; every displayed figure links to its provenance. |
| **Accessible** | Anyone can use the system — regardless of ability, expertise, language, or device. | WCAG conformance; plain-language surfaces for non-experts; progressive disclosure (simple by default, depth on demand); responsive layouts; semantic HTML. | Automated a11y checks in CI + periodic assistive-technology walkthroughs; reading-level checks on public-facing copy. |

**Tension is expected.** Elastic vs. Accurate (caching staleness), Responsive vs. Safe (review gates add latency), Accessible vs. Accurate (plain language loses nuance). When qualities conflict, decide explicitly and record the trade-off — never resolve it by accident.

---

## Reactive Design

*Source: the [Reactive Manifesto](https://www.reactivemanifesto.org/) (Bonér, Farley, Kuhn, Thompson) and the follow-on [Reactive Principles](https://www.reactiveprinciples.org/).*

The Manifesto's four properties form a dependency chain — the goal is **responsiveness**, achieved through resilience and elasticity, both enabled by being message-driven:

1. **Responsive** — respond in a timely, consistent manner; establish reliable upper bounds on response time. Responsiveness is the goal; everything else serves it.
2. **Resilient** — remain responsive in the face of failure, via **replication** (run more than one copy), **containment/isolation** (failures don't cascade; bulkheads), **delegation** (recovery is handled by a separate, external component — a supervisor, not the failed component itself).
3. **Elastic** — remain responsive under varying load; scale out and in with no contention points or central bottlenecks; design for location transparency.
4. **Message-Driven** — asynchronous message passing establishes boundaries between components, enabling loose coupling, isolation, and location transparency; explicit queues enable **backpressure** (overloaded components signal upstream to slow down rather than falling over).

The Reactive Principles extend these into design rules; adopt them as stated:

- **Stay responsive** — always respond, even if the answer is a failure message or a degraded result.
- **Accept uncertainty** — there is no single global truth "now" in a distributed system; build on eventual consistency where possible and consensus only where necessary.
- **Embrace failure** — expect it, design recovery paths, make failure explicit in the protocol (don't hide it in timeouts).
- **Assert autonomy** — components operate and decide independently; communicate via well-defined protocols only.
- **Tailor consistency** — choose the consistency model per data flow (strong where invariants demand it, eventual everywhere else); don't pay for global strong consistency you don't need.
- **Decouple time** — asynchronous, non-blocking communication; a slow consumer must not stall a producer.
- **Decouple space** — location transparency; components interact the same whether co-located or remote.
- **Handle dynamics** — continuously adapt to changing load and resources; measure, don't guess.

---

## Domain-Driven Design

*Source: Eric Evans, "Domain-Driven Design" (2003); Vaughn Vernon, "Implementing DDD."*

### Strategic design (system-of-systems level)

- **Ubiquitous Language** — one precise vocabulary per context, shared by domain experts and code. Class names, table names, and API fields use the domain's words. If the team says "jurisdiction" the code doesn't say "region."
- **Bounded Context** — every model is valid only within an explicit boundary. Define where each model applies and where another takes over; the boundary is documented, not implicit.
- **Context Mapping** — document the relationships *between* contexts: which is upstream/downstream, who conforms to whom, how conflicts resolve.
- **Anti-Corruption Layer (ACL)** — where your model meets a foreign model (external API, legacy system, another team's context), translate at the boundary so the foreign model cannot distort yours.
- **Shared Kernel** — the small set of concepts that genuinely must be identical across contexts is isolated, jointly owned, and changed only deliberately. Keep it minimal.
- **Core / Supporting / Generic domain allocation** — invest design effort where the system's differentiating value lives (Core); implement Supporting domains adequately; **buy or adopt off-the-shelf** for Generic domains (auth, billing, email). Building generic infrastructure by hand is strategic misallocation.

### Tactical design (within a context)

- **Entities** (identity persists through state changes) vs. **Value Objects** (immutable, defined entirely by their attributes — prefer these; they eliminate whole classes of bugs).
- **Aggregates** — a cluster of objects treated as one consistency unit, with a single **Aggregate Root** through which all changes flow. Transactions never span aggregates; cross-aggregate consistency is eventual, via domain events.
- **Domain Events** — record the things that happen, in the domain's language ("RuleAmended", not "row updated"). Events are the natural bridge to event sourcing and to integration between contexts.
- **Repositories** — the domain speaks to an abstract collection interface; persistence technology stays behind it.
- **Domain Services** — operations that belong to the domain but not to any single entity.
- **Layered / Hexagonal architecture** — domain logic at the center, dependency arrows pointing inward; UI, database, and external services are adapters at the edge (Ports & Adapters). The domain layer imports nothing from the infrastructure layer.

---

## 12-Factor Design

*Source: [The Twelve-Factor App](https://12factor.net/) (Wiggins et al., Heroku), with modern gloss.*

| # | Factor | Principle | Modern gloss |
|---|--------|-----------|--------------|
| I | **Codebase** | One codebase tracked in version control, many deploys | Monorepo or per-service repos — but one authoritative source per deployable |
| II | **Dependencies** | Explicitly declare and isolate dependencies | Lockfiles committed; reproducible builds; no reliance on system-wide packages |
| III | **Config** | Store config in the environment | Everything that varies between deploys (URLs, credentials, feature flags) lives outside code; secrets in a secret manager, never in the repo |
| IV | **Backing services** | Treat backing services as attached resources | Database, queue, LLM API are swappable via config; no hardcoded assumptions about locality |
| V | **Build, release, run** | Strictly separate build and run stages | Immutable build artifacts; releases are versioned and rollback-able |
| VI | **Processes** | Execute as stateless processes | Session/state lives in backing stores, not process memory; any instance can serve any request |
| VII | **Port binding** | Export services via port binding | Self-contained services; no runtime injection into an external server |
| VIII | **Concurrency** | Scale out via the process model | Horizontal scaling of small stateless units, not vertical scaling of one big one |
| IX | **Disposability** | Fast startup, graceful shutdown | Processes can be killed at any moment without data loss → demands **idempotent** work units and jobs that are safely re-runnable |
| X | **Dev/prod parity** | Keep development, staging, production as similar as possible | Same database engine, same queue, same versions locally as in prod; containers make this cheap |
| XI | **Logs** | Treat logs as event streams | Structured (JSON) logs to stdout; aggregation, retention, and querying are the platform's job |
| XII | **Admin processes** | Run admin/management tasks as one-off processes | Migrations and backfills run in the same environment and code as the app, are versioned, and terminate |

---

## Taming Nondeterminism

Distributed (and even concurrent single-machine) systems are nondeterministic in nine well-known ways. Each has standard mitigations; an architecture should state which it uses where.

| # | Source of nondeterminism | Mitigations |
|---|--------------------------|-------------|
| 1 | **Message ordering & delivery** — delayed, reordered, duplicated, or lost messages | Sequence numbers; single-writer ordered logs (e.g., append-only event log) where order matters; consumer-side deduplication keys; acknowledge-after-persist |
| 2 | **Timing & clocks** — no reliable global clock; drift | Never compare timestamps across machines for ordering; logical clocks / monotonic sequence IDs for causality; one authoritative clock source (the database) for anything that must be ordered |
| 3 | **Concurrency & interleavings** — same inputs, different outcomes | Minimize shared mutable state; immutability by default; optimistic concurrency (version columns) or single-writer-per-aggregate; make critical sections explicit and small |
| 4 | **Partial failures** — some components fail while others continue; failure is ambiguous | Bulkheads; health checks with explicit state (up / degraded / down); timeouts on every remote call; circuit breakers; design every caller for "no answer is also an answer" |
| 5 | **Retries & at-least-once effects** — did it run zero, one, or many times? | **Idempotency as a system-wide invariant**: idempotency keys on all mutating operations; upserts over inserts; exactly-once *effect* = at-least-once delivery + idempotent handler |
| 6 | **Leader election & coordination races** | Avoid coordination where possible (partition the problem instead); where required, use leases with **fencing tokens** so a deposed leader's stale writes are rejected; prefer managed coordination (the database's locks) over homegrown |
| 7 | **State visibility & observation** — observers see lagging, inconsistent views | Choose and document the consistency model per read path (read-your-writes for a user's own actions; eventual for dashboards); show data vintage in the UI rather than pretending freshness |
| 8 | **Scheduling & resource contention** — nondeterminism even on one machine | Bound queues (unbounded queues are a lie about capacity); backpressure over buffering; load-shed explicitly at the edge |
| 9 | **Recovery & replay** — restarts create branching histories | **Event sourcing** where history matters: state derived by replaying an immutable log makes recovery deterministic; deterministic, side-effect-free replay (effects gated behind "already applied?" checks); versioned snapshots |

The umbrella rule: **push nondeterminism to the edges and make the core deterministic.** A core that is a pure function of an ordered event log is testable, replayable, and auditable; the messy world (retries, clocks, races) is handled in thin adapter layers.

---

## Other Paradigms Worth Applying

- **Ports & Adapters (Hexagonal)** — already implied by DDD; stated separately because it is the single highest-leverage structure decision: business logic depends on interfaces, infrastructure implements them. Enables the plugin architectures, testability, and vendor swaps everything else assumes.
- **Event Sourcing & CQRS** — store facts (events), derive state; separate the write model (validated commands) from read models (denormalized projections optimized per view). Use where history, audit, and "state as of date X" are requirements — not everywhere (it adds real complexity; plain CRUD is correct for incidental data).
- **Loose coupling & explicit boundaries** — components interact only through published contracts (APIs, schemas, events). A contract change is a versioned, deliberate act. Amdahl's law applied to communication: chatty fine-grained synchronous interfaces serialize the system; prefer coarse-grained, asynchronous interaction across boundaries.
- **Bulkheads & blast-radius thinking** — partition resources (pools, queues, budgets) per dependency so one failing dependency cannot exhaust shared capacity. Ask of every component: "what else dies when this dies?"
- **Crash-only design** — if graceful shutdown and crash recovery are the same code path, recovery is tested on every restart.
- **Right-sized consistency** — the strongest consistency is the most expensive; pick per flow: strong (invariant-bearing writes), causal/read-your-writes (user-facing echo), eventual (analytics, search indexes, caches). Document the choice.
- **Telemetry & Measurable Results** *(from the Design for Enduring Prosperity principles — Principle 10 applied to software)* — a system that cannot be measured cannot be improved or trusted. Instrument from day one: structured logs, metrics (rates, errors, durations), traces across service boundaries, and **cost telemetry** (especially for LLM-backed systems — tokens are money). Define SLOs; alert on symptoms (user-visible error rate), not causes (CPU). Telemetry is also the *evidence layer*: for systems that make analytical claims, the same discipline yields provenance and reproducibility.
- **Security by design** — least privilege for every credential; trust boundaries drawn on the architecture diagram; validate at boundaries, escape at output; dependency scanning; audit trail on consequential actions. Safety is an architectural property, not a review gate at the end.
- **Simplicity as a discipline (YAGNI with a plan)** — the principles above describe the *shape* of a system, not a mandate to build all machinery on day one. Prefer the simplest implementation that preserves the boundary: a modular monolith with clean internal contexts beats premature microservices; a Postgres queue beats Kafka until proven otherwise. What must be right from the start are the **boundaries and the data model** (they are expensive to change); implementations behind them can start simple and harden with evidence.

---

## Applying These Principles — design review checklist

1. Which of the six qualities does this decision serve? Which does it trade away? Is the trade recorded?
2. Where are the bounded contexts, and is each interface a published contract?
3. What happens when each dependency fails? (timeout → fallback → user-visible behavior)
4. Is every mutating operation idempotent? What is its idempotency key?
5. What consistency does each read path promise, and does the UI honestly reflect data vintage?
6. Can state be reconstructed (event log, backups, replay)? Has restore actually been tested?
7. What telemetry proves this component is healthy — and what does it cost to run?
8. Could a person using a screen reader, or a non-expert, complete this flow?
9. What is the simplest implementation that preserves the boundaries?
