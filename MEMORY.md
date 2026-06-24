# Project Memory

## Stack

- Expo SDK 54 (`expo` `~54.0.34`)
- React 19.1 and React Native 0.81.5
- Entry point: `index.js`; main screen: `App.js`

## UI Decisions

- Use `SafeAreaProvider` and `SafeAreaView` from
  `react-native-safe-area-context` for notch and status-bar insets.
- Do not use the deprecated `SafeAreaView` exported by `react-native`.
- The main text currently logs `Text Pressed` through its `onPress` handler.

## Development

- Start Android development with `npm run android`.
- Use the `Pixel_7` Android emulator and Expo Go.
- Keep Metro running in a visible terminal when console output is needed.

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
