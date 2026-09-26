# Sep 2026 OpenAI Evaluation of Just Institutions

**Research landscape, technical challenges, comments, and recommendations**  
**Project:** [JustInstitutions](https://github.com/EnduringProsperity/JustInstitutions)  
**Prepared as a Markdown report:** September 26, 2026

> This report preserves the substance and organization of the evaluation presented earlier in this conversation. A reference directory has been added at the end. It is an AI-generated evaluation prepared in ChatGPT, not an official OpenAI institutional endorsement or assessment. Formatting this report does not constitute a new September 26 research update. Historical benchmark results describe the systems and tasks evaluated at that time, not the performance of current products. Product descriptions reflect the earlier review and vendor claims where indicated.

## Contents

1. [Where JustInstitutions overlaps existing work](#1-where-justinstitutions-overlaps-existing-work)
2. [The most directly relevant university research](#2-the-most-directly-relevant-university-research)
3. [Private-company work that overlaps](#3-private-company-work-that-overlaps)
4. [The data layer is probably harder than the AI layer](#4-the-data-layer-is-probably-harder-than-the-ai-layer)
5. [The test suite is a normative research instrument](#5-the-test-suite-is-a-normative-research-instrument)
6. [“Gap” and “fail” must remain radically separate](#6-gap-and-fail-must-remain-radically-separate)
7. [Rules-to-outcomes linkage will be the hardest intellectual problem](#7-rules-to-outcomes-linkage-will-be-the-hardest-intellectual-problem)
8. [Outcome data creates its own methodological traps](#8-outcome-data-creates-its-own-methodological-traps)
9. [Budget crosswalks are useful but especially vulnerable to overinterpretation](#9-budget-crosswalks-are-useful-but-especially-vulnerable-to-overinterpretation)
10. [Patch design is not simply drafting text](#10-patch-design-is-not-simply-drafting-text)
11. [What is genuinely timely in September 2026](#11-what-is-genuinely-timely-in-september-2026)
12. [Recommended product boundary](#12-recommended-product-boundary)
13. [The expert knowledge you need to build](#13-the-expert-knowledge-you-need-to-build)
14. [Evaluation benchmarks JustInstitutions should create](#14-evaluation-benchmarks-justinstitutions-should-create)
15. [Architecture changes implied by the research](#15-architecture-changes-implied-by-the-research)
16. [Overall assessment](#16-overall-assessment)
17. [Reference directory: companies, institutions, and projects](#17-reference-directory-companies-institutions-and-projects)

---

## Executive assessment

I reviewed the JustInstitutions repository and the surrounding research. The short version is:

**JustInstitutions is technically plausible as a narrow, evidence-backed research platform today. Its full promise—auditing an entire jurisdiction, attributing outcomes to rules, and designing politically feasible legal patches—is not yet a solved problem anywhere identified in this review.**

The strongest path is to build on mature components while treating the genuinely novel parts as research products requiring explicit uncertainty, expert review, and benchmarking.

Project references: [README](https://github.com/EnduringProsperity/JustInstitutions/blob/main/README.md) · [Project brief](https://github.com/EnduringProsperity/JustInstitutions/blob/main/docs/project-brief.md) · [PRD](https://github.com/EnduringProsperity/JustInstitutions/blob/main/docs/prd.md) · [Architecture](https://github.com/EnduringProsperity/JustInstitutions/blob/main/docs/architecture.md) · [Domain model](https://github.com/EnduringProsperity/JustInstitutions/blob/main/docs/domain-model.md) · [Front-end specification](https://github.com/EnduringProsperity/JustInstitutions/blob/main/docs/design/front-end-spec.md).

## 1. Where JustInstitutions overlaps existing work

| JustInstitutions capability | Closest existing work | What is already feasible | What remains difficult |
|---|---|---|---|
| Ingest and reconstruct legal corpora | Stanford STARA; OpenLaws; Vaquill; CourtListener; Caselaw Access Project | Structured statutory extraction, hierarchy, cross-references, citation resolution | Complete, current, versioned coverage across federal, state, county, and municipal law |
| Plain-language legal explanation | Westlaw CoCounsel; Lexis+ Protégé; Harvey; vLex | Citation-backed summaries and research assistance | Reliable interpretation, false-premise correction, local-law accuracy |
| Rule-to-rule vulnerability detection | STARA; legal NLP; knowledge graphs; static-analysis analogies | Find references, definitions, obligations, conflicts, missing elements | Deciding whether something is actually a “vulnerability” rather than merely unusual drafting |
| Rules-to-outcomes linkage | Empirical legal studies; policy evaluation; Urban Institute; CBO/JCT models | Compare laws and outcomes; estimate associations; model some reforms | Credible causal attribution in observational, multi-level political systems |
| Policy and budget simulation | PolicyEngine; OpenFisca; Tax Policy Center; ITEP | Tax-benefit and household-level fiscal simulations | Modeling institutional capacity, enforcement, behavior, spillovers, rights, and political effects |
| Legislative and regulatory monitoring | FiscalNote PolicyNote; Quorum; USLege | Track bills, hearings, agencies, stakeholders, and policy signals | These systems generally monitor activity; they do not establish a complete standing audit of legal architecture |
| Patch drafting and comparison | Legal AI drafting systems; legislative counsel workflows | Generate candidate language, compare precedents, identify references | Ensuring the patch survives constitutional, administrative, implementation, litigation, and gaming consequences |
| Evidence governance | NIST AI RMF; legal-AI evaluation research | Provenance, human review, risk registers, model evaluation | Creating a public, reproducible standard for civic/legal AI findings |

This means the project’s defensible differentiation is not “AI applied to law.” It is the combination of:

1. A versioned legal-corpus model.
2. A transparent, plural test suite.
3. Explicit linkage between legal rules, implementation, spending, and outcomes.
4. Public, citable findings.
5. A design-and-retest workflow.

That combination appears genuinely unusual.

## 2. The most directly relevant university research

### Stanford STARA: the closest technical precedent

Stanford’s Statutory Research Assistant is probably the single most important work for JustInstitutions.

STARA treats legal codes as structured systems rather than flat text. It incorporates:

- Hierarchical organization.
- Headings and subheadings.
- Definitions.
- Cross-references.
- Lead-ins and suffixes.
- Editorial context.
- Structured extraction.
- LLM-assisted classification.
- Agentic organization of survey results.

Stanford reports that this approach substantially improves complex statutory research compared with general-purpose AI and can be adapted from federal statutes to state and municipal codes. Its central lesson is that legal context must be reconstructed before an LLM is asked to reason over a provision.

**Source:** [Stanford’s STARA overview — Cleaning Up Policy Sludge: An AI Statutory Research System](https://hai.stanford.edu/policy/cleaning-up-policy-sludge-an-ai-statutory-research-system). The overview links to the research paper.

Direct implications:

- Chunking statutes into arbitrary paragraph-sized passages will not be adequate.
- Every provision needs legal context attached to it.
- Definitions and cross-references should be first-class graph relationships.
- Retrieval should return a legally coherent neighborhood, not merely semantically similar text.
- “Exhaustive survey” claims require recall measurement, not just good-looking examples.

STARA is timely and directly actionable. It suggests that a credible initial JustInstitutions system could perform structured corpus surveys now. It does not prove that an AI can reliably judge democratic legitimacy or policy quality.

### Stanford RegLab: legal hallucination remains a central blocker

Stanford researchers evaluated both general-purpose models and commercial legal-AI systems. Their findings are especially important because they tested systems marketed as grounded and reliable.

Earlier general-purpose models produced hallucination rates between roughly 69% and 88% on selected legal tasks. In a later evaluation of commercial legal research systems, Lexis+ AI and Ask Practical Law AI produced incorrect information over 17% of the time, while Westlaw AI-assisted research exceeded 34% on the tested queries. The study distinguished:

- Incorrect answers.
- Correct answers supported by irrelevant citations.
- Failure to reject false premises.
- Overconfidence.
- Poor performance on less prominent or lower-court authorities.

**Sources:** [Stanford’s January 2024 evaluation](https://hai.stanford.edu/news/hallucinating-law-legal-mistakes-large-language-models-are-pervasive) · [Stanford’s May 2024 commercial legal-AI evaluation](https://hai.stanford.edu/news/ai-trial-legal-models-hallucinate-1-out-6-or-more-benchmarking-queries).

**Timeliness:** These are historical benchmark findings. They establish failure modes and evaluation requirements; they are not a current ranking or current error-rate estimate for 2026 products.

This strongly validates several choices already present in the repository:

- “No citation, no claim.”
- Visible provenance.
- Confidence bands.
- Plain/expert registers sharing the same evidence.
- Human review for AI-drafted statutory language.
- Never presenting generated analysis as legal advice.

But it also implies that C0–C3 confidence cannot merely be assigned by the model. Confidence must be tied to measurable evidence conditions:

- Was the source authoritative?
- Was the text current for the selected vintage?
- Was the relevant legal context retrieved?
- Was the claim independently verified?
- Did multiple reviewers agree?
- Is the claim descriptive, interpretive, causal, or normative?

### Empirical legal studies and causal inference

The repository is correct to insist that correlation is not causation. But this is not a minor disclaimer; it is one of the project’s deepest methodological constraints.

Legal interventions are difficult causal treatments because:

- Laws are adopted non-randomly.
- Jurisdictions differ in many unobserved ways.
- Implementation varies.
- Enforcement may lag years behind enactment.
- Multiple laws change simultaneously.
- Laws can affect migration and selection into jurisdictions.
- Outcomes may be measured poorly or revised later.
- Legal effects can be heterogeneous across groups.
- Courts and agencies can transform the meaning of a statute after passage.

The relevant toolkit includes:

- Difference-in-differences.
- Event studies.
- Synthetic controls.
- Regression discontinuity.
- Instrumental variables.
- Interrupted time series.
- Matching and weighting.
- Text-as-treatment models.
- Mediation and mechanism analysis.
- Sensitivity analysis for unobserved confounding.

Daniel Ho and coauthors’ work on *Credible Causal Inference for Empirical Legal Studies* is a particularly useful foundation. The 2011 work is foundational methodology, rather than a recent AI capability result. See [Daniel Ho’s Stanford research site](https://dho.stanford.edu/) for the paper and related research.

MIT’s discussion of *Causal Inference with Legal Texts* is also directly relevant: the text of a law can be treated as a treatment, but doing so requires careful operationalization of what changed, when, for whom, and through which mechanism. See [MIT Computational Law](https://law.mit.edu/) for the article and related work.

The practical conclusion is that JustInstitutions should initially present:

1. Rule description.
2. Observed outcome relationship.
3. Plausible mechanisms.
4. Alternative explanations.
5. Causal-identification quality.
6. What evidence would change the conclusion.

A single “law caused KPI failure” score would be methodologically indefensible.

### Policy simulation and microsimulation

PolicyEngine is one of the closest practical models for the Design area. It encodes tax and benefit rules as executable logic, applies them to representative household data, and compares baseline and reform scenarios.

Its architecture demonstrates the value of:

- Explicit policy variables.
- Time-dependent parameters.
- Entity hierarchies.
- Computation trees.
- Reproducible simulations.
- Distributional results rather than only averages.
- Validation against administrative totals.

**Sources:** [PolicyEngine microsimulation documentation](https://legacy.policyengine.org/us/microsim) · [PolicyEngine Core documentation](https://policyengine.github.io/policyengine-core/intro.html) · [PolicyEngine’s enhanced CPS methodology, March 2024](https://www.policyengine.org/us/research/enhanced-cps-beta).

The important limitation is scope. PolicyEngine can calculate many financial consequences because tax and benefit rules are sufficiently formalizable. That approach does not automatically generalize to:

- Separation of powers.
- Executive discretion.
- Agency capacity.
- Constitutional litigation risk.
- Informal enforcement.
- Social norms.
- Corruption.
- Political coalition effects.
- Long-run institutional adaptation.

Therefore, the Design area should distinguish:

- Executable simulation.
- Structured legal impact analysis.
- Expert scenario assessment.
- Speculative projection.

They should not all be rendered as equivalent “impact” numbers.

## 3. Private-company work that overlaps

### Thomson Reuters and LexisNexis

These are among the most mature commercial benchmarks for citation-grounded legal research.

Thomson Reuters positions CoCounsel as grounded in Westlaw and Practical Law, while Lexis+ with Protégé combines generative research and drafting with LexisNexis content and Shepard’s citation validation.

**Product references:** [Thomson Reuters CoCounsel](https://legal.thomsonreuters.com/en/products/cocounsel-legal) · [Lexis+ with Protégé](https://www.lexisnexis.com/en-us/products/lexis-plus-protege.page).

Their products show that users want:

- Conversational legal search.
- Summarization.
- Citation-backed answers.
- Document analysis.
- Drafting assistance.
- Workflow integration.
- Citation validation.

They also demonstrate the competitive baseline JustInstitutions will face for generic legal Q&A. JustInstitutions should not try to beat Westlaw or Lexis at ordinary legal research.

Its opportunity is a different unit of work: public, comparative, versioned institutional diagnosis.

### FiscalNote, Quorum, and USLege

These platforms are adjacent on policy intelligence.

FiscalNote’s PolicyNote combines policy monitoring, legislative information, stakeholder intelligence, and AI access. Quorum focuses on government-affairs workflows, legislative tracking, advocacy, and policy intelligence. USLege emphasizes searchable hearing video, transcripts, bills, and speakers across state and federal systems.

**Product references:** [FiscalNote PolicyNote](https://fiscalnote.com/) · [Quorum](https://www.quorum.us/) · [USLege](https://www.uslege.ai/).

Their strategic lesson is important: political and policy data are not just statutes. The operational environment includes:

- Hearings.
- Testimony.
- Agency activity.
- Stakeholders.
- Lobbying.
- Public comments.
- Legislative history.
- Media and public reaction.
- Implementation signals.

JustInstitutions’ current “standing corpus” focus is reasonable, but eventually a legal vulnerability finding will often require legislative history and implementation context. A statute that appears defective in isolation may have:

- A well-understood limiting convention.
- An agency implementation manual.
- A controlling court interpretation.
- A deliberate political compromise.
- A funding mechanism elsewhere in the code.

### Legal-data infrastructure companies

OpenLaws and Vaquill illustrate a rapidly developing infrastructure layer for structured U.S. primary law. Their offerings reportedly include broad coverage of federal and state statutes, regulations, constitutions, court rules, agency materials, citation resolution, and version metadata. Coverage differs between providers and should be checked by source type and jurisdiction.

**Product references:** [OpenLaws](https://openlaws.us/) · [Vaquill](https://www.vaquill.ai/).

The existence of these services changes the project’s build-versus-buy decision. Building a complete U.S. legal corpus from scratch may no longer be the best use of early effort. However, dependency risks remain:

- Licensing restrictions.
- Unknown editorial decisions.
- Coverage gaps.
- Update latency.
- Proprietary normalization.
- Vendor lock-in.
- Inability to independently reproduce the corpus.

The architecture should preserve a `CorpusAdapter` abstraction, as the repository already proposes, and maintain at least one independently reproducible public pipeline for the initial wedge.

## 4. The data layer is probably harder than the AI layer

A serious legal corpus requires more than downloading statutes.

For every provision, JustInstitutions needs something like:

- Jurisdiction.
- Government level.
- Source authority.
- Code title.
- Chapter, article, section, subsection.
- Effective date.
- Repeal date, if applicable.
- Enactment history.
- Amendment history.
- Text vintage.
- Editorial status.
- Cross-references.
- Defined terms.
- Exceptions.
- Delegations.
- Penalties.
- Enforcement authority.
- Implementing regulations.
- Relevant cases.
- Agency guidance.
- Source URL.
- Retrieval timestamp.
- Hash or content identity.

The most dangerous failure is silent incompleteness. A system may confidently report that a rule lacks a safeguard when the safeguard exists in:

- Another title.
- A definition section.
- A regulation.
- An appropriations provision.
- A local ordinance.
- A court interpretation.
- An agency manual.
- A cross-referenced federal statute.

Therefore, “coverage” must have multiple dimensions:

| Coverage type | Meaning |
|---|---|
| Text coverage | Did the system obtain the relevant documents? |
| Version coverage | Does it know which text applied at the relevant date? |
| Structural coverage | Did it reconstruct hierarchy and relationships? |
| Authority coverage | Did it include regulations, cases, guidance, and local law where necessary? |
| Analytical coverage | Did the test actually process the relevant provisions? |
| Evidence coverage | Can every conclusion be traced to source material? |

A single percentage such as “98% of laws covered” would be misleading.

## 5. The test suite is a normative research instrument

The repository’s A–L test blocks are not merely software tests. They encode a theory of democratic governance.

That creates a major legitimacy challenge.

For example, a test for delegation, emergency powers, fiscal control, equality, administrative accountability, transparency, or due process is never purely mechanical. It depends on judgments about what counts as an adequate safeguard.

The platform should therefore treat every test block as a citable methodology object containing:

- The normative principle.
- Its intellectual and constitutional sources.
- The operational question.
- The pass/partial/gap/fail definitions.
- Known counterarguments.
- Jurisdictions where the principle may be contested.
- Examples of false positives.
- Examples of false negatives.
- Inter-rater agreement.
- Version history.

A test result should not imply:

> “The law is objectively defective.”

It should say something closer to:

> “Under Test A5, using rubric version 3, this provision appears to provide insufficient temporal limits on delegated authority. The finding is contested because…”

That distinction is essential for avoiding accusations of partisan or ideological scoring.

## 6. “Gap” and “fail” must remain radically separate

The repository’s distinction between gap and fail is one of its strongest design decisions.

A `fail` should require evidence that a stated requirement is violated.

A `gap` should mean that:

- The relevant safeguard was not located.
- The evidence is incomplete.
- The rule is ambiguous.
- The relationship between provisions is unresolved.
- The test cannot be completed confidently.

This can be formalized:

| Verdict | Recommended meaning |
|---|---|
| Pass | Evidence supports satisfaction of the criterion. |
| Partial | Some but not all elements are satisfied. |
| Gap | Evidence or corpus coverage is insufficient. |
| Fail | Evidence supports violation. |

The system should never allow a low-confidence absence finding to become a high-severity red failure merely because the model is uncertain.

## 7. Rules-to-outcomes linkage will be the hardest intellectual problem

The project’s central promise is also its most difficult one:

> Connect specific rules to measurable societal outcomes.

There are at least four different relationships that must be separated:

1. **Legal relevance.** The rule concerns the subject matter of the KPI.
2. **Administrative mechanism.** The rule plausibly changes agency behavior, eligibility, funding, enforcement, or incentives.
3. **Statistical association.** Jurisdictions with different rules have different outcomes.
4. **Causal effect.** Changing the rule caused an outcome change, under a credible identification strategy.

The product should expose these as separate evidence layers.

A useful finding structure would be:

**Rule → legal mechanism → implementation conditions → affected population → observed KPI relationship → alternative explanations → causal-identification assessment → confidence band.**

This would make JustInstitutions substantially more credible than systems that jump directly from statutory text to a social score.

## 8. Outcome data creates its own methodological traps

The KPI Explorer design is ambitious. Major risks include:

- Different jurisdictions define the same KPI differently.
- Data may be missing non-randomly.
- Surveys have different sampling errors.
- Administrative data may reflect reporting practices rather than conditions.
- Rankings hide absolute magnitude.
- Aggregates conceal subgroup harm.
- “Better” values can be normatively ambiguous.
- A city’s high spending may reflect severe need rather than poor performance.
- More enforcement can increase recorded violations while reducing underlying harm.
- A favorable outcome may be produced by informal practices rather than written law.

The platform should preserve raw values and uncertainty intervals alongside normalized scores.

For every KPI, record:

- Definition.
- Unit.
- Directionality.
- Population.
- Geography.
- Time period.
- Source.
- Missingness.
- Sampling or measurement error.
- Comparability limitations.
- Whether it is an outcome, output, resource, or proxy.

A composite score should never be the only view. The design’s four lenses are useful, but the underlying data must remain inspectable.

## 9. Budget crosswalks are useful but especially vulnerable to overinterpretation

The Money Explorer’s “Does the money follow the values?” concept is compelling. But a spending-to-KPI mismatch does not establish that funding is inadequate or that more funding would solve the problem.

Possible explanations include:

- The program is poorly designed.
- Spending is misallocated.
- Implementation capacity is weak.
- The metric is wrong.
- Benefits occur outside the measured period.
- The jurisdiction has unusually severe needs.
- The law creates barriers that money cannot overcome.
- The relevant spending occurs under another budget category.
- Outcomes are influenced by another government level.

The crosswalk should therefore use language such as:

- “Underrepresented in the selected budget mapping.”
- “Potential alignment concern.”
- “Requires mechanism and implementation review.”

It should avoid:

- “The government underfunded this problem.”
- “More money would fix it.”
- “Budget priorities caused the outcome.”

## 10. Patch design is not simply drafting text

The Patch Proposal screen is conceptually excellent, but it combines at least seven different disciplines:

- Statutory drafting.
- Constitutional analysis.
- Administrative-law analysis.
- Fiscal modeling.
- Implementation planning.
- Political strategy.
- Systems-risk analysis.

A patch can fail even if its text is legally elegant because:

- No agency has capacity to implement it.
- The appropriation is absent.
- The enforcement mechanism is weak.
- Another statute conflicts with it.
- Courts interpret it narrowly.
- Regulated actors exploit its definitions.
- The change creates perverse incentives.
- The coalition needed to pass it does not exist.
- The patch shifts burdens onto a less visible population.

The strongest design is to make the output explicitly modular:

1. Draft language.
2. Legal compatibility check.
3. Cross-reference scan.
4. Implementation requirements.
5. Fiscal consequences.
6. Distributional consequences.
7. Failure modes and gaming scenarios.
8. Precedent.
9. Political pathway.
10. Post-enactment monitoring plan.

The phrase “projected impact” should always be accompanied by the model class used and the assumptions behind it.

## 11. What is genuinely timely in September 2026

The project is unusually timely for several reasons.

### The infrastructure window is open

Structured legal-data providers, open court-data projects, public APIs, vector search, long-context models, and agentic workflows now make a credible prototype far cheaper than it would have been several years ago.

Relevant public infrastructure includes:

- [CourtListener and Free Law Project](https://github.com/freelawproject/courtlistener).
- [Caselaw Access Project](https://case.law/).
- [GovInfo](https://www.govinfo.gov/).
- [Congress.gov](https://www.congress.gov/).
- [OpenStates](https://openstates.org/).
- [Census](https://www.census.gov/), [BLS](https://www.bls.gov/), [BEA](https://www.bea.gov/), [CDC](https://www.cdc.gov/), and agency data systems.

### Generic legal Q&A is becoming crowded

Lexis, Thomson Reuters, Harvey, FiscalNote, Quorum, and other firms are rapidly incorporating AI. That makes generic “ask questions about law” positioning weak.

JustInstitutions should lead with:

- Public corpus analysis.
- Reproducible tests.
- Stable citations.
- Comparative institutional diagnosis.
- Explicit critique.
- Public methodology.

### Trust is becoming a market and civic differentiator

The Stanford legal-AI findings show that even expensive, source-grounded systems can be wrong. A public-interest product that makes uncertainty and criticism visible could have a meaningful niche—but only if it is more disciplined than commercial systems, not merely more ideological.

### Policy simulation is moving from specialist software toward public interfaces

PolicyEngine demonstrates that complex policy models can be exposed to ordinary users. This supports a future Design area, but also raises user-expectation risks: users may assume every legal change can be simulated as precisely as a tax change.

## 12. Recommended product boundary

I would define the first credible wedge as:

> A transparent, versioned system that surveys a limited legal domain, applies a small number of reproducible structural and democratic-governance tests, produces citation-complete findings, and lets experts challenge or correct each result.

A strong first domain might be one where:

- The corpus is manageable.
- The rules are materially consequential.
- Cross-jurisdiction comparison is possible.
- Outcomes are measurable.
- Existing debates provide known findings for validation.

Possible wedges:

- Emergency powers.
- Housing approvals and zoning.
- Local fiscal transparency.
- Public-records and open-meeting law.
- Administrative rulemaking.
- Campaign-finance disclosure.
- State tax-benefit rules.
- Police oversight and accountability.

Do not begin with “all law.” Begin with “one domain where the entire chain can be defended.”

## 13. The expert knowledge you need to build

To become genuinely expert in this space, you need competence across six tracks.

### A. Legal information systems

Learn:

- Statutory structure.
- Citation systems.
- Legal hierarchies.
- Versioning and effective dates.
- Cross-references.
- Definitions and exceptions.
- Regulatory incorporation.
- Case-law authority.
- Legal knowledge graphs.
- Citation resolution.
- Corpus completeness and recall.

Start with STARA, CourtListener, CAP, GovInfo, and legal NLP surveys.

### B. Administrative and constitutional law

Learn:

- Separation of powers.
- Delegation doctrine.
- Nondelegation.
- Due process.
- Equal protection.
- Administrative Procedure Act concepts.
- Emergency powers.
- Spending and appropriations.
- Federalism and preemption.
- Agency discretion.
- Judicial review.
- Rulemaking and adjudication.

This is necessary to interpret the A–L test blocks responsibly.

### C. Causal inference and empirical legal studies

Learn:

- Potential outcomes.
- DAGs and mechanisms.
- Confounding.
- Selection bias.
- Parallel trends.
- Treatment timing.
- Spillovers.
- Heterogeneous effects.
- Synthetic controls.
- Event studies.
- Sensitivity analysis.
- Reproducible research.

Treat causal claims as research outputs, not automatic consequences of KPI correlations.

### D. Public finance and microsimulation

Learn:

- Tax-benefit modeling.
- Survey weighting.
- Administrative calibration.
- Distributional analysis.
- Behavioral responses.
- Budget accounting.
- Program take-up.
- Fiscal incidence.
- Cost-effectiveness.
- Model validation.

PolicyEngine, OpenFisca, CBO, JCT, Urban, TPC, and ITEP are important references.

### E. NLP and trustworthy AI

Learn:

- Hybrid retrieval.
- Reranking.
- Structured extraction.
- Knowledge graphs.
- Claim-level attribution.
- Entailment.
- Citation correctness.
- Calibration.
- Abstention.
- Adversarial evaluation.
- Prompt injection.
- Data poisoning.
- Human-in-the-loop review.
- Model and dataset versioning.

NIST’s Generative AI Profile is a useful governance baseline: [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) · [Generative AI Profile, July 2024 (PDF)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf).

### F. Democratic legitimacy and political economy

Learn:

- Institutional design.
- Public-choice theory.
- Political representation.
- Interest-group power.
- Regulatory capture.
- Distributional conflict.
- Administrative capacity.
- Policy feedback.
- Historical institutionalism.
- Comparative constitutionalism.
- Measurement politics.

This is the area most likely to be underrepresented in a technically impressive system.

## 14. Evaluation benchmarks JustInstitutions should create

Before making public claims, create a benchmark suite with expert-labeled examples.

### Corpus benchmark

Measure:

- Text retrieval recall.
- Version accuracy.
- Cross-reference resolution.
- Definition resolution.
- Amendment tracking.
- Jurisdiction coverage.
- Effective-date accuracy.

### Legal explanation benchmark

Measure:

- Citation existence.
- Citation entailment.
- Completeness.
- False-premise correction.
- Jurisdiction correctness.
- Temporal correctness.
- Abstention quality.

### Vulnerability benchmark

Have multiple legal and policy experts label:

- Whether the issue exists.
- Whether it is a gap or failure.
- Severity.
- Alternative interpretations.
- Confidence.
- Whether the source supports the finding.

Report inter-rater disagreement instead of hiding it.

### Outcome-linkage benchmark

For historical cases where policy effects are known, test:

- Whether the system identifies the correct legal intervention.
- Whether it distinguishes mechanism from association.
- Whether it identifies competing explanations.
- Whether its confidence tracks actual reliability.

### Patch benchmark

Evaluate whether proposed patches:

- Address the identified problem.
- Avoid creating obvious conflicts.
- Preserve defined terms.
- Include implementation authority.
- Identify fiscal effects.
- Identify likely gaming strategies.
- State uncertainty honestly.

## 15. Architecture changes implied by the research

The repository’s architecture is directionally sound, but I would make these requirements explicit.

### Store claims as objects

Every substantive output should be decomposable into a claim with the following fields:

| Field | What the claim record should retain |
|---|---|
| Source spans | The exact supporting passages. |
| Source authority | The issuing institution and type of legal authority. |
| Law vintage | The applicable version and date of the law. |
| Corpus version | The precise collection used for the analysis. |
| Transformation method | How the source became the finding. |
| Model version | Which AI model produced or assisted the analysis. |
| Reviewer status | Whether and how the claim was reviewed. |
| Confidence | The evidence band and its rationale. |
| Counterevidence | Contradictory sources or interpretations. |
| Challenge history | Critiques, corrections, and resolutions. |

### Separate extraction from judgment

Use different pipeline stages:

1. Retrieve and reconstruct legal context.
2. Extract facts and relationships.
3. Apply a declared rubric.
4. Generate an interpretation.
5. Attach outcome evidence.
6. Run contradiction and completeness checks.
7. Route uncertain findings to review.
8. Publish a versioned result.

### Make abstention a successful outcome

The system should be allowed to say:

- Insufficient corpus coverage.
- Conflicting authorities.
- Ambiguous legal interpretation.
- No credible causal design.
- KPI not comparable.
- Patch impact not simulatable.

That is not product failure. It is the core trust mechanism.

### Treat expert disagreement as data

A critique channel should not merely collect bug reports. It should preserve:

- Competing interpretations.
- Rejected challenges.
- Rubric changes.
- Evidence additions.
- Reviewer identities or roles.
- Resolution rationale.

## 16. Overall assessment

The parts you can credibly build now are:

- Versioned legal corpus ingestion.
- Hierarchy-aware statutory analysis.
- Citation-backed plain-language explanation.
- Cross-reference and obligation extraction.
- Reproducible rule tests.
- Comparative descriptive analysis.
- Narrow policy microsimulation.
- Public methodology and critique workflows.

The parts that remain frontier research are:

- Whole-jurisdiction vulnerability scoring.
- Objective rule-to-outcome attribution.
- General-purpose social KPI scoring.
- Automated normative judgment.
- Political-feasibility prediction.
- Reliable unintended-consequence simulation.
- Fully autonomous legal patching.

The most defensible identity for JustInstitutions is therefore:

> **An open, inspectable institutional-analysis laboratory that uses AI to expand legal and policy research, while making uncertainty, disagreement, and evidence gaps impossible to hide.**

That positioning is timely, technically achievable in a narrow form, and substantially more credible than promising an automated “debugger for government” before the underlying legal, causal, and normative problems are solved.

---

## 17. Reference directory: companies, institutions, and projects

This directory consolidates the organizations and projects mentioned in the evaluation. Categories describe their role and broad organizational type, not a legal-entity or ownership audit. Government agencies and open-source projects are identified separately rather than forced into a for-profit/non-profit distinction. Homepages are starting points where a specific paper or technical page was not established in the original review.

### University research and open legal infrastructure

| Organization or project | Core description | Type | Relevance and recommended use | Relevant site or paper |
|---|---|---|---|---|
| Stanford STARA | Statutory survey system using legal hierarchy, definitions, cross-references, and structured extraction. | University research | Highest-priority technical reference for corpus reconstruction and exhaustive statutory surveys. | [STARA research overview and paper link](https://hai.stanford.edu/policy/cleaning-up-policy-sludge-an-ai-statutory-research-system) |
| Stanford RegLab | Research on law, public administration, data science, and government implementation. | University research | Evaluation partner candidate; learn from legal-AI reliability testing and applied institutional research. | [RegLab](https://reglab.stanford.edu/) · [Daniel Ho’s research](https://dho.stanford.edu/) |
| Stanford HAI legal-AI evaluations | Studies of hallucination, calibration, false premises, and citation grounding. | University research | Use the 2024 studies to design failure-mode benchmarks; do not reuse their rates as current-product estimates. | [General-model evaluation](https://hai.stanford.edu/news/hallucinating-law-legal-mistakes-large-language-models-are-pervasive) · [Commercial-tool evaluation](https://hai.stanford.edu/news/ai-trial-legal-models-hallucinate-1-out-6-or-more-benchmarking-queries) |
| MIT Computational Law | Research and discussion at the intersection of legal text, computation, and legal systems. | University research | Starting point for legal-text causal inference and computational-law concepts. | [MIT Computational Law](https://law.mit.edu/) |
| Caselaw Access Project (CAP) | Harvard-origin project providing a large historical corpus of U.S. published case law. | University research / public legal-data project | Historical research and corpus access; distinguish historical collection coverage from ongoing current-law updates. | [CAP](https://case.law/) |
| Free Law Project / CourtListener | Public-access legal data, court opinions, dockets, and associated software and APIs. | Non-profit / open-source infrastructure | Important case-law and citation infrastructure; inspect court and date coverage before relying on completeness. | [Free Law Project](https://free.law/) · [CourtListener](https://www.courtlistener.com/) · [Source code](https://github.com/freelawproject/courtlistener) |
| OpenStates | State legislative data and tools for researching bills and legislators. | Civic open-data project | Adjacent legislative-history and monitoring resource; not a substitute for a complete standing legal corpus. | [OpenStates](https://openstates.org/) |

### Commercial companies and products

| Company or product | Core description | Type | Relevance and recommended use | Relevant site |
|---|---|---|---|---|
| Thomson Reuters — Westlaw, Practical Law, CoCounsel | Legal research, practical guidance, AI analysis, and drafting. | For-profit | Benchmark research workflows, citation grounding, and expert review; investigate licensing separately from product access. | [CoCounsel Legal](https://legal.thomsonreuters.com/en/products/cocounsel-legal) |
| LexisNexis — Lexis+ with Protégé, Shepard’s | Legal content, AI research and drafting, and citation validation. | For-profit | Benchmark claim support and treatment of legal authority; citation validation alone does not prove a generated interpretation. | [Lexis+ with Protégé](https://www.lexisnexis.com/en-us/products/lexis-plus-protege.page) |
| Harvey | AI tools for professional legal work. | For-profit | Adjacent workflow competitor; reference for legal research and drafting interfaces. Mentioned as context, not independently benchmarked here. | [Harvey](https://www.harvey.ai/) |
| vLex | Legal information and AI-assisted legal research. | Commercial product / for-profit | Adjacent legal research platform; reference for multi-jurisdiction research. Mentioned as context, not independently benchmarked here. | [vLex](https://vlex.com/) |
| FiscalNote — PolicyNote | Policy and regulatory intelligence, monitoring, and stakeholder information. | For-profit | Complementary political and legislative context; distinguish monitoring from institutional diagnosis. | [FiscalNote](https://fiscalnote.com/) |
| Quorum | Public-affairs software for legislative tracking, advocacy, and stakeholder workflows. | For-profit | Useful reference for professional policy workflows and distribution channels. | [Quorum](https://www.quorum.us/) |
| USLege | Legislative intelligence emphasizing bills, hearing video, transcripts, and speakers. | For-profit | Potential source of legislative context and implementation signals; verify granular coverage. | [USLege](https://www.uslege.ai/) |
| OpenLaws | Structured U.S. legal data supplied through APIs and bulk products. | For-profit public benefit corporation | High-priority build-versus-buy candidate for corpus infrastructure; check historical versions, cadence, and redistribution terms. | [OpenLaws](https://openlaws.us/) |
| Vaquill | API access to structured U.S. primary-law materials. | Commercial provider | Another corpus supplier to evaluate; validate source coverage, temporal accuracy, and licensing independently. | [Vaquill](https://www.vaquill.ai/) |

### Policy models and non-profit research

| Organization or project | Core description | Type | Relevance and recommended use | Relevant site or documentation |
|---|---|---|---|---|
| PolicyEngine | Tax-benefit microsimulation for household and population reform analysis. | Non-profit / open-source project | Closest practical reference for a bounded Design capability with traceable calculations and distributional results. | [PolicyEngine](https://www.policyengine.org/) · [Core documentation](https://policyengine.github.io/policyengine-core/intro.html) · [Enhanced CPS methodology](https://www.policyengine.org/us/research/enhanced-cps-beta) |
| OpenFisca | Framework for encoding tax-benefit systems as executable rules. | Open-source / public-interest project | Reference for country packages, parameters, time-dependent rules, and transparent simulation. | [OpenFisca](https://openfisca.org/) |
| Urban Institute | Policy research and modeling across social, economic, and fiscal domains. | Non-profit research institution | Learn from data calibration, program implementation research, and domain-specific models. | [Urban Institute](https://www.urban.org/) |
| Urban–Brookings Tax Policy Center | Tax-policy research and distributional microsimulation. | Non-profit research center | Reference for fiscal incidence, model documentation, and separating modeled estimates from observed outcomes. | [Tax Policy Center](https://taxpolicycenter.org/) |
| Institute on Taxation and Economic Policy (ITEP) | Tax distribution and state/local tax-policy modeling. | Non-profit research organization | Useful for state comparisons and distributional analysis; distinguish empirical estimates from normative recommendations. | [ITEP](https://itep.org/) |

### Government data, modeling, and evaluation resources

| Organization or project | Core description | Type | Relevance and recommended use | Relevant site or document |
|---|---|---|---|---|
| Congressional Budget Office (CBO) | Federal budget and economic analysis, including policy cost estimates. | Government / nonpartisan analytical agency | Reference for fiscal modeling, baselines, uncertainty, and scope limitations. | [CBO](https://www.cbo.gov/) |
| Joint Committee on Taxation (JCT) | Congressional tax analysis and revenue estimation. | Government / congressional analytical staff | Reference for revenue modeling and legislative tax analysis. | [JCT](https://www.jct.gov/) |
| GovInfo | Official federal publications and bulk government information. | Government data service | Authoritative corpus input; retain edition, publication, and effective-date distinctions. | [GovInfo](https://www.govinfo.gov/) |
| Congress.gov | Federal legislative information and related research resources. | Government information service | Bills, legislative history, and policy context; distinguish proposed legislation from law in force. | [Congress.gov](https://www.congress.gov/) |
| U.S. Census Bureau | Population, household, economic, and geographic statistics. | Government statistical agency | KPI denominators, demographic controls, and microdata; track geography and survey vintages. | [Census Bureau](https://www.census.gov/) |
| Bureau of Labor Statistics (BLS) | Employment, wages, prices, and labor statistics. | Government statistical agency | Economic outcomes; account for revisions, geographic coverage, and measurement definitions. | [BLS](https://www.bls.gov/) |
| Bureau of Economic Analysis (BEA) | National and regional economic accounts. | Government statistical agency | Income and economic-output comparisons; retain revisions and consistent units. | [BEA](https://www.bea.gov/) |
| Centers for Disease Control and Prevention (CDC) | Public-health information and surveillance data. | Government public-health agency | Health outcomes; account for lags, reporting differences, suppression, and population adjustment. | [CDC](https://www.cdc.gov/) |
| NIST — AI Risk Management Framework and Generative AI Profile | Voluntary framework and supporting guidance for managing AI risks. | Government research / standards guidance | Foundation for evaluation, documentation, accountability, and ongoing monitoring. | [AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) · [July 2024 Generative AI Profile (PDF)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) |

### Suggested first reading sequence

1. **STARA:** Understand why statutory context and exhaustive recall require a specialized pipeline.
2. **Stanford legal-AI evaluations:** Translate documented errors into JustInstitutions benchmark cases.
3. **PolicyEngine Core and enhanced CPS methodology:** Study what a traceable, bounded policy simulation actually requires.
4. **Credible causal inference and legal-text research:** Establish the evidence needed before attaching outcome claims to rules.
5. **CourtListener, CAP, OpenLaws, and Vaquill:** Compare corpus scope, historical coverage, reproducibility, and integration options.
6. **NIST Generative AI Profile:** Turn reliability and governance requirements into an operating process.

The reference directory is a reading and diligence map. Inclusion does not imply a partnership, endorsement, procurement recommendation, or independently verified current performance.
