# Current Affairs Architecture & Source Registry

**Last updated:** 23 September 2026  
**Status:** Phase 1 — architecture, domains, fact schema, source registry and verification rules defined. Implementation has **not** started.

## 1. Purpose

The V1 **Current Affairs** category is a structured knowledge system, not a live-news headline quiz.

It must cover current civic/general knowledge across Nigeria, Africa and the wider world, including government, institutions, geography, economy, international organizations, sports, science and technology.

A separate future product, **News Quiz / Current Events**, may use NewsData.io or another news provider for actual recent-news questions. That system must remain isolated from the V1 Current Affairs knowledge system.

## 2. Isolation boundary: Current Affairs vs News Quiz

### V1 Current Affairs

```text
Trusted / official factual sources
        ↓
Current Affairs Knowledge Base
        ↓
Fact verification + validity dates
        ↓
Current Affairs Question Generator
        ↓
Question Quality Validator
        ↓
Existing Question Engine
        ↓
10-question quiz
```

### Future News Quiz / Current Events

```text
NewsData.io (or future news provider)
        ↓
News Article / Event ingestion
        ↓
News-specific filtering
        ↓
News Quiz Question Generator
        ↓
News Quiz validation
        ↓
Future News Quiz experience
```

### Hard isolation rules

1. Existing NewsData code must **not** be used as the provider for the V1 Current Affairs knowledge system.
2. NewsData helper functions should eventually live behind an explicitly news-specific provider/module boundary, using names such as `news_quiz`, `current_events`, `newsProvider`, or equivalent.
3. V1 Current Affairs must have its own provider/source registry, fact model, generator and validation path.
4. A change to NewsData parsing, article filtering or news-question templates must not change Current Affairs fact generation.
5. A change to Current Affairs fact schemas or generators must not change NewsData behavior.
6. Shared code is allowed only for genuinely generic utilities such as JSON/CORS helpers, HTTP timeout handling, safe shuffling and common question validation. Provider-specific logic must not be shared.
7. The category router must explicitly distinguish `current_affairs` → Current Affairs knowledge engine and future `news_quiz` / `current_events` → NewsData/news-provider engine.
8. NewsData credentials must remain scoped to the future news provider and must never become a dependency of the Current Affairs knowledge path.

### Planned Worker structure

```text
worker/
├── index.js                    # routing only / compatibility layer
├── current-affairs/
│   ├── sources.js              # source registry
│   ├── facts.js                # fact retrieval/normalization
│   ├── generator.js            # question generation
│   ├── validator.js            # quality checks
│   └── index.js                # Current Affairs service
└── news-quiz/
    ├── provider.js             # NewsData/future news provider
    ├── generator.js            # news-specific questions
    ├── validator.js
    └── index.js                # future News Quiz service
```

This is the target organization. Do not perform the refactor until the current V1 category work is ready for it; the first implementation step should be additive and carefully tested.

## 3. Current Affairs domains

### 3.1 Nigeria
- Federal Government
- National Assembly
- Judiciary
- current political leadership and public officeholders
- governors and state structure
- ministries/agencies
- political parties and electoral facts
- 36 states + FCT
- geopolitical zones
- Nigerian geography
- cities, rivers, lakes, mountains and borders
- history and important dates
- Constitution and democratic institutions
- economy and national institutions
- national symbols
- important current appointments

### 3.2 Africa
- countries, capitals and regions
- geography
- rivers, lakes and mountains
- African Union
- ECOWAS and other regional institutions
- African leaders and institutions
- history
- economies and currencies
- important current institutional/development facts

### 3.3 World
- countries and capitals
- continents, oceans and geography
- major public leaders where appropriate
- international institutions
- economies and currencies
- international organizations
- current international facts

### 3.4 International Organizations
Examples include:
- United Nations
- African Union
- ECOWAS
- World Bank
- IMF
- WHO
- UNESCO
- UNICEF
- WTO
- NATO
- Commonwealth
- OPEC

Question targets include leadership, headquarters, purpose, membership, founding, functions and other verified institutional facts.

### 3.5 Economy & Business
- currencies
- central banks
- inflation and economic concepts
- major economic institutions
- GDP/general economic facts
- Nigerian economic institutions
- international financial organizations
- commodities and trade organizations

Dynamic numeric indicators must carry a year/dataset vintage.

### 3.6 Geography
- countries
- capitals
- continents
- oceans and seas
- rivers and lakes
- mountains and deserts
- borders
- regions
- population/geographic facts
- Nigerian, African and world geography

### 3.7 Sports
- major competitions
- countries and teams
- championships
- Olympics
- football
- athletics
- basketball
- sports organizations
- important current records/holders where the record is explicitly sourced and dated

### 3.8 Science & Technology
- inventions
- space
- technology
- AI
- scientific institutions
- discoveries
- current technological developments

## 4. Fact-first architecture

Current Affairs stores **facts**, not only prewritten questions.

Example:

```json
{
  "id": "ng-federal-president",
  "domain": "nigeria",
  "topic": "government",
  "entity": "President of Nigeria",
  "attribute": "currentHolder",
  "value": "...",
  "validFrom": "...",
  "validTo": null,
  "lastVerified": "...",
  "source": "official-source-name",
  "sourceUrl": "https://...",
  "status": "active"
}
```

