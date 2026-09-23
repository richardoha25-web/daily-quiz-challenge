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