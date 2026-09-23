# Daily Quiz & Challenge — Project Continuity Record
## Current Affairs architecture checkpoint — 23 September 2026

The V1 Current Affairs category is now documented as a **separate fact-first knowledge system**. It is not a NewsData headline-question system. The new `current-affairs-project.md` defines the eight domains, fact schema, source registry, verification/update rules, question-generation plan, quality validation and anti-repetition identity.

**NewsData isolation decision:** the existing NewsData integration is reserved for a future **News Quiz / Current Events** product. It must not supply the V1 `current_affairs` route. Future routing will explicitly separate `current_affairs` from `news_quiz` / `current_events`; provider-specific NewsData logic and credentials remain isolated from Current Affairs. Generic utilities may be shared, but provider-specific parsing/generation must not be shared.

**Implementation order:** Phase 1 documentation is complete. Next is Phase 2: build and verify a small initial Current Affairs knowledge base before implementing question generation or changing the production `current_affairs` route. Existing Science, General Knowledge, Africa & Nigeria and AdMob behavior must remain untouched.

**Documentation:** `current-affairs-project.md` is the dedicated Current Affairs technical continuity record. This file remains the overall project checkpoint; `ui-ux-project.md` remains the experience blueprint; `commercial-monetization.md` remains the commercial blueprint.


**Last updated:** 23 September 2026  
**Stage:** V1.1.9 Android update-validation fix is implemented, **merged into `main` via PR #6**, and **in-place update testing PASSED**. The app now updates successfully over the previous installed release without requiring uninstall/reinstall, while the new app content loads correctly. Science, General Knowledge, and **Africa & Nigeria are integrated and verified**. The temporary V1.1.9 validation branch has been deleted. **Current focus: complete Bible and Current Affairs, then run the full V1 stabilization pass before major architectural, branding, or UI/UX changes. V2 remains paused.**

## Long-term product vision
Daily Quiz & Challenge is intended to become a **long-term, high-quality quiz system for real users**, not just a small one-off quiz app. The goal is a reliable platform with fresh online questions, strong anti-repetition logic, multiple categories, meaningful difficulty, polished gameplay, useful explanations/results, dependable monetization, and a professional UI/UX that people enjoy returning to. Development should favor a stable foundation and incremental verification so future features can grow without bringing back the old static-question problems.

## Current milestone — V1.1.9 production baseline on `main`
- `package.json` version: `1.1.9`.
- Android release target: `versionName 1.1.9`, `versionCode 7`.
- Existing permanent production signing key and package ID were preserved.
- **Release-to-Release update test PASSED:** V1.1.3 installed directly over the signed 19 August release APK without uninstalling.
- Historical signed release artifact: `daily-quiz-release` from Android Release APK and AAB #5; SHA-256: `a5b4069b863238863d5505c5f6b95a2968bb17d1abcc41f881e96457211fbdc6`.
- Signed APK/AAB build and signature verification completed successfully.
- GitHub emitted only Node.js 20 deprecation and future Ubuntu 26 migration warnings; neither prevented the build.

**V1.1.3 validation result:** the installed signed release was tested on the phone and the planned functional/ad checks passed. Science repeatedly retrieves fresh online questions, the quiz flow works, ads display and refresh/recover as intended, and the app remains usable through repeated testing. No blocking failure was observed in the completed validation pass.

**V1.1.4 Android Debug validation result:** the latest Debug APK was installed and tested on the Android phone. The startup/loading experience, test App Open behavior, Home bottom banner, Quiz top banner, Results bottom banner, interstitial, and rewarded +20 flow behaved as expected. Banner placement remained usable and did not block quiz content.

**Africa & Nigeria production verification:** the merged live Africa API question-generation system is deployed through the production Cloudflare Worker and was tested from the user's phone. Easy, Medium, and Hard production responses were confirmed working correctly, including the revised question-generation formats and ambiguity fixes. Africa API commercial-use terms were reviewed; the project will use clear Africa API/original-source attribution without claiming a single universal upstream license.

**AdMob production transition:** the existing AdMob integration is unchanged. `src/adMob.ts` retains the tested lifecycle/recovery architecture and both test/production IDs. The Android **release workflow now explicitly builds with `VITE_ADMOB_TEST_MODE=false`**, so production APK/AAB builds select the real AdMob unit IDs. Debug builds continue to use test ads. Production ad fill remains subject to inventory, network, account, frequency and policy conditions.

