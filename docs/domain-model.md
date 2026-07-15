# Domain Model — Public Policy Vulnerability Analyzer (PGA)

> **Domain reference / methodology** (not a native BMAD artifact). This is the citable analytical framework the platform operates *with* — the rule taxonomy, the test batteries, the vulnerability catalog, the patch vocabulary, and the KPI catalog & views. It is deliberately separate from what the product *does* ([prd.md](prd.md)) and how it is *built* ([architecture.md](architecture.md)); it evolves on its own cadence and is meant to withstand academic and funder scrutiny on its own. Named `domain-model.md` per DDD convention.

---

## Jurisdiction Model

Every analysis is scoped to a **jurisdiction** at some level of a nested hierarchy. The model is jurisdiction-agnostic (see NFR-01): it applies to any UN-recognized nation and its sub-jurisdictions — a nation's primary subdivision may be states, provinces, regions, *kreise*, *départements*, or districts depending on the country. The US hierarchy — the first corpus loaded — illustrates the shape:

```
Federal
├── Constitution + Amendments + Bill of Rights
├── US Code (54 titles)
├── Code of Federal Regulations (CFR)
└── Executive Orders

State (50 states)
├── State Constitution
├── State Statutes
└── State Administrative Code

County (~3,000 counties)
├── County Charters / Ordinances
└── County Codes

City (~19,000 incorporated places)
├── City Charters
├── Municipal Codes
└── Zoning / Land Use Codes

Special Districts (~90,000)
└── School districts, water districts, transit authorities
```

The nesting generalizes: nation → primary subdivision → local → special-purpose bodies. **Corpus availability is tracked separately from a jurisdiction's existence in the model** — a jurisdiction can be selectable in the picker before its rules are ingested (US rules load first; every UN-recognized nation is selectable).

## Analysis Configuration — Intent & System Type

*(Resolves prd.md OQ-4. Revised 2026-07 after owner review: System Type restructured from a flat list to a dimensional model; Intent restructured to nine baseline qualities.)*

