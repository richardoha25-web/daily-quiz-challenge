# Daily Quiz & Challenge — Commercial & Monetization Plan

**File:** `commercial-monetization.md`  
**Status:** Strategic product specification — planned, not yet fully implemented  
**Purpose:** Single source of truth for the commercial, premium, advertising, entitlement, and revenue architecture of Daily Quiz & Challenge.

---

## 1. Purpose and guiding principles

Daily Quiz & Challenge is intended to become a long-term quiz and learning platform, not simply a collection of trivia questions.

The commercial model must therefore support:

- Sustainable revenue.
- A genuinely useful free experience.
- Recurring Premium revenue.
- Optional one-time purchases.
- Advertising revenue from users who remain on the free tier.
- Premium content and premium functionality.
- Future international expansion.
- Scalable backend and access-control architecture.
- A user experience that does not feel aggressively paywalled.

### Core principle

**Free users should receive real value. Premium users should receive substantially more value.**

The app should encourage users to upgrade because they want additional content, deeper features, convenience, and advanced experiences — not because the basic product has been deliberately crippled.

---

# 2. Overall revenue model

The planned commercial model has four primary revenue layers and one longer-term layer:

1. **Advertising — free users**
2. **Premium subscription**
3. **One-time Remove Ads purchase**
4. **Premium content and features**
5. **Future one-time quiz/content packs**

Additional supporting monetization can include optional rewarded ads, premium challenges, cosmetic features, and future competition/engagement systems.

The model should not depend on a single revenue source.

---

# 3. Free tier

The free tier is the main user-acquisition and product-discovery layer.

Users should be able to install Daily Quiz & Challenge, play meaningful quizzes, understand the value of the app, build a streak, and return regularly without immediately paying.

### Planned free features

- General Knowledge quizzes.
- Science quizzes.
- A meaningful selection of Africa & Nigeria content.
- Daily quiz functionality.
- Basic results.
- Score.
- Streak tracking.
- Best score/trophy functionality.
- Selected Current Affairs content.
- Selected Bible content.
- Basic quiz modes.
- Optional rewarded advertisements.
- Standard advertising-supported experience.

The exact free/premium split for each category will be defined before that category is finalized.

### Principle

Do not design the free tier as a fake demo.

The free tier should be good enough that users can genuinely enjoy the app.

---

# 4. Premium subscription

Premium is intended to become the primary recurring-revenue product.

## Planned Premium structure

Initially, keep the subscription model simple:

- **Monthly Premium**
- **Yearly Premium**

Avoid creating many subscription tiers at the beginning.

The exact prices are **not yet decided**.

Pricing must eventually consider:

- Nigerian purchasing power.
- International pricing.
- Google Play fees.
- Provider/API costs.
- Cloud/backend costs.
- Ad revenue.
- Taxes and applicable commercial requirements.
- Conversion testing.
- Long-term sustainability.

### Premium should provide a clear bundle of value

Planned Premium benefits include:

- No ads.
- More quizzes.
- Premium categories/content.
- Advanced quiz modes.
- Full or expanded Bible experience.
- Advanced Africa & Nigeria content.
- Full Current Affairs experience.
- Advanced statistics.
- Exclusive challenges.
- Enhanced streak features.
- Personalized topic progression.
- Deeper explanations.
- Additional quiz history.
- Future premium learning tools.

---

# 5. One-time Remove Ads purchase

A separate one-time **Remove Ads** product may be offered for users who do not want a recurring subscription.

### Remove Ads should mean:

- Advertising removed from the normal app experience.
- Free-tier content remains available.
- It does not automatically unlock the entire Premium product.

### Important distinction

**Remove Ads ≠ Premium**

Premium should remain the substantially larger product:

> Remove Ads = convenience.

> Premium = convenience + premium content + premium features + advanced experiences.

Pricing must be designed so that Remove Ads does not make Premium unattractive.

---

# 6. Premium content strategy

Not every category needs to be completely free.

However, access should generally be divided into **free and premium layers**, rather than simply locking an entire category.

The app should use a category/topic/access model:

**Category → Topic → Difficulty → Access level → Question source**

rather than:

**Category → API → questions**

This allows us to monetize individual areas intelligently.

---

# 7. Category commercial structure

