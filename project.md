# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 24 August 2026
**Project stage:** V2 Firebase backend foundation — protected question data and Firestore security verified

## 1. Project identity
- App: Daily Quiz & Challenge
- AppDeploy project ID: `daily-quiz-challenge-zd50r1`
- Stack: React + Vite + Capacitor 8.4.2
- Android package ID: `com.richard.dailyquizchallenge`
- Development is phone/cloud based; no PC/laptop.
- GitHub: `richardoha25-web/daily-quiz-challenge`

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
```text
(default)
├── questions
│   └── question_001
│       ├── question
│       ├── options
│       ├── category
│       ├── difficulty
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

Question `options` is an array of strings. Numeric score/count fields use int64. Boolean fields use Boolean. Date/time fields use Timestamp. Firestore field order does not matter.

### Protected answer-key architecture — DONE
The client-readable `questions/{questionId}` document must contain only quiz content. We removed:
- `correctAnswer`
- `explanation`

Both were moved to `answer_keys/{questionId}` because an explanation can reveal the answer.

Therefore the app can receive a question and its options without receiving the answer key or an answer-revealing explanation.

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

## 10. V2 question requirements
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

## 11. Internet requirement
V2 requires internet for authentication, cloud progress, dynamic questions, current affairs, validation/generation, duplicate prevention and AdMob.

Basic flow:
```text
Open App → Check connectivity → Sign in → Choose category → Configure quiz → Prepare fresh questions → Quiz → Secure answer submission → Trusted scoring → Results/progress
```

Temporary connection loss should be handled gracefully.

## 12. V2 UI direction
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

## 13. V2 advertising strategy
- Banner: appropriate persistent sections including Home, category selection, Quiz and Results.
- Category/quiz-start: natural ad opportunity when available; quiz must not become inaccessible if the ad fails.
- Interstitial: natural transition after quiz completion when available.
- Rewarded: preserve `Watch Ad for +20 Bonus Points → rewarded ad → +20 bonus`.

## 14. Development stages
1. Preserve current working app and V2 development workflow.
2. Refactor architecture.
3. Firebase setup. **DONE**
4. Authentication providers. **DONE**
5. Firestore setup. **DONE**
6. Restrictive Firestore Rules. **DONE**
7. Separate question content from protected answer keys. **DONE**
8. Test Firestore security boundary. **DONE — all 8 tests passed**
9. Decide/implement trusted backend within Spark/no-budget constraint. **NEXT**
10. Connect V2 app to Firebase Authentication.
11. Implement authenticated question retrieval.
12. Implement secure answer submission/backend scoring.
13. Add user history and duplicate prevention.
14. Build General Knowledge dynamic questions.
15. Build Bible book/chapter questions.
16. Build Africa/Nigeria/current-affairs questions.
17. Build Science Biology/Chemistry/Physics.
18. Add network handling.
19. Redesign UI.
20. Verify AdMob integration.
21. Test good/weak/lost/restored internet.
22. Test question quality and duplicate prevention.
23. Test account persistence and backend-controlled scores.
24. Build release APK/AAB.
25. Complete Play Store preparation/submission when ready.

## 15. Current milestone
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

### CURRENT
**V2 trusted-backend architecture stage.**

The Firestore question-data security boundary is complete and verified. The existing app remains the working baseline.

### NEXT IMMEDIATE STEPS
1. Decide the trusted backend approach that fits Firebase Spark/no-budget development.
2. Design the backend request/response contract for question generation and secure answer submission.
3. Connect V2 to Firebase Authentication.
4. Build modular V2 architecture on the development branch.
5. Implement authenticated question retrieval.
6. Implement secure answer submission and backend scoring using protected `answer_keys`.
7. Add user history/duplicate prevention.
8. Build/test each stage through GitHub Actions/cloud.

## 16. Continuity rules
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

## 17. Project vision
Daily Quiz & Challenge should become an internet-powered quiz platform providing fresh, meaningful, high-quality questions without requiring a new APK every time content changes.

Target experience:
```text
Sign in
  ↓
Choose challenge
  ↓
Choose category/topic/book/chapter
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
