# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 17 September 2026  
**Stage:** V1.1 improvement phase. Science online question integration is working at API level; the app question engine is connected; old static question-bank fallback has been removed; latest Debug build #48 succeeded. V2 remains paused.

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

## 4. Important recent commits
### Question engine
`ec9d96e9eed9e5084db65331d6a6ab25d961d79c`

Implemented `src/questionEngine.ts` with:
- `DailyQuizDB` IndexedDB cache
- remote fetching through the Worker
- returned-question validation/normalization
- category/difficulty filtering
- recent-question history
- ID-based deduplication
- no silent local-bank fallback
- Science as the only currently supported online category

### App integration
`1ba48ce11b534410ac15aad6684fbe9a110274ad`

`src/App.tsx` now imports `getQuizQuestions()` and starts quizzes through the question engine. It no longer relies on the old static banks.

### Static Current Affairs removal
`abab570a84a221440df1653949b22a3f444efa`

Message: `Remove obsolete local current affairs question bank`

`src/currentAffairs.ts` is no longer present on `main`. Current Affairs remains a planned **online** category.

### Worker source-of-truth and CORS
`4d8da6cf46eba5abd340d7d7fe8db9fa7e6f6f00`

Added `worker/index.js` to `main` as the Worker source-of-truth.

`b199c69b9d64f59256da223dd9524f12605ea4bb`

Added CORS handling and `OPTIONS` support to `worker/index.js` for browser/WebView access.

### Wrangler configuration
`7c20c6d441b69fe6175670582d12b80b836d0edd`

Added `wrangler.toml` to explicitly deploy:
- Worker name: `daily-quiz-intermidiary`
- Entry point: `worker/index.js`
- Compatibility date: `2026-09-17`

Cloudflare is now connected to GitHub repository `richardoha25-web/daily-quiz-challenge`, branch `main`. The GitHub-connected build has not yet appeared in Cloudflare; the live Worker is still the previous manually deployed version until Cloudflare detects a new `main` commit.

## 5. Current Affairs history
A prototype Current Affairs bank was previously added as `src/currentAffairs.ts` with 30 fact pairs expanded into 120 playable questions. A Debug APK was installed and the category/interface were confirmed working.

The prototype was intentionally removed because V1.1 is moving to online sourcing rather than keeping the old static bank as fallback.

## 6. AdMob
Production IDs:
- App ID: `ca-app-pub-8496227439538798~7943409473`
- Banner: `ca-app-pub-8496227439538798/2899800506`
- Interstitial: `ca-app-pub-8496227439538798/8159866041`
- Rewarded: `ca-app-pub-8496227439538798/9137905794`
- App Open: `ca-app-pub-8496227439538798/2455637861`
- Rewarded Interstitial: `ca-app-pub-8496227439538798/6852855908`

Current `src/App.tsx` contains inline AdMob initialization, preload/retry, freshness checks, foreground recovery, banner recovery, interstitial/rewarded flows, App Open logic, and +20 rewarded bonus handling.

A separate `src/adMob.ts` exists historically, but it is not confirmed as the active manager. Verify imports before refactoring it.

Ad availability is not guaranteed; fill, inventory, network, account and frequency/policy controls can affect availability. Use test ads during development where appropriate.

## 7. Android versioning/signing
Package ID must remain `com.richard.dailyquizchallenge`.

Planned versions:
- V1.0 → `1.0.0`, versionCode `1`
- V1.1 → `1.1.0`, versionCode `2`
- V1.2 → `1.2.0`, versionCode `3`

The previous Android **package conflict** problem is primarily a signing-certificate mismatch (for example Debug vs Release). VersionCode alone does not fix that.

Release rules:
- Keep using the permanent production release key.
- Never generate a replacement production keystore.
- Public updates must use a higher versionCode.
- Website APKs must be release-signed.
- Never store signing passwords/keystore contents in this file.

## 8. Release workflow
`.github/workflows/android-release.yml`

Verified checkpoint SHA:
`38f83541d6017ee2e23ee89844dededa687d54aa`

It builds V1.1 as `versionCode 2` / `versionName 1.1.0`, injects AdMob App ID, uses Java 21, restores the permanent key from `KEYSTORE_BASE64`, signs APK/AAB, verifies signatures and uploads artifacts.

