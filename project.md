# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 18 September 2026  
**Stage:** V1.1.3 phone validation PASSED. Science online question delivery, fresh-question behavior, AdMob lifecycle/refresh flows, quiz gameplay, and the signed Release-to-Release update path have all been successfully tested on the phone. Next focus: major quiz UI/UX redesign, then remaining online categories/providers. V2 remains paused.

## Long-term product vision
Daily Quiz & Challenge is intended to become a **long-term, high-quality quiz system for real users**, not just a small one-off quiz app. The goal is a reliable platform with fresh online questions, strong anti-repetition logic, multiple categories, meaningful difficulty, polished gameplay, useful explanations/results, dependable monetization, and a professional UI/UX that people enjoy returning to. Development should favor a stable foundation and incremental verification so future features can grow without bringing back the old static-question problems.

## Current milestone — V1.1.3
- `package.json` version: `1.1.3`.
- Android release: `versionName 1.1.3`, `versionCode 3`.
- Existing permanent production signing key and package ID were preserved.
- **Release-to-Release update test PASSED:** V1.1.3 installed directly over the signed 19 August release APK without uninstalling.
- Release artifact: `daily-quiz-release` from Android Release APK and AAB #5; SHA-256: `a5b4069b863238863d5505c5f6b95a2968bb17d1abcc41f881e96457211fbdc6`.
- Signed APK/AAB build and signature verification completed successfully.
- GitHub emitted only Node.js 20 deprecation and future Ubuntu 26 migration warnings; neither prevented the build.

**V1.1.3 validation result:** the installed signed release was tested on the phone and the planned functional/ad checks passed. Science repeatedly retrieves fresh online questions, the quiz flow works, ads display and refresh/recover as intended, and the app remains usable through repeated testing. No blocking failure was observed in the completed validation pass.

**Immediate next step:** preserve this known-good checkpoint and begin the planned major quiz UI/UX redesign. Do not make unnecessary changes to the working question/ad architecture before the redesign work is scoped.

**Next major product task:** a substantial quiz UI/UX redesign. The current UI is functional but is **not the desired final experience**; do not treat it as final.

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
- Original categories: General Knowledge, Bible, Africa & Nigeria, Science

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
9. Internet replenishment plus cache/offline support.
10. Five categories, including Current Affairs.
11. Better quiz/results/streak UI.
12. Signed V1.1 APK/AAB and update testing.

## 4. Question engine
`src/questionEngine.ts` is implemented with:
- `DailyQuizDB` IndexedDB cache, version 2
- remote fetching through the Cloudflare Worker
- returned-question validation/normalization
- category/difficulty filtering
- recent-question history
- ID-based deduplication
- no silent local-bank fallback
- Science as the currently supported online category

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
Cloudflare Worker ← Open Trivia DB (Science)
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
3. For Science, fetch fresh Easy/Medium/Hard questions from the Worker.
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

Science endpoint has been successfully tested for **Easy, Medium and Hard**. Example:
```text
/api/questions?category=science&difficulty=medium&limit=20
```

The valid response contained real Science questions with four options, correct answers, source metadata, remote IDs and timestamps.

Validation tests previously passed:
- invalid category → `INVALID_REQUEST`, HTTP 400
- invalid difficulty → `INVALID_REQUEST`, HTTP 400
- invalid limit above 20 → `INVALID_REQUEST`, HTTP 400

CORS support and `OPTIONS` handling are present in the Worker for browser/WebView access.

## 9. Open Trivia DB / Science
Open Trivia DB is the first provider integration.
- public JSON API
- no API key
- Science & Nature category ID: `17`
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
### Debug run #55 — CURRENT TEST BUILD
- Run ID: `35165301190`
- Commit: `7cb664aa204000429ea8adaa782bd8d6dfee4d1e`
- Result: **success**
- Artifact ID: `10474812061`
- Artifact name: `daily-quiz-debug-apk`
- APK path: `android/app/build/outputs/apk/debug/app-debug.apk`

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

