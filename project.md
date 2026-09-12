# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 12 September 2026  
**Project stage:** V1.1 improvement phase; V2 Firebase backend work intentionally paused pending a workable Cloud Billing/reseller solution

## 1. Project identity
- App: Daily Quiz & Challenge
- AppDeploy project ID: `daily-quiz-challenge-zd50r1`
- Stack: React + Vite + Capacitor 8.4.2
- Android package ID: `com.richard.dailyquizchallenge`
- Development is phone/cloud based; no PC/laptop.
- GitHub: `richardoha25-web/daily-quiz-challenge`
- Developer/brand: Richard Studios

## 2. Branch strategy — IMPORTANT
The repository has separate work for V1 and V2.

### V1 / V1.1
- **Main branch:** `main`
- V1.1 improvements are to be developed on `main` unless a separate V1 branch is explicitly created later.
- Main is now the active branch for the current V1.1 improvement phase.

### V2
- **V2 development branch:** `v2-development`
- V2 Firebase/backend work must remain untouched while V1.1 is being developed unless explicitly requested.
- Do not merge V1.1 changes into `v2-development` merely to keep branches synchronized.
- V2 remains a separate future development track.

### AdMob historical work
- Branch: `fix/admob-preload-lifecycle`
- This branch contains the earlier AdMob preload/lifecycle attempt and must not be deleted.
- The previous implementation is no longer considered sufficient for the V1.1 AdMob goal.

## 3. V1 baseline and lessons
V1 is the existing working quiz app and remains the fallback baseline.

Original quiz format:
- 10 questions per quiz
- 15 seconds per question
- 100 base points
- streak tracking
- best-score/trophy display
- categories: General Knowledge, Bible, Africa & Nigeria, Science

The current V1 question system is a small static bank generated from simple fact/answer pairs and templates. This causes excessive repetition and does not provide the desired depth or reliable difficulty variety.

The current source contains roughly 25 fact pairs per category and generates four templated variants per fact, rather than being a true large, curated question bank. Do not treat this as a completed 400-question bank.

## 4. Current V1.1 goal
V1.1 is a substantial improvement of the working V1 while V2 is temporarily paused.

The objective is to make V1 more reliable, engaging and professional without introducing Firebase or requiring the V2 backend.

### V1.1 priorities
1. Rebuild AdMob lifecycle/reliability.
2. Add App Open ads.
3. Add Rewarded Interstitial ads.
4. Keep and improve Banner, Interstitial and Rewarded ads.
5. Add robust ad expiration/staleness handling and foreground recovery.
6. Establish explicit Android `versionCode` and `versionName` for safe future updates.
7. Preserve the permanent release signing key.
8. Expand and improve the question bank.
9. Add Easy, Medium and Difficult questions.
10. Prevent duplicate questions within a quiz.
11. Reduce/restrict recently seen questions using local storage.
12. Explore safe internet-powered question retrieval without Firebase, with local fallback.
13. Improve category selection.
14. Improve answer feedback.
15. Improve score/results presentation.
16. Improve streak presentation.
17. Improve quiz completion flow.
18. Build and test a signed V1.1 APK before distribution.

## 5. V1.1 AdMob architecture — NEW TARGET
The previous `fix/admob-preload-lifecycle` implementation is not considered reliable enough for production-style behavior. The V1.1 goal is a dedicated, event-driven ad lifecycle rather than simple boolean readiness flags.

### Ad formats
- Banner — existing unit
- Interstitial — existing unit
- Rewarded — existing unit
- App Open — new unit to be created
- Rewarded Interstitial — new unit to be created

### Existing AdMob units
- App ID: `ca-app-pub-8496227439538798~7943409473`
- Banner: `ca-app-pub-8496227439538798/2899800506`
- Interstitial: `ca-app-pub-8496227439538798/8159866041`
- Rewarded: `ca-app-pub-8496227439538798/9137905794`

Never record private account credentials, payment details or secrets here. Ad unit IDs are configuration identifiers, not account passwords.