Obsolete workflows removed:
- `.github/workflows/generate-keystore.yml`
- `.github/workflows/keystore-to-base64.yml`

Do not change the release workflow unnecessarily.

## 9. Latest Debug builds
### Run #47
- Run ID: `35046417110`
- Commit: `1ba48ce11b534410ac15aad6684fbe9a110274ad`
- Result: success
- Artifact ID: `10427725440`

### Run #48 — CURRENT
- Run ID: `35046427453`
- Commit: `abab570a84a221440df1653949b22a3f444efa`
- Trigger: automatic push
- Result: **success**
- Artifact ID: `10427078139`

**Use run #48 for current Debug testing. Do not manually run the workflow again just because #47 and #48 finished close together.**

## 10. Question model
Categories:
- General Knowledge → `general`
- Science → `science`
- Bible → `bible`
- Africa & Nigeria → `africa_nigeria`
- Current Affairs → `current_affairs`

Difficulties:
- `easy`
- `medium`
- `hard`

Target 10-question mix where inventory permits: 3 Easy / 4 Medium / 3 Hard.

Standard question fields:
```text
id, category, difficulty, question, options[], correctAnswer,
explanation?, source, sourceId?, isRemote, createdAt, updatedAt
```

Exactly four options are required.

## 11. Actual question-engine architecture
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

Current limitation: **only Science has an online provider.** General Knowledge, Bible, Africa & Nigeria and Current Affairs are not yet provider-connected.

## 12. IndexedDB — actual state
Database: `DailyQuizDB`  
Version: `2`

Implemented stores:
1. `questions`
2. `recent_history`

`questions` is keyed by `id` and has category/difficulty indexes. `recent_history` records question ID, category and usage time.

DB version 2 clears the old question/history stores so stale static-bank data does not contaminate V1.1 testing.

Planned but **not yet implemented**:
- `sync_metadata`
- `settings`

The app still uses `localStorage` for lightweight streak/best-score data.

## 13. Offline/cache status
The cache foundation exists, but full offline/retry behavior is **not finished**.

Current Science behavior:
- cached Science questions can be used;
- small difficulty buckets trigger a Worker fetch;
- if fewer than 10 usable questions remain, the engine throws `NOT_ENOUGH_QUESTIONS:science`;
- there is no static-bank fallback.

Future work: controlled retry/backoff, clearer connection messaging, reliable cache use and no indefinite network waiting.

## 14. Open Trivia DB / Science
Open Trivia DB is the first provider integration target.
- public JSON API
- no API key
- Science & Nature category ID: `17`
- multiple-choice questions provide one correct + three incorrect answers
- URL/HTML decoding and provider errors/rate limits must be handled

## 15. Cloudflare intermediary
Worker name:
`daily-quiz-intermidiary`

**Exact URL:**
`https://daily-quiz-intermidiary.richardoha25.workers.dev`

**Important:** hostname is `richardoha25`, not `richardo25`.

Root response:
`Daily Quiz & Challenge intermediary is running.`

Health endpoint:
`GET /api/health`

The Worker has a previous live deployment. The GitHub-connected CORS/config changes are pending their first Cloudflare build/deployment.

## 16. `/api/questions` — Science API TESTED
Tested request:
```text
/api/questions?category=science&difficulty=medium&limit=20
```

Successful tests:
1. Valid Science/Medium/20 → real Science JSON returned.
2. Invalid category `banana` → `INVALID_REQUEST`, HTTP 400.
3. Invalid difficulty `impossible` → `INVALID_REQUEST`, HTTP 400.
4. Limit `50` → `INVALID_REQUEST`, HTTP 400.

The valid response was confirmed to contain real questions with four options, correct answers, source metadata, `isRemote: true`, IDs and timestamps.

This means the **previously deployed Worker/API side was working**. The next deployment test is to confirm the new GitHub-managed CORS version is live.

## 17. Planned Worker API
```text
GET /api/health
GET /api/questions
GET /api/current-affairs
```

Allowed categories:
`general`, `science`, `bible`, `africa_nigeria`, `current_affairs`

Allowed difficulties:
`easy`, `medium`, `hard`