**Important:** Debug #55 is a Debug APK, not the final production-signed release. Do not use it as the public website APK.

## 11. Android Debug #55 — REAL PHONE TEST STATUS
Debug #55 has now been installed/tested on the Android phone and the Science quiz is working end-to-end.

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
Debug #55 → questionEngine → Cloudflare Worker → Science provider → quiz UI
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

**Current architecture:** `src/adMob.ts` is the single AdMob manager. The obsolete inline AdMob implementation was removed from `src/App.tsx` so there are not two competing ad managers. `App.tsx` now calls the centralized manager for initialization, preloading, recovery, banner/interstitial/rewarded/App Open flows, and +20 handling.

Ad availability is not guaranteed; fill, inventory, network, account and frequency/policy controls can affect availability. Use test ads during development where appropriate.

**AdMob validation result:** Banner, Interstitial, Rewarded +20, App Open and the configured Rewarded Interstitial flow were tested during the V1.1.3 phone validation. Ads were observed working correctly, including the expected refresh/recovery behavior. This is now a completed validation checkpoint; continue monitoring during future builds rather than reopening the architecture without evidence of a regression.

## 14. Android versioning/signing
Package ID must remain `com.richard.dailyquizchallenge`.

Release/version history:
- V1.0 → `1.0.0`, versionCode `1`
- Previous V1.1 release → `1.1.0`, versionCode `2`
- **Current V1.1.3 → `1.1.3`, versionCode `3`**

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

## 16. Category/provider plan
Current categories:
- General Knowledge → `general`
- Science → `science` — **ONLINE PROVIDER WORKING**
- Bible → `bible` — provider not connected yet
- Africa & Nigeria → `africa_nigeria` — provider not connected yet
- Current Affairs → `current_affairs` — provider not connected yet

The next major development phase is to add the remaining providers one at a time, testing each provider at the Worker level before integrating it into the app.

### Provider order
1. **General Knowledge** — add provider/source, validate Easy/Medium/Hard, test 20-question batches, then test Android.
2. **Bible** — add an appropriate reliable/licensed source, validate question quality and answer correctness, then test Android.
3. **Africa & Nigeria** — add a reliable source with Nigeria/Africa coverage, validate difficulty and freshness where needed, then test Android.
4. **Current Affairs** — use an online source with publication/freshness metadata; do not treat current-affairs questions as permanent evergreen content.

For each new category:
```text
Provider → Worker endpoint → browser/API tests → questionEngine → Android test → cache/recent-history test
```

Do not connect all categories at once. One provider/category at a time keeps failures easy to isolate.

## 17. Offline/cache status
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

## 22. Exact next steps — V1.1 roadmap
### Phase A — finish core Science testing
1. Finish the current Debug #55 Science quiz.
2. Run several additional Science quizzes with good internet.
3. Test Easy, Medium and Hard inventory through the app.
4. Check that each quiz contains 10 questions.
5. Check for duplicate questions/options within a quiz.
6. Run multiple quizzes and verify recent-question avoidance.
7. Test the cache by first loading Science online, then temporarily disabling internet and starting another quiz.
8. Test temporary network/provider failure and confirm the app gives a clear recoverable error rather than hanging.

### Phase B — test V1.1 ads
9. Test Banner persistence/recovery.
10. Test Interstitial on results.
11. Test Rewarded +20 bonus.
12. Test App Open behavior after foreground/background transitions.
13. Test Rewarded Interstitial if/when its intended UI flow is enabled.
14. Record any ad-specific failures separately from question-provider failures.

### Phase C — add remaining online categories
15. Add General Knowledge provider.
16. Deploy and test General Knowledge Worker endpoint for Easy/Medium/Hard.
17. Test General Knowledge in Debug Android.
18. Add Bible provider.
19. Deploy/test Bible Worker endpoint and Android flow.
20. Add Africa & Nigeria provider.
21. Deploy/test Africa & Nigeria Worker endpoint and Android flow.
22. Add Current Affairs provider with publication/freshness metadata.
23. Deploy/test Current Affairs endpoint and Android flow.