### V1.1 AdMob reliability requirements
The new ad manager should:
- initialize AdMob safely once
- listen for relevant ad lifecycle events where supported
- track successful load timestamps
- treat stale/expired ads as unavailable and reload them
- preload fullscreen ads when appropriate
- immediately begin replacement preload after an ad is consumed/dismissed
- retry failed loads with controlled exponential backoff
- retry/recover when the app returns to the foreground
- handle weak/lost/restored internet without wedging the ad state
- keep banner failure independent from fullscreen ads
- prevent duplicate concurrent load requests
- never block the quiz indefinitely waiting for an ad
- only grant rewarded benefits after a valid reward event/result
- use natural ad placements and respect AdMob policies/frequency considerations

### Important limitation
The app cannot guarantee an ad impression every time. Ad availability depends on network, inventory/fill, account status, geography, policy/frequency controls and other AdMob factors. The goal is to ensure that valid ads are prepared and shown whenever reasonably available, without stale cached state preventing recovery.

### App Open
V1.1 will add an App Open ad manager with:
- cold-start/warm-resume handling
- preload and expiration tracking
- foreground recovery
- safeguards against showing too frequently
- no indefinite startup blocking

### Rewarded Interstitial
V1.1 will add a separate Rewarded Interstitial unit and lifecycle. It must be used at natural transitions and clearly communicate the reward/choice to the user.

### Existing Rewarded behavior
The existing rewarded flow is:
`Watch Ad for +20 Bonus Points → rewarded ad → +20 bonus`

This behavior should be preserved conceptually, but its underlying lifecycle may be replaced with the stronger V1.1 ad manager.

## 6. V1.1 versioning and APK update strategy
The old Android update conflict was caused by installing a debug-signed APK and then attempting to install another APK signed with a different debug certificate. VersionCode alone cannot fix a signing-certificate mismatch.

The old debug APK was uninstalled. Future website-distributed APKs must be release-signed.

### Permanent rules
- Keep package ID: `com.richard.dailyquizchallenge`
- Keep using the existing permanent release signing key.
- Do not generate a new production release keystore.
- Do not rotate the release signing key casually.
- Every released update must use a higher Android `versionCode`.
- `versionName` should also be explicitly maintained.

### Planned sequence
- V1.0 → versionName `1.0.0`, versionCode `1`
- V1.1 → versionName `1.1.0`, versionCode `2`
- V1.2 → versionName `1.2.0`, versionCode `3`
- Continue increasing versionCode for every subsequent release.

The release workflow already restores the permanent PKCS12 keystore from GitHub Secret `KEYSTORE_BASE64`, verifies alias `dailyquiz`, converts it to a temporary JKS, signs the APK/AAB, verifies the artifacts, and removes temporary signing files. Do not expose or record signing passwords or keystore contents.

## 7. Existing Android build/signing infrastructure
Expected workflows:
- `.github/workflows/android-debug.yml`
- `.github/workflows/android-release.yml`

Obsolete workflows already removed from the active branches:
- `.github/workflows/generate-keystore.yml`
- `.github/workflows/keystore-to-base64.yml`

The obsolete keystore workflow contained a hard-coded password and was removed as part of the repository security cleanup. Never recreate or expose that credential.

The release workflow is the correct path for future public APK/AAB distribution.

## 8. Current V1 source/ad implementation status
The current `main` baseline should be treated as the V1 starting point for V1.1.

The existing V1 source contains:
- React/Vite UI
- Capacitor
- `@capacitor-community/admob`
- static question bank
- localStorage streak/best score
- Banner
- Interstitial
- Rewarded
- earlier preload/retry lifecycle logic

The earlier lifecycle uses global readiness booleans and retry timers. It does not adequately model ad expiration over long periods, which is a key reason the V1.1 AdMob system needs a more robust design.

Do not make unrelated Firebase/V2 changes while implementing V1.1.

## 9. V1.1 question-bank redesign
The current question bank is insufficient for the intended experience.

### Required question properties
Every V1.1 question should have:
- stable unique question ID
- category
- difficulty: Easy / Medium / Difficult
- question text
- exactly one correct answer
- three distinct wrong answers
- no duplicate options
- plausible/relevant distractors
- explanation where appropriate
- source/reference metadata where appropriate

### Difficulty target
A normal 10-question quiz should provide a controlled mixture of difficulties, rather than being almost entirely easy template questions.