**Immediate next step:** finish Current Affairs, then run the full V1 stabilization pass. Bible source/licensing research is established, but the Bible UI/product experience is intentionally deferred to the future native Android migration so the current V1 interface is not forced to absorb the new product architecture.

**UI/UX planning update:** a dedicated `ui-ux-project.md` has been created as the blueprint for the future redesign. It is intentionally separate from this file so this project record stays concise. The current UI remains functional but is **not the desired final experience**.

**Future architecture decision — 23 September 2026:** V1 remains the existing React/Vite/Capacitor quiz application and is the stable reference implementation. The future app-wide navigation, Bible experience, and major UI/UX redesign will be designed independently and implemented as part of the planned native Android migration. Bible data/source research can continue now, but Bible UI implementation must not force the current V1 interface to accommodate the future product architecture. Android's Navigation component supports navigation graphs, nested destinations, back stacks, and patterns such as bottom navigation and drawers, which will be evaluated during the future native design phase. citeturn0search0

**Bible V1 placeholder decision:** because the current V1 UI is intentionally not being redesigned for the full Bible experience, the existing Bible category may show a simple **Coming Soon / Bible Experience in Development** notice rather than attempting to implement Read Bible, Book/Chapter navigation, Bible Quiz modes, or voice reading inside the old category-card structure. This is a temporary product-state message, not the final Bible UI.

**Bible voice-reading decision:** future Bible reading will not auto-play audio. The user must explicitly choose the listening action. Planned controls include **Play, Pause/Resume, Stop**, and later speed/voice controls as appropriate. Silent reading remains the default when a chapter is opened.

## 1. Project identity
- App: Daily Quiz & Challenge
- Repo: `richardoha25-web/daily-quiz-challenge`
- Active branch: `main`
- V2 branch: `v2-development` — **paused; do not touch during V1 work**
- V1.1.9 validation branch: deleted after PR #6 was merged
- AppDeploy project: `daily-quiz-challenge-zd50r1`
- Stack: React + Vite + Capacitor 8.4.2
- Android package: `com.richard.dailyquizchallenge`
- Brand: Richard Studios
- Development/testing is phone/cloud based; no PC/laptop.

## 2. V1 baseline
- 10 questions per quiz
- 15 seconds/question
- 100 base points
- streak tracking
- best-score/trophy display
- Current category set: General Knowledge, Bible, Africa & Nigeria, Science, Current Affairs
- V1.1.9 implementation status: General Knowledge, Science, and Africa & Nigeria are integrated/verified; Bible and Current Affairs remain.

The original local question banks had repetition and weak difficulty variety. **They are no longer used as the V1.1 fallback.**

## 3. V1.1 goals
1. Reliable AdMob lifecycle/recovery.
2. App Open ads.
3. Rewarded Interstitial ads.
4. Better Banner/Interstitial/Rewarded handling.
5. Safe Android versioning and release updates.
6. Large online question system.
7. Easy/Medium/Hard difficulty.
8. Duplicate/recent-question prevention.
9. Clear online/offline behavior.
10. Five category experiences.
11. Offline Bible Library and online Bible Quiz.
12. Better quiz/results/streak UI.
13. Scalable navigation and UI architecture.
14. Signed V1.1 APK/AAB and update testing.

## 4. Question engine
`src/questionEngine.ts` is implemented with:
- `DailyQuizDB` IndexedDB cache, version 2
- remote fetching through the Cloudflare Worker
- returned-question validation/normalization
- category/difficulty filtering
- recent-question history
- ID-based deduplication
- no silent local-bank fallback
- Science and General Knowledge as the currently integrated online categories; both are now phone-validated

The app imports `getQuizQuestions()` from the question engine and starts quizzes through it. The old static question-bank fallback is not restored.

Target 10-question mix where inventory permits: **3 Easy / 4 Medium / 3 Hard**.

Standard question fields:
```text
id, category, difficulty, question, options[], correctAnswer,
explanation?, source, sourceId?, isRemote, createdAt, updatedAt
```

Exactly four options are required.

## 5. Actual question-engine architecture
```text
Android App
    ↓
Question Engine
    ↓
Cloudflare Worker ← Open Trivia DB (Science / General Knowledge)
    ↓
Validate / Normalize / Deduplicate
    ↓
Read recent-history IDs
    ↓
Filter recent/current-quiz duplicates
    ↓
Remove recent questions
    ↓
Shuffle / select 10
    ↓
Quiz
```

