import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../config/theme";
import { AUTH_ROUTES } from "../navigation/routes";
import { MOTION } from "../config/motion";
import { OnboardingEntrance, OnboardingFloat } from "./onboarding/OnboardingMotion";
import { OnboardingHeader, PrimaryAction } from "./onboarding/OnboardingUI";

const benefits = [
  { icon: "camera-outline", title: "Smart listing", detail: "Create polished listings fast" },
  { icon: "message-fast-outline", title: "Local buyers", detail: "Connect and sell directly" },
];

function WelcomeScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <OnboardingHeader
        currentStep={1}
        onSkip={() => navigation.navigate(AUTH_ROUTES.REGISTER, { onboarding: true })}
        showBack={false}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <OnboardingEntrance style={styles.heroWrap} variant="scale">
          <OnboardingFloat distance={3} style={styles.heroFloat}>
            <Image
              resizeMode="contain"
              source={require("../assets/onboarding/seller-hero.jpg")}
              style={styles.hero}
            />
          </OnboardingFloat>
          <View style={styles.heroLabel}>
            <View style={styles.heroLabelAccent} />
            <Text style={styles.heroLabelText}>WELCOME TO MARKET</Text>
          </View>
          <OnboardingEntrance delay={MOTION.stagger * 2} style={[styles.floatingBadge, styles.secureBadge]}>
            <OnboardingFloat delay={MOTION.stagger * 5} distance={4} style={styles.badgeContent}>
              <MaterialCommunityIcons name="check-decagram-outline" size={19} color={theme.secondary} />
              <Text style={styles.badgeText}>Trusted selling</Text>
            </OnboardingFloat>
          </OnboardingEntrance>
          <OnboardingEntrance delay={MOTION.stagger * 3} style={[styles.floatingBadge, styles.fastBadge]}>
            <OnboardingFloat delay={MOTION.stagger * 8} distance={5} style={styles.badgeContent}>
              <MaterialCommunityIcons name="lightning-bolt-outline" size={19} color={theme.primary} />
              <Text style={styles.badgeText}>List in minutes</Text>
            </OnboardingFloat>
          </OnboardingEntrance>
        </OnboardingEntrance>

        <OnboardingEntrance delay={MOTION.stagger}>
          <Text style={styles.title}>Start your selling journey</Text>
          <Text style={styles.subtitle}>
            Turn new inventory or pre-owned treasures into cash effortlessly.
          </Text>
        </OnboardingEntrance>

        <View style={styles.benefits}>
          {benefits.map((benefit, index) => (
            <OnboardingEntrance
              delay={MOTION.stagger * (index + 2)}
              key={benefit.title}
              style={styles.benefit}
            >
              <MaterialCommunityIcons name={benefit.icon} size={25} color={theme.primary} />
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitDetail}>{benefit.detail}</Text>
            </OnboardingEntrance>
          ))}
        </View>

        <OnboardingEntrance delay={MOTION.stagger * 4}>
          <PrimaryAction
            label="Get started"
            onPress={() => navigation.navigate(AUTH_ROUTES.HOW_IT_WORKS)}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN)}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>Already selling? </Text>
            <Text style={styles.loginAction}>Log in</Text>
          </Pressable>
        </OnboardingEntrance>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingTop: 14, paddingBottom: 24 },
  heroWrap: {
    width: "100%",
    height: 225,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  heroFloat: { width: "94%", alignSelf: "center", alignItems: "center" },
  hero: {
    width: "100%",
    aspectRatio: 512 / 279,
    alignSelf: "center",
    borderRadius: 12,
  },
  heroLabel: {
    position: "absolute",
    top: 0,
    left: -20,
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 11,
    borderRadius: 6,
    backgroundColor: theme.card,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 2,
  },
  heroLabelAccent: { width: 3, height: 18, borderRadius: 2, backgroundColor: theme.primary },
  heroLabelText: { color: theme.foreground, fontSize: 13, fontWeight: "900" },
  floatingBadge: {
    position: "absolute", flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, height: 42, borderRadius: 21, backgroundColor: theme.card,
    shadowColor: theme.shadow, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12,
    shadowRadius: 10, elevation: 3,
  },
  badgeContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  secureBadge: { right: 0, top: 56 },
  fastBadge: { left: 0, bottom: 0 },
  badgeText: { color: theme.foreground, fontSize: 14, fontWeight: "700" },
  title: { color: theme.foreground, fontSize: 32, lineHeight: 38, fontWeight: "900", textAlign: "center" },
  subtitle: { color: theme.muted, fontSize: 17, lineHeight: 25, textAlign: "center", marginTop: 12, marginHorizontal: 16 },
  benefits: { flexDirection: "row", gap: 12, marginTop: 28, marginBottom: 14 },
  benefit: { flex: 1, minHeight: 126, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card },
  benefitTitle: { color: theme.foreground, fontSize: 15, fontWeight: "800", marginTop: 12 },
  benefitDetail: { color: theme.muted, fontSize: 12, lineHeight: 17, marginTop: 5 },
  loginLink: { flexDirection: "row", justifyContent: "center", padding: 10 },
  loginText: { color: theme.muted, fontWeight: "600" },
  loginAction: { color: theme.primary, fontWeight: "800" },
});

export default WelcomeScreen;
