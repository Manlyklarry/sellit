import { Pressable, StyleSheet, Text } from "react-native";

import colors from "../config/colors";
import { useAppTheme } from "../config/theme";

function AppButton({ color = "primary", disabled = false, onPress, title }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme[color] || colors[color] },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: theme.mode === "dark" ? 0.22 : 0.14,
    shadowRadius: 14,
    elevation: 3,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});

export default AppButton;