Current flow:
1. Require internet for online retrieval.
2. Reject unsupported categories instead of silently using old local banks.
3. For Science and General Knowledge, fetch fresh Easy/Medium/Hard questions from the Worker.
4. Validate and normalize returned questions.
5. Read recent-history IDs and exclude them when alternatives exist.
6. Avoid duplicate IDs within the current quiz.
7. Select approximately 3/4/3 difficulty mix where inventory permits.
8. Shuffle and record only selected IDs.
9. Return 10 questions to the app.

## 6. IndexedDB — actual state
Database: `DailyQuizDB`  
Version: `3`

Implemented stores:
1. `questions` — obsolete; removed from active V1.1 storage
2. `recent_history` — active

`recent_history` records selected question IDs, category and usage time. Full question objects are no longer stored as the active V1.1 cache.

DB version 3 removes the obsolete `questions` object store from older installations while preserving recent-history data where possible.

Planned but not yet implemented:
- `sync_metadata`
- `settings`

The app still uses `localStorage` for lightweight streak/best-score data.

## 7. Cloudflare intermediary
Worker name:
`daily-quiz-intermidiary`

**Exact URL:**
`https://daily-quiz-intermidiary.richardoha25.workers.dev`

**Important:** hostname is `richardoha25`, not `richardo25`.

`wrangler.toml` is configured with:
- Worker name: `daily-quiz-intermidiary`
- Entry point: `worker/index.js`
- Compatibility date: `2026-09-17`

Cloudflare is connected to GitHub repository `richardoha25-web/daily-quiz-challenge`, branch `main`, with Wrangler deployment.

## 8. Worker/API status — VERIFIED
Root response works:
`Daily Quiz & Challenge intermediary is running.`

Health endpoint:
`GET /api/health`

Verified response:
```json
{
  "ok": true,
  "service": "daily-quiz-intermediary",
  "version": "1.0"
}
```

Science endpoint has been successfully tested for **Easy, Medium and Hard**. General Knowledge has also been successfully tested for **Easy, Medium and Hard**. Example:
```text
/api/questions?category=science&difficulty=medium&limit=20
```

The valid response contained real Science questions with four options, correct answers, source metadata, remote IDs and timestamps.

Validation tests previously passed:
- invalid category → `INVALID_REQUEST`, HTTP 400
- invalid difficulty → `INVALID_REQUEST`, HTTP 400
- invalid limit above 20 → `INVALID_REQUEST`, HTTP 400

CORS support and `OPTIONS` handling are present in the Worker for browser/WebView access.

## 9. Open Trivia DB / Science + General Knowledge
Open Trivia DB is the first provider integration.
- public JSON API
- no API key
- Science & Nature category ID: `17`
- General Knowledge category ID: `9`
- multiple-choice questions provide one correct + three incorrect answers
- Worker requests URL-encoded responses
- Worker validates the provider response and maps provider errors

Current Worker error mapping includes:
- `INVALID_REQUEST` → 400
- `RATE_LIMITED` → 429
- `PROVIDER_UNAVAILABLE` → 503
- `PROVIDER_TIMEOUT` → 504
- `NO_QUESTIONS` → 404

A transient `503 PROVIDER_UNAVAILABLE` was observed once during Android testing. Without any code change afterward, the same Debug #55 app successfully loaded and played Science questions, so the incident appears to have been temporary/provider-side or network-related. It should still be monitored during reliability testing.

## 10. Android Debug build — historical V1.1.4 validation
### Latest Debug run #81
- Run ID: `35451028401`
- Commit: `d724e831b1e66e33397a7244a18f302a2f45f49f`
- Result: **success**
- Artifact name: `daily-quiz-debug-apk`
- Purpose: historical clean Debug build used for V1.1.4 AdMob validation.

Run #81 includes the V1.1.4 startup/App Open lifecycle, screen-aware banner placement, test-ad mode and the CI concurrency safeguard that cancels superseded Debug builds.

Build workflow was inspected before testing and confirmed to perform:
- npm install
- `npm run build`
- Vite production build
- Capacitor Android setup/sync
- AdMob App ID injection
- Java 21 setup
- `./gradlew assembleDebug`
- APK artifact upload

Build logs showed `@capacitor-community/admob@8.1.0`, successful Capacitor sync, AdMob App ID injection and `BUILD SUCCESSFUL`.

**Important:** Debug builds are development APKs, not the final production-signed release. Do not use it as the public website APK.

## 11. Android Debug — REAL PHONE TEST STATUS
Latest Debug run #81 has been installed/tested on the Android phone. Science and General Knowledge remain confirmed working end-to-end. The V1.1.4 AdMob reliability changes have now also passed the planned phone validation.

