import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import Animated, {
  ReduceMotion,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { getSellingType, saveSellingType } from "../auth/onboarding";
import { MOTION } from "../config/motion";
import { useAppTheme } from "../config/theme";
import { AUTH_ROUTES } from "../navigation/routes";
import { triggerSelection } from "../utils/haptics";
import { OnboardingEntrance } from "./onboarding/OnboardingMotion";
import { OnboardingHeader, PrimaryAction } from "./onboarding/OnboardingUI";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const types = [
  { id: "new", icon: "archive-outline", title: "New products", text: "For businesses, wholesalers, and anyone selling brand-new inventory." },
  { id: "preowned", icon: "tshirt-crew-outline", title: "Pre-owned items", text: "For personal items you no longer need. Quick and easy for one-off listings." },
];

function SellingTypeOption({ active, index, onPress, type }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const selection = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    selection.value = withSpring(active ? 1 : 0, {
      ...MOTION.spring,
      reduceMotion: ReduceMotion.System,
    });
  }, [active, selection]);

  const optionStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selection.value,
      [0, 1],
      [theme.card, theme.primarySoft]
    ),
    borderColor: interpolateColor(
      selection.value,
      [0, 1],
      [theme.card, theme.primary]
    ),
    transform: [{ scale: 1 + selection.value * (MOTION.selectionScale - 1) }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selection.value,
      [0, 1],
      [theme.mutedSurface, theme.primary]
    ),
    transform: [
      { scale: 1 + selection.value * 0.08 },
      { rotate: `${selection.value * -4}deg` },
    ],
  }));

  return (
    <OnboardingEntrance delay={MOTION.stagger * (index + 1)}>
      <AnimatedPressable
        accessibilityRole="radio"
        accessibilityState={{ checked: active }}
        onPress={onPress}
        style={[styles.option, optionStyle]}
      >
        <Animated.View style={[styles.optionIcon, iconStyle]}>
          <MaterialCommunityIcons name={type.icon} size={29} color={active ? "#ffffff" : theme.muted} />
        </Animated.View>
        <View style={styles.optionCopy}>
          <Text style={styles.optionTitle}>{type.title}</Text>
          <Text style={styles.optionText}>{type.text}</Text>
        </View>
        <MaterialCommunityIcons name={active ? "radiobox-marked" : "radiobox-blank"} size={22} color={active ? theme.primary : theme.border} />
      </AnimatedPressable>
    </OnboardingEntrance>
  );
}

function SellingTypeScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    getSellingType().then((value) => {
      if (mounted && value) setSelected(value);
    });
    return () => { mounted = false; };
  }, []);

  const selectType = (value) => {
    if (selected !== value) triggerSelection();
    setSelected(value);
    saveSellingType(value).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <OnboardingHeader
        currentStep={3}
        onBack={navigation.goBack}
        onSkip={() => navigation.navigate(AUTH_ROUTES.REGISTER, { onboarding: true })}
      />
      <View style={styles.content}>
        <OnboardingEntrance>
          <Text style={styles.title}>What are you selling today?</Text>
          <Text style={styles.subtitle}>Choose the type that best fits your listings to reach the right buyers.</Text>
        </OnboardingEntrance>
        <View style={styles.options}>
          {types.map((type, index) => (
            <SellingTypeOption
              active={selected === type.id}
              index={index}
              key={type.id}
              onPress={() => selectType(type.id)}
              type={type}
            />
          ))}
        </View>
        <OnboardingEntrance delay={MOTION.stagger * 3} style={styles.footer}>
          <PrimaryAction
            disabled={!selected}
            label="Create seller account"
            onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER, { onboarding: true, sellingType: selected })}
          />
        </OnboardingEntrance>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  content: { flex: 1, padding: 20, paddingTop: 24 },
  title: { color: theme.foreground, fontSize: 32, lineHeight: 39, fontWeight: "900", maxWidth: 330 },
  subtitle: { color: theme.muted, fontSize: 16, lineHeight: 24, marginTop: 10, maxWidth: 355 },
  options: { marginTop: 34, gap: 16 },
  option: { minHeight: 146, flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 20, borderRadius: 8, borderWidth: 2, borderColor: "transparent", backgroundColor: theme.card },
  optionIcon: { width: 54, height: 54, borderRadius: 8, backgroundColor: theme.mutedSurface, alignItems: "center", justifyContent: "center" },
  optionCopy: { flex: 1 },
  optionTitle: { color: theme.foreground, fontSize: 21, fontWeight: "800" },
  optionText: { color: theme.muted, fontSize: 14, lineHeight: 21, marginTop: 7 },
  footer: { marginTop: "auto" },
});

export default SellingTypeScreen;
