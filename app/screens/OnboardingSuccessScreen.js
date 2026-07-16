import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

import { MOTION } from "../config/motion";
import { useAppTheme } from "../config/theme";
import { ROOT_ROUTES, TAB_ROUTES } from "../navigation/routes";
import { triggerSuccess } from "../utils/haptics";
import { OnboardingEntrance, OnboardingFloat } from "./onboarding/OnboardingMotion";
import { PrimaryAction } from "./onboarding/OnboardingUI";

const celebrationPieces = [
  { x: -114, y: -70, rotation: -38 },
  { x: -132, y: 8, rotation: 72 },
  { x: -92, y: 86, rotation: 18 },
  { x: -28, y: -112, rotation: 42 },
  { x: 42, y: -106, rotation: -22 },
  { x: 118, y: -62, rotation: 48 },
  { x: 132, y: 18, rotation: -64 },
  { x: 88, y: 92, rotation: 24 },
];

function CelebrationPiece({ color, index, piece, reduceMotion }) {
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    progress.value = reduceMotion
      ? 1
      : withDelay(
          MOTION.stagger * index,
          withSpring(1, { ...MOTION.spring, reduceMotion: ReduceMotion.System })
        );
  }, [index, progress, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateX: piece.x * progress.value },
      { translateY: piece.y * progress.value },
      { rotate: `${piece.rotation * progress.value}deg` },
      { scale: 0.35 + progress.value * 0.65 },
    ],
  }));

  return <Animated.View style={[stylesStatic.celebrationPiece, { backgroundColor: color }, animatedStyle]} />;
}

function CelebrationBurst({ reduceMotion, theme }) {
  const colors = [theme.primary, theme.secondary, theme.accent, theme.info];

  return (
    <View pointerEvents="none" style={stylesStatic.celebration}>
      {celebrationPieces.map((piece, index) => (
        <CelebrationPiece
          color={colors[index % colors.length]}
          index={index}
          key={`${piece.x}-${piece.y}`}
          piece={piece}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}

function OnboardingSuccessScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const reduceMotion = useReducedMotion();
  const enterApp = (screen) => navigation.getParent()?.replace(ROOT_ROUTES.APP, { screen });

  useEffect(() => {
    triggerSuccess();
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.visual}>
        <Image source={require("../assets/onboarding/success-workspace.jpg")} style={styles.image} />
        <CelebrationBurst reduceMotion={reduceMotion} theme={theme} />
        <OnboardingEntrance style={styles.checkCard} variant="scale">
          <LottieView
            autoPlay={!reduceMotion}
            loop={false}
            progress={reduceMotion ? 1 : undefined}
            source={require("../assets/animations/upload-success.json")}
            style={styles.successAnimation}
          />
        </OnboardingEntrance>
        <OnboardingEntrance delay={MOTION.stagger * 2} style={[styles.badge, styles.verified]}>
          <OnboardingFloat delay={MOTION.stagger * 5} distance={4} style={styles.badgeContent}>
            <MaterialCommunityIcons name="account-check-outline" size={19} color={theme.primary} />
            <Text style={styles.badgeText}>Account created</Text>
          </OnboardingFloat>
        </OnboardingEntrance>
        <OnboardingEntrance delay={MOTION.stagger * 3} style={[styles.badge, styles.earnings]}>
          <OnboardingFloat delay={MOTION.stagger * 8} distance={5} style={styles.badgeContent}>
            <MaterialCommunityIcons name="tag-plus-outline" size={19} color={theme.secondary} />
            <Text style={styles.badgeText}>Ready to list</Text>
          </OnboardingFloat>
        </OnboardingEntrance>
      </View>
      <OnboardingEntrance delay={MOTION.stagger * 2} style={styles.copy}>
        <Text style={styles.kicker}>YOU’RE ALL SET</Text>
        <Text style={styles.title}>Ready to make your first sale?</Text>
        <Text style={styles.subtitle}>Your seller profile is ready. Create your first listing or explore your account dashboard.</Text>
      </OnboardingEntrance>
      <OnboardingEntrance delay={MOTION.stagger * 4} style={styles.actions}>
        <PrimaryAction label="List an item now" onPress={() => enterApp(TAB_ROUTES.SELL)} />
        <PrimaryAction outlined label="Explore seller dashboard" onPress={() => enterApp(TAB_ROUTES.ACCOUNT)} />
      </OnboardingEntrance>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background, padding: 20 },
  visual: { flex: 1.05, minHeight: 270, alignItems: "center", justifyContent: "center" },
  image: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%", resizeMode: "cover", borderRadius: 8, opacity: theme.mode === "dark" ? 0.18 : 0.12 },
  checkCard: { width: 150, height: 150, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: theme.card, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 22, elevation: 5 },
  successAnimation: { width: 142, height: 142 },
  badge: { position: "absolute", height: 42, borderRadius: 21, paddingHorizontal: 15, flexDirection: "row", gap: 8, alignItems: "center", backgroundColor: theme.card, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 9, elevation: 4 },
  badgeContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  verified: { left: 6, bottom: 28 },
  earnings: { right: 5, top: 24 },
  badgeText: { color: theme.foreground, fontSize: 14, fontWeight: "800" },
  copy: { alignItems: "center", paddingTop: 28 },
  kicker: { color: theme.primary, backgroundColor: theme.primarySoft, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14, fontSize: 12, fontWeight: "800" },
  title: { color: theme.foreground, fontSize: 31, lineHeight: 38, fontWeight: "900", textAlign: "center", marginTop: 18 },
  subtitle: { color: theme.muted, fontSize: 16, lineHeight: 24, textAlign: "center", marginTop: 12, maxWidth: 355 },
  actions: { marginTop: "auto", paddingTop: 22 },
});

const stylesStatic = StyleSheet.create({
  celebration: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  celebrationPiece: {
    position: "absolute",
    width: 7,
    height: 16,
    borderRadius: 2,
  },
});

export default OnboardingSuccessScreen;
