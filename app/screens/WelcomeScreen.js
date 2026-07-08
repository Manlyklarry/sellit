import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

import AppButton from "../components/AppButton";
import ThemeToggle from "../components/ThemeToggle";
import { useAppTheme } from "../config/theme";
import { AUTH_ROUTES } from "../navigation/routes";

function WelcomeScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.themeToggle}>
        <ThemeToggle compact />
      </View>

      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo-red.png")} style={styles.logo} />
        <Text style={styles.tagline}>Sell what you don't need</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <AppButton
          title="Login"
          onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN)}
        />
        <AppButton
          title="Register"
          color="secondary"
          onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER)}
        />
      </View>
    </ImageBackground>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.overlay,
  },
  logo: {
    width: 110,
    height: 110,
  },
  logoContainer: {
    position: "absolute",
    top: 80,
    alignItems: "center",
  },
  tagline: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    paddingVertical: 20,
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  themeToggle: {
    position: "absolute",
    right: 20,
    top: 58,
  },
});

export default WelcomeScreen;
