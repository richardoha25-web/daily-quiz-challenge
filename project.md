# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 23 August 2026  
**Project stage:** V2 Firebase backend foundation and security architecture

## 1. Project identity
- App name: Daily Quiz & Challenge
- AppDeploy project ID: `daily-quiz-challenge-zd50r1`
- Technology: React + Vite + Capacitor 8.4.2
- Android package ID: `com.richard.dailyquizchallenge`
- Development constraint: all development, GitHub work, cloud builds, testing and release preparation must be possible from the user's Android phone; no PC/laptop.
- Current Android approach: Capacitor + GitHub Actions/cloud builds.
- GitHub repository: `richardoha25-web/daily-quiz-challenge`

## 2. V1 app
Original plan:
- 10 questions per quiz
- 15 seconds per question
- 100 points maximum
- streak and best-score tracking
- General Knowledge, Bible, Africa & Nigeria, Science
- intended 400-question bank: 100 per category

### V1 problem discovered
The installed app did not reliably provide the intended 400-question variety. Questions and wrong answers could repeat too often. The static question-bank approach is therefore not sufficient for the desired production experience.

V2 will replace this with an internet-powered dynamic question system.

## 3. Current source/build structure
Current app is React/Vite packaged with Capacitor. Much of the current logic is centered in `src/App.tsx`.

Important source areas:
```text
src/
├── App.tsx
├── index.css
└── main.tsx

public/
├── icon.svg
├── manifest.webmanifest
└── sw.js
```

Important project files include `capacitor.config.ts`, `package.json`, `vite.config.ts`, TypeScript/Tailwind configuration and GitHub Actions workflows.

## 4. Cloud Android builds
Because there is no PC, Android builds use GitHub Actions/cloud infrastructure.

The debug APK has been successfully built, downloaded, installed and tested on the user's phone.

Release signing/build infrastructure has also been developed and tested, including signed APK/AAB production.

## 5. Release signing
A dedicated release keystore was created and secured using GitHub Repository Secrets.

Never put these or other secrets in this document or GitHub:
- `KEYSTORE_PASSWORD`
- `KEY_PASSWORD`
- `KEYSTORE_BASE64`
- private AdMob identifiers
- Firebase private credentials/service-account keys
- payment/banking credentials
- other account-security information

The original release keystore remains the signing source of truth.

## 6. AdMob — completed
AdMob was successfully integrated into the Android app and real ads have been confirmed showing.

Configured ad types:
- Banner
- Interstitial
- Rewarded

The private AdMob App ID and Ad Unit IDs exist and are saved by the user; literal values are intentionally not recorded here.

Do not repeatedly click live ads for testing.

## 7. AdMob preload/lifecycle work
The latest lifecycle/preload improvement was developed on:

`fix/admob-preload-lifecycle`

Latest tested commit:

`a5dad65ea4628a216d041833b7db8dd804243c7c`

PR #1 remains unmerged.

### Rewarded
The rewarded system now:
1. preloads;
2. waits/loads when needed;
3. shows after the user taps the +20 bonus button;
4. grants +20 bonus;
5. immediately starts loading the next rewarded ad;
6. retries failed loads.

User testing found this is now working essentially exactly as desired.

**Status: GOOD — preserve this implementation.**

### Interstitial
The interstitial system now preloads, shows at the quiz/result transition, immediately starts loading a replacement, and retries failed loads.

It is much better than the original behavior, although testing initially still showed occasional `WORKS → FAILS → WORKS`.

Later testing showed that network quality has a significant effect on ad availability.

**Status: ACCEPTABLE FOR NOW — do not risk breaking the working rewarded system.**

### Banner
The banner was changed toward permanent visibility across Home, Quiz and Results, with restore/retry behavior when the app becomes visible again.

Testing initially showed inconsistent banner loading after reopening. The user later observed that when the phone's internet connection became stronger, reopening the app caused ads to appear normally.

**Status: WORKING ACCEPTABLY under good network conditions — leave the current implementation alone for now.**

## 8. Important network observation
Ad availability is strongly affected by internet conditions.

V2 should therefore be designed as an internet-dependent app. It should require usable connectivity, but not assume that a user must have high-speed internet.

Temporary connection loss should be handled gracefully.

## 9. Google Play preparation
Android package ID:

`com.richard.dailyquizchallenge`

Release signing infrastructure has been created and tested. Signed release APK/AAB builds have previously been produced and tested.

Google Play Console registration is not the immediate focus while the product is being upgraded.

# 10. V2 DIRECTION — Internet-powered quiz platform

The app is moving from a static 400-question bank to a dynamic system that can provide fresh, meaningful questions.

