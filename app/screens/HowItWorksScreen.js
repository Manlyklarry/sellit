import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../config/theme";
import { AUTH_ROUTES } from "../navigation/routes";
import { OnboardingHeader, PrimaryAction } from "./onboarding/OnboardingUI";

const steps = [
  { icon: "camera-outline", title: "Snap & describe", text: "Take 3-5 clear photos and write a short, honest description." },
  { icon: "tag-outline", title: "Set your price", text: "Choose a fair price based on similar items in your area." },
  { icon: "message-processing-outline", title: "Connect & get paid", text: "Chat with interested buyers, agree on delivery, and complete the sale." },
];

function HowItWorksScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <OnboardingHeader
        currentStep={2}
        onBack={navigation.goBack}
        onSkip={() => navigation.navigate(AUTH_ROUTES.REGISTER, { onboarding: true })}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Three simple steps to sell</Text>
        <Text style={styles.subtitle}>Turn your items into cash. It’s fast, direct, and easy.</Text>
        <View style={styles.steps}>
          {steps.map((step, index) => (
            <View key={step.title} style={styles.stepRow}>
              {index < steps.length - 1 && <View style={styles.connector} />}
              <View style={[styles.stepIcon, index === 1 && styles.stepIconAlt]}>
                <MaterialCommunityIcons name={step.icon} size={28} color="#ffffff" />
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            </View>
          ))}
        </View>
        <ImageBackground source={require("../assets/onboarding/photo-tip.jpg")} style={styles.tip} imageStyle={styles.tipImage}>
          <View style={styles.tipShade} />
          <View style={styles.tipCopy}>
            <Text style={styles.tipLabel}>PRO TIP</Text>
            <Text style={styles.tipText}>Natural lighting helps buyers see every detail.</Text>
          </View>
        </ImageBackground>
        <View style={styles.dots}><View style={styles.dotActive} /><View style={styles.dot} /><View style={styles.dot} /></View>
        <PrimaryAction label="Continue" onPress={() => navigation.navigate(AUTH_ROUTES.SELLING_TYPE)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingTop: 16, paddingBottom: 28 },
  title: { color: theme.foreground, fontSize: 30, lineHeight: 37, fontWeight: "900" },
  subtitle: { color: theme.muted, fontSize: 16, lineHeight: 24, marginTop: 8, marginBottom: 24 },
  steps: { gap: 12 },
  stepRow: { minHeight: 116, borderRadius: 8, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, padding: 18, flexDirection: "row", alignItems: "flex-start", gap: 16 },
  connector: { position: "absolute", width: 2, height: 14, backgroundColor: theme.border, left: 42, bottom: -14 },
  stepIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.primary, alignItems: "center", justifyContent: "center" },
  stepIconAlt: { backgroundColor: theme.secondary },
  stepCopy: { flex: 1 },
  stepTitle: { color: theme.foreground, fontSize: 19, lineHeight: 25, fontWeight: "800" },
  stepText: { color: theme.muted, fontSize: 15, lineHeight: 22, marginTop: 5 },
  tip: { height: 150, marginTop: 24, justifyContent: "flex-end" },
  tipImage: { borderRadius: 8 },
  tipShade: { ...StyleSheet.absoluteFillObject, borderRadius: 8, backgroundColor: "rgba(0,0,0,0.24)" },
  tipCopy: { padding: 16 },
  tipLabel: { alignSelf: "flex-start", color: "#ffffff", fontSize: 11, fontWeight: "900", backgroundColor: theme.primary, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 4 },
  tipText: { color: "#ffffff", fontSize: 15, fontWeight: "700", marginTop: 8 },
  dots: { flexDirection: "row", gap: 6, alignSelf: "center", marginTop: 18 },
  dotActive: { width: 28, height: 7, borderRadius: 4, backgroundColor: theme.primary },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.border },
});

export default HowItWorksScreen;
