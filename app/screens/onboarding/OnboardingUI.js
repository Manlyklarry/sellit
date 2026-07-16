import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { MOTION } from "../../config/motion";
import { useAppTheme } from "../../config/theme";
import { triggerLightImpact } from "../../utils/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function OnboardingHeader({ currentStep, onBack, onSkip, showBack = true, totalSteps = 3 }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(currentStep ? currentStep / totalSteps : 0, {
      duration: MOTION.duration.standard,
      reduceMotion: ReduceMotion.System,
    });
  }, [currentStep, progress, totalSteps]);

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

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
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      ) : null}
    </View>
  );
}

export function PrimaryAction({ disabled = false, label, onPress, outlined = false }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    triggerLightImpact();
    onPress?.();
  };

  const handlePressIn = () => {
    scale.value = withTiming(MOTION.pressScale, {
      duration: MOTION.duration.fast,
      reduceMotion: ReduceMotion.System,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      ...MOTION.spring,
      reduceMotion: ReduceMotion.System,
    });
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.action,
        outlined && styles.actionOutlined,
        disabled && styles.disabled,
        animatedStyle,
      ]}
    >
      <Text style={[styles.actionText, outlined && styles.actionTextOutlined]}>{label}</Text>
      {!outlined && <MaterialCommunityIcons name="arrow-right" size={24} color="#ffffff" />}
    </AnimatedPressable>
  );
}

const createStyles = (theme) => StyleSheet.create({
  header: { height: 62, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconButton: { width: 44, height: 44, alignItems: "flex-start", justifyContent: "center" },
  skipButton: { width: 44, height: 44, alignItems: "flex-end", justifyContent: "center" },
  brand: { color: theme.primary, fontSize: 20, fontWeight: "900" },
  skip: { color: theme.muted, fontSize: 15, fontWeight: "700" },
  progressTrack: { height: 3, overflow: "hidden", backgroundColor: theme.mutedSurface },
  progressFill: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.primary, transformOrigin: "left center" },
  action: { height: 58, borderRadius: 8, paddingHorizontal: 22, marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: theme.primary },
  actionOutlined: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.primary },
  actionText: { color: "#ffffff", fontSize: 17, fontWeight: "900" },
  actionTextOutlined: { color: theme.primary },
  disabled: { opacity: 0.42 },
});
