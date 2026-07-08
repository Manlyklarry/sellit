import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { ThemeProvider, useAppTheme } from "./app/config/theme";
import RootNavigator from "./app/navigation/RootNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppShell />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppShell() {
  const { isDark, theme } = useAppTheme();

  return (
    <>
      <RootNavigator />
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={theme.background}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