Recommended fields:

| Field | Purpose |
|---|---|
| `id` | Stable fact identifier |
| `domain` | Nigeria/Africa/World/etc. |
| `topic` | Government/geography/economy/etc. |
| `entity` | Thing/person/institution being described |
| `attribute` | Property being tested |
| `value` | Verified value |
| `validFrom` | Start of validity |
| `validTo` | End when known |
| `lastVerified` | Last verification timestamp/date |
| `source` | Human-readable source name |
| `sourceUrl` | Direct source |
| `status` | active/superseded/review/invalid |
| `notes` | Optional context/qualification |

For changing facts, update or supersede the **fact record**, rather than manually editing hundreds of questions.

## 5. Source registry — Phase 1

### Tier 1: official/primary sources

| Domain | Source | Intended use | Status |
|---|---|---|---|
| Nigeria | Federal Government / official government portals | federal structure, public offices, government facts | approved candidate |
| Nigeria | INEC | states, FCT, LGAs, electoral/geographic facts | approved |
| Nigeria | National Assembly official sources | Senate/House leadership and institutional facts | research next |
| Nigeria | Presidency / State House | Presidency, appointments and executive facts | research next |
| Nigeria | CBN | monetary/economic facts and current institutional leadership | research next |
| Africa | African Union | member states, regions, institutions | approved |
| Africa | ECOWAS | regional membership and institutional facts | approved with freshness checks |
| World | United Nations | member states, international institutions | approved |
| Economy | World Bank Open Data | country/economic/development indicators | approved with year/vintage |
| Economy | IMF WEO/data | macroeconomic indicators and projections | approved with dataset vintage |
| International | WHO / UNESCO / UNICEF / WTO / OPEC / NATO / Commonwealth official sources | organization-specific facts | research/verify before ingestion |

### Verified Phase 1 sources

**INEC:** its official State Offices directory identifies 36 states + FCT (37 offices), 774 LGA offices, capitals and geopolitical-zone groupings. citeturn0search0

**African Union:** the official AU member-state page lists 55 member states. Membership/status questions must account for the AU's own suspension notes and current page wording rather than copying stale secondary summaries. citeturn0search1

**ECOWAS:** the official ECOWAS member-state page provides its membership information; because regional membership can change, production facts must be verified against the current official page during updates. citeturn0search2

## 6. Source priority

When multiple sources cover the same fact:

1. Constitutional/statutory or official government source.
2. Official institution/organization source.
3. High-quality primary dataset from an intergovernmental institution.
4. Reputable secondary reference only when a primary source is unavailable.
5. General web pages only as discovery aids, not as the final authority for time-sensitive facts.

For political officeholders and institutional leadership, use the institution's official source wherever possible. Questions must remain factual and non-persuasive.

## 7. Verification and update rules

### Time-sensitive facts
Examples:
- officeholders
- political party leadership
- appointments
- institutional leadership
- current records
- membership/status changes
- economic indicators
- current technological developments

Rules:
- store `lastVerified`
- store `validFrom` and `validTo` where applicable
- store source and source URL
- reverify on a defined schedule
- immediately supersede a fact when an authoritative change is confirmed

### Stable facts
Examples:
- capitals
- continent membership
- founding dates
- physical geography
- constitutional structures that have not changed

These still require source attribution and periodic review, but they do not need the same update frequency as officeholders.

### Dynamic numeric facts
Every population, GDP, inflation, ranking, count or projection must include:
- reference year/period
- dataset/provider
- dataset vintage where applicable

Never present a dated statistic as an undated permanent fact.

## 8. Question-generation system

The generator should derive multiple question forms from a verified fact instead of repeatedly asking one template.

Supported forms:

1. Direct recall
2. Reverse question
3. Identification
4. Classification
5. Relationship
6. Number/count
7. Chronology/date
8. Matching
9. Scenario/application
10. Odd-one-out
11. Institution/function
12. Multi-fact reasoning/comparison

Example fact:

```json
{
  "country": "Nigeria",
  "capital": "Abuja",
  "continent": "Africa",
  "region": "West Africa",
  "currency": "Naira"
}
```

Possible generated targets:
- capital of Nigeria
- country whose capital is Abuja
- region containing Nigeria
- country using the naira
- relationship between Nigeria, Africa and West Africa

The generator must not expose the source fact as a clue that gives away the answer.

## 9. Difficulty model

**Easy**
- direct recognition
- common institutions
- simple geography
- common factual relationships

**Medium**
- reverse questions
- related entities
- classification
- plausible/similar distractors
- cross-attribute relationships

**Hard**
- multi-fact reasoning
- comparisons
- chronology
- institutional distinctions
- carefully constructed near-miss distractors

Difficulty must reflect reasoning demand, not obscure trivia alone.

## 10. Quality validator

Before a question enters the production question pool:

- source fact is verified
- answer is uniquely correct
- all distractors are plausible but wrong
- wording is unambiguous
- political questions are neutral and factual
- dates/years are explicit where needed
- dynamic facts include their time context
- exactly four options for standard MCQ
- explanation/source metadata is retained where applicable
- duplicate question IDs are rejected
- semantic duplicates are rejected where practical
- stale/superseded facts cannot generate active questions

## 11. Question identity and anti-repetition

