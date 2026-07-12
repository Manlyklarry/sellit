import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import { getSellingType, saveSellingType } from "../auth/onboarding";
import { useAppTheme } from "../config/theme";
import { AUTH_ROUTES } from "../navigation/routes";
import { OnboardingHeader, PrimaryAction } from "./onboarding/OnboardingUI";

const types = [
  { id: "new", icon: "archive-outline", title: "New products", text: "For businesses, wholesalers, and anyone selling brand-new inventory." },
  { id: "preowned", icon: "tshirt-crew-outline", title: "Pre-owned items", text: "For personal items you no longer need. Quick and easy for one-off listings." },
];

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
        <Text style={styles.title}>What are you selling today?</Text>
        <Text style={styles.subtitle}>Choose the type that best fits your listings to reach the right buyers.</Text>
        <View style={styles.options}>
          {types.map((type) => {
            const active = selected === type.id;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                key={type.id}
                onPress={() => selectType(type.id)}
                style={({ pressed }) => [styles.option, active && styles.optionActive, pressed && styles.pressed]}
              >
                <View style={[styles.optionIcon, active && styles.optionIconActive]}>
                  <MaterialCommunityIcons name={type.icon} size={29} color={active ? "#ffffff" : theme.muted} />
                </View>
                <View style={styles.optionCopy}>
                  <Text style={styles.optionTitle}>{type.title}</Text>
                  <Text style={styles.optionText}>{type.text}</Text>
                </View>
                <MaterialCommunityIcons name={active ? "radiobox-marked" : "radiobox-blank"} size={22} color={active ? theme.primary : theme.border} />
              </Pressable>
            );
          })}
        </View>
        <View style={styles.footer}>
          <PrimaryAction
            disabled={!selected}
            label="Create seller account"
            onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER, { onboarding: true, sellingType: selected })}
          />
        </View>
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
  optionActive: { borderColor: theme.primary, backgroundColor: theme.primarySoft },
  optionIcon: { width: 54, height: 54, borderRadius: 8, backgroundColor: theme.mutedSurface, alignItems: "center", justifyContent: "center" },
  optionIconActive: { backgroundColor: theme.primary },
  optionCopy: { flex: 1 },
  optionTitle: { color: theme.foreground, fontSize: 21, fontWeight: "800" },
  optionText: { color: theme.muted, fontSize: 14, lineHeight: 21, marginTop: 7 },
  footer: { marginTop: "auto" },
  pressed: { opacity: 0.78 },
});

export default SellingTypeScreen;