### Phase D — polish reliability and UX
24. Finish controlled retry/backoff.
25. Improve offline/cache messaging.
26. Add user-facing difficulty selection/display if required by the final design.
27. Improve explanations/results/streak presentation.
28. Verify all five categories reject invalid/empty provider data safely.

### Phase E — production release
29. Build signed V1.1 APK/AAB using the existing permanent release key.
30. Verify APK/AAB signatures.
31. Test the signed V1.1 APK installing/updating from the previous properly release-signed V1 build.
32. Confirm versionCode `2` / versionName `1.1.0`.
33. Only after signed-release verification, replace the old APK on the Richard Studios website.
34. Retest website download/install/update path.

## 23. Rules for future chats
- **Do not touch `v2-development` during V1.1 work.**
- **Do not restore deleted static question-bank fallback.**
- **Do not claim all five categories are online. Only Science is currently connected and verified.**
- **Do not claim full offline support is finished.**
- **Use `richardoha25`, not `richardo25`, in the Worker hostname.**
- **Do not generate a new production keystore.**
- **Do not store secrets/passwords in this file.**
- **Identify the exact commit/run before testing a new APK.**
- **Use Debug builds for development testing; use the signed Release build for final update-install testing.**
- **Inspect relevant files before making changes whenever the cause is uncertain.**
- **Make provider/category changes one at a time and test the Worker before rebuilding Android.**

## 24. Current checkpoint — 18 September 2026

**Completed:**
- V1.1 question-engine redesign: no full-question local cache; recent-history IDs only.
- Obsolete static question-bank fallback remains removed.
- Cloudflare Worker/API and Science/Open Trivia DB flow verified.
- Centralized AdMob manager established in `src/adMob.ts`; duplicate inline App.tsx manager removed.
- `package.json` aligned to version `1.1.3`.
- Release workflow aligned to `versionName 1.1.3` / `versionCode 3`.
- Signed Android Release APK/AAB build #5 succeeded and signatures were verified in the workflow.
- **V1.1.3 signed APK successfully updated over the signed 19 August release without uninstalling.**
- Previous package-conflict update problem is resolved for the tested Release-to-Release path.
- **V1.1.3 phone validation is now PASSED:** repeated Science quizzes successfully fetch fresh online questions and the quiz remains functional through the tested runs.
- **AdMob validation is now PASSED for the tested release:** ads display and update/refresh/recover as intended across the tested flows.
- No blocking functional or ad failure was observed during the completed validation pass.

**Current milestone:**
- **V1.1.3 is a known-good tested checkpoint.** Core online Science delivery, quiz gameplay, recent/fresh question behavior, AdMob flows, and Release-to-Release updating have all been practically validated on the Android phone.
- The current UI is functional but **not the final desired experience**. The next major development task is a substantial quiz UI/UX redesign.

**Immediate next development sequence:**
1. Preserve the current V1.1.3 working checkpoint.
2. Design the new quiz UI/UX before changing core logic.
3. Implement the redesign incrementally on `main`, keeping `v2-development` untouched.
4. Run regression testing after each meaningful UI change, especially quiz flow and AdMob behavior.
5. After the UI pass, continue the remaining online categories one provider at a time: General Knowledge, Bible, Africa & Nigeria, then Current Affairs.

**Long-term goal:**
Build Daily Quiz & Challenge into a great, durable quiz platform that people can repeatedly use and trust. The long-term system should grow into multiple high-quality categories, fresh/current content where appropriate, strong difficulty and anti-repetition systems, polished gameplay/results, dependable monetization, and a professional UI/UX.

**Paused:** V2 Firebase/Cloud Functions implementation.
