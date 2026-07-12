import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../config/theme";
import { ROOT_ROUTES, TAB_ROUTES } from "../navigation/routes";
import { PrimaryAction } from "./onboarding/OnboardingUI";

function OnboardingSuccessScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const enterApp = (screen) => navigation.getParent()?.replace(ROOT_ROUTES.APP, { screen });

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.visual}>
        <Image source={require("../assets/onboarding/success-workspace.jpg")} style={styles.image} />
        <View style={styles.checkCard}>
          <MaterialCommunityIcons name="check-circle-outline" size={78} color={theme.primary} />
        </View>
        <View style={[styles.badge, styles.verified]}>
          <MaterialCommunityIcons name="account-check-outline" size={19} color={theme.primary} />
          <Text style={styles.badgeText}>Account created</Text>
        </View>
        <View style={[styles.badge, styles.earnings]}>
          <MaterialCommunityIcons name="tag-plus-outline" size={19} color={theme.secondary} />
          <Text style={styles.badgeText}>Ready to list</Text>
        </View>
      </View>
      <View style={styles.copy}>
        <Text style={styles.kicker}>YOU’RE ALL SET</Text>
        <Text style={styles.title}>Ready to make your first sale?</Text>
        <Text style={styles.subtitle}>Your seller profile is ready. Create your first listing or explore your account dashboard.</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryAction label="List an item now" onPress={() => enterApp(TAB_ROUTES.SELL)} />
        <PrimaryAction outlined label="Explore seller dashboard" onPress={() => enterApp(TAB_ROUTES.ACCOUNT)} />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background, padding: 20 },
  visual: { flex: 1.05, minHeight: 270, alignItems: "center", justifyContent: "center" },
  image: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%", resizeMode: "cover", borderRadius: 8, opacity: theme.mode === "dark" ? 0.18 : 0.12 },
  checkCard: { width: 150, height: 150, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: theme.card, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 22, elevation: 5 },
  badge: { position: "absolute", height: 42, borderRadius: 21, paddingHorizontal: 15, flexDirection: "row", gap: 8, alignItems: "center", backgroundColor: theme.card, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 9, elevation: 4 },
  verified: { left: 6, bottom: 28 },
  earnings: { right: 5, top: 24 },
  badgeText: { color: theme.foreground, fontSize: 14, fontWeight: "800" },
  copy: { alignItems: "center", paddingTop: 28 },
  kicker: { color: theme.primary, backgroundColor: theme.primarySoft, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14, fontSize: 12, fontWeight: "800" },
  title: { color: theme.foreground, fontSize: 31, lineHeight: 38, fontWeight: "900", textAlign: "center", marginTop: 18 },
  subtitle: { color: theme.muted, fontSize: 16, lineHeight: 24, textAlign: "center", marginTop: 12, maxWidth: 355 },
  actions: { marginTop: "auto", paddingTop: 22 },
});

export default OnboardingSuccessScreen;
