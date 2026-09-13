# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 13 September 2026  
**Project stage:** V1.1 improvement phase — Current Affairs has been added and tested successfully. Cloudflare intermediary Worker is created and running. AdMob manager separation remains to be wired/verified. V2 Firebase backend remains intentionally paused.

## 1. Project identity
- App: Daily Quiz & Challenge
- AppDeploy project ID: `daily-quiz-challenge-zd50r1`
- Stack: React + Vite + Capacitor 8.4.2
- Android package ID: `com.richard.dailyquizchallenge`
- GitHub: `richardoha25-web/daily-quiz-challenge`
- Developer/brand: Richard Studios
- Development is phone/cloud based; no PC/laptop.

## 2. Branch strategy — IMPORTANT
### V1 / V1.1
- Active branch: `main`
- Continue V1.1 work on `main` unless a separate V1 branch is explicitly created.

### V2
- V2 branch: `v2-development`
- Keep V2 untouched during V1.1 work unless explicitly requested.
- Do not merge V1.1 changes into V2 merely to synchronize branches.

### Historical AdMob branch
- `fix/admob-preload-lifecycle`
- Preserve it; its earlier lifecycle implementation is not considered the final V1.1 implementation.

## 3. V1 baseline
V1 remains the working fallback baseline:
- 10 questions per quiz
- 15 seconds per question
- 100 base points
- streak tracking
- best-score/trophy display
- Original categories: General Knowledge, Bible, Africa & Nigeria, Science

The old question system is a small static/template-based bank, not a true 400-question curated bank. Repetition and weak difficulty variety are known problems.

## 4. V1.1 objectives
V1.1 is a substantial improvement of V1 while V2 is paused. It must not depend on Firebase.

Goals:
1. Reliable AdMob lifecycle/recovery.
2. App Open ads.
3. Rewarded Interstitial ads.
4. Better Banner, Interstitial and Rewarded handling.
5. Explicit Android versioning and safe release updates.
6. Large, high-quality question system.
7. Easy/Medium/Hard difficulty.
8. Duplicate and recent-question prevention.
9. Internet-powered question replenishment with offline fallback.
10. Five categories including Current Affairs.
11. Better quiz/feedback/results/streak UI.
12. Properly signed V1.1 build and update testing.

## 5. Current Affairs — IMPLEMENTED AND TESTED
A new file exists on `main`:
- `src/currentAffairs.ts`
- Checkpoint blob SHA: `bf21ec5ed788177da91d5e1bf161e83afa99d983`

It currently contains **30 fact pairs**, which the existing `makeQuestions()` system expands into **120 playable questions** (4 template variants per fact).

Current Affairs was added to `src/App.tsx` as the `Current Affairs` category with icon `📰`.

The user installed and tested the current V1.1 interface and confirmed that the Current Affairs category, questions and interface are working as planned.

**Quality note:** the current 120-question set is a prototype/template-expanded bank, not 120 individually authored MCQs. It must later be upgraded to a genuinely high-quality bank with direct question wording, difficulty metadata, explanations and source metadata.

## 6. Latest App.tsx checkpoint
Current Affairs integration was committed to `main` in commit:
`f05d9d92fd2860e8faf36693c5fdf351ed22d1ed`

App.tsx checkpoint blob SHA:
`2da7adb586a912fb5667c4a131ef5e67d98c9261`

Do not assume this App.tsx contains the final separate AdMob manager architecture; verify before making claims about it.

## 7. AdMob status
### Production IDs
- App ID: `ca-app-pub-8496227439538798~7943409473`
- Banner: `ca-app-pub-8496227439538798/2899800506`
- Interstitial: `ca-app-pub-8496227439538798/8159866041`
- Rewarded: `ca-app-pub-8496227439538798/9137905794`
- App Open: `ca-app-pub-8496227439538798/2455637861`
- Rewarded Interstitial: `ca-app-pub-8496227439538798/6852855908`

Never store account passwords, payment credentials, signing passwords or provider secrets here.