Observed in screenshots/live use:
- Science category opens successfully.
- Online questions load into the quiz.
- 10-question quiz flow works.
- 15-second countdown timer works.
- Question counter/progress works.
- Four answer choices display correctly.
- Correct/wrong answer feedback works.
- Score updates correctly (example observed score: 40).
- Streak display works.
- V1.1 UI is running correctly.
- The app successfully received real Science questions from the online system.

This confirms the practical path:
```text
Debug #70 → questionEngine → Cloudflare Worker → provider → quiz UI
```

Do **not** uninstall the existing app merely for routine testing. The known Android package-conflict issue is related primarily to signing certificates when Debug and Release builds are mixed.

## 12. Current UI status
Already present and working in the current Debug build:
- five category cards
- online-status wording
- progress counter/bar
- 15-second timer
- answer feedback
- score
- streak/best score
- results screen
- rewarded +20 bonus flow
- Play Again / Choose Another Category

Planned/improvable:
- user-facing difficulty selection/display
- stronger typography and spacing polish
- explanations
- richer results screen
- stronger streak presentation
- polished completion flow
- natural fullscreen ad placements

## 13. AdMob
Production IDs:
- App ID: `ca-app-pub-8496227439538798~7943409473`
- Banner: `ca-app-pub-8496227439538798/2899800506`
- Interstitial: `ca-app-pub-8496227439538798/8159866041`
- Rewarded: `ca-app-pub-8496227439538798/9137905794`
- App Open: `ca-app-pub-8496227439538798/2455637861`
- Rewarded Interstitial: `ca-app-pub-8496227439538798/6852855908`

**Current architecture:** `src/adMob.ts` is the single AdMob manager. `App.tsx` uses it for initialization, preloading, recovery, banner/interstitial/rewarded/App Open flows, and +20 handling. V1.1.4 adds a startup loading gate, returning-launch App Open handling from that loading state, persistent App Open load timestamps, screen-aware banner positioning (Quiz top; Home/Results bottom), and an explicit Debug-build test-ad mode.

Ad availability is not guaranteed; fill, inventory, network, account and frequency/policy controls can affect availability. Use test ads during development where appropriate.

**V1.1.4 Android validation PASSED:** test ads confirmed the startup/loading flow, returning-launch App Open handling, Home bottom banner, Quiz top banner, Results bottom banner, interstitial and Rewarded +20 behavior. The test environment does not guarantee production ad fill or identical real-ad availability; production ads can vary with inventory, network, account/frequency controls and other serving conditions.

## 13.1 Planned billing and entitlement architecture — DESIGN ONLY

Billing is a planned commercial capability, not a current implementation milestone.

### Primary Android payment architecture

For digital subscriptions and one-time digital purchases distributed through Google Play, the planned primary payment layer is **Google Play Billing**.

The app should not implement a custom card-payment system inside the Android APK for Google Play digital purchases. The final implementation must follow the applicable Google Play billing requirements and supported program options at the time of implementation.

Conceptual flow:

```text
User
  ↓
Premium / Store UI
  ↓
Google Play Billing
  ↓
Purchase or subscription result
  ↓
Trusted purchase verification
  ↓
Entitlement service
  ↓
User access
```

### Entitlement architecture

Payment status and feature access must be separated.

The Android client must not permanently grant Premium merely because it received a client-side purchase-success callback. A trusted backend verification/synchronization layer should determine the authoritative entitlement state.

Conceptual model:

```text
Google Play purchase
        ↓
Trusted verification
        ↓
Subscription / purchase state
        ↓
Entitlements
        ↓
Access control
        ↓
Premium feature/content
```

Planned entitlement IDs include:

- `premium`
- `remove_ads`
- `bible_full`
- `current_affairs_pro`
- `advanced_stats`
- `endless_mode`
- future content-pack or feature entitlements

The UI, quiz engine and content services should query centralized entitlement state rather than each implementing separate payment rules.

### Backend responsibility

Future billing implementation should use trusted backend infrastructure for purchase verification and entitlement synchronization. Firebase and/or Cloudflare can participate according to the final security architecture.

Potential commercial data:

- `users`
- `subscriptions`
- `purchases`
- `entitlements`
- entitlement status/expiry information
- verification state
- restore/synchronization state

Private billing/provider secrets must never be embedded in the APK.

### Future web/direct-payment channel

