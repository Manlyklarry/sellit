# Project Memory

## Stack

- Expo SDK 54 (`expo` `~54.0.34`)
- React 19.1 and React Native 0.81.5
- Expo SDK 54 docs were checked at
  `https://docs.expo.dev/versions/v54.0.0/`; Expo 54 targets React Native
  0.81, React 19.1.0, and Node 20.19.x minimum.
- Entry point: `index.js`; root component: `App.js`
- Form stack: `formik` for form state and `yup` for validation.
- `lodash` is a direct dependency because Formik imports lodash submodules that
  Metro needs to resolve reliably.

## App Structure

- App source is under `app/`.
- Static images are under `app/assets/`.
- Listing images are under `app/assets/listings/`.
- Profile images are under `app/assets/profiles/`.
- Screens are under `app/screens/`.
- Shared components are under `app/components/`.
- Form components are under `app/components/forms/`.
- Shared color constants live in `app/config/colors.js`.
- Shared currency formatting lives in `app/utils/currency.js`.
- Barrel exports exist at `app/screens/index.js`, `app/components/index.js`,
  and `app/components/forms/index.js` to help VS Code suggest component imports.
- `App.js` wraps the app in `GestureHandlerRootView` and `SafeAreaProvider`.
  It currently renders `ListingEditScreen` while listing creation is being
  built out.
- `WelcomeScreen` lives at `app/screens/WelcomeScreen.js`.
- `ViewImageScreen` lives at `app/screens/ViewImageScreen.js`.
- `ListingEditScreen` is the add-new-listing form screen.
- `ListingEditScreen` uses `FormImagePicker`, captures selected image URIs,
  shows a live map preview via `LocationPicker`, reverse-geocodes the current
  location into a readable address, and attaches address plus coordinates to
  submitted listings when location permission is granted.
- `LoginScreen` and `RegisterScreen` exist and use Formik/Yup validation.

## UI Decisions

- Use `SafeAreaProvider` at the app root and `SafeAreaView` from
  `react-native-safe-area-context` for screen-level notch and status-bar insets.
- Do not use the deprecated `SafeAreaView` exported by `react-native`.
- Use `app/config/colors.js` for repeated app colors instead of hard-coded
  color strings, except for one-off category swatches or local UI accents.
- Use Ghana cedis throughout the app for all prices and currency displays.
  Display the currency text as `Ghc` directly, without parentheses, and route
  shared price formatting through `app/utils/currency.js`.
- For new touchable controls, prefer `Pressable` unless a course lesson
  specifically requires older Touchable APIs.
- Use chevrons on rows that imply navigation or opening detail screens.
  Current examples: account profile row, account menu rows, messages, seller
  row, and unselected category picker rows.
- Long text should be constrained with `numberOfLines`, `ellipsizeMode="tail"`,
  and `minWidth: 0` on flex text containers where needed.
- `ListItem` supports `showChevron`, `rightText`, `showBadge`,
  `titleNumberOfLines`, and `subTitleNumberOfLines`.
- `Card` truncates long listing titles and subtitles.
- `AppTextInput` supports a dynamic `width` prop. `AppFormField` passes `width`
  directly to `AppTextInput`.
- `AppPicker` is a custom modal picker. `PickerItem` is the category picker row
  component and handles selected state, chevrons, icons, and long text.
- `AccountScreen` doubles as the current messages preview: it has profile,
  menu, message header, conversation count, unread dots, timestamps, empty
  state, swipe-to-delete, and pull-to-refresh.
- Pull-to-refresh is implemented on user-data lists where useful:
  `ListingsScreen.js` listings and `AccountScreen.js` messages. It is not used
  on the static account menu or picker modal list.
- `ListingsScreen.js` loads listings from `GET /api/listings`, caches the
  latest successful response in `AsyncStorage`, and falls back to that cached
  feed when the API is unreachable. The local sample listings remain only as a
  first-run fallback when neither the backend nor a cache is available.

## Forms

- Use `AppForm`, `AppFormField`, `AppFormPicker`, `ErrorMessage`, and
  `SubmitButton` from `app/components/forms/` for Formik/Yup forms.
- Validation messages should be field-specific and shown only when fields are
  touched or the form is submitted.
- `LoginScreen` validates email and password.
- `RegisterScreen` validates name, email, and password.
- `ListingEditScreen` validates title, price, category, and description. The
  price input placeholder is `Price Ghc`.
- `ListingEditScreen` also validates at least one listing photo and allows up
  to six photos.
- Listing submissions post multipart form data through `app/api/listings.js`.
  The backend accepts up to six image files, validates positive prices and
  category shape before creating records, and deletes already-written upload
  files when validation fails.
- The backend serves uploaded listing images from `/uploads/...` and exposes
  `GET /api/listings` for the mobile feed. Mobile listing reads normalize those
  image paths to absolute React Native `{ uri }` image sources before caching.

## Assets and Sample Data

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

## VS Code and Imports

- `jsconfig.json` was removed because it caused repeated editor/module
  resolution confusion.
- Keep imports Metro-safe. Prefer relative imports generated by VS Code.
- `.vscode/settings.json` enables auto-import suggestions, makes Tab accept
  snippets/completions, and prefers relative module specifiers.
- A workspace snippet exists at `.vscode/react-native.code-snippets`.
  Typing `rnfc` in a JS/JSX file and pressing Tab expands a React Native
  function component.
- If auto-imports or snippets do not update immediately, run
  `Developer: Reload Window` in VS Code.

## Development

- API client decision: keep the current lightweight `fetch`-based API layer for
  the small auth surface. Switch to `apisauce` once the backend grows beyond
  auth into more features such as listings, image uploads, messages, profiles,
  saved listings, categories, or location/search APIs, so response handling,
  base URL config, timeouts, headers, transforms, and normalized errors stay
  centralized.
- Better Auth uses a dynamic `trustedOrigins` function in `backend/src/auth.js`
  so Expo dev origins on private LAN IPs with ports `8081` or `19006` remain
  trusted when the Metro host IP changes. Keep this in sync with backend CORS
  private-network dev origin handling.
- Start Android development with `npm run android` or manually with
  `npx expo start` when the user wants manual control.
- Before starting any Expo or Metro process, check whether an Expo dev server
  is already running. If one is already running, reuse it and do not start a
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
- Verify code changes with `npx expo export` unless the task specifically needs
  device runtime validation.
- Current local Node observed during the July 2026 refactor was v22.17.0.
  Expo SDK 54 requires at least Node 20.19.x; if Expo tooling behaves oddly,
  re-check under the project-standard Node 20 line before deeper debugging.
- When making commits from this machine for this project, push them to
  `origin/main` after the commit unless the user says not to push.
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
  Android phone through Expo Go when a lesson requires runtime behavior.
  Diagnose Metro, network, or tooling failures before continuing with the
  lesson.
- Record material course-to-current-tooling substitutions here so later lessons
  use the same context and conventions.