Initial target can be approximately:
- 3 Easy
- 4 Medium
- 3 Difficult

The exact mix may vary by category and available inventory.

### Categories
- General Knowledge
- Bible
- Africa & Nigeria
- Science

Science may eventually be divided into Biology, Chemistry and Physics.
Africa & Nigeria may include Nigeria, Africa, History, Geography and carefully sourced current affairs.
Bible questions should be factually reliable and must respect Bible translation/copyright requirements.

## 10. V1.1 question-selection and duplicate prevention
The V1.1 quiz engine should:
1. Never repeat the same question within one 10-question quiz.
2. Prefer questions not recently used by the user.
3. Record recently used question IDs in local storage.
4. Exclude recent IDs where enough eligible questions exist.
5. Fall back to older questions when the eligible pool is too small.
6. Avoid repeating the same answer options unnecessarily.
7. Shuffle questions and options fairly.
8. Preserve difficulty balance where possible.

Suggested local-storage structure:
```text
`dq-seen-questions`
  category -> recent question IDs
```

The history should be bounded so it cannot grow indefinitely.

## 11. Internet-powered questions WITHOUT Firebase
V1.1 may use the internet to expand question availability without connecting the app to Firebase.

Target architecture:
```text
             DAILY QUIZ V1.1
                    |
          +---------+---------+
          |                   |
     Local curated bank    Internet source
          |                   |
          +---------+---------+
                    |
             Question engine
                    |
       duplicate + difficulty filter
                    |
               10 questions
```

Important requirements:
- local questions remain available as fallback
- network failure must not break the quiz
- online sources must be evaluated for licensing, reliability, accuracy and API stability
- do not blindly scrape random websites
- Bible questions require especially careful sourcing
- current-affairs questions require recent, trustworthy sources
- no secret API keys may be embedded in the APK
- if a provider requires a secret server-side key, do not put that key in the client

Possible public trivia APIs can be evaluated, but no provider is approved yet. The internet-question architecture is a V1.1 investigation task, not yet implemented.

## 12. V1.1 quiz-experience improvements
### Category selection
Improve category cards with:
- category icon
- description
- question availability
- difficulty information
- clearer selection state

### Quiz screen
Improve:
- progress indicator
- timer presentation
- category/difficulty label
- readable question typography
- answer-button feedback
- score/progress visibility

### Answer feedback
Show clear feedback before advancing, for example:
- correct → positive feedback and points earned
- incorrect → correct answer and optional explanation
- timeout → clear timeout state and correct answer

### Results
Improve the results screen to show:
- final score
- correct answers
- incorrect answers
- streak
- best score
- performance message
- bonus/reward opportunity
- Play Again
- Choose Another Category

### Streak
Make streak status more visible and meaningful while keeping the existing local persistence model for V1.

### Completion flow
Create a polished end-of-quiz experience and use fullscreen ads only at appropriate natural transitions.

## 13. Firebase / V2 status — PAUSED, NOT ABANDONED
V2 remains planned around:
**Firebase Auth + Firestore + Firebase Cloud Functions**.

We previously considered:
1. Spark + external free backend
2. Blaze + Firebase Cloud Functions

The project decision is **Option 2: Blaze + Firebase Cloud Functions + Firestore** because trusted server-side logic is needed for secure scoring, answer validation, duplicate prevention and authoritative game state.

### Why V2 is paused
The user attempted to upgrade the Firebase project to Blaze but only has a Nigerian Verve card. Google Cloud Billing did not accept the available Verve payment method.

A Google Cloud reseller route is being investigated so that an appropriate authorized reseller may provide a supported billing arrangement/payment method for Nigeria.

Elara was contacted because its current site describes Google Cloud authorized reseller activity for the Middle East and Africa and lists a Lagos presence. No response had been received after four days at the time of this update.

A second candidate, Codematic, has strong Google-published evidence of Google Cloud/Workspace Sell/Service Partner status in Africa and Nigerian customer work. No reseller/payment arrangement has been finalized.

### Critical rule
Do not give third parties Google account passwords, Firebase passwords, OTPs, recovery codes, card PINs or other secrets. Any legitimate project access must use appropriate Google IAM/billing permissions.

