# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 25 August 2026  
**Project stage:** V2 Firebase backend foundation — protected question data, Firestore security, and question-selection architecture verified/designed

## 1. Project identity
- App: Daily Quiz & Challenge
- AppDeploy project ID: `daily-quiz-challenge-zd50r1`
- Stack: React + Vite + Capacitor 8.4.2
- Android package ID: `com.richard.dailyquizchallenge`
- Development is phone/cloud based; no PC/laptop.
- GitHub: `richardoha25-web/daily-quiz-challenge`
- Active V2 development branch: `v2-development`

## 2. V1 lessons
V1 used a static question bank and did not provide enough reliable variety; questions and distractors could repeat. V2 will use an internet-powered dynamic system with validation and duplicate prevention.

Original quiz format remains the target: 10 questions, 15 seconds/question, scoring/streaks, with Bible, Science, General Knowledge and Africa & Nigeria categories.

## 3. Existing build and AdMob status
Cloud Android builds and signed APK/AAB infrastructure are working. The existing app remains the fallback baseline.

AdMob types: Banner, Interstitial, Rewarded.

AdMob preload/lifecycle work:
- branch: `fix/admob-preload-lifecycle`
- latest tested commit: `a5dad65ea4628a216d041833b7db8dd804243c7c`
- PR #1 remains unmerged.

Rewarded preload/retry flow is working as desired and must be preserved. Interstitial and banner behavior is acceptable under good network conditions. Do not unnecessarily change the working rewarded implementation.

Never record signing passwords, keystore Base64 data, private AdMob identifiers, Firebase private credentials, banking/payment credentials or other secrets here.

## 4. Firebase — current
Firebase project:
- Public-facing name: `project-269333544747`
- Support email: `richardoha25@gmail.com`
- Plan: Spark/no-cost development; no paid billing should be assumed.

Authentication enabled:
- Email/Password
- Google

A real test Auth user exists. Never record its UID in this document.

Firestore:
- Database: `(default)`
- Location: `africa-south1` (Johannesburg)
- Production mode
- Spark/no-cost development

## 5. Current Firestore data model
The database currently contains these top-level collections:

```text
(default)
├── questions
│   └── question_001
│       ├── question
│       ├── options
│       ├── categoryId          ← updated on question_001
│       ├── difficulty
│       ├── isActive            ← added to question_001
│       ├── randomKey           ← added to question_001; int64
│       └── createdAt
│
├── answer_keys
│   └── question_001
│       ├── correctAnswer
│       └── explanation
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
│   └── [Firebase Auth UID]
│       ├── email
│       ├── displayName
│       ├── points
│       ├── streak
│       └── createdAt
│
└── categories
    ├── bible
    ├── science
    ├── general_knowledge
    └── africa_nigeria
```

`question_001` is the first manually migrated question document. Other existing question documents must not be assumed to have already been migrated to the new schema.

The category document IDs are confirmed as:
- `africa_nigeria`
- `bible`
- `general_knowledge`
- `science`

Category documents currently contain `name` and `isActive`.

Question `options` is an array of strings. Numeric score/count fields use int64. Boolean fields use Boolean. Date/time fields use Timestamp. Firestore field order does not matter.

### Final question-document schema
The target schema for client-readable `questions/{questionId}` documents is:

```text
question       → string
options        → array of strings
categoryId     → string
                  one of: africa_nigeria, bible,
                  general_knowledge, science
difficulty     → string
                  one of: easy, medium, hard
isActive       → boolean
randomKey      → int64
createdAt      → timestamp
```

`randomKey` is an integer random-selection key. The current design uses a large integer range (for example, 1–1,000,000) rather than a decimal because the Firebase Console exposes integer numeric fields as int64. Each question should have a stable random key.

For `question_001`, the question text was restored after it was accidentally removed during manual editing:
- Question: `What is the capital of Nigeria?`
- Category ID: `africa_nigeria`
- `isActive`: `true`
- `randomKey`: `638271`

Its `difficulty` and existing options/createdAt were preserved during the manual update.

### Protected answer-key architecture — DONE
The client-readable `questions/{questionId}` document must contain only quiz content. We removed:
- `correctAnswer`
- `explanation`

Both were moved to `answer_keys/{questionId}` because an explanation can reveal the answer.

Therefore the app can receive a question and its options without receiving the answer key or an answer-revealing explanation.

The client must never receive `answer_keys` data directly.