Initial planned model:

| Category | Free access | Premium access | Content model |
|---|---|---|---|
| General Knowledge | Yes | Advanced modes/content | Online |
| Science | Yes | Advanced modes/content | Online |
| Africa & Nigeria | Basic/selected | Advanced/full content | Online |
| Bible | Limited | Full/expanded experience | Licensed Bible + online quiz |
| Current Affairs | Daily/limited | Full/advanced/archive | Fresh online |
| Future categories | To be decided | To be decided | Online where practical |

This table is a planning model and can change as actual content, provider costs, and user behavior become clearer.

---

# 8. Africa & Nigeria monetization

Africa & Nigeria should not simply become a paid category.

The category should have useful free content and deeper premium content.

## Free examples

### Nigeria
- Basic Nigerian History.
- Basic Nigerian Geography.
- Nigerian States & Capitals.
- Nigerian Culture & Traditions.

### Africa
- African Countries.
- Capitals.
- Basic African Geography.
- Basic African History.

## Premium examples

- Advanced Nigerian History.
- Nigerian Political/Civic History.
- Nigerian Independence & Nation Building.
- Nigerian Historical Figures.
- Advanced Nigerian Geography.
- African History.
- African Leaders & Historical Figures.
- African Heritage & Civilizations.
- Advanced African Geography.
- Deeper culture/history collections.

The exact division will be finalized after the provider/source architecture is established.

---

# 9. Bible monetization

Bible should be treated as more than a simple quiz category.

The intended experience is:

**Read Bible → Old Testament/New Testament → Book → Chapter → Reading → Quiz/Study**

## Free Bible experience

Potential free features:

- Selected Bible reading.
- Selected Bible quizzes.
- Basic chapter quizzes.
- Limited daily Bible quiz.
- Basic Bible challenge content.

## Premium Bible experience

Potential Premium features:

- Full Bible quiz library.
- Book-by-book quizzes.
- Chapter quizzes.
- Topic quizzes.
- Advanced difficulty.
- Detailed explanations.
- Scripture study tools.
- Quiz history/statistics.
- Special Bible challenges.
- Future AI Bible Study features.

### Licensing principle

Bible text must not be bundled or distributed until the rights for the selected translation and exact use case have been verified.

The planned Bible architecture should support a properly licensed/public-domain translation.

NIV is deliberately not the default bundled-text solution because of mobile/offline/commercial licensing constraints.

---

# 10. Current Affairs monetization

Current Affairs has a special commercial opportunity because freshness is part of its value.

The product can eventually provide:

## Free

**Today's Current Affairs Quiz**

- Limited questions.
- Advertising-supported experience.

## Premium

**Current Affairs Pro**

- Full daily quiz.
- Weekly quiz.
- Monthly quiz.
- Nigeria.
- Africa.
- World.
- Detailed explanations.
- Advanced difficulty.
- Historical current-affairs archive.
- Expanded topic coverage.

Current Affairs content must include freshness metadata and should not remain indefinitely usable as if it were current.

Potential metadata:

- publishedAt
- source
- topic
- country/region
- sourceId
- createdAt
- updatedAt

---

# 11. Premium quiz modes

Premium should offer experiences that are different from simply receiving more questions.

Potential Premium modes:

### Endless Challenge

Continue until the user gets a question wrong.

### Hardcore Mode

Higher difficulty and no second chances.

### Exam Mode

Structured, timed examination-style experience.

### Marathon

50 or 100 questions.

### Survival

Difficulty increases progressively.

### Daily Challenge

Special challenge with a leaderboard/achievement system.

### Category Mastery

Structured progression through a subject until the user demonstrates mastery.

These modes should be introduced progressively rather than all at once.

---

# 12. Premium statistics and learning analytics

Free users can receive basic results.

Premium users can receive deeper performance analysis.

## Free

Examples:

- Score.
- Correct answers.
- Incorrect answers.
- Best score.
- Streak.

## Premium

Potential analytics:

- Overall accuracy.
- Category accuracy.
- Topic accuracy.
- Difficulty accuracy.
- Average response time.
- Easy/Medium/Hard performance.
- 7-day performance.
- 30-day performance.
- Strong topics.
- Weak topics.
- Improvement trends.
- Quiz history.
- Category mastery.