Question IDs must be stable and unique.

A generated question should retain:
- fact ID(s)
- template/type
- source
- generation version

Conceptual ID: `ca:<fact-id>:<template>:<generation-version>`

This allows the existing `recent_history` system to prevent repeats while still allowing a changed fact to produce a new valid question version.

## 12. Implementation phases

### Phase 1 — architecture and registry
**Current phase**
- source registry
- domain model
- fact schema
- verification/update rules
- isolation boundary

### Phase 2 — knowledge ingestion
- build initial verified fact datasets
- normalize sources
- record provenance
- create update/supersession logic

### Phase 3 — question generation
- templates
- distractor generation
- difficulty assignment
- question IDs

### Phase 4 — validation
- answer uniqueness
- semantic duplication checks
- stale-fact checks
- source/provenance checks

### Phase 5 — Worker integration
- add `current_affairs` route to the new service
- preserve existing category routes
- keep NewsData behind future news-specific route

### Phase 6 — phone/debug testing
- Worker endpoint tests
- category tests
- Easy/Medium/Hard
- repetition tests
- offline/error-state tests

### Phase 7 — production stabilization
- signed release
- update validation
- monitor source freshness and errors

## 13. Non-goals for Phase 1

Do not:
- redesign the current V1 UI
- modify AdMob
- rewrite Science
- rewrite General Knowledge
- rewrite Africa & Nigeria
- implement Google Play Billing
- build the future native Bible UI
- make NewsData the Current Affairs provider
- add paid APIs merely for convenience

## 14. Definition of done for Phase 1

Phase 1 is complete when:
- the source registry is documented
- all eight domains are defined
- the fact schema is fixed enough for ingestion
- verification/update rules are documented
- Current Affairs and News Quiz are explicitly isolated
- the three project documents reflect the same decision
- no production category behavior has been changed merely by documentation work

## 15. Next concrete implementation step

After this documentation checkpoint, the next work should be **Phase 2: build the initial Current Affairs knowledge base**, starting with a small verified Nigeria/Africa/world dataset.

Only after that dataset is validated should we implement the generator and connect `current_affairs` to the Worker.


## 16. Phase 2 checkpoint — initial verified knowledge base

Updated: 23 September 2026

Phase 2 ingestion has now begun and the first verified seed is stored at:
worker/current-affairs/data/phase2-initial-facts.js

The seed currently covers:
- Nigeria federal structure and current federal leadership.
- All 36 Nigerian states, capitals and geopolitical zones.
- FCT/Abuja and the 774-LGA administrative fact.
- African Union and ECOWAS institutional facts.
- United Nations and WHO institutional facts.
- Nigerian economic institutions including the CBN and OPEC membership.
- IMF and WTO institutional/economic facts.
- Initial durable Olympic/sports facts plus a dated Dakar 2026 fact.

### Phase 2 data rules

Facts remain the source of truth. Questions are not being hand-written or generated yet.

The dataset supports provenance and freshness through:
- stable fact IDs
- domain/topic/entity/attribute/value
- validFrom / future validTo
- lastVerified
- source IDs
- active/superseded status

Dynamic statistics must add a reference period and dataset vintage before production use.

### Commercial-aware content metadata

The knowledge model is intentionally compatible with future monetization. A future optional field such as accessTier may classify content as free, premium, special_pack, or another entitlement without changing the fact model. No premium enforcement is implemented in Phase 2.

### Verification caution

Current officeholders, institutional leaders, membership counts and other changing facts are not permanent facts. They must be re-verified before a production refresh and superseded when an authoritative source changes.

### Phase 2 remaining work

1. Expand the verified dataset across all eight domains.
2. Add more geography, institutional, economy, sports and science/technology facts.
3. Add stronger source-registry coverage for remaining institutions.
4. Add explicit update/supersession handling.
5. Review the schema and future access-tier metadata.
6. Validate the complete Phase 2 dataset.
7. Only then begin Phase 3 question generation.

Current status: Phase 2 — IN PROGRESS.


## Phase 2 continuation checkpoint — 23 September 2026

The knowledge seed has been deepened with additional Nigeria legislative/institutional facts, CBN functions, AU history/membership relationships, and World Bank/IMF/WTO institutional distinctions. A future-only access-tier metadata contract is also documented in the data layer; entitlement enforcement remains disabled.

The next Phase 2 work remains systematic expansion across geography, economy, sports, and science/technology, followed by schema validation and supersession/update handling.

## Phase 2 systematic expansion checkpoint — 23 September 2026

The verified knowledge base has now been expanded across the remaining planned content areas before any Question Bank work begins. The expansion pass adds:

- Nigeria: additional geography, international boundaries, Gulf of Guinea/Niger Delta context, economic institutions and core economic concepts.
- Africa: additional physical geography, major regional institutions, AU/ECOWAS context, Sahara, Nile, Equator, Kilimanjaro and Great Rift Valley facts.
- World geography: continents, oceans and basic Earth geography relationships.
- Economy: inflation, GDP, central-bank policy concepts plus additional Nigeria/World Bank economic context.
- International organizations: additional UN, WHO, UNICEF, UNESCO and ITU facts, with source-registry coverage expanded.
- Sports: 2026 FIFA World Cup structure/hosts and World Athletics coverage in addition to Olympic facts.
- Science & technology: ISS, Artemis II and international ICT/ITU facts.

