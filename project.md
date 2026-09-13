# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 13 September 2026  
**Project stage:** V1.1 improvement phase — question-engine/intermediary architecture designed; Cloudflare account setup not yet completed. V2 Firebase backend work remains intentionally paused.

## 1. Project identity
- App: Daily Quiz & Challenge
- AppDeploy project ID: `daily-quiz-challenge-zd50r1`
- Stack: React + Vite + Capacitor 8.4.2
- Android package ID: `com.richard.dailyquizchallenge`
- Development is phone/cloud based; no PC/laptop.
- GitHub: `richardoha25-web/daily-quiz-challenge`
- Developer/brand: Richard Studios

## 2. Branch strategy — IMPORTANT
### V1 / V1.1
- Active branch: `main`
- V1.1 work is developed on `main` unless a separate V1 branch is explicitly created.

### V2
- V2 branch: `v2-development`
- Keep V2 untouched while V1.1 is being developed unless explicitly requested.
- Do not merge V1.1 changes into V2 merely to synchronize branches.

### Historical AdMob branch
- `fix/admob-preload-lifecycle`
- Preserve it; its earlier lifecycle implementation is not considered sufficient for the final V1.1 goal.

## 3. V1 baseline
V1 remains the working fallback baseline.
- 10 questions per quiz
- 15 seconds per question
- 100 base points
- streak tracking
- best-score/trophy display
- Original categories: General Knowledge, Bible, Africa & Nigeria, Science

The old question system is a small static/template-based bank and is NOT a true 400-question curated bank. Repetition and weak difficulty variety are known problems.

## 4. V1.1 objective
V1.1 is a substantial improvement of V1 while V2 is paused. It must not depend on Firebase.

Main goals:
1. Reliable AdMob lifecycle and recovery.
2. App Open ads.
3. Rewarded Interstitial ads.
4. Better Banner, Interstitial and Rewarded handling.
5. Explicit Android versioning and safe release updates.
6. Large high-quality question system.
7. Easy/Medium/Hard difficulty.
8. Duplicate and recent-question prevention.
9. Internet-powered question replenishment with offline fallback.
10. Five categories including Current Affairs.
11. Better quiz/feedback/results/streak UI.
12. Signed V1.1 build and update testing.

## 5. AdMob status
### AdMob IDs
- App ID: `ca-app-pub-8496227439538798~7943409473`
- Banner: `ca-app-pub-8496227439538798/2899800506`
- Interstitial: `ca-app-pub-8496227439538798/8159866041`
- Rewarded: `ca-app-pub-8496227439538798/9137905794`
- App Open: `ca-app-pub-8496227439538798/2455637861`
- Rewarded Interstitial: `ca-app-pub-8496227439538798/6852855908`

Never store account passwords, payment credentials, signing passwords or other secrets here.

### Current AdMob implementation status
The current `main` App.tsx contains a strong preload/retry/lifecycle implementation with:
- freshness timestamps and maximum ages
- duplicate-load prevention
- retry/backoff
- banner retry
- preload/wait/show flows
- replacement preloads
- foreground recovery
- app-open minimum show gap
- rewarded +20 points flow
- rewarded-interstitial preloading

A separate `src/adMob.ts` was created historically but is not the active integrated implementation; do not assume it is integrated unless verified.

Ad availability can never be guaranteed because fill, inventory, network, account status and policy/frequency controls affect impressions.

## 6. Android versioning and signing
Package ID must remain `com.richard.dailyquizchallenge`.

Planned versions:
- V1.0 → `versionName 1.0.0`, `versionCode 1`
- V1.1 → `versionName 1.1.0`, `versionCode 2`
- V1.2 → `versionName 1.2.0`, `versionCode 3`

The old package-conflict problem was caused by APKs signed with different debug certificates. VersionCode alone cannot solve a signing-certificate mismatch.

### Permanent release-signing rules
- Use the existing permanent production release key.
- Do not generate a replacement production keystore.
- Every public update must use a higher `versionCode`.
- Website APKs must be release-signed.
- Never expose or record signing passwords or keystore contents.

The release workflow uses GitHub Secret `KEYSTORE_BASE64`, alias `dailyquiz`, temporary JKS conversion and artifact verification.

## 7. Android CI
Expected active workflows:
- `.github/workflows/android-debug.yml`
- `.github/workflows/android-release.yml`

Obsolete workflows removed:
- `.github/workflows/generate-keystore.yml`
- `.github/workflows/keystore-to-base64.yml`

Never recreate the removed hard-coded keystore credential.

## 8. V1.1 question system — DECIDED
### Five categories
1. General Knowledge — `general`
2. Science — `science`
3. Bible — `bible`
4. Africa & Nigeria — `africa_nigeria`
5. Current Affairs — `current_affairs`