Example:

> Your weakest area is Nigerian Geography.

The app can then recommend a relevant quiz.

This creates a learning loop:

**Play → Analyze → Identify weakness → Practice → Improve.**

---

# 13. Rewarded advertisements

Rewarded ads should remain optional.

The existing rewarded-ad architecture, including the current +20 reward concept, can be expanded carefully.

Potential rewards:

- +20 points.
- One extra attempt.
- Additional quiz.
- Temporary streak protection.
- Reveal one answer option.
- Retry a failed question.
- Other small gameplay rewards.

### Principle

Do not force users to watch an advertisement simply to use the basic app.

Rewarded ads should be an optional exchange:

**User chooses to watch → user receives a useful reward.**

---

# 14. One-time premium quiz/content packs

A future revenue layer can be individual one-time purchases.

Potential examples:

- Nigerian History Master Pack.
- African History Challenge.
- Catholic/Bible Challenge packs.
- WAEC/JAMB-style subject challenges where licensing/content rights permit.
- Advanced Science packs.
- Special examination or educational collections.
- Seasonal/special challenge packs.

A user who does not want a recurring subscription could purchase a specific collection.

This is a longer-term feature and does not need to be implemented immediately.

---

# 15. Challenges, tournaments and competitions

Long-term engagement can include:

- Daily Challenge.
- Weekly Challenge.
- Monthly Championship.
- Leaderboards.
- Badges.
- Achievement systems.
- Category competitions.

Premium users may receive additional challenge modes or benefits, while free users can still participate in selected challenges.

### Important restriction

Do not introduce cash-prize competitions early.

Cash competitions introduce additional complexity involving:

- Legal requirements.
- Payments.
- Fraud.
- Moderation.
- Regional restrictions.
- Potential gambling-related considerations.

Early competitive systems should focus on:

- Points.
- Rankings.
- Achievements.
- Badges.
- Trophies.
- Streaks.
- Recognition.

---

# 16. Achievements and cosmetic monetization

Longer term, optional cosmetic features may supplement the main business model.

Potential examples:

- Premium profile themes.
- Premium badges.
- Special trophies.
- Profile frames.
- Streak effects.
- Celebration animations.
- Special quiz backgrounds.

These are secondary monetization features.

They should not become the main source of revenue.

---

# 17. Entitlement architecture

The app should not hard-code monetization rules throughout the UI.

Avoid logic such as:

`if category === "bible" then requirePremium()`

Instead, build a centralized entitlement model.

Conceptual flow:

**USER → PURCHASE/SUBSCRIPTION → ENTITLEMENTS → ACCESS CONTROL → FEATURE/CATEGORY**

Potential entitlement identifiers include:

- `premium`
- `remove_ads`
- `bible_full`
- `current_affairs_pro`
- `advanced_stats`
- `endless_mode`
- Future entitlement IDs as needed.

The UI and question engine should query entitlement/access state rather than independently implementing payment logic.

This will make the system easier to expand.

---

# 18. User access states

The commercial architecture should eventually distinguish states such as:

- Free user.
- Premium monthly.
- Premium yearly.
- Remove Ads.
- Premium + Remove Ads if ever needed.
- Expired Premium.
- Cancelled but still active until expiry.
- Grace/temporary billing states where applicable.
- Restored purchase.
- Unverified purchase.
- Backend verification failure.

The exact state machine will be defined during implementation.

---

# 19. Billing and payment architecture

The commercial payment system should separate **payment collection**, **trusted verification**, and **feature entitlement**.

### 19.1 Primary Android payment layer

For digital subscriptions and one-time digital purchases distributed through Google Play, the planned primary payment layer is **Google Play Billing**.

Planned purchase types include:

- Premium monthly subscription.
- Premium yearly subscription.
- One-time Remove Ads purchase.
- One-time premium content packs.
- Other eligible digital products introduced later.

The app should not create an insecure custom card-payment mechanism inside the Android APK for Google Play digital purchases. The final implementation must follow the applicable Google Play billing requirements and supported alternative-billing/program rules in force when implemented.

### 19.2 Trusted purchase and entitlement flow

