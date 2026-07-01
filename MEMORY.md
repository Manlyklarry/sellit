# Project Memory

## Stack

- Expo SDK 54 (`expo` `~54.0.34`)
- React 19.1 and React Native 0.81.5
- Entry point: `index.js`; root component: `App.js`

## App Structure

- App source is under `app/`.
- Static images are under `app/assets/`.
- Listing images are under `app/assets/listings/`.
- Profile images are under `app/assets/profiles/`.
- Screens are under `app/screens/`.
- Shared color constants live in `app/config/colors.js`.
- `App.js` currently renders `ViewImageScreen` and wraps the app in
  `SafeAreaProvider`.
- `WelcomeScreen` lives at `app/screens/welcomeScreen.js`.
- `ViewImageScreen` lives at `app/screens/viewImageScreen.js`.

## UI Decisions

- Use `SafeAreaProvider` at the app root and `SafeAreaView` from
  `react-native-safe-area-context` for screen-level notch and status-bar
  insets.
- Do not use the deprecated `SafeAreaView` exported by `react-native`.
- The user has reached the Code with Mosh Touchables lesson. For course
  compatibility, recognize `TouchableOpacity`, `TouchableHighlight`, and
  `TouchableWithoutFeedback`, but prefer modern `Pressable` for new interactive
  controls unless the lesson specifically needs an older Touchable API.
- Use `app/config/colors.js` for repeated app colors instead of hard-coded
  color strings.
- `WelcomeScreen` uses `background.jpg`, `logo-red.png`, and the tagline
  `Sell what you don't need`.
- `ViewImageScreen` uses `chair.jpg`, a black background, safe-area-aware top
  actions, and `resizeMode="contain"`.
- `ListingDetailsScreen` currently uses
  `app/assets/listings/chair-laundry-basket.png` for the chair/laundry basket
  listing image.
- The chair/laundry basket listing owner is `MANLYKLARRY`, with profile image
  `app/assets/profiles/larry.jpeg`.
- Available listing sample assets:
  `chair-laundry-basket.png`, `red-bicycle.png`, `gray-sofa.png`,
  `desk-lamp-side-table.png`, `kente-cloth.png`, `cocoa-beans.png`,
  `yam-tubers.png`, `leather-sandals.png`, `charcoal-stove.png`, and
  `plantains.png`.

## Development

- Start Android development with `npm run android`.
- Before starting any Expo or Metro process, check whether an Expo dev server is
  already running. If one is already running, reuse it and do not start a
  duplicate server.
- Treat a failed `http://127.0.0.1:8081/status` check as inconclusive. Check
  existing Expo/Node processes and ports, and ask before launching a new Expo
  terminal unless the user explicitly requests it.
- To refresh connected Expo Go clients, use the active Metro reload endpoint
  instead of starting another server.
- The emulator currently has `adb reverse tcp:8081 tcp:8081`; the real Android
  phone may be connected over Wi-Fi through the scanned Expo QR code and will
  not necessarily appear in `adb devices`.
- The user often starts Expo manually with `npx expo start`. The Expo server URL
  can change between sessions, so discover the active server each time instead
  of assuming a fixed `exp://...` address.
- Make runtime checks visible here. Only start a new Expo server when no usable
  existing server is running or when the user explicitly asks for a new server.
- Use the `Pixel_7` Android emulator and Expo Go.
- Keep Metro running in a visible terminal when console output is needed.
- The `Pixel_7` AVD was repaired on 2026-06-30: it now cold-boots from the
  installed Android 36.1 Google Play 16KB system image, snapshot fast boot is
  disabled, stale QCOW/snapshot state was cleared, and Expo Go 54.0.8 was
  reinstalled after the data reset.
- After restarting `Pixel_7`, restore Metro forwarding with
  `adb -s emulator-5554 reverse tcp:8081 tcp:8081` before opening the Expo app.
- VS Code terminal persistent sessions are disabled for this workspace in
  `.vscode/settings.json` so stale terminal commands/output are not restored.
- Windows Recent screenshot/Snipping Tool/Game Bar entries were cleared on
  2026-06-30 because stale screenshot links were being restored as PowerShell
  commands when relaunching Pixel_7.
- `com.android.phone` is disabled on the Pixel_7 emulator to avoid the phone
  service ANR that was surfacing as a System UI not responding dialog after
  cold boot.

## Course Guidance

- Follow *The Ultimate React Native Series: Fundamentals* and *Advanced
  Concepts* lesson by lesson, adapting course-era tooling to this project's
  current Expo SDK 54 stack.
- Before changing code for a lesson, compare the course instruction with the  
  exact Expo SDK 54 documentation. Preserve the React Native concept being
  taught; replace only tooling or APIs that have changed.
- For every material deviation from the course, briefly explain what changed,
  why the older approach no longer fits, the problem the current approach
  solves, and what it does.
- Verify runtime changes on both the `Pixel_7` Android emulator and the real
  Android phone through Expo Go. Diagnose Metro, network, or tooling failures
  before continuing with the lesson.
- Record material course-to-current-tooling substitutions here so later
  lessons use the same context and conventions.

## Required Documentation

Read the exact Expo SDK 54 documentation before writing code:
https://docs.expo.dev/versions/v54.0.0/
