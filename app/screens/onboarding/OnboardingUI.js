import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../../config/theme";

export function OnboardingHeader({ currentStep, onBack, onSkip, showBack = true, totalSteps = 3 }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View>
      <View style={styles.header}>
      {showBack ? (
        <Pressable accessibilityLabel="Go back" onPress={onBack} hitSlop={12} style={styles.iconButton}>
          <MaterialCommunityIcons name="arrow-left" size={27} color={theme.primary} />
        </Pressable>
      ) : <View style={styles.iconButton} />}
      <Text style={styles.brand}>Sell on Sellit</Text>
      {onSkip ? (
        <Pressable accessibilityRole="button" onPress={onSkip} hitSlop={12} style={styles.skipButton}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      ) : <View style={styles.skipButton} />}
      </View>
      {currentStep ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
      ) : null}
    </View>
  );
}

export function PrimaryAction({ disabled = false, label, onPress, outlined = false }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        outlined && styles.actionOutlined,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.actionText, outlined && styles.actionTextOutlined]}>{label}</Text>
      {!outlined && <MaterialCommunityIcons name="arrow-right" size={24} color="#ffffff" />}
    </Pressable>
  );
}

const createStyles = (theme) => StyleSheet.create({
  header: { height: 62, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconButton: { width: 44, height: 44, alignItems: "flex-start", justifyContent: "center" },
  skipButton: { width: 44, height: 44, alignItems: "flex-end", justifyContent: "center" },
  brand: { color: theme.primary, fontSize: 20, fontWeight: "900" },
  skip: { color: theme.muted, fontSize: 15, fontWeight: "700" },
  progressTrack: { height: 3, backgroundColor: theme.mutedSurface },
  progressFill: { height: 3, backgroundColor: theme.primary },
  action: { height: 58, borderRadius: 8, paddingHorizontal: 22, marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: theme.primary },
  actionOutlined: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.primary },
  actionText: { color: "#ffffff", fontSize: 17, fontWeight: "900" },
  actionTextOutlined: { color: theme.primary },
  disabled: { opacity: 0.42 },
  pressed: { opacity: 0.78 },
});