Initial maximum batch size: `20`.

Planned error mapping:
- `INVALID_REQUEST` → 400
- `RATE_LIMITED` → 429
- `PROVIDER_UNAVAILABLE` → 503
- `PROVIDER_TIMEOUT` → 504
- `NO_QUESTIONS` → 404
- `SERVER_ERROR` → 500

## 18. Duplicate/freshness rules
1. Validate/filter provider responses.
2. Deduplicate the IndexedDB pool by question ID.
3. Avoid recent-history IDs when enough alternatives exist.
4. Avoid duplicate IDs within the current quiz.
5. Current Affairs must eventually carry publication/freshness metadata and cannot be treated as permanent evergreen content.

## 19. Current UI status
Already present:
- five category cards
- online-status wording
- progress counter/bar
- 15-second timer
- answer feedback
- score
- streak/best score
- results screen
- rewarded +20 bonus
- Play Again / Choose Another Category

Planned/improvable:
- user-facing difficulty selection/display
- stronger typography
- explanations
- richer results screen
- stronger streak presentation
- polished completion flow
- natural fullscreen ad placements

## 20. Firebase / V2 — PAUSED, NOT ABANDONED
V2 architecture:
**Firebase Authentication + Firestore + Firebase Cloud Functions**.

Firebase project: `project-269333544747`  
Firestore location: `africa-south1` (Johannesburg)  
Support email: `richardoha25@gmail.com`

Auth:
- Email/Password enabled
- Google enabled

Firestore collections created include:
- `questions`
- `answer_keys`
- `quiz_results`
- `users`
- `categories`

Firestore security rules were published and 8 Rules Playground tests passed. The intended model protects answer keys and authoritative result/question writes from direct client access; trusted backend functions will handle authoritative result writes.

V2 billing is currently blocked by the available Nigerian Verve card not being accepted for Google Cloud Billing. Do not modify V2 during V1.1 work.

## 21. Exact next steps
1. Complete the Cloudflare GitHub-connected deployment of the Worker CORS/config changes.
2. Verify `/api/health` and `/api/questions?category=science&difficulty=medium&limit=20` after deployment.
3. Install/test **Debug run #48**, artifact `10427078139`, with the live Worker.
4. With internet enabled, select **Science** and confirm 10 real online questions appear.
5. Confirm the app is no longer using the deleted static question bank.
6. After a successful online quiz, disable internet and test cached Science questions.
7. Run multiple Science quizzes and check recent-question/duplicate prevention.
8. Fix any app-side question-engine issues found; do not restore the old local fallback.
9. Add General Knowledge provider.
10. Add Bible provider.
11. Add Africa & Nigeria provider.
12. Add Current Affairs online provider.
13. Finish offline/retry behavior and user-facing difficulty selection.
14. Build signed V1.1 APK/AAB with the existing permanent release key.
15. Test the signed V1.1 update against the previous properly release-signed V1 build.
16. Only after signed release verification, replace the old APK on the Richard Studios website.

## 22. Rules for future chats
- **Do not touch `v2-development` during V1.1 work.**
- **Do not restore deleted static question-bank fallback.**
- **Do not claim all five categories are online. Only Science is currently connected.**
- **Do not claim full offline support is finished.**
- **Use `richardoha25`, not `richardo25`, in the Worker hostname.**
- **Do not generate a new production keystore.**
- **Do not store secrets/passwords in this file.**
- **Identify the exact commit/run before testing a new APK.**
- **Use Debug builds for development testing; use the signed Release build for final update-install testing.**

## 23. Current checkpoint
**Completed:** Cloudflare GitHub repository connection; Worker source-of-truth; CORS changes; Wrangler configuration; Worker validation; Science/OpenTDB API integration and browser tests; question-engine foundation; IndexedDB v2 cache/history; removal of old local-bank fallback; removal of obsolete local Current Affairs bank; App integration; Debug build #48.

**Pending:** Cloudflare GitHub-connected deployment of the CORS/config changes → verify live Worker → Android Science test → cache/offline test → recent-question test → expand providers → finish UX/offline behavior → signed V1.1 release → website APK update.

**Paused:** V2 Firebase/Cloud Functions implementation.