### Difficulties
- `easy`
- `medium`
- `hard`

A normal 10-question quiz should aim for a controlled mixture, approximately 3 Easy / 4 Medium / 3 Hard where inventory permits. Exact balancing can vary by category and available questions.

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

## 9. Question-engine architecture — DECIDED
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

Exact workflow:
1. Check internet.
2. Check local/cache pool.
3. If enough suitable questions exist, use them.
4. If insufficient and online, fetch a batch from the appropriate source.
5. Normalize and validate.
6. Reject duplicates from the current quiz, recent history, and existing question pool.
7. Save valid unique questions permanently.
8. Combine local + cached + fresh questions.
9. Filter category and difficulty.
10. Remove recent questions where possible.
11. If exact difficulty is insufficient, fall back to the nearest available difficulty after exhausting exact matches.
12. Shuffle and select 10.
13. Record used IDs in recent history.
14. On API failure, retry with controlled backoff and then use local/cache.
15. Never wait indefinitely for the network.

## 10. Storage architecture — DECIDED
Use a hybrid client-side storage model:
- `localStorage` for lightweight settings, streak data and recent-question references.
- IndexedDB for the growing question database/cache.

IndexedDB database:
`DailyQuizDB`

Stores:
1. `questions`
2. `recent_history`
3. `sync_metadata`
4. `settings`

There is **no artificial question-count cap**. Unique valid questions may accumulate until the device's practical storage capacity is reached. Storage exhaustion must be handled gracefully.

Duplicate copies must still be rejected.

No Android external-storage permission is required for this design.

## 11. Offline/internet behavior — DECIDED
Internet is important but must not become a single point of failure.

When the app is offline:
- show a small notice such as **“No internet connection”**;
- still allow quizzes using the local/cache pool;
- do not block startup indefinitely;
- use internet to replenish the question pool when available.

Current Affairs has stricter freshness handling than evergreen categories.

## 12. Internet question sources — RESEARCH MILESTONE
### Open Trivia DB
Evaluated as a candidate for General Knowledge and Science.
- Public JSON API
- No API key
- Up to 50 questions per call
- Category/difficulty/type filters
- Session tokens available for repeat avoidance
- Rate limit applies
- HTML/special-character decoding is required
- Licensing/attribution requirements must be respected

Use it directly from the app only where appropriate; it does not require a secret key.

### Current Affairs
A news provider requiring a private API key should be accessed through the secure intermediary rather than directly from the APK.

NewsData.io has been evaluated as a possible Current Affairs provider. Its current published free tier and commercial-use terms should be rechecked before implementation. It is not yet permanently locked in as the provider.

Other news providers were considered and rejected/not preferred where their free tiers have non-commercial, development-only, restrictive or otherwise unsuitable terms.

## 13. Secure intermediary service — DECIDED
For providers requiring private API keys, use a very small **Cloudflare Worker**.

Architecture:
```text
Daily Quiz V1.1
      |
      | HTTPS
      v
Cloudflare Worker
      |
      | private secret
      v
External provider
      |
      v
Normalized quiz data
      |
      v
Daily Quiz app
      |
      v
IndexedDB
```

The Worker is a secure bridge, not the quiz engine or question database.

### Why Cloudflare Workers
- Designed for small HTTPS/serverless endpoints.
- Workers Free currently provides 100,000 requests/day.
- Free plan allows 50 external subrequests per invocation.
- Cloudflare supports encrypted Worker secrets for API keys/tokens.
- Suitable for a small phone/cloud-managed intermediary.
- No Firebase/V2 billing dependency is required for this V1.1 component.

### Account status
A Cloudflare account is required before the Worker can be created.
The user has reached the Cloudflare sign-up page but **has not yet completed account creation**.

Recommended sign-in method: **Continue with Google**, because it is simple for the user's phone-based workflow and avoids tying Cloudflare login to GitHub's primary-email configuration. GitHub sign-in remains possible and can still be connected for deployment later.

**Important:** do not create the Worker until the account is successfully created and the next step is explicitly confirmed.

## 14. Worker API contract — DESIGNED, NOT IMPLEMENTED
Public endpoints planned:
```text
GET /api/health
GET /api/questions
GET /api/current-affairs
```

### `/api/health`
Connectivity/diagnostic endpoint.

Expected success shape:
```json
{
  "ok": true,
  "service": "daily-quiz-intermediary",
  "version": "1.0"
}
```