A separate web-payment path may be considered later for products or purchases that are legitimately sold outside the Google Play Android purchase flow. A web payment provider can be selected at that stage after checking provider availability, fees, international coverage, commercial rights and applicable platform rules.

The web payment path must remain separate from the Android Google Play Billing entitlement flow, while both ultimately map to the same centralized entitlement model where legally and technically appropriate.

### UX requirements

The future billing UX should include:

- Premium/store entry
- Clear product benefits
- Monthly/yearly subscription choices where offered
- One-time purchase presentation where offered
- Price and billing-period clarity
- Purchase confirmation
- Restore/synchronize purchases
- Active entitlement state
- Expiry/cancellation messaging where relevant
- Grace/error states where supported
- Clear path back to the app
- No deceptive or aggressive paywalls

### Current status

**Architecture planned only. No Google Play Billing code, purchase products, subscription IDs or production entitlement enforcement should be added yet.**

Billing implementation belongs after the core online content architecture, UI/UX redesign and stable account/entitlement foundation are sufficiently mature.

---

## 14. Android update validation — V1.1.9
- V1.1.7/V1.1.8 in-place update testing exposed stale app content after Android package updates even though the new APK itself contained the correct bundle.
- The successful V1.1.9 fix moved the native Capacitor app to a dedicated local HTTPS origin and disabled native service-worker request resolution, removing the stale PWA/service-worker path from the native app.
- V1.1.9 / `versionCode 7` was installed directly over the existing app and **the update worked correctly**. The new startup/loading experience, updated app content and existing functionality were confirmed after the update.
- This confirms that the permanent production package ID and signing/update path remain usable for future releases.
- Do not revert the V1.1.9 Capacitor origin/service-worker configuration without a specific reason and regression test.

## 15. Android versioning/signing
Package ID must remain `com.richard.dailyquizchallenge`.

Release/version history:
- V1.0 → `1.0.0`, versionCode `1`
- Previous V1.1 release → `1.1.0`, versionCode `2`
- **V1.1.9 update-validation build → `1.1.9`, versionCode `7` — in-place update PASSED.**
- V1.1.8 update-validation build → `1.1.8`, versionCode `6` — APK was correct but stale native app content remained after in-place update.
- V1.1.4 → `1.1.4`, versionCode `4`.
- V1.1.3 → `1.1.3`, versionCode `3`.

Future releases must use a higher versionCode while preserving the same production signing key and package ID.

Previous Android package conflict is primarily a signing-certificate mismatch (for example Debug vs Release). VersionCode alone does not fix that.

Release rules:
- Keep using the permanent production release key.
- Never generate a replacement production keystore.
- Public updates must use a higher versionCode.
- Website APKs must be release-signed.
- Never store signing passwords/keystore contents in this file.

## 16. Release workflow
`.github/workflows/android-release.yml`

Current release workflow file SHA on `main`:
`e71e7999540e38add74cb99f14bd02ad7c31b197`

It builds the current release as `versionCode 7` / `versionName 1.1.9`, injects the AdMob App ID, uses Java 21, restores the permanent production key from `KEYSTORE_BASE64`, signs APK/AAB, verifies signatures and uploads artifacts.

Obsolete workflows removed:
- `.github/workflows/generate-keystore.yml`
- `.github/workflows/keystore-to-base64.yml`

The release workflow now represents the V1.1.9 production-release baseline. Future version bumps should update only the intended release version values and should preserve the permanent signing configuration and production AdMob mode.

## 17. Category/provider roadmap — V1 COMPLETION MASTER PLAN

The remaining categories must not be implemented all at once. Use this sequence for every new category:

Provider/source research → architecture/data model → Worker endpoint → browser/API tests → Question Engine integration → Android Debug test → recent-history/cache test.

### General Knowledge — COMPLETE
- Open Trivia DB category 9
- Worker integration complete
- Easy/Medium/Hard tests complete
- Android validation complete

### Science — COMPLETE
- Open Trivia DB category 17
- Worker integration complete
- Easy/Medium/Hard tests complete
- Android validation complete

### Africa & Nigeria — INTEGRATED / PRODUCTION WORKER VERIFIED
- Africa API is the current factual source for the V1 Africa & Nigeria implementation.
- The live Worker converts sourced country/reference facts into quiz questions instead of exposing raw API wording.
- Easy, Medium, and Hard production endpoints were tested successfully after the `main` deployment.
- Question-generation quality fixes are in production, including removal of the rejected official-name question format, unique-currency safeguards, and distinct-subregion distractors.
- Recent-question IDs remain part of the Question Engine's anti-repetition system.
- Commercial-use terms and attribution requirements were reviewed. The app should identify Africa API and the original data providers identified by Africa API in its source/attribution information; it should not claim a single universal license for all underlying fields.
- The current implementation does not alter the existing Science/General Knowledge provider flows or AdMob architecture.

