# Daily Quiz & Challenge — UI/UX Project Blueprint

**File purpose:** Dedicated design workspace for the future UI/UX redesign.  
**Important:** This file is separate from the main `project.md`. The main `project.md` remains the concise source of truth for app development status.

## 1. Design Project Status

**Current phase:** UI/UX planning — do not redesign production code yet.

The current V1.1.3 app has reached a stable functional checkpoint. The immediate development priority is to finish and test the remaining online quiz categories/providers before beginning the major UI/UX implementation.

When the functional foundation is ready, this file becomes the primary blueprint for the redesign.

## 2. Product Vision

**Product:** Daily Quiz & Challenge  
**Developer/brand:** Richard Studios

Long-term goal: build a polished, dependable quiz platform that people enjoy returning to, with fresh questions, strong category experiences, engaging gameplay, useful results, dependable monetization, and a professional visual identity.

The redesign should make the product feel like a **premium modern quiz/game experience**, not a beginner project, while remaining fast, clear, accessible, and scalable.

## 3. Core Design Concept

### Daily Quiz & Challenge — Clean Competitive

Target feeling:

- Clean
- Modern
- Premium
- Energetic
- Competitive
- Playful without being childish
- Sharp and crisp
- Easy to understand
- Similar in polish to a modern fintech/gift-card app, but adapted to a quiz/game experience

Avoid:

- Excessive gradients
- Visual clutter
- Generic/basic-looking layouts
- Overly corporate styling
- Overly childish game styling
- Unnecessary decoration
- Making every screen look different

The app should have one coherent design language.

## 4. Inspiration

Use external UI/UX work as **research and inspiration, not templates to copy**.

Primary inspiration reviewed:

- Behance quiz-app UI/UX projects and search results
- The referenced Behance project: “Quizzing game ui ux design”
- Other modern quiz interfaces emphasizing clean question layouts, dashboards, statistics, badges, results, and gamification

Reference:
https://www.behance.net/gallery/146388163/Quizzing-game-ui-ux-design

What we are studying from references:

- Layout hierarchy
- Card composition
- Spacing
- Typography
- Question presentation
- Answer interaction
- Progress indicators
- Timers
- Dashboards
- Results screens
- Streaks and achievements
- Visual depth
- Navigation
- Gamification
- Overall polish

We must create an original Richard Studios / Daily Quiz & Challenge identity.

## 5. Core Colour Direction

Initial palette — **not final until visually tested and accessibility-checked**:

| Role | Direction |
|---|---|
| Background | #F8FAFC / near-white |
| Primary blue | #1769FF |
| Deep blue | #0B3D91 |
| Dark text | #0F172A |
| Secondary text | #64748B |
| Cards | #FFFFFF |
| Success | Green |
| Error | Red |
| Accent | Warm amber/gold |

Colour philosophy:

- **Blue** = primary action, navigation, important interactive elements
- **White/near-white** = clarity, space, clean surfaces
- **Dark navy** = text, authority, strong hierarchy
- **Amber/gold** = achievements, streaks, points, rewards
- **Green** = correct/success
- **Red** = incorrect/error

Amber/gold should be an accent, not a dominant colour.

Accessibility requirements:

- Do not rely on colour alone to communicate meaning.
- Correct answers should use colour plus a checkmark/label.
- Incorrect answers should use colour plus an X/label.
- Maintain readable contrast.
- Check final colours against current accessibility guidance before implementation.
- Touch targets must be comfortable for mobile use.

## 6. Typography

Typography must feel:

- Modern
- Highly readable
- Strong on headings
- Clear on quiz questions
- Comfortable on smaller phone screens
- Consistent across all screens

Final font choice will be made during the visual-identity phase.

Typography hierarchy should distinguish:

1. Screen titles
2. Major numbers/scores
3. Quiz questions
4. Section headings
5. Body text
6. Secondary/helper text
7. Button labels
8. Status/metadata

## 7. Layout Principles