## 6. Firestore Security Rules — PUBLISHED AND VERIFIED
Current security architecture:

```text
questions
  authenticated users: READ
  client WRITE: DENIED

categories
  authenticated users: READ
  client WRITE: DENIED

answer_keys/{questionId}
  client READ: DENIED
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

Published rules:

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

### Rules Playground — all 8 tests PASSED
1. Authenticated read `questions/question_001` → **Allowed**
2. Authenticated read `answer_keys/question_001` → **Denied**
3. Authenticated read `categories/bible` → **Allowed**
4. Authenticated update `questions/question_001` → **Denied**
5. Authenticated update `answer_keys/question_001` → **Denied**
6. Authenticated update own `users/{uid}` → **Denied**
7. Authenticated create `quiz_results/test_result_001` → **Denied**
8. Unauthenticated read `questions/question_001` → **Denied**

**Security milestone: PASSED.** The client can read quiz content but cannot read or modify protected answer keys, questions, user authoritative data or quiz results.

The rules will need to be extended later when trusted backend-controlled collections/subcollections such as `question_history` and `quiz_sessions` are actually created. Do not add those paths to the rules prematurely.

## 7. UID security
Firebase Authentication owns the UID. Users must not be able to edit their UID. The UID is the identity represented by `users/{uid}` and is part of the security model.

Users may eventually edit safe profile fields such as `displayName`, but points, streak and other authoritative values remain backend-controlled.

## 8. Secure scoring architecture — DECISION
The Android client has zero write authority over authoritative quiz results and user statistics.

```text
Android App
    ↓
User answers quiz
    ↓
Trusted Quiz Backend
    ├── validates submitted answers
    ├── reads protected answer_keys
    ├── calculates score
    ├── calculates points
    ├── calculates streak changes
    ├── checks history/duplicates
    └── writes authoritative Firestore records
             ↓
       quiz_results / users
```

Never trust client-supplied score, points, streak or authoritative result values.

## 9. V2 backend direction
The Android app should not perform uncontrolled internet searching directly.

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

Sensitive API keys and trusted credentials stay server-side. Firebase Authentication identifies the user; Firestore stores persistent data; the trusted backend controls scoring and protected game-state changes.

The exact trusted-backend implementation is **not yet selected or implemented**. It must fit the Firebase Spark/no-budget development constraint.

## 10. Question-selection and duplicate-prevention architecture — DESIGNED
The backend must select questions without downloading the entire category/question bank.

### Random selection design
Each question has a stable integer `randomKey`.

The planned selection flow is:

```text
Start quiz
   ↓
Backend receives authenticated user + category + quiz configuration
   ↓
Generate random starting integer
   ↓
Query active questions in the requested category around that randomKey
   ↓
Collect a candidate pool
   ↓
Check user's question history
   ↓
Discard already-seen questions where possible
   ↓
If candidate pool is insufficient, continue querying / wrap around
   ↓
Randomly shuffle eligible candidates
   ↓
Select the required number (normally 10)
   ↓
Create quiz session
   ↓
Record assigned questions in user history
```

The system should not download the entire question bank just to shuffle it.

A candidate-pool approach is preferred over simply taking the first 10 records after a random starting point because previously seen questions may need to be filtered out.

The backend may need Firestore composite indexes for combinations such as category + active status + randomKey, and category + difficulty + active status + randomKey. Do not manually create indexes until the real backend query requires them; Firestore can provide the required index prompt/link.

### Difficulty
The question system supports exactly three difficulty labels:
- `easy`
- `medium`
- `hard`

The exact quiz difficulty distribution has not yet been finalized. The schema supports future selection such as a mixture of easy, medium and hard questions.

### Duplicate prevention design
The planned history structure is:

```text
users/{uid}/question_history/{questionId}
    ├── categoryId
    ├── firstSeenAt
    ├── lastSeenAt
    └── timesSeen
```

This collection/subcollection has **NOT yet been created**.

The backend will control history. The client must not be able to create, modify or delete its own question history.

A question is considered seen when it is assigned to a quiz session, not only after the user answers it. This prevents repeated assignment after an abandoned/incomplete quiz.

When fewer than 10 unseen eligible questions remain, the backend should fill the remaining slots with older/least-recently-seen eligible questions rather than getting stuck. This allows questions to rotate back into use after the unseen pool is exhausted.

## 11. Quiz-session architecture — DESIGNED, NOT YET CREATED
The planned top-level collection is:

```text
quiz_sessions/{sessionId}
    ├── userId
    ├── categoryId
    ├── questionIds
    ├── selectionMode
    ├── status
    ├── startedAt
    ├── expiresAt
    ├── completedAt
    └── resultId