### Current implementation status
The current `main` App.tsx contains inline AdMob lifecycle/preload/retry logic including freshness tracking, duplicate-load prevention, retry/backoff, banner retry, preload/wait/show flows, replacement preloads, foreground recovery, App Open minimum-show-gap logic, rewarded +20 points and Rewarded Interstitial preloading.

A separate `src/adMob.ts` exists historically, but it is **not confirmed as the active integrated manager**. Before calling the manager “separated,” verify that App.tsx imports and uses it and that the old inline manager is removed or intentionally delegated.

Ad availability can never be guaranteed because fill, inventory, network, account status and policy/frequency controls affect impressions.

Use Google's test ads during development/testing where appropriate; avoid repeated production-ad testing that could create invalid traffic.

## 8. Android versioning and update rules
Package ID must remain `com.richard.dailyquizchallenge`.

Planned versions:
- V1.0 → `versionName 1.0.0`, `versionCode 1`
- V1.1 → `versionName 1.1.0`, `versionCode 2`
- V1.2 → `versionName 1.2.0`, `versionCode 3`

The previous “package conflicts with the other” problem is primarily associated with APKs signed by different certificates, such as debug versus release. VersionCode alone cannot fix a signing-certificate mismatch.

### Permanent release-signing rules
- Use the existing permanent production release key.
- Do not generate a replacement production keystore.
- Every public update must use a higher `versionCode`.
- Website APKs must be release-signed.
- Never expose or record signing passwords or keystore contents.

**Testing distinction:** the V1.1 APK previously installed/tested during the Current Affairs checkpoint was a **DEBUG APK**, not the final signed release APK. The final update-install test must use the properly signed V1.1 release APK.

## 9. Android release workflow — VERIFIED / DO NOT TOUCH UNNECESSARILY
Actual file:
`.github/workflows/android-release.yml`

Verified checkpoint blob SHA:
`38f83541d6017ee2e23ee89844dededa687d54aa`

The workflow currently builds the web app, adds/syncs Android, forces V1.1 `versionCode 2` and `versionName "1.1.0"`, injects the AdMob App ID, uses Java 21, restores the permanent release keystore from `KEYSTORE_BASE64`, verifies alias `dailyquiz`, configures release signing, builds a signed release APK and AAB, verifies signatures, uploads artifacts, and cleans temporary signing files.

**Important checkpoint:** this workflow was inspected after the user noticed it had been touched previously. The recent Current Affairs work did **not** intentionally modify it. Leave it alone unless a specific release-build problem requires a change.

Expected active workflows:
- `.github/workflows/android-debug.yml`
- `.github/workflows/android-release.yml`

Obsolete workflows removed:
- `.github/workflows/generate-keystore.yml`
- `.github/workflows/keystore-to-base64.yml`

## 10. V1.1 question model — DECIDED
### Categories
1. General Knowledge — `general`
2. Science — `science`
3. Bible — `bible`
4. Africa & Nigeria — `africa_nigeria`
5. Current Affairs — `current_affairs`

### Difficulties
- `easy`
- `medium`
- `hard`

Normal 10-question quizzes should aim for approximately 3 Easy / 4 Medium / 3 Hard where inventory permits.

### Standard question structure
```text
id
category
difficulty
question
options[]
correctAnswer
explanation?
source
sourceId?
isRemote
createdAt
updatedAt
```

Exactly four options are required: one correct answer and three distinct plausible wrong answers.

## 11. Question-engine architecture — DECIDED
```text
                 DAILY QUIZ V1.1
                       |
                 QUESTION ENGINE
                       |
        +--------------+--------------+
        |              |              |
      LOCAL         INTERNET        CACHE
      BANK           SOURCES       QUESTION POOL
        |              |              |
        +--------------+--------------+
                       |
                   NORMALIZE
                       |
                    VALIDATE
                       |
                  DEDUPLICATE
                       |
                SAVE NEW QUESTIONS
                       |
                 FILTER CATEGORY
                       |
                FILTER DIFFICULTY
                       |
             REMOVE RECENT HISTORY
                       |
                    SHUFFLE
                       |
                  SELECT 10
                       |
                     QUIZ
```

