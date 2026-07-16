import * as Haptics from "expo-haptics";

function ignoreUnavailableHaptics(promise) {
  promise.catch(() => {});
}

export function triggerLightImpact() {
  ignoreUnavailableHaptics(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export function triggerSelection() {
  ignoreUnavailableHaptics(Haptics.selectionAsync());
}

export function triggerSuccess() {
  ignoreUnavailableHaptics(
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  );
}
