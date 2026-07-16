# Project Memory

## Stack

- Expo SDK 54 (`expo` `~54.0.36`)
- React 19.1 and React Native 0.81.5
- Expo SDK 54 docs were checked at
  `https://docs.expo.dev/versions/v54.0.0/`; Expo 54 targets React Native
  0.81, React 19.1.0, and Node 20.19.x minimum.
- Entry point: `index.js`; root component: `App.js`
- Form stack: `formik` for form state and `yup` for validation.
- Push notifications use `expo-notifications`.
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
- `App.js` wraps the app in `GestureHandlerRootView`, `ThemeProvider`, and
  `SafeAreaProvider`; `RootNavigator` selects the authenticated or anonymous
  flow after verifying the Better Auth server session.
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
- Do not label user-facing items as test listings or with placeholder/test
  wording. Use real item names for sample or seeded content, and normalize
  accidental placeholder titles before display.
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
- `ListingEditScreen` labels the listing title field as `Name of item` in the
  form and validation copy. It validates name of item, price, category, and
  description. The price input placeholder is `Price Ghc`.
- `ListingEditScreen` also validates at least one listing photo and allows up
  to six photos.
- Listing submissions post multipart form data through `app/api/listings.js`.
  The backend accepts up to six image files, validates positive prices and
  category shape before creating records, and deletes already-written upload
  files when validation fails.
- The backend serves uploaded listing images from `/uploads/...` and exposes
  `GET /api/listings` for the mobile feed. Mobile listing reads normalize those
  image paths to absolute React Native `{ uri }` image sources before caching.
- Listing details can delete backend-backed listings. The mobile app calls
  `DELETE /api/listings/:id`, prunes the deleted item from the cached feed, and
  returns to `ListingsScreen` with the item removed from local state.
- Push notifications use `expo-notifications`. Notification permission is an
  explicit opt-in from the Account screen; the token is registered with
  `POST /api/push-tokens` and removed on logout or opt-out. Expo SDK 54 remote push
  notifications require a development or release build for full device testing;
  Expo Go is not enough for Android remote push behavior.
- New listing submissions derive ownership exclusively from the Better Auth
  session. Public listing/user responses never expose email addresses. The
  backend notifies opted-in devices and supports authenticated, bounded,
  duplicate-protected inquiries.

## July 2026 Stabilization Baseline

- Public identity and ownership use user IDs, display names, and usernames;
  seller/buyer emails are not copied into marketplace records or public JSON.
- Protected listing, profile, inquiry, and push-token operations derive the
  requester from the Better Auth cookie. Client-supplied user objects are never
  authorization evidence.
- The app verifies the Better Auth session during startup. Any API `401` clears
  cached identity and returns navigation to the anonymous flow.
- Password minimum length is eight on both client and server.
- Production CORS accepts configured origins only. Private-LAN Expo origins are
  development-only.
- Helmet security headers, bounded JSON bodies, request IDs, API/auth/upload/
  inquiry rate limits, strict text/location/price validation, self-inquiry
  protection, and a one-minute duplicate-inquiry cooldown are enabled.
- Image uploads accept JPEG, PNG, or WebP only and verify file signatures after
  upload. The client preserves ImagePicker filename/MIME metadata for listing
  images. Local disk remains a development storage strategy only.
- Listings have currency and lifecycle status, cursor pagination, useful
  database indexes, server-side search/category filters, and a versioned
  15-minute offline cache. Location is collected on explicit request using
  balanced accuracy instead of continuous tracking.
- EAS profiles use the SDK 54 build images. On iOS, `sdk-54` currently maps to
  Xcode 26 and is required to compile the native Liquid Glass path. Development,
  simulator, preview, and production profiles live in `eas.json`.
- CI installs clean dependencies, deploys migrations to PostgreSQL, runs lint,
  backend integration tests, Expo Doctor, and exports all platform bundles.
- The canonical Prisma client is generated into `backend/node_modules`; the old
  duplicate checked-in generated TypeScript client was removed.

## Production Launch Gates

These items intentionally require production accounts, infrastructure, policy
decisions, or real devices. Do not mark the app production-ready until every
applicable item is completed and verified.

### Next session reminder — July 17, 2026

- When this project is resumed with `codex resume --last`, remind the user
  immediately that the next task is to continue live push-notification testing
  on two real devices.
- Do not mark push notifications verified based only on simulators, Expo Go,
  API responses, or successful token registration. Use development or preview
  builds installed on both physical devices.
- On device A, sign in as seller A and enable notifications from Account. On
  device B, sign in as buyer B and enable notifications. Confirm each token is
  registered to the correct authenticated user.
- Create a listing on device A and confirm device B receives the new-listing
  notification while device A does not receive its own listing notification.
- Open the listing on device B, send an inquiry, and confirm device A receives
  the inquiry notification. Confirm self-inquiries and immediate duplicate
  inquiries remain blocked.