Every analysis run is configured with a **System Type** (the benchmark whose test suite and scoring rubric are applied) and an **Intent weighting** (the analyst's lens). Each System Type is a pluggable configuration per the `SystemType` interface in [architecture.md](architecture.md#extensibility--extension-points) — a type is data, not code.

### System Type — a dimensional model, not a flat list

*Sources synthesized: executive–legislative typology (Duverger; Linz, "The Perils of Presidentialism"); V-Dem "Regimes of the World" classification (Lührmann, Tannenberg & Lindberg); Levitsky & Way (competitive authoritarianism); Geddes, Wright & Frantz (autocratic regime typology); Lijphart (Patterns of Democracy); standard federalism taxonomy (Elazar, Riker).*

Governance systems are not a flat list of types — they are positions on (at least) five largely orthogonal dimensions. A flat picklist mixes answers to different questions ("presidential" answers a different question than "federal" or "one-party"). The model therefore separates the dimensions:

| Dimension | Question it answers | Positions |
|-----------|--------------------|-----------|
| **D1 — Sovereignty source** | In whose name does authority run? | popular · party · dynastic · religious · military |
| **D2 — Representation mode** | How do the sovereign people (if popular) rule? | direct · **representative** · mixed |
| **D3 — Executive structure** | How does the executive relate to the legislature? | presidential · parliamentary · semi-presidential · directorial/collegial (Swiss) · executive-monarchical |
| **D4 — Vertical distribution** | How is power distributed across levels? | federal · unitary · devolved · confederal |
| **D5 — Practice vs. paper** | How does effective practice compare to the declared design? | liberal democracy · electoral democracy · competitive-authoritarian · closed (V-Dem ladder) |

**Representative democracy lives at D2** — it is the *genus*; presidential and parliamentary are *species within it* (D3). The United States is a representative democracy (D2) of the presidential type (D3), federal (D4), with popular sovereignty (D1). Note that **D5 is assessed, not declared** — a jurisdiction claims D1–D4 in its constitutional text; where it sits on D5 is an *output* of the analysis as much as an input.

A **System Type is a named bundle** of dimension positions. The picklist shows named bundles (people think in named systems); the machinery attaches test logic to dimensions where possible (the direct-participation tests key to D2 = direct/mixed; cohabitation/deadlock tests to D3 = semi-presidential; Block F weighting to D4). Initial bundles:

| Named bundle (picklist entry) | D1–D5 positions | Exemplars | Benchmark suite |
|------------------------------|-----------------|-----------|-----------------|
| **Universal baseline** *(no design claim)* | — (none asserted) | Any jurisdiction or proposal on Earth | System-agnostic blocks only: C*, D, E2/E4, F (where multi-level), H, I, J, L — see Block scope table. Enables **intent-only runs**: "score anyone, judge no one" |
| **Federal presidential republic** | popular · representative · presidential · federal | US, Brazil, Mexico | Democratic Design Suite (Blocks A–L) — *ships first* |
| **Parliamentary democracy** | popular · representative · parliamentary · either D4 | UK, Germany, Canada, Japan; incl. ceremonial monarchies (NL, NO, SE) | A-block variant: confidence/no-confidence mechanics instead of veto mechanics |
| **Semi-presidential republic** | popular · representative · semi-presidential · either D4 | France, Portugal | Adds cohabitation/deadlock tests |
| **Direct-hybrid democracy** | popular · mixed · directorial or other · either D4 | Switzerland; US states with strong initiative processes | Adds direct-participation block (signature thresholds, initiative integrity, deliberation quality) |
| **One-party state** | party · — · fused · usually unitary | China, Vietnam, Cuba | Capacity & accountability blocks (D, H, I, L); D5 assessed against both own claims and democratic baseline |
| **Theocratic republic** | religious · mixed electoral elements · supervised | Iran | Block K inverted (theocracy is the design); rights/capacity blocks still apply |
| **Absolute monarchy** | dynastic · — · executive-monarchical · unitary | Saudi Arabia, Brunei | Capacity/rights/fiscal blocks (C, D, H, I, L) |
| **Military / transitional** | military · suspended · — · — | Juntas, interim authorities | Transition-integrity tests (A4/I7 weighted heavily; path back to civilian rule) |
| **Designed / proposed system** | any — user-defined bundle | Draft constitutions, charter proposals, theoretical models (sortition, technocratic) | Closest bundle's suite, or a custom suite; supports the Design → re-Test loop |

*(Note: "competitive authoritarian" is deliberately not a picklist bundle — it is a D5 assessment outcome, not a system anyone claims to operate.)*

New system types are new bundles — configuration, not schema change. Admins (later, users) can define bundles, mirroring custom test blocks.

### Multi-benchmark scoring (first-class rule)

An analysis run is **(jurisdiction × benchmark bundle × intent weighting)** — and any jurisdiction may be scored against *any* bundle, any number of times. Three canonical uses:

1. **Internal coherence** — score against the jurisdiction's *own claimed bundle*: does Iran's structure deliver what Iran's constitution claims? Does the US structure deliver what the US design claims?
2. **Reference comparison** — score many jurisdictions against one fixed bundle (e.g., everyone against the liberal-democracy baseline — what V-Dem and Freedom House do). Required for Compare leaderboards: rankings are only meaningful within a shared benchmark.
3. **Counterfactual lens** — score a jurisdiction against a bundle it doesn't claim (the US under a parliamentary rubric; a US state under the direct-democracy rubric). Differences across benchmarks are findings, not contradictions.

Every report states its benchmark bundle prominently. **Claimed vs. effective divergence** (the jurisdiction's declared D1–D4 vs. its assessed D5 and observed practice) is always computed and is a headline finding in its own right.

**Asymmetry of the two axes.** System Type and Intent are not interchangeable: a benchmark bundle supplies the *pass criteria* (evidence cannot be generated without one), while Intent supplies only *weighting* (applied at read time; see architecture.md, run memoization). So:
- *System Type without Intent* — always valid; Intent simply defaults to Balanced.
- *Intent without System Type* — realized via the **Universal baseline bundle**: the system-agnostic blocks provide the rubric without asserting any design claim, and the intent weighting shapes the report. This is the run that can be offered for every jurisdiction without taking a normative position on its system type — and the natural default before a user picks a benchmark.
- *KPI-first (no rubric at all)* — that is Explore, not Test; outcomes need no benchmark.

### Intent — nine baseline qualities

Intent is the **analyst's lens, not the government's motive** — any real government plausibly pursues all nine at once. Selecting an intent reweights block emphasis and finding order; it never adds, removes, or alters evidence (findings and citations are identical across intents; reports disclose the weighting applied). Default: **Balanced** — all nine, equal weight.

The first six are the same quality vocabulary as the [cross-project software architecture principles](architecture-principles.md) — deliberate: the platform's premise is governance-as-software, and we hold the systems we analyze to the same design standard as the system we build. The last three are governance-specific.

| Intent quality | As applied to a rule system | Block / KPI emphasis |
|----------------|----------------------------|----------------------|
| **Responsive** | Government answers its citizens in bounded, enforceable time | H1, D3 |
| **Resilient** | Core functions survive crisis, capture, and contested succession | H2, G, E, A4 |
| **Elastic** | Capacity scales to surge (pandemic, disaster) and back down, by statute not improvisation | H3, L3 |
| **Safe** | Protects rights, security, and the vulnerable | C, K, B2; Safety KPIs |
| **Accurate** | Effective law matches stated intent; decisions are evidence-based; drift is detected and corrected | I6, J1, Layer-3 drift findings, D2 |
| **Accessible** | Citizens can understand, use, and participate in the system without professional intermediation | B, I1, J1, Interface Complexity findings |
| **Equal** | Power, benefits, and costs are equally distributed | C4, B3, Inequity findings, Design Principle 8, Social Equity KPIs |
| **Economically Viable** | Government is funded as required to operate — mandates matched by resourced capacity | Block L (all), D2, J8 |
| **Sustainable** | The system is a platform enabling enduring prosperity for all — including future generations | E, H5/H8, I5, Design Principles view, SDG pyramid, natural-capital KPIs |

*Normativity note:* some intents (notably **Equal**) encode a contested normative position (equality of what — outcomes, opportunity, burden?). This is handled by disclosure, not avoidance: intents are opt-in lenses, the evidence layer is invariant under them, and every report names its weighting. This mirrors the Universal/Contested labeling discipline in the KPI catalog.

*(The seven intent presets from the earlier draft collapse into these axes — equal citizenship → Equal; fiscal adequacy → Economically Viable; rule-of-law integrity → Accurate; transparency → Accurate + Accessible; democratic resilience → Resilient + Safe. Named preset weightings can be reintroduced later via the same admin mechanism as custom test blocks, if users want them.)*

## Rule Taxonomy

Rules governing a jurisdiction fall into distinct layers that must be analyzed differently. The distinction is not just conceptual — it determines what we vectorize, how we analyze it, and what we compare it against.

### Layer 1 — Constitutional / Structural Meta ("The Game Mechanics")
*Defines HOW government works: its structure, powers, constraints, and the rights citizens hold against government.*

These rules are the operating system. They define:
- Who holds power and how it is acquired (elections, appointment, succession)
- What powers each branch possesses and what is forbidden
- How the rules themselves can be changed (amendment procedures)
- What rights citizens hold that government cannot override
- How power is distributed across levels (federalism)

**Examples:**
- Federal: U.S. Constitution (Articles I–VII), Bill of Rights (Amendments 1–10), all subsequent Amendments
- State: State constitutions, state bills of rights, initiative/referendum procedures
- Local: City charters, county charters, special district enabling acts

**Analyzed against:** Democratic Design Test Suite (see below) — does the structure support a well-functioning democracy?

---

### Layer 2 — Process / Participation Meta ("Rules About Making Rules")
*Governs the mechanisms of political participation, rule-making procedures, and institutional operations.*

These sit between pure structure and pure content. They define the machinery by which content rules are produced and by which citizens interact with power.

**Examples:**
- Federal: Administrative Procedure Act, Federal Elections Campaign Act, Voting Rights Act, Freedom of Information Act, Government in the Sunshine Act, lobbying disclosure laws, congressional rules of procedure
- State: State administrative procedure acts, election codes, open meeting laws, public records laws
- Local: Council procedures, public comment requirements, zoning board procedures

**Why this matters:** Campaign finance law, redistricting rules, and voter access laws govern the *inputs* to the rule-making machine. Weaknesses here corrupt the content layer downstream — bad representation produces bad laws.

**Analyzed against:** Democratic Design Test Suite (participation dimensions) + limited KPI linkage (voter turnout, representation equity)

---

### Layer 3 — Judicial Interpretation - Practical Meta ("The Runtime Interpreter")
*Court decisions, holdings, and precedent that determine how written rules are actually applied.*

This layer sits between the structural meta and content rules because judicial interpretation operates as a translation engine — taking the written rule (Layer 1 or Layer 5) and producing the rule-in-practice. Courts do not create new rules; they interpret existing ones. But interpretation can diverge so significantly from written text that the *effective rule* and the *paper rule* become different things. Analyzing the statute alone, without the case law that defines how it actually operates, produces an incomplete and sometimes misleading picture.

**Examples:**
- Federal: U.S. Supreme Court decisions (Citizens United v. FEC, Shelby County v. Holder, Dobbs v. Jackson Women's Health, Loper Bright v. Raimondo), Circuit Court holdings that govern a region
- State: State Supreme Court decisions, appellate court holdings on state statutes and constitutions
- Local: State court interpretations of local ordinances; court orders affecting municipal enforcement

**Why this matters:** Some of the most significant changes to the effective rule corpus have happened without any legislative action. Shelby County effectively suspended key provisions of the Voting Rights Act. Loper Bright overturned 40 years of Chevron deference, fundamentally restructuring how agency regulations are interpreted. Citizens United rewrote campaign finance law. The paper law (the statute) was unchanged; the effective law (what it means in practice) was transformed. A vulnerability analysis that ignores this layer is analyzing a map, not the territory.

**New vulnerability type — Judicial Drift:** When cumulative judicial interpretation has moved the effective meaning of a statute or constitutional provision significantly away from its written text or stated legislative intent — without any legislative action. Can be beneficial (courts expanding protections beyond statutory text) or harmful (courts narrowing or eliminating protections that the text appears to provide). Judicial Drift is distinct from intentional constitutional interpretation — it is a vulnerability when the drift is (a) not what the legislature intended, (b) produces KPI-measurable harm, and (c) is not corrected by subsequent legislation.

**Data sources:** CourtListener (Free Law Project — free, open API, comprehensive federal and state case law), Caselaw Access Project (Harvard — digitized historical case law), Oyez.org (Supreme Court cases with oral arguments), Google Scholar (broad case law).

**Analyzed against:** Statutory intent (does the interpretation honor the legislative purpose and text?), constitutional consistency, and KPI outcomes (has this interpretation contributed to outcome improvement or degradation relative to the jurisdiction's stated goals?).

---

### Layer 4 — Rights / Civil Liberties (Meta-Adjacent)
*Protects individual and group rights from government and private actors. Sits at the boundary of meta and content.*

**Examples:**
- Federal: Civil Rights Act, Americans with Disabilities Act, Fair Housing Act, Title IX, Age Discrimination in Employment Act
- State: State civil rights statutes
- Local: Human rights ordinances, non-discrimination ordinances

**Why the gray zone:** These rules look like content (they govern behavior), but they protect the prerequisites for democratic participation (equality, freedom from discrimination, access to public life). A society where large groups are systematically excluded from participation has a damaged meta regardless of how the constitution reads.

**Analyzed against:** Both — democratic design principles (equal citizenship test) AND outcome KPIs (disparity metrics, civil rights complaint rates)

---

### Layer 5 — Substantive Content Rules ("What Government Produces")
*The output of the governmental machinery: laws and regulations governing behavior in society.*

**Examples:**
- Federal: US Code (54 titles), Code of Federal Regulations, Executive Orders
- State: State statutes, state administrative codes
- Local: Municipal codes, zoning ordinances, building codes, health codes, business licensing rules

**Analyzed against:** Outcome KPIs — do these rules produce the intended societal outcomes? This is where the vulnerability taxonomy (gaps, conflicts, loopholes, obsolescence, etc.) is most directly applied.

---

### The Key Interaction: Meta → Content

This hierarchy reveals an important analytical insight of the system:

```
Broken Meta (structural vulnerabilities)
        ↓
Corrupted Process (bad participation rules)
        ↓
Poor Content Generation (laws written for special interests, not public good)
        ↓
Poor Outcomes (KPI shortfalls)
```

A content vulnerability (e.g., a loophole in environmental law) may be a *symptom* of a meta vulnerability (e.g., a campaign finance structure that allows polluting industries to capture regulatory agencies). The platform must surface these causal chains, not just list isolated vulnerabilities.

**Priority order for analysis:**
1. Meta (Layer 1) — structural vulnerabilities are root causes
2. Process (Layer 2) — participation rule vulnerabilities corrupt content generation
3. Rights (Layer 4) — civil liberties gaps undermine equal participation
4. Content (Layer 5) — substantive rule vulnerabilities produce direct outcome failures

---

### What We Vectorize and How

| Layer | Vectorization Strategy | Primary Analysis Method |
|-------|----------------------|------------------------|
| Meta (L1) | Full text + structured feature extraction (rights enumerated, powers granted, checks defined, amendment procedures) | Democratic Design Test Suite |
| Process (L2) | Full text + participation mechanism tagging | Democratic Design Tests (participation) + limited KPI linkage |
| Judicial (L3) | Full opinion text + structured extraction (holding, affected statutes, court level, precedential weight, date) + linking to statutes interpreted | Judicial Drift analysis; statutory intent comparison; KPI outcome linkage |
| Rights (L4) | Full text + protected class tagging + enforcement mechanism extraction | Both test suite (equal citizenship) and KPI disparity analysis |
| Content (L5) | Semantic chunking by section/statute + policy domain tagging + enforcement mechanism tagging | KPI-linked vulnerability analysis |

Meta documents are relatively short and stable — the U.S. Constitution is ~7,500 words; most state constitutions are under 50,000 words; city charters under 20,000 words. These fit within Claude's context window, enabling full-document analysis rather than chunked retrieval. Content rules (US Code: ~54,000 pages) require chunking and embedding.

---

## Rule Test Blocks


A formal test battery — analogous to a software unit test suite — run against every jurisdiction's Layer 1 and Layer 2 rules. Each test has a pass/fail/partial rating with evidence citations from the actual text.

Sources synthesized: Robert Dahl (Polyarchy), V-Dem (5 democracy indices), World Justice Project Rule of Law Index, Freedom House criteria, IDEA (International Institute for Democracy and Electoral Assistance), James Madison (Federalist Papers), Steven Levitsky & Daniel Ziblatt (democratic norm frameworks), Francis Fukuyama (state capacity and rule of law).

New test blocks can be added by the system admin, and eventually end users.

### Block scope: design-conformance vs. system-agnostic

Every test block carries a **scope tag**. This distinction is what makes benchmark-free ("intent-only") runs possible — see the Universal baseline bundle in Analysis Configuration.

- **Design-conformance blocks** presume a claimed system design and test conformance to it. They are meaningful only relative to a benchmark bundle (testing a monarchy against electoral integrity is a category error, not a finding).
- **System-agnostic blocks** test whether *any* rule system is well-constructed, coherent, resourced, and adaptive — they apply to a presidential republic, a monarchy, a one-party state, or a paper proposal alike. Note the correspondence with the nine Intent qualities: these blocks are essentially the intent qualities in test form (H is literally Responsive/Resilient/Elastic; L is Economically Viable; I and J serve Accurate and Accessible).

| Block | Scope | Notes |
|-------|-------|-------|
| A — Separation of Powers | Design-conformance | Presumes separated-powers design (A4 emergency-power limits has near-universal value but is scored within the design context) |
| B — Electoral Integrity | Design-conformance | Presumes electoral selection |
| C — Civil Liberties & Rights | System-agnostic* | *Standard is the UDHR/ICCPR rights floor, which nearly all states have formally subscribed to; flagged as normatively grounded rather than design-derived |
| D — Accountability & Transparency | System-agnostic | Good-governance floor for any system |
| E — Amendment & Adaptability | Mixed (per-test) | E2 (amendment difficulty) and E4 (succession clarity) agnostic; E1 (popular amendment access) and E3 (anti-entrenchment) presume popular sovereignty |
| F — Federalism & Jurisdictional Clarity | System-agnostic (conditional) | Applies wherever D4 has multiple levels of government |
| G — Democratic Norms | Design-conformance | Presumes democratic competition |
| H — Systems Resilience & Responsiveness | System-agnostic | The Reactive properties apply to any complex adaptive system |
| I — Governance Architecture Quality | System-agnostic | Well-architected rules are system-independent |
| J — Domain Model Integrity | System-agnostic | Legal coherence is system-independent |
| K — Religious/Civil Separation | Design-conformance | Presumes secular civil authority; inverted under the theocratic bundle |
| L — Fiscal Capacity | System-agnostic | Authority-resource alignment is system-independent |

### Test Block A — Separation of Powers & Checks
*Federalist No. 51: "Ambition must be made to counteract ambition."*

| Test                          | Pass Criteria                                                                                              | Vulnerability if Failing                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **A1 Branch Separation**      | Executive, legislative, judicial functions are structurally separate with independent personnel            | Concentration of power; no separation = authoritarian design                 |
| **A2 Mutual Override**        | Each branch has meaningful ability to check the others (veto, override, review, impeachment, confirmation) | Dominant branch with no counterweight                                        |
| **A3 Judicial Independence**  | Judges have fixed terms or life tenure; removal requires extraordinary process; compensation protected     | Politically captured judiciary                                               |
| **A4 Emergency Power Limits** | Emergency/executive powers are time-limited, scope-limited, and subject to legislative override            | Permanent emergency — executive can govern without legislature               |
| **A5 Delegation Limits**      | Legislature cannot delegate essentially unlimited lawmaking authority to executive or agencies             | Rubber-stamp legislature; regulatory state without democratic accountability |

### Test Block B — Electoral Integrity & Representation
*Dahl's polyarchy criteria; IDEA electoral standards.*

| Test | Pass Criteria | Vulnerability if Failing |
|------|--------------|------------------------|
| **B1 Free and Fair Elections** | Elections are periodic, competitive, and not structurally rigged for incumbents | Permanent incumbency; democracy in name only |
| **B2 Universal Suffrage** | No group of adult citizens is systematically excluded from voting | Voter suppression structural in law |
| **B3 Representative Apportionment** | Districts drawn to reflect population; no structural partisan entrenchment | Gerrymandering producing unrepresentative legislatures |
| **B4 Right to Seek Office** | Any eligible citizen can run for office without prohibitive structural barriers | Elite capture of candidacy |
| **B5 Competitive Multi-Party System** | Structure does not lock in dominance of one party or faction | One-party state by design |
| **B6 Electoral College / Selection Mechanics** | Method of selecting executives is proportional and representative | Structural minority-rule in executive selection |

### Test Block C — Civil Liberties & Rights
*Bill of Rights; Freedom House civil liberties criteria; ICCPR standards.*

| Test | Pass Criteria | Vulnerability if Failing |
|------|--------------|------------------------|
| **C1 Freedom of Expression** | Speech, press, and expression are constitutionally protected with minimal carve-outs | State control of narrative; democratic participation impaired |
| **C2 Freedom of Assembly** | Right to organize, protest, and associate is protected | Civil society suppression |
| **C3 Due Process** | Citizens cannot be deprived of life, liberty, or property without procedural protection | Arbitrary government power |
| **C4 Equal Protection** | All citizens are equal before the law; no group may be structurally subordinated | Caste system by law |
| **C5 Privacy Protection** | Some domain of private life is protected from government intrusion | Surveillance state without limit |
| **C6 Rights Enforceability** | Constitutional rights have an actual enforcement mechanism (courts, ombudsman, commission) | Paper rights — constitutionally guaranteed but practically unenforceable |

### Test Block D — Accountability & Transparency
*World Justice Project open government criteria; Fukuyama accountability framework.*

| Test | Pass Criteria | Vulnerability if Failing |
|------|--------------|------------------------|
| **D1 Official Accountability** | Elected and appointed officials can be removed for misconduct; processes exist and function | Impunity for officials |
| **D2 Financial Transparency** | Government budgets and expenditures are public and independently audited | Hidden spending; corruption without detection |
| **D3 Open Government** | Government records are presumptively public; FOIA-equivalent exists and is enforceable | Opacity by default |
| **D4 Anti-Corruption Mechanisms** | Independent body (inspector general, ethics commission, independent prosecutor) can investigate officials | Self-policing only |
| **D5 Conflicts of Interest Rules** | Officials cannot profit from decisions they make; revolving door is constrained | Regulatory capture by design |

### Test Block E — Amendment & Adaptability
*Democratic resilience; Madison's constitutional design philosophy.*

| Test | Pass Criteria | Vulnerability if Failing |
|------|--------------|------------------------|
| **E1 Amendment Accessibility** | Rules can be changed by sustained popular will through a defined process | Permanently entrenched rules the public cannot change |
| **E2 Amendment Difficulty** | Amendment requires more than a simple majority (protects against momentary capture) | Constitution easily hijacked by temporary majorities |
| **E3 Anti-Entrenchment** | No provision permanently entrenches one faction, party, or group | Structural permanent advantage |
| **E4 Succession Clarity** | Procedures for leadership succession are clear and unambiguous | Power vacuum / contested succession by design |

### Test Block F — Federalism & Jurisdictional Clarity
*10th Amendment framework; subsidiarity principle.*

| Test | Pass Criteria | Vulnerability if Failing |
|------|--------------|------------------------|
| **F1 Power Allocation Clarity** | Powers of each level of government are specified; ambiguous zones are minimal | Constant federal/state/local conflict; no clear authority |
| **F2 Preemption Rules** | Hierarchy of authority is explicit; higher-level law preempts lower in defined domains | Legal chaos; forum shopping; enforcement gaps |
| **F3 Local Autonomy Floor** | Local governments retain meaningful self-governance authority | State absorbs all local power; no subsidiarity |
| **F4 Intergovernmental Coordination** | Mechanisms exist for levels to cooperate on shared problems | Fragmentation on cross-boundary issues (environment, public health, infrastructure) |

### Test Block G — Democratic Norms (Structural Support)
*Levitsky & Ziblatt: mutual toleration and institutional forbearance.*

| Test | Pass Criteria | Vulnerability if Failing |
|------|--------------|------------------------|
| **G1 Opposition Protection** | Losing party/faction retains legal standing, speech rights, and ability to compete in future | Winner-take-all politics; opposition criminalized |
| **G2 Norm Codification** | Democratic norms that have operated as conventions are codified in law | Norms erosion — unwritten rules cannot withstand bad actors |
| **G3 Anti-Autocratic Safeguards** | Specific structural barriers prevent any individual or faction from seizing permanent control | Democratic backsliding path is structurally open |

### Test Block H — Systems Resilience & Responsiveness
*Reactive Manifesto (Bonér et al.) and Reactive Principles. The four reactive properties are not metaphors — they are direct requirements for any complex adaptive system, including government.*

| Test                                     | Pass Criteria                                                                                                                                                                           | Vulnerability if Failing                                                                                                                                     |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **H1 Responsive**                        | Government is legally required to respond to citizens in defined timeframes; feedback mechanisms are structured and enforced                                                            | No response obligations; citizens have no recourse for government silence or delay                                                                           |
| **H2 Resilient**                         | Government remains functional under failure — crisis, captured agency, contested succession, constitutional stress. Single points of failure are identified and mitigated by redundancy | Single point of failure in critical functions; no continuity-of-government provisions; system collapse is a possible outcome                                 |
| **H3 Elastic**                           | Government can scale capacity to meet demand spikes (pandemic, economic crisis, disaster) and wind back down. Scaling mechanisms are defined, not ad hoc                                | Emergency scaling requires improvisation; no statutory framework for surge capacity; elasticity achieved only through emergency powers (creates H4 risk)     |
| **H4 Message-Driven (Bounded Channels)** | Branches and levels of government communicate through defined, bounded channels. Citizen-government interfaces are well-specified. Information flow is structured, not informal         | Critical communications are informal and unrecorded; branches operate without defined intercommunication protocol; citizens have no structured interface     |
| **H5 Accept Uncertainty**                | Governance structures when ambiguous will have sunset clauses, adaptive rule making, iterative policy cycles. They should not be brittle under changing conditions                      | Laws assume permanent stable conditions; no review mechanisms; static structures that break under change                                                     |
| **H6 Embrace Failure**                   | System is designed for recovery, not just prevention. When a law fails, an agency is captured, or a norm breaks, override mechanisms and correction paths exist                         | No course-correction mechanism; failures propagate rather than triggering recovery; system optimizes for avoiding admission of failure                       |
| **H7 Assert Autonomy (Loose Coupling)**  | Each branch, level, and institution can operate independently. Tight coupling between components creates cascading failures when one is compromised                                     | Branches are functionally co-dependent; capture of one cascades to others; federalism is notional rather than structural                                     |
| **H8 Handle Dynamics**                   | System adapts to changing conditions without requiring full redesign. Amendment processes, delegated rulemaking with guardrails, and regulatory flexibility enable adaptation           | System requires constitutional amendment to handle changed conditions; no delegation framework; adaptation only possible through crisis-driven improvisation |

### Test Block I — Governance Architecture Quality
*The Twelve-Factor App methodology (Wiggins & Déhaan, Heroku) applied to rule design. Eight of twelve factors yield direct governance analogs. The test is not whether government is software — it is whether government rules are well-architected as a system.*

| Test | Pass Criteria | Vulnerability if Failing |
|------|--------------|------------------------|
| **I1 Single Authoritative Source (Codebase)** | Each rule has one canonical text, tracked with explicit version history. Amendments update the text; they don't layer alongside it | Overlapping, conflicting, or duplicated statutes; no single authoritative statement of what the rule is; citizens cannot determine current law without expert assistance |
| **I2 Explicit Authority Chain (Dependencies)** | Each law explicitly declares its constitutional authority and dependent statutes. Foundation can be audited | Laws rely on implicit foundations that can be silently undermined; constitutional authority is assumed, not cited; dependency graph is invisible |
| **I3 Separation of Lawmaking, Passage, and Enforcement (Build/Release/Run)** | The stages of creating law, enacting it, and enforcing it are strictly separated with clean handoffs. (This is separation of powers — the test asks whether the handoffs are actually clean) | Stages bleed into each other; enforcement branch influences lawmaking; legislature micromanages enforcement; stages are nominally separated but operationally fused |
| **I4 Equal Application (Stateless Processes)** | Law is applied without regard to the identity of the party. Rule of law, not of men. Statelessness means: outcome depends on facts, not on who you are | Identity-based application; informal discretion substitutes for legal standard; different outcomes for similarly situated parties |
| **I5 Clean Enactment and Repeal (Disposability)** | Laws can be enacted and repealed with defined transition provisions. New laws don't create permanent dependencies that make future change practically impossible | Laws create indefinite dependencies (agencies, entitlements, enforcement regimes) with no defined repeal path; technical debt accumulates; even clearly obsolete laws are practically irrepealable |
| **I6 Mandatory Audit Trails (Logs)** | Government actions generate permanent records. Decision rationale is documented. FOIA-equivalent exists. Legislative history is preserved and accessible | Critical decisions are made and not recorded; no requirement to document rationale; history is reconstructed rather than preserved |
| **I7 Emergency Powers Must Terminate (Admin Processes)** | Emergency declarations, executive orders, and special powers are defined as one-off processes with mandatory expiration, scope limits, and legislative override. They must complete and terminate | Emergency powers become permanent; executive orders accumulate without review; exceptional powers become routine; "temporary" measures outlast the emergency by years |
| **I8 Parameterized Policy (Config)** | Specific policy parameters — dollar thresholds, rates, dates, eligibility limits — are structured to be adjustable through defined processes without requiring full legislative amendment | Every adjustment requires full legislation; parameters hardcoded into statute text create brittleness; values become outdated and politically impossible to update |

---

### Test Block J — Domain Model Integrity
*Domain-Driven Design (Eric Evans, 2003). DDD was invented specifically to manage complexity in large systems with many interacting parts, teams, and domains — which is precisely what a multi-jurisdictional legal corpus is. This is the richest software engineering source for governance analogy because the problem DDD solves (coherent models in complex, multi-team, multi-domain systems) is structurally identical to the problem of legal coherence across jurisdictions and policy domains.*

| Test | Pass Criteria | Vulnerability if Failing |
|------|--------------|------------------------|
| **J1 Ubiquitous Language** | Core terms have one precise, agreed definition used consistently throughout the legal corpus within each domain. Same word means same thing across all statutes in the same domain | Ubiquitous Language Failure: "income," "household," "disability," "person," "small business" each have multiple conflicting statutory definitions across programs. Citizens cannot determine which definition applies to them without professional assistance |
| **J2 Bounded Context Clarity** | Each jurisdiction and each policy domain has explicit, documented boundaries defining where its model applies and where another model takes over. The boundary is not implicit or contested | Missing Bounded Context: overlapping jurisdiction between federal/state/local or between agencies, with no authoritative boundary definition. Results in regulatory arbitrage, forum shopping, enforcement voids |
| **J3 Context Map Completeness** | Relationships between bounded contexts are explicitly documented: which context governs where they overlap, which model is authoritative at each boundary, and how conflicts are resolved | Missing Context Map: federal/state/local authority relationships are undocumented and resolved ad hoc through litigation. Nobody can determine in advance which law governs at a jurisdictional boundary |
| **J4 Anti-Corruption Layer (ACL) at Boundaries** | Where two bounded contexts meet, explicit translation rules prevent the model of one from corrupting the other. Preemption rules, delegation standards, and supremacy provisions constitute the ACL | Missing ACL: federal cannabis law directly conflicts with state law with no translation mechanism — raw model conflict. The Supremacy Clause is an incomplete, contested ACL |
| **J5 Aggregate Root Identification** | Each policy domain has a primary authoritative statute from which all related rules derive and to which they are subordinate. External rules reference the aggregate root, not component parts | Orphaned Aggregate: US privacy law has no aggregate root — COPPA, HIPAA, FCRA, GLBA, FERPA, CAN-SPAM, and state laws all make equally-weighted, conflicting claims. No canonical source of truth |
| **J6 No Big Ball of Mud** | Policy domains have coherent internal structure. Rules within a domain share a conceptual model and do not accumulate as disconnected layers | Big Ball of Mud: the US Tax Code (Title 26, 2,652+ pages) and federal healthcare law (ACA, Medicare, HIPAA, Medicaid, CHIP, VA health — no shared model) are canonical examples. Diagnosable by: high term inconsistency, high inter-rule conflict rate, no aggregate root, high ambiguity |
| **J7 Shared Kernel Integrity** | Core concepts that must be consistent across all contexts — definition of a legal person, fundamental rights, basic procedural standards — are maintained in a Shared Kernel that all contexts reference without modification | Shared Kernel Failure: the constitutional definitions and Bill of Rights that should be the Shared Kernel are interpreted inconsistently across contexts. "Person" in corporate law vs. criminal law vs. immigration law vs. constitutional law (Citizens United) carries materially different meanings |
| **J8 Core / Supporting / Generic Domain Allocation** | Government invests most deeply in its Core Domain (functions only government can perform: constitutional rights, criminal justice, democratic process, national defense), adequately in Supporting Domains (healthcare, education, infrastructure), and minimally in Generic Domains (procurement, HR, IT, facilities) | Strategic misallocation: government over-invests in Generic Domain administrative overhead at the expense of Core Domain capability. An agency that cannot enforce its mandate but runs a sophisticated procurement system is inverted in its domain prioritization |
| **J9 Event Sourcing of Legal History** | The current state of law is derivable from a complete, preserved event log of enactments, amendments, and repeals. The law as it existed at any historical date is queryable. Legislative history is preserved, not reconstructed | Missing event sourcing: many state and local legal corpora exist only as current snapshots with no preserved history. Federal law is better maintained but not fully event-sourced. Makes it impossible to answer: "what was the law on this date?" |

### Test Block K — Separation of Religious and Civil Authority
*First Amendment Establishment Clause; Madison's "Memorial and Remonstrance Against Religious Assessments"; Levitsky & Ziblatt on religious nationalist democratic backsliding; Tocqueville on the separation of church and state as a precondition for democratic liberty.*

Two distinct failure modes: **Structural Theocracy** (religious authority is civil authority by constitutional design) and **Religious Capture** (the effective rule increasingly encodes religious doctrine through process and judicial drift, without formal constitutional change). The US case is the latter — the Establishment Clause is structurally intact, but Layer 2 process vulnerabilities and Layer 3 judicial drift are shifting the effective rule. This is a canonical example of the meta → process → content → KPI causal chain: religious organization capture of appointment processes → Establishment Clause reinterpretation → civil laws encoding sectarian doctrine.

| Test                                           | Pass Criteria                                                                                                                                                               | Vulnerability if Failing                                                                                            |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **K1 Freedom of Religion**                     | Constitution explicitly provides for freedom of religion; no religious body holds civil governmental authority                                                              | Structural Theocracy: religious law is civil law by constitutional design                                           |
| **K2 Secular Civil Law**                       | Civil law is justified on secular grounds; religious doctrine is not the operative basis for enforceable obligations on non-adherents                                       | Religious Capture: civil law encodes sectarian doctrine enforceable against non-believers                           |
| **K3 Church-State Judicial Trend**             | Court interpretation of church-state separation has been stable or strengthening over the most recent 20-year period                                                        | Judicial Drift toward theocracy — constitutional protection eroding through case law without any legislative change |
| **K4 Religious Organization Political Parity** | Religious organizations have no greater formal political access, tax-advantaged lobbying capacity, or judicial appointment influence than other civil society organizations | Preferential structural access enabling incremental religious capture of civil authority                            |

### Test Block L — Fiscal Capacity & Adequate Resourcing
*Alexander Hamilton, Federalist No. 30 ("A nation cannot long exist without revenues… this power ought to be co-extensive with all the possible combinations of such circumstances"); Francis Fukuyama on state capacity as the precondition for effective governance; the Unfunded Mandates Reform Act of 1995; and the inverse of McCulloch v. Maryland — if the power to tax is the power to destroy, the power to defund is the power to nullify.*

Authority without resources is authority in name only. A rule can assign a power, a duty, or an enforcement mandate — but if the structure does not also secure the funding and capacity to exercise it, the rule is hollow. This block tests whether the power and authority the rules assign are matched by the fiscal means to carry them out, and whether that funding is protected against being used as a backdoor mechanism to nullify a mandate without repealing it. It links directly to the **Money Explorer** (revenue view) and to the **Enforcement Gap** vulnerability.

| Test | Pass Criteria | Vulnerability if Failing |
|------|--------------|--------------------------|
| **L1 Mandate–Resource Alignment** | Every function, duty, or authority assigned by the rules has a corresponding, identified funding mechanism sufficient to perform it | Unfunded Mandate: authority exists on paper but cannot be exercised; duties are assigned without the means to fulfill them |
| **L2 Revenue Authority Sufficiency** | The level of government has independent authority to raise revenue adequate to its assigned responsibilities | Fiscal Dependency: a level of government cannot fund its mandate without discretionary transfers from another, making its authority contingent and capturable |
| **L3 Appropriations Stability** | Core functions are funded through stable, multi-year, or automatic mechanisms rather than lapse-prone annual appropriations subject to shutdown | Funding Brittleness: essential authority is periodically suspended or held hostage through budget lapse and continuing-resolution brinkmanship |
| **L4 Enforcement Capacity Funding** | Bodies granted enforcement authority are funded to a level that makes enforcement achievable at the scale of the mandate | Hollow Enforcement: penalties and obligations exist in law but the enforcing body lacks the staff or budget to apply them — a structural source of the Enforcement Gap vulnerability |
| **L5 Anti-Starvation Protection** | The structure prevents defunding from being used as a covert means of nullifying a legal mandate or neutralizing an agency the rules empower | Starvation Capture: a law or agency is disabled by cutting its budget rather than repealing it through the legitimate legislative process |

---

## Test Scoring

Each test returns:
- **Pass** — explicitly protected in the text, with enforcement mechanism
- **Partial** — protected in text but enforcement mechanism is weak, ambiguous, or dependent on political will
- **Gap** — not addressed in the document; relies on convention or downstream statute
- **Fail** — structural feature actively works against this criterion

A jurisdiction's **Democratic Design Score** is the aggregate across all test blocks. Sub-scores per block allow identification of where a jurisdiction's structure is strongest and weakest.

Critically: a **Gap** is not the same as a **Fail**. A gap means the meta relies on content rules or conventions to fill a structural hole — which is a vulnerability because content rules can be repealed and conventions can erode.

## Vulnerability Taxonomy

Modeled after CVE categories in cybersecurity:

| Type                     | Definition                                                                                                                                                                                                    | Example                                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gap**                  | Domain with no governing rule                                                                                                                                                                                 | No federal data privacy law                                                                                                                                                                  |
| **Conflict**             | Two rules that contradict each other                                                                                                                                                                          | State vs. federal cannabis law                                                                                                                                                               |
| **Loophole**             | Rule exploitable contrary to intent                                                                                                                                                                           | Tax code carve-outs                                                                                                                                                                          |
| **Obsolescence**         | Rule no longer fit for purpose                                                                                                                                                                                | Laws referencing defunct agencies                                                                                                                                                            |
| **Ambiguity**            | Unclear meaning, inconsistent interpretation                                                                                                                                                                  | Vague "reasonable" standards                                                                                                                                                                 |
| **Enforcement Gap**      | Rule exists but can't be or isn't enforced                                                                                                                                                                    | Unenforced environmental penalties                                                                                                                                                           |
| **Inequity**             | Rule produces disparate outcomes by protected class                                                                                                                                                           | Sentencing disparities                                                                                                                                                                       |
| **Preemption Conflict**  | Federal/state hierarchy creates void                                                                                                                                                                          | Medicaid opt-outs                                                                                                                                                                            |
| **Judicial Drift**       | Cumulative court interpretation has moved the effective rule materially away from its text or legislative intent — without legislative action                                                                 | Shelby County gutting the Voting Rights Act; Loper Bright restructuring agency deference; Citizens United rewriting campaign finance                                                         |
| **Structural Theocracy** | Constitutional document establishes religious authority as supreme or co-equal with civil authority; religious doctrine is civil law by design                                                                | Iran's constitution (Supreme Leader as religious authority over civil branches); Saudi Basic Law; constitutional establishment of a state religion with governing power                      |
| **Religious Capture**    | Civil law increasingly reflects the doctrine of a specific religious tradition, enforced against all citizens regardless of belief, through process capture rather than explicit constitutional establishment | Creeping Establishment Clause erosion through judicial drift and legislative encoding of religious doctrine; civil law obligations derived from sectarian doctrine without naming it as such |
| **Unfunded Mandate**     | A duty or authority is assigned by rule without a corresponding funding mechanism sufficient to carry it out                                                                                                  | Federal mandates imposed on states without appropriations; enforcement agencies granted authority but not the budget to exercise it                                                          |
| **Starvation Capture**   | A law or agency is functionally nullified by cutting its funding rather than repealing it through the legitimate legislative process                                                                          | Defunding an agency's enforcement division to neutralize a statute that formally remains on the books                                                                                        |

Each vulnerability gets: severity score, affected jurisdiction(s), KPI impact estimate, beneficiary analysis (who gains from the bug), and patch difficulty rating.

**New Vulnerability Types from DDD:**

These are added to the vulnerability taxonomy (alongside Gap, Conflict, Loophole, etc.):

| Vulnerability Type | Definition | DDD Source |
|-------------------|-----------|-----------|
| **Ubiquitous Language Failure** | Same term carries materially different meanings across statutes in the same domain, producing inconsistent outcomes for similarly-situated people | Ubiquitous Language |
| **Missing Bounded Context** | No clear boundary defining where a jurisdiction's or domain's authority begins and ends | Bounded Context |
| **Missing Anti-Corruption Layer** | Two legal contexts meet with no defined translation rules; raw model conflict at the boundary | ACL |
| **Context Bleed** | Concepts from one bounded context inappropriately used in another, distorting meaning | Bounded Context |
| **Orphaned Aggregate** | Policy domain has no primary authoritative statute; multiple statutes make equal, conflicting claims | Aggregate Root |
| **Big Ball of Mud** | Policy domain with no coherent model; rules accumulated without shared framework; high internal inconsistency | Big Ball of Mud |
| **Shared Kernel Violation** | Core concept that should be universal is defined differently across contexts, breaking the common foundation | Shared Kernel |
| **Strategic Domain Inversion** | Government resources concentrated in Generic Domain functions at the expense of Core Domain capability | Core/Supporting/Generic |

## Architectural Patterns Applied to Governance
*Drawn from Fowler's Patterns of Enterprise Application Architecture. Most patterns in the catalog are database/ORM engineering — too implementation-specific to translate. These five yield genuine governance insight.*

**Remote Facade — Citizen Interface Simplification**
In software, a Remote Facade provides a simplified, coarse-grained interface over complex internal systems. In governance: citizens should not need a lawyer to understand their rights, determine their eligibility for benefits, or interact with government services. When the citizen-government interface requires professional intermediation for routine interactions, the facade is broken. This is a distinct vulnerability type: **Interface Complexity Failure**.

**Domain Model Coherence**
Each policy domain should have a coherent shared conceptual model. When laws within a domain use conflicting definitions — three different definitions of "income" across tax, housing assistance, and healthcare eligibility law — the domain model is broken. This produces cascading inconsistency: a person can simultaneously qualify and not qualify for programs depending on which statute is applied. **Broken Domain Model** is a specific vulnerability class.

**Separated Interface**
Rights and procedures (the interface) should be defined separately from the agencies and enforcement mechanisms (the implementation). When they are conflated, changing the implementation erases the right. A constitutional right without an independent enforcement mechanism is an interface with no implementation — it exists on paper but cannot be called.

**Repository — Single Source of Truth**
Every rule should exist in one authoritative, publicly accessible repository. Fragmentation of legal authority across inconsistent sources (conflicting published versions, superseded regulations still cited, federal/state law in conflict with no authoritative resolution) is a **Repository Integrity Failure**.

**Layered Architecture**
Already incorporated in our Rule Type Taxonomy (Layers 1–5). The principle is: layers communicate through defined interfaces; a lower layer does not depend on a higher layer; changes in one layer don't cascade uncontrollably. In governance: content law (Layer 5) should not be able to effectively override meta law (Layer 1) through technical maneuver.

---

## Refactoring as Patch Vocabulary
*Fowler's refactoring catalog applied not as tests, but as a vocabulary for describing how to fix identified vulnerabilities. Every vulnerability finding in the system is tagged with one or more recommended refactorings, giving policymakers a precise description of the fix — not just the problem.*

| Refactoring Technique | Policy Equivalent | Example |
|----------------------|-------------------|---------|
| **Remove Dead Code** | Repeal obsolete statutes | Unenforced Prohibition-era laws still on the books |
| **Extract Function** | Split an overloaded law or agency into focused parts | Break up an omnibus agency handling 12 unrelated functions |
| **Inline Class** | Consolidate fragmented micro-agencies with no distinct function | Merge overlapping regulatory bodies with duplicated mandates |
| **Consolidate Duplicate** | Harmonize overlapping statutes covering the same domain | Three overlapping federal privacy laws with inconsistent definitions |
| **Rename** | Update archaic, gendered, or stigmatizing terminology | Statutory language using outdated medical or demographic terms |
| **Decompose Conditional** | Simplify complex conditional eligibility rules | Benefits eligibility with 47 if-then conditions |
| **Replace Nested Conditional with Guard Clauses** | Flatten eligibility trees so citizens can self-determine | Make the most common disqualifying conditions easy to check first |
| **Replace Magic Literal** | Index fixed dollar thresholds or dates to inflation or automatic review | $600 1099 threshold unchanged since 1954 |
| **Move Function** | Shift a government function to the right jurisdictional level | Federal regulation of something better handled at state level (or vice versa) |
| **Remove Middle Man** | Eliminate unnecessary bureaucratic intermediaries | Require agency to pass through 4 sub-agencies to issue a permit |
| **Introduce Assertion** | Add explicit, binding statements of legislative intent | Laws without purpose clauses that later get interpreted contrary to intent |
| **Split Phase** | Separate functions that should be structurally independent | Investigation and prosecution in same body; rulemaking and enforcement in same agency |
| **Replace Magic Literal → Parameterize** | Delegate specific parameters to agencies with guardrails rather than hardcoding in statute | Regulatory thresholds that update automatically within statutory bounds |
| **Extract Superclass** | Identify common framework shared by a family of laws; codify it | Multiple sector-specific privacy laws with no common framework |
| **Separate Query from Modifier** | Laws that audit/report state should not simultaneously change state | Agency that both investigates and benefits from findings |

**Additional patch vocabulary from Domain-Driven Design:**

| DDD Refactoring | Policy Equivalent | Example |
|-----------------|-------------------|---------|
| **Establish Ubiquitous Language** | Define one authoritative term for each core concept; amend all statutes in the domain to use it | Define "income" once for all federal benefit programs; eliminate 12 conflicting definitions |
| **Extract Bounded Context** | Carve a clearly-bounded domain out of a Big Ball of Mud; assign clear ownership and authority | Extract food safety from the overlapping FDA/USDA/EPA jurisdiction into a single bounded authority |
| **Introduce Anti-Corruption Layer** | Define explicit translation and preemption rules at a contested jurisdictional boundary | Publish authoritative federal/state preemption map for environmental law; eliminate ad hoc litigation as resolution mechanism |
| **Identify Aggregate Root** | Designate a primary authoritative statute for a fragmented domain; require all other rules to derive from it | Pass a Federal Privacy Framework Act that all sector-specific laws (HIPAA, COPPA, etc.) become amendments to |
| **Introduce Shared Kernel** | Codify the small set of definitions and concepts that must be consistent across all contexts | A Federal Definitions Act establishing one authoritative definition of "person," "household," "income" for use across all federal programs |
| **Refactor to Core Domain** | Shift resources and legislative attention from Generic Domain overhead to Core Domain capability | Reduce procurement bureaucracy to fund enforcement capacity in underfunded Core Domain agencies |
| **Event-Source the Legal Corpus** | Maintain law as an event log (enact/amend/repeal events) rather than only a current snapshot; make historical state queryable | States should preserve full legislative history, not just current code; makes "what was the law on date X?" answerable |

This vocabulary bridges the gap between identifying a vulnerability and proposing a patch. A vulnerability report reads: *"Ubiquitous Language Failure — 'income' carries 11 different definitions across federal benefit programs (tax, housing, healthcare, student aid, child support, SNAP, SSI, Medicaid, CHIP, TANF, Section 8). Recommended patch: Establish Ubiquitous Language + Introduce Shared Kernel — Federal Definitions Act with one canonical definition and permitted program-specific adjustments declared as explicit deltas."*

---

## Governance Patch Proposal Methodology

Every vulnerability finding in the system can be paired with a structured patch proposal. In addition, in the Design tool, the user can create a prompt for new governance elements (ultimately grouped into one of the patch types specified below).

The system doesn't output a vague call for reform — it provides a documented, stepwise analysis that gives policymakers, researchers, and advocates a usable starting point. The methodology is consistent across all vulnerability types; the inputs and outputs are standardized.

### Step 1 — Feasibility Classification

Before drafting a patch, determine what type of change is required and what process that entails. This is the "patch difficulty" determination:

| Patch Type | Process Required | Typical Timeline | Difficulty Score |
|-----------|-----------------|-----------------|-----------------|
| **Regulatory guidance / interpretation** | Agency memorandum or guidance document | Weeks to months | 1 |
| **Executive order** | Presidential or gubernatorial action | Days to months | 1–2 |
| **Agency rulemaking (informal)** | Notice-and-comment rulemaking under APA | 1–3 years | 2 |
| **Statute amendment** | Full legislative process (bill, committee, floor vote, executive signature) | 2–7 years | 3 |
| **Major statutory overhaul** | Comprehensive reform bill with broad coalition required | 5–15 years | 4 |
| **Constitutional amendment** | Supermajority + ratification by 38 states (federal); state-specific process | 10+ years, if ever | 5 |

The Patch Difficulty Score (1–5) is displayed prominently on every proposal. A score of 5 does not mean "don't bother" — it means the problem is structural and requires structural intervention.

### Step 2 — Precedent & Comparable Jurisdiction Search

Before drafting novel language, search for jurisdictions that have already addressed the same vulnerability:

- **Domestic:** Has any U.S. state already passed legislation addressing this gap? State-level innovations are the most directly portable to federal law or to other states.
- **International:** Have OECD peer countries addressed this issue? If so, what was the outcome? International models are particularly useful for gaps where the U.S. is an outlier.
- **Historical:** Has this been attempted before in this jurisdiction? If previous attempts failed, what were the political obstacles? Understanding failure modes is as valuable as finding successes.

The search is conducted via RAG over the legal corpus + targeted Claude analysis. Output: 1–3 "model jurisdiction" examples with citations and brief outcome summaries.

### Step 3 — Stakeholder & Beneficiary Analysis

Every vulnerability has a beneficiary — someone who gains from the current broken state. Identifying them is essential for understanding political feasibility and anticipating opposition.

For each patch, the system generates:
- **Current beneficiaries:** Who profits from this vulnerability? (May be an industry, a political faction, a regulatory body, or simply an entrenched bureaucratic interest)
- **Current harm-bearers:** Who pays the cost of this vulnerability? (Often diffuse — the public — which is why the bug persists)
- **Political feasibility:** Low / Medium / High, based on the balance of beneficiaries vs. harm-bearers and historical legislative precedent
- **Coalition map:** What constituencies would support this patch? What constituencies would oppose it?

### Step 4 — Draft Patch Language

The core output: a concrete starting point for a legislative or regulatory fix.

- **Level of detail:** Section-level draft language, not full bill text. Enough specificity to show the intent and structure of the change, expressed in plain statutory style.
- **Clarity standard:** The draft should be comprehensible to a non-lawyer policy staffer — not opaque legalese.
- **Explicitly AI-generated:** All draft language is clearly marked as AI-generated and requires expert legal review before use. The system is a research tool, not legal counsel.
- **Refactoring tag:** Every patch is tagged with the Refactoring vocabulary type (e.g., "Consolidate Duplicate + Introduce Shared Kernel") so the structural nature of the fix is named, not just described.
- **Scope specified:** What exactly does this patch change? What does it leave unchanged? Avoiding unintended scope creep is called out explicitly.

### Step 5 — Impact Assessment

What happens if the patch is implemented?

- **Projected KPI delta:** Estimated improvement range in the most directly affected KPIs, based on comparable jurisdiction evidence. Expressed as a range, not a point estimate. Labeled as projection, not prediction.
- **Timeline to KPI impact:** How long after implementation would measurable outcomes be expected? Some patches produce rapid effects (enforcement rule change → compliance within months); others require years (constitutional amendment → generational cultural shift).
- **Watch-after-passage KPIs:** the shortlist of indicators to monitor once the patch is enacted, so the projected impact is checkable against reality.
- **Cost estimate:** Where applicable, estimated fiscal impact (relying on CBO methodology for federal patches, or comparable state fiscal analysis methods).

### Step 6 — Unintended Consequences *(added 2026-07-15)*

What else does this patch touch? Formerly a bullet inside Impact Assessment, promoted to a dedicated step (owner decision, 2026-07-15) so second-order effects get first-class analysis rather than a flag.

- **Simulation:** the patch is applied to a copy of the corpus; a conflict scan runs over every section that references the amended text.
- **Incentive analysis:** how did affected parties game comparable fixes in peer jurisdictions? Reuses the precedent evidence from Step 2.
- **Tagged findings:** each finding is tagged `CONFLICT` / `INCENTIVE` / `CAPACITY` / `DRIFT` and carries a proposed mitigation plus a status: **addressed in draft** / **needs draft change** / **monitored**.

### Step 7 — Implementation Pathway

A clear sequence of required steps:

- Which committee(s) must act?
- What is the vote threshold required?
- Are companion agency actions required (e.g., statute amendment requires follow-on rulemaking)?
- What are the key veto points and who controls them?
- Is there a "minimum viable patch" — a smaller change that achieves most of the benefit with lower political friction?

### Output Formats

Every patch proposal is available in four formats, each with a unique stable URL:

| Format | Length | Audience | Contents |
|--------|--------|---------|---------|
| **One-Page Policy Brief** | 1 page | Journalists, legislators, general public | Plain-language summary: what's broken, why it matters, what the fix is |
| **Full Patch Proposal** | 3–5 pages | Policy staff, researchers, advocates | All seven steps above |
| **Draft Language Appendix** | Variable | Legislative staff, legal researchers | AI-generated statutory/regulatory text with review disclaimer |
| **Comparable Models Report** | 1–2 pages | Policy researchers | Jurisdictions that have addressed this; outcome evidence |

### Patch Scoring Summary (displayed on every proposal)

```
Vulnerability: [ID + type + jurisdiction]
Patch Difficulty: [1–5] — [e.g., "Statute amendment required (Score: 3)"]
Refactoring Type: [e.g., "Consolidate Duplicate + Introduce Bounded Context"]
Political Feasibility: [Low / Medium / High]
Timeline to Implementation: [e.g., "3–7 years with sustained advocacy"]
Projected KPI Impact: [e.g., "+8–15% in maternal mortality rate if modeled on Minnesota approach"]
Model Jurisdiction: [e.g., "Germany (2019 reform); Minnesota (2022 statute)"]
Draft Language: [Link to appendix]
```

## KPI Catalog

Organized into categories, drawing on: standard governance metrics, Bhutan's Gross National Happiness (GNH) framework, OECD Better Life Index, UN Human Development Index, and WHO global health standards. Each KPI tagged as **Universal** (broad cross-spectrum agreement) or **Contested** (politically debated — included with label).

### 1. Safety & Security
- Violent crime rate per 100k (Universal)
- Property crime rate per 100k (Universal)
- Homicide rate per 100k (Universal)
- Incarceration rate per 100k (Universal)
- Recidivism rate within 3 years (Universal)
- Traffic fatality rate per 100k (Universal)
- Domestic violence rate (Universal)
- Hate crime rate (Contested)
- Police use-of-force incidents per 100k (Contested)

### 2. Health & Physical Wellbeing
*Mortality & longevity:*
- Life expectancy at birth (Universal)
- Infant mortality rate (Universal)
- Maternal mortality rate (Universal)
- Child mortality rate (under-5) (Universal)
- Preventable death rate (Universal)
- Disability-Adjusted Life Years (DALYs) lost (Universal)
- Years of potential life lost (YPLL) (Universal)

*Major disease categories:*
- Cardiovascular disease mortality rate (Universal)
- Cancer incidence and mortality rate (Universal)
- Neurodegenerative disease prevalence — Alzheimer's, Parkinson's (Universal)
- Metabolic disease prevalence — diabetes, obesity (Universal)
- Chronic disease burden index (Universal)
- Respiratory disease mortality rate (Universal)
- Sepsis and hospital-acquired infection rate (Universal)

*Mental health:*
- Depression and anxiety prevalence (Universal)
- Suicide rate per 100k (Universal)
- Substance use disorder prevalence (Universal)
- Drug overdose deaths per 100k (Universal)

*Access & quality:*
- Uninsured / underinsured rate (Contested)
- Primary care physician-to-population ratio (Universal)
- Preventive care utilization rate (Universal)
- Hospital readmission rates (Universal)
- Vaccine coverage rates (Contested)

### 3. Subjective Wellbeing & Happiness
*Derived from GNH, Gallup World Poll, OECD Better Life Index:*
- Life satisfaction score (Cantril Ladder) (Universal)
- Positive affect prevalence (daily positive emotions) (Universal)
- Negative affect prevalence (daily stress, worry, anger) (Universal)
- Sense of purpose / meaning index (Universal)
- Loneliness and social isolation index (Universal)
- Psychological wellbeing index (flourishing vs. languishing) (Universal)
- Work-life balance index (GNH-derived) (Universal)
- Time poverty rate (% unable to meet basic needs given time constraints) (Universal)
- Community vitality index (volunteerism, social cohesion) (GNH) (Universal)
- Spiritual / existential wellbeing index (Contested)

### 4. Economic
- GDP per capita (Universal)
- Gini coefficient / income inequality (Contested)
- Poverty rate (Universal)
- Median household income (Universal)
- Unemployment rate (Universal)
- Labor force participation rate (Universal)
- Wage growth vs. inflation (real wage growth) (Universal)
- Intergenerational income mobility (Universal)
- Homelessness rate (Universal)
- Food insecurity rate (Universal)
- Housing cost burden (% households paying >30% income on housing) (Universal)
- Consumer debt burden (household debt-to-income ratio) (Universal)
- Retirement security index (pension coverage, savings adequacy) (Universal)
- New business formation rate (Universal)
- Business survival rate — 1-year and 5-year (Universal)
- High-growth firm rate (firms growing >20% annually for 3+ consecutive years) (Universal)
- Venture capital investment per capita (Universal)
- Time and cost to start a business — World Bank Doing Business methodology (Universal)
- Small business credit access rate (Universal)
- Bankruptcy accessibility index — ease of restart for failed entrepreneurs (Universal)
- Regulatory compliance cost ratio — small vs. large firm per-employee burden (Universal)
- Wealth inequality (top 1% share) (Contested)

### 5. Education & Knowledge
- Early childhood education enrollment rate (Contested)
- High school graduation rate (Universal)
- Adult literacy rate (Universal)
- PISA scores for international comparison (Universal)
- College completion rate (Universal)
- STEM workforce pipeline ratio (Contested)
- Lifelong learning participation rate (Universal)
- School funding equity (variance between richest and poorest districts) (Contested)

### 6. Governance Quality & Democracy
- Corruption Perceptions Index (Transparency International) (Universal)
- Rule of Law Index (World Justice Project) (Universal)
- Voter participation rate (Universal)
- Electoral integrity index (Universal)
- Press freedom index (Freedom House) (Universal)
- Government transparency index (open data, FOIA responsiveness) (Universal)
- Regulatory capture index (Contested)
- Government trust index (Gallup) (Universal)
- Judicial independence index (Universal)
- Speed of justice (average time to trial resolution) (Universal)
- Pew Research Global Restrictions on Religion Index (Universal)
- Religious freedom score — Freedom House (Universal)
- Religious exemptions in civil law — count and scope of laws granting religious exemptions from generally applicable civil obligations (Universal)
- Establishment Clause litigation rate and outcome trend (Universal)
- Religious representation disparity — elected officials' religious affiliation vs. population share (Contested)

### 5b. Science, Research & Innovation Leadership
- R&D expenditure as % of GDP — public + private combined (Universal)
- Federal basic research funding as % of total R&D (Universal)
- Research university publication output and citation impact per capita (Universal)
- Patent applications and grants per capita (Universal)
- Technology transfer rate — patents licensed from universities to industry (Universal)
- Brain drain/gain ratio — net migration of high-skill STEM workers (Universal)
- STEM PhD production rate per capita (Universal)
- Government science agency funding stability — % funded through multi-year appropriations vs. continuing resolutions (Universal)
- Open access publication rate — proportion of publicly-funded research freely accessible (Universal)
- Public trust in science index (Contested)

*Contextual indicator (displayed but not scored — extreme lag and small-N noise make it unsuitable as a KPI):*
- Nobel Prizes in science per 10M population, 50-year rolling average — a lagging prestige signal reflecting the research environment of a prior generation, not current policy

### 7. Infrastructure & Built Environment
- Infrastructure quality index (roads, bridges, rail, ports) (Universal)
- Broadband access rate and speed (Universal)
- Affordable housing supply deficit (Universal)
- Public transit access and coverage (Universal)
- Grid reliability (power outage hours per year) (Universal)

### 7b. Environmental Health & Safety
*Air quality:*
- PM2.5 annual average exposure (Universal)
- Ozone (O3) exceedance days per year (Universal)
- Nitrogen dioxide (NO2) levels in urban areas (Universal)
- Toxic air pollutant (HAP) exposure by census tract (Universal)
- Indoor air quality index (radon, VOC standards) (Universal)

*Water quality & access:*
- Safe drinking water access rate (Universal)
- Lead pipe/service line replacement rate (Universal)
- PFAS ("forever chemical") contamination level (Universal)
- Nitrate contamination in drinking water (Universal)
- Wastewater treatment compliance rate (Universal)
- Groundwater depletion rate (Universal)
- Stormwater overflow events per year (Universal)

*Chemical & material safety:*
- Toxic Release Inventory (TRI) pounds released per capita (Universal)
- Superfund site remediation rate (Universal)
- Pesticide residue exceedance rate in food supply (Universal)
- Hazardous waste site proximity by income quartile (Universal)
- Chemical facility accident rate (Universal)
- Consumer product recall rate by category (Universal)

*Circular economy & materials (Design Principles 2–3):*
- Municipal solid waste recycling/diversion rate (Universal)
- Landfill per capita tonnage (Universal)
- Composting / organic waste recovery rate (Universal)
- Extended Producer Responsibility (EPR) law coverage (Universal)
- Right-to-repair law coverage index (Universal)
- Single-use plastics ban coverage (Contested)
- Toxic chemical regulatory coverage vs. EU REACH standard (Universal)
- PFAS (forever chemical) in drinking water — % population exposed above EPA threshold (Universal)
- Lead exposure rate in children (blood lead levels) (Universal)
- Pesticide residue exceedance rate in food (Universal)
- Safe cosmetics law alignment with global standards (Universal)

*Energy (Design Principle 4):*
- Renewable energy as % of electrical grid (Contested)
- Clean energy jobs per 100k workers (Universal)
- Energy affordability index (household energy burden, % income) (Universal)
- Net energy import dependence (Universal)
- Rooftop solar installation rate (Universal)
- Renewable Portfolio Standard (RPS) ambition vs. actual (Universal)

*Climate & ecosystem (Design Principle 5):*
- Carbon emissions per capita (Contested)
- Methane leak detection compliance rate (Universal)
- Industrial emissions compliance rate (Universal)
- Carbon sequestration investment per capita (Universal)
- Biodiversity index (native species health) (Universal)
- Forest cover change rate (Universal)
- Wetland loss rate (Universal)
- Climate resilience index (flood/heat/fire risk preparedness) (Universal)
- Urban heat island intensity (Universal)
- Soil health index (agricultural land quality) (Universal)
- Ecosystem services valuation (pollination, water filtration, carbon storage) (Universal)

### 8. Social Equity & Justice
- Racial/ethnic disparity in criminal sentencing (Contested)
- Gender pay gap (Contested)
- Racial wealth gap (Contested)
- LGBTQ+ legal protection index (Contested)
- Disability employment rate (Universal)
- Indigenous community wellbeing index (Universal)
- Immigrant integration index (Contested)
- Social trust index — generalized and institutional (Universal)
- Intergenerational poverty transmission rate (Universal)

### 9. Cultural Vitality & Community (GNH-inspired)
- Arts and culture participation rate (Universal)
- Civic participation rate (beyond voting — town halls, boards, nonprofits) (Universal)
- Religious/community affiliation and participation (Contested)
- Cultural diversity preservation index (GNH) (Universal)
- Volunteering rate (Universal)
- Intergenerational connection index (GNH) (Universal)
- Local food system resilience (Universal)

**Data sources:** Census Bureau, CDC WONDER, CDC BRFSS, FBI NIBRS/UCR, BLS, EPA AQS, EPA TRI, EPA Safe Drinking Water Act data, OECD Better Life Index, World Bank, WHO Global Health Observatory, Gallup World Poll, Gallup-Sharecare Wellbeing Index, Transparency International, Freedom House, World Justice Project, UN Human Development Index, UN SDG indicator database, GNH Centre Bhutan methodology, Robert Wood Johnson Foundation County Health Rankings, EJScreen (EPA environmental justice tool), Pew Research Center, Harvard Social Capital Atlas.

The administrator will be able to add new categories or KPIs. We'll eventually give that same ability to the end users.

---

## KPI Views

Every KPI in the system is tagged with dimension, SDG, design principle, and capital type. Users can pivot between four views over the same underlying data — no duplication.

---

### View A — Dimensional Hierarchy (default)
The KPI categories (Safety, Health, Wellbeing, Economic, Education, Governance, Infrastructure, Environment, Social, Cultural). Best for: comparing jurisdictions, identifying domain-specific vulnerability clusters.

---

### View B — SDG Pyramid (hierarchical, not flat)

Based on the dependency hierarchy from the Design Principles framework (J. Mayerhofer, 2024): foundational goals must be achieved before higher-order goals are possible. The pyramid reads bottom-up:

```
                        ┌─────────────┐
                        │  SDG 3      │  ← Aspirational Outcome
                        │ Good Health │    "In a world without poverty, with
                        │ & Wellbeing │     zero hunger, clean water — good
                        └─────────────┘     health for all is possible."
                    ┌─────────────────────┐
                    │       SDG 1         │
                    │     No Poverty      │
                    └─────────────────────┘
               ┌──────────────────────────────┐
               │   SDG 2        │   SDG 6     │
               │  Zero Hunger   │ Clean Water │
               └──────────────────────────────┘
          ┌──────────────────────────────────────────┐
          │   SDG 9    │   SDG 8    │   SDG 10       │
          │ Industry & │ Decent     │ Reduced        │
          │ Innovation │ Work       │ Inequalities   │
          └──────────────────────────────────────────┘
     ┌───────────────────────────────────────────────────┐
     │ SDG 13 │ SDG 14  │ SDG 15  │ SDG 11  │  SDG 12   │
     │Climate │Life     │Life     │Sust.    │Responsible │
     │Action  │Below    │On Land  │Cities   │Consumption │
     └───────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│  SDG 7    │  SDG 4   │  SDG 16  │   SDG 17  │   SDG 5      │
│ Renewable │ Quality  │ Peace &  │ Partner-  │  Gender      │
│  Energy   │ Education│ Justice  │  ships    │  Equality    │
└──────────────────────────────────────────────────────────────┘
 ← FOUNDATION: Institutions, Education, Energy, Equity →
```

Each KPI is tagged to its SDG(s). A jurisdiction's SDG pyramid scores are heat-mapped: green (on track), yellow (at risk), red (failing). The hierarchy makes visible *why* a top-level KPI is failing — you can trace root causes down through the pyramid.

| SDG | Key KPIs mapped |
|-----|----------------|
| 3 Good Health | Life expectancy, maternal mortality, disease burden, mental health |
| 1 No Poverty | Poverty rate, food insecurity, homelessness, wealth gap |
| 2 Zero Hunger | Food insecurity, food desert access, child nutrition |
| 6 Clean Water | Safe water access, PFAS, nitrate, wastewater compliance |
| 9 Innovation | Infrastructure index, broadband, R&D as % of GDP, patent grants per capita, technology transfer rate, high-growth firm rate |
| 8 Decent Work | Unemployment, wage growth, labor participation, gig protections |
| 10 Inequalities | Gini, racial wealth gap, intergenerational mobility, disability employment |
| 13 Climate | GHG per capita, methane compliance, carbon sequestration |
| 14 Below Water | Wastewater compliance, ocean dead zones, coastal water quality |
| 15 On Land | Biodiversity, forest cover, wetland loss, soil health |
| 11 Cities | Housing burden, transit access, urban heat island, air quality |
| 12 Consumption | TRI releases, Superfund rate, recycling/diversion rate, right-to-repair |
| 7 Energy | Renewable % of grid, energy affordability, clean energy jobs |
| 4 Education | Graduation rates, PISA, literacy, school funding equity |
| 16 Justice | Rule of Law, corruption, violence, judicial independence |
| 17 Partnerships | Treaty compliance, multilateral participation |
| 5 Gender | Gender pay gap, maternal mortality, political representation |

---

### View C — Design Principles Scorecard

Ten design principles (J. Mayerhofer, 2024) as an analytical lens for evaluating how well a jurisdiction's rules align with principles of enduring prosperity:

| # | Principle | What we measure |
|---|-----------|----------------|
| 1 | **Matter** | SDG attainment score; rule coverage of highest-priority SDGs |
| 2 | **Circular Economies** | Recycling/landfill diversion rate; right-to-repair law coverage; extended producer responsibility laws; composting rate; material recovery rate |
| 3 | **Healthy Materials** | PFAS regulations; toxic chemical bans vs. EU REACH; lead exposure rates; pesticide residue exceedance; safe cosmetics law coverage; TRI releases |
| 4 | **Renewable Energy** | Renewable % of grid; clean energy jobs per capita; energy affordability index; rooftop solar installation rate; RPS (Renewable Portfolio Standard) ambition |
| 5 | **Climate Health** | GHG per capita; methane leak detection compliance; industrial emissions compliance; sequestration investment; climate legislation coverage |
| 6 | **Human Capital** | Labor protections index; wage theft enforcement rate; union density; paid leave coverage; workplace safety violations per 100k workers |
| 7 | **Accessible** | Disability employment rate; broadband access; transit access; language access compliance; ADA compliance rate |
| 8 | **Equitable Allocation** | Hidden cost index (externalized costs per sector); Gini; racial wealth gap; Superfund site proximity by income; environmental justice index |
| 9 | **Nature's Design** | Biodiversity index; ecosystem services valuation; decentralized energy %; resilience index; watershed health |
| 10 | **Measurable Results** | Government open data score; FOIA response rate; budget transparency index; evidence-based policy adoption rate |


---

### View D — Capital Impact Lens

Every rule and KPI can be filtered by which type of capital it affects (beyond purely financial):

| Capital Type | Definition | Example KPIs |
|-------------|-----------|-------------|
| **Financial** | Money, assets, investment | GDP, income inequality, debt burden |
| **Manufactured** | Infrastructure, technology, buildings | Infrastructure index, broadband, housing stock |
| **Human** | Health, skills, knowledge, wellbeing | Life expectancy, education attainment, happiness |
| **Social** | Trust, community, institutions, norms | Social trust, civic participation, corruption index |
| **Natural** | Ecosystems, air, water, soil, biodiversity | Air quality, water quality, biodiversity, soil health |

This lens answers: "When this rule was designed, which forms of capital did it optimize for — and which did it ignore or externalize costs onto?"

---

## Budget Taxonomy Crosswalk

*(Resolves prd.md OQ-5; supports FR-14 and FR-17. It belongs here in the domain model — it is citable methodology, like the KPI catalog.)*

Every jurisdiction structures its budget differently (federal budget functions ≠ state ACFR functions ≠ a German ministry structure). Apples-to-apples comparison requires a **canonical functional taxonomy** that every native budget maps onto — while the native structure is preserved for the drill-down cascade.

**Canonical spine: COFOG** (the UN *Classification of the Functions of Government*), the international standard already used by the OECD, IMF GFS, and Eurostat. Ten top-level divisions (01 General public services, 02 Defence, 03 Public order & safety, 04 Economic affairs, 05 Environmental protection, 06 Housing & community amenities, 07 Health, 08 Recreation/culture/religion, 09 Education, 10 Social protection), each with standard groups and classes. Choosing COFOG means international comparisons come almost free — OECD nations already publish COFOG-classified spending.

**Design:**
1. **Two representations per budget line, always.** The native line (as published, feeding the cascade view exactly as the government presents it) and its COFOG mapping (feeding Compare, values inference, and budget→SDG/KPI linkage).
2. **Many-to-many with weights.** A native line may split across COFOG classes (a "Parks & Recreation Dept" line might map 80% to 08.1, 20% to 05.4). Weights sum to 1 per native line.
3. **Leverage existing crosswalks before inventing any.** US federal: OMB budget functions (~20 superfunctions) have published near-mappings to COFOG. US state/local: the Census of Governments *Annual Survey of State & Local Government Finances* already imposes standardized function codes on every state and local government — crosswalk those codes to COFOG once, and the entire US sub-national layer inherits it. International: OECD/Eurostat data arrives COFOG-native.
4. **LLM-assisted mapping for the long tail, human-reviewed.** Local budget documents with idiosyncratic line names are classified by the Analysis Engine with a confidence score; low-confidence mappings queue for review; all mappings are versioned artifacts with provenance (same discipline as vulnerability findings).
5. **Comparison happens only in COFOG space.** The UI never compares native lines across jurisdictions; it compares COFOG aggregates and lets the user drill into each side's native cascade.

The same mapping table carries the **values-inference tags** (Core/Supporting/Generic per J8, capital types, SDG links) — tag COFOG classes once, and every mapped budget inherits the tags.

---

## Peer Grouping Methodology

*(Resolves prd.md OQ-6; supports FR-17.)*

Fair comparison requires comparing a jurisdiction to jurisdictions *like it*. "Like it" is defined structurally, not politically.

**Hard constraints (never violated):**
- Same jurisdiction type (state↔state, county↔county, city↔city, nation↔nation).
- Same-country peers by default at sub-national levels (cross-country sub-national comparison only with explicit user opt-in, PPP-adjusted).

**Similarity covariates (z-scored within type):** population; median household income (or GDP per capita for nations); urbanization % / population density; age structure (median age, % over 65); regional cluster; for counties/cities, economic base mix (share of employment by major sector). Deliberately excluded from matching: political lean, race/ethnicity composition as a *matching* variable (it is reported as context, but matching on it would bake in segregation as "fair comparison" — a methodological choice that must be documented and defensible).

**Method:** k-nearest neighbors (default k = 10) in covariate space → a jurisdiction's **structural peer set**, displayed with a similarity score and the covariate table so the user can see *why* these are peers. Precedents to cite for legitimacy: RWJF County Health Rankings' peer-county methodology and the Census Bureau's comparable-cities work.

**Three peer modes in the product:**
1. **Structural peers** (default) — the kNN set above.
2. **Named cohorts** — fixed, explainable bands (e.g., "states 5–10M population," "OECD top 20") for shareable leaderboards where a stable roster matters more than optimal matching.
3. **Aspirational peers** — user-chosen comparisons (Mississippi vs. Massachusetts is legitimate — as an aspiration, labeled as such, with the covariate gap shown).

**Confounder honesty:** rankings are always *within* peer set; every comparison view shows the covariate context; outlier detection (the Compare feature's core promise) is computed against the structural peer set only. No regression-adjusted "controls for X" claims in v1 — showing raw peer-relative position with covariates visible is defensible; a half-built adjustment model is not.

---

## KPI→Rule Attribution Confidence Model

*(Resolves prd.md OQ-7; governs FR-13 and NFR-03. This is the platform's most sensitive methodological surface — it is where over-claiming would destroy credibility.)*

**The ceiling is structural: the platform never asserts causation.** The confidence scale is deliberately capped below "proven cause." What it grades is the *strength of association and mechanism evidence* behind a hypothesis.

### Evidence signals

Adapted from the Bradford Hill considerations (epidemiology's standard for arguing causality from observational data) and GRADE-style evidence leveling — both citable, both designed for exactly this problem: disciplined causal reasoning without experiments.

| Signal | Definition | How the platform detects it |
|--------|-----------|----------------------------|
| **S1 Temporality** | Rule change *precedes* KPI inflection | Event-study over the event-sourced corpus: rule events are timestamps; KPI series are tested for level/trend breaks after the event (the event-sourced store makes this queryable by construction) |
| **S2 Cross-jurisdiction consistency** | The same rule feature associates with the same outcome direction across many jurisdictions | Correlate rule presence/strength with the KPI across the structural peer sets (see Peer Grouping) |
| **S3 Dose-response** | Stronger versions of the rule associate with larger outcome differences | Rule-strength scoring (from test-block rubrics) vs. KPI level across jurisdictions |
| **S4 Mechanism plausibility** | A concrete causal pathway can be articulated and each link checked | Analysis Engine drafts the mechanism chain (rule → behavior → intermediate indicator → KPI); intermediate indicators checked where data exists |
| **S5 Comparator contrast** | Peer jurisdictions *without* the rule change show no contemporaneous inflection | Difference-in-differences-shaped check against the peer set (labeled as quasi-experimental evidence, not proof) |
| **S6 Literature corroboration** | Published research supports the link | Citation to external studies, surfaced with the finding |
| **Contrary evidence** | Any signal pointing the other way | Always displayed; never netted out silently |

### Confidence bands

| Band | Requires | Display language (enforced by template) |
|------|----------|------------------------------------------|
| **C0 — Structural Gap** | No governing rule exists for a domain with a measured shortfall | "No rule governs X; the KPI shortfall is unattributed but the *absence* is a fact." *(Highest confidence — it makes no causal claim at all.)* |
| **C1 — Observed association** | Correlation only (S2 alone, or a single signal) | "Jurisdictions with X tend to have Y. This is a correlation; mechanisms unverified." |
| **C2 — Supported hypothesis** | ≥2 independent signals, including S1 or S2, no strong contrary evidence | "Evidence is consistent with X contributing to Y: [signals listed]." |
| **C3 — Strong association** | S1 + S2 + S4, plus S5 or S6, contrary evidence addressed | "Multiple independent lines of evidence link X to Y. Causation is not established, but the association is robust: [signals listed]." |
| *(no C4)* | — | The scale ends here by design. "Proven cause" is not a state this system can emit. |

### Presentation rules

- Every attribution displays: band, the signal checklist (present / absent / contrary), known confounders, and data vintage.
- Bands map to **fixed language templates** — the LLM fills in specifics but cannot escalate the rhetoric beyond the band (schema-enforced, tested in the eval harness).
- **Union findings** (outcome failure + rule vulnerability co-presented without an attribution claim) are the default presentation when confidence is below C2.
- The model is published on the methodology page (NFR-11); every finding links to it. When in doubt, the system downgrades a band — the asymmetry is deliberate (an under-claimed true finding costs little; one over-claimed finding costs the platform its credibility).