The expansion remains fact-first. No question generator, Question Bank, or production Current Affairs quiz route has been introduced yet.

### Source rule

The new records use an expanded source registry. Primary institutional sources remain preferred for current/institutional facts; trusted reference material is used for durable geography where an official institutional dataset is not the appropriate source.

### Next step

Finish the Phase 2 audit: verify dataset completeness, source IDs, schema consistency, freshness/update handling and supersession rules. Only after that audit should Phase 3 question generation begin. Question Bank design remains deliberately deferred until the expansion/audit is complete.

## Phase 2 audit checkpoint — 23 September 2026

The Phase 2 audit found that the earlier expansion pass was not yet complete: Sports and Science & Technology coverage had not been fully inserted into the fact array, and one ECOWAS source ID needed normalization. These issues were corrected in the knowledge-base file. The current audit confirms a fact-first dataset with complete required fields for the active records, no duplicate fact IDs, and source references normalized to the source registry. Phase 2 remains in final validation rather than being declared production-complete until the full source/freshness/content-coverage review is finished.

## Final Phase 2 audit — 23 September 2026

Final structural audit completed after the expansion corrections. The Current Affairs fact dataset now contains 86 active records across all seven implemented expansion areas represented in the Phase 2 scope: Nigeria (48), Africa (9), Economy (9), Sports (6), World (5), International Organizations (3), and Science & Technology (6). Every fact contains the required core fields, no duplicate fact IDs were found, every referenced source ID resolves to the source registry, the JavaScript array/export structure is intact, and no future-dated verification metadata was detected. Current officeholder/institutional and dated-event facts remain subject to freshness review before serving. Phase 2 content expansion is therefore complete and the dataset is ready to move to the next controlled stage: Phase 3 question-generation design/implementation. The Question Bank remains a later stage and is not being mixed into this audit.

## NewsData isolation completed — 24 September 2026

The NewsData integration has now been removed from the V1 `current_affairs` execution path.

### Separation implemented

- `worker/index.js` no longer contains the NewsData provider URL or NewsData article-fetching/generation implementation.
- `current_affairs` no longer calls NewsData.
- The V1 `current_affairs` route is intentionally disconnected while the fact-first Phase 3 question system is being built.
- A separate `news_quiz` route now owns the future live-news path.
- NewsData-specific modules are isolated under:
  - `worker/news-quiz/provider.js`
  - `worker/news-quiz/validator.js`
  - `worker/news-quiz/generator.js`
  - `worker/news-quiz/index.js`
- The NewsData API secret remains a Worker secret because it belongs to the future News Quiz product; it is no longer part of Current Affairs logic.

This is a deliberate temporary state: **Current Affairs is fact-first and News Quiz is live-news-first.** The existing V1 app should not be treated as having a finished Current Affairs provider until Phase 3 is implemented and tested.

### Isolation boundary

```text
V1 Current Affairs
    ↓
Verified Current Affairs Facts
    ↓
Phase 3 Question System
    ↓
Current Affairs Quiz

Separate future product:

NewsData.io
    ↓
worker/news-quiz/*
    ↓
Future News Quiz / Current Events
```

No provider-specific NewsData parsing, article validation, or question generation is shared with the Current Affairs system.

## Phase 3 — Question-generation architecture and plan

Phase 3 begins only after the Phase 2 fact dataset and the NewsData isolation are complete.

### Core architecture

```text
VERIFIED FACTS
      ↓
FACT RELATIONSHIP MAP
      ↓
QUESTION BLUEPRINTS
      ↓
Question Generator + Distractor Generator
      ↓
QUALITY VALIDATOR
      ↓
Validated Question Pool
      ↓
QUIZ ASSEMBLER
      ↓
Existing Quiz Engine
```

### Core identity model

The system will treat questions as relationships, not merely strings:

```text
FACT
  ↓
CONCEPT
  ↓
QUESTION FAMILY
  ↓
QUESTION VARIANTS
```

For example, the fact that Nigeria's capital is Abuja can produce direct and reverse variants, but both belong to the same `questionFamilyId`. A single 10-question quiz must never contain two variants from the same family. User history should also support a longer family/relationship cooldown where practical.

**Important rule:** different wording does not automatically mean a different question.

### Planned question types

The generator may support:

- Direct recall
- Reverse
- Identification
- Classification
- Relationship
- Institution/function
- Comparison
- Number/count
- Chronology/date
- Matching
- Scenario/application
- Odd-one-out
- Multi-fact reasoning

Question-type variety is useful, but **quality takes priority over forced variety**.

### Difficulty model

- **Easy:** direct recognition, common institutions, simple geography and straightforward facts.
- **Medium:** relationships, reverse questions, classification and distinctions between similar facts.
- **Hard:** multi-fact reasoning, comparisons, chronology, institutional distinctions and carefully constructed distractors.

Difficulty must describe the actual reasoning required rather than being assigned merely to make a 3/4/3 quiz mix.

### Question provenance model

Generated questions should retain enough metadata to trace them back to verified facts:

```json
{
  "questionId": "...",
  "factIds": ["ng-federal-structure"],
  "conceptId": "nigeria-federal-structure",
  "questionFamilyId": "nigeria-federal-units",
  "variantType": "direct",
  "difficulty": "easy",
  "question": "How many states does Nigeria have?",
  "options": ["36", "30", "37", "40"],
  "correctAnswer": "36",
  "status": "active",
  "lastValidated": "2026-09-23"
}
```

Future access metadata may also support `FREE`, `PREMIUM` and `SPECIAL_PACK`, but entitlement enforcement remains outside Phase 3.

### Distractor generation

Distractors must be:

- Plausible
- Semantically related
- Factually incorrect
- Unambiguous
- Appropriate to the domain
- Appropriate to the difficulty

The system must avoid obviously silly distractors and distractors that could also be technically correct.

### Question lifecycle

```text
generated
   ↓
validated
   ↓
active
   ↓
used / revalidated
   ↓
superseded or retired
```

If a source fact changes, dependent questions must be identifiable and eligible for revalidation or supersession.

### Quality validation

Every generated question should pass checks for:

- Factual correctness
- Answer uniqueness
- Distractor validity
- Language clarity
- Difficulty suitability
- Exact/semantic duplication
- Question-family duplication
- Fact freshness
- Source validity
- Option integrity

Rejected-question reasons should be explicit, such as:

- duplicate
- semantic duplicate
- family duplicate
- ambiguous
- bad distractor
- unsupported fact
- stale fact
- grammar problem
- poor difficulty
- insufficient information

### Quiz-level assembly rules

The future assembler should enforce:

- No duplicate question IDs
- No duplicate question families
- No excessive concentration on one topic
- Reasonable difficulty distribution
- Reasonable question-type diversity
- No stale facts
- User recent-history avoidance

The system should prefer quality and availability over mechanically forcing ten different question types.

### Question Bank boundary

The Question Bank remains separate from user history:

```text
FACT DATABASE
      ↓
QUESTION SYSTEM
      ↓
QUESTION BANK
      ↓
QUIZ
      ↓
USER HISTORY
```

The Question Bank stores questions the system owns. User history records what a particular user has already seen.

The bank must never become a bottleneck. If eligible bank questions are insufficient, the system should generate and validate additional questions and then serve them.

### Phase 3 stages

**Phase 3A — Question data model & concept/family model**  
Define question records, provenance, concepts, question families, variants, lifecycle status and future access metadata.

**Phase 3B — Question blueprint/template system**  
Define safe generation patterns for the supported question types and domains.

**Phase 3C — Question generator**  
Generate questions from verified facts and relationships.

**Phase 3D — Distractor generator**  
Construct plausible, factually incorrect, unambiguous options.

**Phase 3E — Quality validator**  
Reject questions that fail factual, linguistic, structural, difficulty or freshness checks.

**Phase 3F — Duplicate/family detection**  
Detect exact duplicates, semantic duplicates and related question families before quiz assembly.

**Phase 3G — Quiz assembler**  
Build valid 10-question quizzes while respecting family, topic, difficulty, freshness and user-history rules.

**Phase 3H — Worker integration**  
Connect the validated Current Affairs question system to the existing Worker without disturbing Science, General Knowledge, Africa & Nigeria or AdMob.

**Phase 3I — Android/debug testing**  
Test Current Affairs end-to-end on the Debug APK, including repeated quizzes, family cooldown behaviour, connectivity failures, stale-fact handling and regression of existing categories.

### Phase 3 implementation safety rule

Do not replace the verified fact database with generated questions. Facts remain the source of truth. Do not mix Question Bank storage with user recent history. Do not reintroduce NewsData into the Current Affairs route.



## Phase 3A implementation checkpoint — 24 September 2026

Phase 3A has now been implemented as a **data-contract layer only**. No question generation, distractor generation, quiz assembly or production Current Affairs integration has been started.

New file:
`worker/current-affairs/data/phase3a-question-model.js`

The model defines:

- Supported question variant types.
- Easy/Medium/Hard difficulty values.
- Question lifecycle statuses.
- Explicit rejection reasons.
- Future access-tier metadata (`FREE`, `PREMIUM`, `SPECIAL_PACK`) without entitlement enforcement.
- Concept records that connect knowledge relationships to verified fact IDs.
- Question-family records that group substantially equivalent variants.
- Canonical Question Bank question records with fact provenance.
- Structural question validation.
- A question-family selection key for later quiz assembly.

### Important anti-repetition rule

A question's wording is not its complete identity.

```text
Fact
 ↓
Concept
 ↓
Question Family
 ↓
Question Variant
```

For example, direct and reverse questions about Nigeria's capital share the same family and therefore cannot both be selected into one 10-question quiz.

Phase 3A deliberately does **not** perform semantic similarity detection yet. That belongs to Phase 3F. It also does not decide whether a question is factually correct; that belongs to the later validation stages.

### Phase 3A safety boundary

The verified Phase 2 fact database remains the source of truth. The new model references facts by `factIds`; it does not copy or replace the fact database.

The Question Bank remains conceptually separate from `recent_history` user history.

**Phase 3A status: implementation complete.**

Next: review/validate the Phase 3A model, then proceed to Phase 3B — the question blueprint/template system.


## Phase 3B implementation checkpoint — 24 September 2026

Phase 3B has now been implemented as the **Question Blueprint / Template System**. The blueprint layer defines controlled, reusable construction patterns between the verified fact/concept model and the future question generator.