- Test foreground, background, and terminated-app delivery; notification tap
  behavior; opt-out and re-enable; logout token removal; app relaunch; and a
  denied notification permission on at least one device.
- Record device models, OS versions, build profile/build ID, user accounts used,
  timestamps, observed Expo ticket/receipt errors, and pass/fail results here.
- If delivery fails, check the real EAS project ID, physical-device support,
  Apple/Google push credentials, production API URL reachability, stored push
  token ownership, backend logs/request IDs, Expo push tickets, and receipts.

### Known limitations still open

- The real EAS project ID and environment-specific API URLs are not configured
  in the repository. Push registration intentionally reports an error until a
  valid project ID is supplied.
- Signed App Store and Play Store EAS builds and submissions have not yet been
  completed. Store credentials, listings, privacy disclosures, screenshots,
  support URLs, content ratings, and review notes remain required.
- Native Liquid Glass still needs visual and interaction testing on a physical
  iOS 26+ device. Older iOS and Android fallback behavior also needs real-device
  verification.
- Click-level web browser automation was unavailable during the latest test
  pass. The web entry, JavaScript bundle, lint, and production export passed,
  but interactive browser flows still need end-to-end coverage.
- Moderate dependency advisories remain in Expo and Prisma development/build
  tooling. Their current automated fixes require breaking Expo/Prisma version
  changes; do not run `npm audit fix --force`.
- Durable object storage/CDN image processing, shared distributed rate-limit
  storage, a background job queue, complete Expo push-receipt polling, email
  verification/password reset/account deletion, monitoring, structured log
  shipping, backups/restore drills, moderation, and expanded mobile end-to-end
  tests remain production launch gates.

### Identity, EAS, and stores

- Confirm `com.manlyklarry.sellit` is the permanent iOS bundle identifier and
  Android application ID before the first store record is created. Changing it
  later creates a different app.
- Run `eas init` for the correct Expo organization and configure the resulting
  real project ID as `EXPO_PUBLIC_EAS_PROJECT_ID` in every EAS environment.
- Configure development, preview, and production `EXPO_PUBLIC_API_URL` values;
  production must use a public HTTPS URL. Never ship a localhost/private-LAN URL.
- Create Apple/Google signing credentials, App Store Connect and Play Console
  records, privacy disclosures, support URLs, screenshots, content ratings,
  and review notes. Configure EAS Submit only after ownership is confirmed.
- Verify production builds on an iOS 26+ physical device for Liquid Glass and
  on older iOS/Android devices for fallbacks. Also test notification tap flows,
  cookie persistence across relaunch, camera/gallery uploads, location denial,
  offline cache, and slow/interrupted networks.

### Backend and data

- Move listing/profile files from local disk to durable object storage such as
  S3 or R2, serve resized thumbnails through a CDN, strip metadata, decode/
  re-encode images, limit dimensions/pixels, and run orphan cleanup. Database
  rows and object operations need a compensating transaction/job strategy.
- Replace in-process rate-limit storage with a shared Redis-compatible store
  before running multiple API instances. Configure `TRUST_PROXY` to the exact
  number of trusted proxy hops—never blindly trust all proxies.
- Configure strong unique `BETTER_AUTH_SECRET`, canonical HTTPS
  `BETTER_AUTH_URL`, exact `CORS_ORIGIN`, `DATABASE_URL`, push URL/timeouts, and
  `MARKET_CURRENCY_CODE` through the production secret manager. Rotate secrets
  and document the procedure.
- Add email verification, password reset, account deletion/export, session and
  device management, retention/anonymization rules, Terms, and Privacy Policy.
- Add listing edit/sold/archive UI, seller listings, saved listings, reporting,
  blocking, moderation/admin tools, bans, audit events, and abuse escalation.
- Replace synchronous push fan-out with a durable job queue. Add category/
  location notification preferences and poll Expo push receipts so stale tokens
  are removed after delivery failures, not only immediate ticket failures.
- Add production database connection-pool sizing, graceful shutdown, separate
  liveness/readiness probes, automated encrypted backups, point-in-time recovery
  where available, and regular restore drills.

### Observability and quality

- Configure structured log shipping and error monitoring (for example Sentry)
  for both mobile and backend, with release/environment tags and privacy-safe
  event payloads. Add latency, error-rate, queue, notification, storage, and DB
  dashboards plus alerts.
- Add React Native component/hook tests, accessibility checks, end-to-end flows
  on preview builds, visual regression coverage for the glass/fallback UI, and
  API contract tests. The backend integration suite is necessary but not enough.
- Gradually move shared contracts and application code to TypeScript and add a
  generated/validated API schema before the number of endpoints grows.
- Review dependency audits on every update. Do not use `npm audit fix --force`
  when it proposes breaking Expo or Prisma changes; upgrade those toolchains in
  planned, tested SDK/database batches.

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