### General Knowledge
User selects General Knowledge. The system obtains/generates fresh questions from reliable information sources and/or a controlled question service.

Requirements:
- meaningful questions
- varied questions
- difficulty control
- plausible wrong answers
- duplicate prevention
- recently seen questions avoided

### Bible
Flow:
`Bible → Book → Chapter → Quiz`

Example:
`Mark → Chapter 4 → Generate Quiz`

Questions should be based specifically on the selected book/chapter.

Bible translation/copyright requirements must be respected.

### Africa & Nigeria
Possible areas:
- Nigeria
- Africa
- Current Affairs
- History
- Geography

Current-affairs questions should use fresh internet information and reputable sources, with validation before questions are delivered.

### Science
Flow:
`Science → Biology / Chemistry / Physics → Quiz`

Future science topics can be added later.

## 11. V2 question-quality requirements
Every delivered question should pass validation:
- exactly one correct answer
- three distinct wrong answers
- no duplicate answer options
- plausible/relevant distractors
- no duplicate questions inside a quiz
- recently seen questions excluded where possible
- ambiguous/low-quality questions rejected
- correctness checked
- current-affairs information based on recent trustworthy sources

Question IDs/hashes and user history should support duplicate prevention.

## 12. Firebase project and authentication — CURRENT
Firebase has been created for V2.

### Firebase project
- Public-facing project name: `project-269333544747`
- Support email: `richardoha25@gmail.com`
- Development plan constraint: **Spark / no-cost plan** while developing.
- User has explicitly stated there is currently no budget available for Firebase billing. Do not recommend paid configuration casually or assume billing is available.

### Authentication
Enabled sign-in providers:
- Email/Password
- Google

The Firebase Authentication console displayed a Dynamic Links deprecation warning concerning email-link authentication for mobile apps and Cordova OAuth support for web apps. This does **not** affect the chosen Email/Password and Google Sign-In providers. Do not enable email-link authentication or rely on deprecated Cordova OAuth flows.

A real test Firebase Authentication user has been created. Its UID must never be recorded in this document.

## 13. Firestore — CURRENT
Cloud Firestore database has been created successfully.

- Database: `(default)`
- Database location: `africa-south1` (Johannesburg)
- The project remains on the Spark/no-cost development plan.
- Database was created in **Production mode** with data private by default.

### Current collections/documents
```text
(default)
├── questions
│   └── question_001
│       ├── question
│       ├── options
│       ├── correctAnswer
│       ├── category
│       ├── difficulty
│       ├── explanation
│       └── createdAt
│
├── quiz_results
│   └── test_result_001
│       ├── userId
│       ├── score
│       ├── totalQuestions
│       ├── category
│       ├── completedAt
│       ├── correctAnswers
│       └── incorrectAnswers
│
├── users
│   └── [real Firebase Auth UID]
│       ├── email
│       ├── displayName
│       ├── points
│       ├── streak
│       └── createdAt
│
└── categories
    ├── bible
    │   ├── name
    │   ├── description
    │   └── isActive
    ├── science
    │   ├── name
    │   ├── description
    │   └── isActive
    ├── general_knowledge
    │   ├── name
    │   ├── description
    │   └── isActive
    └── africa_nigeria
        ├── name
        ├── description
        └── isActive
```

### Data-type decisions
- Question `options` → array with inner type `string`.
- Numeric score/count fields → `int64`.
- Boolean `isActive` → Boolean.
- Date/time fields → Timestamp.
- Firestore field order does not matter.

### Test data
`question_001` and `quiz_results/test_result_001` are development/test records. They are not production content. The real Auth UID is used in the test quiz result and user profile but is intentionally not recorded here.

## 14. Firestore Security Rules — CURRENTLY PUBLISHED
Security Rules were deliberately designed so the client app has no authority to modify authoritative game data.

The published rules currently follow this architecture:

```text
questions
  authenticated users: READ
  client WRITE: DENIED

categories
  authenticated users: READ
  client WRITE: DENIED

users/{uid}
  matching authenticated user: READ OWN DOCUMENT
  client WRITE: DENIED

quiz_results/{resultId}
  matching authenticated user: READ OWN RESULTS
  client WRITE: DENIED

all other paths
  READ/WRITE: DENIED
```

Important security principle:
- The Android app must **not** be able to award itself points.
- The Android app must **not** be able to change its own streak.
- The Android app must **not** be able to create or alter quiz results.
- The Android app must **not** be able to modify questions or categories.
- A trusted backend will eventually calculate scores, points and streaks and write authoritative data.

Server-side Firebase Admin/privileged backend access is separate from client Firestore Security Rules and will be used for trusted writes.

## 15. Important security architecture issue to solve before production
The current `questions/question_001` document contains `correctAnswer` together with the question and options.

