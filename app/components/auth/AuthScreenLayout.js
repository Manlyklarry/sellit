import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ThemeToggle from "../ThemeToggle";
import { useAppTheme } from "../../config/theme";

function AuthScreenLayout({ children, title }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.screen}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.themeRow}>
            <ThemeToggle compact />
          </View>
          <Image source={require("../../assets/logo-red.png")} style={styles.logo} />
          <Text style={styles.heading}>{title}</Text>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  content: { flexGrow: 1, padding: 20, paddingBottom: 36 },
  themeRow: { alignItems: "flex-end" },
  logo: { width: 90, height: 90, alignSelf: "center", marginTop: 28, marginBottom: 18 },
  heading: { color: theme.foreground, fontSize: 30, fontWeight: "900", marginBottom: 24, textAlign: "center" },
});

export default AuthScreenLayout;