New file:
`worker/current-affairs/data/phase3b-question-blueprints.js`

The blueprint registry currently defines 12 supported construction patterns:
- Direct attribute
- Reverse attribute
- Identification
- Classification
- Relationship
- Institution/function
- Comparison
- Number/count
- Chronology/date
- Matching
- Scenario/application
- Odd-one-out
- Multi-fact reasoning

Each blueprint records its supported input shape, answer role, difficulty range, distractor strategy, family identity guidance, prompt intent and safety constraints. The blueprint layer therefore controls **how** questions may be constructed without generating the questions itself.

### Phase 3B safety boundary

Phase 3B does **not**:
- generate question wording
- generate distractors
- decide factual correctness
- perform semantic similarity detection
- assemble quizzes
- connect Current Affairs to the production Worker
- enforce Premium/FREE entitlements

The verified Phase 2 fact database remains the source of truth, while Phase 3A remains the canonical question/family data contract.

### Important generation rule

A blueprint may only use relationships supported by the verified fact model. It must not invent facts merely to make a question harder. Dynamic numeric facts require their reference period/dataset context, and scenario/multi-fact questions must derive their conclusions from supplied verified facts.

**Phase 3B status: implementation complete.**

Next: Phase 3C — Question Generator.


## Phase 3C implementation checkpoint — 24 September 2026

Phase 3C — **Question Generator** is now implemented as a deterministic, fact-first draft generator in:

`worker/current-affairs/data/phase3c-question-generator.js`

### Generator responsibilities

The generator converts verified Phase 2 facts and approved Phase 3B blueprints into structured **question drafts**. Each draft carries:
- verified `factIds` and `sourceIds`
- stable `conceptId` and `questionFamilyId`
- blueprint and variant type
- difficulty
- domain/topic
- question text
- correct answer
- temporal context where relevant
- generator version
- future access-tier metadata

### Efficiency and safety controls

- Deterministic generation; no external API dependency.
- Bounded batch generation through `maxDrafts`.
- Blueprint/difficulty compatibility checks before generation.
- Required fact-shape checks prevent incomplete facts from entering generation.
- Direct/reverse/identification variants share the same underlying entity/attribute family identity.
- Generic facts are not treated as classifications unless an explicit classification field such as `region` is present.
- Batch-level fingerprinting prevents the generator itself from emitting the same question/answer/family combination more than once.
- Relationship, comparison, matching, scenario, odd-one-out and multi-fact forms require explicit context rather than inventing relationships from unrelated facts.
- No distractors are generated in Phase 3C; `options` remains null until Phase 3D.

### Deliberate boundary

Phase 3C does **not** perform final factual validation, semantic duplicate detection, distractor generation, quiz assembly or Worker integration. A generated draft is not automatically trusted or activated.

**Phase 3C status: implementation complete.**

Next: **Phase 3D — Distractor Generator**, followed by the quality validation and duplicate/family stages.


## Phase 3D implementation checkpoint — 24 September 2026

Phase 3D — **Distractor Generator** is now implemented in `worker/current-affairs/data/phase3d-distractor-generator.js`.

The system generates exactly three distractor candidates for a Phase 3C draft by searching the verified fact pool and ranking candidates by semantic proximity: same attribute first, then same topic/domain where appropriate. It never manufactures unsupported factual answers when the verified pool is insufficient.

### Distractor safety and efficiency

- Correct answers are always excluded.
- Duplicate options are removed deterministically.
- Candidate provenance records the supporting fact ID and selection strategy.
- Candidate type is matched to the question variant where the answer is an entity, value, number or date.
- Relationship/comparison/scenario/multi-fact style questions require explicit candidate context instead of inferred relationships.
- If fewer than three sufficiently supported distractors exist, generation fails safely rather than padding the question with weak or invented options.
- Batch processing has an explicit cap for predictable Worker execution.

Phase 3D only supplies distractor candidates; it does not decide final correctness, option quality, semantic uniqueness or activation. Phase 3E remains responsible for final quality validation.

**Phase 3D status: implementation complete.**

Next: **Phase 3E — Quality Validator.**


## Phase 3E implementation checkpoint — 24 September 2026

Phase 3E — **Quality Validator** is now implemented in `worker/current-affairs/data/phase3e-quality-validator.js`.

This is the final quality gate before a generated question can be promoted to the validated Question Bank state. It checks structural validity, four-option integrity, exactly one correct answer, fact/source provenance, freshness metadata, question wording, unsupported/subjective language, political neutrality, difficulty consistency and access-tier validity.

### Conservative quality policy

The validator prefers rejection over questionable content. It never silently repairs an invalid question. Missing explanation is currently a warning rather than a rejection because explanation requirements can differ by quiz mode.

Current-officeholder facts receive additional freshness scrutiny. Political/civic questions are allowed when factual and neutral, while persuasive or unsupported evaluative wording is rejected.

Phase 3E deliberately does not perform semantic similarity or question-family duplicate detection; those remain Phase 3F responsibilities. Batch validation is explicitly bounded for predictable Worker execution.

**Phase 3E status: implementation complete.**

Next: **Phase 3F — Duplicate / Family Detection.**


## Phase 3F implementation checkpoint — 24 September 2026

