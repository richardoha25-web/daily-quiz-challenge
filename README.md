# Daily Quiz & Challenge

Capacitor-ready source snapshot for the Daily Quiz & Challenge app.

Android application ID: `com.richard.dailyquizchallenge`

Build flow: `npm install` → `npm run build` → `npx cap add android` → `npx cap sync android` → `cd android && ./gradlew assembleDebug`.

The app currently has reserved AdMob placement markers; real AdMob SDK integration comes after the first successful Android build. Never commit a release keystore or passwords to GitHub.