### `/api/questions`
Example:
```text
/api/questions?category=africa_nigeria&difficulty=medium&limit=20
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

Initial maximum request batch: `20`.

### `/api/current-affairs`
Example:
```text
/api/current-affairs?limit=20
```

The Worker obtains recent source material, normalizes it to the standard question format and supplies freshness metadata where available.

### Standard response
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

### Error contract
Planned errors:
- `INVALID_REQUEST` → HTTP 400
- `RATE_LIMITED` → HTTP 429
- `PROVIDER_UNAVAILABLE` → HTTP 503
- `PROVIDER_TIMEOUT` → HTTP 504
- `NO_QUESTIONS` → HTTP 404
- `SERVER_ERROR` → HTTP 500

Provider-specific raw errors should not be exposed unnecessarily to the app.

### Worker security principles
- Provider API keys live only in Cloudflare encrypted secrets.
- Never embed provider secrets in the Android APK.
- Validate endpoint parameters and batch limits.
- Use rate limiting/abuse protection.
- Use provider timeouts.
- Never allow the Worker to become an indefinite blocking point for the quiz.
- The public Worker URL itself is not treated as a secret; security comes from server-side credentials, validation, rate limiting and provider protection.

## 15. Question duplicate/freshness rules
Three levels of duplicate protection:
1. Worker response filtering.
2. IndexedDB question-pool comparison.
3. Quiz-selection filtering against current quiz and recent history.

Current Affairs should include publication/freshness metadata and must not be treated like permanent evergreen questions.

## 16. V1.1 quiz-experience improvements
Planned improvements:
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

## 17. Firebase / V2 status — PAUSED, NOT ABANDONED
V2 remains planned around:
**Firebase Auth + Firestore + Firebase Cloud Functions**.

Decision: **Blaze + Cloud Functions + Firestore** when a workable billing method is available.

V2 is paused because the available Nigerian Verve card was not accepted for Google Cloud Billing. A legitimate Google Cloud reseller/billing route is being investigated.

Never give third parties Google passwords, Firebase passwords, OTPs, recovery codes, card PINs or other secrets. Legitimate access must use appropriate Google IAM/billing permissions.

## 18. Firebase foundation already completed
- Public-facing project name: `project-269333544747`
- Support email: `richardoha25@gmail.com`
- Firestore `(default)` database
- Location: `africa-south1` (Johannesburg)
- Production mode
- Blaze billing not yet active
- Email/Password Auth enabled
- Google Auth enabled

Existing top-level collections:
- `questions`
- `answer_keys`
- `quiz_results`
- `users`
- `categories`

`question_001` was migrated with question content/options/category/difficulty/active/random-key/timestamp data, while `answer_keys/question_001` stores the correct answer and explanation.

## 19. Firestore security — DONE AND VERIFIED
Published rules maintain the intended security boundary:
- authenticated users can read `questions`
- authenticated users can read `categories`
- clients cannot read `answer_keys`
- clients cannot write questions/categories/answer_keys/users/quiz_results
- users can read only their own user document
- users can read their own result records when the result's `userId` matches
- default deny rule remains in place

All 8 Rules Playground tests passed. **Security milestone: PASSED.**

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

Planned operations:
- `/quiz/start`
- `/quiz/answer`
- `/quiz/finish`

The client must never be trusted to submit authoritative score, points, streak or quiz-result values.

## 21. V2 planned data structures — designed, not yet created
### Question history
```text
users/{uid}/question_history/{questionId}
  categoryId
  firstSeenAt
  lastSeenAt
  timesSeen
```

A question is considered seen when assigned to a quiz session.

### Quiz sessions
```text
quiz_sessions/{sessionId}
  userId
  categoryId
  questionIds
  selectionMode
  status
  startedAt
  expiresAt
  completedAt
  resultId
```

Suggested values:
- selectionMode: `unseen_first`
- status: `active`, `completed`, `expired`, `abandoned`

## 22. V2 question-selection design
Questions have a stable integer `randomKey`.

Planned flow:
```text
Start quiz
 → authenticated user + category + config
 → backend generates random start integer
 → query active questions around randomKey
 → collect candidates
 → check user history
 → discard already-seen where possible
 → continue/wrap if insufficient
 → shuffle
 → select 10
 → create session
 → record assigned questions in history