Planned future expansion can add Nigerian history, geography, culture, civic/government knowledge, African history/geography/culture, and notable African figures through additional validated sources where licensing permits.

### Current Affairs — RESEARCH TARGET
Current Affairs must be treated as changing content, not a permanent question bank.

Target architecture:
News/current-events source → Cloudflare Worker → question generation/normalization → Question Engine → Quiz.

Questions should carry freshness metadata such as publishedAt, source, topic, and country/region. Old current-affairs content must not remain indefinitely usable simply because it is cached.

### Bible — NEW PRODUCT EXPERIENCE
Bible is no longer treated as only another category card.

**V1 implementation status:** Bible is currently a **planned/future product experience**, not a full V1 UI implementation. The current V1 category entry should use a lightweight Coming Soon / In Development notice while source/data architecture continues separately. The full Bible navigation and reader will be implemented with the future native Android product architecture.

Desired structure:
- Read Bible
- Old Testament / New Testament
- Book
- Chapter
- Reading screen
- Bible Quiz
- Quick Quiz
- Book Quiz
- Chapter Quiz
- Topic Quiz
- Future AI Bible Study

Planned flow:
Bible → Read Bible → Mark → Chapter 5 → Read → Quiz Me on This Chapter.

#### Bible translation decision
NIV has been deliberately dropped because commercial/mobile/offline licensing is too restrictive for the current project.

The intended Bible Library translation is now the **World English Bible (WEB), Catholic edition / Catholic book order**, specifically WEBC (`eng-web-c`). Official eBible.org lists the edition as public domain and provides USFM, USFX, read-aloud plain-text chapter files, and other formats. The user has downloaded the official WEBC source packages needed for further inspection, including `eng-web-c_usfm.zip` and `eng-web-c_readaloud.zip`. citeturn0search1turn0search2

The Bible Library is intended to:
- work offline
- be stored in local/app storage after the text source and rights are verified
- support book/chapter reading
- remain independent of the online quiz provider
- eventually support Bible search and study features

Do not bundle any Bible text into the production APK until the exact source/license permits the required redistribution and software use.

#### Bible quiz architecture
Bible Quiz remains online:
Bible quiz provider → Cloudflare Worker → Question Engine → Bible Quiz UI.

Quizarama remains a candidate, but its public API licensing/commercial terms were not sufficiently clear during research. Do not integrate it until licensing is verified.

#### Future AI Bible study
The long-term goal is to generate questions from a selected Bible chapter/passage. This requires a Bible text source whose license explicitly permits the intended AI/question-generation use.

## V1 completion checkpoint

The immediate objective is deliberately narrow: **finish the three remaining categories and establish a stable V1 before beginning major redesign or migration work.**

### Remaining V1 categories
- **Africa & Nigeria — COMPLETE / VERIFIED.**
- **Bible — source/licensing foundation established; full UI/product implementation deferred to the future native Android migration. V1 should show a lightweight Coming Soon / In Development state for the category.
- **Current Affairs — ONLY remaining V1 content implementation target.** Implement as fresh online content with provider/source strategy appropriate to changing information.

### Provider principle for this milestone
The provider's internal category structure does **not** need to mirror the app's user-facing categories. For V1, the goal is to obtain suitable usable questions/content and normalize them into the app's three remaining categories. We should not block completion merely because a provider labels content as Africa, Nigeria, History, Geography, Culture, Religion, or another narrower/broader taxonomy.

Provider quality and licensing still matter, but we should solve the category problem pragmatically first and avoid premature provider perfection or multi-provider complexity unless it is necessary for reliability.

### What happens after the three categories
Once Africa & Nigeria, Bible, and Current Affairs are functioning:
1. Run a full V1 category and quiz-flow stability pass.
2. Verify internet-loss/error behavior, question retrieval, duplicate/recent-history behavior, scoring, ads, navigation, results, and repeated sessions across all categories.
3. Treat the existing React/Vite/Capacitor app as the validated V1/reference implementation.
4. Conduct a technical/product audit before major changes.
5. Revisit the planned brand/company name, application/package identity, native Android architecture, UI/UX redesign, accounts, billing, and broader learning-platform work.