Firestore Security Rules operate at document access level and do not provide field-level hiding for a normal document read. Therefore, if the app reads the whole question document, the answer key is technically delivered to the client.

Before production, redesign the question model so the client receives only question content/options while the trusted backend retains the answer key.

Preferred future direction:
```text
questions/{questionId}
  ├── question
  ├── options
  ├── category
  └── difficulty

answer_keys/{questionId}
  └── correctAnswer
```

The backend will validate submitted answers against the protected answer key.

Do not treat the current `correctAnswer` field as production-secure client architecture. `question_001` is a development/test document and can be migrated/restructured later.

## 16. Secure scoring architecture — DECISION
The client app should have **zero write access** to `quiz_results` and authoritative user statistics.

Correct production flow:
```text
Android App
    ↓
User answers quiz
    ↓
Trusted Quiz Backend
    ├── validates submitted answers
    ├── reads protected answer keys
    ├── calculates score
    ├── calculates earned points
    ├── calculates streak changes
    ├── validates duplicate/history rules
    └── writes authoritative Firestore records
             ↓
       quiz_results / users
```

Never trust client-supplied values for:
- score
- points
- streak
- authoritative quiz result

The client may submit answers/quiz context; the trusted backend determines the outcome.

## 17. V2 backend architecture
The Android app should not perform uncontrolled internet searching directly.

Recommended structure:

```text
Android App
    ↓
Secure Quiz Backend / API
    ├── authentication-aware requests
    ├── question retrieval/generation
    ├── answer validation
    ├── duplicate detection
    ├── current-affairs sourcing
    ├── scoring
    ├── points/streak calculation
    └── user-specific question history
```

Sensitive API keys and trusted backend credentials remain server-side.

Firebase Authentication identifies the user. Firestore stores persistent data. The backend is the authority for scoring and other protected game-state changes.

## 18. User accounts
V2 supports the chosen direction:
- Google sign-in
- Email + password

Preferred stack:
- Firebase Authentication
- Cloud Firestore
- trusted backend/server-side Firebase access

Store/use eventually:
- quiz history
- scores
- best scores
- streaks
- categories played
- science subjects
- Bible books/chapters completed
- recently seen questions
- achievements/future statistics

Authoritative values such as points and streak must be backend-controlled.

## 19. Internet requirement
V2 needs internet for:
- authentication
- cloud progress
- dynamic questions
- current affairs
- question validation/generation
- duplicate prevention
- AdMob

Basic flow:

```text
Open App
  ↓
Check connectivity
  ↓
Internet available?
  ├─ No → friendly connection-required screen
  └─ Yes
       ↓
     Sign in
       ↓
  Choose category
       ↓
  Configure quiz
       ↓
  Prepare fresh questions
       ↓
      Quiz
```

## 20. V2 advertising strategy
### Banner
Keep the banner visible throughout appropriate app sections, including Home, category selection, Quiz and Results.

### Category/quiz-start transition
The user wants an ad opportunity when a category is selected, especially for Bible, Africa & Nigeria/Current Affairs, General Knowledge and Science.

This should be implemented at an appropriate natural transition and should be preloaded where possible. The core quiz should not be made inaccessible merely because an ad failed to load.

### Interstitial
Show after quiz completion at a natural transition when available.

### Rewarded
Keep the successful existing flow:
`Watch Ad for +20 Bonus Points → rewarded ad → +20 bonus`

The user explicitly opts in to this reward.

## 21. V2 UI/graphics
The user wants a sharp, modern, polished, energetic mobile UI.

Planned screens:
- modern Home
- category cards
- Bible book/chapter selection
- Science subject selection
- polished Quiz screen
- Results screen
- Account/Profile
- progress/history
- modern animations and visual feedback

## 22. Recommended V2 architecture
The current app is heavily centered in `App.tsx`. V2 should be modular.

Suggested direction:
```text
src/
├── app/
├── components/
├── screens/
│   ├── Home
│   ├── Auth
│   ├── Category
│   ├── Bible
│   ├── Science
│   ├── Quiz
│   └── Results
├── services/
│   ├── auth
│   ├── quiz
│   ├── ads
│   ├── connectivity
│   └── user
├── hooks/
├── types/
└── utils/
```

Exact structure should be finalized after repository inspection.