```

Recommended initial values/meaning:
- `userId` → Firebase Auth UID
- `categoryId` → selected category ID
- `questionIds` → backend-selected question IDs in quiz order
- `selectionMode` → initially `unseen_first`
- `status` → e.g. `active`, `completed`, `expired`, `abandoned`
- `startedAt` → Timestamp
- `expiresAt` → Timestamp
- `completedAt` → Timestamp or null
- `resultId` → linked result ID or null until a result exists

This collection has **NOT yet been created**. Its security rules must be designed before creation so the client cannot write authoritative session state.

## 12. Existing quiz-results architecture
The existing `quiz_results/test_result_001` document is a test/legacy structure and should not be treated as the final V2 schema.

The final V2 result must be created by the trusted backend after answer validation. The client must not submit its own score, correct-answer count, points, streak changes or authoritative result fields.

The final V2 result schema will be refined alongside the quiz-session and secure answer-submission contract before implementation.

## 13. V2 question requirements
Every question should have:
- exactly one correct answer
- three distinct wrong answers
- no duplicate options
- plausible/relevant distractors
- no duplicate questions within a quiz
- recently seen questions excluded where possible
- ambiguous/low-quality questions rejected
- correctness checked
- current-affairs information based on recent trustworthy sources

Question IDs/hashes and user history should support duplicate prevention.

Category directions:
- Bible → Book → Chapter → Quiz
- Science → Biology / Chemistry / Physics
- Africa & Nigeria → Nigeria, Africa, Current Affairs, History, Geography
- General Knowledge → varied fresh questions

Bible translation/copyright requirements must be respected.

## 14. Internet requirement
V2 requires internet for authentication, cloud progress, dynamic questions, current affairs, validation/generation, duplicate prevention and AdMob.

Basic flow:

```text
Open App → Check connectivity → Sign in → Choose category → Configure quiz → Prepare fresh questions → Quiz → Secure answer submission → Trusted scoring → Results/progress
```

Temporary connection loss should be handled gracefully.

## 15. V2 UI direction
Planned polished mobile screens:
- Home
- Auth
- Category selection
- Bible book/chapter selection
- Science subject selection
- Quiz
- Results
- Account/Profile
- progress/history

The UI should be sharp, modern, polished and energetic.

Suggested source architecture:

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

## 16. V2 advertising strategy
- Banner: appropriate persistent sections including Home, category selection, Quiz and Results.
- Category/quiz-start: natural ad opportunity when available; quiz must not become inaccessible if the ad fails.
- Interstitial: natural transition after quiz completion when available.
- Rewarded: preserve `Watch Ad for +20 Bonus Points → rewarded ad → +20 bonus`.

## 17. Development stages
1. Preserve current working app and V2 development workflow.
2. Refactor architecture.
3. Firebase setup. **DONE**
4. Authentication providers. **DONE**
5. Firestore setup. **DONE**
6. Restrictive Firestore Rules. **DONE**
7. Separate question content from protected answer keys. **DONE**
8. Test Firestore security boundary. **DONE — all 8 tests passed**
9. Design efficient random question selection. **DONE — randomKey + candidate-pool approach designed**
10. Define question-history / duplicate-prevention schema. **DESIGNED — not yet created**
11. Define quiz-session schema. **DESIGNED — not yet created**
12. Decide trusted backend implementation within Spark/no-budget constraint. **NEXT**
13. Create `question_history` and `quiz_sessions` manually after backend/security design is finalized.
14. Update Firestore rules for the new backend-controlled paths.
15. Migrate remaining question documents to the finalized question schema.
16. Connect V2 to Firebase Authentication.
17. Implement authenticated question retrieval through the trusted backend.
18. Implement secure answer submission/backend scoring using protected `answer_keys`.
19. Add user history/duplicate prevention.
20. Build General Knowledge dynamic questions.
21. Build Bible book/chapter questions.
22. Build Africa/Nigeria/current-affairs questions.
23. Build Science Biology/Chemistry/Physics.
24. Add network handling.
25. Redesign UI.
26. Verify AdMob integration.
27. Test good/weak/lost/restored internet.
28. Test question quality and duplicate prevention.
29. Test account persistence and backend-controlled scores.
30. Build release APK/AAB.
31. Complete Play Store preparation/submission when ready.

## 18. Current milestone
### ACHIEVED
- Existing app and cloud build pipeline established.
- AdMob integrated and preload/lifecycle improvements tested.
- Release signing infrastructure established.
- V2 direction and category requirements defined.
- Firebase project created.
- Email/Password and Google authentication enabled.
- Firestore created in `africa-south1` on Production mode.
- Questions, categories, users and quiz-results structures created.
- Protected `answer_keys` collection established.
- `correctAnswer` and `explanation` removed from client-readable questions and moved to `answer_keys`.
- Restrictive Firestore Security Rules published.
- All 8 Rules Playground tests passed.
- Secure backend-controlled scoring architecture decided.
- Category document IDs confirmed: `africa_nigeria`, `bible`, `general_knowledge`, `science`.
- `question_001` manually updated to the new target question schema: restored question text, changed category reference to `categoryId`, added `isActive`, and added an int64 `randomKey`.
- Efficient random question-selection architecture designed using stable integer `randomKey`, candidate-pool retrieval, history filtering, and random shuffling.
- `question_history` architecture designed.
- `quiz_sessions` architecture designed.

### CURRENT
**V2 Firestore schema + trusted-backend architecture stage.**

The Firestore question-data security boundary is complete and verified. The question-selection and duplicate-prevention architecture has been designed. `question_history` and `quiz_sessions` have not yet been created. The trusted backend implementation has not yet been selected or implemented.

`question_001` is the first manually migrated question document. Remaining question documents still need to be migrated carefully to the finalized schema.

The existing app remains the working baseline.

### NEXT IMMEDIATE STEPS
1. Decide the trusted backend approach that fits Firebase Spark/no-budget development.
2. Finalize the secure request/response contract for starting a quiz and submitting answers.
3. Finalize the security rules for backend-controlled `question_history` and `quiz_sessions` before creating them.
4. Manually create the new collections/subcollections after the design is finalized.
5. Migrate the remaining question documents to the finalized schema.
6. Connect V2 to Firebase Authentication.
7. Implement authenticated question retrieval through the trusted backend.
8. Implement secure answer submission and backend scoring using protected `answer_keys`.
9. Add user history/duplicate prevention.
10. Build/test each stage through GitHub Actions/cloud.

## 19. Continuity rules
1. Do not start the app over.
2. Preserve the existing repository and cloud build pipeline.
3. Keep development phone + cloud based.
4. Never invent private IDs, passwords, secrets, build results or configuration values.
5. Never commit signing passwords, keystore Base64 data, private AdMob credentials or Firebase private credentials.
6. Keep package ID `com.richard.dailyquizchallenge`.
7. Keep AppDeploy project ID `daily-quiz-challenge-zd50r1`.
8. Do not unnecessarily change the working rewarded-ad implementation.
9. Make major changes in stages and verify each cloud build.
10. Keep the working version as a fallback.
11. Update this document after major milestones.
12. Verify current platform requirements before production implementation.
13. Do not assume the V1 static 400-question bank is sufficient.
14. Do not make the user repeat information already recorded here.
15. Keep Firebase development within the zero-budget constraint.
16. Do not give the client write authority over authoritative scores, points, streaks or quiz results.
17. Keep `answer_keys` inaccessible to the client.
18. Do not allow users to modify their Firebase Auth UID.
19. Do not claim that `question_history` or `quiz_sessions` exist until they are actually created in Firestore.
20. Do not claim that the trusted backend is implemented until it has been built and tested.
21. Treat `question_001` as the first migrated question; do not assume all question documents have been migrated.

## 20. Project vision
Daily Quiz & Challenge should become an internet-powered quiz platform providing fresh, meaningful, high-quality questions without requiring a new APK every time content changes.

Target experience:

```text
Sign in
  ↓
Choose challenge
  ↓
Choose category/topic/book/chapter
  ↓
Trusted backend selects fresh validated questions
  ↓
10-question quiz
  ↓
Secure answer submission
  ↓
Trusted backend validates answers and calculates result/points/streak
  ↓
Result + interstitial opportunity
  ↓
Optional rewarded +20 bonus
  ↓
Progress saved to account
  ↓
Next quiz with duplicate prevention
```
