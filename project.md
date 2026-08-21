# Daily Quiz & Challenge — Project Continuity Record

**Last updated:** 21 August 2026  
**Project stage:** V2 architecture planning after successful AdMob integration and testing

## 1. Project identity
- App name: Daily Quiz & Challenge
- AppDeploy project ID: `daily-quiz-challenge-zd50r1`
- Technology: React + Vite + Capacitor 8.4.2
- Android package ID: `com.richard.dailyquizchallenge`
- Development constraint: all development, GitHub work, cloud builds, testing and release preparation must be possible from the user's Android phone; no PC/laptop.
- Current Android approach: Capacitor + GitHub Actions/cloud builds.

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

# 10. NEW V2 DIRECTION — Internet-powered quiz platform

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

## 12. V2 backend architecture
The Android app should not perform uncontrolled internet searching directly.

Recommended structure:

```text
Android App
    ↓
Secure Quiz Backend / API
    ├── question retrieval/generation
    ├── validation
    ├── duplicate detection
    ├── current-affairs sourcing
    └── user-specific question history
```

Sensitive API keys remain server-side.

## 13. User accounts
V2 should support:
- Google sign-in
- Email + password

Preferred direction:
- Firebase Authentication
- Cloud Firestore

Store:
- quiz history
- scores
- best scores
- streaks
- categories played
- science subjects
- Bible books/chapters completed
- recently seen questions
- achievements/future statistics

## 14. Internet requirement
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

## 15. V2 advertising strategy
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

## 16. V2 UI/graphics
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

## 17. Recommended V2 architecture
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

## 18. V2 development stages
1. Preserve current working app and create V2 development branch.
2. Refactor architecture.
3. Create/configure Firebase.
4. Add Google and email/password authentication.
5. Configure Firestore.
6. Establish secure question backend/API.
7. Build General Knowledge dynamic questions.
8. Build Bible book/chapter questions.
9. Build Africa/Nigeria/current-affairs questions.
10. Build Science Biology/Chemistry/Physics.
11. Integrate network handling.
12. Redesign UI/graphics.
13. Integrate/verify AdMob flow.
14. Test good/weak/lost/restored internet.
15. Test duplicate prevention and question quality.
16. Test account/progress persistence.
17. Build release APK/AAB.
18. Complete Play Store preparation and submission when ready.

## 19. Current GitHub development status
AdMob preload/lifecycle work:
- branch: `fix/admob-preload-lifecycle`
- latest tested commit: `a5dad65ea4628a216d041833b7db8dd804243c7c`
- PR #1: not merged

Keep the current working version available as a fallback while V2 is developed.

## 20. Continuity rules
1. Do not start the app over.
2. Preserve the existing repository and cloud build pipeline.
3. Keep development phone + cloud based.
4. Never invent private IDs, passwords, secrets, build results or configuration values.
5. Never commit signing passwords, keystore Base64 data, private AdMob credentials or other secrets.
6. Keep Android package ID `com.richard.dailyquizchallenge`.
7. Keep AppDeploy project ID `daily-quiz-challenge-zd50r1`.
8. Do not unnecessarily change the working rewarded-ad implementation.
9. Make major changes in stages and verify each cloud build.
10. Keep the current working version as a fallback.
11. Update this document after major milestones.
12. Verify current Google, AdMob and Firebase requirements before production implementation.
13. Do not assume the static 400-question V1 bank is sufficient.
14. Do not make the user repeat information already recorded here.

## 21. Current milestone

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
- Firebase Authentication + Firestore identified as the preferred account/data direction.
- V2 question-quality and duplicate-prevention requirements defined.
- V2 UI redesign requirements defined.

### CURRENT
**V2 planning and architecture stage.**

The existing app is being preserved as the working baseline.

### NEXT IMMEDIATE STEPS
1. Put this updated `project.md` into the GitHub repository.
2. Create/prepare a V2 development branch without destroying the current working version.
3. Create the Firebase project.
4. Configure Google and email/password authentication.
5. Configure Firestore.
6. Design the secure question backend/API.
7. Begin modular V2 app architecture.
8. Build and test each major stage through GitHub Actions/cloud.

## 22. Project vision
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
Result + interstitial opportunity
  ↓
Optional rewarded +20 bonus
  ↓
Progress saved to account
  ↓
Next quiz with duplicate prevention
```

The long-term goal is a polished quiz application that can continuously improve its question content without requiring a new APK every time the content changes.
