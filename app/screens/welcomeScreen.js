import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

import AppButton from "../components/AppButton";

function WelcomeScreen() {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo-red.png")} style={styles.logo} />
        <Text style={styles.tagline}>Sell what you don't need</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <AppButton title="Login" onPress={() => console.log("login")} />
        <AppButton
          title="Register"
          color="secondary"
          onPress={() => console.log("register")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
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
});

export default WelcomeScreen;
