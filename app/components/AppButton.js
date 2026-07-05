import { Pressable, StyleSheet, Text } from "react-native";

import colors from "../config/colors";

function AppButton({ color = "primary", disabled = false, onPress, title }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors[color] },
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

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default AppButton;