Phase 3F — **Duplicate / Family Detection** is now implemented in `worker/current-affairs/data/phase3f-duplicate-family-detector.js`.

The anti-repetition system now has multiple deterministic protection layers:

1. Exact question-text duplicate detection.
2. Canonical concept + answer + variant identity detection.
3. Question-family blocking.
4. Concept/fact-provenance duplicate detection.
5. Conservative wording-similarity review signal for differently worded questions.
6. Same-family blocking within a single quiz.
7. Optional same-concept blocking within a single quiz.
8. Question, family and concept cooldowns against recent user history.

Wording similarity is deliberately a **review signal**, not an automatic rejection, because common words can produce false positives. Provenance, concept and family identity remain the authoritative anti-repetition mechanisms.

The module also provides a deterministic eligible-question filter and a Question Bank audit helper. Randomization remains outside this module so eligibility decisions remain reproducible and testable.

**Phase 3F status: implementation complete.**

Next: **Phase 3G — Quiz Assembler.**


## Phase 3G implementation checkpoint — 24 September 2026

Phase 3G — **Quiz Assembler** is now implemented in:

worker/current-affairs/data/phase3g-quiz-assembler.js

The assembler builds a playable quiz from serving-safe Question Bank records while keeping content generation, validation and user history separate. Its default target is exactly 10 questions.

### Assembly rules
- Only active Question Bank records are eligible for serving. Generated/unvalidated drafts cannot bypass the quality pipeline.
- Recent user history is filtered before selection using question ID, question-family ID and concept ID cooldowns.
- A question family can appear only once in a quiz.
- The same concept is blocked by default within one quiz.
- Difficulty is targeted at Easy 4 / Medium 4 / Hard 2 by default, while allowing configurable targets.
- Domain, topic and question-variant concentration are limited so one area does not dominate a quiz.
- Selection uses deterministic seeded ordering, making tests reproducible while still allowing different seeds for different sessions.
- If distribution limits prevent completion, the assembler may relax only distribution limits; family/concept anti-repetition rules are never relaxed.
- If fewer than the requested number of eligible questions remain, the assembler fails explicitly instead of serving a shorter or unsafe quiz.

### Phase 3G boundary
Phase 3G does not generate questions, generate distractors, validate facts, persist the Question Bank, write user history, enforce billing, or connect the Worker route. Those responsibilities remain separate.

The intended serving pipeline is now:

Verified Facts → Generation → Distractors → Quality Validation → Duplicate/Family Detection → Question Bank → Quiz Assembler → Quiz → User History

The Question Bank remains a dedicated content-management layer and is not being replaced by the assembler.

**Phase 3G status: implementation complete.**

Next: **Phase 3H — Worker integration.**

## Phase 3 Question Bank checkpoint — 24 September 2026

A sequencing correction is now recorded: **Phase 3G — Quiz Assembler is complete, but the actual persistent Question Bank storage/management layer is not yet implemented.**

Phase 3G consumes the Question Bank conceptually, but it does not create, persist, populate or manage the bank. Therefore the project must complete the Question Bank layer **before Worker integration**.

### Correct Phase 3 sequence

- Phase 3A — Question data model & concept/family model — complete
- Phase 3B — Question blueprint/template system — complete
- Phase 3C — Question generator — complete
- Phase 3D — Distractor generator — complete
- Phase 3E — Quality validator — complete
- Phase 3F — Duplicate/family detection — complete
- Phase 3G — Quiz assembler — complete
- **Phase 3H — Question Bank Storage & Management — next**
- Phase 3I — Worker integration — pending
- Phase 3J — Android/debug testing — pending
- Phase 3K — Stabilization — pending

### Required serving architecture

Verified Facts → Question Generation → Distractors → Quality Validation → Duplicate/Family Detection → Question Bank → Quiz Assembler → Worker → Android App → User History

The Question Bank must remain separate from `recent_history`. It is the application's curated content store; `recent_history` belongs to individual users and records what they have seen.

### Phase 3H planning boundary

The next stage will first plan the Question Bank storage and management layer before implementation. Planning must determine the canonical storage format and location, promotion rules for validated questions, stable IDs and versioning, active/retired/superseded lifecycle handling, provenance and source retention, freshness/revalidation handling for dynamic facts, family/concept indexing for anti-repetition, audit/integrity checks, safe population from the existing 86 verified Phase 2 facts and Phase 3 pipeline, future access-tier metadata without billing implementation, and maintainability without making the bank a runtime bottleneck.

No Current Affairs Worker route should consume this bank until the Question Bank stage has been implemented and audited.

## Phase 3H general checkpoint — 24 September 2026

Phase 3H — **Question Bank Storage & Management** is now implemented through 3H-A to 3H-E.

### 3H-A — Question Bank contract
Implemented in `worker/current-affairs/data/phase3h-question-bank.js`. The contract defines stable question identity, provenance, lifecycle, temporal metadata, generator version, validation metadata and future access-tier metadata. Question Bank lifecycle states are `validated`, `active`, `superseded` and `retired`.

### 3H-B — Question Bank manager
The Question Bank manager provides controlled add/get/list/update/promote/retire/supersede operations, fact/source lookup, statistics, audit and snapshots. Core identity fields are protected from casual mutation. The manager is storage-independent so a later persistent backend can be introduced without redesigning the content contract.