The native Android direction and new brand are **planned future decisions, not current implementation tasks**. Do not rename the package, migrate the stack, or replace the current UI solely because these plans have been discussed.

---

## 18. Bible connectivity model
The app will distinguish between offline-capable Bible reading and online-required quiz/online services.

At startup, when offline, the future UX should explain:
“No internet connection. Bible reading is available offline, but quizzes and online features require an internet connection.”

Quiz entry:
“Internet connection required. Please connect to the internet to start a quiz.”

If connectivity disappears during an online flow:
“Connection lost. Please reconnect to continue.”

The exact final wording belongs to the UI/UX phase.

Connectivity should be monitored throughout the app, not only once at launch.

## 19. Offline/cache status
The existing question cache/recent-history foundation is not full offline quiz support.

- Bible Library: intended to work offline.
- Online quizzes: require internet.
- Current Affairs: requires internet for fresh content.
- Africa & Nigeria online question delivery: requires internet.
- Science/General new question retrieval: requires internet.

Future reliability work:
- controlled retry/backoff
- clear connectivity messaging
- cache-first behavior only where appropriate
- no indefinite network waiting
- explicit provider-failure handling


The cache foundation exists, but full offline/retry behavior is **not finished**.

Current Science behavior:
- cached Science questions can be used;
- small difficulty buckets trigger a Worker fetch;
- if fewer than 10 usable questions remain, the engine throws `NOT_ENOUGH_QUESTIONS:science`;
- there is no static-bank fallback.

Future work:
- controlled retry/backoff
- clearer connection messaging
- reliable cache-first behavior when sufficient cached questions exist
- no indefinite network waiting
- explicit handling of temporary provider failures

## 20. Duplicate/freshness rules
1. Validate/filter provider responses.
2. Deduplicate the IndexedDB pool by question ID.
3. Avoid recent-history IDs when enough alternatives exist.
4. Avoid duplicate IDs within the current quiz.
5. Current Affairs must carry publication/freshness metadata.
6. Current Affairs must be refreshed online rather than relying indefinitely on old cached material.

## 21. Current Affairs history
A prototype Current Affairs bank was previously created from 30 fact pairs and expanded into 120 playable questions. A Debug APK confirmed the category/interface worked.

The prototype was intentionally removed from `main` because V1.1 is moving to online sourcing rather than keeping the old static bank as fallback.

## 22. Important recent commits/checkpoints
### General Knowledge question-engine integration
`40fdd0f3d1dc775ba878e19c8ffe55b6f15e22dd`

### Question engine
`ec9d96e9eed9e5084db65331d6a6ab25d961d79c`

### App integration
`1ba48ce11b534410ac15aad6684fbe9a110274ad`

### Static Current Affairs removal
`abab570a84a221440df1653949b22a3f444efa`

### Worker source-of-truth
`4d8da6cf46eba5abd340d7d7fe8db9fa7e6f6f00`

### Worker CORS
`b199c69b9d64f59256da223dd9524f12605ea4bb`

### Wrangler configuration
`7c20c6d441b69fe6175670582d12b80b836d0edd`

### Cloudflare Git deployment trigger checkpoint
`7cb664aa204000429ea8adaa782bd8d6dfee4d1e`

### Release workflow checkpoint
`38f83541d6017ee2e23ee89844dededa687d54aa`

## 23. Firebase / V2 — PAUSED, NOT ABANDONED
V2 architecture:
**Firebase Authentication + Firestore + Firebase Cloud Functions**.

Firebase project: `project-269333544747`  
Firestore location: `africa-south1` (Johannesburg)

Auth:
- Email/Password enabled
- Google enabled

V2 remains paused. Do not modify `v2-development` while V1.1 work is active.

## 24. Exact next steps — CURRENT ROADMAP

### Phase A — Provider/source research
1. Research reliable Africa & Nigeria question/content providers, including commercial rights, quality, freshness and API availability.
2. Research Current Affairs/news providers with suitable licensing, freshness metadata, quotas and commercial use.
3. Continue Bible quiz provider/licensing research; Quizarama is a candidate but not approved for integration.
4. Verify the World English Bible Catholic edition/source and its redistribution/software rights before implementation.
5. Define category-specific data-model extensions.