Selection workflow:
1. Check internet.
2. Check local/cache pool.
3. Use suitable cached questions when sufficient.
4. If insufficient and online, fetch a batch from the appropriate source.
5. Normalize and validate.
6. Reject duplicates from the current quiz, recent history and existing pool.
7. Save valid unique questions.
8. Combine local + cached + fresh questions.
9. Filter category and difficulty.
10. Remove recent questions where possible.
11. If exact difficulty is insufficient, fall back to the nearest available difficulty after exhausting exact matches.
12. Shuffle and select 10.
13. Record used IDs in recent history.
14. Retry network/API failures with controlled backoff, then use local/cache.
15. Never wait indefinitely for the network.

## 12. Storage architecture — DECIDED
Hybrid client-side storage:
- `localStorage` for lightweight settings, streak data and recent-question references.
- IndexedDB for the growing question database/cache.

IndexedDB database: `DailyQuizDB`

Stores:
1. `questions`
2. `recent_history`
3. `sync_metadata`
4. `settings`

No artificial question-count cap. Unique valid questions may accumulate until practical device storage is reached. Storage exhaustion must be handled gracefully. Duplicate copies must still be rejected.

No Android external-storage permission is required for this design.

## 13. Offline / internet behavior — DECIDED
Internet is important but must not become a single point of failure.

Offline behavior:
- show a small notice such as **“No internet connection”**;
- allow quizzes using the local/cache pool;
- do not block startup indefinitely;
- replenish the pool when internet becomes available.

Current Affairs has stricter freshness handling than evergreen categories.

## 14. Internet question sources — RESEARCH STATUS
### Open Trivia DB
Candidate for General Knowledge and Science:
- public JSON API;
- no API key;
- up to 50 questions per call;
- category/difficulty/type filters;
- session tokens available;
- rate limits apply;
- HTML/special-character decoding required;
- licensing/attribution requirements must be respected.

### Current Affairs
A news provider requiring a private API key should be accessed through the secure intermediary, never directly from the APK.

NewsData.io was evaluated as a possible provider. Its current free-tier and commercial-use terms must be rechecked before final implementation; it is not permanently locked in.

## 15. Cloudflare intermediary — CREATED AND RUNNING
A Cloudflare Worker has already been created for V1.1.

Worker name:
`daily-quiz-intermidiary`

Worker URL:
`https://daily-quiz-intermidiary.richardo25.workers.dev`

Root response:
`Daily Quiz & Challenge intermediary is running.`

Health endpoint:
`GET /api/health`

Expected response:
```json
{"ok":true,"service":"daily-quiz-intermediary","version":"1.0"}
```

Current Worker implementation is intentionally minimal: it provides the health endpoint and root response. It is **not yet the full question/news intermediary**.

Current checkpoint Worker code:
```js
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return new Response('{"ok":true,"service":"daily-quiz-intermediary","version":"1.0"}', {
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    return new Response("Daily Quiz & Challenge intermediary is running.");
  }
};
```

The Worker is a secure bridge for providers requiring private API keys, not the quiz engine or permanent question database. Never put provider API keys in the APK or this project record.

## 16. Planned Worker API contract — DESIGNED, NOT FULLY IMPLEMENTED
Planned endpoints:
```text
GET /api/health
GET /api/questions
GET /api/current-affairs
```

Examples:
```text
/api/questions?category=africa_nigeria&difficulty=medium&limit=20
/api/current-affairs?limit=20
```

Allowed categories:
- `general`
- `science`
- `bible`
- `africa_nigeria`
- `current_affairs`

Allowed difficulties:
- `easy`
- `medium`
- `hard`

Initial maximum batch size: `20`.

Planned response:
```json
{
  "ok": true,
  "questions": [
    {
      "id": "provider-12345",
      "category": "science",
      "difficulty": "medium",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": "...",
      "explanation": "...",
      "source": "provider-name",
      "sourceId": "12345",
      "isRemote": true
    }
  ]
}
```