## 14. Firebase setup already completed — preserve it
Firebase project:
- Public-facing name: `project-269333544747`
- Support email: `richardoha25@gmail.com`
- Firestore database: `(default)`
- Location: `africa-south1` (Johannesburg)
- Production mode
- Billing/Blaze is **not yet active** because the payment-method problem remains unresolved.

Authentication:
- Email/Password enabled
- Google enabled
- a real test Auth user exists
- never record its UID here

Existing Firestore top-level collections:
- `questions`
- `answer_keys`
- `quiz_results`
- `users`
- `categories`

Question `question_001` was migrated to include question content, options, category ID, difficulty, active state, random key and creation timestamp.

`answer_keys/question_001` contains the correct answer and explanation.

## 15. Firestore security — DONE AND VERIFIED
Published rules preserve the security boundary:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /categories/{categoryId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /answer_keys/{questionId} {
      allow read, write: if false;
    }
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;
    }
    match /quiz_results/{resultId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

All 8 Rules Playground tests passed:
1. Authenticated read `questions/question_001` → Allowed
2. Authenticated read `answer_keys/question_001` → Denied
3. Authenticated read `categories/bible` → Allowed
4. Authenticated update `questions/question_001` → Denied
5. Authenticated update `answer_keys/question_001` → Denied
6. Authenticated update own `users/{uid}` → Denied
7. Authenticated create `quiz_results/test_result_001` → Denied
8. Unauthenticated read `questions/question_001` → Denied

**Security milestone: PASSED.**

## 16. V2 backend architecture — DECIDED, IMPLEMENTATION PAUSED
```text
Android App
    ↓
Firebase Authentication
    ↓
Trusted Firebase Cloud Functions
    ├── validates answers
    ├── reads protected answer_keys
    ├── calculates score
    ├── calculates points
    ├── calculates streak changes
    ├── checks question history/duplicates
    └── writes authoritative Firestore records
```

Planned operations:
- `/quiz/start`
- `/quiz/answer`
- `/quiz/finish`

The client must never be trusted to submit its own authoritative score, points, streak or quiz result.

## 17. V2 planned data structures — designed, not yet created
### Question history
```text
users/{uid}/question_history/{questionId}
  categoryId
  firstSeenAt
  lastSeenAt
  timesSeen
```

A question is considered seen when assigned to a quiz session, not only after answering.

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

These collections must remain backend-controlled.

## 18. V2 question selection design
Each question has a stable integer `randomKey`.

Planned flow:
```text
Start quiz
 → authenticated user + category + quiz config
 → backend generates random start integer
 → query active questions around randomKey
 → collect candidate pool
 → check user history
 → discard already-seen where possible
 → continue/wrap if insufficient
 → shuffle eligible candidates
 → select 10
 → create quiz session
 → record assigned questions in history
```

Avoid downloading the entire question bank.

## 19. V2 source-code status
The V2 source currently still contains the V1-style React app body and the existing AdMob implementation. Firebase SDK/backend calls have not yet been integrated into the app source.

V2 Firebase work completed so far is primarily Firebase Console/data/security preparation. Do not interpret the existence of Firestore/Auth setup as meaning the Android app is already connected to Firebase.

The current repository tree intentionally has no checked-in generated `android/` directory; Android is generated during CI.

## 20. V2 future roadmap
V2 resumes after a workable billing solution is available and V1.1 is sufficiently stable.

Planned V2 stages:
1. Resume from the existing V2 Firebase foundation.
2. Ensure Blaze/Cloud Functions billing is safely configured.
3. Create backend scaffold.
4. Create `question_history` and `quiz_sessions` through backend-controlled design.
5. Update Firestore rules for the final backend architecture.
6. Connect V2 app to Firebase Authentication.
7. Implement trusted question retrieval.
8. Implement secure answer submission and scoring.
9. Implement history/duplicate prevention.
10. Build dynamic General Knowledge.
11. Build Bible book/chapter selection.
12. Build Africa/Nigeria/current affairs.
13. Build Science Biology/Chemistry/Physics.
14. Add robust network handling.
15. Redesign V2 UI.
16. Integrate/verify AdMob using the lessons from V1.1.
17. Test weak/lost/restored internet.
18. Test question quality and duplicate prevention.
19. Test account persistence and backend-controlled scores.
20. Build signed APK/AAB.
21. Complete Play Store preparation/submission when financially and technically ready.

## 21. Current active milestone — V1.1
### COMPLETED FOUNDATION
- Existing V1 app established.
- Existing cloud Android build pipeline established.
- Permanent release signing infrastructure established.
- Old debug APK conflict understood and old debug installation removed.
- AdMob Banner, Interstitial and Rewarded units established.
- Earlier AdMob preload/lifecycle attempt completed but is now considered insufficient for the desired long-term reliability.
- Firebase project/Auth/Firestore/security foundation completed for future V2.
- Firestore security boundary verified with all 8 tests passed.
- V2 trusted backend architecture selected: Blaze + Cloud Functions + Firestore.
- V2 deliberately paused while billing/reseller options are investigated.

### CURRENT
**V1.1 improvement phase on `main`.**

### NEXT IMMEDIATE STEPS
1. Create App Open AdMob unit.
2. Create Rewarded Interstitial AdMob unit.
3. Provide those two ad unit IDs for implementation.
4. Replace the old V1 AdMob lifecycle with a stronger event-driven manager including expiration and foreground recovery.
5. Add explicit Android versionCode/versionName to the release process.
6. Expand the question bank with stable IDs and difficulty levels.
7. Add local duplicate/recent-question prevention.
8. Investigate safe internet-powered question sources with local fallback.
9. Improve category, quiz, feedback, results, streak and completion UI.
10. Build and test V1.1 signed APK.
11. Test updating from the existing release-signed V1 without uninstalling.

## 22. V1.1 testing requirements
### AdMob
Test:
- first install
- cold start
- warm resume
- return after hours/days
- strong internet
- weak internet
- temporary loss of internet
- restored internet
- ad loaded before trigger
- ad unavailable at trigger
- interstitial after quiz completion
- rewarded bonus flow
- rewarded interstitial flow
- banner recovery
- App Open recovery

### APK updates
Test:
- V1 release → V1.1 release update
- package remains `com.richard.dailyquizchallenge`
- same permanent release signing key
- higher versionCode
- Android installs as update without package/signature conflict

### Questions
Test:
- no duplicate within a quiz
- recent-question suppression
- difficulty distribution
- exactly one correct option
- three distinct wrong options
- no repeated option values
- online failure fallback
- malformed online question rejection

## 23. Continuity and security rules
1. Do not start the app over.
2. Preserve the existing repository and cloud build pipeline.
3. Keep development phone + cloud based.
4. Never invent private IDs, passwords, secrets, build results or configuration values.
5. Never commit signing passwords, keystore Base64 data, Firebase private credentials or payment credentials.
6. Keep package ID `com.richard.dailyquizchallenge`.
7. Keep AppDeploy project ID `daily-quiz-challenge-zd50r1`.
8. Do not assume the old AdMob preload implementation is sufficient.
9. Do not make V1.1 changes to V2 unless explicitly requested.
10. Keep V2 `v2-development` untouched during the V1.1 phase.
11. Make major changes in stages and verify each cloud build.
12. Keep the working version as a fallback.
13. Update this document after major milestones.
14. Do not assume the static V1 question bank is sufficient.
15. Do not put secret API keys in the client APK.
16. Do not allow users to modify Firebase Auth UID.
17. Keep `answer_keys` inaccessible to the client in V2.
18. Do not give client write authority over authoritative V2 scores, points, streaks or quiz results.
19. Preserve the permanent release signing key for all future app updates.
20. Do not generate a new release keystore merely to solve an update problem.
21. Do not hand over Google account credentials to resellers or other third parties.

## 24. Project vision
Daily Quiz & Challenge should ultimately become an internet-powered quiz platform with fresh, meaningful, high-quality questions, secure backend scoring, duplicate prevention and reliable monetization without requiring a new APK whenever question content changes.

Near-term path:
```text
Current working V1
      ↓
V1.1: stronger ads + versioning + better questions + better gameplay
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