### Phase B — Backend implementation, one category at a time
6. **Africa & Nigeria — COMPLETE / VERIFIED; no further implementation required for this checkpoint.**
7. **Current Affairs — next implementation focus:** finalize a free/usable provider strategy, implement the Worker endpoint, normalize freshness/source metadata, integrate with the Question Engine, and Android-test the category.
8. Test Current Affairs freshness, duplicate avoidance, source metadata, and failure handling.
9. **Bible — research/foundation only during V1:** preserve the verified WEBC source decision and source packages; do not build the full Bible UI into the current React/Vite app.
10. Future native Android phase: implement the offline Bible Library, reader, explicit user-controlled voice reading, and online Bible Quiz.
11. Android-test the future Bible experience when the native migration begins.
12. Keep the current V1 Bible entry as a lightweight Coming Soon / In Development state until then.

### Phase C — Major UI/UX redesign
13. Review ui-ux-project.md using the now-known product architecture.
14. Map the complete user journey and final information architecture.
15. Wireframe Home, Categories, Bible, Quiz, Results, Connectivity/Error and Settings.
16. Define the reusable design system.
17. Create high-fidelity screens/prototype.
18. Test the design on the Oppo A56.
19. Implement the final redesigned product in the planned native Android application after the design and architecture are stable. The current React/Vite/Capacitor app remains the V1 reference implementation and is not the target for the full app-wide navigation redesign.

### Phase D — Reliability and regression
20. Implement centralized connectivity monitoring.
21. Improve retry/backoff and user-facing error states.
22. Verify online-required quiz behavior.
23. Verify offline Bible reading.
24. Verify recent-question avoidance across all online categories.
25. Verify timer/scoring/streak behavior.
26. V1.1.4 AdMob startup/loading/App Open and screen-aware banner placement validation — **PASSED on Debug/test ads** (historical validation checkpoint).
27. Verify AdMob flows again during final Release/regression testing with appropriate production/test-device safeguards.
28. Run full regression testing.

### Phase E — Production release
29. Increase Android versionCode above 7 for the next production release.
30. Build signed Release APK/AAB using the permanent production key.
31. Verify signatures.
32. Test signed Release installation/update over the previous release without uninstalling.
33. Update the Richard Studios website only after release validation passes.
34. Retest the public download/install/update path.
35. Keep billing architecture synchronized across `project.md`, `commercial-monetization.md`, and `ui-ux-project.md`; do not implement billing until the planned commercial/account foundation is ready.


## Current Affairs Phase 2 implementation checkpoint — 23 September 2026

Phase 2 has started. The first verified fact seed is now stored in worker/current-affairs/data/phase2-initial-facts.js.

The seed covers Nigeria's federal structure/current leadership and all 36 states, Africa/AU/ECOWAS facts, UN/WHO institutional facts, Nigerian economic institutions, IMF/WTO facts, and initial sports/Olympic facts. The dataset is fact-first; the question generator and production current_affairs route have not been changed yet.

Current Affairs remains separate from the existing NewsData integration. NewsData is reserved for the future News Quiz / Current Events experience.

Commercial architecture remains a design constraint: future content can carry an access-tier classification, but no premium locks, billing or entitlement enforcement are being implemented during this Phase 2 work.

Next: continue expanding and verifying the eight-domain knowledge base, then complete schema/update/supersession review before Phase 3 question generation.


## Current Affairs Phase 2 continuation — 23 September 2026

The verified Current Affairs seed has been expanded with additional institutional and economic relationships and future-only access-tier metadata. No premium enforcement or quiz-generation integration has been added. Continue Phase 2 expansion and validation before Phase 3.

## Current Affairs Phase 2 systematic expansion checkpoint — 23 September 2026

The Current Affairs fact layer has been expanded across the remaining planned domains: Nigeria, Africa, World Geography, Economy, International Organizations, Sports, and Science & Technology. The work remains isolated from the existing NewsData integration, which remains reserved for the future News Quiz / Current Events product.

No Question Bank or question-generation implementation has started. The immediate sequence is now: **complete Phase 2 expansion → audit/validate facts and sources → define update/supersession handling → Phase 3 question generation → later Question Bank architecture.**

AdMob and the existing production quiz categories remain untouched by this Current Affairs content expansion.

## Phase 2 audit checkpoint — 23 September 2026

The Phase 2 audit found that the earlier expansion pass was not yet complete: Sports and Science & Technology coverage had not been fully inserted into the fact array, and one ECOWAS source ID needed normalization. These issues were corrected in the knowledge-base file. The current audit confirms a fact-first dataset with complete required fields for the active records, no duplicate fact IDs, and source references normalized to the source registry. Phase 2 remains in final validation rather than being declared production-complete until the full source/freshness/content-coverage review is finished.