```text
User
  ↓
Premium / Store UI
  ↓
Google Play Billing
  ↓
Purchase / subscription result
  ↓
Trusted verification + synchronization
  ↓
Subscription / purchase state
  ↓
Centralized entitlements
  ↓
Feature/content access
```

The client must not be the sole authority for Premium access. A client-side purchase-success callback can initiate synchronization, but trusted backend verification should determine the authoritative commercial state.

### 19.3 Centralized entitlement model

The app should avoid hard-coding rules throughout individual screens or categories.

Potential entitlement IDs:

- `premium`
- `remove_ads`
- `bible_full`
- `current_affairs_pro`
- `advanced_stats`
- `endless_mode`
- future content-pack/feature IDs

Example:

**Purchase Premium → verified purchase → `premium = active` → Premium-enabled features become available.**

This allows the commercial offer to evolve without rebuilding payment logic into every feature.

### 19.4 User access states

The entitlement system should support states such as:

- Free.
- Premium monthly.
- Premium yearly.
- Remove Ads.
- Premium + Remove Ads if offered.
- Active until subscription expiry after cancellation.
- Expired.
- Grace/recovery states where supported.
- Restored purchase.
- Pending/unverified.
- Verification failure.
- Synchronization failure.

The exact state machine will be finalized during implementation.

### 19.5 Firebase / Cloudflare role

The eventual trusted architecture can use the existing backend foundation:

**Android App**
→ **Billing client**
→ **Trusted verification/synchronization**
→ **Firebase/Cloudflare services**
→ **Central entitlement state**
→ **Feature/content access**

Potential commercial data includes:

- `users`
- `subscriptions`
- `purchases`
- `entitlements`
- verification state
- expiry/cancellation state
- restore/synchronization state

Cloudflare Worker remains the intermediary for provider/content services and may participate in access-aware delivery where appropriate. Private provider keys and trusted commercial secrets must never be embedded in the APK.

### 19.6 Future web/direct-payment channel

A separate web-payment path may be introduced later for products legitimately sold outside the Google Play Android purchase flow.

A provider such as a suitable international/web payment processor can be evaluated at that stage based on:

- country availability
- international payment coverage
- payout support for Richard Studios
- transaction fees
- recurring-payment support
- refund/dispute handling
- API quality
- commercial/legal requirements
- platform rules

The web payment system should map into the same entitlement model where appropriate rather than creating a second incompatible Premium system.

### 19.7 UX requirements

The payment experience should provide:

- Premium/store entry.
- Clear benefits.
- Clear price and billing period.
- Monthly/yearly choices where offered.
- One-time purchase presentation where offered.
- Purchase confirmation.
- Restore/synchronize purchases.
- Current entitlement status.
- Expiry/cancellation information where relevant.
- Grace/error states where supported.
- A clear return path to the app.
- No deceptive or aggressive paywalls.

### 19.8 Implementation status

**Architecture only — not implemented.**

Do not create production subscription IDs, purchase products, billing code or entitlement enforcement yet.

Billing should be implemented only after the core content architecture is stable and the account/entitlement foundation is ready.

---

# 20. Firebase and Cloudflare responsibilities

The future commercial architecture should integrate with the existing backend architecture.

Conceptual model:

**Android App**
→ **Access/Entitlement layer**
→ **Cloudflare Worker**
→ **Trusted backend services**
→ **Firebase / purchase state / user data**
→ **Question/content services**

Potential Firebase data:

- `users`
- `subscriptions`
- `entitlements`
- `purchases`
- `quiz_history`
- `quiz_results`
- `streaks`
- `achievements`

Sensitive validation should happen on trusted backend infrastructure rather than being trusted to the client APK.

Cloudflare Worker remains useful for:

- Protecting provider/API keys.
- Content routing.
- Question normalization.
- Source selection.
- Access-aware content delivery where appropriate.
- Future rate limiting.
- Backend intermediary responsibilities.

Do not place private provider keys or trusted commercial secrets inside the APK.

---

# 21. Commercial funnel

The intended business funnel is:

**NEW USER**
↓
**FREE QUIZZES**
↓
**EXPERIENCES APP**
↓
**RETURNS / BUILDS STREAK**
↓
**WANTS MORE VALUE**
↓
Choose among:
- Premium.
- Remove Ads.
- One-time content pack.
- Continue using free tier with ads.