The redesign should prioritize:

- Strong visual hierarchy
- Generous but efficient spacing
- Clear grouping
- Consistent margins/padding
- Comfortable touch targets
- Crisp alignment
- Limited visual noise
- Predictable interaction patterns
- Mobile-first layouts for the Oppo A56 and similar Android phones

Cards should have subtle depth rather than heavy shadows.

Corner radius, spacing scale, shadow system, and component dimensions will be standardized during Phase 2.

## 8. Home Screen Direction

The home screen becomes the main product experience.

Proposed hierarchy:

1. Greeting
2. Daily Challenge
3. Streak
4. Explore Categories
5. Additional features
6. Navigation

Concept:

**Good evening, Richard 👋**  
**Ready for today's quiz?**

Then a prominent Daily Challenge card containing:

- Daily Challenge label
- Short motivational message
- Current streak
- Play Now action

Then category exploration.

The home screen should not simply present five equal category rectangles.

## 9. Category System

Every category gets its own identity while remaining part of one design system.

Initial categories:

- General Knowledge — brain/globe/knowledge imagery
- Science — atom/science imagery
- Bible — book/light imagery
- Africa & Nigeria — subtle African geographic/cultural identity
- Current Affairs — news/world imagery

Rules:

- Category imagery should support recognition.
- Avoid visually noisy cards.
- Typography/layout should remain consistent.
- Category-specific colours may be explored later, but the overall brand must remain coherent.

Future category additions must fit the same system.

## 10. Planned Screens

The redesign is a complete product experience, not just a prettier home screen.

Core screens:

1. Splash
2. Home
3. Category selection
4. Category configuration
5. Pre-quiz/ad transition
6. Quiz
7. Answer feedback
8. Results
9. Streak
10. Profile/statistics
11. Settings
12. About
13. Loading state
14. Error state
15. Offline/network state

Additional screens may be added as the product evolves.

## 11. Quiz Screen — Highest Priority

The quiz screen is the most important gameplay screen because users spend most of their time there.

Target structure:

- Back/navigation control where appropriate
- Question number, e.g. “Question 4 of 10”
- Progress indicator
- Timer
- Question
- Four answer options
- Streak indicator
- Clear answer feedback

Example information hierarchy:

Question 4 of 10  
[progress]

00:11

Which planet is known as the Red Planet?

A — Venus  
B — Mars ✓  
C — Jupiter  
D — Mercury

🔥 STREAK ×3

The exact visual composition will be designed during wireframing.

## 12. Timer

Current gameplay uses a 15-second countdown.

The redesign should make the timer part of the visual language without becoming distracting.

Potential progression:

15 → 12 → 9 → 6 → 3

Possible visual feedback:

- Subtle progress change
- Gentle urgency near the end
- Clear final countdown
- No excessive animation

Do not change underlying quiz timing merely for visual reasons without separately validating gameplay.

## 13. Answer Option States

Every answer component must have a defined state.

Required states:

1. Default
2. Pressed
3. Selected
4. Correct
5. Incorrect
6. Disabled/locked

Concept:

**Default:** white card + subtle border/depth  
**Pressed:** immediate tactile visual response  
**Selected:** blue emphasis  
**Correct:** green + checkmark  
**Incorrect:** red + X  
**Disabled:** muted after answer is locked

Answer feedback must remain understandable without relying on colour alone.

## 14. Results Screen

The results screen should become one of the most satisfying parts of the product.

Target information:

- Quiz complete
- Score
- Accuracy
- Points earned
- Streak
- Correct count
- Wrong count
- Progress visualization
- Next actions

Concept:

🎉

QUIZ COMPLETE

8 / 10

[progress]

+80 POINTS

🔥 4 DAY STREAK

Accuracy 80%  
Correct 8  
Wrong 2

[ PLAY AGAIN ]  
[ OTHER CATEGORY ]

Future enhancement:

- Question explanations
- Learning feedback
- Personalized performance information
- Achievement/reward feedback