### 3H-C — Population pipeline
The controlled population flow is:
`Phase 2 facts → 3C drafts → 3D distractors → 3E quality gate → 3F duplicate/family gate → 3H Question Bank`.

Population is bounded and deterministic. Initial population defaults to one accepted variant per question family to avoid filling the bank with equivalent variants. Rejected candidates retain explicit reasons. The pipeline does not connect to the Android app, production Worker route, NewsData, billing or AdMob.

### 3H-D — Audit system
A read-only Question Bank audit now checks contract validity, duplicate IDs, fact/source provenance, fact references, inactive dependencies, freshness metadata for dynamic facts, family collisions and duplicate/possible-duplicate signals. It reports issues without silently repairing or activating records.

### 3H-E — Phase 3G integration tests
A deterministic integration test verifies that an active Question Bank can safely feed the 3G assembler: exactly 10 questions, unique families/concepts, 4 Easy/4 Medium/2 Hard distribution, recent-history cooldown, access-tier filtering and rejection of non-serving records.

### Storage decision
The first implementation remains storage-independent and does not introduce D1/KV/Firebase or paid infrastructure. A persistent backend can be evaluated later while preserving the Question Bank contract.

### Current Phase 3 status
**3A → 3B → 3C → 3D → 3E → 3F → 3G → 3H-A → 3H-B → 3H-C → 3H-D → 3H-E: COMPLETE.**

The next controlled stage is **3I — Worker Integration**. Before production serving, the populated Question Bank must be generated/inspected and the Worker route connected without reintroducing NewsData into Current Affairs.


## Phase 3I-A / 3I-B Worker + Question Bank checkpoint — 24 September 2026

Phase 3I-A Worker integration is implemented in `worker/current-affairs/index.js` and connected through `worker/index.js`. The Current Affairs request path now follows:

`Worker request → audited Question Bank → access-tier filter → recent-history cooldown → Phase 3G assembler → public quiz response → Android`

The Current Affairs route no longer returns the old disconnected placeholder. It still has **no NewsData dependency**. NewsData remains isolated under `worker/news-quiz/` for the future live News Quiz product.

Phase 3I-B now provides the first version-controlled serving Question Bank seed in `worker/current-affairs/data/phase3i-initial-question-bank.js`, exposed through `phase3i-question-bank.js`.

Current serving-bank checkpoint:
- 29 active FREE Question Bank records.
- 12 Easy, 13 Medium, 4 Hard.
- Unique question IDs, families and concepts.
- Four-option records with the correct answer represented in the options.
- Provenance and freshness metadata retained.
- Variant diversity represented so the Phase 3G distribution rules can assemble a complete 10-question quiz.
- No NewsData, billing, AdMob or unrelated category integration.

A dedicated real-bank audit/serving-readiness test is implemented at `worker/current-affairs/data/phase3i-b-audit-test.js`. Static contract checks and deterministic selection simulation confirm that the current real bank can supply a complete 10-question quiz with the target **4 Easy / 4 Medium / 2 Hard** distribution when no history blocks eligible content, while recent-history filtering can still produce a complete 10-question session when sufficient content remains.

The 3I-B population is intentionally a bounded first serving population, not a claim that all 86 Phase 2 facts have already become Question Bank records. Further bank expansion can continue through the existing 3C → 3D → 3E → 3F → 3H pipeline.

**Current Affairs status: 3I-A complete; 3I-B serving seed + audit/readiness work complete. Next: 3J debug APK/end-to-end testing, followed by 3K stabilization.**

## Phase 3J Step A runtime-generation checkpoint — 24 September 2026

Step A is now implemented as the runtime bridge between the verified-fact database and the existing quiz assembler.

The Current Affairs serving flow is now:

Worker request → Audited Question Bank → enough fresh eligible questions?

YES → assemble
NO → Verified facts → 3C generation → 3D distractors → 3E validation → 3F duplicate gate → Runtime serving pool → 3G quiz assembly

### Step A rules

- The 86 verified facts remain the primary source of truth.
- The Question Bank is a repository/cache/seed, not a hard ceiling.
- Recent history can exhaust the current bank without making the category unavailable.
- Runtime-generated questions are validated before they can enter the serving pool.
- Multiple validated variants may share a question family in storage/generation; Phase 3G still allows only one family member per quiz.
- Exact/canonical duplicates remain blocked.
- Player-facing explanations do not expose internal fact IDs or source IDs.
- Step A does not persist runtime-generated questions across Worker requests.

### Step B boundary

Cloudflare D1 is the planned persistent Question Bank layer. It is intentionally not added in Step A. Step B will persist validated runtime questions and allow the same generation/selection contract to reuse them across requests without changing the fact-first architecture.

### NewsData and monetization

NewsData remains isolated to the future News Quiz / Current Events product. No NewsData dependency was added to Current Affairs.

Access tiers remain metadata-only. No billing, subscriptions, premium enforcement or paywalls were added.

### Testing

A dedicated Step A integration test now forces the audited bank into recent history and verifies that the runtime path can produce a fresh 10-question quiz with the required 4 Easy / 4 Medium / 2 Hard distribution.

Phase 3J Step A status: IMPLEMENTED — deployment and debug end-to-end verification pending.