Premium users then generate recurring subscription revenue.

Free users can continue generating advertising revenue.

---

# 22. User experience principle: avoid aggressive paywalls

The app should not use a model such as:

> Play three quizzes and then pay.

The free product should remain useful.

Premium should communicate:

> You already enjoy the app. Premium gives you much more.

This creates a value-based upgrade path.

The commercial system should prioritize:

- Transparency.
- Clear pricing.
- Clear benefits.
- No deceptive UI.
- No confusing subscription traps.
- Easy-to-understand entitlement states.
- Respectful advertising.
- Useful free content.

---

# 23. Premium proposition

The long-term Premium proposition can be summarized as:

## Daily Quiz & Challenge Premium

**Quiz more. Learn more. Master more.**

Potential benefits:

- No ads.
- More quizzes.
- Premium categories.
- Advanced quiz modes.
- Full/expanded Bible experience.
- Advanced Africa & Nigeria content.
- Full Current Affairs.
- Advanced statistics.
- Exclusive challenges.
- Enhanced streak features.
- Personalized topic progression.
- Detailed explanations.
- Extended quiz history.
- Future premium learning tools.

The exact final feature list is subject to implementation cost and product testing.

---

# 24. Commercial design must influence category design

Every future category should be designed with monetization in mind from the beginning.

For every category, document:

1. Category.
2. Topics.
3. Free topics/content.
4. Premium topics/content.
5. Difficulty levels.
6. Question sources/providers.
7. Source licensing.
8. Freshness requirements.
9. Quiz modes available.
10. Premium-only modes.
11. Explanation availability.
12. User entitlement required.
13. Offline/cache policy.
14. Provider cost.
15. Expected maintenance burden.

This prevents the app from being built first and monetized as an afterthought.

---

# 25. Content architecture for monetization

The target model is:

**Category**
↓
**Topic**
↓
**Difficulty**
↓
**Access level**
↓
**Provider/source**
↓
**Validation**
↓
**Question Engine**
↓
**Quiz**

Possible access levels:

- FREE
- PREMIUM
- SPECIAL_PACK
- FUTURE_ENTITLEMENT

The system should be extensible so new commercial products can be added without rewriting the question engine.

---

# 26. Revenue sources versus product value

The project should maintain a healthy balance:

| Revenue source | User value |
|---|---|
| Ads | Free access |
| Rewarded ads | Optional gameplay rewards |
| Remove Ads | Convenience |
| Premium subscription | Complete upgraded experience |
| Premium categories | Deeper content |
| Premium modes | Advanced gameplay |
| Premium statistics | Learning insight |
| Content packs | Focused permanent content |
| Cosmetics | Personalization |
| Challenges | Engagement/community |

No single monetization mechanism should dominate the entire product.

---

# 27. Cost-aware monetization strategy

The project currently operates under a limited budget.

Therefore:

- Avoid unnecessary paid APIs.
- Prefer sources with clear commercial rights and sustainable free/low-cost access where possible.
- Keep provider keys behind Cloudflare secrets.
- Monitor API usage.
- Avoid expensive infrastructure before user demand justifies it.
- Do not introduce paid services merely because they are technically convenient.
- Validate licensing before building commercial dependencies.
- Design provider abstraction so a source can be replaced later.

Revenue should eventually pay for:

- Content providers.
- Backend infrastructure.
- Cloud services.
- Payment/platform fees.
- Development/maintenance.
- Other operating costs.

---

# 28. Licensing and commercial rights

A provider is not automatically suitable simply because it has an API.

Before using a provider commercially, verify:

- API terms.
- Content license.
- Commercial-use rights.
- Attribution requirements.
- Redistribution requirements.
- Caching requirements.
- Storage requirements.
- Rate limits.
- Paid-tier requirements.
- Whether derived questions are permitted.
- Whether question data can be stored.
- Whether content can be used in a monetized Android application.

This is particularly important for:

- Africa & Nigeria providers.
- Bible content.
- Current Affairs sources.
- Third-party trivia databases.
- Any future premium content pack.

Do not assume that a free API means free commercial rights.

---

# 29. Provider strategy

The app should not unnecessarily depend on one provider.

For Africa & Nigeria, the preferred long-term model is a multi-source content layer behind the Cloudflare Worker.

