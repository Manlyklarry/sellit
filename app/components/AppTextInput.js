import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { useAppTheme } from "../config/theme";

function AppTextInput({ icon, style, width = "100%", ...otherProps }) {
  const { theme } = useAppTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = otherProps.secureTextEntry;
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.container,
        { width },
        otherProps.multiline && styles.multilineContainer,
        style,
      ]}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          color={theme.muted}
          size={22}
          style={styles.icon}
        />
      ) : null}
      <TextInput
        placeholderTextColor={theme.muted}
        style={[
          styles.textInput,
          otherProps.multiline && styles.multilineTextInput,
        ]}
        {...otherProps}
        secureTextEntry={isPassword && !passwordVisible}
      />
      {isPassword ? (
        <Pressable
          accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
          accessibilityRole="button"
          hitSlop={10}
          onPress={() => setPasswordVisible((visible) => !visible)}
          style={styles.passwordToggle}
        >
          <MaterialCommunityIcons
            name={passwordVisible ? "eye-off" : "eye"}
            color={theme.muted}
            size={22}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
  container: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: theme.input,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  icon: {
    marginRight: 10,
  },
  multilineContainer: {
    alignItems: "flex-start",
    paddingVertical: 12,
    minHeight: 120,
  },
  multilineTextInput: {
    minHeight: 96,
  },
  passwordToggle: {
    marginLeft: 10,
    padding: 4,
  },
  textInput: {
    flex: 1,
    color: theme.foreground,
    fontSize: 16,
    minWidth: 0,
  },
});

export default AppTextInput;
