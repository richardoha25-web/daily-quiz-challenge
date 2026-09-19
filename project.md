# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 19 September 2026  
**Stage:** V1.1.4 AdMob Reliability Pass is implemented and **Android Debug validation PASSED**. Science and General Knowledge remain the fully validated online quiz categories. **Current focus: proceed to Africa & Nigeria provider/source research, then Current Affairs and Bible architecture. V2 remains paused.**

## Long-term product vision
Daily Quiz & Challenge is intended to become a **long-term, high-quality quiz system for real users**, not just a small one-off quiz app. The goal is a reliable platform with fresh online questions, strong anti-repetition logic, multiple categories, meaningful difficulty, polished gameplay, useful explanations/results, dependable monetization, and a professional UI/UX that people enjoy returning to. Development should favor a stable foundation and incremental verification so future features can grow without bringing back the old static-question problems.

## Current milestone — V1.1.4 AdMob Reliability Pass
- `package.json` version: `1.1.4`.
- Android release target: `versionName 1.1.4`, `versionCode 4`.
- Existing permanent production signing key and package ID were preserved.
- **Release-to-Release update test PASSED:** V1.1.3 installed directly over the signed 19 August release APK without uninstalling.
- Release artifact: `daily-quiz-release` from Android Release APK and AAB #5; SHA-256: `a5b4069b863238863d5505c5f6b95a2968bb17d1abcc41f881e96457211fbdc6`.
- Signed APK/AAB build and signature verification completed successfully.
- GitHub emitted only Node.js 20 deprecation and future Ubuntu 26 migration warnings; neither prevented the build.

**V1.1.3 validation result:** the installed signed release was tested on the phone and the planned functional/ad checks passed. Science repeatedly retrieves fresh online questions, the quiz flow works, ads display and refresh/recover as intended, and the app remains usable through repeated testing. No blocking failure was observed in the completed validation pass.

**V1.1.4 Android Debug validation result:** the latest Debug APK was installed and tested on the Android phone. The startup/loading experience, test App Open behavior, Home bottom banner, Quiz top banner, Results bottom banner, interstitial, and rewarded +20 flow behaved as expected. Banner placement remained usable and did not block quiz content. Development is using AdMob test ads, so this validates the implementation/lifecycle rather than guaranteeing production ad fill or identical real-ad availability.

**Immediate next step:** begin provider/source research for Africa & Nigeria. Do not switch to production AdMob IDs merely for development testing; production availability can vary with fill, network, inventory and account/frequency controls.

**UI/UX planning update:** a dedicated `ui-ux-project.md` has been created as the blueprint for the future redesign. It is intentionally separate from this file so this project record stays concise. The current UI remains functional but is **not the desired final experience**.

## 1. Project identity
- App: Daily Quiz & Challenge
- Repo: `richardoha25-web/daily-quiz-challenge`
- Active branch: `main`
- V2 branch: `v2-development` — **do not touch during V1.1 work**
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
- Current categories: General Knowledge, Bible, Africa & Nigeria, Science, Current Affairs

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

## 10. Android Debug build — CURRENT
### Latest Debug run #81
- Run ID: `35451028401`
- Commit: `d724e831b1e66e33397a7244a18f302a2f45f49f`
- Result: **success**
- Artifact name: `daily-quiz-debug-apk`
- Purpose: final clean Debug build from the current `main` HEAD for V1.1.4 AdMob validation.

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

## 14. Android versioning/signing
Package ID must remain `com.richard.dailyquizchallenge`.

Release/version history:
- V1.0 → `1.0.0`, versionCode `1`
- Previous V1.1 release → `1.1.0`, versionCode `2`
- **Current V1.1.4 → `1.1.4`, versionCode `4` (release workflow prepared; signed release still pending validation)**
- **Previous V1.1.3 → `1.1.3`, versionCode `3`**

Future releases must use a higher versionCode while preserving the same production signing key and package ID.

Previous Android package conflict is primarily a signing-certificate mismatch (for example Debug vs Release). VersionCode alone does not fix that.

Release rules:
- Keep using the permanent production release key.
- Never generate a replacement production keystore.
- Public updates must use a higher versionCode.
- Website APKs must be release-signed.
- Never store signing passwords/keystore contents in this file.

## 15. Release workflow
`.github/workflows/android-release.yml`

Current verified workflow blob SHA:
`aebcd837f7640705b15d281d0873d5f0bfa8fe4a`

It builds the current release as `versionCode 3` / `versionName 1.1.3`, injects AdMob App ID, uses Java 21, restores the permanent key from `KEYSTORE_BASE64`, signs APK/AAB, verifies signatures and uploads artifacts.

Obsolete workflows removed:
- `.github/workflows/generate-keystore.yml`
- `.github/workflows/keystore-to-base64.yml`

Do not change the release workflow unnecessarily.

## 16. Category/provider roadmap — NEW MASTER PLAN

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