Potential source categories include:

- Structured factual sources such as Wikidata.
- African/Nigerian data APIs.
- Nigerian educational/question providers where commercial licensing permits.
- General trivia sources for supplementary content.
- Future licensed specialist sources.

Conceptual architecture:

**Africa & Nigeria**
↓
**Cloudflare Worker**
↓
**Multiple validated sources**
↓
**Question generation/normalization**
↓
**Validation**
↓
**Deduplication**
↓
**Access filtering**
↓
**Question Engine**
↓
**10-question quiz**

Provider selection must always consider commercial licensing, not just technical capability.

---

# 30. Premium content must still meet quality standards

Premium does not mean content can be lower quality or artificially inflated.

Premium questions should still meet the same quality requirements:

- Accurate.
- Clear.
- Appropriate difficulty.
- Exactly four options where the standard MCQ format applies.
- Correct answer validated.
- Explanation where available.
- Source attribution where required.
- No avoidable duplication.
- Appropriate freshness.
- Appropriate cultural/contextual accuracy.

Premium users are paying for a better experience, so quality expectations are higher.

---

# 31. Advertising strategy

Advertising remains primarily a free-tier monetization mechanism.

Existing AdMob architecture can continue to support:

- App Open.
- Banner.
- Interstitial.
- Rewarded.

Planned principle:

- Natural placements.
- Avoid excessive interruption.
- Rewarded ads remain optional.
- Premium users receive no ads.
- Test ads are used during development.
- Production ad performance must be evaluated separately from test-ad behavior.

Test ads proving reliable lifecycle behavior does **not** guarantee production ad fill.

Production performance depends on factors including:

- Available inventory.
- User geography.
- Network conditions.
- Account state.
- Ad frequency.
- Policy/compliance.
- Fill rate.

---

# 32. Premium and advertising interaction

The commercial system should treat Premium and Remove Ads as explicit entitlements.

For example:

**Free**
→ ads enabled.

**Remove Ads**
→ normal ads disabled.

**Premium**
→ ads disabled.

**Premium + future special entitlement**
→ premium feature access.

This should be controlled centrally rather than independently by every screen.

---

# 33. Long-term international expansion

Although Nigeria is the initial market context, the architecture should not make the product permanently Nigeria-only.

Future expansion could include:

- More African countries.
- Regional quiz collections.
- International current affairs.
- Country-specific history/geography.
- Localized content.
- International pricing.
- Additional currencies.
- Additional payment considerations.
- Localization.

Africa & Nigeria can therefore serve as an important foundation for a broader global quiz platform.

---

# 34. Planned development phases

## Phase A — Commercial specification

Document:

- Free tier.
- Premium.
- Remove Ads.
- Content packs.
- Rewarded ads.
- Entitlements.
- Access levels.
- Category monetization.
- Billing architecture.

**Status: PLANNED / SPECIFICATION CREATED**

## Phase B — Commercial-aware content architecture

Build category/topic/access metadata into the content architecture.

**Status: FUTURE**

## Phase C — User/account and entitlement foundation

Implement the trusted backend model required for user entitlements and purchase state.

**Status: FUTURE**

## Phase D — Google Play Billing

Implement subscriptions and one-time digital purchases when Play distribution and commercial readiness justify it.

**Status: FUTURE**

## Phase E — Premium content rollout

Gradually introduce:

- Premium categories.
- Premium quiz modes.
- Premium statistics.
- Premium Bible features.
- Premium Current Affairs.
- Premium Africa & Nigeria content.

**Status: FUTURE / PHASED**

## Phase F — Optimization

Measure:

- Free-user retention.
- Ad revenue.
- Premium conversion.
- Subscription retention.
- Remove Ads purchases.
- Content engagement.
- Category popularity.
- Quiz completion.
- Rewarded-ad usage.

Then adjust the product based on actual evidence.

**Status: FUTURE**

---

# 35. What should NOT be implemented immediately

Do not rush to implement every commercial idea.

The immediate project should continue prioritizing:

1. Reliable online question architecture.
2. Africa & Nigeria source/provider research.
3. Current Affairs architecture.
4. Bible architecture and licensing.
5. UI/UX redesign.
6. Stable user/account architecture.
7. Commercial-aware access control foundation.

