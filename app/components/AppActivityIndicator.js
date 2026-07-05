import LottieView from "lottie-react-native";
import { StyleSheet, Text, View } from "react-native";

import colors from "../config/colors";

function AppActivityIndicator({
  compact = false,
  message = "Refreshing...",
  size = 74,
  style,
}) {
  return (
    <View style={[styles.container, compact && styles.compact, style]}>
      <LottieView
        autoPlay
        loop
        source={require("../assets/animations/loading.json")}
        style={{ width: size, height: size }}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  compact: {
    paddingVertical: 4,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  message: {
    color: colors.medium,
    fontSize: 13,
    fontWeight: "700",
    marginTop: -6,
  },
});

export default AppActivityIndicator;