### Africa & Nigeria — NEXT RESEARCH TARGET
Before coding:
- identify reliable Africa/Nigeria question sources
- verify commercial-use rights
- evaluate question quality and freshness
- define Nigeria/Africa topic structure
- define category-specific metadata
- implement through Cloudflare Worker
- test Worker, Question Engine, and Android one stage at a time

Planned content areas include Nigerian history, geography, culture, civic/government knowledge, African history/geography/culture, and notable African figures.

### Current Affairs — RESEARCH TARGET
Current Affairs must be treated as changing content, not a permanent question bank.

Target architecture:
News/current-events source → Cloudflare Worker → question generation/normalization → Question Engine → Quiz.

Questions should carry freshness metadata such as publishedAt, source, topic, and country/region. Old current-affairs content must not remain indefinitely usable simply because it is cached.

### Bible — NEW PRODUCT EXPERIENCE
Bible is no longer treated as only another category card.

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

The intended Bible Library translation is now the **World English Bible (WEB), Catholic edition / Catholic book order where the selected source provides it**.

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

## 17. Bible connectivity model
The app will distinguish between offline-capable Bible reading and online-required quiz/online services.

At startup, when offline, the future UX should explain:
“No internet connection. Bible reading is available offline, but quizzes and online features require an internet connection.”

Quiz entry:
“Internet connection required. Please connect to the internet to start a quiz.”

If connectivity disappears during an online flow:
“Connection lost. Please reconnect to continue.”

The exact final wording belongs to the UI/UX phase.

Connectivity should be monitored throughout the app, not only once at launch.

## 18. Offline/cache status
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

## 18. Duplicate/freshness rules
1. Validate/filter provider responses.
2. Deduplicate the IndexedDB pool by question ID.
3. Avoid recent-history IDs when enough alternatives exist.
4. Avoid duplicate IDs within the current quiz.
5. Current Affairs must carry publication/freshness metadata.
6. Current Affairs must be refreshed online rather than relying indefinitely on old cached material.

## 19. Current Affairs history
A prototype Current Affairs bank was previously created from 30 fact pairs and expanded into 120 playable questions. A Debug APK confirmed the category/interface worked.

The prototype was intentionally removed from `main` because V1.1 is moving to online sourcing rather than keeping the old static bank as fallback.

## 20. Important recent commits/checkpoints
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

## 21. Firebase / V2 — PAUSED, NOT ABANDONED
V2 architecture:
**Firebase Authentication + Firestore + Firebase Cloud Functions**.

Firebase project: `project-269333544747`  
Firestore location: `africa-south1` (Johannesburg)

Auth:
- Email/Password enabled
- Google enabled

V2 remains paused. Do not modify `v2-development` while V1.1 work is active.

## 26. Exact next steps — NEW ROADMAP

### Phase A — Provider/source research
1. Research reliable Africa & Nigeria question/content providers, including commercial rights, quality, freshness and API availability.
2. Research Current Affairs/news providers with suitable licensing, freshness metadata, quotas and commercial use.
3. Continue Bible quiz provider/licensing research; Quizarama is a candidate but not approved for integration.
4. Verify the World English Bible Catholic edition/source and its redistribution/software rights before implementation.
5. Define category-specific data-model extensions.

### Phase B — Backend implementation, one category at a time
6. Implement Africa & Nigeria through the Worker.
7. Test Africa/Nigeria Worker responses.
8. Integrate Africa/Nigeria into the Question Engine.
9. Android-test Africa/Nigeria.
10. Implement Current Affairs through the Worker.
11. Test Current Affairs freshness/source metadata.
12. Integrate Current Affairs into the Question Engine.
13. Android-test Current Affairs.
14. Implement the Bible Library/offline storage after source rights are verified.
15. Implement Bible reader navigation.
16. Implement the online Bible quiz connection.
17. Android-test Bible reading offline and Bible quiz online.

### Phase C — Major UI/UX redesign
18. Review ui-ux-project.md using the now-known product architecture.
19. Map the complete user journey and final information architecture.
20. Wireframe Home, Categories, Bible, Quiz, Results, Connectivity/Error and Settings.
21. Define the reusable design system.
22. Create high-fidelity screens/prototype.
23. Test the design on the Oppo A56.
24. Implement the redesign in React/Vite only after the design is stable.

### Phase D — Reliability and regression
25. Implement centralized connectivity monitoring.
26. Improve retry/backoff and user-facing error states.
27. Verify online-required quiz behavior.
28. Verify offline Bible reading.
29. Verify recent-question avoidance across all online categories.
30. Verify timer/scoring/streak behavior.
31. V1.1.4 AdMob startup/loading/App Open and screen-aware banner placement validation — **PASSED on Debug/test ads**.
32. Verify AdMob flows again during final Release/regression testing with appropriate production/test-device safeguards.
33. Run full regression testing.

### Phase E — Production release
34. Increase Android versionCode above 4 for the next production release.
35. Build signed Release APK/AAB using the permanent production key.
36. Verify signatures.
37. Test signed Release installation/update over the previous release without uninstalling.
38. Update the Richard Studios website only after release validation passes.
39. Retest the public download/install/update path.