Performance messaging can eventually vary appropriately, e.g. encouragement after a strong result or a supportive message after a difficult result.

## 15. Streaks, Points & Achievements

These should feel like part of the product identity.

Use the amber/gold accent selectively for:

- 🔥 Streaks
- 🏆 Achievements
- ⭐ Points
- 🎁 Rewards

These elements should feel rewarding without overwhelming the main quiz experience.

## 16. Ads & Monetization UX

AdMob is already a functioning part of the current app and must be considered during redesign.

Principle:

**Ads should be integrated into the UX, not feel like accidental interruptions.**

Potential placements:

- Persistent banner area where appropriate
- Natural transition points
- Interstitial between suitable gameplay stages
- Rewarded ad as an explicit optional action
- App Open without destroying user context

Rewarded example:

**Watch an ad → +20 points**

The user should understand that the rewarded action is optional.

The redesign must preserve ad functionality and must not hide, overlap, or break the ad containers.

## 17. Loading, Error & Offline UX

Because the app depends on online question delivery, network states are first-class UX states.

Design states for:

- Loading questions
- Provider/API delay
- Network unavailable
- Empty result
- Temporary provider failure
- Retry
- Quiz unavailable
- Ad unavailable
- General unexpected error

Messages should be:

- Clear
- Short
- Non-technical
- Actionable where possible

Example direction:

**Quiz unavailable**  
“We couldn't load new questions right now.”

[ TRY AGAIN ]

Avoid exposing raw technical errors to normal users.

## 18. Navigation

Navigation should be simple and predictable.

We will decide during UX architecture whether the final product needs:

- Bottom navigation
- Top navigation
- Contextual back buttons
- Profile/settings access
- Home/category/game/result flow

Navigation must not compete with the quiz itself.

## 19. Component Design System

Reusable components to define:

- Primary button
- Secondary button
- Text/button variants
- Cards
- Category cards
- Daily Challenge card
- Answer options
- Progress bars
- Timer
- Score display
- Streak indicator
- Achievement badge
- Dialogs
- Snackbars/toasts
- Navigation
- Tabs if needed
- Loading indicators
- Error states
- Empty states
- Ad containers

Each component should have documented:

- Size
- Spacing
- Typography
- Radius
- Shadow/elevation
- Colour
- Interaction states
- Accessibility behaviour

## 20. Brand & Visual Identity

Eventually define:

- Logo treatment
- App icon
- Brand colour system
- Typography
- Icon style
- Illustration style
- Photography/image treatment if used
- Card style
- Shadow/elevation
- Corner radius
- Spacing scale
- Motion/animation language

The brand should communicate:

**Knowledge + challenge + energy + trust + modern technology.**

## 21. Micro-interactions & Motion

Animations should be:

- Fast
- Purposeful
- Subtle
- Satisfying
- Performance-conscious

Possible interactions:

- Button press feedback
- Answer selection
- Correct/incorrect feedback
- Progress movement
- Score reveal
- Streak celebration
- Achievement unlock
- Result completion
- Screen transitions

Avoid animation that delays the user or makes repeated quizzes tiring.

## 22. Accessibility

Accessibility is part of the design system, not an afterthought.

Requirements:

- Adequate text contrast
- Comfortable touch targets
- Readable font sizes
- Clear focus/selected states where relevant
- Do not rely on colour alone
- Clear error messages
- Avoid overly small interactive elements
- Avoid excessive motion
- Maintain usable layouts on smaller screens

## 23. UX Architecture Workflow

### Phase 1 — UX Architecture
Map the complete user journey.

Define:

- Entry
- Home
- Category
- Configuration
- Ad transition
- Quiz
- Answer feedback
- Results
- Replay/next category
- Streaks
- Profile/statistics
- Settings
- Error/retry paths

### Phase 2 — Visual Identity
Lock:

- Blue
- White/near-white
- Navy
- Accent colour
- Typography
- Icon style
- Card style
- Spacing
- Shadows
- Corner radius
- Component rules

### Phase 3 — Wireframes
Design screens without depending heavily on final colours.

Focus on:

- Hierarchy
- Flow
- Information placement
- Navigation
- Usability

### Phase 4 — High-Fidelity Design
Apply the final design system.

### Phase 5 — Interactive Prototype
Connect the screens into a tappable prototype.

Target workflow:

**Design → prototype → test on Oppo A56 → refine**

### Phase 6 — Implementation
Only after the design is approved:

**Figma/design specification → React/Vite → Capacitor → APK**

### Phase 7 — Regression Testing
After implementation, verify that the redesign did not break:

- Online questions
- Question history/anti-repetition behaviour
- Timer
- Scoring
- Streaks
- AdMob banner
- AdMob interstitial
- Rewarded ads
- App Open ads
- Loading/error states
- Release updates/install behaviour

## 24. Figma Workflow

Figma is the planned design/prototyping environment.

Target workflow:

**Figma design → interactive prototype → phone testing → refinement → React implementation → APK testing**

Because development is phone-only, the design workflow must remain practical on mobile.

Before relying on any specific Figma mobile editing capability, verify the current capabilities at the time we begin.

## 25. Design Rules

The product design philosophy is:

1. **Clean** — no unnecessary elements.
2. **Fast** — the user immediately understands what to do.
3. **Sharp** — strong typography and crisp components.
4. **Playful** — it is still a game.
5. **Premium** — it should not look like a beginner project.
6. **Accessible** — readable, high-contrast, comfortable and understandable.
7. **Consistent** — every screen belongs to the same application.
8. **Scalable** — new categories and features must fit without redesigning everything.

## 26. Implementation Safety Rule

**Do not begin major UI/UX code changes while the current functional foundation is still being stabilized.**

The current stable app is valuable.

The redesign should be developed from a known-good functional checkpoint so that visual changes can be separated from functional debugging.

The existing main `project.md` remains the source of truth for app-development status.

## 27. Current UI/UX Milestone

**Status: Planning / Blueprint Created**

Completed:

- UI/UX research
- Behance inspiration review
- Initial visual direction
- Colour direction
- UX architecture direction
- Screen inventory
- Component inventory
- Ad UX principles
- Accessibility principles
- Figma/prototype workflow
- Dedicated UI/UX project documentation

Not yet started:

- Final colour selection
- Final typography
- Wireframes
- High-fidelity screens
- Interactive prototype
- Production UI implementation

## 28. Immediate UI/UX Next Steps

When the app's remaining V1.1 categories/providers have been completed and tested:

1. Review this blueprint.
2. Map the complete user journey.
3. Create the first wireframes.
4. Start with the highest-impact screens:
   - Home
   - Category selection
   - Quiz
   - Results
5. Review the visual direction.
6. Establish the reusable design system.
7. Build the remaining screens.
8. Create an interactive prototype.
9. Test the prototype on the Oppo A56.
10. Refine before touching production UI code.
11. Implement carefully in React/Vite.
12. Build an APK.
13. Perform full regression testing.

## 29. Long-Term UI/UX Goal

The finished Daily Quiz & Challenge interface should feel like a product that can grow for years.

It should support future expansion such as:

- More categories
- Bible book/chapter selection
- Science subcategories
- Africa & Nigeria content
- Current Affairs
- User accounts
- Statistics
- Achievements
- Streak systems
- Explanations/learning
- Rewards
- More game modes
- Future backend-driven personalization

The design system must therefore be built for **long-term scalability**, not just the next APK.

---

## Design North Star

> **Daily Quiz & Challenge should feel like a polished modern quiz product: clean white surfaces, sharp blue actions, dark navy hierarchy, a carefully controlled reward accent, excellent spacing, satisfying interactions, fresh content, and a gameplay experience people want to return to.**

**Design first. Code second. Test everything. Protect the stable foundation.**