## 23. V2 development stages
1. Preserve current working app and create V2 development branch.
2. Refactor architecture.
3. Create/configure Firebase.
4. Add Google and email/password authentication.
5. Configure Firestore.
6. Publish restrictive Firestore Security Rules.
7. Redesign question storage so answer keys are not exposed to clients.
8. Establish secure question/scoring backend/API.
9. Build General Knowledge dynamic questions.
10. Build Bible book/chapter questions.
11. Build Africa/Nigeria/current-affairs questions.
12. Build Science Biology/Chemistry/Physics.
13. Integrate network handling.
14. Redesign UI/graphics.
15. Integrate/verify AdMob flow.
16. Test good/weak/lost/restored internet.
17. Test duplicate prevention and question quality.
18. Test account/progress persistence and backend-controlled scores.
19. Build release APK/AAB.
20. Complete Play Store preparation and submission when ready.

## 24. Current GitHub development status
AdMob preload/lifecycle work:
- branch: `fix/admob-preload-lifecycle`
- latest tested commit: `a5dad65ea4628a216d041833b7db8dd804243c7c`
- PR #1: not merged

Keep the current working version available as a fallback while V2 is developed.

## 25. Continuity rules
1. Do not start the app over.
2. Preserve the existing repository and cloud build pipeline.
3. Keep development phone + cloud based.
4. Never invent private IDs, passwords, secrets, build results or configuration values.
5. Never commit signing passwords, keystore Base64 data, private AdMob credentials, Firebase private credentials or other secrets.
6. Keep Android package ID `com.richard.dailyquizchallenge`.
7. Keep AppDeploy project ID `daily-quiz-challenge-zd50r1`.
8. Do not unnecessarily change the working rewarded-ad implementation.
9. Make major changes in stages and verify each cloud build.
10. Keep the current working version as a fallback.
11. Update this document after major milestones.
12. Verify current Google, AdMob and Firebase requirements before production implementation.
13. Do not assume the static 400-question V1 bank is sufficient.
14. Do not make the user repeat information already recorded here.
15. Keep Firebase development within the user's zero-budget constraint; do not assume paid billing is available.
16. Do not give the client app write authority over authoritative scores, points, streaks or quiz results.
17. Before production, separate public question content from protected answer keys.

## 26. Current milestone

### ACHIEVED
- React/Vite Daily Quiz & Challenge app created.
- Capacitor Android packaging established.
- Android debug APK successfully built in the cloud.
- APK installed and tested on the user's Android phone.
- Android package ID established.
- AdMob account approved.
- Banner, interstitial and rewarded ad units created.
- AdMob integrated.
- Real AdMob ads confirmed showing.
- AdMob preload/lifecycle improvements implemented.
- Rewarded ad preload/retry behavior successfully tested and is now working as desired.
- Interstitial behavior substantially improved.
- Banner behavior improved and tested across app sections.
- Release keystore and GitHub signing secrets established.
- Signed release APK/AAB infrastructure completed and tested.
- V2 internet-powered quiz concept defined.
- V2 category/subcategory requirements defined.
- Firebase project created for V2.
- Firebase Authentication enabled for Email/Password and Google Sign-In.
- Firestore database created in `africa-south1` (Johannesburg).
- Firestore created in Production mode.
- `questions` collection and development question document created.
- `quiz_results` collection and development result document created.
- `users` collection linked to a real Firebase Auth UID.
- `categories` collection created with Bible, Science, General Knowledge and Africa & Nigeria documents.
- Firestore Security Rules published with client writes denied for questions, categories, users and quiz results.
- Secure-scoring architecture decision made: authoritative scoring/results/points/streak will be backend-controlled.
- V2 question-quality and duplicate-prevention requirements defined.
- V2 UI redesign requirements defined.

### CURRENT
**V2 Firebase backend foundation and security architecture stage.**

The existing app is being preserved as the working baseline.

### NEXT IMMEDIATE STEPS
1. Design and implement the protected question/answer-key data model.
2. Decide and implement the trusted backend approach that fits the zero-budget Spark development constraint.
3. Connect the V2 app to Firebase Authentication.
4. Build the modular V2 app architecture on a development branch.
5. Implement authenticated question retrieval.
6. Implement secure answer submission and backend scoring.
7. Add user history/duplicate prevention.
8. Build and test each major stage through GitHub Actions/cloud.

## 27. Project vision
Daily Quiz & Challenge should become an internet-powered quiz platform that provides fresh, meaningful, high-quality questions instead of repeatedly serving a small static bank.

Target experience:

```text
Sign in
  ↓
Choose challenge
  ↓
Choose category/topic/book/chapter
  ↓
Internet-powered question preparation
  ↓
Fresh validated questions
  ↓
10-question quiz
  ↓
Secure answer submission
  ↓
Trusted backend calculates result/points/streak
  ↓
Result + interstitial opportunity
  ↓
Optional rewarded +20 bonus
  ↓
Progress saved to account
  ↓
Next quiz with duplicate prevention
```

The long-term goal is a polished quiz application that can continuously improve its question content without requiring a new APK every time the content changes.