Actual billing can come later.

The goal now is to make sure the architecture will support monetization without needing a major rewrite.

---

# 36. Initial commercial roadmap

### Now

- Establish commercial specification.
- Design free/premium access model.
- Design entitlement identifiers.
- Continue provider licensing research.
- Design categories with access levels.
- Keep test AdMob infrastructure for development.

### Near term

- Implement commercial-aware category metadata.
- Prepare account/entitlement architecture.
- Design Premium UI/UX in Figma.
- Define subscription/product IDs.
- Prepare backend purchase-verification architecture.

### Later

- Google Play Billing.
- Premium subscription.
- Remove Ads.
- Premium category unlocks.
- Premium quiz modes.
- Premium statistics.
- Premium Bible experience.
- Current Affairs Pro.
- One-time content packs.

### Long term

- Tournaments.
- International expansion.
- More content providers.
- Personalized learning.
- Advanced analytics.
- Additional premium experiences.

---

# 37. Decisions still to be made

The following should remain explicitly undecided until enough information is available:

- Exact Premium monthly price.
- Exact Premium yearly price.
- Exact Remove Ads price.
- Whether Remove Ads is permanent or subject to future product policy.
- Exact free/premium split for each category.
- Exact number of free quizzes per day, if any limit is introduced.
- Exact Premium quiz modes at launch.
- Exact content-pack pricing.
- International pricing.
- Final provider mix.
- Final purchase/subscription IDs.
- Final Firebase schema for commercial data.
- Final Google Play Billing implementation.
- Whether certain advanced features are Premium-only or available to all users.

Do not invent these values prematurely.

---

# 38. Commercial success definition

The commercial system should ultimately achieve a balance between:

**User value + retention + content quality + sustainable revenue**

The objective is not simply to maximize the number of paywalls.

A successful commercial product should allow:

- Free users to enjoy the app.
- Ad-supported users to generate revenue.
- Premium users to receive significantly more value.
- Users who dislike subscriptions to have appropriate one-time purchase options.
- The business to earn enough to maintain and expand the service.
- The technical architecture to scale without repeated rewrites.

---

# 39. Relationship with other project documents

This document complements, rather than replaces, the other project documentation.

### `project.md`

The technical project checkpoint:

- Current milestone.
- What has been built.
- What works.
- What was tested.
- Immediate next step.
- Important implementation history.

### `ui-ux-project.md`

The visual/product experience blueprint:

- UI/UX direction.
- Screens.
- Navigation.
- Components.
- Visual hierarchy.
- User experience improvements.

### `commercial-monetization.md`

The business and commercial blueprint:

- Free vs Premium.
- Ads.
- Subscriptions.
- Purchases.
- Premium categories.
- Entitlements.
- Commercial architecture.
- Revenue strategy.
- Long-term monetization.

All three documents should remain consistent.

---

# 40. Final commercial vision

Daily Quiz & Challenge should evolve from a simple quiz app into a sustainable quiz and learning platform.

The long-term model is:

**Free access**
→ useful quizzes and learning  
→ advertising-supported usage

**Premium**
→ deeper content  
→ advanced modes  
→ richer learning tools  
→ no ads  
→ recurring subscription revenue

**Remove Ads**
→ one-time convenience purchase

**Premium Content Packs**
→ focused one-time purchases

**Future Experiences**
→ challenges, achievements, personalization, and international content

The commercial system should be built into the architecture early enough that categories, question providers, UI/UX, user accounts, and backend services can all support it naturally.

The guiding principle remains:

> **Build something users genuinely want to return to, then give them compelling reasons to upgrade.**

---

## Current status

**Commercial strategy:** Defined at high level  
**Commercial specification file:** Created  
**Billing implementation:** Not started  
**Premium entitlement implementation:** Not started  
**Remove Ads implementation:** Not started  
**Premium category access:** Not started  
**Pricing:** Not yet decided  
**Google Play Billing:** Future  
**Provider licensing:** Ongoing research  
**UI/UX Premium screens:** Future Figma work  
**V1.1.4:** Remains focused on reliable quiz/ad infrastructure  
**V2:** Remains paused

This document is the working commercial blueprint and should be updated whenever a major monetization decision is made.