```

Avoid downloading the entire question bank.

## 23. V2 source status
The V2 source still contains the V1-style React app and existing AdMob implementation. Firebase SDK/backend calls have not yet been integrated into the Android app source.

V2 Firebase work so far is primarily Console/data/security preparation. The existence of Auth/Firestore does not mean the Android app is already connected to Firebase.

The repository intentionally has no checked-in generated `android/` directory; Android is generated during CI.

## 24. Current milestone tracker
### COMPLETED
- V1 working baseline preserved.
- Cloud Android build pipeline established.
- Permanent release-signing infrastructure established.
- Old debug signing/update conflict understood.
- AdMob Banner/Interstitial/Rewarded units established.
- Strong AdMob preload/retry implementation exists on `main`.
- Firebase Auth/Firestore foundation prepared for V2.
- Firestore security boundary verified with all 8 tests.
- V2 trusted backend architecture selected.
- V1.1 question-engine architecture designed.
- Five-category model selected, including Current Affairs.
- IndexedDB + localStorage hybrid storage selected.
- Unlimited question accumulation policy selected, subject to actual device storage.
- Offline fallback + small no-internet notice selected.
- Cloudflare Worker selected as the secure intermediary architecture.
- Worker endpoint/error/security contract designed.

### CURRENT
**V1.1 improvement phase on `main`.**

Current immediate task:
1. Create/sign into the Cloudflare account.
2. Do NOT create the Worker yet.
3. After account creation, inspect the dashboard and proceed one step at a time.

### NEXT AFTER CLOUDFLARE ACCOUNT
1. Create the Worker only after explicit confirmation.
2. Establish the minimal Worker project structure.
3. Add health endpoint.
4. Add secure secret configuration when a provider key is actually available.
5. Implement Current Affairs provider integration.
6. Test Worker independently.
7. Connect the V1.1 question engine to the Worker.
8. Implement/expand the local question bank and IndexedDB layer.
9. Complete AdMob V1.1 lifecycle improvements.
10. Complete UI improvements.
11. Build signed V1.1 APK.
12. Test update from the existing release-signed V1 without uninstalling.

## 25. V1.1 testing requirements
### AdMob
Test first install, cold start, warm resume, long return, strong/weak/lost/restored internet, preload success/failure, interstitial, rewarded, rewarded interstitial, banner recovery and App Open behavior.

### APK update
Test:
- V1 release → V1.1 release
- same package ID
- same permanent signing key
- higher versionCode
- installation as an update without package/signature conflict

### Questions
Test:
- no duplicate within a quiz
- recent-question suppression
- difficulty balance
- exactly one correct option
- three distinct wrong options
- no duplicate options
- online failure fallback
- malformed online-question rejection
- permanent caching of unique questions
- Current Affairs freshness handling

## 26. Continuity, safety and GitHub rules
1. Do not start the project over.
2. Preserve the existing repository and cloud build pipeline.
3. Keep development phone + cloud based.
4. Never invent IDs, passwords, secrets, build results or configuration values.
5. Never commit signing passwords, keystore Base64 data, Firebase private credentials or payment credentials.
6. Keep package ID `com.richard.dailyquizchallenge`.
7. Keep AppDeploy project ID `daily-quiz-challenge-zd50r1`.
8. Keep V2 `v2-development` untouched during V1.1 unless explicitly requested.
9. Make major changes in stages and verify each cloud build.
10. Keep the working version as a fallback.
11. Do not put secret API keys in the client APK.
12. Keep V2 `answer_keys` inaccessible to the client.
13. Do not allow client write authority over authoritative V2 scores, points, streaks or quiz results.
14. Preserve the permanent release signing key.
15. Do not generate a new production keystore to solve an update problem.
16. Do not hand over Google account credentials to resellers or other third parties.
17. After every major milestone, explicitly tell the user that the milestone is complete.
18. After every major milestone, update this `project.md` before moving into the next major stage.
19. Before any GitHub write, obtain explicit user approval; never silently create, modify, delete or merge repository content.
20. Before V1.1 implementation changes, clearly state which branch is being changed (`main`) and confirm V2 remains untouched.

## 27. Milestone reminder protocol — USER REQUEST
The user wants proactive milestone reminders during development.

After completing a meaningful milestone, the assistant should say clearly:
> **Milestone completed:** [milestone name]
>
> `project.md` should now be updated so we have a reliable checkpoint.

Examples:
- Cloudflare account setup completed
- Worker created
- Worker health endpoint tested
- Provider integration completed
- IndexedDB question engine completed
- AdMob V1.1 lifecycle completed
- Signed V1.1 APK built
- V1 → V1.1 update test passed

Do not wait until the entire V1.1 project is finished to update the continuity record.

## 28. Project vision
Daily Quiz & Challenge should ultimately become an internet-powered quiz platform with fresh, meaningful, high-quality questions, secure backend scoring, duplicate prevention and reliable monetization without requiring a new APK whenever question content changes.

Near-term path:
```text
Current working V1
      ↓
V1.1: stronger ads + versioning + better questions + better gameplay
      ↓
Secure intermediary + growing local question pool
      ↓
Stable public V1.1
      ↓
Resolve Google Cloud billing/reseller path
      ↓
Resume V2
      ↓
Firebase Auth + Cloud Functions + Firestore
      ↓
Secure dynamic quiz platform
```

**Current checkpoint:** The V1.1 architecture is now designed. We are at the Cloudflare account-setup step. No Cloudflare Worker has been created yet, and no V2 work should be touched.