Planned errors:
- `INVALID_REQUEST` → 400
- `RATE_LIMITED` → 429
- `PROVIDER_UNAVAILABLE` → 503
- `PROVIDER_TIMEOUT` → 504
- `NO_QUESTIONS` → 404
- `SERVER_ERROR` → 500

## 17. Duplicate and freshness rules
Three protection levels:
1. Worker response filtering.
2. IndexedDB question-pool comparison.
3. Quiz-selection filtering against current quiz and recent history.

Current Affairs must include publication/freshness metadata and must not be treated like permanent evergreen questions.

## 18. V1.1 UX improvements — PLANNED
- clearer category cards
- progress indicator
- timer presentation
- difficulty/category labels
- readable question typography
- answer feedback
- score/progress visibility
- explanations where appropriate
- improved results screen
- stronger streak presentation
- polished completion flow
- natural fullscreen ad placements

## 19. Firebase / V2 status — PAUSED, NOT ABANDONED
V2 remains planned around **Firebase Auth + Firestore + Firebase Cloud Functions**.

Planned approach: Blaze + Cloud Functions + Firestore when a workable billing method is available.

V2 is paused because the available Nigerian Verve card was not accepted for Google Cloud Billing. A legitimate billing/reseller route is being investigated.

Firebase foundation already completed:
- project: `project-269333544747`
- support email: `richardoha25@gmail.com`
- Firestore default database
- location: `africa-south1` (Johannesburg)
- production mode
- Email/Password Auth enabled
- Google Auth enabled
- collections including `questions`, `answer_keys`, `quiz_results`, `users`, `categories`

Firestore security rules were published and verified: all 8 Rules Playground tests passed. Clients cannot read `answer_keys` or write authoritative question/answer/result data; authoritative quiz-result writes remain intended for trusted backend functions.

## 20. V2 backend architecture — DECIDED, IMPLEMENTATION PAUSED
```text
Android App
    ↓
Firebase Authentication
    ↓
Trusted Firebase Cloud Functions
    ├── validates answers
    ├── reads protected answer_keys
    ├── calculates score/points/streak changes
    ├── checks history/duplicates
    └── writes authoritative Firestore records
```

Planned operations include `/quiz/start`, `/quiz/answer` and `/quiz/finish`.

The client must never be trusted to submit authoritative score, points, streak or quiz-result values.

## 21. Immediate next steps — V1.1
1. Keep `main` as the active V1.1 branch.
2. Do not modify `v2-development`.
3. Do not unnecessarily modify `.github/workflows/android-release.yml`.
4. Verify the separate `src/adMob.ts` manager and wire it into App.tsx if that architecture is still desired.
5. Preserve the strongest AdMob lifecycle behavior while integrating the manager cleanly.
6. Improve Current Affairs from the current 30-fact/120-template prototype into individually authored, sourced, difficulty-tagged questions.
7. Implement Cloudflare `/api/questions` and `/api/current-affairs` when the provider choice and security design are ready.
8. Integrate the question engine, IndexedDB cache, duplicate prevention and freshness logic.
9. Run a full V1.1 functional test.
10. Run the Android release workflow and use the **signed release APK**, not a debug APK, for the final update-install test.
11. Verify that a V1.0 release can update to V1.1 without the previous certificate/package-conflict problem.
12. Only after V1.1 is stable, return to V2 Firebase work.

## 22. Current state checkpoint
```text
V1.0 baseline
     ↓
V1.1 on main
     ↓
Current Affairs added ✅
     ↓
Current Affairs interface/questions tested ✅
     ↓
Cloudflare Worker created and running ✅
     ↓
Android release workflow verified and intentionally left untouched ✅
     ↓
AdMob manager separation ⚠️ verify/wire
     ↓
Question engine + IndexedDB + remote replenishment 🔜
     ↓
Signed V1.1 APK/AAB + update test 🔜
     ↓
V2 Firebase backend (paused)
```

**Critical reminder:** The last installed V1.1 test artifact was DEBUG. The release workflow is the authoritative path for the final signed V1.1 update test.
