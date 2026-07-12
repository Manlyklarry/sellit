import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../config/theme";
import { AUTH_ROUTES } from "../navigation/routes";
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
        <View style={styles.heroWrap}>
          <Image source={require("../assets/onboarding/seller-hero.jpg")} style={styles.hero} />
          <View style={[styles.floatingBadge, styles.secureBadge]}>
            <MaterialCommunityIcons name="check-decagram-outline" size={19} color={theme.secondary} />
            <Text style={styles.badgeText}>Trusted selling</Text>
          </View>
          <View style={[styles.floatingBadge, styles.fastBadge]}>
            <MaterialCommunityIcons name="lightning-bolt-outline" size={19} color={theme.primary} />
            <Text style={styles.badgeText}>List in minutes</Text>
          </View>
        </View>

        <Text style={styles.title}>Start your selling journey</Text>
        <Text style={styles.subtitle}>
          Turn new inventory or pre-owned treasures into cash effortlessly.
        </Text>

        <View style={styles.benefits}>
          {benefits.map((benefit) => (
            <View key={benefit.title} style={styles.benefit}>
              <MaterialCommunityIcons name={benefit.icon} size={25} color={theme.primary} />
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitDetail}>{benefit.detail}</Text>
            </View>
          ))}
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingTop: 14, paddingBottom: 24 },
  heroWrap: { height: 250, marginBottom: 32, justifyContent: "center" },
  hero: { width: "82%", height: 220, alignSelf: "center", borderRadius: 16, resizeMode: "cover" },
  floatingBadge: {
    position: "absolute", flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, height: 42, borderRadius: 21, backgroundColor: theme.card,
    shadowColor: theme.shadow, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12,
    shadowRadius: 10, elevation: 3,
  },
  secureBadge: { right: 0, top: 5 },
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
