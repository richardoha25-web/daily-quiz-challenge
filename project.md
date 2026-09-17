# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 17 September 2026  
**Stage:** V1.1 improvement/testing phase. Science is now working end-to-end in the Android Debug build through the online question system. Cloudflare Worker deployment and API tests are complete. Next focus: reliability testing, cache/offline testing, ads testing, then adding the remaining online categories. V2 remains paused.

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
IndexedDB question cache
    ↓
Filter category + difficulty
    ↓
Remove recent questions
    ↓
Shuffle / select 10
    ↓
Quiz
```

Current flow:
1. Read cached questions for the selected category.
2. Reject unsupported categories instead of silently using old local banks.
3. For Science, fetch missing Easy/Medium/Hard inventory from the Worker.
4. Validate returned questions and save them to IndexedDB.
5. Deduplicate by question ID.
6. Read recent history.
7. Select approximately 3/4/3 difficulty mix where inventory permits.
8. Shuffle and record selected IDs.
9. Return 10 questions to the app.

## 6. IndexedDB — actual state
Database: `DailyQuizDB`  
Version: `2`

Implemented stores:
1. `questions`
2. `recent_history`

`questions` is keyed by `id` and has category/difficulty indexes. `recent_history` records question ID, category and usage time.

DB version 2 clears the old question/history stores so stale static-bank data does not contaminate V1.1 testing.

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

Current `src/App.tsx` contains inline AdMob initialization, preload/retry, freshness checks, foreground recovery, banner recovery, interstitial/rewarded flows, App Open logic, and +20 rewarded bonus handling.

Ad availability is not guaranteed; fill, inventory, network, account and frequency/policy controls can affect availability. Use test ads during development where appropriate.

**Next AdMob testing:** after the core Science quiz is confirmed stable, test Banner, Interstitial, Rewarded +20, App Open and Rewarded Interstitial behavior separately. Do not treat an ad not filling as an automatic app-code failure.

## 14. Android versioning/signing
Package ID must remain `com.richard.dailyquizchallenge`.

Planned versions:
- V1.0 → `1.0.0`, versionCode `1`
- V1.1 → `1.1.0`, versionCode `2`
- V1.2 → `1.2.0`, versionCode `3`

Previous Android package conflict is primarily a signing-certificate mismatch (for example Debug vs Release). VersionCode alone does not fix that.

Release rules:
- Keep using the permanent production release key.
- Never generate a replacement production keystore.
- Public updates must use a higher versionCode.
- Website APKs must be release-signed.
- Never store signing passwords/keystore contents in this file.

## 15. Release workflow
`.github/workflows/android-release.yml`

Verified checkpoint SHA:
`38f83541d6017ee2e23ee89844dededa687d54aa`

It builds V1.1 as `versionCode 2` / `versionName 1.1.0`, injects AdMob App ID, uses Java 21, restores the permanent key from `KEYSTORE_BASE64`, signs APK/AAB, verifies signatures and uploads artifacts.

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

## 24. Current checkpoint — 17 September 2026
**Completed:**
- V1.1 question-engine foundation
- IndexedDB v2 cache/history
- removal of obsolete static question-bank fallback
- removal of obsolete static Current Affairs bank
- App integration with question engine
- Cloudflare Worker source-of-truth
- CORS/OPTIONS support
- Wrangler configuration
- Cloudflare GitHub-connected deployment
- `/api/health` live verification
- Science/Open Trivia DB API verification for Easy/Medium/Hard
- invalid-request API validation tests
- successful Debug #55 build
- successful Debug #55 Android installation/testing
- successful real Science quiz through the online system
- timer, progression, answer feedback, scoring and streak behavior confirmed

**Current focus:**
- complete Science reliability/cache/offline testing
- test AdMob flows
- add General Knowledge provider
- add Bible provider
- add Africa & Nigeria provider
- add Current Affairs provider
- finish UX/retry/offline behavior
- signed V1.1 release/update testing
- website APK replacement only after signed-release verification

**Paused:** V2 Firebase/Cloud Functions implementation.
