import { StyleSheet, View } from "react-native";

import colors from "../config/colors";

function ProgressBar({ progress = 0 }) {
  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          { width: `${Math.min(Math.max(progress, 0), 1) * 100}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  track: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "#f1dfe1",
    overflow: "hidden",
  },
});

export default ProgressBar;
