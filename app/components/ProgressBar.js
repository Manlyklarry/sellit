import { StyleSheet, View } from "react-native";

import { useAppTheme } from "../config/theme";

function ProgressBar({ progress = 0 }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

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

const createStyles = (theme) =>
  StyleSheet.create({
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.primary,
  },
  track: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.primarySoft,
    overflow: "hidden",
  },
});

export default ProgressBar;
